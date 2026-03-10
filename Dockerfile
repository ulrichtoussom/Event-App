# ----- ÉTAPE 1 : Installation des dépendances -----

FROM node:20-alphine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install 

# ----- ÉTAPE 2 : Construction de l'application -----

FROM node:20-alphine AS build 
WORKDIR app/ 
COPY --from=deps /app/node_modules ./node_modules
COPY . . 
# On désactive la télémétrie Next.js pendant le build
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ----- ÉTAPE 3 : Exécution (Image finale légère) -----

FROM node:20-alphine AS runner 
WORKDIR app/

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# On crée un utilisateur non-root pour la sécurité (Standard pro)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# On copie uniquement ce qui est nécessaire
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "start"]