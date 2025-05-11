import { AggregateRoot } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../events/user-created.event';

export class User extends AggregateRoot {
  private readonly id: string;
  private email: string;
  private password: string;
  private firstName: string;
  private lastName: string;
  private isActive: boolean;
  private memberId: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    memberId: string,
  ) {
    super();
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.memberId = memberId;
    this.isActive = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Domain methods
  public static create(
    id: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    memberId: string,
  ): User {
    const user = new User(id, email, password, firstName, lastName, memberId);
    user.apply(new UserCreatedEvent(id, email));
    return user;
  }

  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public updateProfile(firstName: string, lastName: string): void {
    this.firstName = firstName;
    this.lastName = lastName;
    this.updatedAt = new Date();
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getMemberId(): string {
    return this.memberId;
  }

  public getPassword(): string {
    return this.password;
  }

  public isUserActive(): boolean {
    return this.isActive;
  }
}
