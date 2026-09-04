import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { callFunction } from '@/services/cloud';
import { useUserStore } from '@/store/useUserStore';
import { EVALUATION_DIMENSIONS, langNameMap } from '@/constants';
import type { MyProfile } from '@/types';
import RatingStars from '@/components/RatingStars';
import styles from './index.module.scss';

const roleLabel: Record<string, string> = {
  chinese: '中国学生',
  international: '留学生'
};

const MinePage: React.FC = () => {
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const setUser = useUserStore((s) => s.setUser);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await callFunction<MyProfile>('getMyProfile');
      setProfile(res);
      setUser(res.user);
    } catch (err) {
      console.error('[Mine] loadData failed:', err);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRegister = () => {
    Taro.navigateTo({ url: '/pages/register/index' });
  };

  const handleMenu = (key: string) => {
    Taro.showToast({ title: '功能开发中', icon: 'none' });
  };

  if (loading && !profile) {
    return <View className={styles.loading}>加载中...</View>;
  }

  if (!profile) {
    return (
      <View className={styles.container}>
        <View className={styles.registerTip}>
          <Text className={styles.registerTipText}>完善资料即可开始练习</Text>
          <View className={styles.registerTipBtn} onClick={handleRegister}>
            <Text className={styles.registerTipBtnText}>立即注册</Text>
          </View>
        </View>
      </View>
    );
  }

  const { user, stats } = profile;
  const learnLangText = user.learnLangs.map((l) => langNameMap[l]).join('、');

  return (
    <View className={styles.container}>
      <View className={styles.profileCard}>
        <View className={styles.profileBg} />
        <View className={styles.profileTop}>
          <View className={styles.avatarWrap}>
            <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
            <View className={styles.roleBadge}>
              <Text className={styles.roleText}>{roleLabel[user.role]}</Text>
            </View>
          </View>
          <View className={styles.profileInfo}>
            <Text className={styles.profileName}>{user.name}</Text>
            <View className={styles.profileMeta}>
              <View className={styles.schoolTag}>
                <Text className={styles.schoolText}>{user.schoolName}</Text>
              </View>
              <Text className={styles.studentId}>学号 {user.studentId}</Text>
            </View>
          </View>
        </View>
        <Text className={styles.bio}>{user.bio}</Text>
        <View className={styles.creditRow}>
          <View className={styles.creditLeft}>
            <Text className={styles.creditIcon}>🏆</Text>
            <Text className={styles.creditLabel}>信用分</Text>
          </View>
          <Text className={styles.creditValue}>{user.creditScore}</Text>
        </View>
      </View>

      <View className={styles.ratingSection}>
        <Text className={styles.sectionTitle}>互评维度</Text>
        <View className={styles.ratingList}>
          {EVALUATION_DIMENSIONS.map((d) => (
            <View key={d.key} className={styles.ratingItem}>
              <View className={styles.ratingLeft}>
                <Text className={styles.ratingIcon}>{d.icon}</Text>
                <View>
                  <Text className={styles.ratingName}>{d.label}</Text>
                  <Text className={styles.ratingHint}>{d.hint}</Text>
                </View>
              </View>
              <RatingStars value={stats.ratingSummary[d.key]} size="sm" showValue />
            </View>
          ))}
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.appointmentCount}</Text>
          <Text className={styles.statLabel}>练习次数</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.partyCount}</Text>
          <Text className={styles.statLabel}>参与组局</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.evaluationCount}</Text>
          <Text className={styles.statLabel}>收到评价</Text>
        </View>
      </View>

      <View className={styles.menu}>
        <View className={styles.menuItem} onClick={() => handleMenu('history')}>
          <Text className={styles.menuIcon}>📋</Text>
          <Text className={styles.menuLabel}>练习历史</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem} onClick={() => handleMenu('party')}>
          <Text className={styles.menuIcon}>🎉</Text>
          <Text className={styles.menuLabel}>我的组局</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem} onClick={() => handleMenu('lang')}>
          <Text className={styles.menuIcon}>🗣️</Text>
          <Text className={styles.menuLabel}>学习语言</Text>
          <Text className={styles.menuArrow}>{learnLangText} ›</Text>
        </View>
        <View className={styles.menuItem} onClick={() => handleMenu('setting')}>
          <Text className={styles.menuIcon}>⚙️</Text>
          <Text className={styles.menuLabel}>设置</Text>
          <Text className={styles.menuArrow}>›</Text>
        </View>
      </View>
    </View>
  );
};

export default MinePage;
