<template>
  <v-container class="d-flex justify-center flex-column" style="height: 100%">
    <v-card
        width="600"
        class="mx-auto mt-9"
        rounded="lg"
        :loading="$apollo.loading"
    >
        <v-card-title >
            <h1 class="display-1 my-5 pl-5">Login</h1>
        </v-card-title>
        <v-card-tex>
            <v-form  class="px-7">
                <v-text-field
                    v-model="userName"
                    clearable
                    outlined
                    
                    name="name"
                    label="Username"
                    append-icon="mdi-account"
                />                
            </v-form>
        </v-card-tex>
        <v-card-actions class="px-7 pb-7">
          <v-btn color="success" @click="signUpAction" :loading="$apollo.queries.users.loading">Sign Up</v-btn>
          <v-spacer/>
          <v-btn color="info" @click="loginAction" :loading="$apollo.queries.users.loading">Login</v-btn>   
        </v-card-actions>
    </v-card>

    <v-snackbar
        v-model="snackbar"
        absolute
        top
        :color="snackbarColor"
        dark
    >
        {{ snackbarText }}
      <v-btn color="pink" text @click="snackbar = false">
        <v-icon style="left: 10px">
            {{ snackbarIcon }}
        </v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
    import gql from 'graphql-tag';
    import { v4 as uuidv4 } from 'uuid';

    uuidv4
    export default {
        name: 'LoginPage',
        data(){
            return {
                users: [],
                userName: '',
                checkUserName: '',
                isExist: false,
                snackbarColor: '',
                snackbarText: '',
                snackbarIcon: '',
                snackbar: false
            }
        },
        apollo: {
            users: {
                query: gql`
                    query userSearch($where: UserWhere) {
                        users(where: $where) {
                            _id
                            name
                        }
                    }
                `,
                variables(){
                    return{
                        where: {
                            name: this.userName
                        }
                    }
                }
            }
        },
        watch: {
            userName(){
                this.userName = this.userName.toUpperCase();
            },
            users(){
                this.isExist = !!this.users[0]
            }
        },
        methods: {
            async signUpAction(){                
                if(this.isExist){
                    this.snackbarColor = 'warning';
                    this.snackbarText= 'This username has already been used!'
                    this.snackbarIcon = 'mdi-close-circle';
                    this.snackbar = true;

                    this.isExist = false;

                    return
                }
            },
            async loginAction(){
                if(this.isExist){
                    const userData = {
                        id: this.users[0]._id,
                        name: this.users[0].name,
                    }

                    await localStorage.clear();
                    await localStorage.setItem('@MovieFy_userData',JSON.stringify(userData));

                    this.$router.push('/home').catch(() => {});

                    this.isExist = false;

                    return
                }
            }
        }
    }
</script>
