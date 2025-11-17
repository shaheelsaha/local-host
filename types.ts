// FIX: Switched to firebase/compat/app to use v8 syntax with v9 SDK and resolve type errors.
// FIX: Use Firebase v8 compat imports to resolve type errors for `firestore`.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export enum SocialPlatform {
    TWITTER = 'Twitter',
    LINKEDIN = 'LinkedIn',
    DRIBBBLE = 'Dribbble',
    INSTAGRAM = 'Instagram',
    FACEBOOK = 'Facebook',
    THREADS = 'Threads',
    YOUTUBE = 'YouTube',
    TIKTOK = 'TikTok',
    PINTEREST = 'Pinterest',
}

export interface Post {
    id: string;
    userId: string;
    caption: string;
    platforms: SocialPlatform[];
    tags: string[];
    mediaUrls: string[];
    scheduledAt: string; // Stored as ISO string in state
    status: 'scheduled' | 'published' | 'failed' | 'draft' | 'publishing';
    autoCommenting?: boolean;
    contentType?: 'image' | 'reel' | 'video';
}

export interface Persona {
    id?: string;
    userId: string;
    name: string;
    characteristics: string;
    avoid: string;
}

// NEW TYPES
export type PropertyType = 'Apartment' | 'Villa' | 'Townhouse' | 'Penthouse' | 'Duplex';
export type PropertyStatus = 'For Sale' | 'For Rent' | 'Sold' | 'Rented';
export type PropertyPlan = 'Studio' | '1 BHK' | '2 BHK' | '3 BHK' | '4+ BHK';

export interface Property {
    id: string;
    userId: string;
    title: string;
    location: string;
    price: number;
    currency: 'USD' | 'AED';
    bedrooms: number;
    bathrooms: number;
    area: number; // in sqft
    propertyType: PropertyType;
    status: PropertyStatus;
    plan: PropertyPlan;
    createdAt: firebase.firestore.Timestamp;
    imageUrl?: string;
    propertyLink?: string;
}

// NEW TYPE: Analytics Data
export interface AnalyticsData {
  id?: string;
  userId: string;
  totalPosts: number;
  totalEngagement: number;
  followerGrowthPercentage: number;
  postsByPlatform: { name: SocialPlatform; value: number }[];
  engagementOverTime: { date: string; value: number }[];
}

// NEW TYPES: Leads CRM
export type LeadStatus = 'NEW LEAD' | 'QUALIFYING' | 'SEND A PROPERTY' | 'APPOINTMENT BOOKED';

export interface Lead {
    id: string; // Document ID
    userId: string;
    
    name: string | null;
    phone: string | null;
    status: LeadStatus;
    createdAt: firebase.firestore.Timestamp;

    email?: string | null;
    budget?: number | null;
    Location?: string | null;
    bedrooms?: number | null;
    intent?: 'buying' | 'renting' | null;
    property_type?: string | null;
    notes?: string;
}
