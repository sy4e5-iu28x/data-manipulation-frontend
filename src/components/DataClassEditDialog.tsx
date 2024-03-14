import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { DataClass } from '../domains/DomainTypes'

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

  // 初回読み込み時
  useEffect(() => {
    setTargetDataClassItem(dataclassItem)
    // defined(新規登録時)は空文字を設定する
    setClassNameField(dataclassItem?.name ?? '')
  }, [open]);

  // HTML生成
  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>クラスの編集</DialogTitle>
        <DialogContent style={{ padding: '20px' }}>
          <Stack direction="column" spacing={2}>
            <TextField label='クラス名' variant='outlined' onChange={(event) => setClassNameField(event.target.value)} value={classNameField} />
            <Button variant='contained' startIcon={<AddIcon />} >保存</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default DataClassEditDialog