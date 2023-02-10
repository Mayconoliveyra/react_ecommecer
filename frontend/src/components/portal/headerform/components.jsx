import styled from "styled-components"

const HeaderFormOneSC = styled.section`
    padding: 20px 15px;
  /*  border: solid 1px red; */
`;
const HeaderFormOne = ({ children }) => {
    return (
        <HeaderFormOneSC>
            {children}
        </HeaderFormOneSC>
    )
}
export { HeaderFormOne }