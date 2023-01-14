import styled from "styled-components"
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react";
import Image from "next/image";
import { PersonCircle, PersonFillGear } from "react-bootstrap-icons";
import TemplateContext from "../../../context/template";

const HeaderSC = styled.header`
    background-color: ${({ theme }) => theme.colors.secondaryColor};
    #exibir-header{
        padding: 7px 10px;
        max-width: 1120px;
        margin: 0px auto;
        display: flex;
        flex-direction:column;
        [data="cont-1"]{
            display: flex;
            justify-content: space-between;
            padding: 5px 5px 10px 5px;

            [data="user-login"]{
                background:transparent;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family:${({ theme }) => theme.font.family.bold};
                color: #fff;
                font-size: 16px;
                span{
                    overflow:hidden;
                    max-width: 10rem;
                    white-space: nowrap;
                }
                svg{
                    font-size: 25px;
                    margin-left: 3px;
                }
            }
        }
        [data="cont-2"]{
            flex: 1;
            display: flex;
            justify-content: center;
            align-items:center;
            input{
                border-radius: 7px;
                border: none;
                width: 100%;
                padding: 14px;
                font-size: 14px;
                box-shadow: 0 1px 0 0 rgb(255 255 255 / 50%), inset 0 1px 0 0 rgb(0 0 0 / 7%);
            }
        }
    }
`
export default function Header() {
    const { template, setTemplate } = useContext(TemplateContext)
    const router = useRouter()
    const [inputSearch, setInputSearch] = useState('')
    const { query: { search } } = router
    const { data: session } = useSession()

    useEffect(() => {
        if (search) setInputSearch(search)
    }, [])

    const handleSubmit = (e) => {
        if (e.key === 'Enter') {
            router.push(`/pesquisa/${inputSearch}`)
        }
    };

    return (
        <HeaderSC>
            <div id="exibir-header">
                <div data="cont-1">
                    <Link href="/">
                        <Image src={'/assets/images/logo.png'} width={130} height={30} alt="logo" quality={100} priority={true} />
                    </Link>

                    {session && session.id ?
                        <button data="user-login" onClick={() => setTemplate({ ...template, showMenu: false, showMenuLogin: true, showNav: false })}>
                            {session.nome && session.nome != 'Não informado' ?
                                <>
                                    <span>{session.nome.split(' ')[0]}</span>  <PersonFillGear />
                                </>
                                :
                                <>
                                    <span>Não informado</span>  <PersonFillGear />
                                </>
                            }
                        </button>
                        :
                        <Link href="/login" data="user-login">
                            Faça seu login <PersonCircle />
                        </Link>
                    }
                </div>
                {template.showHeaderSearch && (
                    <div data="cont-2">
                        <input type="Search" value={inputSearch} placeholder="O que você procura?" onKeyUp={handleSubmit} onChange={(e) => setInputSearch(e.target.value)} />
                    </div>
                )}
            </div>
        </HeaderSC >
    )
}


