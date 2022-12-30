import styled from "styled-components"
import Link from "next/link";
import { useContext } from "react";

import StoreContext from "../../../context/store"

const Header2SC = styled.header`
    background-color: ${({ theme }) => theme.colors.secondaryColor};
   div {
    padding: 1rem;
    text-align: center;
    max-width: 1120px;
    margin: 0px auto;
        h1 {
            margin:0px;
            margin-bottom:0.3rem;
            padding: 0.5rem;
            padding-top: 0.2rem;
            font-size: ${({ theme }) => theme.font.sizes.medium};
            color: ${({ theme }) => theme.colors.primaryColor};
        }
    }
`
export default function Header2() {
    const store = useContext(StoreContext)

    return (
        <Header2SC>
            <div id="a-header">
                <Link href="/">
                    <h1>{`${store.nome}`}</h1>
                </Link>
            </div>
        </Header2SC >
    )
}


