import { parseCookies } from "nookies";
import { getSession } from "next-auth/react"
import Head from 'next/head';
import styled from "styled-components"

import { Header, NumberOrder, MsgNotification, Btns } from "../../../../components/pagamento/components"

import { userIsAuth } from "../../../api/auth";

const MainSC = styled.div`
    max-width: ${({ theme }) => theme.width.medium};
    margin: 0 auto;
    display:  flex;
    flex-direction: column;
    padding: 1rem;
`
export default function PaymentCard({ id }) {
    return (
        <>
            <Head>
                <title>Conclusão de compra</title>
            </Head>
            <div>
                <MainSC>
                    <Header title="Seu pedido foi reservado." sub="Você tem até 24 horas para fazer a retirada na loja. Caso não seja retirado o pedido será automaticamente cancelado e os valores estornados." />
                    <NumberOrder id={id} />
                    <MsgNotification />
                    <Btns />
                </MainSC>
            </div >
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
    /* /FIM VALIDAÇÃO SESSION/ */
    const { paymentResult } = parseCookies(context);
    const { id } = context.params; /* id do pedido; */

    /* "id" vem da base quando salva o pedido, ja payment é setado quando finaliza o pedido, tem duraçaõ 1m. */
    if (id != paymentResult) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: { id: id },
    }
}