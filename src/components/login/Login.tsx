import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { findUserDataById } from "../../lib/appwrite";
import { TraderyProfiles } from "../../lib/appwrite";
import { toast } from "react-toastify";
import React from "react";

const Login = () => {
    const { id } = useParams(); // Get Appwrite user ID from the URL
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<TraderyProfiles | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                toast.error("Missing user ID");
                return;
            }

            try {
                setLoading(true);

                // 🔹 Fetch user data from Appwrite
                const { userdb } = await findUserDataById(id);

                if (!userdb || !userdb.userEmail || !userdb.userId) {
                    toast.error("Invalid user data from Appwrite.");
                    return;
                }

                setUser(userdb);
                console.log("Fetched user:", userdb);

                // 🔹 Check if user already exists in Firebase Auth
                const userDoc = await getDoc(doc(db, "users", userdb.userId));
                const userExists = userDoc.exists();

                if (userExists) {
                    // 🔹 If user exists, log in with Firebase
                    console.log("User exists, logging in...");
                    await signInWithEmailAndPassword(auth, userdb.userEmail, userdb.userId);
                    toast.success("Logged in successfully!");
                } else {
                    // 🔹 If user doesn't exist, create Firebase account
                    console.log("User does not exist, creating account...");

                    const res = await createUserWithEmailAndPassword(auth, userdb.userEmail, userdb.userId);

                    // 🔹 Store user data in Firestore
                    await setDoc(doc(db, "users", res.user.uid), {
                        username: userdb.defaultName ?? "UnknownUser",
                        email: userdb.userEmail ?? "no-email@appwrite.com",
                        id: res.user.uid,
                        blocked: [],
                    });

                    await setDoc(doc(db, "userchats", res.user.uid), { chats: [] });

                    toast.success("Account created successfully!");
                }
            } catch (error: any) {
                console.error("Login error:", error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    return (
        <div className="login">
            {loading ? <div>Loading...</div> : <div>Welcome to Tradery Messenger!</div>}
        </div>
    );
};

export default Login;


// import { useNavigate, useParams } from "react-router-dom";
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../../lib/firebase";
// import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore";
// import "./login.css";
// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import React from "react";
// import { findUserDataById } from "../../lib/appwrite";
// import { useUserStore } from "../../lib/userStore";
// import { TraderyProfiles } from "../../lib/appwrite";

// const Login = () => {
//     const { currentUser } = useUserStore();
//     const [loading, setLoading] = useState(false);
//     const [user, setUser] = useState<TraderyProfiles | null>(null);
//     const { id } = useParams();

//     const handleSearch = async (user: TraderyProfiles) => {
//         if (!user?.defaultName) return false; // Prevent undefined queries

//         const userRef = collection(db, "users");
//         const q = query(userRef, where("username", "==", user.defaultName));
//         const querySnapShot = await getDocs(q);
        
//         return !querySnapShot.empty; // Returns true if user exists, false otherwise
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!id) return; // Prevent running if id is undefined

//             try {
//                 setLoading(true);
//                 const { userdb } = await findUserDataById(id);
//                 console.log(userdb);

//                 if (!userdb || !userdb.userEmail || !userdb.userId) {
//                     toast.error("Invalid user data from Appwrite.");
//                     return;
//                 }

//                 setUser(userdb);
//                 const userExists = await handleSearch(userdb);

//                 if (!userExists) {
//                     // Create new Firebase account
//                     if (!user) return;
//                     try {
//                         const res = await createUserWithEmailAndPassword(auth, user.userEmail, user.userId);
//                         await setDoc(doc(db, "users", res.user.uid), {
//                             username: user.defaultName,
//                             email: user.userEmail,
//                             id: res.user.uid,
//                             blocked: [],
//                         });
//                         await setDoc(doc(db, "userchats", res.user.uid), { chats: [] });
//                         toast.success("Account Created! You can login now!");
//                     } catch (err: any) {
//                         console.error("Account Creation Error:", err);
//                         toast.error(err.message);
//                     }
//                 } else {
//                     // Log in existing user
//                     try {
//                         if (!user) return;
//                         await signInWithEmailAndPassword(auth, user.userEmail, user.userId);
//                         toast.success("Account Logged In!");
//                     } catch (err: any) {
//                         console.error("Login Error:", err);
//                         toast.error(err.message);
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//                 toast.error("Failed to fetch user data.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [id]);

//     return (
//         <div className="login">
//             {loading ? <div>Loading...</div> : <div>Welcome to Tradery Messenger!</div>}
//         </div>
//     );
// };

// export default Login;