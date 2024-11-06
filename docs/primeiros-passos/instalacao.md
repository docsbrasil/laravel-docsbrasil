<script setup>
import Info from '../components/Info.vue'
import Code from '../components/Code.vue'
</script>

# Instalação

## Conheça o Laravel

O Laravel é um framework para aplicações web com sintaxe expressiva e elegante. O laravel fornece uma estrutura e um ponto de partida para a criação do seu aplicativo, permitindo que você se concentre em criar algo incrível enquanto ele cuida dos detalhes.

O Laravel se esforça para proporcionar uma experiência incrível ao desenvolvedor e, ao mesmo tempo, oferece recursos avançados, como injeção completa de dependência, uma camada expressiva de abstração de banco de dados, filas e cron jobs, testes unitários e de integração e muito mais.

Não importa se você é novato em frameworks Web PHP ou se tem anos de experiência, o Laravel é uma estrutura que pode crescer com você. Nós o ajudaremos a dar os primeiros passos como desenvolvedor da Web ou lhe daremos um impulso à medida que você levar sua experiência para o próximo nível. Mal podemos esperar para ver o que você vai construir.

<Info>
Novo no Laravel? Confira o <a href="https://bootcamp.laravel.com">Laravel Bootcamp</a> para um tour prático do
      framework enquanto te guiamos na construção da sua primeira aplicação Laravel.
</Info>

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

```bash
# Instalando o PHP no macOS
/bin/bash -c "$(curl -fsSL https://php.new/install/mac)"
```

```bash
# Instalando o PHP no Windows (PowerShell)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows'))
```

```bash
# Instalando o PHP no Linux
/bin/bash -c "$(curl -fsSL https://php.new/install/linux)"

```

Após executar um dos comandos acima, <span class="highlight">você deve reiniciar sua sessão no terminal</span>. Para atualizar o PHP, Composer e o instalador Laravel após instalá-los via <a href="https://php.new/" target="_blank">php.new</a>, você pode executar o comando novamente no terminal.

Se você já tiver o PHP e o Composer instalados, poderá instalar o instalador Laravel via Composer:

```bash
composer global require laravel/installer
```

<Info>
  Para uma experiência de instalação e gerenciamento PHP totalmente funcional e gráfica, confira o <a target="#herd">Laravel Herd</a>.
</Info>

### Criando uma nova aplicação Laravel

Após instalar o PHP, Composer e o instalador Laravel, você está pronto para criar uma nova aplicação Laravel. O instalador Laravel solicitará que você selecione seu framework de teste, banco de dados e starter kit:

```bash	
laravel new meu-app
```

Uma vez que a aplicação foi criada, você pode iniciar o servidor de desenvolvimento local do Laravel, o worker de filas e o servidor de desenvolvimento Vite usando o script <Code>dev</Code> do Composer (Laravel 11.x):

```bash
cd meu-app # Navegue até o diretório da sua aplicação
npm install && npm run build # Instale as dependências do Node e compile os assets
composer dev
```

Uma vez que você tenha iniciado o servidor de desenvolvimento, sua aplicação estará acessível em seu navegador web em <a href="http://localhost:8000" target="_blank">http://localhost:8000</a>. Em seguida, você está pronto para <a href="#next-steps">começar a dar seus próximos passos no ecossistema Laravel</a>. Claro, você também pode querer <a href="#databases-and-migrations">configurar um banco de dados</a>.

<Info>
Se você deseja um ponto de partida ao desenvolver sua aplicação Laravel, considere usar um dos nossos <a href="/docs/11.x/starter-kits">starter kits</a>. Os starter kits do Laravel fornecem um esqueleto com autenticação para sua nova aplicação Laravel.
</Info>

## Configuração Inicial

Todas as configurações do Laravel são armazenadas no diretório <Code>config</Code>. Cada opção é documentada, então sinta-se à vontade para olhar os arquivos e se familiarizar com as opções disponíveis para você.

O laravel não precisa de quase nenhuma configuração adicional. Você está livre para começar a desenvolver! No entanto, você pode querer revisar o arquivo <Code>config/app.php</Code> e sua documentação. Ele contém várias opções, como fuso horário (timezone) e localidade (locale), que você pode querer alterar de acordo com a sua aplicação.

### Configuração Baseada em Ambiente

Como muitas das opções de configuração do Laravel podem variar dependendo se sua aplicação está rodando em sua máquina local ou em um servidor web de produção, muitos valores de configuração importantes são definidos usando o arquivo <Code>.env</Code> que existe na raiz da sua aplicação.

Seu arquivo <Code>.env</Code> não deve ser commitado no controle de versão de sua aplicação, já que cada desenvolvedor/servidor que usa sua aplicação pode requerer uma configuração de ambiente diferente. Além disso, isso seria um risco de segurança no caso de um invasor ganhar acesso ao seu repositório de controle de versão, já que quaisquer credenciais sensíveis seriam expostas.

<Info>
Para mais informações sobre o arquivo <Code>.env</Code> e configuração baseada em ambiente, confira a documentação completa de <a href="/docs/11.x/configuration#environment-configuration">configuração</a>.
</Info>

### Banco de Dados e Migrações

