import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const Dot: React.FC<{ delay: number }> = ({ delay }) => {
  const opacity = useSharedValue(0.3);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 350 }),
          withTiming(0.3, { duration: 350 }),
        ),
        -1,
        false,
      ),
    );
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-3, { duration: 350 }),
          withTiming(0, { duration: 350 }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={style}
      className="w-1.5 h-1.5 rounded-full bg-bistro-gold mx-0.5"
    />
  );
};

export const TypingIndicator: React.FC = () => (
  <View className="flex-row items-center px-4 py-3">
    <Dot delay={0} />
    <Dot delay={150} />
    <Dot delay={300} />
  </View>
);
