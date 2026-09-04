import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import { callFunction } from '@/services/cloud';
import type { Party } from '@/types';
import PartyCard from '@/components/PartyCard';
import EmptyState from '@/components/EmptyState';
import styles from './index.module.scss';

type Filter = 'all' | 'mine';

const PartyPage: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (f: Filter) => {
    try {
      setLoading(true);
      const res = await callFunction<{ parties: Party[] }>('getParties', { filter: f });
      setParties(res.parties);
    } catch (err) {
      console.error('[Party] loadData failed:', err);
      Taro.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(filter);
  }, [filter, loadData]);

  usePullDownRefresh(async () => {
    await loadData(filter);
    Taro.stopPullDownRefresh();
  });

  const handleCreate = () => {
    Taro.navigateTo({ url: '/pages/create-party/index' });
  };

  const handleJoin = async (p: Party) => {
    Taro.showModal({
      title: '加入组局',
      content: `确定加入「${p.title}」吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await callFunction('joinParty', { partyId: p._id });
            Taro.showToast({ title: '加入成功', icon: 'success' });
            loadData(filter);
          } catch (err) {
            console.error('[Party] joinParty failed:', err);
            Taro.showToast({ title: '加入失败', icon: 'none' });
          }
        }
      }
    });
  };

  const handleClick = (p: Party) => {
    Taro.navigateTo({ url: `/pages/appointment-detail/index?partyId=${p._id}` });
  };

  return (
    <View className={styles.container}>
      <View className={styles.filterBar}>
        <View
          className={classnames(styles.filterTab, filter === 'all' && styles.active)}
          onClick={() => setFilter('all')}
        >
          <Text className={styles.filterText}>全部组局</Text>
        </View>
        <View
          className={classnames(styles.filterTab, filter === 'mine' && styles.active)}
          onClick={() => setFilter('mine')}
        >
          <Text className={styles.filterText}>我的组局</Text>
        </View>
        <View className={styles.createBtn} onClick={handleCreate}>
          <Text className={styles.createIcon}>+</Text>
        </View>
      </View>

      {loading ? (
        <View className={styles.loading}>加载中...</View>
      ) : parties.length === 0 ? (
        <EmptyState
          icon="🎉"
          text={filter === 'mine' ? '你还没有创建组局' : '暂无组局'}
          hint={filter === 'mine' ? '点击右上角 + 发起一个吧' : '下拉刷新或创建新组局'}
        />
      ) : (
        <ScrollView scrollY className={styles.list}>
          {parties.map((p) => (
            <View key={p._id} className={styles.partyItem}>
              <PartyCard party={p} onJoin={() => handleJoin(p)} onClick={() => handleClick(p)} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default PartyPage;
