<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      class="px-16"
    >
      <v-toolbar-title 
        color="white" 
        class="text-h4 font-weight-bold" 
        @click="$router.push('/')"
        style="cursor: pointer"
      >
        Movie<span class="red--text">.</span>FI
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-autocomplete
        v-model="select"
        :loading="isLoading"
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
          <v-list-item-content>
            <v-list-item-title v-text="item" @click="movieCLicked"></v-list-item-title>
          </v-list-item-content>
        </template>
      </v-autocomplete>
      
      <v-spacer></v-spacer>

      <v-btn> DWAD</v-btn>
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
      isLoading: false,
    }),
    apollo: {
      movies: {
        query: gql`
            query {
              movies {
                _id
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
      }
    },
    methods: {
      movieCLicked(event){
        this.$router.push({name: "MoviePage", params: {title: `${event.target.innerHTML}`}})
      }
    }
  };
</script>
