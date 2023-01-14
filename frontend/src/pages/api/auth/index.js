import api from "../axios";

const prefix = "/user";

/* Alterar o cadastro */
const store = async (data) => {
  if (data && data.id) {
    return await api.put(`${prefix}/${data.id}`, data).then(res => res.data);
  }
  return await api.post(`${prefix}`, data).then(res => res.data);
};

const storeNextAuth = async (data) => {
  return await api.post(`signin-next-auth`, data).then(res => res.data);
};
const storeAuth = async (data) => {
  return await api.post(`signin`, data).then(res => res.data);
};

/* Enviar email de recuperação e criar nova senha */
const storePassword = async (data, id) => {
  if (data && id) {
    return await api.put(`${prefix}/password/${id}`, data).then(res => res.data);
  }
  return await api.post(`${prefix}/password`, data).then(res => res.data);
};

/* Verifica se o usuario está autenticado */
const userIsAuth = async (session) => {
  if (!session) return false
  if (!session || !session.email) return false
  if (!session || !session.contato) return false
  if (!session || !session.nome) return false
  if (!session || !session.email_auth) return false
  if (!session || !session.cep) return false
  return true
}

export { store, storeNextAuth, storeAuth, storePassword, userIsAuth }