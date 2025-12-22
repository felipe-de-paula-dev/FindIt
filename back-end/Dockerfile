FROM node:18

WORKDIR /app

# 1. Instala o typescript globalmente no sistema do container
RUN npm install -g typescript

# 2. Copia os arquivos de dependência
COPY package*.json ./

# 3. Instala as dependências (agora limpas sem interferência do host)
RUN npm install

# 4. Copia o código fonte (respeitando o .dockerignore)
COPY . .

# 5. Compila usando o tsc global
RUN tsc

EXPOSE 3335

CMD ["node", "build/index.js"]