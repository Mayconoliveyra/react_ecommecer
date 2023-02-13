import styled from "styled-components"
const Input = styled.div`
    display: flex;
    input{
            height:${({ height }) => height} !important;
            max-height: ${({ maxheight }) => maxheight} !important;
            width:${({ width }) => width} !important;
            max-width: ${({ maxwidth }) => maxwidth} !important;
            margin:${({ margin }) => margin} !important;
            padding:${({ padding }) => padding} !important;
            background:${({ background }) => background} !important;
            color:${({ color }) => color} !important;
            font-size:${({ fontsize }) => fontsize} !important;
            font-weight:${({ fontweight }) => fontweight} !important;
            border:${({ border }) => border} !important;
            border-radius:${({ borderadius }) => borderadius} !important;
            box-shadow:${({ boxshadow }) => boxshadow} !important;
    }
`

const InputSearchOneSC = styled(Input)`
    input{
        width: 20rem;
        padding: 0.5rem 0.9rem;
        font-size: 0.8rem;
        color: #555555;
        border-radius: 0;
        border: 1px solid #cccccc;
        background-color: #ffffff;
        box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
        transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    }
    @media (max-width: 720px){
        margin-top: 1rem;
        input{
            width: 100%;
            padding: 0.6rem 0.9rem;
            font-size: 1rem;
        }
        button{
            padding: 0.6rem 0.8rem 0.6rem 1rem;
        }
    }
`


const InputSearchOne = ({ children, height, maxheight, width, maxwidth, margin, padding, background, color, fontsize, fontweight, border, borderadius, boxshadow }) => {
    return (
        <InputSearchOneSC
            height={height} maxheight={maxheight}
            width={width} maxwidth={maxwidth}
            margin={margin} padding={padding}
            background={background} color={color}
            fontsize={fontsize} fontweight={fontweight}
            border={border} borderadius={borderadius}
            boxshadow={boxshadow}
        >
            {children}
        </InputSearchOneSC>
    )
}


export { InputSearchOne }