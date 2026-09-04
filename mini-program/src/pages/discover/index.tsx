import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { callFunction } from '@/services/cloud';
import { useUserStore } from '@/store/useUserStore';
import type { DiscoverData, User, Party, Vlog } from '@/types';
import SectionHeader from '@/components/SectionHeader';
import UserCard from '@/components/UserCard';
import PartyCard from '@/components/PartyCard';
import styles from './index.module.scss';

const DiscoverPage: React.FC = () => {
  const [data, setData] = useState<DiscoverData | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useUserStore((s) => s.user);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await callFunction<DiscoverData>('getDiscoverData');
      setData(res);
    } catch (err) {
      console.error('[Discover] loadData failed:', err);
      Taro.showToast({ title: '加载失败，请重试', icon: 'none' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMatch = () => {
    Taro.showToast({ title: '正在为你匹配语伴...', icon: 'loading', duration: 1500 });
  };

  const handleAvatar = () => {
    Taro.switchTab({ url: '/pages/mine/index' });
  };

  const handleUserClick = (u: User) => {
    Taro.navigateTo({ url: `/pages/user-profile/index?openid=${u.openid}` });
  };

  const handleInvite = (u: User) => {
    Taro.showToast({ title: `已向 ${u.name} 发送邀请`, icon: 'success' });
  };

  const handlePartyJoin = (p: Party) => {
    Taro.showModal({
      title: '加入组局',
      content: `确定加入「${p.title}」吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await callFunction('joinParty', { partyId: p._id });
            Taro.showToast({ title: '加入成功', icon: 'success' });
            loadData();
          } catch (err) {
            console.error('[Discover] joinParty failed:', err);
            Taro.showToast({ title: '加入失败', icon: 'none' });
          }
        }
      }
    });
  };

  const handlePartyClick = (p: Party) => {
    Taro.navigateTo({ url: `/pages/appointment-detail/index?partyId=${p._id}` });
  };

  const handleClub = () => {
    Taro.navigateTo({ url: '/pages/toastmasters/index' });
  };

  const handleVlog = (v: Vlog) => {
    Taro.navigateTo({ url: `/pages/vlog/index?id=${v._id}` });
  };

  const handleMoreParties = () => {
    Taro.switchTab({ url: '/pages/party/index' });
  };

  if (loading && !data) {
    return <View className={styles.loading}>加载中...</View>;
  }

  if (!data) {
    return <View className={styles.loading}>暂无数据</View>;
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.greet}>
          <Text className={styles.greetTitle}>你好，{user?.name || '同学'}</Text>
          <Text className={styles.greetSub}>今天和谁一起练口语？</Text>
        </View>
        <Button className={styles.avatarBtn} onClick={handleAvatar}>
          <Image className={styles.avatar} src={user?.avatar || 'https://picsum.photos/id/64/200/200'} mode="aspectFill" />
        </Button>
      </View>

      <View className={styles.matchCard}>
        <View className={styles.matchBg} />
        <View className={styles.matchBg2} />
        <View className={styles.matchContent}>
          <Text className={styles.matchTitle}>一键匹配语伴</Text>
          <Text className={styles.matchDesc}>智能匹配中外学生，3 秒找到口语练习搭子</Text>
          <View className={styles.matchBtn} onClick={handleMatch}>
            <Text className={styles.matchBtnText}>开始匹配</Text>
          </View>
        </View>
      </View>

      <View className={styles.banner} onClick={handleClub}>
        <View className={styles.bannerIcon}>
          <Text>🎤</Text>
        </View>
        <View className={styles.bannerInfo}>
          <Text className={styles.bannerTitle}>{data.club.name}</Text>
          <Text className={styles.bannerDesc}>{data.club.meetingTime} · {data.club.memberCount} 位成员</Text>
        </View>
        <Text className={styles.bannerArrow}>›</Text>
      </View>

      <View className={styles.section}>
        <SectionHeader title="推荐语伴" subtitle="中外学生互练" actionText="换一批" onAction={loadData} />
        <ScrollView className={styles.partnersScroll} scrollX>
          {data.partners.map((p) => (
            <View key={p.openid} className={styles.partnerItem}>
              <UserCard user={p} actionText="邀请" onAction={() => handleInvite(p)} onClick={() => handleUserClick(p)} />
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.section}>
        <SectionHeader title="热门组局" subtitle="3人即可成局" actionText="查看全部" onAction={handleMoreParties} />
        <View className={styles.partyList}>
          {data.parties.slice(0, 3).map((p) => (
            <View key={p._id} className={styles.partyItem}>
              <PartyCard party={p} onJoin={() => handlePartyJoin(p)} onClick={() => handlePartyClick(p)} />
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <SectionHeader title="口语 Vlog" subtitle="随聊随录" />
        <ScrollView className={styles.vlogScroll} scrollX>
          {data.vlogs.map((v) => (
            <View key={v._id} className={styles.vlogItem} onClick={() => handleVlog(v)}>
              <View className={styles.vlogCover}>
                <Image className={styles.vlogImg} src={v.cover} mode="aspectFill" />
                <Text className={styles.vlogDuration}>{v.duration}</Text>
              </View>
              <Text className={styles.vlogTitle}>{v.title}</Text>
              <Text className={styles.vlogAuthor}>{v.author}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default DiscoverPage;
