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
        <!-- <v-img :src="movies[0].imageUrl" max-width="500"/> -->
      </v-col>

      <v-col
        align-self="start"
        cols="12"  
        lg="6"
      >
        <h1 class="text-h4 font-weight-bold">{{ personName }}</h1>
        <v-card-subtitle 
          class="text-subtitle-1 grey--text text--darken-1"
        >
          <!-- {{ `${movies[0].year} / imdb ${movies[0].imdbRating}` }} -->
        </v-card-subtitle>

        <v-divider/>

        <v-card-text class="text-subtitle-1 grey--text font-weight-medium">
          <!-- {{ movies[0].plot }} -->
        </v-card-text>

        <v-divider />
<!-- 
        <DescriptionSession
          session_name="Genres"
          :descriptions="movies[0].genres"
        /> 

        <v-divider />

        <DescriptionSession
          session_name="Actors"
          :descriptions="movies[0].actors"
          isPerson
        />

        <v-divider />
-->
        <DescriptionSession

        />  

      </v-col>
    </v-row>
    </v-card>
  </v-container>
</template>

<script>
    import DescriptionSession from '../components/DescriptionSession';

    export default {
        name: 'PersonPage',
        components: {DescriptionSession},
        data(){
            return{
                personName: this.$route.params.name.replace(/&amp;/g, '&')
            }
        }
    }
</script>

<style>

</style>