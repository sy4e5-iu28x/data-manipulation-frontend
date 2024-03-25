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
 * データオブジェクト情報
 */
export interface DataObjectInformation {
  dataobjectId: number,
  dataclassId: number,
  dataproperties: DataProperty[],
  datavalues: DataValue[]
}

/**
 * データ値
 */
export interface DataValue {
  id: number,
  dataContent: string,
  savedDateTime: Date
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