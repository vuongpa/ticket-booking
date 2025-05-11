import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/models/user.model';
import { UserServiceClient } from '../clients/user-service.client';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

// In-memory map to store hashed passwords indexed by user ID
// In a production system, this should be stored in a secure database
const TEMPORARY_PASSWORD_STORE = new Map<string, string>();

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly userServiceClient: UserServiceClient) {}

  async findById(id: string): Promise<User | null> {
    try {
      const userRecord = await this.userServiceClient.getUser(id);

      if (!userRecord) {
        return null;
      }

      return this.mapToUser(userRecord);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      // Note: We need to implement a findByEmail method in the users-service
      // For now, we'll assume the user service has this capability
      // This might need to be adjusted based on actual implementation
      const userRecord = await this.userServiceClient.findByEmail(email);

      if (!userRecord) {
        return null;
      }

      return this.mapToUser(userRecord);
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  async create(user: User): Promise<User> {
    try {
      // Generate a UUID if id is not provided
      if (!user.id) {
        user.id = uuidv4();
      }

      // Store the password separately
      TEMPORARY_PASSWORD_STORE.set(user.id, user.password);

      // Split fullName into firstName and lastName for user service
      const names = user.fullName.split(' ');
      const firstName = names[0];
      const lastName = names.length > 1 ? names.slice(1).join(' ') : '';

      // Create user in the users-service
      const createdUser = await this.userServiceClient.createUser({
        id: user.id,
        email: user.email,
        firstName,
        lastName,
      });

      return this.mapToUser(createdUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(user: User): Promise<User> {
    try {
      // If password was changed, update it in our storage
      if (user.password) {
        TEMPORARY_PASSWORD_STORE.set(user.id, user.password);
      }

      // Split fullName into firstName and lastName for user service
      const names = user.fullName.split(' ');
      const firstName = names[0];
      const lastName = names.length > 1 ? names.slice(1).join(' ') : '';

      // Update user in the users-service
      const updatedUser = await this.userServiceClient.updateUser(user.id, {
        email: user.email,
        firstName,
        lastName,
      });

      return this.mapToUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Clean up password storage
      TEMPORARY_PASSWORD_STORE.delete(id);

      // Implement deleteUser in the UserServiceClient if needed
      await this.userServiceClient.deleteUser(id);
      return true;
    } catch {
      return false;
    }
  }

  // Password management methods
  async setPassword(userId: string, plainPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    TEMPORARY_PASSWORD_STORE.set(userId, hashedPassword);
  }

  async verifyPassword(
    userId: string,
    plainPassword: string,
  ): Promise<boolean> {
    const hashedPassword = TEMPORARY_PASSWORD_STORE.get(userId);
    if (!hashedPassword) {
      return false;
    }

    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private mapToUser(userRecord: any): User {
    // Create a new User instance from the user service response
    const user = new User({
      id: userRecord.id,
      email: userRecord.email,
      // Retrieve password from separate storage if available
      password: TEMPORARY_PASSWORD_STORE.get(userRecord.id) || '',
      fullName: `${userRecord.firstName} ${userRecord.lastName}`.trim(),
      emailVerified: true, // Set default values or get from another source
      phoneVerified: false,
    });

    return user;
  }
}
