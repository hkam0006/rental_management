import { createNewUserInDatabase } from "@/lib/utils";
import { Manager, Tenant } from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => { 
      const session = await fetchAuthSession();
      const {idToken} = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      return headers
    }
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
        queryFn: async (_, _query_Api, _extraOptions, fetchWithBQ) => {
          try {
            const session = await fetchAuthSession();
            const {idToken} = session.tokens ?? {};
            const user = await getCurrentUser()
            const userRole = idToken?.payload["custom:role"] as string;
            const endpoint = userRole === "manager" ? `/managers/${user.userId}` : `/tenants/${user.userId}`;
            let userDetailsResponse = await fetchWithBQ(endpoint)
            
            // if user doesn't exist in the database, create a new user
            if (userDetailsResponse.error && userDetailsResponse.error.status === 404) {
              userDetailsResponse = await createNewUserInDatabase(
                user, 
                idToken,
                userRole, 
                fetchWithBQ
              );
            }
            
            return {
              data: {
                cognitoInfo: {...user},
                userInfo: userDetailsResponse.data as Tenant | Manager,
                userRole
              }
            }
          } catch (err: any) {
            return { error: err.message || "Could not fetch user data" };
          }
        }
     }),
  }),
});

export const {
  useGetAuthUserQuery,
} = api;
