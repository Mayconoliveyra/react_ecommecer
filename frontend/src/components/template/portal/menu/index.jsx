import styled from "styled-components"
import Link from "next/link";

const HeaderSC = styled.aside`
    width: 200px;
    background-color: #232F3E;
    background-color: #fff;
    box-shadow: 4px 0 10px 0 rgb(0 0 0 / 40%);
    [data="ul-li"]{
            display: flex;
            flex-direction: column;
            li{
                display: flex;
                height: 35px;
                padding:0px;
                a,button{ 
                   /*  border: solid 1px red; */
                    background: transparent;
                    font-family:${({ theme }) => theme.font.family.medium};
                    display: flex;
                    align-items:center;
                   /*  padding: 15px 20px; */
                    padding-left: 17px;
                    flex:1;
                    font-size: 16px;
                    color: #111;
                }
            }
            li > div {
                display: flex;
                align-items:center;
                font-size: 18px;
                font-family:${({ theme }) => theme.font.family.bold};
                padding-left: 7px;
                padding-top: 7px;
            }
            [data="barra"]{
                border-bottom: 5px solid #d5dbdb;
                padding: 0px;
                margin: 0px;
                height: 0px;
                margin: 5px 0 0;
            }
        }
`
export default function PortalMenu() {
    return (
        <HeaderSC>
            <ul data="ul-li">
                <li><Link href="/portal">Visão geral</Link></li>
                <li><Link href="/conta/meusdados">Pedidos</Link></li>
                <li data="barra"></li>
                <li>
                    <div>
                        Cátalago
                    </div>
                </li>
                <li><Link href="/portal/cadastro/produtos">Mercadorias</Link></li>
                <li><Link href="/portal/cadastro/produtos">Categorias</Link></li>
                <li><Link href="/portal/cadastro/produtos">Imagens</Link></li>
                <li><Link href="/portal/cadastro/produtos">Promoções</Link></li>
                <li data="barra"></li>
                <li>
                    <div>
                        Área de entrega
                    </div>
                </li>
                <li><Link href="/portal/cadastro/produtos">Bairros</Link></li>
                <li><Link href="/portal/cadastro/produtos">Restringir</Link></li>
                <li>
                    <div>
                        Clientes
                    </div>
                </li>
                <li><Link href="/portal/cadastro/produtos">Bairros</Link></li>
                <li><Link href="/portal/cadastro/produtos">Restringir</Link></li>
            </ul>
        </HeaderSC >
    )
}

