FROM node:18-alpine

WORKDIR /app

# Installer pnpm
RUN npm install -g pnpm@10.4.1

# Copier les fichiers package.json du backend
COPY package.json ./

# Installer les dépendances sans vérifier le lockfile
RUN pnpm install --no-frozen-lockfile

# Copier le reste du code du backend
COPY . .

# Compiler l'application
RUN pnpm run build

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "dist/server.js"]