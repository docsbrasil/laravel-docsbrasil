<script setup>
import Info from '../components/Info.vue'
import Code from '../components/Code.vue'
</script>

# Configuração

## Introdução

Todos os arquivos de configuração do framework Laravel são armazenados no diretório `config`. Cada opção é documentada, então sinta-se à vontade para olhar os arquivos e se familiarizar com as opções disponíveis para você.

Esses arquivos de configuração permitem que você configure coisas como informações de conexão com o banco de dados, informações do servidor de e-mail, bem como vários outros valores de configuração principais, como o fuso horário da sua aplicação e a chave de criptografia.

#### O comando `about`

O laravel também pode exibir uma visão geral da configuração da sua aplicação, drivers e ambiente via o comando `about` do Artisan.

```bash
php artisan about
```

Se você estiver interessado apenas em uma seção específica da saída da visão geral da aplicação, você pode filtrar essa seção usando a opção `--only`:

```bash
php artisan about --only=environment
```

Ou, para explorar os valores de um arquivo de configuração específico em detalhes, você pode usar o comando `config:show` do Artisan:

```bash
php artisan config:show database
```

## Configuração de Ambiente

Geralmente, é útil ter valores de configuração diferentes com base no ambiente em que o aplicativo está sendo executado. Por exemplo, você pode desejar usar um driver de cache diferente localmente do que em seu servidor de produção.

Para facilitar isso, o Laravel utiliza a biblioteca PHP <a href="https://github.com/vlucas/phpdotenv" target="_blank">DotEnv</a>. Em uma instalação do Laravel, o diretório raiz do seu aplicativo conterá um arquivo `.env.example` que define muitas variáveis de ambiente comuns. Durante o processo de instalação do Laravel, este arquivo será automaticamente copiado para `.env`.

O arquivo `.env` padrão do Laravel contém alguns valores de configuração comuns que podem diferir com base em se o seu aplicativo está sendo executado localmente ou em um servidor web de produção. Esses valores são então lidos pelos arquivos de configuração dentro do diretório `config` usando a função `env` do Laravel.

Se você está desenvolvendo com uma equipe, pode continuar incluindo e atualizando o arquivo `.env.example` com seu aplicativo. Ao colocar valores de espaço reservado no arquivo de configuração de exemplo, outros desenvolvedores de sua equipe podem ver claramente quais variáveis de ambiente são necessárias para executar seu aplicativo.

<Info>
Qualquer variável em seu arquivo <Code>.env</Code> pode ser substituída por variáveis de ambiente externas, como variáveis de ambiente em nível de servidor ou sistema.
</Info>

#### Segurança do Arquivo de Ambiente

Seu arquivo `.env` não deve ser enviado para o controle de origem de sua aplicação, pois cada desenvolvedor/servidor que usa sua aplicação pode exigir uma configuração de ambiente diferente. Além disso, isso seria um risco de segurança no caso de um invasor ganhar acesso ao seu repositório de controle de origem, pois quaisquer credenciais sensíveis seriam expostas.

No entanto, é possível criptografar seu arquivo de ambiente usando a <a href="#criptografando-arquivos-de-ambiente">criptografia de ambiente integrada do Laravel</a>. Arquivos de ambiente criptografados podem ser colocados com segurança no controle de origem.

#### Arquivos de Ambiente Adicionais

Antes de carregar as variáveis de ambiente de sua aplicação, o Laravel determina se uma variável de ambiente `APP_ENV` foi fornecida externamente ou se o argumento CLI `--env` foi especificado. Se sim, o Laravel tentará carregar um arquivo `.env.[APP_ENV]` se ele existir. Se não existir, o arquivo padrão `.env` será carregado.

#### Tipos de Variáveis de Ambiente

Todas as variáveis em seus arquivos `.env` são normalmente analisadas como strings, então alguns valores reservados foram criados para permitir que você retorne uma gama mais ampla de tipos da função `env()`:

<table>
  <thead>
    <tr>
      <th>
        Valor no Arquivo
        <Code>.env</Code>
      </th>
      <th>
        Valor Retornado
        <Code>env( )</Code>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>true</td>
      <td>(bool) true</td>
    </tr>
    <tr>
      <td>(true)</td>
      <td>(bool) true</td>
    </tr>
    <tr>
      <td>false</td>
      <td>(bool) false</td>
    </tr>
    <tr>
      <td>(false)</td>
      <td>(bool) false</td>
    </tr>
    <tr>
      <td>empty</td>
      <td>(string) ''</td>
    </tr>
    <tr>
      <td>(empty)</td>
      <td>(string) ''</td>
    </tr>
    <tr>
      <td>null</td>
      <td>(null) null</td>
    </tr>
    <tr>
      <td>(null)</td>
      <td>(null) null</td>
    </tr>
  </tbody>
</table>

Se você precisa definir uma variável de ambiente com um valor que contenha espaços, você pode fazer isso envolvendo o valor em aspas duplas:

```ini
APP_NAME="My Application"
```

### Recuperando Configuração de Ambiente

Todas as variáveis listadas no arquivo `.env` serão carregadas no super-global PHP `$\_ENV` quando sua aplicação receber uma solicitação. No entanto, você pode usar a função `env` para recuperar valores dessas variáveis em seus arquivos de configuração. De fato, se você revisar os arquivos de configuração do Laravel, notará que muitas das opções já estão usando essa função:

```php
'debug' => env('APP_DEBUG', false),
```

O segundo valor passado para a função `env` é o "valor padrão". Este valor será retornado se nenhuma variável de ambiente existir para a chave fornecida.

### Determinando o Ambiente Atual

A detecção do ambiente atual da aplicação pode ser substituída definindo uma variável de ambiente `APP_ENV` em nível de servidor. Você pode acessar esse valor por meio do método `environment` na <a href="/conceitos-de-arquitetura/facades">Facade</a> `App`:

```php
use Illuminate\Support\Facades\App;

$environment = App::environment();
```

Você também pode passar argumentos para o método `environment` para determinar se o ambiente corresponde a um valor específico. O método retornará `true` se o ambiente corresponder a qualquer um dos valores fornecidos:

```php
if (App::environment('local')) {
    // O ambiente é local
}

if (App::environment(['local', 'staging'])) {
    // O ambiente é local OU staging...
}
```

<Info>
 A detecção do ambiente atual da aplicação pode ser substituída definindo uma variável de ambiente `APP_ENV` em nível de servidor.
</Info>

### Criptografando Arquivos de Ambiente

Arquivos de ambiente não criptografados nunca devem ser armazenados em controle de origem. No entanto, o Laravel permite que você criptografe seus arquivos de ambiente para que possam ser adicionados com segurança ao controle de origem com o restante de sua aplicação.

#### Criptografando

Para criptografar um arquivo de ambiente, você pode usar o comando `env:encrypt`:

```bash
php artisan env:encrypt
```

Executar o comando `env:encrypt` criptografará seu arquivo `.env` e colocará o conteúdo criptografado em um arquivo `.env.encrypted`. A chave de descriptografia é apresentada na saída do comando e deve ser armazenada em um gerenciador de senhas seguro. Se você deseja fornecer sua própria chave de criptografia, você pode usar a opção `--key` ao chamar o comando:

```bash
php artisan env:encrypt --key=3UVsEgGVK36XN82KKeyLFMhvosbZN1aF
```

<Info>
A chave fornecida deve corresponder ao comprimento da chave necessária pelo cifrador de criptografia usado. Por padrão, o Laravel usará o cifrador <Code>AES-256-CBC</Code>, que requer uma chave de 32 caracteres. Você é livre para usar qualquer cifrador suportado pelo <a href="/seguranca/criptografia">criptografador</a> do Laravel passando a opção <Code>--cipher</Code> ao chamar o comando.
</Info>

Se a sua aplicação tiver vários arquivos de ambiente, como `.env` e `.env.staging`, você pode especificar o arquivo de ambiente que deve ser criptografado fornecendo o nome do ambiente via a opção `--env`:

```bash
php artisan env:encrypt --env=staging
```

#### Descriptografando

Para descriptografar um arquivo de ambiente, você pode usar o comando `env:decrypt`. Este comando requer uma chave de descriptografia, que o Laravel recuperará da variável de ambiente `LARAVEL_ENV_ENCRYPTION_KEY`:

```bash
php artisan env:decrypt
```

Ou, a chave pode ser fornecida diretamente ao comando via a opção `--key`:

```bash
php artisan env:decrypt --key=3UVsEgGVK36XN82KKeyLFMhvosbZN1aF
```

Quando o comando `env:decrypt` é chamado, o Laravel descriptografará o conteúdo do arquivo `.env.encrypted` e colocará o conteúdo descriptografado no arquivo `.env`.

A opção `--cipher` pode ser fornecida ao comando `env:decrypt` para usar um cifrador de criptografia personalizado:

```bash
php artisan env:decrypt --key=qUWuNRdfuImXcKxZ --cipher=AES-128-CBC
```

Se sua aplicação tiver vários arquivos de ambiente, como `.env` e `.env.staging`, você pode especificar o arquivo de ambiente que deve ser descriptografado fornecendo o nome do ambiente via a opção `--env`:

```bash
php artisan env:decrypt --env=staging
```

Para sobrescrever um arquivo de ambiente existente, você pode fornecer a opção `--force` ao comando `env:decrypt`:

```bash
php artisan env:decrypt --force
```

## Acessando Valores de Configuração

Você pode acessar facilmente seus valores de configuração usando a <a href="/conceitos-de-arquitetura/facades">Facade</a> `Config` ou a função global `config` de qualquer lugar em sua aplicação. Os valores de configuração podem ser acessados usando a sintaxe "ponto", que inclui o nome do arquivo e a opção que você deseja acessar. Um valor padrão também pode ser especificado e será retornado se a opção de configuração não existir:

```php
use Illuminate\Support\Facades\Config;

$value = Config::get('app.timezone');

$value = config('app.timezone');

// Recupera um valor padrão se a opção de configuração não existir...
$value = config('app.timezone', 'Asia/Seoul');
```

Para definir valores de configuração em tempo de execução, você pode invocar o método `set` da Facade `Config` ou passar um array para a função `config`:

```php
Config::set('app.timezone', 'America/Chicago');

config(['app.timezone' => 'America/Chicago']);
```

Para auxiliar na análise estática, a Facade `Config` também fornece métodos de recuperação de configuração tipados. Se o valor de configuração recuperado não corresponder ao tipo esperado, uma exceção será lançada:

```php
Config::string('config-key');
Config::integer('config-key');
Config::float('config-key');
Config::boolean('config-key');
Config::array('config-key');
```

### Cache da Configuração

Para tornar a sua aplicação mais rápida, você deve armazenar em cache todos os seus arquivos de configuração em um único arquivo usando o comando `config:cache` do Artisan. Isso combinará todas as opções de configuração da sua aplicação em um único arquivo que pode ser carregado rapidamente pelo framework.

Você deve executar o comando `php artisan config:cache` como parte do seu processo de deploy. O comando não deve ser executado durante o desenvolvimento local, pois as opções de configuração precisarão ser alteradas com frequência durante o desenvolvimento de sua aplicação.

Depois que a configuração for armazenada em cache, o arquivo `.env` de sua aplicação não será carregado pelo framework durante as solicitações ou comandos do Artisan; portanto, a função `env` retornará apenas variáveis de ambiente externas de nível de sistema.

Por esse motivo, você deve garantir que está chamando a função `env` apenas de dentro de seus arquivos de configuração da aplicação. Você pode ver muitos exemplos disso examinando os arquivos de configuração padrão do Laravel. Os valores de configuração podem ser acessados de qualquer lugar em sua aplicação usando a função `config` <a href="#acessando-valores-de-configuracao">descrita acima</a>.

O comando `config:clear` pode ser usado para limpar a configuração armazenada em cache:

```bash
php artisan config:clear
```

<Info>
Se você executar o comando <Code>config:cache</Code> durante o seu processo de deploy, você deve garantir que está chamando a função <Code>env</Code> apenas de dentro de seus arquivos de configuração. Depois que a configuração for armazenada em cache, o arquivo <Code>.env</Code> não será carregado; portanto, a função <Code>env</Code> retornará apenas variáveis de ambiente externas de nível de sistema.
</Info>

## Publicando Configurações

A maioria dos arquivos de configuração do Laravel já estão publicados no diretório `config` de sua aplicação; no entanto, certos arquivos de configuração como `cors.php` e `view.php` não são publicados por padrão, pois a maioria das aplicações nunca precisará modificá-los.

No entanto, você pode usar o comando `config:publish` do Artisan para publicar quaisquer arquivos de configuração que não são publicados por padrão:

```bash
php artisan config:publish

php artisan config:publish --all
```

## Modo de Debug

A opção `debug` em seu arquivo de configuração `config/app.php` determina quanto de informação sobre um erro é realmente exibida ao usuário. Por padrão, essa opção é definida para respeitar o valor da variável de ambiente `APP_DEBUG`, que é armazenada em seu arquivo `.env`.

<Info>
Para desenvolvimento local, você deve definir a variável de ambiente <Code>APP_DEBUG</Code> como <Code>true</Code>. <strong>Em seu ambiente de produção, esse valor deve sempre ser <Code>false</Code>. Se a variável for definida como <Code>true</Code> em produção, você corre o risco de expor valores de configuração sensíveis aos usuários finais de sua aplicação.</strong>
</Info>

## Modo de Manutenção

Quando sua aplicação está em modo de manutenção, uma visão personalizada será exibida para todas as requisições feitas à sua aplicação. Isso facilita "desativar" sua aplicação enquanto ela está sendo atualizada ou quando você está realizando manutenção. Uma verificação de modo de manutenção está incluída na pilha de middleware padrão da sua aplicação. Se a aplicação estiver em modo de manutenção, uma instância de `Symfony\Component\HttpKernel\Exception\HttpException` será lançada com um código de status `503`.

Para habilitar o modo de manutenção, execute o comando artisan `down`:

```bash
php artisan down
```

Se você quiser que o cabeçalho HTTP `Refresh` seja enviado com todas as respostas de modo de manutenção, você pode fornecer a opção `refresh` ao invocar o comando `down`. O cabeçalho `Refresh` instruirá o navegador a atualizar automaticamente a página após o número especificado de segundos:

```bash
php artisan down --refresh=15
```

Você também pode fornecer uma opção `retry` ao comando `down`, que será definida como o valor do cabeçalho HTTP `Retry-After`, embora os navegadores geralmente ignorem este cabeçalho:

```bash
php artisan down --retry=60
```

#### Ignorando o Modo de Manutenção

Para permitir que o modo de manutenção seja ignorado usando um token secreto, você pode utilizar a opção `secret` para especificar um token de bypass do modo de manutenção:

```bash
php artisan down --secret="1630542a-246b-4b66-afa1-dd72a4c43515"
```

Após colocar a aplicação em modo de manutenção, você pode navegar para a URL da aplicação correspondente a este token e o Laravel emitirá um cookie de bypass do modo de manutenção para o seu navegador:

```bash
https://example.com/1630542a-246b-4b66-afa1-dd72a4c43515
```

Se você quiser que o Laravel gere o token secreto para você, pode usar a opção `with-secret`. O token secreto será exibido para você assim que a aplicação estiver em modo de manutenção:

```bash
php artisan down --with-secret
```

Ao acessar esta rota oculta, você será redirecionado para a rota `/` da aplicação. Depois que o cookie for emitido para o seu navegador, você poderá navegar pela aplicação normalmente, como se ela não estivesse em modo de manutenção.

<Info> 
Seu token secreto para o modo de manutenção deve, normalmente, consistir em caracteres alfanuméricos e, opcionalmente, traços. Evite utilizar caracteres com significado especial em URLs, como `?` ou `&amp;`. 
</Info>

#### Modo de Manutenção em Múltiplos Servidores

Por padrão, o Laravel determina se sua aplicação está em modo de manutenção usando um sistema baseado em arquivos. Isso significa que, para ativar o modo de manutenção, o comando `php artisan down` precisa ser executado em cada servidor que hospeda sua aplicação.

Como alternativa, o Laravel oferece um método baseado em cache para gerenciar o modo de manutenção. Esse método requer a execução do comando `php artisan down` em apenas um servidor. Para usar essa abordagem, modifique a configuração do "driver" no arquivo `config/app.php` da sua aplicação para `cache`. Em seguida, selecione um `store` de cache que seja acessível por todos os seus servidores. Isso garante que o status de modo de manutenção seja mantido consistentemente em todos os servidores:

```php
'maintenance' => [
    'driver' => 'cache',
    'store' => 'database',
],
```

#### Pré-renderizando a View de Modo de Manutenção

Se você utiliza o comando `php artisan down` durante o deploy, seus usuários ainda podem ocasionalmente encontrar erros se acessarem a aplicação enquanto as dependências do Composer ou outros componentes de infraestrutura estão sendo atualizados. Isso ocorre porque uma parte significativa do framework precisa ser inicializada para determinar se sua aplicação está em modo de manutenção e renderizar a view de modo de manutenção usando o mecanismo de templates.

Por essa razão, o Laravel permite que você pré-renderize uma view de modo de manutenção que será retornada no início do ciclo de requisição. Essa view é renderizada antes que qualquer dependência da aplicação seja carregada. Você pode pré-renderizar um template de sua escolha usando a opção `render` do comando `down`:

```bash
php artisan down --render="errors::503"
```

#### Redirecionando Requisições no Modo de Manutenção

Enquanto estiver no modo de manutenção, o Laravel exibirá a visão de modo de manutenção para todas as URLs da aplicação que o usuário tentar acessar. Caso deseje, é possível instruir o Laravel a redirecionar todas as requisições para uma URL específica. Isso pode ser feito utilizando a opção `redirect`. Por exemplo, você pode redirecionar todas as requisições para a URI `/`:

```bash
php artisan down --redirect=/
```

#### Desabilitando o Modo de Manutenção

Para desabilitar o modo de manutenção, utilize o comando `up`:

```bash
php artisan up
```

<Info>
Você pode personalizar o template padrão do modo de manutenção definindo seu próprio template em <code>resources/views/errors/503.blade.php</code>.
</Info>

#### Modo de Manutenção e Filas

Enquanto sua aplicação estiver no modo de manutenção, nenhum <a href="/explorando-mais-a-fundo/filas">job em fila</a> será processado. Os jobs continuarão a ser processados normalmente assim que a aplicação sair do modo de manutenção.

#### Alternativas ao Modo de Manutenção

Como o modo de manutenção exige que sua aplicação tenha alguns segundos de inatividade, considere alternativas como <a href="https://vapor.laravel.com" target="_blank">Laravel Vapor</a> e <a href="https://envoyer.io" target="_blank">Envoyer</a> para realizar um deploy sem downtime com o Laravel.