<script setup>
import Info from '../components/Info.vue';
import Code from '../components/Code.vue';
</script>

# Frontend

## Introdução

O laravel é um framework backend que fornece todas as funcionalidades necessárias para construir aplicações web modernas, como <a href="/fundamentos/rotas" target="_blank">rotas</a>, <a href="/fundamentos/validacao" target="_blank">validação</a>, <a href="/explorando-mais-a-fundo/cache" target="_blank">cache</a>, <a href="/explorando-mais-a-fundo/filas" target="_blank">filas</a>, <a href="/explorando-mais-a-fundo/armazenamento-de-arquivos" target="_blank">armazenamento de arquivos</a> e muito mais. No entanto, acreditamos que é importante oferecer aos desenvolvedores uma bela experiência full-stack, incluindo abordagens poderosas para construir o frontend de sua aplicação.

Existem duas maneiras principais de abordar o desenvolvimento de frontend ao construir uma aplicação com Laravel, e a abordagem que você escolher é determinada por se você deseja construir seu frontend aproveitando o PHP ou usando frameworks JavaScript como Vue e React. Discutiremos essas duas opções abaixo para que você possa tomar uma decisão informada sobre a melhor abordagem para o desenvolvimento de frontend de sua aplicação.

## Usando PHP

### PHP e Blade

No passado, a maioria das aplicações PHP renderizava HTML para o navegador usando modelos HTML simples intercalados com declarações PHP <code>echo</code> que renderizavam dados que foram recuperados de um banco de dados durante a solicitação:

```php
<div>
    <?php foreach ($users as $user): ?>
        Hello, <?php echo $user->name; ?> <br />
    <?php endforeach; ?>
</div>
```

No Laravel, essa abordagem de renderização de HTML ainda pode ser alcançada usando <a href="/fundamentos/views" target="_blank">Views</a> e <a href="/fundamentos/templates-blade" target="_blank">Blade</a>. Blade é uma tecnologia de template extremamente leve que fornece uma sintaxe conveniente e curta para exibir dados, iterar sobre dados e muito mais:

```php
<div>
    @foreach ($users as $user)
        Hello, {{ $user->name }} <br />
    @endforeach
</div>
```
Quando você constrói aplicações dessa maneira, envios de formulários e outras interações de página normalmente recebem um novo documento HTML inteiro do servidor e a página inteira é renderizada novamente pelo navegador. Mesmo hoje, muitas aplicações podem ser perfeitamente adequadas para ter seus frontends construídos dessa maneira usando modelos Blade simples.

### Atendendo às Expectativas

No entanto, à medida que as expectativas dos usuários em relação às aplicações web amadureceram, muitos desenvolvedores encontraram a necessidade de construir frontends mais dinâmicos com interações que parecem mais polidas. Diante disso, alguns desenvolvedores optam por começar a construir o frontend de sua aplicação usando frameworks JavaScript como Vue e React.

Outros, preferindo ficar com a linguagem de backend com a qual estão confortáveis, desenvolveram soluções que permitem a construção de UIs de aplicativos web modernos enquanto ainda utilizam principalmente a linguagem de backend de sua escolha. Por exemplo, no ecossistema <a href="https://rubyonrails.org/" target="_blank">Rails</a>, isso levou à criação de bibliotecas como <a href="https://turbo.hotwired.dev/" target="_blank">Turbo</a> <a href="https://hotwired.dev/" target="_blank">Hotwire</a> e <a href="https://stimulus.hotwired.dev/" target="_blank">Stimulus</a>.

Dentro do ecossistema Laravel, a necessidade de criar frontends modernos e dinâmicos, principalmente usando PHP, levou à criação do <a href="https://livewire.laravel.com" target="_blank">Laravel Livewire</a> e do <a href="https://alpinejs.dev/" target="_blank">Alpine.js</a>.

### Livewire

<a href="https://livewire.laravel.com" target="_blank">Laravel Livewire</a> é um framework para construir frontends alimentados por Laravel que se sentem dinâmicos, modernos e vivos, assim como frontends construídos com frameworks JavaScript modernos como Vue e React.

Quando você usa Livewire, você criará "componentes" Livewire que renderizam uma parte discreta de sua UI e expõem métodos e dados que podem ter interações com o frontend. Por exemplo, um componente simples de "Contador" pode parecer com o seguinte:

```php
<?php
 
namespace App\Http\Livewire;
 
use Livewire\Component;
 
class Counter extends Component
{
    public $count = 0;
 
    public function increment()
    {
        $this->count++;
    }
 
    public function render()
    {
        return view('livewire.counter');
    }
}
```

E, o template correspondente para o contador seria escrito da seguinte forma:

```php
<div>
    <button wire:click="increment">+</button>
    <h1>{{ $count }}</h1>
</div>
```

Como você pode ver, Livewire permite que você escreva novos atributos HTML, como <code>wire:click</code>, que conectam o frontend e o backend de sua aplicação Laravel. Além disso, você pode renderizar o estado atual de seu componente usando expressões Blade simples.

Para muitos, Livewire revolucionou o desenvolvimento de frontend com Laravel, permitindo que eles permaneçam dentro do conforto do Laravel enquanto constroem aplicações web modernas e dinâmicas. Tipicamente, desenvolvedores que usam Livewire também utilizarão <a href="https://alpinejs.dev/">Alpine.js</a> para adicionar JavaScript em seu frontend apenas onde é necessário, como para renderizar um modal.

Se você é novo no Laravel, recomendamos se familiarizar com o uso básico de <a href="/fundamentos/views" target="_blank">Views</a> e <a href="/fundamentos/templates-blade" target="_blank">Blade</a>. Em seguida, consulte a documentação oficial do <a href="https://livewire.laravel.com/docs" target="_blank">Laravel Livewire</a> para aprender como levar sua aplicação para o próximo nível com componentes interativos do Livewire.

### Starter Kits

Se você deseja construir seu frontend usando PHP e Livewire, você pode aproveitar nossos <a href="/primeiros-passos/starter-kits" target="_blank">starter kits</a> Breeze ou Jetstream para iniciar o desenvolvimento de sua aplicação. Ambos os starter kits criam o fluxo de autenticação do backend e frontend de sua aplicação usando Blade e Tailwind para que você possa simplesmente começar a construir sua próxima grande ideia.

## Usando Vue / React

Embora seja possível construir frontends modernos usando Laravel e Livewire, muitos desenvolvedores ainda preferem aproveitar o poder de um framework JavaScript como Vue ou React. Isso permite que os desenvolvedores aproveitem o rico ecossistema de pacotes e ferramentas JavaScript disponíveis via NPM.

No entanto, sem ferramentas adicionais, combinar o Laravel com Vue ou React nos deixaria precisando resolver uma variedade de problemas complicados, como roteamento do lado do cliente, hidratação de dados e autenticação. O roteamento do lado do cliente é frequentemente simplificado usando frameworks Vue / React opinativos como <a href="https://nuxtjs.org/" target="_blank">Nuxt</a> e <a href="https://nextjs.org/" target="_blank">Next</a>; no entanto, a hidratação de dados e a autenticação permanecem problemas complicados e complicados de resolver ao combinar um framework backend como Laravel com esses frameworks frontend.

Além disso, os desenvolvedores são deixados mantendo dois repositórios de código separados, muitas vezes precisando coordenar a manutenção, lançamentos e deploys em ambos os repositórios. Embora esses problemas não sejam impossíveis de superar, não acreditamos que seja uma maneira produtiva ou agradável de desenvolver aplicações.

### Inertia

Felizmente, o Laravel oferece o melhor dos dois mundos. <a href="https://inertiajs.com" target="_blank">Inertia</a> preenche a lacuna entre sua aplicação Laravel e seu frontend moderno Vue ou React, permitindo que você construa frontends modernos completos usando Vue ou React enquanto aproveita as rotas e controladores do Laravel para roteamento, hidratação de dados e autenticação - tudo dentro de um único repositório de código. Com essa abordagem, você pode desfrutar de todo o poder do Laravel e do Vue / React sem prejudicar as capacidades de qualquer uma das ferramentas.

Depois de instalar o Inertia em sua aplicação Laravel, você escreverá rotas e controladores como de costume. No entanto, em vez de retornar um template Blade de seu controlador, você retornará uma página Inertia:

```php
<?php
 
namespace App\Http\Controllers;
 
use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
 
class UserController extends Controller
{
    /**
     * Show the profile for a given user.
     */
    public function show(string $id): Response
    {
        return Inertia::render('Users/Profile', [
            'user' => User::findOrFail($id)
        ]);
    }
}
```

Uma página Inertia corresponde a um componente Vue ou React, normalmente armazenado no diretório <code>resources/js/Pages</code> de sua aplicação. Os dados fornecidos à página via método <code>Inertia::render</code> serão usados para hidratar as "props" do componente da página:

```vue
<script setup>
import Layout from '@/Layouts/Authenticated.vue';
import { Head } from '@inertiajs/vue3';
 
const props = defineProps(['user']);
</script>
 
<template>
    <Head title="User Profile" />
 
    <Layout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Profile
            </h2>
        </template>
 
        <div class="py-12">
            Hello, {{ user.name }}
        </div>
    </Layout>
</template>
```

Como você pode ver, o Inertia permite que você aproveite todo o poder do Vue ou React ao construir seu frontend, enquanto fornece uma ponte entre seu backend Laravel e seu frontend JavaScript.

#### Renderização do lado do servidor (SSR)

<p>If you're concerned about diving into Inertia because your application requires server-side rendering, don't worry. Inertia offers <a href="https://inertiajs.com/server-side-rendering">server-side rendering support</a>. And, when deploying your application via <a href="https://forge.laravel.com">Laravel Forge</a>, it's a breeze to ensure that Inertia's server-side rendering process is always running.</p>

Se você está preocupado em mergulhar no Inertia porque sua aplicação requer renderização do lado do servidor, não se preocupe. O Inertia oferece suporte à <a href="https://inertiajs.com/server-side-rendering">renderização do lado do servidor</a>. E, ao fazer o deploy de sua aplicação via <a href="https://forge.laravel.com">Laravel Forge</a>, é muito fácil garantir que o processo de renderização do lado do servidor do Inertia esteja sempre em execução.

### Starter Kits

Se você deseja construir seu frontend usando Inertia e Vue / React, você pode aproveitar nossos <a href="/primeiros-passos/starter-kits" target="_blank">starter kits</a> Breeze ou Jetstream para iniciar o desenvolvimento de sua aplicação. Ambos os starter kits criam o fluxo de autenticação do backend e frontend de sua aplicação usando Inertia, Vue / React, <a href="https://tailwindcss.com" target="_blank">Tailwind</a> e <a href="https://vitejs.dev" target="_blank">Vite</a> para que você possa simplesmente começar a construir sua próxima grande ideia.

## Compilando Ativos (Assets)

Independentemente de você escolher desenvolver seu frontend usando Blade e Livewire ou Vue / React e Inertia, você provavelmente precisará compilar o CSS de sua aplicação em ativos prontos para produção. Claro, se você optar por construir o frontend de sua aplicação com Vue ou React, você também precisará compilar seus componentes em ativos JavaScript prontos para o navegador.

Por padrão, o Laravel utiliza o <a href="https://vitejs.dev">Vite</a> para compilar seus ativos. O Vite fornece tempos de compilação ultrarrápidos e substituição de módulo quase instantânea (HMR) durante o desenvolvimento local. Em todas as novas aplicações Laravel, incluindo aquelas que usam nossos <a href="/primeiros-passos/starter-kits">starter kits</a>, você encontrará um arquivo <code>vite.config.js</code> que carrega nosso plugin Laravel Vite que torna o Vite uma alegria de usar com aplicações Laravel.

A maneira mais rápida de começar com Laravel e Vite é começar o desenvolvimento de sua aplicação usando o <a href="/primeiros-passos/starter-kits">Laravel Breeze</a>, nosso starter kit mais simples que inicia sua aplicação fornecendo autenticação frontend e backend.

<Info>
Para obter documentação mais detalhada sobre como utilizar o Vite com Laravel, consulte nossa <a href="/fundamentos/compilacao-de-assets">documentação dedicada sobre a compilação e compilação de seus ativos</a>.
</Info>