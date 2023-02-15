import { parseCookies, setCookie } from "nookies";
import Head from 'next/head';
import { getSession } from "next-auth/react"
import router from "next/router"
import styled from "styled-components"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useContext } from "react";

import { Content, ContentBorder } from "../../../components/containe"
import { ButtonYellow } from '../../../components/button';

import { moneyMask } from '../../../../masks';
import { getCartTemp } from "../../api/cart";
import { userIsAuth } from "../../api/auth";

import StoreContext from "../../../context/store"

const GroupSC = styled.li`
    display: flex;
    align-items: center;
    padding: 0 1.2rem !important;
    border-bottom: 1px #D5D9D9 solid;
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

            <Content padding="0 1rem">
                {store && store.nome &&
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values, setValues) => {
                            if (values.pgt_metodo == "Retirada na loja" && values.pgt_forma == "Pagar na entrega") {
                                setValues.setErrors({ pgt_forma: "Preencha a forma de pagamento." })
                                return
                            }
                            if (values.pgt_metodo == "Receber em casa" && values.pgt_forma == "Pagar na loja") {
                                setValues.setErrors({ pgt_forma: "Preencha a forma de pagamento." })
                                return
                            }

                            setCookie(null, "myCartPayment", JSON.stringify(values), {
                                maxAge: 60 * 1, /* EXPIRA EM 1MIN. "seg * min * hrs * dias" */
                                path: "/"
                            });
                            router.push("/carrinho/resumo")

                        }}
                    >
                        {({ values, errors }) => (
                            <Form data="form" action="">
                                <ButtonYellow margin="1rem 0 0 0">
                                    <button type="submit" disabled={!values.pgt_forma || !values.pgt_metodo}>
                                        Continuar
                                    </button >
                                </ButtonYellow>

                                <section>
                                    <ContentBorder padding="1rem 1.2rem" margin="1rem 0 0 0" borderRadius="0.7rem 0.7rem 0 0">
                                        <div data="title">
                                            <h3>Resumo</h3>
                                        </div>
                                    </ContentBorder>
                                    <ContentBorder padding="1rem 1.2rem" borderRadius="0 0 0.7rem 0.7rem" >
                                        <table data="table-1">
                                            <tbody>
                                                <tr>
                                                    <td>Quantidade de itens:</td>
                                                    <td data="td-value">{totals && totals.qtd_produtos}</td>
                                                </tr>
                                                <tr>
                                                    <td data="td-bold">Total dos produtos:</td>
                                                    <td data="td-red">{moneyMask(totals && totals.vlr_pagar_produtos)}</td>
                                                </tr>
                                                <tr>
                                                    <td data="td-bold">Valor de Frete:</td>
                                                    {!store.cobrar_frete ?
                                                        <td data="td-red">Frete Grátis</td>
                                                        :
                                                        <>
                                                            {values.pgt_metodo == "Receber em casa" ?
                                                                <td data="td-red">{moneyMask(totals.vlr_frete)}</td>
                                                                :
                                                                <td data="td-red">{moneyMask(0.00)}</td>
                                                            }
                                                        </>
                                                    }
                                                </tr>
                                            </tbody>
                                        </table>
                                    </ContentBorder>
                                </section>

                                <section>
                                    <ContentBorder padding="1rem 1.2rem" margin="1rem 0 0 0" borderRadius="0.7rem 0.7rem 0 0">
                                        <div data="title">
                                            <h3>Método de entrega</h3>
                                        </div>
                                    </ContentBorder>
                                    <ContentBorder padding="0" borderRadius="0" >
                                        <ul role="group-method">
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
                                    </ContentBorder>
                                </section>

                                <section>
                                    <ContentBorder padding="1rem 1.2rem" margin="1rem 0 0 0" borderRadius="0.7rem 0.7rem 0 0">
                                        <div data="title">
                                            <h3>Forma de pagamento</h3>
                                        </div>
                                    </ContentBorder>
                                    <ContentBorder padding="0" borderRadius="0" >
                                        <ul role="group-payment">
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
                                            {values.pgt_metodo == "Retirada na loja" &&
                                                <>
                                                    {!!store.pgt_loja &&
                                                        <GroupSC>
                                                            <Field name="pgt_forma" type="radio" id="p_entrega" value="Pagar na loja" />
                                                            <label htmlFor="p_entrega">Pagar na loja</label>
                                                        </GroupSC>
                                                    }
                                                </>
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
                                        {errors.pgt_forma &&
                                            <div data="error">
                                                <small>
                                                    <ErrorMessage name="pgt_forma" />
                                                </small>
                                            </div>
                                        }
                                    </ContentBorder>
                                </section>

                                <ButtonYellow margin="1rem 0">
                                    <button type="submit" disabled={!values.pgt_forma || !values.pgt_metodo}>
                                        Continuar
                                    </button >
                                </ButtonYellow>
                            </Form>
                        )}
                    </Formik>
                }
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

    const { myCartId } = parseCookies(context);
    /* Se não tiver setado redireciona para tela home */
    if (!myCartId) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    const data = await getCartTemp({ id_storage: myCartId, id_user: session.id, session: session })

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