<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'app',
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Lato:400,400i,600,700,700i,900,900i&subset=latin-ext');
html, body, #app {
    margin: 0;
    padding: 0;
    font-family: 'Lato', Roboto, Arial, Helvetica, sans-serif;
    height: 100%;
    color: #1c1c1c;
}
</style>
