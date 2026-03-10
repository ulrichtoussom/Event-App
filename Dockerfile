# ----- ÉTAPE 1 : Installation des dépendances -----

FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install 

# ----- ÉTAPE 2 : Construction de l'application -----

FROM node:20-alpine AS builder
WORKDIR /app

# On déclare les variables attendues pendant le build
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# On les transforme en variables d'environnement pour le processus 'npm run build'
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . . 
# On désactive la télémétrie Next.js pendant le build
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ----- ÉTAPE 3 : Exécution (Image finale légère) -----

FROM node:20-alpine AS runner 
WORKDIR /app

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
# le mode standalone dans de notre fichier de configuration next nous contraint a copier les  /app/.next/standalone et /app/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs

EXPOSE 3000

# AJOUTE CECI pour garantir que l'app accepte les connexions de Render
ENV HOSTNAME "0.0.0.0"

ENV PORT 3000

# On lance le serveur via le fichier généré par le mode standalone
CMD ["node", "server.js"]