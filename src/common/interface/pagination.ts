/**
 * IPagination.
 *
 * @author dafengzhen
 */
export interface IPagination<T> {
  /**
   * data,
   */
  data: T[];

  /**
   * next,
   */
  next: boolean;

  /**
   * page,
   */
  page: number;

  /**
   * pages,
   */
  pages: number;

  /**
   * previous,
   */
  previous: boolean;

  /**
   * size,
   */
  size: number;
}
