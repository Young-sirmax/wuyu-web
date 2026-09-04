import React, { useState, useMemo } from 'react';
import { View, Text, Image, Textarea, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { callFunction } from '@/services/cloud';
import { EVALUATION_DIMENSIONS } from '@/constants';
import type { EvaluationDimensions } from '@/types';
import RatingStars from '@/components/RatingStars';
import styles from './index.module.scss';

const EvaluationPage: React.FC = () => {
  const router = useRouter();
  const appointmentId = router.params.appointmentId || '';
  const targetOpenid = router.params.targetOpenid || '';

  const [dimensions, setDimensions] = useState<EvaluationDimensions>({
    civility: 0,
    friendliness: 0,
    punctuality: 0,
    language: 0
  });
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const overall = useMemo(() => {
    const vals = Object.values(dimensions);
    const filled = vals.filter((v) => v > 0);
    if (filled.length === 0) return 0;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [dimensions]);

  const handleStar = (key: keyof EvaluationDimensions, val: number) => {
    setDimensions((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async () => {
    const empty = Object.entries(dimensions).find(([, v]) => v === 0);
    if (empty) {
      Taro.showToast({ title: '请完成所有维度评分', icon: 'none' });
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      await callFunction('submitEvaluation', {
        appointmentId,
        targetOpenid,
        targetName: '王思琪',
        targetAvatar: 'https://picsum.photos/id/1027/200/200',
        dimensions,
        comment
      });
      Taro.showToast({ title: '评价已提交', icon: 'success' });
      setTimeout(() => Taro.navigateBack(), 1200);
    } catch (e) {
      console.error('[Evaluation] submit failed:', e);
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.targetCard}>
        <Image className={styles.avatar} src="https://picsum.photos/id/1027/200/200" mode="aspectFill" />
        <View className={styles.targetInfo}>
          <Text className={styles.targetName}>王思琪</Text>
          <Text className={styles.targetHint}>本次练习对象 · 请如实互评</Text>
        </View>
      </View>

      <View className={styles.overallCard}>
        <Text className={styles.overallScore}>{overall.toFixed(1)}</Text>
        <Text className={styles.overallLabel}>综合评分</Text>
      </View>

      <View className={styles.dimSection}>
        <Text className={styles.sectionTitle}>维度评分</Text>
        <View className={styles.dimList}>
          {EVALUATION_DIMENSIONS.map((d) => (
            <View key={d.key} className={styles.dimItem}>
              <View className={styles.dimLeft}>
                <Text className={styles.dimIcon}>{d.icon}</Text>
                <View>
                  <Text className={styles.dimName}>{d.label}</Text>
                  <Text className={styles.dimHint}>{d.hint}</Text>
                </View>
              </View>
              <RatingStars
                value={dimensions[d.key]}
                size="lg"
                interactive
                onChange={(val) => handleStar(d.key, val)}
              />
            </View>
          ))}
        </View>
      </View>

      <View className={styles.commentSection}>
        <Text className={styles.sectionTitle}>文字评价</Text>
        <Textarea
          className={styles.textarea}
          placeholder="留下你的真实感受，帮助对方进步（选填）"
          value={comment}
          onInput={(e) => setComment(e.detail.value)}
          maxlength={200}
        />
        <Text className={styles.charCount}>{comment.length}/200</Text>
      </View>

      <Button
        className={classnames(styles.submitBtn, submitting && styles.disabled)}
        onClick={handleSubmit}
        disabled={submitting}
      >
        <Text className={styles.submitText}>{submitting ? '提交中...' : '提交互评'}</Text>
      </Button>
    </View>
  );
};

export default EvaluationPage;
