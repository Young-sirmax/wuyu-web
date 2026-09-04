import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import type { Party } from '@/types';
import styles from './index.module.scss';

interface PartyCardProps {
  party: Party;
  onJoin?: () => void;
  onClick?: () => void;
}

const langLabel: Record<string, string> = {
  zh: '中文', en: '英语', ja: '日语', ko: '韩语',
  fr: '法语', es: '西语', de: '德语', ru: '俄语', ar: '阿语'
};

const statusMap: Record<string, { text: string; cls: string }> = {
  recruiting: { text: '招募中', cls: 'recruiting' },
  full: { text: '已满员', cls: 'full' },
  ongoing: { text: '进行中', cls: 'ongoing' },
  ended: { text: '已结束', cls: 'ended' },
  cancelled: { text: '已取消', cls: 'cancelled' }
};

const PartyCard: React.FC<PartyCardProps> = ({ party, onJoin, onClick }) => {
  const status = statusMap[party.status] || statusMap.recruiting;
  const currentCount = party.members.length;
  const canJoin = party.status === 'recruiting' && currentCount < party.maxMembers;

  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.top}>
        <View className={styles.titleRow}>
          <Text className={styles.langTag}>{langLabel[party.language] || party.language}</Text>
          <Text className={styles.title}>{party.title}</Text>
        </View>
        <View className={classnames(styles.statusTag, styles[status.cls])}>
          <Text className={styles.statusText}>{status.text}</Text>
        </View>
      </View>
      <Text className={styles.topic}>{party.topic}</Text>
      <View className={styles.meta}>
        <View className={styles.members}>
          {party.members.map((m) => (
            <Image key={m.openid} className={styles.memberAvatar} src={m.avatar} mode="aspectFill" />
          ))}
          {Array.from({ length: Math.max(0, party.maxMembers - currentCount) }).map((_, i) => (
            <View key={`empty_${i}`} className={styles.memberEmpty}>
              <Text className={styles.plus}>+</Text>
            </View>
          ))}
          <Text className={styles.memberCount}>{currentCount}/{party.maxMembers}</Text>
        </View>
      </View>
      <View className={styles.footer}>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>时间</Text>
          <Text className={styles.infoValue}>{party.scheduledTime.slice(5, 16).replace('T', ' ')}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>地点</Text>
          <Text className={styles.infoValue}>{party.location}</Text>
        </View>
      </View>
      {canJoin ? (
        <View
          className={styles.joinBtn}
          onClick={(e) => {
            e.stopPropagation();
            onJoin?.();
          }}
        >
          <Text className={styles.joinText}>加入组局</Text>
        </View>
      ) : null}
    </View>
  );
};

export default PartyCard;
