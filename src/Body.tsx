/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ReactNode } from "react";
export const Body = ({ children }: { children?: ReactNode }) => {
  return <div css={bodyStyle}>{children}</div>;
};

const bodyStyle = css`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  color: #e4e4e4;
  line-height: 1.5;
  background-image: url("/src/images/main/main.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 100vh;
  font-family: "Kosugi";
`;
