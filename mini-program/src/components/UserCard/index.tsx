import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import type { User } from '@/types';
import styles from './index.module.scss';

interface UserCardProps {
  user: User;
  onClick?: () => void;
  actionText?: string;
  onAction?: () => void;
  compact?: boolean;
}

const roleLabel: Record<string, string> = {
  chinese: '中国学生',
  international: '留学生'
};

const UserCard: React.FC<UserCardProps> = ({ user, onClick, actionText, onAction, compact }) => {
  return (
    <View
      className={classnames(styles.card, compact && styles.compact)}
      onClick={onClick}
    >
      <View className={styles.avatarWrap}>
        <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
        {user.isOnline ? <View className={styles.onlineDot} /> : null}
      </View>
      <View className={styles.info}>
        <View className={styles.nameRow}>
          <Text className={styles.name}>{user.name}</Text>
          <View className={classnames(styles.roleTag, user.role === 'international' && styles.international)}>
            <Text className={styles.roleText}>{roleLabel[user.role]}</Text>
          </View>
        </View>
        <Text className={styles.bio}>{user.bio}</Text>
        <View className={styles.meta}>
          <View className={styles.ratingPill}>
            <Text className={styles.star}>★</Text>
            <Text className={styles.ratingValue}>{user.ratingAvg.toFixed(1)}</Text>
          </View>
          <Text className={styles.practice}>{user.practiceCount} 次练习</Text>
        </View>
      </View>
      {actionText ? (
        <View
          className={styles.actionBtn}
          onClick={(e) => {
            e.stopPropagation();
            onAction?.();
          }}
        >
          <Text className={styles.actionText}>{actionText}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default UserCard;
