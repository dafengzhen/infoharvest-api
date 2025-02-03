import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { load } from 'cheerio';
import { instanceToPlain } from 'class-transformer';
import { EntityManager, Repository } from 'typeorm';

import type { IPagination } from '../common/interface/pagination';

import { TCurrentUser } from '../auth/current-user.decorator';
import { Collection } from '../collection/entities/collection.entity';
import { isHttpOrHttps, Paginate, sanitizeContent, saveAssociatedEntities } from '../common/tool/tool';
import { AUTHENTICATION_REQUIRED_MESSAGE } from '../constants';
import { History } from '../history/entities/history.entity';
import { User } from '../user/entities/user.entity';
import { PaginationQueryExcerptDto } from './dto/pagination-query-excerpt.dto';
import { SaveExcerptLinkDto } from './dto/save-excerpt-link.dto';
import { SaveExcerptNameDto } from './dto/save-excerpt-name.dto';
import { SaveExcerptDto } from './dto/save-excerpt.dto';
import { SearchExcerptDto } from './dto/search-excerpt.dto';
import { UpdateCustomConfigExcerptDto } from './dto/update-custom-config-excerpt.dto';
import { ValidateLinkRequestDto } from './dto/validate-link-request.dto';
import { CustomConfig } from './entities/custom-config';
import { ExcerptLink } from './entities/excerpt-link.entity';
import { ExcerptName } from './entities/excerpt-name.entity';
import { Excerpt } from './entities/excerpt.entity';
import { ValidateLinkResponseVo } from './vo/validate-link-response.vo';

/**
 * ExcerptService,
 *
 * @author dafengzhen
 */
@Injectable()
export class ExcerptService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(Excerpt)
    private readonly excerptRepository: Repository<Excerpt>,
    @InjectRepository(ExcerptName)
    private readonly excerptNameRepository: Repository<ExcerptName>,
    @InjectRepository(ExcerptLink)
    private readonly excerptLinkRepository: Repository<ExcerptLink>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Retrieves all excerpts for the current user, optionally filtered by collection ID.
   * Supports pagination if pagination parameters are provided.
   *
   * @param dto - The DTO containing pagination and filtering parameters.
   * @param currentUser - The currently authenticated user.
   * @returns A list of excerpts or a paginated result.
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  async findAll(dto: PaginationQueryExcerptDto, currentUser: TCurrentUser): Promise<Excerpt[] | IPagination<Excerpt>> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const qb = this.excerptRepository
      .createQueryBuilder('excerpt')
      .leftJoinAndSelect('excerpt.names', 'names')
      .leftJoinAndSelect('excerpt.links', 'links')
      .leftJoinAndSelect('excerpt.collection', 'collection')
      .leftJoinAndSelect('collection.parent', 'parent')
      .where('excerpt.user = :userId', {
        userId: currentUser.id,
      })
      .addOrderBy('excerpt.order', 'ASC')
      .addOrderBy('excerpt.id', 'DESC');

    const { collectionId, ...paginatedDto } = dto;

    if (
      typeof collectionId === 'number' &&
      (await this.collectionRepository.exists({
        where: { id: collectionId, user: { id: currentUser.id } },
      }))
    ) {
      qb.where('excerpt.collection = :collectionId', {
        collectionId,
      });
    }

    if (Object.values(paginatedDto).every((value) => typeof value === 'number')) {
      return Paginate<Excerpt>(paginatedDto, qb);
    }

    return qb.getMany();
  }

  /**
   * Retrieves a single excerpt by its ID, ensuring it belongs to the current user.
   *
   * @param id - The ID of the excerpt to retrieve.
   * @param currentUser - The currently authenticated user.
   * @returns The requested excerpt.
   * @throws UnauthorizedException - If the user is not authenticated.
   * @throws NotFoundException - If the excerpt is not found.
   */
  async findOne(id: number, currentUser: TCurrentUser): Promise<Excerpt> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const excerpt = await this.excerptRepository.findOne({
      relations: {
        collection: {
          parent: true,
        },
        histories: true,
        links: true,
        names: true,
      },
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    if (!excerpt) {
      throw new NotFoundException('Excerpt not found');
    }

    return excerpt;
  }

  /**
   * Deletes an excerpt by its ID, ensuring it belongs to the current user.
   *
   * @param id - The ID of the excerpt to delete.
   * @param currentUser - The currently authenticated user.
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  async remove(id: number, currentUser: TCurrentUser): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    await this.entityManager.transaction(async (manager) => {
      const excerpt = await manager.findOne(Excerpt, {
        where: {
          id,
          user: {
            id: currentUser.id,
          },
        },
      });

      if (excerpt) {
        await manager.remove(Excerpt, excerpt);
      }
    });
  }

  /**
   * Saves an excerpt along with its associated data (names and links).
   *
   * If an `id` is provided in the DTO, it attempts to update the existing excerpt.
   * Otherwise, a new excerpt is created.
   *
   * The function also handles the following:
   * - Validating the user's authentication.
   * - Linking the excerpt to a collection if `collectionId` is provided.
   * - Saving additional details such as `order`, `icon`, and `description`.
   * - Saving associated names and links for the excerpt, creating new entities if needed.
   *
   * @param saveExcerptDto - The DTO containing excerpt data to save.
   * @param currentUser - The currently authenticated user.
   * @returns A promise that resolves to the saved excerpt.
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  async save(saveExcerptDto: SaveExcerptDto, currentUser: TCurrentUser): Promise<Excerpt> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const excerpt = await this.findOrCreateExcerpt(saveExcerptDto, currentUser);

    if (typeof saveExcerptDto.collectionId === 'number') {
      const collection = await this.collectionRepository.findOne({
        where: { id: saveExcerptDto.collectionId, user: { id: currentUser.id } },
      });

      if (collection) {
        excerpt.collection = collection;
      }
    }

    if (typeof saveExcerptDto.order === 'number') {
      excerpt.order = saveExcerptDto.order;
    }

    if (saveExcerptDto.icon) {
      excerpt.icon = saveExcerptDto.icon.trim();
    }

    if (saveExcerptDto.description) {
      excerpt.description = sanitizeContent(saveExcerptDto.description.trim());
    }

    return this.entityManager.transaction(async (manager) => {
      const newExcerpt = await manager.save(Excerpt, excerpt);
      let savedExcerpt: Excerpt | null = null;

      if (Array.isArray(saveExcerptDto.names) && saveExcerptDto.names.length > 0) {
        const names = await saveAssociatedEntities<SaveExcerptNameDto, ExcerptName>(
          saveExcerptDto.names,
          this.excerptNameRepository,
          (item) => ({ excerpt: { id: newExcerpt.id }, id: item.id }),
          (item) => ({
            entity: new ExcerptName(),
            updater: (entity) => {
              if (item.name) {
                entity.name = item.name.trim();
              }
              entity.excerpt = newExcerpt;
            },
          }),
        );

        const savedNames = await manager.save(ExcerptName, names);
        savedExcerpt = instanceToPlain(newExcerpt) as Excerpt;
        savedExcerpt.names = savedNames.map((child) => {
          const { excerpt: _excerpt, ...rest } = instanceToPlain(child);
          void _excerpt;
          return rest;
        }) as ExcerptName[];
      }

      if (Array.isArray(saveExcerptDto.links) && saveExcerptDto.links.length > 0) {
        const links = await saveAssociatedEntities<SaveExcerptLinkDto, ExcerptLink>(
          saveExcerptDto.links,
          this.excerptLinkRepository,
          (item) => ({ excerpt: { id: newExcerpt.id }, id: item.id }),
          (item) => ({
            entity: new ExcerptLink(),
            updater: (entity) => {
              if (item.link) {
                entity.link = item.link.trim();
              }
              entity.excerpt = newExcerpt;
            },
          }),
        );

        const savedLinks = await manager.save(ExcerptLink, links);
        savedExcerpt = instanceToPlain(newExcerpt) as Excerpt;
        savedExcerpt.links = savedLinks.map((child) => {
          const { excerpt: _excerpt, ...rest } = instanceToPlain(child);
          void _excerpt;
          return rest;
        }) as ExcerptLink[];
      }

      const finalExcerpt = savedExcerpt || newExcerpt;
      const history = new History();
      history.icon = finalExcerpt.icon;
      history.order = finalExcerpt.order;
      history.description = finalExcerpt.description;
      history.names = (finalExcerpt.names || []).map((item) => item.name);
      history.links = (finalExcerpt.links || []).map((item) => item.link);
      history.excerpt = finalExcerpt;
      await manager.save(History, history);
      return finalExcerpt;
    });
  }

  /**
   * Searches for excerpts based on a query string, matching against names, links, and descriptions.
   *
   * @param dto - The DTO containing the search query.
   * @param currentUser - The currently authenticated user.
   * @returns A list of excerpts matching the search criteria.
   * @throws UnauthorizedException - If the user is not authenticated.
   */
  async search(dto: SearchExcerptDto, currentUser: TCurrentUser): Promise<Excerpt[]> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const name = decodeURIComponent(dto.name.trim());

    return this.excerptRepository
      .createQueryBuilder('excerpt')
      .leftJoinAndSelect('excerpt.names', 'names')
      .leftJoinAndSelect('excerpt.links', 'links')
      .leftJoinAndSelect('excerpt.collection', 'collection')
      .orWhere('MATCH(names.name) AGAINST (:name IN BOOLEAN MODE)', { name })
      .orWhere('MATCH(links.link) AGAINST (:name IN BOOLEAN MODE)', { name })
      .orWhere('MATCH(excerpt.description) AGAINST (:name IN BOOLEAN MODE)', {
        name,
      })
      .andWhere('excerpt.user = :userId', { userId: currentUser.id })
      .addOrderBy('excerpt.order', 'ASC')
      .addOrderBy('excerpt.id', 'DESC')
      .getMany();
  }

  /**
   * Updates the custom configuration for a specific excerpt owned by the current user.
   *
   * @param id - The ID of the excerpt to update.
   * @param updateCustomConfigExcerptDto - An object containing key-value pairs to update in the custom configuration.
   * @param currentUser - The currently authenticated user making the request.
   * @throws UnauthorizedException - If the user is not authenticated.
   *
   * The function ensures the current user owns the excerpt before updating its custom configuration.
   * The provided DTO is merged into the existing custom configuration.
   */
  async updateCustomConfig(
    id: number,
    updateCustomConfigExcerptDto: UpdateCustomConfigExcerptDto,
    currentUser: TCurrentUser,
  ): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const excerpt = await this.excerptRepository.findOne({
      where: { id, user: { id: currentUser.id } },
    });
    if (!excerpt) {
      return;
    }

    const updatedCustomConfig: CustomConfig = {
      ...excerpt.customConfig,
      ...updateCustomConfigExcerptDto,
      type: 'excerpt',
    };

    await this.excerptRepository.update(id, { customConfig: updatedCustomConfig });
  }

  /**
   * Validates a list of links by making HTTP requests and extracting metadata.
   *
   * @param validateLinkRequestDto - The DTO containing the links to validate.
   * @returns A list of validation results for each link.
   */
  async validateLink(validateLinkRequestDto: ValidateLinkRequestDto): Promise<ValidateLinkResponseVo[]> {
    const links = (validateLinkRequestDto.links ?? []).map((item) => item.trim()).filter(isHttpOrHttps);

    if (links.length === 0) {
      return [];
    }

    return Promise.all(links.map((link) => this.validateSingleLink(link, validateLinkRequestDto.headers)));
  }

  /**
   * Finds an existing excerpt or creates a new one if not found.
   *
   * @param saveExcerptDto - The DTO containing excerpt data.
   * @param currentUser - The currently authenticated user.
   * @returns The found or newly created excerpt.
   */
  private async findOrCreateExcerpt(saveExcerptDto: SaveExcerptDto, currentUser: User): Promise<Excerpt> {
    let excerpt: Excerpt | null = null;

    if (typeof saveExcerptDto.id === 'number') {
      excerpt = await this.excerptRepository.findOne({
        where: { id: saveExcerptDto.id, user: { id: currentUser.id } },
      });
    }

    return excerpt || Object.assign(new Excerpt(), { user: currentUser });
  }

  /**
   * Validates a single link by sending an HTTP request and analyzing the response.
   *
   * @param link - The URL of the link to validate.
   * @param headers - Optional headers to include in the HTTP request.
   * @returns A promise that resolves to a ValidateLinkResponseVo object containing validation details.
   */
  private async validateSingleLink(link: string, headers: Record<string, string>): Promise<ValidateLinkResponseVo> {
    const createErrorResponse = (
      link: string,
      status?: number,
      statusText?: string,
      message?: string,
    ): ValidateLinkResponseVo => ({
      link,
      message: message || 'Unknown Error',
      ok: false,
      status,
      statusText,
    });

    const createSuccessResponse = (
      link: string,
      response: Response,
      contentType: string,
      extraData: Partial<Pick<ValidateLinkResponseVo, 'data' | 'description' | 'title'>> = {},
    ): ValidateLinkResponseVo => ({
      contentType,
      link,
      ok: true,
      status: response.status,
      statusText: response.statusText,
      ...extraData,
    });

    try {
      const response = await fetch(link, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          ...headers,
        },
      });

      if (!response.ok) {
        return createErrorResponse(link, response.status, response.statusText);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = (await response.json().catch(() => null)) as unknown;
        return createSuccessResponse(link, response, contentType, { data });
      } else if (contentType.includes('text/html')) {
        const html = await response.text();
        const $ = load(html);
        const title = $('head > title').text();
        const description = $('meta[name="description"]').attr('content');

        return createSuccessResponse(link, response, contentType, { description, title });
      } else {
        return createSuccessResponse(link, response, contentType);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown Error';
      return createErrorResponse(link, undefined, undefined, errorMessage);
    }
  }
}
