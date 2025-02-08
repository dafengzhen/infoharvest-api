import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';

import { CurrentUser, TCurrentUser } from '../auth/current-user.decorator';
import { Public } from '../auth/public-auth.guard';
import { DynamicValidationOptions } from '../common/pipes/validator-options.decorator';
import { getMaxAge, isHttpsSite } from '../common/tool/tool';
import { LOCATION, SECURE_TK, TK } from '../constants';
import { LoginDto } from './dto/login.dto';
import { UpdateCustomConfigUserDto } from './dto/update-custom-config-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { TokenVo } from './vo/token.vo';

/**
 * UserController,
 *
 * @author dafengzhen
 */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response): Promise<TokenVo> {
    const vo = await this.userService.login(loginDto);
    const _isHttpsSite = isHttpsSite();

    response.cookie(_isHttpsSite ? SECURE_TK : TK, vo.token, {
      httpOnly: true,
      maxAge: getMaxAge(vo.expDays),
      path: '/',
      sameSite: 'strict',
      secure: _isHttpsSite,
    });

    if (vo.newUser) {
      response.set(LOCATION, `/users/${vo.id}`);
      response.status(201);
    } else {
      response.status(200);
    }

    return vo;
  }

  @Get(':id')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  async query(
    @Param('id') id: number,
    @Param('cache') cache: boolean = false,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<null | User> {
    return this.userService.query(cache, currentUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number, @CurrentUser() currentUser: TCurrentUser): Promise<void> {
    return this.userService.remove(currentUser);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<void> {
    return this.userService.update(updateUserDto, currentUser);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/custom-config')
  async updateCustomConfig(
    @Param('id') id: number,
    @DynamicValidationOptions() updateCustomConfigUserDto: UpdateCustomConfigUserDto,
    @CurrentUser() currentUser: TCurrentUser,
  ): Promise<void> {
    return this.userService.updateCustomConfig(updateCustomConfigUserDto, currentUser);
  }
}
