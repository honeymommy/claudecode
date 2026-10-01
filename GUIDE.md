# Honey Mommy : guide de mise en place

Objectif : une boutique eBay et un site web qui vendent des produits pour la grossesse et les bébés, fournis par TopDawg. Une fois la boutique en place, la synchronisation des produits, des stocks, des commandes et des numéros de suivi se fait toute seule.

## Comment ça fonctionne

```
Cliente achète sur eBay ──► Frooition (intégration officielle TopDawg↔eBay)
                                  │  envoie la commande à TopDawg
                                  ▼
                    TopDawg paie le fournisseur avec ta carte enregistrée
                                  │  le fournisseur expédie à la cliente
                                  ▼
             Le numéro de suivi revient automatiquement sur eBay
```

- **Produits et stocks** : TopDawg les met à jour plusieurs fois par jour. Un produit en rupture de stock est retiré d'eBay automatiquement.
- **Commandes** : elles sont transmises au fournisseur et payées avec ta carte enregistrée chez TopDawg (paiement automatique).
- **Toi** : tu reçois l'argent des ventes sur eBay. TopDawg débite le prix de gros, et la différence est ton profit.

Le site web (`site/`) présente ta marque et envoie les clientes vers ta boutique eBay. Tu n'as donc qu'**un seul** système de commandes à faire tourner.

## Règle de base : tout se passe aux États-Unis

- **Langue** : le site, les annonces eBay et les politiques sont **en anglais seulement**.
- **Clientes** : ventes et livraisons **aux États-Unis seulement** (50 États + adresses militaires APO/FPO). Aucune expédition internationale.
- **Fournisseurs** : seulement des fournisseurs TopDawg qui **expédient depuis les États-Unis** (étape 4).
- **Retours** : expédiés depuis une adresse américaine vers l'entrepôt américain du fournisseur.
- **Ton entreprise** : pour vendre sur eBay.com comme entreprise américaine, il te faut une adresse, un numéro fiscal (EIN, ou ton SSN) et un compte bancaire **aux États-Unis**. Si tu habites ailleurs (au Canada, par exemple), il faut d'abord créer une LLC américaine et ouvrir un compte bancaire américain, sinon eBay versera tes paiements dans ton pays. Parle-en à un comptable avant de commencer.

---

## Étape 1 : TopDawg (environ 10 min)

1. Connecte-toi à topdawg.com.
2. Choisis un forfait qui inclut l'intégration eBay. Vérifie sur la page [Membership Pricing](https://topdawg.com/dropshipping/companies-platform/membership-pricing) avant de payer. L'API complète demande le forfait **Premier**, mais tu n'en as pas besoin si tu passes par l'intégration eBay.
3. **Settings → Billing** : enregistre ta carte et active **Auto-pay / paiement automatique des commandes**. ⚠️ Sans ça, aucune commande ne part toute seule.

## Étape 2 : eBay (environ 10 min)

1. Crée un compte vendeur **professionnel** au nom de **Honey Mommy** sur **ebay.com** (le site américain), avec une adresse et un compte bancaire américains.
2. Abonne-toi à une **eBay Store** (le forfait Starter suffit pour commencer). Nom de la boutique : `honeymommy`.
3. Ajoute ton logo (`site/assets/logo.png`) comme image de la boutique.
4. Crée 3 politiques d'entreprise (*Account → Business policies*) :
   - **Expédition** : *Domestic shipping* → livraison gratuite (Free Standard Shipping), délai de traitement de 2 jours ouvrables. *International shipping* → **No international shipping**.
     Dans **Exclude shipping locations**, coche **Worldwide** (garde seulement les États-Unis, Alaska/Hawaï et APO/FPO compris).
   - **Retours** : *Domestic returns* → 30 jours, acheteur paie le retour (ou gratuit si tu préfères). *International returns* → désactivé.
   - **Paiement** : paiement immédiat exigé.
5. *Account → Shipping preferences* : **désactive eBay International Shipping** (anciennement Global Shipping Program). eBay l'active souvent par défaut, et sinon tes articles peuvent être revendus à l'étranger.
6. Si l'option existe dans ton compte (*Buyer requirements* / *Blocked buyers*), bloque les acheteurs dont l'adresse est hors de ta zone d'expédition.

## Étape 3 : connecter TopDawg à eBay (environ 10 min)

Suis la vidéo officielle : [How to Integrate with eBay](https://topdawg.com/dropshipping/companies-platform/retailers/video-learning-center/how-to-integrate-with-ebay).

1. TopDawg → **Integrations → eBay** → *Connect*. Frooition s'ouvre et te demande d'autoriser ton compte eBay.
2. Dans Frooition, choisis les 3 politiques créées à l'étape 2.
3. Colle le modèle `ebay/description-template.html` comme modèle de description (facultatif, mais ça donne une belle image de marque).
4. Active **Auto order sync**, **Inventory sync** et **Tracking sync**.
5. Vérifie que la langue des annonces est **English (US)** et la devise **USD**.

## Étape 4 : choisir les produits (environ 15 min, à faire une seule fois)

TopDawg travaille avec des fournisseurs américains vérifiés. Si le catalogue offre un filtre d'emplacement d'entrepôt, mets-le sur **USA**. Ensuite, cherche ces catégories et ajoute les produits à ta liste d'importation :

| Catégorie du site | Mots-clés à chercher dans TopDawg |
|---|---|
| Pregnancy | maternity pillow, pregnancy pillow, belly band, stretch mark, maternity |
| Nursing | nursing pillow, breast pump, nursing bra, nursing cover, breast pad |
| Baby clothing | baby onesie, newborn, swaddle, baby romper, baby socks |
| Bath & care | baby bath, hooded towel, baby lotion, baby brush |
| Feeding | baby bottle, bib, sippy cup, high chair, baby spoon |
| Play & development | teether, rattle, play mat, baby mobile, crib toy |

**Comment choisir un produit :**
- Le fournisseur expédie **depuis les États-Unis** : vérifie l'adresse de l'entrepôt sur la fiche du fournisseur.
- Note du fournisseur ≥ 4 étoiles et expédition en ≤ 2 jours.
- Stock ≥ 20 unités.
- Coût TopDawg + livraison d'au moins **20 $** : en dessous, le profit par vente est trop petit (voir le tableau plus bas).
- Rien qui exige une certification que tu ne peux pas vérifier : **pas** de sièges d'auto, de lits de bébé, de couchettes ni de produits qui affirment « prévenir le SMSN ». Ce sont les articles les plus surveillés par la CPSC et eBay, et les plus risqués en cas de rappel.
- Pas de marques connues (Graco, Medela, etc.) sauf si TopDawg indique que le fournisseur est un distributeur autorisé. Sinon, eBay peut retirer l'annonce (VeRO).

Commence avec **30 à 50 produits** et ajoutes-en d'autres quand tu vois ce qui se vend.

## Étape 5 : règle de prix (automatique)

Dans TopDawg → **Pricing rules**, mets une seule règle :

```
Prix de vente = (Coût TopDawg + frais de livraison) × 1,6
                arrondi à X,99
```

Pourquoi 1,6 : eBay prend environ 13 à 15 % en frais, et il faut prévoir les retours et les promotions. Exemple :

| Coût + livraison | Prix eBay | Frais eBay (~14 %) | Profit |
|---|---|---|---|
| 15,00 $ | 23,99 $ | 3,36 $ | ≈ 5,63 $ |
| 25,00 $ | 39,99 $ | 5,60 $ | ≈ 9,39 $ |
| 40,00 $ | 63,99 $ | 8,96 $ | ≈ 15,03 $ |

Les prix se mettent à jour d'eux-mêmes quand le coût TopDawg change.

## Étape 6 : publier le site web (environ 5 min)

Le site est dans `site/` et se publie gratuitement avec GitHub Pages.

1. Dans `site/config.js`, mets l'adresse de ta boutique eBay dans `storeUrl`. Tu peux aussi ajouter un lien par catégorie dans `url`.
2. Sur GitHub → dépôt `claudecode` → **Settings → Pages** → *Source* : **GitHub Actions**.
3. Fusionne la branche dans `main`. Le site se met en ligne tout seul à chaque modification, à l'adresse `https://honeymommy.github.io/claudecode/`.
4. (Optionnel) Achète le domaine `honeymommy.com` (environ 12 $/an) et relie-le dans **Settings → Pages → Custom domain**.

---

## Ce qui est automatique, et ce qui ne l'est pas

| Tâche | Qui s'en occupe |
|---|---|
| Ajouter et mettre à jour les fiches produits | ✅ TopDawg + Frooition |
| Stocks et ruptures | ✅ automatique |
| Prix | ✅ règle de prix |
| Transmettre et payer les commandes | ✅ auto-pay TopDawg |
| Numéros de suivi sur eBay | ✅ automatique |
| Payer les abonnements (TopDawg, eBay Store) | 💳 toi |
| **Questions des clientes, retours, colis perdus** | 👩 toi, environ 10 min/jour. eBay exige une réponse en moins de 24 h, sinon ton compte est pénalisé |
| Déclarer tes revenus | 👩 toi ou ton comptable |

Aucun service ne peut répondre légalement aux litiges eBay à ta place sans ton accès. Garde l'application eBay sur ton téléphone avec les notifications activées.

## Sources

- [TopDawg : intégration eBay](https://topdawg.com/integrations/ebay)
- [TopDawg : vidéo « How to Integrate with eBay »](https://topdawg.com/dropshipping/companies-platform/retailers/video-learning-center/how-to-integrate-with-ebay)
- [TopDawg : forfaits](https://topdawg.com/dropshipping/companies-platform/membership-pricing)
- [TopDawg : API et intégration CSV](https://topdawg.com/dropshipping/companies-platform/custom-integration-api-csv)
- [Frooition × TopDawg](https://www.frooition.com/topdawg/)
