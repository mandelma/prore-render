<template>
  <div>
    Here is user panel to display users
    <ul v-for="user in users.users" :key="user.id">
      <li>
        {{user.username}}
      </li>
    </ul>
  </div>
  {{users}}
</template>

<script>
export default {
  name: "user-panel",
  props: {
    users: Array
  }
}
</script>

<style scoped>

</style>