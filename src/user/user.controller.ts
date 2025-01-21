import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Response,
  UseInterceptors,
} from '@nestjs/common';
import { Response as Res } from 'express';

import { CurrentUser } from '../auth/current-user.decorator';
import { Public } from '../auth/public-auth.guard';
import { getMaxAge, isHttpsSite } from '../common/tool/tool';
import { SECURE_TK, TK } from '../constants';
import { CountByDateDto } from './dto/count-by-date.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateCustomizationSettingsUserDto } from './dto/update-customization-settings-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

/**
 * UserController,
 *
 * @author dafengzhen
 */
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {
    this.logger.debug('UserController init');
  }

  @Post()
  @Public()
  async create(@Response() response: Res, @Body() createUserDto: CreateUserDto) {
    const vo = await this.userService.create(createUserDto);
    const _isHttpsSite = isHttpsSite();

    response
      .cookie(_isHttpsSite ? SECURE_TK : TK, vo.token, {
        httpOnly: true,
        maxAge: getMaxAge(vo.expDays),
        path: '/',
        sameSite: 'strict',
        secure: _isHttpsSite,
      })
      .header('Location', `/users/${vo.id}`)
      .send(vo);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.userService.findOne(id, user);
  }

  @Get('profile')
  @UseInterceptors(ClassSerializerInterceptor)
  getProfile(@CurrentUser() user: User) {
    return this.userService.getProfile(user);
  }

  @Get('countByDate')
  @Public()
  getUsersCountByDate(@Query() query: CountByDateDto) {
    return this.userService.getUsersCountByDate(query);
  }

  @Delete()
  remove(@CurrentUser() user: User) {
    return this.userService.remove(user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  update(@Param('id') id: number, @CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, user, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/customization-settings')
  updateCustomizationSettings(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body()
    updateCustomizationSettingsUserDto: UpdateCustomizationSettingsUserDto,
  ) {
    return this.userService.updateCustomizationSettings(id, user, updateCustomizationSettingsUserDto);
  }
}
