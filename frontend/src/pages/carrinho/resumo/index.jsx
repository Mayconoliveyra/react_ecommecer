import { parseCookies } from "nookies";
import Head from 'next/head';
import Link from 'next/link';
import styled from "styled-components"

import { CardPayment } from "../../../components/card/cardPayment"

import { moneyMask } from '../../../../masks';
import { getCartTemp } from '../../api/cart';

const BtnConfirmSC = styled.div`
    [data='close']{
        padding: 0.7rem 1rem;
        border-top: 0.1rem solid #e7e7e7;
        border-bottom: 0.1rem solid #e7e7e7;
        display: flex;
        a{   
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
const DeliveryAddresSC = styled.div`
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
export default function Resume({ products, totals, payment }) {
    return (
        <>
            <Head>
                <title>Confirmar pedido</title>
            </Head>
            <div>
                {products && products.length > 0 && (
                    <BtnConfirmSC>
                        <div data='close'>
                            <Link href="/">
                                Confirmar pedido
                            </Link>
                        </div>
                    </BtnConfirmSC>
                )}
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
                                    <tr>
                                        <td>Frete:</td>
                                        <td data="td-value">R$ 14,55 temp</td>
                                    </tr>
                                    <tr>
                                        <td data="total-td">Total do pedido:</td>
                                        <td data="td-value-total">{moneyMask(totals.vlr_pagar_products)}</td>
                                    </tr>
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
                                    <tr>
                                        <td data="name-user">Maycon Deyvid Brito de Oliveira</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Rua Empresário Paulo Miranda D`Oliveira
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            168
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Loja Cazimi Construção
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            João Pessoa, PB, 58046520
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Telefone: 999675920
                                        </td>
                                    </tr>
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
            </div>
        </>

    )
}

export async function getServerSideProps(context) {
    const { myCartId, myCartPayment } = parseCookies(context);
    const data = await getCartTemp(myCartId)

    /* Se myCartPayment tiver null, significa que nao foi preenchido ou foi expirado(1m). */
    if (!myCartPayment) {
        return {
            redirect: {
                destination: "/carrinho",
                permanent: false
            }
        }
    }

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
        props: { products: data.products, totals: data.totals, payment: JSON.parse(myCartPayment) },
    }
}