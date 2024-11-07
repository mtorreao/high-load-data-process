# Projeto de processamento em lote de transações
Este projeto implementa um sistema de processamento em lote de transações blockchain, utilizando uma arquitetura de processamento paralelo para otimizar a performance.

### Principais características:

- Processamento paralelo utilizando múltiplos workers (child processes)
- Leitura e escrita em lotes para otimizar operações de banco de dados
- Sistema de filas para distribuição balanceada de carga entre os workers
- Monitoramento de progresso e métricas de performance
- Suporte a diferentes redes blockchain
- Persistência dos dados utilizando PostgreSQL via Prisma ORM

### Arquitetura:

- Service principal que coordena o processamento (`ProcessService`)
- Workers independentes para processamento paralelo (`WorkService`) 
- Tarefas isoladas em processos filhos para melhor utilização dos recursos
- Schemas Prisma separados para dados fonte e destino
- Sistema de eventos para comunicação entre componentes

### Performance:

- Processamento em lotes de 10.000 registros
- Execução paralela em 10 workers simultâneos
- Balanceamento automático de carga entre os workers
- Monitoramento de tempo de execução e quantidade de registros processados

### Endpoints:

- `GET /process` - Inicia o processamento
- `GET /process/reset` - Reseta o estado do processamento

### Instalação:

- `npm install`
- `sh ./scripts/setup.sh` - Instala as dependências e configura o ambiente
- `npm run prisma:seed:base` - Popula o banco de dados com os dados de exemplo

### Execução:

- `npm run start:dev` - Inicia o servidor de desenvolvimento

### Testes:

- `curl http://localhost:3000/process` - Inicia o processamento
- `curl http://localhost:3000/process/reset` - Reseta o estado do processamento

