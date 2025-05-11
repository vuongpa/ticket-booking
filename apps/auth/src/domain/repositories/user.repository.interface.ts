import { User } from '../models/user.model';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;

  // New password management methods
  setPassword(userId: string, plainPassword: string): Promise<void>;
  verifyPassword(userId: string, plainPassword: string): Promise<boolean>;
}
