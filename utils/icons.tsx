import React from 'react';
import { Text } from 'react-native';

type IconName =
  | 'trash'
  | 'chat'
  | 'send'
  | 'close'
  | 'back'
  | 'cart'
  | 'sparkle';

const ICON_GLYPHS: Record<IconName, string> = {
  trash: '🗑',
  chat: '✦',
  send: '➤',
  close: '✕',
  back: '‹',
  cart: '🛒',
  sparkle: '✨',
};

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

export const Ionicons: React.FC<Props> = ({
  name,
  size = 20,
  color = '#f5f0e8',
}) => (
  <Text style={{ fontSize: size, color, lineHeight: size * 1.1 }}>
    {ICON_GLYPHS[name]}
  </Text>
);
