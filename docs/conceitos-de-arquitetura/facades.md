# Facades

## Introdução

Por toda a documentação, você verá exemplos de código que interagem com os recursos por meio de "facades". As facades fornecem uma interface "estática" para classes que estão disponíveis no <a href="/conceitos-de-arquitetura/service-container" target="_blank">service container</a>. O Laravel vem com muitas facades que fornecem acesso a quase todos os recursos do Laravel.

As facades do Laravel servem como "proxies estáticos" para classes subjacentes no service container, fornecendo o benefício de uma sintaxe concisa e expressiva, mantendo mais testabilidade e flexibilidade do que os métodos estáticos tradicionais. Está tudo bem se você não entender totalmente como as facades funcionam - apenas siga em frente e continue aprendendo sobre o Laravel.

Todas as facades do Laravel são definidas no namespace `Illuminate\Support\Facades`. Portanto, podemos acessar uma facade facilmente assim:

```php
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

Route::get('/cache', function () {
    return Cache::get('key');
});
```

Por toda a documentação, muitos dos exemplos usarão facades para demonstrar vários recursos do framework.

#### Helper Functions

Para complementar as facades, o Laravel oferece uma variedade de "funções auxiliares" globais que tornam ainda mais fácil interagir com recursos comuns do Laravel. Algumas das funções auxiliares comuns com as quais você pode interagir são `view`, `response`, `url`, `config` e muito mais. Cada função auxiliar oferecida pelo Laravel é documentada com seu recurso correspondente; no entanto, uma lista completa está disponível na documentação dedicada sobre <a href="/conhecendo-mais/helpers" target="_blank">funções auxiliares</a>.

Por exemplo, em vez de usar a facade `Illuminate\Support\Facades\Response` para gerar uma resposta JSON, podemos simplesmente usar a função `response`. Como as funções auxiliares estão globalmente disponíveis, você não precisa importar nenhuma classe para usá-las:

```php
use Illuminate\Support\Facades\Response;

Route::get('/users', function () {
    return Response::json([
        // ...
    ]);
});

Route::get('/users', function () {
    return response()->json([
        // ...
    ]);
});
```

## Quando Utilizar Facades

As facades têm muitos benefícios. Elas fornecem uma sintaxe concisa e que permite que você use os recursos do Laravel sem precisar lembrar de nomes longos de classes que devem ser injetadas ou configuradas manualmente. Além disso, devido ao uso exclusivo dos métodos dinâmicos do PHP, elas são fáceis de testar.

No entanto, é preciso ter cuidado ao usar facades. O principal perigo das facades é o "escopo da classe". Como as facades são tão fáceis de usar e não requerem injeção, pode ser fácil deixar suas classes continuarem crescendo e usar muitas facades em uma única classe. Usando injeção de dependência, esse potencial é mitigado pelo feedback visual de um grande construtor que lhe dá a impressão de que sua classe está crescendo demais. Portanto, ao usar facades, preste atenção especial ao tamanho de sua classe para que seu escopo de responsabilidade permaneça estreito. Se sua classe estiver ficando muito grande, considere dividi-la em várias classes menores.

### Facades vs. Injeção de Dependência

Um dos principais benefícios da injeção de dependência é a capacidade de trocar implementações da classe injetada. Isso é útil durante os testes, pois você pode injetar um mock ou stub e afirmar que vários métodos foram chamados no stub.

Normalmente, não seria possível mockar um método de classe verdadeiramente estático. No entanto, como as facades usam métodos dinâmicos para fazer chamadas de método a objetos resolvidos do service container, na verdade podemos testar facades da mesma forma que testaríamos uma instância de classe injetada. Por exemplo, dado o seguinte roteamento:

```php
use Illuminate\Support\Facades\Cache;

Route::get('/cache', function () {
    return Cache::get('key');
});
```

Usando os métodos de teste de facades, podemos escrever o seguinte teste para verificar se o método `Cache::get` foi chamado com o argumento que esperávamos:

::: code-group

```php [Pest]
use Illuminate\Support\Facades\Cache;

test('exemplo básico', function () {
    Cache::shouldReceive('get')
         ->with('key')
         ->andReturn('value');

    $response = $this->get('/cache');

    $response->assertSee('value');
});
```

```php [PHPUnit]
use Illuminate\Support\Facades\Cache;

/**
 * Um exemplo básico de teste funcional.
 */
public function test_exemplo_basico(): void
{
    Cache::shouldReceive('get')
         ->with('key')
         ->andReturn('value');

    $response = $this->get('/cache');

    $response->assertSee('value');
}
```

:::

### Facades vs. Helper Functions

Além das facades, o Laravel inclui uma variedade de "funções auxiliares" que podem realizar tarefas comuns, como gerar views, disparar eventos, disparar jobs ou enviar responses HTTP. Muitas dessas funções auxiliares realizam a mesma função que uma facade correspondente. Por exemplo, esta chamada de facade e chamada de função auxiliar são equivalentes:

```php
return Illuminate\Support\Facades\View::make('profile');

return view('profile');
```

Na prática, não há diferença entre facades e funções auxiliares. Ao usar funções auxiliares, você ainda pode testá-las exatamente como faria com a facade correspondente. Por exemplo, dado o seguinte roteamento:

```php
Route::get('/cache', function () {
    return cache('key');
});
```

O helper `cache` vai chamar o método `get` na classe subjacente da facade `Cache`. Portanto, mesmo que estejamos usando a função auxiliar, podemos escrever o seguinte teste para verificar se o método foi chamado com o argumento que esperávamos:

```php
use Illuminate\Support\Facades\Cache;

/**
 * Um exemplo básico de teste funcional.
 */
public function test_exemplo_basico(): void
{
    Cache::shouldReceive('get')
         ->with('key')
         ->andReturn('value');

    $response = $this->get('/cache');

    $response->assertSee('value');
}
```

## Como as Facades Funcionam

Em uma aplicação Laravel, <span class="highlight">uma facade é uma classe que fornece acesso a um objeto do container</span>. O mecanismo que faz isso funcionar está na classe `Facade`. As facades do Laravel, e quaisquer facades personalizadas que você criar, estenderão a classe base `Illuminate\Support\Facades\Facade`.

A classe base `Facade` faz uso do método mágico `__callStatic()` para adiar chamadas de sua facade para um objeto resolvido do container. No exemplo abaixo, uma chamada é feita ao sistema de cache do Laravel. Ao olhar para este código, alguém poderia assumir que o método estático `get` está sendo chamado na classe `Cache`:

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * Show the profile for the given user.
     */
    public function showProfile(string $id): View
    {
        $user = Cache::get('user:'.$id);

        return view('profile', ['user' => $user]);
    }
}
```

Observe que no início do arquivo estamos "importando" a facade Cache. Esta facade serve como um atalho para acessar a implementação subjacente da interface `Illuminate\Contracts\Cache\Factory`. Qualquer chamada feita usando a facade será direcionada para a instância real do serviço de cache do Laravel.

Se olharmos para a classe `Illuminate\Support\Facades\Cache`, veremos que não há um método estático `get`:

```php
class Cache extends Facade
{
    /**
     * Get the registered name of the component.
     */
    protected static function getFacadeAccessor(): string
    {
        return 'cache';
    }
}
```

Em vez disso, a facade `Cache` estende a classe base `Facade` e define o método `getFacadeAccessor()`. A função deste método é retornar o nome de um binding do service container. Quando um usuário referencia qualquer método estático na facade `Cache`, o Laravel resolve o binding `cache` do <a href="/conceitos-de-arquitetura/service-container" target="_blank">service container</a> e chama o método solicitado no objeto retornado.

## Real-Time Facades

Usando real-time facades, você pode tratar qualquer classe em sua aplicação como se fosse uma facade. Para ilustrar como isso pode ser usado, vamos primeiro examinar algum código que não usa facades em tempo real. Por exemplo, vamos assumir que nosso model `Podcast` tem um método `publish`. No entanto, para publicar o podcast, precisamos injetar uma instância de `Publisher`:

```php
<?php

namespace App\Models;

use App\Contracts\Publisher;
use Illuminate\Database\Eloquent\Model;

class Podcast extends Model
{
    /**
     * Publish the podcast.
     */
    public function publish(Publisher $publisher): void
    {
        $this->update(['publishing' => now()]);

        $publisher->publish($this);
    }
}
```

Injetar uma implementação de publisher no método nos permite testar facilmente o método de forma isolada, pois podemos simular o publisher injetado. No entanto, isso requer que sempre passemos uma instância de `Publisher` cada vez que chamamos o método `publish`. Usando real-time facades, podemos manter a mesma testabilidade sem sermos obrigados a passar explicitamente uma instância de `Publisher`. Para gerar uma real-time facade, prefixe o namespace da classe importada com `Facades`:

```php
<?php

namespace App\Models;

use App\Contracts\Publisher;  // [!code --]
use Facades\App\Contracts\Publisher;  // [!code ++]
use Illuminate\Database\Eloquent\Model;

class Podcast extends Model
{
    /**
     * Publish the podcast.
     */
    public function publish(Publisher $publisher): void  // [!code --]
    public function publish(): void  // [!code ++]
    {
        $this->update(['publishing' => now()]);

        $publisher->publish($this); // [!code --]
        Publisher::publish($this); // [!code ++]
    }
}
```

Quando a real-time facade é usada, a implementação do publisher será resolvida do service container usando a parte da interface ou nome da classe que aparece após o prefixo `Facades`. Ao testar, podemos usar os auxiliares de teste de facade integrados do Laravel para simular essa chamada de método:

::: code-group

```php [Pest]
<?php

use App\Models\Podcast;
use Facades\App\Contracts\Publisher;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('podcast can be published', function () {
    $podcast = Podcast::factory()->create();

    Publisher::shouldReceive('publish')->once()->with($podcast);

    $podcast->publish();
});
```

```php [PHPUnit]
<?php

namespace Tests\Feature;

use App\Models\Podcast;
use Facades\App\Contracts\Publisher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PodcastTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A test example.
     */
    public function test_podcast_can_be_published(): void
    {
        $podcast = Podcast::factory()->create();

        Publisher::shouldReceive('publish')->once()->with($podcast);

        $podcast->publish();
    }
}
```

## Referência de Classes de Facade

Abaixo você encontrará todas as facades e suas classes subjacentes. Esta é uma ferramenta útil para mergulhar rapidamente na documentação da API para uma determinada raiz de facade. A chave de <a href="/conceitos-de-arquitetura/service-container" target="_blank">binding do service container</a> também é incluída quando aplicável.

<table>
  <thead>
    <tr>
      <th>Facade</th>
      <th>Classe</th>
      <th>Binding do Container</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>App</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Foundation/Application.html">Illuminate\Foundation\Application</a></td>
      <td><code>app</code></td>
    </tr>
    <tr>
      <td>Artisan</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Contracts/Console/Kernel.html">Illuminate\Contracts\Console\Kernel</a></td>
      <td><code>artisan</code></td>
    </tr>
    <tr>
      <td>Auth (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Contracts/Auth/Guard.html">Illuminate\Contracts\Auth\Guard</a></td>
      <td><code>auth.driver</code></td>
    </tr>
    <tr>
      <td>Auth</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Auth/AuthManager.html">Illuminate\Auth\AuthManager</a></td>
      <td><code>auth</code></td>
    </tr>
    <tr>
      <td>Blade</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/View/Compilers/BladeCompiler.html">Illuminate\View\Compilers\BladeCompiler</a></td>
      <td><code>blade.compiler</code></td>
    </tr>
    <tr>
      <td>Broadcast (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Contracts/Broadcasting/Broadcaster.html">Illuminate\Contracts\Broadcasting\Broadcaster</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Broadcast</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Contracts/Broadcasting/Factory.html">Illuminate\Contracts\Broadcasting\Factory</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Bus</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Contracts/Bus/Dispatcher.html">Illuminate\Contracts\Bus\Dispatcher</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Cache (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Cache/Repository.html">Illuminate\Cache\Repository</a></td>
      <td><code>cache.store</code></td>
    </tr>
    <tr>
      <td>Cache</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Cache/CacheManager.html">Illuminate\Cache\CacheManager</a></td>
      <td><code>cache</code></td>
    </tr>
    <tr>
      <td>Config</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Config/Repository.html">Illuminate\Config\Repository</a></td>
      <td><code>config</code></td>
    </tr>
    <tr>
      <td>Context</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Log/Context/Repository.html">Illuminate\Log\Context\Repository</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Cookie</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Cookie/CookieJar.html">Illuminate\Cookie\CookieJar</a></td>
      <td><code>cookie</code></td>
    </tr>
    <tr>
      <td>Crypt</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Encryption/Encrypter.html">Illuminate\Encryption\Encrypter</a></td>
      <td><code>encrypter</code></td>
    </tr>
    <tr>
      <td>Date</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Support/DateFactory.html">Illuminate\Support\DateFactory</a></td>
      <td><code>date</code></td>
    </tr>
    <tr>
      <td>DB (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Database/Connection.html">Illuminate\Database\Connection</a></td>
      <td><code>db.connection</code></td>
    </tr>
    <tr>
      <td>DB</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Database/DatabaseManager.html">Illuminate\Database\DatabaseManager</a></td>
      <td><code>db</code></td>
    </tr>
    <tr>
      <td>Event</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Events/Dispatcher.html">Illuminate\Events\Dispatcher</a></td>
      <td><code>events</code></td>
    </tr>
    <tr>
      <td>Exceptions (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Contracts/Debug/ExceptionHandler.html">Illuminate\Contracts\Debug\ExceptionHandler</a></td>
    <td> </td>
    </tr>
    <tr>
      <td>Exceptions</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Foundation/Exceptions/Handler.html">Illuminate\Foundation\Exceptions\Handler</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>File</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Filesystem/Filesystem.html">Illuminate\Filesystem\Filesystem</a></td>
      <td><code>files</code></td>
    </tr>
    <tr>
      <td>Gate</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Contracts/Auth/Access/Gate.html">Illuminate\Contracts\Auth\Access\Gate</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Hash</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Contracts/Hashing/Hasher.html">Illuminate\Contracts\Hashing\Hasher</a></td>
      <td><code>hash</code></td>
    </tr>
    <tr>
      <td>Http</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Http/Client/Factory.html">Illuminate\Http\Client\Factory</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Lang</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Translation/Translator.html">Illuminate\Translation\Translator</a></td>
      <td><code>translator</code></td>
    </tr>
    <tr>
      <td>Log</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Log/LogManager.html">Illuminate\Log\LogManager</a></td>
      <td><code>log</code></td>
    </tr>
    <tr>
      <td>Mail</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Mail/Mailer.html">Illuminate\Mail\Mailer</a></td>
      <td><code>mailer</code></td>
    </tr>
    <tr>
      <td>Notification</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Notifications/ChannelManager.html">Illuminate\Notifications\ChannelManager</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Password (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Auth/Passwords/PasswordBroker.html">Illuminate\Auth\Passwords\PasswordBroker</a></td>
      <td><code>auth.password.broker</code></td>
    </tr>
    <tr>
      <td>Password</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Auth/Passwords/PasswordBrokerManager.html">Illuminate\Auth\Passwords\PasswordBrokerManager</a></td>
      <td><code>auth.password</code></td>
    </tr>
    <tr>
      <td>Pipeline (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Pipeline/Pipeline.html">Illuminate\Pipeline\Pipeline</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Process</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Process/Factory.html">Illuminate\Process\Factory</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Queue (Base Class)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Queue/Queue.html">Illuminate\Queue\Queue</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Queue (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Contracts/Queue/Queue.html">Illuminate\Contracts\Queue\Queue</a></td>
      <td><code>queue.connection</code></td>
    </tr>
    <tr>
      <td>Queue</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Queue/QueueManager.html">Illuminate\Queue\QueueManager</a></td>
      <td><code>queue</code></td>
    </tr>
    <tr>
      <td>RateLimiter</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Cache/RateLimiter.html">Illuminate\Cache\RateLimiter</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Redirect</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Routing/Redirector.html">Illuminate\Routing\Redirector</a></td>
      <td><code>redirect</code></td>
    </tr>
    <tr>
      <td>Redis (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Redis/Connections/Connection.html">Illuminate\Redis\Connections\Connection</a></td>
      <td><code>redis.connection</code></td>
    </tr>
    <tr>
      <td>Redis</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Redis/RedisManager.html">Illuminate\Redis\RedisManager</a></td>
      <td><code>redis</code></td>
    </tr>
    <tr>
      <td>Request</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Http/Request.html">Illuminate\Http\Request</a></td>
      <td><code>request</code></td>
    </tr>
    <tr>
      <td>Response (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Http/Response.html">Illuminate\Http\Response</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Response</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Contracts/Routing/ResponseFactory.html">Illuminate\Contracts\Routing\ResponseFactory</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Route</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Routing/Router.html">Illuminate\Routing\Router</a></td>
      <td><code>router</code></td>
    </tr>
    <tr>
      <td>Schedule</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Console/Scheduling/Schedule.html">Illuminate\Console\Scheduling\Schedule</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Schema</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Database/Schema/Builder.html">Illuminate\Database\Schema\Builder</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Session (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Session/Store.html">Illuminate\Session\Store</a></td>
      <td><code>session.store</code></td>
    </tr>
    <tr>
      <td>Session</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Session/SessionManager.html">Illuminate\Session\SessionManager</a></td>
      <td><code>session</code></td>
    </tr>
    <tr>
      <td>Storage (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Contracts/Filesystem/Filesystem.html">Illuminate\Contracts\Filesystem\Filesystem</a></td>
      <td><code>filesystem.disk</code></td>
    </tr>
    <tr>
      <td>Storage</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Filesystem/FilesystemManager.html">Illuminate\Filesystem\FilesystemManager</a></td>
      <td><code>filesystem</code></td>
    </tr>
    <tr>
      <td>URL</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Routing/UrlGenerator.html">Illuminate\Routing\UrlGenerator</a></td>
      <td><code>url</code></td>
    </tr>
    <tr>
      <td>Validator (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Validation/Validator.html">Illuminate\Validation\Validator</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>Validator</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Validation/Factory.html">Illuminate\Validation\Factory</a></td>
      <td><code>validator</code></td>
    </tr>
    <tr>
      <td>View (Instance)</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/View/View.html">Illuminate\View\View</a></td>
      <td> </td>
    </tr>
    <tr>
      <td>View</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/View/Factory.html">Illuminate\View\Factory</a></td>
      <td><code>view</code></td>
    </tr>
    <tr>
      <td>Vite</td>
      <td><a href="https://laravel.com/api/11.x/Illuminate/Foundation/Vite.html">Illuminate\Foundation\Vite</a></td>
      <td> </td>
    </tr>
  </tbody>
</table>
