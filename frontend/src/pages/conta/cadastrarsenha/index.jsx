const { SECRET_KEY_AUTH } = require("../../../../credentials")
import jwt from "jwt-simple"
import Head from 'next/head';
import Link from 'next/link';
import { ChevronLeft } from "react-bootstrap-icons";
import styled from "styled-components"
import { getSession } from "next-auth/react";
import router from "next/router"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { pt } from "yup-locale-pt";
Yup.setLocale(pt);

import { Content, ContentHeader } from "../../../components/containe"
import { ButtonYellow } from "../../../components/button"
import { ShowMessage } from "../../../components/showMessage"
import { Group } from '../../../components/input';

import { storePassword } from '../../api/auth';

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
export default function NewPassword({ data }) {
    const scheme = Yup.object().shape({
        senha: Yup.string().nullable().label("Senha").required("É necessário informar uma senha.")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/,
                "Deve ter no mínimo 6 dígitos, 1 letra maiúscula, 1 minúscula e um número"
            ),
        confirsenha: Yup.string().oneOf([Yup.ref("senha"), null], "A confirmação de senha não confere.")
            .required("É necessário confirmar sua senha.").label("Confirmar senha")
    });

    return (
        <>
            <Head>
                {data.email_auth ?
                    <title>Recuperar senha</title>
                    :
                    <title>Criar senha</title>
                }
            </Head>
            <Content maxwidth="40rem" padding="0" bgWhite>
                <ContentHeader bgGray padding="1.3rem 0.5rem">
                    <Link href="/">
                        <ChevronLeft data="icon-left" />
                        <h1 data="h1-title">
                            {data.email_auth ?
                                <>Recuperar senha</>
                                :
                                <>Criar senha</>
                            }
                        </h1>
                    </Link>
                </ContentHeader>
                <Content padding="0.5rem 1rem" noShadow>
                    <Formik
                        validationSchema={scheme}
                        initialValues={{ senha: '', confirsenha: '', show_password: true, ...data }}
                        onSubmit={async (values, setValues) => {
                            /* Os dados sera convetido em jwt antes de enviar para o backend */
                            const modelo = jwt.encode(values, SECRET_KEY_AUTH)
                            await storePassword({ userJWT: modelo }, data.id)
                                .then((data) => {
                                    /* Redireciona para tela inicial passando a mensagem(msg) */
                                    router.push({
                                        pathname: "/login",
                                        query: {
                                            msg: JSON.stringify(data) /* mensagem sucesso */
                                        }
                                    })
                                })
                                .catch((res) => {
                                    if (res && res.response && res.response.status == 400) {
                                        router.push({
                                            pathname: "/login",
                                            query: {
                                                msg: JSON.stringify(res.response.data)
                                            }
                                        })
                                    } else {
                                        router.push("/login")
                                    }
                                })
                        }}
                    >
                        {({ values, errors, touched, dirty }) => (
                            <Form data="form" action="">
                                <ShowMessage error={errors} />
                                <Group
                                    label="E-mail"
                                    name="email"
                                    disabled
                                />
                                {data.email_auth ?
                                    <GroupSC error={!!errors.senha && touched.senha}>
                                        <div data="label">
                                            <label htmlFor="senha">Crie sua nova senha</label>
                                        </div>
                                        <div data="input">
                                            <Field name="senha" type="password" autoComplete='off' maxLength="55" />
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
                                    :
                                    <GroupSC error={!!errors.senha && touched.senha}>
                                        <div data="label">
                                            <label htmlFor="senha">Crie sua senha</label>
                                        </div>
                                        <div data="input">
                                            <Field name="senha" type="password" autoComplete='off' maxLength="55" />
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
                                }
                                <Group
                                    error={!!errors.confirsenha && touched.confirsenha}
                                    label="Confirme sua senha"
                                    name="confirsenha"
                                    type="password"
                                    maxLength={55}
                                />

                                <ButtonYellow margin="1.5rem 0">
                                    <button disabled={!dirty} type="submit">
                                        Cadastrar
                                    </button>
                                </ButtonYellow>
                            </Form>
                        )}
                    </Formik>
                </Content>
            </Content>
        </>
    )
}

export async function getServerSideProps({ req, query }) {
    const { SECRET_KEY_AUTH } = require("../../../../credentials")
    const session = await getSession({ req })
    if (session && session.id) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    if (query && query.authlogin)
        try {
            const jwt = require("jwt-simple")

            const decoded = jwt.decode(query.authlogin, SECRET_KEY_AUTH);
            const userBody = {
                id: decoded.id,
                email: decoded.email,
                email_auth: decoded.email_auth,
                exp: decoded.exp
            }
            return {
                props: { data: { ...userBody } },
            }
        } catch (error) {
        }

    return {
        redirect: {
            destination: "/login",
            permanent: false,
        }
    }
}