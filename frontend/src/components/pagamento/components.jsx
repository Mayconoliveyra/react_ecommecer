import Link from "next/link"
import styled from "styled-components"
import { CheckCircleFill } from "react-bootstrap-icons";

import { ButtonSC } from "../button";

const HeaderSC = styled.div`
    [data="icone-msg"]{
            padding-bottom: 1rem;
            display: flex;
            align-items: center;
        svg{
            font-size: 1.9rem;
            margin-right: 0.6rem;
            color: #067d62;
        }
        h1{
            font-size: 1.5rem;
            color: #067d62;
            font-family: ${({ theme }) => theme.font.family.bold};
        }
    };
    [data="msg-obs"]{
        p{
            font-family: ${({ theme }) => theme.font.family.medium};
            word-break: break-word;
            font-size: 1.1rem;
        }
        a{
            font-size: 1.1rem;
            text-decoration: underline;
            color: #0066c0;
        }
    }
`
const NumberOrderSC = styled.div`
    margin: 1.7rem 0;
    border: 0.1rem solid #e7e7e7;
    background-color: #fafafb;
    padding: 3rem 1rem;
    display: flex;
    flex-direction: column;
    align-items:center;
    p{
        font-size: 1.3rem;
        line-height: 1rem;
        color: #565c69;
        margin-bottom: 0.5rem;
    }
    div{
        strong{
            font-size: 1.7rem;
            line-height: 2.125rem;
            color: #42464d;
            margin-left: 0.75rem;
            font-family: ${({ theme }) => theme.font.family.bold}
        }
    }
`
const MsgNotificationSC = styled.div`
    margin-top: 0.6rem;
    border-bottom: 3px solid #d5dbdb;
    padding:  1.3rem 0;
    p{
        word-break: break-word;
        font-size: 1.1rem;
    }
    a{
        font-size: 1.1rem;
        text-decoration: underline;
        color: #0066c0;
    }
`
const BtnsSC = styled.div`
    [data='btn-confirm-bord-laran'],
    [data='btn-confirm-noborder'] {
        padding: 0.5rem 0;
    }
`
const Header = ({ title = "Pedido realizado com sucesso!", sub = "Estamos processando seu pedido." }) => {
    return (
        <HeaderSC>
            <div data="icone-msg">
                <CheckCircleFill />
                <h1>
                    {title}
                </h1>
            </div>
            <div data="msg-obs">
                <p>
                    {sub}
                </p>
            </div>
        </HeaderSC>
    )
}
const NumberOrder = ({ id }) => {
    return (
        <NumberOrderSC>
            <p>
                O número do seu pedido é:
            </p>
            <div>
                <strong>
                    {Number(id).toLocaleString('en-US', {
                        minimumIntegerDigits: 6,
                        useGrouping: false
                    })}
                </strong>
            </div>
        </NumberOrderSC>
    )
}
const MsgNotification = () => {
    return (
        <MsgNotificationSC>
            <p>
                Iremos te notificar via <b>E-mail</b> e <b>WhatsApp</b> sempre que houver mudança no status do seu pedido. Você tambêm pode acompanhar os seus pedidos acessando <Link href="/conta/meuspedidos">Meus Pedidos</Link>
            </p>
        </MsgNotificationSC>
    )
}
const Btns = () => {
    return (
        <BtnsSC>
            <ButtonSC>
                <div data='btn-confirm-noborder'>
                    <Link href="/">
                        Continuar comprando
                    </Link>
                </div>
            </ButtonSC>
            <ButtonSC>
                <div data='btn-confirm-bord-laran'>
                    <Link href="/conta/meuspedidos">
                        Ver meus pedidos
                    </Link>
                </div>
            </ButtonSC>
        </BtnsSC>
    )
}


export { Header, NumberOrder, MsgNotification, Btns }