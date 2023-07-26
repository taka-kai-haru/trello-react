/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import CloseIcon from "@mui/icons-material/Close";
import { FC, useState } from "react";
import { ButtonType, CommonDialog } from "../CommonDialog";
import * as React from "react";

type Props = {
  id: string;
  deleteSection: (id: string) => void;
};
export const SectionDeleteButton: FC<Props> = (props) => {
  const { id, deleteSection } = props;
  // ダイアログ用のstate
  const [digOpen, setDigOpen] = useState(false);
  const handleClick = () => {
    deleteSection(id);
  };
  const handleDeleteButtonClicked = () => {
    setDigOpen(false);
    handleClick();
  };
  return (
    <>
      <div onClick={() => setDigOpen(true)} css={deleteButtonStyle}>
        <CloseIcon />
      </div>
      <CommonDialog
        title={"確認"}
        message={"削除してよいですか？"}
        onAccept={handleDeleteButtonClicked}
        onClose={() => setDigOpen(false)}
        open={digOpen}
        buttonType={ButtonType.YesNo}
      />
    </>
  );
};

const deleteButtonStyle = css`
  cursor: pointer;
`;
