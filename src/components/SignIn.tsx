import './SignIn.css'
import { Button, TextField } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { saveToken } from './AuthUtils';

/**
 * サインアップユーザー
 */
interface SignUpUser {
  /**
   * ユーザー名
   */
  username: string;

  /**
   * パスワード
   */
  password: string;
}

/**
 * ログイン画面を生成する。
 * @returns ログイン画面
 */
function SignIn() {
  // 遷移用
  const navigate = useNavigate();

  // ユーザー名入力欄
  const [inputUserName, setInputUserName] = useState('');
  // パスワード入力欄
  const [inputPassword, setInputPassword] = useState('');

  // ユーザー名入力欄ハンドラ
  const handleUserNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUserName(event.target.value)
  }

  // パスワード入力欄ハンドラ
  const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(event.target.value)
  }

  // サインアップ処理
  const onClickSignUp = () => {
    // ユーザー情報
    const signUpUser: SignUpUser = {
      username: inputUserName,
      password: inputPassword
    }

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

    // リクエスト実行
    fetch(url, requestParams)
      .then(response => response.json())
      .then(json => json as SignUpUser)
      .catch(error => alert(error));
  }

  // ログイン処理
  const onClickLogin = () => {
    const signUpUser: SignUpUser = {
      username: inputUserName,
      password: inputPassword
    }

    // ヘッダー
    let headers = new Headers();
    // Basic認証設定
    headers.append('Authorization', `basic ${btoa(`${inputUserName}:${inputPassword}`)}`)
    headers.append('Content-Type', 'application/json')

    // API URL
    const url = "http://localhost:8080/data-manipulation/auth/token";

    // リクエストパラメタ
    const requestParams = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(signUpUser)
    }

    // リクエスト実行
    fetch(url, requestParams)
      .then(response => response.text())
      .then(text => saveToken(text))
      .then(text => navigate('/classpage'))
      .catch(error => alert(error));
  }

  // HTML生成
  return (
    <div>
      <div className='container' >
        <TextField label='ユーザー名' variant='standard' type='text' onChange={handleUserNameInputChange} />
        <TextField label='パスワード' variant='standard' type='password' onChange={handlePasswordInputChange} />
        <Button variant='contained' onClick={onClickLogin} >ログイン</Button>
        <Button variant='text' onClick={onClickSignUp}>アカウントを作成する</Button>
      </div>
    </div>
  );
}

export default SignIn