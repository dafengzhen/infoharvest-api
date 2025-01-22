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

  public static async isMatchPassword(currentPassword: string, userPassword: string): Promise<boolean> {
    return argon2.verify(userPassword, currentPassword);
  }

  async encryptPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async findOneBy(id?: number): Promise<User> {
    let user: null | User = null;
    if (typeof id === 'number') {
      user = await this.userRepository.findOneBy({ id });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }

  sign(user: User): string {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !(await AuthService.isMatchPassword(password, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }
}
