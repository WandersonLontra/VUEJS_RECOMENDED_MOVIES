<template>
  <v-container class="mt-9">
    <v-card
      class="mx-auto pa-4"
      max-width="1024"
      rounded="lg"
    >
    <v-row
      align="center"
    >
      <v-col 
        cols="12"  
        lg="6"
        align="center"
      >
        <v-img :src="movies[0].imageUrl" max-width="500"/>
      </v-col>

      <v-col
        align-self="start"
        cols="12"  
        lg="6"
      >
        <h1 class="text-h4 font-weight-bold">{{ movies[0].title }}</h1>
        <v-card-subtitle 
          class="text-subtitle-1 grey--text text--darken-1"
        >
          {{ `${movies[0].year} / imdb ${movies[0].imdbRating}` }}
        </v-card-subtitle>

        <v-card-text class="mb-2">
          <v-row
            align="center"
            class="mx-0 mt-1"
          >
            <v-rating
              v-model="editRate"
              color="amber"
              hover
              dense
              half-increments
              length="10"
              size="27"
              @input="changeMovieRate"
            />
            <div class="grey--text ms-4">
              {{ editRate }}
            </div>
          </v-row>
        </v-card-text>

        <v-divider/>

        <v-card-text class="text-subtitle-1 grey--text font-weight-medium">
          {{ movies[0].plot }}
        </v-card-text>

        <v-divider />

        <DescriptionSession
          session_name="Genres"
          :descriptions="movies[0].genres"
        /> 

        <v-divider />

        <DescriptionSession
          session_name="Actors"
          :descriptions="movies[0].actors"
        />

        <v-divider />

        <DescriptionSession
          session_name="Directed by"
          :descriptions="movies[0].director"
        />             
      </v-col>
    </v-row>
    </v-card>

    <v-card
      class="mx-auto mt-9 pa-4"
      max-width="1024"
      rounded="lg"
    >
      <h1>Similar Movies</h1>
      <RecommendedMovies
        :movie_group="movies[0].similarMovies"
      />
    </v-card>
  </v-container>
</template>

<script>
import DescriptionSession from '../components/DescriptionSession';
import RecommendedMovies from '../components/RecommendedMovies';
import gql from 'graphql-tag';


export default {
  components:{
    DescriptionSession,
    RecommendedMovies
  },
  data(){
    return {
      editRate: 0,
    }
  },
  beforeMount(){
    if(!this.userData){
      this.$router.push('/')
    }
    this.$apollo.queries.movies.refresh()
  },
  apollo: {
      movies: {
          query: require('../graphql/Movies.query.gql'),
          variables(){
              let title = this.$route.params.title.replace(/&amp;/g, '&');
              return {
                  where: {
                      title
                  },
                  ratedByUserWhere2: {
                    _id: this.userData.id
                  },
                  ratedConnectionWhere2: {
                    node: {
                      title
                    }
                  }
              }
          },
          fetchPolicy: 'cache-and-network'
      }
    },
    watch: {
      movies(){
        this.editRate = this.movies[0].ratedByUser[0]?.ratedConnection.edges[0].rating || 0;
      }
    },
    methods: {
      async changeMovieRate(value){
        console.log(value)
        
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation UpdateMovieRateUsers($where: UserWhere, $update: UserUpdateInput, $ratedConnectionWhere2: UserRatedConnectionWhere) {
              updateUsers(where: $where, update: $update) {
                users {
                  ratedConnection(where: $ratedConnectionWhere2) {
                    edges {
                      rating
                      movieTitle
                    }
                  }
                }
              }
            }
          `,
          variables: {
            where: {
              name: this.userData.name,
            },
            update: {
              rated: [
                {
                  connect: [
                    {
                      where:{
                        node: {
                          title: this.$route.params.title.replace(/&amp;/g, '&')
                        }
                      },
                      edge: {
                        movieTitle: this.$route.params.title.replace(/&amp;/g, '&'),
                        rating: value
                      }
                    }
                  ]
                }
              ]
            },
            ratedConnectionWhere2: {
              edge: {
                movieTitle: this.$route.params.title.replace(/&amp;/g, '&')
              }
            }
          }
        });

        this.editRate = result.data.updateUsers.users[0]?.ratedConnection.edges[0].rating

      }
    },
    computed:{
      userData(){
        return JSON.parse(localStorage.getItem('@MovieFy_userData'))
      }
    }  
  }
</script>
