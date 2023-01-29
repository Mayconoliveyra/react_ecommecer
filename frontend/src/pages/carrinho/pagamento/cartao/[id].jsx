import { parseCookies } from "nookies";
import { getSession } from "next-auth/react"
import Head from 'next/head';

import { Content } from "../../../../components/containe";
import { Header, NumberOrder, MsgNotification, Btns } from "../../../../components/pagamento/components"

import { userIsAuth } from "../../../api/auth";

export default function PaymentCard({ id }) {
    return (
        <>
            <Head>
                <title>Conclusão de compra</title>
            </Head>
            <Content bgWhite maxwidth="40rem" padding="1rem">
                <Header title="Seu pedido foi reservado." sub="Você tem até 24 horas para fazer a retirada na loja. Caso não seja retirado o pedido será automaticamente cancelado e os valores estornados." />
                <NumberOrder id={id} />
                <MsgNotification />
                <Btns />
            </Content>
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