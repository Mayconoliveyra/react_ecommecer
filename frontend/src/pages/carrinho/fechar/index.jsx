import { parseCookies, setCookie } from "nookies";
import Head from 'next/head';
import { getSession } from "next-auth/react"
import router from "next/router"
import styled from "styled-components"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useContext } from "react";

import { ButtonSC } from '../../../components/button';

import { moneyMask } from '../../../../masks';
import { getCartTemp } from "../../api/cart";
import { userIsAuth } from "../../api/auth";

import StoreContext from "../../../context/store"

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
        border:${({ error }) => error && "solid 1px #d00"};
        box-shadow:${({ error }) => error && "0 0 0 0.2rem rgb(221 0 0 / 15%) inset;"};
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
        [data="error"]{
            text-align: center;
            font-size: 1.3rem;
            color: #e72626;
            margin-top: 0.0rem;
            padding: 0.6rem;
            small{
                padding: 0px;
                margin: 0px;
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

export default function CloseOrder({ totals }) {
    const store = useContext(StoreContext)

    const setMethod = () => {
        if (!!store.entrega_frete) return 'Receber em casa';
        if (!!store.entrega_retirada) return 'Retirada na loja';
        return ''
    }
    const setPgt = () => {
        if (!!store.pgt_pix) return 'PIX';
        if (!!store.pgt_cartao) return 'Cartão';
        if (!!store.pgt_loja) return 'Pagar na loja';
        if (!!store.pgt_entrega) return 'Pagar na entrega';
        return ''
    }

    const initialValues = {
        pgt_metodo: setMethod(),
        pgt_forma: setPgt()
    }

    return (
        <>
            <Head>
                <title>Método de Entrega e Pagamento</title>
            </Head>

            {store && store.nome &&
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, setValues) => {
                        if (values.pgt_metodo == "Retirada na loja" && values.pgt_forma == "Pagar na entrega") {
                            setValues.setErrors({ pgt_forma: "Preencha a forma de pagamento." })
                        } else {
                            setCookie(null, "myCartPayment", JSON.stringify(values), {
                                maxAge: 60 * 1, /* EXPIRA EM 1MIN. "seg * min * hrs * dias" */
                                path: "/"
                            });
                            router.push("/carrinho/resumo")
                        }
                    }}
                >
                    {({ values, errors }) => (
                        <Form data="form" action="">
                            <ButtonSC>
                                <div data='btn-confirm'>
                                    <button type="submit" disabled={!values.pgt_forma || !values.pgt_metodo}>
                                        Continuar
                                    </button >
                                </div>
                            </ButtonSC>
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
                                                    {!store.cobrar_frete ?
                                                        <td data="td-value-total">Frete Grátis</td>
                                                        :
                                                        <>
                                                            {values.pgt_metodo == "Receber em casa" ?
                                                                <td data="td-value-total">{moneyMask(totals.vlr_frete)}</td>
                                                                :
                                                                <td data="td-value-total">{moneyMask(0.00)}</td>
                                                            }
                                                        </>
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
                                            {!!store.entrega_frete &&
                                                <GroupSC>
                                                    <Field name="pgt_metodo" type="radio" id="frete" value="Receber em casa" />
                                                    <label htmlFor="frete">Receber em casa{totals.vlr_frete > 0 && "(Frete)"}</label>
                                                </GroupSC>
                                            }
                                            {!!store.entrega_retirada &&
                                                <GroupSC>
                                                    <Field name="pgt_metodo" type="radio" id="retirada" value="Retirada na loja" />
                                                    <label htmlFor="retirada">Retirada na loja</label>
                                                </GroupSC>
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </MetodoEntegraSC>

                            <MetodoEntegraSC error={!!errors.pgt_forma}>
                                <div>
                                    <div data="metodo-entrega">
                                        <h4>Forma de pagamento</h4>
                                    </div>
                                    <div data="ul-li" role="group-payment">
                                        <ul>
                                            {!!store.pgt_pix &&
                                                <GroupSC>
                                                    <Field name="pgt_forma" type="radio" id="pix" value="PIX" />
                                                    <label htmlFor="pix">PIX</label>
                                                </GroupSC>
                                            }
                                            {!!store.pgt_cartao &&
                                                <GroupSC>
                                                    <Field name="pgt_forma" type="radio" id="cartao" value="Cartão" />
                                                    <label htmlFor="cartao">Cartão</label>
                                                </GroupSC>
                                            }
                                            {!!store.pgt_loja &&
                                                <GroupSC>
                                                    <Field name="pgt_forma" type="radio" id="p_entrega" value="Pagar na loja" />
                                                    <label htmlFor="p_entrega">Pagar na loja</label>
                                                </GroupSC>
                                            }
                                            {values.pgt_metodo == "Receber em casa" &&
                                                <>
                                                    {!!store.pgt_entrega &&
                                                        <GroupSC>
                                                            <Field name="pgt_forma" type="radio" id="p_loja" value="Pagar na entrega" />
                                                            <label htmlFor="p_loja">Pagar na entrega</label>
                                                        </GroupSC>
                                                    }
                                                </>
                                            }
                                        </ul>
                                    </div>
                                    <div data="error">
                                        <small>
                                            <ErrorMessage name="pgt_forma" />
                                        </small>
                                    </div>
                                </div>
                            </MetodoEntegraSC>

                            <ButtonSC>
                                <div data='btn-confirm-noborder'>
                                    <button type="submit" disabled={!values.pgt_forma || !values.pgt_metodo}>
                                        Continuar
                                    </button >
                                </div>
                            </ButtonSC>
                        </Form>
                    )}
                </Formik>
            }
        </>
    )
}

export async function getServerSideProps(context) {
    const { myCartId } = parseCookies(context);

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

    /* Se não tiver setado redireciona para tela home */
    if (!myCartId) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    const data = await getCartTemp(myCartId, session.id)

    /* Se não tiver setado redireciona para tela home */
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