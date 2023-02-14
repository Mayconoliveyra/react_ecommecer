import Head from "next/head";
import { ChevronRight, CardImage, Cash, Boxes, Check, X } from "react-bootstrap-icons"
import Link from "next/link"
import Alert from 'react-bootstrap/Alert';
import { useState } from "react";
import { Formik } from "formik";

import { TitleOne } from "../../../../../components/portal/titulo/components"
import { FormOne, GroupOne, GroupSelectOne, TitleFormOne, RowBtns } from "../../../../../components/portal/form/components";
import { ButtonVerde, ButtonVermelho } from "../../../../../components/portal/button/components"

import { getAllPortal } from "../../../../api/portal/produtos";
import { moneyMask } from "../../../../../../masks"


export default function Adicionar({ data }) {
    const [alert1, setAlert1] = useState(true);
    const [alert2, setAlert2] = useState(true);
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
                        {alert1 &&
                            <Alert variant="warning" onClose={() => setAlert1(false)} dismissible >
                                Os campos marcados com <span className="text-danger"><b>*</b></span> são de preenchimento obrigatório.
                            </Alert>
                        }
                        <GroupOne
                            label="Nome do produto"
                            name="name"
                            required
                            md={7}
                            xl={5}
                        />
                        <GroupOne
                            label="Código interno"
                            name="codigo_interno"
                            required
                            md={5}
                            xl={4}
                        />
                        <GroupSelectOne
                            label="Produto ativo"
                            name="disabled"
                            data={[
                                { value: true, name: "Sim" },
                                { value: false, name: "Não" },
                            ]}
                            md={12}
                            xl={3}
                        />
                        <TitleFormOne>
                            <Cash size={19} />
                            <h4>Valores e Promoções</h4>
                        </TitleFormOne>
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
                                { value: true, name: "Sim" },
                                { value: false, name: "Não" },
                            ]}
                            md={4}
                        />
                        <TitleFormOne>
                            <Boxes size={19} />
                            <h4>Controle de estoque</h4>
                        </TitleFormOne>
                        <GroupOne
                            label="Estoque atual"
                            name="nome"
                            md={3}
                        />
                        <GroupOne
                            label="Estoque mínimo"
                            name="nome"
                            md={3}
                            disabled
                        />
                        <GroupOne
                            label="Quant. min. venda"
                            name="nome"
                            md={3}
                            disabled
                        />
                        <GroupSelectOne
                            label="Controlar estoque"
                            name="sexo"
                            data={[
                                { value: true, name: "Sim" },
                                { value: false, name: "Não" },
                            ]}
                            md={3}
                        />
                        <TitleFormOne>
                            <CardImage size={19} />
                            <h4>Imagens</h4>
                        </TitleFormOne>
                        {alert2 &&
                            <Alert variant="info " onClose={() => setAlert2(false)} dismissible >
                                As imagens devem ser preenchidas com o endereço URL. Se tiver duvidas de como fazer isso acesse <b>Softconnect.com</b>
                            </Alert>
                        }
                        <GroupOne
                            label="Imagem principal"
                            name="nome"
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

                        <RowBtns>
                            <ButtonVerde margin="0 7px 0 0">
                                <button><Check size={23} /> Cadastrar</button>
                            </ButtonVerde>
                            <ButtonVermelho>
                                <button><X size={23} /> Cancelar</button>
                            </ButtonVermelho>
                        </RowBtns>
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