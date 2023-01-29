import Head from 'next/head';
import Link from 'next/link';
import { ChevronLeft } from "react-bootstrap-icons";
import { getSession } from "next-auth/react";
import router from "next/router"
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { pt } from "yup-locale-pt";
Yup.setLocale(pt);

import { Content, ContentHeader } from "../../../components/containe"
import { ButtonYellow } from "../../../components/button"
import { Group } from '../../../components/input';

import { proneMask, cepMask, cpfMask } from '../../../../masks';
import { store as saveUser } from '../../api/auth';

export default function MyData({ session }) {
    const scheme = Yup.object().shape({
        nome: Yup.string().nullable().label("Nome").required(),
        cpf: Yup.string().nullable().label("CPF").required().length(14, "É necessário informar um CPF válido."),
        email: Yup.string().nullable().label("E-mail").required(),
        contato: Yup.string().nullable().label("Contato").required().length(15, "É necessário informar o número completo no formato (99) 99999-9999"),
        cep: Yup.string().nullable().label("CEP").required().length(9, "É necessário informar um CEP completo."),
    });

    return (
        <>
            <Head>
                <title>Seus dados</title>
            </Head>
            <Content maxwidth="40rem" padding="0" bgWhite>
                <ContentHeader bgGray padding="1.3rem 0.5rem">
                    <Link href="/">
                        <ChevronLeft data="icon-left" />
                        <h1 data="h1-title">
                            Meus dados
                        </h1>
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
                                    toast.error(
                                        "Ops... Não possível realizar a operação. Por favor, tente novamente."
                                    )
                                })
                        }}
                    >
                        {({ errors, touched, dirty }) => (
                            <Form data="form" action="">
                                <Group
                                    error={!!errors.nome && touched.nome}
                                    label="Nome completo"
                                    name="nome"
                                    placeholder="Exemplo: Jhon Doe"
                                    maxLength={55}
                                />
                                <Group
                                    error={!!errors.cpf && touched.cpf}
                                    label="CPF"
                                    name="cpf"
                                    placeholder="Exemplo: 999.999.999-99"
                                    autocomplete="on"
                                    mask={cpfMask}
                                />
                                <Group
                                    label="E-mail"
                                    name="email"
                                    disabled
                                />
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

                                <ButtonYellow margin="1.5rem 0">
                                    <button disabled={!dirty} type="submit">
                                        Atualizar
                                    </button>
                                </ButtonYellow>
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