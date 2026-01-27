# 🌦️ ClimaHorizon

O **ClimaHorizon** é um aplicativo simples de clima que permite consultar o **tempo atual de qualquer cidade**.  
O usuário digita o nome da cidade e o app retorna informações como **temperatura**, **velocidade do vento** e uma **descrição das condições climáticas**, de forma clara e amigável.

📌 Projeto desenvolvido para fins de estudo no bootcamp **Generation Brasil — 2026**, utilizando a **API Open-Meteo** com apoio de **IA** durante o processo de aprendizagem.

---

## ✨ Funcionalidades

✅ Buscar o clima atual digitando o nome de uma cidade  
✅ Exibir:
- Temperatura (°C)
- Velocidade do vento (km/h)
- Condição climática em texto (ex: “Céu limpo”, “Nublado”)

✅ Suporte para visualizar o clima de **várias cidades**  
✅ Tratamento de erros com mensagens amigáveis quando:
- cidade não é encontrada
- a API falha
- não há conexão

---

## 🧠 Como funciona

1. O usuário informa uma cidade no campo de busca
2. O app consulta a **API de Geocodificação da Open-Meteo** para obter latitude e longitude
3. Com as coordenadas, consulta a **API de Previsão do Tempo da Open-Meteo**
4. Os dados são exibidos na interface

---

## 🛠️ Tecnologias utilizadas

- **React**
- **TypeScript**
- **Open-Meteo API**
- **CSS/Tailwind CSS** (dependendo do que foi utilizado no projeto)
- **Vitest** (testes)

---
## ✅ Como usei IA no projeto

- **Organizar a lógica do app (geocodificação → previsão do tempo)**
- **Sugerir melhorias e refatorações de código**
- **Auxiliar no tratamento de erros**
- **Apoiar na escrita de comentários/documentação**
- **Ajudar na construção e estruturação de testes** 

📌 Todas as sugestões foram revisadas e aplicadas apenas quando compreendidas, mantendo o foco no aprendizado.

---
## ✅ Testes

O projeto inclui testes automatizados para validar funcionalidades essenciais do app.

### 1) Clonar o repositório
``` bash 
git clone https://github.com/seu-usuario/seu-repo.git 
```

### 2) Entrar na pasta do projeto
``` bash 
cd clima-horizon
```

### 3) Instalar dependências
``` bash 
npm install
```

### 4) Executar o projeto
```bash
npm run test
```
---
### Aprendizados 📚

Com esse projeto, pratiquei:

* consumo de APIs REST
* requisições assíncronas
* controle de estados (loading / success / error)
* tratamento de erros de forma elegante
* organização de componentes e services
* testes básicos para validação do funcionamento
---