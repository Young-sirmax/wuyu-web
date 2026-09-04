import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface EmptyStateProps {
  icon?: string;
  text: string;
  hint?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon = '📭', text, hint }) => {
  return (
    <View className={styles.wrap}>
      <Text className={styles.icon}>{icon}</Text>
      <Text className={styles.text}>{text}</Text>
      {hint ? <Text className={styles.hint}>{hint}</Text> : null}
    </View>
  );
};

export default EmptyState;
