import { useNavigate } from "react-router-dom";
import { Account, Client, OAuthProvider, Storage, Databases, Teams } from 'appwrite'

export const client = new Client()
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)    
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
export { OAuthProvider } 

export const storage = new Storage(client);
export const database = new Databases(client);

export async function getCurrentSession() {
  const session = await account.getSession('current');
  return {
    session
  }
}

export const getUser = async () => {
  try {
    return await account.get()
  } catch (error) {
    console.error(error)
  }
};

export async function DeleteSession() {
  await account.deleteSession('current');
  console.log("log out");
}

export async function getUserPrefs() {
  const data = await account.getPrefs();
  console.log(data);
}

export async function findUserDataById(userId) {
    const document = await database.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID, 
        import.meta.env.VITE_APPWRITE_COLLECTION_USER_ID, userId);
    return {
        userdb: mapDocumentToItem(document)
    }
}