<template>
  <v-container>
    <h1 class="display-2 mt-9"> Welcome {{ users[0].name }}</h1>

    <v-card
      class="mx-auto mt-9 pa-4"
      max-width="1024"
      rounded="lg"
    >
      <h1>Recommended Movies</h1>
      <RecommendedMovies
        :movie_group="users[0].recommendedMovies"
      />
    </v-card>

    <v-card
      class="mx-auto mt-9 pa-4"
      max-width="1024"
      rounded="lg"
    >
      <h1>Recommended By Genres</h1>
      <RecommendedMovies
        :movie_group="users[0].recommendedByGenres"
      />
    </v-card>

    <v-card
      class="mx-auto mt-9 pa-4"
      max-width="1024"
      rounded="lg"
    >
      <h1>Recommended Movies</h1>
      <RecommendedMovies
        :movie_group="[]"
      />
    </v-card>
  </v-container>
</template>

<script>
  import RecommendedMovies from '../components/RecommendedMovies';

  export default {
    name: 'Home',
    components:{RecommendedMovies},
    data(){
      return{
        
      }
    },
    beforeMount(){
      if(!this.userData){
        this.$router.push('/')
      }
    },
    apollo: {
      users: {
        query: require('../graphql/Users.query.gql'),
        variables(){
          return{ 
            where: {
              name: this.userData.name,
            }
          }
        }
      },
    },
    computed:{
      userData(){
        return JSON.parse(localStorage.getItem('@MovieFy_userData'))
      }
    }
  }
</script>
