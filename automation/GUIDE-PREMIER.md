# Honey Mommy : guide de mise en place

Une boutique eBay et un site web, en anglais, qui vendent des produits pour la grossesse et les bébés, fournis par TopDawg et livrés **aux États-Unis seulement**. Le système d'automatisation (dossier `automation/`) fait tourner la boutique tout seul, jour et nuit.

## Ce que le système fait tout seul

```
          toutes les 6 h                               toutes les 15 min
┌──────────────────────────────┐   ┌────────────────────────────────────────────────┐
│ TopDawg (catalogue)          │   │ eBay : nouvelle commande payée                 │
│   ↓ garde seulement :        │   │   ↓ vérifie : adresse US, payée, pas annulée,  │
│   grossesse / bébé           │   │     produit connu, pas à perte, < 300 $        │
│   entrepôt aux États-Unis    │   │   ↓                                            │
│   pas de produits interdits  │   │ TopDawg : commande créée et payée              │
│   profit ≥ 5 $               │   │   (ta carte en auto-pay)                       │
│   ↓                          │   │   ↓ le fournisseur expédie à la cliente        │
│ eBay : crée / met à jour     │   │ TopDawg : numéro de suivi                      │
│   annonces, prix, stocks     │   │   ↓                                            │
│   ↓                          │   │ eBay : commande marquée « expédiée »           │
│ Site web : vitrine à jour    │   │   avec le suivi                                │
└──────────────────────────────┘   └────────────────────────────────────────────────┘
        Un problème ? → le système ouvre un « issue » GitHub → tu reçois un courriel.
```

| Tâche | Qui s'en occupe |
|---|---|
| Choisir les produits grossesse/bébé, en éviter les dangereux | ✅ automatique (`automation/config.js`) |
| Créer les annonces eBay en anglais, avec photos et prix | ✅ automatique |
| Ajuster prix et stocks, retirer les produits épuisés | ✅ automatique, toutes les 6 h |
| Passer et payer la commande chez TopDawg | ✅ automatique, toutes les 15 min |
| Envoyer le numéro de suivi à la cliente | ✅ automatique |
| Mettre le site web à jour | ✅ automatique |
| Payer les abonnements (TopDawg Premier, eBay Store) | 💳 toi |
| Répondre aux questions et aux retours des clientes | 👩 toi, environ 10 min/jour. eBay exige une réponse en moins de 24 h |
| Lire les courriels d'alerte « [Honey Mommy] … » | 👩 toi, quand il y en a |

---

## L'adresse TopDawg : où on peut la mettre et où on ne peut pas

| Endroit | Adresse TopDawg ? | Pourquoi |
|---|---|---|
| **« Item location »** sur chaque annonce (ville d'où part le colis) | ✅ **Oui, c'est automatique.** Le système crée sur eBay l'entrepôt TopDawg de chaque produit (ex. « Dallas, TX ») | C'est la vérité : le colis part de là |
| **Adresse de retour** | ⚠️ Seulement celle que **TopDawg te donne** dans sa procédure de retour (RMA) | Chaque fournisseur a son propre entrepôt. Un colis envoyé à la mauvaise adresse est perdu |
| **Adresse de ton compte eBay, de ton entreprise, de tes paiements** | ❌ **Non.** Mets ta vraie adresse | eBay vérifie ton identité avec une pièce d'identité et ton compte bancaire. La loi américaine (INFORM Consumers Act) oblige aussi les vendeurs actifs à afficher leur vraie adresse aux acheteurs. Une fausse adresse entraîne la suspension du compte et le blocage de ton argent |

**Bonne nouvelle :** tu n'as **pas besoin** d'une adresse américaine. eBay.com accepte les vendeurs du Canada et d'autres pays. Avec ta vraie adresse, tu peux quand même vendre seulement aux États-Unis, avec des produits qui partent d'entrepôts américains. eBay versera l'argent dans ton compte bancaire. Une LLC américaine reste possible, mais elle n'est pas obligatoire. Demande à un comptable comment déclarer ces revenus.

---

## Mise en place (une seule fois, environ 1 h)

### 1. TopDawg
1. Passe au forfait **Premier**, le seul qui donne accès à l'API ([forfaits](https://topdawg.com/dropshipping/companies-platform/membership-pricing)).
2. **Settings → Billing** : enregistre ta carte et active le **paiement automatique des commandes** (auto-pay).
3. **Integrations → Custom Integration / API** : copie ta **clé API**. Ouvre aussi la documentation de l'API et note :
   - l'adresse de base (ex. `https://…/api/v1`) ;
   - le chemin pour **lister les produits** ;
   - le chemin pour **créer une commande** ;
   - le chemin pour **lire une commande**.
4. ⚠️ **Ne connecte pas** l'intégration eBay de TopDawg (Frooition). Le système fait déjà ce travail : avec les deux, chaque commande serait passée **deux fois**.

### 2. eBay
1. Crée un compte vendeur **professionnel** « Honey Mommy » sur **ebay.com**, avec **ta vraie adresse** (voir plus haut).
2. Abonne-toi à une **eBay Store** (le forfait Starter suffit). Nom : `honeymommy`. Logo : `site/assets/logo.png`.
3. **Account → Shipping preferences** : **désactive eBay International Shipping**, pour que rien ne parte à l'étranger.
4. Crée un compte développeur gratuit sur [developer.ebay.com](https://developer.ebay.com) :
   - **Application Keysets → Production** : copie l'**App ID** (`EBAY_CLIENT_ID`) et le **Cert ID** (`EBAY_CLIENT_SECRET`) ;
   - **User Tokens → Get a Token from eBay via Your Application** : ajoute une adresse de redirection et copie son **RuName** (`EBAY_RUNAME`).

### 3. Relier le système à ton compte eBay (sur un ordinateur, avec Node.js installé)
```bash
cd automation
export EBAY_CLIENT_ID=... EBAY_CLIENT_SECRET=... EBAY_RUNAME=...
node src/ebay-auth.js url              # ouvre le lien, connecte-toi, clique « Agree »
node src/ebay-auth.js code "<code>"    # affiche EBAY_REFRESH_TOKEN
export EBAY_REFRESH_TOKEN=...
node src/setup.js                      # crée les politiques eBay « US seulement » et affiche leurs 3 ID
```
`setup.js` crée trois politiques sur eBay :
- **expédition** : livraison gratuite, **États-Unis seulement**, aucune option internationale, traitement en 2 jours ;
- **retours** : 30 jours, **aucun retour international** ;
- **paiement** : paiement immédiat.

Le jeton eBay dure 18 mois. Mets un rappel dans ton calendrier pour refaire cette étape.

### 4. Donner les clés à GitHub
Dépôt GitHub → **Settings → Secrets and variables → Actions**.

**Secrets** (onglet *Secrets*) :

| Nom | Valeur |
|---|---|
| `EBAY_CLIENT_ID` | App ID |
| `EBAY_CLIENT_SECRET` | Cert ID |
| `EBAY_REFRESH_TOKEN` | affiché à l'étape 3 |
| `EBAY_FULFILLMENT_POLICY_ID` | affiché par `setup.js` |
| `EBAY_PAYMENT_POLICY_ID` | affiché par `setup.js` |
| `EBAY_RETURN_POLICY_ID` | affiché par `setup.js` |
| `TOPDAWG_API_KEY` | clé API TopDawg |

**Variables** (onglet *Variables*) :

| Nom | Valeur |
|---|---|
| `TOPDAWG_API_URL` | adresse de base de l'API TopDawg |
| `TOPDAWG_PRODUCTS_PATH` | chemin « liste des produits » (ex. `/products`) |
| `TOPDAWG_CREATE_ORDER_PATH` | chemin « créer une commande » (ex. `/orders`) |
| `TOPDAWG_ORDER_PATH` | chemin « lire une commande », avec `{id}` (ex. `/orders/{id}`) |
| `DRY_RUN` | `true` pour l'instant (voir l'étape 5) |

### 5. Tester, puis allumer
1. Fusionne la branche dans `main`. Le système reste éteint tant que `TOPDAWG_API_URL` n'est pas rempli. Ensuite, il démarre en **mode test** (`DRY_RUN=true`) : il lit tout, mais **n'achète rien et ne publie rien**.
2. **Actions → Automation → Run workflow → products**. Ouvre le résultat : il dresse la liste des produits qu'il **publierait**, avec leur prix.
3. Si la liste a du sens, mets la variable **`DRY_RUN` à `false`**. Le système est en marche.
4. **Settings → Pages → Source : GitHub Actions** pour mettre le site en ligne. La section « New & loved » se remplit toute seule avec tes annonces eBay.

> La documentation de l'API TopDawg n'est pas publique. Le système accepte les noms de champs les plus courants, mais si le premier test affiche une erreur TopDawg, envoie-moi la page de documentation de l'API (ou le message d'erreur) : seul le fichier `automation/src/topdawg.js` serait à ajuster.

---

## Règles du système (modifiables dans `automation/config.js`)

- **Prix** = (coût TopDawg + livraison) × 1,6, arrondi à X,99. Un produit qui rapporte moins de 5 $ une fois les frais eBay payés n'est pas publié.
- **Produits** : seulement les mots-clés grossesse/bébé des 6 catégories du site, seulement des entrepôts aux États-Unis, au moins 5 en stock, au maximum 200 annonces.
- **Jamais vendus** : sièges d'auto, lits de bébé, berceaux, couchettes, marchettes, porte-bébés, poussettes, lait maternisé, médicaments, aimants, piles bouton. Ce sont les produits les plus réglementés et les plus rappelés aux États-Unis.
- **Sécurités sur les commandes** (une alerte par courriel au lieu d'acheter) :
  - adresse hors des États-Unis ;
  - produit que le système n'a pas publié ;
  - commande à perte ;
  - commande de plus de 300 $ chez TopDawg ;
  - TopDawg annule ;
  - pas de numéro de suivi après 4 jours.
- **Jamais deux fois** : chaque commande est notée dans `automation/state/state.json`, et deux passages du système ne peuvent pas tourner en même temps.

## Si tu reçois un courriel « [Honey Mommy] … »
Il explique quoi faire en une ou deux phrases, par exemple : « passe cette commande à la main dans TopDawg » ou « rembourse la cliente dans eBay ». Une fois le problème réglé, ferme l'issue sur GitHub.

## Sources
- [TopDawg : forfaits (API = Premier)](https://topdawg.com/dropshipping/companies-platform/membership-pricing)
- [TopDawg : API et intégration personnalisée](https://topdawg.com/dropshipping/companies-platform/custom-integration-api-csv)
