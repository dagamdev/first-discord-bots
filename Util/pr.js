// Sistema de niveles
// console.log(parseInt("4.5004"))
// console.log(5**3)
// console.log(Math.cbrt(125))
let nivelesDB = {id: "200409", nombre: "David", nivel: 0, xp: 0}
class niveles {
    constructor(xpNivel1, xpPorPalabra){
        this.xpNivel1 = xpNivel1
        this.xpPorPalabra = xpPorPalabra
        this.limite = xpNivel1
    }
    autoNiveles(cadena){
        cadena.split(/ +/g).filter(f=> f.length >= 2).map(valorCo=> {
            nivelesDB.xp+=this.xpPorPalabra
            
            // this.limite = this.xpNivel1
            for(let i=0; i<nivelesDB.nivel; i++){
                if(!nivelesDB.nivel == 0){
                    this.limite+=this.limite*=2
                }
            }
            if(nivelesDB.xp >= this.limite){
                nivelesDB.nivel++
                console.log(`\n¡${nivelesDB.nombre} has suvido al nivel ${nivelesDB.nivel}!, feilicidades.\n`)
            }
        })
    }
    nivel(){
        
        console.log(`\n${nivelesDB.nombre} tu nivel actual es ${nivelesDB.nivel}\nXP: ${nivelesDB.xp}/${this.limite}\n`)
    }
}

process.stdin.on("data", data =>{
    let contenido = data.toString().trim(), prefijo = "|"
    console.log(data)
    // let sistemaDeNiveles = new niveles(10, 1)
    // sistemaDeNiveles.autoNiveles(contenido)

    if(!contenido.startsWith(prefijo)) return; 
    const args = contenido.slice(prefijo.length).trim().split(/ +/g), comando = args.shift().toLowerCase()
    
    // if(comando == "nivel"){
    //     sistemaDeNiveles.nivel()
    // }
})

let i = 0, hola = 0, xd = 10, nombres = ["David", "Emily", "Juan", "Ernesto", "Maria", "Fatima", "Andres", "Carlos", "Teresa", "Adrian", "Marta"]

// do{
//     console.log(cantidad)
//     for(let i=0; i<20; i++){
//         cantidad++
//     }
// }while(cantidad != 20){
//     console.log("fin")
// }


// while(cantidad != 20){{
//     cantidad++
//     console.log(cantidad)
// }}


let puntosDB = [{id: "983487125849309210", nombre: "David", puntos: 40}]

// for(let p=0; p<40; p++){
//     // 999999999999999999-111111111111111111
//     let identificador = Math.floor(Math.random()*(999999999999999999)+111111111111111111), nombreRandom = nombres[Math.floor(Math.random()*nombres.length)], puntosRandom = Math.floor(Math.random()*(100)+1)
//     if(identificador <= 999999999999999999){
//         puntosDB.push({id: String(identificador), nombre: nombreRandom, puntos: puntosRandom})
//     }
// }

// console.log(puntosDB.length)
// console.log(puntosDB.sort((a,b)=> b.puntos-a.puntos))

// let puntosDBFiltro = puntosDB.filter(f=> ["Juan", "Ernesto", "Marta", "Teresa", "Carlos"].some(s=> s == f.nombre))

// puntosDB.forEach((valorPs, ps) => {
//     if(["Juan", "Ernesto", "Marta", "Teresa", "Carlos"].some(s=> s == valorPs.nombre)){
//         puntosDB.splice(ps, 1)
//         console.log(`Usuario ${valorPs.nombre} eliminado | ${ps}`)
//     }
// })  

// console.log(puntosDB.length)
// console.log(puntosDB.sort((a,b)=> b.puntos-a.puntos))

let estudiantes1 = [
    { name: 'Georg', email: 'georg@academlo.com', score: 100 },
    { name: 'Andrea', email: 'andrea@gmail.com', score: 70 },
    { name: 'Andrés', email: 'andres@gmail.com', score: 34 }
]

function orderStudentsByScore(students) {
    function comparacion(a,b){
        return a.score - b.score
    }
    return students.sort(comparacion(students, students))
}
console.log(orderStudentsByScore(estudiantes1))


let estudiantes=[
    { name: 'Andrea', email: 'andrea@gmail.com', channel: 'youtube', application: null },
    { name: 'Daniela', email: 'daniela@gmail.com', channel: 'youtube', application: { country: 'Colombia', state: 'Bogotá' } },
    { name: 'Alondra', email: 'alondra@gmail.com', channel: 'twitter', application: { country: 'Colombia', state: 'Bogotá' } },
    { name: 'Luis', email: 'luisa@gmail.com', channel: 'twitter', application: { country: 'México', state: 'Nuevo León' } }
];
let objeto = {};
function countApplicationsByChannel(students) {
    let objeto = {}
    students.filter(f=> f.application!=null).map(m=> {
        m.channel == "youtube" ? objeto.youtube ? objeto.youtube++ : objeto.youtube=1 : null
        m.channel == "twitter" ? objeto.twitter ? objeto.twitter++ : objeto.twitter=1 : null
        m.channel == "instagram" ? objeto.instagram ? objeto.instagram++ : objeto.instagram=1 : null
        m.channel == "facebook" ? objeto.facebook ? objeto.facebook++ : objeto.facebook=1 : null
    })
    return objeto
}
console.log(countApplicationsByChannel(estudiantes));
