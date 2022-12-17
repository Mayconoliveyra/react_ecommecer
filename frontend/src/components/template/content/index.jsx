import Footer from "../footer"
export default function Content({ children }) {
    return (
        <>
            <main>
                {children}
            </main>
            <Footer />
        </>

    )
}