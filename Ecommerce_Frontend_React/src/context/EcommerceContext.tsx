import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  Product,
  CartItem,
  Order,
  Customer,
  Coupon,
  Review,
  ShippingAddress,
  OrderStatus,
} from "../types/ecommerceTypes";
import toast from "react-hot-toast";
import {
  apiGetProducts,
  apiGetOrders,
  apiGetCoupons,
  apiGetCustomers,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiCreateOrder,
  apiUpdateOrderStatus,
  apiCancelOrder,
  apiUpdateUser,
  apiCreateCoupon,
  apiAddReview,
} from "../services/api";

// Initial seed data
const initialProducts: Product[] = [
  {
    id: "prod-001",
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
    id: "prod-002",
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
    id: "prod-003",
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
    id: "prod-004",
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
    id: "prod-005",
    name: "Canon EOS R50 Mirrorless Camera",
    category: "Cameras",
    brand: "Canon",
    price: 58990,
    originalPrice: 64990,
    stock: 5,
    photo:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Compact 24.2 MP APS-C sensor with Dual Pixel CMOS AF II. Shoots uncropped 4K 30p video oversampled from 6K and ultra-fast burst shooting.",
    rating: 4.8,
    reviewCount: 65,
    featured: false,
    specs: [
      { label: "Sensor", value: "24.2MP APS-C CMOS" },
      { label: "Video", value: "4K UHD 30fps" },
      { label: "Screen", value: "Vari-angle Touch LCD" },
    ],
  },
  {
    id: "prod-006",
    name: "Adidas Ultraboost Light Running Shoes",
    category: "Footwear",
    brand: "Adidas",
    price: 11999,
    originalPrice: 14999,
    stock: 12,
    photo:
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Light Boost midsole delivers unmatched energy return. Continental rubber outsole ensures optimal traction in wet and dry conditions.",
    rating: 4.7,
    reviewCount: 92,
    featured: true,
    specs: [
      { label: "Upper", value: "Primeknit+ Textile" },
      { label: "Drop", value: "10 mm" },
      { label: "Cushioning", value: "Ultraboost Light" },
    ],
  },
  {
    id: "prod-007",
    name: "Apple MacBook Air 13 M2",
    category: "Laptops",
    brand: "Apple",
    price: 99900,
    originalPrice: 114900,
    stock: 7,
    photo:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Strikingly thin design with all-day battery life, 13.6-inch Liquid Retina display, 1080p FaceTime HD camera, and MagSafe charging port.",
    rating: 4.9,
    reviewCount: 420,
    featured: false,
    specs: [
      { label: "Chip", value: "Apple M2" },
      { label: "Storage", value: "256GB SSD" },
      { label: "Weight", value: "1.24 kg" },
    ],
  },
  {
    id: "prod-008",
    name: "Sony WH-1000XM5 Premium Headphones",
    category: "Audio",
    brand: "Sony",
    price: 29990,
    originalPrice: 34990,
    stock: 18,
    photo:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Industry-leading noise cancellation powered by two processors and 8 microphones. Hi-Res Audio wireless support and speak-to-chat smart capability.",
    rating: 4.9,
    reviewCount: 512,
    featured: true,
    specs: [
      { label: "Drivers", value: "30mm Precision Unit" },
      { label: "Battery", value: "30 hours with ANC" },
      { label: "Charging", value: "3 min quick charge for 3 hrs" },
    ],
  },
  {
    id: "prod-009",
    name: "Samsung Galaxy S24 Ultra 5G",
    category: "Mobile Phones",
    brand: "Samsung",
    price: 129999,
    originalPrice: 134999,
    stock: 9,
    photo:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description:
      "Titanium exterior with Galaxy AI built-in. 200MP quad telephoto camera system, Snapdragon 8 Gen 3 processor, and integrated S-Pen stylus.",
    rating: 4.8,
    reviewCount: 345,
    featured: true,
    specs: [
      { label: "Display", value: "6.8-inch Dynamic AMOLED 2X" },
      { label: "Camera", value: "200MP + 50MP + 12MP + 10MP" },
      { label: "Battery", value: "5000 mAh" },
    ],
  },
  {
    id: "prod-010",
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

const initialCoupons: Coupon[] = [
  { code: "WELCOME10", discountPercent: 10, maxDiscount: 2000, minSpend: 1000 },
  { code: "SUMMER20", discountPercent: 20, maxDiscount: 4000, minSpend: 3000 },
  { code: "SUPER50", discountPercent: 50, maxDiscount: 5000, minSpend: 5000 },
  { code: "LUCKY15", discountPercent: 15, maxDiscount: 2500, minSpend: 1500 },
];

const initialOrders: Order[] = [
  {
    id: "ord-9820",
    user: "Alex Morgan",
    userEmail: "alex.morgan@store.com",
    shippingAddress: {
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
    createdAt: "2026-09-15T11:00:00.000Z",
    estimatedDelivery: "2026-09-22",
  },
  {
    id: "ord-9821",
    user: "Sophia Lee",
    userEmail: "sophia.lee@example.com",
    shippingAddress: {
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
    status: "Processing",
    paymentMethod: "Card",
    paymentStatus: "Paid",
    createdAt: "2026-09-10T10:30:00.000Z",
    estimatedDelivery: "2026-09-17",
  },
  {
    id: "ord-9822",
    user: "David Miller",
    userEmail: "david.miller@example.com",
    shippingAddress: {
      fullName: "David Miller",
      address: "15 Park Street, Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      pinCode: "110001",
      phone: "+91 98111 22334",
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
    discount: 2500,
    total: 175895,
    status: "Shipped",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    createdAt: "2026-09-08T14:20:00.000Z",
    estimatedDelivery: "2026-09-15",
  },
  {
    id: "ord-9823",
    user: "Emily Palmer",
    userEmail: "emily.palmer@example.com",
    shippingAddress: {
      fullName: "Emily Palmer",
      address: "7th Avenue, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      pinCode: "500033",
      phone: "+91 97000 88991",
    },
    orderItems: [
      {
        productId: "prod-001",
        name: "Nike Air Zoom Pegasus 39",
        photo:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        price: 8999,
        quantity: 1,
      },
    ],
    subtotal: 8999,
    tax: 450,
    shippingCharges: 0,
    discount: 400,
    total: 9049,
    status: "Delivered",
    paymentMethod: "Card",
    paymentStatus: "Paid",
    createdAt: "2026-09-05T09:15:00.000Z",
    estimatedDelivery: "2026-09-11",
  },
];

const initialCustomers: Customer[] = [
  {
    id: "usr-1",
    name: "Emily Palmer",
    email: "emily.palmer@example.com",
    gender: "Female",
    role: "Admin",
    avatar: "https://randomuser.me/api/portraits/women/54.jpg",
    joinedDate: "2024-03-12",
    totalOrders: 6,
  },
  {
    id: "usr-2",
    name: "May Scoot",
    email: "aunt.may@example.com",
    gender: "Female",
    role: "Customer",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    joinedDate: "2024-05-19",
    totalOrders: 3,
  },
  {
    id: "usr-3",
    name: "David Miller",
    email: "david.miller@example.com",
    gender: "Male",
    role: "Customer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    joinedDate: "2024-06-22",
    totalOrders: 4,
  },
  {
    id: "usr-4",
    name: "Sophia Lee",
    email: "sophia.lee@example.com",
    gender: "Female",
    role: "Customer",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    joinedDate: "2024-08-01",
    totalOrders: 2,
  },
];

const initialReviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-001",
    userName: "Rahul Sharma",
    rating: 5,
    comment:
      "Extremely comfortable for my morning 5k runs. Foam cushioning feels high quality and springy!",
    date: "2026-09-02",
  },
  {
    id: "rev-2",
    productId: "prod-001",
    userName: "Ananya Desai",
    rating: 5,
    comment:
      "True to size, sleek look, and feels virtually weightless on the feet.",
    date: "2026-08-28",
  },
  {
    id: "rev-3",
    productId: "prod-002",
    userName: "Vikram Sen",
    rating: 5,
    comment:
      "The M3 battery life is unbelievable. Compile times for heavy React/Rust projects are lightning fast!",
    date: "2026-09-04",
  },
];

interface EcommerceContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  reviews: Review[];
  appliedCoupon: Coupon | null;
  isCartDrawerOpen: boolean;
  currentUserRole: "Admin" | "Customer";
  currentUserId: string;
  currentUserName: string;
  currentUserEmail: string;
  currentUserPhone: string;
  currentUserAddress: string;
  currentUserAvatar: string;

  // Actions
  toggleCartDrawer: (open?: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  placeOrder: (shipping: ShippingAddress, paymentMethod: Order["paymentMethod"]) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  updateUserProfile: (data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  }) => void;
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCoupon: (coupon: Coupon) => void;
  addReview: (review: Omit<Review, "id" | "date">) => void;
  deleteCustomer: (id: string) => void;
  toggleUserRole: () => void;
  isAuthenticated: boolean;
  login: (
    role: "Admin" | "Customer",
    name?: string,
    email?: string,
    avatar?: string,
    id?: string
  ) => void;
  logout: () => void;

  // Legal, NDA & Cookie Compliance
  isLegalModalOpen: boolean;
  legalModalTab: "nda" | "terms" | "privacy" | "refund";
  openLegalModal: (tab?: "nda" | "terms" | "privacy" | "refund") => void;
  closeLegalModal: () => void;
  isNdaSigned: boolean;
  signNdaAgreement: (fullName: string, company?: string) => void;
  cookieConsent: "accepted" | "essential" | "pending";
  setCookieConsent: (choice: "accepted" | "essential") => void;
}

const safeLoad = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved) as T;
  } catch (err) {
    console.warn(`Failed to parse localStorage key "${key}":`, err);
    return fallback;
  }
};

const EcommerceContext = createContext<EcommerceContextType | undefined>(
  undefined
);

export const EcommerceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Products state with localStorage
  const [products, setProducts] = useState<Product[]>(() =>
    safeLoad("ecom_products", initialProducts)
  );

  // Cart state with localStorage
  const [cart, setCart] = useState<CartItem[]>(() =>
    safeLoad("ecom_cart", [])
  );

  // Wishlist state with localStorage
  const [wishlist, setWishlist] = useState<string[]>(() =>
    safeLoad("ecom_wishlist", ["prod-001", "prod-004"])
  );

  // Orders state with localStorage
  const [orders, setOrders] = useState<Order[]>(() =>
    safeLoad("ecom_orders", initialOrders)
  );

  // Customers state with localStorage
  const [customers, setCustomers] = useState<Customer[]>(() =>
    safeLoad("ecom_customers", initialCustomers)
  );

  // Coupons state with localStorage
  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    safeLoad("ecom_coupons", initialCoupons)
  );

  // Reviews state with localStorage
  const [reviews, setReviews] = useState<Review[]>(() =>
    safeLoad("ecom_reviews", initialReviews)
  );

  // Transient UI states & Auth
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    safeLoad("ecom_is_auth", true)
  );
  const [currentUserId, setCurrentUserId] = useState<string>(() =>
    safeLoad("ecom_user_id", "admin-user")
  );
  const [currentUserRole, setCurrentUserRole] = useState<"Admin" | "Customer">(() =>
    safeLoad("ecom_user_role", "Admin")
  );
  const [currentUserName, setCurrentUserName] = useState<string>(() =>
    safeLoad("ecom_user_name", "Alex Morgan")
  );
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() =>
    safeLoad("ecom_user_email", "alex.morgan@store.com")
  );
  const [currentUserPhone, setCurrentUserPhone] = useState<string>(() =>
    safeLoad("ecom_user_phone", "+91 98201 12345")
  );
  const [currentUserAddress, setCurrentUserAddress] = useState<string>(() =>
    safeLoad("ecom_user_address", "Flat 402, Skyline Towers, Sector 18, Mumbai")
  );
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>(() =>
    safeLoad(
      "ecom_user_avatar",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    )
  );

  // Legal Modal & NDA States
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<
    "nda" | "terms" | "privacy" | "refund"
  >("nda");
  const [isNdaSigned, setIsNdaSigned] = useState<boolean>(() =>
    safeLoad("ecom_nda_signed", false)
  );
  const [cookieConsent, setCookieConsentState] = useState<
    "accepted" | "essential" | "pending"
  >(() => safeLoad("ecom_cookie_consent", "pending"));

  // Sync auth and states to localStorage
  useEffect(() => {
    localStorage.setItem("ecom_is_auth", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("ecom_user_id", JSON.stringify(currentUserId));
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem("ecom_user_role", JSON.stringify(currentUserRole));
  }, [currentUserRole]);

  useEffect(() => {
    localStorage.setItem("ecom_user_name", JSON.stringify(currentUserName));
  }, [currentUserName]);

  useEffect(() => {
    localStorage.setItem("ecom_user_email", JSON.stringify(currentUserEmail));
  }, [currentUserEmail]);

  useEffect(() => {
    localStorage.setItem("ecom_user_phone", JSON.stringify(currentUserPhone));
  }, [currentUserPhone]);

  useEffect(() => {
    localStorage.setItem("ecom_user_address", JSON.stringify(currentUserAddress));
  }, [currentUserAddress]);

  useEffect(() => {
    localStorage.setItem("ecom_user_avatar", JSON.stringify(currentUserAvatar));
  }, [currentUserAvatar]);

  // Sync states to localStorage
  useEffect(() => {
    localStorage.setItem("ecom_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("ecom_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("ecom_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("ecom_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("ecom_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("ecom_coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem("ecom_reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("ecom_nda_signed", JSON.stringify(isNdaSigned));
  }, [isNdaSigned]);

  useEffect(() => {
    localStorage.setItem("ecom_cookie_consent", JSON.stringify(cookieConsent));
  }, [cookieConsent]);

  // Synchronize state with Node.js backend on mount
  useEffect(() => {
    let isSubscribed = true;
    const fetchBackendData = async () => {
      try {
        const [beProducts, beOrders, beCoupons, beCustomers] =
          await Promise.all([
            apiGetProducts(),
            apiGetOrders(),
            apiGetCoupons(),
            apiGetCustomers(),
          ]);

        if (!isSubscribed) return;
        if (beProducts && beProducts.length > 0) setProducts(beProducts);
        if (beOrders && beOrders.length > 0) setOrders(beOrders);
        if (beCoupons && beCoupons.length > 0) setCoupons(beCoupons);
        if (beCustomers && beCustomers.length > 0) setCustomers(beCustomers);
      } catch (err) {
        console.warn("Backend sync notice:", err);
      }
    };
    fetchBackendData();
    return () => {
      isSubscribed = false;
    };
  }, []);

  // Methods
  const openLegalModal = (
    tab: "nda" | "terms" | "privacy" | "refund" = "nda"
  ) => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  const closeLegalModal = () => {
    setIsLegalModalOpen(false);
  };

  const signNdaAgreement = (fullName: string, company?: string) => {
    setIsNdaSigned(true);
    toast.success(
      `NDA digitally signed & recorded for ${fullName}${
        company ? ` (${company})` : ""
      }!`,
      { icon: "📜", duration: 4500 }
    );
  };

  const setCookieConsent = (choice: "accepted" | "essential") => {
    setCookieConsentState(choice);
    toast.success(
      choice === "accepted"
        ? "Cookie and privacy preferences accepted!"
        : "Essential cookies only preference saved."
    );
  };

  const toggleCartDrawer = (open?: boolean) => {
    setIsCartDrawerOpen((prev) => (open !== undefined ? open : !prev));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) {
      toast.error("Sorry, this item is out of stock!", { id: "cart-toast" });
      return;
    }

    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      const newQty = Math.min(existing.quantity + quantity, product.stock);
      if (newQty === existing.quantity) {
        toast("Maximum available stock reached in cart", {
          icon: "ℹ️",
          id: `cart-${product.id}`,
        });
      } else {
        toast.success(`Updated "${product.name}" quantity (${newQty})`, {
          id: `cart-${product.id}`,
        });
      }
      setCart((prev) =>
        prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: newQty } : item
        )
      );
    } else {
      toast.success(`Added "${product.name}" to cart!`, {
        id: `cart-${product.id}`,
      });
      setCart((prev) => [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          photo: product.photo,
          price: product.price,
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
          category: product.category,
        },
      ]);
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const clampedQty = Math.min(quantity, item.stock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    toast("Item removed from cart", { icon: "🗑️" });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    if (exists) {
      toast("Removed from wishlist", {
        icon: "💔",
        id: `wishlist-${productId}`,
      });
      setWishlist((prev) => prev.filter((id) => id !== productId));
    } else {
      toast.success("Added to wishlist! ❤️", {
        id: `wishlist-${productId}`,
      });
      setWishlist((prev) => [...prev, productId]);
    }
  };

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode);
    if (!found) {
      toast.error(`Invalid promo code: "${code}"`);
      return false;
    }

    // Check minimum spend
    const currentSubtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    if (found.minSpend && currentSubtotal < found.minSpend) {
      toast.error(
        `Coupon requires a minimum purchase of ₹${found.minSpend.toLocaleString(
          "en-IN"
        )}`
      );
      return false;
    }

    setAppliedCoupon(found);
    toast.success(
      `Coupon ${found.code} applied! ${found.discountPercent}% OFF 🎉`
    );
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast("Coupon removed");
  };

  const placeOrder = (
    shipping: ShippingAddress,
    paymentMethod: Order["paymentMethod"]
  ): Order => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shippingCharges = subtotal > 1500 ? 0 : 150;
    const tax = Math.round(subtotal * 0.05);

    let discount = 0;
    if (appliedCoupon) {
      const rawDiscount = Math.round(
        (subtotal * appliedCoupon.discountPercent) / 100
      );
      discount = appliedCoupon.maxDiscount
        ? Math.min(rawDiscount, appliedCoupon.maxDiscount)
        : rawDiscount;
    }

    const total = subtotal + tax + shippingCharges - discount;

    const orderId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      user: shipping.fullName,
      userEmail: currentUserEmail,
      shippingAddress: shipping,
      orderItems: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        photo: item.photo,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      status: "Processing",
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toISOString().split("T")[0],
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const inCart = cart.find((item) => item.productId === prod.id);
        if (inCart) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - inCart.quantity),
          };
        }
        return prod;
      })
    );

    // Save order locally and sync to backend
    setOrders((prev) => [newOrder, ...prev]);
    apiCreateOrder(newOrder).catch(() => {});

    // Clear cart
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    apiUpdateOrderStatus(orderId, status).catch(() => {});
    toast.success(`Order #${orderId} status changed to ${status}!`);
  };

  const cancelOrder = (orderId: string) => {
    const orderToCancel = orders.find((o) => o.id === orderId);
    if (!orderToCancel) return;

    if (orderToCancel.status === "Delivered") {
      toast.error("Delivered orders cannot be cancelled directly.");
      return;
    }

    if (orderToCancel.status === "Cancelled") {
      toast("Order is already cancelled.", { icon: "ℹ️" });
      return;
    }

    // Restore stock for items
    setProducts((prev) =>
      prev.map((prod) => {
        const foundItem = orderToCancel.orderItems.find(
          (item) => item.productId === prod.id
        );
        if (foundItem) {
          return { ...prod, stock: prod.stock + foundItem.quantity };
        }
        return prod;
      })
    );

    // Update order status in state
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o))
    );

    apiCancelOrder(orderId).catch(() => {});
    toast.success(`Order #${orderId} was cancelled and stock has been restored!`);
  };

  const updateUserProfile = (data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
  }) => {
    if (data.name) setCurrentUserName(data.name);
    if (data.email) setCurrentUserEmail(data.email);
    if (data.phone) setCurrentUserPhone(data.phone);
    if (data.address) setCurrentUserAddress(data.address);

    // Also update customer record if matching email or name
    setCustomers((prev) =>
      prev.map((c) => {
        if (
          c.email.toLowerCase() === currentUserEmail.toLowerCase() ||
          c.name.toLowerCase() === currentUserName.toLowerCase()
        ) {
          return {
            ...c,
            name: data.name || c.name,
            email: data.email || c.email,
            avatar: data.avatar || c.avatar,
          };
        }
        return c;
      })
    );

    const targetId =
      currentUserId ||
      customers.find(
        (c) =>
          c.email.toLowerCase() === currentUserEmail.toLowerCase() ||
          c.name.toLowerCase() === currentUserName.toLowerCase()
      )?.id;

    if (targetId) {
      apiUpdateUser(targetId, {
        name: data.name,
        avatar: data.avatar,
      }).catch(() => {});
    }

    toast.success("Profile details updated successfully! ✨");
  };

  const addProduct = (product: Omit<Product, "id">): Product => {
    const id = `prod-${String(products.length + 1).padStart(3, "0")}`;
    const newProduct: Product = {
      ...product,
      id,
      rating: product.rating || 5.0,
      reviewCount: product.reviewCount || 1,
    };
    setProducts((prev) => [newProduct, ...prev]);
    apiCreateProduct(newProduct).catch(() => {});
    toast.success(`Product "${newProduct.name}" created successfully!`);
    return newProduct;
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updated } : prod))
    );
    apiUpdateProduct(id, updated).catch(() => {});
    toast.success("Product details updated!");
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    apiDeleteProduct(id).catch(() => {});
    toast("Product removed from inventory", { icon: "🗑️" });
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      const existing = prev.findIndex((c) => c.code.toUpperCase() === coupon.code.toUpperCase());
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = coupon;
        return next;
      }
      return [coupon, ...prev];
    });
    apiCreateCoupon(coupon).catch(() => {});
    toast.success(`Coupon ${coupon.code} added to live discounts! 🎟️`);
  };

  const addReview = (review: Omit<Review, "id" | "date">) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
    };
    setReviews((prev) => [newReview, ...prev]);
    apiAddReview(review.productId, {
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
    }).catch(() => {});

    // Update product rating average
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === review.productId) {
          const productReviews = [
            ...reviews.filter((r) => r.productId === p.id),
            newReview,
          ];
          const avg =
            productReviews.reduce((sum, r) => sum + r.rating, 0) /
            productReviews.length;
          return {
            ...p,
            rating: Number(avg.toFixed(1)),
            reviewCount: productReviews.length,
          };
        }
        return p;
      })
    );

    toast.success("Thank you! Review published successfully. ⭐");
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    toast.success("Customer record removed!");
  };

  const login = (
    role: "Admin" | "Customer",
    name?: string,
    email?: string,
    avatar?: string,
    id?: string
  ) => {
    setIsAuthenticated(true);
    setCurrentUserRole(role);
    if (id) setCurrentUserId(id);
    if (name) {
      setCurrentUserName(name);
    } else {
      setCurrentUserName(role === "Admin" ? "System Admin" : "Verified Customer");
    }
    if (email) {
      setCurrentUserEmail(email);
    } else {
      setCurrentUserEmail(
        role === "Admin" ? "admin@ecommerce.com" : "customer@store.com"
      );
    }
    if (avatar) {
      setCurrentUserAvatar(avatar);
    }
    toast.success(
      `Welcome back! Logged in as ${role} (${
        name || (role === "Admin" ? "System Admin" : "Customer")
      }).`
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    toast("Logged out successfully.", { icon: "👋" });
  };

  const toggleUserRole = () => {
    const next = currentUserRole === "Admin" ? "Customer" : "Admin";
    toast(`Switched perspective to: ${next}`, { icon: "🔄", id: "role-switch" });
    setCurrentUserRole(next);
  };

  return (
    <EcommerceContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        customers,
        coupons,
        reviews,
        appliedCoupon,
        isCartDrawerOpen,
        currentUserRole,
        currentUserId,
        currentUserName,
        currentUserEmail,
        currentUserPhone,
        currentUserAddress,
        currentUserAvatar,
        isAuthenticated,
        login,
        logout,
        toggleCartDrawer,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        applyCoupon,
        removeCoupon,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        updateUserProfile,
        addProduct,
        updateProduct,
        deleteProduct,
        addCoupon,
        addReview,
        deleteCustomer,
        toggleUserRole,
        isLegalModalOpen,
        legalModalTab,
        openLegalModal,
        closeLegalModal,
        isNdaSigned,
        signNdaAgreement,
        cookieConsent,
        setCookieConsent,
      }}
    >
      {children}
    </EcommerceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEcommerce = () => {
  const context = useContext(EcommerceContext);
  if (!context) {
    throw new Error("useEcommerce must be used within an EcommerceProvider");
  }
  return context;
};
