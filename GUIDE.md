# Honey Mommy : plan simple, le moins cher possible (30 minutes)

**Le principe :** TopDawg fournit les produits, Frooition (déjà connecté) les met sur eBay et passe les commandes tout seul, et le site web gratuit présente ta marque.

## Ce que ça coûte

| Poste | Coût | Pourquoi ce choix |
|---|---|---|
| TopDawg | **Le forfait le moins cher qui inclut l'intégration eBay** (Start-Up gratuit si c'est inclus, sinon Business à 34,99 $/mois) | Premier (139,99 $) ne sert à rien avec Frooition |
| eBay | **0 $ par mois** : pas d'abonnement Store | 250 annonces gratuites par mois. eBay prend seulement environ 13,6 % + 0,40 $ quand tu vends |
| Site web | **0 $** (GitHub Pages) | Pas de domaine payant pour l'instant |
| Frooition | Vérifie si un abonnement est facturé dans ton compte | Déjà connecté |
| **Total** | **Entre 0 et environ 35 $ par mois + les frais eBay sur les ventes** | |

---

## Les 30 minutes

### ⏱️ 0–5 min : TopDawg
1. **Billing / Membership** : prends le forfait **le moins cher** où « eBay integration » est cochée.
2. **Billing** : vérifie que ta carte est enregistrée et que l'**auto-pay** des commandes est **activé**. ⚠️ Sans ça, rien ne part tout seul.

### ⏱️ 5–12 min : eBay (livraison aux États-Unis seulement)
1. **Account → Business policies → Shipping** (crée-la ou modifie-la) :
   - livraison **gratuite** (Free Standard Shipping), traitement en **2 jours** ;
   - **International shipping : No international shipping**.
2. **Business policies → Returns** : **30 jours**, l'acheteur paie le retour, **retours internationaux désactivés**.
3. **Account → Shipping preferences** : **désactive eBay International Shipping**.
4. Ton compte eBay garde **ta vraie adresse**. L'entrepôt TopDawg apparaît tout seul comme lieu d'expédition des annonces.

### ⏱️ 12–17 min : Frooition
1. Choisis les 2 politiques eBay faites ci-dessus.
2. Active **Order sync**, **Inventory sync** et **Tracking sync**.
3. **Prix** : marge de **60 %** (coût × 1,6), arrondie à X,99.
4. (Facultatif) colle `ebay/description-template.html` comme modèle de description.

### ⏱️ 17–27 min : choisir les produits dans TopDawg
Ajoute **50 produits maximum** pour commencer. Un nouveau compte eBay a souvent une limite de vente au début, et tu restes sous les 250 annonces gratuites.

Cherche ces mots-clés :
`pregnancy pillow`, `belly band`, `nursing pillow`, `breast pad`, `swaddle`, `baby romper`, `hooded towel`, `baby bib`, `silicone teether`, `play mat`

Pour chaque produit :
- ✅ expédié des **États-Unis**, en stock (≥ 20), coût + livraison **≥ 15 $** ;
- ❌ **jamais** : siège d'auto, lit de bébé, berceau, couchette, marchette, porte-bébé, poussette, lait maternisé, médicament, marque connue (Graco, Medela…).

Clique **Export / Push to eBay**.

### ⏱️ 27–30 min : mettre le site en ligne
1. Dans `site/config.js`, remplace `honeymommy` dans `storeUrl` par **ton nom d'utilisateur eBay**.
2. GitHub → dépôt → **Settings → Pages → Source : GitHub Actions**.
3. Fusionne la branche dans `main`. Le site est en ligne quelques minutes plus tard.

✅ **C'est fini.** Les commandes, les paiements au fournisseur et les numéros de suivi se font tout seuls.

---

## Pilote automatique : les réglages à faire une fois

| # | Où | Réglage | Ce que ça règle tout seul |
|---|---|---|---|
| 1 | TopDawg → Billing | **Auto-pay** activé, avec une carte au plafond suffisant (ex. 500 $) | Les commandes partent sans toi |
| 2 | Frooition | **Order sync + Inventory sync + Tracking sync + Price sync** | Commandes, stocks, prix et numéros de suivi |
| 3 | eBay → Account → Selling preferences | **Use out-of-stock option : On** | Une annonce épuisée se cache, puis revient d'elle-même |
| 4 | eBay → Account → Return preferences → Automation rules | **Accept returns automatically** + **Refund automatically when the item is received** | Les retours sans discussion |
| 5 | eBay → Seller Hub → Feedback | **Automatic feedback : On** (« Thank you for shopping at Honey Mommy! ») | Les évaluations |
| 6 | eBay → Payments → Payout settings | Versement **quotidien** automatique | Ton argent arrive tout seul |
| 7 | eBay → Account → Communication preferences | Notifications **par texto** pour : messages, retours, litiges (*cases*) | Tu es avertie seulement quand il faut agir |
| 8 | Gmail (infohoneymommy@gmail.com) → Settings → **Vacation responder : On** (sans date de fin) | Réponse automatique en anglais (texte ci-dessous) | Les courriels du site |
| 9 | Téléphone | Appli **eBay** installée, notifications activées | Tout passe par là |

**Réponse automatique Gmail (à copier) :**
> Thank you for contacting Honey Mommy! 💛 Orders ship from US warehouses within 1–2 business days and arrive in 2–5 business days. Your tracking number is in your eBay order details. For returns, open a return request from your eBay purchase history and it will be approved automatically. We'll reply to any other question within 24 hours.

## Ce qui ne peut pas être automatisé

eBay et la loi obligent une vraie personne à gérer ces situations. Elles sont rares, et tu reçois un texto quand ça arrive :

- **Litige ou « case »** (colis perdu, article non conforme) : il faut répondre en moins de 3 jours ouvrables, sinon eBay tranche contre toi et pénalise ton compte.
- **Question d'une cliente** sur eBay : réponds en 1 ou 2 phrases.
- **Commande bloquée chez TopDawg** (carte refusée, rupture de stock) : TopDawg t'envoie un courriel. Annule et rembourse dans eBay.
- **Une fois par année** : tes impôts.

**En pratique :** environ 15 minutes par semaine, plus un texto à traiter de temps en temps.

## Plus tard (seulement si ça marche bien)
- Plus de 250 produits → abonnement eBay Store.
- Domaine `honeymommy.com` → environ 12 $/an.
- Système d'automatisation sur mesure (dossier `automation/`, forfait Premier) → voir `automation/GUIDE-PREMIER.md`. **Jamais en même temps que Frooition.**
