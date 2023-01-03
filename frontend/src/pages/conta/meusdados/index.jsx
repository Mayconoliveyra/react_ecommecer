import Head from 'next/head';
import styled from "styled-components"
import MaskedInput from "react-text-mask";
import { getSession } from "next-auth/react"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { pt } from "yup-locale-pt";
Yup.setLocale(pt);

import { proneMask, cepMask } from '../../../../masks';
import { store } from '../../api/auth';

const MyDataSC = styled.div`
    max-width: 35rem;
    margin: 0 auto;
`
const SeusDadosSC = styled.div`
    margin: 0.5rem 0;
    padding: 0 0.3rem;
    >div{
        color: #0F1111;
        [data="h4-title"]{
            border-radius: 0.3rem 0.3rem 0 0;
            border: 1px #D5D9D9 solid;
            padding: 0.6rem 1.5rem;
            h4{
                color: #0F1111;
                font-size: 2rem;
                font-family:${({ theme }) => theme.font.family.bold};
                margin: 0px;
                padding: 0px;
            }
        }
        [data="form"]{
            border: 1px #D5D9D9 solid;
            border-radius: 0 0 0.8rem 0.8rem;
            padding: 0.3rem 0.7rem;
        }
    }
`
const GroupSC = styled.div`
  display:flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  [data="label"]{
    padding: 0.4rem;
    label{
      font-family:${({ theme }) => theme.font.family.bold};
      font-size: 1.4em;
    }
    
  }
  [data="input"]{
    border-top-color: #949494;
    border: 0.1rem solid #a6a6a6;
    box-shadow: 0 0.1rem 0 rgb(0 0 0 / 7%) inset;
    border-radius: 0.2rem;
    border-right-color: #949494;
    border-bottom-color: #949494;
    border-left-color: #949494;
    border-color:${({ error }) => error && "#d00"};
    box-shadow:${({ error }) => error && "0 0 0 0.2rem rgb(221 0 0 / 15%) inset;"};
    input{
      width: 100%;
      background-color: transparent;
      padding: 0.8rem;
      padding-top: 0.9rem;
      box-shadow: none;
      border: 0;
      font-size: 1.1rem;
      &:disabled{
        cursor: default;
        background: #d3d3d3;
      }
    }
    [data="show-password"]{
      width: 100%;
      padding: 0 10px 6px 10px;
      span{
        color: #555!important;
        font-size: 0.9rem !important;
      }
    }
  }
  [data="error"]{
        font-size: 1rem;
        color: #e72626;
        margin-top: 0.0rem;
        small{
            padding: 0px;
            margin: 0px;
        }
    }
`
const BtnConfirmSC = styled.div`
    [data='button-submit']{
        padding: 0.7rem 1rem;
        border-top: 0.1rem solid #e7e7e7;
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
        }
    }
`

export default function MyData({ session }) {
    const scheme = Yup.object().shape({
        nome: Yup.string().nullable().label("Nome").required(),
        email: Yup.string().nullable().label("E-mail").required(),
        contato: Yup.string().nullable().label("Contato").required().length(14, "É necessário informar um número completo."),
        cep: Yup.string().nullable().label("CEP").required().length(9, "É necessário informar um CEP completo."),
    });

    return (
        <>
            <Head>
                <title>Seus dados</title>
            </Head>
            <MyDataSC>
                <SeusDadosSC>
                    <div>
                        <div data="h4-title">
                            <h4>Seus dados</h4>
                        </div>
                        <Formik
                            validationSchema={scheme}
                            initialValues={session}
                            onSubmit={async (values) => {
                                console.log(values)
                                await store(values)
                            }}
                        >
                            {({ errors }) => (
                                <Form data="form" action="">
                                    <GroupSC error={!!errors.nome}>
                                        <div data="label">
                                            <label htmlFor="nome">Nome completo</label>
                                        </div>
                                        <div data="input">
                                            <Field name="nome" maxLength="55" type="text" autoComplete="on" />
                                        </div>
                                        <div data="error">
                                            <small>
                                                <ErrorMessage name="nome" />
                                            </small>
                                        </div>
                                    </GroupSC>
                                    <GroupSC error={!!errors.email}>
                                        <div data="label">
                                            <label htmlFor="email">E-mail</label>
                                        </div>
                                        <div data="input">
                                            <Field name="email" disabled type="text" autoComplete="on" />
                                        </div>
                                        <div data="error">
                                            <small>
                                                <ErrorMessage name="email" />
                                            </small>
                                        </div>
                                    </GroupSC>
                                    <GroupSC error={!!errors.contato}>
                                        <div data="label">
                                            <label htmlFor="contato">Contato</label>
                                        </div>
                                        <div data="input">
                                            <Field name="contato">
                                                {({ field }) => (
                                                    <MaskedInput
                                                        {...field}
                                                        id="contato"
                                                        type="text"
                                                        autoComplete="on"
                                                        mask={proneMask}
                                                        guide={false}
                                                        showMask={false}
                                                        value={field.value}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div data="error">
                                            <small>
                                                <ErrorMessage name="contato" />
                                            </small>
                                        </div>
                                    </GroupSC>
                                    <GroupSC error={!!errors.cep}>
                                        <div data="label">
                                            <label htmlFor="cep">CEP</label>
                                        </div>
                                        <div data="input">
                                            <Field name="cep">
                                                {({ field }) => (
                                                    <MaskedInput
                                                        {...field}
                                                        id="cep"
                                                        type="text"
                                                        autoComplete="on"
                                                        mask={cepMask}
                                                        guide={false}
                                                        showMask={false}
                                                        value={field.value}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div data="error">
                                            <small>
                                                <ErrorMessage name="cep" />
                                            </small>
                                        </div>
                                    </GroupSC>

                                    <BtnConfirmSC>
                                        <div data='button-submit'>
                                            <button type="submit">
                                                Salvar
                                            </button>
                                        </div>
                                    </BtnConfirmSC>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </SeusDadosSC>
            </MyDataSC>
        </>
    )
}

export async function getServerSideProps({ req }) {
    const session = await getSession({ req })

    /* se session ou session.id não existir, redirecionada para tela de login */
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