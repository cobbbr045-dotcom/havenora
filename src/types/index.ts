export type EnquiryStatus = 'New' | 'Contacted' | 'Pending' | 'Confirmed' | 'Cancelled';

export interface Room {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  currency: string;
  capacity: number;
  bedConfiguration: string;
  roomSize: string;
  view: string;
  amenities: string[];
  features: string[];
  mainImage: string;
  galleryImages: string[];
  published: boolean;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomId?: string;
  roomName?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message?: string;
  status: EnquiryStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface Booking {
  id: string; // e.g. "HV-202611-942"
  customerName: string;
  phone: string;
  email: string;
  bookingDate: string; // "YYYY-MM-DD"
  timeSlot: string; // "09:00 - 10:00"
  bookingType: 'Suite Viewing & Stay Consultation' | 'Sunrise Tea & Yoga Experience' | 'Culinary Hearth Tasting' | 'Private Wellness Sanctuary' | 'General Retreat Experience';
  guests: number;
  specialRequests?: string;
  status: BookingStatus;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedSlot {
  id: string;
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // "09:00 - 10:00" or "ALL_DAY"
  reason: string;
  createdAt: string;
}

export interface HourlySlotInfo {
  timeSlot: string; // e.g. "09:00 - 10:00"
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  status: 'available' | 'booked' | 'blocked';
  booking?: Booking;
  blockedSlot?: BlockedSlot;
}

export type GalleryCategory = 'Architecture' | 'Rooms' | 'Interiors' | 'Dining' | 'Nature' | 'Details';

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: GalleryCategory;
  displayOrder: number;
  published: boolean;
  aspect?: 'portrait' | 'landscape' | 'square';
  createdAt: string;
}

export interface SiteSettings {
  id: string;
  hotelName: string;
  tagline: string;
  brandDescription: string;
  fullStory: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  mapEmbedUrl: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    tripadvisor?: string;
    pinterest?: string;
  };
  homepage: {
    heroSubheading: string;
    heroHeading: string;
    heroTagline: string;
    heroDescription: string;
    heroImage: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    introHeading: string;
    introSubheading: string;
    introDescription: string;
  };
  updatedAt: string;
}

export interface OwnerUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'owner' | 'manager';
  lastLogin?: string;
}
