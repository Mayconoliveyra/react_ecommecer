import styled from "styled-components"

const HeaderFormOneSC = styled.section`
    display: flex;
    padding: 20px 15px;
    justify-content: space-between;
    @media (max-width: 720px){
        flex-direction: column;
    }
`;
const HeaderFormOne = ({ children }) => {
    return (
        <HeaderFormOneSC>
            {children}
        </HeaderFormOneSC>
    )
}
export { HeaderFormOne }