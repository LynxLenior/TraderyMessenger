import { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import "./login.css";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
//Something in the way
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const Login = () => {
const handleGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Save new user to Firestore
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                username: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
            });
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}


//Login thingies, delete for GoogleAuthenticator login thingy
// const Login = () => {
//     const handleGoogle = async (e) => {
//         const provider = new GoogleAuthProvider();
//         return signInWithPopup(auth, provider)
//     }

return (
<div className="login">
    <div className="center">
        <button className="button" onClick={handleGoogle}>Button</button>
        </div>
</div>
)
}


//     const [avatar,setAvatar] = useState({
//         file:null,
//         url:"",
//     })

//     const [loading,setLoading] = useState(false)

//     const handleAvatar = e => {
//         if (e.target.files[0]){
//             setAvatar({
//                 file: e.target.files[0],
//                 url: URL.createObjectURL(e.target.files[0]),
//         })
//     }
// }

// //error popout
//     const handleRegister = async e =>{
//         e.preventDefault()
//         setLoading(true)
//         const formData = new FormData(e.target)

//         const { username, email, password } = Object.fromEntries(formData)

//         try{

//         const res = await createUserWithEmailAndPassword(auth, email, password)

//         await setDoc(doc(db, "users", res.user.uid), {
//             username,
//             email,
//             id: res.user.uid,
//             blocked: [],
//         });

//         await setDoc(doc(db, "userchats", res.user.uid), {
//             chats: [],
//           });
           
//           toast.success("Account Created! You can login now!")
//         }   catch(err){
//             console.log(err)
//             toast.error(err.message)
//         } finally{
//             setLoading(false)
//         }
//     }


//     const handleLogin = async e =>{
//         e.preventDefault()
//         setLoading(true)

//         const formData = new FormData(e.target)
//         const { email, password } = Object.fromEntries(formData)

//         try{

//         await signInWithEmailAndPassword(auth, email, password)
//         }catch(err){
//             console.log(err)
//             toast.error(err.message)
//         }
//         finally{
//             setLoading(false)
//         }
//     }

        

//   return (
//         <div className="login">
//         <div className="item">
//             <h2>Welcome back,</h2>
//             <form onSubmit={handleLogin}>
//                 <input type="text" placeholder="Email" name="email" />
//                 <input type="password" placeholder="Password" name="password"/>
//                 <button disabled={loading}>{loading ? "Loading" :"Sign In"}</button>
//             </form>
//         </div>
//         <div className="separator"></div>
//         <div className="item">
//         <h2>Create an Account</h2>
//             <form onSubmit={handleRegister}>
//                 <label htmlFor="file">
//                     <img src={avatar.url || "./avatar.png"} alt="" />
//                     Upload and image
//                 </label>
//                 <input 
//                 type="file" 
//                 id="file" 
//                 style={{display:"none"}} 
//                 onChange={handleAvatar}
//                 />
//                 <input type="text" placeholder="Username" name="username"/>
//                 <input type="text" placeholder="Email" name="email"/>
//                 <input type="password" placeholder="Password" name="password"/>
//                 <button disabled={loading}>{loading ? "Loading" :"Sign up"}</button>
//             </form>
//         </div>
//     </div>


export default Login