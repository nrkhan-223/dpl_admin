export interface ApartmentUnit {
  id: string;
  unitNumber: string; // e.g. "Unit 201", "Unit 305", "Penthouse 42B"
  title?: string; // e.g. "Corner Executive 2-Bed Suite"
  bedrooms: number; // e.g. 2
  bathrooms: number; // e.g. 2
  balconies: number; // e.g. 1 or 2 as requested by user
  size: number; // in sqft (e.g. 1250)
  floor: string | number; // e.g. "2nd Floor", "Floor 4"
  price: number; // monthly rent for this unit (e.g. 3200)
  securityDeposit?: number;
  furnishing?: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';
  availabilityStatus: 'Available' | 'Assigned' | 'Reserved' | 'Maintenance';
  assignedUserId: string | null;
  assignedUserName?: string | null;
  features?: string[];
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  image: string | null;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  assignedPropertyId?: string | null;
  assignedUnitId?: string | null;
  assignedUnitNumber?: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName?: string;
  createdAt: string;
}

export interface PropertyContact {
  name: string;
  role: string;
  phone: string;
  email: string;
  whatsapp: string;
  officeHours: string;
}

export interface Property {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number; // starting or base rent
  securityDeposit: number;
  maintenanceFee: number;
  size: number; // in sqft
  bedrooms: number;
  bathrooms: number;
  balconies?: number; // base balconies
  floor: string | number;
  furnishing: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';
  parking: string;
  amenities: string[];
  images: string[];
  availabilityStatus: 'Available' | 'Assigned' | 'Reserved' | 'Maintenance';
  availableFrom: string;
  assignedUserId: string | null;
  // Multiple units inside this apartment building
  units: ApartmentUnit[];
  // Separate from category: Exclusive, Completed, Ongoing listing management
  isExclusive?: boolean;
  isFeatured?: boolean;
  projectStage: 'completed' | 'ongoing'; // 'completed' = completed development / ready; 'ongoing' = ongoing construction / upcoming handover
  listingCollection?: 'exclusive' | 'completed' | 'ongoing' | 'standard';
  contactAgent: PropertyContact;
  createdAt: string;
}

export interface Installment {
  id: string;
  installmentNumber: number;
  title: string; // e.g. "Installment 1 (Advance & Deposit)"
  dueDate: string; // e.g. "2026-03-01"
  amount: number;
  paidAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidAt?: string | null;
  paymentMethod?: 'Credit Card' | 'Bank Wire' | 'ACH Direct Debit' | 'Check / Cash';
  transactionRef?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  unitId?: string | null;
  unitNumber?: string | null;
  unitSpecs?: string | null; // e.g. "2 Bed · 2 Bath · 1 Balcony (1,250 sqft)"
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  totalContractValue: number;
  totalPaidAmount: number;
  totalDueAmount: number; // remaining due amount
  installments: Installment[]; // installment payment schedule
  status: 'Active' | 'Upcoming' | 'Completed' | 'Terminated';
  notes?: string;
  createdAt: string;
}

export type ViewMode = 'admin' | 'user';

export interface BlogPost {
  id: string;
  title: string;
  image: string; // cover image URL
  description: string; // HTML formatted content
  readTime: string; // input text, e.g. "5 min read"
  type: string; // input text, e.g. "Market Insights", "Architecture", "Investment Guide"
  author?: string;
  status?: 'published' | 'draft';
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface SisterConcern {
  id: string;
  name: string;
  image: string; // image or logo URL of the sister concern
  industry?: string; // e.g. "Asset Management", "Hospitality & Resorts", "Commercial Infrastructure"
  description?: string;
  websiteUrl?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

export interface OfficeScheduleItem {
  id: string;
  days: string; // e.g. "Saturday – Thursday", "Friday (Jummah)"
  hours: string; // e.g. "9:00 AM – 8:00 PM", "Appointments Only"
  isAppointmentOnly?: boolean;
}

export interface CompanyContactInfo {
  hotline: string;
  whatsapp: string;
  email: string;
  supportEmail?: string;
  address: string;
  cityStateZip: string;
  isOpenNow: boolean;
  statusBadgeText: string; // e.g. "OPEN NOW" or "CLOSED"
  schedules: OfficeScheduleItem[];
  emergencyNote: string; // "24/7 Hotline support remains active for urgent client inquiries."
  updatedAt?: string;
}

export interface CallbackRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  description: string;
  propertyInterest?: string;
  preferredTime?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Dismissed';
  priority?: 'Urgent' | 'High' | 'Normal';
  adminNotes?: string;
  calledAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface KeyAchievement {
  id: string;
  number: string; // e.g. "15+ Years", "120+", "50K+", "25+"
  label: string; // e.g. "Industry Experience", "Delivered Projects", "Happy Families", "National Awards"
  icon: string; // e.g. "award", "building", "users", "trophy"
  color: 'blue' | 'green' | 'amber' | 'purple' | 'sky';
  order: number;
}

export interface WhyChooseReason {
  id: string;
  title: string; // e.g. "100% Legal Transparency", "Timely Delivery Guarantee", "Eco-Friendly Smart Architecture", "Flexible Installment Plans"
  description: string; // e.g. "All land titles, city permits, and RAJUK approvals verified before project launch."
  icon: string; // e.g. "scale", "clock", "leaf", "wallet", "shield", "sparkles"
  color: 'blue' | 'green' | 'emerald' | 'amber' | 'rose' | 'indigo';
  order: number;
}

export interface CoreValue {
  id: string;
  title: string; // e.g. "Integrity & Trust", "Excellence", "Innovation", "Client Centricity"
  description: string; // e.g. "Uncompromising honesty and transparency in all dealings."
  icon: string; // e.g. "shield", "sparkles", "compass", "heart"
  badge?: string; // e.g. "FOUNDATION", "PILLAR", "STANDARD"
  order: number;
}

export interface JourneyMilestone {
  id: string;
  year: string; // e.g. "2010", "2015", "2020", "2026"
  title: string; // e.g. "Company Foundation", "50th Completed Project", "Eco-Villa Expansion", "Smart High-Rise ERA"
  description: string; // e.g. "Dreamer Properties LTD was established with a vision for modern, reliable real estate."
  order: number;
}

export interface CompanyAboutData {
  companyName: string; // "Dreamer Properties LTD"
  tagline: string; // "Building Trust, Delivering Excellence Since 2010"
  heroImage?: string; // Optional building image URL
  achievements: KeyAchievement[];
  whyChooseUs: WhyChooseReason[];
  coreValues: CoreValue[];
  milestones: JourneyMilestone[];
}
