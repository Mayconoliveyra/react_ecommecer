import { GlobalStyles } from "../styles/global-styles"
import { ThemeProvider } from "styled-components"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useEffect, useState } from "react";

import Header from "../components/template/header"
import Content from "../components/template/content"
import Nav from "../components/template/nav"
import { theme } from "../styles/theme"

import { get } from "../adapters/store";
import { getCartTemp } from "../adapters/cart";

import StoreContext from "../context/store";
import MyCartContext from "../context/myCart"

export default function MyApp({ Component, pageProps }) {
  const [myCart, setMyCart] = useState([])
  const [store, setStore] = useState([])

  useEffect(() => {
    handleStore()
    handleMyCart()
  }, [])

  const handleStore = async () => {
    await get().then((res) => setStore(res.data))
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
      <StoreContext.Provider value={store}>
        <MyCartContext.Provider value={{ myCart, setMyCart }}>
          <Header />
          <Content>
            <Component {...pageProps} />
          </Content>
          <Nav />
        </MyCartContext.Provider>
      </StoreContext.Provider>
    </ThemeProvider>
  )
}