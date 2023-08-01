import * as React from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

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
import { FC, useState } from "react";
import { auth, provider, storage } from "../firebase";
import { AccountCircle, Camera, Email, Send } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/userSlice";
import { IconButton, Modal } from "@mui/material";
// @ts-ignore
import backGroundImage from "../images/auth/auth.png";

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%`,
  };
};

const defaultTheme = createTheme();

export const Auth: FC = () => {
  // const classes = useStyles();
  const dispatch = useDispatch();
  // Google認証
  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((error) => alert(error.message));
  };
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
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            // backgroundImage: ".../images/auth/auth.png",
            backgroundImage: `url(${backGroundImage})`,
            backgroundRepeat: "no-repeat",
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
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {isLogin ? "Login" : "Register"}
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
                    label="Username"
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
                label="Email Address"
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
                label="Password"
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
                {isLogin ? "Login" : "Register"}
              </Button>
              <Grid container>
                <Grid item xs>
                  <span css={loginReset} onClick={() => setOpnModal(true)}>
                    Forgot password?
                  </span>
                </Grid>
                <Grid item>
                  <span
                    css={loginToggleMode}
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Create new account ?" : "Back to login"}
                  </span>
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={signInGoogle}
                startIcon={<Camera />}
              >
                SignIn with Google
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
                    label="Reset Email"
                    value={resetEmail}
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

//css

const loginToggleMode = css`
  cursor: pointer;
  color: #0000ff;
`;

const loginModel = css`
  text-align: center;
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
  background-color: white;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
