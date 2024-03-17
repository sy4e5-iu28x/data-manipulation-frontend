import './SignIn.css'
import { Alert, Button, Snackbar, TextField } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { saveToken } from './AuthUtils';
import { SignUpUser } from '../domains/DomainTypes'
import { requestCreatingUser, requestIssuingToken } from './RestApiUtils'

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
  // スナックバー表示状態
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // スナックバーメッセージ
  const [snackbarMessage, setSnackbarMessage] = useState('');
  // スナックバーアラート重大度
  const [snackbarAlertSeverity, setSnackbarAlertSeverity] = useState('')

  // ユーザー名入力欄ハンドラ
  const handleUserNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUserName(event.target.value)
  }

  // パスワード入力欄ハンドラ
  const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(event.target.value)
  }

  // アラート重大度 エラー
  const ALERT_SERVERITY_ERROR = 'error'
  // アラート重大度 成功
  const ALERT_SERVERITY_SUCCESS = 'success'

  // サインアップ処理
  const onClickSignUp = () => {
    // ユーザー情報
    const signUpUser: SignUpUser = {
      username: inputUserName,
      password: inputPassword
    }

    // リクエスト実行
    requestCreatingUser(signUpUser)
      .then(value => {
        setSnackbarAlertSeverity(ALERT_SERVERITY_SUCCESS);
        setSnackbarMessage('アカウントを作成しました。')
        setOpenSnackbar(true)
      })
      .catch(error => {
        setSnackbarAlertSeverity(ALERT_SERVERITY_ERROR);
        setSnackbarMessage('アカウント作成に失敗しました。\r\n別のユーザー名で作成してください。')
        setOpenSnackbar(true)
      });
  }

  // ログイン処理
  const onClickLogin = () => {
    const signUpUser: SignUpUser = {
      username: inputUserName,
      password: inputPassword
    }

    // リクエスト実行
    requestIssuingToken(signUpUser)
      .then(text => {
        // 取得結果保存し、遷移する
        saveToken(text);
        navigate('/classpage')
      })
      .catch(error => {
        // トークン取得できていない場合
        setSnackbarAlertSeverity(ALERT_SERVERITY_ERROR);
        setSnackbarMessage('ログインに失敗しました。\r\nユーザー名とパスワードをご確認ください。')
        setOpenSnackbar(true)
        // ユーザー名、パスワード欄をクリア
        setInputUserName('')
        setInputPassword('')
      });
  }

  // スナックバーに表示するアラートの生成
  const renderSnackbarAlert = () => {
    if (snackbarAlertSeverity === ALERT_SERVERITY_ERROR) {
      // エラー時
      return <Alert severity='error' sx={{ textAlign: 'left', whiteSpace: 'pre-line' }}>{snackbarMessage}</Alert>

    } else if (snackbarAlertSeverity === ALERT_SERVERITY_SUCCESS) {
      // 成功時
      return <Alert severity='success' sx={{ textAlign: 'left', whiteSpace: 'pre-line' }}>{snackbarMessage}</Alert>
    }
  }

  // HTML生成
  return (
    <div>
      <div className='container' >
        <TextField label='ユーザー名' variant='standard' type='text' onChange={handleUserNameInputChange} value={inputUserName} />
        <TextField label='パスワード' variant='standard' type='password' onChange={handlePasswordInputChange} value={inputPassword} />
        <Button variant='contained' onClick={onClickLogin} >ログイン</Button>
        <Button variant='text' onClick={onClickSignUp}>アカウントを作成する</Button>
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar}
          onClose={(event) => setOpenSnackbar(false)} message={snackbarMessage}>
          {renderSnackbarAlert()}
        </Snackbar>
      </div>
    </div>
  );
}

export default SignIn