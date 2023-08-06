/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FC, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AccountCircle, Email, Send } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { IconButton, Modal } from "@mui/material";

import { auth, googleProvider, storage, xProvider } from "../../firebase";
import { updateUserProfile } from "../../features/userSlice";
import backGroundImage from "../../images/auth/auth.jpg";

// @ts-ignore
import { ReactComponent as GoogleIcon } from "../../images/icons/google.svg";
// @ts-ignore
import { ReactComponent as XIcon } from "../../images/icons/x.svg";
import { AuthErrorMessage } from "./AuthErrorMessage";

export const Auth: FC = () => {
  const dispatch = useDispatch();

  // Email入力
  const [email, setEmail] = useState("");
  // パスワード入力
  const [password, setPassword] = useState("");
  // ユーザー名入力
  const [username, setUsername] = useState("");
  // プロフィール画像
  const [profilePic, setProfilePic] = useState<File | null>(null);
  // ログイン画面or新規登録画面
  const [isLogin, setIsLogin] = useState(true);
  // モーダルの表示
  const [opnModal, setOpnModal] = useState(false);
  // リセット用Email入力
  const [resetEmail, setResetEmail] = useState("");

  // Google認証
  const signInGoogle = async () => {
    await auth
      .signInWithPopup(googleProvider)
      .catch((error) => alert(AuthErrorMessage(error.code)));
  };

  const signInX = async () => {
    await auth
      .signInWithPopup(xProvider)
      .catch((error) => alert(AuthErrorMessage(error.code)));
  };

  // Emailパスワードリセット、Email送信
  const sendResetEmail = async () => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        alert("メールを送信しました。");
        setResetEmail("");
        setOpnModal(false);
      })
      .catch((error) => {
        alert(error.message);
        setResetEmail("");
      });
  };

  // イメージ画像設定
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setProfilePic(e.target.files![0]);
      e.target.value = "";
    }
  };

  // メールアドレスとパスワードでのログイン
  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  // メールアドレスとパスワードでの新規登録
  const signUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);
    let url = "";
    if (profilePic) {
      await storage
        .ref(`avatars/${authUser.user?.uid}/image.jpg`)
        .put(profilePic);
      url = await storage
        .ref(`avatars/${authUser.user?.uid}/image.jpg`)
        .getDownloadURL();
    }
    // ユーザー情報を更新
    await authUser.user?.updateProfile({
      displayName: username,
      photoURL: url,
    });
    // reduxのstoreにユーザー情報を保存
    dispatch(
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      }),
    );
  };

  const emailChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const passwordChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  // Emailログインボタンイベント
  const emailLoginOnClick = async () => {
    if (isLogin) {
      try {
        await signInEmail();
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      try {
        await signUpEmail();
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  //
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{ height: "100vh" }}
        css={outerGridStyle}
      >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${backGroundImage})`,
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {isLogin ? "ログイン" : "ユーザー登録"}
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              {!isLogin && (
                <>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="ユーザー名"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUsername(e.target.value)
                    }
                  />
                  <Box textAlign="center">
                    <IconButton>
                      <label>
                        <AccountCircle
                          fontSize="large"
                          css={profilePic ? loginAddIconLoaded : loginAddIcon}
                        />
                        <input
                          css={loginHiddenIcon}
                          type="file"
                          onChange={onChangeImageHandler}
                        />
                      </label>
                    </IconButton>
                  </Box>
                </>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="メールアドレス"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={emailChangeEvent}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="パスワード(6文字以上)"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={passwordChangeEvent}
              />

              <Button
                disabled={
                  isLogin
                    ? !email || password.length < 6
                    : !username || !email || password.length < 6 || !profilePic
                }
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                startIcon={<Email />}
                onClick={emailLoginOnClick}
              >
                {isLogin ? "ログイン" : "登録"}
              </Button>
              <Grid container>
                <Grid item xs>
                  <span css={loginReset} onClick={() => setOpnModal(true)}>
                    パスワードを忘れた場合
                  </span>
                </Grid>
                <Grid item>
                  <span
                    css={loginToggleMode}
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "アカウント作成" : "ログインへ戻る"}
                  </span>
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 6, mb: 1 }}
                onClick={signInGoogle}
                startIcon={<GoogleIcon />}
              >
                Googleでサインイン
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 2 }}
                onClick={signInX}
                startIcon={<XIcon />}
              >
                Xでサインイン
              </Button>
            </Box>

            <Modal open={opnModal} onClose={() => setOpnModal(false)}>
              <div style={getModalStyle()} css={loginModelStyle}>
                <div css={loginModel}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                    type="email"
                    name="email"
                    label="メールアドレス"
                    value={resetEmail}
                    sx={{ width: "70%" }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setResetEmail(e.target.value);
                    }}
                  />
                  <IconButton onClick={sendResetEmail}>
                    <Send />
                  </IconButton>
                </div>
              </div>
            </Modal>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

// モーダルのレイアウト
const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%`,
  };
};

//css
const outerGridStyle = css`
  background-color: #151212;
`;

const loginToggleMode = css`
  cursor: pointer;
`;

const loginModel = css`
  text-align: center;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const loginReset = css`
  cursor: pointer;
`;

const loginHiddenIcon = css`
  display: none;
  text-align: center;
`;

const loginAddIcon = css`
  cursor: pointer;
  color: gray;
`;

const loginAddIconLoaded = css`
  cursor: pointer;
  color: whitesmoke;
`;

const loginModelStyle = css`
  outline: none;
  position: absolute;
  width: 400px;
  height: 200px;
  border-radius: 10px;
  background-color: #262222;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          color: "#131213", // ボタンのテキスト色を白に設定
          backgroundColor: "#e4e4e4", // ボタンにカーソルを合わせた時の背景色を白に設定
          textTransform: "none", // ボタンのテキストを大文字にしない
          "&:hover": {
            backgroundColor: "white", // ボタンにカーソルを合わせた時の背景色を白に設定
          },
          "&:focus": {
            backgroundColor: "white", // ボタンにカーソルを合わせた時の背景色を白に設定
          },
        },
      },
    },
  },
  typography: {
    fontFamily: ["Kosugi"].join(","),
  },
});
