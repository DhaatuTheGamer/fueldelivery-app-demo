
export enum FuelType {
  PETROL = 'Petrol',
  DIESEL = 'Diesel',
}

export enum VehicleType {
  CAR = 'Car',
  BIKE = 'Bike',
}

export interface Vehicle {
  id: string;
  nickname: string;
  registrationNumber: string;
  fuelType: FuelType;
  vehicleType: VehicleType;
}

export interface UserProfile {
  id: string;
  mobileNumber: string;
  fullName: string;
  email?: string;
}

export interface Order {
  id: string;
  userId: string;
  vehicleId: string;
  deliveryAddress: string;
  location: { lat: number; lng: number };
  fuelType: FuelType;
  quantityLiters?: number;
  quantityRupees?: number;
  pricePerLitre: number;
  fuelCost: number;
  convenienceFee: number;
  gstOnFee: number;
  totalAmount: number;
  paymentMethod: string;
  status: OrderStatus;
  orderDate: string; // ISO string
  deliveryCaptain?: DeliveryCaptain;
  otp?: string; // OTP for driver
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SEARCHING_CAPTAIN = 'Searching for Captain',
  CAPTAIN_ASSIGNED = 'Captain Assigned',
  EN_ROUTE = 'En Route',
  ARRIVED = 'Arrived',
  FUELLING = 'Fuelling',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface DeliveryCaptain {
  id: string;
  name: string;
  rating: number;
  vehicleNumber: string;
  photoUrl: string; // URL to captain's photo
  currentLocation?: { lat: number; lng: number };
}

export interface PastOrder extends Order {
  invoiceUrl?: string; // Link to downloadable invoice
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type PaymentOption = 'UPI' | 'Card' | 'NetBanking'; // Simplified

// Used for contexts
export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (mobileNumber: string, otp: string) => Promise<void>; // Simulates OTP verification and profile fetch/creation
  completeProfile: (fullName: string, email?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface VehicleContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (vehicle: Vehicle) => Promise<void>;
  removeVehicle: (vehicleId: string) => Promise<void>;
  getVehicleById: (vehicleId: string) => Vehicle | undefined;
  isLoading: boolean;
}

export interface OrderContextType {
  currentOrder: Partial<Order> | null;
  updateCurrentOrder: (details: Partial<Order>) => void;
  placeOrder: () => Promise<Order | null>; // Simulates placing order
  getOrderById: (orderId: string) => Promise<Order | null>; // Simulates fetching order
  pastOrders: PastOrder[];
  fetchPastOrders: () => Promise<void>;
  isLoading: boolean;
  activeOrder: Order | null; // For live tracking
  trackOrder: (orderId: string) => void; // Starts tracking an order
  clearCurrentOrder: () => void;
}

// For navigation purposes, specific to some screens
export interface LocationState {
  from?: string;
}
