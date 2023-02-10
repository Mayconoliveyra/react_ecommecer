import Head from "next/head";
import { ChevronRight, BoxFill } from "react-bootstrap-icons"
import Link from "next/link"
import { PlusCircleDotted } from "react-bootstrap-icons"

import { TitleOne } from "../../../../components/portal/titulo/components"
import { HeaderFormOne } from "../../../../components/portal/headerform/components"

import { Button } from 'react-bootstrap';

export default function CadastroProdutos() {
    return (
        <>
            <Head>
                <title>Softconnect - Listar produtos</title>
            </Head>
            <TitleOne title="Listar produtos" icon={<BoxFill size={20} />}>
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
                <Button size="sm" variant="success"><PlusCircleDotted size={20} /> Adicionar</Button>
            </HeaderFormOne>
        </>
    )
}