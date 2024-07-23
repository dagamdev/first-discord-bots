const ms = require("ms")
require("colors")
// Tiempo
const rtf = new Intl.RelativeTimeFormat("es")
// console.log(rtf.format(10, "minutes"))

// Clases

class celulares {
    constructor(color, peso, rdp, rdc, ram){
        this.color = color
        this.peso = peso
        this.resolucionDePantalla = rdp
        this.resolucionDeCamara = rdc
        this.memoriaRam = ram
        this.encendido = true
    }

    encender(){
        if(this.encendido){
            console.log("Apagando dispositivo")
            this.encendido = false
        }else{
            console.log("Encendiendo dispositivo")
            this.encendido = true
        }
    }

    reiniciar(){
        if(this.encendido){
            console.log("Reiniciando dispositivo")
        }else{
            console.log("El dispositivo esta apagado, no se puede reiniciar")
        }
    }

    tomarFotos(){
        console.log(`Foto tomada en una resolucion de ${this.resolucionDeCamara}`)
    }

    gravarVideo(){
        console.log(`Gravar video en ${this.resolucionDeCamara}`)
    }

    informacion(){
        return console.log(`Color: ${this.color}\nPeso: ${this.peso}\nResolucion de pantalla: ${this.resolucionDePantalla}\nResolucion de camara: ${this.resolucionDeCamara}\nMemoria ram: ${this.memoriaRam}`);
    }
}


const movil1 = new celulares("verde", "100g", "720p", "full HD", "2GB")
const movil2 = new celulares("rojo", "200g", "1080p", "full HD", "4GB")
const movil3 = new celulares("negro", "300g", "4K", "full HD", "8GB")

// movil1.informacion()

// Math

// Rais cuadrada
// console.log(Math.cbrt(125))

function estadoClases (materia) {
    let materias = {
        fisica: ["Chuy", "David", "Emily", "Juan", "Maria"],
        programacion: ["Dalton", "David", "Emily", "Ernesto", "Dalton"],
        algebra: ["Efren", "Emily", "Juan", "Maria", "Dalton"],
        quimica: ["Chuy", "David", "Emily", "Juan", "Ernesto", "Maria", "Dalton"]
    }
    
    if(materias[materia] == undefined){
        return false
    }else{
        return materias[materia]
    }
}

let info = estadoClases("algebra"), arrMate = ["fisica", "programacion", "algebra", "quimica"], cantidad = 0
// console.log(info.slice(1,3))
// if(info){
//     console.log(`Esta materia sera inmpartida por el profesor ${info[0]} en la cual estaran los alumnos:\n${info.slice(1,info.length).map((a, b) => `${b+1} ${a}`).join("\n")}`)
// }else{
//     console.log("No existe esa materia")
// }
// console.log(arrMate.shift())

for(mate in arrMate){
    let estC = estadoClases(arrMate[mate])
    if(estC.some(s=>s=="David")){
        cantidad++
    }
}
let sss = "hola que tal jaja como estas?"
// console.log(sss==null)
// console.log(`David esta en ${cantidad} clases`)

let texto = `—〈 🌙─── ||||　 〉—
　　　　　　　　　　#Navi´s Community
　　　　　　　—〈 　　──🌙 〉—


　　　　　　　　　￫  Ofrecemos  ￩
@
🌔 Chat publico - respeto, conocer nuevas amistades
🌓 Sorteos todos los días
🌒 Mod experimentado
🌘 Asesoría constante por usuarios experimentados.
🌗Drops diarios
🌖 Staff amable
🌙 Gen con gran variedad de cuentas y un canal de vouch
para verificar nuestra legitimidad.
🌙 Clases personalizadas para los vip, con horarios y
temas a su gusto.

　　　　　   ¡Todo esto y mas! en nuestro servidor!!!

　　　　　　　　　　　 Invite
　　　　　　https://discord.gg/bX8zMCHCbC
　　　　　　　　　　   　Gif
https://cdn.discordapp.com/attachments/912708719983333397/913122301875216504/ts2_community_2.gif

　　　　　　　　　　　Banner
https://giphy.com/gifs/ok-navi-deku-tree-SVXQ4yzqFFNeg`

// let funalTX = texto.match(/(\d+)/g)
// let ftx = texto.split(" ").pop()
// sss.push("ddd")
// console.log(arrayTxt.map(m=>m))

let rank = [
    {nombre: "David", cantidad: 200},
    {nombre: "Juan", cantidad: 204},
    {nombre: "Emily", cantidad: 400},
    {nombre: "Yanet", cantidad: 30},
    {nombre: "Carlos", cantidad: 1},
    {nombre: "Sofia", cantidad: 230},
    {nombre: "Emanuel", cantidad: 2},
    {nombre: "Alex", cantidad: 3},
], segundo = rank, filtro = segundo.filter(f=> f.cantidad>=200)

// let numsRandom = []
// for(let n=0; n<80; n++){
//     let random = Math.floor(Math.random()*(10))
//     numsRandom.push(random)
// }
// console.log(numsRandom.sort((a,b)=> b-a))
// rank.filter(f=>f.cantidad<=200).forEach((valor) => {
//     valor.cantidad = true
// })
let valor = rank.filter(f=> f.cantidad>=200)
// for(r in valor){
//     valor[r].cantidad = true
// }
let plantilla = `══════════════════════════════
📣Promociones | CEM'              
══════════════════════════════
⚜️ 'Servidor de promoción  ⚜️   
 promociona tus redes
  sociales, proyectos
   servidores y mas 
⚜️       ✦!únete!✦      ⚜️  
══════════════════════════════ ╰─────────────────────────── ══════════════════════════════https://discord.gg/PNAuHDpjcm https://cdn.discordapp.com/attachments/901313790765854720/950895491741261854/bannerPlantilla.gif`

// if(["discord.com/invite/", "discord.gg/"].some(s=> plantilla.includes(s))){
//     let enlace = plantilla.split(/ +/g).some(e=> ["discord.com/invite/", "discord.gg/"].some(s=> e.includes(s))) ? "": ""
// }

let nombres = [{nombre: "David", edad: 18}, {nombre: "juan", edad: 20}, {nombre: "Angel", edad: 12}, {nombre: "Emanuel", edad: 40}]
console.log(nombres.sort((a, b)=> a.nombre < b.nombre))
// console.log("Hola, ¿que tal?".blue)
// console.log("Hola, ¿que tal?".cyan)
// console.log("Hola, ¿que tal?".green)
// console.log("Hola, ¿que tal?".magenta)
// console.log("Hola, ¿que tal?".rainbow)
// console.log("Hola, ¿que tal?".random)
// console.log("Hola, ¿que tal?".red.inverse)
// console.log("Hola, ¿que tal?".yellow.italic)

console.log(60*60)