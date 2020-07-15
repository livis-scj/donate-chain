import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const state = {
    loginId: ''
};

// 获取状态信息
const getters = {
    loginId: state => state.loginId
};

// 更改状态信息
const mutations = {
    setloginId(state, loginId) {
        state.loginId = loginId;
    }
};

const actions = {
    setloginId: ({
        commit
    }, loginId) => {
        commit('setloginId', loginId);
    }
};
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    plugins: [createPersistedState()]
});
