import { GlobalStyles } from "../styles/global-styles"
import { ThemeProvider } from "styled-components"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useEffect, useState } from "react";
import { getSession, SessionProvider } from "next-auth/react"
import { useRouter } from "next/router";

import Header from "../components/template/header"
import Content from "../components/template/content"
import Nav from "../components/template/nav"
import Menu from "../components/template/menu";
import MenuLogin from "../components/template/menulogin";
import { theme } from "../styles/theme"

import { get as getStore } from "./api/store";
import { getCartTemp } from "./api/cart"

import TemplateContext from "../context/template"
import StoreContext from "../context/store";
import MyCartContext from "../context/myCart"

export default function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter()
  const defaultTemplate = { showHeaderSearch: true, showMenu: false, showNav: true, showMenuLogin: false, footerReduce: false }
  const [template, setTemplate] = useState(defaultTemplate)
  const [myCart, setMyCart] = useState([])
  const [store, setStore] = useState([])

  useEffect(() => {
    handleToken();
    handleStore();
    handleMyCart();
  }, [])

  /* Ajusta o template de acordo com a rota que está sendo acessada (TemplateContext) */
  useEffect(() => {
    console.log(pathname)
    switch (pathname) {
      case '/login':
      case '/carrinho':
      case '/carrinho/fechar':
      case '/conta/meusdados':
      case '/conta/endereco':
        setTemplate({ ...defaultTemplate, showHeaderSearch: false, footerReduce: true })
        break;
      default:
        setTemplate(defaultTemplate)
        break;
    }
  }, [pathname])

  /* Se showMenu ou showMenuLogin for verdadeiro, remove scroll do tbody */
  useEffect(() => {
    const tbody = document.getElementById("idBody");
    tbody.style.overflow = template.showMenu || template.showMenuLogin ? "hidden" : 'auto'
  }, [template])

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
        <TemplateContext.Provider value={{ template, setTemplate }}>
          <StoreContext.Provider value={store}>
            <MyCartContext.Provider value={{ myCart, setMyCart }}>

              {template.showMenu && <Menu />}
              {template.showMenuLogin && <MenuLogin />}
              <Header />
              <Content>
                <Component {...pageProps} />
              </Content>

              {template.showNav && <Nav />}
            </MyCartContext.Provider>
          </StoreContext.Provider>
        </TemplateContext.Provider>
      </SessionProvider>
    </ThemeProvider>
  )
}