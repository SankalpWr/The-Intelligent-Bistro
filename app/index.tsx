import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function Landing() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1a1a1a', '#221f1a', '#2a2418']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View className="flex-1 px-8 justify-between">
          {/* Top crest */}
          <Animated.View
            entering={FadeInDown.duration(800)}
            className="items-center mt-16"
          >
            <View className="w-20 h-20 rounded-full border border-bistro-gold/40 items-center justify-center mb-4">
              <Text style={{ fontSize: 38 }}>🍽️</Text>
            </View>
            <Text className="font-body text-bistro-gold tracking-[6px] text-[11px]">
              EST. 2026
            </Text>
          </Animated.View>

          {/* Hero */}
          <Animated.View
            entering={FadeIn.delay(300).duration(900)}
            className="items-center"
          >
            <Text
              className="font-display text-bistro-cream text-center"
              style={{ fontSize: 56, lineHeight: 60 }}
            >
              The{'\n'}
              <Text className="font-display-bold text-bistro-gold">
                Intelligent
              </Text>
              {'\n'}Bistro
            </Text>
            <View className="flex-row items-center my-6">
              <View className="h-px w-12 bg-bistro-gold/40" />
              <Text className="font-body text-bistro-muted text-[12px] tracking-[3px] mx-3">
                AI · DINING
              </Text>
              <View className="h-px w-12 bg-bistro-gold/40" />
            </View>
            <Text className="font-body text-bistro-muted text-center text-[14px] leading-[22px] max-w-[300px]">
              A curated tasting room where conversation is the menu.
              Just tell us what you crave.
            </Text>
          </Animated.View>

          {/* CTA */}
          <Animated.View
            entering={FadeInUp.delay(600).duration(700)}
            className="mb-10"
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
                  () => {},
                );
                router.replace('/menu');
              }}
              className="rounded-full overflow-hidden"
              style={{
                shadowColor: '#c9a84c',
                shadowOpacity: 0.4,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 6 },
                elevation: 8,
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
                  ENTER THE BISTRO
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text className="font-body text-bistro-muted text-center text-[11px] mt-4 tracking-[2px]">
              POWERED BY ANTHROPIC CLAUDE
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
