const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    // 用户信息
    const userRes = await db.collection('users').where({ _openid: openid }).limit(1).get()
    if (userRes.data.length === 0) {
      return { code: 0, message: 'success', data: { user: null, stats: null, recentEvaluations: [] } }
    }
    const user = userRes.data[0]

    // 统计：预约数、组局数、评价数
    const [appointmentCount, partyCount, evaluationCount] = await Promise.all([
      db.collection('appointments').where({ _openid: openid }).count().catch(() => ({ total: 0 })),
      db.collection('parties').where({ members: _.elemMatch({ openid }) }).count().catch(() => ({ total: 0 })),
      db.collection('evaluations').where({ targetOpenid: openid }).count().catch(() => ({ total: 0 }))
    ])

    // 评分维度汇总（取最近评价的平均值）
    const evalRes = await db.collection('evaluations')
      .where({ targetOpenid: openid })
      .orderBy('createTime', 'desc')
      .limit(20)
      .get()
      .catch(() => ({ data: [] }))

    let ratingSummary = { civility: 0, friendliness: 0, punctuality: 0, language: 0 }
    if (evalRes.data.length > 0) {
      const sum = evalRes.data.reduce((acc, e) => {
        const d = e.dimensions || {}
        return {
          civility: acc.civility + (d.civility || 0),
          friendliness: acc.friendliness + (d.friendliness || 0),
          punctuality: acc.punctuality + (d.punctuality || 0),
          language: acc.language + (d.language || 0)
        }
      }, ratingSummary)
      const n = evalRes.data.length
      ratingSummary = {
        civility: +(sum.civility / n).toFixed(1),
        friendliness: +(sum.friendliness / n).toFixed(1),
        punctuality: +(sum.punctuality / n).toFixed(1),
        language: +(sum.language / n).toFixed(1)
      }
    }

    // 最近评价（我发出的）
    const myEvals = await db.collection('evaluations')
      .where({ _openid: openid })
      .orderBy('createTime', 'desc')
      .limit(5)
      .get()
      .catch(() => ({ data: [] }))

    return {
      code: 0,
      message: 'success',
      data: {
        user,
        stats: {
          ratingSummary,
          appointmentCount: appointmentCount.total,
          partyCount: partyCount.total,
          evaluationCount: evaluationCount.total
        },
        recentEvaluations: myEvals.data
      }
    }
  } catch (err) {
    console.error('[getMyProfile] error:', err)
    return { code: -1, message: err.message || '服务异常', data: null }
  }
}
