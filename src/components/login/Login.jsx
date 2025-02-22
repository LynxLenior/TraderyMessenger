import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./login.css";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate(); 

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

            // ✅ Redirect to admin if email matches
            if (user.email === "bagus.anselliam@ue.edu.ph") {
                navigate("/admin");
            }

        } catch (error) {
            console.log("Error:", error);
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

export default Login;
