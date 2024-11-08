# Middleware

## Introdução

Middlewares proporcionam um mecanismo conveniente para inspecionar e filtrar requisições HTTP que entram na sua aplicação. Por exemplo, o Laravel inclui um middleware que verifica se o usuário da sua aplicação está autenticado. Se o usuário não estiver autenticado, o middleware redirecionará o usuário para a tela de login da sua aplicação. No entanto, se o usuário estiver autenticado, o middleware permitirá que a requisição prossiga para dentro da aplicação.

Middlewares adicionais podem ser escritos para realizar uma variedade de tarefas além da autenticação. Por exemplo, um middleware de log pode registrar todas as requisições recebidas pela sua aplicação. Uma variedade de middlewares estão incluídos no Laravel, incluindo middlewares para autenticação e proteção CSRF; no entanto, todos os middlewares definidos pelo usuário estão normalmente localizados no diretório `app/Http/Middleware` da sua aplicação.

## Criando Middlewares

Para criar um novo middleware, use o comando Artisan `make:middleware`:

```shell
php artisan make:middleware EnsureTokenIsValid
```

Este comando criará uma nova classe `EnsureTokenIsValid` dentro do diretório `app/Http/Middleware`. Neste middleware, permitiremos o acesso à rota somente se o valor `token` corresponder a um valor especificado. Caso contrário, redirecionaremos os usuários de volta para a URI `/home`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsValid
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->input('token') !== 'meu-token-secreto') {
            return redirect('/home');
        }

        return $next($request);
    }
}
```

Como você pode ver, se o `token` não corresponder ao nosso token secreto, o middleware retornará um redirecionamento HTTP para o cliente; caso contrário, a requisição será passada mais adiante na aplicação. Para passar a requisição mais fundo na aplicação (permitindo que o middleware "passe"), você deve chamar o callback `$next` com o `$request`.

A melhor maneira de visualizar middlewares é como uma série de "camadas" que as requisições HTTP devem passar antes de atingir sua aplicação. Cada camada pode examinar a requisição e até mesmo rejeitá-la completamente.

::: tip
Todos os middlewares são resolvidos via <a target="_blank" href="/conceitos-de-arquitetura/service-container">service container</a>, então você pode tipar qualquer dependência que você precise dentro do construtor de um middleware.
:::

#### Middlaware e Respostas

Claro, um middleware pode realizar tarefas antes ou depois de passar a requisição. Por exemplo, o seguinte middleware realizaria alguma tarefa **antes** da requisição ser tratada pela aplicação:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BeforeMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Perform action

        return $next($request);
    }
}
```

No entanto, este middleware realizaria sua tarefa **depois** da requisição ser tratada pela aplicação:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AfterMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Perform action

        return $response;
    }
}
```

## Registrando Middlewares

### Middleware Global

Se você deseja que um middleware seja executado durante cada requisição, você pode adicioná-lo ao grupo de middlewares globais no arquivo `bootstrap/app.php` da sua aplicação:

```php
use App\Http\Middleware\EnsureTokenIsValid;

->withMiddleware(function (Middleware $middleware) {
     $middleware->append(EnsureTokenIsValid::class);
})
```

O objeto `$middleware` fornecido para o closure `withMiddleware` é uma instância de `Illuminate\Foundation\Configuration\Middleware` e é responsável por gerenciar os middlewares atribuídos às rotas da sua aplicação. O método `append` adiciona o middleware ao final da lista de middlewares globais. Se você deseja adicionar um middleware ao início da lista, você deve usar o método `prepend`.

#### Gerenciando os Middlewares Globais Padrões do Laravel

Se você deseja gerenciar manualmente os middlewares globais do Laravel, você pode fornecer o stack padrão de middlewares globais do Laravel para o método `use`. Então, você pode ajustar o stack de middlewares padrão conforme necessário:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->use([
        \Illuminate\Foundation\Http\Middleware\InvokeDeferredCallbacks::class,
        // \Illuminate\Http\Middleware\TrustHosts::class,
        \Illuminate\Http\Middleware\TrustProxies::class,
        \Illuminate\Http\Middleware\HandleCors::class,
        \Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Http\Middleware\ValidatePostSize::class,
        \Illuminate\Foundation\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ]);
})
```

### Associando Middlewares a Rotas

Se você deseja associar middlewares a rotas específicas, você pode utilizar o método `middleware` ao definir uma rota:

```php
use App\Http\Middleware\EnsureTokenIsValid;

Route::get('/profile', function () {
    // ...
})->middleware(EnsureTokenIsValid::class);
```

Você pode associar vários middlewares a uma rota passando um array de middlewares para o método `middleware`:

```php
Route::get('/', function () {
    // ...
})->middleware([First::class, Second::class]);
```

### Ignorando Middlewares

Quando você atribui middlewares a um grupo de rotas, ocasionalmente você pode precisar impedir que o middleware seja aplicado a uma rota específica dentro do grupo. Você pode fazer isso usando o método `withoutMiddleware`:

```php
use App\Http\Middleware\EnsureTokenIsValid;

Route::middleware([EnsureTokenIsValid::class])->group(function () {
    Route::get('/', function () {
        // ...
    });

    Route::get('/profile', function () {
        // ...
    })->withoutMiddleware([EnsureTokenIsValid::class]);
});
```

Você também pode excluir um conjunto específico de middlewares de um <a href="/fundamentos/rotas#grupos-de-rotas" target="_blank">grupo</a> de rotas:

```php
use App\Http\Middleware\EnsureTokenIsValid;

Route::withoutMiddleware([EnsureTokenIsValid::class])->group(function () {
    Route::get('/profile', function () {
        // ...
    });
});
```

O método `withoutMiddleware` só pode remover middlewares de rota e não se aplica a [middlewares globais](#middleware-global).

### Grupos de Middlewares

Às vezes, você pode querer agrupar vários middlewares sob uma única chave para torná-los mais fáceis de atribuir a rotas. Você pode fazer isso usando o método `appendToGroup` dentro do arquivo `bootstrap/app.php` da sua aplicação:

```php
use App\Http\Middleware\First;
use App\Http\Middleware\Second;

->withMiddleware(function (Middleware $middleware) {
    $middleware->appendToGroup('nome-do-grupo', [
        First::class,
        Second::class,
    ]);

    $middleware->prependToGroup('nome-do-grupo', [
        First::class,
        Second::class,
    ]);
})
```

Grupos de middlewares podem ser atribuídos a rotas e ações de controllers usando a mesma sintaxe que middlewares individuais:

```php
Route::get('/', function () {
    // ...
})->middleware('nome-do-grupo');

Route::middleware(['nome-do-grupo'])->group(function () {
    // ...
});
```

#### Grupos de Middlewares Padrões do Laravel

O Laravel inclui os grupos de middlewares predefinidos `web` e `api` que contêm middlewares comuns que você pode querer aplicar às suas rotas web e API. Lembre-se, o Laravel aplica automaticamente esses grupos de middlewares aos arquivos correspondentes `routes/web.php` e `routes/api.php`:

<table>
  <thead>
    <tr>
      <th>O grupo <code>web</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>Illuminate\Cookie\Middleware\EncryptCookies</code></td>
    </tr>
    <tr>
      <td><code>Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse</code></td>
    </tr>
    <tr>
      <td><code>Illuminate\Session\Middleware\StartSession</code></td>
    </tr>
    <tr>
      <td><code>Illuminate\View\Middleware\ShareErrorsFromSession</code></td>
    </tr>
    <tr>
      <td><code>Illuminate\Foundation\Http\Middleware\ValidateCsrfToken</code></td>
    </tr>
    <tr>
      <td><code>Illuminate\Routing\Middleware\SubstituteBindings</code></td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th>O grupo <code>api</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>Illuminate\Routing\Middleware\SubstituteBindings</code></td>
    </tr>
  </tbody>
</table>

Se você deseja adicionar ou remover middlewares de um grupo padrão do Laravel, você pode usar os métodos `web` e `api` dentro do arquivo `bootstrap/app.php`. Os métodos `web` e `api` são alternativas convenientes ao método `appendToGroup`:

```php
use App\Http\Middleware\EnsureTokenIsValid;
use App\Http\Middleware\EnsureUserIsSubscribed;
 
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        EnsureUserIsSubscribed::class,
    ]);
 
    $middleware->api(prepend: [
        EnsureTokenIsValid::class,
    ]);
})
```

Você pode substituir middlewares padrões do Laravel por middlewares personalizados:

```php
use App\Http\Middleware\StartCustomSession;
use Illuminate\Session\Middleware\StartSession;
 
$middleware->web(replace: [
    StartSession::class => StartCustomSession::class,
]);
```

Ou, você pode remover um middleware completamente:

```php
$middleware->web(remove: [
    StartSession::class,
]);
```

#### Gerenciando Grupos de Middlewares Padrões do Laravel

Se você deseja gerenciar os grupos `web` e `api` manualmente, você pode redefinir totalmente os grupos. O exemplo abaixo definirá os grupos `web` e `api` com seus middlewares padrões, permitindo que você os personalize conforme necessário:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->group('web', [
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        // \Illuminate\Session\Middleware\AuthenticateSession::class,
    ]);
 
    $middleware->group('api', [
        // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        // 'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ]);
})
```

::: tip
Por padrão, o Laravel aplica automaticamente os grupos de middlewares `web` e `api` aos arquivos correspondentes `routes/web.php` e `routes/api.php`.
:::

### Apelido de Middlewares (Middleware Aliases)

Você pode associar apelidos a middlewares no arquivo `bootstrap/app.php` da sua aplicação. Apelidos de middlewares permitem que você defina um apelido curto para uma determinada classe de middleware, o que pode ser especialmente útil para middlewares com nomes de classe longos:

```php
use App\Http\Middleware\EnsureUserIsSubscribed;
 
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'subscribed' => EnsureUserIsSubscribed::class
    ]);
})
```

Uma vez que o apelido de middleware tenha sido definido no arquivo `bootstrap/app.php` da sua aplicação, você pode usar o apelido ao atribuir o middleware a rotas:

```php
Route::get('/profile', function () {
    // ...
})->middleware('subscribed');
```

Por conveniência, alguns dos middlewares internos do Laravel são apelidados por padrão. Por exemplo, o middleware `auth` é um apelido para o middleware `Illuminate\Auth\Middleware\Authenticate`. Abaixo está uma lista dos apelidos de middlewares padrões do framework:

<table>
  <thead>
    <tr>
      <th>Apelido (Alias)</th>
      <th>Middleware</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>auth</code></td>
      <td><code>Illuminate\Auth\Middleware\Authenticate</code></td>
    </tr>
    <tr>
      <td><code>auth.basic</code></td>
      <td><code>Illuminate\Auth\Middleware\AuthenticateWithBasicAuth</code></td>
    </tr>
    <tr>
      <td><code>auth.session</code></td>
      <td><code>Illuminate\Session\Middleware\AuthenticateSession</code></td>
    </tr>
    <tr>
      <td><code>cache.headers</code></td>
      <td><code>Illuminate\Http\Middleware\SetCacheHeaders</code></td>
    </tr>
    <tr>
      <td><code>can</code></td>
      <td><code>Illuminate\Auth\Middleware\Authorize</code></td>
    </tr>
    <tr>
      <td><code>guest</code></td>
      <td><code>Illuminate\Auth\Middleware\RedirectIfAuthenticated</code></td>
    </tr>
    <tr>
      <td><code>password.confirm</code></td>
      <td><code>Illuminate\Auth\Middleware\RequirePassword</code></td>
    </tr>
    <tr>
      <td><code>precognitive</code></td>
      <td><code>Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests</code></td>
    </tr>
    <tr>
      <td><code>signed</code></td>
      <td><code>Illuminate\Routing\Middleware\ValidateSignature</code></td>
    </tr>
    <tr>
      <td><code>subscribed</code></td>
      <td><code>\Spark\Http\Middleware\VerifyBillableIsSubscribed</code></td>
    </tr>
    <tr>
      <td><code>throttle</code></td>
      <td><code>Illuminate\Routing\Middleware\ThrottleRequests</code> or <code>Illuminate\Routing\Middleware\ThrottleRequestsWithRedis</code></td>
    </tr>
    <tr>
      <td><code>verified</code></td>
      <td><code>Illuminate\Auth\Middleware\EnsureEmailIsVerified</code></td>
    </tr>
  </tbody>
</table>

### Ordenando Middlewares

Raramente, você pode precisar que seus middlewares sejam executados em uma ordem específica, mas não ter controle sobre a ordem deles quando são atribuídos à rota. Nestas situações, você pode especificar a prioridade do seu middleware usando o método `priority` no arquivo `bootstrap/app.php` da sua aplicação:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->priority([
        \Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests::class,
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        \Illuminate\Routing\Middleware\ThrottleRequests::class,
        \Illuminate\Routing\Middleware\ThrottleRequestsWithRedis::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        \Illuminate\Contracts\Auth\Middleware\AuthenticatesRequests::class,
        \Illuminate\Auth\Middleware\Authorize::class,
    ]);
})
```

## Parâmetros de Middleware

Middlewares também podem receber parâmetros adicionais. Por exemplo, se sua aplicação precisa verificar se o usuário autenticado tem um determinado "cargo" antes de executar uma ação, você pode criar um middleware `EnsureUserHasRole` que recebe um "cargo" como argumento adicional.

Parâmetros de middleware adicionais serão passados após o argumento `$next`:

```php
<?php
 
namespace App\Http\Middleware;
 
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
 
class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (! $request->user()->hasRole($role)) {
            // Redirect...
        }
 
        return $next($request);
    }
 
}
```

Parâmetros de middleware podem ser especificados ao definir a rota separando o nome do middleware e os parâmetros com `:`:

```php
use App\Http\Middleware\EnsureUserHasRole;
 
Route::put('/post/{id}', function (string $id) {
    // ...
})->middleware(EnsureUserHasRole::class.':editor');
```

Múltiplos parâmetros podem ser delimitados por vírgulas:

```php
Route::put('/post/{id}', function (string $id) {
    // ...
})->middleware(EnsureUserHasRole::class.':editor,publisher');
```

## Terminable Middleware

Algumas vezes um middleware pode precisar fazer algum trabalho após a resposta HTTP ter sido enviada para o navegador. Se você definir um método `terminate` no seu middleware e seu servidor web estiver usando FastCGI, o método `terminate` será automaticamente chamado após a resposta ser enviada para o navegador:

```php
<?php
 
namespace Illuminate\Session\Middleware;
 
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
 
class TerminatingMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }
 
    /**
     * Handle tasks after the response has been sent to the browser.
     */
    public function terminate(Request $request, Response $response): void
    {
        // ...
    }
}
```

O método `terminate` deve receber tanto a requisição quanto a resposta. Uma vez que você tenha definido um middleware terminável, você deve adicioná-lo à lista de rotas ou middlewares globais no arquivo `bootstrap/app.php` da sua aplicação.

Quando chamado o método `terminate` no seu middleware, o Laravel irá resolver uma nova instância do middleware a partir do <a href="/conceitos-de-arquitetura/service-container" target="_blank">service container</a>. Se você deseja usar a mesma instância do middleware quando os métodos `handle` e `terminate` são chamados, registre o middleware com o container usando o método `singleton` do container. Tipicamente, isso deve ser feito no método `register` do seu `AppServiceProvider`:

```php
use App\Http\Middleware\TerminatingMiddleware;
 
/**
 * Register any application services.
 */
public function register(): void
{
    $this->app->singleton(TerminatingMiddleware::class);
}
```