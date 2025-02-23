import { useState } from "react"
import { auth, db } from "../../lib/firebase"
import { useChatStore } from "../../lib/chatStore"
import { useUserStore } from "../../lib/userStore"
import { arrayRemove, arrayUnion, doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore"
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
    if (!user) return;
  
    const userChatRef = doc(db, "userchats", currentUser.id);
  
    try {
      // Retrieve user chat data
      const userChatSnap = await getDoc(userChatRef);
      if (!userChatSnap.exists()) {
        console.log("User chat not found.");
        return;
      }
  
      const userChats = userChatSnap.data().chats || [];
  
      // Find the chat object that corresponds to the selected user
      const chatToRemove = userChats.find(chat => chat.receiverId === user.id);
  
      if (!chatToRemove) {
        console.log("Chat not found.");
        return;
      }
  
      // Remove the chat object from the array
      await updateDoc(userChatRef, {
        chats: arrayRemove(chatToRemove)
      });
  
      console.log("Chat successfully deleted!");
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

export default Detail