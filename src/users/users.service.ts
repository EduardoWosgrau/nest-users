import { Model } from 'mongoose';
import {
  Logger,
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { MongoServerError } from 'mongodb';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private toUserDto(user: UserDocument): UserDto {
    return plainToInstance(UserDto, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
      addresses: user.addresses.map((address) => ({
        street: address.street,
        number: address.number,
        complement: address.complement,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      })),
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      this.logger.log(
        'Creating user with data: ' + JSON.stringify(createUserDto),
      );
      const createdUser = new this.userModel(createUserDto);
      const savedUser = await createdUser.save();
      this.logger.log('User created successfully with ID: ' + savedUser._id);
      return this.toUserDto(savedUser);
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        this.logger.error(
          'Conflict error: This email is already in use.',
          error.stack,
        );
        throw new ConflictException('This email is already in use.');
      }
      this.logger.error('Error creating user.', error.message);
      throw new InternalServerErrorException(
        'An error occurred while creating the user.',
      );
    }
  }

  async findAll(): Promise<UserDto[]> {
    try {
      this.logger.log('Retrieving all users');
      const users = await this.userModel.find().exec();
      this.logger.log('Retrieved ' + users.length + ' users');
      return users.map((user) => this.toUserDto(user));
    } catch (error) {
      this.logger.error('Error retrieving users.', error.stack);
      throw new InternalServerErrorException(
        'An error occurred while retrieving users.',
      );
    }
  }

  async findOne(id: string): Promise<UserDto> {
    try {
      this.logger.log('Retrieving user with ID: ' + id);
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        this.logger.warn('User with ID ' + id + ' not found');
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      this.logger.log('User with ID ' + id + ' retrieved successfully');
      return this.toUserDto(user);
    } catch (error) {
      this.logger.error('Error retrieving user.', error.stack);
      throw new InternalServerErrorException(
        'An error occurred while retrieving the user.',
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    try {
      this.logger.log(
        'Updating user with ID: ' +
          id +
          ' with data: ' +
          JSON.stringify(updateUserDto),
      );
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, {
          new: true,
        })
        .exec();
      if (!updatedUser) {
        this.logger.warn('User with ID ' + id + ' not found');
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      this.logger.log('User with ID ' + id + ' updated successfully');
      return this.toUserDto(updatedUser);
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        this.logger.error(
          'Conflict error: This email is already in use.',
          error.stack,
        );
        throw new ConflictException('This email is already in use.');
      }
      this.logger.error('Error updating user.', error.stack);
      throw new InternalServerErrorException(
        'An error occurred while updating the user.',
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.log('Deleting user with ID: ' + id);
      const result = await this.userModel.findByIdAndDelete(id).exec();
      if (!result) {
        this.logger.warn('User with ID ' + id + ' not found');
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      this.logger.log('User with ID ' + id + ' deleted successfully');
    } catch (error) {
      this.logger.error('Error deleting user.', error.stack);
      throw new InternalServerErrorException(
        'An error occurred while deleting the user.',
      );
    }
  }
}
