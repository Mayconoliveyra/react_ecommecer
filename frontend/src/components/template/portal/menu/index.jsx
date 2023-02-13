import styled from "styled-components"
import Link from "next/link";

const HeaderSC = styled.aside`
    @media (max-width: 720px){
        display: none;
    }
    width: 180px;
    background-color: #F4F4F4;
    box-shadow: inset -3px 0px 8px -4px rgb(0 0 0 / 7%);
    [data="ul-li"]{
            display: flex;
            flex-direction: column;
            li{
                border-top: 1px solid #fff;
                border-bottom: 1px solid #dbdbdb;
                display: flex;
                padding: 8px 3px;
                a,button{ 
                    background: transparent;
                    font-family:${({ theme }) => theme.font.family.regular};
                    display: flex;
                    align-items: center;
                    padding-left: 17px;
                    flex:1;
                    font-size: 15px;
                    color: #111;
                }
            }
        }
`
export default function PortalMenu() {
    return (
        <HeaderSC>
            <ul data="ul-li">
                <li><Link href="/portal">Visão geral</Link></li>
                <li><Link href="/conta/meusdados">Pedidos</Link></li>
                <li><Link href="/portal/cadastro/produtos">Produtos</Link></li>
                <li><Link href="/portal/cadastro/produtos">Categorias</Link></li>
                <li><Link href="/portal/cadastro/produtos">Imagens</Link></li>
                <li><Link href="/portal/cadastro/produtos">Promoções</Link></li>
            </ul>
        </HeaderSC >
    )
}

