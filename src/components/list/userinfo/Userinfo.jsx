import { useUserStore } from "../../../lib/userStore"
import "./userInfo.css"

const Userinfo = () => {

  const {currentUser} = useUserStore()
  return (
    <div className='userInfo'>
      <div className="user">
        <img src="./avatar.png" alt="" />
        <h2>{currentUser.username} </h2>
      </div>
    </div>
  )
}

export default Userinfo