const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    // 推荐语伴：取最近注册的在线用户（排除自己）
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    const partnersRes = await db.collection('users')
      .where({ _openid: _.neq(openid), isOnline: true })
      .orderBy('practiceCount', 'desc')
      .limit(6)
      .get()
      .catch(() => ({ data: [] }))

    // 活跃组局：招募中
    const partiesRes = await db.collection('parties')
      .where({ status: 'recruiting' })
      .orderBy('createTime', 'desc')
      .limit(3)
      .get()
      .catch(() => ({ data: [] }))

    // 头马俱乐部信息
    const clubRes = await db.collection('toastmasters_clubs')
      .limit(1)
      .get()
      .catch(() => ({ data: [] }))

    // Vlog 列表
    const vlogsRes = await db.collection('vlogs')
      .orderBy('createTime', 'desc')
      .limit(6)
      .get()
      .catch(() => ({ data: [] }))

    return {
      code: 0,
      message: 'success',
      data: {
        partners: partnersRes.data,
        parties: partiesRes.data,
        club: clubRes.data[0] || null,
        vlogs: vlogsRes.data
      }
    }
  } catch (err) {
    console.error('[getDiscoverData] error:', err)
    return { code: -1, message: err.message || '服务异常', data: null }
  }
}
