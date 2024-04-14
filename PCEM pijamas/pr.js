// console.log(30*100/500)
// let operacion = 20*100/26

// let xd = String(293094850345)

// console.log(Math.floor(76.92/100*20))


let edades = [19,32,15,26,65,53,46,32,28,19,16,18,23,44,37,12,20,70,44,35,35,26,50,18,53,19,10,13,18,20,20,65,53,10,12,35,44,53,70,18]

let editar = []

for(let i=0; i<edades.length; i++){
    editar.push({numero: edades[i], cantidad: 1})
}

let algo = []
editar.forEach(arr=>{
    const {numero, cantidad} = arr
    algo[numero] ??= {numero: numero, cantidad: 0}
    algo[numero].cantidad += cantidad
})

let soloObjets = algo.filter(f=> f.numero)

// console.log(algo)
let tabla = []

let decimal = 0
for(let i=0; i<soloObjets.length; i++){
    tabla.push(`${i+1}. ${soloObjets[i].numero} | ${soloObjets[i].cantidad} | ${soloObjets[i].cantidad/40} | ${String(decimal + soloObjets[i].cantidad/40).slice(0,5)}`)
    decimal = decimal + soloObjets[i].cantidad/40
}

console.log(tabla.join("\n"))