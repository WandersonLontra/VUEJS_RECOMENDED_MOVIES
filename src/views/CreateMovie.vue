<template>
   <v-container  class="mt-9">
       <v-snackbar
            v-model="snackbar"
            absolute
            top
            color="success"
            dark
        >
            Cadastrado com sucesso!
            <v-icon style="left: 10px">
                mdi-checkbox-marked-circle
            </v-icon>
        </v-snackbar>
        <v-form ref="createMovieForm" @submit="submitMovies">
            <h1>Create Movie</h1>
            <v-text-field 
                outlined
                v-model="title"
                label="Title"
                required
            />
            <v-text-field 
                outlined
                v-model="year"
                type="number"
                label="Year"
                placeholder="2022"
                required
            />
             <v-text-field 
                outlined
                v-model="imdbRating"
                type="number"
                label="imdbRating"
                placeholder="8.9"
                required
            />
             <v-text-field 
                outlined
                v-model="imageUrl"
                label="Image URL"
                placeholder="http://"
                required
            />
            <v-select 
                outlined
                v-model="genresSelected"
                :items="genresList"
                label="Genres Selection"
                chips
                multiple
                persistent-hint
            />
            <v-textarea 
                outlined
                label="Movie Plot"
                v-model="plot"
            />

            <v-btn
                block
                large
                elevation="3"
                color="primary"
                type="submit"
                :loading="$apollo.loading"
            >
                Enviar    
            </v-btn>            
        </v-form>
   </v-container>
</template>
<script>
    import { v4 as uuidv4 } from 'uuid';

    const UUID = uuidv4();

    export default {
       data(){
           return{
               title: '',
               year: null,
               imdbRating: null,
               imageUrl: '',
               plot: '',
               genresSelected:[],
               genresList: null,
               snackbar: false
           }
       },
       apollo: {
           genres: require('../graphql/Genres.query.gql')
       },
       watch: {
           genres(){
                this.genresList = this.genres.reduce((acc,sum) => {
                    acc.push(sum.name);
                    return acc
                },[])
           }
       },
       methods: {
           async submitMovies(event){
                event.preventDefault();

                const genresListConfigured = this.genresSelected.filter(el => el != '').reduce((acc,sum) => {
                    acc.push({name: sum})
                    return acc
                },[])

                const result = await this.$apollo.mutate({
                    mutation: require('../graphql/CreateMovie.mutation.gql'),
                    variables: {
                       input: [{
                           _id: UUID,
                           title: this.title,
                           year: parseInt(this.year),
                           imdbRating: parseFloat(this.imdbRating),
                           imageUrl: this.imageUrl,
                           plot: this.plot,
                           genres: {
                               connect: [{
                                   where: {
                                       node:{
                                           OR: genresListConfigured
                                       }
                                   }
                               }]
                           }
                       }] 
                    }
                })
                
                this.snackbar = result.data.createMovies.movies[0].title === this.title

                if(this.snackbar) this.$refs.createMovieForm.reset()

           }
       }
    }
</script>