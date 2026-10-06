import { Product, Coupon, Review, StoreSettings, ExpenseRecord } from '../types';

export const INITIAL_SETTINGS: StoreSettings = {
  businessName: "Gulrang Antique",
  tagline: "Curated Antiques & Handcrafted Botanical Art by Salman Khan",
  address: "Gulrang Antique Atelier, Salon & Gallery, Gulberg III, Lahore, Pakistan",
  phone: "+92 314 9281875",
  email: "Slmnkhn411@gmail.com",
  whatsapp: "+923149281875",
  taxRatePercent: 5,
  freeShippingThreshold: 15000,
  standardShippingFee: 450,
  expressShippingFee: 1200,
  currency: "PKR",
  exchangeRates: {
    PKR: 1,
    USD: 0.0036,
    GBP: 0.0028,
    AED: 0.0132,
    EUR: 0.0033
  },
  invoicePrefix: "INV-2026-",
  nextInvoiceSequence: 10042
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    name: "Golden Botanical Resin Art Decorative Plate",
    slug: "golden-botanical-resin-art-plate",
    sku: "HE-RES-0101",
    category: "Resin Art",
    subcategory: "Decorative Plates",
    price: 16500,
    salePrice: 14200,
    costPrice: 6500,
    stock: 7,
    condition: "Handmade",
    material: "UV-Resistant Bio-Resin, 24K Gold Leaf, Preserved White Orchids & Baby's Breath",
    dimensions: '14" Diameter × 1.2" Depth (35.5 cm)',
    weight: "1.4 kg",
    color: "Amber Gold & Ivory Pearl",
    tags: ["resin plate", "dried flowers", "gold accent", "handcrafted", "table centerpiece"],
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    isHandmade: true,
    story: "Every flower in this piece was hand-picked at peak bloom in our alpine nursery, preserved using our slow-dessication silica method, and suspended in four optical crystal resin pours. Subtle 24K gold foil swirls capture ambient light with warm elegance.",
    description: "A signature Heritage & Elegance decorative plate featuring hand-embedded botanicals and radiant gold leaf accents. Suitable as a luxury dining centerpiece, console focal point, or stand-mounted heirloom display.",
    images: [
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.9,
    reviewCount: 38,
    careInstructions: "Gently wipe with a soft microfiber cloth. Avoid abrasive cleaners and prolonged direct sunlight.",
    estimatedDelivery: "3 to 5 business days",
    productionTime: "Handmade in batches of 10",
    createdAt: "2026-03-01T10:00:00Z"
  },
  {
    id: "prod-002",
    name: "1890s Venetian Revival Resin & Gold Leaf Botanical Salver",
    slug: "1890s-venetian-revival-resin-gold-salver",
    sku: "HE-ANT-0019",
    category: "One of a Kind",
    subcategory: "Antique Décor",
    price: 68000,
    costPrice: 32000,
    stock: 1,
    condition: "Original Antique",
    material: "Late 19th-Century Repoussé Brass Rim, Crystal Cured Resin with Preserved Victorian Larkspur",
    dimensions: '16.5" Diameter × 2" Depth (42 cm)',
    weight: "2.8 kg",
    color: "Aged Patina Brass & Indigo Violet",
    tags: ["one of a kind", "antique", "venetian", "rare collectible", "certificate"],
    isOneOfAKind: true,
    isAntique: true,
    certificateNumber: "CERT-HE-2026-889",
    provenance: "Acquired from an estate gallery in Florence, Italy; archival brass frame preserved and lovingly encased with hand-harvested botanicals by master artisan Khalid Farooq.",
    story: "This is a single-piece artifact. The antique brass border was crafted in Venice circa 1890 with hand-chased acanthus leaves. Our senior artisan preserved its authentic patina while creating an optical resin lake in the center filled with deep blue larkspur petals and hand-applied gold leaf veining.",
    description: "An exceptional, authentic one-of-a-kind heirloom. Once sold, this exact configuration will never be repeated. Accompanied by a wax-sealed Certificate of Authenticity and historical provenance card.",
    images: [
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 5.0,
    reviewCount: 12,
    careInstructions: "Museum-grade care: Dust with natural feather or dry camel-hair brush. Clean rim with specialized brass cloth only.",
    estimatedDelivery: "White-Glove Insured Delivery (2-4 Days)",
    productionTime: "Original Antique Artifact",
    createdAt: "2026-02-14T08:30:00Z"
  },
  {
    id: "prod-003",
    name: "Pressed Botanical Flora Decorative Tray with Brass Handles",
    slug: "pressed-botanical-flora-decorative-tray-brass",
    sku: "HE-TRY-0402",
    category: "Decorative Trays",
    subcategory: "Resin Art",
    price: 18900,
    salePrice: 16500,
    costPrice: 7200,
    stock: 9,
    condition: "Handmade",
    material: "Eco-Epoxy Resin, Solid Walnut Wood Base, Antiqued Cast Brass Handles, Pressed Wildflowers",
    dimensions: '18" × 12" × 2.5" (45.7 × 30.5 × 6.3 cm)',
    weight: "1.9 kg",
    color: "Warm Walnut, Champagne Gold & Cream Petals",
    tags: ["serving tray", "decorative tray", "brass handles", "resin flowers", "vanity tray"],
    isFeatured: true,
    isBestSeller: true,
    isHandmade: true,
    story: "Designed for discerning coffee tables and dressing vanities, combining rich dark walnut with a glossy, glass-like resin surface preserving delicate mountain ferns, Queen Anne's lace, and real dried hydrangea blossoms.",
    description: "Handcrafted decorative serving and display tray featuring custom-cast antique brass handles and real botanicals sealed under crystal resin. Perfect for perfume displays, luxury tea service, or living room staging.",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.8,
    reviewCount: 26,
    careInstructions: "Wipe with damp cloth and dry immediately. Heat resistant up to 65°C.",
    estimatedDelivery: "3 to 5 business days",
    productionTime: "4 days hand-curing",
    createdAt: "2026-02-20T11:00:00Z"
  },
  {
    id: "prod-004",
    name: "Florentine Gilded Acanthus Wall Décor Plaque",
    slug: "florentine-gilded-acanthus-wall-decor",
    sku: "HE-WAL-0708",
    category: "Wall Art",
    subcategory: "Antique Décor",
    price: 24500,
    costPrice: 9800,
    stock: 4,
    condition: "Antique-Inspired",
    material: "High-Density Sculpted Gypsum, Distressed Gold Leaf, Burnt Umber Glaze",
    dimensions: '22" High × 15" Wide × 3" Relief (56 × 38 × 7.6 cm)',
    weight: "3.2 kg",
    color: "Florentine Antique Gold & Muted Verdigris",
    tags: ["wall plaque", "antique gold", "florentine", "relief sculpture", "luxury wall art"],
    isAntique: true,
    story: "Cast from an original 18th-century Florentine architectural moulding, each plaque is hand-gilded with multiple layers of metal leaf before undergoing an authentic distressed patina process.",
    description: "Stately antique-inspired wall relief featuring classical acanthus motifs and aged gilding. Creates an immediate focal point in entryways, dining galleries, and luxury library walls.",
    images: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.9,
    reviewCount: 19,
    careInstructions: "Dust regularly with soft brush. Hardware for heavy wall anchoring included.",
    estimatedDelivery: "4 to 6 business days",
    productionTime: "Hand-finished",
    createdAt: "2026-01-18T14:20:00Z"
  },
  {
    id: "prod-005",
    name: "Celestial Gold & Midnight Azure Handcrafted Resin Clock",
    slug: "celestial-gold-midnight-azure-resin-clock",
    sku: "HE-CLK-0205",
    category: "Resin Art",
    subcategory: "Home Accessories",
    price: 28000,
    salePrice: 24900,
    costPrice: 11000,
    stock: 5,
    condition: "Handmade",
    material: "Epoxy Resin Geode, Crushed Raw Quartz Crystals, 24K Leaf Inlay, Silent German Quartz Movement",
    dimensions: '18" Diameter × 1.5" Depth (45.7 cm)',
    weight: "2.4 kg",
    color: "Midnight Azure, Celestial Gold & Clear Quartz",
    tags: ["resin clock", "geode art", "wall clock", "gold leaf", "crystals"],
    isNew: true,
    isFeatured: true,
    isHandmade: true,
    story: "Inspired by ancient celestial navigation charts and mineral geodes. Hand-layered over 72 hours with raw amethyst and quartz accents bordering an obsidian and gold leaf swirl.",
    description: "An eye-catching geode art timepiece with completely silent German quartz movement and minimalist polished brass hands. Each piece is unique in crystalline texture and color movement.",
    images: [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.9,
    reviewCount: 31,
    careInstructions: "Requires 1 AA battery (included). Clean face with non-ammonia cleaner.",
    estimatedDelivery: "3 to 5 business days",
    productionTime: "5 days hand-pouring & crystal setting",
    createdAt: "2026-03-05T09:15:00Z"
  },
  {
    id: "prod-006",
    name: "Antique Hammered Brass Lotus Centerpiece Bowl",
    slug: "antique-hammered-brass-lotus-centerpiece",
    sku: "HE-DEC-0914",
    category: "Antique Décor",
    subcategory: "Table Décor",
    price: 32000,
    costPrice: 14000,
    stock: 3,
    condition: "Vintage",
    material: "Pure Heavy Gauge Brass, Hand-Chased Petal Fluting, Vintage Wax Finish",
    dimensions: '15" Diameter × 5" Height (38 × 12.7 cm)',
    weight: "3.5 kg",
    color: "Antique Burnished Brass",
    tags: ["vintage brass", "lotus bowl", "centerpiece", "hand-hammered", "antique decor"],
    isLimitedEdition: true,
    isAntique: true,
    provenance: "Reclaimed from historic copper and brass metalware guild ateliers in Multan, circa 1950.",
    story: "Hand-shaped on traditional wooden stakes, each petal contour was hammered by hand over several days. The brass has developed a rich, luminous golden-olive patina impossible to replicate with modern spray techniques.",
    description: "A monumental lotus-form decorative brass vessel. Fill with floating candles, fresh blossom petals, or showcase as an imposing sculptural statement on your dining table or credenza.",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 5.0,
    reviewCount: 14,
    careInstructions: "Clean with soft dry flannel. Do not polish if antique patina is desired.",
    estimatedDelivery: "3 to 4 business days",
    productionTime: "Vintage Guild Heritage",
    createdAt: "2026-01-10T16:45:00Z"
  },
  {
    id: "prod-007",
    name: "Preserved Botanical Gardenia & Rose Gold Art Plate",
    slug: "preserved-botanical-gardenia-rose-gold-art-plate",
    sku: "HE-RES-0312",
    category: "Decorative Plates",
    subcategory: "Resin Art",
    price: 15500,
    salePrice: 13900,
    costPrice: 5800,
    stock: 8,
    condition: "Handmade",
    material: "Optically Clear Casting Resin, Preserved Cream Gardenia, Miniature Ferns, Rose Gold Flakes",
    dimensions: '12" Diameter × 1" Depth (30.5 cm)',
    weight: "1.1 kg",
    color: "Champagne, Ivory & Rose Gold",
    tags: ["decorative plate", "dried flowers", "gardenia", "wedding gift", "resin art"],
    isHandmade: true,
    isBestSeller: true,
    story: "Capturing the fleeting perfection of summer gardenias in suspended animation. The delicate petals retain their natural tactile textures and translucent elegance under multiple resin coats.",
    description: "Elegantly sized decorative art plate with preserved ivory gardenia blossom and rose gold leaf accents. Comes complete with a minimalist wrought-brass display stand.",
    images: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 4.9,
    reviewCount: 42,
    careInstructions: "Wipe with dry microfiber cloth. Display stand included.",
    estimatedDelivery: "3 to 5 business days",
    productionTime: "Handcrafted to order or small batch",
    createdAt: "2026-02-28T12:00:00Z"
  },
  {
    id: "prod-008",
    name: "Customized Heirloom Calligraphy & Botanical Resin Plaque",
    slug: "customized-heirloom-calligraphy-botanical-plaque",
    sku: "HE-CUS-0801",
    category: "Customized Gifts",
    subcategory: "Wedding Gifts",
    price: 22000,
    costPrice: 8500,
    stock: 25,
    condition: "Handmade",
    material: "Custom Engraved Gold Acrylic Calligraphy, Pressed Wedding Floral Bouquet, Crystal Resin",
    dimensions: '14" × 10" Arch or Rectangle (35.5 × 25.4 cm)',
    weight: "1.6 kg",
    color: "Custom Colors / White & Gold",
    tags: ["custom order", "wedding plaque", "calligraphy", "personalized gift", "anniversary"],
    isHandmade: true,
    isFeatured: true,
    story: "Preserve the sacred memories of your Nikkah, wedding date, family crest, or favorite verse forever. Customers can send their own dried wedding flowers or request our curated selection of botanicals.",
    description: "A cherished personalized gift plaque featuring customized Arabic/English calligraphy, personalized names or dates, and hand-arranged botanical florals under optical resin.",
    images: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1000&q=80"
    ],
    rating: 5.0,
    reviewCount: 54,
    careInstructions: "Keepsake quality. Hand-poured with UV inhibitors to prevent yellowing.",
    estimatedDelivery: "7 to 10 days (custom crafted)",
    productionTime: "Made to order with customer proofing",
    createdAt: "2026-01-25T15:30:00Z"
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: "HERITAGE10",
    type: "percentage",
    value: 10,
    minPurchase: 10000,
    maxDiscount: 5000,
    isActive: true,
    expiresAt: "2026-12-31T23:59:59Z",
    usageCount: 64
  },
  {
    code: "GOLDEN20",
    type: "percentage",
    value: 20,
    minPurchase: 25000,
    maxDiscount: 10000,
    isActive: true,
    expiresAt: "2026-12-31T23:59:59Z",
    usageCount: 29
  },
  {
    code: "ROYAL3000",
    type: "fixed",
    value: 3000,
    minPurchase: 20000,
    isActive: true,
    expiresAt: "2026-12-31T23:59:59Z",
    usageCount: 18
  },
  {
    code: "FREESHIP",
    type: "fixed",
    value: 450,
    minPurchase: 5000,
    isActive: true,
    expiresAt: "2026-12-31T23:59:59Z",
    usageCount: 92
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "prod-001",
    customerName: "Ayesha Malik",
    rating: 5,
    comment: "The craftsmanship is even more breathtaking in person. The gold leaf flakes catch the light beautifully on my dining table. Arrived in a luxurious velvet-lined box.",
    date: "2026-03-08",
    verifiedPurchase: true
  },
  {
    id: "rev-2",
    productId: "prod-001",
    customerName: "Dr. Farhan Qureshi",
    rating: 5,
    comment: "Magnificent quality. You can tell real attention went into the resin clarity and petal placement. Truly an artistic masterpiece.",
    date: "2026-03-02",
    verifiedPurchase: true
  },
  {
    id: "rev-3",
    productId: "prod-002",
    customerName: "Lady Sarah Thornton",
    rating: 5,
    comment: "The antique repoussé brass and the certificate of authenticity exceeded all expectations. A genuine treasure in our collection.",
    date: "2026-02-27",
    verifiedPurchase: true
  },
  {
    id: "rev-4",
    productId: "prod-003",
    customerName: "Zainab Chaudhry",
    rating: 5,
    comment: "Used as our main living room vanity tray. Heavy, sturdy brass handles and gorgeous pressed wildflowers. Everyone asks where we found it!",
    date: "2026-03-04",
    verifiedPurchase: true
  }
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: "exp-1",
    category: "Raw Materials",
    amount: 35000,
    description: "Imported museum-grade UV casting resin and dried white orchid specimens",
    date: "2026-03-01"
  },
  {
    id: "exp-2",
    category: "Raw Materials",
    amount: 18000,
    description: "24K pure gold leaf booklets & copper backing foil",
    date: "2026-03-03"
  },
  {
    id: "exp-3",
    category: "Packaging & Shipping",
    amount: 12500,
    description: "Bespoke velvet jewelry boxes & custom wooden crates for insured courier",
    date: "2026-03-05"
  },
  {
    id: "exp-4",
    category: "Artisan Commission",
    amount: 45000,
    description: "Master artisan hand-chasing & botanical curation stipends",
    date: "2026-03-07"
  }
];
