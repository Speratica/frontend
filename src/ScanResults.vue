<template>
    <div id="results">
        <v-container fluid grid-list-md>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-card if="upcard">
                        <v-card-text>
                            <p>Les fichiers doivent être au format <code>.jpg</code> ou <code>.png</code></p>
                            <form ref="fiform">
                                <input type="file" name="filelist" id="filelist" @change="filechange" ref="fileinput" />
                            </form>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex d-flex xs12 md6>
                    <v-card>
                        <v-card-title class="title">File d'attente</v-card-title>
                        <v-card-text>
                            <v-data-table
                                    v-bind:headers="fileheaders"
                                    :items="files"
                                    hide-actions
                                    class="elevation-1"
                                >
                                <template slot="items" scope="props">
                                    <td>{{ props.item.filename }}</td>
                                    <td class="text-xs-right">{{ props.item.loading }}</td>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex d-flex xs12 md6>
                    <v-card>
                        <v-card-title class="title">Résultats</v-card-title>
                        <v-card-text>
                            <v-data-table
                                    v-bind:headers="headers"
                                    :items="items"
                                    hide-actions
                                    class="elevation-1"
                                >
                                <template slot="items" scope="props">
                                    <td>{{ props.item.name }}</td>
                                    <td class="text-xs-right">{{ props.item.calories }}</td>
                                    <td class="text-xs-right">{{ props.item.fat }}</td>
                                    <td class="text-xs-right">{{ props.item.carbs }}</td>
                                    <td class="text-xs-right">{{ props.item.protein }}</td>
                                    <td class="text-xs-right">{{ props.item.sodium }}</td>
                                    <td class="text-xs-right">{{ props.item.calcium }}</td>
                                    <td class="text-xs-right">{{ props.item.iron }}</td>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>
<script>
import toBase64 from 'arraybuffer-base64';

export default {
    name: 'scan-results',
    data () {
        return {
            scans: [],
            currentstep: 1,
            loading: false,
            fileheaders: [
                {
                    text: 'Nom du fichier',
                    value: 'filename',
                    align: 'left'
                },
                {
                    text: 'Status',
                    value: 'loading',
                    align: 'right'
                }
            ],
            files: [
                {
                    filename: 'lol.png',
                    loading: 0
                }
            ]
        };
    },
    computed: {
        showButton() {
            return !!this.csv.length;
        }
    },
    methods: {
        del(entry) {
            this.scans = this.scans.filter(({filename, content}) => filename !== entry.filename && content !== entry.content);
        },
        filechange ({target: input}) {
            console.log('added file');
            const form = this.$refs.fiform;
            Array.prototype.forEach.call(input.files, file => {
                if(file.name.endsWith('jpg') || file.name.endsWith('png') || file.name.endsWith('pdf')) {
                    const reader = new FileReader();
                    reader.onload = (r) => this.scans.push({
                        filename: file.name,
                        content: toBase64(r.target.result)
                    });
                    reader.readAsArrayBuffer(file);
                } else {
                    setTimeout(() => alert('Type de fichier incompatible'), 1000);
                }
                form.reset();
            });
        },
        submit() {
            if(this.loading) return;
            this.loading = true;
            // fetch('http://localhost:3000/csvtoqr', {
            //     method: 'post',
            //     headers: {
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         list: this.csv
            //     })
            // }).then(r => r.json()).then(images => {this.result = images, this.loading = false;});
        }
    }
};
</script>

<style scoped>
#results {
    width: 100%;
}
</style>
