import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"

const Login = () => {
    const [loading,setLoading] = useState(false)

    const handleRegister = async e =>{
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)

        const { username, email, password } = Object.fromEntries(formData)

        try{

        const res = await createUserWithEmailAndPassword(auth, email, password)

        await setDoc(doc(db, "users", res.user.uid), {
            username,
            email,
            id: res.user.uid,
            blocked: [],
        });

        await setDoc(doc(db, "userchats", res.user.uid), {
            chats: [],
          });

          toast.success("Account Created! You can login now!")
        }   catch(err){
            console.log(err)
            toast.error(err.message)
        } finally{
            setLoading(false)
        }
    }

    const handleLogin = async e =>{
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)
        const { email, password } = Object.fromEntries(formData)

        try{

        await signInWithEmailAndPassword(auth, email, password)
        toast.success("Account Login!")
        }catch(err){
            console.log(err)
            toast.error(err.message)
        }
        finally{
            setLoading(false)
        }
    }

    // const handleGoogle = async () => {
    //     try {
    //         const provider = new GoogleAuthProvider();
    //         const result = await signInWithPopup(auth, provider);
    //         const user = result.user;

    //         const userRef = doc(db, "users", user.uid);
    //         const userSnap = await getDoc(userRef);

    //         if (!userSnap.exists()) {
    //             await setDoc(userRef, {
    //                 id: user.uid,
    //                 email: user.email,
    //                 username: user.displayName || "New User",
    //                 createdAt: new Date(),
    //                 blocked: []
    //             });
    //             await setDoc(doc(db, "userchats", user.uid), {
    //                 chats: [],
    //             });
    //         }

    //         // ✅ Redirect to admin if email matches
    //         if (user.email === "bagus.anselliam@ue.edu.ph") {
    //             navigate("/admin");
    //         }

    //         setTimeout(() => {
    //             window.location.reload();
    //         }, 500);

    //     } catch (error) {
    //         console.log("Error:", error);
    //     }
    // };

    return (
        <div className="login">
            <div className="center">
                <button className="button" onClick={handleGoogle}> {/*CHANGE THIS BUTTON FUNCTION*/}
                    Continue As...
                </button>
            </div>
        </div>
    );
};

export default Login;
