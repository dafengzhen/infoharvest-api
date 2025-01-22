/**
 * TokenVo,
 *
 * @author dafengzhen
 */
export class TokenVo {
  /**
   * expDays
   */
  expDays: number;

  /**
   * id.
   */
  id: number;

  /**
   * newUser.
   */
  newUser: boolean;

  /**
   * token.
   */
  token: string;

  /**
   * username.
   */
  username: string;

  constructor(vo: TokenVo) {
    Object.assign(this, vo);
  }
}
