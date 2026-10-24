import type { GetMyEventsByStatusParam } from '../../application/params/get_my_events_by_status_param';
export function validateGetMyEventsByStatus(param: GetMyEventsByStatusParam): string | null {
  if (!param.token.trim()) return 'Connectez-vous pour consulter vos événements.';
  if (!['active', 'inactive'].includes(param.status)) return 'Le statut est invalide.';
  if (!Number.isInteger(param.page) || param.page < 1) return 'La page est invalide.';
  return null;
}
