const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const { title, topic, language, maxMembers, location, scheduledTime } = event

    if (!title || !topic) {
      return { code: -1, message: '缺少必填字段', data: null }
    }

    // 获取用户信息作为房主
    const userRes = await db.collection('users').where({ _openid: openid }).limit(1).get()
    if (userRes.data.length === 0) {
      return { code: -1, message: '请先完成注册', data: null }
    }
    const host = userRes.data[0]

    const party = {
      title,
      topic,
      language: language || 'en',
      school: host.school || 'current',
      schoolName: host.schoolName || '本校',
      host: {
        openid: openid,
        name: host.name,
        avatar: host.avatar,
        role: host.role,
        isHost: true
      },
      members: [{
        openid: openid,
        name: host.name,
        avatar: host.avatar,
        role: host.role,
        isHost: true
      }],
      maxMembers: maxMembers || 3,
      status: 'recruiting',
      scheduledTime: scheduledTime || null,
      location: location || '待定',
      createTime: db.serverDate()
    }

    const addRes = await db.collection('parties').add({ data: party })

    return {
      code: 0,
      message: 'success',
      data: { party: { ...party, _id: addRes._id } }
    }
  } catch (err) {
    console.error('[createParty] error:', err)
    return { code: -1, message: err.message || '服务异常', data: null }
  }
}
