import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import Head from "next/head";
import { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { Dash, Plus } from "react-bootstrap-icons"

import { moneyMask } from "../../../masks"

import { getByID } from "../api/products"
import { getCartTemp, storeQuantity } from "../api/cart";

import MyCartContext from "../../context/myCart";

const SectionSC = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    [data-div="product"]{
        flex: 1;
        padding: 1rem;
        max-width: 630px;
        width: 100%;

        [data-div="img-main"] {
            display: flex;
            justify-content: center;
            border: solid 1px #EDEDED;
           > div {
                max-width: 613px;
                max-height: 613px;
                position:relative;
                padding: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                span {
                    font-size: ${({ theme }) => theme.font.sizes.xsmall};
                    color: #FFFFFF;
                    position:absolute;
                    background-color: #77D500;
                    border-radius: 3px;
                    border-top-left-radius: 0px;
                    padding: 5px 10px;
                    top: 0px;
                    left: -1px;
                }
                img {
                    width: 100%;
                }
            }  
        }

        [data-div="name"] {
            margin-top: 1rem;

            h2 {
                font-size: ${({ theme }) => theme.font.sizes.large};
                font-family: ${({ theme }) => theme.font.family.medium};
                color: ${({ theme }) => theme.colors.secondaryColor};
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: normal;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
            }   
        }

        [data-div="description"] {
            p{
                color: #565c69;
                font-size: ${({ theme }) => theme.font.sizes.small};
                margin: 0px;
                padding: 0px;
            }
        }
    }
`
const FootCardSC = styled.footer`
    position:fixed;
    bottom: 0px;
    width: 100%;
    border-top: solid 1px #EDEDED;
    z-index: 999;
    border-top: solid 1px #d6d6d6;
    background-color: #FFFFFF;
    div {
        display: flex;
        padding: 0.6rem;
        max-width: 500px;
        width:100%;
        margin: 0px auto;
    }

    [data-div="input-div"] {
        background-color: #FFFFFF;
        border: solid 1px #DCDCDC;
        border-radius: 4px;
        display: flex;
        max-width: 40%;
        input {
            font-size:${({ theme }) => theme.font.sizes.large};
            width: 100%;
            text-align:center;
            padding: 0px;
            margin: 0px;
            border: none;
        }
        button {
            font-size:${({ theme }) => theme.font.sizes.xlarge};
            color: ${({ theme }) => theme.colors.secondaryColor};
            font-family: ${({ theme }) => theme.font.family.bold};
            background-color: transparent;
            border: none;
            padding: 0% 7%;
            display: flex;
            align-items: center;
        }
    }

    [data-div="btn-div"] {
        white-space: nowrap;
        border-radius: 4px;
        color: #FFFFFF;
        background-color: ${({ theme }) => theme.colors.secondaryColor};
        font-size:${({ theme }) => theme.font.sizes.small};
        display: flex;
        align-items: center;
        padding:  0rem 1rem;
        max-width: 50%;
        width:100%;
        margin-left: 10%;
        span {
            margin: 0px;
            padding: 0px;
            margin-left: auto;
        }
    }
`
export default function Product({ data }) {
    const [product] = useState(data)
    const { setMyCart } = useContext(MyCartContext)
    const refQuantity = useRef();
    const [quantity, setQuantity] = useState(1)
    const router = useRouter()
    const { myCartId } = parseCookies();

    const handleQuantity = (newValue) => {
        /* newValue é utilizado nos botoes + e - */
        const value = newValue >= 0 ? newValue : refQuantity.current.value.replace(/[^0-9]/g, '')
        if (value.toString().length > 4) return

        setQuantity(value)
    }

    const handleAddMyCart = async (id, quantity) => {
        await storeQuantity(id, quantity, myCartId)
        await setMyCart(await getCartTemp(myCartId))
        router.push("/")
    }

    return (
        <>
            <Head>
                <title>{`${product.name}`}</title>
            </Head>

            <SectionSC>
                <div data-div="product">
                    <div data-div="img-main">
                        <div>
                            {!!product.promotion && (<span>{(Number(product.price - product.price_promotion) / Number(product.price) * 100).toFixed(0)}% OFF</span>)}
                            <img src={product.url_img ? product.url_img : '/assets/images/default_product.png'} alt={product.name} />
                        </div>
                    </div>
                    <div data-div="name">
                        <h2>{product.name}</h2>
                    </div>
                    <div data-div="description">
                        <p>{product.description}</p>
                    </div>
                </div>
                <FootCardSC>
                    <div>
                        <div data-div="input-div">
                            <button type="button" onClick={() => handleQuantity(parseInt(Number(quantity) - 1))}><Dash /></button>
                            <input ref={refQuantity} type="number" id="quantity" value={quantity} onChange={handleQuantity} />
                            {/* <MaskedInput mask={[/[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/]} showMask={true} guide={false} ref={refQuantity} type="text" id="quantity" value={quantity} onChange={handleQuantity} /> */}
                            <button type="button" onClick={() => handleQuantity(parseInt(Number(quantity) + 1))}><Plus /></button>
                        </div>
                        <button onClick={() => handleAddMyCart(product.id, quantity)} type="button" data-div="btn-div">
                            Adicionar  <span>{!!product.promotion ? moneyMask(product.price_promotion) : moneyMask(product.price)} </span>
                        </button>
                    </div>
                </FootCardSC>
            </SectionSC>
        </>
    );
}

export async function getServerSideProps(req) {
    const { id } = req.params
    const data = await getByID(id)

    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: { data },
    }
}