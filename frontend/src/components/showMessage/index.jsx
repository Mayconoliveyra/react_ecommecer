import styled from "styled-components"

const MsgSuccess = styled.div`
    h4{
    color: #3cac6c;
    margin:0px;
    font-size: 1rem;
    font-family:${({ theme }) => theme.font.family.medium};
    margin-bottom:0.3rem;
    }
    span{
    color: #111;
    margin:0px;
    padding:0px;
    }
    border: solid 1px #3cac6c;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 0 0 4px #f5fcf3  inset;
    padding: 1.1rem 1.2rem;
`
const MsgError = styled.div`
    h4{
    color: #c40000;
    margin:0px;
    font-size: 1rem;
    font-family:${({ theme }) => theme.font.family.medium};
    margin-bottom:0.3rem;
    }
    span{
    color: #111;
    margin:0px;
    padding:0px;
    }
    border: solid 1px #c40000;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 0 0 4px #fcf4f4 inset;
    padding: 1.1rem 1.2rem;
`
export const ShowMessage = ({ error }) => {
    return (
        <>
            {error && error[200] && (
                <MsgSuccess>
                    <h4>Aviso!</h4>
                    <span>
                        {error[200]}
                    </span>
                </MsgSuccess>
            )}
            {error && error[400] && (
                <MsgError>
                    <h4>Houve um problema</h4>
                    <span>
                        {error[400]}
                    </span>
                </MsgError>
            )}
        </>
    )
}