let timer;
import { auth } from '@/firebase/config'
import {
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth'

export default {
    async login(context, payload) {

        console.log('Begin auth/login payload: ' + JSON.stringify(payload))
        const response = await signInWithEmailAndPassword(auth, payload.email, payload.password);


        if (response) {
            console.log('Begin auth/login url: ' + JSON.stringify(response));
        } else
            throw new Error('Errore di autenticazione. Controlla le tue credenziali.');


        const expiresIn = + response._tokenResponse.expiresIn * 1000;

        localStorage.setItem('email', response.user.email);
        localStorage.setItem('token', response.user.stsTokenManager.accessToken);
        localStorage.setItem('tokenExpiration', response.user.stsTokenManager.expirationTime);

        console.log('email ' + response.user.email);
        console.log('token ' + response.user.stsTokenManager.accessToken);

        timer = setTimeout(function() {
            context.dispatch('autoLogout');
        }, expiresIn);

        context.commit('setUser', {
            email: response.user.email,
            token: response.user.stsTokenManager.accessToken,
        });
    },

    tryLogin(context) {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        const expiresIn = +tokenExpiration - new Date().getTime();

        if (expiresIn < 0) {
            return;
        }

        timer = setTimeout(function() {
            context.dispatch('autoLogout').then();
        }, expiresIn);

        if (token && email) {
            context.commit('setUser', {
                email: email,
                token: token
            });
        }
    },
    async logout(context) {

        await signOut(auth)

        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('tokenExpiration');

        clearTimeout(timer);

        context.commit('setUser', {
            token: null,
            userId: null
        });
    },

    autoLogout(context) {
        context.dispatch('logout').then();
        context.commit('setAutoLogout');
    }
};
