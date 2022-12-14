import styled from "styled-components"
import { UsbMini, Boxes, StopCircle, Tornado } from "react-bootstrap-icons"
import Link from "next/link"

const NavSC = styled.nav`
    display: flex;
    justify-content: center;
    height: 90px;
    border-bottom: solid 1px #d6d6d6;
    max-width: 100vw;
    overflow: hidden;
    ul{
        margin: 0px;
        padding: 9px;
        max-width: 1260px;
        display: flex;
        overflow-x: scroll;
        ::-webkit-scrollbar,             
        ::-webkit-scrollbar-button,      
        ::-webkit-scrollbar-track,        
        ::-webkit-scrollbar-track-piece, 
        ::-webkit-scrollbar-thumb,       
        ::-webkit-scrollbar-corner {      
             background-color:transparent;
             height: 0px;
        }

        li {
            a {
                height: 100%;
                display:flex;
                flex-direction: column;
                align-items: center;
                justify-content:space-between;
                margin-right: 5px;
                white-space: nowrap;
                overflow: hidden;
                width: 100px;
            }

            div {
                display:flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                background-color: ${({ theme }) => theme.colors.secondaryColor};
                border-radius: 999px;
                
                div {
                    width: 48px;
                    height: 48px;
                    border: solid 2px ${({ theme }) => theme.colors.primaryColor};
                    border-radius: 999px;

                    svg {
                        color: ${({ theme }) => theme.colors.primaryColor};
                        font-size: 25px;
                    }
                }
            }

            p {
                margin:0px;
                padding: 0px;
                font-size: ${({ theme }) => theme.font.sizes.small};
                font-family:  ${({ theme }) => theme.font.family.medium};
                color: ${({ theme }) => theme.colors.secondaryColor};
            }
        }
    }
    
`
export default function CategoriesNav() {
    return (
        <NavSC>
            <ul>
                <li>
                    <Link href={"/"}>
                        <div>
                            <div>
                                <UsbMini />
                            </div>
                        </div>
                        <p>Camas</p>
                    </Link>
                </li>
                <li>
                    <Link href={"/"}>
                        <div>
                            <div>
                                <Boxes />
                            </div>
                        </div>
                        <p>Brinquedos</p>
                    </Link>
                </li>
                <li>
                    <Link href={"/"}>
                        <div>
                            <div>
                                <StopCircle />
                            </div>
                        </div>
                        <p>Comedouros</p>
                    </Link>
                </li>
                <li>
                    <Link href={"/"}>
                        <div>
                            <div>
                                <Tornado />
                            </div>
                        </div>
                        <p>Cozinhas</p>
                    </Link>
                </li>
                <li>
                    <Link href={"/"}>
                        <div>
                            <div>
                                <Tornado />
                            </div>
                        </div>
                        <p>Cozinhas</p>
                    </Link>
                </li>
                <li>
                    <Link href={"/"}>
                        <div>
                            <div>
                                <Tornado />
                            </div>
                        </div>
                        <p>Cozinhas</p>
                    </Link>
                </li>
            </ul>
        </NavSC >
    )
}