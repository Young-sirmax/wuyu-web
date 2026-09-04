import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface RatingStarsProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (val: number) => void;
}

const sizeMap = { sm: 24, md: 32, lg: 40 };

const RatingStars: React.FC<RatingStarsProps> = ({ value, size = 'md', showValue = false, interactive = false, onChange }) => {
  const starSize = sizeMap[size];
  const display = interactive ? Math.round(value) : value;
  const stars = interactive ? [1, 2, 3, 4, 5] : [];

  const handleClick = (val: number) => {
    if (interactive && onChange) {
      onChange(val);
    }
  };

  if (interactive) {
    return (
      <View className={styles.wrap}>
        {stars.map((s) => (
          <Text
            key={s}
            className={classnames(styles.star, styles[size], s <= display && styles.active)}
            style={{ fontSize: `${starSize}rpx` }}
            onClick={() => handleClick(s)}
          >
            ★
          </Text>
        ))}
      </View>
    );
  }

  return (
    <View className={styles.wrap}>
      <View className={styles.starsStatic}>
        {[1, 2, 3, 4, 5].map((s) => {
          const fill = Math.max(0, Math.min(1, display - (s - 1)));
          return (
            <View key={s} className={styles.starBox} style={{ width: `${starSize}rpx`, height: `${starSize}rpx` }}>
              <Text className={classnames(styles.star, styles.empty, styles[size])} style={{ fontSize: `${starSize}rpx` }}>★</Text>
              <View className={styles.starFill} style={{ width: `${fill * 100}%` }}>
                <Text className={classnames(styles.star, styles.active, styles[size])} style={{ fontSize: `${starSize}rpx` }}>★</Text>
              </View>
            </View>
          );
        })}
      </View>
      {showValue ? <Text className={styles.value}>{display.toFixed(1)}</Text> : null}
    </View>
  );
};

export default RatingStars;
