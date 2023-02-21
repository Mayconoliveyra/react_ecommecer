import Head from "next/head";
import Link from "next/link"
import router from "next/router"
import { ChevronRight, CardImage, Cash, Boxes, Check, X } from "react-bootstrap-icons"
import Alert from 'react-bootstrap/Alert';
import { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { pt } from "yup-locale-pt";
Yup.setLocale(pt);
import { getSession } from "next-auth/react";

import { TitleOne } from "../../../../../components/portal/titulo/components"
import { FormOne, GroupOne, GroupMoney, GroupSelectOne, TitleFormOne, RowBtns } from "../../../../../components/portal/form/components";
import { ButtonVerde, ButtonVermelho } from "../../../../../components/portal/button/components"

import { saveProdutoPortal } from "../../../../api/portal/produtos";
import { FormatObjNull } from "../../../../../../global"
import { toast } from "react-toastify";


export default function Adicionar({ session }) {
    const prefix = "produto"
    const prefixRouter = "/portal/cadastros/produtos"

    const [alert1, setAlert1] = useState(true);
    const [alert2, setAlert2] = useState(true);
    const initialValues = {
        nome: "",
        codigo_interno: "",
        produto_ativo: "Sim",
        estoque_atual: "",
        estoque_minimo: "",
        estoque_qtd_minima: "",
        estoque_controle: "Não",
        url_img: "",
        img_1: "",
        img_2: "",
        img_3: "",
        img_4: "",
        preco: "",
        preco_promocao: "",
        promocao_ativa: "Não"
    }
    const scheme = Yup.object().shape({
        nome: Yup.string().label("Nome do produto").nullable().required().trim(),
        codigo_interno: Yup.string().label("Código interno").nullable().required().trim(),
        produto_ativo: Yup.string().label("Produto ativo").required(),
        estoque_controle: Yup.string().label("Controlar estoque").required(),
        estoque_atual: Yup.string().nullable().when("estoque_controle", {
            is: "Sim",
            then: Yup.string().label("Estoque atual").nullable().min(0).required()
        }),
        estoque_minimo: Yup.string().nullable().when("estoque_controle", {
            is: "Sim",
            then: Yup.string().label("Estoque mínimo").nullable().min(0).required()
        }),
        estoque_qtd_minima: Yup.string().nullable().when("estoque_controle", {
            is: "Sim",
            then: Yup.string().label("Quant. min. venda").nullable().min(0).required()
        }),

        url_img: Yup.string().label("Imagem principal").nullable().required().trim(),
        img_1: Yup.string().label("Imagem 1").nullable().optional(),
        img_2: Yup.string().label("Imagem 2").nullable().optional(),
        img_3: Yup.string().label("Imagem 3").nullable().optional(),
        img_4: Yup.string().label("Imagem 4").nullable().optional(),
        preco: Yup.number().label("Valor de venda").nullable().required().min(0.01, "Valor de venda deve ser informado"),
        promocao_ativa: Yup.string().label("Promoção ativa").required(),
        preco_promocao: Yup.string().nullable().when("promocao_ativa", {
            is: "Sim",
            then: Yup.string().label("Valor promoção").nullable().min(0).required()
        }),
    });
    return (
        <>
            <Head>
                <title>{`Softconnect - Adicionar ${prefix}`}</title>
            </Head>
            <TitleOne title={`Adicionar ${prefix}`}>
                <li>
                    <Link href="/portal">Início <ChevronRight height={10} /></Link>
                </li>
                <li>
                    <Link href={prefixRouter}>{`${prefix[0].toUpperCase() + prefix.substring(1)}s`} <ChevronRight height={10} /></Link>
                </li>
                <li data="ativo">
                    Adicionar
                </li>
            </TitleOne>
            <Formik
                validationSchema={scheme}
                initialValues={initialValues}
                onSubmit={async (values, setValues) => {
                    const valuesFormat = FormatObjNull(values)
                    await saveProdutoPortal({ data: valuesFormat, session: session })
                        .then(() => router.push(prefixRouter))
                        .catch((res) => {
                            /* Se status 400, significa que o erro foi tratado. */
                            if (res && res.response && res.response.status == 400) {
                                /* Se data.erro=500, será exibido no toast */
                                if (res.response.data && res.response.data[500]) {
                                    toast.error(res.response.data[500])
                                } else {
                                    setValues.setErrors(res.response.data)
                                }
                            } else {
                                /* Mensagem padrão */
                                toast.error("Ops... Não possível realizar a operação. Por favor, tente novamente.")
                            }
                        })
                }}
            >
                {({ errors, touched, values, setFieldValue }) => (
                    <FormOne>
                        {alert1 &&
                            <Alert variant="warning" onClose={() => setAlert1(false)} dismissible >
                                Os campos marcados com <span className="text-danger"><b>*</b></span> são de preenchimento obrigatório.
                            </Alert>
                        }
                        <GroupOne
                            error={!!errors.nome && touched.nome}
                            label="Nome do produto"
                            name="nome"
                            maxlength={120}
                            md={7}
                            xl={5}
                        />
                        <GroupOne
                            error={!!errors.codigo_interno && touched.codigo_interno}
                            label="Código interno"
                            name="codigo_interno"
                            maxlength={120}
                            md={5}
                            xl={4}
                        />
                        <GroupSelectOne
                            label="Produto ativo"
                            name="produto_ativo"
                            data={[
                                { value: "Sim", name: "Sim" },
                                { value: "Não", name: "Não" },
                            ]}
                            md={12}
                            xl={3}
                        />
                        <TitleFormOne>
                            <Cash size={19} />
                            <h4>Valores e Promoções</h4>
                        </TitleFormOne>
                        <GroupMoney
                            error={!!errors.preco && touched.preco}
                            label="Valor de venda"
                            name="preco"
                            placeholder=""
                            setFieldValue={setFieldValue}
                            md={4}
                        />
                        <GroupMoney
                            error={!!errors.preco_promocao && touched.preco_promocao}
                            label="Valor promoção"
                            name="preco_promocao"
                            placeholder=""
                            setFieldValue={setFieldValue}
                            disabled={values.promocao_ativa == "Não"}
                            md={4}
                        />
                        <GroupSelectOne
                            label="Promoção ativa"
                            name="promocao_ativa"
                            data={[
                                { value: "Sim", name: "Sim" },
                                { value: "Não", name: "Não" },
                            ]}
                            md={4}
                        />
                        <TitleFormOne>
                            <Boxes size={19} />
                            <h4>Controle de estoque</h4>
                        </TitleFormOne>
                        <GroupMoney
                            error={!!errors.estoque_atual && touched.estoque_atual}
                            label="Estoque atual"
                            name="estoque_atual"
                            setFieldValue={setFieldValue}
                            fixed={0}
                            placeholder=""
                            disabled={values.estoque_controle == "Não"}
                            md={3}
                        />
                        <GroupMoney
                            error={!!errors.estoque_minimo && touched.estoque_minimo}
                            label="Estoque mínimo"
                            name="estoque_minimo"
                            setFieldValue={setFieldValue}
                            fixed={0}
                            placeholder=""
                            disabled={values.estoque_controle == "Não"}
                            md={3}
                        />
                        <GroupMoney
                            error={!!errors.estoque_qtd_minima && touched.estoque_qtd_minima}
                            label="Quant. min. venda"
                            name="estoque_qtd_minima"
                            setFieldValue={setFieldValue}
                            fixed={0}
                            placeholder=""
                            disabled={values.estoque_controle == "Não"}
                            md={3}
                        />
                        <GroupSelectOne
                            label="Controlar estoque"
                            name="estoque_controle"
                            data={[
                                { value: "Sim", name: "Sim" },
                                { value: "Não", name: "Não" },
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
                            error={!!errors.url_img && touched.url_img}
                            label="Imagem principal"
                            name="url_img"
                            maxlength={120}
                            xs={12}
                        />
                        <GroupOne
                            label="Imagem 1"
                            name="img_1"
                            maxlength={120}
                            xs={12}
                        />
                        <GroupOne
                            label="Imagem 2"
                            name="img_2"
                            maxlength={120}
                            xs={12}
                        />
                        <GroupOne
                            label="Imagem 3"
                            name="img_3"
                            maxlength={120}
                            xs={12}
                        />
                        <GroupOne
                            label="Imagem 4"
                            name="img_4"
                            maxlength={120}
                            xs={12}
                        />

                        <RowBtns>
                            <ButtonVerde margin="0 7px 0 0">
                                <button type="submit"><Check size={23} /> Cadastrar</button>
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

export async function getServerSideProps(context) {
    try {
        const { req } = context
        const session = await getSession({ req })
        if (session && session.id && session.email_auth && session.adm) {
            return {
                props: { session },
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