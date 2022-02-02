<template>
   <v-container  class="mt-9">
       <v-snackbar
            v-model="snackbar"
            absolute
            top
            :color="snackbarColor"
            dark
        >
            {{ snackbarText }}
            <v-icon style="left: 10px">
                {{ snackbarIcon }}
            </v-icon>
        </v-snackbar>

        <v-form ref="createGenreForm" @submit="submitGenres">
            <h1>Create Genre</h1>
            <v-text-field 
                outlined
                v-model="name"
                label="Name"
                required
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
    export default {
       data(){
           return{
               name: '',
               genresList: [''],
               snackbarColor: '',
               snackbarText: '',
               snackbarIcon: '',
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
           async submitGenres(event){
                event.preventDefault();

                const capitalizedName = this.name[0].toUpperCase() + this.name.slice(1);
                const isGenreExist = this.genresList.includes(capitalizedName);

                if(!isGenreExist){
                    const result = await this.$apollo.mutate({
                        mutation: require('../graphql/CreateGenre.mutation.gql'),
                        variables: {
                           input: [{
                               name: capitalizedName
                           }] 
                        }
                    });


                    this.snackbarColor = 'success';
                    this.snackbarText = 'Created with success!';
                    this.snackbarIcon = 'mdi-checkbox-marked-circle';
                    this.snackbar = result.data.createGenres.genres[0].name === this.name;

                    this.genresList.push(capitalizedName)

                    if(this.snackbar) this.$refs.createGenreForm.reset();

                } else {
                    this.snackbarColor = 'warning';
                    this.snackbarText = 'This genre has already been created!';
                    this.snackbarIcon = 'mdi-alert-circle';
                    this.snackbar = true;
                }

           }
       }
    }
</script>