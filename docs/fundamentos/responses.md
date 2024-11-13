# HTTP Responses (Respostas HTTP)

## Criando Respostas

#### Strings e Arrays

Todas as rotas e controllers devem retornar uma resposta para ser enviada de volta ao navegador do usuário. O Laravel fornece várias maneiras diferentes de retornar respostas. A resposta mais básica é retornar uma string de uma rota ou controller. O framework converterá automaticamente a string em uma resposta HTTP completa:

```php
Route::get('/', function () {
    return 'Hello World';
});
```

Além de retornar strings de suas rotas e controllers, você também pode retornar arrays. O framework converterá automaticamente o array em uma resposta JSON:

```php
Route::get('/', function () {
    return [1, 2, 3];
});
```

::: tip
Você sabia que também pode retornar <a target="_blank" href="/eloquent-orm/colecoes">coleções do Eloquent</a> de suas rotas ou controllers? Elas serão automaticamente convertidas para JSON. Experimente!
:::

#### Classe de Resposta

Normalmente, você não estará retornando apenas strings ou arrays simples de suas ações de rota. Em vez disso, você estará retornando instâncias completas de `Illuminate\Http\Response` ou <a target="_blank" href="/fundamentos/views">views</a>.

Retornar uma instância completa de `Response` permite que você personalize o código de status HTTP e os cabeçalhos da resposta. Uma instância de `Response` herda da classe `Symfony\Component\HttpFoundation\Response`, que fornece uma variedade de métodos para construir respostas HTTP:

```php
Route::get('/home', function () {
    return response('Hello World', 200)
                  ->header('Content-Type', 'text/plain');
});
```

#### Coleções e Models do Eloquent

Você também pode retornar <a target="_blank" href="/eloquent-orm/introducao">models e coleções do Eloquent</a> diretamente de suas rotas e controllers. Quando você fizer isso, o Laravel converterá automaticamente os models e coleções em respostas JSON, respeitando os <a target="_blank" href="/eloquent-orm/serializacao">atributos ocultos</a> do model:

```php
use App\Models\User;
 
Route::get('/user/{user}', function (User $user) {
    return $user;
});
```

### Anexando Cabeçalhos às Respostas

Mantenha em mente que a maioria dos métodos de resposta são encadeáveis, permitindo a <span class="highlight">construção fluente</span> de instâncias da resposta. Por exemplo, você pode usar o método `header` para adicionar uma série de cabeçalhos à resposta antes de enviá-la de volta ao usuário:

```php
return response($content)
            ->header('Content-Type', $type)
            ->header('X-Header-One', 'Header Value')
            ->header('X-Header-Two', 'Header Value');
```

Ou você pode usar o método `withHeaders` para especificar um array de cabeçalhos a serem adicionados à resposta:

```php
return response($content)
            ->withHeaders([
                'Content-Type' => $type,
                'X-Header-One' => 'Header Value',
                'X-Header-Two' => 'Header Value',
            ]);
```

#### Middleware de Controle de Cache

O Laravel inclui um middleware `cache.headers`, que pode ser usado para definir rapidamente o cabeçalho `Cache-Control` para um grupo de rotas. As diretivas devem ser fornecidas usando o equivalente em "snake case" da diretiva de controle de cache correspondente e devem ser separadas por um ponto e vírgula. Se `etag` for especificado na lista de diretivas, um hash MD5 do conteúdo da resposta será automaticamente definido como o identificador ETag:

```php
Route::middleware('cache.headers:public;max_age=2628000;etag')->group(function () {
    Route::get('/privacy', function () {
        // ...
    });
 
    Route::get('/terms', function () {
        // ...
    });
});
```

### Anexando Cookies às Respostas

Você pode anexar um cookie a uma instância de resposta `Illuminate\Http\Response` utilizando o método `cookie`. Você deve passar o nome, o valor e quantos minutos que o cookie deve ser considerado válido para este método:

```php
return response('Hello World')->cookie('name', 'value', $minutes);
```

O método `cookie` também aceita alguns argumentos adicionais que são usados com menos frequência. Geralmente, esses argumentos têm o mesmo propósito e significado que os argumentos que seriam dados ao método nativo <a href="https://secure.php.net/manual/en/function.setcookie.php" target="_blank">setcookie</a> do PHP:

```php
return response('Hello World')->cookie(
    'name', 'value', $minutes, $path, $domain, $secure, $httpOnly
);
```

Se você deseja garantir que um cookie seja enviado com a resposta de saída, mas ainda não tem uma instância dessa resposta, você pode usar a facade `Cookie` para "enfileirar" cookies para posteriormente anexar eles à resposta quando ela for enviada. O método `queue` aceita os argumentos necessários para criar uma instância de cookie. Esses cookies serão anexados à resposta antes de ser enviada para o navegador:

```php
use Illuminate\Support\Facades\Cookie;
 
Cookie::queue('name', 'value', $minutes);
```

#### Gerando Instâncias de Cookies

Se você deseja gerar uma instância de `Symfony\Component\HttpFoundation\Cookie` que pode ser anexada a uma instância de resposta em um momento posterior, você pode usar o helper global `cookie`. Este cookie não será enviado de volta ao cliente, a menos que seja anexado a uma instância de resposta:

```php
$cookie = cookie('name', 'value', $minutes);
 
return response('Hello World')->cookie($cookie);
```

#### Expirando Cookies Antecipadamente

Você pode remover um cookie expirando-o utilizando o método `withoutCookie`:

```php
return response('Hello World')->withoutCookie('name');
``` 

Se você ainda não tem uma instância da resposta, você pode usar o método `expire` da facade `Cookie`:

```php
Cookie::expire('name');
```

### Cookies e Criptografia

Por padrão, graças ao middleware `Illuminate\Cookie\Middleware\EncryptCookies`, todos os cookies gerados pelo Laravel são criptografados e assinados para que não possam ser modificados ou lidos pelo cliente. Se você deseja desativar a criptografia para um subconjunto de cookies gerados por sua aplicação, você pode utilizar o método `encryptCookies` no arquivo `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->encryptCookies(except: [
        'cookie_name',
    ]);
})
```

## Redirecionamentos

As respostas de redirecionamento são instâncias da classe `Illuminate\Http\RedirectResponse` e contêm os cabeçalhos necessários para redirecionar o usuário para outra URL. Existem várias maneiras de gerar uma instância de `RedirectResponse`. O método mais simples é usar o helper global `redirect`:

```php
Route::get('/dashboard', function () {
    return redirect('/home/dashboard');
});
```

Às vezes, você pode desejar redirecionar o usuário para sua localização anterior, como quando um formulário enviado é inválido. Você pode fazer isso usando a função global `back`. Como esse recurso utiliza a <a target="_blank" href="/fundamentos/sessoes">sessão</a>, certifique-se de que a rota que chama a função `back` está usando o grupo de middleware `web`:

```php
Route::post('/user/profile', function () {
    // Valide a requisição...
 
    return back()->withInput();
});
```

### Redirecionando para Rotas Nomeadas

Quando você chama o helper `redirect` sem parâmetros, uma instância de `Illuminate\Routing\Redirector` é retornada, permitindo que você chame qualquer método na instância `Redirector`. Por exemplo, para gerar um `RedirectResponse` para uma rota nomeada, você pode utilizar o método `route` encadeado no helper `redirect`:

```php
return redirect()->route('login');
```

Se sua rota tiver parâmetros, você pode passá-los como o segundo argumento para o método `route`:

```php
// Para a rota com o seguinte URI: /profile/{id}
 
return redirect()->route('profile', ['id' => 1]);
```

#### Populando Parâmetros com Models Eloquent

Se você estiver redirecionando para uma rota com um parâmetro "ID" que está sendo populado a partir de um model Eloquent, você pode passar o próprio model. O ID será extraído automaticamente:

```php
// Para a rota com o seguinte URI: /profile/{id}
 
return redirect()->route('profile', [$user]);
```

Se você deseja personalizar o valor que é colocado no parâmetro da rota, você pode especificar a coluna na definição do parâmetro da rota (`/profile/{id:slug}`) ou pode substituir o método `getRouteKey` em seu model Eloquent:

```php  
public function getRouteKey(): mixed
{
    return $this->slug;
}
```

### Redirecionando para Ações do Controller

Você também pode gerar redirecionamentos para <a target="_blank" href="/fundamentos/controllers">métodos de controllers</a>. Para fazer isso, passe o nome do controller e do método para o método `action`:

```php
use App\Http\Controllers\UserController;
 
return redirect()->action([UserController::class, 'index']);
```

Se a rota do seu controller requer parâmetros, você pode passá-los como o segundo argumento para o método `action`:

```php
return redirect()->action(
    [UserController::class, 'profile'], ['id' => 1]
);
```

### Redirecionando para domínios externos

Às vezes, você pode precisar redirecionar para um domínio fora de sua aplicação. Você pode fazer isso chamando o método `away`, que cria um `RedirectResponse` sem qualquer codificação, validação ou verificação de URL adicional:

```php
return redirect()->away('https://www.google.com');
```

### Redirecionando com Dados Temporários na Sessão

Redirecionar para uma nova URL e <a target="_blank" href="/fundamentos/sessoes">armazenar dados na sessão</a> são normalmente feitos ao mesmo tempo. Tipicamente, isso é feito após a realização de uma ação com sucesso, por exemplo quando você armazena uma mensagem de sucesso na sessão. Para facilitar seu trabalho, você pode criar uma instância de `RedirectResponse` e armazenar dados na sessão em uma única cadeia de métodos:

```php
Route::post('/user/profile', function () {
    // ...
 
    return redirect('/dashboard')->with('status', 'Profile updated!');
});
```

Depois que o usuário for redirecionado, você pode exibir a mensagem armazenada na sessão. Por exemplo, usando a sintaxe <a target="_blank" href="/fundamentos/templates-blade">Blade</a>:

```blade
@if (session('status'))
    <div class="alert alert-success">
        {{ session('status') }}
    </div>
@endif
```

#### Redirecionando com Dados de Entrada

Você pode usar o método `withInput` fornecido pela instância `RedirectResponse` para armazenar os dados de entrada da requisição atual na sessão antes de redirecionar o usuário para um novo local. Isso é normalmente feito se o usuário encontrar um erro de validação. Depois que os dados de entrada forem armazenados na sessão, você pode facilmente <a target="_blank" href="/fundamentos/requests#recuperando-entradas-anteriores">recuperá-los</a> durante a próxima requisição para repopular o formulário:

```php
return back()->withInput();
```

## Outros Tipos de Resposta

O helper `response` pode ser usado para gerar outros tipos de instâncias de resposta. Quando o helper `response` é chamado sem argumentos, uma implementação do <a href="/conhecendo-mais/contratos">contrato</a> `Illuminate\Contracts\Routing\ResponseFactory` é retornada. Este contrato fornece vários métodos úteis para gerar respostas.

### Respostas de Views

Se você precisa de controle sobre o status da resposta e os cabeçalhos, mas também precisa retornar uma <a target="_blank" href="/fundamentos/views">view</a> como conteúdo da resposta, você deve usar o método `view`:

```php
return response()->view('hello', $data, 200)
                  ->header('Content-Type', $type);
```

Claro, se você não precisa passar um código de status HTTP personalizado ou cabeçalhos personalizados, você pode usar a função global `view`.

### Respostas JSON

O método `json` definirá automaticamente o cabeçalho `Content-Type` para `application/json`, bem como converterá o array fornecido em JSON usando a função `json_encode` do PHP:

```php
return response()->json([
    'name' => 'André',
    'state' => 'SP',
]);
```

Se você deseja criar uma resposta JSONP, você pode usar o método `json` em combinação com o método `withCallback`:

```php
return response()
            ->json(['name' => 'André', 'state' => 'SP'])
            ->withCallback($request->input('callback'));
```

### Download de Arquivos

O método `download` pode ser usado para gerar uma resposta que força o navegador do usuário a baixar o arquivo no caminho fornecido. O método `download` aceita um nome de arquivo como segundo argumento, que determinará o nome do arquivo que é visto pelo usuário. Por fim, você pode passar um array de cabeçalhos HTTP como terceiro argumento para o método:

```php
return response()->download($pathToFile);
 
return response()->download($pathToFile, $name, $headers);
```

::: danger
O Symfony HttpFoundation, que gerencia downloads de arquivos, requer que o arquivo a ser baixado tenha um nome de arquivo ASCII.
:::

### Respostas de Arquivos

O método `file` pode ser usado para exibir um arquivo, como uma imagem ou PDF, diretamente no navegador do usuário, em vez de iniciar um download. Este método aceita o caminho absoluto para o arquivo como seu primeiro argumento e um array de cabeçalhos como seu segundo argumento:

```php
return response()->file($pathToFile);
 
return response()->file($pathToFile, $headers);
```

## Respostas em Streaming

Ao transmitir dados para o cliente conforme são gerados, você pode reduzir significativamente o uso de memória e melhorar o desempenho, especialmente para respostas muito grandes. As respostas em streaming permitem que o cliente comece a processar os dados antes que o servidor tenha terminado de enviá-los:

```php
function streamedContent(): Generator {
    yield 'Hello, ';
    yield 'World!';
}
 
Route::get('/stream', function () {
    return response()->stream(function (): void {
        foreach (streamedContent() as $chunk) {
            echo $chunk;
            ob_flush();
            flush();
            sleep(2); // Simulate delay between chunks...
        }
    }, 200, ['X-Accel-Buffering' => 'no']);
});
```

::: tip
Internamente, o Laravel utiliza a funcionalidade de buffer de dados do PHP. Como você pode ver no exemplo acima, você deve usar as funções `ob_flush` e `flush` para enviar o conteúdo em buffer para o cliente.
:::

### Respostas JSON em Streaming

Se você precisar transmitir dados JSON incrementalmente, pode utilizar o método `streamJson`. Este método é especialmente útil para grandes conjuntos de dados que precisam ser enviados progressivamente para o navegador em um formato que pode ser facilmente analisado pelo JavaScript:

```php
use App\Models\User;
 
Route::get('/users.json', function () {
    return response()->streamJson([
        'users' => User::cursor(),
    ]);
});
```

### Downloads em Streaming

Às vezes, você pode desejar transformar a resposta de uma operação em uma resposta para download sem ter que gravar o conteúdo da operação no disco. Você pode usar o método `streamDownload` nesse cenário. Este método aceita um callback, um nome de arquivo e um array opcional de cabeçalhos como argumentos:

```php
use App\Services\GitHub;
 
return response()->streamDownload(function () {
    echo GitHub::api('repo')
                ->contents()
                ->readme('laravel', 'laravel')['contents'];
}, 'laravel-readme.md');
```

## Macro de Respostas

Se você deseja definir uma resposta personalizada que pode ser reutilizada em uma variedade de suas rotas, você pode usar o método `macro` na facade `Response`. Normalmente, você deve chamar este método a partir do método `boot` de um dos <a href="/conceitos-de-arquitetura/providers" target="_blank">services providers</a> de sua aplicação, como o `App\Providers\AppServiceProvider`:

```php
<?php
 
namespace App\Providers;
 
use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;
 
class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Response::macro('caps', function (string $value) {
            return Response::make(strtoupper($value));
        });
    }
}
```

O método `macro` aceita um nome como seu primeiro argumento e uma closure como seu segundo argumento. A closure do macro será executada ao chamar o nome do macro a partir de uma implementação de `ResponseFactory` ou do helper `response`:

```php
return response()->caps('foo');
```