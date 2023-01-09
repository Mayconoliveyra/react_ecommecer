import Head from 'next/head';
import styled from "styled-components"
import { getSession } from "next-auth/react";
import router from "next/router"
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { pt } from "yup-locale-pt";
Yup.setLocale(pt);

import { ShowMessage } from "../../../components/showMessage"
import { Group } from '../../../components/input';

import { proneMask, cepMask } from '../../../../masks';
import { store as saveUser } from '../../api/auth';

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

export default function NewPassword({ session }) {
    return (
        <>
            <Head>
                <title>Criar conta</title>
            </Head>
            <MyDataSC>
                <SeusDadosSC>
                    <div>
                        <div data="h4-title">
                            <h4>Criar conta</h4>
                        </div>
                        <Formik
                            /*   initialValues={{ nome: '', senha: '', confirsenha: '' }} */
                            initialValues={session}
                            onSubmit={async (values, setValues) => {
                                await saveUser(values)
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
                            {({ errors, touched, dirty }) => (
                                <Form data="form" action="">
                                    <ShowMessage error={errors} />
                                    <Group
                                        label="E-mail"
                                        name="email"
                                        disabled
                                    />
                                    <Group
                                        error={!!errors.senha && touched.senha}
                                        label="Senha"
                                        name="senha"
                                        autocomplete="on"
                                        mask={proneMask}
                                    />
                                    <Group
                                        error={!!errors.confirsenha && touched.confirsenha}
                                        label="Confirmar senha"
                                        name="confirsenha"
                                        autocomplete="on"
                                        mask={cepMask}
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
    let session = await getSession({ req })
    const { TOKEN_KEY } = require("../../../../.env");
    const jwt = require('jsonwebtoken')

    try {
        const decoded = jwt.decode(query.authlogin, TOKEN_KEY);
        const decodM = {
            key_auth: decoded.key_auth,
            email: decoded.email
        }

        /* divide por 1000 para transformar em segundos */
        /* O token fica expirado dps de 15m */
        if (decoded.exp > (Date.now() / 1000)) {
            console.log("ATIVO")
            session = { ...session, ...decodM }
        } else {
            console.log("EXPIRADO")
            /* const msg = { 400: "Sua sessão expirou. Efetue login novamente e refaça o procedimento." } */
            session = { ...session, ...decodM }
        }
    } catch (error) {
        /* Se tiver algum erro/alterar token será redirecionado para tela home. */
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }



    /* Se tiver logado, redireciona para tela home*/
    if (session && session.id) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: { session },
    }
}