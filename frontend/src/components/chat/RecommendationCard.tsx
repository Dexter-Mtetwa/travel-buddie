/**
 * RecommendationCard Component
 * Displays a trip bundle recommendation with flight, hotel, and car details
 */

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TripBundle } from "../../api/types";
import {
    colors,
    spacing,
    borderRadius,
    typography,
    shadows,
} from "../../theme/colors";

interface RecommendationCardProps {
    recommendation: TripBundle;
    index: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
    recommendation,
    index,
}) => {
    const [expanded, setExpanded] = useState(false);
    const { flight, hotel, car_rental, total_price, reasoning } = recommendation;

    // Calculate number of nights (approximate based on data)
    const hotelTotal = hotel.price_per_night * 5; // Default 5 nights if not calculable

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setExpanded(!expanded)}
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.indexBadge}>
                    <Text style={styles.indexText}>#{index}</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Total</Text>
                    <Text style={styles.priceValue}>${total_price.toLocaleString()}</Text>
                </View>
            </View>

            {/* Flight Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="airplane" size={18} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Flight</Text>
                </View>
                <View style={styles.sectionContent}>
                    <Text style={styles.mainText}>{flight.airline}</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailText}>${flight.price}</Text>
                        <Text style={styles.separator}>•</Text>
                        <Text style={styles.detailText}>
                            {flight.layovers === 0
                                ? "Direct"
                                : `${flight.layovers} stop${flight.layovers > 1 ? "s" : ""}`}
                        </Text>
                    </View>
                    {flight.via && (
                        <Text style={styles.viaText}>via {flight.via}</Text>
                    )}
                    {expanded && flight.legs && flight.legs.length > 0 && (
                        <View style={styles.legsContainer}>
                            {flight.legs.map((leg, i) => (
                                <View key={i} style={styles.legRow}>
                                    <Ionicons
                                        name="arrow-forward"
                                        size={12}
                                        color={colors.textMuted}
                                    />
                                    <Text style={styles.legText}>
                                        {leg.origin} → {leg.destination}
                                    </Text>
                                    <Text style={styles.legAirline}>{leg.airline}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            {/* Hotel Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="bed" size={18} color={colors.secondary} />
                    <Text style={styles.sectionTitle}>Hotel</Text>
                </View>
                <View style={styles.sectionContent}>
                    <Text style={styles.mainText}>{hotel.name}</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailText}>
                            ${hotel.price_per_night}/night
                        </Text>
                        <Text style={styles.separator}>•</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={12} color={colors.starFilled} />
                            <Text style={styles.ratingText}>{hotel.rating.toFixed(1)}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Car Rental Section (if available) */}
            {car_rental && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="car" size={18} color={colors.success} />
                        <Text style={styles.sectionTitle}>Car Rental</Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <Text style={styles.mainText}>
                            {car_rental.company} - {car_rental.car_type}
                        </Text>
                        <Text style={styles.detailText}>
                            ${car_rental.price_per_day}/day
                        </Text>
                    </View>
                </View>
            )}

            {/* Reasoning (expanded) */}
            {expanded && reasoning && (
                <View style={styles.reasoningContainer}>
                    <Ionicons name="bulb" size={16} color={colors.warning} />
                    <Text style={styles.reasoningText}>{reasoning}</Text>
                </View>
            )}

            {/* Expand indicator */}
            <View style={styles.expandIndicator}>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textMuted}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.md,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    indexBadge: {
        backgroundColor: colors.primaryMuted,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    indexText: {
        ...typography.bodySmall,
        color: colors.primary,
        fontWeight: "700",
    },
    priceContainer: {
        alignItems: "flex-end",
    },
    priceLabel: {
        ...typography.caption,
        color: colors.textMuted,
    },
    priceValue: {
        ...typography.h3,
        color: colors.text,
        fontWeight: "700",
    },
    section: {
        marginBottom: spacing.sm,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        marginBottom: spacing.xs,
    },
    sectionTitle: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        fontWeight: "600",
    },
    sectionContent: {
        marginLeft: spacing.lg + spacing.xs,
    },
    mainText: {
        ...typography.body,
        color: colors.text,
        fontWeight: "500",
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
        marginTop: 2,
    },
    detailText: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    separator: {
        color: colors.textMuted,
        fontSize: 10,
    },
    viaText: {
        ...typography.caption,
        color: colors.textMuted,
        fontStyle: "italic",
        marginTop: 2,
    },
    legsContainer: {
        marginTop: spacing.xs,
        gap: spacing.xs,
    },
    legRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
    },
    legText: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    legAirline: {
        ...typography.caption,
        color: colors.textMuted,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },
    ratingText: {
        ...typography.bodySmall,
        color: colors.starFilled,
        fontWeight: "600",
    },
    reasoningContainer: {
        flexDirection: "row",
        gap: spacing.xs,
        marginTop: spacing.md,
        padding: spacing.sm,
        backgroundColor: colors.warningMuted,
        borderRadius: borderRadius.md,
    },
    reasoningText: {
        ...typography.bodySmall,
        color: colors.text,
        flex: 1,
    },
    expandIndicator: {
        alignItems: "center",
        marginTop: spacing.xs,
    },
});
