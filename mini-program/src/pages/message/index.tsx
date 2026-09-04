import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { callFunction } from '@/services/cloud';
import type { Message } from '@/types';
import EmptyState from '@/components/EmptyState';
import styles from './index.module.scss';

const typeIcon: Record<string, { icon: string; cls: string }> = {
  appointment: { icon: '📅', cls: 'appointment' },
  party: { icon: '🎉', cls: 'party' },
  evaluation: { icon: '⭐', cls: 'evaluation' },
  system: { icon: '📢', cls: 'system' }
};

const MessagePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await callFunction<{ messages: Message[] }>('getMessages');
      setMessages(res.messages);
    } catch (err) {
      console.error('[Message] loadData failed:', err);
      Taro.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const handleMarkAllRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
    Taro.showToast({ title: '已全部已读', icon: 'success' });
  };

  const handleClick = (m: Message) => {
    setMessages((prev) => prev.map((item) => (item._id === m._id ? { ...item, isRead: true } : item)));
    if (m.type === 'evaluation' && m.extra?.appointmentId) {
      const extra = m.extra as { appointmentId?: string; targetOpenid?: string };
      Taro.navigateTo({
        url: `/pages/evaluation/index?appointmentId=${extra.appointmentId || ''}&targetOpenid=${extra.targetOpenid || ''}`
      });
    } else if (m.type === 'party' && m.extra?.partyId) {
      Taro.navigateTo({ url: `/pages/appointment-detail/index?partyId=${(m.extra as { partyId: string }).partyId}` });
    } else {
      Taro.showToast({ title: m.title, icon: 'none' });
    }
  };

  return (
    <View className={styles.container}>
      {unreadCount > 0 ? (
        <View className={styles.unreadBar}>
          <Text className={styles.unreadText}>{unreadCount} 条未读消息</Text>
          <Button className={styles.markReadBtn} onClick={handleMarkAllRead}>
            <Text className={styles.markRead}>全部已读</Text>
          </Button>
        </View>
      ) : null}

      {loading ? (
        <View className={styles.loading}>加载中...</View>
      ) : messages.length === 0 ? (
        <EmptyState icon="🔔" text="暂无消息" hint="预约和组局通知会出现在这里" />
      ) : (
        <View className={styles.list}>
          {messages.map((m) => {
            const cfg = typeIcon[m.type] || typeIcon.system;
            return (
              <View
                key={m._id}
                className={classnames(styles.item, !m.isRead && styles.unread)}
                onClick={() => handleClick(m)}
              >
                <View className={classnames(styles.iconWrap, styles[cfg.cls])}>
                  <Text>{cfg.icon}</Text>
                  {!m.isRead ? <View className={styles.dot} /> : null}
                </View>
                <View className={styles.content}>
                  <View className={styles.titleRow}>
                    <Text className={styles.title}>{m.title}</Text>
                    <Text className={styles.time}>{m.createTime.slice(5, 16).replace('T', ' ')}</Text>
                  </View>
                  <Text className={styles.desc}>{m.content}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default MessagePage;
