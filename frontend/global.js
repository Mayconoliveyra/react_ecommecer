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

/* Converte as conulas "" em NULL. ex: {nome: ""} => {nome: NULL} */
export function FormatObjNull(obj) {
    const objReturn = obj;
    Object.keys(obj).forEach(key => {
        if (!isNaN(obj[key])) objReturn[key] = Number(obj[key]);
        if (obj[key] == "") objReturn[key] = undefined;
        if (obj[key] == "true") objReturn[key] = true;
        if (obj[key] == "false") objReturn[key] = false;
    });
    return objReturn
}

export default { showError, showSucesso, FormatObjNull }