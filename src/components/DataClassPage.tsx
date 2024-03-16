import React, { useEffect, useState } from 'react'
import './DataClassPage.css'
import AddIcon from '@mui/icons-material/Add'
import { Button, List, ListItemButton, ListItemText, Paper, Stack } from '@mui/material'
import { DataClass, DataProperty } from '../domains/DomainTypes'
import { requestAllClasses, requestAllProperties } from './RestApiUtils'
import DataClassEditDialog from './DataClassEditDialog'
import DataPropertyEditDialog from './DataPropertyEditDialog'

/**
 * データクラスページを生成する。
 * @returns データクラスページ
 */
function DataClassPage() {
  // データクラス一覧
  const [dataclasses, setDataClasses] = useState<DataClass[]>([]);
  // データクラス所有プロパティ一覧
  const [ownedDataProperties, setOwnedDataProperties] = useState<DataProperty[]>([])
  // データプロパティ一覧
  const [dataProperties, setDataProperties] = useState<DataProperty[]>([]);
  // データプロパティ選択インデックス一覧
  const [selectedPropertyIndices, setSelectedPropertyIndices] = useState<number[]>([]);

  // データクラス選択インデックス
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  // データクラス編集ダイアログ表示状態
  const [openClassEditDialog, setOpenClassEditDialog] = useState(false);
  // データクラス編集ダイアログで開いている要素
  const [selectedDataClassItem, setSelectedDataClassItem] = useState<DataClass | undefined>(undefined);

  // データプロパティ選択インデックス
  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(0);
  // データプロパティ編集ダイアログ表示状態
  const [openPropertyEditDialog, setOpenPropertyEditDialog] = useState(false);
  // データプロパティ編集ダイアログで開いている要素
  const [selectedDataPropertyItem, setSelectedDataPropertyItem] = useState<DataProperty | undefined>(undefined);

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
      setOwnedDataProperties(rawProperties);
    };

    // 全データクラス取得 (REST API)
    requestAllClasses().then(result => setDataClasses(result));
    // 全プロパティ取得 (REST API)
    requestAllProperties().then(result => setDataProperties(result));
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

  // データプロパティ編集ダイアログ表示ハンドラ
  const handleOpenPropertyEditDialog = () => {
    setOpenPropertyEditDialog(true)
  }

  // データプロパティ編集ダイアログ非表示ハンドラ
  const handleClosePropertyEditDialog = () => {
    setOpenPropertyEditDialog(false)
  }

  // データプロパティ追加ボタン押下ハンドラ
  const handleAddPropertyButton = () => {
    setSelectedDataPropertyItem(undefined)
    setOpenPropertyEditDialog(true)
  }

  /**
   * データプロパティ一覧 選択ハンドラ
   * @param event マウスイベント
   * @param index  選択要素インデックス
   */
  const handlelPropertyItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    // 現状の選択インデックス一覧格納用
    const currentSelectedIndices: number[] = [];
    if (event.ctrlKey) {
      // 複数選択時
      // 選択中の状況を追加
      currentSelectedIndices.push(...selectedPropertyIndices)
      // 今回選択された要素を追加
      currentSelectedIndices.push(index)
      setSelectedPropertyIndices(currentSelectedIndices)

    } else {
      // 単一選択時
      currentSelectedIndices.push(index)
      setSelectedPropertyIndices(currentSelectedIndices)
    }
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

  /**
   * データプロパティ一覧 ダブルクリックハンドラ
   * @param event マウスイベント
   * @param index ダブルクリック要素インデックス
   */
  const handlePropertyItemDoubleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedPropertyIndex(index);
    setSelectedDataPropertyItem(dataProperties.at(index))
    handleOpenPropertyEditDialog();
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
            <Button variant='text' onClick={handleAddPropertyButton} startIcon={<AddIcon />} >プロパティの追加</Button>
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
      <div className='ownedProperties'>
        <Paper style={{ height: `calc(100vh - ${headerHeight}px)`, overflow: 'auto' }}>
          <nav aria-label='dataproperties list'>
            <List>
              {ownedDataProperties.map((item, index) => (
                <ListItemButton key={index}>
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
                <ListItemButton key={index} selected={selectedPropertyIndices.includes(index)}
                  onClick={(event) => handlelPropertyItemClick(event, index)}
                  onDoubleClick={(event) => handlePropertyItemDoubleClick(event, index)}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              ))}
            </List>
          </nav>
        </Paper>
        <DataPropertyEditDialog open={openPropertyEditDialog} onClose={handleClosePropertyEditDialog}
          datapropertyItem={selectedDataPropertyItem} dataclasses={dataclasses} />
      </div>
    </div >
  );
}

export default DataClassPage