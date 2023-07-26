/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import TextField from "@mui/material/TextField";
import * as React from "react";
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
  DateTimePicker,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import jaLocale from "date-fns/locale/ja";
import { ColorSelection } from "./ColorSelection";
import { ButtonType, CommonDialog } from "./CommonDialog";

type Props = {
  openEditModal: boolean;
  setOpenEditModal: (opnModal: boolean) => void;
  changeCard: (
    sectionId: string,
    cardId: string,
    title: string,
    limitDateTime: string,
    labelColor: string,
    progress: string,
    memo: string,
  ) => void;
  sectionId: string;
  card: {
    cardId: string;
    title: string;
    limitDateTime: string;
    labelColor: string;
    progress: string;
    memo: string;
  };
  deleteCard: (sectionId: string, cardId: string) => void;
};

const joyTheme = extendJoyTheme();

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%`,
  };
};

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
    setInputTitle(card.title);
    if (card.limitDateTime === "") {
      setLimitDate(null);
    } else {
      setLimitDate(new Date(card.limitDateTime));
    }
    setLabelColor(card.labelColor);
    setProgress(parseInt(card.progress));
    setMemo(card.memo);
  }, [card]);

  const renderWeekEndPickerDay = (
    date: Date,
    _selectedDates: Array<Date | null>,
    pickersDayProps: PickersDayProps<Date>,
  ) => {
    const switchDayColor = (getday: number) => {
      switch (
        getday // Sun=0,Sat=6
      ) {
        case 0:
          return { color: "red" };
        case 6:
          return { color: "blue" };
        default:
          return {};
      }
    };
    const newPickersDayProps = {
      ...pickersDayProps,
      sx: switchDayColor(date.getDay()),
    };
    return <PickersDay {...newPickersDayProps} />;
  };

  const handleEditButtonClicked = () => {
    // console.log("cardId: " + card.cardId);
    // console.log("inputTitle: " + inputTitle);
    // console.log("limitDate: " + limitDate?.toLocaleString());
    // console.log("labelColor: " + labelColor);
    // console.log("progress: " + progress);
    // console.log("memo: " + memo);

    changeCard(
      sectionId,
      card.cardId,
      inputTitle,
      limitDate?.toLocaleString() || "",
      labelColor,
      progress.toString(),
      memo,
    );
    setOpenEditModal(false);
  };

  const handleDeleteButtonClicked = () => {
    deleteCard(sectionId, card.cardId);
    setOpenEditModal(false);
  };

  const dateTitleColorStyles = {
    paperprops: {
      'div[class^="PrivatePickers"] div[class^="css-"]>span:nth-of-type(1)': {
        color: "rgba(255, 0, 0, 0.6)", // 日 = 赤
      },
      'div[class^="PrivatePickers"] div[class^="css-"]>span:nth-of-type(7)': {
        color: "rgba(0, 0, 255, 0.6)", // 土 = 青
      },
    },
  };

  const modalHandleClose = (
    e: React.MouseEvent<HTMLInputElement>,
    reason: "backdropClick",
  ) => {
    if (reason === "backdropClick") return;
    setOpenEditModal(false);
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
                      onBlur={() => setIsTitleEdit(false)}
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
                  onClick={() => setOpenEditModal(false)}
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
                        // okButtonLabel: "選択", // OKボタンのテキスト
                      }}
                    >
                      <DatePicker
                        label="期限を選択"
                        value={limitDate}
                        onChange={changeDateHandler}
                        format="yyyy年M月d日"
                        // renderDay={renderWeekEndPickerDay}
                        // viewRenderers={renderWeekEndPickerDay}
                        // PaperProps={dateTitleColorStyles.paperprops}
                        // sx={dateTitleColorStyles}
                        // closeOnSelect={false}

                        slotProps={{
                          actionBar: {
                            actions: ["clear", "cancel", "today"],
                          },
                          // textField: { size: "small" },
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

const editModelStyle = css`
  outline: none;
  position: absolute;
  width: 700px;
  height: 650px;
  border-radius: 10px;
  background-color: #262426;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  padding: 30px;
  //display: flex;
`;

const whiteTextFieldStyle = css`
  input {
    font-size: 1.2rem;
    font-weight: 700;
    color: #e4e4e4;
    padding: 0 3px 0 3px;
    margin: 0.6px 0 0 0;
    
    width: 500px;
  }

  .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: #39437a; // フォーカス時の枠線の色
    }

`;
const WhiteTextField = styled(TextField)(whiteTextFieldStyle);

const iconStyle = css`
  margin: 2px 0 0 6px;
`;

const deleteButtonStyle = css`
  cursor: pointer;
`;

const titleStyle = css`
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0 3px 0 3px;
  //margin: 10px 0 20px;
  //margin-top: 2px;
`;

const titleInputStyle = css`
  margin-bottom: 1px;
`;

const buttonAreaStyle = css`
  //margin: 0 auto;
  margin-top: 2px;
  text-align: center;
  //display: flex;
  //justify-content: space-around;
  //margin-top: 20px;
  //position: absolute;
  //padding-bottom: 10px;
`;

const subTitleStyle = css`
  font-size: 1.1rem;
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
          // width: "100px",
          // opacity: 0.9,
          "&:hover": {
            backgroundColor: "#c72a2a", // ボタンにカーソルを合わせた時の枠線色を白に設定
            // opacity: 1,
          },
          "&:focus": {
            backgroundColor: "#c72a2a", // ボタンがフォーカスされた時の枠線色を白に設定
            // opacity: 1,
          },
        },
      },
    },
  },
});

// @ts-ignore
// const StyledDateTimePicker = withStyles(dateTimePickerStyles)(DateTimePicker);

function SyncThemeMode() {
  const { setMode } = useColorScheme();
  const { setMode: setMaterialMode } = useMaterialColorScheme();
  useEffect(() => {
    setMode("dark");
    setMaterialMode("dark");
  }, [setMode, setMaterialMode]);
  return null;
}
