import type {
  Product,
  Order,
  Customer,
  Coupon,
  Review,
  OrderStatus,
} from "../types/ecommerceTypes";

export const API_BASE_URL =
  import.meta.env.VITE_BACKEND_SERVER ||
  (import.meta.env.PROD ? "/api/v1" : "http://localhost:4000/api/v1");

const headers = {
  "Content-Type": "application/json",
  "x-admin-role": "true",
};

// Generic fetch wrapper with graceful error handling
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });
    if (!res.ok) {
      console.warn(`API call failed [${res.status}]: ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`Network error for API call: ${url}`, err);
    return null;
  }
}

// Products APIs
export const apiGetProducts = async (): Promise<Product[] | null> => {
  const data = await fetchJson<{ success: boolean; products: Product[] }>(
    `${API_BASE_URL}/product/admin-products?admin=true`
  );
  return data?.success ? data.products : null;
};

export const apiGetFeaturedProducts = async (): Promise<Product[] | null> => {
  const data = await fetchJson<{ success: boolean; products: Product[] }>(
    `${API_BASE_URL}/product/featured`
  );
  return data?.success ? data.products : null;
};

export const apiGetSingleProduct = async (id: string): Promise<Product | null> => {
  const data = await fetchJson<{ success: boolean; product: Product }>(
    `${API_BASE_URL}/product/${id}`
  );
  return data?.success ? data.product : null;
};

export const apiCreateProduct = async (
  product: Partial<Product>
): Promise<Product | null> => {
  const data = await fetchJson<{ success: boolean; product: Product }>(
    `${API_BASE_URL}/product/new?admin=true`,
    {
      method: "POST",
      body: JSON.stringify(product),
    }
  );
  return data?.success ? data.product : null;
};

export const apiUpdateProduct = async (
  id: string,
  updated: Partial<Product>
): Promise<boolean> => {
  const data = await fetchJson<{ success: boolean }>(
    `${API_BASE_URL}/product/${id}?admin=true`,
    {
      method: "PUT",
      body: JSON.stringify(updated),
    }
  );
  return !!data?.success;
};

export const apiDeleteProduct = async (id: string): Promise<boolean> => {
  const data = await fetchJson<{ success: boolean }>(
    `${API_BASE_URL}/product/${id}?admin=true`,
    {
      method: "DELETE",
    }
  );
  return !!data?.success;
};

// Reviews APIs
export const apiAddReview = async (
  productId: string,
  review: { userName: string; rating: number; comment: string }
): Promise<Review | null> => {
  const data = await fetchJson<{ success: boolean; review: Review }>(
    `${API_BASE_URL}/product/${productId}/review`,
    {
      method: "POST",
      body: JSON.stringify(review),
    }
  );
  return data?.success ? data.review : null;
};

export const apiGetReviews = async (productId: string): Promise<Review[] | null> => {
  const data = await fetchJson<{ success: boolean; reviews: Review[] }>(
    `${API_BASE_URL}/product/${productId}/reviews`
  );
  return data?.success ? data.reviews : null;
};

// Orders APIs
export const apiGetOrders = async (): Promise<Order[] | null> => {
  const data = await fetchJson<{ success: boolean; orders: Order[] }>(
    `${API_BASE_URL}/order/all?admin=true`
  );
  return data?.success ? data.orders : null;
};

export const apiCreateOrder = async (order: any): Promise<Order | null> => {
  const data = await fetchJson<{ success: boolean; order: Order }>(
    `${API_BASE_URL}/order/new`,
    {
      method: "POST",
      body: JSON.stringify(order),
    }
  );
  return data?.success ? data.order : null;
};

export const apiUpdateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<boolean> => {
  const data = await fetchJson<{ success: boolean }>(
    `${API_BASE_URL}/order/${orderId}?admin=true`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    }
  );
  return !!data?.success;
};

export const apiCancelOrder = async (orderId: string): Promise<boolean> => {
  const data = await fetchJson<{ success: boolean }>(
    `${API_BASE_URL}/order/${orderId}/cancel`,
    {
      method: "PUT",
    }
  );
  return !!data?.success;
};

// Coupons APIs
export const apiGetCoupons = async (): Promise<Coupon[] | null> => {
  const data = await fetchJson<{ success: boolean; coupons: Coupon[] }>(
    `${API_BASE_URL}/payment/coupon/all`
  );
  return data?.success ? data.coupons : null;
};

export const apiCreateCoupon = async (coupon: Coupon): Promise<Coupon | null> => {
  const data = await fetchJson<{ success: boolean; coupon: Coupon }>(
    `${API_BASE_URL}/payment/coupon/new?admin=true`,
    {
      method: "POST",
      body: JSON.stringify(coupon),
    }
  );
  return data?.success ? data.coupon : null;
};

export const apiDeleteCoupon = async (id: string): Promise<boolean> => {
  const data = await fetchJson<{ success: boolean }>(
    `${API_BASE_URL}/payment/coupon/${id}?admin=true`,
    {
      method: "DELETE",
    }
  );
  return !!data?.success;
};

// Customers APIs
export const apiGetCustomers = async (): Promise<Customer[] | null> => {
  const data = await fetchJson<{ success: boolean; users: any[] }>(
    `${API_BASE_URL}/user/all?admin=true`
  );
  if (!data?.success) return null;
  return data.users.map((u) => ({
    id: u.id || u._id,
    name: u.name,
    email: u.email,
    gender: u.gender,
    role: u.role === "admin" || u.role === "Admin" ? "Admin" : "Customer",
    avatar: u.avatar || u.photo,
    joinedDate: u.joinedDate || (u.createdAt ? u.createdAt.slice(0, 10) : ""),
    totalOrders: u.totalOrders || 0,
  }));
};

export const apiCreateUser = async (
  user: any
): Promise<{ success: boolean; user?: any; message?: string } | null> => {
  const data = await fetchJson<{ success: boolean; user?: any; message?: string }>(
    `${API_BASE_URL}/user/new`,
    {
      method: "POST",
      body: JSON.stringify(user),
    }
  );
  return data;
};

export const apiGetUser = async (id: string): Promise<any | null> => {
  const data = await fetchJson<{ success: boolean; user: any }>(
    `${API_BASE_URL}/user/${id}`
  );
  return data?.success ? data.user : null;
};

export const apiUpdateUser = async (
  id: string,
  user: Partial<Customer>
): Promise<boolean> => {
  const data = await fetchJson<{ success: boolean }>(
    `${API_BASE_URL}/user/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(user),
    }
  );
  return !!data?.success;
};

// Analytics APIs
export const apiGetDashboardStats = async () => {
  return await fetchJson<{ success: boolean; stats: any }>(
    `${API_BASE_URL}/dashboard/stats?admin=true`
  );
};

export const apiGetPieCharts = async () => {
  return await fetchJson<{ success: boolean; charts: any }>(
    `${API_BASE_URL}/dashboard/pie?admin=true`
  );
};

export const apiGetBarCharts = async () => {
  return await fetchJson<{ success: boolean; charts: any }>(
    `${API_BASE_URL}/dashboard/bar?admin=true`
  );
};

export const apiGetLineCharts = async () => {
  return await fetchJson<{ success: boolean; charts: any }>(
    `${API_BASE_URL}/dashboard/line?admin=true`
  );
};
