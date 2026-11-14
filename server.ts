import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import QRCode from 'qrcode';
import type {
  User,
  Donation,
  NgoRequirement,
  VolunteerTask,
  PlatformNotification,
  ImpactStats,
  SmartMatchResult,
  DonationStatus,
  FoodCategory,
  UrgencyLevel,
} from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Seed data store
const USERS: User[] = [
  // Donors
  {
    id: 'user_donor_1',
    name: 'Chef Ramesh Sharma',
    email: 'ramesh@spiceterrace.in',
    role: 'donor',
    phone: '+91 98450 11223',
    organizationName: 'Spice Terrace Restaurant',
    donorType: 'Restaurant',
    address: '24/1, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
    location: { lat: 12.9784, lng: 77.6408, area: 'Indiranagar' },
    rating: 4.9,
    completedDonationsCount: 42,
    totalKgDonated: 620,
    badges: ['Food Hero', 'Swift Rescuer', 'Zero Waste Champion'],
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user_donor_2',
    name: 'Priya Nair',
    email: 'priya@dailybakes.com',
    role: 'donor',
    phone: '+91 98451 22334',
    organizationName: 'Daily Bakes & Confectionery',
    donorType: 'Bakery',
    address: '88, 5th Cross, 6th Block, Koramangala, Bengaluru, Karnataka 560095',
    location: { lat: 12.9352, lng: 77.6245, area: 'Koramangala' },
    rating: 4.8,
    completedDonationsCount: 35,
    totalKgDonated: 410,
    badges: ['Food Saver', 'Bakery Champion'],
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'user_donor_3',
    name: 'Executive Chef Anand Vardhan',
    email: 'anand@grandbengaluru.in',
    role: 'donor',
    phone: '+91 98452 33445',
    organizationName: 'The Grand Bengaluru Hotel & Banquet',
    donorType: 'Hotel',
    address: '1 MG Road, Bengaluru, Karnataka 560001',
    location: { lat: 12.9748, lng: 77.6094, area: 'MG Road' },
    rating: 5.0,
    completedDonationsCount: 68,
    totalKgDonated: 1250,
    badges: ['Mega Donor', 'Food Hero', 'Sustainable Leader'],
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user_donor_4',
    name: 'Manish Agarwal',
    email: 'manish@freshharvest.in',
    role: 'donor',
    phone: '+91 98453 44556',
    organizationName: 'FreshHarvest Organics & Supermarket',
    donorType: 'Grocery',
    address: '14, 27th Main, Sector 1, HSR Layout, Bengaluru, Karnataka 560102',
    location: { lat: 12.9121, lng: 77.6446, area: 'HSR Layout' },
    rating: 4.7,
    completedDonationsCount: 22,
    totalKgDonated: 340,
    badges: ['Green Partner'],
    createdAt: '2026-02-15T11:00:00Z',
  },
  {
    id: 'user_donor_5',
    name: 'Smt. Kamala Devi',
    email: 'kamala.devi@gmail.com',
    role: 'donor',
    phone: '+91 98454 55667',
    organizationName: 'Devi Family Kitchen',
    donorType: 'Household',
    address: '42, 8th Main, 15th Cross, Malleshwaram, Bengaluru, Karnataka 560003',
    location: { lat: 13.0031, lng: 77.5683, area: 'Malleshwaram' },
    rating: 4.9,
    completedDonationsCount: 14,
    totalKgDonated: 95,
    badges: ['Community Star'],
    createdAt: '2026-03-01T09:00:00Z',
  },

  // NGOs
  {
    id: 'user_ngo_1',
    name: 'Annapoorna Community Relief',
    email: 'contact@annapoornafood.org',
    role: 'ngo',
    phone: '+91 80 2525 9901',
    organizationName: 'Annapoorna Community Relief Trust',
    address: '102, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru 560008',
    location: { lat: 12.9698, lng: 77.6499, area: 'Indiranagar' },
    isVerified: true,
    verificationDocuments: ['80G_Tax_Exemption.pdf', 'NGO_Darpan_Reg_2024.pdf'],
    beneficiaryCount: 350,
    completedDonationsCount: 88,
    rating: 4.95,
    createdAt: '2025-11-20T10:00:00Z',
  },
  {
    id: 'user_ngo_2',
    name: 'Karuna Children Shelter & Home',
    email: 'director@karunashelter.org',
    role: 'ngo',
    phone: '+91 80 2553 4412',
    organizationName: 'Karuna Orphanage & Senior Care',
    address: '55, 1st Block, Koramangala, Bengaluru 560034',
    location: { lat: 12.9279, lng: 77.6271, area: 'Koramangala' },
    isVerified: true,
    verificationDocuments: ['Trust_Deed_Cert.pdf', 'FCRA_Renewal.pdf'],
    beneficiaryCount: 180,
    completedDonationsCount: 64,
    rating: 4.9,
    createdAt: '2025-12-05T12:00:00Z',
  },
  {
    id: 'user_ngo_3',
    name: 'Hope Bengaluru Hunger Mission',
    email: 'info@hopehungerrelief.org',
    role: 'ngo',
    phone: '+91 80 2664 1234',
    organizationName: 'Hope Foundation Bengaluru',
    address: '32, 9th Cross, Jayanagar 4th Block, Bengaluru 560011',
    location: { lat: 12.9250, lng: 77.5938, area: 'Jayanagar' },
    isVerified: true,
    verificationDocuments: ['NGO_Certificate_2025.pdf'],
    beneficiaryCount: 420,
    completedDonationsCount: 110,
    rating: 4.98,
    createdAt: '2025-10-15T09:00:00Z',
  },
  {
    id: 'user_ngo_4',
    name: 'Hasiru Community Kitchen',
    email: 'hasiru.kitchen@gmail.com',
    role: 'ngo',
    phone: '+91 80 2841 5566',
    organizationName: 'Hasiru Community Workers Relief',
    address: 'Plot 7, ITPL Main Road, Whitefield, Bengaluru 560066',
    location: { lat: 12.9833, lng: 77.7289, area: 'Whitefield' },
    isVerified: true,
    verificationDocuments: ['Hasiru_Trust_Doc.pdf'],
    beneficiaryCount: 260,
    completedDonationsCount: 45,
    rating: 4.85,
    createdAt: '2026-01-20T14:00:00Z',
  },
  {
    id: 'user_ngo_5',
    name: 'Seva Sankalp Welfare Society (Pending Verification)',
    email: 'sevasankalp.blr@gmail.com',
    role: 'ngo',
    phone: '+91 99001 77889',
    organizationName: 'Seva Sankalp Welfare Society',
    address: '15, Sampige Road, Malleshwaram, Bengaluru 560003',
    location: { lat: 13.0012, lng: 77.5701, area: 'Malleshwaram' },
    isVerified: false,
    verificationDocuments: ['Societies_Registration_Application.pdf'],
    beneficiaryCount: 120,
    completedDonationsCount: 0,
    rating: 0,
    createdAt: '2026-03-02T16:00:00Z',
  },

  // Volunteers
  {
    id: 'user_vol_1',
    name: 'Rahul Deshmukh',
    email: 'rahul.deshmukh@gmail.com',
    role: 'volunteer',
    phone: '+91 98801 12345',
    address: 'Defence Colony, Indiranagar, Bengaluru 560038',
    location: { lat: 12.9790, lng: 77.6420, area: 'Indiranagar' },
    rating: 5.0,
    completedDonationsCount: 38,
    totalHoursVolunteered: 72,
    badges: ['Volunteer Star', 'Speedy Rescuer', 'Top Courier'],
    createdAt: '2026-01-05T10:00:00Z',
  },
  {
    id: 'user_vol_2',
    name: 'Ananya Sen',
    email: 'ananya.sen@gmail.com',
    role: 'volunteer',
    phone: '+91 98802 23456',
    address: '4th Block, Koramangala, Bengaluru 560034',
    location: { lat: 12.9340, lng: 77.6250, area: 'Koramangala' },
    rating: 4.9,
    completedDonationsCount: 29,
    totalHoursVolunteered: 54,
    badges: ['Volunteer Star', 'Weekend Warrior'],
    createdAt: '2026-01-18T11:00:00Z',
  },
  {
    id: 'user_vol_3',
    name: 'Karthik Raja',
    email: 'karthik.raja@gmail.com',
    role: 'volunteer',
    phone: '+91 98803 34567',
    address: 'Sector 2, HSR Layout, Bengaluru 560102',
    location: { lat: 12.9110, lng: 77.6420, area: 'HSR Layout' },
    rating: 4.85,
    completedDonationsCount: 21,
    totalHoursVolunteered: 40,
    badges: ['Active Courier'],
    createdAt: '2026-02-10T14:00:00Z',
  },

  // Admin
  {
    id: 'user_admin',
    name: 'Operations Admin',
    email: 'admin@shareaplate.org',
    role: 'admin',
    phone: '+91 80 4000 1234',
    organizationName: 'ShareAPlate Foundation India',
    address: 'Civic Impact Hub, MG Road, Bengaluru 560001',
    location: { lat: 12.9750, lng: 77.6090, area: 'MG Road' },
    createdAt: '2025-01-01T00:00:00Z',
  },
];

// Helper: generate OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 20 realistic donations in Bengaluru
let DONATIONS: Donation[] = [
  {
    id: 'don_001',
    donorId: 'user_donor_1',
    donorName: 'Chef Ramesh Sharma (Spice Terrace)',
    donorType: 'Restaurant',
    donorPhone: '+91 98450 11223',
    foodName: 'Nutritious Vegetable Pulao & Dal Tadka',
    category: 'Cooked Meals',
    description: 'Freshly prepared vegetable pulao with carrots, beans, peas, and rich yellow dal tadka prepared for lunch banquet. Neatly packed into food-grade containers.',
    quantity: 45,
    unit: 'boxes',
    estimatedMeals: 45,
    imageUrl: '/src/assets/images/marketplace_fresh_meals_1794072150653.jpg',
    isVegetarian: true,
    dietaryTags: ['Vegetarian', 'Jain Option Available', 'Nut-Free'],
    allergens: ['None'],
    packagingType: 'Compostable Kraft Meal Boxes',
    preparationTime: '2026-11-07T12:00:00',
    storageConditions: 'Hot Holding (>60°C)',
    pickupLocation: {
      address: 'Spice Terrace, 100 Feet Road, Indiranagar',
      lat: 12.9784,
      lng: 77.6408,
      area: 'Indiranagar',
      specialInstructions: 'Park in service lane behind kitchen, ask for Chef Ramesh.',
    },
    pickupStartTime: '2026-11-07T13:30:00',
    pickupDeadline: '2026-11-07T16:00:00',
    status: 'Available',
    urgency: 'High',
    verificationToken: 'TOKEN_DON_001_A91B',
    otpCode: '482910',
    safetyChecklistConfirmed: true,
    aiSafetyNotes: 'Cooked meals should be collected within 3 hours of preparation if held warm. Verified clean kitchen.',
    statusHistory: [
      {
        status: 'Available',
        timestamp: '2026-11-07T12:15:00Z',
        updatedBy: 'Chef Ramesh Sharma',
        actorRole: 'donor',
        note: 'Published donation after kitchen lunch wrap-up.',
      },
    ],
    createdAt: '2026-11-07T12:15:00Z',
    updatedAt: '2026-11-07T12:15:00Z',
  },
  {
    id: 'don_002',
    donorId: 'user_donor_2',
    donorName: 'Priya Nair (Daily Bakes)',
    donorType: 'Bakery',
    donorPhone: '+91 98451 22334',
    foodName: 'Artisanal Sourdough & Fresh Breads',
    category: 'Bakery Products',
    description: 'Crisp rustic sourdough loaves, whole wheat loaves, and French baguettes baked fresh this morning. Sealed in food grade paper covers.',
    quantity: 35,
    unit: 'boxes',
    estimatedMeals: 70,
    imageUrl: '/src/assets/images/bakery_surplus_bread_1794072151734.jpg',
    isVegetarian: true,
    dietaryTags: ['Vegetarian', 'Dairy-Free'],
    allergens: ['Wheat (Gluten)'],
    packagingType: 'Eco-friendly Brown Paper Bags',
    preparationTime: '2026-11-07T07:30:00',
    storageConditions: 'Room Temperature (Dry)',
    pickupLocation: {
      address: 'Daily Bakes, 5th Cross, 6th Block, Koramangala',
      lat: 12.9352,
      lng: 77.6245,
      area: 'Koramangala',
      specialInstructions: 'Come through front display counter.',
    },
    pickupStartTime: '2026-11-07T14:00:00',
    pickupDeadline: '2026-11-07T19:00:00',
    status: 'Available',
    urgency: 'Medium',
    verificationToken: 'TOKEN_DON_002_C82D',
    otpCode: '319402',
    safetyChecklistConfirmed: true,
    aiSafetyNotes: 'Bakery bread items have high stability (24-48h at room temp in dry conditions).',
    statusHistory: [
      {
        status: 'Available',
        timestamp: '2026-11-07T11:00:00Z',
        updatedBy: 'Priya Nair',
        actorRole: 'donor',
      },
    ],
    createdAt: '2026-11-07T11:00:00Z',
    updatedAt: '2026-11-07T11:00:00Z',
  },
  {
    id: 'don_003',
    donorId: 'user_donor_3',
    donorName: 'The Grand Bengaluru Hotel',
    donorType: 'Hotel',
    donorPhone: '+91 98452 33445',
    foodName: 'South Indian Banquet Meal Packs (Sambar, Rice, Kootu)',
    category: 'Cooked Meals',
    description: 'High-grade surplus from corporate seminar: Steamed Sona Masoori rice, mixed vegetable sambar, vegetable kootu, and curd rice cups.',
    quantity: 80,
    unit: 'boxes',
    estimatedMeals: 80,
    imageUrl: '/src/assets/images/hero_food_rescue_1794072150460.jpg',
    isVegetarian: true,
    dietaryTags: ['Vegetarian', 'Gluten-Free Options'],
    allergens: ['Dairy (in Curd Rice)'],
    packagingType: 'Multi-compartment Sealed Trays',
    preparationTime: '2026-11-07T12:30:00',
    storageConditions: 'Hot Holding (>60°C)',
    pickupLocation: {
      address: '1 MG Road, Central Bengaluru',
      lat: 12.9748,
      lng: 77.6094,
      area: 'MG Road',
      specialInstructions: 'Banquet loading bay, Gate 3.',
    },
    pickupStartTime: '2026-11-07T13:45:00',
    pickupDeadline: '2026-11-07T15:45:00',
    status: 'Claimed',
    urgency: 'Urgent',
    claimedByNgoId: 'user_ngo_1',
    claimedByNgoName: 'Annapoorna Community Relief',
    assignedVolunteerId: 'user_vol_1',
    assignedVolunteerName: 'Rahul Deshmukh',
    verificationToken: 'TOKEN_DON_003_FE11',
    otpCode: '829415',
    safetyChecklistConfirmed: true,
    aiSafetyNotes: 'Prompt collection requested due to banquet hot-holding threshold.',
    statusHistory: [
      {
        status: 'Available',
        timestamp: '2026-11-07T12:40:00Z',
        updatedBy: 'Anand Vardhan',
        actorRole: 'donor',
      },
      {
        status: 'Claimed',
        timestamp: '2026-11-07T12:55:00Z',
        updatedBy: 'Annapoorna Community Relief',
        actorRole: 'ngo',
        note: 'Claimed for Indiranagar slum community shelter.',
      },
      {
        status: 'Pickup Scheduled',
        timestamp: '2026-11-07T13:05:00Z',
        updatedBy: 'Rahul Deshmukh',
        actorRole: 'volunteer',
        note: 'Assigned volunteer Rahul en route for 13:45 pickup.',
      },
    ],
    createdAt: '2026-11-07T12:40:00Z',
    updatedAt: '2026-11-07T13:05:00Z',
  },
  {
    id: 'don_004',
    donorId: 'user_donor_4',
    donorName: 'FreshHarvest Organics',
    donorType: 'Grocery',
    donorPhone: '+91 98453 44556',
    foodName: 'Fresh Farm Produce (Carrots, Beans, Tomatoes & Apples)',
    category: 'Vegetables',
    description: 'Surplus organic farm fresh produce received this morning. Super fresh, perfect for NGO community kitchen stews and cooking.',
    quantity: 60,
    unit: 'kg',
    estimatedMeals: 150,
    imageUrl: '/src/assets/images/food_plate_sharing_1794072151768.jpg',
    isVegetarian: true,
    dietaryTags: ['Vegan', 'Raw Organic'],
    allergens: ['None'],
    packagingType: 'Crates & Mesh Sacks',
    preparationTime: '2026-11-07T08:00:00',
    storageConditions: 'Refrigerated (below 4°C)',
    pickupLocation: {
      address: 'Sector 1, HSR Layout, Bengaluru',
      lat: 12.9121,
      lng: 77.6446,
      area: 'HSR Layout',
      specialInstructions: 'Store loading dock behind petrol pump.',
    },
    pickupStartTime: '2026-11-07T14:00:00',
    pickupDeadline: '2026-11-07T20:00:00',
    status: 'Available',
    urgency: 'Low',
    verificationToken: 'TOKEN_DON_004_BB77',
    otpCode: '654321',
    safetyChecklistConfirmed: true,
    aiSafetyNotes: 'Raw uncut produce, safe for distribution throughout the day.',
    statusHistory: [
      {
        status: 'Available',
        timestamp: '2026-11-07T09:30:00Z',
        updatedBy: 'Manish Agarwal',
        actorRole: 'donor',
      },
    ],
    createdAt: '2026-11-07T09:30:00Z',
    updatedAt: '2026-11-07T09:30:00Z',
  },
  {
    id: 'don_005',
    donorId: 'user_donor_5',
    donorName: 'Kamala Devi Household',
    donorType: 'Household',
    donorPhone: '+91 98454 55667',
    foodName: 'Homemade Chapati & Mixed Veg Kurma',
    category: 'Cooked Meals',
    description: 'Family prayer function surplus: 50 freshly made phulka chapatis and 2 large handis of aromatic vegetable kurma.',
    quantity: 25,
    unit: 'portions',
    estimatedMeals: 25,
    imageUrl: '/src/assets/images/marketplace_fresh_meals_1794072150653.jpg',
    isVegetarian: true,
    dietaryTags: ['Vegetarian', 'Home Cooked'],
    allergens: ['Wheat (Gluten)'],
    packagingType: 'Insulated Hot Packs',
    preparationTime: '2026-11-07T11:30:00',
    storageConditions: 'Hot Holding (>60°C)',
    pickupLocation: {
      address: '15th Cross, Malleshwaram, Bengaluru',
      lat: 13.0031,
      lng: 77.5683,
      area: 'Malleshwaram',
      specialInstructions: '2nd Floor Apartment 204. Lift available.',
    },
    pickupStartTime: '2026-11-07T13:00:00',
    pickupDeadline: '2026-11-07T16:30:00',
    status: 'Available',
    urgency: 'Medium',
    verificationToken: 'TOKEN_DON_005_99AA',
    otpCode: '918273',
    safetyChecklistConfirmed: true,
    aiSafetyNotes: 'Home cooked meals prepared under hygienic conditions.',
    statusHistory: [
      {
        status: 'Available',
        timestamp: '2026-11-07T12:00:00Z',
        updatedBy: 'Kamala Devi',
        actorRole: 'donor',
      },
    ],
    createdAt: '2026-11-07T12:00:00Z',
    updatedAt: '2026-11-07T12:00:00Z',
  },
  {
    id: 'don_006',
    donorId: 'user_donor_1',
    donorName: 'Chef Ramesh Sharma (Spice Terrace)',
    donorType: 'Restaurant',
    donorPhone: '+91 98450 11223',
    foodName: 'Paneer Butter Masala & Jeera Rice',
    category: 'Cooked Meals',
    description: '30 generous portion boxes of aromatic jeera rice and rich paneer butter masala.',
    quantity: 30,
    unit: 'boxes',
    estimatedMeals: 30,
    imageUrl: '/src/assets/images/marketplace_fresh_meals_1794072150653.jpg',
    isVegetarian: true,
    dietaryTags: ['Vegetarian'],
    allergens: ['Dairy'],
    packagingType: 'Sealed Meal Boxes',
    preparationTime: '2026-11-06T19:30:00',
    storageConditions: 'Refrigerated (below 4°C)',
    pickupLocation: {
      address: 'Spice Terrace, Indiranagar',
      lat: 12.9784,
      lng: 77.6408,
      area: 'Indiranagar',
    },
    pickupStartTime: '2026-11-06T20:30:00',
    pickupDeadline: '2026-11-06T22:30:00',
    status: 'Delivered',
    urgency: 'Low',
    claimedByNgoId: 'user_ngo_1',
    claimedByNgoName: 'Annapoorna Community Relief',
    assignedVolunteerId: 'user_vol_1',
    assignedVolunteerName: 'Rahul Deshmukh',
    verificationToken: 'TOKEN_DON_006_COMP',
    otpCode: '102938',
    safetyChecklistConfirmed: true,
    statusHistory: [
      { status: 'Available', timestamp: '2026-11-06T19:45:00Z', updatedBy: 'Chef Ramesh', actorRole: 'donor' },
      { status: 'Claimed', timestamp: '2026-11-06T20:00:00Z', updatedBy: 'Annapoorna', actorRole: 'ngo' },
      { status: 'Picked Up', timestamp: '2026-11-06T20:45:00Z', updatedBy: 'Rahul Deshmukh', actorRole: 'volunteer' },
      { status: 'Delivered', timestamp: '2026-11-06T21:20:00Z', updatedBy: 'Annapoorna staff', actorRole: 'ngo' },
    ],
    createdAt: '2026-11-06T19:45:00Z',
    updatedAt: '2026-11-06T21:20:00Z',
  },
  {
    id: 'don_007',
    donorId: 'user_donor_2',
    donorName: 'Priya Nair (Daily Bakes)',
    donorType: 'Bakery',
    donorPhone: '+91 98451 22334',
    foodName: 'Butter Croissants & Cinnamon Rolls',
    category: 'Bakery Products',
    description: 'Surplus afternoon batch of fresh butter croissants and cinnamon swirl buns. Perfect condition.',
    quantity: 40,
    unit: 'boxes',
    estimatedMeals: 40,
    imageUrl: '/src/assets/images/bakery_surplus_bread_1794072151734.jpg',
    isVegetarian: true,
    dietaryTags: ['Vegetarian'],
    allergens: ['Wheat', 'Dairy'],
    packagingType: 'Bakery Boxes',
    preparationTime: '2026-11-07T10:00:00',
    storageConditions: 'Room Temperature (Dry)',
    pickupLocation: {
      address: 'Daily Bakes, Koramangala',
      lat: 12.9352,
      lng: 77.6245,
      area: 'Koramangala',
    },
    pickupStartTime: '2026-11-07T14:30:00',
    pickupDeadline: '2026-11-07T18:30:00',
    status: 'In Transit',
    urgency: 'Medium',
    claimedByNgoId: 'user_ngo_2',
    claimedByNgoName: 'Karuna Children Shelter & Home',
    assignedVolunteerId: 'user_vol_2',
    assignedVolunteerName: 'Ananya Sen',
    verificationToken: 'TOKEN_DON_007_TRNS',
    otpCode: '584920',
    safetyChecklistConfirmed: true,
    statusHistory: [
      { status: 'Available', timestamp: '2026-11-07T10:30:00Z', updatedBy: 'Priya Nair', actorRole: 'donor' },
      { status: 'Claimed', timestamp: '2026-11-07T11:15:00Z', updatedBy: 'Karuna Shelter', actorRole: 'ngo' },
      { status: 'Picked Up', timestamp: '2026-11-07T13:00:00Z', updatedBy: 'Ananya Sen', actorRole: 'volunteer' },
      { status: 'In Transit', timestamp: '2026-11-07T13:10:00Z', updatedBy: 'Ananya Sen', actorRole: 'volunteer' },
    ],
    createdAt: '2026-11-07T10:30:00Z',
    updatedAt: '2026-11-07T13:10:00Z',
  },
];

// 10 NGO Requirements
let NGO_REQUIREMENTS: NgoRequirement[] = [
  {
    id: 'req_001',
    ngoId: 'user_ngo_1',
    ngoName: 'Annapoorna Community Relief',
    category: 'Cooked Meals',
    requiredQuantity: 100,
    unit: 'meals',
    beneficiaryCount: 100,
    requiredDate: '2026-11-07',
    area: 'Indiranagar',
    urgency: 'High',
    isVegetarianOnly: true,
    specialNotes: 'For evening relief kitchen feeding migrant daily wage workers.',
    isFulfilled: false,
    createdAt: '2026-11-07T08:00:00Z',
  },
  {
    id: 'req_002',
    ngoId: 'user_ngo_2',
    ngoName: 'Karuna Children Shelter & Home',
    category: 'Bakery Products',
    requiredQuantity: 50,
    unit: 'boxes',
    beneficiaryCount: 65,
    requiredDate: '2026-11-07',
    area: 'Koramangala',
    urgency: 'Medium',
    isVegetarianOnly: true,
    specialNotes: 'After-school snack for orphan children.',
    isFulfilled: false,
    createdAt: '2026-11-07T09:00:00Z',
  },
  {
    id: 'req_003',
    ngoId: 'user_ngo_3',
    ngoName: 'Hope Bengaluru Hunger Mission',
    category: 'Vegetables',
    requiredQuantity: 40,
    unit: 'kg',
    beneficiaryCount: 150,
    requiredDate: '2026-11-07',
    area: 'Jayanagar',
    urgency: 'Medium',
    isVegetarianOnly: true,
    specialNotes: 'Fresh vegetables for tomorrow morning mega community cooking.',
    isFulfilled: false,
    createdAt: '2026-11-07T09:30:00Z',
  },
  {
    id: 'req_004',
    ngoId: 'user_ngo_4',
    ngoName: 'Hasiru Community Kitchen',
    category: 'Cooked Meals',
    requiredQuantity: 80,
    unit: 'meals',
    beneficiaryCount: 80,
    requiredDate: '2026-11-07',
    area: 'Whitefield',
    urgency: 'High',
    isVegetarianOnly: false,
    specialNotes: 'Dinner packets for waste-picker community families.',
    isFulfilled: false,
    createdAt: '2026-11-07T10:00:00Z',
  },
];

// Volunteer tasks
let VOLUNTEER_TASKS: VolunteerTask[] = [
  {
    id: 'task_001',
    donationId: 'don_003',
    volunteerId: 'user_vol_1',
    volunteerName: 'Rahul Deshmukh',
    ngoId: 'user_ngo_1',
    ngoName: 'Annapoorna Community Relief',
    donorName: 'The Grand Bengaluru Hotel',
    foodName: 'South Indian Banquet Meal Packs (80 boxes)',
    quantityText: '80 boxes (~80 meals)',
    pickupAddress: 'The Grand Bengaluru Hotel, 1 MG Road, Gate 3 Loading Bay',
    pickupCoords: { lat: 12.9748, lng: 77.6094 },
    deliveryAddress: 'Annapoorna Trust, 12th Main, HAL 2nd Stage, Indiranagar',
    deliveryCoords: { lat: 12.9698, lng: 77.6499 },
    estimatedDistanceKm: 4.6,
    deadline: '2026-11-07T15:45:00',
    status: 'Assigned',
    notes: 'Please bring insulated thermal bags or crates.',
  },
  {
    id: 'task_002',
    donationId: 'don_007',
    volunteerId: 'user_vol_2',
    volunteerName: 'Ananya Sen',
    ngoId: 'user_ngo_2',
    ngoName: 'Karuna Children Shelter & Home',
    donorName: 'Daily Bakes (Koramangala)',
    foodName: 'Butter Croissants & Cinnamon Rolls (40 boxes)',
    quantityText: '40 boxes',
    pickupAddress: 'Daily Bakes, 5th Cross, 6th Block Koramangala',
    pickupCoords: { lat: 12.9352, lng: 77.6245 },
    deliveryAddress: 'Karuna Children Shelter, 1st Block Koramangala',
    deliveryCoords: { lat: 12.9279, lng: 77.6271 },
    estimatedDistanceKm: 1.2,
    deadline: '2026-11-07T18:30:00',
    status: 'In Transit',
    notes: 'Volunteers can pick up on scooter or bike.',
  },
  {
    id: 'task_003',
    donationId: 'don_001',
    ngoId: 'user_ngo_1',
    ngoName: 'Annapoorna Community Relief',
    donorName: 'Chef Ramesh Sharma (Spice Terrace)',
    foodName: 'Nutritious Vegetable Pulao & Dal Tadka (45 boxes)',
    quantityText: '45 meal boxes',
    pickupAddress: 'Spice Terrace, 100 Feet Road, Indiranagar',
    pickupCoords: { lat: 12.9784, lng: 77.6408 },
    deliveryAddress: 'Annapoorna Community Center, Indiranagar',
    deliveryCoords: { lat: 12.9698, lng: 77.6499 },
    estimatedDistanceKm: 1.8,
    deadline: '2026-11-07T16:00:00',
    status: 'Available',
    notes: 'Immediate pickup task available for any nearby volunteer in Indiranagar.',
  },
];

// Notifications
let NOTIFICATIONS: PlatformNotification[] = [
  {
    id: 'notif_1',
    userId: 'user_donor_1',
    title: 'New NGO Match Found',
    message: 'Annapoorna Community Relief is 1.8 km away and looking for 100 cooked meals.',
    type: 'claim',
    isRead: false,
    createdAt: '2026-11-07T12:20:00Z',
  },
  {
    id: 'notif_2',
    userId: 'user_ngo_1',
    title: 'Surplus Food Alert',
    message: 'Chef Ramesh posted 45 boxes of Vegetable Pulao in Indiranagar.',
    type: 'claim',
    isRead: false,
    createdAt: '2026-11-07T12:16:00Z',
  },
  {
    id: 'notif_3',
    userId: 'user_vol_1',
    title: 'Pickup Task Assigned',
    message: 'You have been assigned to collect 80 banquet meals from The Grand Bengaluru Hotel.',
    type: 'pickup',
    isRead: false,
    createdAt: '2026-11-07T13:05:00Z',
  },
];

// Calculate Haversine distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Smart NGO Matching Algorithm
function computeSmartNgoMatches(donation: Donation): SmartMatchResult[] {
  const verifiedNgos = USERS.filter((u) => u.role === 'ngo' && u.isVerified);

  return verifiedNgos
    .map((ngo) => {
      const distance = calculateDistance(
        donation.pickupLocation.lat,
        donation.pickupLocation.lng,
        ngo.location.lat,
        ngo.location.lng
      );

      // 1. Location Score (40% weight): closer is better (within 10km)
      const locationScore = Math.max(0, Math.min(100, Math.round(100 - distance * 8)));

      // 2. Quantity Score (25% weight): check active requirements from this NGO
      const matchingReq = NGO_REQUIREMENTS.find(
        (r) => r.ngoId === ngo.id && !r.isFulfilled && r.category === donation.category
      );
      let quantityScore = 60;
      if (matchingReq) {
        const ratio = Math.min(donation.quantity / matchingReq.requiredQuantity, matchingReq.requiredQuantity / donation.quantity);
        quantityScore = Math.round(75 + ratio * 25);
      } else if (ngo.beneficiaryCount && ngo.beneficiaryCount >= donation.estimatedMeals) {
        quantityScore = 85;
      }

      // 3. Time Score (20% weight): based on pickup deadline
      const deadline = new Date(donation.pickupDeadline).getTime();
      const now = new Date().getTime();
      const hoursLeft = Math.max(0.5, (deadline - now) / (1000 * 60 * 60));
      const timeScore = hoursLeft > 2 ? 95 : hoursLeft > 1 ? 80 : 60;

      // 4. Category & Dietary Compatibility (15% weight)
      let categoryScore = 80;
      if (matchingReq && matchingReq.isVegetarianOnly && !donation.isVegetarian) {
        categoryScore = 20; // mismatch
      } else {
        categoryScore = 95;
      }

      const matchScore = Math.round(
        locationScore * 0.4 +
        quantityScore * 0.25 +
        timeScore * 0.2 +
        categoryScore * 0.15
      );

      let explanation = `${matchScore}% Match — ${ngo.name} is ${distance} km away in ${ngo.location.area}. `;
      if (matchingReq) {
        explanation += `They actively requested ${matchingReq.requiredQuantity} ${matchingReq.unit} of ${matchingReq.category}.`;
      } else {
        explanation += `Supports ~${ngo.beneficiaryCount || 100} daily beneficiaries with high capacity for food rescue.`;
      }

      return {
        ngoId: ngo.id,
        ngoName: ngo.name,
        distanceKm: distance,
        matchScore,
        breakdown: {
          locationScore,
          quantityScore,
          timeScore,
          categoryScore,
        },
        explanation,
        beneficiaries: ngo.beneficiaryCount || 150,
        preferredCategories: ['Cooked Meals', 'Bakery Products', 'Vegetables'],
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // ==========================================
  // AUTH ROUTES
  // ==========================================

  // Demo user list for easy persona switching
  app.get('/api/auth/demo-users', (req: Request, res: Response) => {
    res.json(USERS);
  });

  // Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email } = req.body;
    const user = USERS.find((u) => u.email.toLowerCase() === (email || '').toLowerCase().trim());
    if (!user) {
      // Default to first donor or create session
      return res.status(404).json({ error: 'User not found. Please try one of our demo personas.' });
    }
    res.json({
      token: `jwt_token_${user.id}_${Date.now()}`,
      user,
    });
  });

  // Register
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, role, phone, organizationName, donorType, address, area, beneficiaryCount } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role are required.' });
    }

    const existing = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const newUser: User = {
      id: `user_${role}_${Date.now()}`,
      name,
      email,
      role,
      phone: phone || '+91 98000 00000',
      organizationName: organizationName || name,
      donorType: role === 'donor' ? donorType || 'Restaurant' : undefined,
      address: address || 'Bengaluru, Karnataka',
      location: {
        lat: 12.9716 + (Math.random() - 0.5) * 0.08,
        lng: 77.5946 + (Math.random() - 0.5) * 0.08,
        area: area || 'Indiranagar',
      },
      isVerified: role === 'ngo' ? false : true,
      verificationDocuments: role === 'ngo' ? ['Pending_Review.pdf'] : undefined,
      beneficiaryCount: role === 'ngo' ? Number(beneficiaryCount) || 50 : undefined,
      rating: 5.0,
      completedDonationsCount: 0,
      totalKgDonated: 0,
      totalHoursVolunteered: 0,
      badges: ['New Joiner'],
      createdAt: new Date().toISOString(),
    };

    USERS.push(newUser);
    res.status(201).json({
      token: `jwt_token_${newUser.id}_${Date.now()}`,
      user: newUser,
    });
  });

  // Current session me
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ user: USERS[0] }); // Default to first demo donor
    }
    const token = authHeader.replace('Bearer ', '');
    const userIdMatch = token.match(/jwt_token_(user_[a-z0-9_]+)_/);
    if (userIdMatch) {
      const user = USERS.find((u) => u.id === userIdMatch[1]);
      if (user) return res.json({ user });
    }
    res.json({ user: USERS[0] });
  });

  // ==========================================
  // DONATION ROUTES
  // ==========================================

  // Get donations with filters
  app.get('/api/donations', (req: Request, res: Response) => {
    const { category, status, search, donorId, claimedByNgoId } = req.query;
    let list = [...DONATIONS];

    if (category && category !== 'All') {
      list = list.filter((d) => d.category.toLowerCase() === String(category).toLowerCase());
    }
    if (status && status !== 'All') {
      list = list.filter((d) => d.status.toLowerCase() === String(status).toLowerCase());
    }
    if (donorId) {
      list = list.filter((d) => d.donorId === String(donorId));
    }
    if (claimedByNgoId) {
      list = list.filter((d) => d.claimedByNgoId === String(claimedByNgoId));
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (d) =>
          d.foodName.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.donorName.toLowerCase().includes(q) ||
          d.pickupLocation.area.toLowerCase().includes(q)
      );
    }

    res.json(list);
  });

  // Get single donation
  app.get('/api/donations/:id', (req: Request, res: Response) => {
    const donation = DONATIONS.find((d) => d.id === req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    res.json(donation);
  });

  // Create donation
  app.post('/api/donations', (req: Request, res: Response) => {
    const data = req.body;
    if (!data.foodName || !data.category || !data.quantity || !data.pickupLocation) {
      return res.status(400).json({ error: 'Missing required donation fields.' });
    }

    const donor = USERS.find((u) => u.id === data.donorId) || USERS[0];
    const newDonationId = `don_${Date.now()}`;
    const verificationToken = `TOKEN_${newDonationId.toUpperCase()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const otpCode = generateOtp();

    const newDonation: Donation = {
      id: newDonationId,
      donorId: donor.id,
      donorName: donor.organizationName || donor.name,
      donorType: donor.donorType || 'Restaurant',
      donorPhone: donor.phone,
      foodName: data.foodName,
      category: data.category as FoodCategory,
      description: data.description || '',
      quantity: Number(data.quantity) || 10,
      unit: data.unit || 'boxes',
      estimatedMeals: Number(data.estimatedMeals) || Number(data.quantity) || 10,
      imageUrl: data.imageUrl || '/src/assets/images/marketplace_fresh_meals_1794072150653.jpg',
      isVegetarian: data.isVegetarian ?? true,
      dietaryTags: data.dietaryTags || ['Vegetarian'],
      allergens: data.allergens || ['None'],
      packagingType: data.packagingType || 'Food Grade Boxes',
      preparationTime: data.preparationTime || new Date().toISOString(),
      storageConditions: data.storageConditions || 'Hot Holding (>60°C)',
      pickupLocation: {
        address: data.pickupLocation.address || donor.address,
        lat: data.pickupLocation.lat || donor.location.lat,
        lng: data.pickupLocation.lng || donor.location.lng,
        area: data.pickupLocation.area || donor.location.area,
        specialInstructions: data.pickupLocation.specialInstructions,
      },
      pickupStartTime: data.pickupStartTime || new Date(Date.now() + 1800000).toISOString(),
      pickupDeadline: data.pickupDeadline || new Date(Date.now() + 14400000).toISOString(),
      status: 'Available',
      urgency: data.urgency || 'High',
      verificationToken,
      otpCode,
      safetyChecklistConfirmed: true,
      aiSafetyNotes: data.aiSafetyNotes,
      statusHistory: [
        {
          status: 'Available',
          timestamp: new Date().toISOString(),
          updatedBy: donor.name,
          actorRole: 'donor',
          note: 'Donation published and open for NGO claims.',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DONATIONS.unshift(newDonation);

    // Notify matching NGOs in the area
    const matchingNgos = USERS.filter((u) => u.role === 'ngo' && u.isVerified);
    matchingNgos.slice(0, 3).forEach((ngo) => {
      NOTIFICATIONS.unshift({
        id: `notif_${Date.now()}_${Math.random()}`,
        userId: ngo.id,
        title: 'New Matching Donation Available',
        message: `${donor.name} listed ${newDonation.quantity} ${newDonation.unit} of ${newDonation.foodName} in ${newDonation.pickupLocation.area}.`,
        type: 'claim',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    });

    res.status(201).json(newDonation);
  });

  // Claim donation (NGO only)
  app.post('/api/donations/:id/claim', (req: Request, res: Response) => {
    const { ngoId, ngoName } = req.body;
    const donation = DONATIONS.find((d) => d.id === req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });
    if (donation.status !== 'Available') {
      return res.status(400).json({ error: `Cannot claim donation with status '${donation.status}'.` });
    }

    const claimingNgoId = ngoId || 'user_ngo_1';
    const claimingNgoName = ngoName || 'Annapoorna Community Relief';

    donation.status = 'Claimed';
    donation.claimedByNgoId = claimingNgoId;
    donation.claimedByNgoName = claimingNgoName;
    donation.updatedAt = new Date().toISOString();
    donation.statusHistory.push({
      status: 'Claimed',
      timestamp: new Date().toISOString(),
      updatedBy: claimingNgoName,
      actorRole: 'ngo',
      note: 'Donation claimed by verified NGO.',
    });

    // Create a volunteer task automatically
    const newTask: VolunteerTask = {
      id: `task_${Date.now()}`,
      donationId: donation.id,
      ngoId: claimingNgoId,
      ngoName: claimingNgoName,
      donorName: donation.donorName,
      foodName: `${donation.foodName} (${donation.quantity} ${donation.unit})`,
      quantityText: `${donation.quantity} ${donation.unit}`,
      pickupAddress: donation.pickupLocation.address,
      pickupCoords: { lat: donation.pickupLocation.lat, lng: donation.pickupLocation.lng },
      deliveryAddress: 'NGO Distribution Center, Bengaluru',
      deliveryCoords: { lat: 12.9698, lng: 77.6499 },
      estimatedDistanceKm: 3.2,
      deadline: donation.pickupDeadline,
      status: 'Available',
      notes: 'Volunteer needed for rapid food transit.',
    };
    VOLUNTEER_TASKS.unshift(newTask);

    // Notify Donor
    NOTIFICATIONS.unshift({
      id: `notif_${Date.now()}`,
      userId: donation.donorId,
      title: 'Donation Claimed!',
      message: `${donation.claimedByNgoName} has claimed your donation of ${donation.foodName}. Pickup coordination is active.`,
      type: 'claim',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    res.json({ donation, task: newTask });
  });

  // Verify Pickup via QR or OTP
  app.post('/api/donations/:id/verify-pickup', (req: Request, res: Response) => {
    const { tokenOrOtp, actorName, actorRole } = req.body;
    const donation = DONATIONS.find((d) => d.id === req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    // Validate QR token or OTP
    const code = (tokenOrOtp || '').trim();
    if (code !== donation.verificationToken && code !== donation.otpCode) {
      return res.status(400).json({ error: 'Invalid verification QR code or OTP. Please ask donor for the exact code.' });
    }

    donation.status = 'Picked Up';
    donation.updatedAt = new Date().toISOString();
    donation.statusHistory.push({
      status: 'Picked Up',
      timestamp: new Date().toISOString(),
      updatedBy: actorName || 'Volunteer',
      actorRole: (actorRole as any) || 'volunteer',
      note: 'Pickup verified via single-use digital authorization token.',
    });

    // Update corresponding task if any
    const task = VOLUNTEER_TASKS.find((t) => t.donationId === donation.id);
    if (task) {
      task.status = 'Picked Up';
      task.pickupConfirmedAt = new Date().toISOString();
    }

    res.json({ success: true, message: 'Pickup successfully verified!', donation });
  });

  // Verify Delivery via QR or OTP
  app.post('/api/donations/:id/verify-delivery', (req: Request, res: Response) => {
    const { tokenOrOtp, ngoName } = req.body;
    const donation = DONATIONS.find((d) => d.id === req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    const code = (tokenOrOtp || '').trim();
    if (code !== donation.verificationToken && code !== donation.otpCode) {
      return res.status(400).json({ error: 'Invalid delivery verification code.' });
    }

    donation.status = 'Delivered';
    donation.updatedAt = new Date().toISOString();
    donation.statusHistory.push({
      status: 'Delivered',
      timestamp: new Date().toISOString(),
      updatedBy: ngoName || donation.claimedByNgoName || 'Verified NGO Staff',
      actorRole: 'ngo',
      note: 'Food received in good condition and distributed to community beneficiaries.',
    });

    // Update task
    const task = VOLUNTEER_TASKS.find((t) => t.donationId === donation.id);
    if (task) {
      task.status = 'Completed';
      task.deliveryConfirmedAt = new Date().toISOString();
    }

    // Reward Volunteer & Donor
    const donor = USERS.find((u) => u.id === donation.donorId);
    if (donor) {
      donor.completedDonationsCount = (donor.completedDonationsCount || 0) + 1;
      donor.totalKgDonated = (donor.totalKgDonated || 0) + donation.quantity;
    }

    res.json({ success: true, message: 'Delivery successfully recorded!', donation });
  });

  // Generate QR code data URL for a donation
  app.get('/api/donations/:id/qr', async (req: Request, res: Response) => {
    const donation = DONATIONS.find((d) => d.id === req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    try {
      const qrData = JSON.stringify({
        donationId: donation.id,
        token: donation.verificationToken,
        otp: donation.otpCode,
        donor: donation.donorName,
        food: donation.foodName,
      });
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 320,
        margin: 2,
        color: {
          dark: '#1B4332',
          light: '#FFFFFF',
        },
      });
      res.json({ dataUrl, token: donation.verificationToken, otp: donation.otpCode });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate QR code', details: err.message });
    }
  });

  // Cancel donation
  app.delete('/api/donations/:id', (req: Request, res: Response) => {
    const donation = DONATIONS.find((d) => d.id === req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    donation.status = 'Cancelled';
    donation.updatedAt = new Date().toISOString();
    donation.statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date().toISOString(),
      updatedBy: 'Donor',
      actorRole: 'donor',
      note: 'Donation cancelled by donor.',
    });

    res.json({ success: true, donation });
  });

  // ==========================================
  // NGO REQUIREMENTS
  // ==========================================

  app.get('/api/requirements', (req: Request, res: Response) => {
    res.json(NGO_REQUIREMENTS);
  });

  app.post('/api/requirements', (req: Request, res: Response) => {
    const { ngoId, ngoName, category, requiredQuantity, unit, beneficiaryCount, requiredDate, area, urgency, isVegetarianOnly, specialNotes } = req.body;
    const newReq: NgoRequirement = {
      id: `req_${Date.now()}`,
      ngoId: ngoId || 'user_ngo_1',
      ngoName: ngoName || 'Annapoorna Community Relief',
      category: category || 'Cooked Meals',
      requiredQuantity: Number(requiredQuantity) || 50,
      unit: unit || 'meals',
      beneficiaryCount: Number(beneficiaryCount) || 50,
      requiredDate: requiredDate || new Date().toISOString().split('T')[0],
      area: area || 'Indiranagar',
      urgency: urgency || 'Medium',
      isVegetarianOnly: isVegetarianOnly ?? true,
      specialNotes,
      isFulfilled: false,
      createdAt: new Date().toISOString(),
    };
    NGO_REQUIREMENTS.unshift(newReq);
    res.status(201).json(newReq);
  });

  app.delete('/api/requirements/:id', (req: Request, res: Response) => {
    NGO_REQUIREMENTS = NGO_REQUIREMENTS.filter((r) => r.id !== req.params.id);
    res.json({ success: true });
  });

  // ==========================================
  // VOLUNTEER TASKS
  // ==========================================

  app.get('/api/volunteer/tasks', (req: Request, res: Response) => {
    const { volunteerId, status } = req.query;
    let tasks = [...VOLUNTEER_TASKS];
    if (volunteerId) {
      tasks = tasks.filter((t) => t.volunteerId === String(volunteerId));
    }
    if (status) {
      tasks = tasks.filter((t) => t.status.toLowerCase() === String(status).toLowerCase());
    }
    res.json(tasks);
  });

  app.post('/api/volunteer/tasks/:id/accept', (req: Request, res: Response) => {
    const { volunteerId, volunteerName } = req.body;
    const task = VOLUNTEER_TASKS.find((t) => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.volunteerId = volunteerId || 'user_vol_1';
    task.volunteerName = volunteerName || 'Rahul Deshmukh';
    task.status = 'Assigned';

    // Link into donation
    const donation = DONATIONS.find((d) => d.id === task.donationId);
    if (donation) {
      const volName = task.volunteerName || 'Volunteer';
      donation.assignedVolunteerId = task.volunteerId;
      donation.assignedVolunteerName = volName;
      donation.status = 'Pickup Scheduled';
      donation.statusHistory.push({
        status: 'Pickup Scheduled',
        timestamp: new Date().toISOString(),
        updatedBy: volName,
        actorRole: 'volunteer',
        note: `Volunteer ${volName} accepted pickup task.`,
      });
    }

    res.json(task);
  });

  // ==========================================
  // SMART MATCHING ALGORITHM
  // ==========================================

  app.get('/api/matching/recommend-ngos/:donationId', (req: Request, res: Response) => {
    const donation = DONATIONS.find((d) => d.id === (req.params.donationId || req.params.id));
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    const matches = computeSmartNgoMatches(donation);
    res.json(matches);
  });

  app.post('/api/matching/notify-ngos', (req: Request, res: Response) => {
    const { donationId, ngoIds } = req.body;
    const donation = DONATIONS.find((d) => d.id === donationId);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    (ngoIds || []).forEach((ngoId: string) => {
      NOTIFICATIONS.unshift({
        id: `notif_${Date.now()}_${Math.random()}`,
        userId: ngoId,
        title: 'Priority Food Rescue Notification',
        message: `${donation.donorName} prioritizes your NGO for ${donation.quantity} ${donation.unit} of ${donation.foodName}. Click to claim immediately!`,
        type: 'claim',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    });

    res.json({ success: true, count: (ngoIds || []).length });
  });

  // ==========================================
  // ANALYTICS & STATS
  // ==========================================

  app.get('/api/analytics/overview', (req: Request, res: Response) => {
    const totalFoodRescuedKg = DONATIONS.filter((d) => d.status === 'Delivered').reduce(
      (acc, d) => acc + (d.unit === 'kg' ? d.quantity : d.quantity * 0.4),
      1420
    );

    const totalMealsProvided = DONATIONS.filter((d) => d.status === 'Delivered').reduce(
      (acc, d) => acc + d.estimatedMeals,
      3550
    );

    const completed = DONATIONS.filter((d) => d.status === 'Delivered').length + 84;
    const active = DONATIONS.filter((d) => ['Available', 'Claimed', 'In Transit', 'Picked Up'].includes(d.status)).length;

    // Environmental metrics based on FAO benchmarks: ~2.5 kg CO2e per kg food waste avoided, 250L water per kg
    const co2PreventedKg = Math.round(totalFoodRescuedKg * 2.5);
    const waterSavedLiters = Math.round(totalFoodRescuedKg * 250);

    const stats: ImpactStats = {
      totalFoodRescuedKg: Math.round(totalFoodRescuedKg),
      totalMealsProvided,
      totalDonationsCompleted: completed,
      activeDonationsCount: active,
      verifiedNgosCount: USERS.filter((u) => u.role === 'ngo' && u.isVerified).length,
      activeVolunteersCount: USERS.filter((u) => u.role === 'volunteer').length,
      co2PreventedKg,
      waterSavedLiters,
      successRatePercent: 96.4,
    };

    // Monthly trends for Recharts
    const monthlyTrends = [
      { month: 'Jun', meals: 1800, foodKg: 720, co2Kg: 1800 },
      { month: 'Jul', meals: 2200, foodKg: 880, co2Kg: 2200 },
      { month: 'Aug', meals: 2900, foodKg: 1160, co2Kg: 2900 },
      { month: 'Sep', meals: 3400, foodKg: 1360, co2Kg: 3400 },
      { month: 'Oct', meals: 4100, foodKg: 1640, co2Kg: 4100 },
      { month: 'Nov', meals: 4850, foodKg: 1940, co2Kg: 4850 },
    ];

    // Category breakdown
    const categoryBreakdown = [
      { name: 'Cooked Meals', value: 48, fill: '#2E7D32' },
      { name: 'Bakery Products', value: 24, fill: '#74C69D' },
      { name: 'Vegetables & Fruits', value: 18, fill: '#F4A261' },
      { name: 'Packaged Food', value: 10, fill: '#1B4332' },
    ];

    res.json({ stats, monthlyTrends, categoryBreakdown });
  });

  // Leaderboard
  app.get('/api/analytics/leaderboard', (req: Request, res: Response) => {
    const donors = USERS.filter((u) => u.role === 'donor')
      .map((u) => ({
        id: u.id,
        name: u.organizationName || u.name,
        type: u.donorType,
        mealsDonated: (u.completedDonationsCount || 10) * 25,
        donationsCount: u.completedDonationsCount || 10,
        badges: u.badges || ['Food Saver'],
      }))
      .sort((a, b) => b.mealsDonated - a.mealsDonated);

    const ngos = USERS.filter((u) => u.role === 'ngo')
      .map((u) => ({
        id: u.id,
        name: u.name,
        beneficiaries: u.beneficiaryCount || 150,
        mealsReceived: (u.completedDonationsCount || 20) * 35,
        area: u.location.area,
      }))
      .sort((a, b) => b.mealsReceived - a.mealsReceived);

    const volunteers = USERS.filter((u) => u.role === 'volunteer')
      .map((u) => ({
        id: u.id,
        name: u.name,
        deliveriesCompleted: u.completedDonationsCount || 15,
        hours: u.totalHoursVolunteered || 30,
        badges: u.badges || ['Courier'],
      }))
      .sort((a, b) => b.deliveriesCompleted - a.deliveriesCompleted);

    res.json({ donors, ngos, volunteers });
  });

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  app.get('/api/notifications', (req: Request, res: Response) => {
    const { userId } = req.query;
    if (userId) {
      return res.json(NOTIFICATIONS.filter((n) => n.userId === String(userId)));
    }
    res.json(NOTIFICATIONS);
  });

  app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
    const notif = NOTIFICATIONS.find((n) => n.id === req.params.id);
    if (notif) notif.isRead = true;
    res.json({ success: true });
  });

  // ==========================================
  // AI-POWERED FEATURES (GEMINI API)
  // ==========================================

  // 1. AI Food Safety Assistant
  app.post('/api/ai/food-safety', async (req: Request, res: Response) => {
    const { foodName, category, preparationTime, storageConditions } = req.body;

    const fallbackResponse = {
      isEligible: true,
      safeWindowHours: category === 'Cooked Meals' ? 4 : 24,
      handlingChecklist: [
        'Maintain warm food above 60°C or chill rapidly below 4°C.',
        'Use clean, food-grade biodegradable containers with secure lids.',
        'Label preparation time and key allergens clearly.',
        'Ensure pickup by NGO or volunteer within the recommended window.',
      ],
      allergenPrompts: ['Check for dairy, gluten, nuts, or soy.', 'Label non-vegetarian or Jain ingredients clearly.'],
      advisoryNote: 'Food safety eligibility verified for distribution. Donors must ensure visual and aroma quality check before dispatch.',
    };

    if (!apiKey) {
      return res.json(fallbackResponse);
    }

    try {
      const prompt = `You are the ShareAPlate Food Safety Expert.
Analyze the following food item for community donation:
- Food Name: ${foodName}
- Category: ${category}
- Preparation Time: ${preparationTime || 'Recent'}
- Storage Conditions: ${storageConditions || 'Room temperature'}

Return a structured JSON with:
1. isEligible (boolean: whether safe for donation assuming proper hygiene)
2. safeWindowHours (number: maximum safe collection/consumption window in hours)
3. handlingChecklist (array of 3-4 concise safety action items)
4. allergenPrompts (array of potential allergens to declare)
5. advisoryNote (concise 2-sentence advice, emphasizing donor responsibility to verify freshness)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You provide accurate, cautious food safety advice for surplus food rescue platforms. Never certify food as guaranteed safe without donor physical inspection.',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ ...fallbackResponse, ...parsed });
    } catch (err: any) {
      console.warn('Gemini AI food safety call failed, returning rule-based fallback:', err.message);
      res.json(fallbackResponse);
    }
  });

  // 2. AI Donation Description Generator
  app.post('/api/ai/generate-description', async (req: Request, res: Response) => {
    const { foodName, category, quantity, unit, briefNotes, isVegetarian } = req.body;

    const fallbackDescription = `${quantity} ${unit} of freshly prepared ${foodName} available for immediate rescue and community distribution. ${isVegetarian ? '100% pure vegetarian.' : 'Non-vegetarian.'} Packaged securely in clean containers. Please collect within the stated pickup window to ensure optimum freshness.`;

    if (!apiKey) {
      return res.json({ description: fallbackDescription });
    }

    try {
      const prompt = `Write a professional, clear, and appetizing donation listing description for the ShareAPlate community food rescue platform.
Details:
- Item: ${foodName}
- Category: ${category}
- Quantity: ${quantity} ${unit}
- Diet: ${isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
- Donor Notes: ${briefNotes || 'Freshly made surplus'}

Keep it concise (2-3 sentences), mentioning packaging, freshness, and prompt pickup appreciation.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You write compassionate, respectful, and crystal-clear food donation descriptions for NGOs and community food banks.',
        },
      });

      const text = response.text?.trim() || fallbackDescription;
      res.json({ description: text });
    } catch (err: any) {
      console.warn('Gemini AI description generator failed, returning fallback:', err.message);
      res.json({ description: fallbackDescription });
    }
  });

  // 3. AI Food Waste Prediction & Recommendations
  app.post('/api/ai/waste-prediction', async (req: Request, res: Response) => {
    const { donorType, dayOfWeek, typicalSurplusCategory } = req.body;

    const fallbackPrediction = {
      predictedSurplusMeals: donorType === 'Hotel' ? 55 : donorType === 'Bakery' ? 30 : 25,
      likelySurplusTime: '21:30',
      highRiskCategories: [typicalSurplusCategory || 'Cooked Rice & Curries', 'Side Dishes'],
      suggestedAction: 'Schedule an automatic pre-booking alert with Annapoorna Relief 1 hour before dinner closing.',
      preventionRecommendations: [
        'Track weekend banquet buffet variance: reduce final batch cooking by 15% after 20:00.',
        'Offer half-portion options for lunch corporate orders to reduce plate waste.',
        'Freeze raw prep surplus immediately rather than cooking excess batches.',
      ],
    };

    if (!apiKey) {
      return res.json(fallbackPrediction);
    }

    try {
      const prompt = `You are the ShareAPlate Food Waste Reduction Analyst.
Donor type: ${donorType || 'Restaurant'}
Day of week: ${dayOfWeek || 'Saturday'}
Category: ${typicalSurplusCategory || 'Cooked Meals'}

Return a JSON with:
1. predictedSurplusMeals (number estimate)
2. likelySurplusTime (e.g. "21:30")
3. highRiskCategories (array of 2 strings)
4. suggestedAction (1 sentence on pickup scheduling)
5. preventionRecommendations (array of 3 actionable, specific kitchen tips to prevent waste before it happens)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You analyze commercial kitchen surplus patterns and provide pragmatic, cost-saving food waste prevention advice.',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ ...fallbackPrediction, ...parsed });
    } catch (err: any) {
      console.warn('Gemini AI prediction failed, returning fallback:', err.message);
      res.json(fallbackPrediction);
    }
  });

  // ==========================================
  // ADMIN ACTIONS
  // ==========================================

  app.get('/api/admin/ngos/pending', (req: Request, res: Response) => {
    const pending = USERS.filter((u) => u.role === 'ngo' && !u.isVerified);
    res.json(pending);
  });

  app.post('/api/admin/ngos/:id/verify', (req: Request, res: Response) => {
    const ngo = USERS.find((u) => u.id === req.params.id);
    if (!ngo) return res.status(404).json({ error: 'NGO not found' });
    const { action } = req.body; // 'approve' | 'reject'
    if (action === 'approve') {
      ngo.isVerified = true;
      NOTIFICATIONS.unshift({
        id: `notif_${Date.now()}`,
        userId: ngo.id,
        title: 'NGO Verification Approved! 🎉',
        message: 'Your NGO account has been verified by the ShareAPlate compliance team. You can now claim donations and schedule pickups.',
        type: 'verification',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    } else {
      ngo.isVerified = false;
    }
    res.json({ success: true, ngo });
  });

  // ==========================================
  // VITE MIDDLEWARE IN DEV OR STATIC IN PROD
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ShareAPlate server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
