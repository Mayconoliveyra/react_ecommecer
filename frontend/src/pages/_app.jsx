import { GlobalStyles } from "../styles/global-styles"
import { ThemeProvider } from "styled-components"
import { theme } from "../styles/theme"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import MyCartContext from "../context/myCart"
import Header from "../components/Template/Header"
import Content from "../components/template/content"
import Nav from "../components/template/nav"
import { useEffect, useState } from "react";

export default function MyApp({ Component, pageProps }) {
  const [myCart, setMyCart] = useState([])

  /* Atualiza o context do carrinho do usuario. */
  /* Os pedidos não finalizados ficam armazenados no localStore do aparelho */
  useEffect(() => {
    const myCartStorage = localStorage.getItem("myCart");
    if (myCartStorage) {
      setMyCart(JSON.parse(myCartStorage))
    }
  }, [])

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
      <MyCartContext.Provider value={{ myCart, setMyCart }}>
        <Header />
        <Content>
          <Component {...pageProps} />
        </Content>
        <Nav />
      </MyCartContext.Provider>
    </ThemeProvider>
  )
}