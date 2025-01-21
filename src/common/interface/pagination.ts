/**
 * IPagination.
 *
 * @author dafengzhen
 */
export interface IPagination<T> {
  data: T[];
  next: boolean;
  page: number;
  pages: number;
  previous: boolean;
  size: number;
}
