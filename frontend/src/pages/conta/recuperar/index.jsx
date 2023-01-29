import jwt from "jwt-simple"
import Link from 'next/link';
import { ChevronLeft } from "react-bootstrap-icons";
const { SECRET_KEY_AUTH } = require("../../../../.env");
import Head from 'next/head';
import styled from "styled-components"
import { getSession } from "next-auth/react";
import router from "next/router"
import { Formik, Form } from 'formik';
import * as Yup from "yup";
import { pt } from "yup-locale-pt";
Yup.setLocale(pt);

import { Content, ContentHeader } from "../../../components/containe"
import { ShowMessage } from "../../../components/showMessage"
import { Group } from '../../../components/input';

import { storePassword } from '../../api/auth';

const BtnConfirmSC = styled.div`
    [data='button-submit']{
        padding: 0.7rem 1rem;
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
            <Content maxwidth="40rem" padding="0" bgWhite>
                <ContentHeader bgGray padding="1.3rem 0.5rem">
                    <Link href="/">
                        <ChevronLeft data="icon-left" />
                        <h2 data="h1-title">
                            Auxilio de senha
                        </h2>
                    </Link>
                </ContentHeader>
                <Content padding="0.5rem 1rem" noShadow>
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
                                <p data="p-info">
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
                                <p data="p-info">
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
                </Content>
            </Content>
        </>
    )
}

export async function getServerSideProps({ req }) {
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