# HTTP Requests (Requisições HTTP)

## Introdução

A classe `Illuminate\Http\Request` fornece uma maneira orientada a objetos de interagir com a requisição HTTP atual sendo manipulada por sua aplicação, bem como recuperar valores, cookies e arquivos que foram enviados com a solicitação.

## Interagindo com a requisição

### Acessando a requisição

Para obter uma instância da requisição HTTP atual via injeção de dependência, você deve tipar a classe `Illuminate\Http\Request` na <em>closure</em> da rota ou no método do controller. A instância da requisição será automaticamente injetada pelo <a href="/conceitos-de-arquitetura/service-container" target="_blank">service container</a> do Laravel:

```php
<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
 
class UserController extends Controller
{
    /**
     * Store a new user.
     */
    public function store(Request $request): RedirectResponse
    {
        $name = $request->input('name');
 
        // Store the user...
 
        return redirect('/users');
    }
}
```

Como mencionado, você também pode tipar a classe `Illuminate\Http\Request` em uma closure na definição de uma rota. O Service Container injetará automaticamente a requisição na closure quando ela for executada:

```php
use Illuminate\Http\Request;
 
Route::get('/', function (Request $request) {
    // ...
});
```

#### Injeção de dependência e parâmetros de rota

Se o método do seu controller também espera uma entrada de um parâmetro de rota, você deve listar os parâmetros de rota após suas outras dependências. Por exemplo, se sua rota for definida da seguinte forma:

```php
use App\Http\Controllers\UserController;
 
Route::put('/user/{id}', [UserController::class, 'update']);
```

Você ainda pode tipar a `Illuminate\Http\Request` e acessar o parâmetro de rota `id` definindo o método do controller da seguinte forma:

```php
<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
 
class UserController extends Controller
{
    /**
     * Update the specified user.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        // Update the user...
 
        return redirect('/users');
    }
}
```

### Caminho, host e método da requisição

A instância `Illuminate\Http\Request` fornece uma variedade de métodos para examinar a requisição HTTP recebida e estende a classe `Symfony\Component\HttpFoundation\Request`. Abaixo, discutiremos alguns dos métodos mais importantes.  

#### Obtendo o caminho da requisição

O método `path` retorna as informações do caminho da requisição. Portanto, se a requisição recebida for direcionada para `http://example.com/meu/exemplo`, o método `path` retornará `meu/exemplo`:

```php
$uri = $request->path();
```

#### Inspecionando o caminho da requisição

O método `is` permite verificar se o caminho da requisição recebida corresponde a um padrão específico. Você pode usar o caractere `*` como um caractere curinga ao utilizar este método:

```php
if ($request->is('admin/*')) {
    // ...
}
```

Utilizando o método `routeIs`, você pode determinar se a requisição recebida corresponde a uma <a href="/fundamentos/rotas#rotas-nomeadas" target="_blank">rota nomeada</a>:

```php
if ($request->routeIs('admin.*')) {
    // ...
}
```

#### Recuperando a URL da requisição

Para recuperar a URL completa da requisição recebida, você pode usar os métodos `url` ou `fullUrl`. O método `url` retornará a URL sem a string de consulta <em>query string</em>), enquanto o método `fullUrl` inclui a <em>query string</em>:

```php
$url = $request->url();
 
$urlWithQueryString = $request->fullUrl();
```

Se você deseja anexar dados de <em>query strings</em> à URL atual, pode chamar o método `fullUrlWithQuery`. Este método mescla um array fornecido de <em>query strings</em> com a <em>query string</em> atual:

```php
$request->fullUrlWithQuery(['type' => 'phone']);
```

Se você deseja obter a URL atual sem um determinado parâmetro de <em>query string</em>, pode utilizar o método `fullUrlWithoutQuery`:

```php
$request->fullUrlWithoutQuery(['type']);
```

#### Recuperando o Host da requisição

Você pode recuperar o "host" da requisição recebida através dos métodos `host`, `httpHost` e `schemeAndHttpHost`:

```php
$request->host();
$request->httpHost();
$request->schemeAndHttpHost();
```

#### Recuperando o método da requisição

O método `method` retornará o verbo HTTP da requisição. Você pode usar o método `isMethod` para verificar se o verbo HTTP corresponde a uma string específica:

```php
$method = $request->method();
 
if ($request->isMethod('post')) {
    // ...
}
```

### Cabeçalhos da requisição (Request Headers)

Você pode recuperar um cabeçalho de requisição utilizando o método `header`. Se o cabeçalho não estiver presente na requisição, `null` será retornado. No entanto, o método `header` aceita um segundo argumento opcional que será retornado se o cabeçalho não estiver presente na requisição:

```php
$value = $request->header('X-Header-Name');
 
$value = $request->header('X-Header-Name', 'default');
```

O método `hasHeader` pode ser usado para determinar se a requisição contém um determinado cabeçalho:

```php
if ($request->hasHeader('X-Header-Name')) {
    // ...
}
```

Para facilitar, o método `bearerToken` pode ser usado para recuperar um token de autorização do cabeçalho `Authorization`. Se nenhum cabeçalho estiver presente, uma string vazia será retornada:

```php
$token = $request->bearerToken();
```

### IP da requisição

O método `ip` pode ser usado para recuperar o endereço IP do cliente que fez a requisição à sua aplicação:

```php
$ipAddress = $request->ip();
```

Se você deseja recuperar um array de endereços IP, incluindo todos os endereços IP do cliente que foram encaminhados por proxies, você pode usar o método `ips`. O endereço IP do cliente "original" estará no final do array:

```php
$ipAddresses = $request->ips();
```

Em geral, os endereços IP devem ser considerados como entrada não confiável e controlada pelo usuário e serem usados apenas para fins informativos.

### Negociação de Conteúdo (Content Negotiation)

O laravel fornece vários métodos para inspecionar os tipos de conteúdo solicitados na requisição via cabeçalho `Accept`. Primeiramente, o método `getAcceptableContentTypes` retornará um array contendo todos os tipos de conteúdo aceitos pela requisição:

```php
$contentTypes = $request->getAcceptableContentTypes();
```

O método `accepts` aceita um array de tipos de conteúdo e retorna `true` se algum dos tipos de conteúdo for aceito pela requisição. Caso contrário, será retornado `false`:

```php
if ($request->accepts(['text/html', 'application/json'])) {
    // ...
}
```

Você pode usar o método `prefers` para determinar qual tipo de conteúdo, de um determinado array de tipos de conteúdo, é mais preferido pela requisição. Se nenhum dos tipos de conteúdo fornecidos for aceito pela requisição, `null` será retornado:

```php
$preferred = $request->prefers(['text/html', 'application/json']);
```

Como muitas aplicações servem apenas HTML ou JSON, você pode usar o método `expectsJson` para determinar rapidamente se a requisição espera uma resposta JSON:

```php
if ($request->expectsJson()) {
    // ...
}
```

### Requisição PSR-7

O padrão <a href="https://www.php-fig.org/psr/psr-7/" target="_blank">PSR-7</a> especifica interfaces para mensagens HTTP, incluindo requisições e respostas. Se você deseja obter uma instância de uma requisição PSR-7 em vez de uma requisição Laravel, você precisará instalar algumas bibliotecas. O Laravel usa o componente <em>Symfony HTTP Message Bridge</em> para converter requisições e respostas típicas do Laravel em implementações compatíveis com o PSR-7:

```shell
composer require symfony/psr-http-message-bridge
composer require nyholm/psr7
```

Depois de instalar essas bibliotecas, você pode obter uma requisição PSR-7 tipando a interface de requisição em sua closure de rota ou método do controller:

```php
use Psr\Http\Message\ServerRequestInterface;
 
Route::get('/', function (ServerRequestInterface $request) {
    // ...
});
```

::: tip
Se você retornar uma instância de resposta PSR-7 de uma rota ou controller, ela será automaticamente convertida de volta para uma instância de resposta Laravel e exibida pelo framework.
:::

## Entradas (Input)

### Recuperando entradas (inputs)

#### Recuperando todos os dados de entrada

Você pode recuperar todos os dados de entrada da requisição recebida como um array usando o método `all`. Este método pode ser usado independentemente se a requisição recebida ser de um formulário HTML ou de uma requisição XHR:

```php
$input = $request->all();
```

Usando o método `collect`, você pode recuperar todos os dados de entrada da requisição recebida como uma <a href="/conhecendo-mais/collections" target="_blank">coleção</a>:

```php
$input = $request->collect();
```

O método `collect` também permite que você recupere um subconjunto dos dados de entrada da requisição recebida como uma coleção:

```php
$request->collect('users')->each(function (string $user) {
    // ...
});
```

#### Recuperando Um Valor de Entrada

Utilizando alguns métodos simples, você pode acessar todas as entradas do usuário sem se preocupar com o verbo HTTP utilizado na requisição. Independentemente do verbo HTTP, o método `input` pode ser usado para recuperar a entrada do usuário:

```php
$name = $request->input('name');
```

Você pode passar um valor padrão como segundo argumento para o método `input`. Este valor será retornado se o valor de entrada solicitado não estiver presente na requisição:

```php
$name = $request->input('name', 'Sally');
```

Ao trabalhar com formulários que contêm entradas de array, utilize a notação de "ponto" para acessar os arrays:

```php
$name = $request->input('products.0.name');
 
$names = $request->input('products.*.name');
```

Você pode chamar o método `input` sem argumentos para recuperar todos os valores de entrada como um array associativo:

```php
$input = $request->input();
```

#### Recuperando Entradas vindo da Query String

Enquanto o método `input` recupera valores de todo o payload da requisição (incluindo a query string), o método `query` recuperará apenas valores da query string:

```php
$name = $request->query('name');
```

Se o valor da query string solicitado não estiver presente, o segundo argumento deste método será retornado:

```php
$name = $request->query('name', 'Helen');
```

Você pode chamar o método `query` sem argumentos para recuperar todos os valores da query string como um array associativo:

```php
$query = $request->query();
```

#### Recuperando Entradas com Valores JSON

Quando é enviado uma requisição JSON para sua aplicação, você pode acessar os dados JSON via o método `input` desde que o cabeçalho `Content-Type` da requisição esteja corretamente definido para `application/json`. Você pode até mesmo usar a sintaxe de "ponto" para recuperar valores que estão aninhados em arrays / objetos JSON:

```php
$name = $request->input('user.name');
```

#### Recuperando Entradas como Valores "Stringáveis"

Em vez de recuperar os dados de entrada da requisição como uma <em>string</em> primitiva, você pode usar o método `string` para recuperar os dados da requisição como uma instância de `Illuminate\Support\Stringable`:

```php
$name = $request->string('name')->trim();
```

#### Recuperando Entradas como Valores Inteiros

Para recuperar valores de entrada como inteiros, você pode usar o método `integer`. Este método tentará converter o valor de entrada para um inteiro. Se o valor de entrada não estiver presente ou a conversão falhar, o valor padrão que você especificar será retornado. Isso é particularmente útil para paginação ou outras entradas numéricas:

```php
$perPage = $request->integer('per_page');
```

#### Recuperando Entradas como Valores Booleanos

Ao lidar com elementos HTML como caixas de seleção, sua aplicação pode receber valores "verdadeiros" que são, na verdade, <em>strings</em>. Por exemplo, "true" ou "on". Para conveniência, você pode usar o método `boolean` para recuperar esses valores como booleanos. O método `boolean` retorna `true` para 1, "1", true, "true", "on" e "yes". Todos os outros valores retornarão `false`:

```php
$archived = $request->boolean('archived');
```

#### Recuperando Entradas como Valores de Data

Para facilitar seu trabalho, valores de entrada contendo datas/horas podem ser recuperados como instâncias de Carbon usando o método `date`. Se a requisição não contiver um valor de entrada com o nome fornecido, `null` será retornado:

```php
$birthday = $request->date('birthday');
```

Os segundo e terceiro argumentos aceitos pelo método `date` podem ser usados para especificar o formato e o fuso horário da data, respectivamente:

```php
$elapsed = $request->date('elapsed', '!H:i', 'Europe/Madrid');
```

Se o valor de entrada estiver presente, mas tiver um formato inválido, uma `InvalidArgumentException` será lançada; portanto, é recomendável que você valide a entrada antes de chamar o método `date`.

#### Recuperando Entradas como Enums

Valores de entrada que correspondem a <a href="https://www.php.net/manual/en/language.types.enumerations.php" target="_blank">enums do PHP</a> também podem ser recuperados da requisição. Se a requisição não conter um valor de entrada com o nome fornecido ou o enum não tiver um valor que corresponda ao valor de entrada, `null` será retornado. O método `enum` aceita o nome do valor de entrada e a classe do enum como argumentos:

```php
use App\Enums\Status;
 
$status = $request->enum('status', Status::class);
```

#### Recuperando Entradas através de Propriedades Dinâmicas

Você também pode acessar a entrada do usuário usando propriedades dinâmicas na instância `Illuminate\Http\Request`. Por exemplo, se um dos formulários de sua aplicação conter um campo `name`, você pode acessar o valor do campo da seguinte forma:

```php
$name = $request->name;
```

Ao usar propriedades dinâmicas, o Laravel procurará primeiro o valor do parâmetro no payload da requisição. Se não estiver presente, o Laravel procurará o campo nos parâmetros da rota correspondente.

#### Recuperando uma Parte dos Dados de Entrada

Se você precisar recuperar um subconjunto dos dados de entrada, pode usar os métodos `only` e `except`. Ambos os métodos aceitam um único array ou uma lista dinâmica de argumentos:

```php
$input = $request->only(['username', 'password']);
 
$input = $request->only('username', 'password');
 
$input = $request->except(['credit_card']);
 
$input = $request->except('credit_card');
```

::: danger
O método `only` retorna todos os pares chave/valor que você solicitar; no entanto, ele não retornará pares chave/valor que não estiverem presentes na requisição.
:::

### Presença de Dados de Entrada

Você pode usar o método `has` para determinar se um valor está presente na requisição. O método `has` retorna `true` se o valor estiver presente na requisição:

```php
if ($request->has('name')) {
    // ...
}
```

Quando fornecido um array, o método `has` determinará se todos os valores especificados estão presentes:

```php
if ($request->has(['name', 'email'])) {
    // ...
}
```

O método `hasAny` retorna `true` se algum dos valores especificados estiver presente:

```php
if ($request->hasAny(['name', 'email'])) {
    // ...
}
```

O método `whenHas` executará a closure fornecida se um valor estiver presente na requisição:

```php
$request->whenHas('name', function (string $input) {
    // ...
});
```

Uma segunda closure pode ser passada para o método `whenHas` que será executada se o valor especificado não estiver presente na requisição:

```php
$request->whenHas('name', function (string $input) {
    // The "name" value is present...
}, function () {
    // The "name" value is not present...
});
```

Se você deseja determinar se um valor está ausente na requisição ou é uma string vazia, pode usar o método `filled`:

```php
if ($request->filled('name')) {
    // ...
}
```

Se você deseja determinar se um valor está ausente na requisição ou é uma string vazia, pode usar o método `isNotFilled`:

```php
if ($request->isNotFilled('name')) {
    // ...
}
```

Quando fornecido um array, o método `isNotFilled` determinará se todos os valores especificados estão ausentes ou vazios:

```php
if ($request->isNotFilled(['name', 'email'])) {
    // ...
}
```

O método `anyFilled` retorna `true` se algum dos valores especificados não for uma string vazia:

```php
if ($request->anyFilled(['name', 'email'])) {
    // ...
}
```

O método `whenFilled` executará a closure fornecida se um valor estiver presente na requisição e não for uma string vazia:

```php
$request->whenFilled('name', function (string $input) {
    // ...
});
```

Uma segunda closure pode ser passada para o método `whenFilled` que será executada se o valor especificado não estiver "preenchido":

```php
$request->whenFilled('name', function (string $input) {
    // The "name" value is filled...
}, function () {
    // The "name" value is not filled...
});
```

Para determinar se uma chave específica está ausente na requisição, você pode usar os métodos `missing` e `whenMissing`:

```php
if ($request->missing('name')) {
    // ...
}
 
$request->whenMissing('name', function () {
    // The "name" value is missing...
}, function () {
    // The "name" value is present...
});
```

### Mesclar Dados de Entrada Adicionais

Às vezes, você pode precisar mesclar manualmente dados de entrada adicionais nos dados de entrada existentes da requisição. Para fazer isso, você pode usar o 
método `merge`. Se uma chave de entrada fornecida já existir na requisição, ela será sobrescrita pelos dados fornecidos ao método `merge`:

```php
$request->merge(['votes' => 0]);
```

O método `mergeIfMissing` pode ser usado para mesclar entradas na requisição se as chaves correspondentes ainda não existirem nos dados de entrada da requisição:

```php
$request->mergeIfMissing(['votes' => 0]);
```

### Entradas Anteriores

O Laravel permite que você mantenha a entrada de uma requisição durante a próxima requisição. Este recurso é particularmente útil para repopular formulários após a 
detecção de erros de validação. No entanto, se você estiver usando os <a href="/fundamentos/validacao" target="_blank">rescursos de validação</a> incluídos no Laravel, 
é possível que você não precise usar manualmente esses métodos entrada de sessão, pois algumas das facilidades de validação integradas do Laravel os chamarão 
automaticamente.

#### Salvando Entradas Temporárias na Sessão

O método `flash` na classe `Illuminate\Http\Request` irá armazenar os dados de entrada atuais na <a href="/fundamentos/sessoes" target="_blank">sessão</a> para que 
estejam disponíveis durante a próxima requisição do usuário à aplicação:

```php
$request->flash();
```

Você também pode usar os métodos `flashOnly` e `flashExcept` para armazenar um subconjunto dos dados da requisição na sessão. Esses métodos são úteis para manter
informações sensíveis, como senhas, fora da sessão:

```php
$request->flashOnly(['username', 'email']);
 
$request->flashExcept('password');
```

#### Salvando Entradas Temporárias e Redirecionando

Como você frequentemente desejará salvar entradas na sessão e, em seguida, redirecionar para a página anterior, você pode facilmente encadear o
salvamento de entradas em um redirecionamento usando o método `withInput`:

```php
return redirect('/form')->withInput();
 
return redirect()->route('user.create')->withInput();
 
return redirect('/form')->withInput(
    $request->except('password')
);
```

#### Recuperando Entradas Anteriores

Para recuperar entradas temporárias da requisição anterior, invoque o método `old` em uma instância de `Illuminate\Http\Request`. O método `old` recuperará
os dados de entrada anteriormente salvos da <a href="/fundamentos/sessoes" target="_blank">sessão</a>:

```php
$username = $request->old('username');
```

O Laravel também fornece um helper global `old`. Se você estiver exibindo entradas antigas em um <a href="/fundamentos/templates-blade" target="_blank">template Blade</a>, é mais conveniente usar o helper `old` para repopular o formulário. Se não houver entradas antigas para o campo fornecido, `null` será retornado:

```php
<input type="text" name="username" value="{{ old('username') }}">
```

### Cookies

#### Recuperando Cookies da Requisição

Todos os cookies criados pelo framework Laravel são criptografados e assinados com um código de autenticação, o que significa que serão considerados inválidos se tiverem sido alterados pelo cliente. Para recuperar um valor de cookie da requisição, use o método `cookie` em uma instância de `Illuminate\Http\Request`:

```php
$value = $request->cookie('name');
```

## Ajustes e Normalização das Entradas

Por padrão, o Laravel inclui os middlewares globais `Illuminate\Foundation\Http\Middleware\TrimStrings` e `Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull`. Esses middlewares irão automaticamente remover espaços em branco de todos os campos de string recebidos na requisição, bem como converter quaisquer campos de string vazios em `null`. Isso permite que você não precise se preocupar com essas questões de normalização em suas rotas e controllers.

### Desabilitando a Normalização de Entrada

Se você deseja desabilitar esse comportamento para todas as requisições, você pode remover os dois middlewares utilizando o método `remove` no arquivo `bootstrap/app.php` da sua aplicação:

```php
use Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull;
use Illuminate\Foundation\Http\Middleware\TrimStrings;
 
->withMiddleware(function (Middleware $middleware) {
    $middleware->remove([
        ConvertEmptyStringsToNull::class,
        TrimStrings::class,
    ]);
})
```

Se você deseja desativar a normalização de strings e a conversão de strings vazias para `null` para um subconjunto de requisições à sua aplicação, você pode usar os métodos `trimStrings` e `convertEmptyStringsToNull` no arquivo `bootstrap/app.php` da sua aplicação. Ambos os métodos aceitam um array de closures, que devem retornar `true` ou `false` para indicar se a normalização de entrada deve ser ignorada:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->convertEmptyStringsToNull(except: [
        fn (Request $request) => $request->is('admin/*'),
    ]);
 
    $middleware->trimStrings(except: [
        fn (Request $request) => $request->is('admin/*'),
    ]);
})
```

## Arquivos

### Recuperando Arquivos Enviados

Você pode recuperar arquivos enviados de uma instância `Illuminate\Http\Request` usando o método `file` ou usando propriedades dinâmicas. O método `file` retorna uma instância da classe `Illuminate\Http\UploadedFile`, que estende a classe `SplFileInfo` do PHP e fornece uma variedade de métodos para interagir com o arquivo:

```php
$file = $request->file('photo');
 
$file = $request->photo;
```

Você pode determinar se um arquivo está presente na requisição usando o método `hasFile`:

```php
if ($request->hasFile('photo')) {
    // ...
}
```

#### Validando Uploads Bem-Sucedidos

Além de verificar se o arquivo está presente, você pode verificar se não houve problemas ao enviar o arquivo via método `isValid`:

```php
if ($request->file('photo')->isValid()) {
    // ...
}
```

#### Caminhos e Extensões de Arquivos

A classe `UploadedFile` também contém métodos para acessar o caminho totalmente qualificado do arquivo e sua extensão. O método `extension` tentará adivinhar a extensão do arquivo com base em seu conteúdo. Essa extensão pode ser diferente da extensão fornecida pelo cliente:

```php
$path = $request->photo->path();
 
$extension = $request->photo->extension();
```

#### Outros Métodos para Arquivos

Existem vários outros métodos disponíveis em instâncias de `UploadedFile`. Consulte a <a href="https://github.com/symfony/symfony/blob/6.0/src/Symfony/Component/HttpFoundation/File/UploadedFile.php" target="_blank">documentação da API da classe</a> para obter mais informações sobre esses métodos.

### Armasenando Arquivos Enviados

Para armazenar um arquivo enviado, você normalmente usará um dos <a href="/conhecendo-mais/armazenamento-de-arquivos" target="_blank">sistemas de arquivos</a> configurados. A classe `UploadedFile` possui um método `store` que moverá um arquivo enviado para um dos seus discos, que pode ser um local no seu sistema de arquivos local ou um local de armazenamento em nuvem como o Amazon S3. 

O método `store` aceita o caminho onde o arquivo deve ser armazenado em relação ao diretório raiz configurado no sistema de arquivos. Este caminho não deve conter um nome de arquivo, pois um ID exclusivo será gerado automaticamente para servir como nome do arquivo. 

O método `store` também aceita um segundo argumento opcional para o nome do disco que deve ser usado para armazenar o arquivo. O método retornará o caminho do arquivo em relação ao diretório raiz do disco:

```php
$path = $request->photo->store('images');
 
$path = $request->photo->store('images', 's3');
```

Se você não deseja que um nome de arquivo seja gerado automaticamente, você pode usar o método `storeAs`, que aceita o caminho, o nome do arquivo e o nome do disco como argumentos:

```php
$path = $request->photo->storeAs('images', 'filename.jpg');
 
$path = $request->photo->storeAs('images', 'filename.jpg', 's3');
```

::: tip
Para obter mais informações sobre armazenamento de arquivos no Laravel, consulte a documentação completa sobre <a href="/conhecendo-mais/armazenamento-de-arquivos" target="_blank">armazenamento de arquivos</a>.
:::

## Configurando Proxies Confiáveis

Quando você executa suas aplicações atrás de um balanceador de carga que realiza a "terminação" de certificados TLS/SSL, você pode notar que sua aplicação às vezes não gera links HTTPS ao usar o helper `url`. Normalmente, isso ocorre porque sua aplicação está recebendo tráfego encaminhado pelo balanceador de carga na porta 80 e não sabe que deve gerar links seguros.

Para resolver isso, você pode habilitar o middleware `Illuminate\Http\Middleware\TrustProxies` que está incluído em sua aplicação Laravel, o que permite que você personalize rapidamente os balanceadores de carga ou proxies que devem ser confiados por sua aplicação. Seus proxies confiáveis devem ser especificados usando o método `trustProxies` no arquivo `bootstrap/app.php` de sua aplicação:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: [
        '192.168.1.1',
        '10.0.0.0/8',
    ]);
})
```

Além de configurar os proxies confiáveis, você também pode configurar os cabeçalhos de proxy que devem ser confiáveis:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(headers: Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_AWS_ELB
    );
})
```

::: tip
Se você estiver utilizando o AWS Elastic Load Balancing, o valor `headers` deve ser `Request::HEADER_X_FORWARDED_AWS_ELB`. Se seu balanceador de carga usa o cabeçalho padrão `Forwarded` do <a href="https://www.rfc-editor.org/rfc/rfc7239#section-4" target="_blank">RFC 7239</a>, o valor `headers` deve ser `Request::HEADER_FORWARDED`. Para obter mais informações sobre as constantes que podem ser usadas no valor `headers`, consulte a documentação do Symfony sobre <a href="https://symfony.com/doc/7.0/deployment/proxies.html" target="_blank">confiança em proxies</a>.
:::

#### Confiando em todos os proxies

Se você estiver utilizando a Amazon AWS ou outro provedor de balanceador de carga "em nuvem", você pode não saber os endereços IP de seus balanceadores reais. Nesse caso, você pode usar `*` para confiar em todos os proxies:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: '*');
})
```

## Configurando Hosts confiáveis

Por padrão, o Laravel responderá a todas as requisições que receber, independentemente do conteúdo do cabeçalho `Host` da requisição HTTP. Além disso, o valor do cabeçalho `Host` será usado ao gerar URLs absolutos para sua aplicação durante uma requisição web.

Normalmente, você deve configurar seu servidor web, como Nginx ou Apache, para enviar apenas requisições para sua aplicação que correspondam a um determinado nome de host. No entanto, se você não tiver a habilidade de personalizar diretamente seu servidor web e precisar instruir o Laravel a responder apenas a determinados nomes de host, você pode fazer isso ativando o middleware `Illuminate\Http\Middleware\TrustHosts` para sua aplicação.

Para habilitar o middleware `TrustHosts`, você deve utilizar o método `trustHosts` no arquivo `bootstrap/app.php` de sua aplicação. Usando o argumento `at` deste método, você pode especificar os nomes de host aos quais sua aplicação deve responder. As requisições recebidas com outros cabeçalhos `Host` serão rejeitadas:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustHosts(at: ['laravel.test']);
})
```

Por padrão, as requisições vindo de subdomínios da URL da aplicação também são automaticamente confiáveis. Se você deseja desativar esse comportamento, pode usar o argumento `subdomains`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustHosts(at: ['laravel.test'], subdomains: false);
})
```

Se você precisar acessar os arquivos de configuração ou o banco de dados de sua aplicação para determinar seus hosts confiáveis, pode fornecer uma closure ao argumento `at`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustHosts(at: fn () => config('app.trusted_hosts'));
})
```

