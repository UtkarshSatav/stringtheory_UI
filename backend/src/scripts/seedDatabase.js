// seedDatabase.js
// Run this script from the `backend/` directory using ts-node: npx ts-node src/scripts/seedDatabase.ts
// Or copy it up to regular js and run it to easily seed products into firestore.

require('dotenv').config();
const admin = require('firebase-admin');

// Service Account Credentials path
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    : require('/Users/utkarsh/Downloads/stringtheory-oms-firebase-adminsdk-fbsvc-b12f813f4c.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// ---------------------------------------------------------
// Paste in the static arrays from App.jsx here
// ---------------------------------------------------------

const necklaceItems = [
    { id: 'necklace-1', category: 'Necklace', title: 'CREAM FANCY SHELL NECKLACE', subtitle: 'FOR WOMEN', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/necklace-1.png', bgColor: '#fff' },
    { id: 'necklace-2', category: 'Necklace', title: 'THE SEASHELL SYMPHONY', subtitle: 'NECKLACE', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/necklace-2.png', bgColor: '#fff' },
    { id: 'necklace-3', category: 'Necklace', title: 'MULTISTRAND PENDANT', subtitle: 'NECKLACE', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/necklace-3.png', bgColor: '#fff' },
    { id: 'necklace-4', category: 'Necklace', title: 'GOLD TONED & BROWN', subtitle: 'HANDCRAFTED', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/necklace-4.png', bgColor: '#fff' },
    { id: 'necklace-5', category: 'Necklace', title: 'GOLDEN SUNRISE MULTISTRAND', subtitle: 'NECKLACE', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/necklace-5.png', bgColor: '#fff' },
    { id: 'necklace-6', category: 'Necklace', title: 'MULTICOLORED BRIGHT SHELL', subtitle: 'LONG NECKLACE', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/necklace-6.png', bgColor: '#fff' },
    { id: 'necklace-7', category: 'Necklace', title: 'MULTI-STRAND PASTEL', subtitle: 'SYMPHONY NECKLACE', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/necklace-7.png', bgColor: '#fff' },
    { id: 'necklace-8', category: 'Necklace', title: 'HANDCRAFTED MULTISTRAND', subtitle: 'BEADED NECKLACE', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/necklace-8.png', bgColor: '#fff' },
    { id: 'necklace-9', category: 'Necklace', title: 'PURPLE RAIN NECKLACE', subtitle: 'ELEGANT', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/necklace-9.png', bgColor: '#fff' },
    { id: 'necklace-10', category: 'Necklace', title: 'MULTI COLORED GLASS', subtitle: 'BEADED NECKLACE', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/necklace-10.png', bgColor: '#fff' },
    { id: 'necklace-11', category: 'Necklace', title: 'GOLD & BRONZE HEMATITE', subtitle: 'BEADED LONG', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/necklace-11.png', bgColor: '#fff' },
    { id: 'necklace-12', category: 'Necklace', title: 'TURQUOISE BEADED FANCY', subtitle: 'LONG NECKLACE', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/necklace-12.png', bgColor: '#fff' },
];

const braceletItems = [
    { id: 'bracelet-1', category: 'Bracelet', title: 'BROWN AND IVORY SHINY STRETCH BRACELET', subtitle: 'STRETCH BRACELET', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/bracelet-item-1.png', bgColor: '#efe8d8' },
    { id: 'bracelet-2', category: 'Bracelet', title: 'SILVER SHINY BEADS RHODIUM PLATED CUFF', subtitle: 'CUFF BRACELET', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/bracelet-item-2.png', bgColor: '#efe8d8' },
    { id: 'bracelet-3', category: 'Bracelet', title: 'TURQUOISE AND LIGHT GREEN SHINY STRETCH', subtitle: 'STRETCH BRACELET', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/bracelet-item-3.png', bgColor: '#efe8d8' },
    { id: 'bracelet-4', category: 'Bracelet', title: 'BLACK SHINY BEADS RHODIUM PLATED CUFF', subtitle: 'CUFF BRACELET', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/bracelet-item-4.png', bgColor: '#efe8d8' },
    { id: 'bracelet-5', category: 'Bracelet', title: 'IVORY LUSTRE AND TOPAZ COLOR CONTEMPORARY', subtitle: 'BRACELET', price: '₹499', originalPrice: '₹1,799', discount: '72% OFF', image: '/images/bracelet-item-5.png', bgColor: '#efe8d8' },
    { id: 'bracelet-6', category: 'Bracelet', title: 'BLACK AND SILVER COLOUR CONTEMPORARY', subtitle: 'BRACELET', price: '₹499', originalPrice: '₹1,799', discount: '72% OFF', image: '/images/bracelet-item-6.png', bgColor: '#efe8d8' },
    { id: 'bracelet-7', category: 'Bracelet', title: 'SHADES OF RED CONTEMPORARY SPIRAL', subtitle: 'BRACELET', price: '₹499', originalPrice: '₹1,799', discount: '72% OFF', image: '/images/bracelet-item-7.png', bgColor: '#efe8d8' },
    { id: 'bracelet-8', category: 'Bracelet', title: 'OXIDIZED SILVER ETHNIC FANCY FLOWER', subtitle: 'CUFF', price: '₹599', originalPrice: '₹1,249', discount: '52% OFF', image: '/images/bracelet-item-8.png', bgColor: '#efe8d8' },
    { id: 'bracelet-9', category: 'Bracelet', title: 'SHADES OF ORANGE AND CORAL LUSTRE', subtitle: 'BRACELET', price: '₹499', originalPrice: '₹1,799', discount: '72% OFF', image: '/images/bracelet-item-9.png', bgColor: '#efe8d8' },
    { id: 'bracelet-10', category: 'Bracelet', title: 'SHADES OF CORAL AND RED CONTEMPORARY', subtitle: 'BRACELET', price: '₹499', originalPrice: '₹1,799', discount: '72% OFF', image: '/images/bracelet-item-10.png', bgColor: '#efe8d8' },
    { id: 'bracelet-11', category: 'Bracelet', title: 'TURQUOISE AND GREEN BEADED BRACELET', subtitle: 'BRACELET', price: '₹499', originalPrice: '₹1,598', discount: '68% OFF', image: '/images/bracelet-item-11.png', bgColor: '#efe8d8' },
    { id: 'bracelet-12', category: 'Bracelet', title: 'OCEAN BLOOM BRACELET', subtitle: 'BRACELET', price: '₹499', originalPrice: '₹1,598', discount: '68% OFF', image: '/images/bracelet-item-12.png', bgColor: '#efe8d8' },
    { id: 'bracelet-13', category: 'Bracelet', title: 'MULTICOLOR SET OF 6 BRACELET', subtitle: 'BRACELET', price: '₹699', originalPrice: '₹1,999', discount: '65% OFF', image: '/images/bracelet-item-13.png', bgColor: '#efe8d8' },
    { id: 'bracelet-14', category: 'Bracelet', title: 'YELLOW AND RED BEADED BRACELET', subtitle: 'BRACELET', price: '₹499', originalPrice: '₹1,598', discount: '68% OFF', image: '/images/bracelet-item-14.png', bgColor: '#efe8d8' },
    { id: 'bracelet-15', category: 'Bracelet', title: 'BEIGE AND RED BEADED BRACELET', subtitle: 'BRACELET', price: '₹499', originalPrice: '₹1,598', discount: '68% OFF', image: '/images/bracelet-item-15.png', bgColor: '#efe8d8' },
];

const chokerItems = [
    { id: 'choker-1', category: 'Choker', title: 'MAROON AMYTHYST BEADED CROSHE CHOKER', subtitle: 'CHOKER', price: '₹599', originalPrice: '₹1,249', discount: '52% OFF', image: '/images/choker-item-1.png', bgColor: '#e8dfd0' },
    { id: 'choker-2', category: 'Choker', title: 'GREEN FANCY BEADED CROSHE CHOKER', subtitle: 'CHOKER', price: '₹599', originalPrice: '₹1,249', discount: '52% OFF', image: '/images/choker-item-2.png', bgColor: '#e8dfd0' },
    { id: 'choker-3', category: 'Choker', title: 'BLACK AND WHITE BEADED CROSHE CHOKER', subtitle: 'CHOKER', price: '₹599', originalPrice: '₹1,249', discount: '52% OFF', image: '/images/choker-item-3.png', bgColor: '#e8dfd0' },
    { id: 'choker-4', category: 'Choker', title: 'AZURE EMBRACE CHOKER NECKLACE', subtitle: 'CHOKER', price: '₹499', originalPrice: '₹999', discount: '50% OFF', image: '/images/choker-item-4.png', bgColor: '#e8dfd0' },
    { id: 'choker-5', category: 'Choker', title: 'YELLOW BEADED CROSHE CHOKER FOR WOMEN', subtitle: 'CHOKER', price: '₹599', originalPrice: '₹1,249', discount: '52% OFF', image: '/images/choker-item-5.png', bgColor: '#e8dfd0' },
];


const earringItems = [
    { id: 'earring-1', category: 'Earring', title: 'MULTICOLORED STATEMENT FANCY DANGLE EARRING', subtitle: 'EARRING', price: '₹449', originalPrice: '₹1,698', discount: '73% OFF', image: '/images/earring-item-1.png', bgColor: '#1a1a1a', isDark: true },
    { id: 'earring-2', category: 'Earring', title: 'MULTICOLORED DANGLE FANCY EARRING', subtitle: 'EARRING', price: '₹449', originalPrice: '₹1,698', discount: '73% OFF', image: '/images/earring-item-2.png', bgColor: '#1a1a1a', isDark: true },
    { id: 'earring-3', category: 'Earring', title: 'NAVY BLUE DANGLE ETHNIC FANCY EARRING', subtitle: 'EARRING', price: '₹449', originalPrice: '₹1,698', discount: '73% OFF', image: '/images/earring-item-3.png', bgColor: '#1a1a1a', isDark: true },
    { id: 'earring-4', category: 'Earring', title: 'BLACK & GOLD SHINY FANCY DANGLE EARRING', subtitle: 'EARRING', price: '₹449', originalPrice: '₹1,698', discount: '73% OFF', image: '/images/earring-item-4.png', bgColor: '#1a1a1a', isDark: true },
    { id: 'earring-5', category: 'Earring', title: 'BROWN & GOLD SHINY FANCY DANGLE EARRING', subtitle: 'EARRING', price: '₹449', originalPrice: '₹1,698', discount: '73% OFF', image: '/images/earring-item-5.png', bgColor: '#1a1a1a', isDark: true },
    { id: 'earring-6', category: 'Earring', title: 'BROWN & GOLD SHINY DANGLE EARRING', subtitle: 'EARRING', price: '₹449', originalPrice: '₹1,698', discount: '73% OFF', image: '/images/earring-item-6.png', bgColor: '#1a1a1a', isDark: true },
    { id: 'earring-7', category: 'Earring', title: 'OLIVE SHINY DANGLE FANCY EARRING', subtitle: 'EARRING', price: '₹449', originalPrice: '₹1,698', discount: '73% OFF', image: '/images/earring-item-7.png', bgColor: '#1a1a1a', isDark: true },
    { id: 'earring-8', category: 'Earring', title: 'SILVER SHINY DANGLE FANCY EARRING', subtitle: 'EARRING', price: '₹449', originalPrice: '₹1,698', discount: '73% OFF', image: '/images/earring-item-8.png', bgColor: '#1a1a1a', isDark: true },
    { id: 'earring-9', category: 'Earring', title: 'RED DANGLE FANCY EARRING FOR WOMEN', subtitle: 'EARRING', price: '₹449', originalPrice: '₹1,698', discount: '73% OFF', image: '/images/earring-item-9.png', bgColor: '#1a1a1a', isDark: true },
    { id: 'earring-10', category: 'Earring', title: 'YELLOW & RED DANGLE FANCY EARRING', subtitle: 'EARRING', price: '₹449', originalPrice: '₹1,698', discount: '73% OFF', image: '/images/earring-item-10.png', bgColor: '#1a1a1a', isDark: true },
];

const allProducts = [...necklaceItems, ...braceletItems, ...chokerItems, ...earringItems];

const cleanPriceString = (str) => {
    if (!str) return 0;
    // Remove all non-numeric characters except decimals
    const num = str.replace(/[^\d.]/g, '');
    return parseFloat(num) || 0;
};

const mapToModel = (prod) => {
    return {
        title: prod.title,
        slug: prod.id, // we'll use original ID as slug to not break existing frontend URLs on update
        sku: prod.id.toUpperCase(),
        description: prod.description || `Beautiful handcrafted ${prod.category} for you to enjoy.`,
        price: cleanPriceString(prod.price),
        compareAtPrice: cleanPriceString(prod.originalPrice) > 0 ? cleanPriceString(prod.originalPrice) : undefined,
        category: prod.category,
        image: prod.image || '',
        images: prod.image ? [prod.image] : [],
        stockQuantity: 100, // seed 100 stock per item
        active: true,
        metadata: {
            subtitle: prod.subtitle,
            bgColor: prod.bgColor,
            discount: prod.discount,
            isDark: prod.isDark || false
        }
    };
};

async function seed() {
    const productsRef = db.collection('products');
    let count = 0;

    console.log(`Starting to seed ${allProducts.length} products...`);

    for (const prod of allProducts) {
        const productData = mapToModel(prod);
        try {
            // We use standard id as document ID 
            await productsRef.doc(prod.id).set({
                ...productData,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            count++;
            if (count % 5 === 0) console.log(`Seeded ${count} items...`);
        } catch (err) {
            console.error(`Error seeding ${prod.id}:`, err.message);
        }
    }

    console.log(`\n✅ Finished matching and seeding! Total inserted: ${count}`);
    process.exit(0);
}

seed();
