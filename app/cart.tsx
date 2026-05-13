import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  LinearTransition,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useCartStore } from '../store/cartStore';
import { CartItem } from '../components/CartItem';
import { ChatDrawer } from '../components/ChatDrawer';
import { ChatFab } from '../components/ChatFab';

export default function CartScreen() {
  const router = useRouter();
  const entries = useCartStore((s) => s.entries);
  const total = useCartStore((s) => s.total)();
  const itemCount = useCartStore((s) => s.itemCount)();
  const clearCart = useCartStore((s) => s.clearCart);
  const [chatOpen, setChatOpen] = useState(false);

  const serviceCharge = total * 0.1;
  const grandTotal = total + serviceCharge;

  const onCheckout = () => {
    if (entries.length === 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    Alert.alert(
      'Order Placed',
      `Your order of ${itemCount} ${
        itemCount === 1 ? 'item' : 'items'
      } has been sent to the kitchen.\n\nTotal: $${grandTotal.toFixed(2)}`,
      [
        {
          text: 'Continue',
          onPress: () => {
            clearCart();
            router.replace('/menu');
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-bistro-bg">
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full border border-bistro-border items-center justify-center bg-bistro-card"
          >
            <Text className="text-bistro-cream text-[20px] -mt-0.5">‹</Text>
          </TouchableOpacity>

          <View className="items-center">
            <Text className="font-body text-bistro-gold tracking-[4px] text-[10px]">
              YOUR ORDER
            </Text>
            <Text className="font-display-bold text-bistro-cream text-[22px]">
              Table for One
            </Text>
          </View>

          <View className="w-10 h-10 rounded-full bg-bistro-gold/15 border border-bistro-gold/40 items-center justify-center">
            <Text className="font-body-bold text-bistro-gold text-[13px]">
              {itemCount}
            </Text>
          </View>
        </View>

        {entries.length === 0 ? (
          <EmptyState onBrowse={() => router.replace('/menu')} />
        ) : (
          <>
            <ScrollView
              className="flex-1 px-5"
              contentContainerStyle={{ paddingTop: 8, paddingBottom: 220 }}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View layout={LinearTransition.springify()}>
                {entries.map((e) => (
                  <CartItem
                    key={`${e.item.id}-${e.selectedSize ?? 'std'}`}
                    entry={e}
                  />
                ))}
              </Animated.View>

              <Text className="font-body text-bistro-muted text-[11px] text-center mt-2 italic">
                Swipe left to remove an item
              </Text>

              {/* Summary */}
              <View className="mt-6 bg-bistro-card border border-bistro-border rounded-3xl p-5">
                <Text className="font-display-bold text-bistro-cream text-[18px] mb-3">
                  Order Summary
                </Text>
                <SummaryRow label="Subtotal" value={total} />
                <SummaryRow
                  label="Service Charge (10%)"
                  value={serviceCharge}
                />
                <View className="h-px bg-bistro-border my-3" />
                <View className="flex-row justify-between items-baseline">
                  <Text className="font-display-bold text-bistro-cream text-[18px]">
                    Total
                  </Text>
                  <Text className="font-display-bold text-bistro-gold text-[24px]">
                    ${grandTotal.toFixed(2)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  clearCart();
                }}
                className="mt-4 self-center px-4 py-2"
                activeOpacity={0.6}
              >
                <Text className="font-body text-bistro-muted text-[12px] underline">
                  Clear cart
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Checkout bar */}
            <Animated.View
              entering={FadeIn.duration(300)}
              className="absolute left-4 right-4 bottom-6"
            >
              <TouchableOpacity
                activeOpacity={0.92}
                onPress={onCheckout}
                className="rounded-3xl overflow-hidden"
                style={{
                  shadowColor: '#c9a84c',
                  shadowOpacity: 0.4,
                  shadowRadius: 20,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 10,
                }}
              >
                <LinearGradient
                  colors={['#d4b65a', '#a88a3a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingVertical: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text className="font-body-bold text-bistro-bg text-[15px] tracking-[2px]">
                    CHECKOUT  ·  ${grandTotal.toFixed(2)}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </SafeAreaView>

      <ChatFab
        onPress={() => setChatOpen(true)}
        bottomOffset={entries.length > 0 ? 110 : 32}
      />
      <ChatDrawer
        visible={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </View>
  );
}

const SummaryRow: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => (
  <View className="flex-row justify-between py-1">
    <Text className="font-body text-bistro-muted text-[14px]">{label}</Text>
    <Text className="font-body-medium text-bistro-cream text-[14px]">
      ${value.toFixed(2)}
    </Text>
  </View>
);

const EmptyState: React.FC<{ onBrowse: () => void }> = ({ onBrowse }) => (
  <View className="flex-1 items-center justify-center px-10 -mt-12">
    <View className="w-28 h-28 rounded-full border border-bistro-gold/30 items-center justify-center mb-6">
      <Text style={{ fontSize: 54 }}>🍷</Text>
    </View>
    <Text
      className="font-display text-bistro-cream text-center"
      style={{ fontSize: 26, lineHeight: 32 }}
    >
      Your table is set,{'\n'}but your order awaits…
    </Text>
    <Text className="font-body text-bistro-muted text-center text-[14px] mt-4 leading-[20px] max-w-[280px]">
      Browse the menu or summon our AI concierge to compose something
      exquisite.
    </Text>
    <TouchableOpacity
      onPress={onBrowse}
      activeOpacity={0.85}
      className="mt-8 rounded-full overflow-hidden"
    >
      <LinearGradient
        colors={['#d4b65a', '#a88a3a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingVertical: 14,
          paddingHorizontal: 36,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text className="font-body-bold text-bistro-bg text-[13px] tracking-[2px]">
          BROWSE MENU
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);
