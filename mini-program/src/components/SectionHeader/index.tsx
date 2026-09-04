import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, actionText, onAction }) => {
  return (
    <View className={styles.header}>
      <View className={styles.left}>
        <Text className={styles.title}>{title}</Text>
        {subtitle ? <Text className={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionText ? (
        <Text className={styles.action} onClick={onAction}>{actionText}</Text>
      ) : null}
    </View>
  );
};

export default SectionHeader;
