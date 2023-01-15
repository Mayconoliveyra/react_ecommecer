import Head from 'next/head';
import { useContext } from 'react';
import Link from 'next/link';
import styled from "styled-components"

import { CardOne } from "../../components/card/cardOne"
import { ButtonSC } from '../../components/button';

import { moneyMask } from '../../../masks';

import MyCartContext from "../../context/myCart"

const SubTotal = styled.div`
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
`
const SectionProductSC = styled.div`
    padding:0.6rem;
    [data-div="cads"]{
        display: grid;
        grid-template-columns: repeat(1fr);
        gap: 0.4rem;
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
export default function Cart() {
    const { myCart: { products, totals } } = useContext(MyCartContext)

    return (
        <>
            <Head>
                <title>Carrinho de compras</title>
            </Head>
            <div>
                {products && products.length > 0 && (
                    <ButtonSC>
                        <SubTotal>
                            Subtotal <span>R$</span> <span>{moneyMask(totals.vlr_pagar_products, false)}</span>
                        </SubTotal>
                        <div data='btn-confirm'>
                            <Link href="carrinho/fechar">
                                Fechar pedido ({totals.qtd_products} {totals.qtd_products == 1 ? 'Item' : "Itens"})
                            </Link>
                        </div>
                    </ButtonSC>
                )}

                <SectionProductSC>
                    {products && products.length > 0 ?
                        <>
                            <div data-div="cads">
                                {products.map((product) => {
                                    return (
                                        <CardOne btnsIncrementer={true} key={product.id} product={product} />
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

                {products && products.length > 5 && (
                    <ButtonSC>
                        <div data='btn-confirm-noborder'>
                            <Link href="carrinho/fechar">
                                Fechar pedido ({totals.qtd_products} {totals.qtd_products == 1 ? 'Item' : "Itens"})
                            </Link>
                        </div>
                    </ButtonSC>
                )}
            </div>
        </>
    )
}