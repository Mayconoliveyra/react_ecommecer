import { parseCookies } from "nookies";
import { getSession } from "next-auth/react"
import Head from 'next/head';
import Link from 'next/link';
import styled from "styled-components"

import { getCartTemp } from '../../api/cart';
import { userIsAuth } from "../../api/auth";

const BtnConfirmSC = styled.div`
    [data='yes-border']{
        padding: 0.7rem 1rem;
        border-top: 0.1rem solid #e7e7e7;
        border-bottom: 0.1rem solid #e7e7e7;
        display: flex;
        a, button{   
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 0;
            font-size: 1.15rem;
            flex: 1;
            background: #FFD814;
            border:solid 2px #FCD200;
            border-radius: 0.45rem;
        }
    }
    [data='no-border']{
        margin-top: 1rem;
        padding: 0.7rem 1rem;
        display: flex;
        a, button{   
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 0;
            font-size: 1.15rem;
            flex: 1;
            background: #FFD814;
            border:solid 2px #FCD200;
            border-radius: 0.45rem;
        }
    }
`
const PaymentValueSC = styled.div`
    /* border:solid 1px red; */
    margin: 1rem 0;
    padding: 0 0.7rem;
    >div{
        color: #565959;
        [data="resume"]{
            border: 1px #D5D9D9 solid;
            border-radius: 0.8rem 0.8rem 0 0;
            padding: 0.8rem 1.5rem;
            h4{
                color: #0F1111;
                font-size: 1.2rem;
                margin: 0px;
                padding: 0px;
            }
        }
        [data="table-values"]{
            border: 1px #D5D9D9 solid;
            border-radius: 0 0 0.8rem 0.8rem;
            padding: 1.1rem 1.5rem;
            table{
                width: 100%;
                border-collapse: collapse;
                tr{
                    td{
                        padding: 0.2rem 0.4rem;
                        font-size:1.1rem;
                        font-family: ${({ theme }) => theme.font.family.medium};
                    }
                    [data="td-value"]{
                        font-family: ${({ theme }) => theme.font.family.regular};
                        text-align:right;
                    }
                    [data="total-td"]{
                        padding-top: 0.4rem;
                        font-family: ${({ theme }) => theme.font.family.bold};
                        color: #0F1111;
                        font-size: 1.2rem;
                    }
                    [data="td-value-total"]{
                        padding-top: 0.4rem;
                        font-family: ${({ theme }) => theme.font.family.bold};
                        color: #B12704;
                        text-align:right;
                        font-size: 1.2rem;
                    }
                }
            }
        }
    }
`
export default function Finished() {
    return (
        <>
            <Head>
                <title>Conclusão de compra</title>
            </Head>
            <div>
                <BtnConfirmSC>
                    <div data='yes-border'>
                        <Link href="/">
                            Confirmar pedido
                        </Link>
                    </div>
                </BtnConfirmSC>
                <PaymentValueSC>
                    <div>
                        <div data="resume">
                            <h4>Resumo</h4>
                        </div>
                        <div data="table-values">
                            <h1>teste</h1>
                        </div>
                    </div>
                </PaymentValueSC>

                <BtnConfirmSC>
                    <div data='no-border'>
                        <button type="button">
                            Confirmar pedido
                        </button >
                    </div>
                </BtnConfirmSC>
            </div>
        </>

    )
}

export async function getServerSideProps(context) {
    const { myCartId, myCartPayment } = parseCookies(context);

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

    /* Se myCartPayment tiver null, significa que nao foi preenchido ou foi expirado(1m). */
    if (!myCartPayment) {
        return {
            redirect: {
                destination: "/carrinho",
                permanent: false
            }
        }
    }

    /* Se não tiver setado redireciona */
    if (!myCartId) {
        return {
            redirect: {
                destination: "/carrinho",
                permanent: false
            }
        }
    }

    const data = await getCartTemp(myCartId, session.id)

    /* Se não tiver setado redireciona para tela home*/
    if (!data || !data.totals || !data.products) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: { session: session, products: data.products, totals: data.totals, payment: JSON.parse(myCartPayment) },
    }
}