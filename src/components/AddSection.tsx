/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { SectionDeleteButton } from "./button/SectionDeleteButton";
import { Button, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

type Props = {
  style?: any;
  columnDropping: boolean;
  addSection: (title: string) => void;
};

export const AddSection: FC<Props> = (props) => {
  const { style, columnDropping, addSection } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [inputTitle, setInputTitle] = useState("");

  const handleClick = () => {
    setIsEdit(true);
  };

  const handleSubmit = () => {
    if (inputTitle !== "") {
      addSection(inputTitle);
      setInputTitle("");
      setIsEdit(false);
    }
  };

  const handleAddButtonClicked = () => {
    if (inputTitle !== "") {
      addSection(inputTitle);
      setInputTitle("");
      setIsEdit(false);
    }
  };

  const closeIconHandleClick = () => {
    setInputTitle("");
    setIsEdit(false);
  };

  return (
    <div css={columnDropping ? droppingAddSectionStyle : addSectionStyle}>
      <div css={isEdit ? style : generalAddSectionStyle}>
        {isEdit ? (
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

// 通常css
const addSectionStyle = css`
  width: 320px;
  //flex: 0 0 320px;
  min-width: 320px;
  margin: 0 16px 0 0;
  //padding: 0 10px 0 0;
`;

// SectionDrop中css
const droppingAddSectionStyle = css`
  width: 676px;
  flex: 0 0 676px;
  margin-left: 16px;
  display: flex;
  justify-content: flex-end;
`;

const generalAddSectionStyle = css`
  width: 320px;
  min-width: 320px;
  /* border: 1px solid white; */
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
  margin: 0 15px 5px 15px;
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
    padding: 0 3px 0 3px;
    margin: 0.6px 0;
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
        },
      },
    },
  },
});
