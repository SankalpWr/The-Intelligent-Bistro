import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '../utils/icons';
import { CartEntry, computeEntryPrice, useCartStore } from '../store/cartStore';

type Props = {
  entry: CartEntry;
};

const SWIPE_THRESHOLD = -90;

export const CartItem: React.FC<Props> = ({ entry }) => {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(96);
  const opacity = useSharedValue(1);

  const handleRemove = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      () => {},
    );
    removeItem(entry.item.id, entry.selectedSize);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = Math.max(e.translationX, -140);
      }
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withTiming(-400, { duration: 220 });
        opacity.value = withTiming(0, { duration: 220 });
        itemHeight.value = withTiming(0, { duration: 220 }, (finished) => {
          if (finished) runOnJS(handleRemove)();
        });
      } else {
        translateX.value = withTiming(0, { duration: 180 });
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    marginBottom: itemHeight.value === 0 ? 0 : 12,
  }));

  const deleteStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, -translateX.value / 90),
  }));

  const linePrice = computeEntryPrice(entry);

  const onDec = () => {
    Haptics.selectionAsync().catch(() => {});
    updateQuantity(
      entry.item.id,
      entry.quantity - 1,
      entry.selectedSize,
    );
  };

  const onInc = () => {
    Haptics.selectionAsync().catch(() => {});
    updateQuantity(
      entry.item.id,
      entry.quantity + 1,
      entry.selectedSize,
    );
  };

  return (
    <Animated.View style={containerStyle} className="relative">
      {/* Delete background */}
      <Animated.View
        style={deleteStyle}
        className="absolute right-0 top-0 bottom-0 w-32 bg-bistro-rust/90 rounded-2xl items-center justify-center"
      >
        <Ionicons name="trash" />
        <Text className="font-body-medium text-bistro-cream text-[12px] mt-1">
          Remove
        </Text>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={rowStyle}
          className="flex-row items-center bg-bistro-card border border-bistro-border rounded-2xl px-3.5 py-3"
        >
          <View
            className="w-14 h-14 rounded-2xl items-center justify-center bg-bistro-surface border border-bistro-border"
          >
            <Text style={{ fontSize: 30 }}>{entry.item.emoji}</Text>
          </View>

          <View className="flex-1 ml-3">
            <Text
              className="font-display-bold text-bistro-cream text-[17px]"
              numberOfLines={1}
            >
              {entry.item.name}
            </Text>
            <View className="flex-row items-center mt-0.5">
              {entry.selectedSize && (
                <Text className="font-body text-bistro-gold text-[12px] mr-2">
                  {entry.selectedSize}
                </Text>
              )}
              <Text className="font-body text-bistro-muted text-[12px]">
                ${linePrice.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Quantity stepper */}
          <View className="flex-row items-center bg-bistro-bg border border-bistro-border rounded-full">
            <TouchableOpacity
              onPress={onDec}
              className="w-8 h-8 items-center justify-center"
              activeOpacity={0.6}
            >
              <Text className="font-body-bold text-bistro-gold text-[18px]">
                −
              </Text>
            </TouchableOpacity>
            <Text className="font-body-bold text-bistro-cream text-[14px] w-5 text-center">
              {entry.quantity}
            </Text>
            <TouchableOpacity
              onPress={onInc}
              className="w-8 h-8 items-center justify-center"
              activeOpacity={0.6}
            >
              <Text className="font-body-bold text-bistro-gold text-[18px]">
                +
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};
