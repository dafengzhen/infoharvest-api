import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { TCurrentUser } from '../auth/current-user.decorator';
import { AUTHENTICATION_REQUIRED_MESSAGE, EXP_DAYS } from '../constants';
import { LoginDto } from './dto/login.dto';
import { UpdateCustomConfigUserDto } from './dto/update-custom-config-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { TokenVo } from './vo/token.vo';

/**
 * Service for handling user-related operations.
 * Includes user login, profile management, updates, and deletion.
 *
 * @class UserService
 * @author dafengzhen
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Handles user login or registration.
   * - If the user exists, validates the password and returns a token.
   * - If the user does not exist, registers a new user and returns a token.
   * Throws an UnauthorizedException if the password is invalid.
   *
   * @param {LoginDto} loginDto - Object containing username and password.
   * @returns {Promise<TokenVo>} TokenVo - Object containing token and user details.
   */
  async login(loginDto: LoginDto): Promise<TokenVo> {
    const username = loginDto.username.trim();
    const password = loginDto.password.trim();

    let user: null | User = await this.userRepository.findOne({ where: { username } });
    let newUser: boolean = false;

    if (user) {
      if (!(await AuthService.isMatchPassword(password, user.password))) {
        throw new UnauthorizedException('Invalid username or password');
      }
    } else {
      user = this.userRepository.create({
        password: await this.authService.encryptPassword(password),
        username,
      });
      user = await this.userRepository.save(user);
      newUser = true;
    }

    return new TokenVo({
      expDays: EXP_DAYS,
      id: user.id,
      newUser,
      token: this.authService.sign(user),
      username: user.username,
    });
  }

  /**
   * Retrieves the profile of the current user.
   *
   * @param {User | null} user - The current user object (nullable).
   * @returns {Promise<User | null>} The user profile or null if user is not logged in.
   */
  async query(user: TCurrentUser): Promise<null | User> {
    return user
      ? this.userRepository.findOne({
          cache: {
            id: `users:${user.id}`,
            milliseconds: 60000,
          },
          where: { id: user.id },
        })
      : null;
  }

  /**
   * Deletes the current user.
   * Uses a transaction to ensure consistency during deletion.
   *
   * @param {User | null} currentUser - The current user object.
   * @returns {Promise<void>} void
   */
  async remove(currentUser: TCurrentUser): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    await this.entityManager.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: currentUser.id } });

      if (user) {
        await manager.remove(User, user);
      }
    });
    await this.dataSource.queryResultCache?.remove([`users:${currentUser.id}`]);
  }

  /**
   * Updates the user profile.
   *
   * @param {UpdateUserDto} updateUserDto - Object containing updated user details.
   * @param {User | null} currentUser - The current user object.
   * @returns {Promise<void>} void
   */
  async update(updateUserDto: UpdateUserDto, currentUser: TCurrentUser): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const id = currentUser.id;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return;
    }

    if (updateUserDto.avatar) {
      await this.userRepository.update(id, { avatar: updateUserDto.avatar.trim() });
    }
  }

  /**
   * Updates the custom configuration for the current user.
   *
   * @param updateCustomConfigUserDto - An optional object containing key-value pairs to update in the user's custom configuration.
   * @param currentUser - The currently authenticated user making the request.
   * @throws UnauthorizedException - If the user is not authenticated.
   *
   * The function ensures the user is authenticated and updates their custom configuration
   * by merging the provided DTO with the existing configuration.
   */
  async updateCustomConfig(
    updateCustomConfigUserDto: UpdateCustomConfigUserDto = {},
    currentUser: TCurrentUser,
  ): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const id = currentUser.id;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return;
    }

    const updatedCustomConfig = {
      ...user.customConfig,
      ...updateCustomConfigUserDto,
    };

    await this.userRepository.update(id, { customConfig: updatedCustomConfig });
  }
}
