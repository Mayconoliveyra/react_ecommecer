import { parseCookies, setCookie } from "nookies";
import { getSession } from "next-auth/react"
import Head from 'next/head';
import styled from "styled-components"
import router from "next/router"
import { useContext } from "react";

import { Content, ContentBorder } from "../../../components/containe"
import { CardPayment } from "../../../components/card/cardPayment"
import { ButtonSC, ButtonYellow } from '../../../components/button';

import { moneyMask } from '../../../../masks';
import { getCartTemp, storePedido } from '../../api/cart';
import { userIsAuth } from "../../api/auth";
import { showError } from "../../../../global";

import TemplateContext from "../../../context/template"
import StoreContext from "../../../context/store"
import MyCartContext from "../../../context/myCart"

const SectionProductSC = styled.section`
    padding: 0;
    margin-top: 1rem;
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
    const { template, setTemplate } = useContext(TemplateContext)
    const { setMyCart } = useContext(MyCartContext)
    const store = useContext(StoreContext)
    const handleFinalizar = async () => {

        setTemplate({ ...template, loading: true })
        const dataPedido = {
            id_user: session.id,
            id_storage: session.id_storage,
            ...totals,
            ...payment
        }

        await storePedido(dataPedido, session)
            .then((res) => {
                setMyCart([]);
                setCookie(null, "paymentResult", res.id, {
                    maxAge: 60 * 1, /* 1m */
                    path: "/"
                });
                router.push(res.redirect)
            })
            .catch((error) => {
                router.push("/")
                return showError(error)
            })
    }
    return (
        <>
            <Head>
                <title>Confirmar pedido</title>
            </Head>
            <Content>
                <ButtonYellow margin="0.5rem 0 0 0">
                    <button type="button" onClick={() => handleFinalizar()}>
                        Confirmar pedido
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
                                    <td>Itens:</td>
                                    <td data="td-value">{moneyMask(totals.vlr_pagar_products)}</td>
                                </tr>
                                {payment.pgt_metodo == "Receber em casa" ?
                                    <>
                                        <tr>
                                            <td>Frete:</td>
                                            {!store.cobrar_frete ?
                                                <td data="td-value">Frete Grátis</td>
                                                :
                                                <td data="td-value">{moneyMask(totals.vlr_frete)}</td>
                                            }
                                        </tr>
                                        <tr>
                                            <td data="td-bold">Total do pedido:</td>
                                            <td data="td-red">{moneyMask(totals.vlr_pagar_com_frete)}</td>
                                        </tr>
                                    </>
                                    :
                                    <>
                                        <tr>
                                            <td>Frete:</td>
                                            {!store.cobrar_frete ?
                                                <td data="td-value">Frete Grátis</td>
                                                :
                                                <td data="td-value">{moneyMask(0.00)}</td>
                                            }
                                        </tr>
                                        <tr>
                                            <td data="td-bold">Total do pedido:</td>
                                            <td data="td-red">{moneyMask(totals.vlr_pagar_sem_frete)}</td>
                                        </tr>
                                    </>
                                }
                            </tbody>
                        </table>
                    </ContentBorder>
                </section>

                <section>
                    <ContentBorder padding="1rem 1.2rem" margin="1rem 0 0 0" borderRadius="0.7rem 0.7rem 0 0">
                        <div data="title">
                            <h3>Endereço de entrega</h3>
                        </div>
                    </ContentBorder>
                    <ContentBorder padding="1rem 1.2rem" borderRadius="0 0 0.7rem 0.7rem" >
                        <table data="table-1">
                            <tbody>
                                {payment.pgt_metodo == "Receber em casa" ?
                                    <>
                                        <tr>
                                            <td data="td-bold">{session.nome}</td>
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
                    </ContentBorder>
                </section>
                <section>
                    <ContentBorder padding="1rem 1.2rem" margin="1rem 0 0 0" borderRadius="0.7rem 0.7rem 0 0">
                        <div data="title">
                            <h3>Informações de pagamento</h3>
                        </div>
                    </ContentBorder>
                    <ContentBorder padding="1rem 1.2rem" borderRadius="0 0 0.7rem 0.7rem" >
                        <table data="table-1">
                            <tbody>
                                <tr>
                                    <td data="td-bold">Forma de pagamento</td>
                                </tr>
                                <tr>
                                    <td>{payment.pgt_forma}</td>
                                </tr>
                            </tbody>
                        </table>
                    </ContentBorder>
                </section>

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

                <ButtonYellow margin="1rem 0 0.5rem 0">
                    <button type="button" onClick={() => handleFinalizar()}>
                        Confirmar pedido
                    </button >
                </ButtonYellow>
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

    const { myCartId, myCartPayment } = parseCookies(context);

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

    const data = await getCartTemp(myCartId, session.id, session)

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