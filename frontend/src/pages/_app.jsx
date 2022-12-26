import { GlobalStyles } from "../styles/global-styles"
import { ThemeProvider } from "styled-components"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useEffect, useState } from "react";
import { getSession, SessionProvider } from "next-auth/react"

import Header from "../components/template/header"
import Content from "../components/template/content"
import Nav from "../components/template/nav"
import { theme } from "../styles/theme"

import { get as getStore } from "./api/store";
import { getCartTemp } from "./api/cart"

import StoreContext from "../context/store";
import MyCartContext from "../context/myCart"

export default function MyApp({ Component, pageProps }) {
  const [myCart, setMyCart] = useState([])
  const [store, setStore] = useState([])

  useEffect(() => {
    handleToken();
    handleStore();
    handleMyCart();
  }, [])

  const handleToken = async () => {
    const session = await getSession()
    if (session && session.id) {
      localStorage.setItem("access_token", session.token)
    } else {
      localStorage.removeItem("access_token")
    }
  }
  const handleStore = async () => {
    setStore(await getStore())
  }
  const handleMyCart = async () => {
    const now = `${Date.now()}-${(Math.random() * (9999999 - 1000000) + 1000000).toFixed()}`
    if (!localStorage.getItem("myCartId")) localStorage.setItem('myCartId', JSON.stringify(now))
    setMyCart(await getCartTemp())
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <GlobalStyles />
      <SessionProvider session={pageProps.session}>
        <StoreContext.Provider value={store}>
          <MyCartContext.Provider value={{ myCart, setMyCart }}>
            <Header />
            <Content>
              <Component {...pageProps} />
            </Content>
            <Nav />
          </MyCartContext.Provider>
        </StoreContext.Provider>
      </SessionProvider>
    </ThemeProvider>
  )
}