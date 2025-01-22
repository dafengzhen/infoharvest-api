import type { FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';

import type { PaginationQueryDto } from '../dto/pagination-query.dto';
import type { Base } from '../entities/base.entity';
import type { IPagination } from '../interface/pagination';
import * as sanitizeHtml from 'sanitize-html';

/**
 * Checks if a given string starts with "http" or "https".
 *
 * @param value - The string to check.
 * @returns True if the string starts with "http" or "https", otherwise false.
 */
export const isHttpOrHttps = (value: string) => {
  return value.startsWith('http') || value.startsWith('https');
};

/**
 * Determines if the current site is configured to use HTTPS.
 *
 * @returns True if the environment variable `IS_HTTPS_SITE` is set to "true", otherwise false.
 */
export const isHttpsSite = () => {
  return process.env.IS_HTTPS_SITE === 'true';
};

/**
 * Calculates the maximum age in milliseconds for a given number of days.
 *
 * @param days - The number of days.
 * @returns The maximum age in milliseconds.
 */
export const getMaxAge = (days: number) => {
  return days * 24 * 60 * 60 * 1000;
};

/**
 * Saves associated entities such as names or links by processing a list of DTOs.
 *
 * This utility function is designed to manage the creation and updating of entities based on
 * a provided list of items (DTOs). It ensures that existing entities are retrieved and updated,
 * while new entities are created and initialized as needed.
 *
 * @template Item - The type of the item (DTO) being processed. Each item must extend `Omit<Item, 'id'>`
 *                  and may optionally include an `id` field.
 * @template Entity - The type of the entity being saved. Must extend the base `Entity` class.
 *
 * @param items - The list of DTOs representing the entities to save.
 * @param repository - The TypeORM repository for the entity.
 * @param where - A function that generates the `FindOptionsWhere` clause for querying existing entities.
 *                If `null`, the default `{ id: item.id }` clause will be used.
 * @param handler - A function that initializes or updates the entity based on the given DTO.
 *                  The handler must return an object containing:
 *                  - `entity`: The new entity instance.
 *                  - `updater`: A function to apply updates to the entity.
 * @returns A promise that resolves to an array of entities ready to be saved.
 */
export const saveAssociatedEntities = async <Item extends Omit<Item, 'id'> & { id?: Item['id'] }, Entity extends Base>(
  items: Array<Item>,
  repository: Repository<Entity>,
  where: ((item: Item) => FindOptionsWhere<Entity>) | null,
  handler: (item: Item) => { entity: Entity; updater: (entity: Entity) => void },
): Promise<Entity[]> => {
  return Promise.all(
    items.map(async (item) => {
      let entity: Entity | null = null;

      if (typeof item.id === 'number') {
        entity = await repository.findOne({
          where: where ? where(item) : ({ id: item.id } as FindOptionsWhere<Entity>),
        });
      }

      const { entity: newEntity, updater } = handler(item);
      if (!entity) {
        entity = newEntity;
      }

      updater(entity);
      return entity;
    }),
  );
};

/**
 * Paginate.
 *
 * Paginates the result set from a query builder.
 *
 * @param dto - Pagination parameters (limit, offset, page, size).
 * @param qb - Query builder to apply pagination.
 * @returns The paginated data and pagination details.
 *
 * @author dafengzhen
 */
export const Paginate = async <T extends Base>(
  dto: null | PaginationQueryDto = { limit: 15, page: 1 },
  qb: SelectQueryBuilder<T>,
): Promise<IPagination<T>> => {
  const { limit = 15, page = 1 } = dto || { limit: 15, page: 1 };

  const _limit = limit;
  const _page = page;
  const _offset = (_page - 1) * _limit;

  const data = await qb.skip(_offset).take(_limit).getMany();

  const totalItems = await qb.getCount();
  const totalPages = Math.ceil(totalItems / _limit);

  return {
    data,
    next: _page < totalPages,
    page: _page,
    pages: totalPages,
    previous: _page > 1,
    size: _limit,
  };
};

/**
 * Sanitize HTML content with custom options.
 *
 * @param content - The HTML string to sanitize.
 * @returns The sanitized HTML string.
 */
export const sanitizeContent = (content: string): string => {
  return sanitizeHtml(content, {
    allowedAttributes: false,
    allowedSchemesByTag: {
      img: ['data'],
    },
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    nonBooleanAttributes: [],
  });
};
