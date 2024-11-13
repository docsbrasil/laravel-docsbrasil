# Views

::: info
Por que não traduzimos "Views" para "Visualizações/Visões"? Porque a palavra "Views" já é amplamente utilizada no contexto de desenvolvimento de software e é um termo técnico. Buscamos manter a terminologia original para facilitar a compreensão.
:::

## Introdução

Claro, não é prático retornar documentos HTML inteiros diretamente de suas rotas e controllers. Felizmente, as views fornecem uma maneira conveniente de colocar todo o nosso HTML em arquivos separados.

As views separam a lógica do seu controller/aplicação da lógica de apresentação e são armazenadas no diretório `resources/views`. Ao usar o Laravel, os templates de view geralmente são escritos usando <a href="/fundamentos/templates-blade" target="_blank">Templates Blade</a>. Uma view simples pode se parecer com isso:

```blade
</a>

```blade
<!-- View armazenada em resources/views/greeting.blade.php -->
 
<html>
    <body>
        <h1>Hello, {{ $name }}</h1>
    </body>
</html>
```

Como essa view é armazenada em `resources/views/greeting.blade.php`, podemos retorná-la usando o helper global `view` assim:

```php
Route::get('/', function () {
    return view('greeting', ['name' => 'James']);
});
```

::: tip
Procurando mais informações sobre como escrever templates Blade? Confira a documentação completa do <a href="/fundamentos/templates-blade" target="_blank">Blade</a> para começar.
:::

### Utilizando React/Vue nas Views

Em vez de escrever seus templates frontend em PHP via Blade, muitos desenvolvedores começaram a preferir escrever seus templates usando React ou Vue. O Laravel torna facilita esse processo graças ao <a href="https://inertiajs.com/" target="_blank">Inertia</a>, uma biblioteca que facilita a conexão do seu frontend React/Vue com seu backend Laravel sem as complexidades de construir um SPA.

Nossos <a href="/primeiros-passos/starter-kits" target="_blank">starter kits</a> Breeze e Jetstream dão a você um ótimo ponto de partida para sua próxima aplicação Laravel alimentada pelo Inertia. Além disso, o <a href="https://bootcamp.laravel.com" target="_blank">Laravel Bootcamp</a> fornece uma demonstração completa de como construir uma aplicação Laravel alimentada pelo Inertia, incluindo exemplos em Vue e React.

## Criando e Renderizando Views

Você pode criar uma view colocando um arquivo com a extensão `.blade.php` no diretório `resources/views` de sua aplicação ou usando o comando Artisan `make:view`:

```shell
php artisan make:view greeting
```

A extensão `.blade.php` informa ao framework que o arquivo contém um <a href="/fundamentos/templates-blade">template Blade</a>. Os templates Blade contêm HTML, bem como diretivas Blade que permitem que você facilmente exiba valores, crie "if" statements, itere sobre dados e muito mais.

Depois de criar uma view, você pode retorná-la de uma das rotas ou controllers de sua aplicação usando o helper global `view`:

```php
Route::get('/', function () {
    return view('greeting', ['name' => 'James']);
});
```

As views também podem ser retornadas utilizando a facade `View`:

```php
use Illuminate\Support\Facades\View;
 
return View::make('greeting', ['name' => 'James']);
```

Como você pode ver, o primeiro argumento passado para o helper `view` corresponde ao nome do arquivo de view no diretório `resources/views`. O segundo argumento é um array de dados que devem estar disponíveis para a view. Neste caso, estamos passando a variável `name`, que é exibida na view usando a <a href="/fundamentos/templates-blade">sintaxe Blade</a>.

### Diretórios de Views Aninhados

As views também podem ser aninhadas dentro de subdiretórios do diretório `resources/views`. A notação "ponto" pode ser usada para referenciar views aninhadas. Por exemplo, se sua view estiver armazenada em `resources/views/admin/profile.blade.php`, você pode retorná-la de uma das rotas ou controllers de sua aplicação assim:

```php
return view('admin.profile', $data);
```

::: danger
Nomes de diretórios de views não devem conter o caractere `.`.
:::

### Criando a Primeira View Disponível

Usando o método `first` da facade `View`, você pode criar a primeira view que existe em um determinado array de views. Isso pode ser útil se sua aplicação ou pacote permitir que as views sejam personalizadas ou sobrescritas:

```php
use Illuminate\Support\Facades\View;
 
return View::first(['custom.admin', 'admin'], $data);
```

### Determinando se uma View Existe

Se você precisar determinar se uma view existe, pode usar a facade `View`. O método `exists` retornará `true` se a view existir:

```php
use Illuminate\Support\Facades\View;
 
if (View::exists('admin.profile')) {
    // ...
}
```

## Passando Dados para Views

Como você viu nos exemplos anteriores, você pode passar um array de dados para views para tornar esses dados disponíveis dentro da view:

```php
return view('greetings', ['name' => 'Victoria']);
```

Ao passar informações dessa maneira, os dados devem ser um array com pares de chave/valor. Depois de fornecer dados a uma view, você pode acessar cada valor dentro da sua view usando as chaves dos dados, como `<?php echo $name; ?>`.

Como alternativa para passar um array completo de dados para a função `view`, você pode usar o método `with` para adicionar peças individuais de dados à view. O método `with` retorna uma instância do objeto view para que você possa continuar encadeando métodos antes de retornar a view:

```php
return view('greeting')
            ->with('name', 'Victoria')
            ->with('occupation', 'Astronaut');
```

### Compartilhando Dados com Todas as Views

Ocasionalmente, você pode precisar compartilhar dados com todas as views que são renderizadas por sua aplicação. Você pode fazer isso utilizando o método `share` da facade `View`. Tipicamente, você deve colocar chamadas ao método `share` dentro do método `boot` de um service provider. Você é livre para adicioná-los à classe `App\Providers\AppServiceProvider` ou criar um service provider separado para abrigá-los:

```php
<?php
 
namespace App\Providers;
 
use Illuminate\Support\Facades\View;
 
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // ...
    }
 
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        View::share('key', 'value');
    }
}
```

## View Composers

View composers são callbacks ou métodos de classe que são chamados quando uma view é renderizada. Se você tiver dados que deseja vincular a uma view toda vez que essa view for renderizada, um view composer pode ajudá-lo a organizar essa lógica em um único local. View composers podem ser particularmente úteis se a mesma view for retornada por várias rotas ou controllers em sua aplicação e sempre precisar de um pedaço específico de dados.

Tipicamente, view composers serão registrados dentro de um dos <a href="/conceitos-de-arquitetura/service-providers">service providers</a> de sua aplicação. Neste exemplo, vamos assumir que o `App\Providers\AppServiceProvider` abrigará essa lógica.

Usaremos o método `composer` da facade `View` para registrar o view composer. O Laravel não inclui um diretório padrão para view composers baseados em classes, então você é livre para organizá-los como desejar. Por exemplo, você poderia criar um diretório `app/View/Composers` para abrigar todos os view composers de sua aplicação:

```php
<?php
 
namespace App\Providers;
 
use App\View\Composers\ProfileComposer;
use Illuminate\Support\Facades;
use Illuminate\Support\ServiceProvider;
use Illuminate\View\View;
 
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // ...
    }
 
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Composers baseados em classes...
        Facades\View::composer('profile', ProfileComposer::class);
 
        // Composers baseados em closures...
        Facades\View::composer('welcome', function (View $view) {
            // ...
        });
 
        Facades\View::composer('dashboard', function (View $view) {
            // ...
        });
    }
}
```

Agora que registramos o composer, o método `compose` da classe `App\View\Composers\ProfileComposer` será executado toda vez que a view `profile` estiver sendo renderizada. Vamos dar uma olhada em um exemplo da classe composer:

```php
<?php
 
namespace App\View\Composers;
 
use App\Repositories\UserRepository;
use Illuminate\View\View;
 
class ProfileComposer
{
    /**
     * Create a new profile composer.
     */
    public function __construct(
        protected UserRepository $users,
    ) {}
 
    /**
     * Bind data to the view.
     */
    public function compose(View $view): void
    {
        $view->with('count', $this->users->count());
    }
}
```

Como você pode ver, todos os view composers são resolvidos via <a href="/conceitos-de-arquitetura/service-container">service container</a>, então você pode tipar qualquer dependência que você precisar dentro do construtor de um composer.

#### Anexando um Composer a Múltiplas Views

Você pode anexar um view composer a várias views de uma vez passando um array de views como o primeiro argumento para o método `composer`:

```php
use App\Views\Composers\MultiComposer;
use Illuminate\Support\Facades\View;
 
View::composer(
    ['profile', 'dashboard'],
    MultiComposer::class
);
```

O método `composer` também aceita o caractere `*` como um caractere curinga, permitindo que você anexe um composer a todas as views:

```php
use Illuminate\Support\Facades;
use Illuminate\View\View;
 
Facades\View::composer('*', function (View $view) {
    // ...
});
```

### View Creators

Os view creators são semelhantes aos view composers, mas com uma diferença importante: enquanto os view composers são executados pouco antes da view ser renderizada, os view creators são executados assim que a view é instanciada. Para registrar um view creator, use o método `creator`:

```php
use App\View\Creators\ProfileCreator;
use Illuminate\Support\Facades\View;
 
View::creator('profile', ProfileCreator::class);
```

## Otimizando Views

Por padrão, as views Blade são compiladas quando necessário. Quando uma requisição solicita uma view, o Laravel verifica se já existe uma versão compilada dela. Se existir, ele checa se a versão não compilada foi modificada depois da versão compilada. Se a view compilada não existir ou a versão não compilada tiver sido alterada, o Laravel recompilará a view.

Compilar views durante a requisição pode ter um pequeno impacto negativo no desempenho, então o Laravel fornece o comando Artisan `view:cache` para pré-compilar todas as views utilizadas por sua aplicação. Para um desempenho aumentado, você pode desejar executar este comando como parte do seu processo de implantação:

```shell
php artisan view:cache
```

Você pode usar o comando `view:clear` para limpar o cache de views:

```shell
php artisan view:clear
```