import type { User } from '../../domain/entities/user';

export interface UserJson {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
}

export class UserModel implements User {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone?: string | null;

  constructor(user: User) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.phone = user.phone;
  }

  static fromJson(json: UserJson): UserModel {
    return new UserModel({
      id: json.id,
      fullName: json.fullName,
      email: json.email,
      phone: json.phone,
    });
  }

  toJson(): UserJson {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
    };
  }

  toEntity(): User {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
    };
  }
}
