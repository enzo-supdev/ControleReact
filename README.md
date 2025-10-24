# ControleReact
Enzo PACE, 24/10/2025

Une application React moderne pour la gestion des utilisateurs avec fonctionnalités avancées de recherche, tri et favoris.

## 🚀 Fonctionnalités

- **Liste des utilisateurs**
  - Affichage en grille avec cards stylisées
  - Pagination avancée
  - Recherche dynamique (nom, prénom, email)
  - Tri multiple (nom A-Z/Z-A, âge, favoris)
  - Gestion des favoris persistante (localStorage)
  - Skeleton loading pour UX optimale
  - Gestion des erreurs avec retry

- **Détails utilisateur**
  - Vue détaillée des informations
  - Sections organisées (personnel, contact, adresse, professionnel)
  - Navigation retour fluide

- **Thème dynamique**
  - Support des modes clair/sombre
  - Persistance des préférences
  - Transitions fluides

## 🛠️ Technologies utilisées

- React 19 avec TypeScript
- React Router v7 pour la navigation
- Vite comme bundler
- ESLint pour le linting
- CSS Modules pour le styling

## 📦 Installation

```bash
# Cloner le repository
git clone [url-du-repo]

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour la production
npm run build
```