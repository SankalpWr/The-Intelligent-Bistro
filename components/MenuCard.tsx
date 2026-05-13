import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MenuItem } from '../constants/menu';
import { useCartStore } from '../store/cartStore';
import { TagPill } from './TagPill';

type Props = {
  item: MenuItem;
};

export const MenuCard: React.FC<Props> = ({ item }) => {
  const addItem = useCartStore((s) => s.addItem);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    item.sizes?.[0]?.label,
  );

  const hasSizes = !!item.sizes && item.sizes.length > 0;

  const handleTap = () => {
    Haptics.selectionAsync().catch(() => {});
    if (hasSizes) {
      setPickerOpen(true);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
      addItem(item, 1);
    }
  };

  const confirmSize = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    addItem(item, 1, selectedSize);
    setPickerOpen(false);
  };

  const sizeModifier = hasSizes
    ? item.sizes?.find((s) => s.label === selectedSize)?.priceModifier ?? 0
    : 0;

  return (
    <>
      <Pressable
        onPress={handleTap}
        className="active:opacity-80"
      >
        <View className="mb-4 rounded-3xl bg-bistro-card border border-bistro-border overflow-hidden">
          <View className="flex-row p-4">
            {/* Emoji block */}
            <LinearGradient
              colors={['#3a2f1a', '#231c10']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 84,
                height: 84,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'rgba(201, 168, 76, 0.25)',
              }}
            >
              <Text style={{ fontSize: 44 }}>{item.emoji}</Text>
            </LinearGradient>

            {/* Body */}
            <View className="flex-1 ml-4 justify-between">
              <View>
                <View className="flex-row items-start justify-between">
                  <Text
                    className="font-display-bold text-bistro-cream text-[20px] leading-6 flex-1 pr-3"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="font-display-bold text-bistro-gold text-[18px]">
                    ${item.price}
                  </Text>
                </View>
                <Text
                  className="font-body text-bistro-muted text-[13px] mt-1 leading-[18px]"
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              </View>

              <View className="flex-row flex-wrap mt-2 gap-1.5">
                {item.tags.slice(0, 3).map((tag) => (
                  <TagPill key={tag} tag={tag} />
                ))}
                {hasSizes && (
                  <View className="flex-row items-center px-2.5 py-1 rounded-full border bg-bistro-gold/10 border-bistro-gold/30">
                    <Text className="text-[11px] font-body-medium text-bistro-gold">
                      Choose size
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Pressable>

      {/* Size picker sheet */}
      <Modal
        visible={pickerOpen}
        transparent
        animationType="none"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          className="flex-1 bg-black/60 justify-end"
        >
          <Pressable
            className="flex-1"
            onPress={() => setPickerOpen(false)}
          />
          <Animated.View
            entering={SlideInDown.springify().damping(18)}
            exiting={SlideOutDown.duration(200)}
            className="bg-bistro-surface rounded-t-3xl border-t border-bistro-border px-6 pt-5 pb-10"
          >
            <View className="items-center mb-4">
              <View className="w-10 h-1 rounded-full bg-bistro-border" />
            </View>

            <Text className="font-display-bold text-bistro-cream text-[26px]">
              {item.name}
            </Text>
            <Text className="font-body text-bistro-muted text-[14px] mt-1 mb-5">
              {item.description}
            </Text>

            <Text className="font-body-medium text-bistro-cream text-[14px] mb-3">
              Select size
            </Text>
            <View className="gap-2.5">
              {item.sizes?.map((s) => {
                const isActive = selectedSize === s.label;
                return (
                  <TouchableOpacity
                    key={s.label}
                    onPress={() => {
                      Haptics.selectionAsync().catch(() => {});
                      setSelectedSize(s.label);
                    }}
                    className={`flex-row items-center justify-between p-4 rounded-2xl border ${
                      isActive
                        ? 'bg-bistro-gold/15 border-bistro-gold'
                        : 'bg-bistro-card border-bistro-border'
                    }`}
                  >
                    <Text
                      className={`font-body-medium text-[16px] ${
                        isActive ? 'text-bistro-gold' : 'text-bistro-cream'
                      }`}
                    >
                      {s.label}
                    </Text>
                    <Text
                      className={`font-body-medium text-[15px] ${
                        isActive ? 'text-bistro-gold' : 'text-bistro-muted'
                      }`}
                    >
                      ${(item.price + s.priceModifier).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={confirmSize}
              className="mt-6 rounded-2xl overflow-hidden"
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#d4b65a', '#a88a3a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingVertical: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text className="font-body-bold text-bistro-bg text-[16px]">
                  Add to Cart · ${(item.price + sizeModifier).toFixed(2)}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};
