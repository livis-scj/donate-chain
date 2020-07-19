import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const state = {
    userInfo: {}
};

// 获取状态信息
const getters = {
    userInfo: state => state.userInfo
};

// 更改状态信息
const mutations = {
    setUserInfo(state, userInfo) {
        state.userInfo = userInfo;
    }
};

const actions = {
    setUserInfo: ({
        commit
    }, userInfo) => {
        commit('setUserInfo', userInfo);
    }
};
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    plugins: [createPersistedState()]
});
