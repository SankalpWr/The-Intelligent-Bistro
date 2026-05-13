import React, { useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { CATEGORIES, MENU, MenuCategory } from '../constants/menu';
import { MenuCard } from '../components/MenuCard';
import { FloatingCartBar } from '../components/FloatingCartBar';
import { ChatFab } from '../components/ChatFab';
import { ChatDrawer } from '../components/ChatDrawer';
import { useCartStore } from '../store/cartStore';

const TAB_WIDTH = 100;

export default function MenuScreen() {
  const [active, setActive] = useState<MenuCategory>('starters');
  const [chatOpen, setChatOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const underlineX = useSharedValue(0);
  const entries = useCartStore((s) => s.entries);

  const visibleItems = useMemo(
    () => MENU.filter((m) => m.category === active),
    [active],
  );

  const onCategoryPress = (cat: MenuCategory, index: number) => {
    Haptics.selectionAsync().catch(() => {});
    setActive(cat);
    underlineX.value = withTiming(index * TAB_WIDTH, { duration: 280 });
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: underlineX.value }],
  }));

  const cartPadding = entries.length > 0 ? 110 : 24;

  return (
    <View className="flex-1 bg-bistro-bg">
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View className="px-6 pt-2 pb-3">
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="font-body text-bistro-gold tracking-[4px] text-[10px]">
                THE MENU
              </Text>
              <Text className="font-display-bold text-bistro-cream text-[34px] leading-[40px] mt-1">
                Tonight's Selection
              </Text>
            </View>
            <View className="w-10 h-10 rounded-full border border-bistro-gold/30 items-center justify-center bg-bistro-card">
              <Text style={{ fontSize: 16 }}>🕯️</Text>
            </View>
          </View>
        </View>

        {/* Category tabs */}
        <View className="border-b border-bistro-border">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            <View className="relative">
              <View className="flex-row">
                {CATEGORIES.map((c, i) => {
                  const isActive = active === c.id;
                  return (
                    <Pressable
                      key={c.id}
                      onPress={() => onCategoryPress(c.id, i)}
                      style={{ width: TAB_WIDTH }}
                      className="py-4 items-center"
                    >
                      <Text
                        className={`font-display-bold text-[18px] ${
                          isActive
                            ? 'text-bistro-cream'
                            : 'text-bistro-muted'
                        }`}
                      >
                        {c.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Animated.View
                style={[
                  underlineStyle,
                  {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: TAB_WIDTH,
                    height: 2,
                    alignItems: 'center',
                  },
                ]}
              >
                <LinearGradient
                  colors={['#d4b65a', '#a88a3a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: 40,
                    height: 2,
                    borderRadius: 2,
                  }}
                />
              </Animated.View>
            </View>
          </ScrollView>
        </View>

        {/* Item list */}
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: cartPadding,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center mb-5">
            <View className="h-px flex-1 bg-bistro-border" />
            <Text className="font-body text-bistro-muted text-[11px] tracking-[3px] mx-4">
              {visibleItems.length} CURATED DISHES
            </Text>
            <View className="h-px flex-1 bg-bistro-border" />
          </View>

          {visibleItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}

          <View className="items-center mt-2 mb-4">
            <Text className="font-display text-bistro-muted text-[14px] italic">
              ~ end of {active} ~
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Floating cart + chat */}
      <ChatFab
        onPress={() => setChatOpen(true)}
        bottomOffset={entries.length > 0 ? 110 : 32}
      />
      <FloatingCartBar />
      <ChatDrawer
        visible={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </View>
  );
}
