import {FC} from "react";
import {useSelector} from "react-redux";
import {selectUser} from "../features/userSlice";
import {auth} from "../firebase";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import {AppBar, IconButton, Toolbar} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export const Header: FC = () => {
    const user = useSelector(selectUser);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" css={headerBackground}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {user.displayName}さんのTodo
                    </Typography>
                    <Avatar
                        src={user.photoUrl}
                    />
                    <Button color="inherit">ログアウト</Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

const headerBackground = css`
    background-color: transparent;
`;