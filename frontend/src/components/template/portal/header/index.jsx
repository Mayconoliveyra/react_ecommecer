import styled from "styled-components"
import Link from "next/link";
import Image from "next/image";
import { List, BellFill, DoorOpenFill } from "react-bootstrap-icons"

const HeaderSC = styled.header`
    display: flex;
    align-items: center;
    justify-content:  space-between;
    background-color: #232F3E;
    height: 50px;

    [data="nav-logo"]{
        [data="logo"]{
            margin: auto 13px;
        }
        button{
            background-color: transparent;
        }
    }
    [data="notificacao"]{
    }
`
export default function PortalHeader() {
    return (
        <HeaderSC>
            <div data="nav-logo">
                <Link data="logo" href="/">
                    <Image src={'/assets/images/logo.png'} width={135} height={30} alt="logo" quality={100} priority={true} />
                </Link>
                <button type="button" data="nav-icon">
                    <List height={30} width={50} color="#FFF" />
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


