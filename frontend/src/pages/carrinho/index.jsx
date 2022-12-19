import Head from 'next/head';
import { useContext, useEffect } from 'react';
import Link from 'next/link';
import styled from "styled-components"

import { CardSearch } from "../../components/card/cardSearch"

import { cartLocalStorage } from "../../adapters/cart"

import MyCartContext from "../../context/myCart"

const CartSC = styled.div`
  /*   padding: 1.2rem 1.4rem; */
 /*    border: solid 1px red; */
    [data='subtotal']{
        padding: 1rem 1.4rem;
        display: flex;
        align-items: center;
        font-size: 1.3rem;
        font-family: ${({ theme }) => theme.font.family.medium};
  
        span:nth-child(1) {
            margin-left: 10px;
            margin-right: 1px;
            position:relative;
            top: -0.1rem;
            font-size: 1rem;
            font-family: ${({ theme }) => theme.font.family.bold};
        }
        span:nth-child(2) {
            font-size: 1.6rem;
            font-family: ${({ theme }) => theme.font.family.medium};
        }          
    }
    [data='close']{
        padding: 0.7rem 1rem;
        border-top: 0.1rem solid #e7e7e7;
        border-bottom: 0.1rem solid #e7e7e7;
        /* border: solid 1px red; */
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
const SearchSC = styled.div`
    [data-div="cads"]{
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 0.6rem;
        @media (min-width: 720px){
            grid-template-columns: repeat(2, 1fr);
        }
    }

    [data-div='no-result']{
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
export default function Cart() {
    const { myCart, setMyCart } = useContext(MyCartContext)

    useEffect(() => {
        handleMyCart()
    }, [])

    const handleMyCart = async () => {
        setMyCart(await cartLocalStorage())
    }

    return (
        <>
            <Head>
                <title>Carrinho de compras</title>
            </Head>
            <CartSC>
                <div data='subtotal'>
                    Subtotal <span>R$</span> <span>2.591,00</span>
                </div>
                <div data='close'>
                    <Link href="/">
                        Fechar pedido (9 itens)
                    </Link>
                </div>
                <SearchSC>
                    {myCart.length > 0 ?
                        <>
                            <div data-div="cads">
                                {myCart && myCart.map((item) => {
                                    return (
                                        <>
                                            <CardSearch key={item.id} {...item} />
                                            <div>{item.quantity}</div>
                                            <div>{item.amount}</div>
                                            <div>{item.amount_promotion}</div>
                                        </>
                                    )

                                })}
                            </div>
                        </>
                        :
                        <>
                            <div data-div='no-result'>
                                <h1>Nenhum resultado</h1>
                                <p> Tente verificar a ortografia ou usar termos mais genéricos</p>
                            </div>
                        </>
                    }
                </SearchSC>
            </CartSC>
        </>

    )
}