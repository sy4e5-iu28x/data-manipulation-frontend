
/** 認証ユーティリティ */

/**
 * セッションストレージ キー: トークン
 */
const tokenKey = 'token'

/**
 * 保存したトークンを取得する。
 * @returns トークン
 */
function getToken(): string {
  return sessionStorage.getItem(tokenKey) as string;
}

/**
 * トークンを保存する。
 * @param token トークン
 */
function saveToken(token: string): void {
  sessionStorage.setItem(tokenKey, token);
}

/**
 * ログイン状況を取得する。
 * @returns true:ログイン済み、false:未ログイン
 */
function isLoggedIn(): boolean {
  const token: string = sessionStorage.getItem(tokenKey) as string
  return token ? true : false;
}

export { getToken, saveToken, isLoggedIn }