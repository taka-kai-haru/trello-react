/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { SectionCards } from "./section/SectionCards";
import { Header } from "./Header";
import backgroundImage from "../images/main/main.jpg";

export const Main = () => {
  return (
    <div css={mainStyle}>
      <Header />
      <SectionCards />
    </div>
  );
};

const mainStyle = css`
  background-image: url(${backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
