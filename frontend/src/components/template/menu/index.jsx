import { useContext } from "react"
import styled from "styled-components"
import { X } from "react-bootstrap-icons"
import Link from "next/link";

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
            padding: 1.5rem 1rem;
            h1{
                font-size: 1.37rem;
                color: #fff;
                font-family: ${({ theme }) => theme.font.family.bold};
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
    const { template, setTemplate } = useContext(TemplateContext)

    const handleTemplate = () => {
        setTemplate({ ...template, showMenu: !template.showMenu })
    }

    return (
        <MenuSC>
            <div data="exibir">
                <div data='x-close'>
                    <X />
                </div>
                <div data='user'>
                    <h1>Olá, Maycon</h1>
                </div>
                <ul data="ul-li">
                    <li>
                        <div>
                            Minha conta
                        </div>
                    </li>
                    <li><Link href="/" onClick={handleTemplate}>Login</Link></li>
                    <li><Link href="/conta/endereco" onClick={handleTemplate}>Endereço</Link></li>
                    <li><Link href="/" onClick={handleTemplate}>Meus pedidos</Link></li>
                    <li><Link href="/" onClick={handleTemplate}>Atendimento</Link></li>
                    <li data="barra"></li>
                    <li>
                        <div>
                            Destaques
                        </div>
                    </li>
                    <li><Link href="/" onClick={handleTemplate}>Mais Vendidos</Link></li>
                    <li><Link href="/" onClick={handleTemplate}>Novidades</Link></li>
                    <li><Link href="/" onClick={handleTemplate}>Em alta</Link></li>
                    <li data="barra"></li>
                    <li>
                        <div>
                            Categorias
                        </div>
                    </li>
                    <li><Link href="/" onClick={handleTemplate}>Cama</Link></li>
                    <li><Link href="/" onClick={handleTemplate}>Piso</Link></li>
                    <li><Link href="/" onClick={handleTemplate}>TV</Link></li>
                    <li><Link href="/" onClick={handleTemplate}>Joias</Link></li>
                </ul>

            </div>

            <button data="btn-close" onClick={handleTemplate}>
            </button>
        </MenuSC>
    )
}