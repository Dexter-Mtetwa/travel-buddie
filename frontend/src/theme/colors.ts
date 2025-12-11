/**
 * Travel Buddie Design System - Color Palette
 * A premium, travel-inspired dark theme
 */

export const colors = {
    // Primary - Sky Blue (trust, travel, sky)
    primary: "#0EA5E9",
    primaryLight: "#38BDF8",
    primaryDark: "#0284C7",
    primaryMuted: "rgba(14, 165, 233, 0.15)",

    // Secondary - Warm Orange (action, energy)
    secondary: "#F97316",
    secondaryLight: "#FB923C",
    secondaryDark: "#EA580C",

    // Backgrounds
    background: "#0F172A", // Deep slate
    backgroundLight: "#1E293B",
    surface: "#1E293B", // Card background
    surfaceLight: "#334155",
    surfaceHighlight: "rgba(255, 255, 255, 0.05)",

    // Text
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
    textInverse: "#0F172A",

    // Chat bubbles
    userBubble: "#0EA5E9",
    userBubbleText: "#FFFFFF",
    assistantBubble: "#1E293B",
    assistantBubbleText: "#F8FAFC",

    // Status colors
    success: "#22C55E",
    successMuted: "rgba(34, 197, 94, 0.15)",
    warning: "#EAB308",
    warningMuted: "rgba(234, 179, 8, 0.15)",
    error: "#EF4444",
    errorMuted: "rgba(239, 68, 68, 0.15)",
    info: "#3B82F6",
    infoMuted: "rgba(59, 130, 246, 0.15)",

    // Borders
    border: "rgba(255, 255, 255, 0.1)",
    borderLight: "rgba(255, 255, 255, 0.15)",

    // Gradients (use with LinearGradient)
    gradientPrimary: ["#0EA5E9", "#0284C7"],
    gradientSecondary: ["#F97316", "#EA580C"],
    gradientBackground: ["#0F172A", "#1E293B"],
    gradientSurface: ["rgba(30, 41, 59, 0.8)", "rgba(30, 41, 59, 0.4)"],

    // Overlay
    overlay: "rgba(0, 0, 0, 0.5)",
    overlayLight: "rgba(0, 0, 0, 0.3)",

    // Rating stars
    starFilled: "#FBBF24",
    starEmpty: "#4B5563",
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
} as const;

export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: "700" as const,
        lineHeight: 40,
    },
    h2: {
        fontSize: 24,
        fontWeight: "600" as const,
        lineHeight: 32,
    },
    h3: {
        fontSize: 20,
        fontWeight: "600" as const,
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        fontWeight: "400" as const,
        lineHeight: 24,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: "400" as const,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontWeight: "400" as const,
        lineHeight: 16,
    },
    button: {
        fontSize: 16,
        fontWeight: "600" as const,
        lineHeight: 24,
    },
} as const;

export const shadows = {
    sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
} as const;
