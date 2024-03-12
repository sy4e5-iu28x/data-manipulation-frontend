/**
 * データクラス
 */
export interface DataClass {
  /**
   * クラスID
   */
  id: number,

  /**
   * クラス名
   */
  name: string,

  /**
   * クラスタイプ
   */
  type: string
}

/**
 * データプロパティ
 */
export interface DataProperty {

  /**
   * プロパティID
   */
  id: number,

  /**
   * プロパティ名
   */
  name: string,

  /**
   * 型クラスID
   */
  typeClassId: number
}

/**
 * ユーザー
 */
export interface SignUpUser {
  /**
   * ユーザー名
   */
  username: string;

  /**
   * パスワード
   */
  password: string;
}