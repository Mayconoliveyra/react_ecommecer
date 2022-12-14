import styled from "styled-components"
import { CartPlusFill } from "react-bootstrap-icons"
import { moneyMask } from "../../../masks"
import Link from "next/link"

const CardSC = styled(Link)`
    display: flex;
    flex-direction: column;
    border: solid 1px #D9D9D9;
    border-radius: 5px;
    padding: 12px;
    width: 193px;
    height: 280px;
    margin-right: 15px;
    &:hover{
        box-shadow: rgb(40 41 61 / 4%) 0px 4px 8px, rgb(96 97 112 / 16%) 0px 8px 16px;
    }

    [data-div="img"] {
        position:relative;
        border: solid 1px #EDEDED;
        height: 165px;
        width: 165px;
        padding: 3px;
        display: flex;
        align-items: center;
        justify-content:center;
        span {
            font-size: ${({ theme }) => theme.font.sizes.xsmall};
            color: #FFFFFF;
            position:absolute;
            background-color: #77D500;
            border-radius: 3px;
            border-top-left-radius: 0px;
            padding: 1px 5px;
            top: 0px;
            left: -1px;
        }
        img {
            max-width: 140px;
            max-height: 140px;
        }
    }

    [data-div="name"] {
        margin-top: 5px;
        
        h2 {
            font-size: ${({ theme }) => theme.font.sizes.small};
            font-family: ${({ theme }) => theme.font.family.regular};

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
    }

    [data-div="price"] {
        flex: 1;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        div:nth-child(1){
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            span:nth-child(1) {
                color: #FF5959;
                text-decoration: line-through;
                font-size: ${({ theme }) => theme.font.sizes.xsmall};
                padding: 2px;
            }
            span:nth-child(2) {
                font-size: ${({ theme }) => theme.font.sizes.small};
                font-family: ${({ theme }) => theme.font.family.bold};
            }
        }
        div:nth-child(2){
            padding: 7px 0px 0px 7px;
            svg {
               color: ${({ theme }) => theme.colors.secondaryColor};
               font-size: 19px;
            }
        }
    }
`
export default function Card({ id, url_img, name, price, price_promotion, promotion }) {
    return (
        <CardSC href={`/produto/${id}`}>
            <div data-div="img">
                {!!promotion && (<span>{(Number(price - price_promotion) / Number(price) * 100).toFixed(0)}% OFF</span>)}
                <img src={url_img ? url_img : '/assets/images/default_product.png'} alt={name} />
            </div>
            <div data-div="name">
                <h2>{name}</h2>
            </div>
            <div data-div="price">
                {!!promotion ?
                    (
                        <div>
                            <span>{moneyMask(price)}</span>
                            <span>{moneyMask(price_promotion)}</span>
                        </div>
                    ) : (
                        <div>
                            <span></span>
                            <span>{moneyMask(price)}</span>
                        </div>
                    )
                }
                <div>
                    <CartPlusFill />
                </div>
            </div>
        </CardSC>
    )
}