import { signIn, getSession } from "next-auth/react"
import Head from "next/head"
import router from "next/router"
import { useContext } from "react";
import styled from "styled-components"
import { Facebook, Google, DoorOpen } from "react-bootstrap-icons"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup";
import { pt } from "yup-locale-pt";
Yup.setLocale(pt);

import { ShowMessage } from "../../components/showMessage";

import { storeAuth } from "../api/auth/index"

import StoreContext from "../../context/store";
import Link from "next/link";
import { toast } from "react-toastify";

const LoginSC = styled.div`
  padding: 1rem 1.3rem;
  [data='exibir']{
    max-width:${({ theme }) => theme.width.medium};
    margin:0 auto;

    [data="form"]{
      display: flex;
      flex-direction: column;
      h1{
        text-align:center;
        margin-bottom: 1.5rem;
        font-family:${({ theme }) => theme.font.family.bold};
        color: #111;
      }
      [data="recover"]{
        display: flex;
        justify-content: space-between;
        align-items:center;
        font-size: 1rem !important;
        font-family:${({ theme }) => theme.font.family.medium};
        margin: 1rem 0;
        margin-top: 0.5rem;
        >label{
          display: flex;
          align-items:center;
          input{
            height: 1.7rem;
            width: 1.7rem;
          }
          span{
            margin-left: 7px;
          }
        }
        a{
          font-size: 1rem !important;
          font-family:${({ theme }) => theme.font.family.medium};
          text-decoration: underline;
        }
      }
      [data="btn-entrar"]{
        margin: 0.5rem 0px;
        button{
          display: flex;
          align-items: center;
          justify-content: center ;
          color: #ffffff;
          background: linear-gradient(to bottom,#f7dfa5,#f0c14b);
          border-color: #a88734 #9c7e31 #846a29;
          font-family:${({ theme }) => theme.font.family.bold};
          font-size: 1rem;
          padding:  0.7rem 0;
          width: 100%;
          text-transform: uppercase;
          border-radius: 0.25rem;
          color: #111;
          box-shadow: 0 1px 0 rgb(#ffffff / 40%) inset;
          border-style: solid;
          border-width: 1px;
          svg{
            margin-right: 0.6rem;
            font-size: 1.7rem;
          }
        }
      }
    }
    [data="social-media"]{
      border-top: 0.0625rem solid #dee0e4;
      margin: 1rem 0;
      padding-top: 1.5rem;
      display: flex;
      flex-direction: column;
      margin-bottom: 2rem;
      align-items:center;

      > span{
        font-size: 1rem;
        color: 	#7f858d;
        text-transform: uppercase;
        margin-bottom: 1rem;
        font-family:${({ theme }) => theme.font.family.bold};
      }
      > div{
        display: flex;
        width: 100%;
        button{
          width: 100%;
          display: flex;
          align-items:center;
          justify-content:center;
          font-family:${({ theme }) => theme.font.family.bold};
          border-radius: 0.25rem;
          background-color: #ffffff;
          font-size: 1.3rem;
          padding: 0.8rem 0;
          svg{
            margin-right: 1rem;
            font-size: 1.6rem;
          }
        }
        [data="btn-facebook"]{
          border: 0.0625rem solid #0060b1;
          color: 	#0060b1;
          margin-right:0.3rem;
        }
        [data="btn-google"]{
          border: 0.0625rem solid #e72626;
          color: #e72626;
          margin-left:0.3rem;
        }
      }
    }
    [data="new"]{
      [data="h5-acessando"]{
        text-align: center;
        position: relative;
        top: 2px;
        padding-top: 1px;
        margin-bottom: 1.1rem;
        line-height: 0;
        h5{
          line-height: 1;
          font-size: 1rem;
          color: #767676;
          font-weight: 400;
          z-index: 2;
          position: relative;
          display: inline-block;
          background-color: #fff;
          padding: 0 8px 0 7px;
        }
        &:after{
          content: "";
          width: 100%;
          background-color: transparent;
          display: block;
          height: 1px;
          border-top: 1px solid #dee0e4;
          position: absolute;
          top: 50%;
          margin-top: -1px;
          z-index: 1;
        }
      }
      [data="new-cadastro"]{
        display: flex;
        a{
          background: linear-gradient(to bottom,#f7f8fa,#e7e9ec);
          border-radius: 3px;
          border-color: #adb1b8 #a2a6ac #8d9096;
          border-style: solid;
          border-width: 1px;
          width: 100%;
          text-align: center;
          font-size: 1rem;
          padding: 0.6rem;
        }
      }
    }
  }
`
const GroupSC = styled.div`
  display:flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  [data="label"]{
    padding: 0.4rem;
    label{
      font-family:${({ theme }) => theme.font.family.bold};
      font-size: 1.4em;
    }
    
  }
  [data="input"]{
    border-top-color: #949494;
    border: 0.1rem solid #a6a6a6;
    box-shadow: 0 0.1rem 0 rgb(0 0 0 / 7%) inset;
    border-radius: 0.3rem 0.3rem 0 0;
    border-right-color: #949494;
    border-bottom-color: #949494;
    border-left-color: #949494;
    border-color:${({ error }) => error && "#d00"};
    box-shadow:${({ error }) => error && "0 0 0 0.2rem rgb(221 0 0 / 15%) inset;"};
    input{
      width: 100%;
      background-color: transparent;
      padding: 0.8rem;
      padding-top: 0.9rem;
      box-shadow: none;
      border: 0;
      font-size: 1.1rem;
    }
    [data="show-password"]{
      width: 100%;
      padding: 0 10px 6px 10px;
      span{
        color: #555!important;
        font-size: 0.9rem !important;
      }
    }
  }
  [data="error"]{
        font-size: 1rem;
        color: #e72626;
        margin-top: 0.0rem;
        small{
            padding: 0px;
            margin: 0px;
        }
  }
`

export default function Login({ error }) {
  const store = useContext(StoreContext)
  const initialValues = {
    email: '',
    senha: '',
    show_password: true,
  }
  const scheme = Yup.object().shape({
    email: Yup.string().email().label("E-mail").required(),
    senha: Yup.string().required().label("Senha"),
  });

  return (
    <>
      <Head>
        <title>{store.nome ? `${store.nome} : Acessar` : 'Carregando...'}</title>
      </Head>
      <LoginSC>
        <div data='exibir'>
          <Formik
            validationSchema={scheme}
            initialValues={initialValues}
            onSubmit={async (values, setValues) => {
              await storeAuth(values)
                .then(() => {
                  router.push("/")
                })
                .catch((res) => {
                  /* Se status 400, significa que o erro foi tratado. */
                  if (res && res.response && res.response.status == 400) {
                    /* Se data.erro=500, será exibido no toast */
                    if (res.response.data && res.response.data[500]) {
                      toast.error(res.response.data[500])
                    } else {
                      setValues.setErrors(res.response.data)
                    }
                  } else {
                    /* Mensagem padrão */
                    toast.error("Ops... Não possível realizar a operação. Por favor, tente novamente.")
                  }
                })
            }}
          >
            {({ setFieldValue, values, errors, touched, dirty }) => (
              <Form data="form" action="">
                <h1>FAZER LOGIN</h1>
                <ShowMessage error={dirty ? errors : error} />
                <GroupSC error={!!errors.email && touched.email}>
                  <div data="label">
                    <label htmlFor="email">Email</label>
                  </div>
                  <div data="input">
                    <Field name="email" type="email" maxLength="120" />
                  </div>
                  <div data="error">
                    <small>
                      <ErrorMessage name="email" />
                    </small>
                  </div>
                </GroupSC>
                <GroupSC error={!!errors.senha && touched.senha}>
                  <div data="label">
                    <label htmlFor="senha">Senha</label>
                  </div>
                  <div data="input">
                    <Field name="senha" type="password" maxLength="255" />
                    {values.show_password && values.senha && (
                      <div data="show-password">
                        <span name="senha" value>{values.senha}</span>
                      </div>
                    )}
                  </div>
                  <div data="error">
                    <small>
                      <ErrorMessage name="senha" />
                    </small>
                  </div>
                </GroupSC>

                <div data="recover">
                  <label htmlFor="show_password" onClick={() => setFieldValue("show_password", !values.show_password)}>
                    <Field name="show_password" type="checkbox" /><span>Mostrar senha</span>
                  </label>
                  <Link href="/login/recuperar">Esqueceu a senha?</Link>
                </div>

                <div data="btn-entrar">
                  <button type="submit"><DoorOpen /><b>ENTRAR</b></button>
                </div>
              </Form>
            )}
          </Formik>
          <div data="social-media">
            <span data='span-social'>Quero acessar com minhas redes sociais</span>
            <div>
              <button data="btn-facebook" onClick={() => signIn('facebook')}><Facebook /><b>Facebook</b></button>
              <button data="btn-google" onClick={() => signIn('google')}><Google /><b>Google</b></button>
            </div>
          </div>
          <div data="new">
            <div data="h5-acessando">
              <h5>Acessando pela primeira vez?</h5>
            </div>
            <div data="new-cadastro">
              <Link href="/conta/cadastro">Criar seu cadastro</Link>
            </div>
          </div>
        </div>
      </LoginSC>
    </>
  )
}

export async function getServerSideProps({ req, query }) {
  const session = await getSession({ req })
  /* Se o usuario tiver logado redireciona para o home */
  if (session && session.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }
  /* Verifica se veio alguma query, se tiver transformar em objeto */
  /* Essas mensagem são passadas quando cadastrar um novo usuario */
  /* ex: mensagem orientando verificar o email */
  if (query && query.msg) {
    try {
      const msg = JSON.parse(query.msg)
      return {
        props: { error: msg },
      }
    } catch (error) {
    }
  }

  return {
    props: {},
  }
}