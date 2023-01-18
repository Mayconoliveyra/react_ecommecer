import styled from "styled-components"
const ButtonSC = styled.div`
    [data='btn-confirm']{
        padding: 0.7rem 1rem;
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
        }
    }
    [data='btn-confirm-noborder']{
        margin-top: 1rem;
        padding: 0.7rem 1rem;
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
        }
    }
    [data='btn-confirm-white']{
        padding: 0.7rem 1rem;
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
        }
    }
`
export { ButtonSC }