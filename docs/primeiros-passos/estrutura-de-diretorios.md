<script setup>
import Info from '../components/Info.vue';
import Code from '../components/Code.vue';
</script>

# Estrutura de diretórios

## Introdução

A estrutura padrão da aplicação Laravel é projetada para fornecer um ótimo ponto de partida tanto para aplicações grandes quanto pequenas. No entanto, você está livre para organizar sua aplicação da maneira que preferir. O Laravel impõe quase nenhuma restrição sobre onde qualquer classe pode estar localizada desde que o Composer consiga carregar automaticamente a classe.

<Info> 
Novo no Laravel? Confira o <a href="https://bootcamp.laravel.com" target="_blank">Laravel Bootcamp</a> para um tour prático pelo framework, onde o ajudaremos a criar sua primeira aplicação Laravel. 
</Info>

## Diretório raiz (root)

### O Diretório App

O diretório <Code>app</Code> contém o código principal da sua aplicação. Exploramos este diretório com mais detalhes em breve; no entanto, quase todas as classes da sua aplicação estarão neste diretório.

### O Diretório Bootstrap

O diretório <Code>bootstrap</Code> contém o arquivo <Code>app.php</Code>, que inicializa o framework. Este diretório também contém um diretório <Code>cache</Code> que armazena arquivos gerados pelo framework para otimização de desempenho, como os arquivos de cache de rotas e serviços.

### O Diretório Config

O diretório <Code>config</Code>, como o nome sugere, contém todos os arquivos de configuração da sua aplicação. É uma boa prática ler todos esses arquivos e se familiarizar com todas as opções disponíveis.

### O Diretório Database

O diretório <Code>database</Code> contém as suas migrações de banco de dados, factories e seeders. Se desejar, você também pode usar este diretório para armazenar um banco de dados SQLite.

### O Diretório Public

O diretório <Code>public</Code> contém o arquivo <Code>index.php</Code>, que é o ponto de entrada para todas as requisições que entram na sua aplicação, e configura o autoloading. Este diretório também contém seus assets, como imagens, JavaScript e CSS.

### O Diretório Resources

O diretório <Code>resources</Code> contém suas <a href="/fundamentos/views" target="_blank">views</a> além dos seus assets brutos e não compilados, como CSS e JavaScript.

### O Diretório Routes

O diretório <Code>routes</Code> contém todas as definições de rotas para a sua aplicação. Por padrão, dois arquivos de rotas são incluídos com o Laravel: <Code>web.php</Code> e <Code>console.php</Code>.

O arquivo <Code>web.php</Code> contém rotas que o Laravel coloca no grupo de middleware <Code>web</Code>, que fornece estado de sessão, proteção CSRF e criptografia de cookies. Se sua aplicação não oferecer uma API RESTful sem estado, então todas as suas rotas provavelmente serão definidas no arquivo <Code>web.php</Code>.

O arquivo <Code>console.php</Code> é onde você pode definir todos os seus comandos baseados em closure para o console. Cada closure é vinculada a uma instância de comando, permitindo uma abordagem simples para interagir com os métodos de E/S de cada comando. Embora este arquivo não defina rotas HTTP, ele define pontos de entrada baseados em console (rotas) para sua aplicação. Você também pode <a href="/explorando-mais-a-fundo/agendamento-de-tarefas" target="_blank">agendar</a> tarefas no arquivo <Code>console.php</Code>.

Opcionalmente, você pode instalar arquivos de rota adicionais para rotas de API (<Code>api.php</Code>) e canais de broadcasting (<Code>channels.php</Code>) através dos comandos Artisan <Code>install</Code> e <Code>install</Code>.

O arquivo <Code>api.php</Code> contém rotas que são destinadas a ser sem estado, portanto, as requisições que entram na aplicação por meio dessas rotas devem ser autenticadas <a href="/pacotes/sanctum" target="_blank">via tokens</a> e não terão acesso ao estado da sessão.

O arquivo <Code>channels.php</Code> é onde você pode registrar todos os canais de <a href="/explorando-mais-a-fundo/broadcasting" target="_blank">broadcasting</a> de eventos que sua aplicação suporta.

### O Diretório Storage

O diretório <Code>storage</Code> contém seus logs, templates Blade compilados, sessões baseadas em arquivos, caches de arquivos e outros arquivos gerados pelo framework. Este diretório é dividido nos diretórios <Code>app</Code>, <Code>framework</Code> e <Code>logs</Code>. O diretório <Code>app</Code> pode ser usado para armazenar qualquer arquivo gerado pela sua aplicação. O diretório <Code>framework</Code> é usado para armazenar arquivos e caches gerados pelo framework. Por fim, o diretório <Code>logs</Code> contém os arquivos de log da sua aplicação.

O diretório <Code>storage/app/public</Code> pode ser usado para armazenar arquivos gerados pelos usuários, como avatares de perfil, que devem ser acessíveis publicamente. Você deve criar um link simbólico em <Code>public/storage</Code> que aponte para este diretório. Você pode criar o link usando o comando Artisan <Code>php artisan storage</Code>.

### O Diretório Tests

O diretório <Code>tests</Code> contém seus testes automatizados. Exemplos de testes unitários e de funcionalidade com <a href="https://pestphp.com" target="_blank">Pest</a> ou <a href="https://phpunit.de/" target="_blank">PHPUnit</a> são fornecidos de forma padrão. Cada classe de teste deve ser suffixada com a palavra <Code>Test</Code>. Você pode rodar seus testes usando os comandos <Code>/vendor/bin/pest</Code> ou <Code>/vendor/bin/phpunit</Code>. Ou, se quiser uma representação mais detalhada e bonita dos resultados dos seus testes, pode rodá-los usando o comando Artisan <Code>php artisan test</Code>.

### O Diretório Vendor

O diretório <Code>vendor</Code> contém as dependências do seu projeto gerenciadas pelo <a href="https://getcomposer.org" target="_blank">Composer</a>.

## Diretório `App`

A maior parte da sua aplicação está localizada no diretório <Code>app</Code>. Por padrão, este diretório tem o namespaced <Code>App</Code> e é carregado automaticamente pelo Composer usando o <a href="https://www.php-fig.org/psr/psr-4/" target="_blank">padrão de carregamento automático PSR-4</a>.

Por padrão, o diretório <Code>app</Code> contém os diretórios <Code>Http</Code>, <Code>Models</Code> e <Code>Providers</Code>. No entanto, ao longo do tempo, uma variedade de outros diretórios serão gerados dentro do diretório <Code>app</Code> à medida que você usa os comandos Artisan <Code>make</Code> para gerar classes. Por exemplo, o diretório <Code>app/Console</Code> não existirá até que você execute o comando Artisan <Code>make:command</Code> para gerar uma classe de comando.

Tanto os diretórios <Code>Console</Code> quanto <Code>Http</Code> são explicados mais detalhadamente em suas respectivas seções abaixo, mas pense nos diretórios <Code>Console</Code> e <Code>Http</Code> como fornecendo uma API para o núcleo da sua aplicação. O protocolo HTTP e a CLI são ambos mecanismos para interagir com a sua aplicação, mas não contêm logicamente a aplicação. Em outras palavras, eles são duas maneiras de emitir comandos para a sua aplicação. O diretório <Code>Console</Code> contém todos os seus comandos Artisan, enquanto o diretório <Code>Http</Code> contém seus controllers, middleware e requests.

<Info>
Muitas das classes no diretório <Code>app</Code> podem ser geradas pelo Artisan via comandos. Para revisar os comandos disponíveis, execute o comando <Code>php artisan list make</Code> no seu terminal.
</Info>

### O Diretório `Broadcasting`

O diretório <Code>Broadcasting</Code> contém todas as classes de canal de broadcast para a sua aplicação. Essas classes são geradas usando o comando <Code>make:channel</Code>. Este diretório não existe por padrão, mas será criado para você quando você criar seu primeiro canal. Para aprender mais sobre canais, confira a documentação sobre <a href="/explorando-mais-a-fundo/broadcasting" target="_blank">broadcasting de eventos</a>.

### O Diretório `Console`

O diretório <Code>Console</Code> contém todos os comandos Artisan da sua aplicação. Esses comandos são gerados usando o comando <Code>make:command</Code>.

### O Diretório `Events`

O diretório <Code>Events</Code> contém todas as classes de <a href="/explorando-mais-a-fundo/eventos" target="_blank">eventos</a> para a sua aplicação. Essas classes são geradas usando o comando <Code>make:event</Code>. Eventos são uma maneira de alertar outras partes da sua aplicação que uma ação específica ocorreu, fornecendo uma grande flexibilidade e desacoplamento.

### O Diretório `Exceptions`

O diretório <Code>Exceptions</Code> contém todas as exceções personalizadas para a sua aplicação. Essas exceções podem ser geradas usando o comando <Code>make:exception</Code>.

### O Diretório `Http`

O diretório <Code>Http</Code> contém seus controllers, middleware e requests. Quase toda a lógica para lidar com requisições que entram na sua aplicação será colocada neste diretório.

### O Diretório `Jobs`

Esse diretório não existe por padrão, mas será criado para você se você executar o comando <Code>make:job</Code> do Artisan. O diretório <Code>Jobs</Code> abriga os <a href="/explorando-mais-a-fundo/filas" target="_blank">jobs</a> para a sua aplicação. Jobs podem ser colocados em Fila pela sua aplicação ou executados de forma síncrona dentro do ciclo de vida da requisição atual. Jobs que são executados de forma síncrona durante a requisição atual são às vezes chamados de "commands" já que são uma implementação do <a href="https://en.wikipedia.org/wiki/Command_pattern" target="_blank">padrão de comando</a>.

### O Diretório `Listeners`

Esse diretório não existe por padrão, mas será criado para você se você executar o comando <Code>make:listener</Code> do Artisan. O diretório <Code>Listeners</Code> contém as classes que lidam com seus <a href="/explorando-mais-a-fundo/eventos" target="_blank">eventos</a>. Os listeners de eventos recebem uma instância de evento e executam lógica em resposta ao evento ser disparado. Por exemplo, um evento <Code>UserRegistered</Code> pode ser tratado por um listener <Code>SendWelcomeEmail</Code>.

### O Diretório `Mail`

Esse diretório não existe por padrão, mas será criado para você se você executar o comando <Code>make:mail</Code> do Artisan. O diretório <Code>Mail</Code> contém todas as suas <a href="/explorando-mais-a-fundo/emails" target="_blank">classes que representam emails</a> enviados pela sua aplicação. Objetos de email permitem encapsular toda a lógica de construção de um email em uma única classe simples que pode ser enviada usando o método <Code>Mail::send</Code>.

### O Diretório `Models`

O diretório <Code>Models</Code> contém todas as suas <a href="/eloquent-orm/introducao" target="_blank">classes de Models Eloquent</a>. O Eloquent ORM incluído com o Laravel fornece uma bela implementação ActiveRecord simples para trabalhar com seu banco de dados. Cada tabela do banco de dados tem um "Model" correspondente que é usado para interagir com essa tabela. Os models permitem que você consulte dados em suas tabelas, bem como insira novos registros na tabela.

### O Diretório `Notifications`

Esse diretório não existe por padrão, mas será criado para você se você executar o comando <Code>make:notification</Code> do Artisan. O diretório <Code>Notifications</Code> contém todas as suas <a href="/explorando-mais-a-fundo/notificacoes" target="_blank">classes de notificação</a> "transacionais" que são enviadas pela sua aplicação, como notificações simples sobre eventos que acontecem dentro da sua aplicação. O recurso de notificação do Laravel abstrai o envio de notificações por uma variedade de drivers, como email, Slack, SMS ou armazenamento em um banco de dados.

### O Diretório `Policies`

Esse diretório não existe por padrão, mas será criado para você se você executar o comando <Code>make:policy</Code> do Artisan. O diretório <Code>Policies</Code> contém as <a href="/seguranca/autorizacao" target="_blank">classes de políticas de autorização</a> para a sua aplicação. As políticas são usadas para determinar se um usuário pode executar uma ação específica em um recurso.

### O Diretório `Providers`

O diretório <Code>Providers</Code> contém todos os <a href="/conceitos-de-arquitetura/service-providers" target="_blank">Servide Providers</a> para a sua aplicação. Os Service Providers inicializam sua aplicação vinculando serviços no container de serviços, registrando eventos ou executando qualquer outra tarefa para preparar sua aplicação para requisições de entrada.

Em uma aplicação Laravel recém-criada, este diretório já conterá o <Code>AppServiceProvider</Code>. Você é livre para adicionar seus próprios providers a este diretório conforme necessário.

### O Diretório `Rules`

Esse diretório não existe por padrão, mas será criado para você se você executar o comando <Code>make:rule</Code> do Artisan. O diretório <Code>Rules</Code> contém as classes de regras de validação personalizadas. As regras são usadas para encapsular lógica de validação complicada em um objeto simples. Para mais informações, confira a <a href="/fundamentos/validacao" target="_blank">documentação de validação</a>.
