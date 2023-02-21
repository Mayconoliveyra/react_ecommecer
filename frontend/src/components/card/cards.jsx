import styled from "styled-components"
import { parseCookies } from "nookies";
import { useContext, useRef, useState } from "react"
import { Dash, Plus, Trash3 } from "react-bootstrap-icons"

import { Card, Img, Description, Price, Promotion, BtnAdd } from "./components"

import { getCartTemp, storeQuantidade } from "../../pages/api/cart"
import MyCartContext from "../../context/myCart"
import { moneyMask } from "../../../masks"

const CardCarRowSC = styled.div`
        display: flex;
        flex-direction: column;
        background-color: #F7F9FA;
        border: 1px solid #f5f5f5;
        [data="img-name-price"]{
            display: flex;
            [data="name-price"]{
                padding: 0.5rem;
                max-width: 40rem;
            }
        }
`
const BtnIncrementerSC = styled.div`
    display: flex;
    width: 100%;
    padding: 0rem 0.5rem;
    margin-bottom: 0.5rem;
    align-items:center;
  
    [data="input-div"] {
        background-color: #FFFFFF;
        border: solid 1px #DCDCDC;
        border-radius: 7px;
        display: flex;
        border-color: #D5D9D9;
        input {
            font-size: 1.4rem;
            width: 4.5rem;
            text-align:center;
            padding: 0px;
            margin: 0px;
            border: none;
            border: solid 1px #DCDCDC;
        }
        button {
            font-size: 2rem;
            color: #0F1111;
            background: linear-gradient(to bottom,#f7f8fa,#e7e9ec);
            padding: 0.4rem 0.6rem;
            display: flex;
            align-items: center;
            width:3.5rem;
            display:flex;
            justify-content:center;

            &:nth-child(1){
                box-shadow: 0 0.2rem 0.5rem 0 rgb(213 217 217 / 50%);
                border-bottom-left-radius:7px;
                border-top-left-radius:7px;
            }
            &:nth-child(3){
                box-shadow: 0 0.2rem 0.5rem 0 rgb(213 217 217 / 50%);
                border-top-right-radius:7px;
                border-bottom-right-radius:7px;
            }

            [data="icon-remover"]{
                font-size:1.4rem;
            }
        }
    }
    [data="btn-div"]{
        font-size: 1rem;
        color: #0F1111;
        padding: 0.4rem 1.4rem;
        display: flex;
        align-items: center;
        background: #FFF;
        border: solid 1px #DCDCDC;
        border-radius: 7px;
        margin-left: 1.6rem;
    }
`
const CardPaymentSC = styled.div`
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
        max-height: 15rem;
        background-color: #fff;
        border-bottom: 0.1rem solid #e7e7e7;
        [data="img-card-pay"]{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 5px;
            width: 120px;
            img {
                max-width: 85px;
                max-height: 85px;
            }
        }
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
                        .quantidade-span{
                            margin-right: 1.2rem;
                        }
                }
            }
        }
        &:last-child{
            border-bottom: transparent;
        } 
`
const CardOne = ({ product }) => {
    return (
        <Card margin="2px 1px">
            <Img height="170px" product={product} />
            <Description product={product} />
            <Promotion product={product} />
            <Price product={product} />
        </Card>
    )
}
const CardTwo = ({ product }) => {
    return (
        <Card nobackground margin="2px 1px">
            <Img padding="0" height="170px" product={product} />
        </Card>
    )
}
const CardThree = ({ product }) => {
    return (
        <Card nobackground border="1px solid #f5f5f5" margin="2px 2px">
            <Img background="#F8F8F8" height="233px" product={product} />
            <Description padding="7px 5px 0px 5px" product={product} />
            <Promotion product={product} />
            <Price product={product} />
        </Card>
    )
}
const CardCarRow = ({ product }) => {
    const { setMyCart } = useContext(MyCartContext)
    const refQuantidade = useRef();
    const [quantidade, setQuantidade] = useState(product.quantidade)
    const { myCartId } = parseCookies();

    const handleQuantidade = async (newValue) => {
        /* newValue é utilizado nos botoes + e - */
        const value = newValue >= 0 ? newValue : refQuantidade.current.value.replace(/[^0-9]/g, '')
        if (value.toString().length > 4) return

        setQuantidade(value)

        if (value && value >= 0) {
            await handleAddMyCart(product.id, value)
        }
    }

    const handleRemoveProduct = async (id) => {
        /* Para remover o produto do carrinho basta enviar o id com a quantiade 0 */
        await storeQuantidade(id, 0, myCartId)
        await setMyCart(await getCartTemp({ id_storage: myCartId }))
    }

    const handleAddMyCart = async (id, quantidade) => {
        await storeQuantidade(id, quantidade, myCartId)
        await setMyCart(await getCartTemp({ id_storage: myCartId }))
    }

    return (
        <CardCarRowSC>
            <div data="img-name-price">
                <Img padding="0" height="170px" width="170px" product={product} />
                <div data="name-price">
                    <Description product={product} />
                    <Price product={product} />
                </div>
            </div>

            <BtnIncrementerSC>
                <div data="input-div">
                    {quantidade > 1 ? (
                        <button type="button" onClick={() => handleQuantidade(parseInt(Number(quantidade) - 1))}><Dash /></button>
                    ) : (
                        <button type="button" onClick={() => handleRemoveProduct(product.id)}><Trash3 data="icon-remover" /></button>
                    )}
                    <input ref={refQuantidade} type="number" value={quantidade} onChange={handleQuantidade} />
                    <button type="button" onClick={() => handleQuantidade(parseInt(Number(quantidade) + 1))}><Plus /></button>
                </div>
                <button onClick={() => handleRemoveProduct(product.id)} type="button" data="btn-div">
                    Excluir
                </button>
            </BtnIncrementerSC>
        </CardCarRowSC>
    )
}
const CardPayment = ({ product }) => {
    return (
        <CardPaymentSC>
            <div data='a-card'>
                <div data="img-card-pay">
                    <img src={product.url_img ? product.url_img : '/assets/images/default_product.png'} alt={product.nome ? product.nome : "Sem discrição"} />
                </div>
                <div data="name-price">
                    <div data="name">
                        <h2>{product.nome}</h2>
                    </div>
                    <div data="price">
                        {product.promocao_ativa == 'Sim' ?
                            (
                                <>
                                    <span>R$ {moneyMask(product.preco_promocao, false)}</span>
                                </>
                            ) : (
                                <>
                                    <span>R$ {moneyMask(product.preco, false)}</span>
                                </>
                            )
                        }
                    </div>
                    <div data="quantity">
                        {product.promocao_ativa == 'Sim' ?
                            (
                                <>
                                    <span className="quantidade-span">Qtd: {product.quantidade}</span>   <span>Total: {moneyMask(product.preco_promocao * product.quantidade)}</span>
                                </>
                            ) : (
                                <>
                                    <span className="quantidade-span">Qtd: {product.quantidade}</span>   <span>Total: {moneyMask(product.preco * product.quantidade)}</span>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </CardPaymentSC>
    )
}
const CardSugOne = ({ product }) => {
    return (
        <Card margin="2px 1px">
            <Img height="170px" product={product} />
            <Description height="1.5rem" product={product} />
            <Promotion product={product} />
            <Price product={product} />
            <BtnAdd product={product} />
        </Card>
    )
}

export { CardOne, CardTwo, CardThree, CardCarRow, CardPayment, CardSugOne }