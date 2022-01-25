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

        <v-form ref="createPersonForm" @submit="submitPerson">
            <h1>Create Person</h1>
            <v-text-field 
                outlined
                v-model="name"
                label="Name"
                :rules="[() => name.length > 1 || 'Este campo não pode estar vazio!']"
                required
            />
             <v-text-field 
                outlined
                v-model="imageUrl"
                label="Image URL"
                placeholder="http://"
                :rules="[() => imageUrl.length > 1 || 'Este campo não pode estar vazio!']"
                required
            />

            <v-checkbox 
                v-model="actedIn"
                label="Atuou?"
            />
            <v-checkbox 
                v-model="directed"
                label="Dirigiu?"
            />
            <v-text-field
                v-if="actedIn" 
                outlined
                v-model="role"
                :rules="inputRule"
                label="Role"
                required
            />
            <v-select
                v-if="moviesAmount[0]" 
                outlined
                v-model="moviesAmount"
                :items="moviesAmount"
                label="Movies Selected"
                color="primary"
                chips
                multiple
                persistent-hint
            />
            <v-text-field
                outlined
                v-model="movieName"
                label="Movie Name"
                append-icon="mdi-plus-box-multiple"
                @click:append="addMovie"
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
    import gql from 'graphql-tag';
    import { v4 as uuidv4 } from 'uuid';

    const UUID = uuidv4();
    
    export default {
       data(){
           return{
               name: '',
               imageUrl: '',
               actedIn: false,
               directed: false,
               role: '',
               movieName: '',
               moviesAmount: [],
               snackbarColor: '',
               snackbarText: '',
               snackbarIcon: '',
               snackbar: false,
           }
       },
       apollo: {
           movies: {
               query: gql`
                    query CheckMovie($where: MovieWhere) {
                        movies(where: $where) {
                            title
                        }
                    } 
               `,
               variables(){
                   return {
                       where: {
                           title: this.movieName
                       }
                   }
               }
           }
       },
       methods: {
            addMovie(){
                if(!this.movies[0]){
                    this.snackbarColor = 'warning';
                    this.snackbarText = 'Este filme não está cadastrado!';
                    this.snackbarIcon = 'mdi-alert-circle';
                    this.snackbar = true;

                    return
                }

                if(this.moviesAmount.includes(this.movieName)){
                    this.snackbarColor = 'warning';
                    this.snackbarText = 'Filme já selecionado!';
                    this.snackbarIcon = 'mdi-alert-circle';
                    this.snackbar = true;

                    return
                }

                this.moviesAmount.push(this.movieName);

                this.movieName = '';
           },
           async submitPerson(event){
                event.preventDefault();

                const validateForm = await this.$refs.createPersonForm.validate();

                if(!validateForm) return;

                const moviesList = this.moviesAmount.reduce((acc,sum) => {
                    acc.push({title: sum})
                    return acc
                },[])

                let variables = {
                    input: [{
                        _id: UUID,
                        name: this.name,
                        imageUrl: this.imageUrl,
                    }]
                }

                if(this.actedIn && !this.directed){
                    variables = {
                        input: [{
                            _id: UUID,
                            name: this.name,
                            imageUrl: this.imageUrl,
                            acted_in: {
                                connect: [{
                                    where: {
                                        node: {
                                            OR: moviesList
                                        }
                                    },
                                    edge: {
                                        actorsName: this.name,
                                        role: this.role
                                    }
                                }]
                            }
                        }]
                    }
                } else if(this.directed && !this.actedIn){
                    variables = {
                        input: [{
                            _id: UUID,
                            name: this.name,
                            imageUrl: this.imageUrl,
                            directed: {
                                connect: [{
                                    where: {
                                        node: {
                                            OR: moviesList
                                        }
                                    }
                                }]
                            }
                        }]
                    } 
                } else if (this.actedIn && this.directed) {
                    variables = {
                        input: [{
                            _id: UUID,
                            name: this.name,
                            imageUrl: this.imageUrl,
                            acted_in: {
                                connect: [{
                                    where: {
                                        node: {
                                            OR: moviesList
                                        }
                                    },
                                    edge: {
                                        actorsName: this.name,
                                        role: this.role
                                    }
                                }]
                            },
                            directed: {
                                connect: [{
                                    where: {
                                        node: {
                                            OR: moviesList
                                        }
                                    }
                                }]
                            }
                        }]
                    }
                }

                const result = await this.$apollo.mutate({
                    mutation: require('../graphql/CreatePerson.mutation.gql'),
                    variables
                })

                this.snackbarColor = 'success';
                this.snackbarText = 'Cadastrado com sucesso!';
                this.snackbarIcon = 'mdi-checkbox-marked-circle';
                this.snackbar = result.data.createPeople.people[0].name === this.name;

                if(this.snackbar) this.$refs.createPersonForm.reset();
            }
       }
    }
</script>