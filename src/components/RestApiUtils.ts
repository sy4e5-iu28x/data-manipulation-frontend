import { DataClass, SignUpUser } from '../domains/DomainTypes'
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
  }

  return fetchProcess()
}

export { requestAllClasses, requestCreatingUser, requestIssuingToken }