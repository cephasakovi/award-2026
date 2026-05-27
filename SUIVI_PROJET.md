# Suivi Projet - Awards Universitaires 2026

Derniere mise a jour : 2026-05-03 17:00:00

## Objectif

Creer un site web premium de vote pour les Awards Universitaires avec ceremonie prevue le 13 Juin 2026.

## Stack cible

- Next.js 14
- TypeScript
- Tailwind CSS
- App Router
- SQLite avec Prisma
- NextAuth.js
- Framer Motion

## Assets integres

- Logo : `public/awards-logo.png`
- Trophee : `public/trophy.jpg`

## Travail realise

### 1. Projet cree

- Projet initialise dans `C:\Users\USER PC\Desktop\university-awards-2026`
- Scripts Next.js standards disponibles via `npm run dev`, `npm run build`, `npm run start`

### 2. Direction visuelle integree

- Intro cinematique plein ecran
- Theme sombre et luxueux
- Palette noir / or / ivoire
- Logo fourni integre
- Trophee fourni integre
- Spotlight dynamique au curseur
- Particules decoratives
- Compte a rebours jusqu'au 13 Juin 2026

### 3. Sections construites

- Intro d'entree dans la ceremonie
- Hero principal
- Section categories
- Section vote de demonstration
- Section resultats de demonstration
- Section admin de demonstration

### 4. Comportements deja presents

- Intro affichee une seule fois par session
- Navigation par ancres
- Selection de categorie de vote
- Un seul vote de demonstration par categorie cote interface
- Build de production valide
- Serveur local teste avec succes sur `http://localhost:3000`

### 5. Base backend preparee

- Fichier Prisma cree : `prisma/schema.prisma`
- Modele initial prepare pour :
  - `User`
  - `Category`
  - `Nominee`
  - `Vote`
- Fichier `.env.example` ajoute

### 6. Lancement rapide

- Lanceur projet : `Lancer Awards 2026.cmd`
- Lanceur Bureau : `C:\Users\USER PC\Desktop\Awards Universitaires 2026.cmd`

### 7. Correctif lanceur

- Le lanceur Bureau a ete corrige
- Cause du probleme : il essayait de lancer `npm run dev` depuis le Bureau au lieu du dossier du projet
- Resultat : `localhost:3000` refusait la connexion car le serveur Next.js n'etait pas demarre

### 8. Correctif hydration Next.js

- L'erreur `Text content does not match server-rendered HTML` a ete corrigee
- Cause probable : le compte a rebours utilisait l'heure courante pendant le rendu initial
- Correction : valeur initiale stable cote serveur, puis recalcul cote navigateur apres montage

### 9. Correctif scroll + assets transparents

- L'intro ne bloque plus indefiniment la navigation
- Entree possible par clic, scroll, toucher, touche clavier ou fermeture automatique
- Le logo est maintenant branche via une version detouree
- Le trophee est maintenant branche via une version PNG transparente
- Un script utilitaire de detourage a ete ajoute : `scripts/remove-background.mjs`

### 10. Lancement stable Windows

- Le lancement en `next dev` a ete remplace par un mode stable de production
- Nouveau script de lancement : `scripts/start-stable.ps1`
- Nouveau script serveur : `scripts/serve-production.ps1`
- Nouveau script d'arret : `scripts/stop-stable.ps1`
- Nouveau bouton Bureau pour arreter le site : `Arreter Awards Universitaires 2026.cmd`
- Le lanceur Bureau utilise maintenant `next start` apres build, ce qui est plus stable que le mode developpement
## Travail realise

### 1. Projet cree
...
### 12. Refonte visuelle et nouveaux composants

- Integration d'un **Hero Shader WebGL** anime pour l'intro et le hero principal.
- Ajout de **Glowing Shadows** pour les cartes de nomines, renforcant l'aspect premium.
- Integration d'une section **Animated CTA** avec lignes de fond dynamiques et grille.
- Mise en place de la structure **shadcn/ui** dans `src/components/ui`.
- Installation des dependances Radix UI et Lucide React.
- Refonte de `src/app/page.tsx` pour orchestrer ces nouveaux elements.

### 13. Nouvelle Intro Cinematique Video

- Integration de la video `La Parisienne (1).mp4` comme fond d'entree.
- Creation du composant `src/components/ui/intro-cinematic.tsx`.
- Animation de texte premium avec Framer Motion (Bienvenue, Awards 2026).
- Systeme de session pour n'afficher l'intro qu'une seule fois.
- Transition fluide (fade out) vers le contenu principal au clic.

### 14. Preparation de l'hebergement (Vercel)

- Installation de **Vercel CLI** globalement.
- Migration de la configuration Prisma de **SQLite** vers **PostgreSQL** (compatible Vercel Postgres).
- Installation des dependances : `@prisma/client`, `@vercel/postgres`, `next-auth`.
- Initialisation de **Git** localement.
- Mise a jour du `.gitignore` et `.env.example`.

### 15. Refonte interactive du système de vote

- Mise en place d'un flux de navigation à deux niveaux : **Grille de Catégories** puis **Grille de Nominés**.
- Création du composant `src/components/ui/interactive-voting.tsx`.
- Utilisation de `AnimatePresence` et `motion` pour des transitions fluides entre les vues.
- Intégration de `GlowingShadow` pour les cartes de catégories.
- Ajout d'une navigation de retour ("Retour aux catégories").
- Affichage de l'état du vote (Voté ✓) directement sur les cartes de catégories.

## Fichiers principaux
...
- `public/intro-video.mp4` (Video source)

## Prochaines etapes (Hebergement)

1. Creer un depot sur **GitHub** et lier le projet.
2. Lancer `vercel` dans le terminal pour lier le projet a Vercel.
3. Activer **Vercel Postgres** dans le dashboard Vercel.
4. Lancer `npx prisma db push` pour creer les tables en ligne.

- `src/components/ui/intro-cinematic.tsx`
- `src/components/ui/animated-shader-hero.tsx`
- `src/components/ui/glowing-shadow.tsx`
- `src/components/ui/animated-background-lines.tsx`
- `src/lib/utils.ts`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `prisma/schema.prisma`
- `.env.example`
- `public/intro-video.mp4` (Video source)
Le front principal de demonstration est en place et fonctionne.

Ce qui est reellement fait :

- design principal Next.js
- assets branches
- build propre
- lancement local valide

Ce qui reste a faire :

- installation et branchement complet de Prisma
- creation de la base SQLite
- seed des categories et des nomines
- authentification NextAuth email/mot de passe
- vraies routes `/login`, `/vote`, `/results`, `/admin`
- protection des pages connectees/admin
- persistance reelle des votes
- export CSV
- dashboard admin fonctionnel

## Regle de mise a jour

Ce fichier doit etre mis a jour apres chaque intervention importante pour resumer :

- ce qui a ete fait
- ce qui a change
- ce qui reste a faire
- les fichiers importants ajoutes ou modifies

### Mise a jour du 2026-05-23

- Ajout d'une page admin serveur sur `/admin`.
- Ajout d'un formulaire pour creer des categories.
- Ajout d'un formulaire pour creer des nomines avec photo uploadée.
- Les photos sont enregistrees localement dans `public/uploads/nominees`.
- Ajout de l'action serveur `src/lib/actions/admin.ts`.
- La page admin liste aussi les categories et les nomines existants.

### Mise a jour du 2026-05-23 - Etat actuel

- La page d'accueil lit maintenant les categories et les nomines depuis Prisma.
- Ajout de la page publique `/results` pour afficher les resultats reels.
- Ajout de la page `/register` pour creer un compte utilisateur.
- La connexion fonctionne via NextAuth pour les roles `STUDENT` et `ADMIN`.
- La page admin permet de creer, modifier et supprimer des categories.
- La page admin permet de creer, modifier et supprimer des nomines.
- Les uploads de photos de nomines sont pris en charge.
- Le projet tourne en SQLite local avec `DATABASE_URL="file:./dev.db"`.
- Le seed recrée les comptes de test et les donnees de depart.
- Le bouton admin n'a pas ete ajoute a la page d'accueil, comme demande.
