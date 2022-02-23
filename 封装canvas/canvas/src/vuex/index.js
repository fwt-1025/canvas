import { createStore } from 'vuex'

const store = createStore({
    state: {
        selectTool: 'select',
        scale: {
            x: 1,
            y: 1
        }
    },
    mutations: {
        CHANGE_SELECT_TOOL(state, data) {
            state.selectTool = data
        },
        SET_SCALE(state, data) {
            state.scale.x = data.x
            state.scale.y = data.y
        }
    }
})

export default store