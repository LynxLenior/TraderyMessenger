import { useState } from "react"
import { auth, db } from "../../lib/firebase"
import { useChatStore } from "../../lib/chatStore"
import { useUserStore } from "../../lib/userStore"
import { arrayRemove, arrayUnion, doc, updateDoc, serverTimestamp, setDoc, getDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom";
import "./detail.css"

const Detail = () => { 
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore()
  const { currentUser } = useUserStore()
  const [showReport, setShowReport] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const navigate = useNavigate();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id)

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      })
      changeBlock()
    } catch (err) {
      console.log(err)
    }
  }
  
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
    if (!user || !chatId) return;

    const currentUserChatRef = doc(db, "userchats", currentUser.id);
    const otherUserChatRef = doc(db, "userchats", user.id);
    const chatRef = doc(db, "chats", chatId);

    try {
        // Remove the chat from the current user's chat list
        const currentUserChatSnap = await getDoc(currentUserChatRef);
        if (currentUserChatSnap.exists()) {
            const currentUserChats = currentUserChatSnap.data().chats || [];
            const chatToRemove = currentUserChats.find(chat => chat.chatId === chatId);
            if (chatToRemove) {
                await updateDoc(currentUserChatRef, {
                    chats: arrayRemove(chatToRemove),
                });
            }
        }

        // Remove the chat from the other user's chat list
        const otherUserChatSnap = await getDoc(otherUserChatRef);
        if (otherUserChatSnap.exists()) {
            const otherUserChats = otherUserChatSnap.data().chats || [];
            const otherChatToRemove = otherUserChats.find(chat => chat.chatId === chatId);
            if (otherChatToRemove) {
                await updateDoc(otherUserChatRef, {
                    chats: arrayRemove(otherChatToRemove),
                });
            }
        }

        // Delete the chat document from the "chats" collection
        const chatSnap = await getDoc(chatRef);
        if (chatSnap.exists()) {
            console.log("Deleting chat document...");
            await deleteDoc(chatRef); // Completely deletes the document from Firestore
        } else {
            console.log("Chat document not found.");
        }

        // Reset chat store state
        useChatStore.setState({ chatId: null, user: null });

        console.log("Chat fully deleted!");
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
        <button className="report" onClick={() => setShowReport(true)}>Report</button>
        <button className="deleteChat" onClick={handleDeleteChat}>Delete Chat</button>
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
    </div>
  )
}

export default Detail;
