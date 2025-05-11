import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User as UserEntity } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async save(user: UserEntity): Promise<void> {
    const hashedPassword = await bcrypt.hash(user.getPassword(), 10);
    const userModel = new this.userModel({
      _id: user.getId(),
      email: user.getEmail(),
      password: hashedPassword,
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      isActive: user.isUserActive(),
    });
    await userModel.save();
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    return this.mapToEntity(user);
  }

  private mapToEntity(document: UserDocument): UserEntity {
    return UserEntity.create(
      document._id,
      document.email,
      document.password,
      document.firstName,
      document.lastName,
      document.memberId,
    );
  }
}
