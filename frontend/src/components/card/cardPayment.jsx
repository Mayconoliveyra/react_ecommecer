import styled from "styled-components"

import { moneyMask } from "../../../masks"

const CardOneSC = styled.div`
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
        max-height: 15rem;
        background-color: #fff;
        border-bottom: 0.1rem solid #e7e7e7;
        [data='a-card']{
            width: 100%;
            height: 100%;
            display: flex;
            padding: 0.6rem 0;
            [data="name-price"] {
                padding: 0 0.5rem;
                flex: 1;
                [data="name"] {
                    h2 {
                        margin: 3px 0px;
                        font-size: 1.1rem;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: normal;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                    margin-bottom: 3px;
                }
                [data="price"] {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    margin-top: 3px;
                    margin-bottom: 8px;
                    span:nth-child(1) {
                        margin-right: 1px;
                        position:relative;
                        top: 0.1rem;
                        font-size: 1.1rem;
                        font-family: ${({ theme }) => theme.font.family.bold};
                        color: #B12704!important;
                    }
                } 
                [data="quantity"]{
                        border-radius: 0.25rem;
                        background: #f4f5f5;
                        box-shadow: 0 0.2rem 0.5rem rgb(15 17 17 / 15%);
                        border: solid 1px #D5D9D9;
                        padding: 0.75rem 1rem;;
                        display: flex;
                        justify-content: space-between;
                        span{
                            font-family: ${({ theme }) => theme.font.family.medium};
                            font-size: 1rem;
                        }
                }
            }
        }
        &:last-child{
            border-bottom: transparent;
        } 
`
const ImgCardSC = styled.div`
    display: flex;
    justify-content:center;
    padding: 0.3rem 0.8rem;
    img {
        max-width: 85px;
        max-height: 85px;
    }
`
export const CardPayment = ({ product }) => {
    return (
        <CardOneSC >
            <div data='a-card'>
                <ImgCardSC>
                    <img src={product.url_img ? product.url_img : '/assets/images/default_product.png'} alt={product.alt ? product.alt : "Sem discrição"} />
                </ImgCardSC>
                <div data="name-price">
                    <div data="name">
                        <h2>{product.name}</h2>
                    </div>
                    <div data="price">
                        {!!product.promotion ?
                            (
                                <>
                                    <span>R$ {moneyMask(product.price_promotion, false)}</span>
                                </>
                            ) : (
                                <>
                                    <span>R$ {moneyMask(product.price, false)}</span>
                                </>
                            )
                        }
                    </div>
                    <div data="quantity">
                        {!!product.promotion ?
                            (
                                <>
                                    <span>Qtd: {product.quantity}</span>   <span>Total: {moneyMask(product.price_promotion * product.quantity)}</span>
                                </>
                            ) : (
                                <>
                                    <span>Qtd: {product.quantity}</span>   <span>Total: {moneyMask(product.price * product.quantity)}</span>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </CardOneSC>
    )
}