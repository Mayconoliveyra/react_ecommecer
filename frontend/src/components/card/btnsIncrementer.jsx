import { useContext, useRef, useState } from "react"
import styled from "styled-components"
import { Dash, Plus } from "react-bootstrap-icons"

import { getCartTemp, storeQuantity } from "../../adapters/cart"

import MyCartContext from "../../context/myCart"

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
export const BtnsIncrementer = ({ product }) => {
    const { setMyCart } = useContext(MyCartContext)
    const refQuantity = useRef();
    const [quantityNew, setQuantity] = useState(product.quantity)

    const handleQuantity = async (newValue) => {
        if (Number(newValue) >= 0) {
            setQuantity(Number(newValue))
            return
        }
        setQuantity(refQuantity.current.value)
    }

    const handleRemoveProduct = async (id) => {
        /* Para remover o produto do carrinho basta enviar o id com a quantiade 0 */
        await storeQuantity(id, 0)
        await setMyCart(await getCartTemp())
    }

    return (
        <BtnIncrementerSC>
            <div data="input-div">
                <button type="button" onClick={() => handleQuantity(Number(quantityNew - 1))}><Dash /></button>
                <input ref={refQuantity} type="number" id="quantityNew" value={quantityNew} onChange={handleQuantity} />
                <button type="button" onClick={() => handleQuantity(Number(quantityNew + 1))}><Plus /></button>
            </div>
            <button onClick={() => handleRemoveProduct(product.id)} type="button" data="btn-div">
                Excluir
            </button>
        </BtnIncrementerSC>
    )
}