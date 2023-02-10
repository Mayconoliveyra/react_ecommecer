import styled from "styled-components"
const ButtonVerdeSC = styled.div`
    a, button{   
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            font-family: ${({ theme }) => theme.font.family.regular};
            color: #ffffff;
            background-color: #00a65a;
            border-color: #008d4c;
            border-radius: 2px;
            padding: 6px 12px;
            box-shadow: inset 0px -1px 0px 0px rgb(0 0 0 / 9%);

            max-width:${({ maxwidth }) => maxwidth};
            margin:${({ margin }) => margin};
            padding:${({ padding }) => padding};
            &:disabled{
                cursor: default;
            }
            svg{
                margin-right: 4px;
            }
    }
`

const ButtonVerde = ({ margin, padding, maxwidth, children }) => {
    return (
        <ButtonVerdeSC margin={margin} padding={padding} maxwidth={maxwidth}  >
            {children}
        </ButtonVerdeSC>
    )
}

export { ButtonVerde }