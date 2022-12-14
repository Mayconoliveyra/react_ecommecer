import styled from "styled-components"
import { moneyMask } from "../../../../../masks"
import Link from "next/link"

const CardSearchSC = styled(Link)`
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
        max-height: 15rem;
        background-color:#FFFFFF;
        > div {
            width: 100%;
            height: 100%;
            display: flex;
            border: 1px solid #f5f5f5;
            border-radius: 4px;
            [data-div="img"] {
                position:relative;
                width: 40%;
                display: flex;
                align-items: center;
                justify-content:center;
                background-color: #F8F8F8;
                padding: 0.5rem;
                img {
                    max-width: 150px;
                    max-height: 200px;
                }
            }

            [data-div="name-price"] {
                padding: 0.4rem 0.5rem;
                flex: 1;
                > span {
                    font-size: 0.9rem;
                    background-color: #7fda69;
                    color: #111;
                    border-radius: 1px;
                    padding: 2px 5px;
                }
                [data-div="name"] {
                    h2 {
                        margin: 3px 0px;
                        font-size: ${({ theme }) => theme.font.sizes.small};
                        font-family: ${({ theme }) => theme.font.family.regular};

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
                [data-div="price"] {
                    flex: 1;
                    display: flex;
                    margin-top: 2px;
                    span:nth-child(1) {
                        position:relative;
                        top: 0.2rem;
                        font-size: 1.1rem;;
                    }
                    span:nth-child(2) {
                        font-size: 1.6rem;
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
export default function CardSearch({ id, url_img, name, price, price_promotion, promotion }) {
    return (
        <CardSearchSC href={`/produto/${id}`}>
            <div>
                <div data-div="img">
                    <img src={url_img ? url_img : '/assets/images/default_product.png'} alt={name} />
                </div>
                <div data-div="name-price">
                    <div data-div="name">
                        <h2>{name}</h2>
                    </div>
                    {!!promotion && (<><span>Economize {(Number(price - price_promotion) / Number(price) * 100).toFixed(0)}%</span> na promoção</>)}
                    <div data-div="price">
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
            </div>
        </CardSearchSC>
    )
}