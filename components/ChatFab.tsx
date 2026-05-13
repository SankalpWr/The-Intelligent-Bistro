import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  onPress: () => void;
  bottomOffset?: number;
};

export const ChatFab: React.FC<Props> = ({ onPress, bottomOffset = 96 }) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.6, { duration: 1600 }),
      -1,
      false,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: Math.max(0, 1 - (pulse.value - 1) / 0.6),
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View
      className="absolute right-5"
      style={{ bottom: bottomOffset }}
      pointerEvents="box-none"
    >
      <View className="relative w-16 h-16 items-center justify-center">
        <Animated.View
          style={[pulseStyle]}
          className="absolute w-16 h-16 rounded-full bg-bistro-gold/40"
        />
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
              () => {},
            );
            onPress();
          }}
          className="rounded-full overflow-hidden"
          style={{
            shadowColor: '#c9a84c',
            shadowOpacity: 0.7,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 4 },
            elevation: 12,
          }}
        >
          <LinearGradient
            colors={['#e2c768', '#a88a3a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 26 }}>✨</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};
