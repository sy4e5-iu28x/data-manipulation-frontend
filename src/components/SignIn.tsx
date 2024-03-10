import './SignIn.css'
import { Button, TextField } from '@mui/material';
import React from 'react'

/**
 * ログイン画面を生成する。
 * @returns ログイン画面
 */
function SignIn() {
  // HTML生成
  return (
    <div>
      <div className='container' >
        <TextField label='ユーザー名' variant='standard' type='text' />
        <TextField label='パスワード' variant='standard' type='password' />
        <Button variant='contained' >ログイン</Button>
        <Button variant='text' >アカウントを作成する</Button>
      </div>
    </div>
  );
}

export default SignIn