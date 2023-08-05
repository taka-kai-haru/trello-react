/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, useEffect, useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

type Props = {
  card: {
    cardId: string;
    title: string;
    limitDate: string;
    labelColor: string;
    progress: number;
    memo: string;
  };
};

// backgroundcolor と bordercolorを保持する変数
const limitDateColors = {
  success: {
    backgroundColor: "#145d16",
    borderColor: "#59c45e",
  },
  error: {
    backgroundColor: "#7e261d",
    borderColor: "#ec6257",
  },
  warning: {
    backgroundColor: "#805d2a",
    borderColor: "#ecb461",
  },
  primary: {
    backgroundColor: "#25338a",
    borderColor: "#5d72dc",
  },
};

export const Card: FC<Props> = (props) => {
  const { card } = props;
  const [limitDateBackgroundColor, setLimitDateBackgroundColor] = useState("");
  const [limitDateBorderColor, setLimitDateBorderColor] = useState("");
  const [limitDate, setLimitDate] = useState<string>("");
  useEffect(() => {
    if (card.limitDate !== "") {
      const tmpLimitDate = new Date(card.limitDate);
      const limitDateYear = tmpLimitDate.getFullYear();
      const limitDateMonth = tmpLimitDate.getMonth() + 1;
      const limitDateDate = tmpLimitDate.getDate();
      const today = new Date();
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth() + 1;
      const todayDate = today.getDate();
      setLimitDate(`${limitDateYear}年${limitDateMonth}月${limitDateDate}日`);

      const limitDateYMD =
        limitDateYear * 10000 + limitDateMonth * 100 + limitDateDate;
      const todayYMD = todayYear * 10000 + todayMonth * 100 + todayDate;

      if (card.progress === 100) {
        // 緑
        setLimitDateBackgroundColor(limitDateColors.success.backgroundColor);
        setLimitDateBorderColor(limitDateColors.success.borderColor);
      } else if (limitDateYMD < todayYMD) {
        // 赤
        setLimitDateBackgroundColor(limitDateColors.error.backgroundColor);
        setLimitDateBorderColor(limitDateColors.error.borderColor);
      } else if (limitDateYMD === todayYMD) {
        // 黄
        setLimitDateBackgroundColor(limitDateColors.warning.backgroundColor);
        setLimitDateBorderColor(limitDateColors.warning.borderColor);
      } else {
        // 青
        setLimitDateBackgroundColor(limitDateColors.primary.backgroundColor);
        setLimitDateBorderColor(limitDateColors.primary.borderColor);
      }
    }
  }, [card]);
  return (
    <div css={cardStyle}>
      {card.labelColor !== "" ? (
        <div
          css={[labelColorStyle, labelColorBackgroundStyle(card.labelColor)]}
        ></div>
      ) : (
        <></>
      )}
      {card.title}
      {card.limitDate !== "" ? (
        <div
          css={[
            limitDateStyle,
            limitDateBackgroundStyle(limitDateBackgroundColor),
            limitDateBorderStyle(limitDateBorderColor),
          ]}
        >
          <AccessTimeIcon fontSize="small" />
          {limitDate}
        </div>
      ) : (
        <></>
      )}
      {card.progress !== 0 ? (
        <div css={[progressStyle, progressWidthStyle(card.progress)]}></div>
      ) : (
        <></>
      )}
    </div>
  );
};

const cardStyle = css`
  padding: 10px 15px 10px 15px;
  background: rgb(145, 137, 145);
  background: linear-gradient(126deg, rgb(79, 73, 79) 0%, rgb(68, 64, 69) 96%);
  border-radius: 4px;
  cursor: pointer;
`;

const progressStyle = css`
  padding: 0;
  margin: 6px 0 0;
  border-radius: 2px;
  height: 4px;
`;

const progressWidthStyle = (paramProgress: number) => {
  if (paramProgress === 100) {
    return css`
      width: ${paramProgress}%;
      background: #59c45e;
    `;
  } else {
    return css`
      width: ${paramProgress}%;
      background: #5d72dc;
    `;
  }
};

const labelColorStyle = css`
  width: 60px;
  height: 10px;
  border-radius: 4px;
  margin: 0 0 5px;
  padding: 0;
`;

const labelColorBackgroundStyle = (paramBackGroundColor: string) => {
  return css`
    background: ${paramBackGroundColor};
  `;
};

const limitDateStyle = css`
  padding: 2px 4px 2px 2px;
  margin: 3px 1px 1px;
  width: 120px;
  font-size: 0.8rem;
  border-radius: 6px;
  display: flex;
  justify-content: center;
`;

const limitDateBackgroundStyle = (paramBackGroundColor: string) => {
  return css`
    background: ${paramBackGroundColor};
  `;
};

const limitDateBorderStyle = (paramBorderColor: string) => {
  return css`
    border: 1px solid ${paramBorderColor};
  `;
};
