import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client"
import { SetContextLink } from "@apollo/client/link/context"
import { auth } from "../firebase"

const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URI || "http://localhost:4000/graphql"
})


const authLink = new SetContextLink(async (prevContext, _operation) => {
    const token = await auth.currentUser?.getIdToken()

    return {
        headers: {
            ...prevContext.headers, //keep any existing headers
            Authorization: token ? `Bearer ${token}` : ""   //add the token
        }
    }
})

export const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache()
})