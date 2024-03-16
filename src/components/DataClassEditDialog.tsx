import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { DataClass } from '../domains/DomainTypes'
import { requestAddClass, requestUpdateClass } from './RestApiUtils';
import { useNavigate } from 'react-router-dom';

/**
 * データクラス編集ダイアログを生成する。
 * @param open ダイアログ開閉状態
 * @param onclose ダイアログクローズハンドラ
 * @param dataclassItem ダイアログ対象データクラス
 * @returns  データクラスダイアログ
 */
function DataClassEditDialog({ open, onClose, dataclassItem }: { open: boolean; onClose: () => void; dataclassItem: DataClass | undefined }) {
  // 対象のデータクラス
  const [targetDataClassItem, setTargetDataClassItem] = useState<DataClass | undefined>()

  // クラス名フィールド
  const [classNameField, setClassNameField] = useState<string | undefined>();

  // 遷移用
  const navigate = useNavigate()

  // 初回読み込み時
  useEffect(() => {
    setTargetDataClassItem(dataclassItem)
    // defined(新規登録時)は空文字を設定する
    setClassNameField(dataclassItem?.name ?? '')
  }, [open]);

  // 保存ボタン押下ハンドラ
  const handleOnClickSaveButton = () => {
    if (targetDataClassItem === undefined) {
      // 新規作成時
      // IDは自動採番される
      const newDataClass: DataClass = {
        id: 0,
        name: classNameField ?? '',
        type: 'UserDefinedClass'
      }

      // リクエスト
      requestAddClass(newDataClass)
        .then(item => {
          navigate('/classpage');
        })

    } else {
      // 更新時
      // 入力値で更新する
      const updateClass: DataClass = {
        id: targetDataClassItem.id,
        name: classNameField ?? '',
        type: targetDataClassItem.type
      }

      // リクエスト
      requestUpdateClass(updateClass)
        .then(item => {
          navigate('/classpage');
        })
    };
  }
  // HTML生成
  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>クラスの編集</DialogTitle>
        <DialogContent style={{ padding: '20px' }}>
          <Stack direction="column" spacing={2}>
            <TextField label='クラス名' variant='outlined' multiline style={{ resize: 'both' }} onChange={(event) => setClassNameField(event.target.value)} value={classNameField} />
            <Button variant='contained' onClick={handleOnClickSaveButton} startIcon={<AddIcon />} >保存</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default DataClassEditDialog