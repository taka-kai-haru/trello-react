/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import AddIcon from "@mui/icons-material/Add";
import {FC, useState} from "react";
import {Button, ThemeProvider} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {createTheme} from "@mui/material/styles";
import TextField from "@mui/material/TextField";

type Props = {
    sectionId: string;
    addCard: (sectionId: string, title: string) => void;
}


export const AddCard: FC<Props> = (props) => {
    const [isEdit, setIsEdit] = useState(false);
    const [inputCard, setInputCard] = useState("");
    const {sectionId, addCard} = props;


    const handleAddCard = () => {
        if (inputCard !== "") {
            addCard(sectionId, inputCard);
            setInputCard("");
            setIsEdit(false);
        }
    }

    const closeIconHandleClick = () => {
        setInputCard("");
        setIsEdit(false);
    }

    const handleCardAddButtonClicked = () => {
        setIsEdit(true);
    }

    return (
        <>
            {isEdit ?
                <div css={cardStyle}>

                            <TextField
                                id="filled-textarea"
                                // label=""
                                placeholder="タイトルを入力"
                                multiline
                                variant="filled"
                                value={inputCard}
                                onChange={(e) => setInputCard(e.target.value)}
                                autoFocus
                                autoComplete="off"
                                InputProps={{
                                    style: {
                                        background: 'transparent',
                                        borderColor: 'transparent',
                                        color: '#e4e4e4',
                                        paddingTop: 0,
                                        paddingBottom: 0,
                                        width: '100%',
                                    },
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddCard();
                                    }
                                }}
                                // align="top"
                            />


                    <div css={cardAddButtonArea}>
                        <ThemeProvider theme={theme}>
                            <Button variant="outlined" size="small" onClick={handleAddCard} >追加</Button>
                        </ThemeProvider>
                        <CloseIcon onClick={closeIconHandleClick} css={closeIcon}/>
                    </div>
                </div>
            :
                <div css={addCardStyle} onClick={handleCardAddButtonClicked}>
                    <AddIcon /><span>カードを追加</span>
                </div>
            }

        </>
    )
}

const addCardStyle = css`
  padding: 0;
  //background: rgb(145, 137, 145);
  //background: linear-gradient(126deg, rgb(79, 73, 79) 0%, rgb(68, 64, 69) 96%);
 
  border-radius: 10px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
`;

const cardAddButtonArea = css`
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  `;

const closeIcon = css`
  cursor: pointer;
  margin-left: 10px;
  margin-top: 5px;
`;

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                outlined: {
                    color: '#e4e4e4', // ボタンのテキスト色を白に設定
                    borderColor: '#e4e4e4', // ボタンの枠線色を白に設定
                    '&:hover': {
                        borderColor: 'white', // ボタンにカーソルを合わせた時の枠線色を白に設定
                    },
                    '&:focus': {
                        borderColor: 'white', // ボタンがフォーカスされた時の枠線色を白に設定
                    },
                },
            },
        },
    },
});



const cardStyle = css`
  padding: 16px 18px 16px 18px;
  background: rgb(145, 137, 145);
  background: linear-gradient(126deg, rgb(79, 73, 79) 0%, rgb(68, 64, 69) 96%);
  border-radius: 10px;
  margin-top: 10px;
`;