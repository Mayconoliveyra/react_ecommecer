import styled from "styled-components"
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'

import StoreContext from "../../../context/store"

const HeaderSC = styled.header`
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
        input{
            margin-top: 5px;
            border-radius: 3px;
            border: none;
            max-width: 780px;
            width: 100%;
            padding: 0.8rem 1rem;
            font-size: 1rem;
        }
    }
`
export default function Header() {
    const router = useRouter()
    const store = useContext(StoreContext)
    const [inputSearch, setInputSearch] = useState('')
    const { query: { search } } = router

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
            <div id="a-header">
                <Link href="/">
                    <h1>{`${store.nome}`}</h1>
                </Link>
                <input type="Search" value={inputSearch} placeholder="O que você procura?" onKeyUp={handleSubmit} onChange={(e) => setInputSearch(e.target.value)} />
            </div>
        </HeaderSC >
    )
}


