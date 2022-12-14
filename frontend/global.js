import { toast } from "react-toastify";

export function showError(e) {
    if (e && e.response && e.response.data) {
        toast.error(e.response.data)
    } else if (typeof e === "string") {
        toast.error(e)
    } else {
        toast.error("Houve um erro inesperado, por favor, tente novamente.")
    }
}

export function showSucesso(e) {
    if (e && e.response && e.response.data) {
        toast.success(e.response.data)
    } else if (typeof e === "string") {
        toast.success(e)
    } else {
        toast.success("Operação realizada com sucesso!.")
    }
}

export default { showError, showSucesso }