import { getSearch } from "../../adapters/products";
import styled from "styled-components";
import { CardSearch } from "./cardSearch";

const SearchSC = styled.div`
    [data-div="title"]{
        >h1 {
            font-size: 1.3rem;
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

    [data-div='no-result']{
        margin: 0.8rem 1rem;
        h1 {
            font-size: 1.1rem;
            margin-left: 10px;
            display:flex;
            margin: 0px;
        }
        p {
            font-size: 1rem;
            margin: 0px;
        }
    }
`

export default function Search({ data, search }) {
    return (
        <SearchSC>
            {data.length > 0 ?
                <>
                    <div data-div="title"><h1>RESULTADOS</h1></div>
                    <div data-div="cads">
                        {data && data.map((item) => {
                            return <CardSearch key={item.id} {...item} />
                        })}
                    </div>
                </>
                :
                <>
                    <div data-div='no-result'>
                        <h1>Nenhum resultado para {search}.</h1>
                        <p> Tente verificar a ortografia ou usar termos mais genéricos</p>
                    </div>
                </>
            }
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
        props: { data, search },
    }
}