/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {CircularProgress} from "@mui/material";

export const Loading = () => {
    return (
        <div css={loadingStyle}>
            <CircularProgress style={{ width: '100px', height: '100px' }} color="inherit" />
        </div>
    )
}

const loadingStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;