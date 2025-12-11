/**
 * useChat Hook
 * Main hook for chat functionality - handles sending messages and processing responses
 */

import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useChatStore } from "../store/chatStore";
import { postChat } from "../api/client";
import { Message, TripBundle } from "../api/types";

export const useChat = () => {
    const {
        messages,
        recommendations,
        extractedData,
        visaInfo,
        isLoading,
        error,
        addMessage,
        setRecommendations,
        setExtractedData,
        setVisaInfo,
        setLoading,
        setError,
        resetChat,
    } = useChatStore();

    /**
     * Send a message and handle the response
     */
    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim() || isLoading) return;

            // Clear any previous errors
            setError(null);

            // Add user message
            const userMessage: Message = {
                id: uuidv4(),
                role: "user",
                content: text.trim(),
                timestamp: new Date(),
            };
            addMessage(userMessage);

            // Set loading state
            setLoading(true);

            try {
                // Call API
                const response = await postChat(text);

                // Build assistant message
                const assistantMessage: Message = {
                    id: uuidv4(),
                    role: "assistant",
                    content: response.message,
                    timestamp: new Date(),
                    recommendations: response.recommendations
                        ? transformRecommendations(response.recommendations)
                        : undefined,
                    extractedData: response.extracted_data,
                    visaInfo: response.visa_info,
                };

                // Add assistant response
                addMessage(assistantMessage);

                // Update store with extracted data
                if (response.extracted_data) {
                    setExtractedData(response.extracted_data);
                }

                // Update recommendations if present
                if (response.recommendations && response.recommendations.length > 0) {
                    setRecommendations(
                        transformRecommendations(response.recommendations)
                    );
                }

                // Update visa info if present
                if (response.visa_info) {
                    setVisaInfo(response.visa_info);
                }
            } catch (err) {
                // Handle error
                const errorMessage =
                    err instanceof Error ? err.message : "Something went wrong";
                setError(errorMessage);

                // Add error message to chat
                const errorAssistantMessage: Message = {
                    id: uuidv4(),
                    role: "assistant",
                    content:
                        "😔 Sorry, I couldn't process your request. Please check your connection and try again.",
                    timestamp: new Date(),
                };
                addMessage(errorAssistantMessage);
            } finally {
                setLoading(false);
            }
        },
        [
            isLoading,
            addMessage,
            setLoading,
            setError,
            setExtractedData,
            setRecommendations,
            setVisaInfo,
        ]
    );

    return {
        messages,
        recommendations,
        extractedData,
        visaInfo,
        isLoading,
        error,
        sendMessage,
        resetChat,
    };
};

/**
 * Transform API recommendations to ensure consistent structure
 */
function transformRecommendations(recs: TripBundle[]): TripBundle[] {
    return recs.map((rec) => ({
        ...rec,
        flight: {
            ...rec.flight,
            layovers: rec.flight.layovers ?? 0,
        },
        hotel: {
            ...rec.hotel,
            rating: rec.hotel.rating ?? 0,
        },
    }));
}
