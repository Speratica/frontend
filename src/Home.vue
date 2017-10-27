
<template>
    <div id="home">
        <div class="links">
            <router-link to="/generate-qrs">Génération des QR Codes</router-link>           
            <router-link to="/scan-results">Scan des résultats</router-link>           
        </div>
    </div>
</template>
<script>
export default {
    name: 'home'
};
</script>

<style scoped>
#home {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
}

a, a:visited {
    display: block;
    width: fit-content;
    margin: 0 auto;
    margin-bottom: 10px;
    margin-top: 10px;
    text-decoration: none;
    background-color: #fafafa;
    color: #1c1c1c;
    border: none;
    font-weight: 600;
    font-size: 17px;
    padding: 10px 40px;
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 #2a2a2a;
    transition: all .1s;
}

a:hover {
    background-color: #fff;
    box-shadow: 0 2px 10px 0 #2a2a2a;
}

.links {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
}


</style>
