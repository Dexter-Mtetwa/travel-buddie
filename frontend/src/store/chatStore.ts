/**
 * Chat Store
 * Zustand store for managing chat state, messages, and recommendations
 */

import { create } from "zustand";
import { Message, TripBundle, TripExtraction, VisaInfo } from "../api/types";

interface ChatState {
    // Message history
    messages: Message[];

    // Current recommendations (from latest successful search)
    recommendations: TripBundle[];

    // Extracted trip data
    extractedData: TripExtraction | null;

    // Visa information
    visaInfo: VisaInfo | null;

    // Loading state
    isLoading: boolean;

    // Error state
    error: string | null;

    // Actions
    addMessage: (message: Message) => void;
    setRecommendations: (recommendations: TripBundle[]) => void;
    setExtractedData: (data: TripExtraction | null) => void;
    setVisaInfo: (info: VisaInfo | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetChat: () => void;
}

// Welcome message shown on first load
const welcomeMessage: Message = {
    id: "welcome",
    role: "assistant",
    content:
        "👋 Welcome to Travel Buddie!\n\nI'm here to help you plan your perfect trip. Just tell me:\n\n✈️ Where you want to go\n📅 Your travel dates\n👥 Number of travelers\n💰 Your budget\n\nFor example: \"I want to go to Paris from Addis Ababa next month for 5 days with 2 people, budget $3000\"\n\nLet's start planning! Where would you like to go?",
    timestamp: new Date(),
};

export const useChatStore = create<ChatState>((set) => ({
    // Initial state
    messages: [welcomeMessage],
    recommendations: [],
    extractedData: null,
    visaInfo: null,
    isLoading: false,
    error: null,

    // Add a message to the chat
    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),

    // Update recommendations
    setRecommendations: (recommendations) =>
        set(() => ({
            recommendations,
        })),

    // Update extracted trip data
    setExtractedData: (data) =>
        set(() => ({
            extractedData: data,
        })),

    // Update visa info
    setVisaInfo: (info) =>
        set(() => ({
            visaInfo: info,
        })),

    // Set loading state
    setLoading: (loading) =>
        set(() => ({
            isLoading: loading,
        })),

    // Set error state
    setError: (error) =>
        set(() => ({
            error,
        })),

    // Reset chat to initial state
    resetChat: () =>
        set(() => ({
            messages: [welcomeMessage],
            recommendations: [],
            extractedData: null,
            visaInfo: null,
            isLoading: false,
            error: null,
        })),
}));
