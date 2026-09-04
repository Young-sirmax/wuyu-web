import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const VlogPage: React.FC = () => {
  return (
    <View className={styles.container}>
      <Text className={styles.icon}>📹</Text>
      <Text className={styles.title}>口语 Vlog</Text>
      <Text className={styles.hint}>功能正在开发中...</Text>
    </View>
  );
};

export default VlogPage;
