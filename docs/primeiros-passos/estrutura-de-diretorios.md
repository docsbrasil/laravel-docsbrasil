# Estrutura de diretórios

## Introdução

A estrutura padrão da aplicação Laravel é projetada para fornecer um ótimo ponto de partida tanto para aplicações grandes quanto pequenas. No entanto, você está livre para organizar sua aplicação da maneira que preferir. O Laravel impõe quase nenhuma restrição sobre onde qualquer classe pode estar localizada desde que o Composer consiga carregar automaticamente a classe.

::: tip Novo no Laravel?
Novo no Laravel? Confira o <a href="https://bootcamp.laravel.com" target="_blank">Laravel Bootcamp</a> para um tour prático pelo framework, onde o ajudaremos a criar sua primeira aplicação Laravel. 
:::

## Diretório raiz (root)

### O Diretório App

O diretório `app` contém o código principal da sua aplicação. Exploramos este diretório com mais detalhes em breve; no entanto, quase todas as classes da sua aplicação estarão neste diretório.

### O Diretório Bootstrap

O diretório `bootstrap` contém o arquivo `app.php`, que inicializa o framework. Este diretório também contém um diretório `cache` que armazena arquivos gerados pelo framework para otimização de desempenho, como os arquivos de cache de rotas e serviços.

### O Diretório Config

O diretório `config`, como o nome sugere, contém todos os arquivos de configuração da sua aplicação. É uma boa prática ler todos esses arquivos e se familiarizar com todas as opções disponíveis.

### O Diretório Database

O diretório `database` contém as suas migrações de banco de dados, factories e seeders. Se desejar, você também pode usar este diretório para armazenar um banco de dados SQLite.

### O Diretório Public

O diretório `public` contém o arquivo `index.php`, que é o ponto de entrada para todas as requisições que entram na sua aplicação, e configura o autoloading. Este diretório também contém seus assets, como imagens, JavaScript e CSS.

### O Diretório Resources

O diretório `resources` contém suas <a href="/fundamentos/views" target="_blank">views</a> além dos seus assets brutos e não compilados, como CSS e JavaScript.

### O Diretório Routes

O diretório `routes` contém todas as definições de rotas para a sua aplicação. Por padrão, dois arquivos de rotas são incluídos com o Laravel: `web.php` e `console.php`.

O arquivo `web.php` contém rotas que o Laravel coloca no grupo de middleware `web`, que fornece estado de sessão, proteção CSRF e criptografia de cookies. Se sua aplicação não oferecer uma API RESTful sem estado, então todas as suas rotas provavelmente serão definidas no arquivo `web.php`.

O arquivo `console.php` é onde você pode definir todos os seus comandos baseados em closure para o console. Cada closure é vinculada a uma instância de comando, permitindo uma abordagem simples para interagir com os métodos de E/S de cada comando. Embora este arquivo não defina rotas HTTP, ele define pontos de entrada baseados em console (rotas) para sua aplicação. Você também pode <a href="/explorando-mais-a-fundo/agendamento-de-tarefas" target="_blank">agendar</a> tarefas no arquivo `console.php`.

Opcionalmente, você pode instalar arquivos de rota adicionais para rotas de API (`api.php`) e canais de broadcasting (`channels.php`) através dos comandos Artisan `install` e `install`.

O arquivo `api.php` contém rotas que são destinadas a ser sem estado, portanto, as requisições que entram na aplicação por meio dessas rotas devem ser autenticadas <a href="/pacotes/sanctum" target="_blank">via tokens</a> e não terão acesso ao estado da sessão.

O arquivo `channels.php` é onde você pode registrar todos os canais de <a href="/explorando-mais-a-fundo/broadcasting" target="_blank">broadcasting</a> de eventos que sua aplicação suporta.

### O Diretório Storage

O diretório `storage` contém seus logs, templates Blade compilados, sessões baseadas em arquivos, caches de arquivos e outros arquivos gerados pelo framework. Este diretório é dividido nos diretórios `app`, `framework` e `logs`. O diretório `app` pode ser usado para armazenar qualquer arquivo gerado pela sua aplicação. O diretório `framework` é usado para armazenar arquivos e caches gerados pelo framework. Por fim, o diretório `logs` contém os arquivos de log da sua aplicação.

O diretório `storage/app/public` pode ser usado para armazenar arquivos gerados pelos usuários, como avatares de perfil, que devem ser acessíveis publicamente. Você deve criar um link simbólico em `public/storage` que aponte para este diretório. Você pode criar o link usando o comando Artisan `php artisan storage`.

### O Diretório Tests

O diretório `tests` contém seus testes automatizados. Exemplos de testes unitários e de funcionalidade com <a href="https://pestphp.com" target="_blank">Pest</a> ou <a href="https://phpunit.de/" target="_blank">PHPUnit</a> são fornecidos de forma padrão. Cada classe de teste deve ser suffixada com a palavra `Test`. Você pode rodar seus testes usando os comandos `/vendor/bin/pest` ou `/vendor/bin/phpunit`. Ou, se quiser uma representação mais detalhada e bonita dos resultados dos seus testes, pode rodá-los usando o comando Artisan `php artisan test`.

### O Diretório Vendor

O diretório `vendor` contém as dependências do seu projeto gerenciadas pelo <a href="https://getcomposer.org" target="_blank">Composer</a>.

## Diretório `App`

A maior parte da sua aplicação está localizada no diretório `app`. Por padrão, este diretório tem o namespaced `App` e é carregado automaticamente pelo Composer usando o <a href="https://www.php-fig.org/psr/psr-4/" target="_blank">padrão de carregamento automático PSR-4</a>.

Por padrão, o diretório `app` contém os diretórios `Http`, `Models` e `Providers`. No entanto, ao longo do tempo, uma variedade de outros diretórios serão gerados dentro do diretório `app` à medida que você usa os comandos Artisan `make` para gerar classes. Por exemplo, o diretório `app/Console` não existirá até que você execute o comando Artisan `make:command` para gerar uma classe de comando.

Tanto os diretórios `Console` quanto `Http` são explicados mais detalhadamente em suas respectivas seções abaixo, mas pense nos diretórios `Console` e `Http` como fornecendo uma API para o núcleo da sua aplicação. O protocolo HTTP e a CLI são ambos mecanismos para interagir com a sua aplicação, mas não contêm logicamente a aplicação. Em outras palavras, eles são duas maneiras de emitir comandos para a sua aplicação. O diretório `Console` contém todos os seus comandos Artisan, enquanto o diretório `Http` contém seus controllers, middleware e requests.

::: tip
Muitas das classes no diretório `app` podem ser geradas pelo Artisan via comandos. Para revisar os comandos disponíveis, execute o comando `php artisan list make` no seu terminal.
:::

### O Diretório `Broadcasting`

O diretório `Broadcasting` contém todas as classes de canal de broadcast para a sua aplicação. Essas classes são geradas usando o comando `make:channel`. Este diretório não existe por padrão, mas será criado para você quando você criar seu primeiro canal. Para aprender mais sobre canais, confira a documentação sobre <a href="/explorando-mais-a-fundo/broadcasting" target="_blank">broadcasting de eventos</a>.

### O Diretório `Console`

O diretório `Console` contém todos os comandos Artisan da sua aplicação. Esses comandos são gerados usando o comando `make:command`.

### O Diretório `Events`

O diretório `Events` contém todas as classes de <a href="/explorando-mais-a-fundo/eventos" target="_blank">eventos</a> para a sua aplicação. Essas classes são geradas usando o comando `make:event`. Eventos são uma maneira de alertar outras partes da sua aplicação que uma ação específica ocorreu, fornecendo uma grande flexibilidade e desacoplamento.

### O Diretório `Exceptions`

O diretório `Exceptions` contém todas as exceções personalizadas para a sua aplicação. Essas exceções podem ser geradas usando o comando `make:exception`.

### O Diretório `Http`

O diretório `Http` contém seus controllers, middleware e requests. Quase toda a lógica para lidar com requisições que entram na sua aplicação será colocada neste diretório.

### O Diretório `Jobs`

Esse diretório não existe por padrão, mas será criado para você se você executar o comando `make:job` do Artisan. O diretório `Jobs` abriga os <a href="/explorando-mais-a-fundo/filas" target="_blank">jobs</a> para a sua aplicação. Jobs podem ser colocados em Fila pela sua aplicação ou executados de forma síncrona dentro do ciclo de vida da requisição atual. Jobs que são executados de forma síncrona durante a requisição atual são às vezes chamados de "commands" já que são uma implementação do <a href="https://en.wikipedia.org/wiki/Command_pattern" target="_blank">padrão de comando</a>.

### O Diretório `Listeners`

Esse diretório não existe por padrão, mas será criado para você se você executar o comando `make:listener` do Artisan. O diretório `Listeners` contém as classes que lidam com seus <a href="/explorando-mais-a-fundo/eventos" target="_blank">eventos</a>. Os listeners de eventos recebem uma instância de evento e executam lógica em resposta ao evento ser disparado. Por exemplo, um evento `UserRegistered` pode ser tratado por um listener `SendWelcomeEmail`.

### O Diretório `Mail`

Esse diretório não existe por padrão, mas será criado para você se você executar o comando `make:mail` do Artisan. O diretório `Mail` contém todas as suas <a href="/explorando-mais-a-fundo/emails" target="_blank">classes que representam emails</a> enviados pela sua aplicação. Objetos de email permitem encapsular toda a lógica de construção de um email em uma única classe simples que pode ser enviada usando o método `Mail::send`.

### O Diretório `Models`

O diretório `Models` contém todas as suas <a href="/eloquent-orm/introducao" target="_blank">classes de Models Eloquent</a>. O Eloquent ORM incluído com o Laravel fornece uma bela implementação ActiveRecord simples para trabalhar com seu banco de dados. Cada tabela do banco de dados tem um "Model" correspondente que é usado para interagir com essa tabela. Os models permitem que você consulte dados em suas tabelas, bem como insira novos registros na tabela.

### O Diretório `Notifications`

Esse diretório não existe por padrão, mas será criado para você se você executar o comando `make:notification` do Artisan. O diretório `Notifications` contém todas as suas <a href="/explorando-mais-a-fundo/notificacoes" target="_blank">classes de notificação</a> "transacionais" que são enviadas pela sua aplicação, como notificações simples sobre eventos que acontecem dentro da sua aplicação. O recurso de notificação do Laravel abstrai o envio de notificações por uma variedade de drivers, como email, Slack, SMS ou armazenamento em um banco de dados.

### O Diretório `Policies`

Esse diretório não existe por padrão, mas será criado para você se você executar o comando `make:policy` do Artisan. O diretório `Policies` contém as <a href="/seguranca/autorizacao" target="_blank">classes de políticas de autorização</a> para a sua aplicação. As políticas são usadas para determinar se um usuário pode executar uma ação específica em um recurso.

### O Diretório `Providers`

O diretório `Providers` contém todos os <a href="/conceitos-de-arquitetura/service-providers" target="_blank">Servide Providers</a> para a sua aplicação. Os Service Providers inicializam sua aplicação vinculando serviços no container de serviços, registrando eventos ou executando qualquer outra tarefa para preparar sua aplicação para requisições de entrada.

Em uma aplicação Laravel recém-criada, este diretório já conterá o `AppServiceProvider`. Você é livre para adicionar seus próprios providers a este diretório conforme necessário.

### O Diretório `Rules`

Esse diretório não existe por padrão, mas será criado para você se você executar o comando `make:rule` do Artisan. O diretório `Rules` contém as classes de regras de validação personalizadas. As regras são usadas para encapsular lógica de validação complicada em um objeto simples. Para mais informações, confira a <a href="/fundamentos/validacao" target="_blank">documentação de validação</a>.
