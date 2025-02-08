import { checkActionCode } from "firebase/auth"
import { useChatStore } from "../../lib/chatStore"
import { auth } from "../../lib/firebase"
import { useUserStore } from "../../lib/userStore"
import "./detail.css"

const Detail = () => { 
  const { chatId, user } = 
useChatStore()
const { currentUser } = useUserStore()
  
  return (
    <div className='detail'>
        <div className="user">
            <h2>{user?.username}</h2>
        </div>
        <div className="info">
            <button>Block User</button>
            <button className="logout" onClick={()=>auth.signOut()}>Logout</button>
        </div>
    </div>
  )
}

export default Detail