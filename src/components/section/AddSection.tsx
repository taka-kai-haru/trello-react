/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { Button, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

type Props = {
  style?: any;
  addSection: (title: string) => void;
};

export const AddSection: FC<Props> = (props) => {
  const { style, addSection } = props;
  const [inputTitle, setInputTitle] = useState("");
  const [addSectionEdit, setAddSectionEdit] = useState(false);

  const handleClick = () => {
    setAddSectionEdit(true);
  };

  const handleSubmit = () => {
    if (inputTitle !== "") {
      addSection(inputTitle);
      setInputTitle("");
      setAddSectionEdit(false);
    }
  };

  const handleAddButtonClicked = () => {
    if (inputTitle !== "") {
      addSection(inputTitle);
      setInputTitle("");
      setAddSectionEdit(false);
    }
  };

  const closeIconHandleClick = () => {
    setInputTitle("");
    setAddSectionEdit(false);
  };

  return (
    <div css={addSectionStyle}>
      <div css={addSectionEdit ? style : generalAddSectionStyle}>
        {addSectionEdit ? (
          <div css={inputAreaStyle}>
            <form onSubmit={handleSubmit}>
              <WhiteTextField
                id="outlined-basic"
                variant="outlined"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                autoFocus
                autoComplete="off"
                inputProps={{
                  maxLength: 13,
                }}
              />
            </form>
            <div css={sectionTitleButtonArea}>
              <ThemeProvider theme={theme}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleAddButtonClicked}
                  disabled={!inputTitle}
                >
                  追加
                </Button>
              </ThemeProvider>
              <CloseIcon onClick={closeIconHandleClick} css={closeIcon} />
            </div>
          </div>
        ) : (
          <div onClick={handleClick} css={addButtonAreaStyle}>
            <AddIcon />
            <span css={titleArea}>リストを追加</span>
          </div>
        )}
      </div>
    </div>
  );
};

const addSectionStyle = css`
  width: 320px;
  min-width: 320px;
  margin: 0 16px 0 0;
`;

const generalAddSectionStyle = css`
  width: 320px;
  min-width: 320px;
  background: rgb(30, 25, 31);
  background: linear-gradient(
    126deg,
    rgb(38, 35, 38) 0%,
    rgba(51, 45, 54, 1) 96%
  );
  padding: 10px 5px 10px 5px;
  border-radius: 8px;
  margin: 0 16px 0 0;
  opacity: 0.6;
  cursor: pointer;
`;

const inputAreaStyle = css`
  margin: 0 15px 0 15px;
`;

const addButtonAreaStyle = css`
  margin: 5px 10px 0 10px;
`;

const sectionTitleButtonArea = css`
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
`;

const closeIcon = css`
  cursor: pointer;
  margin-left: 10px;
  margin-top: 5px;
`;

const titleArea = css`
  vertical-align: top;
  padding: 0 3px 0 3px;
`;

const whiteInput = css`
  input {
    font-size: 1.2rem;
    font-weight: 700;
    color: #e4e4e4;
    padding: 5px 5px 5px 5px;
    //padding: 0 3px 0 3px;
    margin: 0;
    width: 260px;
  }

  .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #39437a; // フォーカス時の枠線の色
    }

`;
const WhiteTextField = styled(TextField)(whiteInput);

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          color: "#e4e4e4", // ボタンのテキスト色を白に設定
          borderColor: "#e4e4e4", // ボタンの枠線色を白に設定
          "&:hover": {
            borderColor: "white", // ボタンにカーソルを合わせた時の枠線色を白に設定
          },
          "&:focus": {
            borderColor: "white", // ボタンがフォーカスされた時の枠線色を白に設定
          },
          "&:disabled": {
            borderColor: "#8c8b8b", // ボタンが使用できない場合
            color: "#8c8b8b", //ボタンが使用できない場合
          },
        },
      },
    },
  },
});
