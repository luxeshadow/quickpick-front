import type { CreateEventParam } from '../../application/params/create_event_param';

export function validateCreateEvent(param: CreateEventParam): string | null {
  if (!param.name.trim()) return 'Le nom de l’événement est obligatoire.';
  if (param.name.trim().length > 255) return 'Le nom de l’événement ne doit pas dépasser 255 caractères.';
  if (param.location && param.location.trim().length > 255) return 'Le lieu ne doit pas dépasser 255 caractères.';
  if (param.event_date && Number.isNaN(Date.parse(param.event_date))) return 'La date de l’événement doit être une date valide.';
  if (!param.token.trim()) return 'Connectez-vous pour créer un événement.';
  return null;
}
