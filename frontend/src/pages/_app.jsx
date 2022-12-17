import { GlobalStyles } from "../styles/global-styles"
import { ThemeProvider } from "styled-components"
import { theme } from "../styles/theme"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useEffect, useState } from "react";

import MyCartContext from "../context/myCart"
import StoreContext from "../context/store";
import { get } from "../adapters/store";

import Header from "../components/Template/Header"
import Content from "../components/template/content"
import Nav from "../components/template/nav"


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
    const myCartStorage = localStorage.getItem("myCart");

    if (myCartStorage) {
      setMyCart(JSON.parse(myCartStorage))
    }
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