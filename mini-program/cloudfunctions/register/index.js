const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const { name, phone, studentId, school, role, nativeLang, learnLangs } = event

    if (!name || !phone || !studentId) {
      return { code: -1, message: '缺少必填字段', data: null }
    }

    // 检查是否已注册
    const existRes = await db.collection('users').where({ _openid: openid }).limit(1).get()
    if (existRes.data.length > 0) {
      // 已注册，更新信息
      await db.collection('users').doc(existRes.data[0]._id).update({
        data: {
          name, phone, studentId, school, role,
          nativeLang, learnLangs,
          updateTime: db.serverDate()
        }
      })
      return { code: 0, message: 'success', data: { user: { ...existRes.data[0], name, phone, studentId, school, role, nativeLang, learnLangs } } }
    }

    const schoolNameMap = { current: '本校', cupl: '中国政法大学' }
    const userRecord = {
      _openid: openid,
      name,
      phone,
      studentId,
      school: school || 'current',
      schoolName: schoolNameMap[school] || '本校',
      role: role || 'chinese',
      avatar: '',
      nativeLang: nativeLang || 'zh',
      learnLangs: learnLangs || ['en'],
      bio: '欢迎来到胡说，让我们一起练口语吧！',
      creditScore: 80,
      practiceCount: 0,
      ratingAvg: 0,
      isOnline: true,
      createTime: db.serverDate()
    }

    await db.collection('users').add({ data: userRecord })

    return {
      code: 0,
      message: 'success',
      data: { user: { ...userRecord, openid } }
    }
  } catch (err) {
    console.error('[register] error:', err)
    return { code: -1, message: err.message || '服务异常', data: null }
  }
}
