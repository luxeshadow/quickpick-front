export class ApiRoutes {
  // Authentification
  static readonly login = '/api/auth/login';
  static readonly register = '/api/auth/register';
  static readonly loginByGoogle = '/api/auth/login/google';
  static readonly logout = '/api/auth/logout';

  // Vérification OTP
  static readonly verifyOtp = '/api/auth/verify-otp';
  static readonly resendOtp = '/api/auth/resend-otp';

  // Réinitialisation du mot de passe
  static readonly forgotPassword = '/api/auth/forgot-password';
  static readonly resetPassword = '/api/auth/reset-password';

  // Mes événements
  static readonly myEventsForSelect = '/api/events/options';
  static readonly showEvent = '/api/events';
  static readonly myEvents = '/api/events';
  static readonly myEventsByStatus = '/api/events/status';
  static readonly searchMyEvents = '/api/events/search';
  static readonly createEvent = '/api/events';
  static readonly updateEvent = '/api/events';

  // Utilisateurs
  static readonly myProfile = '/api/users/me';
  static readonly myStats = '/api/users/me/stats';
  static readonly users = '/api/users';
  static readonly searchUsers = '/api/users/search';

  // Liens d’accès
  static readonly eventAccessLinks = '/api/events/{event_id}/access-links';
  static readonly accessLink = '/api/access-links/{link_id}';
  static readonly publicAccessLink = '/api/public/access-links/{token}';
  static readonly publicAccessLinkMedia = '/api/public/access-links/{token}/media';

  static readonly publicGuestScans = '/api/public/access-links/{token}/guest-scans';
  static readonly publicMediaDownloads = '/api/public/access-links/{token}/downloads';

  // Médias
  static readonly uploadMedia = '/api/events';

  // Abonnement
  static readonly subscriptionPlans = '/api/subscription-plans';
  static readonly currentSubscription = '/api/subscriptions/current';
}
