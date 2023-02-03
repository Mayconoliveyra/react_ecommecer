import styled from "styled-components"

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
const CardsNavOne = ({ children, name }) => {
    return (
        <CardsNavOneSC>
            <div data-div="name-card">
                <h2>{name}</h2>
            </div>
            <div data-div="session-cards">
                {children}
            </div>
        </CardsNavOneSC>
    )
}

export { CardsNavOne }