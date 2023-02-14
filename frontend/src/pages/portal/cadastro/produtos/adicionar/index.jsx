import Head from "next/head";
import { ChevronRight } from "react-bootstrap-icons"
import Link from "next/link"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import styled from "styled-components";

import { TitleOne } from "../../../../../components/portal/titulo/components"

import { getAllPortal } from "../../../../api/portal/produtos";
import { moneyMask } from "../../../../../../masks"

import { Formik } from "formik";
import { FormOne, GroupOne, GroupSelectOne } from "../../../../../components/portal/form/components";

const TabsSC = styled.div`
    padding: 20px 15px;
    @media (max-width: 720px){
        padding: 20px 0px;
    }
    .nav-tabs{
        button{
            color: #333333 !important;
        }
    }
    .nav-link{
        border-radius: 0px;
        font-family:${({ theme }) => theme.font.family.medium} ;
    }
`

export default function Adicionar({ data }) {
    const initialValues = {
        nome: '',
        nmr_contato: '',
        sexo: '',
    }
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
            <Formik
                /* innerRef={formRef} */
                validateOnMount
                /*  validationSchema={scheme}
                 initialValues={initialValues} */
                initialValues={initialValues}
                onSubmit={async (values) => {
                    await save(values, values.id)
                        .then(() => {
                            const msgShow = !values.id ? 'realizado' : "alterado";
                            showSucesso(`Cadastro ${msgShow} com sucesso!.`)
                            navigate(prefixUrl);
                        })
                        .catch(showError);
                }}
            >
                {() => (
                    <FormOne>
                        <GroupOne
                            label="Nome do produto"
                            name="nome"
                            required
                            md={7}
                            xl={5}
                        />
                        <GroupOne
                            label="Código interno"
                            name="nome"
                            required
                            md={5}
                            xl={4}
                        />
                        <GroupSelectOne
                            label="Status"
                            name="sexo"
                            data={[
                                { value: true, name: "Habilitada" },
                                { value: false, name: "Desabilitada" },
                            ]}
                            md={12}
                            xl={3}
                        />
                        <GroupOne
                            label="Valor de venda"
                            name="nome"
                            required
                            md={4}
                        />
                        <GroupOne
                            label="Valor promoção"
                            name="nome"
                            md={4}
                        />
                        <GroupSelectOne
                            label="Promoção ativa"
                            name="sexo"
                            data={[
                                { value: true, name: "Ativa" },
                                { value: false, name: "Inativa" },
                            ]}
                            md={4}
                        />
                        <GroupOne
                            label="Estoque atual"
                            name="nome"
                            md={4}
                        />
                        <GroupOne
                            label="Estoque mínimo"
                            name="nome"
                            md={4}
                            disabled
                        />
                        <GroupOne
                            label="Quant. min. venda"
                            name="nome"
                            md={4}
                            disabled
                        />
                        <GroupOne
                            label="Imagem principal"
                            name="nome"
                            type="file"
                            required
                            xs={12}
                        />
                        <GroupOne
                            label="Imagem 1"
                            name="nome"
                            xs={12}
                        />
                        <GroupOne
                            label="Imagem 2"
                            name="nome"
                            xs={12}
                        />
                        <GroupOne
                            label="Imagem 3"
                            name="nome"
                            xs={12}
                        />
                        <GroupOne
                            label="Imagem 4"
                            name="nome"
                            xs={12}
                        />
                    </FormOne>
                )}
            </Formik>
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