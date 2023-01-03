import Head from 'next/head';
import { getSession } from "next-auth/react"
import { useContext } from 'react';
import Link from 'next/link';
import styled from "styled-components"

import { moneyMask } from '../../../../masks';

import MyCartContext from "../../../context/myCart"

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
            border-color: #FCD200;
            border-radius: 0.45rem;
        }
    }
`
const CloseOrderSC = styled.div`
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
const MetodoEntegraSC = styled.div`
    margin: 1rem 0;
    padding: 0 0.7rem;
    >div{
        color: #0F1111;
        [data="metodo-entrega"]{
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
        [data="ul-li"]{
            ul{
                li{
                    display: flex;
                    align-items: center;
                    padding:1.2rem;
                    border: 1px #D5D9D9 solid;
                    input{
                        width:2rem;
                        height:2rem;
                        margin-right: 1rem;
                    }
                    label{
                        font-size: 1.2rem;
                        width: 100%;
                    }
                }
            }
           
        }
    }
`

export default function CloseOrder() {
    const { myCart: { products, totals } } = useContext(MyCartContext)
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
                                Fechar pedido ({totals && totals.qtd_products} {totals && totals.qtd_products == 1 ? 'Item' : "Itens"})
                            </Link>
                        </div>
                    </BtnConfirmSC>
                )}
                <CloseOrderSC>
                    <div>
                        <div data="resume">
                            <h4>Resumo</h4>
                        </div>
                        <div data="table-values">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Quantidade:</td>
                                        <td data="td-value">{totals && totals.qtd_products}</td>
                                    </tr>
                                    <tr>
                                        <td data="total-td">Total dos produtos:</td>
                                        <td data="td-value-total">{moneyMask(totals && totals.vlr_pagar_products)}</td>
                                    </tr>
                                </tbody>

                            </table>
                        </div>
                    </div>
                </CloseOrderSC>

                <MetodoEntegraSC>
                    <div>
                        <div data="metodo-entrega">
                            <h4>Método de entrega</h4>
                        </div>
                        <div data="ul-li">
                            <ul>
                                <li>
                                    <input type="radio" id="frete" name="method" value="frete" />
                                    <label htmlFor="frete">Receber em casa(Frete)</label>
                                </li>
                                <li>
                                    <input type="radio" id="retirada" name="method" value="retirada" />
                                    <label htmlFor="retirada">Retirada na loja</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                </MetodoEntegraSC>

                <MetodoEntegraSC>
                    <div>
                        <div data="metodo-entrega">
                            <h4>Forma de pagamento</h4>
                        </div>
                        <div data="ul-li">
                            <ul>
                                <li>
                                    <input type="radio" id="entrega" name="payment" value="entrega" />
                                    <label htmlFor="entrega">Pagar na entrega</label>
                                </li>
                                <li>
                                    <input type="radio" id="pix" name="payment" value="pix" />
                                    <label htmlFor="pix">PIX</label>
                                </li>
                                <li>
                                    <input type="radio" id="cartao" name="payment" value="cartao" />
                                    <label htmlFor="cartao">Cartão</label>
                                </li>
                            </ul>
                        </div>
                    </div>
                </MetodoEntegraSC>

            </div>
        </>

    )
}

export async function getServerSideProps({ req }) {
    const session = await getSession({ req })
    console.log(session)
    /* se session existir o usuario ja está autenticado. */
    if (false) {
        /* if (!session || !session.id) { */
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }

    return {
        props: { session },
    }
}