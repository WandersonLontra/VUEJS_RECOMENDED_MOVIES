<template>
    <v-container>
        <v-sheet
            class="mx-auto"
            elevation="2"
            max-width="1024"
        >
            <v-slide-group
            v-model="model"
            active-class="warning"
            show-arrows
            >
            <v-slide-item
                v-for="(movie,i) in movie_group"
                :key="`movie-${i}`"
                v-slot="{ active }"
            >
                <v-card
                    :color="active ? undefined : 'primary lighten-1'"
                    class="ma-2"                    
                    width="220"
                    @click="movieClicked(movie.title)"
                >
                    <v-img 
                        :src="movie.imageUrl" 
                    
                        
                        max-height="200"
                        position=" center top"
                        
                    />
                    <v-card-text class="py-4 px-2 ">
                            <h3
                                class="pa-0 text-subtitle-2 white--text font-weight-medium"
                            >
                                {{ movie.title }}
                            </h3>
                            
                            <p class="mt-auto">imdb {{ movie.imdbRating }}</p>

                    </v-card-text>
            </v-card>
            </v-slide-item>
            </v-slide-group>
        </v-sheet>
    </v-container>
</template>

<script>
export default {
 name: 'RecommendedMovies',
 props: {
     movie_group : {
         type: Array,
         required: true,
     }
 },
 methods: {
     movieClicked(movieTitle){
         console.log(movieTitle)
         this.$router.push({name: "MoviePage", params: {title: movieTitle}});
     }
 }
}
</script>

<style>

</style>