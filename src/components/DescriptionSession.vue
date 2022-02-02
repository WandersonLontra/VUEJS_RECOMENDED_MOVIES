<template>
  <div>
    <v-card-title class="text-h6 font-weight-bold">{{ session_name }}</v-card-title>

    <v-chip-group column v-if="isPerson">
      <v-chip
        v-for="(description,i) in descriptions"
        :key="description.name+i"
        class="primary lighten-1  white--text"
        @click="$router.push(`/person/${description.name}`)"
      >
        {{ description.name }}
      </v-chip>
    </v-chip-group>

    <v-chip-group column v-else>
      <v-chip
        v-for="(description,i) in descriptions"
        :key="description.name+i"
        class="primary lighten-1  white--text"
        style="cursor: default"
      >
        {{ description.name }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script>
  export default {
    name: 'DescriptionSession',
    props: {
      descriptions: [],
      session_name: String,
      isPerson: Boolean,
    }
  }
</script>
