<template>
    <div id="scan-results">
        <h2 class="exp">Choisir le ou les feuilles scannées</h2>
        <p>Les fichiers doivent être au format <code>.jpg</code>, <code>.png</code> ou <code>.pdf</code></p>
        <form ref="fiform">
            <input type="file" name="filelist" id="filelist" value="" ref="fileinput" />
        </form>
        <table v-if="scans.length">
            <tr>
                <th>Fichier</th>
                <th></th>
            </tr>
            <tr v-for="scan in scans" :key="scan.content">
                <td>{{scan.filename}}</td>
                <td class="delete" v-on:click="del(scan)">×</td>
            </tr>
        </table>
        <a class="button" v-on:click="submit()" ref="submit" v-if="scans.length">{{loading ? '...' : 'Analyser les résultats'}}</a>
    </div>
</template>
<script>
import toBase64 from 'arraybuffer-base64';

export default {
    name: 'scan-results',
    data () {
        return {
            scans: [],
            loading: false,
        };
    },
    mounted() {
        const input = this.$refs.fileinput;
        const form = this.$refs.fiform;
        input.onchange = () => {
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

#scan-results {
    text-align: center;
}

table {
    margin: 0 auto;
}

form {
    padding-bottom: 50px;
}

.delete {
    padding-left: 30px;
    cursor: pointer;
    font-weight: bold;
    color: red;
}

.exp {
    padding-top: 50px;
    margin-top: 0px;
}

a.button, a.button:visited {
    display: block;
    width: fit-content;
    cursor: pointer;
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
    margin-top: 70px;
}

a.button:hover {
    background-color: #fff;
    box-shadow: 0 2px 10px 0 #2a2a2a;
}
</style>
