import { getSession } from "next-auth/react"
import Head from 'next/head';
import Link from 'next/link';
import styled from "styled-components"
import { CheckCircleFill } from "react-bootstrap-icons";
import { ButtonSC } from "../../../components/button";

import { userIsAuth } from "../../api/auth";

const MainSC = styled.div`
    max-width: ${({ theme }) => theme.width.medium};
    margin: 0 auto;
    display:  flex;
    flex-direction: column;
    padding: 1rem;
    [data="icone"]{
        padding-bottom: 0.8rem;
        text-align: center;
        svg{
            font-size: 4rem;
            color: #067d62;
        }
    }
    [data="msg"]{
        h1{
            font-size: 1.7rem;
            color: #067d62;
            text-align: center;
            font-family: ${({ theme }) => theme.font.family.meidum};
            padding: 0.7rem;
        }
        h2{
            font-family: ${({ theme }) => theme.font.family.bold};
            text-align: center;
            font-size: 1.1rem;
        }
    }
    [data="nmr-pedido"]{
        margin: 1.7rem 0;
        border: 0.1rem solid #e7e7e7;
        background-color: #fafafb;
        padding: 3rem 1rem;
        display: flex;
        flex-direction: column;
        align-items:center;
        p{
            font-size: 1.3rem;
            line-height: 1rem;
            color: #565c69;
            margin-bottom: 0.5rem;
        }
        div{
            strong{
                font-size: 1.7rem;
                line-height: 2.125rem;
                color: #42464d;
                margin-left: 0.75rem;
                font-family: ${({ theme }) => theme.font.family.bold}
            }
        }
    }
    [data="btn"]{
        [data='btn-confirm-white'],
        [data='btn-confirm-noborder'] {
            padding: 0.5rem 0;
        }
    }
`
export default function PaymentStore() {
    return (
        <>
            <Head>
                <title>Conclusão de compra</title>
            </Head>
            <div>
                <MainSC>
                    <div data="icone">
                        <CheckCircleFill />
                    </div>
                    <div data="msg">
                        <h1>
                            Seu pedido foi reservado.
                        </h1>
                        <h2>
                            Você tem até 24 horas para fazer a retirada na loja. Caso não seja retirado o pedido será automaticamente cancelado e os valores estornados.
                        </h2>
                    </div>
                    <div data="nmr-pedido">
                        <p>
                            O número do seu pedido é:
                        </p>
                        <div>
                            <strong>
                                {(1).toLocaleString('en-US', {
                                    minimumIntegerDigits: 7,
                                    useGrouping: false
                                })}
                            </strong>
                        </div>
                    </div>
                    <div data="btn">
                        <ButtonSC>
                            <div data='btn-confirm-noborder'>
                                <Link href="/">
                                    Continuar comprando
                                </Link>
                            </div>
                        </ButtonSC>
                        <ButtonSC>
                            <div data='btn-confirm-white'>
                                <Link href="/conta/meuspedidos">
                                    Ver meus pedidos
                                </Link>
                            </div>
                        </ButtonSC>
                    </div>
                </MainSC>
            </div>
        </>

    )
}

export async function getServerSideProps(context) {
    /* SESSSÃO USUARIO LOGADO */
    const req = context.req
    const session = await getSession({ req })
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }
    const userAuth = await userIsAuth(session)
    if (!userAuth) {
        return {
            redirect: {
                destination: "/conta/meusdados",
                permanent: false
            }
        }
    }

    return {
        props: {},
    }
}