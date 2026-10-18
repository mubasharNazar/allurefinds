/* =========================================================
   AllureFinds — site configuration & catalogue
   Edit this file to change contact details, categories and products.
   ========================================================= */

const SITE = {
  name: "AllureFinds",
  tagline: "Curated custom gifts & signature events",
  // WhatsApp number in international format, digits only (no +, spaces or dashes)
  whatsapp: "923000000000",
  phoneDisplay: "+92 300 0000000",
  email: "hello@allurefinds.com",
  addresses: [
    "Studio 12, Blue Area, Islamabad",
    "Saddar Road, Rawalpindi"
  ],
  hours: "Mon – Sat · 10:00 am – 7:00 pm",
  socials: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    linkedin: "https://linkedin.com/"
  },
  since: 2015,
  currency: "Rs."
};

const IMG = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const CATEGORIES = [
  { slug: "pens", name: "Pens", blurb: "Engraved metal & executive writing instruments", img: "photo-1781835071645-f67f762eddba" },
  { slug: "keychains", name: "Keychains", blurb: "Leather, metal & acrylic keepsakes", img: "photo-1676488690948-8020c4851c50" },
  { slug: "diaries", name: "Diaries", blurb: "Debossed planners & premium notebooks", img: "photo-1677064061401-f77f966ff8a1" },
  { slug: "corporate-boxes", name: "Corporate Boxes", blurb: "Curated hampers in rigid luxury packaging", img: "photo-1674620213535-9b2a2553ef40" },
  { slug: "bottles", name: "Bottles", blurb: "Insulated steel bottles & tumblers", img: "photo-1544003484-3cd181d17917" },
  { slug: "mugs", name: "Mugs", blurb: "Ceramic, magic & enamel mugs", img: "photo-1616241673111-508b4662c707" },
  { slug: "clothing", name: "Clothing", blurb: "Hoodies, polos & tees with your mark", img: "photo-1620799140188-3b2a02fd9a77" },
  { slug: "marketing-material", name: "Marketing Material", blurb: "Cards, brochures & stationery", img: "photo-1623305463957-df17547327cb" },
  { slug: "accessories", name: "Accessories", blurb: "Totes, wallets & desk essentials", img: "photo-1574365569389-a10d488ca3fb" }
];

/* price = starting unit price; tiers = bulk discounts (min qty -> % off) */
const DEFAULT_TIERS = [
  { min: 1, off: 0 },
  { min: 25, off: 8 },
  { min: 100, off: 15 },
  { min: 500, off: 22 }
];

const PRODUCTS = [
  // Pens
  { id: "aurum-metal-pen", cat: "pens", name: "Aurum Metal Rollerball", price: 650, img: ["photo-1781835071645-f67f762eddba", "photo-1778702162168-ae1af36f4a08"], badge: "Bestseller",
    desc: "A weighted brass rollerball with a satin-gold finish. Laser engraving reveals a crisp, permanent mark of your logo or name.",
    options: { finish: ["Satin Gold", "Gunmetal", "Matte Black"], branding: ["Laser Engraving", "UV Print"] } },
  { id: "noir-fountain-set", cat: "pens", name: "Noir Fountain Pen Set", price: 2400, img: ["photo-1781835071866-4a6fe016a6ba", "photo-1781835073386-ec104a049748"], badge: "Premium",
    desc: "Four fountain pens nested in a felt-lined presentation case — a statement gift for leadership and milestone moments.",
    options: { finish: ["Onyx", "Ivory", "Bordeaux"], branding: ["Engraved Case", "Engraved Pens", "Both"] } },
  { id: "click-pen-classic", cat: "pens", name: "Classic Click Pen", price: 120, img: ["photo-1620298228682-e5eb972dfbe1"],
    desc: "Light, reliable and endlessly useful. The everyday giveaway that keeps your brand in hand at every event.",
    options: { finish: ["Silver", "Black", "White", "Navy"], branding: ["Pad Print", "Laser Engraving"] } },
  { id: "nib-signature-pen", cat: "pens", name: "Signature Nib Pen", price: 1350, img: ["photo-1778702162168-ae1af36f4a08", "photo-1781835071645-f67f762eddba"], badge: "New",
    desc: "A gold-tone nib with a balanced, smooth line — boxed in a magnetic gift box with a personalised sleeve.",
    options: { finish: ["Gold", "Rose Gold", "Chrome"], branding: ["Laser Engraving"] } },

  // Keychains
  { id: "leather-tag-keychain", cat: "keychains", name: "Leather Tag Keychain", price: 380, img: ["photo-1676488690948-8020c4851c50", "photo-1676276550349-580c49631496"], badge: "Bestseller",
    desc: "Full-grain leather tag on a brushed ring, hot-foil or blind debossed with your logo. Ages beautifully.",
    options: { finish: ["Tan", "Chocolate", "Black"], branding: ["Blind Deboss", "Gold Foil", "Silver Foil"] } },
  { id: "card-and-key-set", cat: "keychains", name: "Card Holder & Key Set", price: 1150, img: ["photo-1676276550349-580c49631496", "photo-1666723192375-ff8225b2485a"],
    desc: "A matching leather card holder and keychain duo, packed in a kraft gift box. Perfect for onboarding kits.",
    options: { finish: ["Tan", "Black"], branding: ["Blind Deboss", "Gold Foil"] } },
  { id: "metal-crest-keychain", cat: "keychains", name: "Metal Crest Keychain", price: 290, img: ["photo-1687075430355-ed8df51c1670"],
    desc: "Die-cast zinc keychain with enamel colour fill — shaped to your logo for a truly custom keepsake.",
    options: { finish: ["Antique Gold", "Nickel", "Black Nickel"], branding: ["Custom Die-cast", "Laser Engraving"] } },

  // Diaries
  { id: "executive-diary", cat: "diaries", name: "Executive Planner 2027", price: 1250, img: ["photo-1677064061401-f77f966ff8a1", "photo-1720534195942-d55d1760df95"], badge: "Bestseller",
    desc: "Dated A5 planner with PU-leather cover, ribbon markers and gilt edges. Your logo debossed on the front.",
    options: { finish: ["Black", "Navy", "Tan", "Forest"], branding: ["Deboss", "Gold Foil", "Metal Plate"] } },
  { id: "sage-notebook", cat: "diaries", name: "Sage Linen Notebook", price: 850, img: ["photo-1654542645651-5196f4931cd6"],
    desc: "Undated, linen-bound notebook with 120 gsm ivory paper and lay-flat binding. Calm, considered, timeless.",
    options: { finish: ["Sage", "Oat", "Charcoal"], branding: ["Screen Print", "Foil Stamp"] } },
  { id: "folio-trio", cat: "diaries", name: "Folio Trio Set", price: 2100, img: ["photo-1720534195942-d55d1760df95", "photo-1718670014130-ee9ee053598d"], badge: "New",
    desc: "Three slim notebooks in a matching sleeve — ruled, dotted and blank. Ideal for conferences and workshops.",
    options: { finish: ["Black", "Kraft"], branding: ["Foil Stamp", "Deboss"] } },

  // Corporate Boxes
  { id: "noir-gift-box", cat: "corporate-boxes", name: "Noir Signature Hamper", price: 6500, img: ["photo-1674620213535-9b2a2553ef40", "photo-1694481901573-a970f982ac5e"], badge: "Signature",
    desc: "A rigid black box with gold ribbon holding a pen, planner, bottle and keychain — every piece branded to match.",
    options: { finish: ["Noir & Gold", "Ivory & Gold"], branding: ["Full Branding", "Box Only"] } },
  { id: "wax-seal-box", cat: "corporate-boxes", name: "Wax Seal Welcome Box", price: 4200, img: ["photo-1759563871375-d5b140f6646e", "photo-1575176647987-4c1a2e598950"],
    desc: "An ivory keepsake box closed with a personalised wax seal and satin ribbon. Fill with items of your choice.",
    options: { finish: ["Ivory", "Blush", "Sage"], branding: ["Custom Wax Seal", "Printed Card"] } },
  { id: "festive-gold-box", cat: "corporate-boxes", name: "Festive Gold Box", price: 3800, img: ["photo-1608755728617-aefab37d2edd", "photo-1513885535751-8b9238bd345a"],
    desc: "Our Eid and year-end favourite: metallic wrapping, a handwritten-style card and a curated treat selection.",
    options: { finish: ["Gold", "Silver"], branding: ["Printed Card", "Foil Sleeve"] } },
  { id: "kraft-essentials-box", cat: "corporate-boxes", name: "Kraft Essentials Kit", price: 2600, img: ["photo-1512909006721-3d6018887383", "photo-1549465220-1a8b9238cd48"],
    desc: "A sustainable kraft box with notebook, pen, tote and mug — the perfect employee onboarding kit.",
    options: { finish: ["Kraft"], branding: ["Full Branding", "Sticker Seal"] } },

  // Bottles
  { id: "mizu-steel-bottle", cat: "bottles", name: "Insulated Steel Bottle", price: 1450, img: ["photo-1544003484-3cd181d17917"], badge: "Bestseller",
    desc: "Double-walled stainless steel keeps drinks cold for 24h or hot for 12h. Laser-etched logo that never fades.",
    options: { finish: ["Matte Black", "White", "Sage", "Navy"], branding: ["Laser Etching", "UV Print"] } },
  { id: "travel-tumbler", cat: "bottles", name: "Travel Tumbler", price: 1650, img: ["photo-1568395216634-ab1b1e848751"],
    desc: "Spill-resistant lid and a slim profile that fits car cup holders. A daily-use gift that travels everywhere.",
    options: { finish: ["Ocean Blue", "Black", "Blush"], branding: ["Laser Etching", "UV Print"] } },
  { id: "glass-bottle", cat: "bottles", name: "Clear Glass Bottle", price: 780, img: ["photo-1523362628745-0c100150b504"],
    desc: "Borosilicate glass with a bamboo cap and protective sleeve. Clean, minimal, eco-conscious.",
    options: { finish: ["Clear"], branding: ["Screen Print", "Engraved Cap"] } },

  // Mugs
  { id: "studio-ceramic-mug", cat: "mugs", name: "Studio Ceramic Mug", price: 520, img: ["photo-1616241673111-508b4662c707", "photo-1570784332176-fdd73da66f03"], badge: "Bestseller",
    desc: "A 330 ml glossy ceramic mug, dishwasher-safe, sublimation-printed edge to edge with your artwork.",
    options: { finish: ["White", "Black Inside", "Pastel Handle"], branding: ["Full Wrap Print", "Logo Print"] } },
  { id: "artisan-cup", cat: "mugs", name: "Artisan Stoneware Cup", price: 980, img: ["photo-1782351094137-14cef7134c18"], badge: "New",
    desc: "Hand-finished stoneware with a speckled glaze — each piece unique, stamped with your mark on the base.",
    options: { finish: ["Sand", "Moss", "Charcoal"], branding: ["Base Stamp", "Gift Tag"] } },
  { id: "two-tone-mug", cat: "mugs", name: "Two-tone Café Mug", price: 620, img: ["photo-1520485521983-bfaa0bc6c80e"],
    desc: "Matte exterior with a contrasting glossy interior. A café-grade mug for offices that care about details.",
    options: { finish: ["Beige / White", "Black / Gold"], branding: ["Laser Engraving", "Logo Print"] } },

  // Clothing
  { id: "heavyweight-hoodie", cat: "clothing", name: "Heavyweight Hoodie", price: 2900, img: ["photo-1620799140188-3b2a02fd9a77", "photo-1688111421205-a0a85415b224"], badge: "Bestseller",
    desc: "380 gsm brushed-fleece hoodie with embroidered chest logo. Unisex fit, sizes S–XXL.",
    options: { finish: ["White", "Heather Grey", "Black", "Navy"], branding: ["Embroidery", "Screen Print", "DTF Print"] } },
  { id: "team-pullover", cat: "clothing", name: "Team Pullover", price: 2500, img: ["photo-1564557287817-3785e38ec1f5"],
    desc: "Comfortable everyday pullover for teams, retreats and campus events. Bulk-friendly pricing.",
    options: { finish: ["Grey", "Black", "Maroon"], branding: ["Embroidery", "Screen Print"] } },
  { id: "classic-polo", cat: "clothing", name: "Classic Pique Polo", price: 1400, img: ["photo-1688111421205-a0a85415b224"],
    desc: "Breathable cotton pique with a clean collar — the uniform staple, embroidered to perfection.",
    options: { finish: ["White", "Black", "Navy", "Bottle Green"], branding: ["Embroidery"] } },

  // Marketing material
  { id: "luxe-business-cards", cat: "marketing-material", name: "Luxe Business Cards", price: 18, img: ["photo-1623305463957-df17547327cb", "photo-1623305466040-b753da413c9b"], badge: "Bestseller",
    desc: "Per card. 450 gsm cotton stock with optional foil, spot UV or edge painting. Minimum 100 cards.",
    options: { finish: ["Matte", "Soft-touch", "Cotton"], branding: ["Gold Foil", "Spot UV", "Plain Print"] } },
  { id: "letterhead-set", cat: "marketing-material", name: "Letterhead & Envelope Set", price: 35, img: ["photo-1624567881801-a5a85867d990"],
    desc: "Per set. Premium 120 gsm letterheads with matching envelopes for a polished corporate identity.",
    options: { finish: ["Bright White", "Ivory"], branding: ["Offset Print", "Digital Print"] } },
  { id: "brochure-trifold", cat: "marketing-material", name: "Tri-fold Brochure", price: 45, img: ["photo-1623305466040-b753da413c9b"],
    desc: "Per piece. Full-colour tri-fold brochure on art card with lamination. Design support available.",
    options: { finish: ["Gloss Lamination", "Matte Lamination"], branding: ["Full Colour"] } },

  // Accessories
  { id: "canvas-tote", cat: "accessories", name: "Canvas Tote Bag", price: 690, img: ["photo-1574365569389-a10d488ca3fb", "photo-1544816155-12df9643f363"], badge: "Eco",
    desc: "12 oz cotton canvas tote with long handles. Screen-printed or embroidered — a walking billboard for your brand.",
    options: { finish: ["Natural", "Black", "Olive"], branding: ["Screen Print", "Embroidery"] } },
  { id: "leather-tote", cat: "accessories", name: "Leather Work Tote", price: 5400, img: ["photo-1578237493287-8d4d2b03591a"], badge: "Premium",
    desc: "Structured leather tote with laptop sleeve — a refined gift for clients and senior leadership.",
    options: { finish: ["Black", "Cognac"], branding: ["Blind Deboss", "Metal Plate"] } },
  { id: "bifold-wallet", cat: "accessories", name: "Bifold Leather Wallet", price: 1850, img: ["photo-1599066852653-42826a50b163"],
    desc: "Slim bifold wallet in genuine leather, initials or logo debossed, presented in a gift box.",
    options: { finish: ["Brown", "Black"], branding: ["Blind Deboss", "Gold Foil Initials"] } }
];

const EVENTS = [
  { title: "Annual Leadership Summit", type: "Conference", img: "photo-1540575467063-178a50c2df87" },
  { title: "Tech Expo Stand Build", type: "Exhibition", img: "photo-1761225646548-bc92fea0dc72" },
  { title: "Gala Dinner Evening", type: "Gala", img: "photo-1768508950719-4d76978fdf44" },
  { title: "Product Launch Night", type: "Launch", img: "photo-1492684223066-81342ee5ff30" },
  { title: "Trade Show Pavilion", type: "Exhibition", img: "photo-1761195689615-9469b65dac01" },
  { title: "Partner Appreciation", type: "Gala", img: "photo-1527529482837-4698179dc6ce" },
  { title: "Strategy Offsite", type: "Conference", img: "photo-1542744173-8e7e53415bb0" },
  { title: "Brand Activation Booth", type: "Exhibition", img: "photo-1632383380175-812d44ec112b" },
  { title: "Industry Forum", type: "Conference", img: "photo-1531058020387-3be344556be6" },
  { title: "Equipment Showcase", type: "Exhibition", img: "photo-1762028892701-692dc360db08" },
  { title: "Founders' Meetup", type: "Conference", img: "photo-1561489396-888724a1543d" },
  { title: "Annual Day Celebration", type: "Gala", img: "photo-1759873148521-c49d9497cf64" }
];

const CLIENTS = [
  "Northwind", "Meridian Group", "Halcyon Bank", "Crescent Labs", "Atlas Telecom",
  "Verdant Foods", "Summit Pharma", "Lumen Energy", "Oakridge School", "Cobalt Systems"
];

const TESTIMONIALS = [
  { quote: "The hampers arrived beautifully packed and every single item carried our logo perfectly. Our clients still talk about them.", name: "Ayesha K.", role: "Head of Marketing, Fintech" },
  { quote: "From the exhibition stand to the giveaways, AllureFinds handled everything. Calm, organised and genuinely creative.", name: "Usman R.", role: "Events Lead, Telecom" },
  { quote: "We ordered 600 onboarding kits on a tight deadline. They delivered early and the quality was outstanding.", name: "Sara M.", role: "People & Culture Manager" }
];
