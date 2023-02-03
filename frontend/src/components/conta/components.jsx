import styled from "styled-components"
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import { useState } from "react";
import moment from "moment"
import 'moment/locale/pt-br'
moment.locale('pt-br')

import { ContentBorder } from "../containe"
import { CardPayment } from "../card/cards";

import { getPedidos } from "../../pages/api/cart"
import { moneyMask } from "../../../masks"

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
                h2{
                    font-family:${({ theme }) => theme.font.family.bold};
                    text-align: left;
                    font-size: 1.1rem;
                }
            }
            [data="values"]{
                display: flex;
                text-align: left;
                span{
                    font-size: 1.2rem;
                }
            }
        }
        [data="icon"]{
            svg{
                font-size: 1.2rem;
            }
        }
    }
    section{
        margin-bottom: 1rem;
    }
`;
const StatusSC = styled.span`
    color: #007600;
    font-size: ${({ theme }) => theme.font.sizes.medium};
    font-family: ${({ theme }) => theme.font.family.medium};
`
const Pedido = ({ pedido, session }) => {
    const [iconChevro, setIconChevro] = useState(true)
    const [products, setProducts] = useState([])
    const hadlePedido = async () => {
        setIconChevro(!iconChevro)

        if (products.length == 0)
            await getPedidos({ id_sales: pedido.id, session })
                .then(async (products) => {
                    setProducts(products)
                })
    }
    const dataFormat = (date) => {
        return moment(date).format('ll')
    }
    return (
        <PedidoSC>
            <button type="button" onClick={() => hadlePedido()}>
                <div data="title-value">
                    <div data="title">
                        <h2>
                            NÚMERO DO PEDIDO
                        </h2>
                    </div>
                    <div data="values">
                        <span>#{Number(pedido.id).toLocaleString('en-US', {
                            minimumIntegerDigits: 6,
                            useGrouping: false
                        })}</span>
                    </div>
                </div>
                <div data="icon">
                    {iconChevro && <ChevronDown />}
                    {!iconChevro && <ChevronUp />}

                </div>
            </button>

            {!iconChevro &&
                <>
                    <section>
                        <ContentBorder padding="1rem 1.2rem" margin="1rem 0 0 0" borderRadius="0.7rem 0.7rem 0 0">
                            <div data="title">
                                <h3>Status do pedido</h3>
                            </div>
                        </ContentBorder>
                        <ContentBorder padding="1rem 1.2rem" borderRadius="0 0 0.7rem 0.7rem" >
                            <StatusSC>
                                {pedido.status}
                            </StatusSC>
                        </ContentBorder>
                    </section>
                    <section>
                        <ContentBorder padding="1rem 1.2rem" borderRadius="0.7rem 0.7rem 0 0">
                            <div data="title">
                                <h3>Detalhes do pedido</h3>
                            </div>
                        </ContentBorder>
                        <ContentBorder padding="1rem 1.2rem" borderRadius="0 0 0.7rem 0.7rem">
                            <table data="table-1">
                                <tbody>
                                    <tr>
                                        <td>Data do pedido</td>
                                        <td data="td-value">{dataFormat(pedido.created_at)}</td>
                                    </tr>
                                    <tr>
                                        <td>Nº do pedido</td>
                                        <td data="td-value">
                                            #{Number(pedido.id).toLocaleString('en-US', {
                                                minimumIntegerDigits: 6,
                                                useGrouping: false
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Itens:</td>
                                        <td data="td-value">{moneyMask(pedido.vlr_pagar_products)}</td>
                                    </tr>
                                    <tr>
                                        <td>Frete:</td>
                                        {pedido.cobrar_frete ?
                                            <td data="td-value">{moneyMask(pedido.vlr_frete)}</td>
                                            :
                                            <td data="td-value">{moneyMask(0.00)}</td>
                                        }
                                    </tr>
                                    <tr>
                                        <td data="td-bold">Total do pedido</td>
                                        <td data="td-red">{moneyMask(pedido.vlr_pago)} ({pedido.qtd_products} {pedido.qtd_products > 1 ? "itens" : "item"})</td>
                                    </tr>
                                </tbody>
                            </table>
                        </ContentBorder>
                    </section>
                    <section>
                        <ContentBorder padding="1rem 1.2rem" borderRadius="0.7rem 0.7rem 0 0">
                            <div data="title">
                                <h3>Informações de pagamento</h3>
                            </div>
                        </ContentBorder>
                        <ContentBorder padding="1rem 1.2rem" borderRadius="0 0 0.7rem 0.7rem" >
                            <table data="table-1">
                                <tbody>
                                    <tr>
                                        <td data="td-bold">Forma de pagamento</td>
                                    </tr>
                                    <tr>
                                        <td>{pedido.pgt_forma}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </ContentBorder>
                    </section>
                    <section>
                        <ContentBorder padding="1rem 1.2rem" borderRadius="0.7rem 0.7rem 0 0">
                            <div data="title">
                                <h3>Endereço de entrega</h3>
                            </div>
                        </ContentBorder>
                        <ContentBorder padding="1rem 1.2rem" borderRadius="0 0 0.7rem 0.7rem">
                            {pedido.pgt_metodo == "Receber em casa" ?
                                <table data="table-1">
                                    <tbody>
                                        <tr>
                                            <td>{pedido.nome}</td>
                                        </tr>
                                        <tr>
                                            <td>{pedido.logradouro}</td>
                                        </tr>
                                        {pedido.numero &&
                                            <tr>
                                                <td>{pedido.numero}</td>
                                            </tr>
                                        }
                                        {pedido.complemento &&
                                            <tr>
                                                <td>{pedido.complemento}</td>
                                            </tr>
                                        }
                                        <tr>
                                            <td>{pedido.localidade}, {pedido.uf}, {pedido.cep}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Contato: {pedido.contato}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                :
                                <div data="font-1.2">
                                    {pedido.pgt_metodo}
                                </div>
                            }
                        </ContentBorder>
                    </section>
                    <section>
                        <table data="table-1">
                            <tbody>
                                {products.map((product) => {
                                    return (
                                        <tr key={product.id}>
                                            <td>
                                                <CardPayment product={{ ...product, quantity: product.p_quantity, amount: product.p_amount, amount_promotion: product.p_amount_promotion }} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </section>
                </>
            }
        </PedidoSC >
    )
}

export { Pedido }