import type { SearchMyEventsParam } from '../../application/params/search_my_events_param';
export function validateSearchMyEvents(param: SearchMyEventsParam): string | null {
  if (!param.token.trim()) return 'Connectez-vous pour consulter vos événements.';
  if (!Number.isInteger(param.page) || param.page < 1) return 'La page est invalide.';
  if (!param.search.trim()) return 'Le texte à rechercher est obligatoire.';
  if (param.search.trim().length > 255) return 'La recherche ne doit pas dépasser 255 caractères.';
  return null;
}
