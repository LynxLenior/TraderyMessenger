import { useState } from "react"
import { auth, db } from "../../lib/firebase"
import { useChatStore } from "../../lib/chatStore"
import { useUserStore } from "../../lib/userStore"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"
import "./detail.css"

const Detail = () => { 
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore()
  const { currentUser } = useUserStore()
  const [showReport, setShowReport] = useState(false)
  const [reportReason, setReportReason] = useState("")

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
    e.preventDefault()
    if (!reportReason.trim()) return

    try {
      const reportRef = doc(db, "reports", `${currentUser.id}_${user.id}`)
      await updateDoc(reportRef, {
        reporterId: currentUser.id,
        reportedUserId: user.id,
        reason: reportReason,
        timestamp: new Date(),
      })
      setShowReport(false) // Close modal after submission
      setReportReason("")
      console.log("Report submitted")
    } catch (err) {
      console.log("Error submitting report:", err)
    }
  }

  return (
    <div className='detail'>
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
    </div>
  )
}

export default Detail



// import { checkActionCode } from "firebase/auth"
// import { useChatStore } from "../../lib/chatStore"
// import { auth, db } from "../../lib/firebase"
// import { useUserStore } from "../../lib/userStore"
// import "./detail.css"
// import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"

// const Detail = () => { 
  
// const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = 
// useChatStore()
// const { currentUser } = useUserStore()

// const handleBlock = async () => {
//   if (!user) return;

//   const userDocRef = doc(db,"users", currentUser.id)

//   try{
//     await updateDoc(userDocRef, {
//     blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
//   })
//       changeBlock()
      
//       } catch(err){
//         console.log(err)
//     }
// }

//   return (
//     <div className='detail'>
//         <div className="user">
//             <h2>{user?.username}</h2>
//         </div>
//         <div className="info">
//             <button onClick={handleBlock}>
//               {isCurrentUserBlocked 
//               ? "you are Blocked!" 
//               : isReceiverBlocked 
//               ? "Unblock User" 
//               : "Block User"}
//             </button>
//             <button className="logout" onClick={()=>auth.signOut()}>Logout</button>
//             <button className="Report"></button>
//         </div>
//     </div>
//     )
//   }

// export default Detail