import React, { useEffect, useState } from 'react'
import './DataClassPage.css'
import AddIcon from '@mui/icons-material/Add'
import { Button, List, ListItemButton, ListItemText, Menu, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { DataClass, DataClassDataPropertyRelation, DataProperty } from '../domains/DomainTypes'
import { requestAddClassPropertyRelation, requestAllClasses, requestAllProperties, requestPropertyClassRelationsByDataClassId as requestClassPropertyRelationsByDataClassId, requestPropertyClassRelationsByDataClassId } from './RestApiUtils'
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
  const [ownedDataProperties, setOwnedDataProperties] = useState<DataProperty[] | undefined[]>()
  // データプロパティ一覧
  const [dataProperties, setDataProperties] = useState<DataProperty[]>([]);
  // データプロパティ選択インデックス一覧
  const [selectedPropertyIndices, setSelectedPropertyIndices] = useState<number[]>([]);

  // データクラス選択インデックス
  const [selectedClassIndex, setSelectedClassIndex] = useState(-1);
  // データクラス編集ダイアログ表示状態
  const [openClassEditDialog, setOpenClassEditDialog] = useState(false);
  // データクラス編集ダイアログで開いている要素
  const [selectedDataClassItem, setSelectedDataClassItem] = useState<DataClass | undefined>(undefined);

  // データプロパティ選択インデックス
  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(-1);
  // データプロパティ編集ダイアログ表示状態
  const [openPropertyEditDialog, setOpenPropertyEditDialog] = useState(false);
  // データプロパティ編集ダイアログで開いている要素
  const [selectedDataPropertyItem, setSelectedDataPropertyItem] = useState<DataProperty | undefined>(undefined);
  // 右クリック対象 データプロパティ
  const [contextTargetPropertyItem, setContextTargetPropertyItem] = useState<DataProperty | undefined>();

  // 選択クラスに属するプロパティ一覧
  const [selectedClassOwnedProperties, setSelectedClassOwnedProperties] = useState<DataProperty[]>([]);

  type MouseContext = {
    mouseX: number;
    mouseY: number;
  }
  const [mouseContextMenu, setMouseContextMenu] = React.useState<MouseContext | null>(null)

  // 初回設定
  useEffect(() => {
    // データ読み込み
    loadData();

    // デフォルト選択データクラスインデックス
    const DEFAULT_SELECTED_CLASS_INDEX: number = 0
    // デフォルト選択プロパティインデックス
    const DEFAULT_SELECTED_PROPERTY_INDEX: number = 0
    // データクラス選択インデックス指定
    handleGetOwnedDataProperties(selectedClassIndex === -1 ? DEFAULT_SELECTED_CLASS_INDEX : selectedClassIndex)
    setSelectedClassIndex(selectedClassIndex === -1 ? DEFAULT_SELECTED_CLASS_INDEX : selectedClassIndex)
    // データプロパティ選択インデックス指定
    setSelectedPropertyIndex(selectedPropertyIndex === -1 ? DEFAULT_SELECTED_PROPERTY_INDEX : selectedPropertyIndex)
  }, []);

  // ダイアログ表示・非表示遷移時
  useEffect(() => {
    // データ読み込み
    loadData();
  }, [selectedClassIndex, dataclasses, openClassEditDialog, openPropertyEditDialog])

  // データ読み込み処理
  const loadData = () => {
    // 全データクラス取得 (REST API)
    requestAllClasses().then(result => {
      setDataClasses(result);
      // 要素が1以上の場合戦闘要素を選択状態にする。
      if (result.length > 0) {
        setSelectedClassIndex(0);
        setSelectedDataClassItem(result.at(0));
      }
    });
    // 全プロパティ取得 (REST API)
    requestAllProperties().then(result => setDataProperties(result));
    // 選択クラス所有プロパティ一覧取得
    handleGetOwnedDataProperties(dataclasses.at(selectedClassIndex)?.id ?? 0)
  }

  // 右クリックメニューオープンハンドラ
  const handleOpenContextMenu = (event: React.MouseEvent<HTMLElement>, index: number) => {
    event.preventDefault();
    // 右クリックされたデータプロパティの保持
    setContextTargetPropertyItem(dataProperties.at(index))

    const newMouseContext: MouseContext = {
      mouseX: event.clientX,
      mouseY: event.clientY
    }
    setMouseContextMenu(newMouseContext)
  }

  // 右クリックメニュークローズハンドラ
  const handleCloseContextMenu = () => {
    setMouseContextMenu(null)
  }

  // 選択済みデータクラスへのデータプロパティ追加ハンドラ
  const handleAddDataPropertyToSelectedDataClass = () => {
    // 右クリックメニューを閉じる
    handleCloseContextMenu()
    const newClassPropertyRelation: DataClassDataPropertyRelation = {
      id: -1,
      dataclassId: selectedDataClassItem?.id ?? -1,
      datapropertyId: contextTargetPropertyItem?.id ?? -1
    }
    requestAddClassPropertyRelation(newClassPropertyRelation).then(item => {

      handleGetOwnedDataProperties(selectedDataClassItem?.id ?? -1)
    })
  }

  // データクラス所有プロパティ一覧取得ハンドラ
  const handleGetOwnedDataProperties = (selectedDataClassId: number) => {
    // データクラス所有プロパティ一覧取得 (REST API)
    requestClassPropertyRelationsByDataClassId(selectedDataClassItem?.id ?? selectedDataClassId).then(items => {
      return items.map(item => {
        return dataProperties.find(dataProperty => dataProperty.id === item.datapropertyId);
      }).filter((item): item is Exclude<typeof item, undefined> => item !== undefined)
    }).then(mappedItems => setOwnedDataProperties(mappedItems))
  }

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
          {dataclasses.length === 0 ? <Typography sx={{ color: 'grey', padding: '30px' }}>クラスを追加してください</Typography> : <></>}
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
          {ownedDataProperties?.length === 0 ? <Typography sx={{ color: 'grey', padding: '30px' }}>選択クラスが持つプロパティはありません</Typography> : <></>}
          <nav aria-label='dataproperties list'>
            <List>
              {ownedDataProperties?.map((item, index) => (
                <ListItemButton key={index}>
                  <ListItemText primary={item?.name} />
                </ListItemButton>
              ))}
            </List>
          </nav>
        </Paper>
      </div>
      <div className='properties'>
        <Paper style={{ height: `calc(100vh - ${headerHeight}px)`, overflow: 'auto' }}>
          {dataProperties.length === 0 ? <Typography sx={{ color: 'grey', padding: '30px' }}>プロパティを追加してください</Typography> : <></>}
          <nav aria-label='dataproperties list'>
            <List>
              {dataProperties.map((item, index) => (
                <ListItemButton onContextMenu={(event) => handleOpenContextMenu(event, index)} style={{ cursor: 'context-menu' }} key={index} selected={selectedPropertyIndices.includes(index)}
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
        <Menu open={null !== mouseContextMenu}
          onClose={handleCloseContextMenu}
          anchorReference='anchorPosition'
          anchorPosition={
            null !== mouseContextMenu ? { top: mouseContextMenu.mouseY, left: mouseContextMenu.mouseX } : undefined
          } >
          <Typography sx={{ color: 'primary.main', paddingLeft: '10px', paddingRight: '10px', whiteSpace: 'pre-line' }}>
            {contextTargetPropertyItem?.name}
          </Typography>
          <MenuItem disabled={dataclasses.length === 0} onClick={handleAddDataPropertyToSelectedDataClass} >選択クラスへ追加</MenuItem>
        </Menu>
      </div>
    </div >
  );
}

export default DataClassPage