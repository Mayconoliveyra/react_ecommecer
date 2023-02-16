import Head from "next/head";
import { ChevronRight, BoxFill } from "react-bootstrap-icons"
import Link from "next/link"
import { PlusCircleDotted, Search, PencilSquare, X } from "react-bootstrap-icons"

import { TitleOne } from "../../../../components/portal/titulo/components"
import { HeaderFormOne } from "../../../../components/portal/headerform/components"
import { ButtonVerde, ButtonVermelho, ButtonLaranja, ButtonPreto, ButtonAzul } from "../../../../components/portal/button/components"
import { InputSearchOne } from "../../../../components/portal/input/components"
import { TableOne, TdOne, ThOne } from "../../../../components/portal/table/components"

import { getAllPortal } from "../../../api/portal/produtos";
import { moneyMask } from "../../../../../masks"

export default function CadastroProdutos({ data }) {
    const prefix = "produto"
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
                    <Link href="/portal/cadastro/produtos">Produtos <ChevronRight height={10} /></Link>
                </li>
                <li data="ativo">
                    Listar
                </li>
            </TitleOne>
            <HeaderFormOne>
                <ButtonVerde>
                    <Link href="/portal/cadastro/produtos/adicionar"><PlusCircleDotted size={18} />Adicionar</Link>
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

            <TableOne>
                <table>
                    <thead>
                        <tr>
                            <ThOne margin="0 auto" maxwidth="100px">Cód.</ThOne>
                            <ThOne maxwidth="9999px">Nome</ThOne>
                            <ThOne maxwidth="100px">Estoque</ThOne>
                            <ThOne maxwidth="100px">Venda</ThOne>
                            <ThOne maxwidth="100px">Promoção</ThOne>
                            <ThOne maxwidth="104px">Ações</ThOne>
                            <ThOne maxwidth="11px" padding="8px 2px">↕</ThOne>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((product => {
                            return (
                                <tr key={product.id}>
                                    <TdOne maxwidth="100px">{product.id}</TdOne>
                                    <TdOne maxwidth="9999px">{product.nome}</TdOne>
                                    <TdOne maxwidth="100px">{product.estoque_atual}</TdOne>
                                    <TdOne maxwidth="100px">{moneyMask(product.preco, false)}</TdOne>
                                    <TdOne maxwidth="100px">{moneyMask(product.preco_promocao, false)}</TdOne>
                                    <TdOne margin="0 auto" maxwidth="104px">
                                        <div data="acoes">
                                            <ButtonAzul margin="0 3px 0 0" padding="4px 4px 5px 8px">
                                                <Link href="/portal/cadastro/produtos/visualizar">
                                                    <Search size={13} />
                                                </Link>
                                            </ButtonAzul>
                                            <ButtonLaranja margin="0 3px 0 0" padding="4px 4px 5px 8px">
                                                <Link href="/portal/cadastro/produtos/editar">
                                                    <PencilSquare size={13} />
                                                </Link>
                                            </ButtonLaranja>
                                            <ButtonVermelho margin="0" padding="2px 2px 3px 6px">
                                                <Link href="/portal/cadastro/produtos/delete">
                                                    <X size={17} />
                                                </Link>
                                            </ButtonVermelho>
                                        </div>
                                    </TdOne>
                                </tr>
                            )
                        }))}
                    </tbody>
                </table>
            </TableOne>
        </>
    )
}

export async function getServerSideProps() {
    const data = await getAllPortal()

    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: { data },
    }
}