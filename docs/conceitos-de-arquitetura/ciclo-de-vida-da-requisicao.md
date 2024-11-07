# Ciclo de vida da Requisição

Esse projeto é um trabalho em andamento, e a documentação está sendo construída aos poucos. Se você deseja contribuir, fique à vontade para abrir uma issue ou um pull request.

## Introdução

Quando você usa qualquer ferramenta no "mundo real", você se sente mais confiante se entender como aquela ferramenta funciona. O desenvolvimento de aplicações não é diferente. Quando você entende como suas ferramentas de desenvolvimento funcionam, você se sente mais confortável e confiante em usá-las.

Essa página tem como objetivo fornecer uma boa visão geral de como o framework Laravel funciona. Ao conhecer melhor o framework como um todo, tudo parece menos "mágico" e você se sentirá mais confiante em construir suas aplicações. Se você não entender todos os termos imediatamente, não desanime! Apenas tente ter uma compreensão básica do que está acontecendo, e seu conhecimento crescerá à medida que você explorar outras seções da documentação.

## O Ciclo de Vida da Requisição

### Primeiros passos

O ponto de entrada para todas as requisições de uma aplicação Laravel é o arquivo `public/index.php`. Todas as requisições são direcionadas para este arquivo pela configuração do seu servidor web (Apache / Nginx). O arquivo `index.php` não contém muito código. Em vez disso, é um ponto de partida para carregar o restante do framework.

O arquivo `index.php` carrega a definição do autoloader gerado pelo Composer e, em seguida, recupera uma instância da aplicação Laravel de `bootstrap/app.php`. A primeira ação tomada pelo Laravel em si é criar uma instância da aplicação / <a href="/conceitos-de-arquitetura/service-container" target="_blank">Service Container</a>.

### Kernels HTTP / Console

Em seguida, a requisição recebida é enviada para o kernel HTTP ou para o kernel do console, usando os métodos `handleRequest` ou `handleCommand` da instância da aplicação, dependendo do tipo de requisição que entra na aplicação. Esses dois kernels servem como o local central por onde todas as requisições passam. Por enquanto, vamos nos concentrar no kernel HTTP, que é uma instância de `Illuminate\Foundation\Http\Kernel`.

O kernel HTTP define um array de `bootstrappers` que serão executados antes que a requisição seja executada. Esses bootstrappers configuram o tratamento de erros, configuram o logging, <a href="/primeiros-passos/configuracao#configuracao-de-ambiente" target="_blank">detectam o ambiente da aplicação</a> e realizam outras tarefas que precisam ser feitas antes que a requisição seja realmente tratada. Tipicamente, essas classes lidam com a configuração interna do Laravel que você não precisa se preocupar.

O kernel HTTP também é responsável por passar a requisição pela pilha de middleware da aplicação. Esses middlewares lidam com a leitura e escrita da <a href="/fundamentos/sessoes" target="_blank">sessão HTTP</a>, determinam se a aplicação está em modo de manutenção, <a href="/fundamentos/protecao-csrf" target="_blank">verificam o token CSRF</a>, e muito mais. Falaremos mais sobre isso em breve.

A assinatura do método `handle` do kernel HTTP é bastante simples: ele recebe uma `Request` e retorna uma `Response`. Pense no kernel como uma grande caixa preta que representa toda a sua aplicação. Alimente-o com requisições HTTP e ele retornará respostas HTTP.

### Service Providers

Uma das ações de inicialização de kernel mais importantes é carregar os <a href="/conceitos-de-arquitetura/service-providers" target="_blank">service providers</a> para a sua aplicação. Os service providers são responsáveis por inicializar todos os vários componentes do framework, como o banco de dados, fila, validação e componentes de roteamento.

O Laravel irá iterar por esta lista de providers e instanciar cada um deles. Após instanciar os providers, o método `register` será chamado em todos os providers. Em seguida, uma vez que todos os providers foram registrados, o método `boot` será chamado em cada provider. Isso é para que os service providers possam depender de todos os bindings do container sendo registrados e disponíveis no momento em que seu método `boot` é executado.

### Rotas

Uma vez que a aplicação foi inicializada e todos os service providers foram registrados, a `Request` será entregue ao roteador para envio. O roteador enviará a requisição para uma rota ou controller, e também executará qualquer middleware específico da rota.

Os middlewares fornecem um mecanismo conveniente para filtrar ou examinar as requisições HTTP que entram na sua aplicação. Por exemplo, o Laravel inclui um middleware que verifica se o usuário da sua aplicação está autenticado. Se o usuário não estiver autenticado, o middleware redirecionará o usuário para a tela de login. No entanto, se o usuário estiver autenticado, o middleware permitirá que a requisição prossiga mais adiante na aplicação. Alguns middlewares são atribuídos a todas as rotas dentro da aplicação, como `PreventRequestsDuringMaintenance`, enquanto outros são atribuídos apenas a rotas ou grupos de rotas específicos. Você pode aprender mais sobre middlewares lendo a documentação completa sobre <a href="/fundamentos/middleware" target="_blank">middlewares</a>.

Se a requisição passar por todos os middlewares atribuídos à rota, o método da rota ou do controlador será executado. Em seguida, a resposta será retornada pela mesma sequência de middlewares.

### Finalizando

Uma vez que a rota retornar uma resposta, a resposta viajará de volta através do middleware da rota, dando à aplicação a chance de modificar ou examinar a resposta de saída.

Finalmente, uma vez que a resposta viaja de volta através do middleware, o método `handle` do kernel HTTP retorna o objeto de resposta para o `handleRequest` da instância da aplicação, e este método chama o método `send` na resposta retornada. O método `send` envia o conteúdo da resposta para o navegador web do usuário. Agora, concluímos nossa jornada por todo o ciclo de vida da requisição do Laravel!

## Foco nos Service Providers

Os service providers são realmente a chave para inicializar uma aplicação Laravel. A instância da aplicação é criada, os service providers são registrados, e a requisição é entregue à aplicação inicializada. É realmente tão simples!

Ter um bom entendimento de como uma aplicação Laravel é construída e inicializada através de service providers é muito valioso. Os service providers definidos pelo usuário da aplicação são armazenados no diretório `app/Providers`.

Por padrão, o `AppServiceProvider` é bastante vazio. Este provider é um ótimo lugar para adicionar o bootstrapping da sua aplicação e os bindings do container de serviços. Para aplicações grandes, você pode desejar criar vários service providers, cada um com bootstrapping mais granular para serviços específicos usados pela sua aplicação.