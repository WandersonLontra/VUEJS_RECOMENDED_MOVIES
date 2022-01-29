<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      class="px-4"
    >
      <v-container  class="d-flex align-center">
        <v-toolbar-title 
          color="white" 
          class="text-h4 font-weight-bold" 
          @click="$router.push('/')"
          style="cursor: pointer"
        >
          Movie<span class="red--text">.</span>FY
        </v-toolbar-title>

        <v-spacer />

        <v-autocomplete
          v-model="select"
          :items="items"
          :search-input.sync="search"
          cache-items
          class="mx-4"
          flat
          hide-no-data
          hide-details
          label="What movie are you looking for?"
          solo-inverted
        >
          <template v-slot:item="{item}"> 
            <v-list-item-content >
              <v-list-item-title v-text="item" @click="movieClicked"/>
            </v-list-item-content>
          </template>
        </v-autocomplete>

        <v-spacer />

        <v-btn> DWAD</v-btn>
      </v-container>
    </v-app-bar>


    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
  import gql from 'graphql-tag';

  export default {
    name: 'App',

    data: () => ({
      //
      select: null,
      search: null,
      items: [],
    }),
    apollo: {
      movies: {
        query: gql`
            query {
              movies {
                title
              }
            } 
        `
      }
    },
    watch: {
      movies(){
        this.items = this.movies.reduce((acc,sum) => {
          acc.push(sum.title)
          return acc
        },[])
      },
      $route(){
        this.select = null
      }
    },
    methods: {
      movieClicked(event){
        this.$router.push({name: "MoviePage", params: {title: `${event.target.innerHTML}`}}).catch(() => {});
      }
    }
  }
</script>
