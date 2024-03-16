import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { DataClass, DataProperty } from '../domains/DomainTypes'
import { requestAddProperty, requestUpdateProperty } from './RestApiUtils';
import { useNavigate } from 'react-router-dom';

/**
 * データプロパティ編集ダイアログを生成する。
 * @param open ダイアログ開閉状態
 * @param onclose ダイアログクローズハンドラ
 * @param datapropertyItem ダイアログ対象データプロパティ
 * @returns  データプロパティダイアログ
 */
function DataPropertyEditDialog({ open, onClose, datapropertyItem, dataclasses }:
  { open: boolean; onClose: () => void; datapropertyItem: DataProperty | undefined; dataclasses: Array<DataClass> }) {
  // 対象のデータプロパティ
  const [targetDataPropertyItem, setTargetPropertyItem] = useState<DataProperty | undefined>()

  // プロパティ名フィールド
  const [propertyNameField, setPropertyNameField] = useState<string | undefined>();

  // データクラス一覧
  const [dataClasses, setDataClasses] = useState<DataClass[]>([])

  // 選択タイプクラス要素
  const [selectedTypeClassItem, setSelectedTypeClassItem] = useState<DataClass | null>()

  // 選択タイプクラスフィールド
  const [inputTypeClassField, setInputTypeClassField] = useState<string | null>();


  // 遷移用
  const navigate = useNavigate()

  // 初回読み込み時
  useEffect(() => {
    // 対象プロパティ選択
    setTargetPropertyItem(datapropertyItem)

    // クラス一覧設定
    setDataClasses(dataclasses)

    // 選択済みタイプクラス設定
    const selectedItem: DataClass | undefined = dataclasses.find(item => item?.id === datapropertyItem?.typeClassId)
    setSelectedTypeClassItem(selectedItem)

    // defined(新規登録時)は空文字を設定する
    setPropertyNameField(datapropertyItem?.name ?? '')
  }, [open]);

  // 保存ボタン押下ハンドラ
  const handleOnClickSaveButton = () => {
    if (targetDataPropertyItem === undefined) {
      // 新規作成時
      // IDは自動採番される
      const newDataClass: DataProperty = {
        id: 0,
        name: propertyNameField ?? '',
        typeClassId: selectedTypeClassItem?.id ?? -1
      }

      // リクエスト
      requestAddProperty(newDataClass)
        .then(item => {
          navigate('/classpage');
        })

    } else {
      // 更新時
      // 入力値で更新する
      const updateClass: DataProperty = {
        id: targetDataPropertyItem.id,
        name: propertyNameField ?? '',
        typeClassId: selectedTypeClassItem?.id ?? -1
      }

      // リクエスト
      requestUpdateProperty(updateClass)
        .then(item => {
          navigate('/classpage');
        })
    };
  }
  // HTML生成
  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>プロパティの編集</DialogTitle>
        <DialogContent style={{ padding: '20px' }}>
          <Stack direction="column" spacing={2}>
            <TextField label='プロパティ名' variant='outlined' multiline style={{ resize: 'both' }}
              onChange={(event) => setPropertyNameField(event.target.value)} value={propertyNameField} />
            <Autocomplete options={dataClasses} style={{ width: 300 }}
              value={selectedTypeClassItem ?? dataclasses.find(item => item.id === datapropertyItem?.typeClassId)}
              onChange={(event: any, newValue: DataClass | null) => { setSelectedTypeClassItem(newValue) }}
              onInputChange={(event, newInputValue) => { setInputTypeClassField(newInputValue) }}
              autoHighlight
              getOptionLabel={(option) => option.name}
              renderOption={(properties, option) => (
                <Box component="li" style={{ padding: '10px' }} {...properties} >{option.name}</Box>
              )}
              renderInput={(params) => (
                <TextField multiline style={{ resize: 'both', whiteSpace: 'normal' }} {...params} label="保持するタイプクラス" />
              )} />
            <Button variant='contained' onClick={handleOnClickSaveButton} startIcon={<AddIcon />} >保存</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default DataPropertyEditDialog
