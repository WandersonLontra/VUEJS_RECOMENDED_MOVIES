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
        <v-img :src="people[0].imageUrl" max-width="500"/>
      </v-col>

      <v-col
        align-self="start"
        cols="12"  
        lg="6"
      >
        <h1 class="text-h4 font-weight-bold mb-7">{{ people[0].name }}</h1>

        <v-divider />

        <DescriptionSession
          v-if="people[0].acted_inConnection.edges.length > 0"
          session_name="Acted In"
          :descriptions="people[0].acted_inConnection.edges"
          hasMovie
        /> 

        <v-divider v-if="people[0].directed.length > 0"/>

        <DescriptionSession
          v-if="people[0].directed.length > 0"
          session_name="Directed"
          :descriptions="people[0].directed"
          isDirector
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
      },
      apollo: {
        people: {
          query: require('../graphql/People.query.gql'),
          variables(){
            return{
              where: {
                name: this.personName
              }
            }
          }
        }
      },
      watch: {
        people(person){
          console.log({person})
        }
      }
    }
</script>

<style>

</style>