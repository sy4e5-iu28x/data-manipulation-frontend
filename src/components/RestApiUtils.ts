import { DataClass, DataClassDataPropertyRelation, DataObjectInformation, DataProperty, SignUpUser } from '../domains/DomainTypes'
import { getToken } from './AuthUtils'

/**
 * REST APIへリクエストを行い、全データクラスを取得する。
 * @returns Promise<DataClass[]>
 */
function requestAllClasses(): Promise<DataClass[]> {
  // ヘッダー
  let headers = new Headers();
  // Bare認証設定
  headers.append('Authorization', `Bearer ${(getToken())}`)
  headers.append('Content-Type', 'application/json')

  // API URL
  const url = "http://localhost:8080/data-manipulation/dataclasses";

  // リクエストパラメタ
  const requestParams = {
    method: 'GET',
    headers: headers
  }

  const fetchProcess = async (): Promise<DataClass[]> => {
    // リクエスト実行
    const response = await fetch(url, requestParams)
    const json = await response.json()
    const results: Array<DataClass> = json as Array<DataClass>
    return results;
  }

  return fetchProcess()
};

/**
 * REST APIへリクエストを行い、全データプロパティを取得する。
 * @returns Promise<DataProperty[]>
 */
function requestAllProperties(): Promise<DataProperty[]> {
  // ヘッダー
  let headers = new Headers();
  // Bare認証設定
  headers.append('Authorization', `Bearer ${(getToken())}`)
  headers.append('Content-Type', 'application/json')

  // API URL
  const url = "http://localhost:8080/data-manipulation/dataproperties";

  // リクエストパラメタ
  const requestParams = {
    method: 'GET',
    headers: headers
  }

  const fetchProcess = async (): Promise<DataProperty[]> => {
    // リクエスト実行
    const response = await fetch(url, requestParams)
    const json = await response.json()
    const results: Array<DataProperty> = json as Array<DataProperty>
    return results;
  }

  return fetchProcess()
};

/**
 * REST APIへリクエストを行い、全データオブジェクトを取得する。
 * @returns Promise<DataObjectInformation[]>
 */
function requestAllObjects(): Promise<DataObjectInformation[]> {
  // ヘッダー
  let headers = new Headers();
  // Bare認証設定
  headers.append('Authorization', `Bearer ${(getToken())}`)
  headers.append('Content-Type', 'application/json')

  // API URL
  const url = "http://localhost:8080/data-manipulation/dataobjects";

  // リクエストパラメタ
  const requestParams = {
    method: 'GET',
    headers: headers
  }

  const fetchProcess = async (): Promise<DataObjectInformation[]> => {
    // リクエスト実行
    const response = await fetch(url, requestParams)
    const json = await response.json()
    const results: Array<DataObjectInformation> = json as Array<DataObjectInformation>
    return results;
  }

  return fetchProcess()
};

/**
 * REST APIへリクエストを行い、全データプロパティを取得する。
 * @returns Promise<DataClassDataPropertyRelation[]>
 */
function requestClassPropertyRelationsByDataClassId(dataclassid: number): Promise<DataClassDataPropertyRelation[]> {
  // ヘッダー
  let headers = new Headers();
  // Bare認証設定
  headers.append('Authorization', `Bearer ${(getToken())}`)
  headers.append('Content-Type', 'application/json')

  // API URL
  const url = `http://localhost:8080/data-manipulation/relations/dataclass-dataproperty?dataclassid=${dataclassid}`;

  // リクエストパラメタ
  const requestParams = {
    method: 'GET',
    headers: headers
  }

  const fetchProcess = async (): Promise<DataClassDataPropertyRelation[]> => {
    // リクエスト実行
    const response = await fetch(url, requestParams)
    const json = await response.json()
    const results: Array<DataClassDataPropertyRelation> = json as Array<DataClassDataPropertyRelation>
    return results;
  }

  return fetchProcess()
};

/**
 * REST APIへリクエストを行い、クラスを作成する。
 * @returns Promise<DataClass>
 */
function requestAddClass(dataclass: DataClass): Promise<DataClass> {
  // ヘッダー
  let headers = new Headers();
  // Bare認証設定
  headers.append('Authorization', `Bearer ${(getToken())}`)
  headers.append('Content-Type', 'application/json')

  // API URL
  const url = "http://localhost:8080/data-manipulation/dataclasses";

  // 必要なリクエストボディ項目
  type RequestBody = {
    name: string;
    type: string;
  }

  // 実際のリクエストボディ
  const actualRequestbody: RequestBody = {
    name: dataclass.name,
    type: 'UserDefinedClass'
  }

  // リクエストパラメタ
  const requestParams = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(actualRequestbody)
  }

  const fetchProcess = async (): Promise<DataClass> => {
    // リクエスト実行
    const response = await fetch(url, requestParams)
    const json = await response.json()
    const results: DataClass = json as DataClass
    return results;
  }

  return fetchProcess()
};

/**
 * REST APIへリクエストを行い、プロパティを作成する。
 * @returns Promise<DataProperty>
 */
function requestAddProperty(dataproperty: DataProperty): Promise<DataProperty> {
  // ヘッダー
  let headers = new Headers();
  // Bare認証設定
  headers.append('Authorization', `Bearer ${(getToken())}`)
  headers.append('Content-Type', 'application/json')

  // API URL
  const url = "http://localhost:8080/data-manipulation/dataproperties";

  // 必要なリクエストボディ項目
  type RequestBody = {
    name: string;
    typeClassId: number;
  }

  // 実際のリクエストボディ
  const actualRequestbody: RequestBody = {
    name: dataproperty.name,
    typeClassId: dataproperty.typeClassId
  }

  // リクエストパラメタ
  const requestParams = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(actualRequestbody)
  }

  const fetchProcess = async (): Promise<DataProperty> => {
    // リクエスト実行
    const response = await fetch(url, requestParams)
    const json = await response.json()
    const results: DataProperty = json as DataProperty
    return results;
  }

  return fetchProcess()
};

/**
 * REST APIへリクエストを行い、データオブジェクトを作成する。
 * @returns Promise<DataObjectInformation>
 */
function requestAddObject(dataobject: DataObjectInformation): Promise<DataObjectInformation> {
  // ヘッダー
  let headers = new Headers();
  // Bare認証設定
  headers.append('Authorization', `Bearer ${(getToken())}`)
  headers.append('Content-Type', 'application/json')

  // API URL
  const url = "http://localhost:8080/data-manipulation/dataobjects";

  // 必要なリクエストボディ項目
  type RequestBody = {
    dataclassId: number;
    dataproperties: [{
      id: number
    }]
    datavalues: [{
      dataContent: string
    }]
  }

  // 実際のリクエストボディ
  const actualRequestbody: RequestBody = {
    dataclassId: dataobject.dataclassId,
    dataproperties: Object.assign(dataobject.dataproperties.map(item => ({ id: item.id }))),
    datavalues: Object.assign(dataobject.datavalues.map(item => ({ dataContent: item.dataContent })))
  }

  // リクエストパラメタ
  const requestParams = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(actualRequestbody)
  }

  const fetchProcess = async (): Promise<DataObjectInformation> => {
    // リクエスト実行
    const response = await fetch(url, requestParams)
    const json = await response.json()
    const results: DataObjectInformation = json as DataObjectInformation
    return results;
  }

  return fetchProcess()
};

/**
 * REST APIへリクエストを行い、データクラス・データプロパティ関係を作成する。
 * @returns Promise<DataClassDataPropertyRelation>
 */
function requestAddClassPropertyRelation(dataclass: DataClassDataPropertyRelation): Promise<DataClassDataPropertyRelation> {
  // ヘッダー
  let headers = new Headers();
  // Bare認証設定
  headers.append('Authorization', `Bearer ${(getToken())}`)
  headers.append('Content-Type', 'application/json')

  // API URL
  const url = "http://localhost:8080/data-manipulation/relations/dataclass-dataproperty";

  // 必要なリクエストボディ項目
  type RequestBody = {
    dataclassId: number;
    datapropertyId: number;
  }

  // 実際のリクエストボディ
  const actualRequestbody: RequestBody = {
    dataclassId: dataclass.dataclassId,
    datapropertyId: dataclass.datapropertyId
  }

  // リクエストパラメタ
  const requestParams = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(actualRequestbody)
  }

  const fetchProcess = async (): Promise<DataClassDataPropertyRelation> => {
    // リクエスト実行
    const response = await fetch(url, requestParams)
    const json = await response.json()
    const results: DataClassDataPropertyRelation = json as DataClassDataPropertyRelation
    return results;
  }

  return fetchProcess()
};

/**
 * REST APIへリクエストを行い、クラスを更新する。
 * @returns Promise<DataClass>
 */
function requestUpdateClass(dataclass: DataClass): Promise<DataClass> {
  // ヘッダー
  let headers = new Headers();
  // Bare認証設定
  headers.append('Authorization', `Bearer ${(getToken())}`)
  headers.append('Content-Type', 'application/json')

  // API URL
  const url = `http://localhost:8080/data-manipulation/dataclasses/${dataclass.id}`;

  // 必要なリクエストボディ項目
  type RequestBody = {
    name: string;
    type: string;
  }

  // 実際のリクエストボディ
  const actualRequestbody: RequestBody = {
    name: dataclass.name,
    type: dataclass.type
  }

  // リクエストパラメタ
  const requestParams = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(actualRequestbody)
  }

  const fetchProcess = async (): Promise<DataClass> => {
    // リクエスト実行
    const response = await fetch(url, requestParams)
    const json = await response.json()
    const results: DataClass = json as DataClass
    return results;
  }

  return fetchProcess()
};

/**
 * REST APIへリクエストを行い、プロパティを更新する。
 * @returns Promise<DataClass>
 */
function requestUpdateProperty(dataproperty: DataProperty): Promise<DataProperty> {
  // ヘッダー
  let headers = new Headers();
  // Bare認証設定
  headers.append('Authorization', `Bearer ${(getToken())}`)
  headers.append('Content-Type', 'application/json')

  // API URL
  const url = `http://localhost:8080/data-manipulation/dataproperties/${dataproperty.id}`;

  // 必要なリクエストボディ項目
  type RequestBody = {
    name: string;
    typeClassId: number;
  }

  // 実際のリクエストボディ
  const actualRequestbody: RequestBody = {
    name: dataproperty.name,
    typeClassId: dataproperty.typeClassId
  }

  // リクエストパラメタ
  const requestParams = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(actualRequestbody)
  }

  const fetchProcess = async (): Promise<DataProperty> => {
    // リクエスト実行
    const response = await fetch(url, requestParams)
    const json = await response.json()
    const results: DataProperty = json as DataProperty
    return results;
  }

  return fetchProcess()
};

/**
 * REST APIへリクエストし、ユーザーを作成する。
 * @param user 登録ユーザー
 * @returns Promise<SignUpUser>
 */
function requestCreatingUser(user: SignUpUser): Promise<SignUpUser> {
  // ユーザー情報
  const signUpUser: SignUpUser = user;

  // API URL
  const url = "http://localhost:8080/data-manipulation/auth/signup";

  // ヘッダー
  let headers = new Headers();
  headers.append('Content-Type', 'application/json')

  // リクエストパラメタ
  const requestParams = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(signUpUser)
  }

  const fetchProcess = async (): Promise<SignUpUser> => {
    // リクエスト実行
    const response = await fetch(url, requestParams)
    const json = await response.json()
    const results: SignUpUser = json as SignUpUser
    return results;
  }

  return fetchProcess()
}

/**
 * REST APIへリクエストし、トークンを取得する。
 * @param user ログインユーザー
 * @returns Promise<string>
 */
function requestIssuingToken(user: SignUpUser): Promise<string> {
  const signUpUser: SignUpUser = user

  // ヘッダー
  let headers = new Headers();
  // Basic認証設定
  headers.append('Authorization', `basic ${btoa(`${user.username}:${user.password}`)}`)
  headers.append('Content-Type', 'application/json')

  // API URL
  const url = "http://localhost:8080/data-manipulation/auth/token";

  // リクエストパラメタ
  const requestParams = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(signUpUser)
  }

  const fetchProcess = async (): Promise<string> => {
    // リクエスト実行
    return await fetch(url, requestParams)
      .then(response => response.text())
      .then(text => {
        if (!text) {
          // 取得結果が空の場合
          throw new Error('トークンの取得に失敗しました')

        } else {
          // 取得できた場合
          return text;
        }
      })
  }

  return fetchProcess()
}

export { requestAllClasses, requestAllProperties, requestAllObjects, requestClassPropertyRelationsByDataClassId, requestAddClass, requestAddProperty, requestAddObject, requestAddClassPropertyRelation, requestUpdateClass, requestUpdateProperty, requestCreatingUser, requestIssuingToken }