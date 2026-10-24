import type { ShowEventParam } from '../../application/params/show_event_param';
export function validateShowEvent(param: ShowEventParam): string | null {
  if (!param.token.trim()) return 'Connectez-vous pour consulter vos événements.';
  if (!Number.isInteger(param.id) || param.id < 1) return 'L’événement est invalide.';
  return null;
}
