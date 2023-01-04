import { useContext } from "react"
import styled from "styled-components"
import { X } from "react-bootstrap-icons"
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PersonCircle, PersonFillGear, ChevronRight } from "react-bootstrap-icons";

import TemplateContext from "../../../context/template"

const MenuSC = styled.div`
    position: fixed;
    height:100vh;
    width: 100%;
    backdrop-filter: brightness(27%);
    z-index: 999;
    overflow: hidden;
    display: flex;
    [data="exibir"]{
        overflow-y:scroll;
        height: 100%;
        padding-bottom: 25rem;
        background-color: #fff;
        box-shadow: 4px 0 10px 0 rgb(0 0 0 / 40%);
        width: 22rem;

        [data="x-close"]{
            position: absolute;
            left: 22rem;
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
            a,button{
                background: transparent;
                flex: 1;
                display: flex;
                align-items:center;
                font-family: ${({ theme }) => theme.font.family.bold};
                color: #fff;
                span{
                    flex:1;
                    font-size: 17px;
                    overflow:hidden;
                    white-space: nowrap;
                    max-width: 15rem;
                    text-align:left;
                }
                svg{
                    font-size: 30px;
                    margin-right: 10px;
                    margin-left: 10px;
                }
                >:nth-child(3){
                    font-size: 20px;
                }
            }
        }
        [data="ul-li"]{
            display: flex;
            flex-direction: column;
            li{
                display: flex;
                height: 3rem;
                padding:0px;
                a{ 
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

export default function Menu() {
    const { data: session } = useSession()
    const { template, setTemplate } = useContext(TemplateContext)

    return (
        <MenuSC>
            <div data="exibir">
                <div data='x-close'>
                    <X />
                </div>
                <div data='user'>
                    {session && session.id ?
                        <button type="button" onClick={() => setTemplate({ ...template, showMenu: false, showMenuLogin: true })}>
                            {/* Se tiver logado exibe o primeiro nome do usuario */}
                            <PersonFillGear /><span>Olá, {session.nome.split(' ')[0]}</span> <ChevronRight />
                        </button>
                        :
                        <Link href="/login">
                            <PersonCircle /> <span>Olá, faça seu login</span>
                        </Link>
                    }
                </div>
                <ul data="ul-li">
                    <li>
                        <div>
                            Destaques
                        </div>
                    </li>
                    <li><Link href="/">Mais Vendidos</Link></li>
                    <li><Link href="/">Novidades</Link></li>
                    <li><Link href="/">Em alta</Link></li>
                    <li data="barra"></li>
                    <li>
                        <div>
                            Categorias
                        </div>
                    </li>
                    <li><Link href="/">Cama</Link></li>
                    <li><Link href="/">Piso</Link></li>
                    <li><Link href="/">TV</Link></li>
                    <li><Link href="/">Joias</Link></li>
                </ul>

            </div>

            <button data="btn-close" onClick={() => setTemplate({ ...template, showMenu: false, showNav: true })}>
            </button>
        </MenuSC >
    )
}