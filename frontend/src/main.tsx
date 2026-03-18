import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from "@/components/ui/provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './context/AuthContext'
import { ApolloProvider } from '@apollo/client/react'
import { client } from './apollo/client.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
)