const userKey = '_mymoney_user' //chave que será armazenada no localStorage
const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem(userKey)),
    validToken: false
}
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'TOKEN_VALIDATED':
            if(action.payload) {
                return { ...state, validToken: true }
            } else {
                //remove o usuário
                localStorage.removeItem(userKey)
                return { ...state, validToken: false, user: null }
            }

        case 'USER_FETCHED':
            //armazena o usuário no localStorage
            localStorage.setItem(userKey, JSON.stringify(action.payload))
            return { ...state, user: action.payload, validToken: true }
        
        default:
            return state
    }
}