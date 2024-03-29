import styled from "styled-components"
import PortalHeader from "../header";
import PortalMenu from "../menu";

const MainSC = styled.main`
    max-width: 100% !important;
    min-height: calc( 100vh - 50px) !important;
    display: flex !important;
    flex-direction: row !important;
    background: #f9f9f9 !important;
    [data="content"]{
        flex: 1;
        padding-bottom: 200px;
    }
`
export default function PortalContent({ children }) {
    return (
        <>
            <PortalHeader />
            <MainSC>
                <PortalMenu />
                <section data="content">
                    {children}
                </section>
            </MainSC>
        </>
    )
}