/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import TextField from "@mui/material/TextField";
import { FC, useEffect, useState } from "react";
import {
  Button,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  Modal,
  Slider,
  styled,
  ThemeProvider,
  useColorScheme as useMaterialColorScheme,
} from "@mui/material";
import {
  CssVarsProvider,
  extendTheme as extendJoyTheme,
  THEME_ID,
  useColorScheme,
} from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaletteIcon from "@mui/icons-material/Palette";
import TimelineIcon from "@mui/icons-material/Timeline";
import Grid from "@mui/material/Unstable_Grid2";
import { createTheme } from "@mui/material/styles";
import {
  DatePicker,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import jaLocale from "date-fns/locale/ja";

import { ColorSelection } from "./ColorSelection";
import { ButtonType, CommonDialog } from "../dialog/CommonDialog";

type Props = {
  openEditModal: boolean;
  setOpenEditModal: (opnModal: boolean) => void;
  changeCard: (
    sectionId: string,
    cardId: string,
    title: string,
    limitDate: string,
    labelColor: string,
    progress: number,
    memo: string,
  ) => void;
  sectionId: string;
  card: {
    cardId: string;
    title: string;
    limitDate: string;
    labelColor: string;
    progress: number;
    memo: string;
  };
  deleteCard: (sectionId: string, cardId: string) => void;
};

const joyTheme = extendJoyTheme();

export const CardEdit: FC<Props> = (props) => {
  const {
    openEditModal,
    setOpenEditModal,
    changeCard,
    sectionId,
    card,
    deleteCard,
  } = props;
  const [inputTitle, setInputTitle] = useState(card.title);
  // const [limitDate, setLimitDate] = useState<Date | null>(new Date());
  const [limitDate, setLimitDate] = useState<Date | null>(new Date());
  const [isTitleEdit, setIsTitleEdit] = useState(false);
  const [progress, setProgress] = useState(0);
  const [memo, setMemo] = useState("");
  const [labelColor, setLabelColor] = useState("");
  // 変更前の値を保持するstate
  const [beforeTitle, setBeforeTitle] = useState("");
  const [beforeLimitDate, setBeforeLimitDate] = useState<Date | null>(
    new Date(),
  );
  const [beforeLabelColor, setBeforeLabelColor] = useState("");
  const [beforeProgress, setBeforeProgress] = useState(0);
  const [beforeMemo, setBeforeMemo] = useState("");
  // ダイアログ用のstate
  const [digOpen, setDigOpen] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenEditModal(false);
  };

  const changeDateHandler = (newDate: Date | null) => {
    setLimitDate(newDate);
  };

  useEffect(() => {
    // タイトル
    setInputTitle(card.title);
    setBeforeTitle(card.title); //変更前の値をセット
    // 期限
    if (card.limitDate === "") {
      setLimitDate(null);
      setBeforeLimitDate(null); //変更前の値をセット
    } else {
      setLimitDate(new Date(card.limitDate));
      setBeforeLimitDate(new Date(card.limitDate)); //変更前の値をセット
    }
    // ラベル
    setLabelColor(card.labelColor);
    setBeforeLabelColor(card.labelColor); //変更前の値をセット
    // 状況
    setProgress(card.progress);
    setBeforeProgress(card.progress); //変更前の値をセット
    // メモ
    setMemo(card.memo);
    setBeforeMemo(card.memo); //変更前の値をセット
  }, [card]);

  const handleEditButtonClicked = () => {
    changeCard(
      sectionId,
      card.cardId,
      inputTitle,
      limitDate?.toLocaleString() || "",
      labelColor,
      progress,
      memo,
    );
    setOpenEditModal(false);
  };

  const handleDeleteButtonClicked = () => {
    deleteCard(sectionId, card.cardId);
    setOpenEditModal(false);
  };

  const modalHandleClose = (
    e: React.MouseEvent<HTMLInputElement>,
    reason: "backdropClick",
  ) => {
    if (reason === "backdropClick") return;
    // 変更前の値をセット
    setInputTitle(beforeTitle);
    setLimitDate(beforeLimitDate);
    setLabelColor(beforeLabelColor);
    setProgress(beforeProgress);
    setMemo(beforeMemo);
    setOpenEditModal(false);
  };

  const handleCloseButtonClicked = () => {
    // 変更前の値をセット
    setInputTitle(beforeTitle);
    setLimitDate(beforeLimitDate);
    setLabelColor(beforeLabelColor);
    setProgress(beforeProgress);
    setMemo(beforeMemo);
    setOpenEditModal(false);
  };

  const handleInputTitleBlur = () => {
    if (inputTitle !== "") {
      setIsTitleEdit(false);
    }
  };

  return (
    <>
      <Modal open={openEditModal} onClose={modalHandleClose}>
        <div style={getModalStyle()} css={editModelStyle}>
          <form onSubmit={handleSubmit}>
            <Grid
              container
              columnSpacing={1}
              rowSpacing={2}
              alignItems="center"
            >
              {/*タイトル*/}
              <Grid xs={1}>
                <div css={iconStyle}>
                  <CreditCardIcon />
                </div>
              </Grid>
              <Grid xs={10}>
                {isTitleEdit ? (
                  <div css={titleInputStyle}>
                    <WhiteTextField
                      id="outlined-basic"
                      variant="outlined"
                      value={inputTitle}
                      onChange={(e) => setInputTitle(e.target.value)}
                      autoFocus
                      autoComplete="off"
                      inputProps={{
                        maxLength: 25,
                      }}
                      onBlur={handleInputTitleBlur}
                    />
                  </div>
                ) : (
                  <div css={titleStyle} onClick={() => setIsTitleEdit(true)}>
                    {inputTitle}
                  </div>
                )}
              </Grid>
              <Grid xs={1}>
                <div
                  onClick={() => handleCloseButtonClicked()}
                  css={deleteButtonStyle}
                >
                  <CloseIcon />
                </div>
              </Grid>

              {/*期限ヘッダ*/}
              <Grid xs={1}>
                <div css={iconStyle}>
                  <CalendarMonthIcon />
                </div>
              </Grid>
              <Grid xs={10}>
                <p css={subTitleStyle}>期限</p>
              </Grid>
              <Grid xs={1}></Grid>

              {/*期限*/}
              <Grid xs={1}></Grid>
              <Grid xs={10}>
                <MaterialCssVarsProvider>
                  <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
                    <SyncThemeMode />
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={jaLocale}
                      dateFormats={{
                        monthAndYear: "yyyy年 MM月",
                        year: "yyyy年",
                      }}
                      localeText={{
                        previousMonth: "前月を表示", // < のツールチップ
                        nextMonth: "次月を表示", // > のツールチップ
                        cancelButtonLabel: "キャンセル", // キャンセルボタンのテキスト
                        todayButtonLabel: "今日", // 今日ボタンのテキスト
                        clearButtonLabel: "クリア", // クリアボタンのテキスト
                      }}
                    >
                      <DatePicker
                        label="期限を選択"
                        value={limitDate}
                        onChange={changeDateHandler}
                        format="yyyy年M月d日"
                        slotProps={{
                          actionBar: {
                            actions: ["clear", "cancel", "today"],
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </CssVarsProvider>
                </MaterialCssVarsProvider>
              </Grid>
              <Grid xs={1}></Grid>

              {/*ラベルヘッダ*/}
              <Grid xs={1}>
                <div css={iconStyle}>
                  <PaletteIcon />
                </div>
              </Grid>
              <Grid xs={10}>
                <p css={subTitleStyle}>ラベル</p>
              </Grid>
              <Grid xs={1}></Grid>

              {/*ラベル*/}
              <Grid xs={1}></Grid>
              <Grid xs={10}>
                <ColorSelection
                  labelColor={labelColor}
                  setLabelColor={setLabelColor}
                />
              </Grid>
              <Grid xs={1}></Grid>

              {/*状況ヘッダ*/}
              <Grid xs={1}>
                <div css={iconStyle}>
                  <TimelineIcon />
                </div>
              </Grid>
              <Grid xs={10}>
                <p css={subTitleStyle}>状況</p>
              </Grid>
              <Grid xs={1}></Grid>

              {/*状況*/}
              <Grid xs={1}></Grid>
              <Grid xs={10}>
                <Slider
                  aria-label="Temperature"
                  defaultValue={30}
                  // getAriaValueText={value}
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e, value) => setProgress(value as number)}
                />
              </Grid>
              <Grid xs={1}></Grid>

              {/*メモヘッダ*/}
              <Grid xs={1}>
                <div css={iconStyle}>
                  <ArticleIcon />
                </div>
              </Grid>
              <Grid xs={10}>
                <p css={subTitleStyle}>メモ</p>
              </Grid>
              <Grid xs={1}></Grid>

              {/*メモ*/}
              <Grid xs={1}></Grid>
              <Grid xs={10}>
                {/*<WhiteTextMultilineField*/}
                <MaterialCssVarsProvider>
                  <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
                    <SyncThemeMode />
                    <TextField
                      id="outlined-multiline-static"
                      multiline
                      rows={7}
                      value={memo}
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="メモを入力してください。"
                    />
                  </CssVarsProvider>
                </MaterialCssVarsProvider>
              </Grid>
              <Grid xs={1}></Grid>

              {/*ボタン*/}
              <Grid xs={2}></Grid>
              <Grid xs={8}>
                <div css={buttonAreaStyle}>
                  <ThemeProvider theme={editButtonTheme}>
                    <Button
                      variant="outlined"
                      onClick={handleEditButtonClicked}
                      disabled={!inputTitle}
                    >
                      更新
                    </Button>
                  </ThemeProvider>
                </div>
              </Grid>
              <Grid xs={2}>
                <div css={buttonAreaStyle}>
                  <ThemeProvider theme={deleteButtonTheme}>
                    <Button
                      variant="contained"
                      onClick={() => setDigOpen(true)}
                    >
                      削除
                    </Button>
                  </ThemeProvider>
                </div>
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
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

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%`,
  };
};

const editModelStyle = css`
  outline: none;
  position: absolute;
  width: 700px;
  height: 650px;
  border-radius: 10px;
  background-color: #262426;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  padding: 30px;
`;

const whiteTextFieldStyle = css`
  input {
    font-size: 1.2rem;
    font-weight: 700;
    color: #e4e4e4;
    padding: 5px 3px 5px 3px;
    margin: 0;
    width: 500px;
  }

  .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #39437a; // フォーカス時の枠線の色
    }

`;
const WhiteTextField = styled(TextField)(whiteTextFieldStyle);

const iconStyle = css`
  margin: 2px 0 2px 6px;
`;

const deleteButtonStyle = css`
  cursor: pointer;
  text-align: center;
`;

const titleStyle = css`
  font-size: 1.2rem;
  font-weight: 700;
  padding: 5px 3px 5px 3px;
  margin: 0;
`;

const titleInputStyle = css`
  margin-bottom: 1.2px;
`;

const buttonAreaStyle = css`
  margin-top: 2px;
  text-align: center;
`;

const subTitleStyle = css`
  font-size: 1.1rem;
  margin-top: 0.4px;
`;

const editButtonTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          color: "#e4e4e4", // ボタンのテキスト色を白に設定
          borderColor: "#e4e4e4", // ボタンの枠線色を白に設定
          width: "150px",
          "&:hover": {
            borderColor: "white", // ボタンにカーソルを合わせた時の枠線色を白に設定
          },
          "&:focus": {
            borderColor: "white", // ボタンがフォーカスされた時の枠線色を白に設定
          },
          "&:disabled": {
            borderColor: "#8c8b8b", // ボタンが使用できない場合
            color: "#8c8b8b", //ボタンが使用できない場合
          },
        },
      },
    },
  },
});

const deleteButtonTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          color: "#e4e4e4", // ボタンのテキスト色を白に設定
          backgroundColor: "#cb3d3d",
          width: "90px",
          "&:hover": {
            backgroundColor: "#c72a2a", // ボタンにカーソルを合わせた時の枠線色を白に設定
          },
          "&:focus": {
            backgroundColor: "#c72a2a", // ボタンがフォーカスされた時の枠線色を白に設定
          },
        },
      },
    },
  },
});

function SyncThemeMode() {
  const { setMode } = useColorScheme();
  const { setMode: setMaterialMode } = useMaterialColorScheme();
  useEffect(() => {
    setMode("dark");
    setMaterialMode("dark");
  }, [setMode, setMaterialMode]);
  return null;
}
