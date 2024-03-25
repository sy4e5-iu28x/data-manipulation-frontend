import React, { useEffect, useState } from 'react'
import './DataObjectPage.css'
import AddIcon from '@mui/icons-material/Add'
import { Button, Card, CardActionArea, CardContent, Grid, List, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material'
import { DataClass, DataObjectInformation, DataProperty } from '../domains/DomainTypes'
import { requestAllClasses, requestAllObjects, requestAllProperties } from './RestApiUtils'
import DataObjectEditDialog from './DataObjectEditDialog'
import { TYPE_USER_DEFINED_CLASS } from '../domains/Consts'

/**
 * データオブジェクトページを生成する。
 * @returns データオブジェクトページ
 */
function DataObjectPage() {
  // クラス一覧
  const [dataclasses, setDataClasses] = useState<DataClass[]>([]);
  // オブジェクト一覧
  const [dataobjects, setDataObjects] = useState<DataObjectInformation[]>([]);
  // データプロパティ一覧
  const [dataproperties, setDataProperties] = useState<DataProperty[]>([]);

  // 選択インデックス
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);

  // データオブジェクト編集ダイアログ表示状態
  const [openObjectEditDialog, setOpenObjectEditDialog] = useState(false);
  // データオブジェクト編集ダイアログで開いている要素
  const [selectedDataObjectItem, setSelectedDataObjectItem] = useState<DataObjectInformation | undefined>(undefined);

  // 初回データ読み込み
  useEffect(() => {
    // 全データクラス取得 (REST API)
    requestAllClasses().then(result => setDataClasses(result));
    // 全データオブジェクト取得 (REST API)
    requestAllObjects().then(result => setDataObjects(result))
    // 全プロパティ取得 (REST API)
    requestAllProperties().then(result => setDataProperties(result));
  }, []);

  // ダイアログ表示状態変更時処理
  useEffect(() => {
    // 全データオブジェクト取得 (REST API)
    requestAllObjects().then(result => setDataObjects(result))
  }, [openObjectEditDialog])

  /**
   * データクラス一覧 選択ハンドラ
   * @param event マウスイベント
   * @param index 選択要素インデックス
   */
  const handleClassItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedClassIndex(index);
  }

  /**
   * オブジェクト追加ボタン押下ハンドラ
   */
  const handleOnClickAddObjectButton = () => {
    setSelectedDataObjectItem(undefined)
    handleOpenObjectEditDialog()
  }

  /**
   * データクラス編集ダイアログ表示ハンドラ
   */
  const handleOpenObjectEditDialog = () => {
    setOpenObjectEditDialog(true)
  }

  /**
   * データクラス編集ダイアログ非表示ハンドラ
   */
  const handleCloseDialog = () => {
    setOpenObjectEditDialog(false)
  }

  /**
     * データオブジェクト一覧 ダブルクリックハンドラ
     * @param event マウスイベント
     * @param index ダブルクリック要素インデックス
     */
  const handleObjectItemDoubleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    setSelectedDataObjectItem(dataobjects.at(index))
    handleOpenObjectEditDialog();
  }


  // タブやボタンエリアなどのヘッダー高さ
  const headerHeight: number = 142;

  return (
    <div className='contents'>
      <div className='buttons'>
        <Paper style={{ padding: '5px' }}>
          <Stack direction="row" spacing={2}>
            <Button variant='text' onClick={handleOnClickAddObjectButton} startIcon={<AddIcon />}>オブジェクトの追加</Button>
          </Stack>
        </Paper>
      </div>
      <div className='classes'>
        <Paper style={{ height: `calc(100vh - ${headerHeight}px)`, overflow: 'auto' }}>
          <nav aria-label='dataclasses list'>
            {dataclasses.filter(item => item.type === TYPE_USER_DEFINED_CLASS).length === 0 ? <Typography sx={{ color: 'grey', padding: '30px' }}>クラスを追加してください</Typography> : <></>}
            <List>
              {dataclasses.filter(item => item.type === 'UserDefinedClass').map((item, index) => (
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
      <div className='objects' style={{ height: `calc(100vh - ${headerHeight}px)`, overflow: 'auto' }}>
        {dataobjects.length === 0 ? <Typography sx={{ color: 'grey', padding: '30px' }}>オブジェクトを追加してください</Typography> : <></>}
        <Grid container spacing={3} padding={2}>
          {dataobjects.map((item, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card >
                <CardActionArea onDoubleClick={(event) => { handleObjectItemDoubleClick(event, index) }}>
                  <CardContent>
                    <Stack direction='column' spacing={0}>
                      {item.datavalues.map(values => (
                        <Typography sx={{ whiteSpace: 'pre-line' }}>{values.dataContent}</Typography>
                      ))}
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <DataObjectEditDialog open={openObjectEditDialog} onClose={handleCloseDialog} dataclasses={dataclasses} dataproperties={dataproperties} selectedClassIndex={selectedClassIndex} selectedObject={selectedDataObjectItem} />
      </div>
    </div >
  );
}

export default DataObjectPage