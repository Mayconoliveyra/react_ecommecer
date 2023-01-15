import { parseCookies } from "nookies";
import { getSession } from "next-auth/react"
import Head from 'next/head';
import styled from "styled-components"
import router from "next/router"

import { CardPayment } from "../../../components/card/cardPayment"
import { ButtonSC } from '../../../components/button';

import { moneyMask } from '../../../../masks';
import { getCartTemp, storePedido } from '../../api/cart';
import { userIsAuth } from "../../api/auth";
import { showError } from "../../../../global";

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
const DeliveryAddresSC = styled.div`
    margin: 1rem 0;
    padding: 0 0.7rem;
    >div{
        color: #0F1111;
        [data="resume"]{
            border: 1px #D5D9D9 solid;
            border-radius: 0.3rem 0.3rem 0 0;
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
            padding: 1rem 1.2rem;
            table{
                width: 100%;
                border-collapse: collapse;
                tr{
                    color: #0F1111;
                    td{
                        width: 100%;
                        padding: 0.1rem;
                        font-size:1.2rem;
                        font-family: ${({ theme }) => theme.font.family.regular};
                    }
                    [data="name-user"]{
                        font-size:1.3rem;
                        font-family: ${({ theme }) => theme.font.family.bold};
                        color: #0F1111;
                        width: 100%;
                    }
                }
            }
        }
    }
`
const PaymentInfoSC = styled.div`
    /* border:solid 1px red; */
    margin: 1rem 0;
    padding: 0 0.7rem;
    >div{
        color: #0F1111;
        [data="resume"]{
            border: 1px #D5D9D9 solid;
            border-radius: 0.3rem 0.3rem 0 0;
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
            padding: 1rem 1.2rem;
            table{
                width: 100%;
                border-collapse: collapse;
                tr{
                    color: #0F1111;
                    td{
                        width: 100%;
                        padding: 0.1rem;
                        font-size:1.2rem;
                        font-family: ${({ theme }) => theme.font.family.regular};
                    }
                    [data="name-user"]{
                        font-size:1.3rem;
                        font-family: ${({ theme }) => theme.font.family.bold};
                        color: #0F1111;
                        width: 100%;
                    }
                }
            }
        }
    }
`
const SectionProductSC = styled.div`
    padding: 0 0.6rem;
    [data-div="cads"]{
        display: grid;
        grid-template-columns: repeat(1fr);
    }

    [data-div='cart-vazio']{
        margin: 0.8rem 1rem;
        h1 {
            font-size: 1.1rem;
            margin-left: 10px;
            display:flex;
            margin: 0px;
        }
        p {
            font-size: 1rem;
            margin: 0px;
        }
    }
`
export default function Resume({ session, products, totals, payment }) {
    const handleFinalizar = async () => {
        const dataPedido = {
            id_user: session.id,
            id_storage: session.id_storage,
            ...totals,
            ...payment
        }

        if (payment.pgt_forma == "Pagar na loja" || payment.pgt_forma == "Pagar na entrega") {
            const statusPedido = await storePedido(dataPedido)
                .then((res) => console.log(res))
                .catch((error) => {
                    router.push("/")
                    return showError(error)
                })
            console.log(statusPedido)
        }
    }
    return (
        <>
            <Head>
                <title>Confirmar pedido</title>
            </Head>
            <div>
                <ButtonSC>
                    <div data='btn-confirm'>
                        <button type="button" onClick={() => handleFinalizar()}>
                            Confirmar pedido
                        </button >
                    </div>
                </ButtonSC>
                <PaymentValueSC>
                    <div>
                        <div data="resume">
                            <h4>Resumo</h4>
                        </div>
                        <div data="table-values">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Itens:</td>
                                        <td data="td-value">{moneyMask(totals.vlr_pagar_products)}</td>
                                    </tr>
                                    {payment.pgt_metodo == "Receber em casa(Frete)" ?
                                        <>
                                            <tr>
                                                <td>Frete:</td>
                                                <td data="td-value">{moneyMask(totals.vlr_frete)}</td>
                                            </tr>
                                            <tr>
                                                <td data="total-td">Total do pedido:</td>
                                                <td data="td-value-total">{moneyMask(totals.vlr_pagar_com_frete)}</td>
                                            </tr>
                                        </>
                                        :
                                        <>
                                            <tr>
                                                <td>Frete:</td>
                                                <td data="td-value">{moneyMask(0.00)}</td>
                                            </tr>
                                            <tr>
                                                <td data="total-td">Total do pedido:</td>
                                                <td data="td-value-total">{moneyMask(totals.vlr_pagar_sem_frete)}</td>
                                            </tr>
                                        </>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </PaymentValueSC>
                <DeliveryAddresSC>
                    <div>
                        <div data="resume">
                            <h4>Endereço de entrega</h4>
                        </div>
                        <div data="table-values">
                            <table>
                                <tbody>
                                    {payment.pgt_metodo == "Receber em casa(Frete)" ?
                                        <>
                                            <tr>
                                                <td data="name-user">{session.nome}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {session.logradouro}
                                                </td>
                                            </tr>
                                            {session.numero &&
                                                <tr>
                                                    <td>
                                                        {session.numero}
                                                    </td>
                                                </tr>
                                            }
                                            {session.complemento &&
                                                <tr>
                                                    <td>
                                                        {session.complemento}
                                                    </td>
                                                </tr>
                                            }
                                            <tr>
                                                <td>
                                                    {session.localidade}, {session.uf}, {session.cep}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Contato: {session.contato}
                                                </td>
                                            </tr>
                                        </>
                                        :
                                        <tr>
                                            <td>{payment.pgt_metodo}</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </DeliveryAddresSC>
                <PaymentInfoSC>
                    <div>
                        <div data="resume">
                            <h4>Informações de pagamento</h4>
                        </div>
                        <div data="table-values">
                            <table>
                                <tbody>
                                    <tr>
                                        <td data="name-user">Forma de pagamento</td>
                                    </tr>
                                    <tr>
                                        <td>{payment.pgt_forma}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </PaymentInfoSC>

                <SectionProductSC>
                    {products && products.length > 0 ?
                        <>
                            <div data-div="cads">
                                {products.map((product) => {
                                    return (
                                        <CardPayment key={product.id} product={product} />
                                    )
                                })}
                            </div>
                        </>
                        :
                        <>
                            <div data-div='cart-vazio'>
                                <h1>O seu carrinho está vazio :(</h1>
                                <p>...</p>
                            </div>
                        </>
                    }
                </SectionProductSC>

                <ButtonSC>
                    <div data='btn-confirm-noborder'>
                        <button type="button" onClick={() => handleFinalizar()}>
                            Confirmar pedido
                        </button >
                    </div>
                </ButtonSC>
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
        props: { session: { ...session, id_storage: myCartId }, products: data.products, totals: data.totals, payment: JSON.parse(myCartPayment) },
    }
}