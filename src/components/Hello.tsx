import React, { useState } from 'react'
import { Button, TextField } from '@mui/material'

/**
 * ユーザー作成REST API処理検証クラス
 * @returns 
 */
function Hello() {
  const [data, setData] = useState(undefined)

  const FetchData = () => {
    /**
     * サインアップユーザー
     */
    interface SignUpUser {
      username: string;
      password: string;
    }

    const signUpUser: SignUpUser = {
      username: 'ユーザー1',
      password: 'password'
    }

    const url = "http://localhost:8080/data-manipulation/auth/signup";
    const requestParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signUpUser)
    }

    fetch(url, requestParams)
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => alert(error));

    console.log(data);
  };

  return (
    <div className="Hello">
      <Button variant="contained" onClick={() => FetchData()}>ボタン</Button>
      <TextField id="outlined-basic" label="入力" variant="outlined" />
    </div>
  )
}

export default Hello