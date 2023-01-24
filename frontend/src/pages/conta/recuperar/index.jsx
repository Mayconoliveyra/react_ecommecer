import jwt from "jwt-simple"
const { SECRET_KEY_AUTH } = require("../../../../.env");
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
    height: 100%;
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
            p{
               margin: 0.5rem;
               font-size: 1.1rem;
            }
            p:nth-child(3){
               margin: 0.5rem;
               font-size: 0.9rem;
               a{
                text-decoration: underline;
                color: #0066c0;
                font-family:${({ theme }) => theme.font.family.medium};
               }
            }
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

export default function Recover() {
    const scheme = Yup.object().shape({
        email: Yup.string().email().label("E-mail").required()
    });

    return (
        <>
            <Head>
                <title>Esqueceu sua senha</title>
            </Head>
            <MyDataSC>
                <SeusDadosSC>
                    <div>
                        <div data="h4-title">
                            <h4>Auxilio de senha</h4>
                        </div>
                        <Formik
                            validationSchema={scheme}
                            initialValues={{ email: "" }}
                            onSubmit={async (values) => {
                                /* Os dados sera convetido em jwt antes de enviar para o backend */
                                const modelo = jwt.encode(values, SECRET_KEY_AUTH)
                                await storePassword({ userJWT: modelo })
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
                            {({ errors, touched, dirty }) => (
                                <Form data="form" action="">
                                    <ShowMessage error={errors} />

                                    <p>
                                        Insira seu endereço de e-mail cadastrado para receber um email de recuperação de senha.
                                    </p>
                                    <Group
                                        error={!!errors.email && touched.email}
                                        label="Seu email"
                                        name="email"
                                        type="email"
                                        autocomplete="on"
                                        maxLength={55}
                                    />
                                    <p>
                                        Se você não usa mais o endereço de e-mail associado à sua conta, entre em contato. <a href="#attendance">Atendimento ao cliente</a> para ajudar a restaurar o acesso à sua conta.
                                    </p>
                                    <BtnConfirmSC>
                                        <div data='button-submit'>
                                            <button disabled={!dirty} type="submit">
                                                Continuar
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

    return {
        props: {},
    }
}