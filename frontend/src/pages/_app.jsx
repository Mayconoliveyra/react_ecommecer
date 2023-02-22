import { parseCookies, setCookie } from "nookies";
import { GlobalStyles } from "../styles/global-styles"
import { ThemeProvider } from "styled-components"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react"
import { useRouter } from "next/router";
/* import 'bootstrap/dist/css/bootstrap-grid.min.css'; */
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "../components/template/header"
import Content from "../components/template/content"

import PortalContent from "../components/template/portal/content";

import Loanding from "../components/template/loanding"
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
  const defaultTemplate = { loading: false, showHeaderSearch: true, showMenu: false, showMenuLogin: false, footerReduce: false, showEndereco: true, portal: false }
  const [template, setTemplate] = useState(defaultTemplate)
  const [myCart, setMyCart] = useState([])
  const [store, setStore] = useState([])
  const { myCartId } = parseCookies();

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
      case '/carrinho/resumo':
        setTemplate({ ...defaultTemplate, showHeaderSearch: false, footerReduce: true })
        break;
      case '/conta/meusdados':
      case '/conta/recuperar':
      case '/conta/endereco':
      case '/carrinho/pagamento/pix/[id]':
      case '/carrinho/pagamento/entrega/[id]':
      case '/carrinho/pagamento/loja/[id]':
        setTemplate({ ...defaultTemplate, showHeaderSearch: false })
        break;
      case '/produto/[id]':
        setTemplate({ ...defaultTemplate, footerReduce: true })
        break;

      /* PORTAL */
      case '/portal':
      case '/portal/cadastros/produtos':
      case '/portal/cadastros/produtos/adicionar':
      case '/portal/cadastros/produtos/editar/[id]':
      case '/portal/cadastros/produtos/visualizar/[id]':

      case '/portal/pedidos':
        setTemplate({ ...defaultTemplate, portal: true })
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
    /*Verifica se id_storage está setado. So carrega o carrinh se tiver id. */
    if (!myCartId) {
      const now = `${Date.now()}-${(Math.random() * (9999 - 1000) + 1000).toFixed()}-${(Math.random() * (9999 - 1000) + 1000).toFixed()}-${(Math.random() * (9999 - 1000) + 1000).toFixed()}`
      setCookie(null, "myCartId", now, {
        maxAge: 60 * 60 * 24 * 30 * 365, /* 1 ano */
        path: "/"
      });
    } else {
      /* Atualiza tempo exp cokkies id_storage */
      setCookie(null, "myCartId", myCartId, {
        maxAge: 60 * 60 * 24 * 30 * 365, /* 1 ano */
        path: "/"
      });
      setMyCart(await getCartTemp({ id_storage: myCartId }))
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
              {template.loading ?
                <Loanding />
                :
                <>
                  {template.portal ?
                    <PortalContent>
                      <Component {...pageProps} />
                    </PortalContent>
                    :
                    <>
                      {template.showMenu && <Menu />}
                      {template.showMenuLogin && <MenuLogin />}
                      <Header />
                      <Content>
                        <Component {...pageProps} />
                      </Content>
                    </>
                  }
                </>
              }
            </MyCartContext.Provider>
          </StoreContext.Provider>
        </TemplateContext.Provider>
      </SessionProvider>
    </ThemeProvider>
  )
}