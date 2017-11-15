<template>
    <div id="results">
        <v-container fluid grid-list-md>
            <v-layout row wrap>
                <v-flex xs12>
                    <v-card if="upcard">
                        <v-card-text>
                            <p>Les fichiers doivent être des images (<code>.png</code>, <code>.jpg</code>, ...). Les feuilles peuvent être scannées à l'envers.</p>
                            <form ref="fiform">
                                <input type="file" name="filelist" id="filelist" accept="image/*" @change="filechange" ref="fileinput" multiple/>
                            </form>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex d-flex xs12 md4>
                    <v-card height="fit-content">
                        <v-card-title class="title">File d'attente</v-card-title>
                        <v-card-text>
                            <v-data-table
                                    v-bind:headers="fileheaders"
                                    no-data-text="Liste vide"
                                    :items="files.filter(f => f.status !== 2)"
                                    hide-actions
                                    class="elevation-0" >
                                <template slot="items" scope="props">
                                    <td>{{ props.item.filename }}</td>
                                    <td class="text-xs-right">
                                        <v-progress-circular indeterminate color="primary" v-if="props.item.status"></v-progress-circular>
                                        <v-icon v-else>schedule</v-icon>
                                    </td>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex d-flex xs12 md8>
                    <v-card>
                        <v-card-title class="title">Résultats</v-card-title>
                        <v-card-text>
                            <v-data-table
                                    v-bind:headers="resultheaders"
                                    no-data-text="Liste vide"
                                    :items="results"
                                    hide-actions
                                    class="elevation-0" >
                                <template slot="items" scope="props">
                                    <td>{{ props.item.category }}</td>
                                    <td class="text-xs-right">{{ props.item.sex }}</td>
                                    <td class="text-xs-right">{{ props.item.name }}</td>
                                    <td class="text-xs-right">{{ props.item.voies }}</td>
                                    <td class="text-xs-right">{{ props.item.blocs }}</td>
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
import ImageCompressor from '@xkeshi/image-compressor';

export default {
    name: 'scan-results',
    data () {
        return {
            fileheaders: [
                {
                    text: 'Nom du fichier',
                    value: 'filename',
                    align: 'left',
                    sortable: false
                },
                {
                    text: 'Status',
                    value: 'loading',
                    align: 'right'
                }
            ],
            resultheaders: [
                {
                    text: 'Catégorie',
                    value: 'category',
                    align: 'left'
                },{
                    text: 'Sexe',
                    value: 'sex',
                    align: 'right'
                },{
                    text: 'Nom',
                    value: 'name',
                    align: 'right'
                },{
                    text: 'Voies',
                    value: 'voies',
                    align: 'right'
                },{
                    text: 'Blocs',
                    value: 'blocs',
                    align: 'right'
                }
            ],
            results: [],
            files: []
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
                new ImageCompressor(file, {
                    quality: .9,
                    maxWidth: 620,
                    success: (res) => {
                        const reader = new FileReader();
                        reader.onload = (r) => {
                            this.files.push({
                                filename: res.name,
                                content: toBase64(r.target.result),
                                status: 0
                            });
                            this.updateQueue();
                        };
                        reader.readAsArrayBuffer(res);
                    }
                });
            });
            form.reset();
        },
        submit(file) {
            file.status++;
            fetch(`${process.env.BACKEND_URL}/parsescanned`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    base64: file.content
                })
            })
                .then(r => r.json())
                .then(r => {
                    this.results.push({
                        name: r.name.split(',').slice(-2).join(' '),
                        sex: r.name.split(',')[1],
                        category: r.name.split(',')[0],
                        voies: Object.keys(r.results).filter(k => k.includes('v') && r.results[k] === 'yes').length,
                        blocs: Object.keys(r.results).filter(k => k.includes('b') && r.results[k] === 'yes').length,
                        raw: r.results
                    });
                    file.status++;
                    this.updateQueue();
                })
                .catch(e => console.log(e));
        },
        updateQueue() {
            if(this.files.filter(f => f.status === 1).length < 3 && this.files.filter(f => f.status === 0).length) {
                this.submit(this.files.find(f => f.status === 0));
            }
        }
    }
};
</script>

<style scoped>
#results {
    width: 100%;
}
</style>
