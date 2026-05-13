import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useCartStore } from '../store/cartStore';

export const FloatingCartBar: React.FC = () => {
  const router = useRouter();
  const entries = useCartStore((s) => s.entries);
  const total = useCartStore((s) => s.total)();
  const count = useCartStore((s) => s.itemCount)();

  if (entries.length === 0) return null;

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18)}
      exiting={FadeOutDown.duration(200)}
      layout={LinearTransition.springify()}
      className="absolute left-4 right-4 bottom-6"
      pointerEvents="box-none"
    >
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          router.push('/cart');
        }}
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
            paddingVertical: 16,
            paddingHorizontal: 22,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-full bg-bistro-bg/30 items-center justify-center">
              <Text className="font-body-bold text-bistro-bg text-[14px]">
                {count}
              </Text>
            </View>
            <Text className="font-body-bold text-bistro-bg text-[15px] ml-3">
              {count === 1 ? '1 item' : `${count} items`}
              <Text className="font-body text-bistro-bg/70">  ·  </Text>
              <Text className="font-body-bold text-bistro-bg">
                ${total.toFixed(2)}
              </Text>
            </Text>
          </View>
          <Text className="font-body-bold text-bistro-bg text-[15px]">
            View Cart  ›
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};
