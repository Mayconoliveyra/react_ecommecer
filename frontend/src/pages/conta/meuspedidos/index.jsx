import Head from 'next/head';
import Link from 'next/link';
import styled from "styled-components"
import { getSession } from "next-auth/react";
import { ChevronLeft } from "react-bootstrap-icons";

import { ContentHeader, Content } from "../../../components/containe"
import { Pedido } from "../../../components/conta/components"

import { getPedidos } from "../../api/cart"
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
    }
`

export default function Requests({ dt_pedidos, totals, session }) {
    const [loading, setLoading] = useState(true);
    const [nextPage, setNextPage] = useState(1);
    const [limitPage] = useState(10);
    const [pedidos, setPedidos] = useState(dt_pedidos);

    const handlePage = async () => {
        setLoading(false)
        const next = nextPage + 1;

        if (loading)
            await getPedidos({ id: session.id, page: next, limi: limitPage, session: session })
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
            <Content padding="0">
                <ContentHeader padding="1.3rem">
                    <Link href="/">
                        <ChevronLeft data="icon-left" />
                        <h2 data="h1-title">
                            Meus pedidos
                        </h2>
                    </Link>
                </ContentHeader>
                {pedidos && pedidos.map((pedido) => {
                    return (
                        <Content bgWhite noShadow noFlex1 key={pedido.id} margin="0 0 0.5rem 0;" padding="1rem;">
                            <Pedido pedido={pedido} session={session} />
                        </Content>
                    )
                })}
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

    const { dt_pedidos, totals } = await getPedidos({ id: session.id, page: 1, limi: 10, session: session })

    return {
        props: { dt_pedidos, totals, session },
    }
}