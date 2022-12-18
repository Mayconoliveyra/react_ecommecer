import Head from 'next/head';
import styled from "styled-components"


const CartSC = styled.div`
    border: solid 1px red;;
`
export default function Cart() {
    return (
        <>
            <Head>
                <title>Carrinho de compras</title>
            </Head>
            <CartSC>
                <h1>oi</h1>
            </CartSC>
        </>

    )
}