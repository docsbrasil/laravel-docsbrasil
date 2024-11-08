# Proteção CSRF

## Introdução

Cross-site request forgeries são um tipo de exploração maliciosa em que comandos não autorizados são executados em nome de um usuário autenticado. Felizmente, o Laravel facilita a proteção de sua aplicação <a href="https://en.wikipedia.org/wiki/Cross-site_request_forgery" target="_blank">contra ataques de falsificação de solicitação entre sites</a> (CSRF).

#### Uma explicação da vulnerabilidade

Caso você não esteja familiarizado com as falsificações de solicitação entre sites, vamos discutir um exemplo de como essa vulnerabilidade pode ser explorada. Imagine que sua aplicação tenha uma rota `/user/email` que aceita uma solicitação `POST` para alterar o endereço de e-mail do usuário autenticado. Provavelmente, essa rota espera que um campo de entrada `email` contenha o endereço de e-mail que o usuário gostaria de começar a usar.

Sem proteção CSRF, um site malicioso poderia criar um formulário HTML que aponta para a rota `/user/email` de sua aplicação e envia o endereço de e-mail do usuário malicioso:

```html
<form action="https://sua-aplicacao.com/user/email" method="POST">
    <input type="email" value="email-malicioso@example.com">
</form>
 
<script>
    document.forms[0].submit();
</script>
```

Se o site malicioso enviar automaticamente o formulário quando a página for carregada, o usuário malicioso só precisa atrair um usuário desavisado de sua aplicação para visitar seu site e seu endereço de e-mail será alterado em sua aplicação.

Para prevenir essa vulnerabilidade, precisamos inspecionar cada request `POST`, `PUT`, `PATCH` ou `DELETE` recebida em busca de um valor de sessão secreto que a aplicação maliciosa não pode acessar.

## Prevenindo solicitações CSRF

O Laravel gera automaticamente um "token" CSRF para cada <a href="/fundamentos/sessoes" target="_blank">sessão de usuário</a> ativa. Esse token é utilizado para verificar se o usuário autenticado é a pessoa que realmente está fazendo as solicitações à aplicação. Como esse token é armazenado na sessão do usuário e muda toda vez que a sessão é renovada, uma aplicação maliciosa não pode acessá-lo.

O token CSRF da sessão atual pode ser acessado via sessão do objeto `request` ou via função helper `csrf_token`:

```php
use Illuminate\Http\Request;
 
Route::get('/token', function (Request $request) {
    $token = $request->session()->token();
 
    $token = csrf_token();
 
    // ...
});
```

<span class="highlight">Toda vez</span> que você definir um formulário HTML "POST", "PUT", "PATCH" ou "DELETE" em sua aplicação, você deve incluir um input CSRF oculto `_token` no formulário para que o middleware de proteção CSRF possa validar a solicitação. Para conveniência, você pode usar a diretiva Blade `@csrf` para gerar o input de entrada de token oculto:

```blade
<form method="POST" action="/profile">
    @csrf
 
    <!-- Equivalente a... -->
    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
</form>
```

O `Illuminate\Foundation\Http\Middleware\ValidateCsrfToken` <a href="/fundamentos/middleware" target="_blank">middleware</a>, que é incluído no grupo de middlewares `web` por padrão, verificará automaticamente se o token na entrada da requisição corresponde ao token armazenado na sessão. Quando esses dois tokens correspondem, sabemos que o usuário autenticado é quem está iniciando a solicitação.

### CSRF Tokens e SPAs

Se você está construindo uma SPA que está utilizando o Laravel como um backend de API, você deve consultar a documentação do <a href="/pacotes/sanctum" target="_blank">Laravel Sanctum</a> para obter informações sobre autenticação com sua API e proteção contra vulnerabilidades CSRF.

### Excluindo URIs da proteção CSRF

Às vezes, você pode desejar excluir um conjunto de URIs da proteção CSRF. Por exemplo, se você estiver usando o <a href="https://stripe.com" target="_blank">Stripe</a> para processar pagamentos e estiver utilizando seu sistema de webhook, você precisará excluir seu endpoint de webhook do Stripe da proteção CSRF, pois o Stripe não saberá qual token CSRF enviar para suas rotas.

Normalmente, você deve colocar esses tipos de rotas fora do grupo de middlewares `web` que o Laravel aplica a todas as rotas no arquivo `routes/web.php`. No entanto, você também pode excluir rotas específicas fornecendo suas URIs para o método `validateCsrfTokens` no arquivo `bootstrap/app.php` de sua aplicação:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
        'stripe/*',
        'http://example.com/foo/bar',
        'http://example.com/foo/*',
    ]);
})
```

::: tip
Para facilitar, o middleware CSRF é automaticamente desativado para todas as rotas ao <a href="/testes/introducao" target="_blank">executar testes</a>.
:::

## X-CSRF-TOKEN

Além de verificar o token CSRF como um parâmetro POST, o middleware `Illuminate\Foundation\Http\Middleware\ValidateCsrfToken`, que é incluído no grupo de middlewares `web` por padrão, também verificará o cabeçalho de solicitação `X-CSRF-TOKEN`. Você poderia, por exemplo, armazenar o token em uma tag `meta` HTML:

```blade
<meta name="csrf-token" content="{{ csrf_token() }}">
```

Em seguida, você pode instruir uma biblioteca como o jQuery a adicionar automaticamente o token a todos os cabeçalhos de solicitação. Isso fornece proteção CSRF simples e conveniente para suas aplicações baseadas em AJAX usando tecnologia JavaScript legada:

```js
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
```

## X-XSRF-TOKEN

O Laravel armazena o token CSRF atual em um cookie criptografado `XSRF-TOKEN` que é incluído em cada resposta gerada pelo framework. Você pode usar o valor do cookie para definir o cabeçalho de solicitação `X-XSRF-TOKEN`.

Este cookie é enviado principalmente como uma conveniência para o desenvolvedor, pois alguns frameworks e bibliotecas JavaScript, como Angular e Axios, automaticamente colocam seu valor no cabeçalho `X-XSRF-TOKEN` em solicitações de mesma origem.

::: tip
Por padrão, o arquivo `resources/js/bootstrap.js` inclui a biblioteca HTTP Axios, que enviará automaticamente o cabeçalho `X-XSRF-TOKEN` para você.
:::