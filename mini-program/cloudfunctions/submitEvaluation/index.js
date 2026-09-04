const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const { targetOpenid, appointmentId, dimensions, comment } = event

    if (!targetOpenid || !dimensions) {
      return { code: -1, message: '缺少必填字段', data: null }
    }

    // 获取被评价人信息
    const targetRes = await db.collection('users').where({ _openid: targetOpenid }).limit(1).get()
    const target = targetRes.data[0]

    if (!target) {
      return { code: -1, message: '被评价用户不存在', data: null }
    }

    const evaluation = {
      _openid: openid,
      targetOpenid,
      targetName: target.name,
      targetAvatar: target.avatar,
      appointmentId: appointmentId || '',
      dimensions: {
        civility: dimensions.civility || 0,
        friendliness: dimensions.friendliness || 0,
        punctuality: dimensions.punctuality || 0,
        language: dimensions.language || 0
      },
      comment: comment || '',
      createTime: db.serverDate()
    }

    const addRes = await db.collection('evaluations').add({ data: evaluation })

    // 更新被评价人的信用分（简单策略：取最近评价的平均分 * 20 作为信用分基础）
    try {
      const avgScore = (
        dimensions.civility +
        dimensions.friendliness +
        dimensions.punctuality +
        dimensions.language
      ) / 4
      const newCredit = Math.min(100, Math.round((target.creditScore || 80) * 0.8 + avgScore * 20 * 0.2))
      await db.collection('users').doc(target._id).update({
        data: {
          creditScore: newCredit,
          ratingAvg: avgScore,
          practiceCount: db.command.inc(1)
        }
      })
    } catch (e) {
      console.error('[submitEvaluation] update target failed:', e)
    }

    return {
      code: 0,
      message: 'success',
      data: { evaluation: { ...evaluation, _id: addRes._id } }
    }
  } catch (err) {
    console.error('[submitEvaluation] error:', err)
    return { code: -1, message: err.message || '服务异常', data: null }
  }
}
