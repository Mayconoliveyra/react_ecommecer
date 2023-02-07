import Head from 'next/head';
import { useContext } from 'react';
import Link from 'next/link';
import styled from "styled-components"


import { Content } from "../../components/containe"
import { ButtonYellow } from '../../components/button';
import { CardCarRow } from "../../components/card/cards"
import { CartVazio } from '../../components/conta/components';
import { CardNavSugOne } from '../../components/cardsNav';

import { moneyMask } from '../../../masks';
import { getAll } from '../api/products';

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
    [data-div="cads"]{
        display: grid;
        grid-template-columns: repeat(1fr);
        gap: 0.4rem;
    }
`
export default function Cart({ vendidos, semana, oferta }) {
    const { myCart: { products, totals } } = useContext(MyCartContext)

    return (
        <>
            <Head>
                <title>Carrinho de compras</title>
            </Head>

            {products && products.length > 0 ?
                <Content bgWhite noShadow padding="0 0.5rem 0.5rem 0.5rem" >
                    {products && products.length > 0 && (
                        <>
                            <SubTotal>
                                Subtotal <span>R$</span> <span>{moneyMask(totals.vlr_pagar_products, false)}</span>
                            </SubTotal>
                            <ButtonYellow margin="0 0 1.5rem 0">
                                <Link href="carrinho/fechar">
                                    Fechar pedido ({totals.qtd_products} {totals.qtd_products == 1 ? 'Item' : "Itens"})
                                </Link>
                            </ButtonYellow>
                        </>
                    )}
                    <SectionProductSC>
                        <div data-div="cads">
                            {products.map((product) => {
                                return (
                                    <CardCarRow key={product.id} product={product} />
                                )
                            })}
                        </div>
                    </SectionProductSC>

                    {products && products.length > 5 && (
                        <ButtonYellow margin="1.5rem 0 1rem 0">
                            <Link href="carrinho/fechar">
                                Fechar pedido ({totals.qtd_products} {totals.qtd_products == 1 ? 'Item' : "Itens"})
                            </Link>
                        </ButtonYellow>
                    )}
                </Content>
                :
                <Content noShadow padding="0">
                    <CartVazio title="Seu carrinho está vazio" />
                </Content>
            }
            <Content noShadow padding="0.5rem 0">
                <CardNavSugOne title="Produtos mais vendidos" products={vendidos} />
                <CardNavSugOne title="O que outros clientes estão comprando" products={semana} />
                <CardNavSugOne title="Produtos em ofertas" products={oferta} />
            </Content>
        </>
    )
}

export async function getServerSideProps() {
    const data = await getAll()

    return {
        props: { ...data },
    }
}