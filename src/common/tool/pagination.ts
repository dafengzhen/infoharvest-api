import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import type { PaginationQueryDto } from '../dto/pagination-query.dto';
import type { IPagination } from '../interface/pagination';

/**
 * Paginate.
 *
 * @author dafengzhen
 */
export async function Paginate<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  paginationQuery?: PaginationQueryDto,
): Promise<IPagination<T>> {
  const { limit, offset, page, size } = paginationQuery ?? {
    limit: 15,
    offset: 1,
    page: 1,
    size: 15,
  };

  const _page = page ?? 1;
  const _size = size ?? 15;
  const _limit = limit ?? _size;
  const _offset = offset ?? (_page - 1) * _limit;
  const data = await qb.skip(_offset).take(_limit).getMany();
  const pages = Math.ceil((await qb.getCount()) / _limit);

  return {
    data,
    next: _page + 1 < pages,
    page: _page,
    pages,
    previous: _page - 1 > 1,
    size: _limit,
  };
}
