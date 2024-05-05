'use server'

import { cookies } from "next/headers"
import { createAdminClient, createSessionClient } from "../appwrite"
import { ID } from "node-appwrite"
import { parseStringify } from "../utils"

export const signIn = async ({ email, password }: signInProps) => {
    try {
        //
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);
    
        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
          });
        return parseStringify(session);
    } catch (error) {
        console.error('Error', error)
    }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {
    try {
        const { email, firstName, lastName } = userData
        const { account } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(), 
            email, 
            password, 
            `${firstName} ${lastName}`
        );
        if (!newUserAccount) throw new Error('Error creating user');
        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        return parseStringify(newUserAccount);
    } catch (error) {
        console.error('Error', error)
    }
}

// ... your initilization functions

export const getLoggedInUser = async () => {
    try {
      const { account } = await createSessionClient();
      const user = await account.get();
      if (!user) throw new Error('Error getting user');
      return parseStringify(user);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

export const logoutAccount = async () => {
   try {
      const { account } = await createSessionClient();
 
     cookies().delete('appwrite-session');
 
     await account.deleteSession('current');
   } catch (error) {
     return null;
   }
}
  