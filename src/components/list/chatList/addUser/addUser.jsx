import { useState } from "react"
import { db } from "../../../../lib/firebase"
import "./addUser.css"
import { 
  arrayUnion, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  serverTimestamp, 
  setDoc, 
  updateDoc, 
  where 
} from "firebase/firestore"
import { useUserStore } from "../../../../lib/userStore"

const AddUser = () => {
  const [user, setUser] = useState(null)
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null) 

  const { currentUser } = useUserStore()

  const handleSearch = async (e) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.target)
    const username = formData.get("username")

    try {
      const userRef = collection(db, "users")
      const q = query(userRef, where("username", "==", username))
      const querySnapShot = await getDocs(q)

      if (!querySnapShot.empty) {
        const foundUser = querySnapShot.docs[0].data()

        if (foundUser.id === currentUser.id) {
          setError("You cannot add yourself!")
          setUser(null) 
          return
        }

        setUser(foundUser)
        setAdded(false) 
      } else {
        setError("User not found!")
        setUser(null)
      }
    } catch (err) {
      console.log(err)
      setError("An error occurred while searching.")
    }
  }

  const handleAdd = async () => {
    if (!user || added || loading) return 

    setLoading(true) 
    setError(null)

    const chatRef = collection(db, "chats")
    const userChatsRef = collection(db, "userchats")
    const currentUserChatsRef = doc(userChatsRef, currentUser.id)

    try {
      const currentUserChatsSnap = await getDoc(currentUserChatsRef)

      if (currentUserChatsSnap.exists()) {
        const chats = currentUserChatsSnap.data().chats || []
        const alreadyAdded = chats.some(chat => chat.receiverId === user.id)

        if (alreadyAdded) {
          setError("User already added!")
          setLoading(false) 
          return
        }
      }

      const newChatRef = doc(chatRef)
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      })

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      })

      await updateDoc(currentUserChatsRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      })

      console.log(newChatRef.id)
      setAdded(true)
      setLoading(false)

    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button type="submit">Search</button>
      </form>

      {user && (
        <div className="user">
          <div className="detail">
            <span>{user.username}</span>
          </div>
          {!added && !error && (
            <button onClick={handleAdd} disabled={loading}> 
              {loading ? "Adding..." : "Add User"}
            </button>
          )}
          {added && <span>User Added ✅</span>}
        </div>
      )}
      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  )
}
export default AddUser