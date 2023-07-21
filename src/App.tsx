import {SectionCards} from "./components/SectionCards";
import {Main} from "./components/Main";
import {FC, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {login, logout, selectUser} from "./features/userSlice";
import {auth} from "./firebase";
import {Auth} from "./components/Auth";
import {Loading} from "./components/Loading";

const App: FC = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unSub = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                // ログインしている場合
                dispatch(login({
                    uid: authUser.uid,  // ユーザーID
                    photoUrl: authUser.photoURL,    // プロフィール画像
                    displayName: authUser.displayName   // 表示名
                })
                )} else {
                // ログインしていない場合
                dispatch(logout());
            }
            setLoading(false);
        });
        return () => {
            // cleanup関数
            unSub();
        }
    }, [dispatch]);

    if (loading) {
        return <Loading/>
    }

    return <> {user.uid ? <Main/> : <Auth/>} </>
}

export default App;
