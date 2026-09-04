const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const { partyId } = event

    if (!partyId) {
      return { code: -1, message: '缺少 partyId', data: null }
    }

    const partyRes = await db.collection('parties').doc(partyId).get()
    const party = partyRes.data

    if (!party) {
      return { code: -1, message: '组局不存在', data: null }
    }

    if (party.members.some((m) => m.openid === openid)) {
      return { code: -1, message: '你已加入该组局', data: null }
    }

    if (party.members.length >= party.maxMembers) {
      return { code: -1, message: '组局已满员', data: null }
    }

    const userRes = await db.collection('users').where({ _openid: openid }).limit(1).get()
    if (userRes.data.length === 0) {
      return { code: -1, message: '请先完成注册', data: null }
    }
    const user = userRes.data[0]

    const newMember = {
      openid: openid,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      isHost: false
    }

    const newMembers = [...party.members, newMember]
    const newStatus = newMembers.length >= party.maxMembers ? 'full' : 'recruiting'

    await db.collection('parties').doc(partyId).update({
      data: {
        members: newMembers,
        status: newStatus
      }
    })

    return {
      code: 0,
      message: 'success',
      data: { party: { ...party, members: newMembers, status: newStatus } }
    }
  } catch (err) {
    console.error('[joinParty] error:', err)
    return { code: -1, message: err.message || '服务异常', data: null }
  }
}
