# Templates Blade

## Introdução

Blade é o mecanismo de template simples, mas poderoso, que é incluído no Laravel. Ao contrário de alguns mecanismos de template PHP, o Blade não restringe você a usar código PHP puro em seus modelos. Na verdade, todos os modelos Blade são compilados em código PHP puro e armazenados em cache até serem modificados, o que significa que o Blade adiciona essencialmente zero sobrecarga à sua aplicação. Os arquivos de modelo Blade usam a extensão de arquivo `.blade.php` e são normalmente armazenados no diretório `resources/views`.

As views Blade podem ser retornadas de rotas ou controllers utilizando o helper global `view`. Claro, como mencionado na documentação sobre <a href="/fundamentos/views" target="_blank">views</a>, os dados podem ser passados para a view Blade utilizando o segundo argumento do helper `view`:

```php
Route::get('/', function () {
    return view('greeting', ['name' => 'Finn']);
});
```

### Adicionando funcionalidades ao Blade com Livewire

Quer levar seus templates Blade para o próximo nível e construir interfaces dinâmicas com facilidade? Confira o <a href="https://livewire.laravel.com" target="_blank">Laravel Livewire</a>. O Livewire permite que você escreva componentes Blade que ganham novas funcionalidades dinâmicas que normalmente só seriam possíveis por meio de frameworks frontend como React ou Vue, proporcionando uma ótima abordagem para construir frontends modernos e reativos sem as complexidades, renderização do lado do cliente ou etapas de compilação de muitos frameworks JavaScript.

## Exibindo Dados

Você pode exibir dados que são passados para suas views Blade envolvendo a variável em chaves. Por exemplo, dada a seguinte rota:

```php
Route::get('/', function () {
    return view('welcome', ['name' => 'Samantha']);
});
```

Você pode exibir o conteúdo da variável `name` assim:

```blade
Hello, {{ $name }}.
```

::: tip
As declarações de <em>echo</em> <code v-pre>{{ }}</code> do Blade são automaticamente processadas pela função `htmlspecialchars` do PHP para prevenir ataques XSS.
:::

Você não está limitado a exibir o conteúdo das variáveis passadas para a view. Você também pode exibir os resultados de qualquer função PHP. Na verdade, você pode colocar qualquer código PHP que desejar dentro de uma declaração de echo Blade:

```blade
The current UNIX timestamp is {{ time() }}.
```

::: info
Você verá a expressão `echo Blade` em muitos exemplos dentro dessa documentação. Esta expressão é usada para indicar que o conteúdo entre as chaves duplas será impresso na view. Por exemplo, <code v-pre>{{ $name }}</code> será substituído pelo valor da variável `$name` quando a view for renderizada.
:::

### Codificação de Entidades HTML

Por padrão, o Blade (e a função `e` do Laravel) irá codificar entidades HTML duplas. Se você deseja desativar a codificação dupla, chame o método `Blade::withoutDoubleEncoding` a partir do método `boot` do seu `AppServiceProvider`:

::: info
Entidades HTML são caracteres especiais que têm um significado especial em HTML. Por exemplo, o caractere `<` é convertido para `&lt;` e o caractere `>` é convertido para `&gt;`. Isso é feito para evitar que o navegador interprete esses caracteres como tags HTML.
:::

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Blade::withoutDoubleEncoding();
    }
}
```

#### Exibindo Dados Não Escapados

Por padrão, as declarações Blade <code v-pre>{{ }}</code> são automaticamente processadas pela função `htmlspecialchars` do PHP para prevenir ataques XSS. Se você não deseja que seus sejam escapados, você pode usar a seguinte sintaxe:

```blade
Hello, {!! $name !!}.
```

::: danger
Tenha muito cuidado ao exibir conteúdo fornecido pelos usuários de sua aplicação. Você deve normalmente usar a sintaxe de chaves duplas escapadas para prevenir ataques XSS ao exibir dados fornecidos pelo usuário.
:::

### Blade e Frameworks JavaScript

Como muitos frameworks JavaScript também usam chaves para indicar que uma expressão deve ser exibida no navegador, você pode usar o símbolo `@` para informar ao mecanismo de renderização do Blade que uma expressão deve permanecer intacta. Por exemplo:

```blade
<h1>Laravel</h1>

Hello, @{{ name }}.
```

Neste exemplo, o símbolo `@` será removido pelo Blade; no entanto, a expressão <code v-pre>{{ name }}</code> permanecerá intacta pelo mecanismo Blade, permitindo que ela seja renderizada pelo seu framework JavaScript.

O símbolo `@` também pode ser usado para escapar diretivas Blade:

```blade
{{-- Template Blade --}}
@@if()

<!-- HTML output -->
@if()
```

#### Renderizando JSON

Às vezes, você pode passar um array para sua view com a intenção de renderizá-lo como JSON para inicializar uma variável JavaScript. Por exemplo:

```blade
<script>
    var app = <?php echo json_encode($array); ?>;
</script>
```

No entanto, em vez de chamar manualmente `json_encode`, você pode usar o método `Illuminate\Support\Js::from`. O método `from` aceita os mesmos argumentos que a função `json_encode` do PHP; no entanto, ele garantirá que o JSON resultante seja corretamente escapado para inclusão dentro de aspas HTML. O método `from` retornará uma instrução `JSON.parse` JavaScript que converterá o objeto ou array fornecido em um objeto JavaScript válido:

```blade
<script>
    var app = {{ Illuminate\Support\Js::from($array) }};
</script>
```

As versões mais recentes do Laravel incluem um facade `Js`, que fornece acesso rápido a essa funcionalidade em seus templates Blade:

```blade
<script>
    var app = {{ Js::from($array) }};
</script>
```

::: danger
Você deve usar o método `Js::from` apenas para renderizar variáveis existentes como JSON. O template Blade é baseado em expressões regulares e tentar passar uma expressão complexa para a diretiva pode causar falhas inesperadas.
:::

#### A diretiva `@verbatim`

Se você estiver exibindo variáveis JavaScript em uma grande parte do seu template, você pode envolver o HTML na diretiva `@verbatim` para que você não precise prefixar cada declaração de <em>echo Blade</em> com um símbolo `@`:

```blade
@verbatim
    <div class="container">
        Hello, {{ name }}.
    </div>
@endverbatim
```

## Diretivas Blade

Além da herança de templates e exibição de dados, o Blade também fornece atalhos convenientes para estruturas de controle PHP comuns, como declarações condicionais e loops. Esses atalhos fornecem uma maneira muito limpa e concisa de trabalhar com estruturas de controle PHP, mantendo-se familiar às suas contrapartes em PHP.

### Declarações condicionais

Você pode construir declarações `if` usando as diretivas `@if`, `@elseif`, `@else` e `@endif`. Essas diretivas funcionam de forma idêntica às suas contrapartes em PHP:

```blade
@if (count($records) === 1)
    Eu tenho um registro 😄
@elseif (count($records) > 1)
    Eu tenho vários registros 😎
@else
    Eu não tenho nenhum registro 😣
@endif
```

Você também pode usar a diretiva `@unless` para negar uma expressão `if`:

```blade
@unless (Auth::check())
    Você não está logado 😔
@endunless
```

Além das diretivas condicionais já apresentadas, as diretivas `@isset` e `@empty` podem ser usadas como atalhos convenientes para suas respectivas funções PHP:

```blade
@isset($records)
    // $records está definido e não é nulo...
@endisset

@empty($records)
    // $records está "vazio"...
@endempty
```

#### Diretivas de Autenticação

As diretivas `@auth` e `@guest` podem ser usadas para determinar rapidamente se o usuário atual está <a href="/seguranca/autenticacao">autenticado</a> ou é um convidado:

```blade
@auth
    // O usuário está autenticado...
@endauth

@guest
    // O usuário não está autenticado...
@endguest
```

Se necessário, você pode especificar o guard de autenticação que deve ser verificado ao usar as diretivas `@auth` e `@guest`:

```blade
@auth('admin')
    // O usuário está autenticado...
@endauth

@guest('admin')
    // O usuário não está autenticado...
@endguest
```

#### Diretivas de Ambiente

Você pode verificar se a aplicação está rodando no ambiente de produção usando a diretiva `@production`:

```blade
@production
    // Conteúdo específico para produção...
@endproduction
```

Ou, você pode determinar se a aplicação está rodando em um ambiente específico usando a diretiva `@env`:

```blade
@env('staging')
    // A aplicação está rodando em "staging"...
@endenv

@env(['staging', 'production'])
    // A aplicação está rodando em "staging" ou "production"...
@endenv
```

#### Diretivas de Sections (Layouts)

Você pode determinar se uma seção de herança de template tem conteúdo usando a diretiva `@hasSection`:

::: info
Não confunda com a diretiva `@session`, utilizada verificar se um valor existe na sessão.
:::

```blade
@hasSection('navigation')
    <div class="pull-right">
        @yield('navigation')
    </div>

    <div class="clearfix"></div>
@endif
```

Você pode usar a diretiva `@sectionMissing` para determinar se uma seção não tem conteúdo:

```blade
@sectionMissing('navigation')
    <div class="pull-right">
        @include('default-navigation')
    </div>
@endif
```

#### Diretivas de Sessão

A diretiva `@session` pode ser utilizada para determinar se um valor existe na <a href="/fundamentos/sessoes">sessão</a>. Se o valor existir, o conteúdo do template dentro das diretivas `@session` e `@endsession` será exibido. Dentro do conteúdo da diretiva `@session`, você pode exibir a variável `$value` para exibir o valor armazenado na sessão:

```blade
@session('status')
    <div class="p-4 bg-green-100">
        {{ $value }}
    </div>
@endsession
```

### Declarações Switch

Complementando as declarações condicionais, você pode construir declarações `switch` utilizando as diretivas `@switch`, `@case`, `@break`, `@default` e `@endswitch`:

```blade
@switch($i)
    @case(1)
        Primeiro caso...
        @break

    @case(2)
        Segundo caso...
        @break

    @default
        Caso padrão...
@endswitch
```

### Loops

Complementando as declarações condicionais, o Blade fornece diretivas simples para trabalhar com as estruturas de loop do PHP. Novamente, cada uma dessas diretivas funciona de forma idêntica às suas contrapartes em PHP:

```blade
@for ($i = 0; $i < 10; $i++)
    O valor atual é {{ $i }}
@endfor

@foreach ($users as $user)
    <p>Este é o usuário {{ $user->id }}</p>
@endforeach

@forelse ($users as $user)
    <li>{{ $user->name }}</li>
@empty
    <p>Sem usuários</p>
@endforelse

@while (true)
    <p>Sou um loop infinito.</p>
@endwhile
```

::: tip
Ao iterar por um loop `foreach`, você tem acesso à <a href="#a-variavel-de-loop">variável de loop</a> para obter informações valiosas sobre o loop, como se você está na primeira ou última iteração do loop.
:::

Ao usar loops, você também pode pular a iteração atual ou encerrar o loop usando as diretivas `@continue` e `@break`:

```blade
@foreach ($users as $user)
    @if ($user->type == 1)
        @continue
    @endif

    <li>{{ $user->name }}</li>

    @if ($user->number == 5)
        @break
    @endif
@endforeach
```

Você pode também incluir a condição de continuação ou interrupção na declaração dessas diretivas, tornando o código mais limpo:

```blade
@foreach ($users as $user)
    @continue($user->type == 1)

    <li>{{ $user->name }}</li>

    @break($user->number == 5)
@endforeach
```

### A Variável de Loop

Enquanto itera por um loop `foreach`, uma variável `$loop` estará disponível dentro do seu loop. Esta variável fornece acesso a algumas informações úteis, como o índice do loop atual e se esta é a primeira ou última iteração pelo loop:

```blade
@foreach ($users as $user)
    @if ($loop->first)
        Esta é a primeira iteração.
    @endif

    @if ($loop->last)
        Esta é a última iteração.
    @endif

    <p>Este é o usuário {{ $user->id }}</p>
@endforeach
```

Se você estiver em um loop aninhado, você pode acessar a variável `$loop` do loop pai via a propriedade `parent`:

```blade
@foreach ($users as $user)
    @foreach ($user->posts as $post)
        @if ($loop->parent->first)
            Esta é a primeira iteração do loop pai.
        @endif
    @endforeach
@endforeach
```

A variável `$loop` também contém uma variedade de outras propriedades úteis:

<table>
  <thead>
    <tr>
      <th>Propriedade</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>$loop->index</code></td>
      <td> O índice da iteração atual do loop (começa em 0).</td>
    </tr>
    <tr>
      <td><code>$loop->iteration</code></td>
      <td>A iteração atual do loop (começa em 1).</td>
    </tr>
    <tr>
      <td><code>$loop->remaining</code></td>
      <td>As iterações restantes no loop.</td>
    </tr>
    <tr>
      <td><code>$loop->count</code></td>
      <td>O número total de itens no array sendo iterado.</td>
    </tr>
    <tr>
      <td><code>$loop->first</code></td>
      <td>Se esta é a primeira iteração do loop.</td>
    </tr>
    <tr>
      <td><code>$loop->last</code></td>
      <td>Se esta é a última iteração do loop.</td>
    </tr>
    <tr>
      <td><code>$loop->even</code></td>
      <td>Se esta é uma iteração par pelo loop.</td>
    </tr>
    <tr>
      <td><code>$loop->odd</code></td>
      <td>Se esta é uma iteração ímpar pelo loop.</td>
    </tr>
    <tr>
      <td><code>$loop->depth</code></td>
      <td>O nível de aninhamento do loop atual.</td>
    </tr>
    <tr>
      <td><code>$loop->parent</code></td>
      <td>Quando em um loop aninhado, acessa a variável de loop do pai.</td>
    </tr>
  </tbody>
</table>

### Classes e Estilos Condicionais

A diretiva `@class` compila condicionalmente uma string de classes CSS. A diretiva aceita um array de classes onde a chave do array contém a classe ou classes que você deseja adicionar, enquanto o valor é uma expressão booleana. Se o elemento do array tiver uma chave numérica, ele sempre será incluído na lista de classes renderizadas:

```blade
@php
    $isActive = false;
    $hasError = true;
@endphp

<span @class([
    'p-4',
    'font-bold' => $isActive,
    'text-gray-500' => ! $isActive,
    'bg-red' => $hasError,
])></span>

<span class="p-4 text-gray-500 bg-red"></span>
```

Da mesma forma, a diretiva `@style` pode ser utilizada para adicionar condicionalmente estilos CSS inline a um elemento HTML:

```blade
@php
    $isActive = true;
@endphp

<span @style([
    'background-color: red',
    'font-weight: bold' => $isActive,
])></span>

<span style="background-color: red; font-weight: bold;"></span>
```

### Atributos Adicionais

Para facilitar, você pode utilizar a diretiva `@checked` para indicar facilmente se um checkbox HTML fornecido está "marcado". Esta diretiva irá exibir `checked` se a condição fornecida for verdadeira:

```blade
<input type="checkbox" name="active" value="active"
  @checked(old('active') == $user->active)>
```

Da mesma forma, a diretiva `@selected` pode ser utilizada para indicar se uma opção de seleção deve ser "selecionada":

```blade
<select name="version">
    @foreach ($product->versions as $version)
        <option value="{{ $version }}" @selected(old('version') == $version)>
            {{ $version }}
        </option>
    @endforeach
</select>
```

A diretiva `@disabled` pode ser utilizada para indicar se um determinado elemento deve ser "desativado":

```blade
<button type="submit" @disabled($errors->isNotEmpty())>Submit</button>
```

A diretiva `@readonly` pode ser utilizada para indicar se um determinado elemento deve ser "somente leitura":

```blade
<input
    type="email"
    name="email"
    value="email@laravel.com"
    @readonly($user->isNotAdmin())
/>
```

A diretiva `@required` pode ser utilizada para indicar se um determinado elemento deve ser "obrigatório":

```blade
<input
    type="text"
    name="title"
    value="title"
    @required($user->isAdmin())
/>
```

### Incluindo SubViews

::: tip
Embora você seja livre para utilizar a diretiva `@include`, os <a href="/fundamentos/componentes">componentes</a> Blade fornecem funcionalidades semelhantes e oferecem vários benefícios sobre a diretiva `@include`, como vinculação de dados e atributos.
:::

A diretiva `@include` do Blade permite que você inclua uma view Blade de dentro de outra view. Todas as variáveis que estão disponíveis para a view pai estarão disponíveis para a view incluída:

```blade
<div>
    @include('shared.errors')

    <form>
        <!-- Form Contents -->
    </form>
</div>
```

Mesmo que a view incluída herde todos os dados disponíveis na view pai, você pode também passar um array de dados adicionais que devem estar disponíveis para a view incluída:

```blade
@include('view.name', ['status' => 'complete'])
```

Se você tentar utilizar `@include` uma view que não existe, o Laravel lançará um erro. Se você deseja incluir uma view que pode ou não estar presente, você deve usar a diretiva `@includeIf`:

```blade
@includeIf('view.name', ['status' => 'complete'])
```

Se você deseja utilizar `@include` uma view se uma determinada expressão booleana for avaliada como `true` ou `false`, você pode utilizar as diretivas `@includeWhen` e `@includeUnless`:

```blade
@includeWhen($boolean, 'view.name', ['status' => 'complete'])

@includeUnless($boolean, 'view.name', ['status' => 'complete'])
```

Para incluir a primeira view que existe de um array de views fornecido, você pode utilizar a diretiva `includeFirst`:

```blade
@includeFirst(['custom.admin', 'admin'], ['status' => 'complete'])
```

::: danger
Você deve evitar o uso das constantes `__DIR__` e `__FILE__` em suas views Blade, pois elas se referirão à localização da view compilada em cache.
:::

#### Renderizando Views para Coleções

Você pode combinar `loops` e `includes` em uma única linha com a diretiva `@each`:

```blade
@each('caminho.da.view', $jobs, 'job')
```

O primeiro argumento da diretiva `@each` é a view a ser renderizada para cada elemento no array ou coleção. O segundo argumento é o array ou coleção que você deseja iterar, enquanto o terceiro argumento é o nome da variável que será atribuída à iteração atual dentro da view. Então, por exemplo, se você estiver iterando sobre um array de `jobs`, tipicamente você desejará acessar cada job como uma variável `job` dentro da view. A chave do array para a iteração atual estará disponível como a variável `key` dentro da view.

Você também pode passar um quarto argumento para a diretiva `@each`. Este argumento determina a view que será renderizada se o array fornecido estiver vazio.

```blade
@each('view.name', $jobs, 'job', 'view.empty')
```

::: danger
As views renderizadas via `@each` não herdam as variáveis da view pai. Se a view filha requer essas variáveis, você deve utilizar as diretivas `@foreach` e `@include` em vez disso.
:::

### A diretiva `@once`

A diretiva `@once` permite que você defina uma parte do template que será avaliada apenas uma vez por ciclo de renderização. Isso pode ser útil para "empurrar" uma determinada parte do JavaScript para o cabeçalho da página utilizando [stacks](#stacks). Por exemplo, se você estiver renderizando um determinado [componente](#componentes) dentro de um loop, você pode desejar que esse componente seja renderizado apenas uma vez dentro do cabeçalho da página:

````
@once
    @push('scripts')
        <script>
            // Seu JavaScript personalizado...
        </script>
    @endpush
@endonce

Uma vez que a diretiva `@once` é frequentemente usada em conjunto com as diretivas `@push` ou `@prepend`, as diretivas `@pushOnce` e `@prependOnce` também estão disponíveis para simplificar o uso dessas diretivas em conjunto com `@once`:

```blade
@pushOnce('scripts')
    <script>
        // Seu JavaScript personalizado...
    </script>
@endPushOnce
````

### PHP Puro

Em algumas situações, é útil incorporar código PHP em suas views. Você pode utilizar a diretiva Blade `@php` para executar um bloco de PHP puro dentro do seu template:

```blade
@php
    $counter = 1;
@endphp
```

Ou, se você só precisa usar o PHP para importar uma classe, então você pode utilizar a diretiva `@use`:

```blade
@use('App\Models\Flight')
```

Um segundo argumento pode ser fornecido para a diretiva `@use` para dar um apelido (<em>alias</em>) à classe importada:

```php
@use('App\Models\Flight', 'FlightModel')
```

### Comentários

O Blade também permite que você defina comentários em suas views. No entanto, ao contrário dos comentários HTML, os comentários Blade não são incluídos no HTML retornado:

```blade
{{-- Este comentário não estará presente no HTML renderizado --}}
```

## Componentes

Os componentes e slots fornecem benefícios semelhantes às seções, layouts e includes; no entanto, alguns podem achar o modelo mental de componentes e slots mais fácil de entender. Existem duas abordagens para escrever componentes: componentes baseados em classes e componentes anônimos.

Para criar um componente baseado em classe, você pode usar o comando Artisan `make:component`. Para ilustrar como utilizar componentes, criaremos um componente `Alert` simples. O comando `make:component` colocará o componente no diretório `app/View/Components`:

```shell
php artisan make:component Alert
```

O comando `make:component` também criará um template de view para o componente. A view será colocada no diretório `resources/views/components`. Ao escrever componentes para sua própria aplicação, os componentes são automaticamente descobertos dentro do diretório `app/View/Components` e do diretório `resources/views/components`, então geralmente não é necessário nenhum outro registro do componente.

Você também pode criar componentes dentro de subdiretórios:

```shell
php artisan make:component Forms/Input
```

O comando acima criará um componente `Input` no diretório `app/View/Components/Forms` e a view será colocada no diretório `resources/views/components/forms`.

Se você deseja criar um componente anônimo (um componente com apenas um template Blade e sem classe), você pode utilizar a flag `--view` ao invocar o comando `make:component`:

```shell
php artisan make:component forms.input --view
```

O comando acima criará um arquivo Blade em `resources/views/components/forms/input.blade.php` que pode ser renderizado como um componente via `<x-forms.input />`.

### Registrando manualmente componentes de pacotes

Ao escrever componentes para sua própria aplicação, os componentes são automaticamente descobertos dentro do diretório `app/View/Components` e do diretório `resources/views/components`.

No entanto, se você estiver construindo um pacote que utiliza componentes Blade, você precisará registrar manualmente a classe do seu componente e seu apelido (alias) de tag HTML. Você deve registrar seus componentes no método `boot` no service provider do seu pacote:

```php
use Illuminate\Support\Facades\Blade;

/**
 * Bootstrap your package's services.
 */
public function boot(): void
{
    Blade::component('package-alert', Alert::class);
}
```

Uma vez que seu componente foi registrado, ele pode ser renderizado usando seu alias de tag:

```blade
<x-package-alert/>
```

Como alternativa, você pode utilizar o método `componentNamespace` para carregar automaticamente as classes de componentes do seu pacote. Por exemplo, um pacote `Nightshade` pode ter componentes `Calendar` e `ColorPicker` que pertecem ao namespace `Nightshade\Views\Components`:

```php
use Illuminate\Support\Facades\Blade;

/**
 * Bootstrap your package's services.
 */
public function boot(): void
{
    Blade::componentNamespace('Nightshade\\Views\\Components', 'nightshade');
}
```

Isso permitirá que você utilize componentes de pacotes usando o namespace específico do pacote. Você pode acessar esses componentes com a seguinte sintaxe `nome-do-pacote::`:

```blade
<x-nightshade::calendar />
<x-nightshade::color-picker />
```

O Blade detectará automaticamente a classe vinculada a este componente convertendo o nome do componente em PascalCase. Subdiretórios também são suportados utilizando a notação de "ponto".

### Exibindo Componentes

Para exibir um componente, você pode utilizar uma tag de componente Blade dentro de um dos seus templates Blade. As tags de componente Blade começam com a string `x-` seguida pelo nome em kebab case da classe do componente:

```blade
<x-alert/>

<x-user-profile/>
```

Se a classe do componente estiver aninhada mais profundamente dentro do diretório `app/View/Components`, você pode utilizar o caractere `.` para indicar o aninhamento de diretórios. Por exemplo, se assumirmos que um componente está localizado em `app/View/Components/Inputs/Button.php`, podemos renderizá-lo da seguinte forma:

```blade
<x-inputs.button/>
```

Se você deseja renderizar condicionalmente seu componente, você pode definir um método `shouldRender` na classe do seu componente. Se o método `shouldRender` retornar `false`, o componente não será renderizado:

```php
use Illuminate\Support\Str;

/**
 * Whether the component should be rendered
 */
public function shouldRender(): bool
{
    return Str::length($this->message) > 0;
}
```

### Componentes Index

Às vezes, os componentes fazem parte de um grupo de componentes e você pode desejar agrupar os componentes relacionados dentro de um único diretório. Por exemplo, imagine um componente "card" com a seguinte estrutura de classe:

```none
App\Views\Components\Card\Card
App\Views\Components\Card\Header
App\Views\Components\Card\Body
```

Uma vez que o componente raiz `Card` está aninhado dentro de um diretório `Card`, você pode esperar que precise renderizar o componente via `<x-card.card>`. No entanto, quando o nome do arquivo do componente corresponde ao nome do diretório do componente, o Laravel automaticamente assume que o componente é o componente "raiz" e permite que você renderize o componente sem repetir o nome do diretório:

```blade
<x-card>
    <x-card.header>...</x-card.header>
    <x-card.body>...</x-card.body>
</x-card>
```

### Passando Dados para Componentes

Você pode passar dados para componentes Blade utilizando atributos HTML. Valores primitivos codificados podem ser passados para o componente utilizando strings de atributos HTML simples. Expressões PHP e variáveis devem ser passadas para o componente via atributos que usam o caractere `:` como prefixo:

```blade
<x-alert type="error" :message="$message"/>
```

Você deve definir todos os atributos de dados do componente no construtor da sua classe. Todas as propriedades públicas de um componente serão automaticamente disponibilizadas para a view do componente. Não é necessário passar os dados para a view a partir do método `render` do componente:

```php
<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class Alert extends Component
{
    /**
     * Cria a instância do componente.
     */
    public function __construct(
        public string $type, // Poderá ser acessada como {{ $type }} na view
        public string $message, // Poderá ser acessada como {{ $message }} na view
    ) {}

    /**
     * Retorna a view que representa o componente.
     */
    public function render(): View
    {
        return view('components.alert');
    }
}
```

Quando a view do componente é renderizada, você pode exibir o conteúdo das variáveis públicas da classe do componente:

```blade
<div class="alert alert-{{ $type }}">
    {{ $message }}
</div>
```

#### Casing

Os argumentos do construtor do componente devem ser especificados usando `camelCase`, enquanto `kebab-case` deve ser usado ao referenciar os nomes dos argumentos em seus atributos HTML. Por exemplo, dado o seguinte construtor de componente:

```php
/**
 * Cria a instância do componente.
 */
public function __construct(
    public string $alertType,
) {}
```

O argumento `$alertType` pode ser fornecido ao componente da seguinte forma:

```blade
<x-alert alert-type="danger" />
```

#### Sintaxe de Short Attributes

Ao passar atributos para componentes, você pode utilizar uma "sintaxe de atributo curto". Isso é conveniente, uma vez que os nomes dos atributos frequentemente correspondem aos nomes das variáveis que eles representam:

```blade
{{-- Sintaxe de atributo curto... --}}
<x-profile :$userId :$name />

{{-- É equivalente a... --}}
<x-profile :user-id="$userId" :name="$name" />
```

#### Evitando a Renderização de Atributos

Como alguns frameworks JavaScript, como o Alpine.js, também usam atributos prefixados por dois pontos, você pode usar um prefixo de dois pontos (`::`) para informar ao Blade que o atributo não é uma expressão PHP. Por exemplo, dado o seguinte componente:

```blade
<x-button ::class="{ danger: isDeleting }">
    Submit
</x-button>
```

O HTML a seguir será renderizado pelo Blade:

```blade
<button :class="{ danger: isDeleting }">
    Submit
</button>
```

#### Métodos de Componentes

Além das variáveis públicas disponíveis para o template do seu componente, qualquer método público no componente pode ser invocado. Por exemplo, imagine um componente que possui um método `isSelected`:

```php
/**
 * Determine se a opção fornecida é a opção atualmente selecionada.
 */
public function isSelected(string $option): bool
{
    return $option === $this->selected;
}
```

Você pode executar este método a partir do template do seu componente invocando a variável que corresponde ao nome do método:

```blade
<option {{ $isSelected($value) ? 'selected' : '' }} value="{{ $value }}">
    {{ $label }}
</option>
```

#### Acessando Atributos e Slots Dentro de Classes de Componentes

Os componentes Blade também permitem que você acesse o nome do componente, atributos e slot dentro do método `render` da classe. No entanto, para acessar esses dados, você deve retornar um closure do método `render` do seu componente:

```php
use Closure;

/**
 * Retorna a view / conteúdo que representa o componente.
 */
public function render(): Closure
{
    return function () {
        return '<div {{ $attributes }}>Contéudo do componente</div>';
    };
}
```

O closure retornado pelo método `render` do seu componente também pode receber um array `$data` como seu único argumento. Este array conterá vários elementos que fornecem informações sobre o componente:

```php
return function (array $data) {
    // $data['componentName'];
    // $data['attributes'];
    // $data['slot'];

    return '<div {{ $attributes }}>Contéudo do componente</div>';
}
```

::: danger
Os elementos no array `$data` nunca devem ser incorporados diretamente na string Blade retornada pelo método `render` do seu componente, pois isso poderia permitir a execução de código remoto através do conteúdo do atributo malicioso.
:::

O `componentName` é igual ao nome utilizado na tag HTML após o prefixo `x-`. Portanto, o `componentName` de `<x-alert />` será `alert`. O elemento `attributes` conterá todos os atributos que estavam presentes na tag HTML. O elemento `slot` é uma instância de `Illuminate\Support\HtmlString` com o conteúdo do slot do componente.

A closure deve retornar uma string. Se a string retornada corresponder a uma view existente, essa view será renderizada; caso contrário, a string retornada será avaliada como uma view Blade inline.

#### Depêndencias Adicionais

Se o seu componente requer dependências do <a href="/conceitos-de-arquitetura/service-container" target="_blank">service container</a> do Laravel, você pode listá-las antes de quaisquer dos atributos de dados do componente e elas serão automaticamente injetadas pelo container:

```php
use App\Services\AlertCreator;

/**
 * Create the component instance.
 */
public function __construct(
    public AlertCreator $creator,
    public string $type,
    public string $message,
) {}
```

#### Escondendo Atributos / Métodos

Se você deseja impedir que alguns métodos ou propriedades públicas sejam expostos como variáveis para o template do seu componente, você pode adicioná-los a uma propriedade de array `$except` no seu componente:

```php
<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Alert extends Component
{
    /**
     * As propriedades / métodos que não devem ser expostos para o template do componente.
     *
     * @var array
     */
    protected $except = ['type'];

    /**
     * Create the component instance.
     */
    public function __construct(
        public string $type,
    ) {}
}
```

### Atributos de Componentes

Às vezes você pode precisar especificar atributos HTML adicionais, como `class`, que não fazem parte dos dados necessários para que um componente funcione. Normalmente, você deseja passar esses atributos adicionais para o elemento raiz do template do componente. Por exemplo, imagine que queremos renderizar um componente `alert` da seguinte forma:

```blade
<x-alert type="error" :message="$message" class="mt-4"/>
```

Todos os atributos que não fazem parte do construtor do componente serão automaticamente adicionados a "attribute bag" do componente. Este "saco de atributos" é automaticamente disponibilizado para o componente via variável `$attributes`. Todos os atributos podem ser renderizados dentro do componente ao imprimir esta variável:

```blade
<div {{ $attributes }}>
    <!-- Conteúdo do componente -->
</div>
```

::: danger
O uso de diretivas como `@env` dentro das tags de componentes não é suportado no momento. Por exemplo, `<x-alert :live="@env('production')"/>` não será compilado.
:::

#### Mesclando Atributos

Se você deseja mesclar um atributo específico com um valor adicional, você pode utilizar o método `merge` do <em>attribute bag</em>. Este método é particularmente útil para definir um conjunto de classes CSS padrão que devem sempre ser aplicadas a um componente:

````blade
<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
    {{ $message }}
</div>

Se assumirmos que este componente é utilizado da seguinte forma:

```blade
<x-alert type="error" :message="$message" class="mb-4"/>
````

O HTML final renderizado do componente será semelhante ao seguinte:

```blade
<div class="alert alert-error mb-4">
    <!-- Conteúdo da variável $message -->
</div>
```

#### Merge de classes condicional

Às vezes, você pode desejar mesclar classes se uma determinada condição for `true`. Você pode fazer isso via método `class`, que aceita um array de classes onde a chave do array contém a classe ou classes que você deseja adicionar, enquanto o valor é uma expressão booleana. Se o elemento do array tiver uma chave numérica, ele sempre será incluído na lista de classes renderizadas:

```blade
<div {{ $attributes->class(['p-4', 'bg-red' => $hasError]) }}>
    {{ $message }}
</div>
```

Se você precisar mesclar outros atributos em seu componente, você pode encadear o método `merge` no método `class`:

```blade
<button {{ $attributes->class(['p-4'])->merge(['type' => 'button']) }}>
    {{ $slot }}
</button>
```

::: tip
Se você precisar compilar condicionalmente classes em outros elementos HTML que não devem receber atributos mesclados, você pode usar a [diretiva `@class`](#classes-e-estilos-condicionais).
:::

#### Mesclando Atributos que não são Classes

Ao mesclar atributos que não são classes, os valores fornecidos ao método `merge` serão considerados os valores "padrões" do atributo. No entanto, ao contrário do atributo `class`, esses atributos não serão mesclados com os valores de atributos injetados. Em vez disso, eles serão sobrescritos. Por exemplo, a implementação de um componente `button` pode ser semelhante ao seguinte:

```blade
<button {{ $attributes->merge(['type' => 'button']) }}>
    {{ $slot }}
</button>
```

Para renderizar o componente de botão com um `type` personalizado, ele pode ser especificado ao utilizar o componente. Se nenhum tipo for especificado, o tipo `button` será usado:

```blade
<x-button type="submit">
    Submit
</x-button>
```

O HTML renderizado do componente `button` neste exemplo seria:

```blade
<button type="submit">
    Submit
</button>
```

Se você deseja que um atributo diferente de `class` tenha seu valor padrão e os valores injetados juntos, você pode utilizar o método `prepends`. Neste exemplo, o atributo `data-controller` sempre começará com `profile-controller` e quaisquer valores `data-controller` injetados adicionais serão colocados após esse valor padrão:

```blade
<div {{ $attributes->merge(['data-controller' => $attributes->prepends('profile-controller')]) }}>
    {{ $slot }}
</div>
```

#### Recuperando e Filtrando Atributos

Você pode filtrar atributos utilizando o método `filter`. Este método aceita uma closure que deve retornar `true` se você deseja manter o atributo no <em>attribute bag</em>:

```blade
{{ $attributes->filter(fn (string $value, string $key) => $key == 'foo') }}
```

Para facilitar, você pode utilizar o método `whereStartsWith` para recuperar todos os atributos que começam com uma determinada string:

```blade
{{ $attributes->whereStartsWith('wire:model') }}
```

Por outro lado, o método `whereDoesntStartWith` pode ser utilizado para excluir todos os atributos cujas chaves começam com uma determinada string:

```blade
{{ $attributes->whereDoesntStartWith('wire:model') }}
```

Utilizando o método `first`, você pode renderizar o primeiro atributo em um determinado <em>attribute bag</em>:

```blade
{{ $attributes->whereStartsWith('wire:model')->first() }}
```

Se você deseja verificar se um atributo está presente no componente, você pode utilizar o método `has`. Este método aceita o nome do atributo como seu único argumento e retorna um booleano indicando se o atributo está presente ou não:

```blade
@if ($attributes->has('class'))
    <div>O atributo "classe" está presente</div>
@endif
```

Se um array for passado para o método `has`, o método determinará se todos os atributos fornecidos estão presentes no componente:

```blade
@if ($attributes->has(['name', 'class']))
    <div>Todos os atributos estão presentes</div>
@endif
```

O método `hasAny` pode ser utilizado para determinar se algum dos atributos fornecidos está presente no componente:

```blade
@if ($attributes->hasAny(['href', ':href', 'v-bind:href']))
    <div>Um dos atributos está presente</div>
@endif
```

Você pode recuperar o valor de um atributo específico utilizando o método `get`:

```blade
{{ $attributes->get('class') }}
```

### Palavras-chave Reservadas

Por padrão, algumas palavras-chave são reservadas para uso interno do Blade a fim de renderizar componentes. As seguintes palavras-chave <span class="highlight">não podem ser definidas</span> como propriedades públicas ou nomes de métodos dentro dos seus componentes:

- `data`
- `render`
- `resolveView`
- `shouldRender`
- `view`
- `withAttributes`
- `withName`

### Slots

Você frequentemente precisará passar conteúdo adicional para o seu componente via "slots". Os slots de componentes são renderizados ao imprimir a variável `$slot`. Para explorar este conceito, vamos imaginar que um componente `alert` tenha a seguinte marcação:

```blade
<!-- /resources/views/components/alert.blade.php -->

<div class="alert alert-danger">
    {{ $slot }}
</div>
```

Podemos passar conteúdo para o `slot` injetando conteúdo no componente:

```blade
<x-alert>
    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

Às vezes, um componente pode precisar renderizar vários slots diferentes em locais diferentes dentro do componente. Vamos modificar nosso componente de alerta para permitir a injeção de um slot "title":

```blade
<!-- /resources/views/components/alert.blade.php -->

<span class="alert-title">{{ $title }}</span>

<div class="alert alert-danger">
    {{ $slot }}
</div>
```

Você pode definir o conteúdo do slot nomeado utilizando a tag `x-slot`. Qualquer conteúdo que não esteja dentro de uma tag `x-slot` explícita será passado para o componente na variável `$slot`:

```xml
<x-alert>
    <x-slot:title>
        Server Error
    </x-slot>

    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

Você pode utilizar o método `isEmpty` para determinar se o slot contém conteúdo:

```blade
<span class="alert-title">{{ $title }}</span>

<div class="alert alert-danger">
    @if ($slot->isEmpty())
        <span>Este é o conteúdo padrão se o slot estiver vazio.</span>
    @else
        {{ $slot }}
    @endif
</div>
```

Além disso, o método `hasActualContent` pode ser utilizado para determinar se o slot contém algum conteúdo "real" que não seja um comentário HTML:

```blade
@if ($slot->hasActualContent())
    Este slot contém conteúdo não comentado.
@endif
```

#### Slots com Escopo (Scoped Slots)

Se você já utilizou algum framework JavaScript como o Vue, você pode estar familiarizado com "slots com escopo", que permitem que você acesse dados ou métodos do componente dentro do seu slot. Você pode ter um comportamento semelhante no Laravel definindo métodos ou propriedades públicas no seu componente e acessando o componente dentro do seu slot via variável `$component`. Neste exemplo, vamos assumir que o componente `x-alert` tem um método público `formatAlert` definido na classe do componente:

```blade
<x-alert>
    <x-slot:title>
        {{ $component->formatAlert('Server Error') }}
    </x-slot>

    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

#### Atributos em Slots

Assim como nos componentes Blade, você pode utilizar [atributos](#atributos-de-componentes) adicionais aos slots, como nomes de classes CSS:

```xml
<x-card class="shadow-sm">
    <x-slot:heading class="font-bold">
        Heading
    </x-slot>

    Content

    <x-slot:footer class="text-sm">
        Footer
    </x-slot>
</x-card>
```

Para interagir com os atributos do slot, você pode acessar a propriedade `attributes` da variável do slot. Para mais informações sobre como interagir com atributos, consulte a documentação sobre [atributos de componentes](#atributos-de-componentes):

```blade
@props([
    'heading',
    'footer',
])

<div {{ $attributes->class(['border']) }}>
    <h1 {{ $heading->attributes->class(['text-lg']) }}>
        {{ $heading }}
    </h1>

    {{ $slot }}

    <footer {{ $footer->attributes->class(['text-gray-700']) }}>
        {{ $footer }}
    </footer>
</div>
```

### Componentes em Linha (Inline)

Para componentes muito pequenos, pode parecer complicado gerenciar tanto a classe do componente quanto o template da view do componente. Por esse motivo, você pode retornar o conteúdo do componente diretamente do método `render`:

```php
/**
 * Get the view / contents that represent the component.
 */
public function render(): string
{
    return <<<'blade'
        <div class="alert alert-danger">
            {{ $slot }}
        </div>
    blade;
}
```

#### Gerando Componentes em Linha

Para criar um componente que renderiza uma view em linha, você pode utilizar a opção `inline` ao executar o comando `make:component`:

```shell
php artisan make:component Alert --inline
```

### Componentes Dinâmicos

Às vezes, você pode precisar renderizar um componente, mas não saber qual componente deve ser renderizado até o tempo de execução. Nesta situação, você pode utilizar o componente `dynamic-component` integrado do Laravel para renderizar o componente com base em um valor ou variável em tempo de execução:

```blade
// $componentName = "secondary-button";

<x-dynamic-component :component="$componentName" class="mt-4" />
```

### Registrando manualmente componentes

::: danger
A documentação a seguir sobre o registro componentes manualmente é principalmente aplicável àqueles que estão criando pacotes para o Laravel que incluem componentes. Se você não está criando um pacote, esta parte da documentação sobre componentes pode não ser relevante para você.
:::

Ao escrever componentes para sua própria aplicação, os componentes são automaticamente descobertos dentro do diretório `app/View/Components` e do diretório `resources/views/components`.

No entanto, se você estiver construindo um pacote que utiliza componentes Blade, você precisará registrar manualmente a classe do seu componente e seu apelido (alias) de tag HTML. Você deve registrar seus componentes no método `boot` no service provider do seu pacote:

```php
use Illuminate\Support\Facades\Blade;
use VendorPackage\View\Components\AlertComponent;

/**
 * Bootstrap your package's services.
 */
public function boot(): void
{
    Blade::component('docsbrasil-alert', AlertComponent::class);
}
```

Uma vez que seu componente foi registrado, ele pode ser renderizado usando seu alias de tag:

```blade
<x-docsbrasil-alert/>
```

#### Carregando Automaticamente Componentes de Pacotes

Como alternativa, você pode utilizar o método `componentNamespace` para carregar automaticamente as classes de componentes do seu pacote. Por exemplo, um pacote `DocsBrasil` pode ter componentes `Calendar` e `ColorPicker` que pertecem ao namespace `DocsBrasil\Views\Components`:

```php
use Illuminate\Support\Facades\Blade;

/**
 * Bootstrap your package's services.
 */
public function boot(): void
{
    Blade::componentNamespace('DocsBrasil\\Views\\Components', 'docsbrasil');
}
```

Isso permitirá que você utilize componentes de pacotes usando o namespace específico do pacote. Você pode acessar esses componentes com a seguinte sintaxe `nome-do-pacote::`:

```blade
<x-docsbrasil::calendar />
<x-docsbrasil::color-picker />
```

O Blade detectará automaticamente a classe vinculada a este componente convertendo o nome do componente em PascalCase. Subdiretórios também são suportados utilizando a notação de "ponto".

## Componentes Anônimos

De forma semelhante aos componentes em linha, os componentes anônimos fornecem um mecanismo para gerenciar um componente por meio de um único arquivo. No entanto, os componentes anônimos utilizam um único arquivo de view e não têm uma classe associada. Para definir um componente anônimo, você só precisa colocar um template Blade dentro do diretório `resources/views/components`. Por exemplo, assumindo que você definiu um componente em `resources/views/components/alert.blade.php`, você pode simplesmente renderizá-lo da seguinte forma:

```blade
<x-alert/>
```

Você pode utilizar o caractere `.` para indicar se um componente está aninhado mais profundamente dentro do diretório `components`. Por exemplo, assumindo que o componente está definido em `resources/views/components/inputs/button.blade.php`, você pode renderizá-lo da seguinte forma:

```blade
<x-inputs.button/>
```

### Componentes Index Anônimos

Às vezes, quando um componente é composto por muitos templates Blade, você pode desejar agrupar os templates do componente dentro de um único diretório. Por exemplo, imagine um componente "accordion" com a seguinte estrutura de diretório:

```none
/resources/views/components/accordion.blade.php
/resources/views/components/accordion/item.blade.php
```

Esta estrutura de diretório permite que você renderize o componente accordion e seu item da seguinte forma:

```blade
<x-accordion>
    <x-accordion.item>
        ...
    </x-accordion.item>
</x-accordion>
```

No entanto, para renderizar o componente accordion via `x-accordion`, fomos forçados a colocar o template "index" do componente accordion no diretório `resources/views/components` em vez de aninhá-lo dentro do diretório `accordion` com os outros templates relacionados ao accordion.

Felizmente, o Blade permite que você coloque um arquivo que corresponda ao nome do diretório do componente dentro do próprio diretório do componente. Quando este template existe, ele pode ser renderizado como o elemento "raiz" do componente, mesmo que esteja aninhado dentro de um diretório. Portanto, podemos continuar a utilizar a mesma sintaxe Blade dada no exemplo acima; no entanto, ajustaremos nossa estrutura de diretório da seguinte forma:

```none
/resources/views/components/accordion/accordion.blade.php
/resources/views/components/accordion/item.blade.php
```

### Passando dados e Atributos

Como os componentes anônimos não têm uma classe associada, você pode se perguntar como diferenciar quais dados devem ser passados para o componente como variáveis e quais atributos devem ser colocados no [attribute bag](#atributos-de-componentes) do componente.

Você pode especificar quais atributos devem ser considerados variáveis utilizando a diretiva `@props` no topo do template Blade do seu componente. Todos os outros atributos no componente estarão disponíveis via <em>attribute bag</em>. Se você deseja dar a uma variável um valor padrão, você pode especificar o nome da variável como a chave do array e o valor padrão como o valor do array:

```blade
<!-- /resources/views/components/alert.blade.php -->

@props(['type' => 'info', 'message'])

<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
    {{ $message }}
</div>
```

Dada a definição do componente acima, podemos renderizar o componente da seguinte forma:

```blade
<x-alert type="error" :message="$message" class="mb-4"/>
```

### Acessando Dados do Componente Pai

Às vezes, você pode querer acessar dados de um componente pai dentro de um componente filho. Nestes casos, você pode utilizar a diretiva `@aware`. Por exemplo, imagine que estamos construindo um componente de menu complexo composto por um componente pai `<x-menu>` e um componente filho `<x-menu.item>`:

```blade
<x-menu color="purple">
    <x-menu.item>...</x-menu.item>
    <x-menu.item>...</x-menu.item>
</x-menu>
```

O componente `<x-menu>` pode ter uma implementação como a seguinte:

```blade
<!-- /resources/views/components/menu/index.blade.php -->

@props(['color' => 'gray'])

<ul {{ $attributes->merge(['class' => 'bg-'.$color.'-200']) }}>
    {{ $slot }}
</ul>
```

Como a propriedade `color` foi passada apenas para o componente pai (`<x-menu>`), ela não estará disponível dentro de `<x-menu.item>`. No entanto, se utilizarmos a diretiva `@aware`, podemos torná-la disponível dentro de `<x-menu.item>` também:

```blade
<!-- /resources/views/components/menu/item.blade.php -->

@aware(['color' => 'gray'])

<li {{ $attributes->merge(['class' => 'text-'.$color.'-800']) }}>
    {{ $slot }}
</li>
```

::: danger
A diretiva `@aware` só consegue acessar dados do componente pai que foram explicitamente passados para ele como atributos HTML. Valores padrão definidos em `@props`, mas que não foram passados diretamente para o componente pai, não estarão disponíveis para a diretiva `@aware`.
:::

### Caminhos de Componentes Anônimos

Componentes anônimos são tipicamente definidos colocando um template Blade dentro do diretório `resources/views/components`. No entanto, você pode querer registrar outros caminhos de componentes além do caminho padrão.

O método `anonymousComponentPath` aceita o "caminho" para a localização do componente como seu primeiro argumento e um "namespace" opcional que os componentes devem ser colocados como seu segundo argumento. Tipicamente, este método deve ser chamado a partir do método `boot` de um dos <a href="/conceitos-de-arquitetura/service-provider" target="_blank">service providers</a> da sua aplicação:

```php
/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Blade::anonymousComponentPath(__DIR__.'/../components');
}
```

Quando um novo caminho de componentes é registrado sem um prefixo específico como no exemplo acima, eles podem ser renderizados nos seus componentes sem um prefixo também. Por exemplo, se um componente `panel.blade.php` existir no caminho registrado acima, ele pode ser renderizado da seguinte forma:

```blade
<x-panel />
```

Prefixos "namespaces" podem ser fornecidos como o segundo argumento para o método `anonymousComponentPath`:

```php
Blade::anonymousComponentPath(__DIR__.'/../components', 'dashboard');
```

Quando um prefixo é fornecido, os componentes dentro desse "namespace" podem ser renderizados prefixando o namespace do componente ao nome do componente:

```blade
<x-dashboard::panel />
```

## Construindo Layouts

### Layouts Utilizando Componentes

A maioria das aplicações web mantém o mesmo layout geral em várias páginas. É trabalhoso manter uma aplicação se tivermos que repetir todo o HTML do layout em cada view que criamos. Felizmente, é conveniente definir este layout como um único [componente Blade](#componentes) e então utilizá-lo em toda a nossa aplicação.

#### Definindo o Componente de Layout

Por exemplo, imagine que estamos construindo uma aplicação de lista de tarefas. Poderíamos definir um componente `layout` que se parece com o seguinte:

```blade
<!-- resources/views/components/layout.blade.php -->

<html>
    <head>
        <title>{{ $title ?? 'Todo Manager' }}</title>
    </head>
    <body>
        <h1>Todos</h1>
        <hr/>
        {{ $slot }}
    </body>
</html>
```

#### Utilizando o Componente de Layout

Uma vez que o componente `layout` foi definido, podemos criar uma view Blade que utiliza o componente. Neste exemplo, vamos definir uma view simples que exibe nossa lista de tarefas:

```blade
<!-- resources/views/tasks.blade.php -->

<x-layout>
    @foreach ($tasks as $task)
        <div>{{ $task }}</div>
    @endforeach
</x-layout>
```

Lembre-se, o conteúdo que é injetado em um componente será atribuído à variável padrão `$slot` dentro do nosso componente `layout`. Como você pode ter notado, nosso `layout` também contém um slot `$title` se o mesmo for fornecido; caso contrário, um título padrão é exibido. Podemos injetar um título personalizado da nossa view de lista de tarefas utilizando a sintaxe de slot padrão discutida na [documentação de componentes](#componentes):

```blade
<!-- resources/views/tasks.blade.php -->

<x-layout>
    <x-slot:title>
        Custom Title
    </x-slot>

    @foreach ($tasks as $task)
        <div>{{ $task }}</div>
    @endforeach
</x-layout>
```

Agora que definimos nosso layout e views de lista de tarefas, só precisamos retornar a view `task`:

```php
use App\Models\Task;

Route::get('/tasks', function () {
    return view('tasks', ['tasks' => Task::all()]);
});
```

### Layouts Utilizando Herança de Templates

Layouts também podem ser criados via "herança de templates". Esta já foi a principal forma de construir aplicações antes da introdução de [componentes](#componentes).

Para começar, vamos dar uma olhada em um exemplo simples. Primeiro, vamos examinar um layout de página. Como a maioria das aplicações web mantém o mesmo layout geral em várias páginas, é conveniente definir este layout como uma única view Blade:

```blade
<!-- resources/views/layouts/app.blade.php -->

<html>
    <head>
        <title>App Name - @yield('title')</title>
    </head>
    <body>
        @section('sidebar')
            Esta é a barra lateral principal.
        @show

        <div class="container">
            @yield('content')
        </div>
    </body>
</html>
```

Como você pode ver, este arquivo contém marcação HTML típica. No entanto, observe as diretivas `@section` e `@yield`. A diretiva `@section`,como o nome sugere, define uma seção de conteúdo, enquanto a diretiva `@yield` é utilizada para exibir o conteúdo de uma determinada seção.

Agora que definimos um layout para nossa aplicação, vamos definir uma página filha que herda o layout.

#### Estendendo um Layout

Ao definir uma view filha, utilize a diretiva `@extends` do Blade para especificar qual layout a view filha deve "herdar". Views que estendem um layout Blade podem injetar conteúdo nas seções do layout utilizando diretivas `@section`. Lembre-se, como visto no exemplo acima, o conteúdo destas seções será exibido no layout utilizando `@yield`:

```blade
<!-- resources/views/child.blade.php -->

@extends('layouts.app')

@section('title', 'Título da Página')

@section('sidebar')
    @parent

    <p>Este é um texto adicionado à barra lateral principal.</p>
@endsection

@section('content')
    <p>Este é o conteúdo do corpo da página.</p>
@endsection
```

Neste exemplo, a seção `sidebar` está utilizando a diretiva `@parent` para anexar (em vez de sobrescrever) o conteúdo da barra lateral do layout. A diretiva `@parent` será substituída pelo conteúdo do layout quando a view for renderizada.

::: tip
Ao contrário do exemplo anterior, esta seção `sidebar` termina com `@endsection` em vez de `@show`. A diretiva `@endsection` apenas define uma seção, enquanto `@show` define e **imediatamente exibe** a seção.
:::

A diretiva `@yield` também aceita um valor padrão como seu segundo parâmetro. Este valor será renderizado se a seção que está sendo exibida não estiver definida:

```blade
@yield('content', 'Conteúdo padrão')
```

## Formulários

### Campo CSFR

Sempre que você definir um formulário HTML em sua aplicação, você deve incluir um campo de token CSRF oculto no formulário para que
<a href="/fundamentos/protecao-csrf" target="_blank">a proteção CSRF</a> possa validar a requisição. Você pode utilizar a diretiva
`@csrf` para gerar o campo necessário:

```blade
<form method="POST" action="/profile">
    @csrf

    ...
</form>
```

### Campos de Métodos HTTP

Formulários HTML não podem fazer requisições `PUT`, `PATCH` ou `DELETE`, então você precisará adicionar um campo `_method` oculto para
simular esses verbos HTTP. A diretiva `@method` pode criar este campo para você:

```blade
<form action="/foo/bar" method="POST">
    @method('PUT')

    ...
</form>
```

### Erros de Validação

A diretiva `@error` pode ser utilizada para verificar rapidamente se existem <a href="/fundamentos/validacao" target="_blank">mensagens de erros de 
validação</a> para um determinado atributo. Dentro de uma diretiva `@error`, você pode imprimir a variável `$message` para exibir 
a mensagem de erro:

```blade
<!-- /resources/views/post/create.blade.php -->

<label for="title">Post Title</label>

<input
    id="title"
    type="text"
    class="@error('title') is-invalid @enderror"
/>

@error('title')
    <div class="alert alert-danger">{{ $message }}</div>
@enderror
```

Como a diretiva `@error` compila para uma instrução "if", você pode utilizar a diretiva `@else` para renderizar conteúdo quando não
houver um erro para um atributo:

```blade
<!-- /resources/views/auth.blade.php -->

<label for="email">Email address</label>

<input
    id="email"
    type="email"
    class="@error('email') is-invalid @else is-valid @enderror"
/>
```

Você pode passar <a href="/fundamentos/validacao" target="_blank">o nome de uma "bag" de erros específica</a> como o segundo parâmetro para a diretiva 
`@error` para recuperar mensagens de erro de validação em páginas contendo múltiplos formulários:

```blade
<!-- /resources/views/auth.blade.php -->

<label for="email">Email address</label>

<input
    id="email"
    type="email"
    class="@error('email', 'login') is-invalid @enderror"
/>

@error('email', 'login')
    <div class="alert alert-danger">{{ $message }}</div>
@enderror
```

## Stacks

O Blade permite adicionar conteúdo a "pilhas nomeadas" (stacks), que podem ser renderizadas em uma parte diferente de outra view 
ou layout. Isso é especialmente útil para declarar bibliotecas JavaScript necessárias pelas views filhas.

```blade
@push('scripts')
    <script src="/example.js"></script>
@endpush
```

Se você deseja adicionar o conteúdo a uma stack se uma determinada expressão booleana for `true`, você pode utilizar a diretiva `@pushIf`:

```blade
@pushIf($shouldPush, 'scripts')
    <script src="/example.js"></script>
@endPushIf
```

Você pode adicionar conteúdo a uma stack quantas vezes forem necessárias. Para renderizar o conteúdo completo da stack, passe o 
nome da stack para a diretiva `@stack`:

```blade
<head>
    <!-- Restante do conteúdo do cabeçalho -->
 
    @stack('scripts')
</head>
```

## Injeção de Serviços

A diretiva `@inject` pode ser utilizada para recuperar um serviço do 
<a href="/conceitos-de-arquitetura/service-contaier" target="_blank">service container</a>. O primeiro argumento passado para `@inject` 
é o nome da variável na qual o serviço será colocado, enquanto o segundo argumento é o nome da classe ou interface que você deseja 
recuperar:

```blade
@inject('metrics', 'App\Services\MetricsService')
 
<div>
    Monthly Revenue: {{ $metrics->monthlyRevenue() }}.
</div>
```

## Renderizando Templates Blade Em Linha (Inline)

Às vezes, você pode precisar transformar uma string de Template Blade em um HTML válido. Você pode fazer isso utilizando o método `render` 
fornecido pela facade `Blade`. O método `render` aceita a string de um Template Blade e um array opcional de dados para fornecer 
ao template:

```php
use Illuminate\Support\Facades\Blade;
 
return Blade::render('Hello, {{ $name }}', ['name' => 'Julian Bashir']);
```

O Laravel renderiza templates Blade em linha armazenanado arquivos temporários no diretório `storage/framework/views`. Se você deseja que 
o Laravel remova esses arquivos temporários após renderizar o template Blade, você pode passar o argumento `deleteCachedView` ao método:

```php
return Blade::render(
    'Hello, {{ $name }}',
    ['name' => 'Julian Bashir'],
    deleteCachedView: true
);
```

## Renderizando Fragmentos de Templates Blade

Ao utilizar frameworks frontend como <a href="https://turbo.hotwired.dev/" target="_blank">Turbo</a> e 
<a href="https://htmx.org/" target="_blank">htmx</a>, você pode ocasionalmente precisar retornar apenas uma parte de um 
Template Blade dentro da sua resposta HTTP. Os "fragmentos" Blade permitem que você faça exatamente isso. Para começar, coloque uma parte 
do seu template Blade dentro das diretivas `@fragment` e `@endfragment`:

::: tip
Imagine o fragmento como um "pedaço" de um template Blade que você deseja retornar em uma <a href="/fundamentos/responses" target="_blank">resposta HTTP</a>.
:::

```blade
@fragment('user-list')
    <ul>
        @foreach ($users as $user)
            <li>{{ $user->name }}</li>
        @endforeach
    </ul>
@endfragment
```

Então, ao renderizar a view que utiliza este template, você pode invocar o método `fragment` para especificar que apenas o fragmento
especificado deve ser incluído na resposta HTTP:

```php
return view('dashboard', ['users' => $users])->fragment('user-list');
```

O método `fragmentIf` permite que você retorne condicionalmente um fragmento de uma view com base em uma determinada condição. 
Caso contrário, a view inteira será retornada:

```php
return view('dashboard', ['users' => $users])
    ->fragmentIf($request->hasHeader('HX-Request'), 'user-list');
```

Os métodos `fragments` e `fragmentsIf` permitem que você retorne múltiplos fragmentos. Os fragmentos serão concatenados juntos:

```php
view('dashboard', ['users' => $users])
    ->fragments(['user-list', 'comment-list']);
 
view('dashboard', ['users' => $users])
    ->fragmentsIf(
        $request->hasHeader('HX-Request'),
        ['user-list', 'comment-list']
    );
```

## Extendendo o Blade

O Blade permite que você defina suas próprias diretivas personalizadas utilizando o método `directive`. Quando o Compilador do Blade 
encontra a diretiva personalizada, ele chamará o callback fornecido com a expressões definidas.

O exemplo a seguir cria uma diretiva `@datetime($var)` que formata um `$var` fornecido, o mesmo deve ser uma instância de `DateTime`:

```php
<?php
 
namespace App\Providers;
 
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
 
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
        Blade::directive('datetime', function (string $expression) {
            return "<?php echo ($expression)->format('m/d/Y H:i'); ?>";
        });
    }
}
```

Como você pode ver, encadearemos o método `format` em qualquer expressão passada para a diretiva. Portanto, neste exemplo, o PHP final
gerado por esta diretiva será:

```php
<?php echo ($var)->format('m/d/Y H:i'); ?>
```

::: danger
Após atualizar a lógica de uma diretiva Blade, você precisará excluir todas as views em cache. As views em cache podem ser removidas 
utilizando o comando Artisan `view:clear`.
:::

### Mecanismos Personalizados para Exibição de Dados

Se você tentar "exibir" um objeto utilizando o Blade, o método `__toString` do objeto será invocado. O método <a href="https://www.php.net/manual/en/language.oop5.magic.php#object.tostring" target="_blank">`__toString`</a> é 
um dos "métodos mágicos" integrados do PHP. No entanto, às vezes você pode não ter controle sobre o método `__toString` de 
uma determinada classe, como quando a classe com a qual você está interagindo pertence a uma biblioteca de terceiros.

Nestes casos, o Blade permite que você registre uma forma personalizada para exibir esse tipo específico de objeto. Para
fazer isso, você deve invocar o método `stringable` do Blade. O método `stringable` aceita uma closure. Esta closure deve
conter o tipo de objeto que ela é responsável por renderizar. Como de costume, o método `stringable` deve ser utilizado dentro do
método `boot` da classe `AppServiceProvider` da sua aplicação:

```php
use Illuminate\Support\Facades\Blade;
use Money\Money;
 
/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Blade::stringable(function (Money $money) {
        return $money->formatTo('en_GB');
    });
}
```

Uma vez que definou sua personalização de foi definida, você pode simplesmente exibir o objeto no seu Template Blade:

```blade
Custo: {{ $money }}
```

### Condicionais Personalizadas

Programar uma diretiva personalizada pode ser mais complexo do que o necessário ao definir declarações condicionais personalizadas. 
Por esse motivo, o Blade fornece um método `Blade::if` que permite que você defina rapidamente diretivas condicionais personalizadas
utilizando closures. Por exemplo, vamos definir uma condição personalizada que verifica o "disco" padrão configurado para a aplicação. 
Podemos fazer isso no método `boot` do `AppServiceProvider`:

```php
use Illuminate\Support\Facades\Blade;
 
/**
 * Bootstrap any application services.
 */
public function boot(): void
{
    Blade::if('disk', function (string $value) {
        return config('filesystems.default') === $value;
    });
}
```

Uma vez que a condição personalizada foi definida, você pode utilizá-la nos seus templates:

```blade
@disk('local')
    <!-- A aplicação está utilizando o disco local... -->
@elsedisk('s3')
    <!-- A aplicação está utilizando o disco s3... -->
@else
    <!-- A aplicação está utilizando algum outro disco... -->
@enddisk
 
@unlessdisk('local')
    <!-- A aplicação não está utilizando o disco local... -->
@enddisk
```