# Service Providers

## Introdução

Service providers são o ponto central de toda a inicialização de aplicativos Laravel. Seu próprio aplicativo, bem como todos os serviços principais do Laravel, são inicializados por meio de service providers.

Mas, o que queremos dizer com "inicializado"? Em geral, queremos dizer <strong>registrar</strong> coisas, incluindo registros de service containers, event listeners, middlewares e até mesmo rotas. Os service providers são o ponto central para configurar seu aplicativo.

O Laravel usa dezenas de service providers internamente para inicializar seus serviços principais, como o mailer, filas, cache e outros. Muitos desses providers são providers "deferred", o que significa que eles não serão carregados em todas as solicitações, mas apenas quando os serviços que eles fornecem são realmente necessários.

Todos os service providers definidos pelo usuário são registrados no arquivo <code>bootstrap/providers.php</code>. Na documentação a seguir, você aprenderá a escrever seus próprios service providers e registrá-los com seu aplicativo Laravel.

::: tip 
Se você deseja aprender mais sobre como o Laravel lida com requisições internamente, confira nossa documentação sobre o <a href="/conceitos-de-arquitetura/ciclo-de-vida-da-requisicao" target="_blank">ciclo de vida da requisição</a> do Laravel.
:::

## Criando Service Providers

Todos os service providers estendem a classe `Illuminate\Support\ServiceProvider`. A maioria dos service providers contém um método `register` e um método `boot`. Dentro do método `register`, você deve <strong>apenas vincular coisas no <a href="/conceitos-de-arquitetura/service-container" target="_blank">service container</a></strong>. Você nunca deve tentar registrar nenhum listener de eventos, rotas ou qualquer outra funcionalidade dentro do método `register`.

O Artisan pode gerar um novo provider via o comando `make:provider`. O Laravel registrará automaticamente seu novo provider no arquivo `bootstrap/providers.php` de sua aplicação:

```shell
php artisan make:provider RiakServiceProvider
```

### O Método `Register`

Como mencionado anteriormente, dentro do método `register`, você deve apenas vincular coisas no <a href="/conceitos-de-arquitetura/service-container" target="_blank">service container</a>. Você nunca deve tentar registrar nenhum listener de eventos, rotas ou qualquer outra funcionalidade dentro do método `register`. Caso contrário, você pode usar acidentalmente um serviço que é fornecido por um service provider que ainda não foi carregado.

Vamos dar uma olhada em um service provider básico. Dentro de qualquer um dos métodos do seu service provider, você sempre tem acesso à propriedade `$app` que fornece acesso ao service container:

```php
<?php
 
namespace App\Providers;
 
use App\Services\Riak\Connection;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;
 
class RiakServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(Connection::class, function (Application $app) {
            return new Connection(config('riak'));
        });
    }
}
```

Este service provider apenas define um método `register`, e usa esse método para definir uma implementação de `App\Services\Riak\Connection` no service container. Se você ainda não está familiarizado com o service container do Laravel, confira a <a href="/conceitos-de-arquitetura/service-container" target="_blank">documentação</a> sobre ele.

#### As Propriedades Bindings e Singletons

Se o seu service provider registrar muitos bindings simples, você pode desejar usar as propriedades `bindings` e `singletons` em vez de registrar manualmente cada binding do container. Quando o service provider é carregado pelo framework, ele verificará automaticamente essas propriedades e registrará seus bindings:

```php
<?php
 
namespace App\Providers;
 
use App\Contracts\DowntimeNotifier;
use App\Contracts\ServerProvider;
use App\Services\DigitalOceanServerProvider;
use App\Services\PingdomDowntimeNotifier;
use App\Services\ServerToolsProvider;
use Illuminate\Support\ServiceProvider;
 
class AppServiceProvider extends ServiceProvider
{
    /**
     * Todos os bindings do container que devem ser registrados.
     *
     * @var array
     */
    public $bindings = [
        ServerProvider::class => DigitalOceanServerProvider::class,
    ];
 
    /**
     * Todos os singletons do container que devem ser registrados.
     *
     * @var array
     */
    public $singletons = [
        DowntimeNotifier::class => PingdomDowntimeNotifier::class,
        ServerProvider::class => ServerToolsProvider::class,
    ];
}
```

### O Método `Boot`

Então, e se precisarmos registrar um <a href="/fundamentos/views" target="_blank">View Composer</a> dentro do nosso service provider? Isso deve ser feito dentro do método `boot`. <strong>Este método é chamado após todos os outros service providers terem sido registrados</strong>, o que significa que você tem acesso a todos os outros serviços que foram registrados pelo framework:

```php
<?php
 
namespace App\Providers;
 
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
 
class ComposerServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        View::composer('view', function () {
            // ...
        });
    }
}
```

#### Injeção de Dependência no Método `Boot`

Você pode tipar dependências para o método `boot` do seu service provider. O <a href="/conceitos-de-arquitetura/service-container" target="_blank">service container</a> injetará automaticamente quaisquer dependências que você precisar:

```php
use Illuminate\Contracts\Routing\ResponseFactory;
 
/**
 * Bootstrap any application services.
 */
public function boot(ResponseFactory $response): void
{
    $response->macro('serialized', function (mixed $value) {
        // ...
    });
}
```

## Registrando Service Providers

Todos os service providers são registrados no arquivo de configuração `bootstrap/providers.php`. Este arquivo retorna um array que contém os nomes de classe dos service providers de sua aplicação:

```php
<?php
 
return [
    App\Providers\AppServiceProvider::class,
];
```

Quando você utiliza o comando Artisan `make:provider`, o Laravel adicionará automaticamente o provider gerado ao arquivo `bootstrap/providers.php`. No entanto, se você criou manualmente a classe do provider, você deve adicionar manualmente a classe do provider ao array:

```php
<?php
 
return [
    App\Providers\AppServiceProvider::class,
    App\Providers\ComposerServiceProvider::class, // [!code ++]
];
```

## Deffered Providers

Se o seu provider está <strong>apenas</strong> registrando bindings no <a href="/conceitos-de-arquitetura/service-container" target="_blank">service container</a>, você pode optar por adiar seu registro até que um dos bindings registrados seja realmente necessário. Adiar o carregamento do provider melhorará o desempenho de sua aplicação, uma vez que ele não é carregado em cada requisição.

O Laravel compila e armazena uma lista de todos os serviços fornecidos por service providers adiados, juntamente com o nome de sua classe de service provider. Então, apenas quando você tentar resolver um desses serviços é que o Laravel carrega o service provider.

Para adiar o carregamento de um provider, implemente a interface `\Illuminate\Contracts\Support\DeferrableProvider` e defina um método `provides`. O método `provides` deve retornar os bindings do service container registrados pelo provider:

```php
<?php
 
namespace App\Providers;
 
use App\Services\Riak\Connection;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;
 
class RiakServiceProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(Connection::class, function (Application $app) {
            return new Connection($app['config']['riak']);
        });
    }
 
    /**
     * Get the services provided by the provider.
     *
     * @return array<int, string>
     */
    public function provides(): array
    {
        return [Connection::class];
    }
}
```