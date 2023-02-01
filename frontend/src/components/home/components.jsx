import styled from "styled-components"

const CardsNavSC = styled.section`
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding: 1.5rem;
    margin-top: 1.5rem;
    border: solid 1px red;
    [data-div="name-card"] {
        border: solid 1px red;
        margin-bottom: 1rem;
        h2 {
            color: #0F1111;
            font-size: 1.4rem;
            font-family: ${({ theme }) => theme.font.family.bold};
        }
    }
    [data-div="session-cards"] {
        display: grid;
        grid-template-columns: repeat(5, auto);
    }
`
const CardsNav = ({ children, name }) => {
    return (
        <CardsNavSC>
            <div data-div="name-card">
                <h2>{name}</h2>
            </div>
            <div data-div="session-cards">
                {children}
            </div>
        </CardsNavSC>
    )
}

export { CardsNav }