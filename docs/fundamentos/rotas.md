# Rotas

## Roteamento Básico

As rotas mais básicas do Laravel aceitam um URI e uma closure, fornecendo um método muito simples e expressivo de definir rotas e comportamentos sem arquivos de configuração de roteamento complicados:

```php
use Illuminate\Support\Facades\Route;
 
Route::get('/greeting', function () {
    return 'Hello World';
});
```

### Arquivos de Rotas Padrão

Todas as rotas do Laravel são definidas em seus arquivos de rota, que estão localizados no diretório `routes`. Esses arquivos são carregados automaticamente pelo Laravel usando a configuração especificada no arquivo `bootstrap/app.php` de sua aplicação. O arquivo `routes/web.php` define rotas que são para sua interface web. Essas rotas são atribuídas ao <a href="/fundamentos/middleware" target="_blank">grupo de middleware</a> `web`, que fornece recursos como estado de sessão e proteção CSRF.

Para a maioria das aplicações, você começará definindo rotas em seu arquivo `routes/web.php`. As rotas definidas em `routes/web.php` podem ser acessadas digitando a URL da rota definida em seu navegador. Por exemplo, você pode acessar a seguinte rota navegando até `http://example.com/user` em seu navegador:

```php
use App\Http\Controllers\UserController;
 
Route::get('/user', [UserController::class, 'index']);
```

#### Rotas de APIs

Se sua aplicação também oferecer uma API stateless, você pode habilitar o roteamento de API usando o comando Artisan `install:api`:

```shell
php artisan install:api
```

O comando `install:api` instala o <a href="/pacotes/sanctum" target="_blank">Laravel Sanctum</a>, que fornece um sistema robusto de autenticação por token de API, mas simples, que pode ser usado para autenticar consumidores de APIs de terceiros, SPAs ou aplicativos móveis. Além disso, o comando `install:api` cria o arquivo `routes/api.php`:

```php
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
```

As rotas em `routes/api.php` são stateless e são atribuídas ao <a href="/fundamentos/middleware" target="_blank">grupo de middleware</a> `api`. Além disso, o prefixo de URI `/api` é aplicado automaticamente a essas rotas, então você não precisa aplicá-lo manualmente a cada rota no arquivo. Você pode alterar o prefixo modificando o arquivo `bootstrap/app.php` de sua aplicação:

```php
->withRouting(
    api: __DIR__.'/../routes/api.php',
    apiPrefix: 'api/admin',
    // ...
)
```

#### Métodos de Roteamento Disponíveis

O Router permite que você registre rotas que respondem a qualquer verbo HTTP:

```php
Route::get($uri, $callback);
Route::post($uri, $callback);
Route::put($uri, $callback);
Route::patch($uri, $callback);
Route::delete($uri, $callback);
Route::options($uri, $callback);
```

Às vezes, você pode precisar registrar uma rota que responda a vários verbos HTTP. Você pode fazer isso usando o método `match`. Ou, você pode até mesmo registrar uma rota que responda a todos os verbos HTTP usando o método `any`:

```php
Route::match(['get', 'post'], '/', function () {
    // ...
});
 
Route::any('/', function () {
    // ...
});
```

::: tip
Quando definir várias rotas que compartilham o mesmo URI, certifique-se de que as rotas com os métodos `get`, `post`, `put`, `patch`, `delete` e `options` sejam definidas antes das rotas com os métodos `any`, `match` e `redirect`. Isso garante que a solicitação seja direcionada para a rota correta.
:::

#### Injeção de Dependência

Você pode tipar qualquer dependência necessária por sua rota na assinatura do callback de sua rota. As dependências declaradas serão automaticamente resolvidas e injetadas no callback pelo <a href="/fundamentos/container" target="_blank">container de serviços</a>. Por exemplo, você pode tipar a classe `Illuminate\Http\Request` para ter a solicitação HTTP atual injetada automaticamente em seu callback de rota:

```php
use Illuminate\Http\Request;
 
Route::get('/users', function (Request $request) {
    // ...
});
```

#### Proteção CSRF

Lembre-se, qualquer formulário HTML apontando para rotas `POST`, `PUT`, `PATCH` ou `DELETE` que são definidas no arquivo de rotas `web` devem incluir um campo de token CSRF. Caso contrário, a solicitação será rejeitada. Saiba mais sobre a proteção CSRF na <a href="/fundamentos/protecao-csrf" target="_blank">documentação CSRF</a>:

```php
<form method="POST" action="/profile">
    @csrf
    ...
</form>
```

### Rotas de Redirecionamento

Se você estiver definindo uma rota que redireciona para outro URI, você pode usar o método `Route::redirect`. Este método fornece um atalho para que você não precise definir uma rota completa ou controller para realizar um redirecionamento simples:

```php
Route::redirect('/here', '/there');
```

Por padrão, `Route::redirect` retorna um código de status `302`. Você pode personalizar o código de status usando o terceiro parâmetro opcional:

```php
Route::redirect('/here', '/there', 301);
```

Ou, você pode usar o método `Route::permanentRedirect` para retornar um código de status `301`:

```php
Route::permanentRedirect('/here', '/there');
```

::: danger
Ao usar parâmetros de rota em rotas de redirecionamento, os seguintes parâmetros são reservados pelo Laravel e não podem ser usados: `destination` e `status`.
:::

### Rotas para Views

Se sua rota só precisa retornar uma <a href="/fundamentos/views" target="_blank">view</a>, você pode usar o método `Route::view`. Assim como o método `redirect`, este método fornece um atalho simples para que você não precise definir uma rota completa ou controller. O método `view` aceita um URI como seu primeiro argumento e um nome de view como seu segundo argumento. Além disso, você pode fornecer um array associativo de dados para passar para a view como um terceiro argumento opcional:

```php
Route::view('/welcome', 'welcome');
 
Route::view('/welcome', 'welcome', ['name' => 'Taylor']);
```

::: danger
Ao usar parâmetros de rota em rotas de view, os seguintes parâmetros são reservados pelo Laravel e não podem ser usados: `view`, `data`, `status` e `headers`.
:::

### Listando Suas Rotas

O comando Artisan `route:list` fornece uma visão geral de todas as rotas definidas na aplicação:

```shell
php artisan route:list
```

Por padrão, os middleware de rota atribuídos a cada rota não serão exibidos na saída de `route:list`; no entanto, você pode instruir o Laravel a exibir os middleware e os nomes de grupos de middleware adicionando a opção `-v` ao comando:

```shell
php artisan route:list -v
```

Você também pode instruir o Laravel a mostrar apenas rotas que começam com um determinado URI:

```shell
php artisan route:list --path=api
```

Além disso, você pode instruir o Laravel a ocultar quaisquer rotas definidas por pacotes de terceiros fornecendo a opção `--except-vendor` ao executar o comando `route:list`:

```shell
php artisan route:list --except-vendor
```

Da mesma forma, você também pode instruir o Laravel a mostrar apenas rotas definidas por pacotes de terceiros fornecendo a opção `--only-vendor` ao executar o comando `route:list`:

```shell
php artisan route:list --only-vendor
```

### Customização de Roteamento

Por padrão, as rotas de sua aplicação são configuradas e carregadas pelo arquivo `bootstrap/app.php`:

```php
<?php
 
use Illuminate\Foundation\Application;
 
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )->create();
```

No entanto, às vezes você pode querer definir um arquivo inteiramente novo para conter um subconjunto des rotas. Para fazer isso, você pode fornecer uma closure `then` ao método `withRouting`. Dentro desta closure, você pode registrar quaisquer rotas adicionais que sejam necessárias:

```php
use Illuminate\Support\Facades\Route;
 
->withRouting(
    web: __DIR__.'/../routes/web.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
    then: function () {
        Route::middleware('api')
            ->prefix('webhooks')
            ->name('webhooks.')
            ->group(base_path('routes/webhooks.php'));
    },
)
```

Ou, você pode até mesmo assumir o controle total sobre o registro de rotas fornecendo uma closure `using` ao método `withRouting`. Quando este argumento é passado, nenhuma rota HTTP será registrada pelo framework e você é responsável por registrar manualmente todas as rotas:

```php
use Illuminate\Support\Facades\Route;
 
->withRouting(
    commands: __DIR__.'/../routes/console.php',
    using: function () {
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));
 
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    },
)
```

## Parâmetros de Rota

### Parâmetros Obrigatórios

Às vezes, você precisará capturar segmentos do URI dentro de sua rota. Por exemplo, você pode precisar capturar o ID de um usuário vindo da URL. Você pode fazer isso definindo parâmetros de rota:

```php
Route::get('/user/{id}', function (string $id) {
    return 'User '.$id;
});
```

Você pode definir quantos parâmetros de rota forem necessários:

```php
Route::get('/posts/{post}/comments/{comment}', function (string $postId, string $commentId) {
    // ...
});
```

Os parâmetros de rota são sempre envolvidos em chaves `{}` e devem consistir de caracteres alfabéticos. Underscores (`_`) também são aceitáveis nos nomes de parâmetros de rota. Os parâmetros de rota são injetados nos callbacks da rota/controllers com base em sua ordem - os nomes dos argumentos de callback/controller de rota não importam.

#### Parâmetros e Injeção de Dependência

Se sua rota tiver dependências que você deseja que o container de serviços do Laravel injete automaticamente no callback da rota, liste os parâmetros da rota após essas dependências:

```php
use Illuminate\Http\Request;
 
Route::get('/user/{id}', function (Request $request, string $id) {
    return 'User '.$id;
});
```

### Parâmetros Opcionais

Às vezes, você pode precisar especificar um parâmetro de rota que pode nem sempre estar presente na URI. Você pode fazer isso colocando um sinal de `?` após o nome do parâmetro. Certifique-se de dar um valor padrão à variável correspondente da rota:

```php
Route::get('/user/{name?}', function (?string $name = null) {
    return $name;
});
 
Route::get('/user/{name?}', function (?string $name = 'John') {
    return $name;
});
```

### Expressões Regulares

Você pode restringir o formato de seus parâmetros de rota usando o método `where` em uma instância de rota. O método `where` aceita o nome do parâmetro e uma expressão regular definindo como o parâmetro deve ser restrito:

```php
Route::get('/user/{name}', function (string $name) {
    // ...
})->where('name', '[A-Za-z]+'); // Apenas letras
 
Route::get('/user/{id}', function (string $id) {
    // ...
})->where('id', '[0-9]+'); // Apenas números
 
Route::get('/user/{id}/{name}', function (string $id, string $name) {
    // ...
})->where(['id' => '[0-9]+', 'name' => '[a-z]+']); 
```
Para conveniência, alguns padrões de expressão regular comumente usados têm métodos auxiliares que permitem adicionar rapidamente restrições às suas rotas:

```php
Route::get('/user/{id}/{name}', function (string $id, string $name) {
    // ...
})->whereNumber('id')->whereAlpha('name');
 
Route::get('/user/{name}', function (string $name) {
    // ...
})->whereAlphaNumeric('name');
 
Route::get('/user/{id}', function (string $id) {
    // ...
})->whereUuid('id');
 
Route::get('/user/{id}', function (string $id) {
    // ...
})->whereUlid('id');
 
Route::get('/category/{category}', function (string $category) {
    // ...
})->whereIn('category', ['movie', 'song', 'painting']);
 
Route::get('/category/{category}', function (string $category) {
    // ...
})->whereIn('category', CategoryEnum::cases());
```

Se a solicitação de entrada não corresponder às restrições de padrão da rota, uma resposta HTTP 404 será retornada.

#### Condições de Parâmetro Globais

Se você deseja que um parâmetro de rota seja sempre restrito por uma determinada expressão regular, você pode usar o método `pattern`. Você deve definir esses padrões no método `boot` da classe `App\Providers\AppServiceProvider` de sua aplicação:

```php
use Illuminate\Support\Facades\Route;
 
/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Route::pattern('id', '[0-9]+');
}
```

Uma vez que o padrão tenha sido definido, ele é automaticamente aplicado a todas as rotas que usam o parâmetro com o nome definido.

```php
Route::get('/user/{id}', function (string $id) {
    // Só será executado se {id} for numérico...
});
```

#### Barras Invertidas Codificadas

O componente de roteamento do Laravel permite que todos os caracteres, exceto `/`, estejam presentes nos valores dos parâmetros de rota. Você deve permitir explicitamente `/` para fazer parte de seu espaço reservado usando uma expressão regular de condição `where`:

```php
Route::get('/search/{search}', function (string $search) {
    return $search;
})->where('search', '.*');
```

::: danger
As barras invertidas codificadas são suportadas apenas no último segmento de rota.
:::

## Rotas Nomeadas

Rotas nomeadas permitem a geração conveniente de URLs ou redirecionamentos para rotas específicas. Você pode especificar um nome para uma rota encadeando o método `name` na definição da rota:

```php
Route::get('/user/profile', function () {
    // ...
})->name('profile');
```

Você também pode especificar nomes de rota para ações de controller:

```php
Route::get(
    '/user/profile',
    [UserProfileController::class, 'show']
)->name('profile');
```

::: danger
Os nomes de rotas devem sempre ser únicos.
:::

#### Gerando URLs para Rotas Nomeadas

Uma vez que você atribuiu um nome a uma rota específica, você pode usar o nome da rota ao gerar URLs ou redirecionamentos via os helpers `route` e `redirect` do Laravel:

```php
// Gerando URLs...
$url = route('profile');
 
// Gerando redirecionamentos...
return redirect()->route('profile');
 
return to_route('profile');
```

Se a rota nomeada definir parâmetros, você pode passar os parâmetros como segundo argumento para a função `route`. Os parâmetros fornecidos serão automaticamente inseridos na URL gerada em suas posições corretas:

```php
Route::get('/user/{id}/profile', function (string $id) {
    // ...
})->name('profile');
 
$url = route('profile', ['id' => 1]);
```

Você pode passar parâmetros adicionais no array, esses pares chave/valor serão automaticamente adicionados à string de consulta da URL gerada:

```php
Route::get('/user/{id}/profile', function (string $id) {
    // ...
})->name('profile');
 
$url = route('profile', ['id' => 1, 'photos' => 'yes']);
 
// /user/1/profile?photos=yes
```

::: tip
Em alguns casos, você pode desejar especificar valores padrão para parâmetros de URL. Para fazer isso, você pode usar o <a href="/fundamentos/geracao-de-urls" target="_blank"> método `URL::defaults`</a>.
:::

#### Inspeção da Rota Atual

Se você deseja verificar se a request atual foi direcionada para uma rota nomeada específica, pode usar o método `named` em uma instância de rota. Por exemplo, você pode verificar o nome da rota atual em um middleware de rota:

```php
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
 
/**
 * Handle an incoming request.
 *
 * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
 */
public function handle(Request $request, Closure $next): Response
{
    if ($request->route()->named('profile')) {
        // Se a rota atual for nomeada "profile"...
    }
 
    return $next($request);
}
```

## Grupos de Rotas

Os grupos de rotas permitem que você compartilhe atributos de rota, como middleware, em um grande número de rotas sem precisar definir esses atributos em cada rota individualmente.

Os grupos aninhados tentam "mesclar" inteligentemente os atributos com seu grupo pai. Os middleware e condições `where` são mesclados enquanto os nomes e prefixos são anexados. Delimitadores de namespace e barras invertidas em prefixos de URI são adicionados automaticamente quando apropriado.

### Middleware

Para atribuir <a href="/fundamentos/middleware">middleware</a> a todas as rotas dentro de um grupo, você pode usar o método `middleware` antes de definir o grupo. Os middleware são executados na ordem em que são listados no array:

```php
Route::middleware(['first', 'second'])->group(function () {
    Route::get('/', function () {
        // Uses first & second middleware...
    });
 
    Route::get('/user/profile', function () {
        // Uses first & second middleware...
    });
});
```

### Controllers

Se um grupo de rotas utilizar o mesmo <a href="/fundamentos/controllers">controller</a>, você pode usar o método `controller` para definir um controller comum para todas as rotas dentro do grupo. Em seguida, ao definir as rotas, você só precisa fornecer o método do controller que elas invocam:

```php
use App\Http\Controllers\OrderController;
 
Route::controller(OrderController::class)->group(function () {
    Route::get('/orders/{id}', 'show');
    Route::post('/orders', 'store');
});
```

### Rotas de Subdomínio

Os grupos de rotas também podem ser usados para lidar com roteamento de subdomínios. Você pode atribuir subdomínios a parâmetros de rota da mesma forma que faz com URIs de rota. Isso permite capturar uma parte do subdomínio para uso em sua rota / controller. Para especificar o subdomínio, chame o método `domain` antes de definir o grupo:

```php
Route::domain('{account}.example.com')->group(function () {
    Route::get('/user/{id}', function (string $account, string $id) {
        // ...
    });
});
```

::: danger 
Para garantir que suas rotas de subdomínio sejam acessíveis, registre as rotas de subdomínio antes das rotas de domínio raiz. Isso evita que as rotas de domínio raiz sobrescrevam as rotas de subdomínio que têm o mesmo caminho de URI. 
:::

### Prefixos de Rota

O método `prefix` pode ser usado para prefixar cada rota no grupo com um URI fornecido. Por exemplo, você pode querer prefixar todos os URIs de rota dentro do grupo com `admin`:

```php
Route::prefix('admin')->group(function () {
    Route::get('/users', function () {
        // Matches The "/admin/users" URL
    });
});
```

### Prefixos de Nome de Rota

O método `name` pode ser usado para prefixar cada nome de rota no grupo com uma string fornecida. Por exemplo, você pode querer prefixar os nomes de todas as rotas no grupo com `admin`. A string fornecida é prefixada ao nome da rota exatamente como é especificado, então certifique-se de fornecer o caractere de ponto final `.` no prefixo:

```php
Route::name('admin.')->group(function () {
    Route::get('/users', function () {
        // Route assigned name "admin.users"...
    })->name('users');
});
```

## Route Model Binding

Ao injetar um ID de um model em uma rota ou ação de controller, você frequentemente consulta o banco de dados para recuperar a instância do modelo que corresponde a esse ID. O route model binding do Laravel fornece uma maneira conveniente de injetar automaticamente as instâncias do model diretamente em suas rotas. Por exemplo, em vez de injetar o ID de um usuário, você pode injetar a instância inteira do modelo `User` que corresponde ao ID fornecido.

### Binding Implícito

O Laravel resolve automaticamente os models Eloquent definidos em rotas ou ações de controller cujo o nome da variável tipada corresponde a um nome de parâmetro de rota. Por exemplo:

```php
use App\Models\User;
 
Route::get('/users/{user}', function (User $user) {
    return $user->email;
});
```

Uma vez que a variável `$user` é tipada como o model Eloquent `App\Models\User` e o nome da variável corresponde ao segmento de URI `{user}`, o Laravel injetará automaticamente a instância do modelo que tem um ID correspondente ao valor correspondente da URI da solicitação. Se uma instância de modelo correspondente não for encontrada no banco de dados, uma resposta HTTP 404 será gerada automaticamente.

Claro, o binding implícito também é possível ao usar métodos de controller. Novamente, observe que o segmento de URI `{user}` corresponde à variável `$user` no controller que contém um tipo de dica `App\Models\User`:

```php
use App\Http\Controllers\UserController;
use App\Models\User;
 
// Route definition...
Route::get('/users/{user}', [UserController::class, 'show']);
 
// Controller method definition...
public function show(User $user)
{
    return view('user.profile', ['user' => $user]);
}
```

#### Soft Deleted Models

Normalmente, o binding implícito de models não recuperará models que foram <a href="/eloquent-orm/introducao#soft-deleting" target="_blank">soft deleted</a>. No entanto, você pode instruir o binding implícito a recuperar esses models encadeando o método `withTrashed` na definição da rota:

```php
use App\Models\User;
 
Route::get('/users/{user}', function (User $user) {
    return $user->email;
})->withTrashed();
```

#### Customizando a Chave Padrão

Às vezes, você pode desejar resolver models Eloquent usando uma coluna diferente de `id`. Para fazer isso, você pode especificar a coluna na definição do parâmetro de rota:

```php
use App\Models\Post;
 
Route::get('/posts/{post:slug}', function (Post $post) {
    return $post;
});
```

Se você deseja que o model binding sempre use uma coluna de banco de dados diferente de `id` ao recuperar um determinado model, você pode substituir o método `getRouteKeyName` no model:

```php
/**
 * Get the route key for the model.
 */
public function getRouteKeyName(): string
{
    return 'slug';
}
```

#### Chaves Personalizadas e Escopo

Quando você deseja vincular implicitamente vários models em uma única definição de rota, você pode desejar limitar o segundo model de forma que ele seja um filho do model. Por exemplo, considere esta rota que recupera uma postagem de blog por slug para um usuário específico:

```php
use App\Models\Post;
use App\Models\User;
 
Route::get('/users/{user}/posts/{post:slug}', function (User $user, Post $post) {
    return $post;
});
```

Ao usar um binding implícito com chave personalizada como um parâmetro de rota aninhado, o Laravel automaticamente limitará a consulta para recuperar o modelo aninhado por seu pai usando convenções para adivinhar o nome do relacionamento no pai. Neste caso, será assumido que o modelo `User` tem um relacionamento chamado `posts` (a forma plural do nome do parâmetro de rota) que pode ser usado para recuperar o modelo `Post`.

Se desejar, você pode instruir o Laravel a limitar os bindings "filhos" mesmo quando uma chave personalizada não é fornecida. Para fazer isso, você pode invocar o método `scopeBindings` ao definir sua rota:

```php
use App\Models\Post;
use App\Models\User;
 
Route::get('/users/{user}/posts/{post}', function (User $user, Post $post) {
    return $post;
})->scopeBindings();
```

Ou, você pode instruir um grupo inteiro de rotas a usar bindings limitados:

```php
Route::scopeBindings()->group(function () {
    Route::get('/users/{user}/posts/{post}', function (User $user, Post $post) {
        return $post;
    });
});
```

Da mesma forma, você pode instruir explicitamente o Laravel a não limitar os bindings invocando o método `withoutScopedBindings`:

```php
Route::get('/users/{user}/posts/{post:slug}', function (User $user, Post $post) {
    return $post;
})->withoutScopedBindings();
```

#### Customizando o Comportamento de Models Ausentes

Normalmente, uma resposta HTTP 404 será gerada se um model vinculado implicitamente não for encontrado. No entanto, você pode personalizar esse comportamento chamando o método `missing` ao definir sua rota. O método `missing` aceita uma closure que será chamada se um model vinculado não puder ser encontrado:

```php
use App\Http\Controllers\LocationsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
 
Route::get('/locations/{location:slug}', [LocationsController::class, 'show'])
        ->name('locations.view')
        ->missing(function (Request $request) {
            return Redirect::route('locations.index');
        });
```

### Binding Implícito com Enums

O PHP 8.1 trouxe suporte para <a href="https://www.php.net/manual/en/language.enumerations.backed.php" target="_blank">Enums</a>. Para complementar esse recurso, o Laravel permite que você faça <em>tipe-hint</em> de um <a href="https://www.php.net/manual/en/language.enumerations.backed.php" target="_blank">Enum com valor</a> em sua definição de rota e o Laravel só invocará a rota se o segmento de rota correspondente a um valor Enum válido. Caso contrário, uma resposta HTTP 404 será retornada automaticamente. Por exemplo, dado o seguinte Enum:

::: tip
<em>tipe-hint</em> é um termo usado para descrever a prática de declarar o tipo de uma variável, parâmetro ou retorno de função em uma linguagem de programação.
:::

```php
<?php
 
namespace App\Enums;
 
enum Category: string
{
    case Fruits = 'fruits';
    case People = 'people';
}
```

Você pode definir uma rota que só será invocada se o segmento de rota `{category}` for `fruits` ou `people`. Caso contrário, o Laravel retornará uma resposta HTTP 404:

```php
use App\Enums\Category;
use Illuminate\Support\Facades\Route;
 
Route::get('/categories/{category}', function (Category $category) {
    return $category->value;
});
```

### Binding Explícito

Você não é obrigado a usar a resolução de models implícita. Você também pode definir explicitamente como os parâmetros de rota correspondem aos models. Para registrar um binding explícito, use o método `model` do `Route` para especificar uma classe para um determinado parâmetro. Você deve definir seus bindings de models explícitos no início do método `boot` da sua classe `AppServiceProvider`:

```php
use App\Models\User;
use Illuminate\Support\Facades\Route;
 
/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Route::model('user', User::class);
}
```

Em seguida, defina uma rota que contenha um parâmetro `{user}`:

```php
use App\Models\User;
 
Route::get('/users/{user}', function (User $user) {
    // ...
});
```

Uma vez que você vinculou todos os parâmetros `{user}` ao model `App\Models\User`, uma instância dessa classe será injetada na rota. Portanto, por exemplo, uma solicitação para `users/1` injetará a instância `User` do banco de dados que tem um ID de `1`.

Se uma instância de model correspondente não for encontrada no banco de dados, uma resposta HTTP 404 será gerada automaticamente.

#### Customizando a Lógica de Resolução

Se desejar definir sua própria lógica de resolução de model binding, você pode usar o método `Route::bind`. A closure que você passa para o método `bind` receberá o valor do segmento de URI e deve retornar a instância da classe que deve ser injetada na rota. Novamente, essa personalização deve ocorrer no método `boot` da classe `AppServiceProvider` de sua aplicação:

```php
use App\Models\User;
use Illuminate\Support\Facades\Route;
 
/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Route::bind('user', function (string $value) {
        return User::where('name', $value)->firstOrFail();
    });
}
```

Como alternativa, você pode substituir o método `resolveRouteBinding` em seu model Eloquent. Este método receberá o valor do segmento de URI e deve retornar a instância da classe que deve ser injetada na rota:

```php
/**
 * Retrieve the model for a bound value.
 *
 * @param  mixed  $value
 * @param  string|null  $field
 * @return \Illuminate\Database\Eloquent\Model|null
 */
public function resolveRouteBinding($value, $field = null)
{
    return $this->where('name', $value)->firstOrFail();
}
```

Se uma rota estiver utilizando <a href="#chaves-personalizadas-e-escopo">scoping de binding implícito de model</a>, o método `resolveChildRouteBinding` será usado para resolver o binding filho do model pai:

```php
/**
 * Retrieve the child model for a bound value.
 *
 * @param  string  $childType
 * @param  mixed  $value
 * @param  string|null  $field
 * @return \Illuminate\Database\Eloquent\Model|null
 */
public function resolveChildRouteBinding($childType, $value, $field)
{
    return parent::resolveChildRouteBinding($childType, $value, $field);
}
```

## Rotas de Fallback

Usando o método `Route::fallback`, você pode definir uma rota que será executada quando nenhuma outra rota corresponder à solicitação recebida. Tipicamente, solicitações não tratadas renderizarão automaticamente uma página "404" via o manipulador de exceções de sua aplicação. No entanto, como você normalmente definiria a rota `fallback` dentro do arquivo `routes/web.php`, todos os middleware no grupo de middleware `web` serão aplicados à rota. Você é livre para adicionar middleware adicional a esta rota conforme necessário:

```php
Route::fallback(function () {
    // ...
});
```

::: danger
A rota de fallback deve sempre ser a última rota registrada por sua aplicação.
:::

## Limitadores de Requisições (Rate Limiting)

### Definindo Limitadores de Requisições

O Laravel inclui serviços de limitação de requisições poderosos e personalizáveis que você pode utilizar para restringir a quantidade de tráfego para uma determinada rota ou grupo de rotas. Para começar, você deve definir configurações de limitador de taxa que atendam às necessidades de sua aplicação.

Os limitadores de requisições podem ser definidos no método `boot` da classe `App\Providers\AppServiceProvider`:

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
 
/**
 * Bootstrap any application services.
 */
protected function boot(): void
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });
}
```

Os limitadores de requisições são definidos usando o método `for` da facade `RateLimiter`. O método `for` aceita um nome de limitador de requisições e uma closure que retorna a configuração de limite que deve ser aplicada às rotas atribuídas ao limitador de requisições. As configurações de limite são instâncias da classe `Illuminate\Cache\RateLimiting\Limit`. Esta classe contém métodos "builder" úteis para que você possa definir rapidamente seu limite. O nome do limitador de requisições pode ser qualquer string que você desejar.

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
 
/**
 * Bootstrap any application services.
 */
protected function boot(): void
{
    RateLimiter::for('global', function (Request $request) {
        return Limit::perMinute(1000);
    });
}
```

Se a requisição exceder o limite especificado, uma resposta com um código de status HTTP 429 será automaticamente retornada pelo Laravel. Se você deseja definir sua própria resposta que deve ser retornada por um limite de taxa, você pode usar o método `response`:

```php
RateLimiter::for('global', function (Request $request) {
    return Limit::perMinute(1000)->response(function (Request $request, array $headers) {
        return response('Custom response...', 429, $headers);
    });
});
```

Uma vez que os callbacks de limitador de requisições recebem a instância de requisição HTTP de entrada, você pode construir o limite apropriado dinamicamente com base na requisição de entrada ou usuário autenticado:

```php
RateLimiter::for('uploads', function (Request $request) {
    return $request->user()->vipCustomer()
                ? Limit::none()
                : Limit::perMinute(100);
});
```

#### Segmentando Limitadores de Requisições

Às vezes, você pode desejar segmentar limitadores de requisições por algum valor arbitrário. Por exemplo, você pode desejar permitir que os usuários acessem uma determinada rota 100 vezes por minuto por endereço IP. Para fazer isso, você pode usar o método `by` ao construir seu limite de taxa:

```php
RateLimiter::for('uploads', function (Request $request) {
    return $request->user()->vipCustomer()
                ? Limit::none()
                : Limit::perMinute(100)->by($request->ip());
});
```

Para ilustrar esse recurso usando outro exemplo, podemos limitar o acesso à rota a 100 vezes por minuto por ID de usuário autenticado ou 10 vezes por minuto por endereço IP para convidados:

```php
RateLimiter::for('uploads', function (Request $request) {
    return $request->user()
                ? Limit::perMinute(100)->by($request->user()->id)
                : Limit::perMinute(10)->by($request->ip());
});
```

#### Múltiplos Limitadores de Requisições

Se necessário, você pode retornar um array de limites para uma determinada configuração de limitador. Cada limite será avaliado para a rota com base na ordem em que são colocados no array:

```php
RateLimiter::for('login', function (Request $request) {
    return [
        Limit::perMinute(500),
        Limit::perMinute(3)->by($request->input('email')),
    ];
});
```

Se você estiver atribuindo múltiplos limites segmentados por valores `by` idênticos, você deve garantir que cada valor `by` seja único. A maneira mais fácil de alcançar isso é prefixar os valores fornecidos ao método `by`:

```php
RateLimiter::for('uploads', function (Request $request) {
    return [
        Limit::perMinute(10)->by('minute:'.$request->user()->id),
        Limit::perDay(1000)->by('day:'.$request->user()->id),
    ];
});
```

### Associando Limitadores de Requisições às Rotas

Os limitadores de requisições podem ser anexados a rotas ou grupos de rotas usando o <a href="/fundamentos/middleware" target="_blank">middleware</a> `throttle`. O middleware `throttle` aceita o nome do limitador de requisições que você deseja atribuir à rota:

```php
Route::middleware(['throttle:uploads'])->group(function () {
    Route::post('/audio', function () {
        // ...
    });
 
    Route::post('/video', function () {
        // ...
    });
});
```

#### Limitando Requisições com Redis

Por padrão, o middleware `throttle` é mapeado para a classe `Illuminate\Routing\Middleware\ThrottleRequests`. No entanto, se você estiver usando o Redis como driver de cache de sua aplicação, você pode instruir o Laravel a usar o Redis. Para fazer isso, você deve usar o método `throttleWithRedis` no arquivo `bootstrap/app.php` de sua aplicação. Este método mapeia o middleware `throttle` para a classe `Illuminate\Routing\Middleware\ThrottleRequestsWithRedis`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->throttleWithRedis();
    // ...
})
```

## Simulação de Métodos em Formulários

Formulários HTML não suportam ações `PUT`, `PATCH` ou `DELETE`. Portanto, ao definir rotas `PUT`, `PATCH` ou `DELETE` que são chamadas de um formulário HTML, você precisará adicionar um campo oculto `_method` ao formulário. O valor enviado com o campo `_method` será usado como o método de solicitação HTTP:

```html
<form action="/example" method="POST">
    <input type="hidden" name="_method" value="PUT">
    <input type="hidden" name="_token" value="{{ csrf_token() }}">
</form>
```

Para facilitar, você pode usar a diretiva <a href="/fundamentos/templates-blade">Blade</a> `@method` para gerar o campo `_method`:

```php
<form action="/example" method="POST">
    @method('PUT')
    @csrf
</form>
```

## Acessando a Rota Atual

Você pode usar os métodos `current`, `currentRouteName` e `currentRouteAction` na facade `Route` para acessar informações sobre a rota que está lidando com a solicitação recebida:

```php
use Illuminate\Support\Facades\Route;
 
$route = Route::current(); // Illuminate\Routing\Route
$name = Route::currentRouteName(); // string
$action = Route::currentRouteAction(); // string
```

Você pode consultar a documentação da API para a <a href="https://laravel.com/api/11.x/Illuminate/Routing/Router.html" target="_blank">classe da facade Route</a> e <a href="https://laravel.com/api/11.x/Illuminate/Routing/Route.html" target="_blank">instância da rota</a> para revisar todos os métodos disponíveis nas classes de roteador e rota.

## Cross-Origin Resource Sharing (CORS)

O Laravel pode responder automaticamente a requisições HTTP CORS `OPTIONS` com valores que você configura. As solicitações `OPTIONS` serão automaticamente tratadas pelo middleware `HandleCors` que é automaticamente incluído no grupo de middlewares globais.

Às vezes, você pode precisar personalizar os valores de configuração CORS para sua aplicação. Você pode fazer isso publicando o arquivo de configuração `cors` usando o comando Artisan `config:publish`:

```shell
php artisan config:publish cors
```

Este comando adiciona um arquivo de configuração `cors.php` no diretório `config` de sua aplicação.

::: tip
Para obter mais informações sobre CORS e cabeçalhos CORS, consulte a <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#The_HTTP_response_headers" target="_blank">documentação web MDN sobre CORS</a>.
:::

## Cache de Rotas

Ao subir sua aplicação para produção, você deve aproveitar o cache de rotas do Laravel. Usar o cache de rotas reduz drasticamente o tempo necessário para registrar todas as rotas de sua aplicação. Para gerar um cache de rotas, execute o comando Artisan `route:cache`:

```shell
php artisan route:cache
```

Após executar este comando, seu arquivo de rotas em cache será carregado em todas as requisições. Lembre-se, se você adicionar novas rotas, precisará gerar um novo cache de rotas. Por conta disso, você só deve executar o comando `route:cache` durante o deploy de seu projeto.

Você pode usar o comando `route:clear` para limpar o cache de rotas:

```shell
php artisan route:clear
```

