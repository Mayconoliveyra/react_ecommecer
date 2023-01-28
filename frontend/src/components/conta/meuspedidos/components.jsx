import styled from "styled-components"
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import { useState } from "react";

import { getPedidos } from "../../../pages/api/cart"

const PedidoSC = styled.div`
    button{
        background: transparent;
        display: flex;
        align-items: center;
        width: 100%;
        color: #0F1111;
        [data="title-value"]{
            font-size: 1rem;
            line-height: 1.7rem;
            flex:1;
            [data="title"]{
                font-family:${({ theme }) => theme.font.family.bold};
                text-align: left;
            }
            [data="values"]{
                display: flex;
                text-align: left;
                span{
                    font-size: 1.1rem;
                }
            }
        }
        [data="icon"]{
            svg{
                font-size: 1.2rem;
            }
        }
    }
`;

const Pedido = ({ pedido, session }) => {
    const [iconChevro, setIconChevro] = useState(true)
    const [products, setProducts] = useState([])
    const hadlePedido = async () => {
        setIconChevro(!iconChevro)

        if (products.length == 0)
            await getPedidos({ id_sales: pedido.id, session })
                .then(async (products) => {
                    console.log(products)
                    setProducts(products)
                })
    }
    return (
        <PedidoSC>
            <button type="button" onClick={() => hadlePedido()}>
                <div data="title-value">
                    <div data="title">
                        NÚMERO DO PEDIDO
                    </div>
                    <div data="values">
                        <span>#164889</span>
                    </div>
                </div>
                <div data="icon">
                    {iconChevro && <ChevronDown />}
                    {!iconChevro && <ChevronUp />}

                </div>
            </button>
            {!iconChevro &&
                <PedidoDetalhes >
                    <div>{products.id}</div>
                    <div>{products.name}</div>
                    <div>{products.p_amount}</div>


                </PedidoDetalhes>
            }
        </PedidoSC >
    )
}
const PedidoDetalhes = ({ children }) => {
    return (
        <PedidoSC>
            {children}
        </PedidoSC>
    )
}

export { Pedido, PedidoDetalhes }