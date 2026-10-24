import type { User } from '../../domain/entities/user';

export class UserModel implements User {
  readonly id: number;
  readonly full_name: string;
  readonly email: string;
  readonly phone: string | null;
  readonly status: string;
  readonly registered_at: string;
  readonly email_verified_at: string | null;
  readonly roles?: User['roles'];
  readonly current_subscription?: User['current_subscription'];
  readonly statistics?: User['statistics'];
  readonly subscriptions?: User['subscriptions'];
  readonly payments?: User['payments'];
  readonly events?: User['events'];

  constructor(user: User) {
    this.id = user.id;
    this.full_name = user.full_name;
    this.email = user.email;
    this.phone = user.phone;
    this.status = user.status;
    this.registered_at = user.registered_at;
    this.email_verified_at = user.email_verified_at;
    this.roles = user.roles;
    this.current_subscription = user.current_subscription;
    this.statistics = user.statistics;
    this.subscriptions = user.subscriptions;
    this.payments = user.payments;
    this.events = user.events;
  }

  static fromJson(json: User): UserModel {
    return new UserModel({
      id: json.id,
      full_name: json.full_name,
      email: json.email,
      phone: json.phone,
      status: json.status,
      registered_at: json.registered_at,
      email_verified_at: json.email_verified_at,
      roles: json.roles,
      current_subscription: json.current_subscription,
      statistics: json.statistics,
      subscriptions: json.subscriptions,
      payments: json.payments,
      events: json.events,
    });
  }

  toJson(): User {
    return this.toEntity();
  }

  toEntity(): User {
    return {
      id: this.id,
      full_name: this.full_name,
      email: this.email,
      phone: this.phone,
      status: this.status,
      registered_at: this.registered_at,
      email_verified_at: this.email_verified_at,
      roles: this.roles,
      current_subscription: this.current_subscription,
      statistics: this.statistics,
      subscriptions: this.subscriptions,
      payments: this.payments,
      events: this.events,
    };
  }
}
