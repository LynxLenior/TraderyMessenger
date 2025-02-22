import { doc, onSnapshot } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";
import { useUserStore } from "./userStore";

export const useChatStore = create((set, get) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,

    changeChat: (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser;

        if (user.blocked.includes(currentUser.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: true,
                isReceiverBlocked: false,
            });
        } else if (currentUser.blocked.includes(user.id)) {
            return set({
                chatId,
                user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: true,
            });
        } else {
            return set({
                chatId,
                user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: false,
            });
        }
    },

    changeBlock: () => {
        set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
    },

    listenForBlockChanges: (currentUserId) => {
        if (!currentUserId) return;

        const userDocRef = doc(db, "users", currentUserId);

        return onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const blockedList = snapshot.data().blocked || [];
                const chatUserId = get().user?.id;

                set({
                    isReceiverBlocked: chatUserId ? blockedList.includes(chatUserId) : false,
                });
            }
        });
    },
}));




// import { doc, getDoc } from "firebase/firestore";
// import { create } from "zustand";
// import { db } from "./firebase";
// import { useUserStore } from "./userStore";

// export const useChatStore = create((set) => ({
//     chatId: null,
//     user:null,
//     isCurrentUserBlocked:false,
//     isReceiverBlocked:false,
//     changeChat: (chatId, user)=>{
//         const currentUser = useUserStore.getState().currentUser

//         // CHECK IF CURRENT USER IS BLOCKED

//         if(user.blocked.includes(currentUser.id)){
//             return set({
//                 chatId,
//                 user:null,
//                 isCurrentUserBlocked:true,
//                 isReceiverBlocked:false, 
//             })
//         }
//         // CHECK IF RECEIVER IS BLOCKED
//          else if(currentUser.blocked.includes(user.id)){
//             return set({
//                 chatId,
//                 user:user,
//                 isCurrentUserBlocked:false,
//                 isReceiverBlocked:true, 
//             })
//     } else {

//     return set({
//         chatId,
//         user,
//         isCurrentUserBlocked:false,
//         isReceiverBlocked:false, 
//     })
//     }
// },

//     changeBlock: ()=>{
//         set((state)=>({...state,isReceiverBlocked: !state.isReceiverBlocked}))
//     }
// }))