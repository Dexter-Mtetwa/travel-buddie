/**
 * VisaInfoCard Component
 * Prominently displays visa requirements information with expandable details
 */

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VisaInfo } from "../../api/types";
import {
    colors,
    spacing,
    borderRadius,
    typography,
    shadows,
} from "../../theme/colors";

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface VisaInfoCardProps {
    visaInfo: VisaInfo;
}

export const VisaInfoCard: React.FC<VisaInfoCardProps> = ({ visaInfo }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const getVisaIcon = () => {
        if (!visaInfo.visa_required) {
            return "checkmark-circle";
        }
        switch (visaInfo.visa_type?.toLowerCase()) {
            case "visa-free":
                return "checkmark-circle";
            case "visa on arrival":
                return "airplane";
            case "e-visa":
                return "laptop";
            default:
                return "document-text";
        }
    };

    const getVisaColor = () => {
        if (!visaInfo.visa_required) {
            return colors.success;
        }
        switch (visaInfo.visa_type?.toLowerCase()) {
            case "visa-free":
                return colors.success;
            case "visa on arrival":
                return colors.info;
            case "e-visa":
                return colors.primary;
            default:
                return colors.warning;
        }
    };

    const getVisaBgColor = () => {
        if (!visaInfo.visa_required) {
            return colors.successMuted;
        }
        switch (visaInfo.visa_type?.toLowerCase()) {
            case "visa-free":
                return colors.successMuted;
            case "visa on arrival":
                return colors.infoMuted;
            case "e-visa":
                return colors.primaryMuted;
            default:
                return colors.warningMuted;
        }
    };

    const getVisaStatusText = () => {
        if (!visaInfo.visa_required) {
            return "No Visa Required";
        }
        return visaInfo.visa_type || "Visa Required";
    };

    const getVisaDescription = () => {
        if (!visaInfo.visa_required) {
            return "You can travel without a visa";
        }
        switch (visaInfo.visa_type?.toLowerCase()) {
            case "visa-free":
                return "You can enter without a visa";
            case "visa on arrival":
                return "Get your visa when you arrive at the airport";
            case "e-visa":
                return "Apply online before your trip";
            default:
                return "You'll need to apply for a visa";
        }
    };

    const getProcessingTime = () => {
        switch (visaInfo.visa_type?.toLowerCase()) {
            case "e-visa":
                return "2-4 weeks";
            case "visa on arrival":
                return "Immediate (at border)";
            case "traditional visa":
                return "4-8 weeks";
            default:
                return "Varies by embassy";
        }
    };

    const getCostEstimate = () => {
        if (!visaInfo.visa_required) return null;

        switch (visaInfo.visa_type?.toLowerCase()) {
            case "visa on arrival":
                return "$20-80";
            case "e-visa":
                return "$20-100";
            case "traditional visa":
                return "$60-200";
            default:
                return "Contact embassy";
        }
    };

    const getRequirements = () => {
        const requirements = [];

        if (visaInfo.passport_validity) {
            requirements.push(`📋 ${visaInfo.passport_validity}`);
        }

        if (visaInfo.visa_required) {
            requirements.push("📷 Recent passport photo");
            requirements.push("✈️ Flight itinerary");
            requirements.push("🏨 Hotel booking confirmation");

            if (visaInfo.visa_type === "Traditional visa") {
                requirements.push("💼 Embassy appointment");
                requirements.push("💰 Application fee");
            }
        }

        return requirements;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <TouchableOpacity
                style={[styles.header, { backgroundColor: getVisaBgColor() }]}
                onPress={toggleExpanded}
                activeOpacity={0.9}
            >
                <View style={styles.headerLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: getVisaColor() }]}>
                        <Ionicons
                            name={getVisaIcon()}
                            size={24}
                            color={colors.surface}
                        />
                    </View>
                    <View style={styles.headerContent}>
                        <Text style={[styles.statusText, { color: getVisaColor() }]}>
                            {getVisaStatusText()}
                        </Text>
                        <Text style={styles.descriptionText}>
                            {getVisaDescription()}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.infoButton}
                        onPress={toggleExpanded}
                    >
                        <Ionicons
                            name="information-circle-outline"
                            size={20}
                            color={getVisaColor()}
                        />
                    </TouchableOpacity>
                    <Ionicons
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={getVisaColor()}
                    />
                </View>
            </TouchableOpacity>

            {/* Basic Details - Always Visible */}
            <View style={styles.detailsContainer}>
                <View style={styles.basicDetails}>
                    <View style={styles.detailRow}>
                        <Ionicons name="location" size={16} color={colors.textMuted} />
                        <Text style={styles.detailLabel}>Destination:</Text>
                        <Text style={styles.detailValue}>{visaInfo.destination}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Ionicons name="person" size={16} color={colors.textMuted} />
                        <Text style={styles.detailLabel}>Nationality:</Text>
                        <Text style={styles.detailValue}>{visaInfo.nationality}</Text>
                    </View>

                    {visaInfo.passport_validity && (
                        <View style={styles.detailRow}>
                            <Ionicons name="card" size={16} color={colors.textMuted} />
                            <Text style={styles.detailLabel}>Passport Validity:</Text>
                            <Text style={styles.detailValue}>{visaInfo.passport_validity}</Text>
                        </View>
                    )}
                </View>

                {/* Expanded Details */}
                {expanded && (
                    <Animated.View style={styles.expandedDetails}>
                        {/* Processing Time & Cost */}
                        {visaInfo.visa_required && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Processing Details</Text>
                                <View style={styles.sectionContent}>
                                    <View style={styles.detailRow}>
                                        <Ionicons name="time" size={16} color={colors.textMuted} />
                                        <Text style={styles.detailLabel}>Processing Time:</Text>
                                        <Text style={styles.detailValue}>{getProcessingTime()}</Text>
                                    </View>
                                    {getCostEstimate() && (
                                        <View style={styles.detailRow}>
                                            <Ionicons name="cash" size={16} color={colors.textMuted} />
                                            <Text style={styles.detailLabel}>Estimated Cost:</Text>
                                            <Text style={styles.detailValue}>{getCostEstimate()}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Requirements */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                {visaInfo.visa_required ? "Required Documents" : "Travel Requirements"}
                            </Text>
                            <View style={styles.requirementsList}>
                                {getRequirements().map((requirement, index) => (
                                    <Text key={index} style={styles.requirementText}>
                                        {requirement}
                                    </Text>
                                ))}
                            </View>
                        </View>

                        {/* Additional Notes */}
                        {visaInfo.notes && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Important Notes</Text>
                                <View style={styles.notesContainer}>
                                    <Ionicons name="bulb" size={16} color={colors.textMuted} />
                                    <Text style={styles.notesText}>{visaInfo.notes}</Text>
                                </View>
                            </View>
                        )}

                        {/* Emergency Contacts */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
                            <View style={styles.emergencyContacts}>
                                <TouchableOpacity style={styles.contactButton}>
                                    <Ionicons name="call" size={16} color={colors.primary} />
                                    <Text style={styles.contactText}>Embassy Hotline</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.contactButton}>
                                    <Ionicons name="mail" size={16} color={colors.primary} />
                                    <Text style={styles.contactText}>Email Support</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                )}

                {/* Action Button */}
                {visaInfo.visa_required && (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: getVisaColor() }]}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.actionButtonText}>
                            {visaInfo.visa_type === "e-Visa" ? "Apply Online" : "Contact Embassy"}
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color={colors.surface} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        borderColor: colors.border,
        marginVertical: spacing.md,
        ...shadows.lg,
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: spacing.md,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    headerContent: {
        flex: 1,
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: spacing.md,
    },
    statusText: {
        ...typography.h3,
        fontWeight: "700",
        marginBottom: 2,
    },
    descriptionText: {
        ...typography.bodySmall,
        color: colors.textSecondary,
    },
    infoButton: {
        padding: spacing.xs,
    },
    detailsContainer: {
        padding: spacing.md,
        paddingTop: 0,
    },
    basicDetails: {
        marginBottom: spacing.md,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.sm,
    },
    detailLabel: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        marginLeft: spacing.sm,
        minWidth: 100,
    },
    detailValue: {
        ...typography.bodySmall,
        color: colors.text,
        fontWeight: "500",
        marginLeft: spacing.xs,
    },
    expandedDetails: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing.md,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        ...typography.body,
        fontWeight: "600",
        color: colors.text,
        marginBottom: spacing.sm,
    },
    sectionContent: {
        backgroundColor: colors.surfaceLight,
        borderRadius: borderRadius.md,
        padding: spacing.sm,
    },
    requirementsList: {
        backgroundColor: colors.surfaceLight,
        borderRadius: borderRadius.md,
        padding: spacing.sm,
    },
    requirementText: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        lineHeight: 18,
    },
    notesContainer: {
        flexDirection: "row",
        backgroundColor: colors.warningMuted,
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        marginTop: spacing.sm,
    },
    notesText: {
        ...typography.bodySmall,
        color: colors.text,
        marginLeft: spacing.sm,
        flex: 1,
        lineHeight: 18,
    },
    emergencyContacts: {
        flexDirection: "row",
        gap: spacing.sm,
    },
    contactButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surfaceLight,
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        flex: 1,
        justifyContent: "center",
        gap: spacing.xs,
    },
    contactText: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: "500",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        marginTop: spacing.sm,
        gap: spacing.xs,
    },
    actionButtonText: {
        ...typography.bodySmall,
        color: colors.surface,
        fontWeight: "600",
    },
});
