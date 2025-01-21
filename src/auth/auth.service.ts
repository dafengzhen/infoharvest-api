import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';

/**
 * AuthService.
 *
 * @author dafengzhen
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public static async isMatchPassword(currentPassword: string, userPassword: string) {
    return argon2.verify(userPassword, currentPassword);
  }

  async encryptPassword(password: string) {
    return argon2.hash(password);
  }

  getTokenForUser(user: User) {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  async getUserByIdAndToken(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async validate(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !(await AuthService.isMatchPassword(password, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }
}
