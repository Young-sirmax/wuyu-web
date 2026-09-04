import type { Evaluation } from '@/types';

export default function (data?: Record<string, unknown>): { evaluation: Evaluation } {
  const params = (data || {}) as Record<string, unknown>;
  const dimensions = (params.dimensions as Evaluation['dimensions']) || {
    civility: 5,
    friendliness: 5,
    punctuality: 5,
    language: 5
  };
  const evaluation: Evaluation = {
    _id: 'e_new_' + Date.now(),
    targetName: (params.targetName as string) || '王思琪',
    targetAvatar: (params.targetAvatar as string) || 'https://picsum.photos/id/1027/200/200',
    appointmentId: (params.appointmentId as string) || 'a_010',
    dimensions,
    comment: (params.comment as string) || '',
    createTime: new Date().toISOString()
  };
  return { evaluation };
}
