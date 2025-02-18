import { checkActionCode } from "firebase/auth"
import { useChatStore } from "../../lib/chatStore"
import { auth, db } from "../../lib/firebase"
import { useUserStore } from "../../lib/userStore"
import "./detail.css"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore"

const Detail = () => { 
  
const { chatId, user, isCurrentUserBlocked, isReceiverblocked, changeBlock } = 
useChatStore()
const { currentUser } = useUserStore()

const handleBlock = async () => {
  if (!user) return;

  const userDocRef = doc(db,"users", currentUser.id)

  try{
    await updateDoc(userDocRef, {
    blocked: isReceiverblocked ? arrayRemove(user.id) : arrayUnion(user.id)
  })
      changeBlock()
      } catch(err){
        console.log(err)
    }
}

  return (
    <div className='detail'>
        <div className="user">
            <h2>{user?.username}</h2>
        </div>
        <div className="info">
            <button onClick={handleBlock}>{ isCurrentUserBlocked ? "you are Blocked!" : isReceiverblocked ? "User Blocked" : "Block User"}
            </button>
            <button className="logout" onClick={()=>auth.signOut()}>Logout</button>
        </div>
    </div>
    )
  }

export default Detail