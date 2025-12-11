/**
 * API Client
 * Axios instance with mock support for development
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import Constants from "expo-constants";
import { ChatRequest, ChatResponse, TripBundle } from "./types";

// Get config from app.config.ts extra fields
const API_BASE_URL =
    Constants.expoConfig?.extra?.API_BASE_URL || "http://localhost:8000";
const USE_MOCKS = Constants.expoConfig?.extra?.USE_MOCKS || false;

// Create axios instance
export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30s timeout for AI processing
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error("[API] Request error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log(`[API] Response:`, response.status);
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            console.error("[API] Response error:", error.response.status);
        } else if (error.request) {
            console.error("[API] Network error - no response received");
        } else {
            console.error("[API] Error:", error.message);
        }
        return Promise.reject(error);
    }
);

// Mock data for development
const mockRecommendations: TripBundle[] = [
    {
        flight: {
            airline: "Ethiopian Airlines",
            price: 850,
            departure: "2024-01-15T08:00:00",
            arrival: "2024-01-15T14:00:00",
            layovers: 0,
        },
        hotel: {
            name: "Hilton Paris Opera",
            price_per_night: 220,
            rating: 4.5,
            distance_km: 1.2,
        },
        car_rental: {
            company: "Europcar",
            car_type: "Compact",
            price_per_day: 45,
            rating: 4.2,
        },
        total_price: 1950,
        reasoning:
            "Best value option with direct flight and centrally located 4.5-star hotel.",
    },
    {
        flight: {
            airline: "Air France",
            price: 1200,
            departure: "2024-01-15T10:00:00",
            arrival: "2024-01-15T15:30:00",
            layovers: 0,
        },
        hotel: {
            name: "Le Bristol Paris",
            price_per_night: 450,
            rating: 5.0,
            distance_km: 0.8,
        },
        total_price: 3450,
        reasoning:
            "Premium luxury option with 5-star hotel on Rue du Faubourg Saint-Honoré.",
    },
];

const mockMissingFieldsResponse: ChatResponse = {
    message:
        "I'd love to help you plan your trip! To find the best options, I need a few more details:\n\n• Where are you traveling from?\n• What dates are you planning to travel?\n• How many travelers?",
    missing_fields: ["origin", "start_date", "end_date", "travelers"],
    extracted_data: {
        origin: null,
        destination: "Paris",
        start_date: null,
        end_date: null,
        travelers: null,
        budget: null,
        nationality: null,
        reply_message: null,
        missing_fields: ["origin", "start_date", "end_date", "travelers"],
    },
};

const mockCompleteResponse: ChatResponse = {
    message:
        "Great news! I found 2 excellent options for your trip to Paris. Here are my top recommendations:",
    recommendations: mockRecommendations,
    extracted_data: {
        origin: "ADD",
        destination: "CDG",
        start_date: "2024-01-15",
        end_date: "2024-01-20",
        travelers: 2,
        budget: 3000,
        nationality: null,
        reply_message: null,
        missing_fields: [],
    },
};

/**
 * Send a chat message to the backend
 * Returns parsed response with recommendations if available
 */
export const postChat = async (message: string): Promise<ChatResponse> => {
    // Use mock data in development
    if (USE_MOCKS) {
        console.log("[API] Using mock data");
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

        // Simple logic to determine response type
        const lowerMessage = message.toLowerCase();
        if (
            lowerMessage.includes("from") &&
            (lowerMessage.includes("january") ||
                lowerMessage.includes("february") ||
                lowerMessage.includes("date"))
        ) {
            return mockCompleteResponse;
        }
        return mockMissingFieldsResponse;
    }

    // Real API call
    const request: ChatRequest = { message };
    const response = await api.post<ChatResponse>("/chat", request);
    return response.data;
};

/**
 * Health check endpoint
 */
export const checkHealth = async (): Promise<boolean> => {
    try {
        const response = await api.get("/");
        return response.status === 200;
    } catch {
        return false;
    }
};
