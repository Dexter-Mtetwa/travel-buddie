import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "Travel Buddie",
    slug: "travel-buddie",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#0F172A",
    },
    ios: {
        supportsTablet: false,
        bundleIdentifier: "com.travelbuddie.app",
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#0F172A",
        },
        package: "com.travelbuddie.app",
    },
    extra: {
        API_BASE_URL: process.env.API_BASE_URL || "http://localhost:8000",
        USE_MOCKS: process.env.USE_MOCKS === "true",
    },
    scheme: "travelbuddie",
    plugins: ["expo-router"],
});
