
# EasyRent

EasyRent est une application web permettant une gestion simplifiée et centralisée de parcs immobiliers, de locataires, de structures juridiques (ex : SCI), de documents, et des interactions entre différents utilisateurs (collaborateurs, propriétaires, gestionnaires). L’application vise à offrir une solution complète, fluide, ergonomique et sécurisée pour l'administration d’un patrimoine immobilier.

## Technologies Utilisées

- **Next.js (sans TypeScript)** : Framework React pour une application hybride (SSR, SSG) flexible et performante.
- **Prisma** : ORM moderne facilitant les opérations CRUD et la maintenance du schéma de base de données.
- **Auth.js** (anciennement NextAuth) : Authentification simplifiée, gestion des connexions avec Google.
- **shadcn/ui** : Librairie de composants UI cohérente, basée sur Tailwind, pour une interface claire et personnalisable.

## Fonctionnalités Clés

1. **Authentification & Gestion des Utilisateurs**  
   - **Connexion via Google** : Accès rapide sans gestion complexe des mots de passe.  
   - **Rôles & Permissions** : Définir qui peut créer/éditer/supprimer les SCI, logements, documents, locataires.  
   - **Partage de Ressources** : Inviter d’autres utilisateurs (via leur compte Google) à accéder à certaines ressources (SCI, logements, documents) avec des permissions adaptées (lecture seule, édition, administration).

2. **Gestion des Structures Juridiques (SCI, etc.)**  
   **Attributs possibles pour une SCI** :  
   - Informations générales : Nom de la SCI, adresse du siège social, SIREN/SIRET, date de création, capital social, associés (avec pourcentages de détention), contact principal (email, téléphone).  
   - Documents liés : Statuts, acte de création, documents comptables (bilans, comptes de résultat), PV d’assemblées générales.  
   - Logements associés : Liste des biens immobiliers possédés par la SCI.  
   
   **Fonctionnalités** :  
   - Création, édition et suppression de SCI.  
   - Association/dissociation de logements à une SCI.  
   - Ajout/gestion de documents légaux et comptables liés à la SCI.  
   - Historique des modifications (ajout d’un associé, changement de siège, etc.).

3. **Gestion des Biens Immobiliers**  
   **Attributs possibles pour un logement** :  
   - Informations générales : Adresse, type de bien (appartement, maison, local commercial), surface, nombre de pièces, étage, année de construction.  
   - Équipements : Ascenseur, parking, cave, type de chauffage, isolation, type de fenêtres, etc.  
   - Photos : Galerie de photos du bien, plans, vidéos éventuellement.  
   - Documents : Diagnostics (DPE, amiante, plomb), contrats de bail, quittances de loyer, factures de travaux, polices d’assurance.  
   - Statut : Occupé, vacant, en travaux.  
   
   **Fonctionnalités** :  
   - Création, édition, suppression de logements.  
   - Association à une SCI ou à un propriétaire direct.  
   - Ajout/édition/suppression de documents (diagnostics, contrats, etc.).  
   - Historique d’occupation (locataires passés, périodes d’occupation, loyers perçus).

4. **Gestion des Locataires**  
   **Attributs possibles pour un locataire** :  
   - Informations personnelles : Nom, prénom, date de naissance, coordonnées (email, téléphone, adresse précédente), pièce d’identité.  
   - Situation financière : Salaire, statut professionnel, fiches de paie, avis d’imposition.  
   - Contrat de bail : Type de bail, date de début et de fin, montant du loyer, dépôt de garantie, clauses particulières.  
   - Documents liés : Contrat signé, pièces justificatives, relevés de loyers payés, correspondances.  
   
   **Fonctionnalités** :  
   - Création, édition de fiches locataires.  
   - Association d’un ou plusieurs locataires à un logement.  
   - En cas de départ du locataire : dissociation du logement, mais conservation du locataire en base (archivage de l’historique, contrats passés).  
   - Consultation de l’historique (logements occupés, loyers payés).

5. **États des Lieux et Liens Éphémères**  
   **Fonctionnalités** :  
   - Création d’états des lieux (entrée/sortie) avec un formulaire détaillé (état des murs, sols, plafonds, équipements, compteurs, etc.).  
   - Ajout de photos pour documenter l’état du bien.  
   - Génération d’un lien éphémère (valable X jours) permettant à un tiers (locataire, agent) d’ajouter ou valider l’état des lieux sans compte.  
   - Archivage, signature électronique, comparaison des états des lieux (entrée vs sortie).

6. **Gestion Documentaire Globale**  
   - Téléversement sécurisé de documents (PDF, images, etc.) pour les SCI, logements, locataires.  
   - Organisation par catégories (baux, diagnostics, factures, statuts, bilans, etc.).  
   - Recherche par mots-clés, filtres (date, type, entité liée).  
   - Historique des versions (conservation des anciennes versions de documents).

7. **Collaboration & Partage**  
   - Invitation d’utilisateurs (gestionnaires, copropriétaires, agents) via compte Google OAuth.  
   - Attribution de rôles et permissions fines.  
   - Historique des modifications par utilisateur (piste d’audit).

8. **Expérience Utilisateur & Ergonomie**  
   - Interface épurée (shadcn/ui) pour une navigation claire.  
   - Tableau de bord intuitif : aperçu du parc, notifications (documents à renouveler, états des lieux à faire, fin de bail imminente).  
   - Barre de recherche, filtres avancés, navigation par catégories.  
   - Notifications et rappels (par email ou in-app).

9. **Fonctionnalités Avancées (Évolutions Futures)**  
   - Rappels automatiques d’échéances (fin de bail, révision de loyer, diagnostics à renouveler).  
   - Intégrations avec services tiers (comptabilité, signature électronique avancée, assurances, paiement en ligne).  
   - Statistiques et reporting (taux d’occupation, rentabilité, génération de rapports PDF/Excel).

10. **Sécurité & Conformité**  
    - Authentification sécurisée via Google OAuth.  
    - Chiffrement des données sensibles.  
    - Conformité RGPD : droits d’accès, de modification et de suppression des données personnelles.  
    - Sauvegardes régulières, plan de reprise d’activité.

## Installation & Démarrage

1. **Prérequis** :  
   - Node.js (version LTS recommandée)  
   - Base de données (PostgreSQL recommandée)

2. **Installation** :  
   ```bash
   git clone https://github.com/votre-compte/easyrent.git
   cd easyrent
   npm install
   ```

3. **Configuration** :  
   - Créez un fichier `.env` à la racine du projet.  
   - Variables d’environnement :  
     - `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` (pour Auth.js)  
     - `DATABASE_URL` : URL de connexion à la base (ex: `postgresql://user:pass@localhost:5432/easyrent`)

4. **Migrations & Base de Données** :  
   ```bash
   npx prisma migrate dev
   ```

5. **Lancement du Serveur de Développement** :  
   ```bash
   npm run dev
   ```
   Rendez-vous sur [http://localhost:3000](http://localhost:3000).

## Structure du Code

- `pages/` : Pages Next.js (auth, dashboard, SCI, logements, locataires, documents, états des lieux).
- `app/` (si utilisé) : Routes, layouts.
- `prisma/` : Schéma de la base de données et migrations.
- `components/` : Composants UI réutilisables (basés sur shadcn/ui).
- `lib/` : Fonctions utilitaires, logique métier.
- `styles/` : Fichiers de styles, configuration Tailwind.

## Contribution

- Les suggestions, issues, et pull requests sont les bienvenues.
- Respect des bonnes pratiques, de la sécurité, et de la confidentialité.

## Licence

Ce projet est sous licence [MIT](LICENSE).

---

EasyRent apporte une vision moderne et centralisée de la gestion immobilière, du suivi des locataires, des documents, et des structures légales. Son approche modulaire, son design clair, et sa sécurité intégrée en font une solution évolutive, adaptée aux besoins de propriétaires et gestionnaires immobiliers souhaitant simplifier leur activité.
