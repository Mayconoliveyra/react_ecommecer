import styled from "styled-components"
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react";
import Image from "next/image";
import { List, Cart3, Person, GeoAlt } from "react-bootstrap-icons";
import TemplateContext from "../../../context/template";
import MyCartContext from "../../../context/myCart";

const HeaderSC = styled.header`
    background-color: ${({ theme }) => theme.colors.secondaryColor};
    #exibir-header{
        max-width: 1120px;
        margin: 0px auto;
        display: flex;
        flex-direction:column;
        [data="cont-1"]{
            color: #fff;
            display: flex;
            justify-content: space-between;
            [data="nav-logo"]{
                display: flex;
                align-items: center;
                [data="nav-icon"]{
                    background:transparent;
                    padding: 7px;
                    svg{
                        font-size: 35px;
                    }
                }
                [data="nav-logo"]{
                    margin-right: 1rem;
                }
                [data="endereco"]{
                    display: flex;
                    align-items: center;
                    color: #FFF;
                    display: flex;
                    svg{
                        margin-right: 0.4rem;
                        font-size: 1.3rem;
                    }
                    @media (max-width: 720px){
                        display: none;
                    }
                    div{
                        span:nth-child(1){
                            color: #ccc;
                            font-size: 0.8rem;
                        }
                        font-family:${({ theme }) => theme.font.family.medium};
                        font-size: 0.9rem;
                        display: flex;
                        flex-direction: column;
                    }
                }
            }
            [data="user-cart"]{
                display: flex;
                align-items: center;
                [data="user"]{
                    background:transparent;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family:${({ theme }) => theme.font.family.bold};
                    font-size: 13px;
                    padding: 7px 0;
                    span{
                        overflow:hidden;
                        max-width: 85px;
                        white-space: nowrap;
                    }
                    svg{
                        font-size: 33px;
                    }
                }
                [data="user-l"]{
                    background:transparent;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family:${({ theme }) => theme.font.family.bold};
                    font-size: 17px;
                    padding: 7px 0;
                    span{
                        overflow:hidden;
                        max-width: 85px;
                        white-space: nowrap;
                    }
                    svg{
                        font-size: 33px;
                    }
                }
                [data="cart"]{
                    position: relative;
                    padding: 7px 13px 7px 5px;
                    svg{
                        font-size: 35px;
                    }
                    [data="cart-qtd"]{
                        width: 30px;
                        padding:0 3px;
                        position: absolute;
                        right: 7px;
                        top: 2px;
                        font-family:${({ theme }) => theme.font.family.bold};
                        background-color: ${({ theme }) => theme.colors.secondaryColor};
                        font-size: 16px;
                        color: #f90;
                    }
                }
            }    
        }
        [data="cont-2"]{
            padding: 7px 10px;
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
    [data="endereco2"]{
        @media (min-width: 720px){
             display: none;
        }
        background-color: #37475A;
        a{
            max-width: 1120px;
            margin: 0px auto;
            display: flex;
            align-items:center ;
            padding: 1rem;
        
            color: #FFF;
            font-family:${({ theme }) => theme.font.family.medium};
            font-size: 0.8rem;
            svg{
                margin-right: 0.5rem;
                font-size: 1.2rem;
            }
        }
    }
`
export default function Header() {
    const { template, setTemplate } = useContext(TemplateContext)
    const { myCart: { products } } = useContext(MyCartContext);
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
                    <div data="nav-logo">
                        <button type="button" data="nav-icon" onClick={() => setTemplate({ ...template, showMenu: true, showMenuLogin: false })}>
                            <List />
                        </button>
                        <Link data="nav-logo" href="/">
                            <Image src={'/assets/images/logo.png'} width={130} height={30} alt="logo" quality={100} priority={true} />
                        </Link>

                        {template.showEndereco && session && session.localidade && session.cep && (
                            <Link href="/conta/endereco" data="endereco">
                                <GeoAlt />
                                <div>
                                    <span>Enviar para</span>
                                    <span>{session.localidade} - {session.cep}</span>
                                </div>
                            </Link>)
                        }

                    </div>

                    <div data="user-cart">
                        {session && session.id ?
                            <button type="button" data="user-l" onClick={() => setTemplate({ ...template, showMenu: false, showMenuLogin: true })}>
                                {session.nome && session.nome != 'Não informado' ?
                                    <>
                                        <span>{session.nome.split(' ')[0]}</span>  <Person />
                                    </>
                                    :
                                    <>
                                        <span>Não informado</span>  <Person />
                                    </>
                                }
                            </button>
                            :
                            <Link href="/login" data="user">
                                Faça seu login  <Person />
                            </Link>
                        }
                        <Link href="/carrinho" data="cart">
                            <span data="cart-qtd">{products && products.length ? products.length : 0}</span>
                            <Cart3 />
                        </Link>
                    </div>
                </div>
                {template.showHeaderSearch && (
                    <div data="cont-2">
                        <input type="Search" value={inputSearch} placeholder="O que você procura?" onKeyUp={handleSubmit} onChange={(e) => setInputSearch(e.target.value)} />
                    </div>
                )}
            </div>
            {template.showEndereco && session && session.localidade && session.cep && (
                <div data="endereco2">
                    <Link href="/conta/endereco">
                        <GeoAlt />Enviar para: {session.localidade} - {session.cep}
                    </Link>
                </div>
            )}
        </HeaderSC >
    )
}


