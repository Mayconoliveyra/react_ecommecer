import styled from "styled-components"
import Link from "next/link";
import { List, BellFill, DoorOpenFill } from "react-bootstrap-icons"
const HeaderSC = styled.header`
    display: flex;
    align-items: center;
    justify-content:  space-between;
    background-color: #232F3E;
    height: 50px;

    [data="nav-logo"]{
        button{
            background-color: transparent;
        }
    }
    [data="notificacao"]{
        a{
            /* padding: 10px 10px; */
        }
    }
`
export default function PortalHeader() {
    return (
        <HeaderSC>
            <div data="nav-logo">
                <button type="button" data="nav-icon">
                    <List height={35} width={50} color="#FFF" />
                </button>
            </div>
            <div data="notificacao">
                <Link href="/">
                    <BellFill height={23} width={45} color="#FFF" />
                </Link>
                <Link href="/">
                    <DoorOpenFill height={23} width={50} color="#FFF" />
                </Link>
            </div>
        </HeaderSC>
    )
}


