
Vue.component('v-search', {
  props: ['inputvalue', 'depthvalue', 'matrix'],
  template: `
  <div> 
    <nav class="navbar navbar-light bg-light">
      <form class="form-inline" @submit.prevent="find">
        <input class="form-control mr-sm-2" v-model="inputvalue" type="search" placeholder="URL" aria-label="URL" required>
        <input class="form-control mr-sm-2" v-model="depthvalue" type="search" placeholder="Profundidad" aria-label="Profundidad" required type="number">
        <button class="btn btn-outline-success my-2 my-sm-0">Buscar</button>
      </form>
    </nav>

    <v-spinner v-if="loading"></v-spinner>
    <v-list v-if="!loading && render" :parentData="matrix"></v-list>
    <v-error v-if="error" :text="errorText"></v-error>

  </div>`,
  methods: {
    find() {
      this.loading = true;
      this.error = false;
      const body = { depth: this.depthvalue - 1, url: this.inputvalue };
      // Lamada al servicio
      axios
        .post('http://127.0.0.1:3000/search', body)
        .then(res => {
          this.matrix = res.data;
          this.loading = false;
          this.render = true;
        })
        .catch(err => {
          this.error = true;
          this.loading = false;
          // Comprovacion de errores
          if(!err.response) {
            this.errorText = 'Error: Servico no disponible.'
          } else if (err.response.status === 400) {
            this.errorText = 'URL invalida, intentalo de nuevo. (ex: https://www.example.com)'
          } else {
            this.errorText = 'Error: por favor intentalo de nuevo.'
          }
        })
    }
  },
  data() {
    return {
      matrix: [],
      loading: false,
      render: false,
      error: false,
      errorText: ''
    }
  }
})

Vue.component('v-list', {
  props: ['parentData'],
  template:
    `<table class="table table-striped">
    <thead class="thead-dark">
      <tr>
        <th scope="col">Profundidad</th>
        <th scope="col">Url</th>
      </tr>
    </thead>
    <tbody v-for="(arr, index) in parentData">
      <tr v-for="url in arr"> 
        <td>{{index + 1}}</td>
        <td>{{url}}</td>
      </tr> 
  </tbody>
  </table>`
})

Vue.component('v-spinner', {
  template: `
  <div class="spinner-border spinner" role="status">
    <span class="sr-only">Loading...</span>
  </div>
 `
})

Vue.component('v-error', {
  props: ['text'],
  template: `
   <div class="alert alert-danger" role="alert">
    {{ text }}
  </div>
  `
})

var app = new Vue({
  el: '#app',
  template: `
    <v-search></v-search>
   `
})

