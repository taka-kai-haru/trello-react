/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import CloseIcon from '@mui/icons-material/Close';
import {FC} from "react";

type Props = {
    id: string;
    deleteSection: (id: string) => void;
}
export const SectionDeleteButton: FC<Props> = (props) => {
    const {id, deleteSection} = props;
    const handleClick = () => {
        deleteSection(id);
    }
    return (
        <div onClick={handleClick} css={deleteButtonStyle}>
            <CloseIcon />
        </div>
    )
}

const deleteButtonStyle = css`
    cursor: pointer;
`;