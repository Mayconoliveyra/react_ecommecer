import { useContext } from "react"
import styled from "styled-components"
import { X } from "react-bootstrap-icons"
import Link from "next/link";
import { signOut } from "next-auth/react";
import TemplateContext from "../../../context/template"

const MenuLoginSC = styled.div`
    position: fixed;
    height:100vh;
    width: 100%;
    backdrop-filter: brightness(27%);
    z-index: 999;
    overflow: hidden;
    display: flex;

    flex-wrap: wrap-reverse;
    flex-direction: row-reverse;
    justify-content: flex-end;
    [data="exibir"]{
        overflow-y:scroll;
        height: 100%;
        padding-bottom: 25rem;
        background-color: #fff;
        box-shadow: 4px 0 10px 0 rgb(0 0 0 / 40%);
        width: 22rem;

        [data="x-close"]{
            position: absolute;
            right: 23rem;
            svg{
              color: #f1f3f9;
              font-size: 3.5rem;
            }
        }
        [data="user"]{
            background-color: ${({ theme }) => theme.colors.secondaryColor};
            display: flex;
            height: 65px;
            overflow:hidden;
            white-space: nowrap;
            button{
                background: transparent;
                flex: 1;
                padding: 0px 15px;
                display: flex;
                align-items:center;
                color: #fff;
                font-size: 20px;
            }
        }
        [data="ul-li"]{
            display: flex;
            flex-direction: column;
            li{
                display: flex;
                height: 3rem;
                padding:0px;
                a,button{ 
                    background: transparent;
                    display: flex;
                    align-items:center;
                    padding: 15px 20px;
                    flex:1;
                    font-size: 1.2rem;
                    color: #111;
                }
            }
            li > div {
                display: flex;
                align-items:center;
                padding: 15px 20px;
                font-size: 1.4rem;
                font-family:${({ theme }) => theme.font.family.bold};
            }
            [data="barra"]{
                border-bottom: 5px solid #d5dbdb;
                padding: 0px;
                margin: 0px;
                height: 0px;
                margin: 5px 0 0;
            }
        }
    }
    [data="btn-close"]{
        flex: 1;
        background:transparent;
        z-index: 999;
    }
    `

export default function MenuLogin() {
    const { setTemplate } = useContext(TemplateContext)

    return (
        <MenuLoginSC>
            <div data="exibir">
                <div data='x-close'>
                    <X />
                </div>
                <div data='user'>
                    <button type="button">
                        Sua conta
                    </button>
                </div>
                <ul data="ul-li">
                    <li><Link href="/conta/meusdados">Meus dados</Link></li>
                    <li><Link href="/conta/endereco">Endereço de entrega</Link></li>
                    <li data="barra"></li>
                    <li>
                        <div>
                            Seus Pedidos
                        </div>
                    </li>
                    <li><Link href="/conta/meuspedidos">Meus pedidos</Link></li>
                    <li data="barra"></li>

                    <li><button onClick={() => signOut()}>Sair</button></li>
                </ul>
            </div>

            <button data="btn-close" onClick={() => setTemplate({ showMenu: false, showMenuLogin: false })}>
            </button>
        </MenuLoginSC>
    )
}