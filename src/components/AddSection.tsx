/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {FC, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import {styled} from "@mui/material";
import TextField from "@mui/material/TextField";
import CloseIcon from '@mui/icons-material/Close';

type Props = {
    style?: any;
    columnDropping: boolean;
    addSection: (title: string) => void;
}

export const AddSection: FC<Props> = (props) => {
    const {style, columnDropping, addSection} = props;
    const [isEdit, setIsEdit] = useState(false);
    const [inputTitle, setInputTitle] = useState("");

    const handleClick = () => {
        setIsEdit(true);
    }

    const handleSubmit = () => {
        if (inputTitle !== "") {
            addSection(inputTitle);
        }
        setIsEdit(false);
    }

    const handleBlur = () => {
        if (inputTitle !== "") {
            addSection(inputTitle);
        }
        setIsEdit(false);
    }

    const closeIconHandleClick = () => {
        setInputTitle("");
    }

    return (
        <div css={columnDropping ? droppingAddSectionStyle : addSectionStyle}>
            <div css={isEdit ? style : generalAddSectionStyle} onClick={handleClick}>
                {isEdit ?
                    <div css={sectionTitleSectionDeleteArea}>
                        <form onSubmit={handleSubmit}>
                            <WhilteTextField
                                id="outlined-basic"
                                variant="outlined"
                                value={inputTitle}
                                onChange={(e) => setInputTitle(e.target.value)}
                                autoFocus
                                onBlur={handleBlur}
                            />
                        </form>
                        <CloseIcon onClick={closeIconHandleClick} />
                    </div>
                    :
                    <>
                        <AddIcon /><span css={titleArea}>リストを追加</span>
                    </>
                }
            </div>
        </div>
    )
}

// 通常css
const addSectionStyle = css`
    width: 320px;
    flex: 0 0 320px;
    margin-left: 4px;
`;

// SectionDrop中css
const droppingAddSectionStyle = css`
    width: 640px;
    flex: 0 0 640px;
    margin-left: 24px;
    display:         flex;
    justify-content: flex-end;
`;

const generalAddSectionStyle = css`
    min-width: 320px;
  /* border: 1px solid white; */
  background: rgb(30, 25, 31);
  background: linear-gradient(
          126deg,
          rgba(30, 25, 31, 1) 10%,
          rgba(51, 45, 54, 1) 96%
  );
  padding: 10px;
  border-radius: 10px;
  margin-left: 10px;
  opacity: 0.6;
  `;

const sectionTitleSectionDeleteArea = css`
  display: flex;
  justify-content: space-between;
  `;

const titleArea = css`
    vertical-align: top;
    `;

const whiteInput = css`
  input {
    font-size: 1.2rem;
    font-weight: 700;
    color: #e4e4e4;
    padding: 0;
    margin: 0.6px 0;
  }

  .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #39437a; // フォーカス時の枠線の色
    }

`;
const WhilteTextField = styled(TextField)(whiteInput);