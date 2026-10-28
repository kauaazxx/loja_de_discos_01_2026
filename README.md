# 🎵 Loja de Discos

Sistema de gerenciamento de uma loja de discos, desenvolvido como projeto acadêmico. O sistema tem como objetivo organizar o cadastro de discos, controlar o estoque, registrar movimentações e permitir o acesso de usuários por meio de login.

## 📌 Sobre o Projeto

O **Loja de Discos** é um sistema que busca facilitar o gerenciamento de uma loja de discos, reunindo informações dos produtos e suas movimentações em um banco de dados MySQL.

O projeto possui um backend desenvolvido com Node.js e Express, conectado ao banco de dados MySQL utilizando o XAMPP. A API disponibiliza rotas para autenticação, gerenciamento de discos e movimentações de estoque.

## 🎯 Objetivos

- Organizar o cadastro de discos.
- Armazenar informações sobre títulos, artistas e gêneros musicais.
- Controlar preços de custo e venda.
- Acompanhar a quantidade de discos disponíveis em estoque.
- Definir uma quantidade mínima de estoque.
- Registrar entradas e saídas de produtos.
- Permitir a autenticação de usuários.
- Centralizar os dados em um banco de dados relacional.

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| HTML, CSS e JavaScript | Desenvolvimento da interface web |
| Node.js | Execução do backend |
| Express.js | Criação do servidor e das rotas da API |
| MySQL | Armazenamento dos dados |
| XAMPP | Ambiente local para executar o MySQL |
| mysql2 | Conexão entre Node.js e MySQL |
| dotenv | Configuração das variáveis de ambiente |
| CORS | Permissão de comunicação entre origens |
| Insomnia | Testes das requisições HTTP |
| Visual Studio Code | Ambiente de desenvolvimento |

## 📁 Estrutura do Projeto

A organização principal do projeto está dividida entre backend e frontend.

```text
loja_de_discos_01_2026/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── discoController.js
│   │   └── movController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── discoRoutes.js
│   │   └── movRoutes.js
│   ├── .env
│   ├── app.js
│   └── package.json
├── frontend/
├── node_modules/
├── package-lock.json
├── package.json
└── README.md
```

**Observação:** a pasta `node_modules` contém as dependências instaladas pelo npm. Ela não precisa ser enviada ao GitHub, pois pode ser recriada com `npm install`.

## 🗄️ Banco de Dados

O banco de dados utilizado pelo projeto é o **`loja_discos_db`**, criado e administrado localmente pelo MySQL do XAMPP.

O banco contém três tabelas principais:

### 1. USUARIO

Armazena as informações dos usuários que podem acessar o sistema.

- `id_usuario`: identificador do usuário.
- `nome`: nome do usuário.
- `email`: endereço de e-mail.
- `senha`: senha utilizada na autenticação.

### 2. DISCO

Armazena os dados dos discos cadastrados.

- `id_disco`: identificador do disco.
- `titulo`: título do disco.
- `artista`: nome do artista ou grupo musical.
- `genero`: gênero musical.
- `preco_custo`: valor de custo.
- `preco_venda`: valor de venda.
- `quantidade_estoque`: quantidade disponível.
- `estoque_minimo`: quantidade mínima definida para controle.

### 3. MOVIMENTACAO_ESTOQUE

Registra as movimentações de estoque dos discos.

- `id_movimentacao`: identificador da movimentação.
- `id_disco`: disco relacionado à movimentação.
- `id_usuario`: usuário responsável.
- `tipo_movimentacao`: tipo da operação, como reposição ou venda.
- `quantidade`: quantidade movimentada.
- `data_movimentacao`: data da operação.
- `observacao`: informação adicional sobre a movimentação.

As tabelas utilizam identificadores e relacionamentos para associar os discos e os usuários às movimentações realizadas.

## ⚙️ Funcionalidades do Backend

### Autenticação

- Recebimento de e-mail e senha.
- Consulta dos dados do usuário no banco.
- Retorno dos dados do usuário quando a autenticação é aceita.
- Retorno de erro quando as credenciais são inválidas.

### Gerenciamento de discos

- Listagem dos discos cadastrados.
- Busca de discos por termo.
- Cadastro de novos discos.
- Atualização das informações de um disco.
- Exclusão de discos.

### Controle de estoque

- Registro de entradas e saídas.
- Associação da movimentação a um disco e a um usuário.
- Atualização da quantidade disponível no estoque.
- Registro da quantidade, data e observação da movimentação.

## 🔌 Rotas da API

O backend utiliza rotas HTTP para disponibilizar suas funcionalidades.

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Verifica se a API está funcionando |
| POST | `/api/login` | Realiza o login |
| GET | `/api/discos` | Lista os discos |
| GET | `/api/discos/busca?termo=rock` | Busca discos por termo |
| POST | `/api/discos` | Cadastra um disco |
| PUT | `/api/discos/:id` | Atualiza um disco |
| DELETE | `/api/discos/:id` | Exclui um disco |
| POST | `/api/movimentacoes` | Registra uma movimentação de estoque |

As rotas são implementadas nos arquivos da pasta `routes/`, enquanto a lógica das operações fica na pasta `controllers/`.

## 💻 Como Executar o Projeto

### Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- [Node.js](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Insomnia](https://insomnia.rest/), para testar a API.

### 1. Clonar ou baixar o projeto

Caso o projeto esteja publicado no GitHub, utilize:

```bash
git clone URL_DO_REPOSITORIO
```

Depois, abra a pasta do projeto no Visual Studio Code.

Substitua `URL_DO_REPOSITORIO` pelo endereço real do repositório.

### 2. Iniciar o MySQL

1. Abra o XAMPP Control Panel.
2. Inicie o serviço **MySQL**.
3. Acesse o phpMyAdmin pelo navegador:

   http://localhost/phpmyadmin

4. Localize o banco `loja_discos_db`.
5. Confira se as tabelas e os registros estão presentes.

O banco precisa estar criado antes de iniciar a aplicação.

### 3. Instalar as dependências

Abra o terminal do VS Code e entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Se necessário, as dependências principais podem ser instaladas com:

```bash
npm install express cors mysql2 dotenv
```

### 4. Configurar a conexão com o banco

No arquivo `backend/.env`, configure os dados de conexão:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=loja_discos_db
PORT=3000
```

Essa configuração considera um MySQL local com usuário `root` sem senha. Caso o seu MySQL utilize outra senha ou usuário, ajuste os valores conforme sua instalação.

### 5. Iniciar o servidor

Certifique-se de que o terminal está dentro da pasta `backend` e execute:

```bash
node app.js
```

Quando a conexão e a inicialização forem bem-sucedidas, o terminal deverá apresentar mensagens indicando que o banco foi conectado e que o servidor está rodando na porta 3000.

### 6. Acessar a API

Abra o navegador e acesse:

http://localhost:3000/

A rota inicial deverá retornar uma mensagem em JSON informando que a API está funcionando.

## 🧪 Testes com Insomnia

O Insomnia pode ser utilizado para enviar requisições à API e verificar as respostas do servidor.

### Exemplo: listar discos

- Método: `GET`
- URL: `http://localhost:3000/api/discos`

A resposta deverá apresentar os discos cadastrados, caso existam registros na tabela `DISCO`.

### Exemplo: cadastrar um disco

- Método: `POST`
- URL: `http://localhost:3000/api/discos`
- Body: JSON

```json
{
  "titulo": "Nevermind",
  "artista": "Nirvana",
  "genero": "Rock",
  "preco_custo": 75.00,
  "preco_venda": 120.00,
  "quantidade_estoque": 5,
  "estoque_minimo": 2
}
```

### Exemplo: realizar login

- Método: `POST`
- URL: `http://localhost:3000/api/login`
- Body: JSON

```json
{
  "email": "admin@lojadiscos.com",
  "senha": "123456"
}
```

Esse exemplo depende da existência desse usuário no banco de dados e da senha cadastrada correspondente.

### Exemplo: registrar uma movimentação

- Método: `POST`
- URL: `http://localhost:3000/api/movimentacoes`
- Body: JSON

```json
{
  "id_disco": 1,
  "id_usuario": 1,
  "tipo_movimentacao": "REPOSICAO",
  "quantidade": 5,
  "data_movimentacao": "2026-10-28",
  "observacao": "Reposição de estoque"
}
```

Utilize identificadores de discos e usuários existentes no banco. Os valores aceitos para `tipo_movimentacao` devem corresponder aos definidos no banco de dados.

Os exemplos demonstram como enviar requisições; cada operação deve ser testada para confirmar seu funcionamento no ambiente local.

## 🔐 Cuidados com a Segurança

- Não publique o arquivo `.env` com credenciais reais.
- Utilize um arquivo `.gitignore` para excluir dependências e configurações privadas.
- Em uma aplicação de produção, as senhas devem ser armazenadas com hash seguro, como bcrypt ou Argon2, e nunca em texto puro.
- Valide os dados recebidos nas requisições.
- Verifique se as operações de estoque são realizadas corretamente antes de atualizar os registros.

## 👨‍💻 Autor

**Vinicius Godoi e Kauã Lucio**
