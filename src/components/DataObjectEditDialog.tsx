import AddIcon from '@mui/icons-material/Add';
import { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DataClass, DataObjectInformation, DataProperty, DataValue } from '../domains/DomainTypes';
import { requestAddObject, requestClassPropertyRelationsByDataClassId } from './RestApiUtils';
import { TYPE_PRIMITIVE_DEFINED_CLASS, TYPE_PRIMITIVE_STRING_CLASS_NAME, TYPE_USER_DEFINED_CLASS } from '../domains/Consts';

/**
 * データプロパティ編集ダイアログを生成する。
 * @param open ダイアログ開閉状態
 * @param onclose ダイアログクローズハンドラ
 * @param selectedClass 選択クラス
 * @param selectedObject 選択オブジェクト
 * @param dataclasses クラス一覧
 * @param dataobjects オブジェクト一覧
 * @param datapropertyItem ダイアログ対象データプロパティ
 * @returns  データプロパティダイアログ
 */
function DataObjectEditDialog({ open, onClose, selectedClassIndex, selectedObject, dataclasses, dataproperties }:
  { open: boolean; onClose: () => void; selectedClassIndex: number; selectedObject: DataObjectInformation | undefined; dataclasses: Array<DataClass>; dataproperties: Array<DataProperty> }) {
  // 対象のデータオブジェクト
  const [targetDataObject, setTargetObject] = useState<DataObjectInformation | undefined>()

  // データオブジェクト一覧
  const [dataObjects, setDataObjects] = useState<DataObjectInformation[]>([])

  // データクラス一覧
  const [dataClasses, setDataClasses] = useState<DataClass[]>([])

  // データクラス所有プロパティ一覧
  const [ownedDataProperties, setOwnedDataProperties] = useState<DataProperty[]>()

  // 入力フィールド値保持用
  const [inputFields, setInputFileds] = useState<Map<string, string>>(new Map<string, string>())

  // 初回読み込み時
  useEffect(() => {
    if (false === open) {
      // ダイアログを閉じるときに保持内容を消去する
      setInputFileds(new Map<string, string>())

    } else {
      // クラス一覧設定
      setDataClasses(dataclasses)
      // プロパティ項目生成
      generateProperties()
    }
  }, [open]);

  const generateProperties = () => {
    // 選択オブジェクトがない場合(新規作成)は、選択クラスIDを使用する。選択オブジェクトがある場合は、オブジェクトのクラスIDを使用する。
    const objectClassId: number | undefined = selectedObject === undefined ? dataclasses.at(selectedClassIndex)?.id : selectedObject.dataclassId

    // データクラス所有プロパティ一覧取得 (REST API)
    requestClassPropertyRelationsByDataClassId(objectClassId ?? -1).then(items => {
      return items.map(item => {
        return dataproperties.find(dataProperty => dataProperty.id === item.datapropertyId);
      }).filter((item): item is Exclude<typeof item, undefined> => item !== undefined)

    }).then(mappedItems => {
      // プロパティ・値を入力フィールドに反映
      mappedItems.forEach((property: DataProperty, index) => {
        // プロパティに対応する値を取得
        const propertyValue: string = selectedObject?.datavalues?.at(index)?.dataContent ?? ''
        handleAddField(property.id.toString(), propertyValue)
      });
      // プロパティ一覧を保持
      setOwnedDataProperties(mappedItems);
    })
  }

  /**
   * 保存ボタン押下ハンドラ
   */
  const handleOnClickSaveButton = () => {
    // データ値一覧
    const values: DataValue[] = [];
    inputFields.forEach((value: string, key: string) => {
      const newDataValue: DataValue = {
        id: -1,
        dataContent: value,
        savedDateTime: new Date(0)
      }
      values.push(newDataValue)
    })

    /**
     * 保存データオブジェクト情報
     */
    const dataobjectInformation: DataObjectInformation = {
      // IDは自動採番
      dataobjectId: -1,
      dataclassId: dataclasses.at(selectedClassIndex)?.id ?? -1,
      dataproperties: ownedDataProperties ?? [],
      datavalues: values
    }
    // データオブジェクト追加リクエスト(REST API)
    requestAddObject(dataobjectInformation).then(item => onClose())
  }

  /**
   * 入力フィールド保持用useState追加
   * @param key キー(プロパティID)
   * @param value 値
   */
  const handleAddField = (key: string, value: string) => {
    inputFields?.set(key, value)
    setInputFileds(new Map(inputFields))
  }

  /**
   * 入力フィールドuseState更新
   * @param key キー(プロパティID)
   * @param text 値
   */
  const handleChange = (key: string, text: string) => {
    inputFields.set(key, text)
    setInputFileds(new Map(inputFields))
  }

  /**
   * 入力コンポーネントレンダー処理
   * @param dataproperty データプロパティ
   * @returns コンポーネント
   */
  const renderInputComponent = (dataproperty: DataProperty | undefined) => {
    // 保持する入力値に紐づくキー
    const fieldKey: string = dataproperty?.id.toString() ?? ''

    const currentPropertyTypeClass: DataClass | undefined = dataclasses.find(item => item.id === dataproperty?.typeClassId)

    if (currentPropertyTypeClass?.type === TYPE_USER_DEFINED_CLASS) {
      // ユーザー定義クラスの場合
      return (<Autocomplete options={dataClasses} style={{ width: 300 }}
        onChange={(event: any, newValue: DataClass | null) => { }}
        onInputChange={(event, newInputValue) => { handleChange(fieldKey, newInputValue) }}
        autoHighlight
        getOptionLabel={(option) => option.name}
        renderOption={(properties, option) => (
          <Box component="li" style={{ padding: '10px' }} {...properties} >{option.name}</Box>
        )}
        renderInput={(params) => (
          <TextField multiline style={{ resize: 'both', whiteSpace: 'normal' }} {...params} label={dataproperty?.name} />
        )} />);

    } else if (currentPropertyTypeClass?.type === TYPE_PRIMITIVE_DEFINED_CLASS) {
      // 基本定義クラスの場合
      if (currentPropertyTypeClass?.name === TYPE_PRIMITIVE_STRING_CLASS_NAME) {
        // 文字列クラスの場合
        return <TextField label={dataproperty?.name} variant='outlined' multiline value={inputFields.get(fieldKey)}
          style={{ resize: 'both' }} onChange={(event) => handleChange(fieldKey, event.target.value)} />
      }
    }
  }

  // HTML生成
  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>オブジェクトの編集</DialogTitle>
        <DialogContent style={{ padding: '20px' }}>
          <Stack direction="column" spacing={2}>
            {ownedDataProperties?.map(property => renderInputComponent(property))}
            <Button variant='contained' onClick={handleOnClickSaveButton} startIcon={<AddIcon />} >保存</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default DataObjectEditDialog
