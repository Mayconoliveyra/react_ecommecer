import { parseCookies, setCookie } from "nookies";
import Head from 'next/head';
import { getSession } from "next-auth/react"
import { useContext } from 'react';
import router from "next/router"
import styled from "styled-components"
import { Formik, Form, Field } from 'formik';

import { moneyMask } from '../../../../masks';
import { getCartTemp } from "../../api/cart";

import StoreContext from "../../../context/store"

const BtnConfirmSC = styled.div`
    [data='close']{
        margin-top: 1rem;
        padding: 0.7rem 1rem;
        display: flex;
        button{   
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
                }
            }
        }
    }
`
const GroupSC = styled.li`
    display: flex;
    align-items: center;
    padding: 0 1.2rem !important;
    border: 1px #D5D9D9 solid;
        input{
            width:2rem;
            height:2rem;
            margin-right: 1rem;
        }
        label{
            font-size: 1.2rem;
            flex:1;
            padding:1.2rem;
        }
`

export default function CloseOrder({ session, totals }) {
    const store = useContext(StoreContext)

    const initialValues = {
        pgt_metodo: 'frete',
        pgt_forma: 'pix'
    }

    return (
        <>
            <Head>
                <title>Método de Entrega e Pagamento</title>
            </Head>

            <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                    console.log(totals)
                    /* Se for 'retirada na loja' não vai ser setado formad e pagamento(pgt_forma) */
                    if (values.pgt_metodo == 'retirada') delete values.pgt_forma
                    values.vlr_frete = moneyMask(Math.round(session.distancia_km * store.percentual_frete))

                    setCookie(null, "myCartPayment", JSON.stringify(values), {
                        maxAge: 60 * 1, /* EXPIRA EM 1MIN. "seg * min * hrs * dias" */
                        path: "/"
                    });
                    router.push("/carrinho/resumo")
                }}
            >
                {({ values }) => (
                    <Form data="form" action="">
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
                                            <tr>
                                                <td data="total-td">Valor de Frete:</td>
                                                {/* Arredonda o valor do frete para inteiro */}
                                                {values.pgt_metodo == 'frete' ?
                                                    <td data="td-value-total">{moneyMask(Math.round(session.distancia_km * store.percentual_frete))}</td>
                                                    :
                                                    <td data="td-value-total">{moneyMask(0.00)}</td>
                                                }
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
                                <div data="ul-li" role="group-method">
                                    <ul>
                                        <GroupSC>
                                            <Field name="pgt_metodo" type="radio" id="frete" value="frete" />
                                            <label htmlFor="frete">Receber em casa(Frete)</label>
                                        </GroupSC>
                                        <GroupSC>
                                            <Field name="pgt_metodo" type="radio" id="retirada" value="retirada" />
                                            <label htmlFor="retirada">Retirada na loja</label>
                                        </GroupSC>
                                    </ul>
                                </div>
                            </div>
                        </MetodoEntegraSC>
                        {values.pgt_metodo == 'frete' &&
                            <MetodoEntegraSC>
                                <div>
                                    <div data="metodo-entrega">
                                        <h4>Forma de pagamento</h4>
                                    </div>
                                    <div data="ul-li" role="group-payment">
                                        <ul>
                                            <GroupSC>
                                                <Field name="pgt_forma" type="radio" id="pix" value="pix" />
                                                <label htmlFor="pix">PIX</label>
                                            </GroupSC>
                                            <GroupSC>
                                                <Field name="pgt_forma" type="radio" id="cartao" value="cartao" />
                                                <label htmlFor="cartao">Cartão</label>
                                            </GroupSC>
                                            <GroupSC>
                                                <Field name="pgt_forma" type="radio" id="entrega" value="entrega" />
                                                <label htmlFor="entrega">Pagar na entrega</label>
                                            </GroupSC>
                                        </ul>
                                    </div>
                                </div>
                            </MetodoEntegraSC>
                        }

                        <BtnConfirmSC>
                            <div data='close'>
                                <button type="submit">
                                    Continuar
                                </button >
                            </div>
                        </BtnConfirmSC>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export async function getServerSideProps(context) {
    const { myCartId } = parseCookies(context);
    const req = context.req
    const session = await getSession({ req })
    /* Valida se tem algum campo importante pendente */
    let valid = true;
    if (!session) valid = false
    if (!session || !session.email) valid = false
    if (!session || !session.contato) valid = false
    if (!session || !session.nome) valid = false
    if (!session || !session.email_auth) valid = false
    if (!session || !session.cep) valid = false

    if (!valid) {
        /* Se não tiver logando, redireciona para home */
        if (!session) {
            return {
                redirect: {
                    destination: "/login",
                    permanent: false
                }
            }
        } else {
            /* Redireciona para tela de preenchimento do usuario */
            return {
                redirect: {
                    destination: "/conta/meusdados",
                    permanent: false
                }
            }
        }
    }

    const data = await getCartTemp(myCartId)

    /* Se não tiver setado redireciona para tela home*/
    if (!data || !data.totals) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: { session: session, totals: data.totals },
    }
}