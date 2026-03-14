# My Tiny Café — Architecture & Stack

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | **Nuxt 3** (v3.17.1) — SSR désactivé, SPA uniquement |
| UI | **Nuxt UI v3** (Headless UI) + **Tailwind CSS v4** |
| Backend / BDD | **Appwrite Cloud** (fra.cloud.appwrite.io) — Auth, Database, Realtime |
| Notifications | **Firebase Cloud Messaging** (push notifications barista) |
| Déploiement | **Cloudflare Workers** (via Wrangler) + NuxtHub |
| PWA | `@vite-pwa/nuxt` — app installable, service worker |
| Package manager | **pnpm** |

## Architecture

```
app/
├── pages/
│   ├── index.vue              # Landing marketing
│   ├── login.vue              # Connexion barista
│   ├── signup.vue             # Inscription + création du café
│   └── [cafeId]/
│       ├── index.vue          # Menu client — commande
│       └── barista/
│           ├── index.vue      # Dashboard commandes (realtime)
│           ├── menu.vue       # CRUD items du menu
│           └── cafe.vue       # Paramètres café, QR code, partage
├── plugins/
│   ├── appwrite.ts            # Init SDK Appwrite (Account, Databases, Client)
│   └── firebase.ts            # Init Firebase (Messaging)
├── assets/css/main.css        # Thème coffee/latte (CSS variables)
└── app.vue                    # Root component
server/api/ping.ts             # Health check
appwrite.config.json           # Schéma BDD complet
```

## Base de données (Appwrite)

Database : `cafe`

### Collection `cafe`
- `name` (string), `logo` (string URL, non utilisé côté UI)
- Row-level security activée

### Collection `item`
- `name` (string, requis), `price` (string, optionnel), `description` (string, optionnel)
- `options` (string[]) — format custom : `"Size:small;medium;large"` ou `"Sugar:boolean"`
- `cafeId` (relation manyToOne → cafe)
- **Pas de champ image actuellement**

### Collection `order`
- `item` (relation → item), `options` (string[]), `status` (string: ordered/completed/canceled)
- `clientName` (string), `cafeId` (relation → cafe)
- Temps réel via Appwrite subscriptions (WebSocket)

## Patterns & conventions

- **State** : `ref()` / `reactive()` directement dans les composants (pas de store Pinia)
- **Appels BDD** : directs depuis les composants via `databases.createDocument()` / `listDocuments()`
- **Validation** : Zod pour les formulaires auth, validation custom ailleurs
- **Toasts** : `useToast()` de Nuxt UI
- **Temps réel** : `client.subscribe()` Appwrite (WebSocket)
- **LocalStorage** : `lastVisitedCafe`, `orders` (IDs), `clientName`
- **Thème** : couleurs `--color-coffee`, `--color-latte` etc.

## Rôles utilisateurs

- **Barista** (authentifié) : gère le menu, voit les commandes, configure le café
- **Client** (anonyme) : consulte le menu via `/:cafeId`, passe commande, peut annuler

## Images existantes

Dossier `images-cafe/` (non référencé dans le code) : `bobba.png`, `cafe.png`, `cookie.png`, `emporter.png`, `gaiwan.png`, `jus.png`, `latte.png`, `muffin.png`, `mug.png`, `tartine.png`, `the.png`, `yaourt.png`
