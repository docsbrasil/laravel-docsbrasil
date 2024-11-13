# Controllers

::: info
Por que não traduzimos "Controller" para "Controlador"? Porque a palavra "Controller" já é amplamente utilizada no contexto de desenvolvimento de software e é um termo técnico. Buscamos manter a terminologia original para facilitar a compreensão.
:::

## Introdução

Em vez de definir toda a lógica de manipulação de request como closures em seus arquivos de rota, você pode desejar organizar esse comportamento usando classes de "controller". Os controllers podem agrupar a lógica de manipulação de requisições relacionadas em uma única classe. Por exemplo, uma classe `UserController` pode lidar com todas as requisições recebidas relacionadas a usuários, incluindo exibição, criação, atualização e exclusão de usuários. Por padrão, os controllers são armazenados no diretório `app/Http/Controllers`.

## Criando Controllers

### Controllers Básicos

Para criar rapidamente um novo controller, você pode executar o comando Artisan `make:controller`. Por padrão, todos os controllers para sua aplicação são armazenados no diretório `app/Http/Controllers`:

```shell
php artisan make:controller UserController
```

Vamos dar uma olhada em um exemplo de um controller básico. Um controller pode ter qualquer número de métodos públicos que responderão a requisições HTTP recebidas:

```php
<?php
 
namespace App\Http\Controllers;
 
use App\Models\User;
use Illuminate\View\View;
 
class UserController extends Controller
{
    /**
     * Show the profile for a given user.
     */
    public function show(string $id): View
    {
        return view('user.profile', [
            'user' => User::findOrFail($id)
        ]);
    }
}
```

Depois de escrever uma classe e método de controller, você pode definir uma rota para o método do controller da seguinte maneira:

```php
use App\Http\Controllers\UserController;
 
Route::get('/user/{id}', [UserController::class, 'show']);
```

Quando uma requisição recebida corresponder ao URI da rota especificada, o método `show` na classe `App\Http\Controllers\UserController` será acionado e os parâmetros da rota serão passados para o método.

::: tip
Os controllers não são **obrigados** a estender uma classe base. No entanto, às vezes é conveniente estender uma classe de controller base que contém métodos que devem ser compartilhados entre todos os seus controllers.
:::

### Controllers de uma única ação

Se uma ação de controller for particularmente complexa, você pode achar conveniente dedicar uma classe de controller inteira a essa única ação. Para fazer isso, você pode definir um único método `__invoke` dentro do controller:

```php
<?php
 
namespace App\Http\Controllers;
 
class ProvisionServer extends Controller
{
    /**
     * Provision a new web server.
     */
    public function __invoke()
    {
        // ...
    }
}
```

Ao registrar rotas para controllers de ação única, você não precisa especificar um método de controller. Em vez disso, você pode simplesmente passar a classe do controller para a rota:

```php
use App\Http\Controllers\ProvisionServer;
 
Route::post('/server', ProvisionServer::class);
```

Você pode gerar um controller "invocável" usando a opção `--invokable` do comando Artisan `make:controller`:

```shell
php artisan make:controller ProvisionServer --invokable
```

::: tip
Os stubs de controllers podem ser personalizados usando a <a href="/conhecendo-mais/artisan" target="_blank">publicação de stubs</a>.
:::

## Controller Middleware

<a href="/fundamentos/middleware" target="_blank">Middlewares</a> podem ser atribuídos às rotas do controller em seus arquivos de rota:

```php
Route::get('/profile', [UserController::class, 'show'])->middleware('auth');
```

Ou, você pode especificar middlewares dentro da classe do controller. Para fazer isso, seu controller deve implementar a interface `HasMiddleware`, que dita que o controller deve ter um método estático `middleware`. A partir deste método, você pode retornar um array de middlewares que devem ser aplicados às ações do controller:

```php
<?php
 
namespace App\Http\Controllers;
 
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
 
class UserController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            'auth',
            new Middleware('log', only: ['index']), // O middleware 'log' será aplicado apenas ao método 'index'
            new Middleware('subscribed', except: ['store']), // O middleware 'subscribed' será aplicado a todos os métodos, exceto 'store'
        ];
    }
 
    // ...
}
```

Você também pode definir middlewares de controller como closures, o que fornece uma maneira prática de definir um middleware <em>inline</em> sem escrever uma classe de middleware inteira:

```php
use Closure;
use Illuminate\Http\Request;
 
/**
 * Get the middleware that should be assigned to the controller.
 */
public static function middleware(): array
{
    return [
        function (Request $request, Closure $next) {
            return $next($request);
        },
    ];
}
```

## Resource Controllers

Você pode pensar em cada model Eloquent em sua aplicação como um "recurso (resource)". É típico executar os mesmos conjuntos de ações em cada recurso. Por exemplo, imagine que sua aplicação contenha um model `Photo` e um model `Movie`. É provável que os usuários possam criar, ler, atualizar ou excluir esses recursos.

Devido a esse caso de uso comum, o <em>routing resource</em> do Laravel atribui as rotas típicas de criação, leitura, atualização e exclusão ("CRUD") a um controller com uma única linha de código. Para começar, você pode usar a opção `--resource` do comadno Artisan `make:controller` para criar rapidamente um controller para lidar com essas ações:

```shell
php artisan make:controller PhotoController --resource
```

Este comando irá gerar um controller em `app/Http/Controllers/PhotoController.php`. O controller conterá um método para cada uma das operações de recurso disponíveis. Em seguida, você pode registrar uma rota de recurso (<em>routing resource</em>) que aponta para o controller:

```php
use App\Http\Controllers\PhotoController;
 
Route::resource('photos', PhotoController::class);
```

Esta única declaração de rota cria várias rotas para lidar com uma variedade de ações. O controller gerado já terá métodos esboçados para cada uma dessas ações. Lembre-se de que você sempre pode obter uma visão geral rápida das rotas executando o comando Artisan `route:list`.

Você também pode registrar muitos <em>resource controllers</em> de uma vez, passando um array para o método `resources`:

```php
Route::resources([
    'photos' => PhotoController::class,
    'posts' => PostController::class,
]);
```

#### Ações gerenciadas pelos Resource Controllers

<table>
  <thead>
      <tr>
        <th>Verbo</th>
        <th>URI</th>
        <th>Método</th>
        <th>Nome da rota</th>
      </tr>
  </thead>
  <tbody>
      <tr>
        <td>GET</td>
        <td><code>/photos</code></td>
        <td>index</td>
        <td>photos.index</td>
      </tr>
      <tr>
        <td>GET</td>
        <td><code>/photos/create</code></td>
        <td>create</td>
        <td>photos.create</td>
      </tr>
      <tr>
        <td>POST</td>
        <td><code>/photos</code></td>
        <td>store</td>
        <td>photos.store</td>
      </tr>
      <tr>
        <td>GET</td>
        <td><code>/photos/{photo}</code></td>
        <td>show</td>
        <td>photos.show</td>
      </tr>
      <tr>
        <td>GET</td>
        <td><code>/photos/{photo}/edit</code></td>
        <td>edit</td>
        <td>photos.edit</td>
      </tr>
      <tr>
        <td>PUT/PATCH</td>
        <td><code>/photos/{photo}</code></td>
        <td>update</td>
        <td>photos.update</td>
      </tr>
      <tr>
        <td>DELETE</td>
        <td><code>/photos/{photo}</code></td>
        <td>destroy</td>
        <td>photos.destroy</td>
      </tr>
  </tbody>
</table>

#### Customizando o Comportamento de Model Ausente

Normalmente, uma resposta HTTP 404 será gerada se um model de recurso implicitamente vinculado não for encontrado. No entanto, você pode personalizar esse comportamento chamando o método `missing` ao definir sua <em>resource route</em>. O método `missing` aceita uma closure que será chamada se um model implicitamente vinculado não puder ser encontrado para nenhuma das rotas do recurso:

```php
use App\Http\Controllers\PhotoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
 
Route::resource('photos', PhotoController::class)
        ->missing(function (Request $request) {
            return Redirect::route('photos.index');
        });
```

#### Models Soft Deleted

Normalmente, o <em>implicit model binding</em> não recuperará models que foram <a href="/eloquent-orm/introducao" target="_blank">soft deleted</a>, e em vez disso retornará uma resposta HTTP 404. No entanto, você pode instruir o framework a permitir models soft deleted invocando o método `withTrashed` ao definir sua rota de recurso:

```php
use App\Http\Controllers\PhotoController;
 
Route::resource('photos', PhotoController::class)->withTrashed();
```

Chamar `withTrashed` sem argumentos permitirá models soft deleted para as rotas de recurso `show`, `edit` e `update`. Você pode especificar um subconjunto dessas rotas passando um array para o método `withTrashed`:

```php
Route::resource('photos', PhotoController::class)->withTrashed(['show']);
```

#### Especificando o Model do Resource

Se você estiver utilizando <a href="/fundamentos/routing#route-model-binding" target="_blank">route model binding</a> e gostaria que os métodos do <em>resource controller</em> recebessem uma instância de model, você pode usar a opção `--model` ao gerar o controller:

```shell
php artisan make:controller PhotoController --model=Photo --resource
```

#### Gerando Form Requests

Você pode fornecer a opção `--requests` ao gerar um <em>resource controller</em> para instruir o Artisan a gerar <a href="/fundamentos/validacao">classes de form request</a> para os métodos de armazenamento e atualização do controller:

```shell
php artisan make:controller PhotoController --model=Photo --resource --requests
```

### Resource Routes Parciais

Quando declarar uma <em>resource route</em>, você pode especificar um subconjunto de ações que o controller deve lidar em vez do conjunto completo de ações padrão:

```php
use App\Http\Controllers\PhotoController;
 
Route::resource('photos', PhotoController::class)->only([
    'index', 'show'
]);
 
Route::resource('photos', PhotoController::class)->except([
    'create', 'store', 'update', 'destroy'
]);
```

#### Resource Routes API

Ao declarar rotas de recurso que serão consumidas por APIs, você geralmente desejará excluir rotas que apresentam templates HTML, como 
`create` e `edit`. Para conveniência, você pode usar o método `apiResource` para excluir automaticamente essas duas rotas:

```php
use App\Http\Controllers\PhotoController;
 
Route::apiResource('photos', PhotoController::class);
```

Você pode registrar muitos <em>resource controllers</em> de API de uma vez passando um array para o método `apiResources`:

```php
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\PostController;
 
Route::apiResources([
    'photos' => PhotoController::class,
    'posts' => PostController::class,
]);
```

Para gerar rapidamente um <em>resource controller</em> de API que não inclua os métodos `create` ou `edit`, use a opção `--api` ao executar o comando `make:controller`:

```shell
php artisan make:controller PhotoController --api
```

### Resources Aninhados (Nested Resources)

Às vezes, você pode precisar definir rotas para um recurso aninhado. Por exemplo, um recurso de foto pode ter vários comentários que podem ser anexados à foto. Para aninhar os <em>resource controllers</em>, você pode usar a notação de "ponto" na declaração da rota:

```php
use App\Http\Controllers\PhotoCommentController;
 
Route::resource('photos.comments', PhotoCommentController::class);
```

Esta rota registrará um recurso aninhado que pode ser acessado com a seguinte URI:

```php
/photos/{photo}/comments/{comment}
```

#### Resources aninhados com Escopo

O recurso de <a href="/fundamentos/rotas#binding-implicito" target="_blank">model binding implícito</a> do Laravel pode automaticamente escopar os 
bindings aninhados de forma que o model filho resolvido seja confirmado como pertencente ao model pai. Usando o método `scoped` ao definir seu 
resource aninhado, você pode habilitar o escopo automático, bem como instruir o Laravel sobre qual campo o recurso filho deve ser recuperado. 
Para obter mais informações sobre como fazer isso, consulte a documentação sobre <a href="#escopo-de-resource-routes">escopo de resource routes</a>.

#### Shallow Nesting

Frequentemente, não é inteiramente necessário ter tanto os IDs pai quanto filho dentro de uma URI, uma vez que o ID filho já é um identificador único. Ao usar identificadores únicos, como chaves primárias autoincrementáveis, para identificar seus models em segmentos de URI, você pode optar por usar o "aninhamento raso":

```php
use App\Http\Controllers\CommentController;
 
Route::resource('photos.comments', CommentController::class)->shallow();
```

Esta definição de rota definirá as seguintes rotas:

<table>
  <thead>
      <tr>
        <th>Verbo</th>
        <th>URI</th>
        <th>Método</th>
        <th>Nome da Rota</th>
      </tr>
  </thead>
  <tbody>
      <tr>
        <td>GET</td>
        <td><code>/photos/{photo}/comments</code></td>
        <td>index</td>
        <td>photos.comments.index</td>
      </tr>
      <tr>
        <td>GET</td>
        <td><code>/photos/{photo}/comments/create</code></td>
        <td>create</td>
        <td>photos.comments.create</td>
      </tr>
      <tr>
        <td>POST</td>
        <td><code>/photos/{photo}/comments</code></td>
        <td>store</td>
        <td>photos.comments.store</td>
      </tr>
      <tr>
        <td>GET</td>
        <td><code>/comments/{comment}</code></td>
        <td>show</td>
        <td>comments.show</td>
      </tr>
      <tr>
        <td>GET</td>
        <td><code>/comments/{comment}/edit</code></td>
        <td>edit</td>
        <td>comments.edit</td>
      </tr>
      <tr>
        <td>PUT/PATCH</td>
        <td><code>/comments/{comment}</code></td>
        <td>update</td>
        <td>comments.update</td>
      </tr>
      <tr>
        <td>DELETE</td>
        <td><code>/comments/{comment}</code></td>
        <td>destroy</td>
        <td>comments.destroy</td>
      </tr>
  </tbody>
</table>

### Nomeando Resource Routes

Por padrão, todas as ações do <em>resource controller</em> têm um nome de rota; no entanto, você pode substituir esses nomes passando um array `names` com os nomes de 
rotas desejados:

```php
use App\Http\Controllers\PhotoController;
 
Route::resource('photos', PhotoController::class)->names([
    'create' => 'photos.build'
]);
```

### Nomeando os Parâmetros de Resource Routes

Por padrão, `Route::resource` criará os parâmetros de rota para suas <em>resource routes</em> com base na versão "singularizada" do nome do recurso. 
Você pode substituir isso em uma base de recurso usando o método `parameters`. O array passado para o método `parameters` deve ser um array associativo de 
nomes de recursos e nomes de parâmetros:

```php
use App\Http\Controllers\AdminUserController;
 
Route::resource('users', AdminUserController::class)->parameters([
    'users' => 'admin_user'
]);
```

O exemplo acima gera a seguinte URI para a rota `show`:

```php
/users/{admin_user}
```

### Escopo de Resource Routes

O recurso de <a href="/fundamentos/rotas#binding-implicito" target="_blank">model binding implícito</a> do Laravel pode automaticamente escopar os bindings 
aninhados de forma que o model filho resolvido seja confirmado como pertencente ao model pai. Usando o método `scoped` ao definir seu resource aninhado, 
você pode habilitar o escopo automático, bem como instruir o Laravel sobre qual campo o recurso filho deve ser recuperado:

```php
use App\Http\Controllers\PhotoCommentController;
 
Route::resource('photos.comments', PhotoCommentController::class)->scoped([
    'comment' => 'slug',
]);
```

Esta rota registrará um recurso aninhado que pode ser acessado com a seguinte URI:

```php
/photos/{photo}/comments/{comment:slug}
```

Quando você usa um binding implícito com chave personalizada como um parâmetro de rota aninhado, o Laravel automaticamente escopará a consulta para 
recuperar o model aninhado pelo seu pai usando convenções para adivinhar o nome do relacionamento no pai. Neste caso, será assumido que o model `Photo` tem 
um relacionamento chamado `comments` (o plural do nome do parâmetro de rota) que pode ser usado para recuperar o model `Comment`.

### Localizando Resource Routes

Por padrão, `Route::resource` criará URIs utilizando verbos em inglês e regras de pluralização. Se você precisar localizar os verbos de ação `create` e `edit`, 
você pode usar o método `Route::resourceVerbs`. Isso pode ser feito no início do método `boot` dentro do `App\Providers\AppServiceProvider`:

```php
/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Route::resourceVerbs([
        'create' => 'crear',
        'edit' => 'editar',
    ]);
}
```

O pluralizador do Laravel suporta <a href="/conhecendo-mais/localizacao#pluralizacao-de-idiomas">vários idiomas diferentes que você pode configurar com base em suas 
necessidades</a>. Uma vez que os verbos e tenham sido personalizados, um registro de <em>resource route</em> como 
`Route::resource('publicacion', PublicacionController::class)` produzirá as seguintes URIs:

```php
/publicacion/crear
 
/publicacion/{publicaciones}/editar
```

### Rotas Adicionais em Resource Controllers

Se você precisar adicionar rotas a um <em>resource controller</em> além do conjunto padrão, você deve definir essas rotas antes de chamar o 
método `Route::resource`; caso contrário, as rotas definidas pelo método `resource` podem tomar precedência sobre suas rotas suplementares:

```php
use App\Http\Controller\PhotoController;

Route::get('/photos/popular', [PhotoController::class, 'popular']);
Route::resource('photos', PhotoController::class);
```

::: tip
Lembre-se de manter seus controllers focados. Se você se encontrar rotineiramente precisando de métodos fora do conjunto típico de 
ações, considere dividir seu controller em dois controllers menores.
:::

### Singleton Resource Controllers

Às vezes, sua aplicação terá recursos que podem ter apenas uma instância. Por exemplo, o "perfil" de um usuário pode ser editado ou atualizado, mas um 
usuário não pode ter mais de um "perfil". Da mesma forma, uma imagem pode ter um único "thumbnail". Esses recursos são chamados de "singleton resources", o que 
significa que apenas uma instância do recurso pode existir. Nestes cenários, você pode registrar um <em>singleton resource controller</em>:

```php
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
 
Route::singleton('profile', ProfileController::class);
```

A definição acima registrará as seguintes rotas. Como você pode ver, as rotas de "criação" não são registradas para <em>singleton resources</em>, e 
as rotas registradas não aceitam um identificador, uma vez que apenas uma instância do recurso pode existir:

<table>
  <thead>
      <tr>
        <th>Verbo</th>
        <th>URI</th>
        <th>Método</th>
        <th>Nome da Rota</th>
      </tr>
  </thead>
  <tbody>
      <tr>
        <td>GET</td>
        <td><code>/profile</code></td>
        <td>show</td>
        <td>profile.show</td>
      </tr>
      <tr>
        <td>GET</td>
        <td><code>/profile/edit</code></td>
        <td>edit</td>
        <td>profile.edit</td>
      </tr>
      <tr>
        <td>PUT/PATCH</td>
        <td><code>/profile</code></td>
        <td>update</td>
        <td>profile.update</td>
      </tr>
  </tbody>
</table>

Os <em>singleton resource controllers</em> também podem ser aninhados dentro de um recurso padrão:

```php
Route::singleton('photos.thumbnail', ThumbnailController::class);
```

Neste exemplo, o recurso `photos` receberá todas as <a href="#acoes-gerenciadas-pelos-resource-controllers">resource routes</a>; no entanto, o recurso 
`thumbnail` será um <em>singleton resource</em> com as seguintes rotas:

<table>
  <thead>
      <tr>
        <th>Verbo</th>
        <th>URI</th>
        <th>Método</th>
        <th>Nome da Rota</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>GET</td>
        <td><code>/photos/{photo}/thumbnail</code></td>
        <td>show</td>
        <td>photos.thumbnail.show</td>
      </tr>
      <tr>
        <td>GET</td>
        <td><code>/photos/{photo}/thumbnail/edit</code></td>
        <td>edit</td>
        <td>photos.thumbnail.edit</td>
      </tr>
      <tr>
        <td>PUT/PATCH</td>
        <td><code>/photos/{photo}/thumbnail</code></td>
        <td>update</td>
        <td>photos.thumbnail.update</td>
      </tr>
  </tbody>
</table>

#### Singleton Resource Criáveis

Ocasionalmente, você pode querer definir rotas de criação para um <em>singleton resource</em>. Para fazer isso, você pode utilizar o método `creatable` ao 
registrar a rota de um <em>singleton resource</em>:

```php
Route::singleton('photos.thumbnail', ThumbnailController::class)->creatable();
```

Neste exemplo, as seguintes rotas serão registradas. Como você pode ver, uma rota `DELETE` também será registrada:

<table>
  <thead>
      <tr>
        <th>Verbo</th>
        <th>URI</th>
        <th>Método</th>
        <th>Nome da Rota</th>
      </tr>
  </thead>
  <tbody>
      <tr>
        <td>GET</td>
        <td><code>/photos/{photo}/thumbnail/create</code></td>
        <td>create</td>
        <td>photos.thumbnail.create</td>
      </tr>
      <tr>
        <td>POST</td>
        <td><code>/photos/{photo}/thumbnail</code></td>
        <td>store</td>
        <td>photos.thumbnail.store</td>
      </tr>
      <tr>
        <td>GET</td>
        <td><code>/photos/{photo}/thumbnail</code></td>
        <td>show</td>
        <td>photos.thumbnail.show</td>
      </tr>
      <tr>
        <td>GET</td>
        <td><code>/photos/{photo}/thumbnail/edit</code></td>
        <td>edit</td>
        <td>photos.thumbnail.edit</td>
      </tr>
      <tr>
        <td>PUT/PATCH</td>
        <td><code>/photos/{photo}/thumbnail</code></td>
        <td>update</td>
        <td>photos.thumbnail.update</td>
      </tr>
      <tr>
        <td>DELETE</td>
        <td><code>/photos/{photo}/thumbnail</code></td>
        <td>destroy</td>
        <td>photos.thumbnail.destroy</td>
      </tr>
  </tbody>
</table>

Se você deseja que o Laravel registre a rota `DELETE` para um <em>singleton resource</em>, mas não registre as rotas de criação ou armazenamento, você pode
utilizar o método `destroyable`:

```php
Route::singleton(...)->destroyable();
```

#### API Singleton Resources

O método `apiSingleton` pode ser utilizado para registrar um <em>singleton resource</em> que será manipulado via API, tornando assim as 
rotas `create` e `edit` desnecessárias:

```php
Route::apiSingleton('profile', ProfileController::class);
```

Claro, os <em>singleton resources</em> de API também podem ser `creatable`, o que registrará as rotas `store` e `destroy` para o recurso:

```php
Route::apiSingleton('photos.thumbnail', ProfileController::class)->creatable();
```

## Injeção de Dependência e Controllers

#### Injeção de Dependência no Construtor

O <a href="/conceitos-de-arquitetura/service-container" target="_blank">service container</a> do Laravel é utilizado para resolver todos os controllers do Laravel. 
Como resultado, você pode tipar qualquer dependência que seu controller possa precisar em seu construtor. As dependências declaradas serão automaticamente resolvidas 
e injetadas na instância do controller:

```php
<?php
 
namespace App\Http\Controllers;
 
use App\Repositories\UserRepository;
 
class UserController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        protected UserRepository $users,
    ) {}
}
```

#### Injeção de Dependência no Método

Além da injeção de dependência no construtor, você também pode tipar dependências nos métodos do seu controller. Um caso de uso comum para a injeção de dependência
no método é injetar a instância de `Illuminate\Http\Request` nos métodos do seu controller:

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
        $name = $request->name;
 
        // Store the user...
 
        return redirect('/users');
    }
}
```

Se o método do seu controller também espera entrada de um parâmetro de rota, liste seus argumentos de rota após suas outras dependências. Por exemplo, se sua rota

```php
use App\Http\Controllers\UserController;
 
Route::put('/user/{id}', [UserController::class, 'update']);
```

você ainda pode tipar a `Illuminate\Http\Request` e acessar seu parâmetro `id` definindo o método do seu controller da seguinte forma:

```php
<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
 
class UserController extends Controller
{
    /**
     * Update the given user.
     */
    public function update(Request $request, string $id): RedirectResponse
    {
        // Update the user...
 
        return redirect('/users');
    }
}
```

