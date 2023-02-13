import Head from "next/head";
import { ChevronRight } from "react-bootstrap-icons"
import Link from "next/link"
import { Search, PencilSquare, X } from "react-bootstrap-icons"

import { TitleOne } from "../../../../../components/portal/titulo/components"

import { getAllPortal } from "../../../../api/portal/produtos";
import { moneyMask } from "../../../../../../masks"

export default function Adicionar({ data }) {
    return (
        <>
            <Head>
                <title>Softconnect - Adicionar produto</title>
            </Head>
            <TitleOne title="Adicionar produto">
                <li>
                    <Link href="/portal">Início <ChevronRight height={10} /></Link>
                </li>
                <li>
                    <Link href="/portal/cadastro/produtos">Produtos <ChevronRight height={10} /></Link>
                </li>
                <li data="ativo">
                    Adicionar
                </li>
            </TitleOne>

           
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