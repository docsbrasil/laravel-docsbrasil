# Deploy

## Introdução

Quando você estiver pronto para implantar sua aplicação Laravel em produção, existem algumas coisas importantes que você pode fazer para garantir que sua aplicação esteja funcionando o mais eficientemente possível. Neste documento, abordaremos alguns ótimos pontos de partida para garantir que sua aplicação Laravel seja implantada corretamente.

## Requisitos do Servidor

O Laravel possui alguns requisitos de sistema. Você deve garantir que seu servidor web tenha a seguinte versão mínima do PHP e extensões:

- PHP >= 8.2
- Extensão PHP Ctype
- Extensão PHP cURL
- Extensão PHP DOM
- Extensão PHP Fileinfo
- Extensão PHP Filter
- Extensão PHP Hash
- Extensão PHP Mbstring
- Extensão PHP OpenSSL
- Extensão PHP PCRE
- Extensão PHP PDO
- Extensão PHP Session
- Extensão PHP Tokenizer
- Extensão PHP XML

## Configuração do Servidor Web

### Nginx

Se você estiver usando o Nginx, você pode usar o arquivo de configuração acima como ponto de partida para configurar seu servidor web. Provavelmente, este arquivo precisará ser personalizado dependendo da configuração de seu servidor. **Se você deseja ajuda para gerenciar seu servidor, considere usar um serviço de gerenciamento e implantação de servidores Laravel de primeira parte, como o <a href="https://forge.laravel.com" target="_blank">Laravel Forge</a>.**

Por favor, assegure-se, como a configuração abaixo, que seu servidor web direcione todas as requisições para o arquivo `public/index.php` de sua aplicação. Você nunca deve tentar mover o arquivo `index.php` para a raiz do projeto, pois servir a aplicação a partir da raiz do projeto irá expor arquivos sensíveis.

```bash
server {
    listen 80;
    listen [::]:80;
    server_name example.com;
    root /srv/example.com/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### FrankenPHP

<a href="https://frankenphp.dev/" target="_blank">FrankenPHP</a> também pode ser usado para servir suas aplicações Laravel. FrankenPHP é um servidor de aplicação PHP moderno escrito em Go. Para servir uma aplicação Laravel usando FrankenPHP, você pode simplesmente utilizar o comando `php-server`:

```shell
frankenphp php-server -r public/
```

Para aproveitar recursos mais poderosos suportados pelo FrankenPHP, como sua integração com o <a href="/pacotes/octane" target="_blank">Laravel Octane</a>, HTTP/3, compressão moderna ou a capacidade de empacotar aplicações Laravel como binários autônomos, consulte a <a href="https://frankenphp.dev/docs/laravel/" target="_blank">documentação do Laravel do FrankenPHP</a>.

### Permissões de Diretórios

Laravel precisará escrever nos diretórios `bootstrap/cache` e `storage`, então você deve garantir que o proprietário do processo do servidor web tenha permissão para escrever nesses diretórios.

## Otimização

Quando você faz o deploy de sua aplicação em produção, existem vários arquivos que devem ser armazenados em cache, incluindo sua configuração, eventos, rotas e views. O Laravel fornece um único e conveniente comando Artisan `optimize` que armazenará em cache todos esses arquivos. Este comando deve ser invocado tipicamente como parte do processo de deploy de sua aplicação:

```shell
php artisan optimize
```

O método `optimize:clear` pode ser usado para remover todos os arquivos de cache gerados pelo comando `optimize` bem como todas as chaves no driver de cache padrão:

```shell
php artisan optimize:clear
```

Nas próximas seções, discutiremos cada um dos comandos de otimização que são executados pelo comando `optimize`.

### Cache da Configuração

Ao subir sua aplicação em produção, você deve garantir que execute o comando Artisan `config:cache` durante seu processo de deploy:

```shell
php artisan config:cache
```

Este comando combinará todos os arquivos de configuração do Laravel em um único arquivo em cache, o que reduz significativamente o número de viagens que o framework deve fazer ao sistema de arquivos ao carregar seus valores de configuração.

::: danger
Se você executar o comando `config:cache` durante seu processo de deploy, você deve garantir que está chamando a função `env` apenas de dentro de seus arquivos de configuração. Uma vez que a configuração tenha sido armazenada em cache, o arquivo `.env` não será carregado e todas as chamadas à função `env` para variáveis `.env` retornarão `null`.
:::

### Cache de Eventos

Você deve armazenar em cache os mapeamentos de eventos para seus listeners auto-descobertos durante seu processo de deploy. Isso pode ser feito usando o comando Artisan `event:cache` durante o deploy:

```shell
php artisan event:cache
```

### Cache de Rotas

Se você estiver construindo uma aplicação grande com muitas rotas, você deve garantir que está executando o comando Artisan `route:cache` durante seu processo de deploy:

```shell
php artisan route:cache
```

Este comando reduz todos os registros de suas rotas em uma única chamada de método dentro de um arquivo em cache, melhorando o desempenho do registro de rotas ao registrar centenas de rotas.

### Cache de Views

Ao subir sua aplicação em produção, você deve garantir que execute o comando Artisan `view:cache` durante seu processo de deploy:

```shell
php artisan view:cache
```

Este comando pré-compila todas as suas views Blade para que elas não sejam compiladas sob demanda, melhorando o desempenho de cada requisição que retorna uma view.

## Modo de Debug

A opção de debug em seu arquivo de configuração `config/app.php` determina quanto de informação sobre um erro é realmente exibida ao usuário. Por padrão, esta opção é definida para respeitar o valor da variável de ambiente `APP_DEBUG`, que é armazenada no arquivo `.env` de sua aplicação.

::: danger
Em seu ambiente de produção, este valor deve sempre ser `false`. Se a variável `APP_DEBUG` estiver definida como `true` em produção, você corre o risco de expor valores de configuração sensíveis aos usuários finais.
:::

## A "Health Route"

O Laravel inclui uma rota de verificação de saúde integrada que pode ser usada para monitorar o status de sua aplicação. Em produção, esta rota pode ser usada para relatar o status de sua aplicação a um monitor de tempo de atividade, balanceador de carga ou sistema de orquestração, como o Kubernetes.

Por padrão, a rota de verificação de saúde é servida em `/up` e retornará uma resposta HTTP 200 se a aplicação tiver sido inicializada sem exceções. Caso contrário, uma resposta HTTP 500 será retornada. Você pode configurar o URI para esta rota em seu arquivo `bootstrap/app` da aplicação:

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up', // [!code --]
    health: '/status', // [!code ++]
)
```

Quando requisições HTTP são feitas para esta rota, o Laravel também despachará um evento `Illuminate\Foundation\Events\DiagnosingHealth`, permitindo que você realize verificações de saúde adicionais relevantes para sua aplicação. Dentro de um <a href="/conhecendo-mais/" target="_blank">listener</a> para este evento, você pode verificar o status do banco de dados ou cache de sua aplicação. Se você detectar um problema com sua aplicação, você pode simplesmente lançar uma exceção a partir do listener.

## Deploy fácil com Forge / Vapor

### Laravel Forge

Se você não estiver pronto para gerenciar sua própria configuração de servidor ou não estiver confortável configurando todos os vários serviços necessários para executar uma aplicação Laravel robusta, o <a href="https://forge.laravel.com" target="_blank">Laravel Forge</a> é uma alternativa maravilhosa.

O Laravel Forge pode criar servidores em vários provedores de infraestrutura, como DigitalOcean, Linode, AWS e mais. Além disso, o Forge instala e gerencia todas as ferramentas necessárias para construir aplicações Laravel robustas, como Nginx, MySQL, Redis, Memcached, Beanstalk e mais.

::: tip
Quer um guia completo para fazer deploy com o Laravel Forge? Confira o <a href="https://bootcamp.laravel.com/deploying" target="_blank">Laravel Bootcamp</a> e a série de vídeos do Forge <a href="https://laracasts.com/series/learn-laravel-forge-2022-edition" target="_blank">disponível no Laracasts</a>.
:::

### Laravel Vapor

Se você gostaria de uma plataforma de deploy totalmente serverless e autoescalável para o Laravel, confira o <a href="https://vapor.laravel.com" target="_blank">Laravel Vapor</a>. Laravel Vapor é uma plataforma de deploy serverless para Laravel, alimentada pela AWS. Lance sua infraestrutura Laravel no Vapor e se apaixone pela simplicidade escalável do serverless. Laravel Vapor é ajustado pelos criadores do Laravel para funcionar perfeitamente com o framework para que você possa continuar escrevendo suas aplicações Laravel exatamente como está acostumado.
