/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

  // openの値が変化した時
  useEffect(() => setDialogOpen(open), [open]);

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
    <Dialog
      open={dialogOpen}
      PaperProps={{
        style: {
          backgroundColor: "#2b2b2b",
          color: "#e4e4e4",
        },
      }}
    >
      <DialogTitle>
        <span css={titleStyle}>{title}</span>
      </DialogTitle>
      <DialogContent>
        <Box css={messageStyle}>{message}</Box>
      </DialogContent>
      <DialogActions>
        {buttonType === ButtonType.OkOnly && (
          <ThemeProvider theme={buttonTheme}>
            <Button variant="text" onClick={handleAccept}>
              OK
            </Button>
          </ThemeProvider>
        )}
        {buttonType === ButtonType.YesNo && (
          <>
            <ThemeProvider theme={buttonTheme}>
              <Button variant="text" onClick={handleAccept}>
                はい
              </Button>
            </ThemeProvider>
            <ThemeProvider theme={buttonTheme}>
              <Button variant="text" onClick={handleClose}>
                いいえ
              </Button>
            </ThemeProvider>
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

const buttonTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        text: {
          color: "#e4e4e4", // ボタンのテキスト色を白に設定
          "&:hover": {
            color: "white", // ボタンにカーソルを合わせた時の文字色を白に設定
          },
          "&:focus": {
            color: "white", // ボタンがフォーカスされた時の文字色を白に設定
          },
        },
      },
    },
  },
});

const titleStyle = css`
  color: #e4e4e4;
`;

const messageStyle = css`
  color: #e4e4e4;
`;
