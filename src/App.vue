<template>
    <v-app id="app">
        <v-navigation-drawer persistent v-model="drawer" enable-resize-watcher clipped app>
            <v-list>
                <v-list-tile to="/home">
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Accueil</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-group v-for='group in routes' :value="group.active" :key="group.id" no-action>
                    <v-list-tile slot="item">
                        <v-list-tile-content>
                            <v-list-tile-title>{{ group.name }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-icon>keyboard_arrow_down</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile v-for="route in group.items" :key="route.route" :to="route.route">
                        <v-list-tile-action>
                            <v-icon>{{ route.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>{{ route.name }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar fixed app clipped-left>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Speratica</v-toolbar-title>
        </v-toolbar>
        <main>
            <v-content>
                <v-container fluid fill-height>
                    <v-layout>
                        <router-view></router-view>
                    </v-layout>
                </v-container>
            </v-content>
        </main>
    </v-app>
</template>

<script>
export default {
    data: () => ({
        drawer: true,
        routes: [
            {
                id: 'before',
                name: 'Avant la compétition',
                items: [
                    {
                        name: 'Générer les codes QR',
                        route: '/generate-qrs',
                        icon: 'people'
                    }
                ]
            },{
                id: 'after',
                name: 'Après la compétition',
                items: [
                    {
                        name: 'Scanner et analyser les feuilles',
                        route: '/scan-results',
                        icon: 'scanner'
                    }
                ]
            }
        ]
    }),
    mounted () {
        // open the group containing the current route
        this.routes = this.routes.map(route => Object.assign(route, {active: route.items.some(({route}) => route === this.$route.path)}));
    }
};
</script>
