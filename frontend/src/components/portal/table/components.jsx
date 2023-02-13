import styled from "styled-components"
const TableOneSC = styled.div`
    display: flex;
    padding: 0px 15px;
    table {
        border-bottom: 1px solid #dddddd;
        width: 100%;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 200px);
        @media (max-width: 720px){
            height: calc(100vh - 280px);
        }
        
        tbody, thead {
            display: flex;
            flex-direction: column;
            border: 1px solid #dddddd;
            border-bottom: 0px solid #dddddd;
            border-spacing: 0;
            background-color: #ffffff;
        }
        tbody{
            overflow-x: hidden;
            height: 100%;

            ::-webkit-scrollbar-track {
            background-color: transparent;
            width: 11px;
            }
            ::-webkit-scrollbar {
            width: 11px;
            background: transparent;
            }
            ::-webkit-scrollbar-thumb {
            background: #dddddd;
            border-radius: 0px;
            }
        }
        tr{
            display: flex;
            td,th{
                height: 35px;
                flex: 1;
                padding: 0 5px;
                border-right: 1px solid #dddddd;
                border-bottom: 1px solid #dddddd;
                text-align: left;
                font-size: 13px;
                @media (max-width: 720px){
                    font-size: 11px;
                }
            }
            th{
                height: auto;
                padding: 8px 5px;
            }
            th:last-child{
                 border-right: 0px !important;
            }
        }
        tr:nth-child(odd) {
            background-color: #f3f4f5;
        }
        tr:hover{
            background-color: #DDDDDD !important;
        }
    }
`
const TdSC = styled.td`
    display: flex;
    align-items: center;
    max-width: 200px;

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
    span{
        text-overflow: ellipsis;
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-word;

        [data="acoes"]{
            display: flex;
        }
    }
`
const ThSC = styled.th`
    max-width: 200px;
    background-color: #ffffff;
    color: #333333;
    border-bottom-width: 2px;

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
    flex:${({ flex }) => flex ? flex : 1} !important;

    span{
        white-space: nowrap;
        overflow: hidden; 
    }
`

const TableOne = ({ children, height, maxheight, width, maxwidth, margin, padding, background, color, fontsize, fontweight, border, borderadius, boxshadow }) => {
    return (
        <TableOneSC
            height={height} maxheight={maxheight}
            width={width} maxwidth={maxwidth}
            margin={margin} padding={padding}
            background={background} color={color}
            fontsize={fontsize} fontweight={fontweight}
            border={border} borderadius={borderadius}
            boxshadow={boxshadow}
        >
            {children}
        </TableOneSC>
    )
}
const TdOne = ({ children, height, maxheight, width, maxwidth, margin, padding, background, color, fontsize, fontweight, border, borderadius, boxshadow }) => {
    return (
        <TdSC
            height={height} maxheight={maxheight}
            width={width} maxwidth={maxwidth}
            margin={margin} padding={padding}
            background={background} color={color}
            fontsize={fontsize} fontweight={fontweight}
            border={border} borderadius={borderadius}
            boxshadow={boxshadow}
        >
            <span>{children}</span>
        </TdSC>
    )
}
const ThOne = ({ children, height, maxheight, width, maxwidth, margin, padding, background, color, fontsize, fontweight, border, borderadius, boxshadow }) => {
    return (
        <ThSC
            height={height} maxheight={maxheight}
            width={width} maxwidth={maxwidth}
            margin={margin} padding={padding}
            background={background} color={color}
            fontsize={fontsize} fontweight={fontweight}
            border={border} borderadius={borderadius}
            boxshadow={boxshadow}

        >
            <span>{children}</span>
        </ThSC>
    )
}


export { TableOne, TdOne, ThOne }