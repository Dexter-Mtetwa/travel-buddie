/**
 * API Type Definitions
 * Matching backend FastAPI models
 */

// Chat Message Types
export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
    recommendations?: TripBundle[];
    extractedData?: TripExtraction;
    visaInfo?: VisaInfo;
}

// Trip Extraction (from NLP)
export interface TripExtraction {
    origin: string | null;
    destination: string | null;
    start_date: string | null;
    end_date: string | null;
    travelers: number | null;
    budget: number | null;
    nationality: string | null;
    reply_message: string | null;
    missing_fields: string[];
}

// Flight Leg Info
export interface LegInfo {
    airline: string;
    origin: string;
    destination: string;
    departure: string;
    arrival: string;
}

// Flight Offer
export interface FlightOffer {
    airline: string;
    price: number;
    departure?: string;
    arrival?: string;
    layovers: number;
    legs?: LegInfo[];
    via?: string;
}

// Hotel Offer
export interface HotelOffer {
    name: string;
    price_per_night: number;
    rating: number;
    distance_km?: number;
}

// Car Rental Offer
export interface CarRentalOffer {
    company: string;
    car_type: string;
    price_per_day: number;
    rating?: number;
}

// Trip Bundle (Recommendation)
export interface TripBundle {
    flight: FlightOffer;
    hotel: HotelOffer;
    car_rental?: CarRentalOffer;
    total_price: number;
    score?: number;
    reasoning: string;
}

// Visa Information
export interface VisaInfo {
    destination: string;
    nationality: string;
    visa_required: boolean;
    visa_type: string | null;
    passport_validity: string | null;
    notes: string | null;
}

// API Request/Response Types
export interface ChatRequest {
    message: string;
}

export interface ChatResponse {
    message: string;
    recommendations?: TripBundle[];
    extracted_data?: TripExtraction;
    missing_fields?: string[];
    visa_info?: VisaInfo;
}

// Recommendation Display (formatted for UI)
export interface FormattedRecommendation {
    flight: {
        airline: string;
        price: number;
        layovers: number;
        via?: string;
        legs?: LegInfo[];
    };
    hotel: {
        name: string;
        price_per_night: number;
        rating: number;
    };
    car_rental?: {
        company: string;
        car_type: string;
        price_per_day: number;
    };
    total_price: number;
    reasoning: string;
}
