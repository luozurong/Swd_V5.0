export default {
  state: {
    connection: null,
    disconnect: true,
    chatMessages:[],
    endFlag:false
  },
  getters: {},
  mutations: {
    setConnection(state, connection) {
      state.connection = connection;
      state.disconnect = false;
    },
    disconnect(state) {
      state.connection.disconnect();
      state.disconnect = true;
      state.connection = null;
    },
  },
  actions: {}
};
