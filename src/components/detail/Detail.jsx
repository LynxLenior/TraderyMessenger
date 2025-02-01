import { auth } from "../../lib/firebase"
import "./detail.css"

const Detail = () => {
  return (
    <div className='detail'>
        <div className="user">
            <h2>Ethan</h2>
        </div>
        <div className="info">
            <button>Block User</button>
            <button className="logout" onClick={()=>auth.signOut()}>Logout</button>
        </div>
    </div>
  )
}

export default Detail