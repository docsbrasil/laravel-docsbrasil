# Service Container 

## Introdução

O Service Container do Laravel é uma ferramenta poderosa para gerenciar dependências de classes e realizar injeção de dependências. Injeção de dependência é uma frase sofisticada que essencialmente significa o seguinte: as dependências de classe são "injetadas" na classe via construtor ou, em alguns casos, métodos "setter".

Vamos olhar para um exemplo simples:

```php
<?php
 
namespace App\Http\Controllers;
 
use App\Services\AppleMusic;
use Illuminate\View\View;
 
class PodcastController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        protected AppleMusic $apple,
    ) {}
 
    /**
     * Show information about the given podcast.
     */
    public function show(string $id): View
    {
        return view('podcasts.show', [
            'podcast' => $this->apple->findPodcast($id)
        ]);
    }
}
```

Neste exemplo, o `PodcastController` precisa recuperar podcasts de uma fonte de dados, como a Apple Music. Portanto, iremos **injetar** um serviço que é capaz de recuperar podcasts. Como o serviço é injetado, somos capazes de facilmente "mockar", ou criar uma implementação falsa do serviço `AppleMusic` ao testar nossa aplicação.

Um entendimento profundo do service container do Laravel é essencial para construir uma aplicação grande e poderosa, bem como para contribuir com o core do Laravel.

### Resolução sem configuração

Se uma classe não tem dependências ou depende apenas de outras classes concretas (não interfaces), o container não precisa ser instruído sobre como resolver essa classe. Por exemplo, você pode colocar o seguinte código em seu arquivo `routes/web.php`:

```php
<?php
 
class Service
{
    // ...
}
 
Route::get('/', function (Service $service) {
    die($service::class);
});
```

Neste exemplo, acessar a rota `/` da sua aplicação irá automaticamente resolver a classe `Service` e injetá-la no handler da sua rota. Isso é revolucionário. Significa que você pode desenvolver sua aplicação e aproveitar a injeção de dependência sem se preocupar com arquivos de configuração inchados.

Felizmente, muitas das classes que você escreverá ao construir uma aplicação Laravel receberão automaticamente suas dependências via container, incluindo <a href="/fundamentos/controllers" target="_blank">controllers</a>, <a href="/conhecendo-mais/eventos" target="_blank">event listeners</a>, <a href="/fundamentos/middleware" target="_blank">middlewares</a>, e muito mais. Além disso, você pode fazer type-hint das dependências no método `handle` de <a href="/conhecendo-mais/filas" target="_blank">jobs em fila</a>. Uma vez que você experimenta o poder da injeção de dependência automática, parece impossível desenvolver sem ela.

### Quando Utilizar o Container

Graças à resolução sem configuração, você frequentemente fará type-hint de dependências em rotas, controllers, event listeners e em outros lugares sem nunca interagir manualmente com o container. Por exemplo, você pode fazer type-hint do objeto `Illuminate\Http\Request` na definição de sua rota para que você possa facilmente acessar a requisição atual. Mesmo que nunca tenhamos que interagir com o container para escrever este código, ele está gerenciando a injeção dessas dependências nos bastidores:

```php
use Illuminate\Http\Request;
 
Route::get('/', function (Request $request) {
    // ...
});
```

Em muitos casos, graças à injeção de dependência automática e <a href="/conceitos-de-arquitetura/facades" target="_blank">facades</a>, você pode construir aplicações Laravel sem **nunca** vincular ou resolver manualmente nada do container. **Então, quando você interagiria manualmente com o container?** Vamos examinar duas situações.

Primeiro, se você escrever uma classe que implementa uma interface e deseja fazer type-hint dessa interface em uma rota ou construtor de classe, você deve <a href="#binding-de-interfaces-a-implementacoes">dizer ao container como resolver essa interface</a>. Em segundo lugar, se você estiver <a href="/conhecendo-mais/desenvolvimento-de-pacotes" target="_blank">desenvolvendo um pacote Laravel</a> que planeja compartilhar com outros desenvolvedores Laravel, você pode precisar vincular os serviços do seu pacote no container.

## Bindings

### Binding Básicos

#### Binding Simples

Muitos dos seus bindings do service container serão registrados dentro de <a href="/conceitos-de-arquitetura/service-providers">service providers</a>, então a maioria desses exemplos demonstrará o uso do container nesse contexto.

Dentro de um service provider, você sempre tem acesso ao container via a propriedade `$this->app`. Podemos registrar um binding usando o método `bind`, passando o nome da classe ou interface que desejamos registrar juntamente com um closure que retorna uma instância da classe:

```php
use App\Services\Transistor;
use App\Services\PodcastParser;
use Illuminate\Contracts\Foundation\Application;
 
$this->app->bind(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```

Note que recebemos o container em si como um argumento para o resolver. Podemos então usar o container para resolver sub-dependências do objeto que estamos construindo.

Como mencionado, você normalmente estará interagindo com o container dentro de service providers; no entanto, se você deseja interagir com o container fora de um service provider, você pode fazer isso via facade `App`:

```php
use App\Services\Transistor;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\App;
 
App::bind(Transistor::class, function (Application $app) {
    // ...
});
```

Você pode usar o método `bindIf` para registrar um binding no container apenas se um binding ainda não tiver sido registrado para o tipo fornecido:

```php
$this->app->bindIf(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```

::: tip
Não há necessidade de vincular classes ao container se elas não dependem de nenhuma interface. O container não precisa ser instruído sobre como construir esses objetos, pois pode resolvê-los automaticamente usando a Reflection API.
:::

#### Binding de Singletons

O método `singleton` vincula uma classe ou interface no container que deve ser resolvida apenas uma vez. Uma vez que um binding singleton é resolvido, a mesma instância do objeto será retornada em chamadas subsequentes ao container:

```php
use App\Services\Transistor;
use App\Services\PodcastParser;
use Illuminate\Contracts\Foundation\Application;
 
$this->app->singleton(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```

Você pode usar o método `singletonIf` para registrar um binding de singleton no container apenas se um binding ainda não tiver sido registrado para o tipo fornecido:

```php
$this->app->singletonIf(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```

#### Binding de Singletons Scoped

O método `scoped` vincula uma classe ou interface no container que deve ser resolvida apenas uma vez dentro de um determinado ciclo de vida de uma requisição / job. Embora este método seja semelhante ao método `singleton`, as instâncias registradas usando o método `scoped` serão descartadas sempre que a aplicação Laravel iniciar um novo "ciclo de vida", como quando um worker do <a href="/pacotes/octane">Laravel Octane</a> processa uma nova requisição ou quando um <a href="/conhecendo-mais/filas">worker de uma fila</a> processa um novo job:

```php
use App\Services\Transistor;
use App\Services\PodcastParser;
use Illuminate\Contracts\Foundation\Application;
 
$this->app->scoped(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```

Você pode usar o método `scopedIf` para registrar um binding de singleton no container apenas se um binding ainda não tiver sido registrado para o tipo fornecido:

```php
$this->app->scopedIf(Transistor::class, function (Application $app) {
    return new Transistor($app->make(PodcastParser::class));
});
```

#### Binding de Instâncias

Você também pode vincular uma instância de objeto existente no container usando o método `instance`. A instância fornecida sempre será retornada em chamadas subsequentes ao container:

```php
use App\Services\Transistor;
use App\Services\PodcastParser;
 
$service = new Transistor(new PodcastParser);
 
$this->app->instance(Transistor::class, $service);
```

### Binding de Interfaces a Implementações

Um recurso muito poderoso do service container é sua capacidade de vincular uma interface a uma implementação específica. Por exemplo, vamos assumir que temos uma interface `EventPusher` e uma implementação `RedisEventPusher`. Uma vez que tenhamos codificado nossa implementação `RedisEventPusher` dessa interface, podemos registrá-la no service container da seguinte forma:

```php
use App\Contracts\EventPusher;
use App\Services\RedisEventPusher;
 
$this->app->bind(EventPusher::class, RedisEventPusher::class);
```

Esta declaração diz ao container que ele deve injetar o `RedisEventPusher` quando uma classe precisar de uma implementação de `EventPusher`. Agora podemos fazer type-hint da interface `EventPusher` no construtor de uma classe que é resolvida pelo container. Lembre-se, controllers, event listeners, middlewares e vários outros tipos de classes dentro de aplicações Laravel sempre são resolvidos usando o container:

```php
use App\Contracts\EventPusher;
 
/**
 * Create a new class instance.
 */
public function __construct(
    protected EventPusher $pusher,
) {}
```

### Binding de Contexto Condicional

Às vezes, você pode ter duas classes que utilizam a mesma interface, mas deseja injetar diferentes implementações em cada classe. Por exemplo, dois controllers podem depender de diferentes implementações do contrato `Illuminate\Contracts\Filesystem\Filesystem`. O Laravel fornece uma fluent interface simples para definir esse comportamento:

```php
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\VideoController;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;
 
$this->app->when(PhotoController::class)
          ->needs(Filesystem::class)
          ->give(function () {
              return Storage::disk('local');
          });
 
$this->app->when([VideoController::class, UploadController::class])
          ->needs(Filesystem::class)
          ->give(function () {
              return Storage::disk('s3');
          });
```

### Atributos Contextuais

Como o binding contextual é frequentemente usado para injetar implementações de drivers ou valores de configuração, o Laravel oferece uma variedade de atributos de binding contextual que permitem injetar esses tipos de valores sem definir manualmente os bindings contextuais em seus service providers.

Por exemplo, o atributo `Storage` pode ser usado para injetar um <a href="/conhecendo-mais/armazenamento-de-arquivos">disco de armazenamento</a> específico:

```php
<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Container\Attributes\Storage;
use Illuminate\Contracts\Filesystem\Filesystem;
 
class PhotoController extends Controller
{
    public function __construct(
        #[Storage('local')] protected Filesystem $filesystem
    )
    {
        // ...
    }
}
```

Além do atributo `Storage`, o Laravel oferece os atributos `Auth`, `Cache`, `Config`, `DB`, `Log`, `RouteParameter`, e <a href="#tags"><code>Tag</code></a>:

```php
<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Container\Attributes\Auth;
use Illuminate\Container\Attributes\Cache;
use Illuminate\Container\Attributes\Config;
use Illuminate\Container\Attributes\DB;
use Illuminate\Container\Attributes\Log;
use Illuminate\Container\Attributes\Tag;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Contracts\Database\Connection;
use Psr\Log\LoggerInterface;
 
class PhotoController extends Controller
{
    public function __construct(
        #[Auth('web')] protected Guard $auth,
        #[Cache('redis')] protected Repository $cache,
        #[Config('app.timezone')] protected string $timezone,
        #[DB('mysql')] protected Connection $connection,
        #[Log('daily')] protected LoggerInterface $log,
        #[Tag('reports')] protected iterable $reports,
    )
    {
        // ...
    }
}
```

Além disso, o Laravel fornece um atributo `CurrentUser` para injetar o usuário autenticado atualmente em uma rota ou classe específica:

```php
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
 
Route::get('/user', function (#[CurrentUser] User $user) {
    return $user;
})->middleware('auth');
```

#### Definindo Atributos Contextuais Personalizados

Você pode criar seus próprios atributos contextuais implementando o contrato `Illuminate\Contracts\Container\ContextualAttribute`. O container chamará o método `resolve` do seu atributo, que deve resolver o valor que deve ser injetado na classe que utiliza o atributo. No exemplo abaixo, re-implementaremos o atributo `Config` integrado do Laravel:

```php
<?php
 
namespace App\Attributes;
 
use Illuminate\Contracts\Container\ContextualAttribute;
 
#[Attribute(Attribute::TARGET_PARAMETER)]
class Config implements ContextualAttribute
{
    /**
     * Create a new attribute instance.
     */
    public function __construct(public string $key, public mixed $default = null)
    {
    }
 
    /**
     * Resolve the configuration value.
     *
     * @param  self  $attribute
     * @param  \Illuminate\Contracts\Container\Container  $container
     * @return mixed
     */
    public static function resolve(self $attribute, Container $container)
    {
        return $container->make('config')->get($attribute->key, $attribute->default);
    }
}
```

### Bindings Primitivos

Às vezes, você pode ter uma classe que recebe algumas classes injetadas, mas também precisa de um valor primitivo injetado, como um inteiro. Você pode facilmente usar o binding contextual para injetar qualquer valor que sua classe possa precisar:

```php
use App\Http\Controllers\UserController;
 
$this->app->when(UserController::class)
          ->needs('$variableName')
          ->give($value);
```

Às vezes, uma classe pode depender de um array de instâncias <a href="#tags">tagged</a>. Usando o método `giveTagged`, você pode facilmente injetar todos os bindings do container com essa tag:

```php
$this->app->when(ReportAggregator::class)
    ->needs('$reports')
    ->giveTagged('reports');
```

Se você precisar injetar um valor de um dos arquivos de configuração de sua aplicação, você pode usar o método `giveConfig`:

```php
$this->app->when(ReportAggregator::class)
    ->needs('$timezone')
    ->giveConfig('app.timezone');
```

### Binding com Variádicos Tipados

Às vezes, você pode ter uma classe que recebe um array de objetos tipados usando um argumento variádico no construtor:

::: tip
Um argumento variádico permite que você passe um número variável de parâmetros para um método ou função, que são automaticamente agrupados em um array. No exemplo abaixo, a classe `Firewall` usa um argumento variádico para receber várias instâncias da classe `Filter`
:::

```php
<?php
 
use App\Models\Filter;
use App\Services\Logger;
 
class Firewall
{
    /**
     * The filter instances.
     *
     * @var array
     */
    protected $filters;
 
    /**
     * Create a new class instance.
     */
    public function __construct(
        protected Logger $logger,
        Filter ...$filters,
    ) {
        $this->filters = $filters;
    }
}
```

Usando o binding contextual, você pode resolver essa dependência fornecendo ao método `give` um closure que retorna um array de instâncias de `Filter` resolvidas:

```php
$this->app->when(Firewall::class)
          ->needs(Filter::class)
          ->give(function (Application $app) {
                return [
                    $app->make(NullFilter::class),
                    $app->make(ProfanityFilter::class),
                    $app->make(TooLongFilter::class),
                ];
          });
```

Por conveniência, você também pode fornecer um array de nomes de classes a serem resolvidos pelo container sempre que `Firewall` precisar de instâncias de `Filter`:

```php
$this->app->when(Firewall::class)
          ->needs(Filter::class)
          ->give([
              NullFilter::class,
              ProfanityFilter::class,
              TooLongFilter::class,
          ]);
```

#### Dependências Variádicas de Tags

Às vezes, uma classe pode ter uma dependência variádica que é type-hinted como uma classe específica (`Report ...$reports`). Usando os métodos `needs` e `giveTagged`, você pode facilmente injetar todos os bindings do container com essa <a href="#tags">tag</a> para a dependência fornecida:

```php
$this->app->when(ReportAggregator::class)
    ->needs(Report::class)
    ->giveTagged('reports');
```

### Tags

Ocasionalmente, você pode precisar resolver todos os bindings que compartilham uma tag comum. Por exemplo, talvez você esteja construindo um analisador de relatórios que recebe um array de muitas implementações de interfaces `Report`. Depois de registrar as implementações de `Report`, você pode atribuir a elas uma tag usando o método `tag`:

```php
$this->app->bind(CpuReport::class, function () {
    // ...
});
 
$this->app->bind(MemoryReport::class, function () {
    // ...
});
 
$this->app->tag([CpuReport::class, MemoryReport::class], 'reports');
```

Uma vez que os serviços tenham sido marcados, você pode facilmente resolvê-los todos através do método `tagged` do container:

```php
$this->app->bind(ReportAnalyzer::class, function (Application $app) {
    return new ReportAnalyzer($app->tagged('reports'));
});
```

### Extentendo Bindings

O método `extend` permite a modificação de serviços resolvidos. Por exemplo, quando um serviço é resolvido, você pode executar código adicional para decorar ou configurar o serviço. O método `extend` aceita dois argumentos, a classe de serviço que você está estendendo e um closure que deve retornar o serviço modificado. O closure recebe o serviço sendo resolvido e a instância do container:

```php
$this->app->extend(Service::class, function (Service $service, Application $app) {
    return new DecoratedService($service);
});
```

## Resolução

### O Método `make`

Você pode usar o método `make` para resolver uma instância de classe do container. O método `make` aceita o nome da classe ou interface que você deseja resolver:

```php
use App\Services\Transistor;
 
$transistor = $this->app->make(Transistor::class);
```

Se algumas dependências da sua classe não puderem ser resolvidas via container, você pode injetá-las passando-as como um array associativo para o método `makeWith`. Por exemplo, podemos passar manualmente o argumento do construtor `$id` necessário pelo serviço `Transistor`:

```php
use App\Services\Transistor;
 
$transistor = $this->app->makeWith(Transistor::class, ['id' => 1]);
```

O método `bound` pode ser usado para determinar se uma classe ou interface foi explicitamente vinculada no container:

```php
if ($this->app->bound(Transistor::class)) {
    // ...
}
```

Se você estiver fora de um service provider em um local do seu código que não tem acesso à variável `$app`, você pode usar a <a href="/conceitos-de-arquitetura/facades" target="_blank">Facade</a> `App` ou o <a href="/conhecendo-mais/helpers" target="_blank">helper</a> `app` para resolver uma instância de classe do container:

```php
use App\Services\Transistor;
use Illuminate\Support\Facades\App;
 
$transistor = App::make(Transistor::class);
 
$transistor = app(Transistor::class);
```

Se você deseja que a instância do container Laravel seja injetada em uma classe que está sendo resolvida pelo container, você pode fazer type-hint da classe `Illuminate\Container\Container` no construtor da sua classe:

```php
use Illuminate\Container\Container;
 
/**
 * Create a new class instance.
 */
public function __construct(
    protected Container $container,
) {}
```

### Injeção Automática

Além disso, você pode fazer type-hint da dependência no construtor de uma classe que é resolvida pelo container, incluindo <a href="/fundamentos/controllers" target="_blank">controllers</a>, <a href="/conhecendo-mais/eventos" target="_blank">event listeners</a>, <a href="/fundamentos/middleware" target="_blank">middlewares</a>, e muito mais. Além disso, você pode fazer type-hint das dependências no método `handle` de <a href="/conhecendo-mais/filas" target="_blank">jobs em fila</a>. Na prática, é assim que a maioria dos seus objetos deve ser resolvida pelo container.

Por exemplo, você pode fazer type-hint de um serviço definido por sua aplicação no construtor de um controller. O serviço será automaticamente resolvido e injetado na classe:

```php
<?php
 
namespace App\Http\Controllers;
 
use App\Services\AppleMusic;
 
class PodcastController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        protected AppleMusic $apple,
    ) {}
 
    /**
     * Show information about the given podcast.
     */
    public function show(string $id): Podcast
    {
        return $this->apple->findPodcast($id);
    }
}
```

## Chamada e Injeção de Métodos

Às vezes, você pode desejar invocar um método em uma instância de objeto enquanto permite que o container injete automaticamente as dependências desse método. Por exemplo, dada a seguinte classe:

```php
<?php
 
namespace App;
 
use App\Services\AppleMusic;
 
class PodcastStats
{
    /**
     * Generate a new podcast stats report.
     */
    public function generate(AppleMusic $apple): array
    {
        return [
            // ...
        ];
    }
}
```

Você pode invocar o método `generate` via o container da seguinte forma:

```php
use App\PodcastStats;
use Illuminate\Support\Facades\App;
 
$stats = App::call([new PodcastStats, 'generate']);
```

O método `call` aceita qualquer callable PHP. O método `call` do container pode até ser usado para invocar um closure enquanto injeta automaticamente suas dependências:

```php
use App\Services\AppleMusic;
use Illuminate\Support\Facades\App;
 
$result = App::call(function (AppleMusic $apple) {
    // ...
});
```

## Eventos do Container

O service container dispara um evento toda vez que resolve um objeto. Você pode ouvir este evento usando o método `resolving`:

```php
use App\Services\Transistor;
use Illuminate\Contracts\Foundation\Application;
 
$this->app->resolving(Transistor::class, function (Transistor $transistor, Application $app) {
    // Called when container resolves objects of type "Transistor"...
});
 
$this->app->resolving(function (mixed $object, Application $app) {
    // Called when container resolves object of any type...
});
```

Como você pode ver, o objeto sendo resolvido será passado para o callback, permitindo que você defina quaisquer propriedades adicionais no objeto antes de ser fornecido ao seu consumidor.

### Rebinding

O método `rebinding` permite que você dispare uma ação quando um serviço é re-vinculado ao container, o que significa que ele é registrado novamente ou substituído após seu binding inicial. Isso pode ser útil quando você precisa atualizar dependências ou modificar o comportamento toda vez que um binding específico é atualizado:

```php
use App\Contracts\PodcastPublisher;
use App\Services\SpotifyPublisher;
use App\Services\TransistorPublisher;
use Illuminate\Contracts\Foundation\Application;
 
$this->app->bind(PodcastPublisher::class, SpotifyPublisher::class);
 
$this->app->rebinding(
    PodcastPublisher::class,
    function (Application $app, PodcastPublisher $newInstance) {
        //
    },
);
 
// New binding will trigger rebinding closure...
$this->app->bind(PodcastPublisher::class, TransistorPublisher::class);
```

## PSR-11

O service container do Laravel implementa a interface <a href="https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-11-container.md" target="_blank">PSR-11</a>. Isso permite que você use o type-hint da interface PSR-11 para obter uma instância do container em qualquer lugar que você precise dele:


```php
use App\Services\Transistor;
use Psr\Container\ContainerInterface;
 
Route::get('/', function (ContainerInterface $container) {
    $service = $container->get(Transistor::class);
 
    // ...
});
```

Uma exceção é lançada se o identificador (Classe/Interface) fornecido não puder ser resolvido. A exceção será uma instância de `Psr\Container\NotFoundExceptionInterface` se o identificador nunca foi vinculado. Se o identificador foi vinculado, mas não pôde ser resolvido, uma instância de `Psr\Container\ContainerExceptionInterface` será lançada.