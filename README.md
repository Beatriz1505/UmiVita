z<div align="center">
  <img src="frontend/src/assets/logoarassp.png" alt="UmiVita Logo" width="200px">
</div>

# UmiVita – Análise de Risco Ambiental com Sensoriamento de Solo Portuário

> Sistema de monitoramento ambiental com sensores físicos e interface web para análise de risco em áreas portuárias.

---

## 🌍 Visão Geral do Projeto

O **UmiVita** é uma solução que utiliza sensores de umidade e temperatura do solo, conectados a um microcontrolador ESP32, para identificar e alertar sobre riscos ambientais em áreas portuárias. Os dados são processados por um backend em Node.js, armazenados em um banco de dados MySQL e exibidos em uma interface web responsiva e acessível, com mapas, histórico e alertas.

---

## ⚙️ Funcionalidades Principais

- Coleta de dados de sensores de solo (umidade e temperatura)
- Alertas por LED para valores críticos
- Envio automático de dados via Wi-Fi para o backend
- Interface web com:
  - Painel de dados em tempo real
  - Histórico ambiental
  - Alertas visuais
  - Mapa da área monitorada
- Deploy da aplicação para acesso por dispositivos móveis ou desktop

---

## 📁 Estrutura do Projeto

```

📦 ARASSP/
┣ 📂 backend/ → API REST com Node.js e MySQL
┣ 📂 frontend/ → Interface Web (HTML, CSS, JavaScript)
┣ 📂 esp32/ → Código para sensores (Arduino IDE / C++)
┣ 📂 assets/ → Imagens, logos e ícones
┗ 📄 README.md → Documentação principal

```

---

## ▶️ Como Executar o Projeto

> Certifique-se de ter: **Node.js**, **MySQL**, **ESP32 configurado** e **extensão Live Server no VSCode**.

### 🔌 1. Clonar o repositório

```bash
git clone https://github.com/joaoxaviersilva/UmiVita.git
cd 
```

### 2. Configure o Banco de Dados

- Crie um banco no MySQL Shell com o nome `arassp_db`

```

CREATE DATABASE arassp_db;
CREATE USER 'arassp_user'@'localhost' IDENTIFIED BY 'Arassp@2025';
GRANT ALL PRIVILEGES ON arassp_db.* TO 'arassp_user'@'localhost';
FLUSH PRIVILEGES;

```

- Configure o `.env` no backend com suas credenciais:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=arassp_user
DB_PASSWORD=Arassp@2025
DB_NAME=arassp_db

```

- Configure o `.env` no frontend com suas credenciais:

```env
CREDENCIAL EM DESENVOLVIMENTO

```


### 3. Instale as dependências

#### Raiz
```bash
cd backend
npm install
```

### 4. Rodar o servidor backend

```bash
node index.js
```

### 5. Executar o frontend

```bash
Abra o arquivo index.html da pasta frontend/ com o Live Server ou hospede com Vercel/Netlify.
```

---

## 🚀 Stack de Tecnologias

### 🛠️ Backend

<br>


![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) – Escolhido pela sua simplicidade e flexibilidade na criação de APIs RESTful com Node.js.

![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white) – Utilizado por sua robustez, ampla adoção e fácil modelagem de dados relacionais.

![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black) – Escolhido para manter variáveis sensíveis fora do código, facilitando a configuração de ambientes.

![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) – Preferido por seu suporte a interceptadores e facilidade de lidar com requisições assíncronas.

![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) – Integrado ao projeto para garantir documentação automática e facilitar testes e integração de rotas.

<br>

### 🎨 Frontend

<br>

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) – Base da web moderna, essencial para criar interfaces dinâmicas e interativas.

Escudo HTML

Escudo CSS

<br>

### 🔋 IoT
- ESP32
- DHT11 / DHT22
- Sensor de umidade do solo capacitivo
- LEDs indicativos
- Arduino IDE ou PlatformIO

---

## 🔗 Estrutura de Comunicação com API REST

```
A API REST é o meio de comunicação entre as partes do sistema:

📡 ESP32 → envia dados de sensores (temperatura, umidade e proximidade)
🌐 API (Node.js/Express) → recebe, salva e fornece os dados
🖥️ Interface Web → exibe dados, gráficos e alertas ao usuário

```

---

## 👨‍💻 Contribuidores

<div align="center">

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/sofismoura">
        <img src="https://avatars.githubusercontent.com/u/166918518?s=400&u=76c54fc8d9ef41bfda8dcfada372d9fba0ee8954&v=4" width="100px;" alt="Sofia"/><br />
        <b>Sofia</b><br />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/joaoxaviersilva">
        <img src="https://avatars.githubusercontent.com/u/166918086?v=4" width="100px;" alt="João"/><br />
        <b>João</b><br />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Bellatrizx">
        <img src="https://avatars.githubusercontent.com/u/166918360?v=4" width="100px;" alt="Beatriz"/><br />
        <b>Beatriz</b><br />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/AnaLivia19">
        <img src="https://avatars.githubusercontent.com/u/173201929?v=4" width="100px;" alt="Ana Lívia"/><br />
        <b>Ana Lívia</b><br />
      </a>
    </td>
  </tr>
</table>
</div>


---

## 🏫 ETEC Zona Leste

Projeto desenvolvido por alunos da **ETEC Zona Leste** como parte da conclusão do curso técnico. O **UmiVita** representa a aplicação prática de conhecimentos em **IoT**, **desenvolvimento web** e **sustentabilidade ambiental**.

---

## ⭐ Apoie o Projeto

Se este projeto te inspirou ou foi útil, deixe uma ⭐ estrela no repositório para mostrar seu apoio!
Sugestões, feedbacks e melhorias são sempre bem-vindos!

---

<div align="center">
  <img src="frontend/src/assets/logo-UmiVita.png" alt="UmiVitalogoicone" width="75px" />
</div>
