/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { SectionCards } from "./SectionCards";
import { auth } from "../firebase";
import { Header } from "./Header";

export const Main = () => {
  return (
    <div css={mainStyle}>
      <Header />
      <SectionCards />
      {/*<button onClick={() => auth.signOut()}>ログアウト</button>*/}
    </div>
  );
};

const mainStyle = css`
  //background-image: url("../../src/images/main/main.jpg");
  //background-repeat: no-repeat;
  //background-size: cover;
  //height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
