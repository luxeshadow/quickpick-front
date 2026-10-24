import type { UpdateEventStatusParam } from '../../application/params/update_event_status_param';

export function validateUpdateEventStatus(param: UpdateEventStatusParam): string | null {
  if (!param.token.trim()) return 'Connectez-vous pour modifier cet événement.';
  if (!Number.isInteger(param.id) || param.id < 1) return 'L’événement est invalide.';
  if (!['active', 'inactive'].includes(param.status)) return 'Le statut doit être active ou inactive.';
  return null;
}
