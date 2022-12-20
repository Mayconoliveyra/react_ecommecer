import styled from "styled-components"
import Link from "next/link"

import { ImgCard } from "./img"
import { BtnsIncrementer } from "./btnsIncrementer"

import { moneyMask } from "../../../masks"

const CardOneSC = styled.div`
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
        max-height: 15rem;
        background-color:#F7F9FA;
        border: 1px solid #f5f5f5;
        [data='a-card']{
            width: 100%;
            height: 100%;
            display: flex;
            border-radius: 4px;
            [data="name-price"] {
                padding: 0.4rem 0.5rem;
                flex: 1;
                > span {
                    font-size: 0.9rem;
                    background-color: #7fda69;
                    color: #111;
                    border-radius: 1px;
                    padding: 2px 5px;
                }
                [data="name"] {
                    h2 {
                        margin: 3px 0px;
                        font-size: ${({ theme }) => theme.font.sizes.small};

                        @media (max-width: 720px){
                            font-size: 1.15rem;
                        }

                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: normal;
                        display: -webkit-box;
                        -webkit-line-clamp: 3;
                        -webkit-box-orient: vertical;
                    }
                    margin-bottom: 7px;
                }
                [data="price"] {
                    flex: 1;
                    display: flex;
                    margin-top: 2px;
                    span:nth-child(1) {
                        margin-right: 1px;
                        position:relative;
                        top: 0.1rem;
                        font-size: 1rem;
                        font-family: ${({ theme }) => theme.font.family.bold};
                    }
                    span:nth-child(2) {
                        font-size: 1.5rem;
                        font-family: ${({ theme }) => theme.font.family.medium};
                    }
                    span:nth-child(3) {
                        position:relative;
                        top: 0.6rem;
                        font-size: 1.1rem;;
                        text-decoration: line-through;
                        color: #565959;
                    }
                } 
            }
        }
`
export const CardOne = ({ id, quantity, url_img, name, price, price_promotion, promotion, btnsIncrementer = false }) => {
    return (
        <CardOneSC >
            <Link href={`/produto/${id}`} data='a-card'>
                <ImgCard src={url_img} alt={name} />
                <div data="name-price">
                    <div data="name">
                        <h2>{name}</h2>
                    </div>
                    {!!promotion && (<><span>Economize {(Number(price - price_promotion) / Number(price) * 100).toFixed(0)}%</span> na promoção</>)}
                    <div data="price">
                        {!!promotion ?
                            (
                                <>
                                    <span>R$</span>
                                    <span>{moneyMask(price_promotion, false)}</span>
                                    <span>{moneyMask(price)}</span>
                                </>


                            ) : (
                                <>
                                    <span>R$</span>
                                    <span>{moneyMask(price, false)}</span>
                                </>
                            )
                        }
                    </div>
                </div>
            </Link>

            {/* Elemento que exibe os botões no carrinho. Alterar quantidade ou remover.*/}
            {!!btnsIncrementer && (
                <BtnsIncrementer id={id} quantity={quantity} />
            )}
        </CardOneSC>
    )
}