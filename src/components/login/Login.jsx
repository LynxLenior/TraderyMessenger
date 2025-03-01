import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth"

const Login = () => {
    const navigate = useNavigate(); 

    const handleRegister = async (e) => {
        e.prevenetDefault();
        const formData = new FormData(e.target);

        const { username, email, password } = Obkect.formEntries(formData);

        try {
            
            const res = await createUserWithEmailAndPassword(auth,email,password);

            await setDoc(doc(db, "users", res.user.uid), {
                id: user.uid, //Uididk
                email: user.email, //Email
                username: user.displayName || "New User", //Username
                createdAt: new Date(),
                blocked: []
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
             chats: []
            });

            toast.success("Account Created Lmao");
        } catch (err) {
            console.log(err)
            toast.error(err.message)
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
