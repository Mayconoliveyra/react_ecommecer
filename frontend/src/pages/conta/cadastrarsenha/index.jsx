import Head from 'next/head';
import styled from "styled-components"
import { getSession } from "next-auth/react";
import router from "next/router"
import { Formik, Form } from 'formik';
import * as Yup from "yup";
import { pt } from "yup-locale-pt";
Yup.setLocale(pt);

import { ShowMessage } from "../../../components/showMessage"
import { Group } from '../../../components/input';

import { storePassword } from '../../api/auth';

const MyDataSC = styled.div`
    max-width: 35rem;
    margin: 0 auto;
`
const SeusDadosSC = styled.div`
    margin: 0.5rem 0;
    padding: 0 0.3rem;
    >div{
        color: #0F1111;
        [data="h4-title"]{
            border-radius: 0.3rem 0.3rem 0 0;
            border: 1px #D5D9D9 solid;
            padding: 0.6rem 1.5rem;
            h4{
                color: #0F1111;
                font-size: 2rem;
                font-family:${({ theme }) => theme.font.family.bold};
                margin: 0px;
                padding: 0px;
            }
        }
        [data="form"]{
            border: 1px #D5D9D9 solid;
            border-radius: 0 0 0.8rem 0.8rem;
            padding: 0.3rem 0.7rem;
        }
    }
`
const BtnConfirmSC = styled.div`
    [data='button-submit']{
        padding: 0.7rem 1rem;
        border-top: 0.1rem solid #e7e7e7;
        display: flex;
        button{   
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 0;
            font-size: 1.2rem;
            flex: 1;
            background: #FFD814;
            border-color: #FCD200;
            border-radius: 0.45rem;
            color: #0F1111;

            &:disabled{
                cursor: default;
            }
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
            <MyDataSC>
                <SeusDadosSC>
                    <div>
                        <div data="h4-title">
                            {data.email_auth ?
                                <h4>Recuperar senha</h4>
                                :
                                <h4>Criar senha</h4>
                            }
                        </div>
                        <Formik
                            validationSchema={scheme}
                            initialValues={{ senha: '', confirsenha: '', ...data }}
                            onSubmit={async (values, setValues) => {
                                await storePassword(values)
                                    .then((data) => {
                                        /* Redireciona para tela inicial passando a mensagem(msg) */
                                        router.push({
                                            pathname: "/login",
                                            query: {
                                                msg: JSON.stringify(data)
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
                            {({ errors, touched, dirty }) => (
                                <Form data="form" action="">
                                    <ShowMessage error={errors} />
                                    <Group
                                        label="E-mail"
                                        name="email"
                                        disabled
                                    />
                                    {data.email_auth ?
                                        <Group
                                            error={!!errors.senha && touched.senha}
                                            label="Crie sua nova senha"
                                            name="senha"
                                            type="password"
                                            maxLength={55}
                                        />
                                        :
                                        <Group
                                            error={!!errors.senha && touched.senha}
                                            label="Crie sua senha"
                                            name="senha"
                                            type="password"
                                            maxLength={55}
                                        />
                                    }
                                    <Group
                                        error={!!errors.confirsenha && touched.confirsenha}
                                        label="Confirme sua senha"
                                        name="confirsenha"
                                        type="password"
                                        maxLength={55}
                                    />

                                    <BtnConfirmSC>
                                        <div data='button-submit'>
                                            <button disabled={!dirty} type="submit">
                                                Cadastrar
                                            </button>
                                        </div>
                                    </BtnConfirmSC>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </SeusDadosSC>
            </MyDataSC>
        </>
    )
}

export async function getServerSideProps({ req, query }) {
    const session = await getSession({ req })
    /* Se já tiver logado redireciona para o home */
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
            const { TOKEN_KEY } = require("../../../../.env");
            const jwt = require('jsonwebtoken')

            const decoded = jwt.decode(query.authlogin, TOKEN_KEY);
            const userBody = {
                id: decoded.id,
                email: decoded.email,
                key_auth: decoded.key_auth,
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