import React, { useEffect, useState } from 'react'
import './DataObjectPage.css'
import AddIcon from '@mui/icons-material/Add'
import { Button, Card, CardActionArea, CardContent, Grid, List, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material'
import { DataClass } from '../domains/DomainTypes'
import { requestAllClasses } from './RestApiUtils'

/**
 * データオブジェクトページを生成する。
 * @returns データオブジェクトページ
 */
function DataObjectPage() {
  // クラス一覧
  const [dataclasses, setDataClasses] = useState<DataClass[]>([]);
  // オブジェクト一覧
  const [dataObjects, setDataObjects] = useState<DataClass[]>([]);

  // 選択インデックス
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);

  // 初回データ読み込み
  useEffect(() => {
    // ダミークラスデータ作成
    let dummyObjects: Array<DataClass> = []
    for (let i: number = 0; i < 10; i++) {
      let dummyObject: DataClass = {
        id: i,
        name: `ダミーオブジェクト${i}`,
        type: 'UserDefinedClass'
      }
      dummyObjects.push(dummyObject);
      setDataObjects(dummyObjects);
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

  return (
    <div className='contents'>
      <div className='buttons'>
        <Paper style={{ padding: '5px' }}>
          <Stack direction="row" spacing={2}>
            <Button variant='text' startIcon={<AddIcon />}>オブジェクトの追加</Button>
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
      <div className='objects' style={{ height: `calc(100vh - ${headerHeight}px)`, overflow: 'auto' }}>
        <Grid container spacing={3} padding={2}>
          {dataObjects.map((item, index) => (
            <Grid item xs={6} sm={6} md={3} key={index}>
              <Card >
                <CardActionArea>
                  <CardContent>
                    <Stack direction='column' spacing={0}>
                      <Typography sx={{ whiteSpace: 'pre-line' }}>{item.id}</Typography>
                      <Typography sx={{ whiteSpace: 'pre-line' }}>{item.name}</Typography>
                      <Typography sx={{ whiteSpace: 'pre-line' }}>{item.type}</Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div >
  );
}

export default DataObjectPage