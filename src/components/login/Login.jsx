import { useState } from "react";
import { toast } from "react-toastify";
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

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {

                await setDoc(userRef, {
                    id: user.uid,
                    email: user.email,
                    username: user.displayName || "New User",
                    createdAt: new Date(),
                    blocked: []
                });
                await setDoc(doc(db, "userchats", user.uid), {
                    chats: [],
                });
            }
            
            if (user.email === "bagus.anselliam@ue.edu.ph") {
                navigate("/admin"); // Redirect to admin page
            }

        } catch (error) {
            console.log("err");
        }
    };

    return (
        <div className="login">
            <div className="center">
                <button className="button" onClick={handleGoogle}>
                    Continue As...
                </button>
            </div>
        </div>
    );
};

export default Login