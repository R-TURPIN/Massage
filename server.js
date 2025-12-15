require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
// On récupère la clé privée depuis les variables d'environnement Coolify
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.static('public')); // Sert les fichiers du dossier public
app.use(express.json());
app.use(cors());

// --- TES PRODUITS (Modifie-les ici) ---
// C'est la source de vérité. Le client ne voit pas ça directement.
const INVENTORY = {
    1: { name: "Huile Essentielle Lavande", price: 2490, image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=400" }, // Prix en centimes (24.90€)
    2: { name: "Rouleau de Jade", price: 1999, image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400" },
    3: { name: "Pierres Chaudes Basalte", price: 8900, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400" },
    4: { name: "Bougie Massage Karité", price: 3450, image: "https://images.unsplash.com/photo-1602167386766-3d2b07e0c8ac?w=400" }
};

// Route pour envoyer la clé publique au frontend
app.get('/config', (req, res) => {
    res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// Route pour donner la liste des produits au site
app.get('/products', (req, res) => {
    // On convertit l'objet INVENTORY en liste pour l'affichage
    const productList = Object.entries(INVENTORY).map(([id, product]) => ({
        id: id,
        name: product.name,
        price: product.price / 100, // On remet en euros pour l'affichage
        image: product.image
    }));
    res.json(productList);
});

// Route de création de session de paiement (Le coeur du système)
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body; // Le frontend envoie juste [{id: 1, quantity: 2}]

        // On reconstruit la commande avec les VRAIS prix du serveur (Sécurité)
        const lineItems = items.map(item => {
            const storeItem = INVENTORY[item.id];
            return {
                price_data: {
                    currency: 'eur',
                    product_data: { name: storeItem.name, images: [storeItem.image] },
                    unit_amount: storeItem.price, // Prix en centimes venant du serveur
                },
                quantity: item.quantity,
            };
        });

        // On crée la session Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            success_url: `${process.env.DOMAIN_URL}/success.html`,
            cancel_url: `${process.env.DOMAIN_URL}/cancel.html`,
        });

        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Boutique lancée sur le port ${PORT}`));
