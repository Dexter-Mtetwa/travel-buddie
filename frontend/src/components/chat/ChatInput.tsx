/**
 * ChatInput Component
 * Text input with send button for chat messages
 */

import React, { useState, useRef } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Keyboard,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    colors,
    spacing,
    borderRadius,
    typography,
} from "../../theme/colors";

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading?: boolean;
    placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    isLoading = false,
    placeholder = "Type your travel plans...",
}) => {
    const [text, setText] = useState("");
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const inputRef = useRef<TextInput>(null);

    const handleSend = () => {
        if (!text.trim() || isLoading) return;

        // Animate button press
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        onSend(text.trim());
        setText("");
        Keyboard.dismiss();
    };

    const canSend = text.trim().length > 0 && !isLoading;

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    multiline
                    maxLength={500}
                    editable={!isLoading}
                    returnKeyType="send"
                    blurOnSubmit={false}
                    onSubmitEditing={handleSend}
                />
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            canSend && styles.sendButtonActive,
                        ]}
                        onPress={handleSend}
                        disabled={!canSend}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isLoading ? "hourglass" : "send"}
                            size={20}
                            color={canSend ? colors.text : colors.textMuted}
                        />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        paddingLeft: spacing.md,
        paddingRight: spacing.xs,
        paddingVertical: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
    },
    input: {
        flex: 1,
        ...typography.body,
        color: colors.text,
        maxHeight: 100,
        paddingVertical: Platform.OS === "ios" ? spacing.sm : spacing.xs,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceLight,
        justifyContent: "center",
        alignItems: "center",
    },
    sendButtonActive: {
        backgroundColor: colors.primary,
    },
});
