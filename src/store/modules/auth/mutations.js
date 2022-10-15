export default {
    setUser(state, payload) {
        state.email = payload.email;
        state.token = payload.token;
        state.didAutoLogout = false;
    },
    setAutoLogout(state) {
        state.didAutoLogout = true;
    },
};