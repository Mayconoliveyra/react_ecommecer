import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import { ButtonYellow } from "../../components/button"
import { Content } from "../../components/containe"
import { CardNavSugOne } from "../../components/cardsNav";

import { moneyMask } from "../../../masks"
import { getByID } from "../api/products"
import { getCartTemp, storeQuantidade } from "../api/cart";
import { getAll } from "../api/products";

import MyCartContext from "../../context/myCart";

const CardSC = styled.div`
    [data="card-name"]{
        h1{
            font-size: 1.2rem;
        } 
    }
    [data="card-img"]{
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            max-width: 100%;
            max-height: 300px;
        }
    }
    [data="nav-imgs"]{
        ul{
            display: flex;
            justify-content: center;
            li{
                button{
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 10px 4px;
                    width: 60px;
                    height: 60px;
                    border: solid 1px #D5D9D9;
                    border-radius: 8px;

                    background-color: transparent;
                    img{
                        max-width: 50px;
                        max-height: 50px;
                    }
                }
            }
        }
    }
    [data="price"]{
        [data="oferta"]{
            display: flex;
            flex-direction: column;
    
            [data="oft-t"]{
                color: #CC0C39;
                font-size: 1.2rem;
                font-family: ${({ theme }) => theme.font.family.medium};
            }
           
            [data="p-r-v"]{
                display: flex;
                span{
                    font-family: ${({ theme }) => theme.font.family.regular};
                    font-size: 2.2rem;
                }
                [data="red"]{
                    color: #CC0C39;
                    letter-spacing: 1px;
                    margin-right: 10px;
                }
                [data="rs"]{
                    font-size: 1rem;
                    padding-top: 0.4rem;
                    font-family: ${({ theme }) => theme.font.family.medium};
                }
                [data="valor"]{
                    font-family: ${({ theme }) => theme.font.family.medium};
                }
                [data="valor-old"]{
                    margin-top: auto;
                    margin-left: 7px;
                    font-size: 1.2rem;
                    text-decoration: line-through;
                    color: #565959;
                }
            }
        }
    }
`
export default function Product({ vendidos, semana, oferta }) {
    const [product, setProduct] = useState({})
    const { setMyCart } = useContext(MyCartContext)
    const router = useRouter()
    const { myCartId } = parseCookies();
    const [urlImg, setUrlImg] = useState(null)

    const handleAddMyCart = async (id) => {
        await storeQuantidade(id, 1, myCartId)
        await setMyCart(await getCartTemp({ id_storage: myCartId }))
        router.push("/")
    }
    const setImage = (url) => {
        setUrlImg(url)
    }

    useEffect(() => {
        getProduct()
    }, [router])

    const getProduct = async () => {
        if (!router || !router.query || !router.query.id || !Number(router.query.id >= 1))
            router.push("/")
        const data = await getByID(router.query.id)
        if (!data && !data.id)
            router.push("/")
        setUrlImg(data.url_img)
        setProduct(data)
    }

    return (
        <>
            <Head>
                <title>{product.nome ? product.nome : 'Carregando...'}</title>
            </Head>
            <Content noShadow padding="0">
                <Content maxwidth="40rem" bgWhite noShadow padding="1rem">
                    <CardSC>
                        <div data="card-name">
                            <h1>{product.nome}</h1>
                        </div>
                        <div data="card-img">
                            <img src={urlImg} alt={product.nome} />
                        </div>
                        <div data="nav-imgs">
                            <ul>
                                {product.url_img &&
                                    <li>
                                        <button type="button" onClick={() => setImage(product.url_img)}>
                                            <img src={product.url_img} alt="imagem" />
                                        </button>
                                    </li>
                                }
                                {product.img_1 &&
                                    <li>
                                        <button type="button" onClick={() => setImage(product.img_1)}>
                                            <img src={product.img_1} alt="imagem 1" />
                                        </button>
                                    </li>
                                }
                                {product.img_2 &&
                                    <li>
                                        <button type="button" onClick={() => setImage(product.img_2)}>
                                            <img src={product.img_2} alt="imagem 2" />
                                        </button>
                                    </li>
                                }
                                {product.img_3 &&
                                    <li>
                                        <button type="button" onClick={() => setImage(product.img_3)}>
                                            <img src={product.img_3} alt="imagem 3" />
                                        </button>
                                    </li>
                                }
                                {product.img_4 &&
                                    <li>
                                        <button type="button" onClick={() => setImage(product.img_4)}>
                                            <img src={product.img_4} alt="imagem 4" />
                                        </button>
                                    </li>
                                }
                            </ul>
                        </div>
                        <div data="price">
                            {!!product.promocao_ativa ?
                                (
                                    <>
                                        <div data="oferta">
                                            <div>
                                                <span data="oft-t">Oferta</span>
                                            </div>
                                            <div data="p-r-v">
                                                <span data="red">{(Number(product.preco - product.preco_promocao) / Number(product.preco) * 100).toFixed(0)}%</span>
                                                <span data="rs">R$</span>
                                                <span data="valor">{moneyMask(product.preco_promocao, false)}</span>
                                                <span data="valor-old">{moneyMask(product.preco)}</span>
                                            </div>
                                        </div>
                                    </>


                                ) : (
                                    <>
                                        <div data="oferta">
                                            <div data="p-r-v">
                                                <span data="rs">R$</span>
                                                <span data="valor">{moneyMask(product.preco, false)}</span>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </div>

                        <ButtonYellow margin="1rem 0 0 0">
                            <button type="button" onClick={() => handleAddMyCart(product.id)}>
                                Adiconar ao carrinho
                            </button>
                        </ButtonYellow>
                    </CardSC>
                </Content>

                <Content noShadow padding="0.5rem 0">
                    <CardNavSugOne title="Produtos mais vendidos" products={vendidos} />
                    <CardNavSugOne title="O que outros clientes estão comprando" products={semana} />
                    <CardNavSugOne title="Produtos em ofertas" products={oferta} />
                </Content>
            </Content>
        </>
    );
}

export async function getServerSideProps() {
    const data = await getAll()

    return {
        props: { ...data },
    }
}