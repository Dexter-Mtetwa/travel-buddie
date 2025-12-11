/**
 * GradientBackground Component
 * Full-screen gradient background wrapper
 */

import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../theme/colors";

interface GradientBackgroundProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    style,
}) => {
    return (
        <LinearGradient
            colors={colors.gradientBackground as unknown as string[]}
            style={[styles.container, style]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
