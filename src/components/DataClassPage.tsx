import React, { useEffect, useState } from 'react'
import './DataClassPage.css'
import AddIcon from '@mui/icons-material/Add'
import { Button, List, ListItemButton, ListItemText, Paper, Stack } from '@mui/material'
import { DataClass, DataProperty } from '../domains/DomainTypes'
import { requestAllClasses } from './RestApiUtils'

/**
 * データクラスページを生成する。
 * @returns データクラスページ
 */
function DataClassPage() {
  // データクラス一覧
  const [dataclasses, setDataClasses] = useState<DataClass[]>([]);
  // データプロパティ一覧
  const [dataProperties, setDataProperties] = useState<DataProperty[]>([]);
  // データクラス選択インデックス
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);

  // 初回データ読み込み
  useEffect(() => {
    // ダミープロパティデータ
    let rawProperties: Array<DataProperty> = []
    for (let i: number = 0; i < 10; i++) {
      let dummyProperty: DataProperty = {
        id: i,
        name: `ダミープロパティ${i}`,
        typeClassId: i
      }
      rawProperties.push(dummyProperty);
      setDataProperties(rawProperties);
    };

    // ダミークラスデータ
    let rawClasses: Array<DataClass> = []
    for (let i: number = 0; i < 10; i++) {
      let dummyClass: DataClass = {
        id: i,
        name: `ダミークラス${i}`,
        type: 'UserDefinedClass'
      }
      rawClasses.push(dummyClass);
      setDataClasses(rawClasses);
    };

    // 全データクラス取得 (REST API)
    requestAllClasses().then(result => setDataClasses(result));
  }, []);

  /**
   * データクラス一覧 選択ハンドラ
   * @param event マウスイベント
   * @param index 選択要素インデックス
   */
  const handleClassItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedClassIndex(index);
  }
  // タブやボタンエリアなどのヘッダー高さ
  const headerHeight: number = 142;

  // HTML生成
  return (
    <div className='contents'>
      <div className='buttons'>
        <Paper style={{ padding: '5px' }}>
          <Stack direction="row" spacing={2}>
            <Button variant='text' startIcon={<AddIcon />}>クラスの追加</Button>
            <Button variant='text' startIcon={<AddIcon />} >プロパティの追加</Button>
          </Stack>
        </Paper>
      </div>
      <div className='classes'>
        <Paper style={{ height: `calc(100vh - ${headerHeight}px)`, overflow: 'auto' }}>
          <nav aria-label='dataclasses list'>
            <List>
              {dataclasses.map((item, index) => (
                <ListItemButton
                  key={index} selected={selectedClassIndex === index}
                  onClick={(event) => handleClassItemClick(event, index)}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              ))}
            </List>
          </nav>
        </Paper>
      </div>
      <div className='properties'>
        <Paper style={{ height: `calc(100vh - ${headerHeight}px)`, overflow: 'auto' }}>
          <nav aria-label='dataproperties list'>
            <List>
              {dataProperties.map((item, index) => (
                <ListItemButton key={index}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              ))}
            </List>
          </nav>
        </Paper>
      </div>
    </div >
  );
}

export default DataClassPage