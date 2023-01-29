import Head from 'next/head';
import Link from 'next/link';
import { ChevronLeft } from "react-bootstrap-icons";
import styled from "styled-components"
import { getSession } from "next-auth/react";
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import router from "next/router"
import * as Yup from "yup";
import { pt } from "yup-locale-pt";
Yup.setLocale(pt);

import { Content, ContentHeader } from "../../../components/containe"
import { Group } from '../../../components/input';

import { proneMask, cepMask } from '../../../../masks';
import { store as saveUser } from '../../api/auth';

const BtnConfirmSC = styled.div`
    [data='button-submit']{
        padding: 0.7rem 1rem;
        display: flex;
        button{   
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 0;
            font-size: 1.2rem;
            flex: 1;
            background: #FFD814;
            border-color: #FCD200;
            border-radius: 0.45rem;
            color: #0F1111;

            &:disabled{
                cursor: default;
            }
        }
    }
`

export default function Address({ session }) {
    const scheme = Yup.object().shape({
        contato: Yup.string().nullable().label("Contato").required().length(15, "É necessário informar o número completo no formato (99) 99999-9999"),
        cep: Yup.string().nullable().label("CEP").required().length(9, "É necessário informar um CEP completo."),
        numero: Yup.string().nullable().label("Número da residência"),
        complemento: Yup.string().nullable().label("Complemento(opcional)"),
    });

    return (
        <>
            <Head>
                <title>Endereço de entrega</title>
            </Head>
            <Content maxwidth="40rem" padding="0" bgWhite>
                <ContentHeader bgGray padding="1.3rem 0.5rem">
                    <Link href="/">
                        <ChevronLeft data="icon-left" />
                        <h2 data="h1-title">
                            Meu endereço
                        </h2>
                    </Link>
                </ContentHeader>
                <Content padding="0.5rem 1rem" noShadow>
                    <Formik
                        validationSchema={scheme}
                        initialValues={session}
                        onSubmit={async (values, setValues) => {
                            await saveUser(values, session)
                                .then(() => {
                                    router.reload()
                                })
                                .catch((res) => {
                                    /* Se for erro 400, significa que a exibição foi tratada */
                                    if (res && res.response && res.response.status == 400) {
                                        if (res.response.data[400]) {
                                            toast.error(res.response.data[400])
                                        }
                                        setValues.setErrors(res.response.data)
                                        return
                                    }
                                    toast.error("Ops... Não possível realizar a operação. Por favor, tente novamente.")
                                })
                        }}
                    >
                        {({ errors, touched, dirty, initialValues, values }) => (
                            <Form data="form" action="">
                                <Group
                                    error={!!errors.contato && touched.contato}
                                    label="Contato"
                                    name="contato"
                                    placeholder="Exemplo: (99) 99999-9999"
                                    autocomplete="on"
                                    mask={proneMask}
                                />
                                <Group
                                    error={!!errors.cep && touched.cep}
                                    label="CEP"
                                    name="cep"
                                    placeholder="Exemplo: 99999-999"
                                    autocomplete="on"
                                    mask={cepMask}
                                />
                                {(values.cep && initialValues.cep == values.cep) && <Group
                                    label="Endereço"
                                    name="logradouro"
                                    disabled
                                />}
                                <Group
                                    label="Número da residência(opcional)"
                                    name="numero"
                                    placeholder="Exemplo: 999"
                                    maxLength={55}
                                />
                                <Group
                                    label="Complemento(opcional)"
                                    name="complemento"
                                    placeholder="Exemplo: Apto 999 - Bloco 9"
                                    maxLength={55}
                                />
                                {(values.cep && initialValues.cep == values.cep) && <Group
                                    label="Bairro"
                                    name="bairro"
                                    disabled
                                />}
                                {(values.cep && initialValues.cep == values.cep) && <Group
                                    label="Cidade"
                                    name="localidade"
                                    disabled
                                />}
                                {(values.cep && initialValues.cep == values.cep) && < Group
                                    label="Estado"
                                    name="uf"
                                    disabled
                                />}

                                <BtnConfirmSC>
                                    <div data='button-submit'>
                                        <button disabled={!dirty} type="submit">
                                            Atualizar
                                        </button>
                                    </div>
                                </BtnConfirmSC>
                            </Form>
                        )}
                    </Formik>
                </Content>
            </Content>
        </>
    )
}

export async function getServerSideProps({ req }) {
    const session = await getSession({ req })
    if (!session || !session.id) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }

    return {
        props: { session },
    }
}