import Head from 'next/head';
import styled from "styled-components"
import MaskedInput from "react-text-mask";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { pt } from "yup-locale-pt";
Yup.setLocale(pt);

import { proneMask, cepMask } from '../../../../masks';

const AddressSC = styled.div`
    max-width: 35rem;
    margin: 0 auto;
`
const EnderecoSC = styled.div`
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
    input{
      width: 100%;
      background-color: transparent;
      padding: 0.8rem;
      padding-top: 0.9rem;
      box-shadow: none;
      border: 0;
      font-size: 1.1rem;
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
`

export default function Address() {
    const initialValues = {
        contato: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        localidade: '',
        uf: '',
    }
    const scheme = Yup.object().shape({
        contato: Yup.string().label("Contato").required().length(14, "É necessário informar um número completo."),
        cep: Yup.string().label("CEP").required().length(9, "É necessário informar um CEP completo."),
        logradouro: Yup.string().label("Endereço").required(),
        numero: Yup.string().label("Número da residência").required(),
        complemento: Yup.string().label("Complemento(opcional)").required(),
        bairro: Yup.string().label("Bairro").required(),
        localidade: Yup.string().label("Cidade").required(),
        uf: Yup.string().label("Estado").required()
    });

    return (
        <>
            <Head>
                <title>Endereço de entrega</title>
            </Head>
            <AddressSC>
                <EnderecoSC>
                    <div>
                        <div data="h4-title">
                            <h4>Seu endereço</h4>
                        </div>
                        <Formik
                            validateOnMount
                            validationSchema={scheme}
                            initialValues={initialValues}
                            onSubmit={async (values) => {
                                console.log(values)
                            }}
                        >
                            {props => (
                                <Form data="form" action="">
                                    <GroupSC>
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
                                    <GroupSC>
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
                                    <GroupSC>
                                        <div data="label">
                                            <label htmlFor="logradouro">Endereço</label>
                                        </div>
                                        <div data="input">
                                            <Field name="logradouro" type="text" maxLength="100" />
                                        </div>
                                        <div data="error">
                                            <small>
                                                <ErrorMessage name="logradouro" />
                                            </small>
                                        </div>
                                    </GroupSC>
                                    <GroupSC>
                                        <div data="label">
                                            <label htmlFor="numero">Número da residência</label>
                                        </div>
                                        <div data="input">
                                            <Field name="numero" type="text" maxLength="55" />
                                        </div>
                                        <div data="error">
                                            <small>
                                                <ErrorMessage name="numero" />
                                            </small>
                                        </div>
                                    </GroupSC>
                                    <GroupSC>
                                        <div data="label">
                                            <label htmlFor="complemento">Complemento(opcional)</label>
                                        </div>
                                        <div data="input">
                                            <Field name="complemento" type="text" maxLength="55" />
                                        </div>
                                        <div data="error">
                                            <small>
                                                <ErrorMessage name="complemento" />
                                            </small>
                                        </div>
                                    </GroupSC>
                                    <GroupSC>
                                        <div data="label">
                                            <label htmlFor="bairro">Bairro</label>
                                        </div>
                                        <div data="input">
                                            <Field name="bairro" type="text" maxLength="55" />
                                        </div>
                                        <div data="error">
                                            <small>
                                                <ErrorMessage name="bairro" />
                                            </small>
                                        </div>
                                    </GroupSC>
                                    <GroupSC>
                                        <div data="label">
                                            <label htmlFor="localidade">Cidade</label>
                                        </div>
                                        <div data="input">
                                            <Field name="localidade" type="localidade" maxLength="55" />
                                        </div>
                                        <div data="error">
                                            <small>
                                                <ErrorMessage name="localidade" />
                                            </small>
                                        </div>
                                    </GroupSC>
                                    <GroupSC>
                                        <div data="label">
                                            <label htmlFor="uf">Estado</label>
                                        </div>
                                        <div data="input">
                                            <Field name="uf" type="uf" maxLength="2" />
                                        </div>
                                        <div data="error">
                                            <small>
                                                <ErrorMessage name="uf" />
                                            </small>
                                        </div>
                                    </GroupSC>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </EnderecoSC>
            </AddressSC>
        </>
    )
}