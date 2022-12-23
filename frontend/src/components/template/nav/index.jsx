import Link from "next/link";
import { useContext } from "react";
import { useRouter } from "next/router";
import { HouseDoor, Cart3, ThreeDots } from "react-bootstrap-icons";
import styled from "styled-components";

import MyCartContext from "../../../context/myCart";

const NavSC = styled.footer`
    position: fixed;
    bottom:0px;
    width:100%;
    border-top: solid 1px #d6d6d6;
    background-color: #FFFFFF;
    z-index: 999;
    div {
        display: flex;
        justify-content:space-around;
        padding: 0.6rem;
        max-width: 1120px;
        width:100%;
        margin: 0px auto;

        a {
            display: flex;
            flex-direction: column;
            align-items:center;
            padding: 0px 1rem;
            color: #8C8C8C;

            svg {
                font-size: 1.4rem;
            }
            p {
                margin: 0px;
                margin-top: 5px;
                font-size: ${({ theme }) => theme.font.sizes.xsmall};
                font-family: ${({ theme }) => theme.font.family.bold};
            }
        }
    }
`

export default function Nav() {
    const { myCart: { products } } = useContext(MyCartContext);
    const { pathname } = useRouter()

    return pathname != '/produto/[id]' && (
        <NavSC>
            <div>
                <Link href="/">
                    <HouseDoor />
                    <p>Home</p>
                </Link>
                <Link href="/carrinho">
                    <Cart3 />
                    <p>Carrinho({products && products.length ? products.length : 0})</p>
                </Link>
                <Link href="/">
                    <ThreeDots />
                    <p>Mais</p>
                </Link>
            </div>
        </NavSC>
    )
}