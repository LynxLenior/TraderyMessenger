import { Account, Client, OAuthProvider, Storage, Databases, Models } from 'appwrite'

export const client = new Client()
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)    
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
export { OAuthProvider } 

export const storage = new Storage(client);
export const database = new Databases(client);
export const account = new Account(client);

export interface TraderyProfiles {
  userId: string;
  displayName?: string | null;
  defaultName: string;
  profileImageId: string;
  profileSummary?: string | null;
  profileImageWidth: number;
  profileImageHeight: number;
  userEmail: string;
}

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

export async function findUserDataById(userId) {
    const document = await database.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID, 
        import.meta.env.VITE_APPWRITE_COLLECTION_USER_ID, userId);
    return {
        userdb: mapUserToItem(document)
    }
}

function mapUserToItem(document: Models.Document) {
  const userdb: TraderyProfiles = {
    defaultName: document.name,
    userId: document.$id,
    userEmail: document.userEmail,
    profileImageId: '',
    profileImageWidth: 0,
    profileImageHeight: 0
  }
  return userdb;
}