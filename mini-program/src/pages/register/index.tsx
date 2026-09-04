import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { callFunction } from '@/services/cloud';
import { useUserStore } from '@/store/useUserStore';
import { LANGUAGES, SCHOOLS } from '@/constants';
import type { UserRole, LangCode, SchoolCode, User } from '@/types';
import styles from './index.module.scss';

const RegisterPage: React.FC = () => {
  const setUser = useUserStore((s) => s.setUser);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentId, setStudentId] = useState('');
  const [role, setRole] = useState<UserRole>('chinese');
  const [school, setSchool] = useState<SchoolCode>('current');
  const [nativeLang, setNativeLang] = useState<LangCode>('zh');
  const [learnLangs, setLearnLangs] = useState<LangCode[]>(['en']);
  const [submitting, setSubmitting] = useState(false);

  const toggleLearnLang = (code: LangCode) => {
    setLearnLangs((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  };

  const validate = (): string | null => {
    if (!name.trim()) return '请输入姓名';
    if (!/^1\d{10}$/.test(phone)) return '请输入正确的手机号';
    if (!studentId.trim()) return '请输入学号';
    if (learnLangs.length === 0) return '请选择至少一门学习语言';
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
      const res = await callFunction<{ user: User }>('register', {
        name,
        phone,
        studentId,
        role,
        school,
        nativeLang,
        learnLangs
      });
      setUser(res.user);
      Taro.showToast({ title: '注册成功', icon: 'success' });
      setTimeout(() => Taro.navigateBack(), 1200);
    } catch (e) {
      console.error('[Register] submit failed:', e);
      Taro.showToast({ title: '注册失败，请重试', icon: 'none' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>欢迎来到胡说</Text>
        <Text className={styles.subtitle}>输入姓名 + 电话 + 学号，即可注册</Text>
      </View>

      <View className={styles.formGroup}>
        <Text className={classnames(styles.label, styles.required)}>姓名</Text>
        <Input
          className={styles.input}
          placeholder="请输入真实姓名"
          value={name}
          onInput={(e) => setName(e.detail.value)}
          maxlength={20}
        />
      </View>

      <View className={styles.formGroup}>
        <Text className={classnames(styles.label, styles.required)}>手机号</Text>
        <Input
          className={styles.input}
          type="number"
          placeholder="请输入11位手机号"
          value={phone}
          onInput={(e) => setPhone(e.detail.value)}
          maxlength={11}
        />
      </View>

      <View className={styles.formGroup}>
        <Text className={classnames(styles.label, styles.required)}>学号</Text>
        <Input
          className={styles.input}
          placeholder="请输入学号"
          value={studentId}
          onInput={(e) => setStudentId(e.detail.value)}
          maxlength={20}
        />
      </View>

      <View className={styles.formGroup}>
        <Text className={styles.label}>身份</Text>
        <View className={styles.roleRow}>
          <View
            className={classnames(styles.roleOption, role === 'chinese' && styles.active)}
            onClick={() => setRole('chinese')}
          >
            <Text className={styles.roleIcon}>🇨🇳</Text>
            <Text className={styles.roleName}>中国学生</Text>
          </View>
          <View
            className={classnames(styles.roleOption, role === 'international' && styles.active)}
            onClick={() => {
              setRole('international');
              setNativeLang('en');
            }}
          >
            <Text className={styles.roleIcon}>🌏</Text>
            <Text className={styles.roleName}>留学生</Text>
          </View>
        </View>
      </View>

      <View className={styles.formGroup}>
        <Text className={styles.label}>学校</Text>
        <View className={styles.roleRow}>
          {SCHOOLS.map((s) => (
            <View
              key={s.code}
              className={classnames(styles.roleOption, school === s.code && styles.active)}
              onClick={() => setSchool(s.code)}
            >
              <Text className={styles.roleIcon}>🎓</Text>
              <Text className={styles.roleName}>{s.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.formGroup}>
        <Text className={styles.label}>母语</Text>
        <View className={styles.langGrid}>
          {LANGUAGES.map((l) => (
            <View
              key={l.code}
              className={classnames(styles.langChip, nativeLang === l.code && styles.active)}
              onClick={() => setNativeLang(l.code)}
            >
              <Text className={styles.langFlag}>{l.flag}</Text>
              <Text className={styles.langText}>{l.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.formGroup}>
        <Text className={classnames(styles.label, styles.required)}>想练习的语言（可多选）</Text>
        <View className={styles.langGrid}>
          {LANGUAGES.filter((l) => l.code !== nativeLang).map((l) => (
            <View
              key={l.code}
              className={classnames(styles.langChip, learnLangs.includes(l.code) && styles.active)}
              onClick={() => toggleLearnLang(l.code)}
            >
              <Text className={styles.langFlag}>{l.flag}</Text>
              <Text className={styles.langText}>{l.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <Button
        className={classnames(styles.submitBtn, submitting && styles.disabled)}
        onClick={handleSubmit}
        disabled={submitting}
      >
        <Text className={styles.submitText}>{submitting ? '提交中...' : '完成注册'}</Text>
      </Button>
      <Text className={styles.tip}>注册即代表同意《胡说用户协议》</Text>
    </View>
  );
};

export default RegisterPage;
