get = id => document.getElementById(id)
Nai = (length, func) => Array(length).fill().map(func)
const Fills = {
    Def: "rgb(247, 231, 195)",
    Blue: "rgb(130, 190, 214)",
    Red: "rgb(221, 46, 68)"
}
const Heading = {
    Up: 0,
    Right: 1,
    Down: 2,
    Left: 3,
};
class Table {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.notes = Nai(row, (_, i) => {return Nai(col, (_, j) => {return {
                    fill: Fills.Def,
                    row: i,
                    col: j
                }
            })
        })
    }
    display() {
        var code = "";
        this.notes.forEach(row => {
            code += "<tr>"
            row.forEach(elem => {
                code += `<td id="${elem.row}${elem.col}" style="background-color:${elem.fill};">`
                code += "</td>"
            })
            code += "</tr>"
        })
        get("game").innerHTML = code;
    }
    colorIn(row, col, fill) {
        if (this.notes[row][col].fill != Fills.Def) {
            return true
        } 
        this.notes[row][col].fill = fill;
    }
}
class Player {
    constructor(name, x, y, heading, table, fill, controls=["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]) {
        this.name = name;
        this.y = y;
        this.x = x;
        this.heading = heading;
        this.table = table;
        this.fill = fill;
        this.controls = controls;
        table.colorIn(y, x, fill)
    }
    update() {
        [_ => {--this.y < 0 && stopper(this)},
         _ => {++this.x >= this.table.col && stopper(this)},
         _ => {++this.y >= this.table.row && stopper(this)},
         _ => {--this.x < 0 && stopper(this)}
        ][this.heading]();
        if (!stop) {
            if (this.table.colorIn(this.y, this.x, this.fill)) {
                stopper(this);
            }
        }
    }
}

function start() {
    stop = 0;
    var game = new Table(100, 100)
    var player1 = new Player(get("player1").value, 0, 25, Heading.Right, game, Fills.Blue, ["w", "d", "s", "a"])
    var player2 = new Player(get("player2").value, 99, 25, Heading.Left, game, Fills.Red)
    var players = [player1, player2];

    get("state").style.color = Fills.Def;
    get("state").innerHTML = "Ongoing"

    window.addEventListener("keydown", event => {
        players.forEach(player => {
            var head = player.heading;
            var s = player.controls.indexOf(event.key)
            if ((s + 2) % 4 != head && [0, 1, 2, 3].includes(s)) {
                player.heading = s;
            }
        })
    })

    updater = setInterval(() => {
        player1.update()
        game.display()
        player2.update()
        
    }, 50)
}
function stopper(player) {
    stop++;
    get("state").style.color = player.fill;
    get("state").innerHTML = player.name + " has died..."
    clearInterval(updater);
}