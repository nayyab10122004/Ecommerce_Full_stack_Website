require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  { id: 1, title: "Wireless Noise-Cancelling Headphones", brand: "Sony", price: 99, oldPrice: 129, rating: 4.8, reviews: 312, orders: 450, ship: true, condition: "new", category: "electronics", features: ["Wireless", "Noise Cancelling"], img: "images/headphone.png", desc: "Premium over-ear headphones with 30-hour battery life, deep bass, and crystal-clear sound.", tags: "headphones audio wireless sony" },
  { id: 2, title: "Men's Classic Oxford Shirt", brand: "Generic", price: 28, oldPrice: 40, rating: 4.5, reviews: 198, orders: 320, ship: true, condition: "new", category: "fashion", features: [], img: "images/darkbt.png", desc: "100% cotton slim-fit Oxford shirt. Versatile for office or casual outings.", tags: "shirt fashion clothing men oxford" },
  { id: 3, title: "The Art of Clean Code", brand: "Generic", price: 22, oldPrice: 30, rating: 4.9, reviews: 564, orders: 780, ship: true, condition: "new", category: "books", features: [], img: "images/bookstand.jpg", desc: "A practical guide to writing readable, maintainable, and efficient code.", tags: "book programming coding software" },
  { id: 4, title: "Smart LED Desk Lamp", brand: "Generic", price: 45, oldPrice: 60, rating: 4.5, reviews: 310, orders: 480, ship: true, condition: "new", category: "home", features: [], img: "images/lamp.png", desc: "LED desk lamp with 5 brightness levels, touch control, USB charging port.", tags: "lamp light home desk led" },
  { id: 5, title: "LEGO Architecture Set", brand: "Generic", price: 85, oldPrice: 110, rating: 4.8, reviews: 176, orders: 250, ship: true, condition: "new", category: "toys", features: [], img: "images/plant.png", desc: "850-piece set inspired by world landmarks. Great for kids 10+.", tags: "lego toys building blocks architecture" },
  { id: 6, title: "Mechanical Gaming Keyboard", brand: "Generic", price: 99, oldPrice: 1099, rating: 4.6, reviews: 389, orders: 520, ship: true, condition: "new", category: "electronics", features: ["USB-C", "Wireless"], img: "images/laptop.png", desc: "RGB backlit mechanical keyboard with blue switches. Anti-ghosting technology.", tags: "keyboard gaming mechanical electronics" },
  { id: 7, title: "Women's Yoga Leggings", brand: "Generic", price: 28, oldPrice: 40, rating: 4.5, reviews: 234, orders: 380, ship: true, condition: "new", category: "sports", features: [], img: "images/bluet.png", desc: "High-waist compression leggings with 4-way stretch fabric. Moisture-wicking.", tags: "leggings yoga sports women gym" },
  { id: 8, title: "Stainless Steel Water Bottle", brand: "Generic", price: 5, oldPrice: 75, rating: 4.7, reviews: 512, orders: 890, ship: true, condition: "new", category: "sports", features: [], img: "images/bag.png", desc: "Double-wall insulated 1-litre bottle. Keeps drinks cold 24 hours.", tags: "bottle water sports stainless steel" },
  { id: 9, title: "Indoor Snake Plant", brand: "Generic", price: 20, oldPrice: null, rating: 4.3, reviews: 98, orders: 150, ship: true, condition: "new", category: "home", features: [], img: "images/plant.png", desc: "Low-maintenance air-purifying plant. Comes in a ceramic pot.", tags: "plant home indoor snake plant" },
  { id: 10, title: "Bluetooth Portable Speaker", brand: "Sony", price: 99, oldPrice: 129, rating: 4.5, reviews: 301, orders: 430, ship: true, condition: "new", category: "electronics", features: ["Wireless", "Portable"], img: "images/whiteheadphone.png", desc: "360-degree surround sound with 20-hour playtime. Waterproof IPX7.", tags: "speaker bluetooth audio portable sony" },
  { id: 11, title: "Leather Wallet — Brown Premium", brand: "Generic", price: 25, oldPrice: 35, rating: 4.5, reviews: 210, orders: 430, ship: true, condition: "new", category: "fashion", features: ["Portable"], img: "images/wallet.png", desc: "Slim genuine leather bifold wallet with RFID blocking, 6 card slots.", tags: "wallet leather fashion accessories" },
  { id: 12, title: "Blue iPhone Case — Shockproof", brand: "Generic", price: 149, oldPrice: 199, rating: 4.2, reviews: 95, orders: 540, ship: true, condition: "new", category: "mobile", features: ["Portable"], img: "images/blueiphone.png", desc: "Military-grade shockproof iPhone case with raised lip screen protection.", tags: "iphone case mobile phone accessories" },
  { id: 13, title: "Light Blue Shirt — Soft Fabric", brand: "Generic", price: 28, oldPrice: 40, rating: 4.3, reviews: 340, orders: 870, ship: true, condition: "new", category: "fashion", features: [], img: "images/bluet.png", desc: "Premium light blue shirt with soft fabric, breathable material.", tags: "shirt fashion clothing light blue" },
  { id: 14, title: "Travel Bag — Waterproof Backpack", brand: "Generic", price: 5, oldPrice: 75, rating: 4.6, reviews: 420, orders: 650, ship: true, condition: "new", category: "fashion", features: ["Portable"], img: "images/bag.png", desc: "35L waterproof travel backpack with USB charging port, anti-theft zipper.", tags: "bag backpack fashion travel waterproof" },
  { id: 15, title: "Action Camera — 4K Waterproof", brand: "GoPro", price: 299, oldPrice: 349, rating: 4.8, reviews: 670, orders: 480, ship: true, condition: "new", category: "electronics", features: ["4K", "Wireless", "Portable"], img: "images/camra.png", desc: "4K action camera with electronic image stabilization, voice control.", tags: "camera action 4k electronics gopro" },
  { id: 16, title: "Winter Coat — Wool Blend", brand: "Generic", price: 126, oldPrice: 180, rating: 4.5, reviews: 130, orders: 210, ship: true, condition: "new", category: "fashion", features: [], img: "images/coat.png", desc: "Warm double-breasted wool blend coat with notch lapel.", tags: "coat fashion winter jacket wool" },
  { id: 17, title: "Coffee Maker — Auto Drip 12-Cup", brand: "Generic", price: 79, oldPrice: 99, rating: 4.4, reviews: 290, orders: 370, ship: true, condition: "new", category: "home", features: [], img: "images/coffeemaker.png", desc: "Programmable 12-cup drip coffee maker with keep-warm plate.", tags: "coffee maker home kitchen appliance" },
  { id: 18, title: "Dark Blue Shirt — Premium Cotton", brand: "Generic", price: 28, oldPrice: 40, rating: 4.6, reviews: 510, orders: 730, ship: true, condition: "new", category: "fashion", features: [], img: "images/darkbt.png", desc: "Premium dark blue shirt with soft breathable fabric, slim fit.", tags: "shirt fashion clothing dark blue" },
  { id: 19, title: "Electric Kettle — 1.7L Stainless", brand: "Generic", price: 35, oldPrice: 80, rating: 4.3, reviews: 380, orders: 920, ship: true, condition: "new", category: "home", features: [], img: "images/electrickattle.png", desc: "Fast-boil 1.7L stainless steel electric kettle with auto shutoff.", tags: "kettle electric home kitchen appliance" },
  { id: 20, title: "Denim Jacket — Classic Blue", brand: "Generic", price: 65, oldPrice: 90, rating: 4.4, reviews: 180, orders: 260, ship: true, condition: "new", category: "fashion", features: [], img: "images/jacket.jpg", desc: "Classic unisex denim jacket with button closure, chest pockets.", tags: "jacket denim fashion clothing" },
  { id: 21, title: "Desk Lamp — LED Adjustable", brand: "Generic", price: 45, oldPrice: 60, rating: 4.5, reviews: 310, orders: 480, ship: true, condition: "new", category: "home", features: [], img: "images/lamp.png", desc: "LED desk lamp with 5 brightness levels, touch control, USB charging port.", tags: "lamp light home desk led" },
  { id: 22, title: "Camping Mat — Lightweight Foldable", brand: "Generic", price: 30, oldPrice: null, rating: 4.1, reviews: 75, orders: 120, ship: true, condition: "new", category: "home", features: [], img: "images/matters.png", desc: "Soft, washable and lightweight camping mat. Easy to fold and carry.", tags: "mat camping home travel outdoor" },
  { id: 23, title: "Smartphone — 6.7 inch AMOLED", brand: "Generic", price: 299, oldPrice: 349, rating: 4.8, reviews: 980, orders: 1200, ship: true, condition: "new", category: "mobile", features: ["4K", "Wireless"], img: "images/phone.png", desc: "6.7-inch AMOLED display, 108MP triple camera, 5000mAh battery.", tags: "phone smartphone mobile 4k amoled" },
  { id: 24, title: "Cooking Pot — Non-stick Set", brand: "Generic", price: 60, oldPrice: 85, rating: 4.5, reviews: 220, orders: 400, ship: true, condition: "new", category: "home", features: [], img: "images/pot.png", desc: "5-piece non-stick cookware set with heat-resistant handles.", tags: "pot cookware home kitchen non-stick" },
  { id: 25, title: "Red iPhone Case — Protective", brand: "Generic", price: 149, oldPrice: 199, rating: 4.2, reviews: 110, orders: 620, ship: true, condition: "new", category: "mobile", features: ["Portable"], img: "images/rediphone.png", desc: "Slim-fit hard shell iPhone case in vibrant red with matte finish.", tags: "iphone case red mobile accessories" },
  { id: 26, title: "Shorts — Dry Fit Athletic", brand: "Generic", price: 28, oldPrice: 40, rating: 4.3, reviews: 160, orders: 490, ship: true, condition: "new", category: "fashion", features: [], img: "images/shorts.png", desc: "Lightweight quick-dry athletic shorts with built-in liner.", tags: "shorts fashion sport athletic" },
  { id: 27, title: "3-Seater Sofa — Modern Brown", brand: "Generic", price: 650, oldPrice: 850, rating: 4.6, reviews: 75, orders: 90, ship: false, condition: "new", category: "home", features: [], img: "images/sofa.png", desc: "Contemporary 3-seater sofa upholstered in premium brown fabric.", tags: "sofa furniture home living" },
  { id: 28, title: "Sofa Chair — Accent Armchair", brand: "Generic", price: 320, oldPrice: 420, rating: 4.4, reviews: 60, orders: 70, ship: false, condition: "new", category: "home", features: [], img: "images/sofachair.png", desc: "Mid-century modern accent armchair with button-tufted back.", tags: "sofachair armchair home furniture" },
  { id: 29, title: "Tablet — 10 inch HD Display", brand: "Generic", price: 299, oldPrice: 349, rating: 4.5, reviews: 430, orders: 560, ship: true, condition: "new", category: "electronics", features: ["Wireless", "USB-C"], img: "images/tab.png", desc: "10-inch HD IPS tablet with octa-core processor, 4GB RAM.", tags: "tablet electronics tab android" },
  { id: 30, title: "White Headphones — Over Ear", brand: "Generic", price: 99, oldPrice: 129, rating: 4.6, reviews: 720, orders: 940, ship: true, condition: "new", category: "audio", features: ["Wireless", "Noise Cancelling"], img: "images/whiteheadphone.png", desc: "Premium white over-ear headphones with 40mm drivers, foldable design.", tags: "headphones audio white wireless" },
  { id: 31, title: "White Watch — Minimalist Design", brand: "Generic", price: 89, oldPrice: 119, rating: 4.3, reviews: 195, orders: 310, ship: true, condition: "new", category: "wearable", features: [], img: "images/whitewatch.png", desc: "Clean minimalist watch with white dial, stainless steel case.", tags: "watch wearable white minimalist" },
  { id: 32, title: "Bookstand — Adjustable Desk", brand: "Generic", price: 22, oldPrice: 30, rating: 4.2, reviews: 88, orders: 200, ship: true, condition: "new", category: "home", features: [], img: "images/bookstand.jpg", desc: "Ergonomic adjustable bookstand for reading, cooking, and tablet use.", tags: "bookstand home desk reading" },
  { id: 33, title: "Ballet Shoes — Pink Satin", brand: "Generic", price: 25, oldPrice: 35, rating: 4.3, reviews: 75, orders: 110, ship: true, condition: "new", category: "fashion", features: [], img: "images/ballet.png", desc: "Professional ballet shoes with soft pink satin and ribbon ties.", tags: "ballet shoes fashion dance" },
  { id: 34, title: "LED Light Bulb — Energy Saver", brand: "Generic", price: 49, oldPrice: 9, rating: 4.0, reviews: 200, orders: 450, ship: true, condition: "new", category: "home", features: [], img: "images/bulb.png", desc: "Energy-efficient LED light bulb with warm white glow and long lifespan.", tags: "bulb led light home" }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { products };
}

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const productsToInsert = products.map((p) => ({
      name: p.title,
      price: p.price,
      oldPrice: p.oldPrice,
      image: p.img,
      description: p.desc,
      brand: p.brand,
      features: p.features,
      condition: p.condition,
      orders: p.orders,
      ship: p.ship,
      tags: p.tags,
      category:
        p.category === 'electronics' ? 'Electronics' :
        p.category === 'fashion'     ? 'Clothing' :
        p.category === 'books'       ? 'Books' :
        p.category === 'home'        ? 'Home & Garden' :
        p.category === 'sports'      ? 'Sports' :
        p.category === 'beauty'      ? 'Beauty' :
        p.category === 'toys'        ? 'Toys' :
        p.category === 'audio'       ? 'Electronics' :
        p.category === 'mobile'      ? 'Electronics' :
        p.category === 'wearable'    ? 'Electronics' :
                                       'Automotive',
      stock: 100,
      featured: false,
      rating: p.rating,
      numReviews: p.reviews
    }));

    const inserted = await Product.insertMany(productsToInsert);
    console.log(`✅ Inserted ${inserted.length} products`);

    const adminPassword = await bcrypt.hash('admin123', 12);
    await User.create({ name: 'Admin User', email: 'admin@shopverse.com', password: adminPassword, role: 'admin' });

    const userPassword = await bcrypt.hash('user123', 12);
    await User.create({ name: 'Nayyab', email: 'nayyab@example.com', password: userPassword, role: 'user' });

    console.log('✅ Created admin: admin@shopverse.com / admin123');
    console.log('✅ Created user: nayyab@example.com / user123');
    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seedDB();