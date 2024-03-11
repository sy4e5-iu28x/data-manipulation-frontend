import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate, Outlet } from 'react-router-dom'
import { Box, Tabs, Tab, AppBar } from '@mui/material'
import SignIn from './SignIn';
import DataClassPage from './DataClassPage';
import DataObjectPage from './DataObjectPage';
import { isLoggedIn } from './AuthUtils'

/**
 * Tabタグに必要な属性を適用する。
 * @param index Tabインデックス
 * @returns 属性情報
 */
function applyProperties(index: number) {
  return {
    id: `simple-tab-${index}`,
    'area-controls': `simple-tabpaanel-${index}`,
  };
}

/**
 * ナビゲーション用のタブメニューを生成する。
 * @returns ナビゲーション用のタブメニュー
 */
export default function TabNavigation() {
  // 選択状態タブインデックス
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  // ロケーション
  const location = useLocation();

  // 選択状態変更時ハンドラ
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTabIndex(newValue);
  };

  // タブメニューインデックスと、URLパスペア
  const pathSelectedTabRelations: { [key: string]: number } = {
    '/classpage': 0,
    '/objectpage': 1,
  }

  // 読み込み時に、URLパスに基づき選択タブを更新する
  useEffect(() => {
    if (location.pathname in pathSelectedTabRelations) {
      setSelectedTabIndex(pathSelectedTabRelations[location.pathname]);
    }
  }, [location.pathname]);

  // ログイン要否判定
  const AuthRequiredRoutes = () => {
    if (isLoggedIn()) {
      // ログイン済み
      return <Outlet />

    } else {
      // 未ログイン
      return (
        <Navigate to='/signin' />
      );
    }
  }

  // HTML生成
  return (
    <div className="tab">
      <AppBar position="static" color="transparent" style={{ position: "fixed", top: 0 }} />
      <Box sx={{ width: '100%' }} hidden={!isLoggedIn()}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTabIndex} onChange={handleChange} aria-label="basic tab example">
            <Tab label="クラス" {...applyProperties(0)} component={Link} to={"/classpage"} />
            <Tab label="オブジェクト" {...applyProperties(1)} component={Link} to={"/objectpage"} />
          </Tabs>
        </Box>
      </Box>
      <Routes>
        <Route element={<AuthRequiredRoutes />} >
          <Route path="/" element={<Navigate to='/classpage' />} />
          <Route path="/classpage" element={<DataClassPage />} />
          <Route path="/objectpage" element={<DataObjectPage />} />
        </Route>
        <Route path="/signin" element={isLoggedIn() ? <Navigate to="/" /> : <SignIn />} />
      </Routes>
    </div>
  );
}