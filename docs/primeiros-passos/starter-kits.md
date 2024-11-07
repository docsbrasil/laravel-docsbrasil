# Starter Kits

## Introdução

Para dar a você um pontapé inicial na construção de sua nova aplicação Laravel, estamos felizes em oferecer starter kits com autenticação. Esses kits automaticamente montam sua aplicação com as rotas, controllers e views necessárias para registrar e autenticar os usuários de sua aplicação.

Embora você possa usar esses kits iniciais, eles não são obrigatórios. Você é livre para construir sua própria aplicação do zero simplesmente instalando uma cópia do Laravel. De qualquer forma, sabemos que você construirá algo incrível!

## Laravel Breeze

<a href="https://github.com/laravel/breeze" target="_blank">Laravel Breeze</a> é uma implementação mínima e simples de todas as <a href="/seguranca/autenticacao">funcionalidades de autenticação</a> do Laravel, incluindo login, registro, redefinição de senha, verificação de e-mail e confirmação de senha. Além disso, o Breeze inclui uma página de "perfil" simples onde o usuário pode atualizar seu nome, endereço de e-mail e senha.

A camada de views padrão do Laravel Breeze é composta por simples <a href="/fundamentos/templates-blade" target="_blank">templates Blade</a> estilizados com <a href="https://tailwindcss.com" target="_blank">Tailwind CSS</a>. Além disso, o Breeze fornece opções de "esqueletos" baseadas em <a href="https://livewire.laravel.com" target="_blank">Livewire</a> ou <a href="https://inertiajs.com" target="_blank">Inertia</a>, com a possibilidade de usar Vue ou React para o Inertia.

<img src="https://laravel.com/img/docs/breeze-register.png">

#### Laravel Bootcamp

Se você está começando com o Laravel, sinta-se à vontade para participar do <a href="https://bootcamp.laravel.com" target="_blank">Laravel Bootcamp</a>. O Laravel Bootcamp irá guiá-lo na construção de sua primeira aplicação Laravel usando o Breeze. É uma ótima maneira de fazer um tour por tudo o que o Laravel e o Breeze têm a oferecer.

### Instalação

Primeiro, você deve <a href="/primeiros-passos/instalacao" target="_blank">criar uma nova aplicação Laravel</a>. Se você criar sua aplicação usando o <a href="/primeiros-passos/instalacao#criando-uma-nova-aplicacao-laravel" target="_blank">instalador do Laravel</a>, você será solicitado a instalar o Laravel Breeze durante o processo de instalação. Caso contrário, você precisará seguir as instruções de instalação manual abaixo.

Se você já criou uma nova aplicação Laravel sem um starter kit, você pode instalar manualmente o Laravel Breeze usando o Composer:

```shell
composer require laravel/breeze --dev
```

Depois que o Composer instalar o pacote Laravel Breeze, você deve executar o comando Artisan `breeze:install`. Este comando publica as views de autenticação, rotas, controllers e outros recursos em sua aplicação. O Laravel Breeze publica todo o seu código em sua aplicação para que você tenha controle total e visibilidade sobre seus recursos e implementação.

O comando `breeze:install` solicitará seu stack frontend preferido e framework de testes:

```shell
php artisan breeze:install

php artisan migrate
npm install
npm run dev
```

### Breeze e Blade

Por padrão, o stack do Breeze é o stack Blade, que utiliza simples <a href="/fundamentos/templates-blade" target="_blank">templates Blade</a> para renderizar o frontend de sua aplicação. A stack Blade pode ser instalado com o comando `breeze:install` sem outros argumentos adicionais e selecionando o stack frontend Blade. Depois que o scaffolding do Breeze for instalado, você também deve compilar os assets frontend de sua aplicação:

```shell
php artisan breeze:install

php artisan migrate
npm install
npm run dev
```

Em seguida, você pode navegar para as URLs `/login` ou `/register` de sua aplicação em seu navegador. Todas as rotas do Breeze são definidas no arquivo `routes/auth.php`.

::: tip
Para saber mais sobre a compilação do CSS e JavaScript de sua aplicação, confira a <a href="/fundamentos/vite#rodando-o-vite">documentação do Vite</a> do Laravel.
:::

### Breeze e Livewire

O Laravel Breeze também oferece scaffolding <a href="https://livewire.laravel.com" target="_blank">Livewire</a>. Livewire é uma maneira poderosa de construir interfaces de usuário dinâmicas e reativas usando apenas PHP.

Livewire é uma ótima opção para equipes que usam principalmente templates Blade e estão procurando uma alternativa mais simples aos frameworks SPA baseados em JavaScript, como Vue e React.

Para usar o stack Livewire, você pode selecionar o stack frontend Livewire ao executar o comando Artisan `breeze:install`. Depois que o scaffolding do Breeze for instalado, você deve executar suas migrações de banco de dados:

```shell
php artisan breeze:install

php artisan migrate
```

### Breeze e React / Vue

O Laravel Breeze também oferece scaffolding React/Vue via uma implementação frontend <a href="https://inertiajs.com" target="_blank">Inertia</a>. O Inertia permite que você construa aplicações modernas de página única React e Vue usando roteamento e controllers clássicos do laravel.

O Inertia permite que você desfrute do poder frontend do React e Vue combinado com a incrível produtividade backend do Laravel e a compilação ultra-rápida do <a href="https://vitejs.dev" target="_blank">Vite</a>. Para usar a stack Inertia, você pode selecionar os stacks frontend Vue ou React ao executar o comando Artisan `breeze:install`.

Ao selecionar o stack frontend Vue ou React, o instalador do Breeze também solicitará que você determine se deseja <a href="https://inertiajs.com/server-side-rendering" target="_blank">suporte Inertia SSR</a> ou TypeScript. Depois que o scaffolding do Breeze for instalado, você também deve compilar os assets frontend de sua aplicação:

```shell
php artisan breeze:install

php artisan migrate
npm install
npm run dev
```

Agora você pode navegar para as URLs `/login` ou `/register` de sua aplicação em seu navegador. Todas as rotas do Breeze são definidas no arquivo `routes/auth.php`.

### Breeze e Next.js / Nuxt.js / API

O Laravel Breeze também pode criar uma API com autenticação pronta para autenticar aplicações JavaScript modernas, como aquelas alimentadas por <a href="https://nextjs.org" target="_blank">Next</a>, <a href="https://nuxt.com" target="_blank">Nuxt</a> e outros. Para começar, selecione a stack API como sua stack desejada ao executar o comando Artisan `breeze:install`:

```shell
php artisan breeze:install
 
php artisan migrate
```

Durante a instalação, o Breeze adicionará uma variável de ambiente `FRONTEND_URL` ao arquivo `.env` de sua aplicação. Esta URL deve ser a URL de sua aplicação JavaScript. Isso normalmente será `http://localhost:3000` durante o desenvolvimento local. Além disso, você deve garantir que seu `APP_URL` esteja definido como `http://localhost:8000`, que é a URL padrão usada pelo comando Artisan `serve`.

#### Implementação de Referência Next.js / Nuxt.js

Finalmente, você está pronto para combinar este backend com o frontend de sua escolha. Uma implementação de referência Next.js do frontend do Breeze está <a href="https://github.com/laravel/breeze-next" target="_blank">disponível no GitHub</a>. Este frontend é mantido pelo Laravel e contém a mesma interface do usuário das stacks Blade e Inertia tradicionais fornecidas pelo Breeze.

Para Nuxt.js, você pode usar o <a href="https://github.com/amrnn90/breeze-nuxt" target="_blank">breeze-nuxt</a> que é uma mantida pela comunidade.

## Laravel Jetstream

Enquanto o Laravel Breeze fornece um ponto de partida simples e mínimo para a construção de uma aplicação Laravel, o Jetstream complementa essa funcionalidade com recursos mais robustos e stacks de tecnologia frontend adicionais. **Para aqueles que são novos no Laravel, recomendamos aprender com o Laravel Breeze antes de se formar no Laravel Jetstream.**

O Jetstream fornece um scaffolding de aplicação lindamente projetado para o Laravel e inclui login, registro, verificação de e-mail, autenticação de dois fatores, gerenciamento de sessão, suporte a API via Laravel Sanctum e gerenciamento de equipe opcional. O Jetstream é projetado usando o <a href="https://tailwindcss.com">Tailwind CSS</a> e oferece sua escolha de scaffolding frontend impulsionado por <a href="https://livewire.laravel.com">Livewire</a> ou <a href="https://inertiajs.com">Inertia</a>.

A documentação completa para instalar o Laravel Jetstream pode ser encontrada na <a href="https://jetstream.laravel.com">documentação oficial do Jetstream</a>.