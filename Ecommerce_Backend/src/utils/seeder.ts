import { Product } from "../models/product.js";
import { Coupon } from "../models/coupon.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
import { Review } from "../models/review.js";

const sampleProducts = [
  {
    _id: "prod-001",
    name: "Nike Air Zoom Pegasus 39",
    category: "Footwear",
    brand: "Nike",
    price: 8999,
    originalPrice: 10999,
    stock: 14,
    photo:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Engineered mesh upper with responsive Zoom Air cushioning gives you a bouncy spring in every step. Perfect for daily runs and high-performance workouts.",
    rating: 4.8,
    reviewCount: 124,
    featured: true,
    specs: [
      { label: "Closure", value: "Lace-Up" },
      { label: "Weight", value: "261 grams" },
      { label: "Sole Material", value: "Rubber Outsole" },
    ],
  },
  {
    _id: "prod-002",
    name: "Apple MacBook Pro M3 (14-inch)",
    category: "Laptops",
    brand: "Apple",
    price: 169900,
    originalPrice: 179900,
    stock: 15,
    photo:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Supercharged by the M3 chip with an 8-core CPU and 10-core GPU. Liquid Retina XDR display with up to 22 hours of battery life and studio-quality mics.",
    rating: 4.9,
    reviewCount: 310,
    featured: true,
    specs: [
      { label: "Processor", value: "Apple M3 Chip" },
      { label: "Memory", value: "16GB Unified" },
      { label: "Storage", value: "512GB SSD" },
      { label: "Display", value: "14.2-inch Liquid Retina XDR" },
    ],
  },
  {
    _id: "prod-003",
    name: "Sony Classic Smartwatch 4",
    category: "Wearables",
    brand: "Sony",
    price: 14500,
    originalPrice: 16999,
    stock: 8,
    photo:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "AMOLED touch display with continuous heart rate monitoring, SpO2 sensor, sleep tracking, and up to 14 days of typical battery usage.",
    rating: 4.6,
    reviewCount: 88,
    featured: true,
    specs: [
      { label: "Display", value: "1.4-inch AMOLED" },
      { label: "Water Resistance", value: "5 ATM (50m)" },
      { label: "Battery", value: "14 Days" },
    ],
  },
  {
    _id: "prod-004",
    name: "Bose QuietComfort 45 Wireless",
    category: "Audio",
    brand: "Bose",
    price: 24900,
    originalPrice: 29900,
    stock: 28,
    photo:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Iconic quiet, comfort, and sound. World-class noise cancellation, high-fidelity audio, and lightweight proprietary materials for marathon listening.",
    rating: 4.7,
    reviewCount: 204,
    featured: true,
    specs: [
      { label: "Battery Life", value: "Up to 24 hours" },
      { label: "Connectivity", value: "Bluetooth 5.1 & 3.5mm AUX" },
      { label: "Microphones", value: "Quad-mic system" },
    ],
  },
  {
    _id: "prod-005",
    name: "Canon EOS R5 Mirrorless Camera",
    category: "Cameras",
    brand: "Canon",
    price: 289990,
    originalPrice: 319990,
    stock: 6,
    photo:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Professional-grade 45MP full-frame CMOS sensor capturing 8K raw video, high-speed continuous shooting up to 20 fps, and Dual Pixel CMOS AF II.",
    rating: 4.9,
    reviewCount: 45,
    featured: false,
    specs: [
      { label: "Sensor Resolution", value: "45 Megapixels" },
      { label: "Video", value: "8K DCI RAW" },
      { label: "Lens Mount", value: "Canon RF" },
    ],
  },
  {
    _id: "prod-006",
    name: "Logitech MX Master 3S Wireless",
    category: "Accessories",
    brand: "Logitech",
    price: 9495,
    originalPrice: 10995,
    stock: 35,
    photo:
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Remastered ergonomic mouse with Quiet Clicks and 8,000 DPI track-on-glass sensor. MagSpeed electromagnetic scrolling for ultimate precision.",
    rating: 4.8,
    reviewCount: 520,
    featured: false,
    specs: [
      { label: "DPI Range", value: "200 to 8000 DPI" },
      { label: "Battery Life", value: "Up to 70 days on full charge" },
      { label: "Buttons", value: "7 customizable buttons" },
    ],
  },
  {
    _id: "prod-007",
    name: "Apple iPad Air M2 (11-inch)",
    category: "Laptops",
    brand: "Apple",
    price: 59900,
    originalPrice: 64900,
    stock: 19,
    photo:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Redesigned iPad Air powered by the blazing M2 chip. Stunning Liquid Retina display, landscape 12MP front camera with Center Stage, and superfast Wi-Fi 6E.",
    rating: 4.7,
    reviewCount: 162,
    featured: false,
    specs: [
      { label: "Chipset", value: "Apple M2 Chip" },
      { label: "Display", value: "11-inch Liquid Retina LED" },
      { label: "Storage", value: "128GB" },
    ],
  },
  {
    _id: "prod-008",
    name: "Sony WH-1000XM5 Noise Cancelling",
    category: "Audio",
    brand: "Sony",
    price: 29990,
    originalPrice: 34990,
    stock: 22,
    photo:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Two processors control 8 microphones for unprecedented noise cancellation. Auto NC Optimizer automatically optimizes sound based on wearing conditions.",
    rating: 4.8,
    reviewCount: 412,
    featured: false,
    specs: [
      { label: "Battery", value: "30 Hours ANC ON" },
      { label: "Drivers", value: "30mm Precision engineered" },
      { label: "Bluetooth", value: "LDAC & Multipoint" },
    ],
  },
  {
    _id: "prod-009",
    name: "Samsung Galaxy S24 Ultra",
    category: "Mobile Phones",
    brand: "Samsung",
    price: 129999,
    originalPrice: 139999,
    stock: 12,
    photo:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Titanium exterior with 6.8-inch Dynamic AMOLED 2X flat display. Galaxy AI onboard with circle to search, live translation, and 200MP Quad Tele camera system.",
    rating: 4.9,
    reviewCount: 230,
    featured: true,
    specs: [
      { label: "Display", value: "6.8-inch Dynamic AMOLED 2X" },
      { label: "Camera", value: "200MP + 50MP + 12MP + 10MP" },
      { label: "Battery", value: "5000 mAh" },
    ],
  },
  {
    _id: "prod-010",
    name: "Marshall Stanmore III Speaker",
    category: "Audio",
    brand: "Marshall",
    price: 36999,
    originalPrice: 39999,
    stock: 11,
    photo:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Heavyweight sound filling any room with signature Marshall warm acoustics. Bluetooth 5.2, RCA, and 3.5 mm inputs with analog control knobs.",
    rating: 4.7,
    reviewCount: 84,
    featured: false,
    specs: [
      { label: "Power Output", value: "80 Watt RMS" },
      { label: "Frequency", value: "45–20,000 Hz" },
      { label: "Controls", value: "Bass, Treble, Volume" },
    ],
  },
];

const sampleCoupons = [
  { code: "WELCOME10", discountPercent: 10, maxDiscount: 2000, minSpend: 1000 },
  { code: "SUMMER20", discountPercent: 20, maxDiscount: 4000, minSpend: 3000 },
  { code: "SUPER50", discountPercent: 50, maxDiscount: 5000, minSpend: 5000 },
  { code: "LUCKY15", discountPercent: 15, maxDiscount: 2500, minSpend: 1500 },
];

const sampleUsers = [
  {
    _id: "user-001",
    name: "Alex Morgan",
    email: "alex.morgan@store.com",
    role: "Customer",
    gender: "female",
    photo: "https://randomuser.me/api/portraits/women/54.jpg",
    dob: new Date("1996-03-12"),
  },
  {
    _id: "user-002",
    name: "Sophia Lee",
    email: "sophia.lee@example.com",
    role: "Customer",
    gender: "female",
    photo: "https://randomuser.me/api/portraits/women/50.jpg",
    dob: new Date("1994-08-22"),
  },
  {
    _id: "user-003",
    name: "Marcus Brody",
    email: "marcus.brody@enterprise.com",
    role: "Customer",
    gender: "male",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    dob: new Date("1989-11-04"),
  },
  {
    _id: "admin-user",
    name: "System Admin",
    email: "admin@ecommerce.com",
    role: "admin",
    gender: "female",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
    dob: new Date("1992-05-18"),
  },
];

const sampleOrders = [
  {
    _id: "ord-9820",
    user: "Alex Morgan",
    userEmail: "alex.morgan@store.com",
    shippingInfo: {
      fullName: "Alex Morgan",
      address: "12 Riverside Boulevard, Apt 4B",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pinCode: "400001",
      phone: "+91 98200 11223",
    },
    orderItems: [
      {
        productId: "prod-004",
        name: "Bose QuietComfort 45 Wireless",
        photo:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        price: 24900,
        quantity: 1,
      },
    ],
    subtotal: 24900,
    tax: 1245,
    shippingCharges: 0,
    discount: 1000,
    total: 25145,
    status: "Processing",
    paymentMethod: "Card",
    paymentStatus: "Paid",
    estimatedDelivery: "2026-10-22",
  },
  {
    _id: "ord-9821",
    user: "Sophia Lee",
    userEmail: "sophia.lee@example.com",
    shippingInfo: {
      fullName: "Sophia Lee",
      address: "42 MG Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      pinCode: "560038",
      phone: "+91 98765 43210",
    },
    orderItems: [
      {
        productId: "prod-003",
        name: "Sony Classic Smartwatch 4",
        photo:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        price: 14500,
        quantity: 1,
      },
    ],
    subtotal: 14500,
    tax: 725,
    shippingCharges: 0,
    discount: 500,
    total: 14725,
    status: "Shipped",
    paymentMethod: "Card",
    paymentStatus: "Paid",
    estimatedDelivery: "2026-10-18",
  },
  {
    _id: "ord-9822",
    user: "Marcus Brody",
    userEmail: "marcus.brody@enterprise.com",
    shippingInfo: {
      fullName: "Marcus Brody",
      address: "88 DLF CyberCity, Phase 2",
      city: "Gurugram",
      state: "Haryana",
      country: "India",
      pinCode: "122002",
      phone: "+91 99112 33445",
    },
    orderItems: [
      {
        productId: "prod-002",
        name: "Apple MacBook Pro M3 (14-inch)",
        photo:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        price: 169900,
        quantity: 1,
      },
    ],
    subtotal: 169900,
    tax: 8495,
    shippingCharges: 0,
    discount: 4000,
    total: 174395,
    status: "Delivered",
    paymentMethod: "Card",
    paymentStatus: "Paid",
    estimatedDelivery: "2026-10-12",
  },
];

export const seedDatabaseIfEmpty = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("Seeding initial store products...");
      await Product.insertMany(sampleProducts);
      console.log("Products seeded successfully.");
    }

    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      console.log("Seeding storefront coupons...");
      await Coupon.insertMany(sampleCoupons);
      console.log("Coupons seeded successfully.");
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("Seeding sample user accounts...");
      await User.insertMany(sampleUsers);
      console.log("Users seeded successfully.");
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log("Seeding sample orders...");
      await Order.insertMany(sampleOrders);
      console.log("Orders seeded successfully.");
    }
  } catch (err) {
    console.error("Database seeding encountered an error:", err);
  }
};
