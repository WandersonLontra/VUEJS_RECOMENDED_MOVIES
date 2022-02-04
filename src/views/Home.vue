<template>
  <v-container  class="mt-9">
    <v-row align="center">
      <h1 class="display-1"> Welcome {{ users[0].name }}</h1>

      <v-spacer />

      <v-dialog
        v-model="editLikedGenres"
        width="600"
      >
        <template v-slot:activator="{on,attrs}">
          <v-btn
            color="red lighten-2"
            v-bind="attrs"
            v-on="on"
          >
            Edit your favorite genres
          </v-btn>
        </template> 

        <v-card

        >
          <RegisterUser 
              :userName="this.userData.name"
              :isUpdating="true"
              :genresSelected="this.likedGenresList"
              @closeDialog="closeDialogModal"
          />
        </v-card>
      </v-dialog>
    </v-row>

    <v-card
      v-if="users[0].recommendedMovies.length > 0"
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
  </v-container>
</template>

<script>
  import RecommendedMovies from '../components/RecommendedMovies';
  import RegisterUser from '../components/RegisterUser.vue';


  export default {
    name: 'Home',
    components:{RecommendedMovies, RegisterUser},
    data(){
      return{
        users: [],
        editLikedGenres: false,
        likedGenresList: []
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
        },
        fetchPolicy: 'cache-and-network'
      },
    },
    watch:{
      users(value){
        this.likedGenresList = value[0].liked_genres.reduce((acc,sum)=>{
          acc.push(sum.name)
          return acc
        },[])
      }
    },
    methods:{
      closeDialogModal(){
        this.editLikedGenres = false;
        console.log(this.editLikedGenres)
      }
    },
    computed:{
      userData(){
        return JSON.parse(localStorage.getItem('@MovieFy_userData'))
      }
    }
  }
</script>
