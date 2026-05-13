import React from 'react';
import { Text, View } from 'react-native';
import { TAG_LABELS } from '../constants/menu';

type Props = {
  tag: string;
};

export const TagPill: React.FC<Props> = ({ tag }) => {
  const info = TAG_LABELS[tag] ?? { label: tag, emoji: '•' };
  const isSpicy = tag === 'spicy';
  const isPopular = tag === 'popular' || tag === 'bestseller';
  const bg = isSpicy
    ? 'bg-bistro-rust/15 border-bistro-rust/40'
    : isPopular
      ? 'bg-bistro-gold/15 border-bistro-gold/40'
      : 'bg-bistro-sage/15 border-bistro-sage/40';
  const fg = isSpicy
    ? 'text-bistro-rust'
    : isPopular
      ? 'text-bistro-gold'
      : 'text-bistro-sage';

  return (
    <View
      className={`flex-row items-center px-2.5 py-1 rounded-full border ${bg}`}
    >
      <Text className={`text-[11px] font-body-medium ${fg}`}>
        {info.emoji} {info.label}
      </Text>
    </View>
  );
};
