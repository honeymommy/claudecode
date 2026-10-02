# Honey Mommy : plan pour devenir une vraie boutique en ligne

Objectif : un site de grande qualité, avec des centaines de produits pour la grossesse et les nouveau-nés, où les clientes paient directement avec un **code promo d'influenceuse**. L'influenceuse touche une commission automatiquement. Tout est relié à TopDawg pour que les commandes partent toutes seules, sur le site et sur eBay.

---

## 1. Les décisions importantes (et pourquoi)

### Le site de vente se fait sur **Shopify**, pas en code maison
Un site qui encaisse des cartes de crédit, gère des codes promo, calcule les taxes des 50 États, suit les commissions des influenceuses et transmet les commandes au fournisseur, c'est l'équivalent d'Amazon en petit. Le coder soi-même :
- demanderait l'API TopDawg (forfait Premier, 139,99 $/mois), que tu ne veux pas ;
- t'obligerait à gérer la sécurité des cartes (normes PCI) et les taxes de vente toi-même ;
- casserait au premier problème, sans personne pour le réparer.

Shopify fait tout ça pour environ **39 $/mois** (moins cher en payant à l'année), et **TopDawg a une application Shopify officielle** qui importe les produits, synchronise stocks et prix, passe les commandes et renvoie les numéros de suivi automatiquement ([TopDawg Shopify App](https://topdawg.com/dropshipping/companies-platform/shopify-dropshipping-app)).

Le site actuel (dossier `site/`) sert de maquette : on reprend ses couleurs, son logo et ses textes dans Shopify.

### Les codes promo et les commissions passent par **UpPromote**
C'est l'application d'affiliation la plus utilisée sur Shopify. Le **forfait gratuit** couvre jusqu'à 200 ventes d'influenceuses par mois, avec un nombre illimité d'influenceuses et le suivi par code promo et par lien ([tarifs UpPromote](https://www.getapp.com/marketing-software/a/shopify-affiliate-marketing/)). Chaque influenceuse a son code, par exemple `JESS10` :
- la cliente obtient **10 % de rabais** ;
- l'influenceuse touche **10 % de commission**, calculée et payée automatiquement par PayPal.

### Il faut **plus d'un fournisseur** pour avoir des milliers de produits
Les recherches de l'agent Chrome l'ont montré : dans TopDawg, seulement **74 produits bébé** passaient les critères de base, et **aucun produit de grossesse** n'était vendable (stock trop bas ou prix trop haut). TopDawg seul ne donnera pas des milliers d'articles dans cette niche.

**La stratégie :**
1. **TopDawg** pour les produits déjà validés et ceux qui passent les règles.
2. **Un ou deux fournisseurs de plus, avec entrepôts aux États-Unis et une application Shopify**, à évaluer : Spocket, Syncee, CJ Dropshipping (stock US seulement). L'agent Chrome les compare pour toi (section 6).
3. **Élargir légèrement la niche** à des produits que les mamans achètent pour elles et pour la chambre de bébé : soins post-partum, sacs à langer, décoration de chambre, jouets 0-3 ans, cadeaux de baby shower.

Ce n'est pas le nombre de produits qui fait vendre : c'est **le bon prix et la confiance**. 300 produits bien choisis vendent plus que 3 000 produits chers ou douteux, et ils sont plus faciles à gérer.

---

## 2. Ce que ça coûte

| Poste | Coût / mois | Remarque |
|---|---|---|
| Shopify Basic | ~39 $ (~29 $ à l'année) | Vérifie le prix à l'inscription. Essai à prix réduit au début |
| TopDawg | ton forfait actuel | ⚠️ Les forfaits TopDawg sont **par intégration**. eBay + Shopify peut demander un 2e forfait ou un forfait supérieur. **Demande au support TopDawg avant de connecter Shopify** |
| UpPromote | 0 $ | Gratuit jusqu'à 200 ventes d'influenceuses par mois |
| Nom de domaine `honeymommy.com` (ou `.shop`, `.co` s'il est pris) | ~1-2 $ | Environ 15 à 20 $/an |
| Assurance responsabilité produits | ~25-50 $ | **Fortement recommandée** pour des produits bébé (voir section 8) |
| Frais de paiement Shopify | 2,9 % + 0,30 $ par vente | Bien moins que les ~13,6 % d'eBay |
| **Total fixe** | **~65 à 130 $/mois** | |

---

## 3. Combien tu gagnes sur une vente (et pourquoi le site rapporte plus qu'eBay)

Exemple avec le **Bambini 7-Piece Bath Set** (coût + livraison = 23,88 $) :

| | eBay (×1,4) | Site, sans code (×1,6) | Site, avec code influenceuse |
|---|---|---|---|
| Prix de vente | 33,99 $ | 38,99 $ | 38,99 $ − 10 % = 35,09 $ |
| Produit + livraison TopDawg | −23,88 $ | −23,88 $ | −23,88 $ |
| Frais (eBay ~13,6 % + 0,40 $ / Shopify 2,9 % + 0,30 $) | −5,40 $ | −1,43 $ | −1,32 $ |
| Commission influenceuse (10 %) | — | — | −3,51 $ |
| **Profit** | **≈ 4,71 $** | **≈ 13,68 $** | **≈ 6,38 $** |

**La règle à respecter :** rabais client **+** commission ne doivent **jamais** dépasser **20 % au total**, sinon tu travailles à perte. C'est réglé une fois pour toutes dans UpPromote.

**Règles de prix à mettre dans l'application TopDawg sur Shopify :**
- prix = (coût + livraison) × **1,6**, arrondi à X,99 ;
- « Compare-at price » (le prix barré) = le **PDSF** seulement s'il est plus haut que ton prix. N'invente jamais un faux prix barré : c'est illégal aux États-Unis (publicité trompeuse, FTC) ;
- un produit qui rapporte **moins de 8 $** sur le site (sans code) → ne pas l'importer.

---

## 4. Mise en place, étape par étape

### Étape A : Shopify (1 h)
1. Crée la boutique : [shopify.com](https://www.shopify.com) → *Start free trial* → nom **Honey Mommy**. Mets ta vraie adresse.
2. **Settings → Markets** : un seul marché, **United States**. Désactive tous les autres pays.
3. **Settings → Languages** : **English**.
4. **Settings → Shipping** : zone **United States** seulement → **Free shipping** sur tout. La livraison est déjà comprise dans le prix.
5. **Settings → Payments** : active **Shopify Payments**, qui accepte cartes, Apple Pay, Google Pay et Shop Pay. Ajoute **PayPal**.
6. **Settings → Taxes and duties** : active **Shopify Tax**. Il calcule et collecte la taxe de vente de chaque État automatiquement.
7. **Settings → Policies** : génère les politiques Refund, Privacy, Terms et Shipping avec le bouton *Create from template*, puis remplace Shipping et Refund par les textes du dossier `pages/`.
8. **Settings → Checkout** : *Customer contact* = e-mail ; active **Abandoned checkout emails**, envoyés automatiquement 10 h après un panier abandonné.
9. **Settings → Notifications** : ajoute le logo et la couleur `#C9706C`.

### Étape B : apparence du site (1 h)
1. **Online Store → Themes** : garde le thème gratuit **Dawn**, rapide, mobile et bien noté, ou prends **Sense** (gratuit, plus « doux »).
2. Applique les réglages de `theme/REGLAGES.md`, puis colle `theme/honey-mommy.css` dans *Theme settings → Custom CSS*.
3. Crée les pages avec les textes du dossier `pages/` : About, FAQ, Shipping, Returns, Become a Partner, Contact.
4. Construis la page d'accueil (sections décrites dans `theme/REGLAGES.md`).

### Étape C : TopDawg → Shopify (30 min)
1. **Avant tout :** écris au support TopDawg : *« I already have an eBay integration on my plan. Can I add a Shopify store on the same membership, or do I need a second plan? »*
2. Installe l'application **TopDawg** depuis le [Shopify App Store](https://apps.shopify.com/topdawg) et connecte ton compte.
3. Dans l'application, règle :
   - prix ×1,6, arrondi à X,99 ;
   - synchronisation des stocks et des prix : **On** ;
   - commandes automatiques et **auto-pay** : **On** ;
   - numéros de suivi : **On**.
4. Importe les produits validés par l'agent Chrome (section 6).

### Étape D : collections automatiques (20 min)
**Products → Collections → Create collection → Automated**. Chaque nouveau produit est classé tout seul selon son titre :

| Collection | Condition « Product title contains » (une condition par mot, « any condition ») |
|---|---|
| Pregnancy | pregnancy, maternity, belly band, belly support, bump |
| Postpartum & Nursing | nursing, breastfeeding, breast pad, postpartum, nursing pillow |
| Baby Clothing | onesie, bodysuit, romper, sleeper, layette, baby hat, baby socks, swaddle |
| Bath & Care | bath, hooded towel, robe, washcloth, baby lotion, baby brush |
| Feeding | bib, bottle, sippy, feeding, high chair, baby spoon |
| Play & Teething | teether, teething, rattle, play mat, activity, baby toy |
| Nursery | blanket, nursery, crib sheet, mobile, night light |
| Gift Sets | gift, set, kit, piece, bundle |
| Under $30 | *Condition : Price is less than 30* |
| Best Sellers | *Collection manuelle, à mettre à jour une fois par mois* |

### Étape E : codes promo et influenceuses (30 min)
1. Installe **UpPromote** depuis le Shopify App Store (forfait **Free**).
2. **Commission :** 10 % du sous-total payé (après rabais, hors taxes et livraison).
3. **Rabais client :** active *Coupon for affiliates* → 10 %, avec un code personnel généré pour chaque influenceuse (ex. `JESS10`).
4. **Paiement des influenceuses :** PayPal, une fois par mois, **après 30 jours** (le délai de retour), minimum 25 $.
5. **Inscription :** active le formulaire d'inscription d'UpPromote et mets son lien dans la page *Become a Partner*.
6. **Approbation manuelle** des nouvelles influenceuses : c'est la seule chose à vérifier toi-même, pour éviter les faux comptes.
7. **Fraude :** active la protection anti-fraude incluse, qui bloque l'auto-achat avec son propre code.

Tout le kit influenceuses est dans `influencers/` : programme, conditions, messages d'approche.

### Étape F : domaine et lancement (15 min)
1. **Settings → Domains → Buy new domain** → `honeymommy.com` (ou `.shop`, `.co` s'il est pris).
2. Retire le mot de passe de la boutique : **Online Store → Preferences → Password protection : Off**.
3. Dans `site/config.js`, mets l'adresse de la boutique Shopify. L'ancien site redirige alors vers la vraie boutique.

---

## 5. Le pilote automatique, une fois en place

| Événement | Ce qui se passe tout seul |
|---|---|
| Une cliente achète sur le site | Shopify encaisse et collecte la taxe → l'application TopDawg passe la commande et la paie → le fournisseur expédie → le suivi est envoyé par courriel à la cliente |
| Une cliente utilise `JESS10` | Rabais de 10 % → UpPromote enregistre la commission de Jess → paiement PayPal automatique le mois suivant |
| Une cliente abandonne son panier | Courriel de relance automatique |
| Un produit est en rupture chez le fournisseur | Il disparaît du site et d'eBay |
| Le fournisseur change son prix | Ton prix s'ajuste |
| Vente sur eBay | Frooition fait la même chaîne qu'aujourd'hui |

**Ce qui reste à toi :** approuver les nouvelles influenceuses, répondre aux clientes, traiter les rares litiges. Environ 15 à 30 minutes par semaine.

---

## 6. Trouver des centaines de produits : la mission de l'agent Chrome

Copie le texte de `PROMPT-SOURCING.md` dans l'extension Claude. L'agent va :
1. parcourir **toutes** les catégories bébé et maternité de TopDawg (des heures si besoin) ;
2. comparer 2 ou 3 fournisseurs supplémentaires avec entrepôts aux États-Unis ;
3. te rendre un tableau classé avec les produits **à importer**, **à surveiller** et **refusés**, et la raison de chaque refus.

Tu valides le tableau (ou tu me le colles ici pour que je le vérifie), puis tu lances l'import en un clic dans l'application TopDawg.

**Rythme conseillé :** 50 produits la 1re semaine, puis 50 de plus par semaine selon ce qui se vend. Ne publie pas 1 000 produits d'un coup : un catalogue rempli de produits invendables fait baisser la confiance et le classement Google.

---

## 7. Attirer du trafic (le plus important)

| Canal | Coût | Mise en place |
|---|---|---|
| **Influenceuses (code promo)** | 10 % par vente + 1 produit offert | 20 micro-influenceuses (2 000 à 50 000 abonnés) maman/grossesse sur Instagram et TikTok. Messages prêts dans `influencers/MESSAGES.md` |
| **Google Shopping (gratuit)** | 0 $ | Shopify → *Sales channels* → ajoute **Google & YouTube**. Tes produits apparaissent gratuitement dans l'onglet Shopping de Google |
| **Pinterest** | 0 $ | Ajoute le canal **Pinterest**. Les futures mamans y préparent leur chambre de bébé et leurs listes de naissance |
| **TikTok Shop / Instagram Shop** | 0 $ au départ | Ajoute les canaux **TikTok** et **Facebook & Instagram** |
| **Courriels** | 0 $ jusqu'à 10 000 courriels/mois | **Shopify Email** : bienvenue (code `WELCOME10`), relance de panier, nouveautés |
| **Avis clients** | 0 $ | Application **Judge.me** (forfait gratuit) : demande d'avis automatique après la livraison |
| **Publicité payante** | à partir de 5 $/jour | Plus tard seulement, sur les produits qui vendent déjà |

---

## 8. Les choses auxquelles tu ne penses pas (mais qu'il faut faire)

- **Sécurité des produits bébé :** aux États-Unis, les produits pour enfants doivent avoir un **certificat de conformité (CPC)**. Le fournisseur le possède, mais c'est **toi** le vendeur aux yeux de la cliente. Demande-le pour tes meilleurs vendeurs. Reste loin des sièges d'auto, lits, couchettes, marchettes, porte-bébés, poussettes, attache-suces, jouets à piles et articles avec aimants.
- **Rappels de produits :** une fois par mois, vérifie [cpsc.gov/Recalls](https://www.cpsc.gov/Recalls) avec le nom de tes marques.
- **Assurance responsabilité produits :** une seule réclamation sans assurance peut coûter plus que tout ce que tu auras gagné.
- **Influenceuses et la loi (FTC) :** elles doivent écrire **#ad** ou « paid partnership ». C'est dans les conditions du programme.
- **Faux prix barrés et fausses promesses :** interdits. Pas de « prévient les vergetures », « guérit », « approuvé par les médecins ».
- **Taxes de vente :** Shopify Tax les collecte et te dit quand tu dépasses le seuil d'un État. Garde les rapports.
- **Impôts sur ton revenu, commissions versées :** à voir avec un comptable dans ton pays. Payer des influenceuses aux États-Unis peut demander des formulaires fiscaux au-delà d'un certain montant par année.
- **Retours :** les retours vont à l'entrepôt du fournisseur, avec l'autorisation TopDawg (RMA). Tes conditions de retour doivent correspondre à celles de TopDawg.
- **Trésorerie :** Shopify verse ton argent en 2 à 3 jours, mais TopDawg débite ta carte tout de suite. Garde 300 à 500 $ de marge.
- **Même produit, même prix ?** Le site (×1,6) est plus cher qu'eBay (×1,4). C'est normal : le site offre des codes promo et un programme de fidélité. Le jour où tu as beaucoup de ventes, aligne les prix.

---

## 9. Calendrier

| Quand | Quoi |
|---|---|
| Jour 1 | Étapes A à C, puis lancement de la recherche de produits avec l'agent Chrome |
| Jour 2 | Validation des produits, import des 50 premiers, collections, pages |
| Jour 3 | UpPromote, domaine, Google/Pinterest/Instagram/TikTok, ouverture du site |
| Semaine 1 | Contacter 20 influenceuses (envoyer 5 à 10 produits gratuits) |
| Chaque semaine | +50 produits, garder ceux qui vendent, retirer ceux qui n'ont aucune vue |
| Mois 2 | Premier paiement automatique des influenceuses, bilan des ventes |
