import styled from "styled-components"
const TableOneSC = styled.div`
    display: flex;
    padding: 0px 15px;

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

    table {
        border-bottom: 1px solid #dddddd;
        width: 100%;
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 200px);
        @media (max-width: 720px){
            max-height: calc(100vh - 280px);
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
    height: auto  !important;
    padding: 8px 5px  !important;

    &:last-child{
        border-right: 0px !important;
    }
           
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
/* Tabela de visualização de dados */
const TableVWSC = styled.div`
    display: flex;
    padding: 20px 15px;
    @media (max-width: 720px){
        padding: 13px 5px;
    }
    table {
        color: #333333 !important;
        width: 100%;
        display: flex;
        flex-direction: column;
        tbody, thead {
            display: flex;
            flex-direction: column;
            border: 1px solid #dddddd;
            border-bottom: none;
            border-spacing: 0;
            background-color: #ffffff;
        }
        tbody{
            overflow-x: hidden;
            height: 100%;
        }
        tr{
            display: flex;
            td,th{
                display: flex;
                align-items: center;
                height: 37px;
                flex: 1;
                padding: 0 10px;
                border-right: 1px solid #dddddd;
                border-bottom: 1px solid #dddddd;
                font-size: 13px;
                @media (max-width: 720px){
                    font-size: 11px;
                }

                .span-th-vw{
                    font-weight: normal;
                    font-family:${({ theme }) => theme.font.family.bold};
                    text-overflow: ellipsis;
                    white-space: normal;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    word-break: break-word;
                }
                .span-td-vw{
                    text-overflow: ellipsis;
                    white-space: normal;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    word-break: break-word;
                }
            }
            th{
                max-width: 200px;
            }
            td:last-child{
                border-right: none;
            }
        }
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
const TableVW = ({ children }) => {
    return (
        <TableVWSC>
            {children}
        </TableVWSC>
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


export { TableOne, TdOne, ThOne, TableVW }