import React, { useEffect, useState } from 'react'
import './DataClassPage.css'
import AddIcon from '@mui/icons-material/Add'
import { Button, List, ListItemButton, ListItemText, Paper, Stack } from '@mui/material'
import { DataClass, DataProperty } from '../domains/DomainTypes'
import { requestAllClasses } from './RestApiUtils'
import DataClassEditDialog from './DataClassEditDialog'

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
  // データクラス編集ダイアログ表示状態
  const [openClassEditDialog, setOpenClassEditDialog] = useState(false);
  // データクラス編集ダイアログで開いている要素
  const [selectedDataClassItem, setSelectedDataClassItem] = useState<DataClass | undefined>(undefined);

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

  // データクラス編集ダイアログ表示ハンドラ
  const handleOpenClassEditDialog = () => {
    setOpenClassEditDialog(true)
  }

  // データクラス編集ダイアログ非表示ハンドラ
  const handleCloseDialog = () => {
    setOpenClassEditDialog(false)
  }

  // データクラス追加ボタン押下ハンドラ
  const handleAddClassButton = () => {
    setSelectedDataClassItem(undefined)
    setOpenClassEditDialog(true)
  }

  /**
   * データクラス一覧 選択ハンドラ
   * @param event マウスイベント
   * @param index 選択要素インデックス
   */
  const handleClassItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedDataClassItem(dataclasses.at(index))
    setSelectedClassIndex(index);
  }

  /**
   * データクラス一覧 ダブルクリックハンドラ
   * @param event マウスイベント
   * @param index ダブルクリック要素インデックス
   */
  const handleClassItemDoubleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedClassIndex(index);
    setSelectedDataClassItem(dataclasses.at(index))
    handleOpenClassEditDialog();
  }

  // タブやボタンエリアなどのヘッダー高さ
  const headerHeight: number = 142;

  // HTML生成
  return (
    <div className='contents'>
      <div className='buttons'>
        <Paper style={{ padding: '5px' }}>
          <Stack direction="row" spacing={2}>
            <Button variant='text' onClick={handleAddClassButton} startIcon={<AddIcon />}>クラスの追加</Button>
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
                  onClick={(event) => handleClassItemClick(event, index)}
                  onDoubleClick={(event) => handleClassItemDoubleClick(event, index)}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              ))}
            </List>
          </nav>
        </Paper>
        <DataClassEditDialog open={openClassEditDialog} onClose={handleCloseDialog} dataclassItem={selectedDataClassItem} />
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