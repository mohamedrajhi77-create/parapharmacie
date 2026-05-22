export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  order: number;
  isActive: boolean;
  _count?: { products: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  usageAdvice?: string | null;
  price: number;
  comparePrice?: number | null;
  images: string[];
  brand?: string | null;
  reference?: string | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isPromotion: boolean;
  categoryId: string;
  category: Category;
  tags: string[];
  weight?: number | null;
  viewCount: number;
  reviews?: Review[];
  _count?: { reviews: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string | null;
  isPublic: boolean;
  user: { name?: string | null; image?: string | null };
  createdAt: Date;
}

export interface Reservation {
  id: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: Date;
  pickupTime: string;
  status: ReservationStatus;
  notes?: string | null;
  adminNotes?: string | null;
  items: ReservationItem[];
  totalAmount: number;
  confirmationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export interface ReservationItem {
  id: string;
  reservationId: string;
  productId: string;
  product: Product;
  productName: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface ReservationFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  pickupTime: string;
  notes?: string;
}

export interface ProductFilters {
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  isPromotion?: boolean;
  isNew?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular" | "name";
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminStats {
  totalReservations: number;
  pendingReservations: number;
  totalProducts: number;
  totalRevenue: number;
  recentReservations: Reservation[];
}
