import Head from "next/head";
import { ChevronRight, BoxFill } from "react-bootstrap-icons"
import Link from "next/link"
import { PlusCircleDotted, Search, PencilSquare, X, ArrowUp, ArrowDown } from "react-bootstrap-icons"
import { getSession } from "next-auth/react";

import { TitleOne } from "../../../../components/portal/titulo/components"
import { HeaderFormOne } from "../../../../components/portal/headerform/components"
import { ButtonVerde, ButtonVermelho, ButtonLaranja, ButtonPreto, ButtonAzul } from "../../../../components/portal/button/components"
import { InputSearchOne } from "../../../../components/portal/input/components"
import { TableOne, TdOne, ThOne, Paginador, Vazio } from "../../../../components/portal/table/components"

import { getProdutoPortal } from "../../../api/portal/produtos";
import { moneyMask } from "../../../../../masks"

import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function CadastroProdutos({ produtos, totalPags, _sort, _order, _page, session }) {
    const prefix = "produto"
    const prefixRouter = "/portal/cadastros/produtos"

    const LinkHrefTable = (nomeExibir, columnDb) => {
        return (
            <Link href={`${prefixRouter}?_page=1&_sort=${columnDb}&_order=${_order == "DESC" ? "ASC" : "DESC"}`}>
                {_sort == columnDb &&
                    <>
                        {_order == "DESC" ?
                            <ArrowUp />
                            :
                            <ArrowDown />
                        }
                    </>
                }
                {nomeExibir}
            </Link>
        )
    }
    return (

        <>
            <Head>
                <title>{`Softconnect - Listar ${prefix}s`}</title>
            </Head>
            <TitleOne title={`Listar ${prefix}s`} icon={<BoxFill size={20} />}>
                <li>
                    <Link href="/portal">Início <ChevronRight height={10} /></Link>
                </li>
                <li>
                    <Link href={prefixRouter}>{`${prefix[0].toUpperCase() + prefix.substring(1)}s`} <ChevronRight height={10} /></Link>
                </li>
                <li data="ativo">
                    Listar
                </li>
            </TitleOne>
            <HeaderFormOne>
                <ButtonVerde>
                    <Link href={`${prefixRouter}/adicionar`}><PlusCircleDotted size={18} />Adicionar</Link>
                </ButtonVerde>

                <InputSearchOne>
                    <>
                        <input placeholder="Buscar" type="text" />
                        <ButtonPreto borderadius="0px 3px 3px 0px">
                            <button><Search size={18} /></button>
                        </ButtonPreto>
                    </>
                </InputSearchOne>
            </HeaderFormOne>

            {produtos && produtos.length > 0 ?
                < TableOne >
                    <table>
                        <thead>
                            <tr>
                                <ThOne maxwidth="100px">
                                    {LinkHrefTable("Cód.", "codigo_interno")}
                                </ThOne>
                                <ThOne maxwidth="9999px">
                                    {LinkHrefTable("Nome", "nome")}
                                </ThOne>
                                <ThOne maxwidth="100px">
                                    {LinkHrefTable("Estoque", "estoque_atual")}
                                </ThOne>
                                <ThOne maxwidth="100px">
                                    {LinkHrefTable("Venda", "preco")}
                                </ThOne>
                                <ThOne maxwidth="100px">
                                    {LinkHrefTable("Promoção", "preco_promocao")}
                                </ThOne>
                                <ThOne maxwidth="110px">Ações</ThOne>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map((product => {
                                return (
                                    <tr key={product.id}>
                                        <TdOne maxwidth="100px">{product.codigo_interno}</TdOne>
                                        <TdOne maxwidth="9999px">{product.nome}</TdOne>
                                        <TdOne maxwidth="100px">{product.estoque_atual}</TdOne>
                                        <TdOne maxwidth="100px">{moneyMask(product.preco, false)}</TdOne>
                                        <TdOne maxwidth="100px">{moneyMask(product.preco_promocao, false)}</TdOne>
                                        <TdOne margin="0 auto" maxwidth="110px" element="acoes">
                                            <ButtonAzul margin="0 3px 0 0" padding="4px 4px 5px 8px">
                                                <Link href={`${prefixRouter}/visualizar/${product.id}`}>
                                                    <Search size={13} />
                                                </Link>
                                            </ButtonAzul>
                                            <ButtonLaranja margin="0 3px 0 0" padding="4px 4px 5px 8px">
                                                <Link href={`${prefixRouter}/editar/${product.id}`}>
                                                    <PencilSquare size={13} />
                                                </Link>
                                            </ButtonLaranja>
                                            <ButtonVermelho margin="0" padding="2px 2px 3px 6px">
                                                <Link href="">
                                                    <X size={17} />
                                                </Link>
                                            </ButtonVermelho>
                                        </TdOne>
                                    </tr>
                                )
                            }))}
                        </tbody>
                    </table>
                </TableOne>
                :
                <Vazio nome={prefix} />
            }

            {
                totalPags > 1 &&
                <Paginador>
                    {(() => {
                        const links = [];
                        for (let page = 1; page <= totalPags; page++) {
                            links.push(
                                <Link key={page} className={_page == page ? 'active' : ''} href={`${prefixRouter}?_page=${page}&_sort=${_sort}&_order=${_order}`}>{page}</Link>
                            );
                        }
                        return links;
                    })()}
                </Paginador>
            }
        </>
    )
}

export async function getServerSideProps(context) {
    try {
        const { req } = context
        const session = await getSession({ req })
        if (session && session.id && session.email_auth && session.adm) {
            const { _sort = "id", _order = "DESC", _page = 1 } = context.query;
            const { produtos, totalPags } = await getProdutoPortal({ _sort: _sort, _order: _order, _page: _page, session: session })

            return {
                props: { produtos, totalPags, _sort, _order, _page, session },
            }

        }

        throw ""
    } catch (error) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
}