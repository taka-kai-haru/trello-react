import { FC, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

type Props = {
  title: string;
  message: string;
  onAccept: () => void;
  onClose: () => void;
  open: boolean;
  buttonType: ButtonType;
};

export const CommonDialog: FC<Props> = (props) => {
  const { title, message, onAccept, onClose, open, buttonType } = props;
  const [dialogOpen, setDialogOpen] = useState(false);

  // 承諾（OK または YES ボタンをクリック）した時
  const handleAccept = () => {
    handleClose();
    onAccept();
  };

  // ダイアログクローズ
  const handleClose = () => {
    setDialogOpen(false);
    onClose();
  };

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle>
        <span>{title}</span>
      </DialogTitle>
      <DialogContent>
        <Box>{message}</Box>
      </DialogContent>
      <DialogActions>
        {buttonType === ButtonType.OkOnly && (
          <Button onClick={handleAccept}>OK</Button>
        )}
        {buttonType === ButtonType.YesNo && (
          <>
            <Button onClick={handleAccept}>はい</Button>
            <Button onClick={handleClose}>いいえ</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

// ボタン種別
export enum ButtonType {
  OkOnly = "OkOnly",
  YesNo = "YesNo",
}
