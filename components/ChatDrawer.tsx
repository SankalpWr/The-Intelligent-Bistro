import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { parseOrderMessage } from '../utils/api';
import { TypingIndicator } from './TypingIndicator';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SUGGESTED_PROMPTS = [
  'Add a wagyu burger',
  "What's popular?",
  'Two truffle pastas and a lemonade',
  'Start fresh',
];

const WELCOME_MESSAGE =
  "Bonsoir. I'm your bistro concierge — tell me what you're craving and I'll handle the rest.";

export const ChatDrawer: React.FC<Props> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible && messages.length === 0) {
      setMessages([
        { id: 'welcome', role: 'assistant', text: WELCOME_MESSAGE },
      ]);
    }
  }, [visible, messages.length]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const sendMessage = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || loading) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        text,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);
      scrollToBottom();

      try {
        const result = await parseOrderMessage(text);
        const reply: ChatMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: result.reply,
        };
        setMessages((prev) => [...prev, reply]);
        if (result.cartSummary) {
          setMessages((prev) => [
            ...prev,
            {
              id: `s-${Date.now()}`,
              role: 'system',
              text: result.cartSummary!,
            },
          ]);
        }
        if (result.actions && result.actions.length > 0) {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          ).catch(() => {});
        }
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: `e-${Date.now()}`,
            role: 'assistant',
            text: `I couldn't reach the kitchen just now (${
              err?.message ?? 'unknown error'
            }). Make sure the backend is running and try again.`,
          },
        ]);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    },
    [loading, scrollToBottom],
  );

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        className="flex-1 bg-black/70 justify-end"
      >
        <Pressable className="flex-1" onPress={handleClose} />

        <Animated.View
          entering={SlideInDown.springify().damping(20)}
          exiting={SlideOutDown.duration(200)}
          style={{ height: '70%' }}
          className="bg-bistro-surface rounded-t-3xl border-t border-bistro-border overflow-hidden"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={20}
            style={{ flex: 1 }}
          >
            {/* Drag handle + header */}
            <View className="items-center pt-3 pb-2">
              <View className="w-10 h-1 rounded-full bg-bistro-border" />
            </View>
            <View className="flex-row items-center justify-between px-5 pb-3 border-b border-bistro-border">
              <View className="flex-row items-center">
                <LinearGradient
                  colors={['#e2c768', '#a88a3a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 18 }}>✨</Text>
                </LinearGradient>
                <View className="ml-3">
                  <Text className="font-display-bold text-bistro-cream text-[18px]">
                    Bistro Concierge
                  </Text>
                  <Text className="font-body text-bistro-muted text-[11px]">
                    AI · always at your service
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                className="w-9 h-9 items-center justify-center rounded-full bg-bistro-card border border-bistro-border"
                activeOpacity={0.7}
              >
                <Text className="text-bistro-cream text-[16px]">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollRef}
              className="flex-1 px-4"
              contentContainerStyle={{ paddingVertical: 16 }}
              onContentSizeChange={scrollToBottom}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {loading && (
                <View className="self-start bg-bistro-card border border-bistro-border rounded-2xl rounded-bl-md mt-1">
                  <TypingIndicator />
                </View>
              )}
            </ScrollView>

            {/* Suggested chips */}
            {messages.length <= 1 && !loading && (
              <View className="px-4 pb-2">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, paddingRight: 8 }}
                >
                  {SUGGESTED_PROMPTS.map((p) => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => sendMessage(p)}
                      className="px-3.5 py-2 rounded-full border border-bistro-gold/40 bg-bistro-gold/10"
                      activeOpacity={0.7}
                    >
                      <Text className="font-body-medium text-bistro-gold text-[12px]">
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Input */}
            <View className="px-4 pt-2 pb-5 border-t border-bistro-border bg-bistro-surface">
              <View className="flex-row items-end bg-bistro-card border border-bistro-border rounded-full pl-4 pr-1.5 py-1.5">
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="What would you like tonight?"
                  placeholderTextColor="#6b675f"
                  multiline
                  className="flex-1 text-bistro-cream font-body text-[15px] py-2 max-h-24"
                  style={{
                    fontFamily: 'DMSans_400Regular',
                  }}
                  returnKeyType="send"
                  onSubmitEditing={() => sendMessage(input)}
                  blurOnSubmit={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  activeOpacity={0.8}
                  style={{ opacity: !input.trim() || loading ? 0.4 : 1 }}
                  className="rounded-full overflow-hidden"
                >
                  <LinearGradient
                    colors={['#e2c768', '#a88a3a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text className="text-bistro-bg text-[16px]">➤</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  if (message.role === 'system') {
    return (
      <View className="self-center my-2 px-3 py-1.5 rounded-full bg-bistro-gold/10 border border-bistro-gold/30">
        <Text className="font-body text-bistro-gold text-[11px]">
          {message.text}
        </Text>
      </View>
    );
  }

  const isUser = message.role === 'user';

  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      className={`mb-2.5 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <View
        className={`max-w-[82%] px-4 py-3 ${
          isUser
            ? 'bg-bistro-cream rounded-2xl rounded-br-md'
            : 'bg-bistro-card border border-bistro-border rounded-2xl rounded-bl-md'
        }`}
      >
        <Text
          className={`font-body text-[14.5px] leading-[20px] ${
            isUser ? 'text-bistro-bg' : 'text-bistro-cream'
          }`}
        >
          {message.text}
        </Text>
      </View>
    </Animated.View>
  );
};
