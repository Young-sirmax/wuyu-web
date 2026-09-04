const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    const res = await db.collection('messages')
      .where({ _openid: openid })
      .orderBy('createTime', 'desc')
      .limit(50)
      .get()
      .catch(() => ({ data: [] }))

    return { code: 0, message: 'success', data: { messages: res.data } }
  } catch (err) {
    console.error('[getMessages] error:', err)
    return { code: -1, message: err.message || '服务异常', data: null }
  }
}
