import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { EntityManager, Repository } from 'typeorm';

import { TCurrentUser } from '../auth/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { IPagination } from '../common/interface/pagination';
import { Paginate } from '../common/tool/tool';
import { AUTHENTICATION_REQUIRED_MESSAGE } from '../constants';
import { User } from '../user/entities/user.entity';
import { SaveCollectionDto } from './dto/save-collection.dto';
import { SearchCollectionDto } from './dto/search-collection.dto';
import { UpdateCustomConfigCollectionDto } from './dto/update-custom-config-collection.dto';
import { Collection } from './entities/collection.entity';
import { CustomConfig } from './entities/custom-config';

/**
 * Service for handling collections. Includes methods for querying, saving, updating, removing, and searching collections.
 *
 * @author dafengzhen
 */
@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Queries a specific collection by its ID.
   *
   * @param id - The ID of the collection.
   * @param currentUser - The current authenticated user.
   * @returns The collection entity.
   * @throws UnauthorizedException if the user is not authenticated.
   */
  async query(id: number, currentUser: TCurrentUser): Promise<Collection> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const collection = await this.collectionRepository.findOne({
      relations: {
        children: true,
        parent: true,
      },
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    return collection;
  }

  /**
   * Retrieves all collections with optional pagination.
   *
   * @param dto - Pagination query parameters.
   * @param currentUser - The current authenticated user.
   * @returns A list of collections or a paginated result.
   * @throws UnauthorizedException if the user is not authenticated.
   */
  async queryAll(dto: PaginationQueryDto, currentUser: TCurrentUser): Promise<Collection[] | IPagination<Collection>> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const qb = this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.children', 'children')
      .where('collection.parent is null')
      .andWhere('collection.user = :userId', { userId: currentUser.id })
      .addOrderBy('collection.order', 'ASC')
      .addOrderBy('collection.id', 'DESC');

    if (Object.values(dto).every((value) => typeof value === 'number')) {
      return Paginate<Collection>(dto, qb);
    }

    return qb.getMany();
  }

  /**
   * Removes a collection by its ID.
   *
   * @param id - The ID of the collection to remove.
   * @param currentUser - The current authenticated user.
   * @throws UnauthorizedException if the user is not authenticated.
   */
  async remove(id: number, currentUser: TCurrentUser): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    await this.entityManager.transaction(async (manager) => {
      const collection = await manager.findOne(Collection, {
        where: {
          id,
          user: {
            id: currentUser.id,
          },
        },
      });

      if (collection) {
        await manager.remove(Collection, collection);
      }
    });
  }

  /**
   * Saves or updates a collection along with its children.
   *
   * @param saveCollectionDto - Data Transfer Object containing collection details.
   * @param currentUser - The current authenticated user.
   * @returns The saved collection entity.
   * @throws UnauthorizedException if the user is not authenticated.
   */
  async save(saveCollectionDto: SaveCollectionDto, currentUser: TCurrentUser): Promise<Collection> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const handleCollection = async (dto: SaveCollectionDto, user: User, parent?: Collection): Promise<Collection> => {
      let item: Collection | null = null;

      if (dto.id) {
        const where = {
          id: dto.id,
          user: {
            id: currentUser.id,
          },
        };

        item = await this.collectionRepository.findOne({
          where: parent
            ? {
                ...where,
                parent: {
                  id: parent.id,
                },
              }
            : where,
        });
      }

      if (!item) {
        item = new Collection();
        item.user = user;
      }

      item.name = dto.name.trim();
      item.order = typeof dto.order === 'number' ? dto.order : 0;
      item.parent = parent ? parent : item.parent;

      return item;
    };

    const collection = await handleCollection(saveCollectionDto, currentUser);

    return this.entityManager.transaction(async (manager) => {
      const newCollection = await manager.save(Collection, collection);
      let savedCollection: Collection | null = null;

      if (Array.isArray(saveCollectionDto.children) && saveCollectionDto.children.length > 0) {
        const children = await Promise.all(
          saveCollectionDto.children.map((dto) => handleCollection(dto, currentUser, newCollection)),
        );
        const savedChildren = await manager.save(Collection, children);
        savedCollection = instanceToPlain(newCollection) as Collection;
        savedCollection.children = savedChildren.map((child) => {
          const { parent: _parent, ...rest } = instanceToPlain(child);
          void _parent;
          return rest;
        }) as Collection[];
      }

      return savedCollection || newCollection;
    });
  }

  /**
   * Searches for collections by name, including children.
   *
   * @param dto - The search parameters.
   * @param currentUser - The current authenticated user.
   * @returns A list of matching collections.
   * @throws UnauthorizedException if the user is not authenticated.
   */
  async search(dto: SearchCollectionDto, currentUser: TCurrentUser): Promise<Collection[]> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const name = decodeURIComponent(dto.name.trim());

    return this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.children', 'children')
      .leftJoinAndSelect('collection.parent', 'parent')
      .where('MATCH(collection.name) AGAINST (:name IN BOOLEAN MODE)', { name })
      .orWhere('MATCH(children.name) AGAINST (:name IN BOOLEAN MODE)', { name })
      .andWhere('collection.user.id = :userId', { userId: currentUser.id })
      .addOrderBy('collection.order', 'ASC')
      .addOrderBy('collection.id', 'DESC')
      .getMany();
  }

  /**
   * Updates the custom configuration for a specific collection owned by the current user.
   *
   * @param id - The ID of the collection to update.
   * @param updateCustomConfigCollectionDto - An object containing key-value pairs to update in the custom configuration.
   * @param currentUser - The currently authenticated user making the request.
   * @throws UnauthorizedException - If the user is not authenticated.
   *
   * The function ensures the current user owns the collection before updating its custom configuration.
   * Each key in the provided DTO is merged into the existing custom configuration.
   */
  async updateCustomConfig(
    id: number,
    updateCustomConfigCollectionDto: UpdateCustomConfigCollectionDto,
    currentUser: TCurrentUser,
  ): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const collection = await this.collectionRepository.findOne({
      where: { id, user: { id: currentUser.id } },
    });
    if (!collection) {
      return;
    }

    const updatedCustomConfig: CustomConfig = {
      ...collection.customConfig,
      ...updateCustomConfigCollectionDto,
      type: 'collection',
    };

    await this.collectionRepository.update(id, { customConfig: updatedCustomConfig });
  }
}
