import { AggregateRoot } from '@nestjs/cqrs';

export enum OtpType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PHONE_VERIFICATION = 'PHONE_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export class User extends AggregateRoot {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id?: string;
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
  }) {
    super();
    this.id = params.id || '';
    this.email = params.email;
    this.password = params.password;
    this.fullName = params.fullName;
    this.phoneNumber = params.phoneNumber;
    this.emailVerified = params.emailVerified ?? false;
    this.phoneVerified = params.phoneVerified ?? false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
