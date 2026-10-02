# Programme d'influenceuses Honey Mommy

## Le principe
Chaque influenceuse a **son propre code**, par exemple `JESS10`. Quand une cliente l'utilise :
- la cliente a **10 % de rabais** ;
- l'influenceuse touche **10 % de commission** sur le montant payé (sans taxes ni livraison) ;
- UpPromote **calcule tout** et la paie par PayPal **une fois par mois**.

**Pourquoi ces chiffres :** rabais + commission = 20 % maximum. Au-delà, tu vends à perte (voir le calcul dans `../PLAN.md`, section 3).

## Réglages UpPromote (à faire une seule fois)

| Réglage | Valeur |
|---|---|
| Plan | **Free** (jusqu'à 200 ventes d'influenceuses par mois) |
| Commission | **10 %**, calculée sur le sous-total **après rabais**, hors taxes et livraison |
| Coupon for affiliates | **On**, 10 % de rabais, code = prénom + 10 (ex. `JESS10`), une utilisation par commande |
| Cookie (lien d'affiliation) | 30 jours |
| Auto-approve affiliates | **Off** : tu approuves toi-même (30 secondes par demande) |
| Payment method | **PayPal** |
| Payout schedule | Mensuel, **le 15 du mois**, pour les ventes de plus de 30 jours (après le délai de retour) |
| Minimum payout | 25 $ |
| Refund handling | Commission **annulée automatiquement** si la commande est remboursée |
| Fraud protection | **On** (bloque l'auto-achat avec son propre code) |
| Commission sur commande de l'influenceuse elle-même | **Non** |

## Niveaux (pour motiver les meilleures)

| Niveau | Condition | Commission |
|---|---|---|
| Partner | à l'inscription | 10 % commission · 10 % rabais client |
| Gold | 1 000 $ de ventes cumulées | 10 % commission · 10 % rabais client **+ 1 produit gratuit par mois + mise en avant sur les réseaux de Honey Mommy** |
| Ambassador | sur invitation, 3 000 $ de ventes cumulées | **12 % commission · 8 % rabais client** (toujours 20 % au total) + produits gratuits |

La somme commission + rabais reste **toujours ≤ 20 %**. Les meilleures influenceuses sont récompensées avec des produits et de la visibilité, pas avec une perte.

Dans UpPromote : *Programs → Create program* pour chaque niveau. Déplace une influenceuse de niveau en un clic.

## Codes promo maison (Shopify → Discounts)

| Code | Rabais | Usage |
|---|---|---|
| `WELCOME10` | 10 % | Courriel de bienvenue, une fois par cliente |
| `BUNDLE15` | 15 % dès 3 articles | Augmente le panier moyen. Ne se cumule **pas** avec un code d'influenceuse |
| Codes influenceuses | 10 % | Créés automatiquement par UpPromote |

**Shopify → Discounts → Combinations :** aucun code ne se combine avec un autre. Une seule réduction par commande.

## Trouver des influenceuses
- **Qui :** micro-influenceuses de 2 000 à 50 000 abonnés, sur la grossesse, la maternité et les bébés, aux États-Unis. Elles ont de meilleurs taux de conversion et acceptent un produit gratuit + une commission.
- **Où :** Instagram et TikTok, avec les hashtags `#pregnancyjourney #bumpdate #momlife #newmom #babyregistry #thirdtrimester #babyshowergifts`. Le *Marketplace* d'UpPromote liste aussi des créatrices.
- **Combien :** contacte-en **20 par semaine**. Environ 5 répondront, 2 ou 3 publieront.
- **Produit gratuit :** envoie-le avec une commande normale sur ta boutique, avec un code à 100 % à usage unique (Shopify → Discounts → Amount off order → 100 %, 1 utilisation). Ça te coûte seulement le prix TopDawg.
- **Messages prêts :** `MESSAGES.md`

## Ce que tu fais (environ 10 min par semaine)
1. Approuver ou refuser les nouvelles demandes dans UpPromote.
2. Envoyer un code de produit gratuit aux nouvelles approuvées.
3. Une fois par mois, vérifier le paiement automatique PayPal. Le compte PayPal doit avoir assez d'argent : il est rechargé par tes ventes Shopify.

## Obligations légales
- Les influenceuses doivent écrire **#ad**, **#sponsored** ou « Paid partnership » : c'est une règle de la FTC américaine. C'est dans `CONDITIONS.md`.
- Elles ne doivent faire **aucune promesse de santé** (« prévient », « guérit », « recommandé par les médecins »).
- Au-delà d'un certain montant payé par année à une influenceuse américaine, un formulaire fiscal peut être exigé. UpPromote peut collecter les formulaires W-9 ; vérifie avec un comptable.
