import type { GetMyEventsForSelectParam } from '../../application/params/get_my_events_for_select_param';
export function validateGetMyEventsForSelect(param: GetMyEventsForSelectParam): string | null {
  if (!param.token.trim()) return 'Connectez-vous pour consulter vos événements.';
  
  return null;
}
