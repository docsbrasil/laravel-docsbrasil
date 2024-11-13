# Instalação

## Conheça o Laravel

O Laravel é um framework para aplicações web com sintaxe expressiva e elegante. O laravel fornece uma estrutura e um ponto de partida para a criação do seu aplicativo, permitindo que você se concentre em criar algo incrível enquanto ele cuida dos detalhes.

O Laravel se esforça para proporcionar uma experiência incrível ao desenvolvedor e, ao mesmo tempo, oferece recursos avançados, como injeção completa de dependência, uma camada expressiva de abstração de banco de dados, filas e cron jobs, testes unitários e de integração e muito mais.

Não importa se você é novato em frameworks Web PHP ou se tem anos de experiência, o Laravel é uma estrutura que pode crescer com você. Nós o ajudaremos a dar os primeiros passos como desenvolvedor da Web ou lhe daremos um impulso à medida que você levar sua experiência para o próximo nível. Mal podemos esperar para ver o que você vai construir.

::: tip
Novo no Laravel? Confira o <a href="https://bootcamp.laravel.com">Laravel Bootcamp</a> para um tour prático do
      framework enquanto te guiamos na construção da sua primeira aplicação Laravel.
:::

### Por que Laravel?

Há uma variedade de frameworks disponíveis para a criação de aplicações Web. No entanto, acreditamos que o Laravel é a melhor opção para criar aplicativos Web modernos.

<strong>
  Um Framework Progressivo
</strong>

Nós gostamos de chamar o Laravel de um framework "progressivo". Com isso, queremos dizer que o Laravel cresce com você. Se você está dando os primeiros passos no desenvolvimento web, a vasta documentação, guias e tutoriais em vídeo do Laravel ajudará você a aprender sem se sentir sobrecarregado.

Caso você seja um desenvolvedor sênior, o Laravel oferece ferramentas robustas para injeção de dependência, testes unitários, filas, eventos em tempo real e muito mais. O Laravel é perfeito para a construção de aplicações web e pronto para lidar com cargas de trabalho empresariais.

<strong>
  Um Framework Escalável
</strong>

Laravel é incrivelmente escalável. Graças à natureza amigável à escalabilidade do PHP e ao suporte integrado do Laravel para sistemas de cache distribuídos rápidos, como o Redis, a escalabilidade horizontal com o Laravel é muito fácil. Na verdade, as aplicações Laravel foram facilmente escaladas para lidar com centenas de milhões de solicitações por mês.

Precisa de escalabilidade extrema? Plataformas como o <a href="https://vapor.laravel.com/" target="_blank">Laravel Vapor</a> permitem que você execute sua aplicação Laravel em uma escala quase ilimitada na mais recente tecnologia serverless da AWS.

<strong>
  Um Framework de Comunidade
</strong>

O Laravel combina os melhores pacotes do ecossistema PHP para oferecer o framework mais robusto e amigável para desenvolvedores. Além disso, milhares de desenvolvedores talentosos de todo o mundo contribuíram para o framework. Quem sabe, talvez você até se torne um contribuidor do Laravel.

## Criando uma aplicação Laravel

### Instalando PHP e o Laravel Installer

Antes de criar sua primeira aplicação Laravel, certifique-se de que sua máquina local tenha PHP, Composer e o instalador Laravel instalados. Além disso, você deve instalar Node e NPM ou Bun para que possa compilar os assets front-end da sua aplicação.

Se você não tiver o PHP e o Composer instalados em sua máquina local, os seguintes comandos instalarão o PHP, o Composer e o instalador Laravel no macOS, Windows ou Linux:

::: code-group

```shell [macOs]
/bin/bash -c "$(curl -fsSL https://php.new/install/mac)"

```

```shell [Windows (PowerShell)]
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows'))
```

```shell [Linux]
/bin/bash -c "$(curl -fsSL https://php.new/install/linux)"
```

:::

Após executar um dos comandos acima, <span class="highlight">você deve reiniciar sua sessão no terminal</span>. Para atualizar o PHP, Composer e o instalador Laravel após instalá-los via <a href="https://php.new/" target="_blank">php.new</a>, você pode executar o comando novamente no terminal.

Se você já tiver o PHP e o Composer instalados, poderá instalar o instalador Laravel via Composer:

```bash
composer global require laravel/installer
```

::: tip
  Para uma experiência de instalação e gerenciamento PHP totalmente funcional e gráfica, confira o <a target="#herd">Laravel Herd</a>.
:::

### Criando uma nova aplicação Laravel

Após instalar o PHP, Composer e o instalador Laravel, você está pronto para criar uma nova aplicação Laravel. O instalador Laravel solicitará que você selecione seu framework de teste, banco de dados e starter kit:

```bash
laravel new meu-app
```

Uma vez que a aplicação foi criada, você pode iniciar o servidor de desenvolvimento local do Laravel, o worker de filas e o servidor de desenvolvimento Vite usando o script `dev` do Composer (Laravel 11.x):

```bash
cd meu-app # Navegue até o diretório da sua aplicação
npm install && npm run build # Instale as dependências do Node e compile os assets
composer dev
```

Uma vez que você tenha iniciado o servidor de desenvolvimento, sua aplicação estará acessível em seu navegador web em http://localhost:8000. Em seguida, você está pronto para <a href="#next-steps">começar a dar seus próximos passos no ecossistema Laravel</a>. Claro, você também pode querer <a href="#databases-and-migrations">configurar um banco de dados</a>.

::: tip
Se você deseja um ponto de partida ao desenvolver sua aplicação Laravel, considere usar um dos nossos <a href="/docs/11.x/starter-kits">starter kits</a>. Os starter kits do Laravel fornecem um esqueleto com autenticação para sua nova aplicação Laravel.
:::

## Configuração Inicial

Todas as configurações do Laravel são armazenadas no diretório `config`. Cada opção é documentada, então sinta-se à vontade para olhar os arquivos e se familiarizar com as opções disponíveis para você.

O laravel não precisa de quase nenhuma configuração adicional. Você está livre para começar a desenvolver! No entanto, você pode querer revisar o arquivo `config/app.php` e sua documentação. Ele contém várias opções, como fuso horário (timezone) e localidade (locale), que você pode querer alterar de acordo com a sua aplicação.

### Configuração Baseada em Ambiente

Como muitas das opções de configuração do Laravel podem variar dependendo se sua aplicação está rodando em sua máquina local ou em um servidor web de produção, muitos valores de configuração importantes são definidos usando o arquivo `.env` que existe na raiz da sua aplicação.

Seu arquivo `.env` não deve ser commitado no controle de versão de sua aplicação, já que cada desenvolvedor/servidor que usa sua aplicação pode requerer uma configuração de ambiente diferente. Além disso, isso seria um risco de segurança no caso de um invasor ganhar acesso ao seu repositório de controle de versão, já que quaisquer credenciais sensíveis seriam expostas.

::: tip
Para mais informações sobre o arquivo `.env` e configuração baseada em ambiente, confira a documentação completa de <a href="/primeiros-passos/configuracao#configuracao-de-ambiente">configuração</a>.
:::

### Banco de Dados e Migrações

Agora que você criou sua aplicação Laravel, provavelmente deseja armazenar alguns dados em um banco de dados. Por padrão, o arquivo de configuração `.env` de sua aplicação especifica que o Laravel interagirá com um banco de dados SQLite.

Durante a criação da aplicação, o Laravel criou um arquivo `database/database.sqlite` para você e executou as migrações necessárias para criar as tabelas do banco de dados da aplicação.

Se você preferir usar outro driver de banco de dados, como MySQL ou PostgreSQL, você pode atualizar o arquivo de configuração `.env` para usar o banco de dados apropriado. Por exemplo, se você deseja usar o MySQL, atualize as variáveis `DB\_\*` do arquivo de configuração `.env` da seguinte forma:

```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

Se você optar por usar um banco de dados diferente do SQLite, você precisará criar o banco de dados e executar as migrações do banco de dados de sua aplicação:

```bash
php artisan migrate
```

::: tip
Se você estiver desenvolvendo no macOS ou Windows e precisar instalar o MySQL, PostgreSQL ou Redis localmente, considere usar o <a href="https://herd.laravel.com/#plans" target="_blank">Herd Pro</a>.
:::

### Configuração de Diretórios

O Laravel <span class="highlight">deve sempre ser servido a partir do diretório raiz do "diretório web" configurado para o seu servidor web</span>. Você não deve tentar servir uma aplicação Laravel a partir de um subdiretório do "diretório web". Tentar fazer isso poderia expor arquivos sensíveis presentes em sua aplicação.

## Instalação Local Usando o Herd

<a href="https://herd.laravel.com/" target="_blank">Laravel Herd</a> é um ambiente de desenvolvimento Laravel e PHP nativo e extremamente rápido para macOS e Windows. O Herd inclui tudo o que você precisa para começar a desenvolver com Laravel, incluindo PHP e Nginx.

Depois de instalar o Herd, você está pronto para começar a desenvolver com Laravel. O Herd inclui ferramentas de linha de comando para `php`, `composer`, `laravel`, `expose`, `node`, `npm` e `nvm`.

::: tip
O <a href="https://herd.laravel.com/#plans" target="_blank">Herd Pro</a> aprimora o Herd com recursos poderosos adicionais, como a capacidade de criar e gerenciar bancos de dados MySQL, Postgres e Redis locais, bem como visualização de e-mails locais e monitoramento de logs.
:::

### Herd no macOS

Se você desenvolve no macOS, você pode baixar o instalador do <a href="https://herd.laravel.com/" target="_blank">Herd</a>. O instalador baixa automaticamente a versão mais recente do PHP e configura seu Mac para sempre executar o <a href="https://www.nginx.com/" target="_blank">Nginx</a> em segundo plano.

O Herd para macOS usa o <a href="https://en.wikipedia.org/wiki/Dnsmasq" target="_blank">dnsmasq</a> para suportar diretórios "estacionados". Qualquer aplicação Laravel em um diretório estacionado será automaticamente servida pelo Herd. Por padrão, o Herd cria um diretório estacionado em ~/Herd e você pode acessar qualquer aplicação Laravel neste diretório no domínio .test usando o nome do diretório.

Após instalar o Herd, a maneira mais rápida de criar uma nova aplicação Laravel é usando o CLI do Laravel, que é empacotado com o Herd:

```bash
cd ~/Herd
laravel new meu-app
cd meu-app
herd open
```

Obviamente, você sempre pode gerenciar seus diretórios e outras configurações PHP através da interface do Herd, que pode ser aberta a partir do menu do Herd na bandeja do sistema.

Você pode aprender mais sobre o Herd conferindo a <a href="https://herd.laravel.com/docs" target="_blank">documentação do Herd</a>.

### Herd no Windows

Você pode baixar o instalador do Windows para o Herd <a href="https://herd.laravel.com/" target="_blank">no site do Herd</a>. Após a instalação, você pode iniciar o Herd para completar o processo de integração e acessar a interface do Herd pela primeira vez.

A interface do Herd é acessível clicando com o botão esquerdo no ícone da bandeja do sistema do Herd. Um clique com o botão direito abre o menu rápido com acesso a todas as ferramentas que você precisa diariamente.

Durante a instalação, o Herd cria um diretório "estacionado" em seu diretório pessoal em `%USERPROFILE%\Herd`. Qualquer aplicação Laravel em um diretório estacionado será automaticamente servida pelo Herd, e você pode acessar qualquer aplicação Laravel neste diretório no domínio `.test` usando o nome do diretório.

Após instalar o Herd, a maneira mais rápida de criar uma nova aplicação Laravel é usando o CLI do Laravel, que é empacotado com o Herd. Para começar, abra o Powershell e execute os seguintes comandos:

```bash
cd ~\Herd
laravel new my-app
cd my-app
herd open
```

Você pode aprender mais sobre o Herd conferindo a <a href="https://herd.laravel.com/docs/windows/1/getting-started/about-herd" target="_blank">documentação do Herd</a>.

## Instalação utilizando o Docker/Sail

Queremos que seja o mais fácil possível começar com o Laravel, independentemente do seu sistema operacional preferido. Portanto, existem várias opções para desenvolver e executar uma aplicação Laravel em sua máquina local. Embora você possa desejar explorar essas opções em um momento posterior, o Laravel fornece o <a href="/pacotes/sail">Sail</a>, uma solução integrada para executar sua aplicação Laravel usando o <a href="https://www.docker.com" target="_blank">Docker</a>.

O Docker é uma ferramenta para executar serviços em "containers" pequenos e leves que não interferem com o software ou configuração instalados em sua máquina local. Isso significa que você não precisa se preocupar em configurar ou definir ferramentas de desenvolvimento complicadas, como servidores web e bancos de dados em sua máquina local. Para começar, você só precisa instalar o <a href="https://www.docker.com/products/docker-desktop" target="_blank">Docker Desktop</a>.

O Laravel Sail é uma CLI leve para interagir com a configuração Docker padrão do Laravel. O Sail fornece um ótimo ponto de partida para construir uma aplicação Laravel usando PHP, MySQL e Redis sem exigir experiência prévia com Docker.

::: tip
  Já é um especialista em Docker? Não se preocupe! Tudo sobre o Sail pode ser personalizado usando o arquivo `docker-compose.yml` incluído com o Laravel.
:::

### Sail no macOS

Se você está desenvolvendo em um Mac e o <a href="https://www.docker.com/products/docker-desktop">Docker Desktop</a> já está instalado, você pode usar um simples comando de terminal para criar uma nova aplicação Laravel. Por exemplo, para criar uma nova aplicação Laravel em um diretório chamado "meu-app", você pode executar o seguinte comando em seu terminal:

```bash
curl -s "https://laravel.build/meu-app" | bash
```

Obviamente, você pode alterar "meu-app" nesta URL para qualquer nome que você preferir - apenas certifique-se de que o nome da aplicação contenha apenas caracteres alfanuméricos, traços e sublinhados. O diretório da aplicação Laravel será criado dentro do diretório em que você executar o comando.

A instalação do Sail pode levar vários minutos enquanto os contêineres são construídos em sua máquina local.

Após a criação da aplicação, você pode navegar até o diretório da aplicação e iniciar o Laravel Sail. O Laravel Sail fornece uma interface de linha de comando simples para interagir com a configuração Docker padrão do Laravel:

```bash
cd meu-app

./vendor/bin/sail up
```

Depois que os contêineres do Docker forem iniciados, você deve executar as <a href="/banco-de-dados/migracoes">migrações do banco de dados</a>:

```bash
./vendor/bin/sail artisan migrate
```

Enfim, você pode acessar a aplicação em seu navegador web em: http://localhost.

### Sail no Windows

Antes de criarmos uma nova aplicação Laravel em sua máquina Windows, certifique-se de instalar o <a href="https://www.docker.com/products/docker-desktop">Docker Desktop</a>. Em seguida, você deve garantir que o Windows Subsystem for Linux 2 (WSL2) esteja instalado e habilitado. O WSL permite que você execute executáveis binários do Linux nativamente no Windows. Informações sobre como instalar e habilitar o WSL2 podem ser encontradas na <a href="https://learn.microsoft.com/en-us/windows/wsl/install">documentação do ambiente de desenvolvimento da Microsoft</a>.

::: tip
Após instalar e habilitar o WSL2, você deve garantir que o Docker Desktop esteja <a href="https://docs.docker.com/docker-for-windows/wsl/">configurado para usar o backend WSL2</a>.
:::

Agora, você está pronto para criar sua primeira aplicação Laravel. Inicie o <a href="https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701?rtc=1&amp;activetab=pivot:overviewtab">Windows Terminal</a> e inicie uma nova sessão de terminal para o seu sistema operacional Linux WSL2. Em seguida, você pode usar um simples comando de terminal para criar uma nova aplicação Laravel. Por exemplo, para criar uma nova aplicação Laravel em um diretório chamado "meu-app", você pode executar o seguinte comando em seu terminal:

```bash
curl -s https://laravel.build/meu-app | bash
```

Obviamente, você pode alterar "meu-app" nesta URL para qualquer nome que você preferir - apenas certifique-se de que o nome da aplicação contenha apenas caracteres alfanuméricos, traços e sublinhados. O diretório da aplicação Laravel será criado dentro do diretório em que você executar o comando.

A instalação do Sail pode levar vários minutos enquanto os contêineres são construídos em sua máquina local.

Após a criação da aplicação, você pode navegar até o diretório da aplicação e iniciar o Laravel Sail. O Sail fornece uma interface de linha de comando simples para interagir com a configuração Docker padrão do Laravel:

```bash
cd meu-app

./vendor/bin/sail up
```

Depois que os contêineres do Docker forem iniciados, você deve executar as <a href="/banco-de-dados/migracoes">migrações do banco de dados</a>:

```bash
./vendor/bin/sail artisan migrate
```

::: tip
Para continuar aprendendo mais sobre o Laravel Sail, revise sua <a href="/pacotes/sail">documentação completa</a>.
:::

#### Desenvolvendo Dentro do WSL2

Obviamente, você vai precisar ser capaz de modificar os arquivos da aplicação Laravel que foram criados dentro da sua instalação WSL2. Para isso, recomendamos o uso do editor <a href="https://code.visualstudio.com">Visual Studio Code</a> da Microsoft e sua extensão de primeira parte para <a href="https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack">Desenvolvimento Remoto</a>.

Uma vez que essas ferramentas estejam instaladas, você pode abrir qualquer aplicação Laravel executando o comando `code .` a partir do diretório raiz da sua aplicação usando o Windows Terminal.

### Sail no Linux

Se você está desenvolvendo no Linux e o <a href="https://docs.docker.com/compose/install/">Docker Compose</a> já está instalado, você pode usar um simples comando de terminal para criar uma nova aplicação Laravel.

Primeiro, se você estiver usando o Docker Desktop para Linux, você deve executar o seguinte comando. Se você não estiver usando o Docker Desktop para Linux, você pode pular esta etapa:

```bash
docker context use default
```

Em seguida, para criar uma nova aplicação Laravel em um diretório chamado "meu-app", você pode executar o seguinte comando em seu terminal:

```bash
curl -s https://laravel.build/meu-app | bash
```

Obviamente, você pode alterar "meu-app" nesta URL para qualquer nome que você preferir - apenas certifique-se de que o nome da aplicação contenha apenas caracteres alfanuméricos, traços e sublinhados. O diretório da aplicação Laravel será criado dentro do diretório em que você executar o comando.

A instalação do Sail pode levar vários minutos enquanto os contêineres são construídos em sua máquina local.

Após a criação da aplicação, você pode navegar até o diretório da aplicação e iniciar o Laravel Sail. O Sail fornece uma interface de linha de comando simples para interagir com a configuração Docker padrão do Laravel:

```bash
cd meu-app

./vendor/bin/sail up
```

Uma vez que os contêineres Docker da aplicação foram iniciados, você deve executar as <a href="/banco-de-dados/migracoes">migrações do banco de dados</a>:

```bash
./vendor/bin/sail artisan migrate
```

Enfim, você pode acessar a aplicação em seu navegador web em: http://localhost.

::: tip
Para continuar aprendendo mais sobre o Laravel Sail, revise sua <a href="/pacotes/sail">documentação completa</a>.
:::

### Escolhendo os Serviços no Sail

Quando você cria uma nova aplicação Laravel via Sail, você pode usar a variável de consulta `with` para escolher quais serviços devem ser configurados no arquivo `docker-compose.yml` da sua nova aplicação. Os serviços disponíveis incluem `mysql`, `pgsql`, `mariadb`, `redis`, `memcached`, `meilisearch`, `typesense`, `minio`, `selenium` e `mailpit`:

```bash
curl -s "https://laravel.build/meu-app?with=mysql,redis" | bash
```

Se você não especificar quais serviços deseja configurar, uma stack padrão de `mysql`, `redis`, `meilisearch`, `mailpit` e `selenium` será configurada.

Você pode instruir o Sail a instalar um Devcontainer padrão adicionando o parâmetro `devcontainer` à URL:

```bash
curl -s "https://laravel.build/meu-app?with=mysql,redis&devcontainer" | bash
```

## Suporte a IDE

Você é livre para usar qualquer editor de código que desejar ao desenvolver aplicações Laravel; no entanto, o <a href="https://www.jetbrains.com/phpstorm/laravel/">PhpStorm</a> oferece suporte extensivo ao Laravel e seu ecossistema, incluindo o <a href="https://www.jetbrains.com/help/phpstorm/using-laravel-pint.html">Laravel Pint</a>.

Além disso, o plugin <a href="https://laravel-idea.com/">Laravel Idea</a> para PhpStorm, mantido pela comunidade, oferece uma variedade de aprimoramentos úteis para o IDE.

## Próximos Passos

Agora que você criou sua primeira aplicação Laravel, você pode estar se perguntando o que aprender a seguir. Primeiramente, recomendamos fortemente que você se familiarize com como o Laravel funciona lendo a seguinte documentação:

- <a href="/conceitos-de-arquitetura/ciclo-de-vida-da-requisicao">Ciclo de Vida da Requisição</a>
- <a href="/primeiros-passos/configuracao">Configuração</a>
- <a href="/primeiros-passos/estrutura-de-diretorios">Estrutura de Diretórios</a>
- <a href="/primeiros-passos/frontend">Frontend</a>
- <a href="/conceitos-de-arquitetura/service-container">Service Container</a>
- <a href="/conceitos-de-arquitetura/facades">Facades</a>

Como você deseja usar o Laravel também ditará os próximos passos em sua jornada. Existem várias maneiras de usar o Laravel, e exploraremos dois casos de uso principais para o framework abaixo.

::: tip
  Novo no Laravel? Confira o <a href="https://bootcamp.laravel.com">Laravel Bootcamp</a> para um tour prático do
      framework enquanto te guiamos na construção da sua primeira aplicação Laravel.
:::

### Laravel o Framework Full-Stack

O laravel pode servir como um framework full-stack. Por "full stack" framework, queremos dizer que você vai usar o Laravel para rotear as requisições para sua aplicação e renderizar seu frontend via <a href="/fundamentos/templates-blade" target="_blank">Templates Blade</a> ou uma tecnologia híbrida de SPA como <a href="https://inertiajs.com" target="_blank">Inertia</a>. Esta é a maneira mais comum de usar o framework Laravel e, em nossa opinião, a maneira mais produtiva de usar o Laravel.

Se você planeja usar o Laravel dessa maneira, você pode querer conferir nossa documentação sobre <a href="/primeiros-passos/frontend" target="_blank">desenvolvimento frontend</a>, <a href="/fundamentos/rotas" target="_blank">roteamento</a>, <a href="/fundamentos/views" target="_blank">views</a> ou o <a href="/eloquent-orm/introducao" target="_blank">Eloquent ORM</a>. Além disso, você pode se interessar em aprender sobre pacotes da comunidade como <a href="https://livewire.laravel.com" target="_blank">Livewire</a> e <a href="https://inertiajs.com" target="_blank">Inertia</a>. Esses pacotes permitem que você use o Laravel como um framework full-stack enquanto desfruta de muitos dos benefícios de UI fornecidos por uma SPA.

Se você estiver usando o Laravel como um framework full-stack, também recomendamos fortemente que você aprenda a compilar o CSS e o JavaScript da sua aplicação usando o <a href="/fundamentos/asset-bundling" target="_blank">Vite</a>.

::: tip
Se você deseja um ponto de partida ao desenvolver sua aplicação Laravel, considere usar um dos nossos <a href="/primeiros-passos/starter-kits" target="_blank">Starter Kits</a>. Os starter kits do Laravel fornecem um esqueleto com autenticação para sua nova aplicação Laravel.
:::

### Laravel o Backend de API

O Laravel também pode servir como um backend de API para uma aplicação de página única JavaScript ou aplicativo móvel. Por exemplo, você pode usar o Laravel como um backend de API para sua aplicação <a href="https://nextjs.org">Next.js</a>. Neste contexto, você pode usar o Laravel para fornecer <a href="/pacotes/sanctum">autenticação</a> e armazenamento/recuperação de dados para sua aplicação, enquanto também aproveita os poderosos serviços do Laravel, como filas, e-mails, notificações e muito mais.

Se você planeja usar o Laravel dessa maneira, você pode querer conferir nossa documentação sobre <a href="/fundamentos/rotas">roteamento</a>, <a href="/eloquent-orm/introducao">Eloquent ORM</a> e <a href="/banco-de-dados/migracoes">migrações</a>.

::: tip
Precisa de um ponto de partida para estruturar seu backend Laravel e frontend Next.js? O Laravel Breeze oferece um <a href="/primeiros-passos/starter-kits">stack de API</a> bem como uma <a href="https://github.com/laravel/breeze-next">implementação frontend Next.js</a> para que você possa começar em minutos.
:::