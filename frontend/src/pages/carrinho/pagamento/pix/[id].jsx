import { getSession } from "next-auth/react"
import Image from "next/image";
import moment from "moment"
import moment from "moment"
import 'moment/locale/pt-br'
moment.locale('pt-br')
import Head from 'next/head';
import styled from "styled-components"
import { ButtonSC } from "../../../../components/button";

import { Header, NumberOrder, MsgNotification, Btns } from "../../../../components/pagamento/components"

import { userIsAuth } from "../../../api/auth";
import { storePixPgt } from "../../../api/cart";
import { moneyMask } from "../../../../../masks";
import { useState } from "react";

const MainSC = styled.div`
    max-width: ${({ theme }) => theme.width.medium};
    margin: 0 auto;
    display:  flex;
    flex-direction: column;
    padding: 1rem;
`
const PixSC = styled.div`
    margin-top: 1rem;
    border-radius: 0.6rem;
    border-top-right-radius: 0.6rem;
    border-bottom-right-radius: 0.6rem;
    padding: 1px 1px 1px 13px;
    background-color: #2EBDAE;
    border: solid 1px #2FBAAD;
    [data="pix"] {
        padding: 15px 20px;
        border: solid 1px #2FBAAD;
        border-radius: 8px;
        border-top-left-radius:0;
        border-bottom-left-radius:0;
        background-color: #fff;
        [data="header"]{
            div {
                margin-bottom: 1.6rem;
                p{
                    font-size: 1.1rem;
                    font-family:${({ theme }) => theme.font.family.bold};
                    margin: 0 0 1rem 0;
                    }
                    span{
                    font-size: 1.1rem;
                }
            }
        }
        [data="img-qrcode"]{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        [data="pix-chave"]{
            div {
                word-break: break-word;
                margin-bottom: 1.6rem;
                [data="chave-copia"]{
                    word-break: break-all;
                }
                p{
                    font-size: 1.1rem;
                    font-family:${({ theme }) => theme.font.family.bold};
                    margin: 0 0 1rem 0;
                    }
                    span{
                    font-size: 1rem;
                }
                li{
                    font-size: 1rem;
                    padding: 3px 0;
                }
            }
        }
    }
`
export default function PixPayment({ id, payment }) {
    const [textCopia, setTextCopia] = useState("Copiar código Pix")
    const dataFormat = (date) => {
        return `${moment(date).calendar(null, {
            sameDay: '[Hoje]',
            nextDay: '[Amanhã]',
        })}, ${moment(date, "YYYY-MM-DD hh:mm").format("HH:mm")} - Horário de Brasília`;
    }
    const copiarQrcode = () => {
        //Cria um elemento input
        const inputTemp = document.createElement("input");
        inputTemp.value = payment.pix_qrcode;
        //Anexa o elemento ao body
        document.body.appendChild(inputTemp);
        //seleciona todo o texto do elemento
        inputTemp.select();
        //executa o comando copy
        //aqui é feito o ato de copiar para a area de trabalho com base na seleção
        document.execCommand("copy");
        //remove o elemento
        document.body.removeChild(inputTemp);
        setTextCopia("Copiado")
        setTimeout(() => {
            setTextCopia("Copiar código Pix")
        }, 1500)
    }
    return (
        <>
            <Head>
                <title>Conclusão de compra</title>
            </Head>
            <div>
                <MainSC>
                    <Header title="Seu pedido foi reservado." sub="Pague em até 30 minutos para processarmos seu pedido." />
                    <PixSC>
                        <div data="pix">
                            <div data="header">
                                <div>
                                    <p>Vencimento</p>
                                    <span>{dataFormat(payment.pix_expiracao)}</span>
                                </div>
                                <div>
                                    <p>Valor do pedido</p>
                                    <span>{moneyMask(payment.vlr_pago)}</span>
                                </div>
                            </div>
                            <div data="img-qrcode">
                                <Image src={payment.pix_img_qrcode} width={300} height={300} alt="qr-code" quality={100} priority={true} />
                            </div>
                            <div data="pix-chave">
                                <div>
                                    <div data="chave-copia">
                                        <p>Em caso de erro copie o Código abaixo:</p>
                                        <span>{payment.pix_qrcode}</span>
                                    </div>
                                    <ButtonSC>
                                        <div data='btn-confirm-white'>
                                            <button onClick={() => copiarQrcode()}>
                                                {textCopia}
                                            </button>
                                        </div>
                                    </ButtonSC>
                                    <p>
                                        Informações importantes sobre o pagamento
                                    </p>
                                    <span>
                                        Você pode consultar o QR code e o Código em Seus Pedidos durante esse período.
                                    </span>
                                    <p></p>
                                    <span>
                                        Após finalizar o pedido, realize o pagamento em até 30 minutos. Caso contrário, o pedido será cancelado e um novo deverá ser feito. Lembre-se que Ofertas podem ter expirado após esse período.
                                    </span>
                                </div>
                                <div>
                                    <p>
                                        Como pagar com Pix
                                    </p>
                                    <ol>
                                        <li>
                                            1. <span>Entre no aplicativo da sua instituição financeira e acesse o ambiente Pix;</span>
                                        </li>
                                        <li>2. Escolha a opção de Copiar e Colar o código Pix;</li>
                                        <li>3. Cole o código Pix;</li>
                                        <li>4. Confirme as informações e confirme o pagamento.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </PixSC>
                    <NumberOrder id={id} />
                    <MsgNotification />
                    <Btns />
                </MainSC>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    /* SESSSÃO USUARIO LOGADO */
    const req = context.req
    const session = await getSession({ req })
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }
    const userAuth = await userIsAuth(session)
    if (!userAuth) {
        return {
            redirect: {
                destination: "/conta/meusdados",
                permanent: false
            }
        }
    }
    /* /FIM VALIDAÇÃO SESSION/ */

    try {
        const { id } = context.params; /* id do pedido; */
        const payment = await storePixPgt(id, session.id, session)
        /* Se id ou pagamento tiver nulo, redireciona para home. */
        if (!id || !payment) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false
                }
            }
        }

        return {
            props: { id: id, payment: payment },
        }
    } catch (error) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
}