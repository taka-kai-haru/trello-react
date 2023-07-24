/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, useState } from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material";

type Props = {
  changeTitle: (id: string, title: string) => void;
  section: {
    id: string;
    title: string;
    cards: {
      cardId: string;
      title: string;
    }[];
  };
};

export const SectionTitle: FC<Props> = (props) => {
  const { changeTitle, section } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [inputTitle, setInputTitle] = useState(section.title);
  const handleClick = () => {
    setIsEdit(true);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputTitle !== "") {
      changeTitle(section.id, inputTitle);
      setIsEdit(false);
    }
  };
  const handleBlur = () => {
    if (inputTitle !== "") {
      changeTitle(section.id, inputTitle);
      setIsEdit(false);
    }
  };
  return (
    <div css={titleArea} onClick={handleClick}>
      {isEdit ? (
        <form onSubmit={handleSubmit}>
          <WhilteTextField
            id="outlined-basic"
            variant="outlined"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            autoFocus
            onBlur={handleBlur}
            autoComplete="off"
          />
        </form>
      ) : (
        <div css={sectionTitle}>{section.title}</div>
      )}
    </div>
  );
};

const titleArea = css`
  margin: 0 5px 0;
  width: 80%;
  cursor: pointer;
`;

const sectionTitle = css`
  font-size: 1.2rem;
  font-weight: 700;
  //margin: 10px 0 20px;
  margin-top: 1px;
  padding: 0;
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
