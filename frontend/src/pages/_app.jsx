import { parseCookies, setCookie } from "nookies";
import { GlobalStyles } from "../styles/global-styles"
import { ThemeProvider } from "styled-components"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react"
import { useRouter } from "next/router";

import Header from "../components/template/header"
import Content from "../components/template/content"
import Loanding from "../components/template/loanding"
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
  const defaultTemplate = { loading: false, showHeaderSearch: true, showMenu: false, showNav: true, showMenuLogin: false, footerReduce: false }
  const [template, setTemplate] = useState(defaultTemplate)
  const [myCart, setMyCart] = useState([])
  const [store, setStore] = useState([])
  const { myCartId } = parseCookies();
  const teste = parseCookies();

  useEffect(() => {
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
      case '/carrinho/finalizado':
        setTemplate({ ...defaultTemplate, showHeaderSearch: false, footerReduce: true })
        break;
      case '/conta/meusdados':
      case '/conta/recuperar':
      case '/conta/endereco':
        setTemplate({ ...defaultTemplate, showHeaderSearch: false })
        break;
      case '/produto/[id]':
        setTemplate({ ...defaultTemplate, footerReduce: true })
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

  const handleStore = async () => {
    /* bloqueios, erros, tem que ser tratado aqui(!!pendente!!) */
    await getStore()
      .then((res) => {
        if (res.data.error) return toast.error(res.data.error)
        setStore(res.data)
      })
      .catch((error => console.log(error)))
  }
  const handleMyCart = async () => {
    console.log("COOKIES[_APP]")
    console.log(teste)
    /*Verifica se id_storage está setado. So carrega o carrinh se tiver id. */
    if (!myCartId) {
      const now = `${Date.now()}-${(Math.random() * (9999 - 1000) + 1000).toFixed()}-${(Math.random() * (9999 - 1000) + 1000).toFixed()}-${(Math.random() * (9999 - 1000) + 1000).toFixed()}`
      setCookie(null, "myCartId", now, {
        maxAge: 60 * 60 * 24 * 30,  /* EXPIRA EM 30 DIAS. "seg * min * hrs * dias" */
        path: "/"
      });
    } else {
      setMyCart(await getCartTemp(myCartId))
    }
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

              {template.loading ? <Loanding /> :
                <>
                  {template.showMenu && <Menu />}
                  {template.showMenuLogin && <MenuLogin />}
                  <Header />
                  <Content>
                    <Component {...pageProps} />
                  </Content>

                  {template.showNav && <Nav />}
                </>
              }
            </MyCartContext.Provider>
          </StoreContext.Provider>
        </TemplateContext.Provider>
      </SessionProvider>
    </ThemeProvider>
  )
}