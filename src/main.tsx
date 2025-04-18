import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloProvider } from '@apollo/client'
import client from './apollo/apollo-client.ts'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </ApolloProvider>
  </StrictMode>,
)
