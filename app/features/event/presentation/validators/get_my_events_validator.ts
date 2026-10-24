import type { GetMyEventsParam } from '../../application/params/get_my_events_param';
export function validateGetMyEvents(param: GetMyEventsParam): string | null {
  if (!param.token.trim()) return 'Connectez-vous pour consulter vos événements.';
  if (!Number.isInteger(param.page) || param.page < 1) return 'La page est invalide.';
  return null;
}
