import { Account, Client, OAuthProvider, Storage, Databases, Models } from 'appwrite'

export const client = new Client()
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)    
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
export { OAuthProvider } 

export const storage = new Storage(client);
export const database = new Databases(client);
export const account = new Account(client);

export interface TraderyUser {
  name: string;
  $id: string;
  email: string;
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

function mapUserToItem(user: Models.User<Models.Preferences>): TraderyUser {
  return {
      name: user.name,
      $id: user.$id,
      email: user.email
  };
}