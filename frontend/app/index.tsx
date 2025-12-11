/**
 * Chat Screen (Main Screen)
 * Conversational interface for trip planning
 */

import React, { useRef, useCallback } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ListRenderItem,
} from "react-native";
import { useChat } from "../src/hooks/useChat";
import { Message } from "../src/api/types";
import {
    MessageBubble,
    ChatInput,
    TypingIndicator,
} from "../src/components/chat";
import { Header } from "../src/components/ui/Header";
import { GradientBackground } from "../src/components/ui/GradientBackground";
import { colors, spacing } from "../src/theme/colors";

export default function ChatScreen() {
    const { messages, isLoading, sendMessage, resetChat } = useChat();
    const flatListRef = useRef<FlatList>(null);

    // Scroll to bottom when new messages arrive
    const scrollToBottom = useCallback(() => {
        if (flatListRef.current && messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages.length]);

    // Render individual message
    const renderMessage: ListRenderItem<Message> = useCallback(
        ({ item, index }) => (
            <MessageBubble
                message={item}
                isLatest={index === messages.length - 1}
            />
        ),
        [messages.length]
    );

    // Key extractor for FlatList
    const keyExtractor = useCallback((item: Message) => item.id, []);

    // Handle send
    const handleSend = useCallback(
        (text: string) => {
            sendMessage(text);
            scrollToBottom();
        },
        [sendMessage, scrollToBottom]
    );

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={0}
            >
                {/* Header */}
                <Header onReset={resetChat} />

                {/* Messages List */}
                <FlatList
                    ref={flatListRef}
                    style={styles.messageList}
                    contentContainerStyle={styles.messageListContent}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={scrollToBottom}
                    onLayout={scrollToBottom}
                    ListFooterComponent={isLoading ? <TypingIndicator /> : null}
                />

                {/* Input */}
                <ChatInput onSend={handleSend} isLoading={isLoading} />
            </KeyboardAvoidingView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageList: {
        flex: 1,
    },
    messageListContent: {
        paddingVertical: spacing.sm,
    },
});
