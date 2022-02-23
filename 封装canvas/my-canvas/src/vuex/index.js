import { createStore } from 'vuex'

const store = createStore({
    state: {
        selectTool: 'select',
        scale: 1,
        offset: {
            x: 0,
            y: 0
        },
        mat: {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: 0,
            f: 0
        }
    },
    mutations: {
        CHANGE_SELECT_TOOL(state, data) {
            state.selectTool = data
        },
        SET_SCALE(state, data) {
            state.scale = data
        },
        SET_MAT(state, data) {
            state.mat = data
        },
        SET_OFFSET(state, data) {
            state.offset = Object.assign({}, data)
        }
    }
})

export default store