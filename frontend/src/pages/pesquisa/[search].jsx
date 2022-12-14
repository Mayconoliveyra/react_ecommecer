import { getSearch } from "../../adapters/products";
import styled from "styled-components";
import CardSearch from "./components/cardSearch";

const SearchSC = styled.div`
    [data-div="title"]{
        >h1 {
            font-size: 1.5rem;
            margin: 0.5rem;
            margin-left: 10px;
            display:flex;
        }
    }
    [data-div="cads"]{
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 0.6rem;
        @media (min-width: 720px){
            grid-template-columns: repeat(2, 1fr);
        }
    }
`

export default function Search({ data }) {
    return (
        <SearchSC>
            <div data-div="title"><h1>RESULTADOS</h1></div>
            <div data-div="cads">
                {data && data.map((item) => {
                    return <CardSearch key={item.id} {...item} />
                })}
            </div>
        </SearchSC>
    );
}

export async function getServerSideProps(req) {
    const { search } = req.params

    const data = await getSearch(search)
        .then((res) => res.data)

    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: { data },
    }
}