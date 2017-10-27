<template>
    <div id="gqrel">
        <h2 class="exp">Choisir le fichier de la liste des participants</h2>
        <p>Le fichier doit être au format <code>.csv</code> ou <code>.xlsx</code> (Excel)</p>
        <a href="https://docs.google.com/spreadsheets/d/1_kpY--kRb8k2O1QUqyuoeZ1_CAErPYkbrNufdvWpcsc/edit?usp=sharing" target="_blank">Feuille modèle</a><br>
        <input type="file" name="participants" id="participants" value="" ref="fi" />
        <div class="content" v-if="csv.length">
            <table>
                <tr>
                    <th>Catégorie</th>
                    <th>Sexe</th>
                    <th>Prénom</th>
                    <th>Nom</th>
                </tr>
                <tr v-for="line in csv" :key="line">
                    <td v-for="elem in line.split(',')" :key="line + elem">{{elem}}</td>
                </tr>
            </table>
        </div>
        <a class="button" v-on:click="submit()" ref="submit" v-if="csv.length">{{loading ? '...' : 'Générer les code QR'}}</a>
        <div class="result">
            <img class="result-img" :src="'data:image/png;base64,' + img" v-for="img in result" :key="img" />
        </div>
    </div>
</template>
<script>
import toBase64 from 'arraybuffer-base64';
import XLSX from 'xlsx';

export default {
    name: 'generate-qrs',
    data () {
        return {
            csv: [],
            result: [],
            loading: false,
        };
    },
    mounted() {
        const input = this.$refs.fi;
        input.onchange = () => {
            this.csv = [];
            this.result = [];
            const file = input.files[0];
            const reader = new FileReader();

            if(file.name.endsWith('csv')) {
                reader.onload = content => this.csv = content.target.result.split('\n').slice(1);
                reader.readAsText(file);
            } else if(file.name.endsWith('xlsx')){
                reader.onload = content => {
                    const worksheet = XLSX.read(toBase64(content.target.result), {type:'base64'});
                    console.log(worksheet, worksheet.SheetNames);
                    const sheet = worksheet.Sheets[worksheet.SheetNames[0]];
                    this.csv = XLSX.utils.sheet_to_csv(sheet).split('\n').slice(1).filter(e=>/[a-z]/gi.test(e));
                };
                reader.readAsArrayBuffer(file);
            } else {
                setTimeout(() => alert('Type de fichier incompatible'), 1000);
            }
        };
    },
    methods: {
        submit() {
            if(this.loading) return;
            this.loading = true;
            fetch('http://localhost:3000/csvtoqr', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    list: this.csv
                })
            }).then(r => r.json()).then(images => {this.result = images, this.loading = false;});
        }
    }
};
</script>

<style scoped>

#gqrel {
    text-align: center;
    padding-top: 80px;
}

input {
    padding: 30px;
}

.content {
    padding: 10px;
    width: fit-content;
    margin: 0 auto;
}

td {
    padding-left: 10px;
    padding-right: 10px;
}

table, th, td {
    border: 1px solid grey;
    border-collapse: collapse;
}

a.button, a.button:visited {
    display: block;
    cursor: pointer;
    width: fit-content;
    margin: 0 auto;
    margin-bottom: 10px;
    margin-top: 10px;
    text-decoration: none;
    background-color: #fafafa;
    border: none;
    font-weight: 600;
    font-size: 17px;
    padding: 10px 40px;
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 #2a2a2a;
    transition: all .1s;
}

a.button:hover {
    background-color: #fff;
    box-shadow: 0 2px 10px 0 #2a2a2a;
}

a, a:visited {
    color: #1c1c1c;
}

.exp {
    padding-top: 10px;
    margin-top: 0px;
}

.result-img {
    max-width: calc(50% - 6px);
    display: block;
    padding: 5px;
    margin: 0 auto;
    border: 2px solid #444444;
    border-bottom: 0;
}

.result {
    padding-bottom: 75px;
}

.result-img:last-child {
    border-bottom: 2px solid #444444;
}
</style>
