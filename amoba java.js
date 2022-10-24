get = id => document.getElementById(id)
class Table {
    constructor(row, collumn, winner) {
        this.rowN = row;
        this.collumnN = collumn;
        this.winner = winner;
        this.notes = Array(row).fill().map((_, i) => {
            return Array(collumn).fill().map((_, j) => {
                return {
                    val: "E",
                    row: i,
                    col: j,
                    diaL: i + j,
                    diaR: (i - j) + (collumn - 1)
                }
            })
        })
    }
    genDerivs() {
        var cols = Array(this.collumnN).fill().map(_ => new Array());
        
        var [diasL, diasR] = Array(2).fill().map(_ => Array(this.collumnN + this.rowN - 1).fill().map(_ => new Array()))

        this.notes.forEach(row => {
            row.forEach(elem => {
                cols[elem.col].push(elem)
                diasL[elem.diaL].push(elem)
                diasR[elem.diaR].push(elem)
            })
        })

        this.cols = cols;
        this.diasL = diasL;
        this.diasR = diasR;
    }
    static getValues(notes) {
        var elems = new Array()
        notes.forEach(row => {
            row.forEach(elem => {
                elems.push(elem);
            })
        })
        return elems.map(elem => elem.val);
    }
    htmlDisplay(name) {
        var code = "";
        this.notes.forEach(row => {
            code += "<tr>"
            row.forEach(elem => {
                code += 
                    `<td\
                    id='${elem.row}${elem.col}'\
                    onclick='this.innerHTML == "" && ${name}.clack(this.id)'></td>`;
            })
            code += "</tr>"
        })
        return code
    }
    clack(id) {
        if (this.won) {return}

        var row = id[0]
        var col = id[1]
        var symbol = ["X", "O"][player];
        get(id).innerHTML = symbol;
        this.notes[row][col].val = symbol;
        player = (player + 1) % 2; //switch between 0 and 1

        this.genDerivs();
        //console.log(this.diasL, this.diasR);
        var values = [this.notes, this.cols, this.diasL, this.diasR].map(elem => Table.getValues(elem))

        values.forEach(elem => {
            var el = elem.join("");
            if (el.includes(symbol.repeat(this.winner))) {
                get("state").innerHTML = symbol + " wins"
                this.won = true;
            }
        })
    }
    clear() {
        this.notes.forEach(row => {
            row.forEach(elem => {
                elem.val = "E"
            })
        })
        this.won = false;
    }
}
var player = 0
var table = new Table(12, 10, 5);
function start() {
    table.clear();
    get("state").innerHTML = "Ongoing"
    get("game").innerHTML = table.htmlDisplay("table");
}