/**
 * MessageBubble Component
 * Displays a single chat message with user/assistant styling
 */

import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    ViewStyle,
    TextStyle,
} from "react-native";
import { Message } from "../../api/types";
import {
    colors,
    spacing,
    borderRadius,
    typography,
    shadows,
} from "../../theme/colors";
import { RecommendationCard } from "./RecommendationCard";

interface MessageBubbleProps {
    message: Message;
    isLatest?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    isLatest = false,
}) => {
    const isUser = message.role === "user";
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    // Animate message appearance
    useEffect(() => {
        if (isLatest) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(1);
            slideAnim.setValue(0);
        }
    }, [isLatest, fadeAnim, slideAnim]);

    const containerStyle: ViewStyle = {
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "85%",
    };

    const bubbleStyle: ViewStyle = {
        backgroundColor: isUser ? colors.userBubble : colors.assistantBubble,
        borderRadius: borderRadius.lg,
        borderBottomRightRadius: isUser ? borderRadius.sm : borderRadius.lg,
        borderBottomLeftRadius: isUser ? borderRadius.lg : borderRadius.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        ...shadows.sm,
    };

    const textStyle: TextStyle = {
        color: isUser ? colors.userBubbleText : colors.assistantBubbleText,
        ...typography.body,
    };

    // Format timestamp
    const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Animated.View
            style={[
                styles.container,
                containerStyle,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={bubbleStyle}>
                <Text style={textStyle}>{message.content}</Text>
            </View>

            {/* Show recommendations if present */}
            {message.recommendations && message.recommendations.length > 0 && (
                <View style={styles.recommendationsContainer}>
                    {message.recommendations.map((rec, index) => (
                        <RecommendationCard
                            key={`rec-${index}`}
                            recommendation={rec}
                            index={index + 1}
                        />
                    ))}
                </View>
            )}

            {/* Visa info badge */}
            {message.visaInfo && (
                <View style={styles.visaContainer}>
                    <View
                        style={[
                            styles.visaBadge,
                            {
                                backgroundColor: message.visaInfo.visa_required
                                    ? colors.warningMuted
                                    : colors.successMuted,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.visaText,
                                {
                                    color: message.visaInfo.visa_required
                                        ? colors.warning
                                        : colors.success,
                                },
                            ]}
                        >
                            {message.visaInfo.visa_required ? "🛂 Visa Required" : "✅ No Visa Needed"}
                        </Text>
                        {message.visaInfo.visa_type && (
                            <Text style={styles.visaDetail}>
                                Type: {message.visaInfo.visa_type}
                            </Text>
                        )}
                    </View>
                </View>
            )}

            <Text style={[styles.timestamp, { alignSelf: isUser ? "flex-end" : "flex-start" }]}>
                {timestamp}
            </Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.xs,
        marginHorizontal: spacing.sm,
    },
    recommendationsContainer: {
        marginTop: spacing.md,
        gap: spacing.sm,
    },
    visaContainer: {
        marginTop: spacing.sm,
    },
    visaBadge: {
        borderRadius: borderRadius.md,
        padding: spacing.sm,
    },
    visaText: {
        ...typography.bodySmall,
        fontWeight: "600",
    },
    visaDetail: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    timestamp: {
        ...typography.caption,
        color: colors.textMuted,
        marginTop: spacing.xs,
        marginHorizontal: spacing.xs,
    },
});
