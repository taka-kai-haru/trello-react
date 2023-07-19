import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';



interface USER {
    displayName: string;
    photoUrl: string;
}


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {uid:"", photoUrl:"", displayName:"" },
    },

    reducers: {
        // ログイン成功時ユーザー情報をセット
        login: (state, action) => {
            state.user = action.payload;
        },
        // ログアウト時ログイン情報をクリア
        logout: (state) => {
            state.user = {uid:"", photoUrl:"", displayName:""};
        },
        // プロフィール更新時ユーザー情報を更新
        updateUserProfile: (state, action: PayloadAction<USER>) => {
            state.user.displayName = action.payload.displayName;
            state.user.photoUrl = action.payload.photoUrl;
        },
    },
});

// アクションを使用できるようにする
export const { login,
    logout,
    updateUserProfile } = userSlice.actions;

// ユーザー情報を取得
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
