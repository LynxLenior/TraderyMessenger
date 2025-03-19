import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import Admin from "./components/admin/Admin";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
      setIsAdmin(user?.email === "bagus.anselliam@ue.edu.ph");
    });

    return () => unSub();
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <Routes>
      {/* Admin route */}
      <Route path="admin" element={isAdmin ? <Admin /> : <Navigate to="/" />} />

      {/* Main Messenger Page */}
      <Route
        path="/"
        element={
          currentUser ? (
            <div className="container">
              <List />
              {chatId && <Chat />}
              {chatId && <Detail />}
              <Notification />
            </div>
          ) : (
            <Login />
          )
        }
      />
    </Routes>
  );
}

export default App;
