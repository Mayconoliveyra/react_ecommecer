import styled from "styled-components"
const ButtonSC = styled.div`
    [data='btn-confirm']{
        margin: 1rem 0;
        padding: 0.7rem 0rem;
        border-top: 0.1rem solid #e7e7e7;
        border-bottom: 0.1rem solid #e7e7e7;
        display: flex;
        a, button{   
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 0;
            font-size: 1.15rem;
            flex: 1;
            background: #FFD814;
            border:solid 2px #FCD200;
            border-radius: 0.45rem;

            &:disabled{
                cursor: default;
            }
        }
    }
    [data='btn-confirm-noborder']{
        margin: 1rem 0;
        padding: 0.7rem 0rem;
        display: flex;
        a, button{   
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 0;
            font-size: 1.15rem;
            flex: 1;
            background: #FFD814;
            border:solid 2px #FCD200;
            border-radius: 0.45rem;

            &:disabled{
                cursor: default;
            }
        }
    }
    [data='btn-confirm-bord-laran']{
        margin: 1rem 0;
        padding: 0.7rem 0rem;
        display: flex;
        a, button{   
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 0;
            font-size: 1.2rem;
            flex: 1;
            background-color: transparent;
            border:solid 2px #FCD200;
            border-radius: 0.45rem;

            &:disabled{
                cursor: default;
            }
        }
    }
    [data='btn-confirm-white']{
        margin: 1rem 0;
        padding: 0.7rem 0rem;
        display: flex;
        a, button{   
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 0;
            font-size: 1.15rem;
            flex: 1;
            background-color: transparent;
            box-shadow: 0 0.2rem 0.5rem 0 rgb(213 217 217 / 50%);
            border: solid 1px #D5D9D9;
            border-radius: 0.45rem;

            &:disabled{
                cursor: default;
            }
        }
    }
    [data='btn-yellow']{
        /* margin: 1rem 0;
        padding: 0.7rem 0rem; */
        display: flex;
        max-width:${({ maxwidth }) => maxwidth};
        margin:${({ margin }) => margin ? margin : "0 auto;"};
        padding:${({ padding }) => padding ? padding : "0.5rem;"};
        a, button{   
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 0;
            font-size: 1.15rem;
            flex: 1;
            background: #FFD814;
            border:solid 2px #FCD200;
            border-radius: 0.45rem;

            &:disabled{
                cursor: default;
            }
        }
    }
`
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