/**
 * Header Component
 * App header with logo and reset button
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, typography } from "../../theme/colors";

interface HeaderProps {
    onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
            <View style={styles.logoContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="airplane" size={24} color={colors.primary} />
                </View>
                <View>
                    <Text style={styles.title}>Travel Buddie</Text>
                    <Text style={styles.subtitle}>Your AI Travel Assistant</Text>
                </View>
            </View>

            {onReset && (
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={onReset}
                    activeOpacity={0.7}
                >
                    <Ionicons name="refresh" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primaryMuted,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        ...typography.h3,
        color: colors.text,
    },
    subtitle: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    resetButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surface,
        justifyContent: "center",
        alignItems: "center",
    },
});
