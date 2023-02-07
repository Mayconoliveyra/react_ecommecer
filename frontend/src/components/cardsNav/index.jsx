import styled from "styled-components"
import { CardOne, CardTwo, CardSugOne } from "../card/cards"

const CardsNavOneSC = styled.section`
    display: flex;
    flex-direction: column;
    background-color: #fff;
    margin-top: 1.5rem;
    padding: 1rem;
    @media (max-width: 720px){
        padding: 0.5rem 0.5rem;
        margin-top: 0;
        margin-bottom: 3px;
    }
    [data-div="name-card"] {
        padding: 0.5rem;
        h2 {
            color: #0F1111;
            font-size: 1.4rem;
            font-family: ${({ theme }) => theme.font.family.bold};
        }
    }
    [data-div="session-cards"] {
        display: grid;
        justify-content: space-between;
        grid-template-columns: repeat(1,auto);
        margin-top: 5px;
        @media (min-width: 350px){
            grid-template-columns: repeat(2,auto);
        }
        @media (min-width: 525px){
            grid-template-columns: repeat(3,auto);
        }
        @media (min-width: 700px){
            grid-template-columns: repeat(4,auto);
        }
        @media (min-width: 900px){
            grid-template-columns: repeat(5,auto);
        }
    }
`
const CardNavOne = ({ title, products }) => {
    if (products && products.length > 0)
        return (
            <CardsNavOneSC>
                <div data-div="name-card">
                    <h2>{title}</h2>
                </div>
                <div data-div="session-cards">
                    {products.map((item) => {
                        return <CardOne key={item.id} product={item} />
                    })}
                </div>
            </CardsNavOneSC>
        )
}
const CardNavTwo = ({ title, products }) => {
    if (products && products.length > 0)
        return (
            <CardsNavOneSC>
                <div data-div="name-card">
                    <h2>{title}</h2>
                </div>
                <div data-div="session-cards">
                    {products.map((item) => {
                        return <CardTwo key={item.id} product={item} />
                    })}
                </div>
            </CardsNavOneSC>
        )
}
const CardNavSugOne = ({ title, products }) => {
    if (products && products.length > 0)
        return (
            <CardsNavOneSC>
                <div data-div="name-card">
                    <h2>{title}</h2>
                </div>
                <div data-div="session-cards">
                    {products.map((item) => {
                        return <CardSugOne key={item.id} product={item} />
                    })}
                </div>
            </CardsNavOneSC>
        )
}
export { CardNavOne, CardNavTwo, CardNavSugOne }