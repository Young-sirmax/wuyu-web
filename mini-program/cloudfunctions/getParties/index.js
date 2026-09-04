const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const filter = event.filter || 'all'

    let query = db.collection('parties')
    if (filter === 'mine') {
      // 我创建或我加入的组局
      query = query.where({
        members: _.elemMatch({ openid: openid })
      })
    } else {
      query = query.where({ status: _.in(['recruiting', 'full']) })
    }

    const res = await query.orderBy('createTime', 'desc').limit(20).get().catch(() => ({ data: [] }))

    return { code: 0, message: 'success', data: { parties: res.data } }
  } catch (err) {
    console.error('[getParties] error:', err)
    return { code: -1, message: err.message || '服务异常', data: null }
  }
}
