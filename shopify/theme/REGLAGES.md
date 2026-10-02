# Apparence de la boutique Shopify (thème Dawn ou Sense)

**Online Store → Themes → Customize.** Tous les réglages ci-dessous se font en cliquant, sans code. Le seul code à coller est `honey-mommy.css`.

## Theme settings (icône d'engrenage)

| Réglage | Valeur |
|---|---|
| **Logo** | `site/assets/logo.png`, largeur 90 px |
| **Favicon** | même logo |
| **Colors → Scheme 1** (fond principal) | Background `#FFF6EA` · Text `#4A3426` · Solid button `#C9706C` · Button label `#FFFFFF` · Outline button `#4A3426` |
| **Colors → Scheme 2** (bandes douces) | Background `#FBEAD4` · Text `#4A3426` · Button `#C9706C` |
| **Colors → Scheme 3** (bandeau rose) | Background `#EFA3A0` · Text `#FFFFFF` · Button `#FFFFFF` · Button label `#C9706C` |
| **Colors → Scheme 4** (cartes) | Background `#FFFFFF` · Text `#4A3426` |
| **Typography → Headings** | **Fraunces** (ou « Lora » si Fraunces n'est pas proposée) |
| **Typography → Body** | **Nunito Sans** |
| **Layout** | Page width 1200 px · Space between sections 48 px |
| **Buttons** | Corner radius 40 px |
| **Product cards** | Style « Card » · Corner radius 18 px · Color scheme 4 · Image ratio **Square** · Show second image on hover : **On** · Show vendor : **Off** |
| **Badges** | Sale badge : scheme 3 · Sold out badge : scheme 2 |
| **Cart** | Type **Drawer** · Show vendor : Off · Enable cart note : On |
| **Social media** | Instagram, TikTok, Pinterest, Facebook |
| **Custom CSS** | Colle tout le contenu de `honey-mommy.css` |

## Page d'accueil : sections, dans l'ordre

1. **Announcement bar** (scheme 3) : rotation de 3 messages :
   - `🇺🇸 Free shipping on every order — ships from US warehouses`
   - `💛 New here? Use WELCOME10 for 10% off your first order`
   - `↩️ Easy 30-day returns`
2. **Header** : logo centré, menu à gauche, icônes recherche/compte/panier à droite.
3. **Image banner** (Slideshow si tu as 2 ou 3 belles images) :
   - Titre : **Everything soft mom & baby need**
   - Texte : *Thoughtfully picked essentials for pregnancy, baby's arrival and those first precious months.*
   - Bouton 1 : **Shop new arrivals** → collection *All* · Bouton 2 : **Shop gift sets** → *Gift Sets*
   - Image : une photo lifestyle libre de droits (ex. [Unsplash « newborn » / « pregnant »](https://unsplash.com/s/photos/newborn)), recadrée en 16:9
4. **Multicolumn** (scheme 2), 4 colonnes avec icônes : 🇺🇸 Ships from the USA · 🚚 Free shipping · ↩️ 30-day returns · 💛 Mom-picked
5. **Collection list**, titre **Shop by stage** : Pregnancy · Postpartum & Nursing · Baby Clothing · Bath & Care · Feeding · Play & Teething · Nursery · Gift Sets. Image de chaque collection = la plus belle photo de produit.
6. **Featured collection**, titre **New & loved** → *Best Sellers*, 8 produits, bouton « View all ».
7. **Image with text** :
   - Titre : **Like a bee choosing the sweetest flowers**
   - Texte : *We do the sorting for you and keep only useful, comfy and safe products, shipped fast from the USA.*
   - Bouton : **Our story** → page About
8. **Featured collection**, titre **Gifts under $40** → *Under $30* (ou une collection prix < 40).
9. **Rich text** (scheme 3) : **Are you a mom creator?** / *Join the Honey Mommy partner program: your own discount code and 10% commission on every sale.* / Bouton **Become a partner** → page Become a Partner
10. **Email signup** (scheme 2) : **Get 10% off your first order** / *Join for new arrivals, gift ideas and mom-tested tips.* Avec Shopify Email, crée l'automatisation « Welcome » qui envoie le code `WELCOME10`.
11. **Footer** : menus Shop (collections) · Help (FAQ, Shipping, Returns, Contact) · About (Our story, Become a Partner, Privacy, Terms) · paiements affichés · réseaux sociaux.

## Menu principal (Online Store → Navigation → Main menu)

- **Pregnancy**
- **Postpartum & Nursing**
- **Baby** → Clothing · Bath & Care · Feeding · Play & Teething · Nursery
- **Gift Sets**
- **Under $30**
- **Partners** → page Become a Partner

## Page produit (Customize → Products → Default product)

Blocs dans l'ordre :
1. Title
2. Price
3. **Text** : `🇺🇸 Ships from a US warehouse in 1–2 business days · Free shipping`
4. Variant picker (style *pills*)
5. Quantity selector
6. Buy buttons (avec dynamic checkout buttons)
7. Description
8. **Collapsible row** « Shipping & returns » → page Shipping
9. **Collapsible row** « Safety & care » → texte : *Always supervise baby during use. Follow the care label. Questions? hello@ (ton courriel)*
10. Share

Sous la page produit : section **Product recommendations** (« You may also like ») et le widget d'avis **Judge.me**.

## Applications gratuites à installer

| Application | Rôle |
|---|---|
| **TopDawg** | Produits, stocks, commandes et suivi automatiques |
| **UpPromote** (Free) | Codes promo et commissions des influenceuses |
| **Judge.me** (Free) | Avis clients avec photos, demandés automatiquement |
| **Shopify Email** | Courriels de bienvenue et de relance |
| **Google & YouTube** | Produits gratuits dans Google Shopping |
| **Pinterest**, **TikTok**, **Facebook & Instagram** | Boutiques sur les réseaux sociaux |
| **Shopify Search & Discovery** | Filtres (prix, catégorie, couleur) et recherche améliorée |
| **Shopify Inbox** | Clavardage avec les clientes, avec réponses automatiques aux questions fréquentes |
