/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {TaskCards} from "./TaskCards";
import { auth } from "../firebase";
import {Header} from "./Header";

export const Main = () => {
    return (
        <div css={background}>
        <Header />
        <TaskCards/>
        <button onClick={() => auth.signOut()}>ログアウト</button>
        </div>
    )
}

const background = css`
    //background-image: url("../../src/images/main/main.jpg");
    //background-repeat: no-repeat;
    //background-size: cover;
    //height: 100vh;
`;