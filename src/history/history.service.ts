import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TCurrentUser } from '../auth/current-user.decorator';
import { IPagination } from '../common/interface/pagination';
import { AUTHENTICATION_REQUIRED_MESSAGE } from '../constants';
import { QueryHistoryDto } from './dto/query-history.dto';
import { UpdateCustomConfigHistoryDto } from './dto/update-custom-config-history.dto';
import { History } from './entities/history.entity';

/**
 * HistoryService
 *
 * @author dafengzhen
 */
@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  /**
   * Retrieves all history records associated with a specific excerpt for the current user.
   * Ensures the user is authenticated before proceeding.
   *
   * @param dto - The DTO containing query parameters, including the excerpt ID.
   * @param currentUser - The currently authenticated user.
   * @returns A list of history records or a paginated result.
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  async findAll(dto: QueryHistoryDto, currentUser: TCurrentUser): Promise<History[] | IPagination<History>> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    return this.historyRepository.find({
      where: {
        excerpt: {
          id: dto.excerptId,
          user: {
            id: currentUser.id,
          },
        },
      },
    });
  }

  /**
   * Updates the custom configuration for a specific history record owned by the current user.
   *
   * @param id - The ID of the history record to update.
   * @param updateCustomConfigHistoryDto - An object containing key-value pairs to update in the history's custom configuration.
   * @param currentUser - The currently authenticated user making the request.
   * @throws UnauthorizedException - If the user is not authenticated.
   *
   * The function ensures the current user owns the history record before updating its custom configuration.
   * The provided DTO is merged into the existing custom configuration of the history record.
   */
  async updateCustomConfig(
    id: number,
    updateCustomConfigHistoryDto: UpdateCustomConfigHistoryDto,
    currentUser: TCurrentUser,
  ): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const history = await this.historyRepository.findOne({
      where: { excerpt: { user: { id: currentUser.id } }, id },
    });
    if (!history) {
      return;
    }

    const updatedCustomConfig = {
      ...history.customConfig,
      ...updateCustomConfigHistoryDto,
    };

    await this.historyRepository.update(id, { customConfig: updatedCustomConfig });
  }
}
