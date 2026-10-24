import type { DirectMediaUploadParam } from '../../application/params/direct_media_upload_param';

export function validateDirectMediaUpload(param: DirectMediaUploadParam): string | null {
  if (!param.token.trim()) return 'Veuillez vous connecter.';
  if (!Number.isInteger(param.eventId) || param.eventId < 1) return 'Choisissez un événement.';
  if (!param.files.length) return 'Sélectionnez au moins un fichier.';
  if (param.files.length > 1000) return 'Vous pouvez envoyer au maximum 1000 fichiers à la fois.';
  for (const file of param.files) {
    if (!['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'].includes(file.type)) {
      return 'Seuls les fichiers JPEG, PNG, WebP, MP4, MOV et WebM sont acceptés.';
    }
    if (file.type.startsWith('image/') && file.size > 26214400) return 'Chaque image doit peser au maximum 25 Mo.';
    if (file.size > 524288000) return 'Chaque fichier doit peser au maximum 500 Mo.';
  }
  return null;
}
