import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  serverTimestamp,
  setDoc,
  deleteDoc,
  getDoc
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./detail.css";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const navigate = useNavigate();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    try {
      const reportRef = doc(db, "reports", `${currentUser.id}_${user.id}`);
      await setDoc(reportRef, {
        reporterUsername: currentUser.username,
        reportedUsername: user.username,
        reporterId: currentUser.id,
        reportedUserId: user.id,
        reason: reportReason,
        timestamp: serverTimestamp(),
      });
      setShowReport(false);
      setReportReason("");
      console.log("Report submitted");
    } catch (err) {
      console.log("Error submitting report:", err);
    }
  };

  const handleDeleteChat = async () => {
    if (!chatId || !user) return;

    const currentUserChatsRef = doc(db, "userchats", currentUser.id);
    const targetUserChatsRef = doc(db, "userchats", user.id);
    const chatRef = doc(db, "chats", chatId);

    try {
      // Remove chat from both users' userchats
      const currentUserChatsSnap = await getDoc(currentUserChatsRef);
      if (currentUserChatsSnap.exists()) {
        await updateDoc(currentUserChatsRef, {
          chats: arrayRemove({ chatId }),
        });
      }

      const targetUserChatsSnap = await getDoc(targetUserChatsRef);
      if (targetUserChatsSnap.exists()) {
        await updateDoc(targetUserChatsRef, {
          chats: arrayRemove({ chatId }),
        });
      }

      // Delete chat document
      await deleteDoc(chatRef);
      console.log("Chat deleted successfully");
    } catch (err) {
      console.log("Error deleting chat:", err);
    }
  };

  return (
    <div className='detail'>
      {currentUser?.email === "bagus.anselliam@ue.edu.ph" && (
        <button className="adminButton" onClick={() => navigate("/admin")}>
          Admin Panel
        </button>
      )}
      <div className="user">
        <h2>{user?.username}</h2>
      </div>
      <div className="info">
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "Unblock User"
            : "Block User"}
        </button>
        <button className="logout" onClick={() => auth.signOut()}>Logout</button>
        <button className="report" onClick={() => setShowReport(true)}>Report</button>
      </div>

      {showReport && (
        <div className="reportPopup">
          <div className="popupContent">
            <button className="closeButton" onClick={() => setShowReport(false)}>X</button>
            <h2>Report {user?.username}</h2>
            <form onSubmit={handleReportSubmit}>
              <textarea
                placeholder="Enter the reason..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                required
              />
              <button type="submit">Submit Report</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Chat Button at the bottom left */}
      <button className="deleteChat" onClick={handleDeleteChat}>Delete Chat</button>
    </div>
  );
};

export default Detail;