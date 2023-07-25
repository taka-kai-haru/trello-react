/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ReactNode } from "react";

export const Card = ({ children }: { children?: ReactNode }) => {
  return <div css={cardStyle}>{children}</div>;
};

const cardStyle = css`
  padding: 15px 30px 15px 30px;
  background: rgb(145, 137, 145);
  background: linear-gradient(126deg, rgb(79, 73, 79) 0%, rgb(68, 64, 69) 96%);
  border-radius: 10px;
  cursor: pointer;
`;
