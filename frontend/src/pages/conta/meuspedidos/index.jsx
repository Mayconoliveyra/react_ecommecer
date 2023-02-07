import Head from 'next/head';
import Link from 'next/link';
import styled from "styled-components"
import { getSession } from "next-auth/react";
import { ChevronLeft } from "react-bootstrap-icons";

import { ContentHeader, Content } from "../../../components/containe"
import { Pedido, CartVazio } from "../../../components/conta/components"
import { CardNavSugOne } from '../../../components/cardsNav';


import { getPedidos } from "../../api/cart"
import { getAll } from "../../api/products"
import { useState } from 'react';
import { showError } from "../../../../global"

const VerMais = styled.div`
    flex: 1;
    display: flex;
    justify-content:center;
    align-items: flex-end;
    button{
        background-color: #fff;
        border: thin solid #d5d9d9;
        border-radius: 2px;
        width: 100%;
        font-size: 1.2rem;
        padding: 1rem 0;
        margin: 0.5rem;
        margin-bottom: 1rem;
    }
`

export default function Requests({ dt_pedidos, totals, session, camas, brinquedos, cozinhas }) {
    const [loading, setLoading] = useState(true);
    const [nextPage, setNextPage] = useState(1);
    const [limitPage] = useState(10);
    const [pedidos, setPedidos] = useState(dt_pedidos);

    const handlePage = async () => {
        setLoading(false)
        const next = nextPage + 1;

        if (loading)
            await getPedidos({ page: next, limi: limitPage, session: session })
                .then(async ({ dt_pedidos }) => {
                    setNextPage(next);
                    setPedidos([...pedidos, ...dt_pedidos]);

                    setLoading(true)
                })
                .catch(showError);
    }

    return (
        <>
            <Head>
                <title>Meus pedidos</title>
            </Head>
            <Content noShadow padding="0">
                <ContentHeader padding="1.3rem">
                    <Link href="/">
                        <ChevronLeft data="icon-left" />
                        <h2 data="h1-title">
                            Meus pedidos
                        </h2>
                    </Link>
                </ContentHeader>
                {pedidos && pedidos.length > 0 ? pedidos.map((pedido) => {
                    return (
                        <Content bgWhite noShadow noFlex1 key={pedido.id} margin="0 0 0.5rem 0;" padding="1rem;">
                            <Pedido pedido={pedido} session={session} />
                        </Content>
                    )

                }) :
                    <>
                        <CartVazio title="Seu histórico está vazio" />
                        <Content noShadow padding="0.5rem 0">
                            <CardNavSugOne title="Produtos mais vendidos" products={camas} />
                            <CardNavSugOne title="O que outros clientes estão comprando" products={brinquedos} />
                            <CardNavSugOne title="Produtos em ofertas" products={cozinhas} />
                        </Content>
                    </>
                }
                {parseFloat(totals / limitPage) > nextPage &&
                    <VerMais>
                        <button type='button' onClick={() => handlePage()}>Explorar mais</button>
                    </VerMais>
                }
            </Content>
        </>
    )
}

export async function getServerSideProps({ req }) {
    const session = await getSession({ req })
    if (!session || !session.id) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }

    const data = await getAll()

    const { dt_pedidos, totals } = await getPedidos({ page: 1, limi: 10, session: session })

    return {
        props: { dt_pedidos, totals, session, ...data },
    }
}