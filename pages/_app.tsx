import { Box, GlobalStyles, H0 } from "@bigcommerce/big-design";
import { theme as defaultTheme } from "@bigcommerce/big-design-theme";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import SessionProvider from "../context/session";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      <Box
        marginHorizontal={{ mobile: "none", tablet: "xxxLarge" }}
        marginVertical={{ mobile: "none", tablet: "xxLarge" }}
      >
        <H0>Manage Shipping Methods</H0>
        <SessionProvider>
          <Component {...pageProps} />
        </SessionProvider>
      </Box>
    </ThemeProvider>
  );
};

export default MyApp;
