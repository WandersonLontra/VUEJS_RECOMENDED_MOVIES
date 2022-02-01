<template>
        <v-sheet
            class="mx-auto my-4"
            max-width="1024"
        >
            <v-slide-group
                active-class="warning"
                class="pa-2"
                show-arrows
            >
                <v-slide-item
                    v-for="(movie,i) in movie_group"
                    :key="`movie-${i}`"
                    v-slot="{ active }"
                >
                    <v-card
                        :color="active ? undefined : 'primary lighten-1'"
                        class="ma-2 d-flex flex-column movie_texts"                    
                        width="220"
                        @click="movieClicked(movie.title)"
                        rounded="lg"
                    >
                        <v-img 
                            :src="movie.imageUrl" 
                            max-height="200"
                            position=" center top"
                        />
                        <v-card-text class="px-2 pt-3">
                            <h3
                                class="text-subtitle-2 white--text font-weight-medium mb-5"
                            >
                                {{ movie.title }}
                            </h3>
                            <span>imdb {{ movie.imdbRating }}</span>
                        </v-card-text>
                    </v-card>
                </v-slide-item>
            </v-slide-group>
        </v-sheet>

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
        this.$router.push({name: "MoviePage", params: {title: movieTitle}}).catch(()=>{});
     }
 }
}
</script>

<style lang="scss">
    div.movie_texts{
        position: relative;
        
        div.v-card__text{
            span{
                position: absolute;
                bottom: 10px; left: 8px;
            }
        }
    }
</style>