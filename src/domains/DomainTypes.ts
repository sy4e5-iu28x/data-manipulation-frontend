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
 * データクラス・データプロパティ関係
 */
export interface DataClassDataPropertyRelation {

  /**
   * データクラス・データプロパティ関係ID
   */
  id: number,

  /**
   * データクラスID
   */
  dataclassId: number,

  /**
   * データプロパティID
   */
  datapropertyId: number
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