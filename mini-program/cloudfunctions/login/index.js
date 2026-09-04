const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    // 查询用户是否已注册
    const userRes = await db.collection('users').where({ _openid: openid }).limit(1).get()
    const isRegistered = userRes.data.length > 0
    const user = isRegistered ? userRes.data[0] : null

    return {
      code: 0,
      message: 'success',
      data: { openid, isRegistered, user }
    }
  } catch (err) {
    console.error('[login] error:', err)
    return { code: -1, message: err.message || '服务异常', data: null }
  }
}
