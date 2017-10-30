<template>
    <div id="gqrel">
        <v-stepper v-model="e6" vertical>
            <v-stepper-step step="1" :complete="e6 > 1">
                Choix du fichier contenant la liste des participants
            </v-stepper-step>
            <v-stepper-content step="1">
                <div class="firststep">
                    Le fichier doit être au format <code>.csv</code> ou <code>.xlsx</code> (Excel).
                    <v-tooltip right>
                        <a href="/public/participants.xlsx" target="_blank" slot="activator">Voir la feuille modèle</a>
                        <span>Le fichier que vous devez donner<br>doit correspondre à ce format</span>
                    </v-tooltip>
                    <br>
                    <!-- TODO: Use a custom component here -->
                    <input type="file" name="participants" id="participants" value="" @change="change" ref="fi" />
                </div>
            </v-stepper-content>
            <v-stepper-step step="2" :complete="e6 > 2">
                Vérification de la liste des participants
            </v-stepper-step>
            <v-stepper-content step="2">
                <div class="table-container">
                    <v-data-table :items="tabledata" :headers="headers" class="elevation-1" 
                        rows-per-page-text="Lignes par pages" :rows-per-page-items="rowsPerPage">
                        <template slot="headers" slot-scope="props">
                            <tr>
                                <th v-for="header in props.headers" class="column" :key="header.text">{{ header.text }}</th>
                            </tr>
                        </template>
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-center">{{ props.item.category }}</td>
                            <td class="text-xs-center">{{ props.item.sex }}</td>
                            <td class="text-xs-center">{{ props.item.fname }}</td>
                            <td class="text-xs-center">{{ props.item.sname }}</td>
                        </template>
                    </v-data-table>
                </div>
                <v-btn color="primary" @click.native="submit(e6++)">Valider</v-btn>
                <v-btn @click.native="e6--" flat>Annuler</v-btn>
            </v-stepper-content>
            <v-stepper-step step="3" :complete="e6 > 3">
                Récupération des codes QR à imprimer
            </v-stepper-step>
            <v-stepper-content step="3">
                <div class="picscontainer">
                    <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
                    <img class="result elevation-4":src="'data:image/png;base64,' + img" v-for="img in result" :key="img">
                    <br>
                    <v-btn @click.native="e6--">Retour</v-btn>
                </div>
            </v-stepper-content>
        </v-stepper>
    </div>
</template>
<script>
import toBase64 from 'arraybuffer-base64';
import * as xlsx from 'xlsx';

export default {
    name: 'generate-qrs',
    data () {
        return {
            csv: [],
            headers: [{
                text: 'Catégorie',
                value: 'category'
            },{
                text: 'Sexe',
                value: 'sex'
            },{
                text: 'Prénom',
                value: 'fname'
            },{
                text: 'Nom de famille',
                value: 'sname'
            }],
            rowsPerPage: [10, 15, 20,30,50,{text:'Toutes',value:-1}],
            result: [],
            e6: 1,
            loading: false,
        };
    },
    computed: {
        tabledata () {
            return this.csv.map(line => line.split(',')).map(r => ({
                category: r[0],
                sex: r[1],
                fname: r[2],
                sname: r[3]
            }));
        }
    },
    methods: {
        submit() {
            if(this.loading) return;
            this.loading = true;
            fetch(`${process.env.BACKEND_URL || 'http://localhost:3000'}/csvtoqr`, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    list: this.csv
                })
            }).then(r => r.json()).then(images => {this.result = images, this.loading = false;});
        },
        change ({target: input}) {
            this.csv = [];
            this.result = [];
            const file = input.files[0];
            const reader = new FileReader();

            if(file.name.endsWith('csv')) {
                reader.onload = content => this.csv = content.target.result.split('\n').slice(1), this.e6 += 1;
                reader.readAsText(file);
            } else if(file.name.endsWith('xlsx')){
                reader.onload = content => {
                    const worksheet = xlsx.read(toBase64(content.target.result), {type:'base64'});
                    console.log(worksheet, worksheet.SheetNames);
                    const sheet = worksheet.Sheets[worksheet.SheetNames[0]];
                    this.csv = xlsx.utils.sheet_to_csv(sheet).split('\n').slice(1).filter(e=>/[a-z]/gi.test(e));
                    this.e6++;
                };
                reader.readAsArrayBuffer(file);
            } else {
                // TODO: Use error message instead of alert
                setTimeout(() => alert('Type de fichier incompatible'), 1000);
            }
        }
    }
};
</script>

<style scoped>

#gqrel {
    width: 100%;
}

a, a:visited {
    color: #333;
}

.firststep {
    text-align: center;
}

.firststep input {
    padding: 30px 0;
}

.table-container {
    width: calc(100% - 2px);
    padding-top: 1px;
    margin: 0 auto;
}

.picscontainer {
    width: calc(100% - 2px);
    text-align: center;
}

img.result {
    max-width: 55%;
    padding: 20px;
    margin: 10px;
}
</style>
