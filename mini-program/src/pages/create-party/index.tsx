import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { callFunction } from '@/services/cloud';
import { LANGUAGES } from '@/constants';
import type { LangCode, Party } from '@/types';
import styles from './index.module.scss';

const CreatePartyPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<LangCode>('en');
  const [maxMembers, setMaxMembers] = useState(3);
  const [location, setLocation] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = (): string | null => {
    if (!title.trim()) return '请输入组局标题';
    if (!topic.trim()) return '请输入讨论话题';
    if (!location.trim()) return '请输入活动地点';
    if (!scheduledTime) return '请选择时间';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      Taro.showToast({ title: err, icon: 'none' });
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      const isoTime = new Date(scheduledTime).toISOString();
      await callFunction<{ party: Party }>('createParty', {
        title,
        topic,
        language,
        maxMembers,
        location,
        scheduledTime: isoTime
      });
      Taro.showToast({ title: '创建成功', icon: 'success' });
      setTimeout(() => Taro.navigateBack(), 1200);
    } catch (e) {
      console.error('[CreateParty] submit failed:', e);
      Taro.showToast({ title: '创建失败，请重试', icon: 'none' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.tipCard}>
        <Text className={styles.tipIcon}>💡</Text>
        <Text className={styles.tipText}>3 人即可成局，组局后可在消息中收到报名通知</Text>
      </View>

      <View className={styles.formGroup}>
        <Text className={classnames(styles.label, styles.required)}>组局标题</Text>
        <Input
          className={styles.input}
          placeholder="例如：周末英语角 · 自由话题"
          value={title}
          onInput={(e) => setTitle(e.detail.value)}
          maxlength={30}
        />
      </View>

      <View className={styles.formGroup}>
        <Text className={classnames(styles.label, styles.required)}>讨论话题</Text>
        <Textarea
          className={styles.textarea}
          placeholder="聊聊你们要讨论的内容，方便匹配同好"
          value={topic}
          onInput={(e) => setTopic(e.detail.value)}
          maxlength={100}
        />
      </View>

      <View className={styles.formGroup}>
        <Text className={styles.label}>练习语言</Text>
        <View className={styles.langGrid}>
          {LANGUAGES.map((l) => (
            <View
              key={l.code}
              className={classnames(styles.langChip, language === l.code && styles.active)}
              onClick={() => setLanguage(l.code)}
            >
              <Text className={styles.langFlag}>{l.flag}</Text>
              <Text className={styles.langText}>{l.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.formGroup}>
        <Text className={styles.label}>人数上限</Text>
        <View className={styles.sizeRow}>
          {[3, 4, 5].map((n) => (
            <View
              key={n}
              className={classnames(styles.sizeOption, maxMembers === n && styles.active)}
              onClick={() => setMaxMembers(n)}
            >
              <Text className={styles.sizeNum}>{n}</Text>
              <Text className={styles.sizeLabel}>人</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.formGroup}>
        <Text className={classnames(styles.label, styles.required)}>活动时间</Text>
        <Input
          className={styles.input}
          placeholder="YYYY-MM-DD HH:mm"
          value={scheduledTime}
          onInput={(e) => setScheduledTime(e.detail.value)}
        />
      </View>

      <View className={styles.formGroup}>
        <Text className={classnames(styles.label, styles.required)}>活动地点</Text>
        <Input
          className={styles.input}
          placeholder="例如：图书馆三楼研讨室A"
          value={location}
          onInput={(e) => setLocation(e.detail.value)}
          maxlength={30}
        />
      </View>

      <Button
        className={classnames(styles.submitBtn, submitting && styles.disabled)}
        onClick={handleSubmit}
        disabled={submitting}
      >
        <Text className={styles.submitText}>{submitting ? '创建中...' : '发起组局'}</Text>
      </Button>
    </View>
  );
};

export default CreatePartyPage;
