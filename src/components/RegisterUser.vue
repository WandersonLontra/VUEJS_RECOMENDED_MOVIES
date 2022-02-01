<template>
    <v-container>
        <v-card-title >
            <h1 class="display-1 my-5 ">Select your favorite genres</h1>
        </v-card-title>
        <v-card-text>
            <v-item-group
                v-model="genresSelected"
                multiple
            >
                <v-row>
                    <v-col
                        v-for="(genre,i) in genres"
                        :key="genre.name+i"
                        cols="12"
                        md="4"
                    >
                        <v-item :value="genre.name" v-slot="{active, toggle}">
                            <v-card
                                :color="active ? 'primary' : 'grey'"
                                class="d-flex align-center"
                                dark
                                height="100"
                                @click="toggle"
                            >
                                <div
                                    v-if="active"
                                    class="text-h5 flex-grow-1 text-center"
                                >
                                    {{genre.name}}
                                </div>
                                <div 
                                    v-else
                                    class="text-h5 flex-grow-1 text-center"
                                >
                                    {{genre.name}}
                                </div>
                            </v-card>
                        </v-item>
                    </v-col>
                </v-row>
            </v-item-group>
        </v-card-text>

        <v-card-actions>
            <v-btn
              color="info"
              block
              large
              elevation="4"
              :disabled="this.genresSelected.length === 0"
              @click="sendGenres"  
            >
                Send
            </v-btn>
        </v-card-actions>
    </v-container>
</template>

<script>
    import { v4 as uuidv4 } from 'uuid';
    
    const UUID = uuidv4();

    export default {
        name: 'RegisterUser',
        props: {
            userName: String,
            isUpdating: Boolean,
            genresSelected: Array
        },
        data(){
            return{
                selected: []
            }
        },
        apollo:{
            genres: require('../graphql/Genres.query.gql'),
        },
        methods: {
            async sendGenres(){

                const genresListConfigured = this.genresSelected.filter(el => el != '').reduce((acc,sum) => {
                    acc.push({name: sum})
                    return acc
                },[])

                if(!this.isUpdating){
                    const createUser = await this.$apollo.mutate({
                        mutation: require('../graphql/CreateUser.mutation.gql'),
                        variables: {
                            input: [{
                                _id: UUID,
                                name: this.userName,
                                liked_genres: {
                                    connect: [{
                                        where: {
                                            node: {
                                                OR: genresListConfigured
                                            }
                                        }
                                    }]
                                }
                            }]
                        }
                    })

                    const userData = {
                        id: createUser.data.createUsers.users[0]._id,
                        name: createUser.data.createUsers.users[0].name,
                    }

                    await localStorage.clear();
                    await localStorage.setItem('@MovieFy_userData',JSON.stringify(userData));

                    this.$router.push('/home').catch(() => {});

                } else {

                    const updateUser = await this.$apollo.mutate({
                        mutation: require('../graphql/UpdateUser.mutation.gql'),
                        variables: {
                            where: {
                                name: this.userName,
                            },
                            update: {
                                liked_genres: [{
                                    disconnect: [{}],
                                    connect: [{
                                        where: {
                                            node: {
                                                OR: genresListConfigured
                                            }
                                        }
                                    }]
                                }]
                            }
                        }
                    })

                    const userData = {
                        id: updateUser.data.updateUsers.users[0]._id,
                        name: updateUser.data.updateUsers.users[0].name,
                    }

                    await localStorage.clear();
                    await localStorage.setItem('@MovieFy_userData',JSON.stringify(userData));

                    this.$emit('closeDialog')
                }
            }
        }
    }
</script>
