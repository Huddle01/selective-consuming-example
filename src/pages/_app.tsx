import '@/styles/globals.css';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {

  const colors = {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
  }

  const theme = extendTheme({ colors })

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
