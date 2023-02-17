import Head from "next/head";
import Link from "next/link"
import { ChevronRight, X } from "react-bootstrap-icons"
import * as Yup from "yup";
import { pt } from "yup-locale-pt";
Yup.setLocale(pt);

import { TableVW } from "../../../../../components/portal/table/components"
import { TitleOne } from "../../../../../components/portal/titulo/components"

import { getAllPortal } from "../../../../api/portal/produtos";
import { moneyMask, dataFormat } from "../../../../../../masks"

export default function Adicionar({ data }) {
    return (
        <>
            <Head>
                <title>Softconnect - Visualizar produto</title>
            </Head>
            <TitleOne title="Visualizar produto">
                <li>
                    <Link href="/portal">Início <ChevronRight height={10} /></Link>
                </li>
                <li>
                    <Link href="/portal/cadastro/produtos">Produtos <ChevronRight height={10} /></Link>
                </li>
                <li data="ativo">
                    Visualizar
                </li>
            </TitleOne>

            <TableVW>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Código interno
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {data.codigo_interno}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Nome do produto
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {data.nome}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Produto ativo
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {data.produto_ativo}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Valor de venda
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {moneyMask(data.preco)}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Valor promoção
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {moneyMask(data.preco_promocao)} <b>({(Number(data.preco - data.preco_promocao) / Number(data.preco) * 100).toFixed(0)}%)</b>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Promoção ativa
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {data.promocao_ativa}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Estoque atual
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {data.estoque_atual}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Estoque mínimo
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {data.estoque_minimo}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Quant. min. venda
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {data.estoque_qtd_minima}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Controlar estoque
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {data.estoque_controle}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Imagem principal
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {data.url_img}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Imagem 1
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {data.img_1}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Imagem 2
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {data.img_2}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Imagem 3
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {data.img_3}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Imagem 4
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {data.img_4}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Cadastrado em
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {dataFormat(data.created_at)}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className="span-th-vw">
                                    Modificado em
                                </span>
                            </th>
                            <td>
                                <span className="span-td-vw">
                                    {dataFormat(data.updated_at)}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </TableVW>
        </>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.params; /* id do produto; */

    const data = await getAllPortal({ id: id })
    if (!data || !data.id) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: { data },
    }
}