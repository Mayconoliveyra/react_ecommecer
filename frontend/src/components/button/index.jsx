import styled from "styled-components"
const ButtonYellowSC = styled.div`
    a, button{   
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;

            padding: 1rem 0;
            font-size: 1.15rem;
            background: #FFD814;
            border:solid 2px #FCD200;
            border-radius: 0.45rem;
            width: 100%;

            max-width:${({ maxwidth }) => maxwidth};
            margin:${({ margin }) => margin ? margin : "0 auto;"};
            padding:${({ padding }) => padding};
            &:disabled{
                cursor: default;
            }
    }
`
const ButtonYellowBordSC = styled.div`
    a, button{   
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;

            padding: 1rem 0;
            font-size: 1.15rem;
            background-color: transparent;
            border:solid 2px #FCD200;
            border-radius: 0.45rem;
            width: 100%;

            max-width:${({ maxwidth }) => maxwidth};
            margin:${({ margin }) => margin ? margin : "0 auto;"};
            padding:${({ padding }) => padding};
            &:disabled{
                cursor: default;
            }
    }
`
const ButtonWhiteSC = styled.div`
    a, button{   
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;

            padding: 1rem 0;
            font-size: 1.15rem;
            background-color: transparent;
            box-shadow: 0 0.2rem 0.5rem 0 rgb(213 217 217 / 50%);
            border: solid 1px #D5D9D9;
            border-radius: 0.45rem;
            width: 100%;

            max-width:${({ maxwidth }) => maxwidth};
            margin:${({ margin }) => margin ? margin : "0 auto;"};
            padding:${({ padding }) => padding};
            &:disabled{
                cursor: default;
            }
    }
`
const ButtonYellow = ({ margin, padding, maxwidth, children }) => {
    return (
        <ButtonYellowSC margin={margin} padding={padding} maxwidth={maxwidth}  >
            {children}
        </ButtonYellowSC>
    )
}

const ButtonYellowBord = ({ margin, padding, maxwidth, children }) => {
    return (
        <ButtonYellowBordSC margin={margin} padding={padding} maxwidth={maxwidth}  >
            {children}
        </ButtonYellowBordSC>
    )
}

const ButtonWhite = ({ margin, padding, maxwidth, children }) => {
    return (
        <ButtonWhiteSC margin={margin} padding={padding} maxwidth={maxwidth}  >
            {children}
        </ButtonWhiteSC>
    )
}

export { ButtonYellow, ButtonYellowBord, ButtonWhite }