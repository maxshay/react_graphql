import { ChakraProvider } from '@chakra-ui/react'
import { cacheExchange } from '@urql/exchange-graphcache';
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';

import theme from '../theme'

const client = createClient({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: 'include',
    },
    exchanges: [dedupExchange, cacheExchange({}), fetchExchange]
});

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
        <ChakraProvider resetCSS theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    </Provider>
  )
}

export default MyApp
