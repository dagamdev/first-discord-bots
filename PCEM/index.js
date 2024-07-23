const Discord = require("discord.js"), client = new Discord.Client({intents: 32767});
const token = require("./config.json").tokenPCEM, ms = require("ms"), mongoose = require("mongoose"), { SlashCommandBuilder, ContextMenuCommandBuilder } = require("@discordjs/builders"), Canvas = require("canvas"), canvacord = require("canvacord");
Canvas.registerFont("./tipo.otf", {family: "MADE TOMMY"});
require("colors");

const servidorID = "773249398431809586", creadorID = "717420870267830382", colorErr = "#ff0000", emojiError = "<a:negativo:856967325505159169>", emojiWarning = "<:advertencia:929204500739268608>", rolesPrincipales = ["823372926707171358","887450254826418236","852684847901704192","830260569012699146","840704377962758204","887443737804931122","885301022677942272","887443742469029961"]
const svPrID = "842630591257772033"

mongoose.connect("mongodb+url",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Conectado correctamente a la base de datos.".green)
}).catch(e=>{
    console.log("Ocurrió un error al conectarse con la DB".red, e)
})


// Datos generales del bot
const botSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    datos: {type: Object, required: true}
})
const botDB = mongoose.model("1botdb", botSchema)

// Sistema de alianzas
const alianzasSistem = new mongoose.Schema({
    _id: {type: String, required: true},
    canalID: {type: String, required: true},
    miembros: {type: Array,required: true},
    servidores: {type: Array, required: true}
})
const alianzasDB = mongoose.model("Alianzas", alianzasSistem)

// Sistema de sugerencias
const sugerenciasSystem = new mongoose.Schema({
    _id: {type: String, required: true},
    sugerencias: {type: Object, required: true},
    mensajes: {type: Array, required: true},
    miembros: {type: Array, required: true}
})
const systemSug = mongoose.model("Sugerencias", sugerenciasSystem)

// Carcél
const carcelBaseDeDatos = new mongoose.Schema({
    _id: {type: String, required: true},
    cantidad: {type: Number, required: true},
    prisioneros: {type: Array, required: true},
    // canalID: {type: String, required: true},
    // miembros: {type: Array, required: true}
}) 
const carcelDB = mongoose.model("Carcel", carcelBaseDeDatos)

// Sistema de tickets
const ticketsSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    datos: {type: Object, required: true},
    tickets: {type: Array, required: true},
    miembros: {type: Array, required: true}
})
const ticketsDB = mongoose.model("Tickets", ticketsSchema)

// Sistema de invitaciones
const invitacionesSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    datos: {type: Object, required: true},
    miembros: {type: Array, required: true}
})
const invitacionesDB = mongoose.model("Ivitaciones", invitacionesSchema)

// Sistema de niveles
const nivelesSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    canalID: {type: String, required: true},
    miembros: {type: Array, required: true}
})
const nivelesDB = mongoose.model("Niveles", nivelesSchema)

// historial del personal
const personalSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    datos: {type: Object, required: true},
    personal: {type: Array, required: true}
})
const personalDB = mongoose.model("Personal", personalSchema)

// Sistema de sorteos
const sorteosSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    datos: {type: Object, required: true},
    sorteos: {type: Array, required: true}
})
const sorteosDB = mongoose.model("Sorteos", sorteosSchema)

// Sistema de encuestas
const encuestasSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    datos: {type: Object, required: true},
    encuestas: {type: Array, required: true}
})
const encuestasDB = mongoose.model("Encuestas", encuestasSchema)

// ColaboradoresDB
const colaboradoresSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    datos: {type: Object, required: true},
    colaboradores: {type: Array, required: true}
})
const colaboradoresDB = mongoose.model("Colaboradores", colaboradoresSchema)

// Sistema de promo-nvl
const promoNvlSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    datos: {type: Object, required: true},
    miembros: {type: Array, required: true}
})
const promoNvlDB = mongoose.model("PromoNvl", promoNvlSchema)

// Variables estadisiticas y auto moderacion
let estadisticas = {entradas: 0, salidas: 0, mensajes: 0, comandos: 0}, autoModeracion = [{miembroID: "717420870267830382", advertencias: 0}]

// Cooldown
const cooldowns = new Map()

client.on("ready", async () => {
    console.log(`${client.user.username}: Estoy listo.`.rainbow.italic)
    const servidor = client.guilds.cache.get(servidorID)
    const servidorPr = client.guilds.cache.get("842630591257772033")
    let svch = servidor.channels.cache.get("828300239488024587")
    // const embEncendido = new Discord.MessageEmbed()
    // .setAuthor("✅ Encendido de nuevo.")
    // .setColor("#00ff00")
    // .setFooter(client.user.username,client.user.displayAvatarURL())
    // .setTimestamp()
    // client.channels.cache.get("941170978459910214").send({embeds: [embEncendido]})

    let rolesPermitidoEm = ["852396716112216126", "898695801876910150", "933236467700998145", "853429228799131658", "839549500237938748", "907807597011279923", "902291949183176745", "887444598715219999"]
    let emojisNombres = ["YoutubeLogo", "TwitchLogo", "TiktokLogo", "TwitterLogo", "InstagramLogo", "redstar", "LeftArrow", "RightArrow", "BoostAnimado", "Info", "advertencia", "BlurpleCheck", "confeti", "invitacion"]
    // servidor.emojis.cache.filter(f=>emojisNombres.some(s=>s == f.name)).map(m=> m.edit({roles: rolesPermitidoEm}).then(te=> console.log(`El emoji ${te.name} fue editado.`)))
    // console.log(servidor.emojis.cache.find(f=>f.name == "YoutubeLogo").roles)

    // Roles principales automaticos
    servidor.members.cache.filter(f=> !rolesPrincipales.some(s=> f.roles.cache.has(s)) && !f.user.bot).map(m=>m).forEach((miembro, ps, mapa) =>{
        miembro.roles.add(rolesPrincipales)
        if(ps+1 == mapa.length){
            console.log(`Roles principales agregados a ${ps+1} miembros.`.yellow.italic)
        }
    })

    // Roles de tiempo
    function rolesTiempo(){
        let miembros = servidor.members.cache.filter(f=> !f.user.bot).map(m=>m), bueltas = 0
        let intervalo = setInterval(()=>{
            if(bueltas < miembros.length){
                let miembro = miembros[bueltas]
                let tiempo = Math.floor(Date.now()-Number(miembro.joinedAt))
                let tiempos = [
                    {condicion: tiempo>=ms("30d") && tiempo<ms("60d"), rol: "975068365032947792"},
                    {condicion: tiempo>=ms("60d") && tiempo<ms("90d"), rol: "975068396406329434"},
                    {condicion: tiempo>=ms("90d") && tiempo<ms("120d"), rol: "975068402576154654"},
                    {condicion: tiempo>=ms("120d") && tiempo<ms("150d"), rol: "975068408464949298"},
                    {condicion: tiempo>=ms("150d") && tiempo<ms("180d"), rol: "975068418850050098"},
                    {condicion: tiempo>=ms("180d") && tiempo<ms("210d"), rol: "975068424466214922"},
                    {condicion: tiempo>=ms("210d") && tiempo<ms("240d"), rol: "975068413816868894"},
                    {condicion: tiempo>=ms("240d") && tiempo<ms("270d"), rol: "975068429834915850"},
                    {condicion: tiempo>=ms("270d") && tiempo<ms("300d"), rol: "975068435434319903"},
                    {condicion: tiempo>=ms("300d") && tiempo<ms("330d"), rol: "975068435832770581"},
                    {condicion: tiempo>=ms("330d") && tiempo<ms("360d"), rol: "975068441650274314"},
                    {condicion: tiempo>=ms("360d") && tiempo<ms("547d"), rol: "975068449015480402"},
                    {condicion: tiempo>=ms("547d") && tiempo<ms("730d"), rol: "975068458045825024"},
                    {condicion: tiempo>=ms("730d"), rol: "975068463687139349"},
                ]
                for(t of tiempos){
                    if(miembro.roles.cache.some(s=> tiempos.some(t=> t.rol == s.id)) && t.condicion){
                        if(!miembro.roles.cache.has(t.rol)){
                            miembro.roles.add(t.rol)
                        }
                        tiempos.filter(f=> f.rol != t.rol).map(m=> miembro.roles.remove(m.rol))

                    }else{
                        if(t.condicion){
                            miembro.roles.add(t.rol)
                        }
                    }
                }
                bueltas++
            }else{
                console.log("Terminado roles de tiempo")
                clearInterval(intervalo)
            }
        }, 2000)
    }
    // rolesTiempo()

    // let dataAli = await botDB.findById(servidorID)
    // console.log(dataAli.datos.autoModeracion.categoriasIgnorar)
    // console.log(dataAli.datos.autoModeracion.canalesIgnorar)
    // let nuevaData = await invitacionesDB.create({
    //     _id: svPrID,
    //     datos: {roles: [{id: "848430611977863168", invitaciones: 10}, {id: "864150592510099477", invitaciones: 20}]},
    //     miembros: []
    // })
    // await nuevaData.save()

    // console.log(ticketsDB.db)

    // await servidor.invites.fetch().then(invitaciones=> {
    //     // console.log(invitaciones.size)
    //     console.log(invitaciones.filter(f=> !servidor.members.cache.get(f.inviterId)).size)
    //     let filtro = invitaciones.map(m=> m).filter(f=> !servidor.members.cache.get(f.inviterId)), bueltas = 0

    //     let intervalo = setInterval(async () => {
    //         if(bueltas < filtro.length){
    //             filtro[bueltas].delete().then(tid=> console.log(`Invitación ${tid.code} eliminada.`))
    //             bueltas++
    //         }else{
    //             clearInterval(intervalo)

    //             console.log(`Acabado ${filtro.length} invitaciones eliminadas`)
    //         }
    //     }, 6000)
    // }).catch(c=> c)
      
    let dataSug = await systemSug.findOne({_id: servidorID}), mensajesCargados = 0
    for(i in dataSug.mensajes){
        if(dataSug.mensajes[i].id.length > 2){
            await svch.messages.fetch(dataSug.mensajes[i].id, {force: true}).then(tc=>{
                mensajesCargados++
            }).catch(err=>{
                console.log("mensaje del sistema de sugerencias no encontrado.".red, err)
            })
        }
    }
    console.log(`Se han cargado ${mensajesCargados} mensajes del sistema de sugerencias.`.blue.italic)

    let dataTs = await ticketsDB.findOne({_id: servidorID})
    dataTs.tickets.forEach(async (objeto) => {
        if(objeto.msgValoracionID != false){
            await servidor.channels.cache.get(objeto.id).messages.fetch(objeto.msgValoracionID, {force: true}).then(msgTC => {
                console.log("Mensaje de valoración cargado.".green)
            })
        }
    })

    let dataSor = await sorteosDB.findById(servidorID), msgsSorteos = 0
    for(s of dataSor.sorteos){
        let canal = servidor.channels.cache.get(s.canalID)
        if(canal){
            await canal.messages.fetch(s.id, {force: true}).then(ts=> {
                msgsSorteos++
            }).catch(err=>{
                console.log("mensaje de sorteo no encontrado.".red, err)
            })
        }
    }
    console.log(msgsSorteos==0 ? "No hay sorteos que cargar.".magenta.italic: `Se han cargado ${msgsSorteos} sorteos.`.blue.italic)

    let dataEnc = await encuestasDB.findById(servidorID), msgsEncuestas = 0
    for(e of dataEnc.encuestas){
        let canal = servidor.channels.cache.get(e.canalID)
        if(canal){
            await canal.messages.fetch(e.id, {force: true}).then(ts=> {
                msgsEncuestas++
            }).catch(err=>{
                console.log("mensaje de encuesta no encontrado.", err)
            })
        }
    }
    console.log(msgsEncuestas==0 ? "No hay encuestas que cargar.".magenta.italic: `Se han cargado ${msgsEncuestas} encuestas.`.blue.italic)

    function presencias () {
        const estadosDia = [
            {
                name: "p.ayuda",
                type: "LISTENING"
            },
            {
                name: "/ayuda",
                type: "LISTENING"
            },
            {
                name: `${client.guilds.cache.get(servidorID).members.cache.filter(mf => !mf.user.bot).size.toLocaleString()} miembros.`,
                type: "WATCHING"
            },
            {
                name: `${client.guilds.cache.get(servidorID).channels.cache.filter(ct => ct.type === "GUILD_CATEGORY").size} categorías.`,
                type: "WATCHING"
            },
            {
                name: `${client.guilds.cache.get(servidorID).members.cache.filter(bf => bf.user.bot).size} Bots.`,
                type: "WATCHING"
            },
            {
                name: `${client.guilds.cache.get(servidorID).channels.cache.filter(ft => ft.type === "GUILD_TEXT").size} canales.`,
                type: "WATCHING"
            },
            {
                name: `${client.guilds.cache.get(servidorID).channels.cache.filter(ft => ft.type === "GUILD_VOICE").size} canales de voz.`,
                type: "WATCHING"
            },
            {
                name: `sus promociones`,
                type: "WATCHING"
            },
            {
                name: `moderar con ${client.users.cache.get("935707268090056734").username}`,
                type: "PLAYING"
            }
        ]
    
        const estadosNoche = [
            {
                name: `mis sueños, estoy durmiendo.`,
                type: "WATCHING"
            },
            {
                name: `a los miembros y durmiendo.`,
                type: "LISTENING"
            }
        ]
        let tiempo = new Date()
        if(tiempo.getHours() > 22 || tiempo.getHours() < 8){
            client.user.setPresence({status: "idle", activities: [estadosNoche[Math.floor(Math.random()*estadosNoche.length)]]})
        }else{
            client.user.setPresence({status: "online", activities: [estadosDia[Math.floor(Math.random()*estadosDia.length)]]})
        }
    }
    presencias()

    function estadisticas(){
        let todosG = servidor.members.cache.size, soloMiembros = servidor.members.cache.filter(fm => !fm.user.bot).size, cantBots = servidor.members.cache.filter(fb => fb.user.bot).size
  
        let canalTodos =  client.channels.cache.get("823349420106973204")
        let canalMiembros = client.channels.cache.get("823349423349301318")
        let canalBots = client.channels.cache.get("823349426264997919")
  
        let estadoT = null, estadoM = null, estadoB = null, nose = false

        if(canalTodos.name == `『👥』Todos: ${todosG.toLocaleString()}`){
            estadoT = "Sin actualización"
        }else{
            canalTodos.edit({name: `『👥』Todos: ${todosG.toLocaleString()}`})
            estadoT = "Se ha actualizado"
            nose = true
        }

        if(canalMiembros.name == `『🧑』Miembros: ${soloMiembros.toLocaleString()}`){
            estadoM = "Sin actualización"
        }else{
            canalMiembros.edit({name: `『🧑』Miembros: ${soloMiembros.toLocaleString()}`})
            estadoM = "Se ha actualizado"
            nose = true
        }

        if(canalBots.name == `『🤖』Bots: ${cantBots.toLocaleString()}`){
            estadoB = "Sin actualización"
        }else{
            canalBots.edit({name: `『🤖』Bots: ${cantBots.toLocaleString()}`})
            estadoB = "Se ha actualizado"
            nose = true
        }

        if(true){
            const embEstadisticas = new Discord.MessageEmbed()
            .setTitle("Actualización de estadísticas")
            .setDescription(`**『👥』Todos: ${todosG}**\n${estadoT}\n\n**『👤』Miembros: ${soloMiembros}**\n${estadoM}\n\n**『🤖』Bots: ${cantBots}**\n${estadoB}`)
            .setColor("#0095F7")
            .setTimestamp()
            client.channels.cache.get("960567789263937656").send({embeds: [embEstadisticas]})
        }
    }
    estadisticas()

    async function carcel(){
        let dataCrc = await carcelDB.findOne({_id: client.user.id}), tiempoActual = Date.now(), canalRegistro = servidor.channels.cache.get("941170978459910214")
        if(dataCrc.prisioneros.length >= 1){
            for(let d=0; d<dataCrc.prisioneros.length; d++){
                let miembro = servidor.members.cache.get(dataCrc.prisioneros[d].id)
                let tiempo = dataCrc.prisioneros[d].condena
                let durante = ms(tiempo)>=86400000 ? `**${Math.floor(ms(tiempo)/86400000)}** días`: ms(tiempo)>=3600000 ? `**${Math.floor(ms(tiempo)/3600000)}** horas`: ms(tiempo)>=60000 ? `**${Math.floor(ms(tiempo)/60000)}** minutos`: `**${Math.floor(ms(tiempo)/1000)}** segundos`
                if(!miembro){
                    dataCrc.prisioneros.splice(d,1)
                    await dataCrc.save()
    
                    let user = client.users.cache.get(dataCrc.prisioneros[d].id)
                    const registroSa = new Discord.MessageEmbed()
                    .setAuthor(user.tag, user.displayAvatarURL({dynamic: true}))
                    .setTitle("<:salir12:879519859694776360> Pricionero liberado")
                    .setDescription(`👤 ${user.tag}\n**Ha cumplido con la condena de:** ${durante}\n**Por la razón:** ${dataCrc.prisioneros[d].razon}`)
                    .setColor("#00ff00")
                    .setTimestamp()
                    canalRegistro.send({embeds: [registroSa]})
                }else{
                    let msTime = ms(dataCrc.prisioneros[d].condena)
                    // console.log((dataCrc.prisioneros[d].tiempo + msTime) - tiempoActual)
                    if((dataCrc.prisioneros[d].tiempo + msTime) - tiempoActual <= 0){
                        const embMDS = new Discord.MessageEmbed()
                        .setAuthor(miembro.user.tag,miembro.displayAvatarURL({dynamic: true}))
                        .setTitle("<a:afirmativo:856966728806432778> Has salido de la cárcel")
                        .setDescription(`⏱ Cumpliste con la condena de ${durante} en la cárcel.`)
                        .setColor("#00ff00")
                        .setFooter(servidor.name,servidor.iconURL({dynamic: true}))
                        .setTimestamp()
    
                        const registroSa = new Discord.MessageEmbed()
                        .setAuthor(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                        .setTitle("<:salir12:879519859694776360> Pricionero liberado")
                        .setDescription(`👤 ${miembro}\n**Ha cumplido con la condena de:** ${durante}\n**Por la razón:** ${dataCrc.prisioneros[d].razon}`)
                        .setColor("#00ff00")
                        .setTimestamp()
    
                        miembro.roles.remove("830260549098405935").then(r=>{
                            miembro.send({embeds: [embMDS]}).catch(c=>{
                                return;
                            })
                            canalRegistro.send({embeds: [registroSa]})
                        })
    
                        dataCrc.prisioneros.splice(d,1)
                        await dataCrc.save()
                    }
                }
            }  
        }
    }
    // carcel()

    async function colaboradores(){
        let dataCol = await colaboradoresDB.findById("842630591257772033"), arrayCo = dataCol.colaboradores, colaboradores = arrayCo.filter(f=>f.colaborador)
        arrayCo.filter(f=>f.colaborador).forEach(async (col, ps) => {
            let canal = servidorPr.channels.cache.get(col.canalID), colaborador = client.users.cache.get(col.id)
            if(!colaborador.dmChannel){
                colaborador.createDM()
            }
            // console.log(col)
            const embNotificaccion = new Discord.MessageEmbed()
            .setTitle(`🔔 Notificación`)
            .setDescription(`${colaborador} ya puedes utilizar @everyone o @here en tu canal ${canal}.`)
            .setColor(servidorPr.members.cache.get(col.id).displayHexColor)
            .setFooter(`¡Gracias por ser colaborador del servidor.!`, client.user.displayAvatarURL())

            const boton = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId("eliminarMsgMD")
                .setEmoji(emojiError)
                .setLabel("Eliminar mensaje")
                .setStyle("DANGER")
            )
            if(col.tiempo == false){
                if(!col.notificado){
                    colaborador.send({embeds: [embNotificaccion], components: [boton]}).then(async tn=> {
                        col.notificado = true
                    })
                }
                if(!canal.permissionsFor(col.id).has("MENTION_EVERYONE")){
                    canal.permissionOverwrites.edit(col.id, {"MENTION_EVERYONE": true,})
                }

            }else{
                if(col.tiempo<=Date.now()){
                    if(!col.notificado){
                        colaborador.send({embeds: [embNotificaccion], components: [boton]}).then(async tn=> {
                            col.notificado = true
                            col.tiempo = false
                        })
                    }else{
                        col.tiempo = false
                    }
                    if(!canal.permissionsFor(col.id).has("MENTION_EVERYONE")){
                        canal.permissionOverwrites.edit(col.id, {"MENTION_EVERYONE": true,})
                    }
                }else{
                    if(canal.permissionsFor(col.id).has("MENTION_EVERYONE")){
                        canal.permissionOverwrites.edit(col.id, {"MENTION_EVERYONE": false,})
                    }
                }
            }
        })
        setTimeout(async () =>{
            // console.log(arrayCo)
            await colaboradoresDB.findByIdAndUpdate("842630591257772033", {colaboradores: arrayCo})
        }, 4000)
    }
    // colaboradores()

    function vips(){
        let tiempo = new Date(), canal = servidor.channels.cache.get("826193847943037018")
        
        if(!canal.permissionsFor("826197551904325712").has("MENTION_EVERYONE") && [2, 5].some(s=>s == tiempo.getDay())){
            canal.permissionOverwrites.edit("826197551904325712", {"MENTION_EVERYONE": true,})
        
        }else{
            if(canal.permissionsFor("826197551904325712").has("MENTION_EVERYONE") && ![2, 5].some(s=>s == tiempo.getDay())){
                canal.permissionOverwrites.edit("826197551904325712", {"MENTION_EVERYONE": false,})
            }
            servidor.members.cache.filter(f=>!f.user.bot && f.roles.cache.has("826197551904325712")).forEach((miembro) =>{
                if(!miembro.permissions.has("ADMINISTRATOR") && !canal.permissionsFor(miembro.id).has("MENTION_EVERYONE")){
                    canal.permissionOverwrites.delete(miembro.id)
                }
            })
        }
    }
    vips()

    async function invitaciones(){
        let dataInv = await invitacionesDB.findById(svPrID), arrayMi = dataInv.miembros
        for(mm of arrayMi){
            for(u of mm.invitados){
                await client.users.fetch(u.id, {force: true}).catch(ci => {
                    mm.restantes!=0 ? mm.restantes--: ""
                    mm.falsas++
                    mm.invitados.splice(mm.invitados.findIndex(f=> f.id==u.id),1)
                }).then(c=> c)
            }
        }

        for(m of arrayMi){
            await client.users.fetch(m.id, {force: true}).then(async usuario=> {
                if(!servidorPr.members.cache.some(s=> s.id == usuario.id)){
                    if(m.tiempo!=undefined && m.tiempo<=Date.now()){
                        arrayMi.splice(arrayMi.findIndex(f=> f.id==m.id),1)
                    }else{
                        m.tiempo = Math.floor(Date.now()+ms("30d"))
                    }
                }
            }).catch(cus=> {
                arrayMi.splice(arrayMi.findIndex(f=> f.id==m.id),1)
            })
        }

        console.log(arrayMi)
        let tiempoAwInv = Date.now()
        await servidorPr.invites.fetch().then(async invites=> {
            let tiempoFor1 = Date.now()
            for(invi of invites.map(i=>i)){
                if(arrayMi.some(s=> s.id==invi.inviterId)){
                    let miembro = arrayMi.find(f=> f.id==invi.inviterId)
                    if(miembro.codes.some(s=> s.code==invi.code)){
                        let code = miembro.codes.find(f=> f.code==invi.code)
                        if(code.usos!=invi.uses){
                            code.usos = invi.uses
                        }
                    }else{
                        miembro.codes.push({code: invi.code, usos: invi.uses})
                    }

                }else{
                    await client.users.fetch(invi.inviterId, {force: true}).then(usuario=> {
                        if(servidorPr.members.cache.some(s=> s.id==invi.inviterId)){
                            arrayMi.push({id: invi.inviterId, tag: invi.inviter.tag, verdaderas: 0, totales: 0, restantes: 0, falsas: 0, tiempo: undefined, codes: [{code: invi.code, usos: invi.uses}], invitados: []})
                        }
                    }).catch(c=> c)
                }
            }
            console.log(Math.floor(Date.now()-tiempoFor1))
            console.log(arrayMi)

            let tiempoFor2 = Date.now()
            for(mi of arrayMi){
                console.log("Inicio")
                let tiempoForAdentro = Date.now()
                let codigos = mi.codes.filter(f=> !invites.some(s=> s.code==f.code))
                console.log(codigos)
                for(c of codigos){
                    console.log("Invitacion: "+c.code)
                    mi.codes.splice(mi.codes.findIndex(f=> f.code==c.code),1)
                }
                console.log(codigos)
                console.log("fin: "+Math.floor(Date.now()-tiempoForAdentro))
            }
            console.log(Math.floor(Date.now()-tiempoFor2))
            console.log(arrayMi.map(m=> `${m.codes.length}\n${m.codes.map(c=> c.code)}`))

        }).catch(c=> c)
        // console.log(Math.floor(Date.now()-tiempoAwInv))
        // await invitacionesDB.findByIdAndUpdate(svPrID, {miembros: arrayMi})
        
        // await invitacionesDB.findByIdAndUpdate(svPrID, {miembros: arrayMi})

    }
    // invitaciones()

    async function sorteos(){
        let dataSor = await sorteosDB.findById(servidorID), arraySo = dataSor.sorteos
        for(s of arraySo){
            if(s.activo && s.finaliza<Date.now()){
                let mensage = client.channels.cache.get(s.canalID).messages.cache.get(s.id)
                if(mensage){
                    let miembros = s.participantes.filter(f=> servidor.members.cache.has(f))
                    console.log(miembros)
                    let bueltas = 1, ganadoresFinal = []
                    for(let r=0; r<bueltas; r++){
                        let miembroRandom = miembros[Math.floor(Math.random()*miembros.length)]
                        
                        if(s.ganadores>ganadoresFinal.length){
                            if(!ganadoresFinal.some(s=>s==miembroRandom)){
                                console.log("como")
                                ganadoresFinal.push(miembros[Math.floor(Math.random()*miembros.length)])
                            }
                            bueltas++
                        }
                    }
    
                    if(ganadoresFinal.length==0){
                        const emb = mensage.embeds[0]
                        emb.author.name = "⏹️ Sorteo finalizado"
                        emb.fields[0].value = `*No hubo ganadores ya que nadie participo*\nCreado por: <@${s.autorID}>`
                        mensage.edit({embeds: [emb]})
                        mensage.reply({content: `Nadie gano el sorteo.`})
                        s.activo = false
                        await sorteosDB.findByIdAndUpdate(servidorID, {sorteos: arraySo})
                    
                    }else{
                        const emb = mensage.embeds[0]
                        emb.author.name = "⏹️ Sorteo finalizado"
                        emb.fields[0].value = `${ganadoresFinal.length==1 ? `Ganador/a: ${ganadoresFinal.map(m=> `<@${m}>`)[0]}`: `Ganadores: ${ganadoresFinal.map(m=> `<@${m}>`).join(", ")}`}\nParticipantes: **${miembros.length}**\nCreado por: <@${s.autorID}>`
                        mensage.edit({embeds: [emb]})
                        mensage.reply({content: `¡Felicidades ${ganadoresFinal.length==1 ? `${ganadoresFinal.map(m=> `<@${m}>`)[0]} has ganado`: `${ganadoresFinal.map(m=> `<@${m}>`).join(", ")} han ganado`} **${emb.title}**!`})
                        s.activo = false
                        await sorteosDB.findByIdAndUpdate(servidorID, {sorteos: arraySo})
                    }

                }
            }
        }
    }
    // sorteos()

    async function encuestas(){
        let dataEnc = await encuestasDB.findById(servidorID), arrayEn = dataEnc.encuestas
        for(e of arrayEn){
            if(e.activa && e.finaliza<Date.now()){
                let mensage = client.channels.cache.get(e.canalID).messages.cache.get(e.id)
                if(mensage){
                    let opcionesOrdenadas = e.opciones.sort((a,b)=> b.votos - a.votos), totalVotos = 0, bueltas = 1, tabla = []
                    opcionesOrdenadas.map(m=> totalVotos+=m.votos)

                    for(o of opcionesOrdenadas){
                        let porcentaje = (o.votos*100/totalVotos).toFixed(2), carga = "█", vacio = " ", diseño = ""
                        
                        for(let i=0; i<20; i++){
                            if(i < porcentaje/100*20){
                                diseño = diseño.concat(carga)
                            }else{
                                diseño = diseño.concat(vacio)
                            }
                        }
                        tabla.push(`**${bueltas==1 ? "🥇": bueltas==2 ? "🥈": bueltas==3 ? "🥉": `${bueltas}`}.** ${o.emoji} ${o.opcion} *(${o.votos})*\n\`\`${diseño}\`\` **|** ${porcentaje}%`)
                        bueltas++
                    }

                    const embed = mensage.embeds[0]
                    embed.author.name = `▶️ Encuesta finalizada`
                    embed.fields[0].value = tabla.join("\n\n")
                    embed.fields[1].value = `Opción ganadora: **${opcionesOrdenadas[0].opcion}**\nVotos totales: **${totalVotos}**\nCreada por: <@${e.autorID}>`
                    mensage.edit({embeds: [embed]})
                    e.activa = false
                    await encuestasDB.findByIdAndUpdate(servidorID, {encuestas: arrayEn})
    
                }
            }
        }
    }
    // encuestas()

    function mensajesTemporales(){
        let canales = ["826205120173310032", "823639152922460170", "828300239488024587"]
        canales.map(m=> servidor.channels.cache.get(m).send("***¡Hola!***").then(tms=> setTimeout(()=> {tms.delete()}, 2000)))
    }
    // mensajesTemporales()

    async function promoNvl(){
        let dataPrl = await promoNvlDB.findById(servidorID), arrayPl = dataPrl.miembros, canal = servidor.channels.cache.get(dataPrl.datos.canalID)
        arrayPl.filter(f=> servidor.members.cache.has(f.id)).forEach((miembro) => {
            let usuario = client.users.cache.get(miembro.id)
            if(!usuario.dmChannel){
                usuario.createDM()
            }
            // console.log(col)
            const embNotificaccion = new Discord.MessageEmbed()
            .setTitle(`🔔 Notificación`)
            .setDescription(`${usuario} ya puedes publicar contenido en ${canal}.`)
            .setColor(servidor.members.cache.get(miembro.id).displayHexColor)
            .setFooter(`Si no quieres ser notificado bloquéame`, client.user.displayAvatarURL())

            const boton = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId("eliminarMsgMD")
                .setEmoji(emojiError)
                .setLabel("Eliminar mensaje")
                .setStyle("DANGER")
            )
            if(miembro.tiempo == false){
                if(!miembro.notificado){
                    miembro.notificado = true
                    usuario.send({embeds: [embNotificaccion], components: [boton]}).catch(c=>c)
                }
                if(!canal.permissionsFor(usuario.id).has("SEND_MESSAGES")){
                    canal.permissionOverwrites.edit(usuario.id, {"SEND_MESSAGES": true,})
                }

            }else{
                if(miembro.tiempo<=Date.now()){
                    if(!miembro.notificado){
                        miembro.notificado = true
                        miembro.tiempo = false
                        usuario.send({embeds: [embNotificaccion], components: [boton]}).catch(c=>c)
                    }else{
                        miembro.tiempo = false
                    }
                    if(!canal.permissionsFor(miembro.id).has("SEND_MESSAGES")){
                        canal.permissionOverwrites.edit(usuario.id, {"SEND_MESSAGES": true,})
                    }
                }else{
                    if(canal.permissionsFor(miembro.id).has("SEND_MESSAGES")){
                        canal.permissionOverwrites.edit(usuario.id, {"SEND_MESSAGES": false,})
                    }
                }
            }
        })

        setTimeout(async ()=>{
            await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
        }, 6000)
    }
    promoNvl()

    setInterval(async ()=>{
        // presencias()
        // colaboradores()
        // sorteos()
        // encuestas()
    }, 2*60000)

    setInterval(async ()=>{
        estadisticas()
        carcel()
        vips()
    }, 30*60000)

    async function slashCommands(){
        const ayudaCmd = new SlashCommandBuilder()
        .setName("ayuda")
        .setDescription(`✋ ¿Necesitas ayuda o estas perdido/a?, te muestra información que te puede ayudar.`)

        const reglasCmd = new SlashCommandBuilder()
        .setName("reglas")
        .setDescription(`📜 Te muestra las reglas del servidor.`)

        const pingCmd = new SlashCommandBuilder()
        .setName("ping")
        .setDescription("🏓 Muestra el ping del bot")

        const clasificacionesCmd = new SlashCommandBuilder()
        .setName("clasificaciones")
        .setDescription(`Muestra una lista de clasificaciones de los sistemas del bot.`)
        .addSubcommand(sub1=> sub1.setName(`alianzas`).setDescription(`🤝 Muestra una tabla de clasificaciones de todos los miembros que han echo alianzas.`))
        .addSubcommand(sub2=> sub2.setName(`tickets`).setDescription(`🎫 Muestra una tabla de clasificaciones de todos los miembros que han creado tickets.`))
        .addSubcommand(sub3=> sub3.setName(`niveles`).setDescription(`🏆 Muestra una tabla de clasificaciones de los miembros y sus niveles.`))
        .addSubcommand(sub4=> sub4.setName(`invitaciones`).setDescription(`📥 Muestra una table de clasificaciones de todos los miembros que han invitado a otros miembros.`))

        const informacionCmd = new SlashCommandBuilder()
        .setName("información")
        .setDescription(`Muestra información de cosas.`)
        .addSubcommand(afiliacion=> afiliacion.setName(`afiliaciones`).setDescription(`✨ Información sobre como hacer una afiliación.`))
        .addSubcommand(alianzas=> alianzas.setName(`alianzas`).setDescription(`🤝 Información sobre como hacer una alianza.`))
        .addSubcommand(miembro=> miembro.setName(`miembro`).setDescription(`🧑 Muestra información de un miembro sobre los sistemas del bot.`).addUserOption(usuario=> usuario.setName(`usuario`).setDescription(`👤 Proporciona un usuario para ver su información.`).setRequired(false)))

        const crearCmd = new SlashCommandBuilder()
        .setName("crear")
        .setDescription(`¡Crea!`)
        .addSubcommand(alianza=> alianza.setName(`alianza`).setDescription(`🤝 !Crea una alianza¡.`).addBooleanOption(ping=> ping.setName("notificación").setDescription(`🔔 Notifica a los miembros que tienen el rol de alianza.`).setRequired(true)).addUserOption(us=> us.setName("aliado").setDescription("🧑 Proporciona el aliado (el miembro con el que has creado la alianza).").setRequired(false)))
        .addSubcommand(colaborador=> colaborador.setName(`colaborador`).setDescription(`💎 Crea un canal para el colaborador y le agrega el rol.`).addUserOption(usuario=> usuario.setName(`colaborador`).setDescription(`🧑 El nuevo colaborador.`).setRequired(true)).addStringOption(nombre=> nombre.setName(`nombre`).setDescription(`🔖 Nombre del canal para el colaborador.`).setRequired(true)))
        .addSubcommand(encuesta => encuesta.setName(`encuesta`).setDescription(`📊 Crea una encuesta.`).addStringOption(titulo=> titulo.setName(`titulo`).setDescription(`🔖 El titulo del embed de la encuesta.`).setRequired(true)).addStringOption(tiempo=> tiempo.setName(`tiempo`).setDescription(`⏱️ El tiempo que durara la encuesta.`).setRequired(true)).addStringOption(descripcion=> descripcion.setName(`descripción`).setDescription(`📄 Descripción del embed de la encuesta.`).setRequired(false)).addChannelOption(canal=> canal.setName(`canal`).setDescription(`📚 Canal en el cual se enviara la encuesta.`).setRequired(false)).addStringOption(opcion1=> opcion1.setName(`opción1`).setDescription(`1️⃣ Agrega la opción 1.`).setRequired(false)).addStringOption(opcion2=> opcion2.setName(`opción2`).setDescription(`2️⃣ Agrega la opción 2.`).setRequired(false)).addStringOption(opcion3=> opcion3.setName(`opción3`).setDescription(`3️⃣ Agrega la opción 3.`).setRequired(false)).addStringOption(opcion4=> opcion4.setName(`opción4`).setDescription(`4️⃣ Agrega la opción 4.`).setRequired(false)).addStringOption(opcion5=> opcion5.setName(`opción5`).setDescription(`5️⃣ Agrega la opción 5.`).setRequired(false)).addStringOption(opcion6=> opcion6.setName(`opción6`).setDescription(`6️⃣ Agrega la opción 6.`).setRequired(false)))
        .addSubcommand(sorteo => sorteo.setName(`sorteo`).setDescription(`🎉 Crea un sorteo.`).addStringOption(titulo=> titulo.setName(`titulo`).setDescription(`🔖 El titulo del embed del sorteo.`).setRequired(true)).addStringOption(tiempo=> tiempo.setName(`tiempo`).setDescription(`⏱️ El tiempo que durara el sorteo activo.`).setRequired(true)).addIntegerOption(ganadores=> ganadores.setName(`ganadores`).setDescription(`👥 Cantidad de ganadores del sorteo.`).setRequired(true)).addStringOption(descripcion=> descripcion.setName(`descripción`).setDescription(`📄 Descripción del embed del sorteo.`).setRequired(false)).addChannelOption(canal=> canal.setName(`canal`).setDescription(`📚 Canal en el cual se enviara el sorteo.`).setRequired(false)))

        const finalizarCmd = new SlashCommandBuilder()
        .setName("finalizar")
        .setDescription(`¡Finaliza algo!`)
        .addSubcommand(encuesta=> encuesta.setName(`encuesta`).setDescription(`⏹️ Finaliza una encuesta antes del tiempo determinado.`).addStringOption(id=> id.setName(`id`).setDescription(`🆔 ID del mensaje de la encuesta a finalizar.`).setRequired(true)))
        .addSubcommand(sorteo=> sorteo.setName(`sorteo`).setDescription(`⏹️ Finaliza un sorteo antes del tiempo determinado.`).addStringOption(id=> id.setName(`id`).setDescription(`🆔 ID del mensaje del sorteo a finalizar.`).setRequired(true)))

        const nuevoCmd = new SlashCommandBuilder()
        .setName(`nuevo`)
        .setDescription(`Nuevo algo`)
        .addSubcommand(cazador=> cazador.setName(`cazador-alianzas`).setDescription(`🏹 Se registra al nuevo cazador de alianzas en la DB y se le da los roles correspondientes.`).addUserOption(miembro=> miembro.setName(`cazador`).setDescription(`🧑 Nuevo cazador de alianzas.`).setRequired(true)))
        .addSubcommand(ayudante=> ayudante.setName(`ayudante`).setDescription(`🔷 Se registra al nuevo ayudante en la DB y se le da los roles correspondientes.`).addUserOption(miembro=> miembro.setName(`ayudante`).setDescription(`🧑 Nuevo ayudante.`).setRequired(true)))

        const rerollCmd = new SlashCommandBuilder()
        .setName(`reroll`)
        .setDescription(`🔁 Vuelve a elegir el o los ganadores de un sorteo.`)
        .addStringOption(id=> id.setName(`id`).setDescription(`🆔 ID del mensaje del sorteo.`).setRequired(true))

        const ascenderCmd = new SlashCommandBuilder()
        .setName(`ascender`)
        .setDescription(`🛗 Haciende de rango a un miembro del personal.`)
        .addUserOption(miembro=> miembro.setName(`miembro`).setDescription(`🧑 Miembro del personal a ascender.`).setRequired(true))

        const degradarCmd = new SlashCommandBuilder()
        .setName(`degradar`)
        .setDescription(`🛗 Degrada de rango a un miembro del personal.`)
        .addUserOption(miembro=> miembro.setName(`miembro`).setDescription(`🧑 Miembro del personal a degradar.`).setRequired(true))

        const historialCmd = new SlashCommandBuilder()
        .setName(`historial`)
        .setDescription(`🗒️ Historial, DX`)
        .addSubcommand(colaboradores=> colaboradores.setName(`colaboradores`).setDescription(`💎 Muestra una lista de todos los colaboradores actuales y los antiguos.`))
        .addSubcommand(personal=> personal.setName(`personal`).setDescription(`🦺 Muestra tu historial o el de un miembro del personal.`).addUserOption(miembro=> miembro.setName(`miembro`).setDescription(`👮 Miembro del personal del servidor a ver su historial.`).setRequired(false)))

        const nivelCmd = new SlashCommandBuilder()
        .setName(`nivel`)
        .setDescription(`🏅 Muestra tu nivel o el nivel de un miembro.`)
        .addUserOption(usuario=> usuario.setName(`miembro`).setDescription(`👤 Proporciona un miembro para ver su nivel.`).setRequired(false))

        const avatarCmd = new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('📷 Muestra el avatar de un usuario')
        .addUserOption(userOP => userOP.setName("miembro").setDescription("👤 Menciona a un miembro"))
        .addStringOption(option => option.setName('id').setDescription('🆔 Propirciona la ID de un usuario'))

        const examenCmd = new SlashCommandBuilder()
        .setName("examen")
        .setDescription(`📋 Examen para ser ayudante.`)

        const estadisticasCmd = new SlashCommandBuilder()
        .setName("estadísticas")
        .setDescription(`📊 Muestra estadísticas del servidor.`)

        const sugerirCmd = new SlashCommandBuilder()
        .setName("sugerir")
        .setDescription(`✉️ Has una sugerencia para el servidor.`)
        .addStringOption(st=>
            st
            .setName("sugerencia")
            .setDescription(`📝 Escribe tu sugerencia.`)
            .setRequired(true)
        )

        const marcarCmd = new SlashCommandBuilder()
        .setName("marcar")
        .setDescription(`🚥 Marca el estado de una sugerencia (implementada, en progreso, no sucederá).`)
        .addStringOption(st=>
            st
            .setName(`id`)
            .setDescription(`🆔 Proporciona la ID del mensaje de la sugerencia que quieres marcar.`)
            .setRequired(true)
        )

        const plantillaCmd = new SlashCommandBuilder()
        .setName(`plantilla`)
        .setDescription(`📄 Muestra la plantilla del servidor`)

        // Moderacion
        const limpiarCmd = new SlashCommandBuilder()
        .setName(`limpiar`)
        .setDescription(`🗑️ Elimina mensajes de un canal.`)
        .addStringOption(cantidad=> cantidad.setName(`cantidad`).setDescription(`🔢 Cantidad de mensajes a eliminar o la palabra todos (elimina un máximo de 400 mensajes).`).setRequired(true))
        .addUserOption(miembro=> miembro.setName(`miembro`).setDescription(`🧑 El miembro al que se le eliminaran sus mensajes en el canal.`).setRequired(false))
        .addStringOption(autorID=> autorID.setName(`autorid`).setDescription(`🆔 ID del autor de los mensajes a eliminar.`).setRequired(false))

        const encarcelarCmd = new SlashCommandBuilder()
        .setName("encarcelar")
        .setDescription(`⛓️ Envía a un miembro a la cárcel.`)
        .addStringOption(tiempo=> tiempo.setName("tiempo").setDescription(`⏱️ Proporciona el tiempo en el que el miembro permanecerá en la cárcel.`).setRequired(true))
        .addStringOption(razon=> razon.setName("razón").setDescription(`📝 Proporciona la razón por la que el miembro ira a la cárcel.`).setRequired(true))
        .addUserOption(miembro=> miembro.setName("miembro").setDescription(`🧑 Proporciona al miembro que enviaras a la cárcel.`).setRequired(false))
        .addStringOption(id=> id.setName(`id`).setDescription(`🆔 ID del miembro a enviar a la cárcel`).setRequired(false))

        const expulsarCmd = new SlashCommandBuilder()
        .setName("expulsar")
        .setDescription(`🚪 Expulsa a un miembro del servidor.`)
        .addStringOption(razon=> razon.setName("razón").setDescription(`📝 Proporciona la razón por la que expulsaras al miembro.`).setRequired(true))
        .addUserOption(miembro=> miembro.setName("miembro").setDescription(`🧑 Proporciona el miembro a expulsar.`).setRequired(false))
        .addStringOption(id=> id.setName(`id`).setDescription(`🆔 ID del miembro a expulsar.`).setRequired(false))

        const banearCmd = new SlashCommandBuilder()
        .setName("banear")
        .setDescription(`⛔ Banea a un miembro o usuario externo del servidor.`)
        .addStringOption(razon=> razon.setName("razón").setDescription(`📝 Proporciona la razón por la que banearas al miembro o usuario externo.`).setRequired(true))
        .addUserOption(miembro=> miembro.setName("miembro").setDescription(`🧑 Proporciona el miembro a banear.`).setRequired(false))
        .addStringOption(id=> id.setName(`id`).setDescription(`🆔 ID del miembro o usuario externo a banear.`).setRequired(false))

        const desbanearCmd = new SlashCommandBuilder()
        .setName("desbanear")
        .setDescription(`✅ Des banea a un usuario del servidor.`)
        .addStringOption(id=> id.setName("id").setDescription(`🆔 ID del usuario a desbanear.`).setRequired(true))

        const websCmd = new SlashCommandBuilder()
        .setName(`webs`)
        .setDescription(`🔗 Paginas webs en las que se encuentra publicado el servidor.`)


        const usuarioCmd = new ContextMenuCommandBuilder()
        .setName("usuario")
        .setType(2)

        // client.guilds.cache.get(svPrID).commands.create(clasificacionesCmd.toJSON())

        let comandos = [ayudaCmd, reglasCmd, pingCmd, informacionCmd.toJSON(), clasificacionesCmd.toJSON(), crearCmd.toJSON(), historialCmd.toJSON(), finalizarCmd.toJSON(), nuevoCmd.toJSON(), rerollCmd, ascenderCmd, degradarCmd, nivelCmd, avatarCmd, examenCmd, estadisticasCmd, sugerirCmd, marcarCmd, plantillaCmd, limpiarCmd, encarcelarCmd, expulsarCmd, banearCmd, desbanearCmd, websCmd,  usuarioCmd]
        comandos.forEach(async (comando, posicion) => {
            if(!(await servidor.commands.fetch()).some(s=> s.name == comando.name)){
                servidor.commands.create(comando)
                console.log(`Comando ${comando.name} creado | posicion: ${posicion}`.cyan.italic)
            }
        })

        // await servidor.commands.edit("964578653369409556", {options: clasificacionesCmd.toJSON().options}).then(c=> console.log(`Comando ${c.name} editado`))
        // await servidor.commands.delete("972979672419827772").then(dc=> console.log(`Comando ${dc.name} eliminado`))
    }
    slashCommands()

    // console.log((await servidor.commands.fetch()).map(m=> `${m.name} | ${m.id}`))
})

let sistemMarcar = [], coolSugerencias = []
client.on("interactionCreate", async int => {
    if(![creadorID, "825186118050775052"].some(s=>s == int.user.id)) return;
    // if(int.guildId == servidorID) return;
    // if(!int.isCommand() && !int.isContextMenu() && !int.isSelectMenu()) return;
    let dataBot = await botDB.findById(client.user.id)

    if(int.isCommand()){
        if(int.commandName == "ayuda"){
            int.deferReply()
            estadisticas.comandos++
            const embAyuda = new Discord.MessageEmbed()
            .setAuthor(`Hola ${int.user.username}`,int.user.displayAvatarURL({dynamic: true}))
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(`Soy ${client.user.username}`)
            .setDescription(`**El bot de ${int.guild.name}**, ¿necesitas información o ayuda?`)
            .addFields(
                {name: "<a:Info:926972188018479164> **Información**", value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>."},
                {name: "<:staff:925429848380428339> **Soporte**", value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento."}
            )
            .setColor(int.guild.me.displayHexColor)
            .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
            .setTimestamp()
            
            setTimeout(()=>{
                int.editReply({embeds: [embAyuda]})
            }, 400)
        }

        if(int.commandName == "reglas"){
            estadisticas.comandos++
            const embReglas = new Discord.MessageEmbed()
            .setAuthor("📜 Reglas")
            // .setDescription(`> **1. Respetarse, no insultarse, aquí todos estamos para ayudarnos entre nosotros.**\n\n> **2. No usar palabras obscenas u ofensivas o seras advertido o directamente Baneado.**\n\n> 3. **Respetar la categoría de los canales** *(Ejemplo si son para promocionar solo se podrá promocionar o si son para hablar solo se usaran para hablar).*\n\n> **4. No hacer menciones como @user, @everyone, @here, a menos que se les permita por un rol, canal o un admin.**\n\n> **5.No mencionar a los admins, mods, helpers y usuario si no es por una buena razón y solo es por diversión.**\n\n> **6. No enviar spam al MD de las personas sin antes la persona lo aya permitido** *(ejemplo: primero preguntarle y si acepta ya mandarle el spam de lo contrario es sancionable).*\n\n> **7. No enviar su promoción *(spam)***, en un canal y salir del servidor si lo haces tu promocion sera eliminada.**\n\n> **8. Esta prohibido el contenido NSFW o +18 en canales los cuales no están creados para ese fin.**`)
            .setDescription(`> **1. __Flood__**\n> Inundación de mensajes o mejor conocido como *flood* esta acción esta prohibida, se considera flood cuando envías el mismo mensaje mas de 3 veces en un corto lapso de tiempo.\n\n> **2. __Spam al MD__**\n> Se considera *spam al MD* a la acción de enviar por mensaje directo un mensaje de promoción no deseado al miembro, esta acción esta prohibida.\n\n> **3. __Respeto mutuo__**\n> Respetarse entre ustedes, no hay necesidad de conflictos si algún usuario le molesta no haga conflicto haga un reporte al usuario creando un ticket en el canal <#830165896743223327>.\n\n> **4. __Contenido NSFW__**\n> El contenido explicito o contenido NSFW esta prohibido en la mayoría de canales.\n\n> **5. __Información personal__**\n> Tu información personal es valiosa para ti, por ello en el servidor no esta permitido actos de revelación de datos personales o de otro miembro.\n\n> **6. __Promoción en grupo__**\n> Esta acción es cuando **2** o mas miembro del servidor publican el mismo contenido ya sea un servidor, YT, etc, esa acción es sancionable. \n\n> **7. __Publicar y salir del servidor__**\n> En el caso de que entres al servidor, publiques tu promoción y salgas del servidor tu publicación será eliminada.\n\n> **8. __Respetar la función de cada canal.__**\n> Respetar si el canal es solo para publicar contenido de YouYube o si es solo para usar un bot en concreto, normalmente en la descripción del canal te informa la finalidad del canal.\n\n> **9. __Menciones en masa o menciones masivas__**\n>  Consiste en mencionar repetidas veces a un miembro o rol, esa acción esta prohibida. \n\n> **10. __Usar el sentido común__**\n> Compórtate adecuadamente, no hagas cosas que aunque no estén en las reglas están mal, en todo caso si el equipo de soporte se ve en la necesidad de sancionarte lo hará.\n\n> **11. __Términos y condiciones de Discord__**\n> No incumplir el [**ToS**](https://discord.com/terms) de Discord.`)
            .setColor(int.guild.me.displayHexColor)
            .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
            .setTimestamp()
            int.reply({ephemeral: true, embeds: [embReglas]})
        }

        if(int.commandName == "ping"){
            int.deferReply()
            estadisticas.comandos++
            let ping
            if(client.ws.ping <= 30){
                ping = "<:30ms:917227036890791936>"
            }
            if(client.ws.ping > 30 && client.ws.ping < 90){
                ping = "<:60ms:917227058399162429>"
            }
            if(client.ws.ping > 90){
                ping = "<:150ms:917227075243503626>"
            }
            const embPing = new Discord.MessageEmbed()
            .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
            .setTitle("🏓 Pong")
            .setDescription(`${ping} ${client.ws.ping} ms`)
            .setColor(int.guild.me.displayHexColor)
            .setFooter(int.guild.name, int.guild.iconURL({dynamic: true}))
            .setTimestamp()
            
            setTimeout(()=>{
                int.editReply({embeds: [embPing]})
            }, 400)
        }

        if(int.commandName == "clasificaciones"){
            if(int.options.getSubcommand("alianzas") == "alianzas"){
                int.deferReply()
                estadisticas.comandos++
                let dataAli = await alianzasDB.findOne({_id: int.guildId})
                let ordenado = dataAli.miembros.sort((a,b)=> b.cantidad - a.cantidad), topC = []
                dataAli.miembros.forEach((valor, ps) => {
                    let usuario = client.users.cache.get(valor.id)
                    if(usuario){
                        if(usuario.id == int.user.id){
                            topC.push(`**${ps==0 ? "🥇": ps==1 ? "🥈": ps==2 ? "🥉": ps+1}. [${usuario.tag}](${usuario.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})}) - ${(valor.cantidad).toLocaleString()}**\n**ID: ${usuario.id}**`)
                        }else{
                            topC.push(`**${ps==0 ? "🥇": ps==1 ? "🥈": ps==2 ? "🥉": ps+1}.** [${usuario.tag}](${usuario.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})}) - **${(valor.cantidad).toLocaleString()}**\n**ID:** ${usuario.id}`)
                        }
                    }
                })
    
                let segPage
                if(String(ordenado.length).slice(-1) == 0){
                    segPage = Math.floor(ordenado.length / 10)
                }else{
                    segPage = Math.floor(ordenado.length / 10 + 1)
                }
    
                let ttp1 = 0, ttp2 = 10, pagina = 1, descripcion = `Hay un total de **${ordenado.length.toLocaleString()}** ${ordenado.length <= 1 ? "miembro que esta": "miembros que están"} en la tabla.\n\n`
                    
                if(ordenado.length > 10){
                    const embTop = new Discord.MessageEmbed()
                    .setTitle(`🤝 Tabla de clasificaciones del sistema de alianzas`)
                    .setDescription(descripcion+topC.slice(ttp1,ttp2).join("\n\n"))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
    
                    const botonesPrinc = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ])
    
                    const botones1 = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ])
    
                    const botones2 = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ])
                       
                    setTimeout(async ()=>{
                        await int.editReply({embeds: [embTop], components: [botones1]}).then(async msg =>{
                            await int.channel.messages.fetch(msg.id, {force: true}).then(mensaje => {
                                const colector = mensaje.createMessageComponentCollector({filter: u=> u.user.id == int.user.id, time: segPage*60000})
            
                                setTimeout(()=>{
                                    mensaje.edit({embeds: [embTop], components: []}).catch(c=> c)
                                }, segPage*60000)
    
                                colector.on("collect", async bt => {
                                    if(bt.customId == "Si"){
                                        if(ttp2 - 10 <= 10){
                                            ttp1-=10, ttp2-=10, pagina--
    
                                            embTop
                                            .setDescription(descripcion+topC.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botones1]})
                                        }else{
                                            ttp1-=10, ttp2-=10, pagina--
                                        
                                            embTop
                                            .setDescription(descripcion+topC.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botonesPrinc]})
                                        }
                                    }
                                    if(bt.customId == "No"){
                                        if(ttp2 + 10 >= ordenado.length){
                                            ttp1+=10, ttp2+=10, pagina++
                                            
                                            embTop
                                            .setDescription(descripcion+topC.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botones2]})
                                        }else{
                                            ttp1+=10, ttp2+=10, pagina++
                    
                                            embTop
                                            .setDescription(descripcion+topC.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botonesPrinc]})
                                        }
                                    }
                                })  
                            }).catch(ct=>{
                                const embError = new Discord.MessageEmbed()
                                .setTitle(`${emojiError} Error`)
                                .setDescription(`Lo ciento ha ocurrido un error y no se cual es el motivo.`)
                                .setColor(colorErr)
                                int.editReply({embeds: [embError], components: []})
                            })
                        })
                    }, 400)
                }else{
                    const embTop = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle(`🤝 Tabla de clasificaciones del sistema de alianzas`)
                    .setDescription(descripcion+topC.slice(ttp1,ttp2).join("\n\n"))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        int.editReply({allowedMentions: {repliedUser: false},embeds: [embTop]})
                    }, 400)
                }   
            }
            if(int.options.getSubcommand("tickets") == "tickets"){
                int.deferReply()
                estadisticas.comandos++
                let dataTs = await ticketsDB.findById(servidorID), ordenado = dataTs.miembros.sort((a,b)=> b.ticketsCreados - a.ticketsCreados), topTs = [], cantidadDereseñas = 0, segPage = null
                for(i in ordenado){
                    let reseñas = ordenado[i].reseñas.filter(f=> f.reseña!=false).length
                    cantidadDereseñas+=reseñas
                    let miembro = int.guild.members.cache.get(ordenado[i].id)
                    if(miembro){
                        if(miembro.id == int.user.id){
                            topTs.push(`**${Number(i)+1}. [${miembro.user.tag}](${miembro.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})**\n**ID:** ${miembro.id}\nTickets: **${ordenado[i].ticketsCreados.toLocaleString()}**\nReseñas: **${reseñas.toLocaleString()}**`)
                        }else{
                            topTs.push(`**${Number(i)+1}.** [${miembro.user.tag}](${miembro.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})\n**ID:** ${miembro.id}\nTickets: **${ordenado[i].ticketsCreados.toLocaleString()}**\nReseñas: **${reseñas.toLocaleString()}**`)
                        }
                    }
                }
 
                if(String(ordenado.length).slice(-1) == 0){
                    segPage = Math.floor(ordenado.length / 10)
                }else{
                    segPage = Math.floor(ordenado.length / 10 + 1)
                }
    
                let ttp1 = 0, ttp2 = 10, pagina = 1, descripcion = `Hay un total de **${ordenado.length.toLocaleString()}** ${ordenado.length <= 1 ? "miembro que esta": "miembros que están"} en la tabla.\n\n`
    
                    
                if(ordenado.length > 10){
                    const embTop = new Discord.MessageEmbed()
                    .setAuthor(int.member.nick ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
                    .setTitle(`<:tickets:962127203645136896> Tabla de clasificaciones del sistema de tickets`)
                    .setDescription(descripcion+topTs.slice(ttp1,ttp2).join("\n\n"))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
    
                    const botonesPrinc = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ])
    
                    const botones1 = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ])
    
                    const botones2 = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ])
                       
                    setTimeout(async ()=>{
                        await int.editReply({embeds: [embTop], components: [botones1]}).then(async msg =>{
                            await int.channel.messages.fetch(msg.id, {force: true}).then(mensaje => {
                                const colector = msg.createMessageComponentCollector({filter: u=> u.user.id == int.user.id, time: segPage*60000})
            
                                setTimeout(()=>{
                                    mensaje.edit({embeds: [embTop], components: []})
                                }, segPage*60000)
    
                                colector.on("collect", async bt => {
                                    if(bt.customId == "Si"){
                                        if(ttp2 - 10 <= 10){
                                            ttp1-=10, ttp2-=10, pagina--
    
                                            embTop
                                            .setDescription(descripcion+topTs.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botones1]})
                                        }else{
                                            ttp1-=10, ttp2-=10, pagina--
                                        
                                            embTop
                                            .setDescription(descripcion+topTs.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botonesPrinc]})
                                        }
                                    }
                                    if(bt.customId == "No"){
                                        if(ttp2 + 10 >= ordenado.length){
                                            ttp1+=10, ttp2+=10, pagina++
                                            
                                            embTop
                                            .setDescription(descripcion+topTs.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botones2]})
                                        }else{
                                            ttp1+=10, ttp2+=10, pagina++
                    
                                            embTop
                                            .setDescription(descripcion+topTs.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botonesPrinc]})
                                        }
                                    }
                                })  
                            }).catch(ct=>{
                                const embError = new Discord.MessageEmbed()
                                .setTitle(`${emojiError} Error`)
                                .setDescription(`Lo ciento ha ocurrido un error y no se cual es el motivo.`)
                                .setColor(colorErr)
                                int.editReply({embeds: [embError], components: []})
                            })
                        })
                    }, 400)
                }else{
                    const embTop = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle(`<:tickets:962127203645136896> Tabla de clasificaciones del sistema de tickets`)
                    .setDescription(descripcion+topTs.slice(ttp1,ttp2).join("\n\n"))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        int.editReply({allowedMentions: {repliedUser: false},embeds: [embTop]})
                    }, 400)
                }   
            }
            if(int.options.getSubcommand("niveles") == "niveles"){
                int.deferReply()
                estadisticas.comandos++
                let dataNvl = await nivelesDB.findOne({_id: int.guildId}), ordenado = [], tabla = []
    
                dataNvl.miembros.forEach((miembro, ps) => {
                    let lmtPr = 10, maxXP = miembro.xp
                    for(let i=0; i<miembro.nivel; i++){
                        maxXP += lmtPr
                        lmtPr += Math.floor(lmtPr/2)
                    }

                    ordenado.push({id: miembro.id, tag: miembro.tag, maxXp: maxXP})
                })
                ordenado.sort((a, b) => b.maxXp - a.maxXp)

                ordenado.forEach((valor, ps) => {
                    if(valor.id == int.user.id){
                        tabla.push(`**${ps==0 ? "🥇": ps==1 ? "🥈": ps==2 ? "🥉": ps+1}. ${valor.tag} - XP: ${valor.maxXp}**`)
                    }else{
                        tabla.push(`**${ps==0 ? "🥇": ps==1 ? "🥈": ps==2 ? "🥉": ps+1}.** ${valor.tag} - XP: **${valor.maxXp}**`)
                    }
                })

                if(String(ordenado.length).slice(-1) == 0){
                    segPage = Math.floor(ordenado.length / 10)
                }else{
                    segPage = Math.floor(ordenado.length / 10 + 1)
                }
    
                let ttp1 = 0, ttp2 = 10, pagina = 1, descripcion = `Hay un total de **${ordenado.length.toLocaleString()}** ${ordenado.length <= 1 ? "miembro que esta": "miembros que están"} en la tabla.\n\n`
    
                    
                if(ordenado.length > 10){
                    const embTop = new Discord.MessageEmbed()
                    .setAuthor(int.member.nick ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
                    .setTitle(`<:LvlUp:967475913707114507> Tabla de clasificaciones de niveles`)
                    .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
    
                    const botonesPrinc = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ])
    
                    const botones1 = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ])
    
                    const botones2 = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ])
                       
                    setTimeout(async ()=>{
                        await int.editReply({embeds: [embTop], components: [botones1]}).then(async msg =>{
                            await int.channel.messages.fetch(msg.id, {force: true}).then(mensaje => {
                                const colector = msg.createMessageComponentCollector({filter: u=> u.user.id == int.user.id, time: segPage*60000})
            
                                setTimeout(()=>{
                                    mensaje.edit({embeds: [embTop], components: []})
                                }, segPage*60000)
    
                                colector.on("collect", async bt => {
                                    if(bt.customId == "Si"){
                                        if(ttp2 - 10 <= 10){
                                            ttp1-=10, ttp2-=10, pagina--
    
                                            embTop
                                            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botones1]})
                                        }else{
                                            ttp1-=10, ttp2-=10, pagina--
                                        
                                            embTop
                                            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botonesPrinc]})
                                        }
                                    }
                                    if(bt.customId == "No"){
                                        if(ttp2 + 10 >= ordenado.length){
                                            ttp1+=10, ttp2+=10, pagina++
                                            
                                            embTop
                                            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botones2]})
                                        }else{
                                            ttp1+=10, ttp2+=10, pagina++
                    
                                            embTop
                                            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botonesPrinc]})
                                        }
                                    }
                                })  
                            }).catch(ct=>{
                                const embError = new Discord.MessageEmbed()
                                .setTitle(`${emojiError} Error`)
                                .setDescription(`Lo ciento ha ocurrido un error y no se cual es el motivo.`)
                                .setColor(colorErr)
                                int.editReply({embeds: [embError], components: []})
                            })
                        })
                    }, 400)
                }else{
                    const embTop = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle(`<:LvlUp:967475913707114507> Tabla de clasificaciones de niveles`)
                    .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        int.editReply({allowedMentions: {repliedUser: false},embeds: [embTop]})
                    }, 400)
                }   
            }
            if(int.options.getSubcommand("invitaciones") == "invitaciones"){
                int.deferReply()
                estadisticas.comandos++
                let dataIn = await invitacionesDB.findById(svPrID), ordenado = dataIn.miembros.filter(f=> f.totales>0).sort((a,b)=> b.totales - a.totales), topIn = [], segPage = null
                for(o in ordenado){
                    let miembro = int.guild.members.cache.get(ordenado[o].id)
                    if(miembro){
                        if(miembro.id == int.user.id){
                            topIn.push(`**${o==0 ? "🥇": o==1 ? "🥈": o==2 ? "🥉": Number(o)++}. [${miembro.user.tag}](${miembro.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})** **${ordenado[o].verdaderas.toLocaleString()}** ${ordenado[o].verdaderas==1 ? "invitación": "invitaciones"} *(**${ordenado[o].totales.toLocaleString()}** totales, **${ordenado[o].restantes.toLocaleString()}** se ${ordenado[o].restantes==1 ? "fue": "fueron"} y **${ordenado[o].falsas.toLocaleString()}** ${ordenado[o].falsas==1 ? "falsa": "falsas"})\n**ID:** ${miembro.id}`)
                        }else{
                            topIn.push(`**${o==0 ? "🥇": o==1 ? "🥈": o==2 ? "🥉": Number(o)++}.** [${miembro.user.tag}](${miembro.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})}) **${ordenado[o].verdaderas.toLocaleString()}** ${ordenado[o].verdaderas==1 ? "invitación": "invitaciones"} *(**${ordenado[o].totales.toLocaleString()}** totales, **${ordenado[o].restantes.toLocaleString()}** se ${ordenado[o].restantes==1 ? "fue": "fueron"} y **${ordenado[o].falsas.toLocaleString()}** ${ordenado[o].falsas==1 ? "falsa": "falsas"})\n**ID:** ${miembro.id}`)
                        }
                    }
                }
 
                if(String(ordenado.length).slice(-1) == 0){
                    segPage = Math.floor(ordenado.length / 10)
                }else{
                    segPage = Math.floor(ordenado.length / 10 + 1)
                }
    
                let ttp1 = 0, ttp2 = 10, pagina = 1, descripcion = `Hay un total de **${ordenado.length.toLocaleString()}** ${ordenado.length <= 1 ? "miembro que esta": "miembros que están"} en la tabla.\n\n`
    
                    
                if(ordenado.length > 10){
                    const embTop = new Discord.MessageEmbed()
                    .setAuthor(int.member.nick ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
                    .setTitle(`<:invitacion:981322040105639987> Tabla de clasificaciones del sistema de invitaciones`)
                    .setDescription(descripcion+topIn.slice(ttp1,ttp2).join("\n\n"))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
    
                    const botonesPrinc = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ])
    
                    const botones1 = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ])
    
                    const botones2 = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ])
                       
                    setTimeout(async ()=>{
                        int.editReply({embeds: [embTop], components: [botones1]}).then(async msg =>{
                            await int.channel.messages.fetch(msg.id, {force: true}).then(mensaje => {
                                const colector = msg.createMessageComponentCollector({filter: u=> u.user.id == int.user.id, time: segPage*60000})
            
                                setTimeout(()=>{
                                    mensaje.edit({embeds: [embTop], components: []})
                                }, segPage*60000)
    
                                colector.on("collect", async bt => {
                                    if(bt.customId == "Si"){
                                        if(ttp2 - 10 <= 10){
                                            ttp1-=10, ttp2-=10, pagina--
    
                                            embTop
                                            .setDescription(descripcion+topIn.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botones1]})
                                        }else{
                                            ttp1-=10, ttp2-=10, pagina--
                                        
                                            embTop
                                            .setDescription(descripcion+topIn.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botonesPrinc]})
                                        }
                                    }
                                    if(bt.customId == "No"){
                                        if(ttp2 + 10 >= ordenado.length){
                                            ttp1+=10, ttp2+=10, pagina++
                                            
                                            embTop
                                            .setDescription(descripcion+topIn.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botones2]})
                                        }else{
                                            ttp1+=10, ttp2+=10, pagina++
                    
                                            embTop
                                            .setDescription(descripcion+topIn.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embTop], components: [botonesPrinc]})
                                        }
                                    }
                                })  
                            }).catch(ct=>{
                                const embError = new Discord.MessageEmbed()
                                .setTitle(`${emojiError} Error`)
                                .setDescription(`Lo ciento ha ocurrido un error y no se cual es el motivo.`)
                                .setColor(colorErr)
                                int.editReply({embeds: [embError], components: []})
                            })
                        })
                    }, 400)
                }else{
                    const embTop = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle(`<:invitacion:981322040105639987> Tabla de clasificaciones del sistema de invitaciones`)
                    .setDescription(descripcion+topIn.slice(ttp1,ttp2).join("\n\n"))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        int.editReply({allowedMentions: {repliedUser: false},embeds: [embTop]})
                    }, 400)
                }   
            }
        }

        if(int.commandName == "información"){
            if(int.options.getSubcommand("afiliaciones") == "afiliaciones"){
                int.deferReply()
                estadisticas.comandos++
                const embAfiliacion = new Discord.MessageEmbed()
                .setAuthor(int.member.nick ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
                .setTitle("<a:Info:926972188018479164> Información sobre afiliaciones")
                .addField(`📋 **Requisitos para afiliación:**`, `**1.** Tener mínimo **1,500** miembros en su servidor.\n**2.** Utilizar ping @everyone o @here obligatorio.\n**3.** Tener una plantilla bien organizada y una invitación qué no expire.\n**4.** Un representante en el servidor.\n**5.** Prohibidos servidores de raid/gore/CP/doxxeo/etc.`)
                .addField(`👮 **Soporte:**`, `Una vez cumplas con los requisitos para realizar la afiliación abre un ticket en el canal <#830165896743223327> y pide una afiliación, otra forma de pedir una afiliación es pedírsela un miembro del equipo de soporte por su MD *(mensaje directo)* a cualquiera de los miembros que tengan los siguientes roles <@&847302489732153354>, <@&907807597011279923> y <@&839549500237938748>.`)
                .addField(`❓ **Datos:**`, `Puedes renovar la afiliación despues de un mes.`)
                .setColor(int.guild.roles.cache.get("941731411684122625").hexColor)
                .setFooter(int.guild.name, int.guild.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    int.editReply({embeds: [embAfiliacion]})
                }, 400)
            }
            if(int.options.getSubcommand("alianzas") == "alianzas"){
                int.deferReply()
                estadisticas.comandos++
                const embAlianzas = new Discord.MessageEmbed()
                .setAuthor({name: int.member.nick ? int.member.nickname: int.user.username, iconURL: int.user.displayAvatarURL({dynamic: true})})
                .setTitle("<a:Info:926972188018479164> Información sobre alianzas")
                .addField(`📋 **Requisitos para alianza:**`, `**1.** Si tu servidor tiene menos de **60** miembros para hacer una alianza con nosotros debes de invitar a nuestro Bot <@935707268090056734> a tu servidor, si tienes más **60** miembros solo cumple con los demás requisitos.\n**2.** Servidor no toxico, que no fomente ninguna práctica mala como el raideo.\n**3.** Servidor no enfocando en contenido NSFW, si tiene canales NSFW que tengan la restricción de edad activada.\n**4.** No eliminar la alianza, en caso de hacerlo nosotros lo haremos de la misma manera.\n**5.** Proporcionar su plantilla con una invitación a su servidor que no expire, en caso de que expire eliminaremos su plantilla.`)
                .addField(`👮 **Soporte:**`, `Una vez cumplas con los requisitos para realizar la alianza abre un ticket en el canal <#830165896743223327> y pide una alianza, otra forma de pedir una alianza es pedírsela un miembro del equipo de soporte por su MD *(mensaje directo)* a cualquiera de los miembros que tenga el rol <@&887444598715219999>.`)
                .addField(`❓ **Datos:**`, `Puedes renovar tu alianza cada semana.\nSi tu servidor supera los **600** al hacer una alianza con nosotros utilizaremos en tu plantilla la mención del rol <@&895394175481159680> el cual notifica a todos los usuarios que lo tienen.`)
                .setColor(int.guild.roles.cache.get("840704364158910475").hexColor)
                .setFooter({text: int.guild.name, iconURL: int.guild.iconURL({dynamic: true})})
                .setTimestamp()
                setTimeout(()=>{
                    int.editReply({embeds: [embAlianzas]})
                }, 400)
            }
            if(int.options.getSubcommand("miembro") == "miembro"){
                // int.deferReply()
                estadisticas.comandos++
                let dataAli = await alianzasDB.findById(servidorID), dataSug = await systemSug.findById(servidorID), dataTs = await ticketsDB.findById(servidorID), dataInv = await invitacionesDB.findById(svPrID), miembro = false

                if(int.options.getUser("usuario")){
                    miembro = int.guild.members.cache.get(int.options.getUser("usuario").id)
                }

                if(miembro){
                    let alianzasDB = dataAli.miembros.some(s=> s.id == miembro.id), sugerenciasDB = dataSug.miembros.some(s=>s.id == miembro.id), ticketsDB = dataTs.miembros.some(s=>s.id == miembro.id), invitesDB = dataInv.miembros.some(s=> s.id==miembro.id)
                    let miembroAli = dataAli.miembros.find(f=> f.id == miembro.id), miembroSug = dataSug.miembros.find(f=>f.id == miembro.id), miembroTik = dataTs.miembros.find(f=>f.id == miembro.id), miembroInv = dataInv.miembros.find(f=> f.id==miembro.id)
                    const embInfoMiembro = new Discord.MessageEmbed()
                    .setAuthor(int.member.nick ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
                    .setColor(int.guild.me.displayHexColor)
                    .setTimestamp()
                    if(miembro.id == int.user.id){
                        if(miembro.permissions.has("ADMINISTRATOR") || miembro.roles.cache.has("887444598715219999")){
                            embInfoMiembro
                            .setTitle(`<a:Info:926972188018479164> Tu información`)
                            .setDescription(`<@${miembro.id}>`)
                            .setFooter(int.guild.name, int.guild.iconURL({dynamic: true}))

                            alianzasDB ? embInfoMiembro.addField(`🤝 **Alianzas:**`, `Has creado ${miembroAli.cantidad<=1 ? `**${miembroAli.cantidad}** alianza.`: `**${miembroAli.cantidad}** alianzas.`}`): "" 
                            sugerenciasDB ? embInfoMiembro.addField(`🗳️ **Sugerencias:**`, `Has creado ${miembroSug.sugerencias<=1 ? `**${miembroSug.sugerencias}** sugerencia que aha sido ${miembroSug.aceptadas==0 ? `denegada.`: `aceptada.`}`: `**${miembroSug.sugerencias}** sugerencias de las cuales ${miembroSug.aceptadas==1 ? `**${miembroSug.aceptadas}** ha sido aceptada`: `**${miembroSug.aceptadas}** han sido aceptadas`} y ${miembroSug.denegadas==1 ? `**${miembroSug.denegadas}** denegada.`: `**${miembroSug.denegadas}** denegadas.`}`}`): ""
                            ticketsDB ? embInfoMiembro.addField(`<:tickets:962127203645136896> **Tickets:**`, `Has creado ${miembroTik.ticketsCreados==1 ? `**${miembroTik.ticketsCreados}** ticket.`: `**${miembroTik.ticketsCreados}** tickets.`}`): ""

                            setTimeout(async ()=>{
                                await int.channel.send({embeds: [embInfoMiembro]})
                            }, 400)

                        }else{
                            embInfoMiembro
                            .setTitle(`<a:Info:926972188018479164> Tu información`)
                            .setDescription(`<@${miembro.id}>`)
                            .setFooter(int.guild.name, int.guild.iconURL({dynamic: true}))
 
                            sugerenciasDB ? embInfoMiembro.addField(`🗳️ **Sugerencias:**`, `Has creado ${miembroSug.sugerencias<=1 ? `**${miembroSug.sugerencias}** sugerencia que aha sido ${miembroSug.aceptadas==0 ? `denegada.`: `aceptada.`}`: `**${miembroSug.sugerencias}** sugerencias de las cuales ${miembroSug.aceptadas==1 ? `**${miembroSug.aceptadas}** ha sido aceptada`: `**${miembroSug.aceptadas}** han sido aceptadas`} y ${miembroSug.denegadas==1 ? `**${miembroSug.denegadas}** denegada.`: `**${miembroSug.denegadas}** denegadas.`}`}`): ""
                            ticketsDB ? embInfoMiembro.addField(`<:tickets:962127203645136896> **Tickets:**`, `Has creado ${miembroTik.ticketsCreados==1 ? `**${miembroTik.ticketsCreados}** ticket.`: `**${miembroTik.ticketsCreados}** tickets.`}`): ""

                            setTimeout(async ()=>{
                                await int.reply({ephemeral: true, embeds: [embInfoMiembro]})
                            }, 400)
                        }

                    }else{
                        if(miembro.permissions.has("ADMINISTRATOR") || miembro.roles.cache.has("887444598715219999")){
                            embInfoMiembro
                            .setTitle(`<a:Info:926972188018479164> Información de`)
                            .setDescription(`<@${miembro.id}>`)
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))

                            alianzasDB ? embInfoMiembro.addField(`🤝 **Alianzas:**`, `Ha creado ${miembroAli.cantidad<=1 ? `**${miembroAli.cantidad}** alianza.`: `**${miembroAli.cantidad}** alianzas.`}`): ""
                            sugerenciasDB ? embInfoMiembro.addField(`🗳️ **Sugerencias:**`, `Ha creado ${miembroSug.sugerencias<=1 ? `**${miembroSug.sugerencias}** sugerencia que aha sido ${miembroSug.aceptadas==0 ? `denegada.`: `aceptada.`}`: `**${miembroSug.sugerencias}** sugerencias de las cuales ${miembroSug.aceptadas==1 ? `**${miembroSug.aceptadas}** ha sido aceptada`: `**${miembroSug.aceptadas}** han sido aceptadas`} y ${miembroSug.denegadas==1 ? `**${miembroSug.denegadas}** denegada.`: `**${miembroSug.denegadas}** denegadas.`}`}`): ""
                            ticketsDB ? embInfoMiembro.addField(`<:tickets:962127203645136896> **Tickets:**`, `Ha creado ${miembroTik.ticketsCreados==1 ? `**${miembroTik.ticketsCreados}** ticket.`: `**${miembroTik.ticketsCreados}** tickets.`}`): ""
                            invitesDB ? embInfoMiembro.addField(`<:invitacion:981322040105639987> **Invitaciones:**`, `Ha invitado un total de **${miembroInv.totales.toLocaleString()}** ${miembroInv.totales==1 ? `usuario`: `usuarios`} de esos **${miembroInv.verdaderas.toLocaleString()}** ${miembroInv.verdaderas==1 ? `es valida`: `son validas`}, **${miembroInv.restantes.toLocaleString()}** ${miembroInv.restantes==1 ? "se ha salido": "se han salido"} y **${miembroInv.falsas.toLocaleString()}** ${miembroInv.falsas==1 ? "es falsa.": "son falsas."}`): ""

                            setTimeout(async ()=>{
                                await int.channel.send({embeds: [embInfoMiembro]})
                            }, 400)

                        }else{
                            embInfoMiembro
                            .setTitle(`<a:Info:926972188018479164> Información de`)
                            .setDescription(`<@${miembro.id}>`)
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))

                            sugerenciasDB ? embInfoMiembro.addField(`🗳️ **Sugerencias:**`, `Ha creado ${miembroSug.sugerencias<=1 ? `**${miembroSug.sugerencias}** sugerencia que aha sido ${miembroSug.aceptadas==0 ? `denegada.`: `aceptada.`}`: `**${miembroSug.sugerencias}** sugerencias de las cuales ${miembroSug.aceptadas==1 ? `**${miembroSug.aceptadas}** ha sido aceptada`: `**${miembroSug.aceptadas}** han sido aceptadas`} y ${miembroSug.denegadas==1 ? `**${miembroSug.denegadas}** denegada.`: `**${miembroSug.denegadas}** denegadas.`}`}`): ""
                            ticketsDB ? embInfoMiembro.addField(`<:tickets:962127203645136896> **Tickets:**`, `Ha creado ${miembroTik.ticketsCreados==1 ? `**${miembroTik.ticketsCreados}** ticket.`: `**${miembroTik.ticketsCreados}** tickets.`}`): ""

                            setTimeout(async ()=>{
                                await int.channel.send({embeds: [embInfoMiembro]})
                            }, 400)
                        }
                    }

                }else{
                    let alianzasDB = dataAli.miembros.some(s=> s.id == int.user.id), sugerenciasDB = dataSug.miembros.some(s=>s.id == int.user.id), ticketsDB = dataTs.miembros.some(s=>s.id == int.user.id), invitesDB = dataInv.miembros.some(s=> s.id == int.user.id)
                    let miembroAli = dataAli.miembros.find(f=> f.id == int.user.id), miembroSug = dataSug.miembros.find(f=>f.id == int.user.id), miembroTik = dataTs.miembros.find(f=>f.id == int.user. id), miembroInv = dataInv.miembros.find(f=> f.id==int.user.id)
                    const embInfoMiembro = new Discord.MessageEmbed()
                    .setAuthor(int.member.nick ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
                    .setColor(int.guild.me.displayHexColor)
                    .setTimestamp()
                    // if(int.member.permissions.has("ADMINISTRATOR") || int.member.roles.cache.has("887444598715219999")){
                    if(int.member.permissions.has("ADMINISTRATOR")){
                        embInfoMiembro
                        .setTitle(`<a:Info:926972188018479164> Tu información`)
                        .setDescription(`<@${int.user.id}>`)
                        .setFooter(int.guild.name, int.guild.iconURL({dynamic: true}))

                        alianzasDB ? embInfoMiembro.addField(`🤝 **Alianzas:**`, `Has creado ${miembroAli.cantidad<=1 ? `**${miembroAli.cantidad}** alianza.`: `**${miembroAli.cantidad}** alianzas.`}`): "" 
                        sugerenciasDB ? embInfoMiembro.addField(`🗳️ **Sugerencias:**`, `Has creado ${miembroSug.sugerencias<=1 ? `**${miembroSug.sugerencias}** sugerencia que aha sido ${miembroSug.aceptadas==0 ? `denegada.`: `aceptada.`}`: `**${miembroSug.sugerencias}** sugerencias de las cuales ${miembroSug.aceptadas==1 ? `**${miembroSug.aceptadas}** ha sido aceptada`: `**${miembroSug.aceptadas}** han sido aceptadas`} y ${miembroSug.denegadas==1 ? `**${miembroSug.denegadas}** denegada.`: `**${miembroSug.denegadas}** denegadas.`}`}`): ""
                        ticketsDB ? embInfoMiembro.addField(`<:tickets:962127203645136896> **Tickets:**`, `Has creado ${miembroTik.ticketsCreados==1 ? `**${miembroTik.ticketsCreados}** ticket.`: `**${miembroTik.ticketsCreados}** tickets.`}`): ""
                        invitesDB ? embInfoMiembro.addField(`<:invitacion:981322040105639987> **Invitaciones:**`, `Has invitado un total de **${miembroInv.totales.toLocaleString()}** ${miembroInv.totales==1 ? `usuario de ese`: `usuarios de esos`} **${miembroInv.verdaderas.toLocaleString()}** ${miembroInv.verdaderas==1 ? `es valida`: `son validas`}, **${miembroInv.restantes.toLocaleString()}** ${miembroInv.restantes==1 ? "se ha salido": "se han salido"} y **${miembroInv.falsas.toLocaleString()}** ${miembroInv.falsas==1 ? "es falsa.": "son falsas."}`): ""

                        setTimeout(async ()=>{
                            await int.channel.send({embeds: [embInfoMiembro]})
                        }, 400)
                        
                    }else{
                        embInfoMiembro
                        .setTitle(`<a:Info:926972188018479164> Tu información`)
                        .setDescription(`<@${int.user.id}>`)
                        .setFooter(int.guild.name, int.guild.iconURL({dynamic: true}))

                        sugerenciasDB ? embInfoMiembro.addField(`🗳️ **Sugerencias:**`, `Has creado ${miembroSug.sugerencias<=1 ? `**${miembroSug.sugerencias}** sugerencia que aha sido ${miembroSug.aceptadas==0 ? `denegada.`: `aceptada.`}`: `**${miembroSug.sugerencias}** sugerencias de las cuales ${miembroSug.aceptadas==1 ? `**${miembroSug.aceptadas}** ha sido aceptada`: `**${miembroSug.aceptadas}** han sido aceptadas`} y ${miembroSug.denegadas==1 ? `**${miembroSug.denegadas}** denegada.`: `**${miembroSug.denegadas}** denegadas.`}`}`): ""
                        ticketsDB ? embInfoMiembro.addField(`<:tickets:962127203645136896> **Tickets:**`, `Has creado ${miembroTik.ticketsCreados==1 ? `**${miembroTik.ticketsCreados}** ticket.`: `**${miembroTik.ticketsCreados}** tickets.`}`): ""
                        invitesDB ? embInfoMiembro.addField(`<:invitacion:981322040105639987> **Invitaciones:**`, `Has invitado un total de **${miembroInv.totales.toLocaleString()}** ${miembroInv.totales==1 ? `usuario`: `usuarios`} de esos **${miembroInv.verdaderas.toLocaleString()}** ${miembroInv.verdaderas==1 ? `es valida`: `son validas`}, **${miembroInv.restantes.toLocaleString()}** ${miembroInv.restantes==1 ? "se ha salido": "se han salido"} y **${miembroInv.falsas.toLocaleString()}** ${miembroInv.falsas==1 ? "es falsa.": "son falsas."}`): ""

                        setTimeout(async ()=>{
                            await int.reply({ephemeral: true, embeds: [embInfoMiembro]})
                        }, 400)
                    }
                }
            }
        }

        if(int.commandName == "crear"){
            if(int.options.getSubcommand("alianza") == "alianza"){
                estadisticas.comandos++
                let dataAli = await alianzasDB.findById(servidorID), arrayMi = dataAli.miembros, arraySv = dataAli.servidores, servidor = client.guilds.cache.get("773249398431809586"), canal = servidor.channels.cache.get("826863938057797633"), canalLog = servidor.channels.cache.get(dataAli.canalID), enviado = false
    
                let aliado = int.options.getUser("aliado"), notificacion = int.options.getBoolean("notificación")
    
                const embErr1 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`No eres miembro de soporte del servidor, por lo tanto no puedes utilizar el comando el comando.`)
                .setColor(colorErr)
                .setTimestamp()
                if(int.guild.ownerId != int.user.id && !int.member.permissions.has("ADMINISTRATOR") && !int.member.roles.cache.has("887444598715219999")) return setTimeout(()=>{
                    int.reply({embeds: [embErr1], ephemeral: true})
                }, 400)
    
    
                const embAdvertencia = new Discord.MessageEmbed()
                .setTitle("<:advertencia:929204500739268608> Advertencia")
                .setDescription(`Tienes **30** segundos para proporcionar la plantilla.`)
                .setColor(int.guild.me.displayHexColor)
                int.reply({embeds: [embAdvertencia], ephemeral: true})
               
                
                setTimeout(()=>{
                    if(!enviado){
                        const embTiempoAgotado = new Discord.MessageEmbed()
                        .setTitle(`<:advertencia:929204500739268608> Tiempo agotado`)
                        .setDescription(`Se te ha terminado el tiempo para enviar la plantilla.`)
                        .setColor("YELLOW")
                        int.editReply({embeds: [embTiempoAgotado]}).catch(c=> console.log(c))
                    }
                }, 30000)
    
                const colector = int.channel.createMessageCollector({filter: u=> u.author.id == int.user.id, time: 30000, max: 1})
    
                colector.on("collect",async m=> {
                    async function alianzaSystem (des1, des2, des3, contenido) {
                        const embPlantilla = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag, int.user.displayAvatarURL({dynamic: true}))
                        .setDescription(des1)
                        .setColor(servidor.roles.cache.get("840704364158910475").hexColor)
                        canal.send({content: contenido}).then(mc=>{
                            const embEnviada = new Discord.MessageEmbed()
                            .setTitle(`<a:afirmativo:856966728806432778> Alianza creada`)
                            .setDescription(des2)
                            .setColor(int.guild.me.displayHexColor)
                            .setTimestamp()
                            
                            mc.reply({embeds: [embPlantilla]})
                            enviado = true
                            
                            int.editReply({embeds: [embEnviada]})
                            if(aliado){
                                int.guild.members.cache.get(aliado.id).roles.add("895394175481159680")
                            }
                        })
        
                        const embRegistro = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setTitle(`<a:afirmativo:856966728806432778> Alianza creada`)
                        .setDescription(des3)
                        .setColor(servidor.roles.cache.get("840704364158910475").hexColor)
                        .setTimestamp()
                        if(aliado){
                            embRegistro.setFooter(aliado.tag,aliado.displayAvatarURL({dynamic: true}))
                        }
                        canalLog.send({embeds: [embRegistro]})
    
                        if(arrayMi.some(s=> s.id == int.user.id)){
                            let miembro = arrayMi.find(f=> f.id == int.user.id)
                            miembro.cantidad++
                            miembro.tag = int.user.tag
                            await alianzasDB.findByIdAndUpdate(int.guildId, {miembros: arrayMi})
                        }else{
                            arrayMi.push({tag: int.user.tag, id: int.user.id, cantidad: 1})
                            await alianzasDB.findByIdAndUpdate(int.guildId, {miembros: arrayMi})
                        }
                    }
    
                    if(m){
                        let plantilla = m.content.replace(/@/g, "")
                        setTimeout(()=>{
                            m.delete().catch(c=>c)
                        }, 400)
    
                        const embErr2 = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(`La plantilla que has proporcionado no es una plantilla de un servidor ya que no contienen ningún enlace de invitación a un servidor de Discord.`)
                        .setColor(colorErr)
                        .setTimestamp()
                        if(!["discord.gg/","discord.com/invite/"].some(s=> plantilla.includes(s))) return int.editReply({embeds: [embErr2]})

                        client.fetchInvite(plantilla.split(/ +/g).find(f=> ["discord.com/invite/", "discord.gg/"].some(s=> f.includes(s)))).then(async invite=> {
                            if(arraySv.some(s=> s.id == invite.guild.id)){
                                let servidor = arraySv.find(f=> f.id==invite.guild.id)
                                const embErr3 = new Discord.MessageEmbed()
                                .setTitle(`${emojiError} Error`)
                                .setDescription(`Ya se ha echo alianza con ese servidor y esa alianza se ha echo **<t:${Math.floor(servidor.tiempo/1000)}:R>** así que no se puede renovar por ahora.`)
                                .setColor(colorErr)
                                .setTimestamp()
                                if(servidor.tiempo>=Math.floor(Date.now()-ms("7d"))) return int.editReply({ephemeral: true, embeds: [embErr3]})

                                servidor.nombre = invite.guild.name
                                servidor.tiempo = Date.now()
                                servidor.invitacion = invite.url
                                servidor.miembros = invite.memberCount
                                await alianzasDB.findByIdAndUpdate(servidorID, {servidores: arraySv})

                            }else{
                                arraySv.push({nombre: invite.guild.name, id: invite.guild.id, tiempo: Date.now(), inviteacion: invite.url, miembros: invite.memberCount})
                                await alianzasDB.findByIdAndUpdate(servidorID, {servidores: arraySv})
                            }

                            if(aliado){
                                const embErr2 = new Discord.MessageEmbed()
                                .setTitle(`${emojiError} Error`)
                                .setDescription(`Un bot no puede ser un aliado.`)
                                .setColor(colorErr)
                                .setTimestamp()
                                if(aliado.bot) return setTimeout(()=>{
                                    int.editReply({embeds: [embErr2], ephemeral: true})
                                }, 400)
        
                                const embErr3 = new Discord.MessageEmbed()
                                .setTitle(`${emojiError} Error`)
                                .setDescription(`Tu mismo no puedes elegirte como aliado, si quieres hacer una alianza con el servidor deja que otro miembro publique la plantilla te añada como aliado.`)
                                .setColor(colorErr)
                                .setTimestamp()
                                if(aliado.id == int.user.id) return setTimeout(()=>{
                                    int.editReply({embeds: [embErr3], ephemeral: true})
                                }, 400)
        
                                if(notificacion){
                                    alianzaSystem(`*Alianza creada por ${int.user} y por el aliado <@${aliado.id}>*\n**¿Quieres hacer una alianza?**, utiliza el comando de barra diagonal \`\`/información allianzas\`\` al utilizarlo obtendrás la información necesaria para crear una alianza.`, 
                                    `Plantilla enviada al canal <#${canal.id}>, gracias por la alianza de ${aliado}.`,
                                    `Alianza creada por ${int.user}, gracias al aliado ${aliado}, se ha utilizado el ping <@&840704364158910475>.`,
                                    `${plantilla}\n<@&840704364158910475>`
                                    )
        
                                }else{
                                    alianzaSystem(`*Alianza creada por ${int.user} y por el aliado <@${aliado.id}>*\n**¿Quieres hacer una alianza?**, utiliza el comando de barra diagonal \`\`/información allianzas\`\` al utilizarlo obtendrás la información necesaria para crear una alianza.`, 
                                    `Plantilla enviada al canal <#${canal.id}>, gracias por la alianza de ${aliado}.`,
                                    `Alianza creada por ${int.user}, gracias al aliado ${aliado}, *no se ha utilizado ping*.`,
                                    plantilla
                                    )
        
                                }
                            }else{
                                if(notificacion){
                                    alianzaSystem(`*Alianza creada por ${int.user}*\n**¿Quieres hacer una alianza?**, utiliza el comando de barra diagonal \`\`/información allianzas\`\` al utilizarlo obtendrás la información necesaria para crear una alianza.`, 
                                    `Plantilla enviada al canal <#${canal.id}>, gracias por la alianza.`,
                                    `Alianza creada por ${int.user} que ha utilizado el ping <@&840704364158910475>.`,
                                    `${plantilla}\n<@&840704364158910475>`
                                    )
        
                                }else{
                                    alianzaSystem(`*Alianza creada por ${int.user}*\n**¿Quieres hacer una alianza?**, utiliza el comando de barra diagonal \`\`/información allianzas\`\` al utilizarlo obtendrás la información necesaria para crear una alianza.`, 
                                    `Plantilla enviada al canal <#${canal.id}>, gracias por la alianza.`,
                                    `Alianza creada por ${int.user}, *no se ha utilizado ping*.`,
                                    plantilla
                                    )
        
                                }
                            }
                        }).catch(error=> {
                            const embErrFin = new Discord.MessageEmbed()
                            .setTitle(`${emojiError} Error`)
                            .setDescription(`Lo ciento no he podido obtener información de la invitación de la plantilla, puede ser que la invitación haya expirado o no sea real.`)
                            .setColor(colorErr)
                            .setTimestamp()
                            int.reply({ephemeral: true, embeds: [embErrFin]})
                        })
                        // console.log("No paso nada", plantilla)
                    }
                })
            }
            if(int.options.getSubcommand("colaborador") == "colaborador"){
                estadisticas.comandos++
                let dataCol = await colaboradoresDB.findById("842630591257772033"), arrayCo = dataCol.colaboradores, miembro = int.guild.members.cache.get(int.options.getUser("colaborador").id), nombre  = int.options.getString("nombre")

                let erroresP = [
                    {condicion: !int.member.permissions.has("ADMINISTRATOR"), descripcion: `¡No eres administrador del servidor!, no puede utilizar el comando.`},
                    {condicion: miembro.user.bot, descripcion: `El miembro que has proporcionado *(${miembro})* es un bot, un bot no puede ser colaborador.`},
                    {condicion: miembro.id==int.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* eres tu, no te puedes otorgar los veneficios como colaborador a ti mismo.`},
                    {condicion: miembro.id==int.guild.ownerId, descripcion: `El miembro que has proporcionado *(${miembro})* es el sueño del servidor no tiene sentido que sea colaborador.`},
                    {condicion: !arrayEn.filter(f=> f.activo).some(s=>s.id == mensajeID), descripcion: `La ID que proporcionaste *(${mensajeID})* no coincide con la de ningúna encuesta activa pero si con la de una encuesta que ha finalizado, solo puedes finalizar las encuestas que estén activas.`},
                    // {condicion: "", descripcion: ``},
                ]
                for(e in erroresP){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(erroresP[e].descripcion)
                    .setColor(colorErr)
                    if(erroresP[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                }

                if(arrayCo.some(s=>s.id == miembro.id)){
                    let colaborador = arrayCo.find(f=>f.id == miembro.id)
                    if(colaborador.colaborador){
                        const embEscolaborador = new Discord.MessageEmbed()
                        .setTitle(`💎 Es colaborador`)
                        .setDescription(`El miembro ${miembro} ya es colaborador del servidor.`)
                        .setColor(miembro.displayHexColor)
                        int.reply({ephemeral: true, embeds: [embEscolaborador]})
                    }else{
                        miembro.roles.add(dataCol.datos.rolID)
                        int.guild.channels.create(`『』${nombre}`, {parent: dataCol.datos.categoriaID, permissionOverwrites: [{id: miembro.id, deny: "MANAGE_ROLES", allow: ['CREATE_INSTANT_INVITE', 'MANAGE_CHANNELS', 'ADD_REACTIONS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'MANAGE_WEBHOOKS', 'USE_APPLICATION_COMMANDS', 'MANAGE_THREADS', 'USE_PUBLIC_THREADS', 'CREATE_PUBLIC_THREADS', 'USE_PRIVATE_THREADS', 'CREATE_PRIVATE_THREADS', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS']}]}).then(async tc=>{
                            const embCanalCreado = new Discord.MessageEmbed()
                            .setTitle(`<a:afirmativo:856966728806432778> Canal creado`)
                            .setDescription(`El canal ${tc} ha sido creado para el colaborador ${miembro} y se le ha agregado el rol <@&${dataCol.datos.rolID}>.`)
                            .setColor(int.guild.me.displayHexColor)
                            int.reply({content: `<@${miembro.id}>`, embeds: [embCanalCreado]})
                            colaborador.id = miembro.id
                            colaborador.tag = miembro.user.tag
                            colaborador.canalID = tc.id
                            colaborador.fecha = Date.now()
                            colaborador.colaborador = true
                            colaborador.tiempo = false
                            colaborador.notificado = true
                            await colaboradoresDB.findByIdAndUpdate("842630591257772033", {colaboradores: arrayCo})
                        })
                    }
                }else{
                    miembro.roles.add(dataCol.datos.rolID)
                    int.guild.channels.create(`『』${nombre}`, {parent: dataCol.datos.categoriaID, permissionOverwrites: [{id: miembro.id, deny: "MANAGE_ROLES", allow: ['CREATE_INSTANT_INVITE', 'MANAGE_CHANNELS', 'ADD_REACTIONS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'MANAGE_WEBHOOKS', 'USE_APPLICATION_COMMANDS', 'MANAGE_THREADS', 'USE_PUBLIC_THREADS', 'CREATE_PUBLIC_THREADS', 'USE_PRIVATE_THREADS', 'CREATE_PRIVATE_THREADS', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS']}]}).then(async tc=>{
                        const embCanalCreado = new Discord.MessageEmbed()
                        .setTitle(`<a:afirmativo:856966728806432778> Canal creado`)
                        .setDescription(`El canal ${tc} ha sido creado para el nuevo colaborador ${miembro} y se le ha agregado el rol <@&${dataCol.datos.rolID}>.`)
                        .setColor(int.guild.me.displayHexColor)
                        int.reply({content: `<@${miembro.id}>`, embeds: [embCanalCreado]})
                        arrayCo.push({id: miembro.id, tag: miembro.user.tag, canalID: tc.id, fecha: Date.now(), tiempo: false, colaborador: true, notificado: true})
                        await colaboradoresDB.findByIdAndUpdate("842630591257772033", {colaboradores: arrayCo})
                    })
                }
            }
            if(int.options.getSubcommand("encuesta") == "encuesta"){
                estadisticas.comandos++
                let dataEnc = await encuestasDB.findById(servidorID), arrayEn = dataEnc.encuestas, color = int.guild.roles.cache.get(dataEnc.datos.rolID).hexColor, titulo = int.options.getString("titulo"), tiempo = int.options.getString("tiempo"), descripcion = int.options.getString("descripción") ? int.options.getString("descripción"): false, canal = int.options.getChannel("canal") ? int.options.getChannel("canal"): false, opcion1 = int.options.getString("opción1") ? int.options.getString("opción1"): false, opcion2 = int.options.getString("opción2") ? int.options.getString("opción2"): false, opcion3 = int.options.getString("opción3") ? int.options.getString("opción3"): false, opcion4 = int.options.getString("opción4") ? int.options.getString("opción4"): false, opcion5 = int.options.getString("opción5") ? int.options.getString("opción5"): false, opcion6 = int.options.getString("opción6") ? int.options.getString("opción6"): false, cantidadOpciones = 0, posicion = 0, opciones = []
                if(opcion1){
                    cantidadOpciones++
                    opciones.push({emoji: dataEnc.datos.emojis[posicion], opcion: opcion1, votos: 0})
                    posicion++
                }
                if(opcion2){
                    cantidadOpciones++
                    opciones.push({emoji: dataEnc.datos.emojis[posicion], opcion: opcion2, votos: 0})
                    posicion++
                }
                if(opcion3){
                    cantidadOpciones++
                    opciones.push({emoji: dataEnc.datos.emojis[posicion], opcion: opcion3, votos: 0})
                    posicion++
                }
                if(opcion4){
                    cantidadOpciones++
                    opciones.push({emoji: dataEnc.datos.emojis[posicion], opcion: opcion4, votos: 0})
                    posicion++
                }
                if(opcion5){
                    cantidadOpciones++
                    opciones.push({emoji: dataEnc.datos.emojis[posicion], opcion: opcion5, votos: 0})
                    posicion++
                }
                if(opcion6){
                    cantidadOpciones++
                    opciones.push({emoji: dataEnc.datos.emojis[posicion], opcion: opcion6, votos: 0})
                    posicion++
                }
                console.log(cantidadOpciones)
                let erroresP = [
                    {condicion: !int.member.permissions.has("ADMINISTRATOR"), descripcion: `¡No eres administrador del servidor!, no puede utilizar el comando.`},
                    {condicion: titulo.length>200, descripcion: `El tamaño del titulo *(${titulo.length})* supera el limite de **200** caracteres, proporciona un titulo más pequeño.`},
                    {condicion: !isNaN(tiempo), descripcion: `El tiempo proporcionado *(${tiempo})* no es valido ya que solo son números, también proporciona una letra que indique si son minutos, horas o días.`},
                    {condicion: !ms(tiempo), descripcion: `El tiempo proporcionado *(${tiempo})* es in correcto.\nEjemplos:\n**Minutos:** 3m, 5m, 20m, 60m, etc\n**Horas:** 1h, 4h, 10h, 24h, etc\n**Días:** 1d, 2d, 4d, etc.`},
                    {condicion: ms(tiempo)>ms("10d"), descripcion: `La cantidad de tiempo que has proporcionado *(${tiempo})* supera el limite de tiempo que un sorteo puede estar activo, proporciona un tiempo menor.`},
                    {condicion: !opcion1 && !opcion2 && !opcion3 && !opcion4 && !opcion5 && !opcion6, descripcion: `No has proporcionado ninguna opción para la encuesta, no se puede realizar una encuesta sin opciones.`},
                    {condicion: cantidadOpciones<2, descripcion: `Solo has proporcionado **1** opción, una encuesta debe de tener mínimo **2** opciones.`},
                    {condicion: descripcion && descripcion.length>600, descripcion: `El tamaño de la descripción *(${descripcion.length})* supera el limite de **600** caracteres, proporciona una descripción más pequeña.`},
                    // {condicion: id, descripcion: ``},
                ]
                for(e in erroresP){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(erroresP[e].descripcion)
                    .setColor(colorErr)
                    if(erroresP[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                }
            
                const embEncuesta = new Discord.MessageEmbed()
                .setAuthor({name: `⏸️ Encuesta en curso`})
                .setTitle(titulo)
                .setDescription(descripcion ? descripcion: "")
                .addField(`🧩 **Opciones**`, `${opciones.map(m=> `${m.emoji} ${m.opcion}`).join("\n")}`)
                .addField(`<a:Info:926972188018479164> **Información**`, `¡Selecciona una opción!\nFinaliza: <t:${Math.floor((Date.now()+ms(tiempo))/1000)}:R> *(<t:${Math.floor((Date.now()+ms(tiempo))/1000)}:F>)*\nCreada por: ${int.user}.`)
                .setColor(color)

                const embEnviado = new Discord.MessageEmbed()
                .setTitle(`<a:afirmativo:856966728806432778> Encuesta creada`)
                .setColor("#00ff00")
                if(canal){
                    canal.send({embeds: [embEncuesta], content: `**<@&${dataEnc.datos.rolID}>**`}).then(async ts=>{
                        embEnviado
                        .setDescription(`La encuesta ha sido creada en el canal ${canal}.`)
                        for(let r=0; r<opciones.length; r++){
                            ts.react(dataEnc.datos.emojis[r])
                        }
                        int.reply({ephemeral: true, embeds: [embEnviado]})
                        arrayEn.push({id: ts.id, canalID: canal.id, finaliza: Math.floor(Date.now()+ms(tiempo)), autorID: int.user.id, creado: Date.now(), activa: true, opciones: opciones})
                        await encuestasDB.findByIdAndUpdate(servidorID, {encuestas: arrayEn})
                    })

                }else{
                    int.channel.send({embeds: [embEncuesta], content: `**<@&${dataEnc.datos.rolID}>**`}).then(async ts=>{
                        embEnviado
                        .setDescription(`La encuesta ha sido creada en este canal.`)
                        for(let r=0; r<opciones.length; r++){
                            ts.react(dataEnc.datos.emojis[r])
                        }
                        int.reply({ephemeral: true, embeds: [embEnviado]})
                        arrayEn.push({id: ts.id, canalID: int.channelId, finaliza: Math.floor(Date.now()+ms(tiempo)), autorID: int.user.id, creado: Date.now(), activa: true, opciones: opciones})
                        await encuestasDB.findByIdAndUpdate(servidorID, {encuestas: arrayEn})
                    })
                }
            }
            if(int.options.getSubcommand("sorteo") == "sorteo"){
                estadisticas.comandos++
                let dataSor = await sorteosDB.findById(servidorID), arraySo = dataSor.sorteos, color = int.guild.roles.cache.get(dataSor.datos.rolID).hexColor, titulo = int.options.getString("titulo"), tiempo = int.options.getString("tiempo"), ganadores = int.options.getInteger("ganadores") ? Math.floor(int.options.getInteger("ganadores")): false, descripcion = int.options.getString("descripción") ? int.options.getString("descripción"): false, canal = int.options.getChannel("canal") ? int.options.getChannel("canal"): false 
                
                let erroresP = [
                    {condicion: !int.member.permissions.has("ADMINISTRATOR"), descripcion: `¡No eres administrador del servidor!, no puede utilizar el comando.`},
                    {condicion: titulo.length>200, descripcion: `El tamaño del titulo *(${titulo.length})* supera el limite de **200** caracteres, proporciona un titulo mas pequeño.`},
                    {condicion: !isNaN(tiempo), descripcion: `El tiempo proporcionado *(${tiempo})* no es valido ya que solo son números, también proporciona una letra que indique si son minutos, horas o días.`},
                    {condicion: !ms(tiempo), descripcion: `El tiempo proporcionado *(${tiempo})* es in correcto.\nEjemplos:\n**Minutos:** 3m, 5m, 20m, 60m, etc\n**Horas:** 1h, 4h, 10h, 24h, etc\n**Días:** 1d, 2d, 4d, etc.`},
                    {condicion: ms(tiempo)>ms("10d"), descripcion: `La cantidad de tiempo que has proporcionado *(${tiempo})* supera el limite de tiempo que un sorteo puede estar activo, proporciona un tiempo menor.`},
                    {condicion: ganadores>10, descripcion: `La cantidad de ganadores *(${Math.floor(ganadores)})* supera el limite de ganadores de un sorteo.`},
                    {condicion: descripcion && descripcion.length>600, descripcion: `El tamaño de la descripción *(${descripcion.length})* supera el limite de **600** caracteres, proporciona una descripción mas pequeña.`},
                    // {condicion: id, descripcion: ``},
                ]
                for(e in erroresP){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(erroresP[e].descripcion)
                    .setColor(colorErr)
                    if(erroresP[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                }

                const embSorteo = new Discord.MessageEmbed()
                .setAuthor({name: `⏸️ Sorteo en curso`, iconURL: int.user.displayAvatarURL({dynamic: true})})
                .setTitle(titulo)
                .setDescription(descripcion ? `${descripcion}\n\n`: ``)
                .addField(`\u200B`, `¡Reacciona a <a:confeti:974801702307901490> para participar!\nFinaliza: <t:${Math.floor((Date.now()+ms(tiempo))/1000)}:R> *(<t:${Math.floor((Date.now()+ms(tiempo))/1000)}:F>)*\nGanadores: ${ganadores==1 ? `solo **1**`: `**${ganadores}**`}\nCreado por: ${int.user}.`)
                .setColor(color)
                .setFooter(int.guild.name, int.guild.iconURL({dynamic: true}))
                .setTimestamp()

                const embEnviado = new Discord.MessageEmbed()
                .setTitle(`<a:afirmativo:856966728806432778> Sorteo creado`)
                .setColor("#00ff00")
                if(canal){
                    canal.send({embeds: [embSorteo], content: `**<@&${dataSor.datos.rolID}>**`}).then(async ts=>{
                        embEnviado
                        .setDescription(`El sorteo ha sido creado en el canal ${canal}.`)
                        ts.react("974801702307901490")
                        int.reply({ephemeral: true, embeds: [embEnviado]})
                        arraySo.push({id: ts.id, canalID: canal.id, finaliza: Math.floor(Date.now()+ms(tiempo)), ganadores: ganadores, autorID: int.user.id, creado: Date.now(), activo: true, participantes: []})
                        await sorteosDB.findByIdAndUpdate(servidorID, {sorteos: arraySo})
                    })
                }else{
                    int.channel.send({embeds: [embSorteo], content: `**<@&${dataSor.datos.rolID}>**`}).then(async ts=>{
                        embEnviado
                        .setDescription(`El sorteo ha sido creado en este canal.`)
                        ts.react("974801702307901490")
                        int.reply({ephemeral: true, embeds: [embEnviado]})
                        arraySo.push({id: ts.id, canalID: int.channelId, finaliza: Math.floor(Date.now()+ms(tiempo)), ganadores: ganadores, autorID: int.user.id, creado: Date.now(), activo: true, participantes: []})
                        await sorteosDB.findByIdAndUpdate(servidorID, {sorteos: arraySo})
                    })
                }
            }
        }

        if(int.commandName == "finalizar"){
            if(int.options.getSubcommand("encuesta") == "encuesta"){
                let dataEnc = await encuestasDB.findById(servidorID), arrayEn = dataEnc.encuestas, mensajeID = int.options.getString("id")

                let errores = [
                    {condicion: !int.member.permissions.has("ADMINISTRATOR"), descripcion: `¡No eres administrador del servidor!, no puede utilizar el comando.`},
                    {condicion: isNaN(mensajeID), descripcion: `La ID de la encuesta *(${mensajeID})* no es valida ya que contiene caracteres no numéricos.`},
                    {condicion: mensajeID.length != 18, descripcion: `La ID la encuesta *(${mensajeID})* no es valida ya que no contiene exactamente **18** caracteres numéricos contiene menos o mas.`},
                    {condicion: !arrayEn.some(s=>s.id == mensajeID), descripcion: `La ID que proporcionaste *(${mensajeID})* no coincide con la ID de ningúna encuesta en el servidor.`},
                    {condicion: !arrayEn.filter(f=> f.activa).some(s=>s.id == mensajeID), descripcion: `La ID que proporcionaste *(${mensajeID})* no coincide con la de ningúna encuesta activa pero si con la de una encuesta que ha finalizado, solo puedes finalizar las encuestas que estén activas.`},
                    // {condicion: "", descripcion: ``},
                ]
                for(e in errores){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(errores[e].descripcion)
                    .setColor(colorErr)
                    if(errores[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                }

                let encuesta = arrayEn.find(f=>f.id == mensajeID), canal = client.channels.cache.get(encuesta.canalID), mensage = canal.messages.cache.get(mensajeID)
                if(mensage){
                    let opcionesOrdenadas = encuesta.opciones.sort((a,b)=> b.votos - a.votos), totalVotos = 0, bueltas = 1, tabla = []
                    opcionesOrdenadas.map(m=> totalVotos+=m.votos)

                    for(o of opcionesOrdenadas){
                        let porcentaje = (o.votos*100/totalVotos).toFixed(2), carga = "█", vacio = " ", diseño = ""
                        
                        for(let i=0; i<20; i++){
                            if(i < porcentaje/100*20){
                                diseño = diseño.concat(carga)
                            }else{
                                diseño = diseño.concat(vacio)
                            }
                        }
                        tabla.push(`**${bueltas==1 ? "🥇": bueltas==2 ? "🥈": bueltas==3 ? "🥉": `${bueltas}`}.** ${o.emoji} ${o.opcion} *(${o.votos})*\n\`\`${diseño}\`\` **|** ${porcentaje}%`)
                        bueltas++
                    }

                    if(encuesta.opciones.filter(f=> f.votos>0).length==0){
                        const embError2 = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(`No puedes finalizar la encuesta ya que nadie ha participado en ella.`)
                        .setColor(colorErr)
                        int.reply({ephemeral: true, embeds: [embError2]})

                    }else{
                        const embed = mensage.embeds[0]
                        embed.author.name = `▶️ Encuesta finalizada forzadamente por ${int.user.tag}`
                        embed.fields[0].value = tabla.join("\n\n")
                        embed.fields[1].value = `Opción ganadora: **${opcionesOrdenadas[0].opcion}**\nVotos totales: **${totalVotos}**\nCreada por: <@${encuesta.autorID}>`
                        mensage.edit({embeds: [embed]})
                        encuesta.activa = false
                        await encuestasDB.findByIdAndUpdate(servidorID, {encuestas: arrayEn})

                        const embFinalizada = new Discord.MessageEmbed()
                        .setTitle(`⏹️ Encuesta finalizada`)
                        .setDescription(`Has finalizado la encuesta de **${embed.title}** en ${int.channelId == canal.id ? "este canal": `el canal ${canal}`}.`)
                        .setColor("#00ff00")
                        int.reply({ephemeral: true, embeds: [embFinalizada]})
                    }

                }else{
                    const embError1 = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(`No pude encontrar la encuesta, puede ser que se haya eliminado.`)
                    .setColor(colorErr)
                    int.reply({ephemeral: true, embeds: [embError1]})
                }
            }
            if(int.options.getSubcommand("sorteo") == "sorteo"){
                let dataSor = await sorteosDB.findById(servidorID), arraySo = dataSor.sorteos, mensajeID = int.options.getString("id")

                let errores = [
                    {condicion: !int.member.permissions.has("ADMINISTRATOR"), descripcion: `¡No eres administrador del servidor!, no puede utilizar el comando.`},
                    {condicion: isNaN(mensajeID), descripcion: `La ID del sorteo *(${mensajeID})* no es valida ya que contiene caracteres no numéricos.`},
                    {condicion: mensajeID.length != 18, descripcion: `La ID del sorteo *(${mensajeID})* no es valida ya que no contiene exactamente **18** caracteres numéricos contiene menos o mas.`},
                    {condicion: !arraySo.some(s=>s.id == mensajeID), descripcion: `La ID que proporcionaste *(${mensajeID})* no coincide con la ID de ningún sorteo en el servidor.`},
                    {condicion: !arraySo.filter(f=> f.activo).some(s=>s.id == mensajeID), descripcion: `La ID que proporcionaste *(${mensajeID})* no coincide con la de ningún sorteo activo pero si con la de un sorteo que ha finalizado, solo puedes finalizar los sorteos que estén activos.`},
                    // {condicion: "", descripcion: ``},
                ]
                for(e in errores){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(errores[e].descripcion)
                    .setColor(colorErr)
                    if(errores[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                }

                let sorteo = arraySo.find(f=>f.id == mensajeID), canal = client.channels.cache.get(sorteo.canalID), mensage = canal.messages.cache.get(mensajeID)
                if(mensage){
                    let miembros = s.participantes.filter(f=> int.guild.members.cache.has(f))
                    let bueltas = 1, ganadoresFinal = []
                    for(let r=0; r<bueltas; r++){
                        let miembroRandom = miembros[Math.floor(Math.random()*miembros.length)]
                        
                        if(sorteo.ganadores>ganadoresFinal.length && !ganadoresFinal.some(s=>s==miembroRandom)){
                            ganadoresFinal.push(miembros[Math.floor(Math.random()*miembros.length)])
                            bueltas++
                        }
                    }
    
                    if(ganadoresFinal.length==0){
                        const embError2 = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(`No puedes finalizar el sorteo ya que nadie a participado en el sorteo.`)
                        .setColor(colorErr)
                        int.reply({ephemeral: true, embeds: [embError2]})
                    
                    }else{
                        const emb = mensage.embeds[0]
                        emb.author.name = "⏹️ Sorteo finalizado"
                        emb.fields[0].value = `${ganadoresFinal.length==1 ? `Ganador/a: ${ganadoresFinal.map(m=> `<@${m}>`)[0]}`: `Ganadores: ${ganadoresFinal.map(m=> `<@${m}>`).join(", ")}`}\nParticipantes: **${miembros.length}**\nCreado por: <@${sorteo.autorID}>`
                        mensage.edit({embeds: [emb]})
                        mensage.reply({content: `¡Felicidades ${ganadoresFinal.length==1 ? `${ganadoresFinal.map(m=> `<@${m}>`)[0]} has ganado`: `${ganadoresFinal.map(m=> `<@${m}>`).join(", ")} han ganado`} **${emb.title}**!\n*Sorteo finalizado forzadamente por ${int.user.tag}.*`})
                        sorteo.activo = false
                        await sorteosDB.findByIdAndUpdate(servidorID, {sorteos: arraySo})

                        const embFinalizado = new Discord.MessageEmbed()
                        .setTitle(`⏹️ Sorteo finalizado`)
                        .setDescription(`Has finalizado el sorteo de **${emb.title}** en ${int.channelId == canal.id ? "este canal": `el canal ${canal}`}.`)
                        .setColor("#00ff00")
                        int.reply({ephemeral: true, embeds: [embFinalizado]})
                    }

                }else{
                    const embError1 = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(`No pude encontrar el sorteo, puede ser que se haya eliminado.`)
                    .setColor(colorErr)
                    int.reply({ephemeral: true, embeds: [embError1]})
                }
            }
        }

        if(int.commandName == "nuevo"){
            if(int.options.getSubcommand("cazador-alianzas") == "cazador-alianzas"){
                let dataPer = await personalDB.findById(servidorID), arrayPr = dataPer.personal, miembro = int.guild.members.cache.get(int.options.getUser("cazador").id)

                let errores = [
                    {condicion: !int.member.permissions.has("ADMINISTRATOR"), descripcion: `¡No eres administrador del servidor!, no puede utilizar el comando.`},
                    {condicion: miembro.user.bot, descripcion: `El miembro que has proporcionado *(${miembro})* es un bot, un bot no puede ser cazador de alianzas.`},
                    {condicion: arrayPr.some(s=>s.id == miembro.id) && arrayPr.find(f=> f.id==miembro.id).miembro, descripcion: `El miembro que has proporcionado *(${miembro})* ya es miembro del personal.`},
                    // {condicion: "", descripcion: ``},
                ]
                for(e in errores){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(errores[e].descripcion)
                    .setColor(colorErr)
                    if(errores[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                }

                let miembroPr = arrayPr.find(f=> f.id==miembro.id)
                if(miembroPr){
                    miembro.roles.add([dataPer.datos.rolID, dataPer.datos.roles[0]])
                    miembroPr.miembro = true
                    miembroPr.rango = 1
                    await personalDB.findByIdAndUpdate(servidorID, {personal: arrayPr})
                }else{
                    miembro.roles.add([dataPer.datos.rolID, dataPer.datos.roles[0]])
                    arrayPr.push({id: miembro.id, tag: miembro.user.tag, rango: 1, miembro: true, historial: [{fecha: Date.now(), accion: (miembroPr ? `Volvió a formar parte del personal del servidor con el rango **Cazador/a de alianzas** por **${int.user.tag}** *(id: ${int.user.id})*.`: `Formo parte del personal del servidor con el rango **Cazador/a de alianzas** por **${int.user.tag}** *(id: ${int.user.id})*.`)}]})
                    await personalDB.findByIdAndUpdate(servidorID, {personal: arrayPr})
                }

                const embNuevoCazador = new Discord.MessageEmbed()
                .setAuthor(int.member.nick ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
                .setTitle(`🏹 Nuevo cazador de alianzas`)
                .setDescription(miembroPr ? `${miembro} volvió a ser miembro del personal del servidor con el rango **Cazador/a de alianzas**.`: `Ahora ${miembro} es nuevo/a miembro del personal del servidor con el rango **Cazador/a de alianzas**.`)
                .setColor(int.guild.me.displayHexColor)
                .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                int.reply({embeds: [embNuevoCazador]})

                const embRegistro = new Discord.MessageEmbed()
                .setAuthor(`Ejecutado por ${int.user.tag}`, int.user.displayAvatarURL({dynamic: true}))
                .setTitle(`📝 Registro del comando /nuevo cazador-alianzas`)
                .addFields(
                    {name: `📌 **Utilizado en:**`, value: `${int.channel}\n**ID:** ${int.channelId}`},
                    {name: `👮 **Administrador:**`, value: `${int.user}\n**ID:** ${int.user.id}`},
                    {name: `🏹 **Nuevo cazador de alianzas:**`, value: `${miembro}\n**ID:** ${miembro.id}`},
                )
                .setColor("#00F0FF")
                .setFooter(miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                int.guild.channels.cache.get(dataPer.datos.canalRegistro).send({embeds: [embRegistro]})
            }
            if(int.options.getSubcommand("ayudante") == "ayudante"){
                let dataPer = await personalDB.findById(servidorID), arrayPr = dataPer.personal, miembro = int.guild.members.cache.get(int.options.getUser("ayudante").id)

                let errores = [
                    {condicion: !int.member.permissions.has("ADMINISTRATOR"), descripcion: `¡No eres administrador del servidor!, no puede utilizar el comando.`},
                    {condicion: miembro.user.bot, descripcion: `El miembro que has proporcionado *(${miembro})* es un bot, un bot no puede ser ayudante.`},
                    {condicion: arrayPr.some(s=>s.id == miembro.id) && arrayPr.find(f=> f.id==miembro.id).miembro, descripcion: `El miembro que has proporcionado *(${miembro})* ya es miembro del personal.`},
                    // {condicion: "", descripcion: ``},
                ]
                for(e in errores){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(errores[e].descripcion)
                    .setColor(colorErr)
                    if(errores[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                }

                let miembroPr = arrayPr.find(f=> f.id==miembro.id)
                if(miembroPr){
                    miembro.roles.add([dataPer.datos.rolID, dataPer.datos.roles[1]])
                    miembroPr.miembro = true
                    miembroPr.rango = 2
                    await personalDB.findByIdAndUpdate(servidorID, {personal: arrayPr})
                }else{
                    miembro.roles.add([dataPer.datos.rolID, dataPer.datos.roles[1]])
                    arrayPr.push({id: miembro.id, tag: miembro.user.tag, rango: 2, miembro: true, historial: [{fecha: Date.now(), accion: (miembroPr ? `Volvió a formar parte del personal del servidor con el rango **Ayudante** por **${int.user.tag}** *(id: ${int.user.id})*.`: `Formo parte del personal del servidor con el rango **Ayudante** por **${int.user.tag}** *(id: ${int.user.id})*.`)}]})
                    await personalDB.findByIdAndUpdate(servidorID, {personal: arrayPr})
                }

                const embNuevoCazador = new Discord.MessageEmbed()
                .setAuthor(int.member.nick ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
                .setTitle(`🔷 Nuevo ayudante`)
                .setDescription(miembroPr ? `${miembro} volvió a ser miembro del personal del servidor con el rango **Ayudante**.`: `Ahora ${miembro} es nuevo/a miembro del personal del servidor con el rango **Ayudante**.`)
                .setColor(int.guild.me.displayHexColor)
                .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                int.reply({embeds: [embNuevoCazador]})

                const embRegistro = new Discord.MessageEmbed()
                .setAuthor(`Ejecutado por ${int.user.tag}`, int.user.displayAvatarURL({dynamic: true}))
                .setTitle(`📝 Registro del comando /nuevo ayudante`)
                .addFields(
                    {name: `📌 **Utilizado en:**`, value: `${int.channel}\n**ID:** ${int.channelId}`},
                    {name: `👮 **Administrador:**`, value: `${int.user}\n**ID:** ${int.user.id}`},
                    {name: `🔷 **Nuevo ayudante:**`, value: `${miembro}\n**ID:** ${miembro.id}`},
                )
                .setColor("#00FF83")
                .setFooter(miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                int.guild.channels.cache.get(dataPer.datos.canalRegistro).send({embeds: [embRegistro]})
            }
        }

        if(int.commandName == "historial"){
            if(int.options.getSubcommand("colaboradores") == "colaboradores"){
                estadisticas.comandos++
                let dataCol = await colaboradoresDB.findById(servidorID), bueltas = 1, tabla = []
                for(c of dataCol.colaboradores.filter(f=> int.guild.members.cache.get(f.id))){
                    let miembro = int.guild.members.cache.get(c.id)
                    if(miembro){
                        if(c.colaborador){
                            tabla.push(`**${bueltas}.** [${miembro.user.tag}](${miembro.displayAvatarURL({dynamic: true, format: "png"||"gif"})}) - es colaborador desde <t:${Math.floor(c.fecha/1000)}:R>\n**ID:** ${c.id}`)
                        }else{
                            tabla.push(`**${bueltas}.** [${miembro.user.tag}](${miembro.displayAvatarURL({dynamic: true, format: "png"||"gif"})}) - *era colaborador <t:${Math.floor(c.fecha/1000)}:R>*\n**ID:** ${c.id}`)
                        }
                    }
                    bueltas++
                }

                int.deferReply()
                let segPage
                if(String(tabla.length).slice(-1) == 0){
                    segPage = Math.floor(tabla.length / 10)
                }else{
                    segPage = Math.floor(tabla.length / 10 + 1)
                }
    
                let ttp1 = 0, ttp2 = 10, pagina = 1, descripcion = `Hay un total de **${tabla.length.toLocaleString()}** ${tabla.length <= 1 ? "colaborador.": "colaboradores."}\n\n`
                if(tabla.length > 10){
                    const embColaboradores = new Discord.MessageEmbed()
                    .setTitle(`💎 Historial de los colaboradores`)
                    .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
    
                    const botonesPrinc = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ])
    
                    const botones1 = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ])
    
                    const botones2 = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ])
                       
                    setTimeout(async ()=>{
                        int.editReply({embeds: [embColaboradores], components: [botones1]}).then(async msg =>{
                            await int.channel.messages.fetch(msg.id, {force: true}).then(mensaje => {
                                const colector = mensaje.createMessageComponentCollector({filter: u=> u.user.id == int.user.id, time: segPage*60000})
            
                                setTimeout(()=>{
                                    mensaje.edit({embeds: [embColaboradores], components: []}).catch(c=> console.log(c))
                                }, segPage*60000)
    
                                colector.on("collect", async bt => {
                                    if(bt.customId == "Si"){
                                        if(ttp2 - 10 <= 10){
                                            ttp1-=10, ttp2-=10, pagina--
    
                                            embColaboradores
                                            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embColaboradores], components: [botones1]})
                                        }else{
                                            ttp1-=10, ttp2-=10, pagina--
                                        
                                            embColaboradores
                                            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embColaboradores], components: [botonesPrinc]})
                                        }
                                    }
                                    if(bt.customId == "No"){
                                        if(ttp2 + 10 >= ordenado.length){
                                            ttp1+=10, ttp2+=10, pagina++
                                            
                                            embColaboradores
                                            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embColaboradores], components: [botones2]})
                                        }else{
                                            ttp1+=10, ttp2+=10, pagina++
                    
                                            embColaboradores
                                            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                                            await bt.update({embeds: [embColaboradores], components: [botonesPrinc]})
                                        }
                                    }
                                })  
                            }).catch(ct=>{
                                const embError = new Discord.MessageEmbed()
                                .setTitle(`${emojiError} Error`)
                                .setDescription(`Lo ciento ha ocurrido un error y no se cual es el motivo.`)
                                .setColor(colorErr)
                                int.editReply({embeds: [embError], components: []})
                            })
                        })
                    }, 400)
                }else{
                    const embColaboradores = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle(`💎 Historial de los colaboradores`)
                    .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        int.editReply({allowedMentions: {repliedUser: false},embeds: [embColaboradores]})
                    }, 400)
                }   
            }
            if(int.options.getSubcommand("personal") == "personal"){
                let dataPer = await personalDB.findById(servidorID), miembro = int.options.getUser("miembro") ? int.guild.members.cache.get(int.options.getUser("miembro").id): false

                let errores = [
                    {condicion: !int.member.permissions.has("ADMINISTRATOR") && !int.member.roles.cache.has(dataPer.datos.rolID), descripcion: `¡No eres miembro del personal de este servidor!, no puede utilizar el comando.`},
                    {condicion: miembro && miembro.user.bot, descripcion: `El miembro que has proporcionado *(${miembro})* es un bot, un bot no puede ser miembro del servidor.`},
                    {condicion: miembro && !dataPer.personal.some(s=>s.id == miembro.id), descripcion: `El miembro que has proporcionado *(${miembro})* no es miembro del personal del servidor o no esta registrado en el sistema.`},
                    {condicion: !miembro && !dataPer.personal.some(s=>s.id == int.user.id), descripcion: `No eres miembro del personal del servidor o no estas registrado en el sistema.`},
                    // {condicion: "", descripcion: ``},
                ]
                for(e in errores){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(errores[e].descripcion)
                    .setColor(colorErr)
                    if(errores[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                }
                int.deferReply()

                let bueltas = 1, tabla = []
                let persona = dataPer.personal.find(f=>f.id == (miembro ? miembro.id: int.user.id))
                for(h of persona.historial){
                    tabla.push(`> **${bueltas}.** <t:${Math.floor(h.fecha/1000)}:F> *(<t:${Math.floor(h.fecha/1000)}:R>)*\n> ${h.accion}`)
                    bueltas++
                }
                
                let segPage
                if(String(tabla.length).slice(-1) == 0){
                    segPage = Math.floor(tabla.length / 10)
                }else{
                    segPage = Math.floor(tabla.length / 10 + 1)
                }
    
                let ttp1 = 0, ttp2 = 10, pagina = 1, descripcion = miembro ? miembro.id == int.user.id ? `Tu historial ${miembro}\n\n`: `Historial de ${miembro}\n\n`: `Tu historial ${int.user}\n\n`, footerURL = miembro ? miembro.id==int.user.id ? int.guild.iconURL({dynamic: true}): miembro.displayAvatarURL({dynamic: true}): int.user.displayAvatarURL({dynamic: true}) 
                    
                if(tabla.length > 10){
                    const embHitorial = new Discord.MessageEmbed()
                    .setAuthor(int.member.nick ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
                    .setTitle(`🦺 Historial del personal`)
                    .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(`Pagina ${pagina}/${segPage}`, footerURL)
                    .setTimestamp()
    
                    const botonesPrinc = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ])
    
                    const botones1 = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ])
    
                    const botones2 = new Discord.MessageActionRow()
                    .addComponents([
                        new Discord.MessageButton()
                        .setCustomId("Si")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("No")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ])
                       
                    setTimeout(async ()=>{
                        int.editReply({embeds: [embHitorial], components: [botones1]}).then(async msg =>{
                            await int.channel.messages.fetch(msg.id, {force: true}).then(mensaje => {
                                const colector = mensaje.createMessageComponentCollector({filter: u=> u.user.id == int.user.id, time: segPage*60000})
            
                                setTimeout(()=>{
                                    mensaje.edit({embeds: [embHitorial], components: []}).catch(c=> console.log(c))
                                }, segPage*60000)
    
                                colector.on("collect", async bt => {
                                    if(bt.customId == "Si"){
                                        if(ttp2 - 10 <= 10){
                                            ttp1-=10, ttp2-=10, pagina--
    
                                            embHitorial
                                            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`, footerURL)
                                            await bt.update({embeds: [embHitorial], components: [botones1]})
                                        }else{
                                            ttp1-=10, ttp2-=10, pagina--
                                        
                                            embHitorial
                                            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`, footerURL)
                                            await bt.update({embeds: [embHitorial], components: [botonesPrinc]})
                                        }
                                    }
                                    if(bt.customId == "No"){
                                        if(ttp2 + 10 >= tabla.length){
                                            ttp1+=10, ttp2+=10, pagina++
                                            
                                            embHitorial
                                            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`, footerURL)
                                            await bt.update({embeds: [embHitorial], components: [botones2]})
                                        }else{
                                            ttp1+=10, ttp2+=10, pagina++
                    
                                            embHitorial
                                            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                            .setFooter(`Pagina ${pagina}/${segPage}`, footerURL)
                                            await bt.update({embeds: [embHitorial], components: [botonesPrinc]})
                                        }
                                    }
                                })  
                            }).catch(ct=>{
                                const embError = new Discord.MessageEmbed()
                                .setTitle(`${emojiError} Error`)
                                .setDescription(`Lo ciento ha ocurrido un error y no se cual es el motivo.`)
                                .setColor(colorErr)
                                int.editReply({embeds: [embError], components: []})
                            })
                        })
                    }, 400)
                }else{
                    
                    const embHitorial = new Discord.MessageEmbed()
                    .setAuthor(int.member.nick ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
                    .setTitle(`🦺 Historial del personal`)
                    .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(`Pagina ${pagina}/${segPage}`, footerURL)
                    .setTimestamp()
                    setTimeout(()=>{
                        int.editReply({allowedMentions: {repliedUser: false},embeds: [embHitorial]})
                    }, 400)
                }   
            }
        }

        if(int.commandName == "nivel"){
            int.deferReply()
            estadisticas.comandos++
            let dataNvl = await nivelesDB.findOne({_id: int.guildId}), miembro = false, rank = new canvacord.Rank(), coloerTxt = "#CFCFCF", img = "https://media.discordapp.net/attachments/901313790765854720/968239629444739112/fondoNvlSin_nada.png"

            if(int.options.getUser("miembro")){
                miembro = int.guild.members.cache.get(int.options.getUser("miembro").id)
            }

            if(miembro){
                if(dataNvl.miembros.some(s=> s.id == miembro.id)){
                    let miembroDB = dataNvl.miembros.find(f=>f.id == miembro.id)
                    rank
                    .setBackground("IMAGE", img)
                    .setAvatar(miembro.displayAvatarURL({format: "png"}))
                    .setCurrentXP(miembroDB.xp, coloerTxt)
                    .setRequiredXP(miembroDB.lmt)
                    .setStatus(miembro.presence?.status ? miembro.presence?.status: "offline")
                    .setProgressBar(["#07FF03", "#040404"], "GRADIENT", true)
                    .setUsername(miembro.user.username, coloerTxt)
                    .setDiscriminator(miembro.user.discriminator)
                    .setLevel(miembroDB.nivel, "Nivel:", true)
                    .setLevelColor(coloerTxt)
                    .setRank(dataNvl.miembros.sort((a,b) => b.lmt - a.lmt).findIndex(f=> f.id == miembro.id)+1, "Top:", true)
                    .setRankColor(coloerTxt)
                    
                    
                    rank.build().then(data=> {
                        const attachment = new Discord.MessageAttachment(data, `RankCard${miembro.user.username}.png`)
                        setTimeout(async ()=>{
                            await int.editReply({files: [attachment]})
                        }, 400)
                    })
                }else{
                    rank
                    .setBackground("IMAGE", img)
                    .setAvatar(miembro.displayAvatarURL({format: "png"}))
                    .setCurrentXP(0, coloerTxt)
                    .setRequiredXP(10)
                    .setStatus(miembro.presence?.status ? miembro.presence?.status: "offline")
                    .setProgressBar(["#07FF03", "#040404"], "GRADIENT", true)
                    .setUsername(miembro.user.username, coloerTxt)
                    .setDiscriminator(miembro.user.discriminator)
                    .setLevel(0, "Nivel:", true)
                    .setLevelColor(coloerTxt)
                    .setRank(dataNvl.miembros.length+1, "Top:", true)
                    .setRankColor(coloerTxt)
                    
                    rank.build().then(data=> {
                        const attachment = new Discord.MessageAttachment(data, `RankCard${miembro.user.username}.png`)
                        setTimeout(async ()=>{
                            await int.editReply({files: [attachment]})
                        }, 400)
                    })
                }

            }else{
                if(dataNvl.miembros.some(s=>s.id == int.user.id)){
                    let  miembroDB = dataNvl.miembros.find(f=>f.id == int.user.id)
                    rank
                    .setBackground("IMAGE", img)
                    .setAvatar(int.user.displayAvatarURL({format: "png"}))
                    .setCurrentXP(miembroDB.xp, coloerTxt)
                    .setRequiredXP(miembroDB.lmt)
                    .setStatus(int.member.presence?.status ? int.member.presence?.status: "offline")
                    .setProgressBar(["#07FF03", "#040404"], "GRADIENT", true)
                    .setUsername(int.user.username, coloerTxt)
                    .setDiscriminator(int.user.discriminator)
                    .setLevel(miembroDB.nivel, "Nivel:", true)
                    .setLevelColor(coloerTxt)
                    .setRank(dataNvl.miembros.sort((a,b) => b.lmt - a.lmt).findIndex(f=> f.id == int.user.id)+1, "Top:", true)
                    .setRankColor(coloerTxt)
                    
                    rank.build().then(data=> {
                        const attachment = new Discord.MessageAttachment(data, `RankCard${int.user.username}.png`)
                        setTimeout(async ()=>{
                            await int.editReply({files: [attachment]})
                        }, 400)
                    })

                }else{
                    rank
                    .setBackground("IMAGE", img)
                    .setAvatar(int.user.displayAvatarURL({format: "png"}))
                    .setCurrentXP(0, coloerTxt)
                    .setRequiredXP(10)
                    .setStatus(int.member.presence?.status ? int.member.presence?.status: "offline")
                    .setProgressBar(["#07FF03", "#040404"], "GRADIENT", true)
                    .setUsername(int.user.username, coloerTxt)
                    .setDiscriminator(int.user.discriminator)
                    .setLevel(0, "Nivel:", true)
                    .setLevelColor(coloerTxt)
                    .setRank(dataNvl.miembros.length+1, "Top:", true)
                    .setRankColor(coloerTxt)
                    
                    rank.build().then(data=> {
                        const attachment = new Discord.MessageAttachment(data, `RankCard${int.user.username}.png`)
                        setTimeout(async ()=>{
                            await int.editReply({files: [attachment]})
                        }, 400)
                    })
                }
            }
        }

        if(int.commandName == "avatar"){
            estadisticas.comandos++
            let miembro = int.options.getUser("miembro")

            if(miembro){
                int.deferReply()
                if(miembro.id == int.user.id){
                    const embAvaMe = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag, int.user.displayAvatarURL({dynamic: true}))
                    .setDescription(`[URL del avatar](${miembro.displayAvatarURL({dynamic: true, size: 4096, format: "png"})})`)
                    .setImage(miembro.displayAvatarURL({dynamic: true, size: 4096}))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(int.guild.name, int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        int.editReply({allowedMentions: {repliedUser: false}, embeds: [embAvaMe]})
                    }, 400)
                }else{
                    const embAvaMe = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag, int.user.displayAvatarURL({dynamic: true}))
                    .setDescription(`[URL del avatar](${miembro.displayAvatarURL({dynamic: true, size: 4096, format: "png"})})`)
                    .setImage(miembro.displayAvatarURL({dynamic: true, size: 4096}))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(miembro.tag, miembro.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        int.editReply({allowedMentions: {repliedUser: false}, embeds: [embAvaMe]})
                    }, 400)
                }
            }else{
                let usID = int.options.getString("id")
                if(usID){
                    await client.users.fetch(usID, {force: true}).then(usuario=> {
                        int.deferReply()
                        const embAvaMe = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setDescription(`[URL del avatar](${usuario.displayAvatarURL({dynamic: true, size: 4096, format: "png"})})`)
                        .setImage(usuario.displayAvatarURL({dynamic: true, size: 4096}))
                        .setColor(int.guild.me.displayHexColor)
                        .setFooter(usuario.tag, usuario.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        setTimeout(()=>{
                            int.editReply({allowedMentions: {repliedUser: false}, embeds: [embAvaMe]})
                        }, 400)
                    }).catch(ch=>{
                        const embError = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(`No puede encontrar un usuario con esa **ID**, asegúrate de haber proporcionado una **ID** correcta.`)
                        .setColor(colorErr)
                        int.reply({embeds: [embError], ephemeral: true})
                    })
                }else{
                    const embAvaMe = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setDescription(`[URL del avatar](${int.user.displayAvatarURL({dynamic: true, size: 4096, format: "png"})})`)
                    .setImage(int.user.displayAvatarURL({dynamic: true, size: 4096}))
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(int.guild.name, int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        int.editReply({allowedMentions: {repliedUser: false}, embeds: [embAvaMe]})
                    }, 400)
                }
            }
        }

        if(int.commandName == "examen"){
            estadisticas.comandos++
            int.channel.sendTyping()
            const embErrP1 = new Discord.MessageEmbed()
            .setTitle(`${emojiError} Error`)
            .setDescription(`No eres staff de este servidor, no puedes usar este comando.`)
            .setColor(colorErr)
            .setTimestamp()

            const embEncuesta = new Discord.MessageEmbed()
            .setAuthor({name: int.user.tag, iconURL: int.user.displayAvatarURL({dynamic: true})})
            .setTitle(`<:staff:925429848380428339> Examen para ser **Ayudante**`)
            .setDescription(`\`\`1.\`\` ¿Cuál es tu edad?\n\`\`2.\`\` ¿Por que quieres ser ayudante?\n\`\`3.\`\` ¿Cuánto tiempo le dedicarías al servidor?\n\`\`4.\`\` ¿Serias activo en el chat?\n\`\`5.\`\` ¿Que harías si miras a un Mod/Admi abusando de su rango?\n\`\`6.\`\` ¿Sabes bien la información de los roles/canales del servidor?\n\`\`7.\`\` Al estar en una situación difícil de controlar. ¿Qué harías?\n\`\`8.\`\` ¿Tienes paciencia?\n\`\`9.\`\` ¿Estas comprometido/a en que una ves siendo staff todo lo que mires se quedara solo en el grupo del staff?\n\`\`10.\`\` ¿Cómo ayudarías/Guiarías a un usuario?\n\`\`11.\`\` ¿Tienes experiencia siendo helper/ayudante?\n\`\`12.\`\` ¿Cómo conociste este server?\n\`\`13.\`\` ¿Cuál es tu pasado en Discord?\n\`\`14.\`\` ¿Alguna vez formaste parte de una squad o raideaste?\n\`\`15.\`\` Para ti, ¿De que se encarga un helper/ayudante?\n\n<:Pikachu_Feliz:925799716585881640> **Recuerda lo que aquí más importa es tu sinceridad, honestidad y conocimiento.** <:Pikachu_Feliz:925799716585881640>`)
            .setColor(int.guild.me.displayHexColor)
            .setFooter(int.guild.name, int.guild.iconURL({dynamic: true}))
            .setTimestamp()

            if(int.member.roles.cache.get("887444598715219999") || int.member.permissions.has(["ADMINISTRATOR","BAN_MEMBERS"])){
                int.deferReply()
                setTimeout(()=>{
                    int.editReply({embeds: [embEncuesta]})
                }, 400)
            }else{
                int.reply({ephemeral: true, embeds: [embErrP1]})
            }
        }

        if(int.commandName == "estadísticas"){
            int.deferReply()
            estadisticas.comandos++
            let dataAli = await alianzasDB.findOne({_id: int.guildId})
            let dataSug = await systemSug.findOne({_id: int.guildId})
            let alianzas = 0
            for(let i=0; i<dataAli.miembros.length; i++){
                alianzas += dataAli.miembros[i].cantidad
            }

            const embEstadisticas = new Discord.MessageEmbed()
            .setAuthor(int.user.tag, int.user.displayAvatarURL({dynamic: true}))
            .setTitle("📊 Estadísticas")
            .setDescription(`Estadísticas por información recolectada hace ${ms(client.uptime)}.`)
            .addFields(
                {name: `👤 **Miembros:**`, value: `${int.guild.members.cache.size.toLocaleString()}`, inline: true},
                {name: `📑 **Canales:**`, value: `${int.guild.channels.cache.size.toLocaleString()}`, inline: true},
                {name: `📌 **Roles:**`, value: `${int.guild.roles.cache.size.toLocaleString()}`, inline: true},
                {name: `🤝 **Alianzas:**`, value: `Creadas: ${alianzas.toLocaleString()}`, inline: true},
                {name: `🗳️ **Sugerencias: ${dataSug.sugerencias.cantidad}**`, value: `aceptadas: **${dataSug.sugerencias.aceptadas}**\ndenegadas: **${dataSug.sugerencias.denegadas}**\nimplementadas: **${dataSug.sugerencias.implementadas}**\nen progreso: **${dataSug.sugerencias.en_progreso}**\nno sucederán: **${dataSug.sugerencias.no_sucedera}**`, inline: true},
                {name: `\u200B`, value: `Estadísticas por información recolectada hace ${ms(client.uptime)}.`, inline: false},
                {name: `🪄 **Comandos usados:**`, value: `${estadisticas.comandos.toLocaleString()}`, inline: true},
                {name: `📨 **Mensajes:**`, value: `${estadisticas.mensajes.toLocaleString()}`, inline: true},
                {name: `📥 **Entradas:**`, value: `${estadisticas.entradas.toLocaleString()}`, inline: true},
                {name: `📤 **Salidas:**`, value: `${estadisticas.salidas.toLocaleString()}`, inline: true},
            )
            .setColor(int.guild.me.displayHexColor)
            .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
            .setTimestamp()
            setTimeout(()=>{
                int.editReply({embeds: [embEstadisticas]})
            }, 500)
        }

        if(int.commandName == "sugerir"){
            estadisticas.comandos++
            const embCoolSug = new Discord.MessageEmbed()
            .setAuthor(`${emojiError} Error`)
            .setDescription(`Espera **10** minutos para volver a usar el comando.`)
            .setColor(colorErr)
            if(coolSugerencias.some(s=> s == int.user.id)) return setTimeout(()=>{
                int.reply({embeds: [embCoolSug], ephemeral: true})
            }, 400)

            let dataSug = await systemSug.findOne({_id: int.guildId})
            let sugerencia = int.options.getString("sugerencia")

            dataSug.mensajes.push({id: "", origenID: "", autorID: int.user.id, sugerencia: sugerencia, estado: "normal", positivas: 0, negativas: 0})
            await dataSug.save()

            const embSugerencia = new Discord.MessageEmbed()
            .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
            .setTitle("<:advertencia:929204500739268608> ¿Estas seguro de enviar esa sugerencia?")
            .addField(`📃 **Tu sugerencia:**`, `${sugerencia}`)
            .setColor("YELLOW")

            const botones = new Discord.MessageActionRow()
            .addComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("confirmar")
                    .setEmoji("<a:afirmativo:856966728806432778>")
                    .setLabel("Confirmar")
                    .setStyle("SUCCESS")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("cancelar")
                    .setEmoji("<a:negativo:856967325505159169>")
                    .setLabel("Cancelar")
                    .setStyle("DANGER")
                ]
            )

            setTimeout(()=>{
                int.reply({embeds: [embSugerencia], components: [botones], ephemeral: true})  
            }, 400)

            coolSugerencias.push(int.user.id)
            setTimeout(()=>{
                for(let i=0; i<coolSugerencias.length; i++){
                    if(coolSugerencias[i] == int.user.id){
                        coolSugerencias.splice(i,1)
                    }
                }
            }, 10*60000)  
        }

        if(int.commandName == "marcar"){
            estadisticas.comandos++
            let dataSug = await systemSug.findOne({_id: int.guildId})

            const embErrP1 = new Discord.MessageEmbed()
            .setAuthor(`${emojiError} Error`)
            .setDescription(`No eres administrador por lo tanto no puedes usar el comando.`)
            .setColor(colorErr)
            .setTimestamp()
            if(!int.member.permissions.has("ADMINISTRATOR")) return setTimeout(()=>{
                int.reply({embeds: [embErrP1], ephemeral: true})
            }, 400)

            let mensajeID = int.options.getString("id")

            const embErrP2 = new Discord.MessageEmbed()
            .setAuthor(`${emojiError} Error`)
            .setDescription(`La **ID** proporcionada no pertenece a la de ninguna sugerencia que este en la base de datos.`)
            .setColor(colorErr)
            .setTimestamp()
            if(!dataSug.mensajes.some(s=> s.id == mensajeID)) return setTimeout(()=>{
                int.reply({embeds: [embErrP2], ephemeral: true})
            }, 200)

            const embErrP3 = new Discord.MessageEmbed()
            .setAuthor(`${emojiError} Error`)
            .setDescription(`No se encontró ninguna sugerencia con la **ID** que has proporcionado.`)
            .setColor(colorErr)
            .setTimestamp()
            if(!int.guild.channels.cache.get("828300239488024587").messages.cache.get(mensajeID)) return setTimeout(()=>{
                int.reply({embeds: [embErrP3], ephemeral: true})
            }, 200)

            const embMarcar = new Discord.MessageEmbed()
            .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
            .setTitle("🚥 Marca la sugerencia con un estado")
            .setDescription(`Elije un estado para marcar la sugerencia.\n\n🟢 **Implementada:** Esto significara que la sugerencia ha sido implementada al servidor.\n🟡 **en progreso:** Esto significara que la sugerencias esta en progreso de implementación.\n🔴 **no sucedera:** Esto significa que la sugerencia tubo varios votos negativos y por lo tanto nunca se implementara.\n🔵 **normal:** Este estado pone la sugerencia como predeterminado.`)
            .setColor(int.guild.me.displayHexColor)
            .setTimestamp()

            const botones = new Discord.MessageActionRow()
            .addComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("implementada")
                    .setEmoji("🟢")
                    .setLabel("Implementada")
                    .setStyle("SUCCESS")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("en progreso")
                    .setEmoji("🟡")
                    .setLabel("En progreso")
                    .setStyle("SECONDARY")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("no sucedera")
                    .setEmoji("🔴")
                    .setLabel("No sucederá")
                    .setStyle("DANGER")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("normal")
                    .setEmoji("🔵")
                    .setLabel("Normal")
                    .setStyle("PRIMARY")
                ]
            )
            int.reply({embeds: [embMarcar], components: [botones], ephemeral: true})
            sistemMarcar.push({autorID: int.user.id, sugID: mensajeID})
        }

        if(int.commandName == "sugerencias"){
            estadisticas.comandos++
            let dataSug = await systemSug.findOne({_id: int.guildId})
            let miembro = int.options.getUser("miembro")
            if(!dataSug.miembros.some(s=> s.id == int.user.id)){
                dataSug.miembros.push({id: int.user.id, sugerencias: 0, aceptadas: 0, denegadas: 0})
                await dataSug.save()
            }

            if(miembro){
                const embErr2 = new Discord.MessageEmbed()
                .setAuthor(`${emojiError} Error`)
                .setDescription(`Un bot no puede hacer sugerencias, por lo tanto no tendrá ninguna sugerencia.`)
                .setColor(colorErr)
                .setTimestamp()
                if(miembro.bot) return setTimeout(()=>{
                    int.reply({embeds: [embErr2], ephemeral: true})
                }, 400)

                int.deferReply()
                if(miembro.id == int.user.id){
                    let posicion 
                    for(let i=0; i<dataSug.miembros.length; i++){
                        if(dataSug.miembros[i].id == miembro.id){
                            posicion = i
                        }
                    }

                    if(dataSug.miembros[posicion].sugerencias <= 0){
                        const embSugerencias = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setTitle("🗳️ Sugerencias")
                        .setDescription(`*No has echo ninguna sugerencia.*`)
                        .setColor(int.guild.me.displayHexColor)
                        .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        setTimeout(()=>{
                            int.editReply({embeds: [embSugerencias]})
                        }, 400)
                    }else{
                        const embSugerencias = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setTitle("🗳️ Sugerencias")
                        .setDescription(`Has echo un total de **${dataSug.miembros[posicion].sugerencias}** sugerencias de las cuales **${dataSug.miembros[posicion].aceptadas}** han sido aceptaadas y **${dataSug.miembros[posicion].denegadas}** denegadas.`)
                        .setColor(int.guild.me.displayHexColor)
                        .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        setTimeout(()=>{
                            int.editReply({embeds: [embSugerencias]})
                        }, 400)
                    }
                }else{
                    if(dataSug.miembros.some(s=> s.id == miembro.id)){
                        let posicion 
                        for(let i=0; i<dataSug.miembros.length; i++){
                            if(dataSug.miembros[i].id == miembro.id){
                                posicion = i
                            }
                        }

                        if(dataSug.miembros[posicion].sugerencias <= 0){
                            const embSugerencias = new Discord.MessageEmbed()
                            .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                            .setTitle("🗳️ Sugerencias")
                            .setDescription(`*${miembro} no ha echo ninguna sugerencia.*`)
                            .setColor(int.guild.me.displayHexColor)
                            .setFooter(miembro.tag,miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                int.editReply({embeds: [embSugerencias]})
                            }, 400)
                        }else{
                            const embSugerencias = new Discord.MessageEmbed()
                            .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                            .setTitle("🗳️ Sugerencias")
                            .setDescription(`${miembro} ha echo un total de **${dataSug.miembros[posicion].sugerencias}** sugerencias de las cuales **${dataSug.miembros[posicion].aceptadas}** han sido aceptaadas y **${dataSug.miembros[posicion].denegadas}** denegadas.`)
                            .setColor(int.guild.me.displayHexColor)
                            .setFooter(miembro.tag,miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                int.editReply({embeds: [embSugerencias]})
                            }, 400)
                        }
                    }else{
                        const embSugerencias = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setTitle("🗳️ Sugerencias")
                        .setDescription(`*${miembro} no ha echo ninguna sugerencia.*`)
                        .setColor(int.guild.me.displayHexColor)
                        .setFooter(miembro.tag,miembro.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        setTimeout(()=>{
                            int.editReply({embeds: [embSugerencias]})
                        }, 400)
                    }
                }
            }else{
                let posicion 
                for(let i=0; i<dataSug.miembros.length; i++){
                    if(dataSug.miembros[i].id == int.user.id){
                        posicion = i
                    }
                }

                int.deferReply()
                if(dataSug.miembros[posicion].sugerencias <= 0){
                    const embSugerencias = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle("🗳️ Sugerencias")
                    .setDescription(`*No has echo ninguna sugerencia.*`)
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        int.editReply({embeds: [embSugerencias]})
                    }, 400)
                }else{
                    const embSugerencias = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle("🗳️ Sugerencias")
                    .setDescription(`Has echo un total de **${dataSug.miembros[posicion].sugerencias}** sugerencias de las cuales **${dataSug.miembros[posicion].aceptadas}** han sido aceptaadas y **${dataSug.miembros[posicion].denegadas}** denegadas.`)
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        int.editReply({embeds: [embSugerencias]})
                    }, 400)
                }
            }
        }

        if(int.commandName == "plantilla"){
            estadisticas.comandos++
            let invitacion = (await int.guild.invites.fetch()).find(f=> f.inviterId == client.user.id)
            if(!invitacion){
                int.guild.channels.cache.get("823343749039259648").createInvite({maxAge: 0, reason: `Para el comando de barra diagonal /plantilla.`}).then(inv => invitacion = inv)
            }
            setTimeout(()=>{
                int.reply({ephemeral: true, content: `\`\` \`\`\`js\n══════════════════════════════\n    '📣Promociones | CEM'              \n══════════════════════════════\n⚜️ 'Servidor de promoción  ⚜️   \n     promociona tus redes\n      sociales, proyectos\n       servidores y mas \n⚜️       ✦!únete!✦'       ⚜️  \n══════════════════════════════\n           Tenemos:'\n╭───────────────────────────\n┆📢 Múltiples canales de promoción \n┆   para cada tipo de contenido.\n┆───────────────────────────   \n┆💈 Gran variedad de roles.\n┆───────────────────────────\n┆️💠 Roles exclusivos con   \n┆    ventajas de promoción.\n┆───────────────────────────\n┆🎮 Bots de entretenimiento\n┆    y canales para ellos.\n┆───────────────────────────\n┆🔊 Canales de voz para hablar\n┆   y escuchar música 24/7. \n╰───────────────────────────'\n══════════════════════════════\n${invitacion.url} \`\`\`\nhttps://cdn.discordapp.com/attachments/901313790765854720/950895491741261854/bannerPlantilla.gif\n\`\``})
            }, 400)
        }

        if(int.commandName == "reroll"){
            let dataSor = await sorteosDB.findById(servidorID), arraySo = dataSor.sorteos, mensajeID = int.options.getString("id")
            let errores = [
                {condicion: !int.member.permissions.has("ADMINISTRATOR"), descripcion: `¡No eres administrador del servidor!, no puede utilizar el comando.`},
                {condicion: isNaN(mensajeID), descripcion: `La ID del sorteo *(${mensajeID})* no es valida ya que contiene caracteres no numéricos.`},
                {condicion: mensajeID.length != 18, descripcion: `La ID del sorteo *(${mensajeID})* no es valida ya que no contiene exactamente **18** caracteres numéricos contiene menos o mas.`},
                {condicion: !arraySo.some(s=>s.id == mensajeID), descripcion: `La ID que proporcionaste *(${mensajeID})* no coincide con la ID de ningún sorteo en el servidor.`},
                {condicion: arraySo.filter(f=> f.activo).some(s=>s.id == mensajeID), descripcion: `La ID que proporcionaste *(${mensajeID})* no coincide con la de ningún sorteo finalizado pero si con la de un sorteo aun activo, solo se pueden volver a elegir el o los ganadores de un sorteo que ya haya finalizado.`},
                // {condicion: "", descripcion: ``},
            ]
            for(e in errores){
                const embError = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(errores[e].descripcion)
                .setColor(colorErr)
                if(errores[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
            }

            let sorteo = arraySo.find(f=>f.id==mensajeID), canal = int.guild.channels.cache.get(sorteo.canalID), mensage = canal.messages.cache.get(mensajeID)
            let miembros = sorteo.participantes.filter(f=> int.guild.members.cache.has(f))
            let bueltas = 1, ganadoresFinal = []
            for(let r=0; r<bueltas; r++){
                let miembroRandom = miembros[Math.floor(Math.random()*miembros.length)]
                
                if(sorteo.ganadores>ganadoresFinal.length && !ganadoresFinal.some(s=>s==miembroRandom)){
                    ganadoresFinal.push(miembros[Math.floor(Math.random()*miembros.length)])
                    bueltas++
                }
            }

            if(ganadoresFinal.length==0){
                const embError1 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`No se puede volver a elegir uno o mas ganadores de un sorteo en el cual nadie participo.`)
                .setColor(colorErr)
                return int.reply({ephemeral: true, embeds: [embError1]})
            
            }else{
                const emb = mensage.embeds[0]
                emb.author.name = "Sorteo finalizado"
                emb.fields[0].value = `${ganadoresFinal.length==1 ? `Ganador/a: ${ganadoresFinal.map(m=> `<@${m}>`)[0]}`: `Ganadores: ${ganadoresFinal.map(m=> `<@${m}>`).join(", ")}`}\nParticipantes: **${miembros.length}**\nCreado por: <@${sorteo.autorID}>`
                mensage.edit({embeds: [emb]})
                mensage.reply({content: `¡Felicidades ${ganadoresFinal.length==1 ? `${ganadoresFinal.map(m=> `<@${m}>`)[0]} has ganado`: `${ganadoresFinal.map(m=> `<@${m}>`).join(", ")} han ganado`} **${emb.title}**!\n*Comando reroll utilizado por ${int.user.tag}*`})
            }
            const embReroll = new Discord.MessageEmbed()
            .setTitle(`Reroll echo`)
            .setDescription(`Se ha vuelto a seleccionar ${sorteo.ganadores==1 ? "el ganador ": "los ganadores"} del sorteo que esta en ${canal.id == int.channelId ? `este canal`: `el canal <#${canal.id}>`}.`)
            .setColor("#00ff00")
            int.reply({ephemeral: true, embeds: [embReroll]})
            
        }

        if(int.commandName == "webs"){
            const embWebs = new Discord.MessageEmbed()
            .setTitle(`Webs en las que se encuentra publicado el servidor`)
            .setDescription(`Si quieres apoyarnos a seguir creciendo lo puedes hacer entrando en alguna de estas paginas botar positivamente por el servidor, hacer un comentario positivo o bumpear el servidor.`)
            .addField(`📑 **Paginas:**`, `<:Disboard:977371613551022080> [Disboard](https://disboard.org/es/server/773249398431809586)\n<:discordio:977378649286250516> [Discord.io](https://discord.io/PCEM+)\n<:DS:977373209513037824> [Discord Servers](https://discordservers.com/server/773249398431809586)\n<:topgg:977371924483145728> [Top.gg](https://top.gg/servers/773249398431809586)\n<:Discords:977376832296984616> [Discords](https://discords.com/servers/773249398431809586)\n<:discordts:977376924080947251> [Discord.ts](https://discord.st/server/promociones-cem/)`)
            .setColor(int.guild.me.displayHexColor)
            int.reply({ephemeral: true, embeds: [embWebs]})
        }

        // Personal
        if(int.commandName == "ascender"){
            let dataPer = await personalDB.findById(servidorID), arrayPr = dataPer.personal, miembro = int.guild.members.cache.get(int.options.getUser("miembro").id)

            let errores = [
                {condicion: !int.member.permissions.has("ADMINISTRATOR"), descripcion: `¡No eres administrador del servidor!, no puede utilizar el comando.`},
                {condicion: miembro.id == int.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* eres tu, no te puedens ascender a ti mismo.`},
                {condicion: miembro.user.bot, descripcion: `El miembro que has proporcionado *(${miembro})* es un bot, no puedes ascender a un bot.`},
                {condicion: !arrayPr.some(s=>s.id == miembro.id), descripcion: `El miembro que has proporcionado *(${miembro})* no es miembro del personal por lo tanto no lo pueden ascender.`},
                {condicion: arrayPr.find(f=>f.id == miembro.id).rango==5, descripcion: `El miembro que has proporcionado *(${miembro})* no puede ser ascendido ya que tiene el rango mas alto el cual es **Ejecutivo**.`},
                // {condicion: "", descripcion: ``},
            ]
            for(e in errores){
                const embError = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(errores[e].descripcion)
                .setColor(colorErr)
                if(errores[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
            }

            let persona = arrayPr.find(f=>f.id == miembro.id)
            let rol = dataPer.datos.roles[persona.rango]
            dataPer.datos.roles.filter(f=> f!=rol).map(m=> miembro.roles.remove(m))
            miembro.roles.add(rol)
            if(!miembro.roles.cache.has(dataPer.rolID)){
                miembro.roles.add(dataPer.rolID)
            }
            persona.rango++
            persona.historial.push({fecha: Date.now(), accion: `Fue ascendido/a al rango ${persona.rango==2 ? "**Ayudante**": persona.rango==3 ? "**Moderador**": persona.rango==4 ? "**Administrador**": "**Ejecutivo**"} por **${int.user.tag}** *(id: ${int.user.id})*.`})
            const embAcenso = new Discord.MessageEmbed()
            .setAuthor({name: int.member.nick ? int.member.nickname: int.user.username, iconURL: int.user.displayAvatarURL({dynamic: true})})
            .setTitle(`🛗 Acendido`)
            .setDescription(`${miembro} ha sido ascendido de rango al rango ${persona.rango==2 ? "**Ayudante**": persona.rango==3 ? "**Moderador**": persona.rango==4 ? "**Administrador**": "**Ejecutivo**"} por ${int.user}.`)
            .setColor(int.guild.me.displayHexColor)
            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            int.reply({embeds: [embAcenso]})

            const embRegistro = new Discord.MessageEmbed()
            .setAuthor(`Ejecutado por ${int.user.tag}`, int.user.displayAvatarURL({dynamic: true}))
            .setTitle(`📝 Registro del comando /ascender`)
            .addFields(
                {name: `📌 **Utilizado en:**`, value: `${int.channel}\n**ID:** ${int.channelId}`},
                {name: `👮 **Administrador:**`, value: `${int.user}\n**ID:** ${int.user.id}`},
                {name: `🛗 **Miembro del personal ascendido:**`, value: `${miembro}\n**ID:** ${miembro.id}`},
                {name: `🎖️ **Rango:**`, value: `${persona.rango==2 ? "Ayudante": persona.rango==3 ? "Moderador": persona.rango==4 ? "Administrador": "Ejecutivo"}`}
            )
            .setColor("#00C624")
            .setFooter(miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            int.guild.channels.cache.get(dataPer.datos.canalRegistro).send({embeds: [embRegistro]})
            await personalDB.findByIdAndUpdate(servidorID, {personal: arrayPr})

        }

        if(int.commandName == "degradar"){
            let dataPer = await personalDB.findById(servidorID), arrayPr = dataPer.personal, roles = dataPer.datos.roles, miembro = int.guild.members.cache.get(int.options.getUser("miembro").id)

            let errores = [
                {condicion: !int.member.permissions.has("ADMINISTRATOR"), descripcion: `¡No eres administrador del servidor!, no puede utilizar el comando.`},
                {condicion: miembro.id == int.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* eres tu, no te puedes degradar a ti mismo.`},
                {condicion: miembro.user.bot, descripcion: `El miembro que has proporcionado *(${miembro})* es un bot, no puedes degradar a un bot.`},
                {condicion: !arrayPr.some(s=>s.id == miembro.id), descripcion: `El miembro que has proporcionado *(${miembro})* no es miembro del personal por lo tanto no lo pueden degradar.`},
                {condicion: arrayPr.find(f=>f.id == miembro.id).rango==1, descripcion: `El miembro que has proporcionado *(${miembro})* no puede ser degradado ya que tiene el rango mas bajo el cual es **Cazador de alianzas**.`},
                // {condicion: "", descripcion: ``},
            ]
            for(e in errores){
                const embError = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(errores[e].descripcion)
                .setColor(colorErr)
                if(errores[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
            }

            let persona = arrayPr.find(f=>f.id == miembro.id)
            let rol = roles[Number(persona.rango)-2]
            dataPer.datos.roles.filter(f=> f != rol).map(m=> miembro.roles.remove(m))            
            miembro.roles.add(rol)
            if(!miembro.roles.cache.has(dataPer.rolID)){
                miembro.roles.add(dataPer.rolID)
            }
            persona.rango--
            persona.historial.push({fecha: Date.now(), accion: `Fue degradado/a al rango ${persona.rango==1 ? "**Cazador/a de alianzas**": persona.rango==2 ? "**Ayudante**": persona.rango==3 ? "**Moderador**": "**Administrador**"} por **${int.user.tag}** *(id: ${int.user.id})*.`})
            const embAcenso = new Discord.MessageEmbed()
            .setAuthor({name: int.member.nick ? int.member.nickname: int.user.username, iconURL: int.user.displayAvatarURL({dynamic: true})})
            .setTitle(`🛗 Acendido`)
            .setDescription(`${miembro} ha sido degradado de rango al rango ${persona.rango==2 ? "**Ayudante**": persona.rango==3 ? "**Moderador**": persona.rango==4 ? "**Administrador**": "**Ejecutivo**"} por ${int.user}.`)
            .setColor(int.guild.me.displayHexColor)
            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            int.reply({embeds: [embAcenso]})

            const embRegistro = new Discord.MessageEmbed()
            .setAuthor(`Ejecutado por ${int.user.tag}`, int.user.displayAvatarURL({dynamic: true}))
            .setTitle(`📝 Registro del comando /ascender`)
            .addFields(
                {name: `📌 **Utilizado en:**`, value: `${int.channel}\n**ID:** ${int.channelId}`},
                {name: `👮 **Administrador:**`, value: `${int.user}\n**ID:** ${int.user.id}`},
                {name: `🛗 **Miembro del personal degradado:**`, value: `${miembro}\n**ID:** ${miembro.id}`},
                {name: `🎖️ **Rango:**`, value: `${persona.rango==2 ? "Ayudante": persona.rango==3 ? "Moderador": persona.rango==4 ? "Administrador": "Ejecutivo"}`}
            )
            .setColor("#D93800")
            .setFooter(miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            int.guild.channels.cache.get(dataPer.datos.canalRegistro).send({embeds: [embRegistro]})
            await personalDB.findByIdAndUpdate(servidorID, {personal: arrayPr})
        }

        // Moderación
        if(int.commandName == "limpiar"){
            estadisticas.comandos++
            let cantidad = int.options.getString("cantidad"), autorId = int.options.getString("autorid"), id = int.options.getUser("miembro") ? int.options.getUser("miembro").id: false || autorId, canalRegistros = client.channels.cache.get(dataBot.datos.registros.bot)

            let errores = [
                {condicion: !["MODERATE_MEMBERS", "KICK_MEMBERS", "BAN_MEMBERS"].some(s=> int.member.permissions.has(s)), descripcion: `¡No eres moderador del servidor!, no puede utilizar el comando.`},
                {condicion: isNaN(cantidad) && cantidad != "todos", descripcion: `La cantidad *(${cantidad})* no es valida ya que no es una cantidad numérica ni es la palabra **todos**.`},
                {condicion: !isNaN(cantidad) && Number(cantidad) > 400, descripcion: `La cantidad que has proporcionado *(${cantidad})* es mayora a la cantidad máxima de mensajes que puedo eliminar la cual es **400** mensajes.`},
                {condicion: int.options.getUser("miembro") && int.options.getString("autorid"), descripcion: `No proporciones un miembro y una ID de un autor a la vez.`},
                {condicion: autorId && isNaN(autorId), descripcion: `La ID del autor *(${autorId})* no es valida ya que no es numérica.`},
                {condicion: autorId && autorId.length != 18, descripcion: `La ID del autor *(${autorId})* no es valida ya que no contiene **18** caracteres numéricos contiene menos o mas.`},
            ]
            for(e in errores){
                const embError = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(errores[e].descripcion)
                .setColor(colorErr)
                if(errores[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
            }
            if(cantidad == "todos"){
                cantidad = 400
            }else{
                cantidad = Number(cantidad)
            }

            if(id){
                await client.users.fetch(id, {force: true}).then(usuario=> {
                    let bueltas = 0, mensajes = 0, parado = false
                    async function clearMessages(){
                        bueltas++
                        let filtro = (await int.channel.messages.fetch({limit: 100})).filter(f=> f.author.id == id && Date.now() - f.createdAt < ms("14d")).map(m=>m)
                        // console.log(filtro.length)
                        const embError1 = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(`No hay mensajes del ${int.guild.members.cache.has(id) ? `miembro <@${id}>`: `usuario <@${id}>`} en este canal para eliminar, no hay ningún mensaje de ese autor en los **100** últimos mensajes o los mensajes que hay de ese autor superan los 14 días y no puedo eliminar mensajes con ese tiempo.`)
                        .setColor(colorErr)
                        if(bueltas == 1 && filtro.length==0){
                            parado = true
                            int.reply({ephemeral: true, embeds: [embError1]})
                        }else{
                            if(cantidad<100 && Math.floor(cantidad/100)-bueltas<0){
                                filtro = filtro.splice(0,Math.floor(cantidad%100))
                            }
                            mensajes+=filtro.length
                            let embElimiando = new Discord.MessageEmbed()
                            .setTitle(`<a:loop:964162886865944617> Eliminando mensajes`)
                            .setColor("BLUE")
                            if(bueltas == 1){
                                int.reply({ephemeral: true, embeds: [embElimiando]})
                            }
    
                            int.channel.bulkDelete(filtro)
                            if(mensajes == cantidad || (bueltas > 1 && filtro.length==0)){
                                parado = true
                                let embLimpiar = new Discord.MessageEmbed()
                                .setAuthor(int.member.nick ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
                                .setTitle(`🗑️ Mensajes eliminados`)
                                .setColor(int.guild.me.displayHexColor)
                                .setFooter(int.guild.name, int.guild.iconURL({dynamic: true}))
                                .setTimestamp()
                                if(mensajes == cantidad){
                                    embLimpiar
                                    .setDescription(`Se han eliminado **${mensajes}** mensajes del ${int.guild.members.cache.has(id) ? `miembro <@${id}>`: `usuario <@${id}>`} en este canal.`)
                                }else{
                                    embLimpiar
                                    .setDescription(`Solo he podido eliminar **${mensajes}** mensajes del ${int.guild.members.cache.has(id) ? `miembro <@${id}>`: `usuario <@${id}>`} en este canal.`)
                                }
                                const embRegistro = new Discord.MessageEmbed()
                                .setAuthor(`Comando ejecutado por ${int.user.tag}`, int.user.displayAvatarURL({dynamic: true}))
                                .setTitle(`📝 Registro del comando /limpiar`)
                                .addFields(
                                    {name: `📌 **Utilizado en el canal:**`, value: `${int.channel}\n**ID:** ${int.channelId}`},
                                    {name: `👮 **Autor:**`, value: `${int.user}\n**ID:** ${int.user.id}`},
                                    {name: `🗑️ **Mensajes eliminados:**`, value: `**${mensajes}** de ${usuario}\n**ID:** ${usuario.id}`},
                                )
                                .setColor("BLUE")
                                .setFooter(usuario.tag, usuario.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                                setTimeout(()=>{
                                    int.editReply({embeds: [embLimpiar]})
                                    canalRegistros.send({embeds: [embRegistro]})
                                }, mensajes*100)
                            }
                        }
                    }
                    clearMessages()
                    let intervalo = setInterval(async ()=>{
                        if(parado){
                            clearInterval(intervalo)
                        }else{
                            clearMessages()
                        }
                    }, 2000)
                }).catch(c=>{
                    const embErrorNoEncontrado = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(`No pude encontrar al usuario, ID del autor invalida.`)
                    .setColor(colorErr)
                    int.reply({ephemeral: true, embeds: [embErrorNoEncontrado]})
                })

            }else{
                let bueltas = 0, mensajes = 0, parado = false
                async function clearMessages(){
                    bueltas++
                    let filtro = (await int.channel.messages.fetch({limit: 100})).filter(f=> Date.now() - f.createdAt < ms("14d")).map(m=>m)
                    const embError1 = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(`No hay mensajes en este canal para eliminar o los mensajes que hay en este canal superan los **14** días y no puedo eliminar mensajes con ese tiempo.`)
                    .setColor(colorErr)
                    if(bueltas == 1 && filtro.length==0){
                        parado = true
                        int.reply({ephemeral: true, embeds: [embError1]})
                    }else{
                        if(cantidad<100 && Math.floor(cantidad/100)-bueltas<0){
                            filtro = filtro.splice(0,Math.floor(cantidad%100))
                        }
                        mensajes+=filtro.length
                        let embElimiando = new Discord.MessageEmbed()
                        .setTitle(`<a:loop:964162886865944617> Eliminando mensajes`)
                        .setColor("BLUE")
                        if(bueltas == 1){
                            int.reply({ephemeral: true, embeds: [embElimiando]})
                        }
                        int.channel.bulkDelete(filtro)
                        if(mensajes == cantidad || (bueltas > 1 && filtro.length==0)){
                            parado = true
                            let embLimpiar = new Discord.MessageEmbed()
                            .setAuthor(int.member.nick ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
                            .setTitle(`🗑️ Mensajes eliminados`)
                            .setColor(int.guild.me.displayHexColor)
                            .setFooter(int.guild.name, int.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            if(mensajes == cantidad){
                                embLimpiar
                                .setDescription(`Se han eliminado **${mensajes}** mensajes en este canal.`)
                            }else{
                                embLimpiar
                                .setDescription(`Solo he podido eliminar **${mensajes}** mensajes de los **${cantidad}** que me pediste en este canal.`)
                            }
                            const embRegistro = new Discord.MessageEmbed()
                            .setAuthor(`Comando ejecutado por ${int.user.tag}`, int.user.displayAvatarURL({dynamic: true}))
                            .setTitle(`📝 Registro del comando /limpiar`)
                            .addFields(
                                {name: `📌 **Utilizado en el canal:**`, value: `${int.channel}\n**ID:** ${int.channelId}`},
                                {name: `👮 **Autor:**`, value: `${int.user}\n**ID:** ${int.user.id}`},
                                {name: `🗑️ **Mensajes eliminados:**`, value: `**${mensajes}**`},
                            )
                            .setColor("BLUE")
                            .setTimestamp()
                            setTimeout(()=>{
                                int.editReply({embeds: [embLimpiar]})
                                canalRegistros.send({embeds: [embRegistro]})
                            }, mensajes*100)
                        }
                    }
                }
                clearMessages()
                let intervalo = setInterval(async ()=>{
                    if(parado){
                        clearInterval(intervalo)
                    }else{
                        clearMessages()
                    }
                }, 2000)
            }
        }

        if(int.commandName == "encarcelar"){
            estadisticas.comandos++
            let dataCrc = await carcelDB.findById(client.user.id), canalRegistro = int.guild.channels.cache.get(dataBot.datos.registros.bot)
            let tiempo = int.options.getString("tiempo"), razon = int.options.getString("razón"), id = int.options.getString("id"), miembro = int.options.getUser("miembro") ? int.guild.members.cache.get(int.options.getUser("miembro").id): id ? int.guild.members.cache.has(id) ? int.guild.members.cache.get(id): false: false
            
            let erroresP = [
                {condicion: !["MODERATE_MEMBERS", "KICK_MEMBERS", "BAN_MEMBERS"].some(s=> int.member.permissions.has(s)), descripcion: `¡No eres moderador del servidor!, no puede utilizar el comando.`},
                {condicion: id && isNaN(id), descripcion: `La ID proporcionada *(${id})* no es valida ya que no es numérica.`},
                {condicion: id && id.length != 18, descripcion: `La ID proporcionada *(${id})* no es valida ya que no contiene exactamente **18** caracteres numéricos contiene menos o mas.`},
                {condicion: !miembro, descripcion: `No has proporcionado el miembro que enviaras a la cárcel, si has proporcionado una ID no es valida.`},
                {condicion: int.options.getUser("miembro") && id, descripcion: `No proporciones un miembro y una ID a la vez.`},
                {condicion: !isNaN(tiempo), descripcion: `El tiempo proporcionado *(${tiempo})* no es valido ya que solo son números, también proporciona una letra que indique si son minutos, horas o días.`},
                {condicion: !ms(tiempo), descripcion: `El tiempo proporcionado *(${tiempo})* es in correcto.\nEjemplos:\n**Minutos:** 3m, 5m, 20m, 60m, etc\n**Horas:** 1h, 4h, 10h, 24h, etc\n**Días:** 1d, 2d, 4d, etc.`},
                {condicion: razon.length > 600, descripcion: `La razón por la que el miembro ira a la cárcel excede el máximo de caracteres los cueles son **600** caracteres, proporciona una razón mas corta.`},
                {condicion: dataCrc.prisioneros.some(s=>s.id == miembro.id), descripcion: `El miembro *(${miembro})* ya se encuentra en la cárcel.`},
                {condicion: ms(tiempo)>ms("4d"), descripcion: `La cantidad de tiempo que has proporcionado *(${tiempo})* supera los **4** días, 4 días es el máximo que un miembro puede estar en la cárcel.`},
            ]
            for(e in erroresP){
                const embError = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(erroresP[e].descripcion)
                .setColor(colorErr)
                if(erroresP[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
            }
            
            let durante = ms(tiempo)>=86400000 ? `**${Math.floor(ms(tiempo)/86400000)}** días`: ms(tiempo)>=3600000 ? `**${Math.floor(ms(tiempo)/3600000)}** horas`: ms(tiempo)>=60000 ? `**${Math.floor(ms(tiempo)/60000)}** minutos`: `**${Math.floor(ms(tiempo)/1000)}** segundos`
            const embCarcel = new Discord.MessageEmbed()
            .setAuthor(int.member.nickname ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
            .setThumbnail(miembro.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 1024}))
            .setTitle("⛓️ Miembro enviado a la cárcel")
            .setDescription(`👤 **Miembro:** ${miembro}\n**ID:** ${miembro.id}\n\n⏱ **Durante:** ${durante}\n\n📑 **Razón:** ${razon}`)
            .setColor("#ECDE03")
            .setTimestamp()

            const embCarcelMD = new Discord.MessageEmbed()
            .setAuthor(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
            .setTitle("⛓️ Has sido enviado a la cárcel")
            .setDescription(`⏱ **Durante:** ${durante}\n\n📑 **Razon:** ${razon}\n\n👮 **Moderador:** ${int.user.tag}`)
            .setColor("#ECDE03")
            .setFooter(`Incumpliste alguna regla de ${int.guild.name}` ,int.guild.iconURL({dynamic: true}))
            .setTimestamp()

            const embRegistro = new Discord.MessageEmbed()
            .setAuthor(`Ejecutado por ${int.user.tag}`, int.user.displayAvatarURL({dynamic: true}))
            .setTitle("📝 Registro del comando /encarcelar")
            .addFields(
                {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                {name: "👤 **Miembro enviado a la cárcel:**", value: `${miembro}\n**ID:** ${miembro.id}`},
                {name: "⏱ **Durante:**", value: `${durante}`},
                {name: "📑 **Razón:**", value: `${razon}`},
            )
            .setColor("#ECDE03")
            .setFooter(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            if(int.user.id == int.guild.ownerId){
                let erroresOw = [
                    {condicion: miembro.id == client.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* soy yo, yo no me puedo enviar a la cárcel.`},
                    {condicion: miembro.user.bot, descripcion: `El miembro que has proporcionado *(${miembro})* es un bot, no puedo enviar a un bot a la cárcel.`},
                    {condicion: miembro.id == int.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* eres tu mi creador y dueño de este servidor.`},
                    // {condicion: !miembro, descripcion: `La cantidad de tiempo que has proporcionado *(${tiempo})* supera los **4** días, 4 días es el máximo que un miembro puede estar en la cárcel.`},
                ]
                for(e in erroresOw){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(erroresOw[e].descripcion)
                    .setColor(colorErr)
                    if(erroresOw[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                }

                int.deferReply()
                miembro.roles.add("830260549098405935").then(async c=>{
                    setTimeout(()=>{
                        int.editReply({allowedMentions: {repliedUser: false}, embeds: [embCarcel]})
                    }, 400)
                    miembro.send({embeds: [embCarcelMD]}).then(tm=> {
                        embCarcel
                        .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                    }).catch(()=> {
                        embCarcel
                        .setFooter(`No he podido enviar el mensaje al miembro ${miembro.nickname ? miembro.nickname: miembro.user.username}`, miembro.displayAvatarURL({dynamic: true}))
                    })
                    dataCrc.prisioneros.push({id: miembro.id, tag: miembro.user.tag, razon: razon, condena: tiempo, tiempo: Date.now()})
                    dataCrc.cantidad++
                    await dataCrc.save()
                })

                canalRegistro.send({embeds: [embRegistro]})

            }else{
                let errores = [
                    {condicion: miembro.id == client.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* soy yo, yo no me puedo enviar a la cárcel.`},
                    {condicion: miembro.user.bot, descripcion: `El miembro que has proporcionado *(${miembro})* es un bot, no puedo enviar a un bot a la cárcel.`},
                    {condicion: miembro.id == int.guild.ownerId, descripcion: `El miembro que has proporcionado *(${miembro})* es el dueño del servidor, ¿como se te ocurre intentar tal cosa?.`},
                    {condicion: miembro.id == int.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* eres tu, no te puedo enviar a la cárcel.`},
                    {condicion: miembro.roles.highest.comparePositionTo(int.member.roles.highest)>=0, descripcion: `El rol mas alto del miembro que has proporcionado *(${miembro})* esta en una posición mayor o igual a la posición de tu rol mas alto, no puedes enviar al miembro a la cárcel.`},
                    // {condicion: !miembro, descripcion: ``},
                ]
                for(e in errores){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(errores[e].descripcion)
                    .setColor(colorErr)
                    if(errores[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                }

                int.deferReply()
                miembro.roles.add("830260549098405935").then(async c=>{
                    setTimeout(()=>{
                        int.editReply({allowedMentions: {repliedUser: false}, embeds: [embCarcel]})
                    }, 400)
                    miembro.send({embeds: [embCarcelMD]}).then(tm=> {
                        embCarcel
                        .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                    }).catch(()=> {
                        embCarcel
                        .setFooter(`No he podido enviar el mensaje al miembro ${miembro.nickname ? miembro.nickname: miembro.user.username}`, miembro.displayAvatarURL({dynamic: true}))
                    })
                    dataCrc.prisioneros.push({id: miembro.id, tag: miembro.user.tag, razon: razon, condena: tiempo, tiempo: Date.now()})
                    dataCrc.cantidad++
                    await dataCrc.save()
                })
                canalRegistro.send({embeds: [embRegistro]})
            }
        }

        if(int.commandName == "expulsar"){
            estadisticas.comandos++
            let canalRegistro = int.guild.channels.cache.get(dataBot.datos.registros.bot), razon = int.options.getString("razón"), id = int.options.getString("id"), miembro = int.options.getUser("miembro") ? int.guild.members.cache.get(int.options.getUser("miembro").id): id ? int.guild.members.cache.has(id) ? int.guild.members.cache.get(id): false: false

            let erroresP = [
                {condicion: !["MODERATE_MEMBERS", "KICK_MEMBERS", "BAN_MEMBERS"].some(s=> int.member.permissions.has(s)), descripcion: `¡No eres moderador del servidor!, no puede utilizar el comando.`},
                {condicion: id && isNaN(id), descripcion: `La ID proporcionada *(${id})* no es valida ya que no es numérica.`},
                {condicion: id && id.length != 18, descripcion: `La ID proporcionada *(${id})* no es valida ya que no contiene exactamente **18** caracteres numéricos contiene menos o mas.`},
                {condicion: !miembro, descripcion: `No has proporcionado el miembro a expulsar, si has proporcionado una ID no es valida.`},
                {condicion: int.options.getUser("miembro") && id, descripcion: `No proporciones un miembro y una ID a la vez.`},
                {condicion: razon.length > 600, descripcion: `La razón por la que el miembro sera expulsado excede el máximo de caracteres los cueles son **600** caracteres, proporciona una razón mas corta.`},
            ]
            for(e in erroresP){
                const embError = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(erroresP[e].descripcion)
                .setColor(colorErr)
                if(erroresP[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
            }

            const embExpulsar = new Discord.MessageEmbed()
            .setAuthor(int.member.nickname ? int.member.nickname: int.user.username, int.user.avatarURL({dynamic: true}))
            .setThumbnail(miembro.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 1024}))
            .setColor("#ff8001")
            .setTimestamp()

            const embExpulsarDM = new Discord.MessageEmbed()
            .setAuthor(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
            .setThumbnail(int.guild.iconURL({dynamic: true, format: "png"||"gif", size: 1024}))
            .setTitle("<:salir12:879519859694776360> Has sido expulsado")
            .setDescription(`**de:** ${int.guild.name}\n\n📑 **Razón:** ${razon}`)
            .setFooter(`Por el moderador: ${int.user.tag}`, int.user.displayAvatarURL({dynamic: true}))
            .setColor("#ff8001")
            .setTimestamp()

            const embRegistro = new Discord.MessageEmbed()
            .setAuthor(`Ejecutado por ${int.user.tag}`, int.user.displayAvatarURL({dynamic: true}))
            .setTitle("📝 Registro del comando /expulsar")
            .setColor("#ff8001")
            .setFooter(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            if(int.user.id == int.guild.ownerId){
                let erroresOw = [
                    {condicion: miembro.id == client.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* soy yo, yo no me puedo expulsar a mi mismo.`},
                    {condicion: miembro.id == int.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* eres tu mi creador y dueño de este servidor.`},
                    // {condicion: !miembro, descripcion: ``},
                ]
                for(e in erroresOw){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(erroresOw[e].descripcion)
                    .setColor(colorErr)
                    if(erroresOw[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                }

                int.deferReply()
                if(miembro.bot){
                    embExpulsar
                    .setTitle("<:salir12:879519859694776360> Bot expulsado")
                    .setDescription(`🤖 **Ex bot:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                    .setFooter(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))

                    miembro.kick(`Moderador: ${int.user.tag} ID: ${int.user.id} | Bot expulsado: ${miembro.tag}, ID: ${miembro.id} | Razón: ${razon}`).then(k=>{
                        setTimeout(()=>{
                            int.editReply({embeds: [embExpulsar]})
                        }, 400)
                    })
    
                    embRegistro
                    .addFields(
                        {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                        {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                        {name: "🤖 **Bot expulsado:**", value: `${miembro}\n**ID:** ${miembro.id}`},
                        {name: "📑 **Razón:**", value: `${razon}`}
                    )
                    canalRegistro.send({embeds: [embRegistro]})

                }else{
                    embExpulsar
                    .setTitle("<:salir12:879519859694776360> Miembro expulsado")
                    .setDescription(`👤 **Ex miembro:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                
                    miembro.kick(`Moderador ID: ${int.user.id} | Miembro expulsado: ${miembro.tag}, ID: ${miembro.id} | Razón: ${razon}`).then(k=>{
                        miembro.send({embeds: [embExpulsarDM]}).then(tdm=>{
                            embExpulsar
                            .setFooter(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                            setTimeout(()=>{
                                int.editReply({embeds: [embExpulsar]})
                            }, 400)
                        }).catch(cdm=> {
                            embExpulsar
                            .setFooter(`No he podido enviar el mensaje al exmiembro ${miembro.user.tag}`, miembro.displayAvatarURL({dynamic: true}))
                            setTimeout(()=>{
                                int.editReply({embeds: [embExpulsar]})
                            }, 400)
                        })
                    })
    
                    embRegistro
                    .addFields(
                        {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                        {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                        {name: "👤 **Miembro expulsado:**", value: `${miembro}\n**ID:** ${miembro.id}`},
                        {name: "📑 **Razón:**", value: `${razon}`}
                    )
                    canalRegistro.send({embeds: [embRegistro]})
                }

            }else{
                let errores = [
                    {condicion: miembro.id == client.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* soy yo, yo no me puedo expulsar a mi mismo.`},
                    {condicion: miembro.id == int.guild.ownerId, descripcion: `El miembro que has proporcionado *(${miembro})* es el dueño del servidor, ¿como se te ocurre intentar tal cosa?.`},
                    {condicion: miembro.id == int.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* eres tu, no te puedes expulsar a ti mismo.`},
                    {condicion: miembro.roles.highest.comparePositionTo(int.member.roles.highest)>=0, descripcion: `El rol mas alto del miembro que has proporcionado *(${miembro})* esta en una posición mayor o igual a la posición de tu rol mas alto, no puedes expulsar al miembro.`},
                    // {condicion: !miembro, descripcion: ``},
                ]
                for(e in errores){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(errores[e].descripcion)
                    .setColor(colorErr)
                    if(errores[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                }

                int.deferReply()
                if(miembro.bot){
                    embExpulsar
                    .setTitle("<:salir12:879519859694776360> Bot expulsado")
                    .setDescription(`🤖 **Ex bot:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                    .setFooter(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))

                    miembro.kick(`Moderador: ${int.user.tag} ID: ${int.user.id} | Bot expulsado: ${miembro.tag}, ID: ${miembro.id} | Razón: ${razon}`).then(k=>{
                        setTimeout(()=>{
                            int.editReply({embeds: [embExpulsar]})
                        }, 400)
                    })
    
                    embRegistro
                    .addFields(
                        {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                        {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                        {name: "🤖 **Bot expulsado:**", value: `${miembro}\n**ID:** ${miembro.id}`},
                        {name: "📑 **Razón:**", value: `${razon}`}
                    )
                    canalRegistro.send({embeds: [embRegistro]})

                }else{
                    embExpulsar
                    .setTitle("<:salir12:879519859694776360> Miembro expulsado")
                    .setDescription(`👤 **Ex miembro:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                
                    int.guild.members.cache.get(miembro.id).kick(`Moderador ID: ${int.user.id} | Miembro expulsado: ${miembro.tag}, ID: ${miembro.id} | Razón: ${razon}`).then(k=>{
                        setTimeout(()=>{
                            int.editReply({embeds: [embExpulsar]})
                        }, 400)
                        miembro.send({embeds: [embDM]}).catch(c=> console.log(c))
                    })
                    miembro.kick(`Moderador ID: ${int.user.id} | Miembro expulsado: ${miembro.tag}, ID: ${miembro.id} | Razón: ${razon}`).then(k=>{
                        miembro.send({embeds: [embExpulsarDM]}).then(tdm=>{
                            embExpulsar
                            .setFooter(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                            setTimeout(()=>{
                                int.editReply({embeds: [embExpulsar]})
                            }, 400)
                        }).catch(cdm=> {
                            embExpulsar
                            .setFooter(`No he podido enviar el mensaje al exmiembro ${miembro.user.tag}`, miembro.displayAvatarURL({dynamic: true}))
                            setTimeout(()=>{
                                int.editReply({embeds: [embExpulsar]})
                            }, 400)
                        })
                    })
    
                    embRegistro
                    .addFields(
                        {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                        {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                        {name: "👤 **Miembro expulsado:**", value: `${miembro}\n**ID:** ${miembro.id}`},
                        {name: "📑 **Razón:**", value: `${razon}`}
                    )
                    canalRegistro.send({embeds: [embRegistro]})
                }
            }
        }

        if(int.commandName == "banear"){
            estadisticas.comandos++
            let canalRegistro = int.guild.channels.cache.get(dataBot.datos.registros.bot), razon = int.options.getString("razón"), id = int.options.getString("id"), miembro = int.options.getUser("miembro") ? int.guild.members.cache.get(int.options.getUser("miembro").id): id ? int.guild.members.cache.has(id) ? int.guild.members.cache.get(id): false: false

            let erroresP = [
                {condicion: !["MODERATE_MEMBERS", "KICK_MEMBERS", "BAN_MEMBERS"].some(s=> int.member.permissions.has(s)), descripcion: `¡No eres moderador del servidor!, no puede utilizar el comando.`},
                {condicion: id && isNaN(id), descripcion: `La ID proporcionada *(${id})* no es valida ya que no es numérica.`},
                {condicion: id && id.length != 18, descripcion: `La ID proporcionada *(${id})* no es valida ya que no contiene exactamente **18** caracteres numéricos contiene menos o mas.`},
                {condicion: !miembro && !id, descripcion: `No has proporcionado el miembro o usuario externo a banear.`},
                {condicion: int.options.getUser("miembro") && id, descripcion: `No proporciones un miembro y una ID a la vez.`},
                {condicion: razon.length > 600, descripcion: `La razón por la que el miembro sera expulsado excede el máximo de caracteres los cueles son **600** caracteres, proporciona una razón mas corta.`},
            ]
            for(e in erroresP){
                const embError = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(erroresP[e].descripcion)
                .setColor(colorErr)
                if(erroresP[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
            }
            console.log(miembro)

            await client.users.fetch(miembro ? miembro.id: id, {force: true}).then(async usuario=> {
                const embBanear = new Discord.MessageEmbed()
                .setAuthor(int.member.nickname ? int.member.nickname: int.user.username, int.user.avatarURL({dynamic: true}))
                .setThumbnail(usuario.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 1024}))
                .setColor(colorErr)
                .setTimestamp()

                const embBanearDM = new Discord.MessageEmbed()
                .setAuthor(usuario.tag, usuario.displayAvatarURL({dynamic: true}))
                .setThumbnail(int.guild.iconURL({dynamic: true, format: "png"||"gif", size: 1024}))
                .setTitle("⛔ Has sido baneado")
                .setDescription(`**de:** ${int.guild.name}\n\n📑 **Razón:** ${razon}`)
                .setFooter(`Por el moderador: ${int.user.tag}`, int.user.displayAvatarURL({dynamic: true}))
                .setColor("#ff0000")
                .setTimestamp()
    
                const embRegistro = new Discord.MessageEmbed()
                .setAuthor(int.user.tag, int.user.displayAvatarURL({dynamic: true}))
                .setTitle("📝 Registro del comando /banear")
                .setColor(colorErr)
                .setFooter(usuario.tag, usuario.displayAvatarURL({dynamic: true}))
                .setTimestamp()

                if(int.user.id == int.guild.ownerId){
                    let erroresOw = [
                        {condicion: miembro.id == client.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* soy yo, yo no me puedo banear a mi mismo.`},
                        {condicion: miembro.id == int.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* eres tu mi creador y dueño de este servidor.`},
                        {condicion: (await int.guild.bans.fetch()).some(s=>s.user.id == usuario.id), descripcion: `El usuario *(${usuario})* ya se encuentra baneado en el servidor.`},
                        // {condicion: !miembro, descripcion: ``},
                    ]
                    for(e in erroresOw){
                        const embError = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(erroresOw[e].descripcion)
                        .setColor(colorErr)
                        if(erroresOw[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                    }
    
                    int.deferReply()
                    if(usuario.bot){
                        if(miembro){
                            embBanear
                            .setTitle("⛔ Bot baneado")
                            .setDescription(`🤖 **Ex bot:** ${usuario}\n**ID:** ${usuario.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                            .setFooter(usuario.tag, usuario.displayAvatarURL({dynamic: true}))
    
                            int.guild.members.ban(usuario, {days: 7, reason: `Moderador: ${int.user.tag} ID: ${int.user.id} | Bot baneado: ${usuario.tag}, ID: ${usuario.id} | Razón: ${razon}`}).then(k=>{
                                setTimeout(()=>{
                                    int.editReply({embeds: [embBanear]})
                                }, 400)
                            })
            
                            embRegistro
                            .addFields(
                                {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                                {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                                {name: "🤖 **Ex bot baneado:**", value: `${usuario}\n**ID:** ${usuario.id}`},
                                {name: "📑 **Razón:**", value: `${razon}`}
                            )
                            canalRegistro.send({embeds: [embRegistro]})

                        }else{
                            embBanear
                            .setTitle("⛔ Bot externo baneado")
                            .setDescription(`🤖 **Bot externo:** ${usuario}\n**ID:** ${usuario.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                            .setFooter(usuario.tag, usuario.displayAvatarURL({dynamic: true}))
    
                            int.guild.members.ban(usuario, {days: 7, reason: `Moderador: ${int.user.tag} ID: ${int.user.id} | Bot baneado: ${usuario.tag}, ID: ${usuario.id} | Razón: ${razon}`}).then(k=>{
                                setTimeout(()=>{
                                    int.editReply({embeds: [embBanear]})
                                }, 400)
                            })
            
                            embRegistro
                            .addFields(
                                {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                                {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                                {name: "🤖 **Bot externo baneado:**", value: `${usuario}\n**ID:** ${usuario.id}`},
                                {name: "📑 **Razón:**", value: `${razon}`}
                            )
                            canalRegistro.send({embeds: [embRegistro]})
                        }
    
                    }else{
                        if(miembro){
                            embBanear
                            .setTitle("⛔ Miembro baneado")
                            .setDescription(`👤 **Ex miembro:** ${usuario}\n**ID:** ${usuario.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                        
                            int.guild.members.ban(usuario.id, {days: 7, reason: `Moderador: ${int.user.tag} ID: ${int.user.id} | Bot baneado: ${usuario.tag}, ID: ${usuario.id} | Razón: ${razon}`}).then(tb=>{
                                miembro.send({embeds: [embBanearDM]}).then(tmd=>{
                                    embBanear
                                    .setFooter(usuario.tag, usuario.displayAvatarURL({dynamic: true}))
                                    setTimeout(()=>{
                                        int.editReply({embeds: [embBanear]})
                                    }, 400)
                                }).catch(cdm=>{
                                    embBanear
                                    .setFooter(`No he podido enviar el mensaje al ex miembro ${usuario.tag}`, usuario.displayAvatarURL({dynamic: true}))
                                    setTimeout(()=>{
                                        int.editReply({embeds: [embBanear]})
                                    }, 400)
                                })
                            })

                            embRegistro
                            .addFields(
                                {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                                {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                                {name: "👤 **Bot baneado:**", value: `${usuario}\n**ID:** ${usuario.id}`},
                                {name: "📑 **Razón:**", value: `${razon}`}
                            )
                            canalRegistro.send({embeds: [embRegistro]})
                            
                        }else{
                            embBanear
                            .setTitle("⛔ Usuario baneado")
                            .setDescription(`👤 **Usuario externo:** ${usuario}\n**ID:** ${usuario.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                            .setFooter(usuario.tag, usuario.displayAvatarURL({dynamic: true}))

                            int.guild.members.ban(usuario.id, {days: 7, reason: `Moderador: ${int.user.tag} ID: ${int.user.id} | Bot baneado: ${usuario.tag}, ID: ${usuario.id} | Razón: ${razon}`}).then(tb=>{
                                setTimeout(()=>{
                                    int.editReply({embeds: [embBanear]})
                                }, 400)
                            })

                            embRegistro
                            .addFields(
                                {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                                {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                                {name: "👤 **Usuario baneado:**", value: `${usuario}\n**ID:** ${usuario.id}`},
                                {name: "📑 **Razón:**", value: `${razon}`}
                            )
                            canalRegistro.send({embeds: [embRegistro]})
                        }
                    }
    
                }else{
                    let errores = [
                        {condicion: miembro.id == client.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* soy yo, yo no me puedo banear a mi mismo.`},
                        {condicion: miembro.id == int.user.id, descripcion: `El miembro que has proporcionado *(${miembro})* eres tu, no te puedes banear a ti mismo.`},
                        {condicion: usuario.id == int.guild.ownerId, descripcion: `El miembro que has proporcionado *(${miembro})* es mi creador y el dueño del servidor, **¿Qué intentas hacer?**.`},
                        {condicion: miembro && miembro.roles.highest.comparePositionTo(int.member.roles.highest)>=0, descripcion: `El rol con la posición mas alta del miembro que has proporcionado *(${miembro})* tiene una posición igual o mayor a la de tu rol mas alto, no puedes banear al miembro.`},
                        {condicion: (await int.guild.bans.fetch()).some(s=>s.user.id == usuario.id), descripcion: `El usuario *(${usuario})* ya se encuentra baneado en el servidor.`},
                        // {condicion: !miembro, descripcion: ``},
                    ]
                    for(e in errores){
                        const embError = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(errores[e].descripcion)
                        .setColor(colorErr)
                        if(errores[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
                    }
    
                    int.deferReply()
                    if(usuario.bot){
                        if(miembro){
                            embBanear
                            .setTitle("⛔ Bot baneado")
                            .setDescription(`🤖 **Ex bot:** ${usuario}\n**ID:** ${usuario.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                            .setFooter(usuario.tag, usuario.displayAvatarURL({dynamic: true}))
    
                            int.guild.members.ban(usuario, {days: 7, reason: `Moderador: ${int.user.tag} ID: ${int.user.id} | Bot baneado: ${usuario.tag}, ID: ${usuario.id} | Razón: ${razon}`}).then(k=>{
                                setTimeout(()=>{
                                    int.editReply({embeds: [embBanear]})
                                }, 400)
                            })
            
                            embRegistro
                            .addFields(
                                {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                                {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                                {name: "🤖 **Ex bot baneado:**", value: `${usuario}\n**ID:** ${usuario.id}`},
                                {name: "📑 **Razón:**", value: `${razon}`}
                            )
                            canalRegistro.send({embeds: [embRegistro]})

                        }else{
                            embBanear
                            .setTitle("⛔ Bot externo baneado")
                            .setDescription(`🤖 **Bot externo:** ${usuario}\n**ID:** ${usuario.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                            .setFooter(usuario.tag, usuario.displayAvatarURL({dynamic: true}))
    
                            int.guild.members.ban(usuario, {days: 7, reason: `Moderador: ${int.user.tag} ID: ${int.user.id} | Bot baneado: ${usuario.tag}, ID: ${usuario.id} | Razón: ${razon}`}).then(k=>{
                                setTimeout(()=>{
                                    int.editReply({embeds: [embBanear]})
                                }, 400)
                            })
            
                            embRegistro
                            .addFields(
                                {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                                {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                                {name: "🤖 **Bot externo baneado:**", value: `${usuario}\n**ID:** ${usuario.id}`},
                                {name: "📑 **Razón:**", value: `${razon}`}
                            )
                            canalRegistro.send({embeds: [embRegistro]})
                        }
    
                    }else{
                        if(miembro){
                            embBanear
                            .setTitle("⛔ Miembro baneado")
                            .setDescription(`👤 **Ex miembro:** ${usuario}\n**ID:** ${usuario.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                        
                            int.guild.members.ban(usuario.id, {days: 7, reason: `Moderador: ${int.user.tag} ID: ${int.user.id} | Bot baneado: ${usuario.tag}, ID: ${usuario.id} | Razón: ${razon}`}).then(tb=>{
                                miembro.send({embeds: [embBanearDM]}).then(tmd=>{
                                    embBanear
                                    .setFooter(usuario.tag, usuario.displayAvatarURL({dynamic: true}))
                                    setTimeout(()=>{
                                        int.editReply({embeds: [embBanear]})
                                    }, 400)
                                }).catch(cdm=>{
                                    embBanear
                                    .setFooter(`No he podido enviar el mensaje al ex miembro ${usuario.tag}`, usuario.displayAvatarURL({dynamic: true}))
                                    setTimeout(()=>{
                                        int.editReply({embeds: [embBanear]})
                                    }, 400)
                                })
                            })

                            embRegistro
                            .addFields(
                                {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                                {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                                {name: "👤 **Bot baneado:**", value: `${usuario}\n**ID:** ${usuario.id}`},
                                {name: "📑 **Razón:**", value: `${razon}`}
                            )
                            canalRegistro.send({embeds: [embRegistro]})
                            
                        }else{
                            embBanear
                            .setTitle("⛔ Usuario baneado")
                            .setDescription(`👤 **Usuario externo:** ${usuario}\n**ID:** ${usuario.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${int.user}`)
                            .setFooter(usuario.tag, usuario.displayAvatarURL({dynamic: true}))

                            int.guild.members.ban(usuario.id, {days: 7, reason: `Moderador: ${int.user.tag} ID: ${int.user.id} | Bot baneado: ${usuario.tag}, ID: ${usuario.id} | Razón: ${razon}`}).then(tb=>{
                                setTimeout(()=>{
                                    int.editReply({embeds: [embBanear]})
                                }, 400)
                            })

                            embRegistro
                            .addFields(
                                {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                                {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                                {name: "👤 **Usuario baneado:**", value: `${usuario}\n**ID:** ${usuario.id}`},
                                {name: "📑 **Razón:**", value: `${razon}`}
                            )
                            canalRegistro.send({embeds: [embRegistro]})
                        }
                    }
                }
            }).catch(c=>{
                const embError1 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`La ID que has proporcionado *(${id})* tiene todas las características para ser una ID pero no es una ID de ningún usuario de Discord.`)
                .setColor(colorErr)
                int.reply({ephemeral: true, embeds: [embError1]})
            })
        }

        if(int.commandName == "desbanear"){
            estadisticas.comandos++
            let id = int.options.getString("id"), canalRegistro = int.guild.channels.cache.get(dataBot.datos.registros.bot)

            let erroresP = [
                {condicion: !["MODERATE_MEMBERS", "KICK_MEMBERS", "BAN_MEMBERS"].some(s=> int.member.permissions.has(s)), descripcion: `¡No eres moderador del servidor!, no puede utilizar el comando.`},
                {condicion: isNaN(id), descripcion: `La ID proporcionada *(${id})* no es valida ya que no es numérica.`},
                {condicion: id.length != 18, descripcion: `La ID proporcionada *(${id})* no es valida ya que no contiene exactamente **18** caracteres numéricos contiene menos o mas.`},
            ]
            for(e in erroresP){
                const embError = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(erroresP[e].descripcion)
                .setColor(colorErr)
                if(erroresP[e].condicion) return int.reply({ephemeral: true, embeds: [embError]})
            }

            await client.users.fetch(id, {force: true}).then(async usuario =>{
                const embError1 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`El usuario *(${usuario})* no esta baneado.`)
                .setColor(colorErr)
                if(!(await int.guild.bans.fetch()).some(s=>s.user.id == usuario.id)) return int.reply({ephemeral: true, embeds: [embError1]})

                const embDesbanear = new Discord.MessageEmbed()
                .setAuthor(int.member.nickname ? int.member.nickname: int.user.username, int.user.avatarURL({dynamic: true}))
                .setThumbnail(usuario.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 1024}))
                .setFooter(usuario.tag, usuario.displayAvatarURL({dynamic: true}))
                .setColor("#00ff00")
                .setTimestamp()

                const embRegistro = new Discord.MessageEmbed()
                .setAuthor(int.user.tag, int.user.displayAvatarURL({dynamic: true}))
                .setTitle("📝 Registro del comando /desbanear")
                .setColor("#00ff00")
                .setFooter(usuario.tag, usuario.displayAvatarURL({dynamic: true}))
                .setTimestamp()

                int.deferReply()
                if(usuario.bot){
                    embDesbanear
                    .setTitle("<a:afirmativo:856966728806432778> Bot desbaneado")
                    .setDescription(`🤖 **Bot:** ${usuario}\n**ID:** ${usuario.id}\n\n👮 **Moderador:** ${int.user}`)
                
                    int.guild.members.unban(usuario.id, `Moderador: ${int.user.tag} ID: ${int.user.id} | Bot desbaneado: ${usuario.tag}, ID: ${usuario.id}`).then(k=>{
                        setTimeout(()=>{
                            int.editReply({embeds: [embDesbanear]})
                        }, 400)
                    })
    
                    embRegistro
                    .addFields(
                        {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                        {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                        {name: "🤖 **Bot desbaneado:**", value: `${usuario}\n**ID:** ${usuario.id}`},
                    )
                    canalRegistro.send({embeds: [embRegistro]})
    
                }else{
                    embDesbanear
                    .setTitle("<:salir12:879519859694776360> Usuario desbaneado")
                    .setDescription(`👤 **Usuario:** ${usuario}\n**ID:** ${usuario.id}\n\n👮 **Moderador:** ${int.user}`)
                
                    int.guild.members.unban(usuario.id, `Moderador: ${int.user.tag} ID: ${int.user.id} | Usuario desbaneado: ${usuario.tag}, ID: ${usuario.id}`).then(k=>{
                        setTimeout(()=>{
                            int.editReply({embeds: [embDesbanear]})
                        }, 400)
                    })
    
                    embRegistro
                    .addFields(
                        {name: "📌 **Utilizado en:**", value: `${int.channel}\n**ID:** ${int.channelId}`},
                        {name: "👮 **Moderador:**", value: `${int.user}\n**ID:** ${int.user.id}`},
                        {name: "👤 **Usuario desbaneado:**", value: `${usuario}\n**ID:** ${usuario.id}`},
                    )
                    canalRegistro.send({embeds: [embRegistro]})
                }
            }).catch(c=>{
                const embError1 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`La ID que has proporcionado *(${id})* tiene todas las características para ser una ID pero no es una ID de ningún usuario de Discord.`)
                .setColor(colorErr)
                int.reply({ephemeral: true, embeds: [embError1]})
            })
        }
    }

    if(int.isButton()){
        if(int.customId == "eliminarMsgMD"){
            int.message.delete()
        }

        // Sistema de sugerencias
        if(int.customId == "confirmar"){
            let dataSug = await systemSug.findOne({_id: int.guildId})
            let canalRevicion = int.guild.channels.cache.get("831773866228449280")

            let posicion 
            for(let i=0; i<dataSug.mensajes.length; i++){
                if(dataSug.mensajes[i].autorID === int.user.id){
                    posicion = i
                }
            }

            let suger = dataSug.mensajes[posicion].sugerencia

            const embCanfirmada = new Discord.MessageEmbed()
            .setTitle(`<a:afirmativo:856966728806432778> Acción confirmada`)
            .setDescription(`**¡Tu sugerencia ha sido enviada al personal del servidor!**\nPara que la revisen y determinen si es apta o no para ser publicada en <#828300239488024587>.`)
            .setColor("#00ff00")
            .setFooter(`Se te notificara al MD en cualquiera de los 2 casos.`)
            int.update({embeds: [embCanfirmada], components: []})

            const embRevicion = new Discord.MessageEmbed()
            .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
            .setTitle("🔎 Sugerencia esperando revisión")
            .addField(`✉️ **Sugerencia:**`, `${suger}`)
            .setColor(int.guild.me.displayHexColor)
            .setTimestamp()

            const botonesRevicion = new Discord.MessageActionRow()
            .addComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("aprobar")
                    .setEmoji("<a:afirmativo:856966728806432778>")
                    .setLabel("Aprobar")
                    .setStyle("SUCCESS")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("denegar")
                    .setEmoji("<a:negativo:856967325505159169>")
                    .setLabel("Denegar")
                    .setStyle("DANGER")
                ]
            )
            canalRevicion.send({embeds: [embRevicion], components: [botonesRevicion]}).then(async t=>{
                console.log(t.id)
                dataSug.mensajes[posicion] = {id: "", origenID: t.id, autorID: int.user.id, sugerencia: suger, estado: "normal", positivas: 0, negativas: 0}
                let cant = dataSug.sugerencias.cantidad
                let acept = dataSug.sugerencias.aceptadas
                let den = dataSug.sugerencias.denegadas
                let imple = dataSug.sugerencias.implementadas
                let enP = dataSug.sugerencias.en_progreso
                let noSus = dataSug.sugerencias.no_sucedera
                dataSug.sugerencias = {cantidad: cant++, aceptadas: acept, denegadas: den, implementadas: imple, en_progreso: enP, no_sucedera: noSus}
                await dataSug.save()
            })

            if(dataSug.miembros.some(s=> s.id === int.user.id)){
                let posicionData
                for(let i=0; i<dataSug.miembros.length; i++){
                    if(dataSug.miembros[i].id === int.user.id){
                        posicionData = i
                    }
                }

                let sugerenciasDeData = dataSug.miembros[posicionData].sugerencias
                let aceptadasDeData = dataSug.miembros[posicionData].aceptadas
                let denegadasDeData = dataSug.miembros[posicionData].denegadas

                dataSug.miembros[posicionData] = {id: int.user.id, sugerencias: sugerenciasDeData + 1, aceptadas: aceptadasDeData, denegadas: denegadasDeData}
                await dataSug.save()
            }else{
                dataSug.miembros.push({id: int.user.id, sugerencias: 1, aceptadas: 0, denegadas: 0})
                await dataSug.save()
            }
        }
        if(int.customId == "cancelar"){
            let dataSug = await systemSug.findOne({_id: int.guildId})

            for(let i=0; i<dataSug.mensajes.length; i++){
                if(dataSug.mensajes[i].autorID == int.user.id){
                    dataSug.mensajes.splice(i,1)
                    await dataSug.save()
                }
            }
            

            const embCancel = new Discord.MessageEmbed()
            .setTitle("<a:negativo:856967325505159169> Acción cancelada")
            .setDescription(`Has cancelado la sugerencia.`)
            .setColor(colorErr)
            int.update({embeds: [embCancel], components: []})
          
        }

        if(int.customId == "aprobar"){
            let dataSug = await systemSug.findOne({_id: int.guildId})
            let rolSugerencia = int.guild.roles.cache.get("840704367467954247")
            let canalSugs = int.guild.channels.cache.get("828300239488024587")

            let posicion
            for(let i=0; i<dataSug.mensajes.length; i++){
                if(dataSug.mensajes[i].origenID === int.message.id){
                    posicion = i
                }
            }

            let miembro = int.guild.members.cache.get(dataSug.mensajes[posicion].autorID)

            if(miembro){
                const embSugAceptada = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("<a:afirmativo:856966728806432778> Sugerencia aprobada")
                .setDescription(`Sugerencia de ${miembro.user.tag} aprobada por ${int.user.tag}`)
                .addField(`✉️ **Sugerencia:**`, `${dataSug.mensajes[posicion].sugerencia}`)
                .setColor("#00ff00")
                .setFooter(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                int.update({embeds: [embSugAceptada], components: []})

                const embSugAceptDM = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("<a:afirmativo:856966728806432778> Tu sugerencia ha sido aprobada")
                .setDescription(`Tu sugerencia ha sido publicada en el canal ${canalSugs}`)
                .addField(`✉️ **Tu sugerencia:**`, `${dataSug.mensajes[posicion].sugerencia}`)
                .setColor("#00ff00")
                .setFooter(`Sugerencia aceptada por ${int.user.tag}`,int.user.  displayAvatarURL({dynamic: true}))
                .setTimestamp()
                miembro.send({embeds: [embSugAceptDM]}).catch(c=>{
                    return;
                })

                const embSugerencia = new Discord.MessageEmbed()
                .setAuthor(`Nueva sugerencia de ${miembro.user.tag}`,miembro.displayAvatarURL({dynamic: true}))
                .setTitle("✉️ Sugerencia:")
                .setDescription(`${dataSug.mensajes[posicion].sugerencia}`)
                .setColor(rolSugerencia.hexColor)
                .setTimestamp()
                canalSugs.send({embeds: [embSugerencia], content: "<@&840704367467954247>"}).then(async tm=>{
                    tm.react("946826193032851516")
                    tm.react("946826212960010251")
                    let orID = dataSug.mensajes[posicion].origenID
                    let miemID = dataSug.mensajes[posicion].autorID
                    let sug = dataSug.mensajes[posicion].sugerencia
                    dataSug.mensajes[posicion] = {id: tm.id, origenID: orID, autorID: miemID, sugerencia: sug, estado: "normal", positivas: 0, negativas: 0}
                    
                    let cant = dataSug.sugerencias.cantidad
                    let acept = dataSug.sugerencias.aceptadas
                    let den = dataSug.sugerencias.denegadas
                    let imple = dataSug.sugerencias.implementadas
                    let enP = dataSug.sugerencias.en_progreso
                    let noSus = dataSug.sugerencias.no_sucedera
                    dataSug.sugerencias = {cantidad: cant, aceptadas: acept + 1, denegadas: den, implementadas: imple, en_progreso: enP, no_sucedera: noSus}
                    
                    await dataSug.save()
                    miembro.roles.add("830260561044176896")
                })

                if(dataSug.miembros.some(s=> s.id === miembro.id)){
                    let posicionData
                    for(let i=0; i<dataSug.miembros.length; i++){
                        posicionData = i
                    }

                    let sugerenciasDeData = dataSug.miembros[posicionData].sugerencias
                    let aceptadasDeData = dataSug.miembros[posicionData].aceptadas
                    let denegadasDeData = dataSug.miembros[posicionData].denegadas

                    dataSug.miembros[posicionData] = {id: miembro.id, sugerencias: sugerenciasDeData, aceptadas: aceptadasDeData + 1, denegadas: denegadasDeData}
                    await dataSug.save()
                }
            }else{
                let usuario = await client.users.fetch(dataSug.mensajes[posicion].autorID, {force: true})

                const embSugAceptada = new Discord.MessageEmbed()
                .setAuthor(usuario.tag,usuario.displayAvatarURL({dynamic: true}))
                .setTitle("<a:afirmativo:856966728806432778> Sugerencia aprobada")
                .setDescription(`Sugerencia de **${usuario.tag}** aprobada por **${int.user.tag}**.`)
                .addField(`✉️ **Sugerencia:**`, `${dataSug.mensajes[posicion].sugerencia}`)
                .setColor("#00ff00")
                .setFooter(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                int.update({embeds: [embSugAceptada], components: []})

                const embSugerencia = new Discord.MessageEmbed()
                .setAuthor(`Nueva sugerencia de ${usuario.tag}`,usuario.displayAvatarURL({dynamic: true}))
                .setTitle("✉️ Sugerencia:")
                .setDescription(`${dataSug.mensajes[posicion].sugerencia}`)
                .setColor(rolSugerencia.hexColor)
                .setTimestamp()
                canalSugs.send({embeds: [embSugerencia], content: "<@&840704367467954247>"}).then(async tm=>{
                    tm.react("946826193032851516")
                    tm.react("946826212960010251")
                    let orID = dataSug.mensajes[posicion].origenID
                    let miemID = dataSug.mensajes[posicion].autorID
                    let sug = dataSug.mensajes[posicion].sugerencia
                    dataSug.mensajes[posicion] = {id: tm.id, origenID: orID, autorID: miemID, sugerencia: sug, estado: "normal", positivas: 0, negativas: 0}
                    
                    let cant = dataSug.sugerencias.cantidad
                    let acept = dataSug.sugerencias.aceptadas
                    let den = dataSug.sugerencias.denegadas
                    let imple = dataSug.sugerencias.implementadas
                    let enP = dataSug.sugerencias.en_progreso
                    let noSus = dataSug.sugerencias.no_sucedera
                    dataSug.sugerencias = {cantidad: cant, aceptadas: acept + 1, denegadas: den, implementadas: imple, en_progreso: enP, no_sucedera: noSus}
                   
                    await dataSug.save()
                })
            }
            
        }
        if(int.customId === "denegar"){
            let dataSug = await systemSug.findOne({_id: int.guildId})

            let posicion
            for(let i=0; i<dataSug.mensajes.length; i++){
                if(dataSug.mensajes[i].origenID == int.message.id){
                    posicion = i
                }
            }

            let miembro = int.guild.members.cache.get(dataSug.mensajes[posicion].autorID)

            if(miembro){
                const embDenegada = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("<a:negativo:856967325505159169> Sugerencia denegada")
                .setDescription(`Sugerencia de **${miembro.user.tag}** denegada por **${int.user.tag}**.`)
                .addField(`✉️ **Sugerencia:**`, `${dataSug.mensajes[posicion].sugerencia}`)
                .setColor(colorErr)
                .setFooter(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                int.update({embeds: [embDenegada], components: []}).then(async t=>{
                    let cant = dataSug.sugerencias.cantidad
                    let acept = dataSug.sugerencias.aceptadas
                    let den = dataSug.sugerencias.denegadas
                    let imple = dataSug.sugerencias.implementadas
                    let enP = dataSug.sugerencias.en_progreso
                    let noSus = dataSug.sugerencias.no_sucedera
                    dataSug.sugerencias = {cantidad: cant, aceptadas: acept, denegadas: den + 1, implementadas: imple, en_progreso: enP, no_sucedera: noSus}
                    await dataSug.save()
                })

                const embDenegadaDM = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("<a:negativo:856967325505159169> Tu sugerencia ha sido denegada")
                .addField(`✉️ **Sugerencia:**`, `${dataSug.mensajes[posicion].sugerencia}`)
                .setColor(colorErr)
                .setFooter(`Sugerencia denegada por ${int.user.tag}`,int.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                miembro.send({embeds: [embDenegadaDM]}).catch(c=>{
                    return;
                })

                if(dataSug.miembros.some(s=> s.id == miembro.id)){
                    let posicionData
                    for(let i=0; i<dataSug.miembros.length; i++){
                        posicionData = i
                    }

                    let sugerenciasDeData = dataSug.miembros[posicionData].sugerencias
                    let aceptadasDeData = dataSug.miembros[posicionData].aceptadas
                    let denegadasDeData = dataSug.miembros[posicionData].denegadas

                    dataSug.miembros[posicionData] = {id: miembro.id, sugerencias: sugerenciasDeData, aceptadas: aceptadasDeData, denegadas: denegadasDeData + 1}
                    await dataSug.save()
                }

                dataSug.mensajes[posicion].splice(i,1)
                await dataSug.save()
            }else{
                let usuario = await client.users.fetch(dataSug.mensajes[posicion].autorID, {force: true})

                const embDenegada = new Discord.MessageEmbed()
                .setAuthor(usuario.tag,usuario.displayAvatarURL({dynamic: true}))
                .setTitle("<a:negativo:856967325505159169> Sugerencia denegada")
                .setDescription(`Sugerencia de **${usuario.tag}** denegada por **${int.user.tag}**.`)
                .addField(`✉️ **Sugerencia:**`, `${dataSug.mensajes[posicion].sugerencia}`)
                .setColor(colorErr)
                .setFooter(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                int.update({embeds: [embDenegada], components: []}).then(async t=>{
                    let cant = dataSug.sugerencias.cantidad
                    let acept = dataSug.sugerencias.aceptadas
                    let den = dataSug.sugerencias.denegadas
                    let imple = dataSug.sugerencias.implementadas
                    let enP = dataSug.sugerencias.en_progreso
                    let noSus = dataSug.sugerencias.no_sucedera
                    dataSug.sugerencias = {cantidad: cant, aceptadas: acept, denegadas: den + 1, implementadas: imple, en_progreso: enP, no_sucedera: noSus}

                    dataSug.mensajes[posicion].splice(i,1)
                    await dataSug.save()
                })
            }
        }

        if(int.customId == "implementada"){
            let dataSug = await systemSug.findOne({_id: int.guildId})
            let canal = int.guild.channels.cache.get("828300239488024587")

            let posMar
            for(let i=0; i<sistemMarcar.length; i++){
                if(sistemMarcar[i].autorID == int.user.id){
                    posMar = i
                }
            }

            let posicion 
            for(let i=0; i<dataSug.mensajes.length; i++){
                if(dataSug.mensajes[i].id == sistemMarcar[posMar].sugID){
                    posicion = i
                }
            }

            let miembro = int.guild.members.cache.get(dataSug.mensajes[posicion].autorID)

            let mensaje = canal.messages.cache.get(dataSug.mensajes[posicion].id)
            mensaje.reactions.removeAll()
            let embed = mensaje.embeds[0]

            // let antField = embed.fields[0]
            let nuevoField = {name: '🚥 **Estado:**', value: "**sugerencia implementada**", inline: false}

            if(embed.fields.length <= 1){
                const edit = embed
                .addField(`🚥 **Estado:**`, `**sugerencia implementada**`)
                embed.color = "#00ff00"
                mensaje.edit({embeds: [edit]})

                let orID = dataSug.mensajes[posicion].origenID
                let auID = dataSug.mensajes[posicion].autorID
                let sug = dataSug.mensajes[posicion].sugerencia
                let positi = dataSug.mensajes[posicion].positivas
                let negati = dataSug.mensajes[posicion].negativas
                dataSug.mensajes[posicion] = {id: sistemMarcar[posMar].sugID, origenID: orID, autorID: auID, sugerencia: sug, estado: "implementada", positivas: positi, negativas: negati}
            }else{
                embed.fields[1] = nuevoField
                embed.color = "#00ff00"
                mensaje.edit({embeds: [embed]})

                let orID = dataSug.mensajes[posicion].origenID
                let auID = dataSug.mensajes[posicion].autorID
                let sug = dataSug.mensajes[posicion].sugerencia
                let positi = dataSug.mensajes[posicion].positivas
                let negati = dataSug.mensajes[posicion].negativas
                dataSug.mensajes[posicion] = {id: sistemMarcar[posMar].sugID, origenID: orID, autorID: auID, sugerencia: sug, estado: "implementada", positivas: positi, negativas: negati}
            }

            let cant = dataSug.sugerencias.cantidad
            let acept = dataSug.sugerencias.aceptadas
            let den = dataSug.sugerencias.denegadas
            let imple = dataSug.sugerencias.implementadas
            let enP = dataSug.sugerencias.en_progreso
            let noSus = dataSug.sugerencias.no_sucedera
            dataSug.sugerencias = {cantidad: cant, aceptadas: acept, denegadas: den, implementadas: imple + 1, en_progreso: enP, no_sucedera: noSus}
            await dataSug.save()

            const embEstado = new Discord.MessageEmbed()
            .setTitle("🚥 Estado agregado a la sugerencia")
            .setDescription(`Se le ha agregado a la sugerencia el estado 🟢 **Implementada**.`)
            .setColor("#00ff00")
            int.reply({embeds: [embEstado], ephemeral: true})
            miembro.roles.add("946139081367240714")

            if(miembro){
                const embEstadoMD = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("El estado de tu sugerencia a sido actualizado")
                .setDescription(`🚥 **Estado:** sugerencia implementada`)
                .addField("✉️ **Sugerencia:**", `${dataSug.mensajes[posicion].sugerencia}`)
                .setColor("#00ff00")
                .setFooter(`Actualizado por ${int.user.tag}`,int.user.displayAvatarURL({dynamic: true}))
                miembro.send({embeds: [embEstadoMD]}).catch(c=>{
                    return;
                })
            }


        }
        if(int.customId == "en progreso"){
            let dataSug = await systemSug.findOne({_id: int.guildId})
            let canal = int.guild.channels.cache.get("828300239488024587")

            let posMar
            for(let i=0; i<sistemMarcar.length; i++){
                if(sistemMarcar[i].autorID == int.user.id){
                    posMar = i
                }
            }
            let posicion 
            for(let i=0; i<dataSug.mensajes.length; i++){
                if(dataSug.mensajes[i].id == sistemMarcar[posMar].sugID){
                    posicion = i
                }
            }

            let miembro = int.guild.members.cache.get(dataSug.mensajes[posicion].autorID)

            let mensaje = canal.messages.cache.get(dataSug.mensajes[posicion].id)
            let embed = mensaje.embeds[0]

            // let antField = embed.fields[0]
            let nuevoField = {name: '🚥 **Estado:**', value: "__sugerencia en progreso__", inline: false}

            if(embed.fields.length <= 1){
                const edit = embed
                .addField(`🚥 **Estado:**`, `__sugerencia en progreso__`)
                embed.color = "#FFC300"
                mensaje.edit({embeds: [edit]})

                let orID = dataSug.mensajes[posicion].origenID
                let auID = dataSug.mensajes[posicion].autorID
                let sug = dataSug.mensajes[posicion].sugerencia
                let positi = dataSug.mensajes[posicion].positivas
                let negati = dataSug.mensajes[posicion].negativas
                dataSug.mensajes[posicion] = {id: sistemMarcar[posMar].sugID, origenID: orID, autorID: auID, sugerencia: sug, estado: "en progreso", positivas: positi, negativas: negati}
            }else{
                embed.fields[1] = nuevoField
                embed.color = "#FFC300"
                mensaje.edit({embeds: [embed]})

                let orID = dataSug.mensajes[posicion].origenID
                let auID = dataSug.mensajes[posicion].autorID
                let sug = dataSug.mensajes[posicion].sugerencia
                let positi = dataSug.mensajes[posicion].positivas
                let negati = dataSug.mensajes[posicion].negativas
                dataSug.mensajes[posicion] = {id: sistemMarcar[posMar].sugID, origenID: orID, autorID: auID, sugerencia: sug, estado: "en progreso", positivas: positi, negativas: negati}
            }

            let cant = dataSug.sugerencias.cantidad
            let acept = dataSug.sugerencias.aceptadas
            let den = dataSug.sugerencias.denegadas
            let imple = dataSug.sugerencias.implementadas
            let enP = dataSug.sugerencias.en_progreso
            let noSus = dataSug.sugerencias.no_sucedera
            dataSug.sugerencias = {cantidad: cant, aceptadas: acept, denegadas: den, implementadas: imple, en_progreso: enP + 1, no_sucedera: noSus}
            await dataSug.save()

            const embEstado = new Discord.MessageEmbed()
            .setTitle("🚥 Estado agregado a la sugerencia")
            .setDescription(`Se le ha agregado a la sugerencia el estado 🟡 **en progreso**.`)
            .setColor("#FFC300")
            int.reply({embeds: [embEstado], ephemeral: true})

            if(miembro){
                const embEstadoMD = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("El estado de tu sugerencia a sido actualizado")
                .setDescription(`🚥 **Estado:** sugerencia __en progreso__`)
                .addField("✉️ **Sugerencia:**", `${dataSug.mensajes[posicion].sugerencia}`)
                .setColor("#FFC300")
                .setFooter(`Actualizado por ${int.user.tag}`,int.user.displayAvatarURL({dynamic: true}))
                miembro.send({embeds: [embEstadoMD]}).catch(c=>{
                    return;
                })
            }
        }
        if(int.customId == "no sucedera"){
            let dataSug = await systemSug.findOne({_id: int.guildId})
            let canal = int.guild.channels.cache.get("828300239488024587")

            let posMar
            for(let i=0; i<sistemMarcar.length; i++){
                if(sistemMarcar[i].autorID === int.user.id){
                    posMar = i
                }
            }

            let posicion 
            for(let i=0; i<dataSug.mensajes.length; i++){
                if(dataSug.mensajes[i].id === sistemMarcar[posMar].sugID){
                    posicion = i
                }
            }

            let miembro = int.guild.members.cache.get(dataSug.mensajes[posicion].autorID)

            let mensaje = canal.messages.cache.get(dataSug.mensajes[posicion].id)
            mensaje.reactions.removeAll()
            let embed = mensaje.embeds[0]
            console.log(embed.fields[0])

            // let antField = embed.fields[0]
            let nuevoField = {name: '🚥 **Estado:**', value: "__***no sucederá***__", inline: false}

            if(embed.fields.length <= 1){
                const edit = embed
                .addField(`🚥 **Estado:**`, `__***no sucederá***__`)
                embed.color = "#ff0000"
                mensaje.edit({embeds: [edit]})

                let orID = dataSug.mensajes[posicion].origenID
                let auID = dataSug.mensajes[posicion].autorID
                let sug = dataSug.mensajes[posicion].sugerencia
                let positi = dataSug.mensajes[posicion].positivas
                let negati = dataSug.mensajes[posicion].negativas
                dataSug.mensajes[posicion] = {id: sistemMarcar[posMar].sugID, origenID: orID, autorID: auID, sugerencia: sug, estado: "no sucederá", positivas: positi, negativas: negati}
            
            }else{
                embed.fields[1] = nuevoField
                embed.color = "#ff0000"
                mensaje.edit({embeds: [embed]})

                let orID = dataSug.mensajes[posicion].origenID
                let auID = dataSug.mensajes[posicion].autorID
                let sug = dataSug.mensajes[posicion].sugerencia
                let positi = dataSug.mensajes[posicion].positivas
                let negati = dataSug.mensajes[posicion].negativas
                dataSug.mensajes[posicion] = {id: sistemMarcar[posMar].sugID, origenID: orID, autorID: auID, sugerencia: sug, estado: "no sucederá", positivas: positi, negativas: negati}
            
            }

            let cant = dataSug.sugerencias.cantidad
            let acept = dataSug.sugerencias.aceptadas
            let den = dataSug.sugerencias.denegadas
            let imple = dataSug.sugerencias.implementadas
            let enP = dataSug.sugerencias.en_progreso
            let noSus = dataSug.sugerencias.no_sucedera
            dataSug.sugerencias = {cantidad: cant, aceptadas: acept, denegadas: den, implementadas: imple, en_progreso: enP, no_sucedera: noSus + 1}
            await dataSug.save()

            const embEstado = new Discord.MessageEmbed()
            .setTitle("🚥 Estado agregado a la sugerencia")
            .setDescription(`Se le ha agregado a la sugerencia el estado 🔴 **no sucederá**.`)
            .setColor("#ff0000")
            int.reply({embeds: [embEstado], ephemeral: true})

            if(miembro){
                const embEstadoMD = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("El estado de tu sugerencia a sido actualizado")
                .setDescription(`🚥 **Estado:** sugerencia __no sucederá__`)
                .addField("✉️ **Sugerencia:**", `${dataSug.mensajes[posicion].sugerencia}`)
                .setColor("#ff0000")
                .setFooter(`Actualizado por ${int.user.tag}`,int.user.displayAvatarURL({dynamic: true}))
                miembro.send({embeds: [embEstadoMD]}).catch(c=>{
                    return;
                })
            }
        }
        if(int.customId == "normal"){
            let dataSug = await systemSug.findOne({_id: int.guildId})
            let canal = int.guild.channels.cache.get("828300239488024587")
            let rol = int.guild.roles.cache.get("840704367467954247")

            let posMar
            for(let i=0; i<sistemMarcar.length; i++){
                if(sistemMarcar[i].autorID == int.user.id){
                    posMar = i
                }
            }
            let posicion 
            for(let i=0; i<dataSug.mensajes.length; i++){
                if(dataSug.mensajes[i].id == sistemMarcar[posMar].sugID){
                    posicion = i
                }
            }

            let mensaje = canal.messages.cache.get(dataSug.mensajes[posicion].id)
            let embed = mensaje.embeds[0]

            
            embed.fields.splice(1,1)
            embed.color = rol.hexColor
            mensaje.edit({embeds: [embed]})

            let orID = dataSug.mensajes[posicion].origenID
            let auID = dataSug.mensajes[posicion].autorID
            let sug = dataSug.mensajes[posicion].sugerencia
            let positi = dataSug.mensajes[posicion].positivas
            let negati = dataSug.mensajes[posicion].negativas
            dataSug.mensajes[posicion] = {id: sistemMarcar[posMar].sugID, origenID: orID, autorID: auID, sugerencia: sug, estado: "normal", positivas: positi, negativas: negati}
            

            let cant = dataSug.sugerencias.cantidad
            let acept = dataSug.sugerencias.aceptadas
            let den = dataSug.sugerencias.denegadas
            let imple = dataSug.sugerencias.implementadas
            let enP = dataSug.sugerencias.en_progreso
            let noSus = dataSug.sugerencias.no_sucedera
            dataSug.sugerencias = {cantidad: cant, aceptadas: acept, denegadas: den, implementadas: imple, en_progreso: enP, no_sucedera: noSus}
            await dataSug.save()
            

            const embEstado = new Discord.MessageEmbed()
            .setTitle("🚥 Estado agregado a la sugerencia")
            .setDescription(`Se le ha agregado a la sugerencia el estado 🔵 **normal**.`)
            .setColor(rol.hexColor)
            int.reply({embeds: [embEstado], ephemeral: true})
        }

        // Sistema de tickets
        if(int.customId == "crearTicket"){
            let dataTs = await ticketsDB.findOne({_id: servidorID}), servidor2 = client.guilds.cache.get("949860813915705354")

            if(!cooldowns.has("crearTicket")) cooldowns.set("crearTicket", new Discord.Collection())
    
            const tiempoActual = Date.now()
            const datosComando = cooldowns.get("crearTicket")

            const embEresPersonal = new Discord.MessageEmbed()
            .setTitle(`${emojiError} Error`)
            .setDescription(`Eres miembro del personal del servidor, no puedes abrir ticket ya que no es necesario si tienes acceso al canal <#836061890622521384> y otros canales mas en los cuales puedes hablar con los demás miembros del personal y resolver tus dudas o reportar usuarios o bugs, etc.`)
            .setColor(colorErr)
            if(int.member.roles.cache.has("887444598715219999")) return int.reply({ephemeral: true, embeds: [embEresPersonal]})

            const embCreandoTicket = new Discord.MessageEmbed()
            .setTitle(`<a:loop:964162886865944617> Creando ticket...`)
            .setDescription(`Se esta creando tu ticket, espera unos segundos.`)
            .setColor("BLUE")

            const embMensajeCh = new Discord.MessageEmbed()
            .setAuthor({name: int.member.nickname ? int.member.nickname: int.user.username, iconURL: int.user.displayAvatarURL({dynamic: true})})
            .setTitle(`<:ticket:962122515348590623> Ticket ${dataTs.datos.cantidad}`)
            .setDescription(`Ten paciencia a que un miembro de personal te atienda si eso no sucede en **10** minutos menciona a un miembro del personal que este conectado, en caso de haber mencionado a **1** o **2** miembros del personal y no haberte atendido reporta esta acción a <@717420870267830382> por mensaje privado.`)
            .setColor(int.guild.me.displayHexColor)
            .setFooter({text: int.guild.name, iconURL: int.guild.iconURL({dynamic: true})})
            .setTimestamp()

            const botonesMsgticCh = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId("cerrarTicket")
                .setEmoji("962574398190145566")
                .setLabel("Cerrar ticket")
                .setStyle("SECONDARY")
            )

            if(dataTs.tickets.some(s=> s.miembroID == int.user.id) && dataTs.tickets.find(f=> f.miembroID == int.user.id).cerrado == false){
                const embTicketAbierto = new Discord.MessageEmbed()
                .setTitle(`<:advertencia:929204500739268608> Ya tienes un ticket`)
                .setDescription(`Ya has creado un ticket el cual es <#${dataTs.tickets.find(f=> f.miembroID == int.user.id).id}>, no puedes crear otro ticket asta que el anterior se haya cerrado.`)
                .setColor("YELLOW")
                int.reply({ephemeral: true, embeds: [embTicketAbierto]})
            }else{
                
                if(datosComando.has(int.user.id)){
                    const tiempoUltimo = datosComando.get(int.user.id) + 4*60000;
                    console.log(tiempoUltimo - tiempoActual)
        
                    const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
                    const embEnfriarse = new Discord.MessageEmbed()
                    .setTitle("⏱️ Enfriamiento/cooldown")
                    .setDescription(`Espera ${enfriamiento >= 60 ? `**${Math.floor(enfriamiento/60)}**:**${enfriamiento%60}** minutos`: `**${enfriamiento}** segundos`} para volver a crear un ticket.`)
                    .setColor("BLUE")
        
                    if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                        int.reply({ephemeral: true, embeds: [embEnfriarse]})
                    }, 500)
                }

                int.reply({ephemeral: true, embeds: [embCreandoTicket]})

                int.guild.channels.create(`『🎫』ticket ${dataTs.datos.cantidad}`, {parent: "833120722695487518", permissionOverwrites: [{id: int.guildId, deny: "VIEW_CHANNEL"}, {id: int.user.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]}, {id: "831669132607881236", allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]}, {id: "773271945894035486", allow: ["VIEW_CHANNEL", "SEND_MESSAGES"]}], topic: `<:candadoAbierto:962574461054373929> Ticket número **${dataTs.datos.cantidad}** de <@${int.user.id}> que se unió al servidor <t:${Math.floor(int.member.joinedAt / 1000)}:R> creado el <t:${Math.floor(Date.now() / 1000)}:F> *(<t:${Math.floor(Date.now() / 1000)}:R>)* esta *abierto*.`, reason: `Nuevo ticket numero ${dataTs.datos.cantidad} creado por ${int.user.tag}.`}).then(async ch=>{
                    const embTicket = new Discord.MessageEmbed()
                    .setTitle(`<:ticket:962122515348590623> Ticket creado`)
                    .setDescription(`Tu ticket <#${ch.id}> ha sido creado.`)
                    .setColor("#00ff00")

                    servidor2.channels.create(`『🎫』ticket ${dataTs.datos.cantidad}`, {parent: "949860813915705355", topic: `<:tickets:962127203645136896> Ticket numero **${dataTs.datos.cantidad}** de <@${int.user.id}>/${int.user.tag} que se unió al servidor <t:${Math.floor(int.member.joinedAt / 1000)}:R> creado el <t:${Math.floor(Date.now() / 1000)}:F> *(<t:${Math.floor(Date.now() / 1000)}:R>)*.`, reason: `Nueva copia del ticket numero ${dataTs.datos.cantidad} creado por ${int.user.tag}.`}).then(async chCopia =>{
    
                        let arrayTs = dataTs.tickets, arrayMs = dataTs.miembros, objetoDs = dataTs.datos
                        objetoDs.cantidad++
                        await chCopia.createWebhook(int.user.tag, {avatar: int.user.displayAvatarURL({size: 600, format: "png"}), reason: `Creado para simular la conversación del ticket numero ${dataTs.datos.cantidad}.`})
                        ch.send({content: `**Hola <@${int.user.id}> bienvenido a tu ticket**, en breve estará aquí un miembro del <@&887444598715219999 para atenderte.`, embeds: [embMensajeCh], components: [botonesMsgticCh]}).then(async tm=>{
                            tm.pin()
                            arrayTs.push({id: ch.id, copiaID: chCopia.id, miembroID: int.user.id, msgPrincipalID: tm.id, msgCerrarID: false, msgValoracionID: false, valoracion: false, personalID: false, cerrado: false, publico: true, cooldown: false, edits: 0})
                            await ticketsDB.findByIdAndUpdate(servidorID, {datos: objetoDs, tickets: arrayTs})
                        })
                        int.editReply({embeds: [embTicket]})


                        if(dataTs.miembros.some(s=> s.id == int.user.id)){
                            arrayMs.forEach(async (objeto) =>{
                                if(objeto.id == int.user.id){
                                    objeto.tag = int.user.tag
                                    objeto.ticketsCreados++
                                    objeto.reseñas.push({ticketID: ch.id, ticket: ch.name.match(/(\d+)/g).pop(), estrellas: 0, tiempo: Date.now(), reseña: false})
                                    await ticketsDB.findByIdAndUpdate(servidorID, {miembros: arrayMs})
                                }
                            })
                        }else{
                            arrayMs.push({id: int.user.id, tag: int.user.tag, ticketsCreados: 1, reseñas: [{ticketID: ch.id, ticket: ch.name.match(/(\d+)/g).pop(), estrellas: 0, tiempo: Date.now(), reseña: false}]})
                            await ticketsDB.findByIdAndUpdate(servidorID, {miembros: arrayMs})
                        }
                    })
                })
            }

            datosComando.set(int.user.id, tiempoActual);
            setTimeout(()=>{
                datosComando.delete(int.user.id)
            }, 4*60000)
        }
        if(int.customId == "cerrarTicket"){
            let dataTs = await ticketsDB.findById(servidorID), arrayTs = dataTs.tickets
            int.deferUpdate()

            let ticket = arrayTs.find(f=> f.id==int.channelId)
            const embYaEstaCerrado = new Discord.MessageEmbed()
            .setTitle(`${emojiError} Error`)
            .setDescription(`El ticket ya se encuentra cerrado.`)
            .setColor(colorErr)
            if(dataTs.tickets.find(f=> f.id == int.channelId).cerrado) return int.reply({ephemeral: true, embeds: [embYaEstaCerrado]})

            const embNoTeHanAtendido = new Discord.MessageEmbed()
            .setTitle(`${emojiWarning} Advertencia`)
            .setDescription(`**¿${int.user} estas seguro de que deseas cerrar este ticket?**, ningún miembro del personal te ha atendido recuerda que puedes mencionar a los miembros del personal si es que no te ha atendido ninguno.`)
            .setColor(colorErr)

            const embNoAtendido = new Discord.MessageEmbed()
            .setTitle(`${emojiWarning} Advertencia`)
            .setDescription(`¿${int.user} estas seguro de que deseas cerrar este ticket?, ningún miembro del personal a atendido el ticket, ¿quieres atenderlo?.`)
            .setColor(colorErr)

            const embCerrarTicket = new Discord.MessageEmbed()
            .setTitle("<:candadoCerrado:962574398190145566> Cerrar ticket")
            .setDescription(`¿${int.user} estas seguro de que deseas cerrar este ticket?`)
            .setColor(colorErr)

            const botonCerrar = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId("cerrarTicket")
                .setEmoji("962574398190145566")
                .setLabel("Cerrar ticket")
                .setStyle("SECONDARY")
                .setDisabled(true)
            )

            const botones = new Discord.MessageActionRow()
            .addComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("confirmarTs")
                    .setEmoji("856966728806432778")
                    .setLabel("Confirmar")
                    .setStyle("SUCCESS")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("cancelarTs")
                    .setEmoji(emojiError)
                    .setLabel("Cancelar")
                    .setStyle("DANGER")
                ]
            )
            if(dataTs.tickets.find(f=> f.id == int.channelId).publico && int.user.id == dataTs.tickets.find(f=> f.id == int.channelId).miembroID) return int.channel.send({embeds: [embNoTeHanAtendido], components: [botones]}).then(async tt=> {
                ticket.msgCerrarID = tt.id
                await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})
            })
            if(dataTs.tickets.find(f=> f.id == int.channelId).publico) return int.channel.send({embeds: [embNoAtendido], components: [botones]}).then(async tt=> {
                ticket.msgCerrarID = tt.id
                await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})
            })
            int.channel.send({embeds: [embCerrarTicket], components: [botones]}).then(async tt=> {
                ticket.msgCerrarID = tt.id
                await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})
            })
            int.message.edit({components: [botonCerrar]})
        }
        if(int.customId == "confirmarTs"){
            let dataTs = await ticketsDB.findOne({_id: servidorID}), arrayTs = dataTs.tickets, descripcion = int.channel.topic.split(" "), miembro = int.guild.members.cache.get(arrayTs.find(f=> f.id == int.channelId).miembroID)

            const embCargando = new Discord.MessageEmbed()
            .setTitle(`<a:loop:964162886865944617> Cargando reacciones`)
            .setDescription(`Se están cargando las reacciones y otros elementos del mensaje.`)
            .setColor("BLUE")

            const embReseña = new Discord.MessageEmbed()
            .setTitle(`<:review:962803554555404380> Calificación y reseña de atención`)
            .setDescription(`Antes de cerrar el ticket <@${dataTs.tickets.find(f=> f.id == int.channelId).miembroID}> califica la atención que te han brindado en este ticket reaccionando a las estrellas de abajo, también puedes agregar una reseña sobre tu experiencia, en que podemos mejorar, etc.\nCuando hayas finalizado presiona el botón verde para cerrar el ticket.`)
            .setColor(int.guild.me.displayHexColor)

            const botonesReseña = new Discord.MessageActionRow()
            .addComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId(`reseña`)
                    .setEmoji("📝")
                    .setLabel("Agregar reseña")
                    .setStyle("PRIMARY")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId(`cancelarCyR`)
                    .setEmoji(emojiError)
                    .setLabel("Cancelar")
                    .setStyle("DANGER")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId(`finalizar`)
                    .setEmoji("856966728806432778")
                    .setLabel("Finalizar")
                    .setStyle("SUCCESS")
                ]
            )

            const embTicketCerrado = new Discord.MessageEmbed()
            .setTitle(`<:candadoCerrado:962574398190145566> Ticket cerrado`)
            .setColor(colorErr)

            const botonesCerrado = new Discord.MessageActionRow()
            .addComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId(`abrirTs`)
                    .setEmoji(`962574461054373929`)
                    .setLabel(`Abrir ticket`)
                    .setStyle("PRIMARY")
                ], 
                [
                    new Discord.MessageButton()
                    .setCustomId(`eliminarTs`)
                    .setEmoji(`963298669623410688`)
                    .setLabel(`Eliminar ticket`)
                    .setStyle("DANGER")
                ]
            )

            int.message.delete()
            if(arrayTs.find(f=> f.id == int.channelId).publico || !miembro){
                arrayTs.forEach(async (objeto) => {
                    if(objeto.id == int.channelId){
                        objeto.cerrado = true
                        descripcion[0] = "<:candadoCerrado:962574398190145566>"
                        descripcion.pop()

                        embTicketCerrado
                        .setDescription(`Ticket de <@${objeto.miembroID}> cerrado por ${int.user}, ningún miembro del personal a atendió el ticket.`)
                        if(objeto.edits>=2){
                            int.channel.edit({parent: "785352540840525864"}).then(cp=>{
                                if(miembro != undefined){
                                    int.channel.permissionOverwrites.edit(objeto.miembroID, {"VIEW_CHANNEL": null, "SEND_MESSAGES": null})
                                }
                                int.channel.permissionOverwrites.edit("831669132607881236", {"VIEW_CHANNEL": null, "SEND_MESSAGES": null})

                                let enfriamiento = Math.floor((objeto.cooldown-Date.now()) / 1000)
                                embTicketCerrado.setFooter(`No he podido modificar el nombre ni la descripción del canal ya que ya se han modificado ambos 2 veces en menos de 10 minutos, se podrán modificar dentro de ${enfriamiento >= 60 ? `**${Math.floor(enfriamiento/60)}**:**${enfriamiento%60}** minutos.`: `**${enfriamiento}** segundos.`}`)
                                int.channel.send({embeds: [embTicketCerrado], components: [botonesCerrado]})
                            })
                        
                        }else{
                            int.channel.permissionOverwrites.edit("831669132607881236", {"VIEW_CHANNEL": null, "SEND_MESSAGES": null}).then(async () => setTimeout(async ()=>{
                                if(miembro != undefined){
                                    int.channel.permissionOverwrites.edit(objeto.miembroID, {"VIEW_CHANNEL": null, "SEND_MESSAGES": null})
                                }

                                int.channel.edit({name: `『🔒』ticket ${int.channel.name.match(/(\d+)/g).pop()} cerrado`, parent: "785352540840525864", topic: `${descripcion.join(" ").replace(".", " ").concat(" *cerrado*.")}`})

                                int.channel.send({embeds: [embTicketCerrado], components: [botonesCerrado]})
                                objeto.edits++
                            
                                if(objeto.edits >= 2){
                                    objeto.cooldown = Date.now() + 10*60000
                                    setTimeout(async ()=>{
                                        objeto.edits=0
                                        objeto.cooldown = false
                                    }, 10*60000)
                                }
                                await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})
                            }, 400))
                        }
                        await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})
                    }
                })

            }else{
                if(arrayTs.find(f=> f.id == int.channelId).valoracion == false){
                    int.channel.send({embeds: [embCargando], content: `<@${dataTs.tickets.find(f=> f.id == int.channelId).miembroID}>`}).then(ms=>{
                        ms.react("963478022369980517")
                        ms.react("963478099578728448")
                        ms.react("963478146089377872")
                        ms.react("963478173562052628")
                        ms.react("963478195498254387").then(tr=>{
                            ms.edit({embeds: [embReseña], components: [botonesReseña]})
                        })
                        let arrayTs = dataTs.tickets
                        arrayTs.forEach(async (objeto) => {
                            if(objeto.id == int.channelId){
                                objeto.msgValoracionID = ms.id
                                await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})
                            }
                        })
                    })
                }else{
                    arrayTs.forEach(async (objeto) => {
                        if(objeto.id == int.channelId){
                            embTicketCerrado
                            .setDescription(`Ticket de <@${objeto.miembroID}> cerrado de nuevo por ${int.user}.`)

                            objeto.cerrado = true
                            descripcion[0] = "<:candadoCerrado:962574398190145566>"
                            descripcion.pop()

                            if(objeto.edits>=2){
                                if(miembro != undefined){
                                    int.channel.permissionOverwrites.edit(objeto.miembroID, {"VIEW_CHANNEL": null, "SEND_MESSAGES": null})
                                }
                                int.channel.edit({parent: "785352540840525864"}).then(cp=>{
                                    let enfriamiento = Math.floor((objeto.cooldown-Date.now()) / 1000)
                                    embTicketCerrado.setFooter(`Discord no me permite modificar el nombre ni la descripción del canal ya que se han modificado ambos 2 veces en menos de 10 minutos, se podrán modificar dentro de ${enfriamiento >= 60 ? `${Math.floor(enfriamiento/60)}:${enfriamiento%60} minutos.`: `${enfriamiento} segundos.`}`)
                                    int.channel.send({embeds: [embTicketCerrado], components: [botonesCerrado]})
                                })

                            }else{
                                if(miembro != undefined){
                                    int.channel.permissionOverwrites.edit(objeto.miembroID, {"VIEW_CHANNEL": null, "SEND_MESSAGES": null})
                                }
                                int.channel.edit({name: `『🔒』ticket ${int.channel.name.match(/(\d+)/g).pop()} cerrado`, parent: "785352540840525864", topic: `${descripcion.join(" ").replace(".", " ").concat(" *cerrado*.")}`})
                                int.channel.send({embeds: [embTicketCerrado], components: [botonesCerrado]})
                                objeto.edits++
                            
                                if(objeto.edits >= 2){
                                    objeto.cooldown = Date.now() + 10*60000
                                    setTimeout(async ()=>{
                                        objeto.edits=0
                                        objeto.cooldown = false
                                    }, 10*60000)
                                }
                                await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})
                                
                            }
                        }
                    })
                }
            }
        }
        if(int.customId == "cancelarTs"){
            int.message.delete()
        }
        if(int.customId == "reseña"){
            let dataTs = await ticketsDB.findOne({_id: servidorID}), arrayMs = dataTs.miembros, enviada = false

            if(dataTs.tickets.find(f=> f.id == int.channelId).miembroID == int.user.id){
                if(dataTs.miembros.find(m=> m.id == int.user.id).reseñas.find(r=> r.ticketID == int.channelId).reseña == false){
                    const embEscribirReseña = new Discord.MessageEmbed()
                    .setTitle(`📝 Escribe una reseña`)
                    .setDescription(`Escribe una reseña sobre tu experiencia en este ticket aquí abajo, tienes **2** minutos para enviarla.`)
                    .setColor("#FFC300")
                    int.reply({ephemeral: true, embeds: [embEscribirReseña]})

                    int.channel.createMessageCollector({filter: u=> u.author.id == int.user.id, max: 1, time: 2*60000}).on("collect", ct =>{
                        setTimeout(()=>{
                            if(!enviada){
                                const embAcaboTiempo = new Discord.MessageEmbed()
                                .setTitle(`⏱️ Tiempo finalizado`)
                                .setDescription(`Se te ha agotado tu tiempo de espera para enviar tu reseña.`)
                                .setColor("YELLOW")
                                int.editReply({ephemeral: true, embeds: [embAcaboTiempo]})
                            }
                        }, 2*60000)

                        arrayMs.forEach(async (objeto) => {
                            if(objeto.id == int.user.id){
                                objeto.reseñas.forEach(async (objetoRes) => {
                                    if(objetoRes.ticketID == int.channelId){
                                        enviada = true
                                        objetoRes.reseña = ct.content
                                        await ticketsDB.findByIdAndUpdate(servidorID, {miembros: arrayMs})

                                        ct.delete()
                                        const embReseñaGuardada = new Discord.MessageEmbed()
                                        .setTitle(`<a:afirmativo:856966728806432778> Reseña guardada`)
                                        .setDescription(`Tu reseña sobre este ticket se ha guardado ${int.user}.`)
                                        .setColor("#00ff00")
                                        int.editReply({embeds: [embReseñaGuardada]})
                                        
                                    }
                                })
                            }
                        })
                    })

                }else{
                    const embYaResaña = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(`Ya has enviado una reseña no puedes enviar otra reseña.`)
                    .setColor(colorErr)
                    int.reply({ephemeral: true, embeds: [embYaResaña]})
                }

            }else{
                const embNoEresElMiembro = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`No eres el miembro que ha creado el ticket por lo tanto no puedes añadir una reseña por el.`)
                .setColor(colorErr)
                int.reply({ephemeral: true, embeds: [embNoEresElMiembro]})
            }
        }
        if(int.customId == "cancelarCyR"){
            let dataTs = await ticketsDB.findOne({_id: servidorID}), arrayTs = dataTs.tickets, ticket = arrayTs.find(f=> f.id==int.channelId)

            const embCancelarCyR = new Discord.MessageEmbed()
            .setTitle(`${emojiError} Calificación y reseña cancelada`)
            .setDescription(`${int.user} ha cancelado la calificación y reseña sobre el ticket y su cierre.`)
            .setColor(colorErr)
            arrayTs.forEach(async (objeto) => {
                if(objeto.id == int.channelId){
                    objeto.msgValoracionID = false
                    if(objeto.valoracion){
                        objeto.valoracion = false
                    }
                    await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})
                }
            })
            int.message.delete().then(ec=>{
                int.channel.send({embeds: [embCancelarCyR]})
            })

            const botonCerrar = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId("cerrarTicket")
                .setEmoji("962574398190145566")
                .setLabel("Cerrar ticket")
                .setStyle("SECONDARY")
                .setDisabled(false)
            )
            await int.channel.messages.fetch(ticket.msgPrincipalID, {force: true}).then(msgPrincipal => {
                msgPrincipal.edit({components: [botonCerrar]})
            }).catch(c=> console.log(c))
        }
        if(int.customId == "finalizar"){
            let dataTs = await ticketsDB.findOne({_id: servidorID}), arrayTs = dataTs.tickets, arrayMs = dataTs.miembros, estrella = "<:estrella1:963478022369980517>", estrellaVacia = "<:estrellavacia:963486547179634729>", descripcion = int.channel.topic.split(" "), ticket = arrayTs.find(f=> f.id==int.channelId)

            arrayTs.forEach(async (objeto) => {
                if(objeto.id == int.channelId){
                    let personal = int.guild.members.cache.get(objeto.personalID)
                    objeto.cerrado = true
                    descripcion[0] = "<:candadoCerrado:962574398190145566>"
                    descripcion.pop()

                    const embCeradoForzado = new Discord.MessageEmbed()
                    .setTitle(`🚩 Ticket cerrado forzado`)
                    .setDescription(`El ticket se ha creador forzadamente por el dueño del servidor.`)
                    .setColor(int.guild.members.cache.get(int.guild.ownerId).displayHexColor)

                    const embReseñaEnviada = new Discord.MessageEmbed()
                    .setTitle(`<a:afirmativo:856966728806432778> Calificación y reseña enviada`)
                    .setDescription(`Se ha enviado la calificación y reseña de <@${objeto.miembroID}> al canal <#964599029927407678>`)
                    .setColor("#00ff00")

                    const embTicketCerrado = new Discord.MessageEmbed()
                    .setTitle(`<:candadoCerrado:962574398190145566> Ticket cerrado`)
                    .setColor(colorErr)

                    const botonesCerrado = new Discord.MessageActionRow()
                    .addComponents(
                        [
                            new Discord.MessageButton()
                            .setCustomId(`abrirTs`)
                            .setEmoji(`962574461054373929`)
                            .setLabel(`Abrir ticket`)
                            .setStyle("PRIMARY")
                        ], 
                        [
                            new Discord.MessageButton()
                            .setCustomId(`eliminarTs`)
                            .setEmoji(`963298669623410688`)
                            .setLabel(`Eliminar ticket`)
                            .setStyle("DANGER")
                        ]
                    )

                    if(objeto.valoracion == false){
                        const embAdvertencia1 = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(`Para cerrar este ticket debes de calificar la atención que te han brindado en este ticket, solo reacciona a los emojis de estrella, si solo reaccionas a 1 eso indica la menor calificación, mientras que si reaccionas a las 5 será la máxima calificación.`)
                        .setColor(colorErr)
                        if(int.user.id == objeto.miembroID) return int.reply({ephemeral: true, embeds: [embAdvertencia1]})

                        const embAdvertencia2 = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(`No eres el miembro que creo este ticket ni el dueño del servidor, no puedes finalizar esta acción sin antes el miembro no haber calificado la atención que recibió.`)
                        .setColor(colorErr)
                        if(int.user.id != objeto.miembroID && int.user.id != int.guild.ownerId) return int.reply({ephemeral: true, embeds: [embAdvertencia2]})

                        embTicketCerrado
                        .setDescription(`Ticket de <@${objeto.miembroID}> cerrado por ${int.user}.`)

                        objeto.msgValoracionID = false
                        int.message.delete()

                        arrayMs.forEach((objetoMs) => {
                            if(objetoMs.id == objeto.miembroID){
                                objetoMs.reseñas.forEach(async (objetoRes) => {
                                    if(objetoRes.ticketID == objeto.id){
                                        objetoRes.tiempo = Date.now()

                                        let miembro = int.guild.members.cache.get(objetoMs.id)
                                        int.channel.send({embeds: [embCeradoForzado]})

                                        if(objeto.edits>=2){
                                            int.channel.edit({parent: "785352540840525864"}).then(cp=>{
                                                if(miembro != undefined){
                                                    int.channel.permissionOverwrites.edit(objeto.miembroID, {"VIEW_CHANNEL": null, "SEND_MESSAGES": null})
                                                }
                                                let enfriamiento = Math.floor((objeto.cooldown-Date.now()) / 1000)
                                                embTicketCerrado.setFooter(`Discord no me permite modificar el nombre ni la descripción del canal ya que se han modificado ambos 2 veces en menos de 10 minutos, se podrán modificar dentro de ${enfriamiento >= 60 ? `${Math.floor(enfriamiento/60)}:${enfriamiento%60} minutos.`: `${enfriamiento} segundos.`}`)
                                                int.channel.send({embeds: [embTicketCerrado], components: [botonesCerrado]})
                                            })
                                        
                                            await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})

                                        }else{
                                            int.channel.edit({name: `『🔒』ticket ${int.channel.name.match(/(\d+)/g).pop()} cerrado`, parent: "785352540840525864", topic: `${descripcion.join(" ").replace(".", " ").concat(" *cerrado*.")}`}).then(tc=>{
                                                if(miembro != undefined){
                                                    int.channel.permissionOverwrites.edit(objeto.miembroID, {"VIEW_CHANNEL": null, "SEND_MESSAGES": null})
                                                }
                                            })
        
                                            int.channel.send({embeds: [embTicketCerrado], components: [botonesCerrado]})
                                            objeto.edits++

                                        
                                            if(objeto.edits >= 2){
                                                objeto.cooldown = Date.now() + 10*60000
                                                setTimeout(async ()=>{
                                                    objeto.edits=0
                                                    objeto.cooldown = false
                                                }, 10*60000)
                                            }
                                            await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})
                                        }
                                    }
                                })
                            }
                        })
                    
                    }else{    
                        let autor = await client.users.fetch(objeto.miembroID)
                        const embReseña = new Discord.MessageEmbed()
                        .setAuthor(autor.tag, autor.displayAvatarURL({dynamic: true}))
                        .setTitle(`<:goodreview:963227055615533166> Calificación y reseña`)
                        .setColor(int.guild.me.displayHexColor)
                        .setFooter(personal.nickname ? personal.nickname: personal.user.username, personal.displayAvatarURL({dynamic: true}))
                        .setTimestamp()

                        embTicketCerrado
                        .setDescription(`Ticket de <@${objeto.miembroID}> cerrado por ${int.user}.`)

                        objeto.msgValoracionID = false
                        int.message.delete()

                        arrayMs.forEach((objetoMs) => {
                            if(objetoMs.id == objeto.miembroID){
                                objetoMs.reseñas.forEach((objetoRes) => {
                                    if(objetoRes.ticketID == objeto.id){
                                        objetoRes.tiempo = Date.now()

                                        let calificaccion = []
                                        for(let i=0; i<5; i++){
                                            if(objetoRes.estrellas > i){
                                                calificaccion.push(estrella)
                                            }else{
                                                calificaccion.push(estrellaVacia)
                                            }
                                        }

                                        let miembro = int.guild.members.cache.get(objetoMs.id)
                                        embReseña
                                        .setDescription(`Calificación y reseña de **${autor.tag}** sobre la atención que recibió de **${personal.user.tag}** en el ticket número **${objetoRes.ticket}**.`)
                                        .addField(`⭐ **Calificación:**`, `${calificaccion.join(" ")}`)
                                        .addField(`📄 **Reseña:**`, `${objetoRes.reseña ? objetoRes.reseña: "Sin reseña"}`)
                                        int.guild.channels.cache.get("964599029927407678").send({embeds: [embReseña]}).then(async rs=> {
                                            int.channel.send({embeds: [embReseñaEnviada]})

                                            if(objeto.edits>=2){
                                                int.channel.edit({parent: "785352540840525864"}).then(cp=>{
                                                    if(miembro != undefined){
                                                        int.channel.permissionOverwrites.edit(objetoMs.id, {"VIEW_CHANNEL": null, "SEND_MESSAGES": null})
                                                    }
                                                    let enfriamiento = Math.floor((objeto.cooldown-Date.now()) / 1000)
                                                    embTicketCerrado.setFooter(`Discord no me permite modificar el nombre ni la descripción del canal ya que se han modificado ambos 2 veces en menos de 10 minutos, se podrán modificar dentro de ${enfriamiento >= 60 ? `${Math.floor(enfriamiento/60)}:${enfriamiento%60} minutos.`: `${enfriamiento} segundos.`}`)
                                                    int.channel.send({embeds: [embTicketCerrado], components: [botonesCerrado]})
                                                })
                                            
                                                await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})

                                            }else{
                                                int.channel.edit({name: `『🔒』ticket ${int.channel.name.match(/(\d+)/g).pop()} cerrado`, parent: "785352540840525864", topic: `${descripcion.join(" ").replace(".", " ").concat(" *cerrado*.")}`}).then(tc=>{
                                                    if(miembro != undefined){
                                                        int.channel.permissionOverwrites.edit(objetoMs.id, {"VIEW_CHANNEL": null, "SEND_MESSAGES": null})
                                                    }
                                                })
            
                                                int.channel.send({embeds: [embTicketCerrado], components: [botonesCerrado]})
                                                objeto.edits++

                                            
                                                if(objeto.edits >= 2){
                                                    objeto.cooldown = Date.now() + 10*60000
                                                    setTimeout(async ()=>{
                                                        objeto.edits=0
                                                        objeto.cooldown = false
                                                    }, 10*60000)
                                                }
                                                await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
        if(int.customId == "abrirTs"){
            let dataTs = await ticketsDB.findOne({_id: servidorID}), arrayTs = dataTs.tickets, descripcion = int.channel.topic.split(" "), ticket = arrayTs.find(f=> f.id==int.channelId)

            arrayTs.forEach(async (objetoTs) => {
                if(objetoTs.id == int.channelId){
                    let miembro = int.guild.members.cache.get(objetoTs.miembroID)
                    let personal = int.guild.members.cache.get(objetoTs.personalID)
                    const embAbierto = new Discord.MessageEmbed()
                    .setTitle(`<:candadoAbierto:962574461054373929> Ticket abierto`)
                    .setDescription(`Ticket de <@${objetoTs.miembroID}> abierto por ${int.user}.`)
                    .setColor("#00ff00")

                    descripcion[0] = "<:candadoAbierto:962574461054373929>"
                    descripcion.pop()
                    objetoTs.cerrado = false
                    if(objetoTs.publico){
                        int.message.delete()

                        if(objetoTs.edits>=2){
                            int.channel.edit({parent: "833120722695487518"}).then(cp=>{
                                if(miembro){
                                    int.channel.permissionOverwrites.edit(objetoTs.miembroID, {"VIEW_CHANNEL": true, "SEND_MESSAGES": true})
                                }
                                int.channel.permissionOverwrites.edit("831669132607881236", {"VIEW_CHANNEL": true, "SEND_MESSAGES": true})
                                
                                let enfriamiento = Math.floor((objetoTs.cooldown-Date.now()) / 1000)
                                embAbierto.setFooter(`Discord no me permite modificar el nombre ni la descripción del canal ya que se han modificado ambos 2 veces en menos de 10 minutos, se podrán modificar dentro de ${enfriamiento >= 60 ? `${Math.floor(enfriamiento/60)}:${enfriamiento%60} minutos.`: `${enfriamiento} segundos.`}`)
                                int.channel.send({embeds: [embAbierto]})
                            })
                        
                        }else{
                            int.channel.edit({name: `『🎫』ticket ${int.channel.name.match(/(\d+)/g).pop()}`, parent: "833120722695487518", topic: `${descripcion.join(" ").replace(".", " ").concat(" *abierto.*")}`}).then(async () => {
                                if(miembro){
                                    int.channel.permissionOverwrites.edit(objetoTs.miembroID, {"VIEW_CHANNEL": true, "SEND_MESSAGES": true})
                                }
                                int.channel.permissionOverwrites.edit("831669132607881236", {"VIEW_CHANNEL": true, "SEND_MESSAGES": true})
                            
                                int.channel.send({embeds: [embAbierto]})
                                objetoTs.edits++
                            
                                if(objetoTs.edits >= 2){
                                    objetoTs.cooldown = Date.now() + 10*60000
                                    setTimeout(async ()=>{
                                        objetoTs.edits=0
                                        objetoTs.cooldown = false
                                    }, 10*60000)
                                }
                                await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})
                            })
                        }

                    }else{
                        int.message.delete()
                        if(objetoTs.edits>=2){
                            if(miembro){
                                int.channel.permissionOverwrites.edit(objetoTs.miembroID, {"VIEW_CHANNEL": true, "SEND_MESSAGES": true})
                            }
                            int.channel.edit({parent: "833120722695487518"}).then(cp=>{
                                let enfriamiento = Math.floor((objetoTs.cooldown-Date.now()) / 1000)
                                embAbierto.setFooter(`Discord no me permite modificar el nombre ni la descripción del canal ya que se han modificado ambos 2 veces en menos de 10 minutos, se podrán modificar dentro de ${enfriamiento >= 60 ? `${Math.floor(enfriamiento/60)}:${enfriamiento%60} minutos.`: `${enfriamiento} segundos.`}`)
                                int.channel.send({embeds: [embAbierto]})
                            })
                        
                        }else{
                            if(miembro){
                                int.channel.permissionOverwrites.edit(objetoTs.miembroID, {"VIEW_CHANNEL": true, "SEND_MESSAGES": true})
                            }
                            int.channel.edit({name: `『🎫』ticket ${int.channel.name.match(/(\d+)/g).pop()}`, parent: "833120722695487518", topic: `${descripcion.join(" ").replace(".", " ").concat(" *abierto.*")}`})

                            int.channel.send({embeds: [embAbierto]})
                            objetoTs.edits++
                        
                            if(objetoTs.edits+1 >= 2){
                                objetoTs.cooldown = Date.now() + 10*60000
                                setTimeout(async ()=>{
                                    objetoTs.edits=0
                                    objetoTs.cooldown = false
                                }, 10*60000)
                            }
                            await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})
                        }
                    }
                }
            })

            const botonCerrar = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId("cerrarTicket")
                .setEmoji("962574398190145566")
                .setLabel("Cerrar ticket")
                .setStyle("SECONDARY")
                .setDisabled(false)
            )
            await int.channel.messages.fetch(ticket.msgPrincipalID, {force: true}).then(msgPrincipal => {
                msgPrincipal.edit({components: [botonCerrar]})
            }).catch(c=> console.log(c))
        }
        if(int.customId == "eliminarTs"){
            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojiError} Error`)
            .setDescription(`Solo los administradores del servidor pueden eliminar el ticket.`)
            .setColor(colorErr)
            if(!int.member.permissions.has("ADMINISTRATOR")) return int.reply({ephemeral: true, embeds: [embError1]})

            const embEliminarTicket = new Discord.MessageEmbed()
            .setTitle(`${emojiError} Eliminar ticket`)
            .setDescription(`¿Está seguro ${int.user} de que desea eliminar este ticket?`)
            .setColor(colorErr)

            const botones = new Discord.MessageActionRow()
            .addComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("confirmarElTs")
                    .setEmoji("856966728806432778")
                    .setLabel("Confirmar")
                    .setStyle("SUCCESS")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("cancelarElTs")
                    .setEmoji(emojiError)
                    .setLabel("Cancelar")
                    .setStyle("DANGER")
                ]
            )
            
            int.update({embeds: [embEliminarTicket], components: [botones]})
        }
        if(int.customId == "confirmarElTs"){
            const embEliminar = new Discord.MessageEmbed()
            .setTitle(`${emojiError} Eliminando ticket`)
            .setDescription(`Se eliminara el ticket en **10** segundos.`)
            .setColor(colorErr)
            int.message.delete()
            int.channel.send({embeds: [embEliminar]}).then(td=> {
                setTimeout(()=>{
                    int.channel.delete()
                }, 10000)
            })
        }
        if(int.customId == "cancelarElTs"){
            int.message.delete()
        }
    }

    if(int.isSelectMenu()){
        if(int.customId == "genero"){
            let valores = ["mujer","hombre"]
            let roles = ["828720344869240832", "828720347246624769"]
            for(let i=0; i<valores.length; i++){
                if(int.values[0] == valores[i]){
                    if(int.member.roles.cache.has(roles[i])){
                        const embYaLoTiene = new Discord.MessageEmbed()
                        .setAuthor("➖ Rol removido")
                        .setDescription(`Te he removido el rol <@&${roles[i]}>.`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        int.member.roles.remove(roles[i])
                        return int.reply({embeds: [embYaLoTiene], ephemeral: true})
                    }
    
                    for(let e=0; e<roles.length; e++){
                        if(int.member.roles.cache.has(roles[e])){
                            const embRemoveYAdd = new Discord.MessageEmbed()
                            .setAuthor("🔃 Intercambio de roles")
                            .setDescription(`Solo puedes tener un rol de **Genero** por lo tanto te he eliminado el rol <@&${roles[e]}> y te he agregado el rol <@&${roles[i]}> el cual has elegido ahora.`)
                            .setColor(int.guild.me. displayHexColor)
                            .setTimestamp()
                            int.member.roles.remove(roles[e])
                            int.member.roles.add(roles[i])
    
                            return int.reply({embeds: [embRemoveYAdd], ephemeral: true})
                        }
                    }
    
                    const embAddRol = new Discord.MessageEmbed()
                    .setTitle("➕ Rol agregado")
                    .setDescription(`Te he agregado el rol <@&${roles[i]}>.`)
                    .setColor("#00ff00")
                    int.reply({embeds: [embAddRol], ephemeral: true})
                    int.member.roles.add(roles[i])
                }
            }
        }

        if(int.customId == "edad"){
            let valores = ["-18","+18"]
            let roles = ["828720200924790834","828720340719894579"]
            for(let i=0; i<valores.length; i++){
                if(int.values[0] == valores[i]){
                    if(int.member.roles.cache.has(roles[i])){
                        const embYaLoTiene = new Discord.MessageEmbed()
                        .setAuthor("➖ Rol removido")
                        .setDescription(`Te he removido el rol <@&${roles[i]}>.`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        int.member.roles.remove(roles[i])
                        return int.reply({embeds: [embYaLoTiene], ephemeral: true})
                    }
    
                    for(let e=0; e<roles.length; e++){
                        if(int.member.roles.cache.has(roles[e])){
                            const embRemoveYAdd = new Discord.MessageEmbed()
                            .setAuthor("🔃 Intercambio de roles")
                            .setDescription(`Solo puedes tener un rol de **Edad** por lo tanto te he eliminado el rol <@&${roles[e]}> y te he agregado el rol <@&${roles[i]}> el cual has elegido ahora.`)
                            .setColor(int.guild.me. displayHexColor)
                            .setTimestamp()
                            int.member.roles.remove(roles[e])
                            int.member.roles.add(roles[i])
        
                            return int.reply({embeds: [embRemoveYAdd], ephemeral: true})
                        }
                    }
    
                    const embAddRol = new Discord.MessageEmbed()
                    .setTitle("➕ Rol agregado")
                    .setDescription(`Te he agregado el rol <@&${roles[i]}>.`)
                    .setColor("#00ff00")
                    int.reply({embeds: [embAddRol], ephemeral: true})
                    int.member.roles.add(roles[i])
                }
            }
        }

        if(int.customId == "videojuegos"){
            let valores = ["fornite","minecraft","free","roblox","GTA","amongus"]
            let roles = ["886331637690953729","886331642074005545","886331630690631691", "885005724307054652","886331626643152906", "886331634272587806"]
            for(let i=0; i<valores.length; i++){
                if(int.values[0] == valores[i]){
                    if(int.member.roles.cache.has(roles[i])){
                        const embYaLoTiene = new Discord.MessageEmbed()
                        .setAuthor("➖ Rol removido")
                        .setDescription(`Te he removido el rol <@&${roles[i]}>.`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        int.member.roles.remove(roles[i])
                        return int.reply({embeds: [embYaLoTiene], ephemeral: true})
                    }
    
    
                    const embAddRol = new Discord.MessageEmbed()
                    .setTitle("➕ Rol agregado")
                    .setDescription(`Te he agregado el rol <@&${roles[i]}>.`)
                    .setColor("#00ff00")
                    int.reply({embeds: [embAddRol], ephemeral: true})
                    int.member.roles.add(roles[i])
                }
            }
        }

        if(int.customId == "colores"){
            let valores = ["negro","cafe","naranja","rojo","rosa","morado","azul","celeste","cian","verde","lima","amarillo","gris","blanco"]
            let roles = ["825913849504333874","825913858446327838","825913837944438815","823639766226436146","823639778926395393", "825913846571991100", "823639775499386881", "825913860992270347", "825913843645546506","823639769300467724", "825913834803560481","825913840981901312", "825913855392743444","825913852654780477"]
            for(let i=0; i<valores.length; i++){
                if(int.values[0] == valores[i]){
                    if(int.member.roles.cache.has(roles[i])){
                        const embYaLoTiene = new Discord.MessageEmbed()
                        .setAuthor("➖ Rol removido")
                        .setDescription(`Te he removido el rol <@&${roles[i]}>.`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        int.member.roles.remove(roles[i])
                        return int.reply({embeds: [embYaLoTiene], ephemeral: true})
                    }
    
                    for(let e=0; e<roles.length; e++){
                        if(int.member.roles.cache.has(roles[e])){
                            const embRemoveYAdd = new Discord.MessageEmbed()
                            .setAuthor("🔃 Intercambio de roles")
                            .setDescription(`Solo puedes tener un rol de **Colores** por lo tanto te he eliminado el rol <@&${roles[e]}> y te he agregado el rol <@&${roles[i]}> el cual has elegido ahora.`)
                            .setColor(int.guild.me. displayHexColor)
                            .setTimestamp()
                            int.member.roles.remove(roles[e])
                            int.member.roles.add(roles[i])
        
                            return int.reply({embeds: [embRemoveYAdd], ephemeral: true})
                        }
                    }
    
                    const embAddRol = new Discord.MessageEmbed()
                    .setTitle("➕ Rol agregado")
                    .setDescription(`Te he agregado el rol <@&${roles[i]}>.`)
                    .setColor("#00ff00")
                    int.reply({embeds: [embAddRol], ephemeral: true})
                    int.member.roles.add(roles[i])
                }
            }
        }

        if(int.customId == "notificaciones"){
            let valores = ["anuncio","alianza","sorteo","encuesta","evento","sugerencia","postulacion","revivir"]
            let roles = ["840704358949584926","840704364158910475","840704370387451965","840704372911505418","915015715239637002","840704367467954247","840704375190061076","850932923573338162"]
            for(let i=0; i<valores.length; i++){
                if(int.values[0] == valores[i]){
                    if(int.member.roles.cache.has(roles[i])){
                        const embYaLoTiene = new Discord.MessageEmbed()
                        .setAuthor("➖ Rol removido")
                        .setDescription(`Te he removido el rol <@&${roles[i]}>.`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        int.member.roles.remove(roles[i])
                        return int.reply({embeds: [embYaLoTiene], ephemeral: true})
                    }
    
    
                    const embAddRol = new Discord.MessageEmbed()
                    .setTitle("➕ Rol agregado")
                    .setDescription(`Te he agregado el rol <@&${roles[i]}>.`)
                    .setColor("#00ff00")
                    int.reply({embeds: [embAddRol], ephemeral: true})
                    int.member.roles.add(roles[i])
                }
            }
        }

        if(int.customId == "información_jaja"){
            let dataCol = await colaboradoresDB.findById(servidorID), colaboradores = [], money = "<:money:832307999871598602>"
            for(c in dataCol.colaboradores){
                if(dataCol.colaboradores[c].colaborador){
                    colaboradores.push(`**<#${dataCol.colaboradores[c].canalID}>**: canal del colaborador **${int.guild.members.cache.get(dataCol.colaboradores[c].id).user.tag}**.`)
                }
            }
            let infos = [
                {
                    valor: `servidor`,
                    color: int.guild.me.displayHexColor,
                    miniatura: int.guild.iconURL({dynamic: true, format: "png"||"gif", size: 1024}),
                    titulo: `${int.guild.name}`, 
                    descripcion: `Es un servidor enfocado en la promoción, creado el <t:${Math.floor(int.guild.createdAt/1000)}:F> aquí puedes promocionarte, dar a conocer tu contenido, trabajo, redes sociales a mas personas, además de eso puedes charlar con los demás miembros del servidor, hacer amigos, entretenerte con los diversos bots de entretenimiento que tenemos, entre otras cosas.\n\n**¡Disfruta del servidor!**\n*Gracias por estar aquí*`
                },
                {
                    valor: `categoría-importante`,
                    color: `#F4F2F2`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924982802288660/importante.png`,
                    titulo: `💠 Importante`, 
                    descripcion: `Categoría: **<#823655193886851143>**: en esta categoría hay canales importantes que debes de revisar.\n\n> **<#823343749039259648>**: en este canal están las reglas del servidor importante que las leas y las respetes para no tener que sancionarte. \n> .\n> **<#826205120173310032>**: en este canal se publican **anuncios**, **eventos**, **sorteos**, **encuestas** y el estado de las **postulaciones** del personal del servidor, si no te quieres perder de ninguno de los anteriores y ser notificado cuando haya un rol que te notifica por cada uno puedes obtener los roles en el canal <#823639152922460170>, si quieres saber más sobre esos roles selecciona la opción **🔔 Roles de ping** en este menú.\n> .\n> **<#837563299058679828>**: en este canal se da la bienvenida a cada nuevo miembro con un mensaje automático del bot <@843185929002025030>.\n> .\n> **<#823639152922460170>**: en este canal puedes obtener roles con solo dar un clic, roles que cambian el color de tu nombre en el servidor, roles de notificaciones los cuales te notifican cuando hay una nueva actualización sobre algún tema como **anuncios**, **postulaciones**, **sorteos**, **eventos**, etc.`
                },
                {
                    valor: `categoría-colaboradores`,
                    color: `#6B6B6B`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924981506248734/colaborador.png`,
                    titulo: `💎 Colaboradores`, 
                    descripcion: `Categoría **<#913490278529261619>**:  en esta categoría encontrarás canales para los colaboradores del servidor, cada colaborador tendrá su canal en el cual podrá modificar el nombre y descripción de su canal cuantas veces quiera, publicar su contenido utilizando @everyone o @here una vez por día.\n\n${colaboradores.length==0 ? "": "**Canales de los colaboradores actuales:**\n> "+colaboradores.join("\n> .\n> ")}\n> **¿Quieres ser colaborador?** selecciona la opción **:trophy: Roles exclusivos** en este menú para obtener información sobre ello.`
                },
                {
                    valor: `categoría-promociones-vip`,
                    color: `#643602`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924983553077298/VIP.png`,
                    titulo: `✨ Promociones VIP`, 
                    descripcion: `Categoría **<#827295364167237644>**: en esta categoría hay canales de promoción exclusivos los cuales solo si tienes cierto rol puedes acceder a ellos.\n\n> **<#826193847943037018>**: a este canal de promoción tienen acceso los miembros con el rol <@&826197551904325712>, en el pueden publicar o promocionar su contenido cada **6** horas y utilizar @everyone o @here pero solo **2** días a la semana y **1** vez por día.\n> .\n> **<#870884933529378846>**: a este canal de promoción solo tienen acceso los miembros que tienen el rol <@&826197378229993503>, en el canal pueden publicar o promocionar su contenido cada **4** horas.\n\n**¿Quieres saber como conseguir esos roles?**, selecciona la opción **🏆 Roles exclusivos** en el menú de información.`
                },
                {
                    valor: `categoría-promociónate`,
                    color: `#F28204`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971925160049381437/promocionate.png`,
                    titulo: `📣 Promociónate`,
                    descripcion: `Categoría **<#785729364288339978>**: en esta categoría están todos los canales en los que puedes hacer promoción de tu servidor, bot, redes sociales, webs y mas contenido, sin necesidad de tener algún rol o permiso.\n\n> **<#836315643070251008>** en este canal puedes promocionar todo tipo de contenido.\n> .\n> **<#823381769750577163>**: en este canal solo puedes promocionar servidores de **Discord** excepto si es un servidor **NSFW** o **+18**.\n> .\n> **<#823961526297165845>**: en este canal solo puedes promocionar videos de **YouTube** o canales del mismo.\n> .\n> **<#823381980389310464>**: en este canal solo puedes promocionar contenido de **Twitch**, directos y canales.\n> .\n> **<#827295990360965153>**: en este canal solo puedes promocionar contenido de **TikTok**, TikToks, cuentas, etc.\n> .\n> **<#823381924344758313>**: en este canal solo puedes promocionar contenido de **Twitter** como link de una cuenta, etc.\n> .\n> **<#823382007391584276>**: en este canal solo se puede promocionar contenido de **Instagram**, tu cuenta, enlaces, etc.\n> .\n> **<#833750678978822154>**: en este canal solo se puede promocionar **Páginas web**.`
                },
                {
                    valor: `categoría-general`,
                    color: `#F2D904`,
                    miniatura: ``,
                    titulo: `🧭 General`,
                    descripcion: `Categoría **<#837063475552321546>**: en esta categoría encontrarás canales en los que podrás interactuar, charlar, utilizar comandos de bots, ver memes o enviar y mas.\n\n> **<#773404850972524615>**: en este canal puedes hablar con los demás miembros del servidor, de cualquier tema no sensible.\n> .\n> **<#845396662930112533>**: en este canal puedes publicar tus memes, si tus memes tienen buena cantidad de raciones positivas puedes obtener el rol <@&912888572401561620>.\n> .\n> **<#914537165269110804>**: en este canal puedes publicar imágenes o videos del tema que quieras excepto contenido explícito o NSFW.\n> .\n> **<#978791620579299398>**: en este canal puedes hablar con otros miembros de otros servidores gracias al bot <@959204525678424064> el cual une a varios canales de otros servidores en un mismo canal.\n> . **<#834956208112795668>**: este canal es para usar los comandos de los bots que hay en el servidor.\n> .\n> **<#862803602107400232>**: en este canal lo puedes usar para desahogarte insultando, solo en el canal si lo haces en otro canal serás sancionado.\n> .\n> **<#979098277163192400>**: en este canal puedes encontrar imágenes, gifs, vídeos de contenido **NSFW** y tú mismo también puedes publicar dicho contenido.`
                },
                {
                    valor: `categoría-user-x-user`,
                    color: `#D5F204`,
                    miniatura: ``,
                    titulo: `👥 User x user`,
                    descripcion: `Categoría **<#773249398431809587>**: en esta categoría encontrarás canales para hacer join x join que es como decir si te unes me uno, también encontrarás otro tipos de canales.\n\n> **<#826203792788815894>**: en este canal puedes publicar que haces **j4j**.\n> .\n> **<#831677248611418152>**: en este canal puedes publicar **sub x sub** que significa que buscas a alguien que se subscriba a tu canal y tu al suyo.\n> .\n> **<#836447269573099540>**: en este canal puedes publicar **FxF** *(follow por follow)* de una red social.\n> .\n> **<#827296844454690816>**: en este canal puedes encontrar personas que quieran hacer alianzas.`
                },
                {
                    valor: `categoría-entretenimiento`,
                    color: `#AAF204`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924981984428133/entretenimiento.png`,
                    titulo: `🎮 Entretenimiento`,
                    descripcion: `Categoría **<#834865948837806110>**: en esta categoría encontrarás varios canales en los cuales puedes usar un bot para entretenerte.\n\n> **<#834893418403725342>**: en este canal puedes usar el bot **<@292953664492929025>** que es el bot de economía.\n> .\n> **<#834898232760729680>**: en este canal podrás usar a **<@429457053791158281>** otro bot que tiene una economía pero esta es mundial la cual funciona en cualquier servidor en el que este el bot.\n> .\n> **<#840272810249027604>**: en este canal puedes usar el bot **<@543567770579894272>** es un bot que tienen muchos mini juegos.\n> .\n> **<#838495529046507570>**: en este canal podrás usar a **<@356065937318871041>** un bot que adivina en que personaje famoso estas pensando por medio de preguntas.\n> .\n> **<#866328027892940801>**: en este canal podrás usar a **<@716390085896962058>**, un bot de **Pokemon**.\n> .\n> **<#942980086817239050>**: en este canal podrás usar a **<@715906723982082139>**, un bot de preguntas generales.`
                },
                {
                    valor: `categoría-audio`,
                    color: `#41F204`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924981263003648/audio.png`,
                    titulo: `🔊 Audio`,
                    descripcion: `Categoría **<#773249398431809588>**: en esta categoría encontrarás canales de voz en los que te puedes reunir con tus amigos para charlar o escuchar música de los bots.\n\n> **<#836671054537424906>**: en este canal puedes poner el nombre la música que quieras escuchar, el bot **<@547905866255433758>** pondrá la música en el canal de voz en el que estás.\n> .\n> **<#773250082552283208>**: este canal es un canal de voz, puedes unirte a el para escuchar música.\n> .\n> **<#828789627082637333>**: este canal es un canal de voz, en el puedes unirte con tus amigos o con un miembro del servidor para hablar.\n> .\n> **<#906925232265265163>**: este canal de voz es para el bot <@830530156048285716> el cual estará reproduciendo **24/7** música.`
                },
                {
                    valor: `categoría-registros`,
                    color: `#0AA105`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971927633757601814/registro.png`,
                    titulo: `📝 Registros`,
                    descripcion: `Categoría **<#881978653452423188>**: en esta categoría se encuentran canales que registran acciones en el servidor.\n\n> **<#833043103048925276>**: en este canal se registra cuando un miembro sube de nivel.\n> .\n> **<#858783283567394826>**: en este canal se registran las sanciones que tienen los miembros.\n> .\n> **<#824462775542743090>**: en este canal se registran los usuarios que han sido invitados por un usuario, la cantidad de usuarios invitados, etc.\n> .\n> **<#964599029927407678>**: en este canal se registra la calificaccion y reseña de cada ticket.`
                },
                {
                    valor: `categoría-soporte`,
                    color: `#05D55A`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971925159789350912/soporte.png`,
                    titulo: `🔰 Soporte`,
                    descripcion: `Categoría **<#833120722695487518>**: en esta categoría hay más canales importantes en los que puedes obtener soporte o información.\n\n> **<#830165896743223327>**: en este canal puedes crear un Ticket, **¿Qué es un ticket?** es un canal creado para ti y los miembros de soporte del servidor en donde puedes resolver dudas con ellos, reportar usuario, problemas, pedir ayuda, reclamar un rol, etc.\n> .\n> **<#848992769245577256>**: en este canal esta nuestra plantilla de presentación por si piensas presentar el servidor a un amigo.\n> .\n> **<#840364744228995092>**: este canal es en el que te encuentras ahora, en el podrás obtener información casi de cualquier canal, rol, o sistema del servidor.`
                },
                {
                    valor: `categoría-estadísticas`,
                    color: `#05D5AF`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924982215094323/estadisticas.png`,
                    titulo: `📊 Estadísticas`,
                    descripcion: `Categoría **<#823349416882339921>**: en esta categoría encontrarás canales que muestran datos del servidor.\n\n> **<#823349420106973204>**: este canal de voz muestra la cantidad de miembros totales en el servidor.\n> .\n> **<#823349423349301318>**: este canal de voz muestra solo los miembros que no son bots.\n> .\n> **<#823349426264997919>**: este canal de voz muestra en su nombre la cantidad de bots que hay en el servidor.`
                },
                {
                    valor: `roles-exclusivos`,
                    color: `#0590D5`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971912850186596382/Roles_Exclusivos.png`,
                    titulo: `🏆 Roles exclusivos`,
                    descripcion: `> **<@&865666783217713162>**: al obtener este rol consigues un canal exclusivo en la categoría **<#913490278529261619>** en el cual solo tu lo usaras, podrás publicar contenido cada **4** horas pero solo **1** vez al día con el ping @everyone o @here, podrás gestionar el canal, cambiarle de nombre, editar la descripción, tambien obtendrás un rol personalizado si lo deseas, el rol tendrá un nombre y color personalizado.\n\n> **Para obtener el rol solo hay una forma**\n> **1.** Donar **4** dólares vía [PayPal](https://www.paypal.com/paypalme/srvers).\nUna vez que hayas donado crea un ticket en el canal <#830165896743223327> reclama el rol y los beneficios.\n\n\n> **<@&826197551904325712>**: este rol te da acceso al canal <#826193847943037018> canal en el cual podrás publicar tu promoción cada **6** horas y podrás usar **2** veces a la semana el ping @everyone o @here **Martes** y **Viernes** en tu promoción el día, además que obtendrás un rol personalizado si lo deseas, el rol tendrá un nombre y color personalizado.\n\n> **Para obtener el rol hay 5 formas:**\n> **1. Invitar a **20** miembros al servidor**, para ver la cantidad de invitaciones que has hecho ejecuta el comando de barra diagonal \`\`/información miembro\`\` en el canal <#834956208112795668>, el rol se te será removido cuando los miembros que invitaste se vallan del servidor.\n> **2. Pagar 3 dólares por [PayPal](https://www.paypal.com/paypalme/srvers)**, para hacerlo abre un ticket en <#830165896743223327> o habla con <@717420870267830382>, el rol te durara **2** meses.\n> **3. Comprar el rol en economía**, en el canal <#834893418403725342>.\n> **4. Boostear el servidor o mejorarlo**.\n> **5. Ganarse el rol en un sorteo en el canal** <#826205120173310032>, *no hacemos con frecuencia sorteos de roles*.\nPara resolver cualquier duda o reclamar el rol y los beneficios abre un ticket en el canal <#830165896743223327>.`
                },
                {
                    valor: `roles-personales`,
                    color: `#0551D5`,
                    miniatura: ``,
                    titulo: `🧑 Roles personales`,
                    descripcion: `> **<@&823372926707171358>:** Este rol es el que se te otorga automáticamente al entrar al servidor.\n> **<@&828720340719894579>,<@&828720200924790834>**: Con estos roles determinas tu edad edentro del servidor.\n\n> **<@&828720344869240832>,<@&828720347246624769>**: Con estos roles determinas tu genero dentro del servidor.\n\n> **<@&886331637690953729>, <@&886331642074005545>, <@&886331630690631691>, <@&885005724307054652>, <@&886331626643152906>, <@&886331634272587806>**: Estos roles por ahora no tienen alguna utilidad en el servidor solo son para determinar los videojuegos que te gustan.\nTodos los roles anteriores los puedes obtener en el canal <#823639152922460170>.`
                },
                {
                    valor: `roles-ping`,
                    color: `#4D05D5`,
                    miniatura: `https://media.discordapp.net/attachments/842856076009144381/879941892123533322/notificacion.png?width=480&height=480`,
                    titulo: `🔔 Roles de ping`,
                    descripcion: `> **<@&850932923573338162>**: Este rol te notificará cuando se necesite **revivir el canal <#773404850972524615>**.\n> .\n> **<@&840704358949584926>**: Este rol te notificará cuando haya un nuevo **anuncio** en el canal <#826205120173310032>.\n> .\n> **<@&840704364158910475>**: Este rol te notificará cuando se haya echo una **alianza** con un servidor grande en el canal <#826863938057797633>.\n> .\n> **<@&840704367467954247>**: Este rol te notificará cuando haya un nueva **sugerencia** en el canal <#828300239488024587>.\n> .\n> **<@&840704372911505418>**: Este rol te notificará cuando haya una nueva **encuesta** en el canal <#826205120173310032>.\n> .\n> **<@&840704370387451965>**: Este rol te notificará cuando haya un nuevo **sorteo** en el canal <#826205120173310032>.\n> .\n> **<@&840704375190061076>**: Este rol te notificará cuando este activa alguna **postulación** a algún rol en el canal <#826205120173310032>.\n\nEstos puedes obtener estos roles en el canal <#823639152922460170>.`
                },
                {
                    valor: `roles-nivel`,
                    color: `#9905D5`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924983066533908/nivel.png`,
                    titulo: `🎖️ Roles de nivel`,
                    descripcion: `> **<@&971515126144442448>\n> <@&971515118837956699>\n> <@&971515112567476354>\n> <@&971515101502902283>\n> <@&891446820851564584>\n> <@&891446815700967434>\n> <@&876274137239265340>\n> <@&876274096990724097>\n> <@&876273903452975134>\n> <@&876273805494988821>\n> <@&838498329650003969>\n> <@&838498326512140329>\n> <@&831671377396367360>\n> <@&831671368776024104>**\n> Estos roles se te otorgan automáticamente conforme aumentes de nivel en el servidor, por ahora no tienen ninguna utilidad ni ventaja solo determinan tu nivel.`
                },
                {
                    valor: `roles-color`,
                    color: `#CC05D5`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924981728563260/colores.png`,
                    titulo: `🌈 Roles de color`,
                    descripcion: `> **<@&825913849504333874>**\n> **<@&825913855392743444>**\n> **<@&825913858446327838>**\n> **<@&825913837944438815>**\n> **<@&823639766226436146>**\n> **<@&823639778926395393>**\n> **<@&825913846571991100>**\n> **<@&823639775499386881>**\n> **<@&825913860992270347>**\n> **<@&825913843645546506>**\n> **<@&823639769300467724>**\n> **<@&825913834803560481>**\n> **<@&825913840981901312>**\n> **<@&825913852654780477>**\n> Estos roles te permiten cambiar el color de tu nombre dentro del servidor solo ve al canal <#823639152922460170> para obtener uno de ellos y cambiar el color de tu nombre.`
                },
                {
                    valor: `roles-economía`,
                    color: `#D50589`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971924982483546142/economia.png`,
                    titulo: `💸 Roles de economía`,
                    descripcion: `Rol y su paga:\n> **<@&880110963955740742>**: ${money} **2,000** cada **1** hora.\n> **<@&885005987751297054>**: ${money} **6,000** cada **1** hora.\n> **<@&880880076072300656>**: ${money} **18,000** cada **2** horas.\n> **<@&885005729495400448>**: ${money} **55,000** cada **2** horas.\n> **<@&885304820951580693>**: ${money} **171,000** cada **3** horas.\n> **<@&885006286809333760>**: ${money} **533,000** cada **3** horas.\n> **<@&885004466246516756>**: ${money} **1,726,000** cada **4** horas.\n> **<@&885005037091291166>**: ${money} **5,695,000** cada **4** horas.\n> **<@&886330270293315624>**: ${money} **19,135,000** cada **5** horas.\n> **<@&886330276207296652>**: ${money} **65,441,000** cada **5** horas.\n> **<@&886330280506454057>**: ${money} **227,734,000** cada **6** horas.\n> **<@&864525011423461376>**: ${money} **806,178,000** cada **6** horas.\n> **<@&885005727129808906>**: ${money} **2,902,240,000** cada **7** horas.\n> **<@&880110972365324288>**: ${money} **8,000,000,000** cada **7** horas.\n> Estos roles de economía los puedes obtener comprando items en la tienda del sistema de economía del bot **<@292953664492929025>** en el canal <#834893418403725342>.`
                },
                {
                    valor: `roles-personal`,
                    color: `#F00505`,
                    miniatura: `https://cdn.discordapp.com/attachments/901313790765854720/971925159789350912/soporte.png`,
                    titulo: `👮 Roles del personal`,
                    descripcion: `> Los miembros con el rol **<@&887444598715219999>** son los miembros del personal del servidor, los cuales pueden tener  uno de los siguientes roles que determinan su rango.\n\n> **<@&896039467046023169>**: Los miembros con este rol son los que se encargan exclusivamente de hacer **alianzas** para el servidor.\n\n> **<@&831669132607881236>**: Los miembros que tienen este rol son los que resuelven las dudas de los miembros, ayudan a los **moderadores**, **administradores**, **creadores**, responden **Tickets**, entre otras acciones.\n\n> **<@&773271945894035486>**: Los miembros con este rol mayor mente se encargan de **moderar**, sancionar a miembros que no respetan las reglas, mantener el servidor en orden, etc.\n\n> **<@&847302489732153354>**: Los miembros con este rol se encargan de revisar verificar si todo funciona bien, si los bots funcionan, si los moderadores están realizando las tareas correctamente, si los ayudantes están realizando sus tareas correctamente, brindar **información** a los moderadores, ayudantes y usuarios, realizar acciones de moderadores o de ayudantes, etc.\n\n> **<@&907807597011279923>**: Los miembros con este rol pueden realizar todas las acciones que pueden hacer los miembros con los roles anteriores y tomar decisiones importantes en caso de que no este disponible el dueño.\n\n*Para mas información de como ser un ayudante o cazador de alianzas abre un ticket en <#830165896743223327>.*`
                },
                {
                    valor: `otros-roles`,
                    color: `#F04C05`,
                    miniatura: ``,
                    titulo: `♻️ Otros roles`,
                    descripcion: `> **<@&941731411684122625>**: Este rol es el rol que se le otorga a los miembros con los que hacemos **afiliaciones**.\n> .\n> **<@&895394175481159680>**: Este rol es el rol que se le otorga a los miembros con los que hacemos **alianzas**.\n> .\n> **<@&946139081367240714>**: Este rol se le otorga a los miembros que han echo una sugerencia y su sugerencia a sido **implementada** en el servidor.\n> .\n> **<@&830260561044176896>**: Este rol se le otorga a los miembros que han echo una sugerencia y su sugerencia a sido **aprobada** para ser publicada en el canal <#828300239488024587>.\n> .\n> **<@&830260566861545492>**: Este rol se le otorga a todos los **exstaffs** que tuvieron el rango moderador en adelante.\n> .\n> **<@&830260549098405935>** Este rol se le otorga a los miembros que son enviados a la **cárcel**, por alguna acción mala que han echo.`
                },
                {
                    valor: `bot-servidor`,
                    color: int.guild.me.displayHexColor,
                    miniatura: client.user.displayAvatarURL({size: 1024}),
                    titulo: `🤖 Bot del servidor`,
                    descripcion: `Hola, soy **<@${client.user.id}>** el bot oficial del servidor, creado por <@717420870267830382>, el <t:${Math.floor(client.user.createdAt/1000)}:F> con la finalidad de hacer el trabajo pesado o difícil de los moderadores y administradores, remplazar a otros bots, hacer acciones complejas que otros bots no pondrían.\n*El objetivo de mi creador es seguir mejorándome hasta remplazar la máxima cantidad de bots que pueda.*`
                },
            ]
            infos.forEach((info) => {
                const embInformacion = new Discord.MessageEmbed()
                .setThumbnail(info.miniatura)
                .setTitle(info.titulo)
                .setDescription(info.descripcion)
                .setColor(info.color)
                if(int.values[0] == "categoría-importante" && info.valor == "categoría-importante"){
                    const embImportante = new Discord.MessageEmbed()
                    .setDescription(`> **<#936444065426325577>**: en este canal se colocan las plantillas de los servidores con los que hacemos **afiliaciones**, **¿quieres hacer una afiliación?**, antes revisa los requisitos que están en los mensajes fijados del canal, si cumples con los requisitos abre un ticket en <#830165896743223327> y pide la afiliación.\n> .\n> **<#826863938057797633>**: en este canal se colocan las alianzas con otros servidores, **¿quieres hacer una alianza?**, antes revisa los requisitos que están en la descripción del canal, si cumples con los requisitos abre un ticket en <#830165896743223327> y pide la alianza.\n> .\n> **<#828300239488024587>**: en este canal se publican las sugerencias que hacen los miembros sobre el servidor, **¿Quieres hacer una sugerencia?**, la puedes hacer usando el comando de barra diagonal \`\`/sugerir\`\` en el canal <#834956208112795668>, para evitar perderte de cualquier nueva sugerencia ve al canal <#823639152922460170> y obtén el rol <@&840704367467954247> el cual te notificara en cada nueva sugerencia. `)
                    .setColor(info.color)
                    int.reply({ephemeral: true, embeds: [embInformacion, embImportante]})
                }else{
                    if(int.values[0] == "categoría-promociónate" && info.valor == "categoría-promociónate"){
                        const embPromocionate = new Discord.MessageEmbed()
                        .setDescription(`> **<#833750719307579392>**: en este canal puedes publicar todo lo relacionado con **trabajo**, tu estado laborar *(desempleado y buscas trabajo, buscas empleados, tus conocimientos)*, una página o portafolio donde explique a que te dedicas, tus conocimientos, experiencia, etc.\n> .\n> **<#842893188867817562>**: en este canal solo puedes promocionar **bots** ya sean bots de esta plataforma o otras, su enlace de invitación o página del bot.\n> .\n> **<#899328778566783058>**: en este canal solo puedes promocionar contenido **NSFW** o **+18** ya sean servidores de Discord, redes sociales, páginas web, etc.`)
                        .setColor(info.color)
                        int.reply({ephemeral: true, embeds: [embInformacion, embPromocionate]})
                    }else{
                        if(int.values[0] == "roles-exclusivos" && info.valor == "roles-exclusivos"){
                            const embExclusivos1 = new Discord.MessageEmbed()
                            .setDescription(`> **<@&826197378229993503>**: este rol te da acceso al canal <#826193730578153472> canal en el cual podrás publicar cualquier tipo de contenido cada **4** horas exceptuando contenido explicito.\n\n> **Para conseguirlo hay **5** formas:**\n> **1. Invitar a **10** miembros al servidor**, para ver la cantidad de invitaciones que has hecho ejecuta el comando de barra diagonal \`\`/información miembro\`\` en el canal <#834956208112795668>, el rol se te será removido cuando los miembros que invitaste se vallan del servidor.\n> **2. Pagar 2 dólares por [PayPal](https://www.paypal.com/paypalme/srvers)**, el rol te durara **2** meses.\n> **3. Comprar el rol en economía**, en el canal <#834893418403725342>.\n> **4. Boostear el servidor o mejorarlo**, el rol sete será removido si eliminas la mejora o cuando caduque.\n> **5. Ganarse el rol en un sorteo en el canal** <#826205120173310032>, *no hacemos con frecuencia sorteos de roles*.\nPara resolver cualquier duda o reclamar el rol abre un ticket en el canal <#830165896743223327>.\n\n\n> **<@&839549487877062698>**: este rol te representa como **YouTuber**, para conseguirlo tienes que tener un canal de **YouTube** tener mínimo **200** subscriptores y tener tu cuenta de **YouTube** enlazada con la de **Discord**.\n> Si tienes todos los anteriores tienes que abrir un **Ticket** en <#830165896743223327> y pídele el rol a un administrador, el confirmará los datos y te dará el rol.\n\n\n> **<@&839549494659252244>**: Este rol te representa como **Streamer** de **Twitch**, para conseguirlo tienes que tener una media de **60** visitas en cada directo no necesariamente en vivo, tener tu cuanta de **Twitch** enlazada con la de **Discord**.\n> Si tienes los requisitos crea un **Ticket** en <#830165896743223327> y pídele el rol a un administrador, el confirmará los datos y te dará el rol.`)
                            .setColor(info.color)
                            const embExclusivos2 = new Discord.MessageEmbed()
                            .setDescription(`**<@&851577906828148766>**: Este rol por ahora no te da ninguna ventaja dentro del servidor.\n\n> Se consigue invitando al bot <@935707268090056734> a tu servidor para invitarlo ve al perfil del bot en el encontraras un botón para invitarlo en caso de no encontrarlo usa el comando \`\`u!invite\`\` o menciona al bot, para reclamar el rol habré un **ticket** en  <#830165896743223327>, ayudas bastante al creador del bot invitándolo a tu servidor.`)
                            .setColor(info.color)
                            int.reply({ephemeral: true, embeds: [embInformacion, embExclusivos1, embExclusivos2]})
                        }else{
                            if(info.valor == int.values[0]){
                                int.reply({ephemeral: true, embeds: [embInformacion]})
                            }
                        }
                    }
                }
            })
        }
    }

    if(int.isContextMenu()){
        if(int.commandName == "usuario"){
            int.deferReply()
            estadisticas.comandos++
            let miembro = int.guild.members.cache.get(int.targetId)
            const embInfo = new Discord.MessageEmbed()
            .setTitle(`Información de ${miembro.user.tag}`,int.user.displayAvatarURL({dynamic: true}))
            .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png" || "gif", size: 4096}))
            .addFields(
                {name: "**📅 Creo la cuenta:**", value: `<t:${Math.round(miembro.user.createdAt / 1000)}:R>`, inline: true},
                {name: "**📥 Se unió:**", value: `<t:${Math.round(miembro.joinedAt / 1000)}:R>`, inline: true},
            )
            .setColor(int.guild.me.displayHexColor)
            .setTimestamp()
            setTimeout(()=>{
                int.editReply({embeds: [embInfo]})
            }, 400)
        }
    }
})

//  Registros de bienvenidas y despedidas:
client.on("guildMemberAdd",async gmd => {
    if(gmd.guild.id != svPrID) return;
    estadisticas.entradas++

    let dataBot = await botDB.findById(client.user.id)
    let dataInv = await invitacionesDB.findById(svPrID), arrayMi = dataInv.miembros
    if(gmd.user.bot){
        if(!gmd.user.flags.has("VERIFIED_BOT")){
            gmd.kick("Razon: Bot no verificado.")

            const embAuntiB = new Discord.MessageEmbed()
            .setAuthor(gmd.user.tag,gmd.user.displayAvatarURL({dynamic: true}))
            .setTitle("Anti bots no verificados")
            .setDescription(`Se ha espulsado un bot no verificado que ha entrado en ${gmd.guild.name}`)
            .setColor(gmd.guild.me.displayHexColor)
            .setFooter(gmd.guild.name,gmd.guild.iconURL({dynamic: true}))
            .setTimestamp()
            client.users.cache.get(creadorID).send({embeds: [embAuntiB]})
        }

        const embBot = new Discord.MessageEmbed()
        .setTitle("🤖 Se unio un bot")
        .setThumbnail(gmd.displayAvatarURL())
        .setDescription(`${gmd}\n${gmd.user.tag}\nCreado <t:${Math.floor(gmd.user.createdAt/1000)}:R>`)
        .setColor("#0084EC")
        .setTimestamp()
        client.channels.cache.get(dataBot.datos.registros.entrada).send({embeds: [embBot]})

        const embCreMD = new Discord.MessageEmbed()
        .setAuthor(gmd.guild.name,gmd.guild.iconURL({dynamic: true}))
        .setThumbnail(gmd.displayAvatarURL())
        .setTitle("🤖 Se unio un Bot")
        .setDescription(`${gmd}\n${gmd.user.tag}\n${gmd.user.id}\n${gmd.user.createdAt.toLocaleString()}`)
        .setColor("#0084ec")
        .setTimestamp()
        client.users.cache.get(creadorID).send({embeds: [embCreMD]})

    }else{
        // Bienvenida con canvas
        client.channels.cache.get(dataBot.datos.registros.bienvenidas).sendTyping()
        let imagen = "https://cdn.discordapp.com/attachments/901313790765854720/902607815359758356/fondoBienv.png"
        const canvas = Canvas.createCanvas(1000, 500);
        const context = canvas.getContext("2d");
        const fondo = await Canvas.loadImage(imagen);

        context.drawImage(fondo, 0, 0, canvas.width, canvas.height);
        context.strokeStyle = "#000000";
        context.strokeRect(0,0, canvas.width, canvas.height);

        context.beginPath();
        context.arc(500, 160, 145, 0, Math.PI * 2, true);
        context.fillStyle = `${gmd.guild.me.displayHexColor}`;
        context.stroke();
        context.fill();

        context.textAlign = "center"
        context.font = "80px MADE TOMMY"
        context.fillStyle = "#ffffff"
        context.fillText("Bienvenid@", 500, 375)

        context.font = '45px MADE TOMMY';
        context.fillStyle = '#ffffff';
        context.fillText(`${gmd.user.tag}`, 500, 435);

        context.font = '38px MADE TOMMY'
        context.fillStyle = '#ffffff';
        context.fillText(`disfruta del servidor`, 500, 480);

        context.beginPath();
        context.arc(500, 160, 140, 0, Math.PI * 2, true);
        context.fillStyle = `${gmd.guild.me.displayHexColor}`;
        context.closePath();
        context.clip();

        const avatar = await Canvas.loadImage(gmd.displayAvatarURL({format: "jpg", size: 2048}))
        context.drawImage(avatar, 360, 20, 280, 280);

        const finalImg = new Discord.MessageAttachment(canvas.toBuffer(), "imagen.png")


        const embBienvenida = new Discord.MessageEmbed()
        .setAuthor(gmd.user.tag,gmd.user.displayAvatarURL({dynamic: true}))
        .setImage(`attachment://imagen.png`)
        .setTitle("👋 ¡Bienvenido/a!")
        .setDescription(`*No se por quien has sido invitado.*\n\n💈 Pásate por el canal <#823639152922460170> en el podrás obtener roles que cambiarán el color de tu nombre dentro del servidor, y muchos otros roles.\n\n📢 Promociona todo tipo de contenido en el canal **<#836315643070251008>**.\n\n📜 También pásate por el canal <#823343749039259648> el canal de reglas, léelas para evitar sanciones.`)
        .setColor(`${gmd.guild.me.displayHexColor}`)
        .setFooter(`Bienvenido/a a ${gmd.guild.name}`,gmd.guild.iconURL({dynamic: true}))
        .setTimestamp()

        let usBanner = await client.users.fetch(gmd.id, {force: true})
        const embBien = new Discord.MessageEmbed()
        .setAuthor(gmd.user.tag,gmd.user.displayAvatarURL({dynamic: true}))
        .setThumbnail(gmd.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
        .setImage(usBanner.bannerURL({dynamic: true, format: "gif"||"png", size: 4096}))
        .setTitle("📥 Se unió un usuario")
        .setDescription(`Se unió ${gmd} *(no se por quien fue invitado/a)*.\n📅 **Creacion de la cueta:**\n<t:${Math.round(gmd.user.createdAt / 1000)}:R>`)
        .setColor("#00ff00")
        .setFooter(gmd.guild.name,gmd.guild.iconURL({dynamic: true}))
        .setTimestamp()

        await gmd.guild.invites.fetch().then(async invites=> {
            console.log(invites.map(m => `${m.code} || ${m.uses}`))
            let invitacion = invites.find(f=> arrayMi.find(fm=> fm.id==f.inviterId).codes.find(fc=> fc.code==f.code) ? arrayMi.find(fm=> fm.id==f.inviterId).codes.find(fc=> fc.code==f.code).usos<f.uses : false)
            console.log(invitacion)

            let miembro = arrayMi.find(f=> f.id==invitacion.inviterId)
            if(miembro){
                if(miembro.codes.some(s=> s.code==invitacion.code)){
                    let invite = miembro.codes.find(f=> f.code==invitacion.code)
                    if(invitacion.uses > invite.usos){
                        if(miembro.id == gmd.user.id){
                            miembro.falsas++
                            embBienvenida.setDescription(`*Has sido invitado/a por ti mismo con una invitación creada por ti.*\n\n💈 Pásate por el canal <#823639152922460170> en el podrás obtener roles que cambiarán el color de tu nombre dentro del servidor, y muchos otros roles.\n\n📢 Promociona todo tipo de contenido en el canal **<#836315643070251008>**.\n\n📜 También pásate por el canal <#823343749039259648> el canal de reglas, léelas para evitar sanciones.`)
                            embBien.description = `Se unió ${gmd} *ha sido invitado/a por el mismo con una invitación suya.*\n📅 **Creacion de la cueta:**\n<t:${Math.round(gmd.user.createdAt / 1000)}:R>`
                        }else{
                            miembro.verdaderas++
                            if(miembro.invitados.some(s=> s.id==gmd.user.id)){
                                let invitado = miembro.invitados.find(f=> f.id==gmd.user.id)
                                invitado.miembro = true
                            }else{
                                miembro.invitados.push({id: gmd.user.id, tag: gmd.user.tag, miembro: true})
                            }
                            let miembroSV = gmd.guild.members.cache.get(invitacion.inviterId)
                            if(miembroSV && !miembroSV.user.bot){
                                if(!miembroSV.roles.cache.has(dataInv.datos.roles[0].id) && miembro.verdaderas>=10){
                                    miembroSV.roles.add(dataInv.datos.roles[0].id)
                                    const embRolVip = new Discord.MessageEmbed()
                                    .setThumbnail(miembroSV.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 1024}))
                                    .setTitle("➕ Rol agregado a miembro")
                                    .setDescription(`Le he agregado el rol <@&${dataInv.datos.roles[0].id}> a <@${miembroSV.id}> ya que ha invitado a **${dataInv.datos.roles[0].invitaciones}** miembros.`)
                                    .setColor(`#00ff00`)
                                    .setTimestamp()
                                    client.channels.cache.get(dataBot.datos.registros.bot).send({embeds: [embRolVip]})
                                }
                                if(!miembroSV.roles.cache.has(dataInv.datos.roles[1].id) && miembro.verdaderas>=20){
                                    miembroSV.roles.add(dataInv.datos.roles[1].id)
                                    const embRolVipPlus = new Discord.MessageEmbed()
                                    .setThumbnail(miembroSV.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 1024}))
                                    .setTitle("➕ Rol agregado a miembro")
                                    .setDescription(`Le he agregado el rol <@&${dataInv.datos.roles[1].id}> a <@${miembroSV.id}> ya que ha invitado a **${dataInv.datos.roles[1].invitaciones}** miembros.`)
                                    .setColor(`#00ff00`)
                                    .setTimestamp()
                                    client.channels.cache.get(dataBot.datos.registros.bot).send({embeds: [embRolVipPlus]})
                                }
                            }
                            embBienvenida.setDescription(`*Has sido invitado/a por <@${miembro.id}> quien ahora tiene **${miembro.verdaderas.toLocaleString()}** ${miembro.verdaderas==1 ? "invitación": "invitaciones"}.*\n\n💈 Pásate por el canal <#823639152922460170> en el podrás obtener roles que cambiarán el color de tu nombre dentro del servidor, y muchos otros roles.\n\n📢 Promociona todo tipo de contenido en el canal **<#836315643070251008>**.\n\n📜 También pásate por el canal <#823343749039259648> el canal de reglas, léelas para evitar sanciones.`)
                            embBien.description = `Se unió ${gmd} *ha sido invitado/a por <@${miembro.id}> quien ahora tiene **${miembro.verdaderas.toLocaleString()}** ${miembro.verdaderas==1 ? "invitación": "invitaciones"}.*\n📅 **Creacion de la cueta:**\n<t:${Math.round(gmd.user.createdAt / 1000)}:R>`
                        }
                        miembro.totales++
                        invite.usos = invitacion.uses
                        
                    }
                }
            }
        })
        // client.channels.cache.get(dataBot.datos.registros.bienvenidas).send({embeds: [embBienvenida], files: [finalImg], content: `**Hola ${gmd}**`})
        // client.channels.cache.get(dataBot.datos.registros.entrada).send({embeds: [embBien]})
        client.channels.cache.get("966420965045203034").send({embeds: [embBien]})
        let miembroInv = arrayMi.find(f=> f.id==gmd.user.id)
        if(miembroInv){
            miembroInv.tiempo = undefined
        }
        await invitacionesDB.findByIdAndUpdate(svPrID, {miembros: arrayMi})

        gmd.roles.add(rolesPrincipales)
    }
})

client.on("guildMemberRemove",async gmr => {
    if(gmr.guild.id != "123123") return;
    estadisticas.salidas++
    
    let dataBot = await botDB.findById(client.user.id)
    let dataInv = await invitacionesDB.findById(servidorID), arrayMi = dataInv.miembros
    if(gmr.user.bot){
        const embBot = new Discord.MessageEmbed()
        .setTitle("🤖 Se fue un bot")
        .setThumbnail(gmr.displayAvatarURL())
        .setDescription(`${gmr}\n${gmr.user.tag}\nSeunio: <t:${Math.round(gmr.joinedAt / 1000)}:R>`)
        .setColor("ORANGE")
        .setTimestamp()
        client.channels.cache.get(dataBot.datos.registros.salida).send({embeds: [embBot]})

    }else{
        let mbanner = await client.users.fetch(gmr.id, {force: true})
        const embDes = new Discord.MessageEmbed()
        .setAuthor(gmr.user.username,gmr.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
        .setThumbnail(gmr.user.displayAvatarURL({dynamic: true}))
        .setImage(mbanner.bannerURL({dynamic: true, format: "png"||"gif", size: 4096}))
        .setTitle("📤 Se fue un miembro")
        .setDescription(`Se fue ${gmr} (*no se por quien fue invitado/a*).\n📥 **Seunio:**\n<t:${Math.round(gmr.joinedAt / 1000)}:R>`)
        .setColor("#ff0000")
        .setFooter(gmr.guild.name,gmr.guild.iconURL({dynamic: true}))
        .setTimestamp()

        for(m of arrayMi){
            if(m.invitados.some(s=> s.id==gmr.user.id)){
                let invitado = m.invitados.find(f=> f.id==gmr.user.id)
                if(invitado.miembro){
                    m.verdaderas--
                    m.restantes++
                    invitado.miembro = false
                    embDes.description = `Se fue ${gmr} *había sido invitado/a por <@${m.id}> quien ahora tiene **${m.verdaderas.toLocaleString()}** ${m.verdaderas==1 ? "invitación": "invitaciones"}.*\n📥 **Seunio:**\n<t:${Math.round(gmr.joinedAt / 1000)}:R>`
                }
            }
        }
        client.channels.cache.get(dataBot.datos.registros.salida).send({embeds: [embDes]})
        let miembro = arrayMi.find(f=> f.id==gmr.user.id)
        if(miembro){
            miembro.tiempo = Math.floor(Date.now()+ms("30d"))
        }
        await invitacionesDB.findByIdAndUpdate(servidorID, {miembros: arrayMi})

        // Niveles
        let dataNvl = await nivelesDB.findById(servidorID), arrayNms = dataNvl.miembros
        if(arrayNms.some(s=> s.id == gmr.id)){
            arrayNms.splice(arrayCo.findIndex(f=> f.id==gmr.id),1)
            await nivelesDB.findByIdAndUpdate(servidorID), {miembros: arrayNms}
        }

        // Colaboradore
        let dataCol = await colaboradoresDB.findById(servidorID), arrayCo = dataCol.colaboradores
        if(arrayCo.some(s=>s.id == gmr.id)){
            arrayCo.splice(arrayCo.findIndex(f=>f.id == gmr.id),1)
            await colaboradoresDB.findByIdAndUpdate(servidorID, {colaboradores: arrayCo})
        }

        // Personal
        let dataPer = await personalDB.findById(servidorID), arrayPr = dataPer.personal
        if(arrayPr.some(s=> s.i==gmr.id)){
            let persona = arrayPr.find(f=> f.i==gmr.id)
            persona.miembro = false
            await personalDB.findByIdAndUpdate(servidorID, {personal: arrayPr})
        }

        // PromoNvl
        let dataPrl = await promoNvlDB.findById(servidorID), arrayPl = dataPrl.miembros
        if(arrayPl.some(s=> s.id==gmr.id)){
            arrayPl.splice(arrayPl.findIndex(f=> f.id==gmr.id),1)
            await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
        }
    }
})

// Invitaciones
client.on("inviteCreate", async invC => {
    if(invC.guild.id != "842630591257772033") return;

    let dataInv = await invitacionesDB.findById(svPrID), arrayMi = dataInv.miembros
    let miembro = arrayMi.find(f=> f.id==invC.inviterId)
    if(miembro){
        miembro.codes.push({code: invC.code, usos: 0})
        await invitacionesDB.findByIdAndUpdate(svPrID, {miembros: arrayMi})
    }else{
        arrayMi.push({id: invC.inviterId, tag: invC.inviter.tag, verdaderas: 0, totales: 0, restantes: 0, falsas: 0, tiempo: undefined, codes: [{code: invC.code, usos: 0}], invitados: []})
        await invitacionesDB.findByIdAndUpdate(svPrID, {miembros: arrayMi})
    }
})

client.on("inviteDelete", async invD => {
    if(invD.guild.id != "12133") return;

    let dataInv = await invitacionesDB.findById(servidorID), arrayMi = dataInv.miembros
    let miembro = arrayMi.find(f=> f.codes.some(s=> s.code==invD.code))
    if(miembro){
        miembro.codes.splice(miembro.codes.findIndex(f=> f.code==invD.code),1)
        for(i of miembro.codes){
            await client.fetchInvite(i.code).catch(c=> {
                miembro.codes.splice(miembro.codes.findIndex(f=> f.code==i.code),1)
            })
        }
        await invitacionesDB.findByIdAndUpdate(servidorID, {miembros: arrayMi})
    }
})

// Reacciones
client.on("messageReactionAdd", async (mra, user) => {
    if(mra.message.guildId != servidorID || user.bot) return;

    // Sistema de encuestas
    let dataEnc = await encuestasDB.findById(servidorID), arrayEn = dataEnc.encuestas
    if(arrayEn.filter(f=> f.activa).some(s=>s.id == mra.message.id) && arrayEn.find(f=> f.id == mra.message.id).opciones.some(s=> s.emoji==mra.emoji.name)){
        let encuesta = arrayEn.find(f=> f.id == mra.message.id), totalVotos = 0, tabla = []
        encuesta.opciones.filter(f=> f.emoji!=mra.emoji.name).map(m=> mra.message.reactions.cache.get(m.emoji).users.remove(user.id))
        for(c of encuesta.opciones){
            if(c.emoji!=mra.emoji.name && mra.message.reactions.cache.get(c.emoji).users.cache.has(user.id)){
                totalVotos+=mra.message.reactions.cache.get(c.emoji).count-2
                c.votos=mra.message.reactions.cache.get(c.emoji).count-2
            }else{
                totalVotos+=mra.message.reactions.cache.get(c.emoji).count-1
                c.votos=mra.message.reactions.cache.get(c.emoji).count-1
            }
        }
        await encuestasDB.findByIdAndUpdate(servidorID, {encuestas: arrayEn})
        
        for(o of encuesta.opciones){
            let porcentaje = (o.votos*100/totalVotos).toFixed(2), carga = "█", vacio = " ", diseño = ""
            
            for(let i=0; i<20; i++){
                if(i < porcentaje/100*20){
                    diseño = diseño.concat(carga)
                }else{
                    diseño = diseño.concat(vacio)
                }
            }
            tabla.push(`${o.emoji} ${o.opcion} *(${o.votos})*\n\`\`${diseño}\`\` **|** ${porcentaje}%`)
        }

        let embed = mra.message.embeds[0]
        embed.fields[0].value = tabla.join("\n\n")
        mra.message.edit({embeds: [embed]})
    }

    // Sistema de sorteos
    let dataSor = await sorteosDB.findById(servidorID), arraySo = dataSor.sorteos
    if(arraySo.filter(f=> f.activo).some(s=>s.id == mra.message.id) && mra.emoji.id==dataSor.datos.emojiID){
        let sorteo = arraySo.find(f=> f.id == mra.message.id)
        if(!sorteo.participantes.some(s=>s==user.id)){
            sorteo.participantes.push(user.id)
            await sorteosDB.findByIdAndUpdate(servidorID, {sorteos: arraySo})
        }
    }

    // Sistema de tickets
    let estrellas = [{id: "963478022369980517", reaccion: false}, {id: "963478099578728448", reaccion: false}, {id: "963478146089377872", reaccion: false}, {id: "963478173562052628", reaccion: false}, {id: "963478195498254387", reaccion: false}]
    let dataTs = await ticketsDB.findOne({_id: servidorID}), arrayTs = dataTs.tickets, arrayMs = dataTs.miembros

    arrayTs.forEach(async (objeto) => {
        if(estrellas.some(e=>e.id == mra.emoji.id) && objeto.msgValoracionID == mra.message.id){
            if(user.id == objeto.miembroID){
                mra.message.reactions.cache.map(m=> m).forEach((valor, ps) =>{
                    if(valor.users.cache.some(s=>s.id == objeto.miembroID) && !estrellas.find(f=>f.id == valor.emoji.id).reaccion){
                        estrellas.find(f=>f.id == valor.emoji.id).reaccion = true
                    }
                })
                if(objeto.valoracion){
                    arrayMs.forEach((objetoMs) => {
                        if(objetoMs.id == user.id){
                            objetoMs.reseñas.forEach((objRes) => {
                                if(objRes.ticketID == objeto.id){
                                    if(estrellas.filter(f=> f.reaccion).length==1){
                                        objRes.estrellas = estrellas.findIndex(f=> f.reaccion)+1
                                    }else{
                                        objRes.estrellas = estrellas.filter(f=> f.reaccion).length
                                    }
                                }
                            })
                        }
                    })

                }else{
                    objeto.valoracion = true
                    arrayMs.forEach((objetoMs) => {
                        if(objetoMs.id == user.id){
                            objetoMs.reseñas.forEach((objRes) => {
                                if(objRes.ticketID == objeto.id){
                                    if(estrellas.filter(f=> f.reaccion).length==1){
                                        objRes.estrellas = estrellas.findIndex(f=> f.reaccion)+1
                                    }else{
                                        objRes.estrellas = estrellas.filter(f=> f.reaccion).length
                                    }
                                }
                            })
                        }
                    })
                }
                await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs, miembros: arrayMs})
            }else{
                mra.users.remove(user.id)
            }
        }
    })

    // sistema de sugerencias
    let dataSug = await systemSug.findOne({_id: mra.message.guildId})
    // let color = mra.message.guild.roles.cache.get("840704367467954247").hexColor

    for(let i=0; i<dataSug.mensajes.length; i++){
        if(dataSug.mensajes[i].id == mra.message.id){
            if(mra.emoji.id == "946826193032851516"){
                mra.message.reactions.cache.get("946826212960010251").users.remove(user.id).then(console.log("elimine reaccion"))

                let positivas = mra.count-1, negativas = dataSug.mensajes[i].negativas, totales = positivas + negativas

                let porcentajePositivo = (positivas*100/totales).toFixed(2)
                let porcentajeNegativo = (negativas*100/totales).toFixed(2)


                let carga = "█", vacio = " ", diseñoPositivo = "", diseñoNegativo = ""
                
                for(let i=0; i<20; i++){
                    if(i < porcentajePositivo/100*20){
                        diseñoPositivo = diseñoPositivo.concat(carga)
                    }else{
                        diseñoPositivo = diseñoPositivo.concat(vacio)
                    }

                    if(i < porcentajeNegativo/100*20){
                        diseñoNegativo = diseñoNegativo.concat(carga)
                    }else{
                        diseñoNegativo = diseñoNegativo.concat(vacio)
                    }
                }

                if(mra.message.embeds[0].fields.length <= 0){
                    const embed = mra.message.embeds[0]
                    .addField(`📊 Votos: **${totales}**`, `<:blueLike:946826193032851516> ${positivas}\n\`\`${diseñoPositivo}\`\` **|** ${porcentajePositivo}%\n<:redDislike:946826212960010251> ${negativas}\n\`\`${diseñoNegativo}\`\` **|** ${porcentajeNegativo}%`)
                    mra.message.edit({embeds: [embed]})
                }else{
                    let embed = mra.message.embeds[0]

                    embed.fields[0].name = `📊 Votos: **${totales}**`
                    embed.fields[0].value = `<:blueLike:946826193032851516> ${positivas}\n\`\`${diseñoPositivo}\`\` **|** ${porcentajePositivo}%\n<:redDislike:946826212960010251> ${negativas}\n\`\`${diseñoNegativo}\`\` **|** ${porcentajeNegativo}%`
                    mra.message.edit({embeds: [embed]})
                }

                let orID = dataSug.mensajes[i].origenID, miemID = dataSug.mensajes[i].autorID, sug = dataSug.mensajes[i].sugerencia, est = dataSug.mensajes[i].estado
                dataSug.mensajes[i] = {id: mra.message.id, origenID: orID, autorID: miemID, sugerencia: sug, estado: est, positivas: positivas, negativas: negativas}
                await dataSug.save()
            }

            if(mra.emoji.id === "946826212960010251"){
                mra.message.reactions.cache.get("946826193032851516").users.remove(user.id)

                let positivas = dataSug.mensajes[i].positivas, negativas = mra.count-1, totales = positivas + negativas

                let porcentajePositivo = String(positivas*100/totales).slice(0,5)
                let porcentajeNegativo = String(negativas*100/totales).slice(0,5)


                let carga = "█", vacio = " ", diseñoPositivo = "", diseñoNegativo = ""

                for(let i=0; i<20; i++){
                    if(i < Number(porcentajePositivo)/100*20){
                        diseñoPositivo = diseñoPositivo.concat(carga)
                    }else{
                        diseñoPositivo = diseñoPositivo.concat(vacio)
                    }

                    if(i < Number(porcentajeNegativo)/100*20){
                        diseñoNegativo = diseñoNegativo.concat(carga)
                    }else{
                        diseñoNegativo = diseñoNegativo.concat(vacio)
                    }
                }

                if(mra.message.embeds[0].fields.length <= 0){
                    const embed = mra.message.embeds[0]
                    .addField(`📊 Votos: **${totales}**`, `<:blueLike:946826193032851516> ${positivas}\n\`\`${diseñoPositivo}\`\` **|** ${porcentajePositivo}%\n<:redDislike:946826212960010251> ${negativas}\n\`\`${diseñoNegativo}\`\` **|** ${porcentajeNegativo}%`)
                    mra.message.edit({embeds: [embed]})
                }else{
                    let embed = mra.message.embeds[0]

                    embed.fields[0].name = `📊 Votos: **${totales}**`
                    embed.fields[0].value = `<:blueLike:946826193032851516> ${positivas}\n\`\`${diseñoPositivo}\`\` **|** ${porcentajePositivo}%\n<:redDislike:946826212960010251> ${negativas}\n\`\`${diseñoNegativo}\`\` **|** ${porcentajeNegativo}%`
                    mra.message.edit({embeds: [embed]})
                }

                let orID = dataSug.mensajes[i].origenID, miemID = dataSug.mensajes[i].autorID, sug = dataSug.mensajes[i].sugerencia, est = dataSug.mensajes[i].estado
                dataSug.mensajes[i] = {id: mra.message.id, origenID: orID, autorID: miemID, sugerencia: sug, estado: est, positivas: positivas, negativas: negativas}
                await dataSug.save()
            }
        }
    }
})

client.on("messageReactionRemove", async (mrr, user) => {
    if(user.bot && mrr.message.guildId != servidorID) return;

    // Sistema de encuestas
    let dataEnc = await encuestasDB.findById(servidorID), arrayEn = dataEnc.encuestas
    if(arrayEn.filter(f=> f.activa).some(s=>s.id == mrr.message.id) && arrayEn.find(f=> f.id == mrr.message.id).opciones.some(s=> s.emoji==mrr.emoji.name)){
        let encuesta = arrayEn.find(f=> f.id == mrr.message.id), totalVotos = 0, tabla = []
        for(c of encuesta.opciones){
            totalVotos+=mrr.message.reactions.cache.get(c.emoji).count-1
            c.votos=mrr.message.reactions.cache.get(c.emoji).count-1
        }
        await encuestasDB.findByIdAndUpdate(servidorID, {encuestas: arrayEn})

        for(o of encuesta.opciones){
            let porcentaje = (o.votos*100/totalVotos).toFixed(2), carga = "█", vacio = " ", diseño = ""
            
            for(let i=0; i<20; i++){
                if(i < porcentaje/100*20){
                    diseño = diseño.concat(carga)
                }else{
                    diseño = diseño.concat(vacio)
                }
            }
            tabla.push(`${o.emoji} ${o.opcion} *(${o.votos})*\n\`\`${diseño}\`\` **|** ${porcentaje}%`)
        }

        let embed = mrr.message.embeds[0]
        embed.fields[0].value = tabla.join("\n\n")
        mrr.message.edit({embeds: [embed]})
    }

    // Sistema de sorteos
    let dataSor = await sorteosDB.findById(servidorID), arraySo = dataSor.sorteos
    if(arraySo.filter(f=> f.activo).some(s=>s.id == mrr.message.id) && mrr.emoji.id==dataSor.datos.emojiID){
        let sorteo = arraySo.find(f=> f.id == mrr.message.id)
        if(sorteo.participantes.some(s=>s==user.id)){
            sorteo.participantes.splice(sorteo.participantes.findIndex(f=>f==user.id),1)
            await sorteosDB.findByIdAndUpdate(servidorID, {sorteos: arraySo})
        }
    }

    // Sistema de tickets
    let estrellas = [{id: "963478022369980517", reaccion: false}, {id: "963478099578728448", reaccion: false}, {id: "963478146089377872", reaccion: false}, {id: "963478173562052628", reaccion: false}, {id: "963478195498254387", reaccion: false}] 
    let dataTs = await ticketsDB.findOne({_id: servidorID}), arrayTs = dataTs.tickets, arrayMs = dataTs.miembros
    arrayTs.forEach(async (objeto) => {
        if(estrellas.some(e=>e.id == mrr.emoji.id) && objeto.msgValoracionID == mrr.message.id){
            if(user.id == objeto.miembroID){
                mrr.message.reactions.cache.map(m=> m).forEach((valor, ps) =>{
                    if(valor.users.cache.some(s=>s.id == objeto.miembroID) && !estrellas.find(f=>f.id == valor.emoji.id).reaccion){
                        estrellas.find(f=>f.id == valor.emoji.id).reaccion = true
                    }
                })
                if(objeto.valoracion){
                    objeto.valoracion = false
                    arrayMs.forEach((objetoMs) => {
                        if(objetoMs.id == user.id){
                            objetoMs.reseñas.forEach((objRes) => {
                                if(objRes.ticketID == objeto.id){
                                    if(estrellas.filter(f=> f.reaccion).length==1){
                                        objRes.estrellas = estrellas.findIndex(f=> f.reaccion)+1
                                    }else{
                                        if(estrellas.filter(f=> f.reaccion).length == 0){
                                            objeto.valoracion = false
                                        }else{
                                            objRes.estrellas = estrellas.filter(f=> f.reaccion).length
                                        }
                                    }
                                }
                            })
                        }
                    })
                    
                }else{
                    arrayMs.forEach((objetoMs) => {
                        if(objetoMs.id == user.id){
                            objetoMs.reseñas.forEach((objRes) => {
                                if(objRes.ticketID == objeto.id){
                                    if(estrellas.filter(f=> f.reaccion).length==1){
                                        objRes.estrellas = estrellas.findIndex(f=> f.reaccion)+1
                                    }else{
                                        objRes.estrellas = estrellas.filter(f=> f.reaccion).length
                                    }
                                }
                            })
                        }
                    })
                }
                await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs, miembros: arrayMs})
            }
        }
    })

    // Sistema de sugerencias
    let dataSug = await systemSug.findOne({_id: mrr.message.guildId})

    for(let i=0; i<dataSug.mensajes.length; i++){
        if(dataSug.mensajes[i].id === mrr.message.id){
            if(mrr.emoji.id === "946826193032851516"){
                let positivas = mrr.count - 1, negativas = dataSug.mensajes[i].negativas, totales = positivas + negativas

                let porcentajePositivo = String(positivas*100/totales).slice(0,5)
                let porcentajeNegativo = String(negativas*100/totales).slice(0,5)


                let carga = "█", vacio = " ", diseñoPositivo = "", diseñoNegativo = ""

                for(let i=0; i<20; i++){
                    if(i < porcentajePositivo/100*20){
                        diseñoPositivo = diseñoPositivo.concat(carga)
                    }else{
                        diseñoPositivo = diseñoPositivo.concat(vacio)
                    }

                    if(i < porcentajeNegativo/100*20){
                        diseñoNegativo = diseñoNegativo.concat(carga)
                    }else{
                        diseñoNegativo = diseñoNegativo.concat(vacio)
                    }
                }

                if(mrr.message.embeds[0].fields.length <= 0){
                    const embed = mrr.message.embeds[0]
                    .addField(`📊 Votos: **${totales}**`, `<:blueLike:946826193032851516> ${positivas}\n\`\`${diseñoPositivo}\`\` **|** ${porcentajePositivo}%\n<:redDislike:946826212960010251> ${negativas}\n\`\`${diseñoNegativo}\`\` **|** ${porcentajeNegativo}%`)
                    mrr.message.edit({embeds: [embed]})
                }else{
                    let embed = mrr.message.embeds[0]

                    embed.fields[0].name = `📊 Votos: **${totales}**`
                    embed.fields[0].value = `<:blueLike:946826193032851516> ${positivas}\n\`\`${diseñoPositivo}\`\` **|** ${porcentajePositivo}%\n<:redDislike:946826212960010251> ${negativas}\n\`\`${diseñoNegativo}\`\` **|** ${porcentajeNegativo}%`
                    mrr.message.edit({embeds: [embed]})
                }
                
                let orID = dataSug.mensajes[i].origenID, miemID = dataSug.mensajes[i].autorID, sug = dataSug.mensajes[i].sugerencia, est = dataSug.mensajes[i].estado
                dataSug.mensajes[i] = {id: mrr.message.id, origenID: orID, autorID: miemID, sugerencia: sug, estado: est, positivas: positivas, negativas: negativas}
                await dataSug.save()
            }

            
            if(mrr.emoji.id === "946826212960010251"){
                let positivas = dataSug.mensajes[i].positivas, negativas = mrr.count - 1, totales = positivas + negativas

                let porcentajePositivo = String(positivas*100/totales).slice(0,5)
                let porcentajeNegativo = String(negativas*100/totales).slice(0,5)


                let carga = "█", vacio = " ", diseñoPositivo = "", diseñoNegativo = ""
                
                for(let i=0; i<20; i++){
                    if(i < porcentajePositivo/100*20){
                        diseñoPositivo = diseñoPositivo.concat(carga)
                    }else{
                        diseñoPositivo = diseñoPositivo.concat(vacio)
                    }

                    if(i < porcentajeNegativo/100*20){
                        diseñoNegativo = diseñoNegativo.concat(carga)
                    }else{
                        diseñoNegativo = diseñoNegativo.concat(vacio)
                    }
                }

                if(mrr.message.embeds[0].fields.length <= 0){
                    const embed = mrr.message.embeds[0]
                    .addField(`📊 Votos: **${totales}**`, `<:blueLike:946826193032851516> ${positivas}\n\`\`${diseñoPositivo}\`\` **|** ${porcentajePositivo}%\n<:redDislike:946826212960010251> ${negativas}\n\`\`${diseñoNegativo}\`\` **|** ${porcentajeNegativo}%`)
                    mrr.message.edit({embeds: [embed]})
                }else{
                    let embed = mrr.message.embeds[0]

                    embed.fields[0].name = `📊 Votos: **${totales}**`
                    embed.fields[0].value = `<:blueLike:946826193032851516> ${positivas}\n\`\`${diseñoPositivo}\`\` **|** ${porcentajePositivo}%\n<:redDislike:946826212960010251> ${negativas}\n\`\`${diseñoNegativo}\`\` **|** ${porcentajeNegativo}%`
                    mrr.message.edit({embeds: [embed]})
                }

                let orID = dataSug.mensajes[i].origenID, miemID = dataSug.mensajes[i].autorID, sug = dataSug.mensajes[i].sugerencia, est = dataSug.mensajes[i].estado
                dataSug.mensajes[i] = {id: mrr.message.id, origenID: orID, autorID: miemID, sugerencia: sug, estado: est, positivas: positivas, negativas: negativas}
                await dataSug.save()
            }
        }
    }
})


client.on("messageCreate",async msg => {
    // if(msg.guildId != servidorID) return
    estadisticas.mensajes++

    // Sistema de tickets
    let dataTs = await ticketsDB.findOne({_id: servidorID}), arrayTs = dataTs.tickets, servidor2 = client.guilds.cache.get("949860813915705354")

    // if(msg.author.id != creadorID) return;
    arrayTs.forEach(async (objeto) =>{
        if(objeto.id == msg.channelId){
            if(objeto.publico && msg.member.roles.cache.has("887444598715219999")){
                objeto.publico = false
                objeto.personalID = msg.author.id
                await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})

                msg.channel.permissionOverwrites.edit(msg.author.id, {"VIEW_CHANNEL": true, "SEND_MESSAGES": true})
                msg.channel.permissionOverwrites.delete("773271945894035486")
                msg.channel.permissionOverwrites.delete("831669132607881236")
            }
 
            if(msg.content.length == 0 && msg.embeds.length == 0 && msg.components.length == 0 && msg.attachments.size == 0) return;
            let webhook = (await servidor2.channels.cache.get(objeto.copiaID).fetchWebhooks()).map(w=>w.url)
            const webhookCl = new Discord.WebhookClient({url: webhook[0]})
            if(msg.content.length > 0){
                webhookCl.send({username: msg.author.username, avatarURL: msg.author.displayAvatarURL({dynamic: true, format: "png"}), content: msg.content, embeds: msg.embeds, components: msg.components, files: msg.attachments.map(a=>a)})
            }else{
                webhookCl.send({username: msg.author.username, avatarURL: msg.author.displayAvatarURL({dynamic: true, format: "png"}), embeds: msg.embeds, components: msg.components, files: msg.attachments.map(a=>a)})
            }
        }
    })

    if(msg.author.bot) return;
    // Colaboradores
    let dataCol = await colaboradoresDB.findById("842630591257772033"), arrayCo = dataCol.colaboradores
    if(dataCol.colaboradores.filter(f=>f.colaborador).some(s=>s.canalID == msg.channelId)){
        let miembroCo = arrayCo.find(f=>f.canalID == msg.channelId)
        if(msg.mentions.everyone && miembroCo.id == msg.author.id){
            msg.channel.permissionOverwrites.edit(msg.author.id, {"MENTION_EVERYONE": false,})
            miembroCo.tiempo = Date.now()+ms("4m")
            miembroCo.notificado = false
            await colaboradoresDB.findByIdAndUpdate("842630591257772033", {colaboradores: arrayCo})
        }
    }

    // Sistema VIP
    if(msg.channelId == "826193847943037018" && msg.mentions.everyone && msg.member.roles.cache.has("826197551904325712") && msg.member.permissionsIn(msg.channel).has("MENTION_EVERYONE") && !msg.member.permissions.has("ADMINISTRATOR")){
        msg.channel.permissionOverwrites.edit(msg.author.id, {"MENTION_EVERYONE": false,})
    }

    // Sistema de niveles
    let dataNvl = await nivelesDB.findById(servidorID), arrayMs = dataNvl.miembros, palabras = msg.content.split(/ +/g).filter(f=> f.length>=2), palabrasDatos = [], cantidad = 0,  xp = 0
    palabras.forEach((palabra) =>{
        if(palabrasDatos.some(s=>s.palabra == palabra)){
            palabrasDatos.find(f=>f.palabra == palabra).cantidad++
        }else{
            palabrasDatos.push({palabra: palabra, cantidad: 1})
        }
    })
    palabrasDatos.forEach((valor, ps) => {
        let condicional = palabras.length>=10 ? Math.floor(palabras.length/10): 1
        if(valor.cantidad > condicional){
            cantidad+=condicional
        }else{
            cantidad+=valor.cantidad
        }
    })
    xp = cantidad>10 && cantidad<60 ? Math.floor(cantidad/2): cantidad>60 ? Math.floor(cantidad/2/2): cantidad

    if(msg.guild.channels.cache.filter(f=> ["827295364167237644", "785729364288339978"].some(s=>s == f.parentId)).some(s=>s.id == msg.channelId)){
        xp = Math.floor(xp/3)
    }else{
        if(msg.guild.channels.cache.filter(f=> ["773249398431809587", "833120722695487518", "785352540840525864", "876678052787142697", "891378860392853564"].some(s=>s == f.parentId)).some(s=>s.id == msg.channelId)){
            xp = Math.floor(xp/2)
        }else{
            if(msg.channelId == "773404850972524615"){
                let miembroDB = dataNvl.miembros.find(f=> f.id == msg.author.id)
                if(miembroDB){
                    if(miembroDB.nivel >= 20 && miembroDB.nivel <= 40){
                        xp += Math.floor(xp/4)
                    }
                    if(miembroDB.nivel >= 40 && miembroDB.nivel <= 60){
                        xp += Math.floor(xp/3)
                    }
                    if(miembroDB.nivel >= 60 && miembroDB.nivel <= 80){
                        xp += Math.floor(xp/2)
                    }
                    if(miembroDB.nivel >= 80){
                        xp += xp
                    }
                }else{
                    if(xp >= 10 && xp <= 20){
                        xp+=1
                    }
                    if(xp >= 20 && xp <= 40){
                        xp+=2
                    }
                    if(xp >= 40 && xp <= 80){
                        xp+=3
                    }
                    if(xp >= 80 && xp <= 160){
                        xp+=4
                    }
                }
            }
        }
    }
    
    async function niveles () {
        let miembroDB = arrayMs.find(f=> f.id == msg.author.id), enfriamiento = 30000
        if(!cooldowns.has("niveles")){
            cooldowns.set("niveles", new Discord.Collection())
        }

        const tiempoActual = Date.now(), datosComando = cooldowns.get("niveles")

        if(!datosComando.has(msg.author.id)){
            
            if(miembroDB.xp+xp > miembroDB.lmt){
                miembroDB.nivel++
                miembroDB.xp = miembroDB.xp+xp-miembroDB.lmt
                miembroDB.lmt += Math.floor(miembroDB.lmt/2)
                miembroDB.tag = msg.author.tag
                const embSubio = new Discord.MessageEmbed()
                .setTitle(`<:LvlUp:967475913707114507> Nuevo nivel`)
                .setDescription(`🎉 ¡**Felicidades** ${msg.author} has suvido al nivel **${miembroDB.nivel}**.!`)
                .setColor(msg.member.displayHexColor)
                msg.guild.channels.cache.get(dataNvl.canalID).send({embeds: [embSubio], content: `<@${msg.author.id}>`})
    
                if(miembroDB.xp > miembroDB.lmt){
                    miembroDB.xp = 0
                }
            }else{
                miembroDB.xp += xp
            }
        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, enfriamiento)
    }
    if(dataNvl.miembros.some(s=>s.id == msg.author.id)){
        niveles()
        await nivelesDB.findByIdAndUpdate(servidorID, {miembros: arrayMs})
        
    }else{
        arrayMs.push({id: msg.author.id, tag: msg.author.tag, nivel: 0, lmt: 10, xp: xp})
        niveles()
        await nivelesDB.findByIdAndUpdate(servidorID, {miembros: arrayMs})
    }

    // PromoNvl
    if(msg.channelId == "977427047343325284"){
        if(["831671368776024104", "831671377396367360", "838498326512140329", "838498329650003969", "876273805494988821", "876273903452975134", "876274096990724097", "876274137239265340", "891446815700967434", "891446820851564584", "891446820851564584", "971515112567476354", "971515118837956699", "971515126144442448"].some(s=> msg.member.roles.cache.has(s))){
            let dataPrl = await promoNvlDB.findById(servidorID), arrayPl = dataPrl.miembros
            msg.channel.permissionOverwrites.edit(msg.author.id, {"SEND_MESSAGES": false,})
            if(msg.member.roles.cache.has("831671368776024104")){
                if(arrayPl.some(s=> s.id==msg.author.id)){
                    let miembro = arrayPl.find(f=> f.id==msg.author.id)
                    miembro.tag = msg.author.tag
                    miembro.tiempo = Math.floor(Date.now()+ms("6d"))
                    miembro.notificado = false
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }else{
                    arrayPl.push({id: msg.author.id, tag: msg.author.tag, tiempo: Math.floor(Date.now()+ms("6d")), notificado: false})
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }
            }
            if(msg.member.roles.cache.has("831671377396367360")){
                if(arrayPl.some(s=> s.id==msg.author.id)){
                    let miembro = arrayPl.find(f=> f.id==msg.author.id)
                    miembro.tag = msg.author.tag
                    miembro.tiempo = Math.floor(Date.now()+ms("5d"))
                    miembro.notificado = false
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }else{
                    arrayPl.push({id: msg.author.id, tag: msg.author.tag, tiempo: Math.floor(Date.now()+ms("5d")), notificado: false})
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }
            }
            if(msg.member.roles.cache.has("838498326512140329")){
                if(arrayPl.some(s=> s.id==msg.author.id)){
                    let miembro = arrayPl.find(f=> f.id==msg.author.id)
                    miembro.tag = msg.author.tag
                    miembro.tiempo = Math.floor(Date.now()+ms("4d"))
                    miembro.notificado = false
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }else{
                    arrayPl.push({id: msg.author.id, tag: msg.author.tag, tiempo: Math.floor(Date.now()+ms("4d")), notificado: false})
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }
            }
            if(msg.member.roles.cache.has("838498329650003969")){
                if(arrayPl.some(s=> s.id==msg.author.id)){
                    let miembro = arrayPl.find(f=> f.id==msg.author.id)
                    miembro.tag = msg.author.tag
                    miembro.tiempo = Math.floor(Date.now()+ms("3d"))
                    miembro.notificado = false
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }else{
                    arrayPl.push({id: msg.author.id, tag: msg.author.tag, tiempo: Math.floor(Date.now()+ms("3d")), notificado: false})
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }
            }
            if(msg.member.roles.cache.has("876273805494988821")){
                if(arrayPl.some(s=> s.id==msg.author.id)){
                    let miembro = arrayPl.find(f=> f.id==msg.author.id)
                    miembro.tag = msg.author.tag
                    miembro.tiempo = Math.floor(Date.now()+ms("2d"))
                    miembro.notificado = false
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }else{
                    arrayPl.push({id: msg.author.id, tag: msg.author.tag, tiempo: Math.floor(Date.now()+ms("2d")), notificado: false})
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }
            }
            if(msg.member.roles.cache.has("876273903452975134")){
                if(arrayPl.some(s=> s.id==msg.author.id)){
                    let miembro = arrayPl.find(f=> f.id==msg.author.id)
                    miembro.tag = msg.author.tag
                    miembro.tiempo = Math.floor(Date.now()+ms("1d"))
                    miembro.notificado = false
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }else{
                    arrayPl.push({id: msg.author.id, tag: msg.author.tag, tiempo: Math.floor(Date.now()+ms("1d")), notificado: false})
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }
            }
            if(msg.member.roles.cache.has("876274096990724097")){
                if(arrayPl.some(s=> s.id==msg.author.id)){
                    let miembro = arrayPl.find(f=> f.id==msg.author.id)
                    miembro.tag = msg.author.tag
                    miembro.tiempo = Math.floor(Date.now()+ms("12h"))
                    miembro.notificado = false
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }else{
                    arrayPl.push({id: msg.author.id, tag: msg.author.tag, tiempo: Math.floor(Date.now()+ms("12h")), notificado: false})
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }
            }
            if(["876274137239265340", "891446815700967434", "891446820851564584", "891446820851564584", "971515112567476354", "971515118837956699", "971515126144442448"].some(s=> msg.member.roles.cache.has(s))){
                if(arrayPl.some(s=> s.id==msg.author.id)){
                    let miembro = arrayPl.find(f=> f.id==msg.author.id)
                    miembro.tag = msg.author.tag
                    miembro.tiempo = Math.floor(Date.now()+ms("6h"))
                    miembro.notificado = false
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }else{
                    arrayPl.push({id: msg.author.id, tag: msg.author.tag, tiempo: Math.floor(Date.now()+ms("6h")), notificado: false})
                    await promoNvlDB.findByIdAndUpdate(servidorID, {miembros: arrayPl})
                }
            }
        }
    }
    
    // Memes
    if(msg.channelId == "845396662930112533"){
        let mci = msg.content
        if(msg.attachments.size >= 1 || mci.includes(".png") || mci.includes(".jpg") || mci.includes(".mp4")){
            msg.react("😂")
            msg.react("😴")
            
        }
    }

    // Chat
    if(msg.channelId == "773404850972524615"){
        // Boost/mejoras
        if(msg.type == "USER_PREMIUM_GUILD_SUBSCRIPTION"){
            const embBoost = new Discord.MessageEmbed()
            .setTitle(`<a:BoostAnimado:931289485700911184> Nueva mejora`)
            .setDescription(`**Gracias** ${msg.author} por la mejora, reclama tus recompensas abriendo un ticket en <#830165896743223327>.`)
            .setColor(msg.member.displayHexColor)
            setTimeout(()=>{
                msg.channel.send({embeds: [embBoost], content: `<@${msg.author.id}>`}).then(mb=> {
                    mb.pin()
                })
            }, 500)
        }
        if(msg.type == "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1"){
            const embBoostNivel1 = new Discord.MessageEmbed()
            .setTitle(`<a:BoostAnimado:931289485700911184> Nueva mejora y nuevo nivel`)
            .setDescription(`**Gracias** ${msg.author} por la mejora, por tu mejora el servidor alcanzo el nivel **1**, reclama tus recompensas abriendo un ticket en <#830165896743223327>.`)
            .setColor(msg.member.displayHexColor)
            setTimeout(()=>{
                msg.channel.send({embeds: [embBoostNivel1], content: `<@${msg.author.id}>`}).then(mb=> {
                    mb.pin()
                })
            }, 500)
        }
        if(msg.type == "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2"){
            const embBoostNivel2 = new Discord.MessageEmbed()
            .setTitle(`<a:BoostAnimado:931289485700911184> Nueva mejora y nuevo nivel`)
            .setDescription(`**Gracias** ${msg.author} por la mejora, por tu mejora el servidor alcanzo el nivel **2** reclama tus recompensas abriendo un ticket en <#830165896743223327>.`)
            .setColor(msg.member.displayHexColor)
            setTimeout(()=>{
                msg.channel.send({embeds: [embBoostNivel2], content: `<@${msg.author.id}>`}).then(mb=> {
                    mb.pin()
                })
            }, 500)
        }
        if(msg.type == "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3"){
            msg.channel.sendTyping()
            const embBoostNivel3 = new Discord.MessageEmbed()
            .setTitle(`<a:BoostAnimado:931289485700911184> Nueva mejora`)
            .setDescription(`**Gracias** ${msg.author} por la mejora, por tu mejora el servidor alcanzo el nivel **3** reclama tus recompensas abriendo un ticket en <#830165896743223327>.`)
            .setColor(msg.member.displayHexColor)
            setTimeout(()=>{
                msg.channel.send({embeds: [embBoostNivel3], content: `<@${msg.author.id}>`}).then(mb=> {
                    mb.pin()
                })
            }, 500)
        }

        let cantidad = Math.floor(Math.random()*(100-1)+1)
        if(msg.content.toLowerCase() == "hola" && cantidad >= 30 && cantidad <= 60){
            msg.channel.sendTyping()
            setTimeout(()=>{
                msg.reply("Hola")
            }, 600)
        }
        let xds = ["xd","jaja","jajaja","sjsjs","jsjs","jiji","XD","Xd","xD"]
        if(xds.some(s=> s == msg.content.toLowerCase()) && cantidad >= 30 && cantidad <= 60){
            msg.channel.sendTyping()
            setTimeout(()=>{
                msg.channel.send(xds[Math.floor(Math.random()*xds.length)])
            }, 600)
        }
    }

    if(msg.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){
        msg.channel.sendTyping()
        const embedMen = new Discord.MessageEmbed()
        .setAuthor(`Hola ${msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`Soy ${client.user.username}`)
        .setDescription(`**El bot de ${msg.guild.name}**, ¿necesitas información o ayuda?`)
        .addFields(
            {name: "<a:Info:926972188018479164> **Información**", value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>."},
            {name: "<:staff:925429848380428339> **Soporte**", value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento."}
        )
        .setColor(msg.guild.me.displayHexColor)
        .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
        .setTimestamp()
        setTimeout(()=>{
            msg.reply({embeds: [embedMen]})
        }, 400)
    }
})

// Comandos
client.on("messageCreate", async msg => {
    const prefijo = "|"

    if(msg.author.bot || !msg.content.startsWith(prefijo)) return;
    const args = msg.content.slice(prefijo.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase()


    if(comando == "ayuda"){
        msg.channel.sendTyping()
        const embedMen = new Discord.MessageEmbed()
        .setAuthor({name: `Hola ${msg.author.username}`, iconURL: msg.author.displayAvatarURL({dynamic: true})})
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`Soy ${client.user.username}`)
        .setDescription(`**El bot de ${msg.guild.name}**, ¿necesitas información o ayuda?`)
        .addFields(
            {name: "<a:Info:926972188018479164> **Información**", value: "Puedes obtener información sobre los canales y roles del servidor en el canal <#840364744228995092>."},
            {name: "<:staff:925429848380428339> **Soporte**", value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento."}
        )
        .setColor(msg.guild.me.displayHexColor)
        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL({dynamic: true})})
        .setTimestamp()
        setTimeout(()=>{
            msg.reply({embeds: [embedMen]})
        }, 400)
    }

    //Comandos
    if(comando == "comandos" || comando == "cmds"){
        msg.channel.sendTyping()
        let descripcion = ""

        if(args[0] == "creator" && msg.author.id == creadorID){
            descripcion = `**🌐 Generales:**\n\`\`${prefijo}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefijo}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.\n\n**🔰 Moderación:**\n\`\`/examen\`\` **|** Publica la encuesta para postularse.\n\`\`/limpiar\`\` **|** Elimina mensajes de un canal.\n\`\`/encarcelar\`\` **|** Envia a un miembro a la cárcel.\n\`\`/expulsar\`\` **|** Expulsa a un miembro.\n\`\`/banear\`\` **|** Banea a un miembro.\n\`\`/desbanear\`\` **|** Elimina el ban a un usuario.\n\n**⚜️ Administración:**\n\`\`${prefijo}addreaction\`\` **|** Agrega una reacción a un mensaje por medio del bot.\n\`\`${prefijo}eliminarcolaborador\`\` **|** Elimina el canal del colaborador y el rol colaborador del miembro.\n\n💎 **Creador:**\n\`\`${prefijo}addalianzas\`\` **|** Agrega alianzas a un miembro del servidor.\n\`\`${prefijo}removealianzas\`\` **|** Elimina alianzas de un miembro.\n\`\`${prefijo}removeusersystemali\`\` **|** Elimina un miembro del sistema de alianzas.\n\`\`${prefijo}expulsarpersonal\`\` **|** Elimina un miembro del personal del sistema y le elimina todos los roles del personal.`
        }else{
            if(msg.member.permissions.has("ADMINISTRATOR")){
                descripcion = `**🌐 Generales:**\n\`\`${prefijo}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefijo}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.\n\n**🔰 Moderación:**\n\`\`/examen\`\` **|** Publica la encuesta para postularse.\n\`\`/limpiar\`\` **|** Elimina mensajes de un canal.\n\`\`/encarcelar\`\` **|** Envia a un miembro a la cárcel.\n\`\`/expulsar\`\` **|** Expulsa a un miembro.\n\`\`/banear\`\` **|** Banea a un miembro.\n\`\`/desbanear\`\` **|** Elimina el ban a un usuario.\n\n**⚜️ Administración:**\n\`\`${prefijo}addreaction\`\` **|** Agrega una reacción a un mensaje por medio del bot.\n\`\`${prefijo}eliminarcolaborador\`\` **|** Elimina el canal del colaborador y el rol colaborador del miembro.`
            }else{
                if(msg.member.roles.cache.get("773271945894035486")){
                    descripcion = `**🌐 Generales:**\n\`\`${prefijo}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefijo}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.\n\n**🔰 Moderación:**\n\`\`/examen\`\` **|** Publica la encuesta para postularse.\n\`\`/limpiar\`\` **|** Elimina mensajes de un canal.\n\`\`/encarcelar\`\` **|** Envia a un miembro a la cárcel.\n\`\`/expulsar\`\` **|** Expulsa a un miembro.\n\`\`/banear\`\` **|** Banea a un miembro.\n\`\`/desbanear\`\` **|** Elimina el ban a un usuario.`
                }else{
                    if(!msg.member.roles.cache.get("773271945894035486") || !msg.member.permissions.has("ADMINISTRATOR")){
                        descripcion = `**🌐 Generales:**\n\`\`${prefijo}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefijo}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.`
                    }
                }    
            }
        }

        const embComandos = new Discord.MessageEmbed()
        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("📃 Comandos")
        .setDescription(descripcion)
        .setColor(msg.guild.me.displayHexColor)
        .setFooter(msg.guild.name ,msg.guild.iconURL({dynamic: true}))
        .setTimestamp()
        setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embComandos]})
        }, 400)
    }
    
    //Comandos de moderacion
    if(comando == "encuesta" || comando == "test"){
        msg.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojiError} Error`)
        .setDescription(`No eres staff de este servidor, no puedes usar este comando.`)
        .setColor(colorErr)
        .setTimestamp()
        if(!msg.member.roles.cache.has("887444598715219999") && !msg.member.permissions.has("ADMINISTRATOR")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                tm.delete().catch(c=>{
                    return;
                })
            }, 30000))
        }, 400)

        const embEncuesta = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle(`<:diamante:787455888432168971> Postulación a **Ayudante** <:diamante:787455888432168971>`)
        .setDescription(`\`\`1.\`\` ¿Cuál es tu edad?\n\`\`2.\`\` ¿Por que quieres ser ayudante?\n\`\`3.\`\` ¿Cuánto tiempo le dedicarías al servidor?\n\`\`4.\`\` ¿Serias activo en el chat?\n\`\`5.\`\` ¿Que harías si miras a un Mod/Admi abusando de su rango?\n\`\`6.\`\` ¿Sabes bien la información de los roles/canales del servidor?\n\`\`7.\`\` Al estar en una situación difícil de controlar. ¿Qué harías?\n\`\`8.\`\` ¿Tienes paciencia?\n\`\`9.\`\` ¿Estas comprometido/a en que una ves siendo staff todo lo que mires se quedara solo en el grupo del staff?\n\`\`10.\`\` ¿Cómo ayudarías/Guiarías a un usuario?\n\`\`11.\`\` ¿Tienes experiencia siendo helper/ayudante?\n\`\`12.\`\` ¿Cómo conociste este server?\n\`\`13.\`\` ¿Cuál es tu pasado en Discord?\n\`\`14.\`\` ¿Alguna vez formaste parte de una squad o raideaste?\n\`\`15.\`\` Para ti, ¿De que se encarga un helper/ayudante?\n\n<:Pikachu_Feliz:925799716585881640> **Recuerda lo que aquí más importa es tu sinceridad, honestidad y conocimiento.** <:Pikachu_Feliz:925799716585881640>`)
        .setColor(msg.guild.roles.cache.get("831669132607881236").hexColor)
        .setFooter(`${msg.guild.name} - 2022`,msg.guild.iconURL({dynamic: true}))
        .setTimestamp()
        setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEncuesta]})
        }, 400)
    }

    // Comandos de administradores
    if(comando == "addrc" || comando== "addreaction"){
        msg.channel.sendTyping()
        const embErrP = new Discord.MessageEmbed()
        .setTitle(`${emojiError} Error`)
        .setDescription(`No eres administrador en el servidor por lo tanto no puedes ejecutar el comando.`)
        .setColor(colorErr)
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP]}).then(tnt => setTimeout(()=>{
                tnt.delete().catch(c=>{
                    return;
                })
                msg.delete().catch(c=>{
                    return;
                })
            }, 30000));
        }, 400)

        let emojis = msg.guild.emojis.cache.map(e=>e)

        const embInfo = new Discord.MessageEmbed()
        .setTitle("Comando addreaction")
        .addFields(
            {name: `**Uso:**`, value: `\`\`${prefijo}addr <ID del mensaje> <nombre del emoji o ID del emoji>\`\`\n\`\`${prefijo}addr <Mencion del canal o ID> <ID del menseje> <nombre del emoji o ID>\`\``},
            {name: `**Ejemplos:**`, value: `${prefijo}addr ${msg.id} ${emojis[Math.floor(Math.random()*emojis.length)].name}\n${prefijo}addr ${msg.id} ${emojis[Math.floor(Math.random()*emojis.length)].id}\n${prefijo}addr ${msg.channel} ${msg.id} ${emojis[Math.floor(Math.random()*emojis.length)].name}\n${prefijo}addr ${msg.channel} ${msg.id} ${emojis[Math.floor(Math.random()*emojis.length)].id}\n${prefijo}addr ${msg.channel.id} ${msg.id} ${emojis[Math.floor(Math.random()*emojis.length)].name}\n${prefijo}addr ${msg.channel.id} ${msg.id} ${emojis[Math.floor(Math.random()*emojis.length)].id}\n`}
        )
        .setColor("#060606")
        .setFooter("Agrega una reaccion con el emoji que quieras a un mensaje por medio del bot.",client.user.displayAvatarURL())
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 400)  

        let canal = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0])
        if(canal){
            let descripciones = [`El argumento numérico  ingresado *(${args[1]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[1]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[1]}*) no es una ID de un mensaje.`]
            let condicionales = [!isNaN(args[1]) && args[1].length < 18, !isNaN(args[1]) && args[1].length > 18, isNaN(args[1])]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(descripciones[i])
                    .setColor(colorErr)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        },40000));
                    }, 500)
                }
            }
            await canal.messages.fetch(args[1], {force: true}).then(mensage =>{
                let emoji = msg.guild.emojis.cache.find(f=> f.name === args[2] || f.id === args[2])

                const embErr1 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`No pude encontrar al emoji, asegúrate de proporcionar el nombre o su ID correctamente.`)
                .setColor(colorErr)
                .setTimestamp()
                if(!emoji) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tnt => setTimeout(()=>{
                        tnt.delete().catch(c=>{
                            return;
                        })
                        msg.delete().catch(c=>{
                            return;
                        })
                    }, 30000));
                }, 400)

                const embAddReact = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("<a:afirmativo:856966728806432778> Reacción agregada al mensaje")
                .setDescription(`He agregado la reaccion con el emoji ${emoji} al [mensaje](${mensage.url}) con la ID ${args[1]} que esta en el canal ${canal}`)
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()

                mensage.react(emoji).then(em=>{
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddReact]})
                    }, 400)
                })
            }).catch(c=>{
                const embErrP = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`No encontré el mensaje, asegúrate de proporcionar bien la ID del mensaje.`)
                .setColor(colorErr)
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP]}).then(tnt => setTimeout(()=>{
                        tnt.delete().catch(c=>{
                            return;
                        })
                        msg.delete().catch(c=>{
                            return;
                        })
                    }, 30000));
                }, 400)
            })
        }else(
            await msg.channel.messages.fetch(args[0], {force: true}).then(onliMSG=>{
                let emoji = msg.guild.emojis.cache.find(f=> f.name === args[1] || f.id === args[1])

                const embErr1 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`No pude encontrar al emoji, asegúrate de proporcionar el nombre o su ID correctamente.`)
                .setColor(colorErr)
                .setTimestamp()
                if(!emoji) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tnt => setTimeout(()=>{
                        tnt.delete().catch(c=>{
                            return;
                        })
                        msg.delete().catch(c=>{
                            return;
                        })
                    }, 30000));
                }, 400)

                const embAddReact = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("<a:afirmativo:856966728806432778> Reacción agregada al mensaje")
                .setDescription(`He agregado la reaccion con el emoji ${emoji} al [mensaje](${onliMSG.url}) con la ID ${args[0]} en este canal`)
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()

                onliMSG.react(emoji).then(em=>{
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddReact]})
                    }, 400)
                })
            }).catch(c=>{
                const embErrP = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`No encontré el mensaje, asegúrate de proporcionar bien la ID del mensaje.`)
                .setColor(colorErr)
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP]}).then(tnt => setTimeout(()=>{
                        tnt.delete().catch(c=>{
                            return;
                        })
                        msg.delete().catch(c=>{
                            return;
                        })
                    }, 30000));
                }, 400)
            })
        )
    }

    if(comando == "roles" && msg.author.id == creadorID){
        const embGenero = new Discord.MessageEmbed()
        .setTitle("♀️♂️ Roles de género")
        .setDescription(`Elige una opción en el menú de abajo para agregarte un rol y así determinar tu género dentro del servidor.\n\n**<@&828720344869240832>\n\n<@&828720347246624769>**`)
        .setColor(msg.guild.me.displayHexColor)

        const menuGenero = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("genero")
            .setPlaceholder("📑 Elige una opción para obtener un rol.")
            .addOptions(
                [
                    {
                        label: "Mujer",
                        emoji: "👩",
                        description: "Obtienes un rol que te determina como mujer.",
                        value: "mujer"
                    },
                    {
                        label: "Hombre",
                        emoji: "👨",
                        description: "Obtienes un rol que te determina como hombre.",
                        value: "hombre"
                    }   
                ]
            )
        )

        const embEdad = new Discord.MessageEmbed()
        .setTitle("🔢 Roles de edad")
        .setDescription(`Elije una opción en el menú de abajo para agregarte un rol de edad y así determinar tu edad dentro del servidor.\n\n**<@&828720200924790834>\n\n<@&828720340719894579>**`)
        .setColor(msg.guild.me.displayHexColor)

        const menuEdad = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("edad")
            .setPlaceholder("📑 Elige una opción para obtener un rol.")
            .addOptions(
                [
                    {
                        label: "-18",
                        emoji: "🌗",
                        description: "Obtienes un rol que te determina como menor de edad.",
                        value: "-18"
                    },
                    {
                        label: "+18",
                        emoji: "🌕",
                        description: "Obtienes un rol que te determina como mayor de edad.",
                        value: "+18"
                    }
                ]
            )
        )
        
        const embVideojuegos = new Discord.MessageEmbed()
        .setTitle("🎮 Roles de videojuegos")
        .setDescription(`Elige una o más opciones en el menú de abajo para obtener un rol del videojuego que te guste y así los demás miembros sabrán que videojuegos te gustan.\n\n**<@&886331637690953729>\n\n<@&886331642074005545>\n\n<@&886331630690631691>\n\n<@&885005724307054652>\n\n<@&886331626643152906>\n\n<@&886331634272587806>**`)
        .setColor(msg.guild.me.displayHexColor)

        const menuVideojuegos = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("videojuegos")
            .setPlaceholder("📑 Elige una opción para obtener un rol.")
            .addOptions(
                [
                    {
                        label: "Fornite",
                        emoji: "☂️",
                        description: "Obtienes el rol de Fornite.",
                        value: "fornite"
                    },
                    {
                        label: "Minecraft",
                        emoji: "⛏️",
                        description: "Obtienes el rol de Minecraft.",
                        value: "minecraft"
                    },
                    {
                        label: "Free Fire",
                        emoji: "🔫",
                        description: "Obtienes el rol de Free Fire.",
                        value: "free"
                    },
                    {
                        label: "Roblox",
                        emoji: "💠",
                        description: "Obtienes el rol de Roblox.",
                        value: "roblox"
                    },
                    {
                        label: "GTA V",
                        emoji: "🚗",
                        description: "Obtienes el rol de GTA V.",
                        value: "GTA"
                    },
                    {
                        label: "Among Us",
                        emoji: "🔍",
                        description: "Obtienes el rol de Among Us.",
                        value: "amongus"
                    },
                ]
            )
        )

        const embColores = new Discord.MessageEmbed()
        .setTitle("🌈 Roles de colores")
        .setDescription(`Elige una opción para obtener un rol que cambiará el color de tu nombre dentro del servidor.\n\n**<@&825913849504333874>\n\n<@&825913858446327838>\n\n<@&825913837944438815>\n\n<@&823639766226436146>\n\n<@&823639778926395393>\n\n<@&825913846571991100>\n\n<@&823639775499386881>\n\n<@&825913860992270347>\n\n<@&825913843645546506>\n\n<@&823639769300467724>\n\n<@&825913834803560481>\n\n<@&825913840981901312>\n\n<@&825913855392743444>\n\n<@&825913852654780477>**`)
        .setColor(msg.guild.me.displayHexColor)

        const menuColores = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("colores")
            .setPlaceholder("📑 Elige una opción para obtener un rol.")
            .addOptions(
                [
                    {
                        label: "Negro",
                        emoji: "🎩",
                        description: "Pinta tu nombre de color Negro.",
                        value: "negro"
                    },
                    {
                        label: "Café ",
                        emoji: "🦂",
                        description: "Pinta tu nombre de color Café .",
                        value: "cafe"
                    },
                    {
                        label: "Naranja",
                        emoji: "🍊",
                        description: "Pinta tu nombre de color Naranja.",
                        value: "naranja"
                    },
                    {
                        label: "Rojo",
                        emoji: "🍎",
                        description: "Pinta tu nombre de color Rojo.",
                        value: "rojo"
                    },
                    {
                        label: "Rosa",    
                        emoji: "🌷",
                        description: "Pinta tu nombre de color Rosa.",
                        value: "rosa"
                    },
                    {
                        label: "Morado",
                        emoji: "☂️",
                        description: "Pinta tu nombre de color Morado.",
                        value: "morado"
                    },
                    {
                        label: "Azul",
                        emoji: "💧",
                        description: "Pinta tu nombre de color Azul.",
                        value: "azul"
                    },
                    {
                        label: "Azul celeste",
                        emoji: "🐬",
                        description: "Pinta tu nombre de color Azul celeste.",
                        value: "celeste"
                    },
                    {
                        label: "Cian",
                        emoji: "🧼",
                        description: "Pinta tu nombre de color Cian.",
                        value: "cian"
                    },
                    {
                        label: "Verde",
                        emoji: "🌲",
                        description: "Pinta tu nombre de color Verde.",
                        value: "verde"
                    },
                    {
                        label: "Verde Lima",
                        emoji: "🍀",
                        description: "Pinta tu nombre de color Verde Lima.",
                        value: "lima"
                    },
                    {
                        label: "Amarillo",
                        emoji: "🍌",
                        description: "Pinta tu nombre de color Amarillo.",
                        value: "amarillo"
                    },
                    {
                        label: "Gris",
                        emoji: "🐺",
                        description: "Pinta tu nombre de color Gris.",
                        value: "gris"
                    },
                    {
                        label: "Blanco",
                        emoji: "☁️",
                        description: "Pinta tu nombre de color Blanco",
                        value: "blanco"
                    }
                ]
            )
        )
                                                                                                                                                                                                                                                                                                                                             
        const embNotificaciones = new Discord.MessageEmbed()
        .setTitle("🔔 Roles de notificaciones")
        .setDescription(`Elige una opción para obtener un rol que te notificará de nuevos anuncios, alianzas, sorteos, encuestas, eventos, sugerencias de la comunidad o postulaciones a staff del servidor o puedes obtener un rol que te notifica cuando se necesite revivir el chat general el cual es <@&850932923573338162> y puede ser muy usado.\n\n**<@&840704358949584926>\n\n<@&840704364158910475>\n\n<@&840704370387451965>\n\n<@&840704372911505418>\n\n<@&915015715239637002>\n\n<@&840704367467954247>\n\n<@&840704375190061076>\n\n<@&850932923573338162>**`)
        .setColor(msg.guild.me.displayHexColor)

        const menuNotificaciones = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("notificaciones")
            .setPlaceholder("📑 Elige una opción para obtener un rol.")
            .addOptions(
                [ 
                    {
                        label: "Anuncios",
                        emoji: "📢",
                        description: "Te notifica cuándo haya un nuevo Anuncio.",
                        value: "anuncio"
                    },
                    {
                        label: "Alianzas",
                        emoji: "🤝",
                        description: "Te notifica cuándo haya una nueva Alianza.",
                        value: "alianza"
                    },
                    {
                        label: "Sorteos",
                        emoji: "🎉",
                        description: "Te notifica cuándo haya un nuevo Sorteo.",
                        value: "sorteo"
                    },
                    {
                        label: "Encuestas",
                        emoji: "📊",
                        description: "Te notifica cuándo haya una nueva Encuesta.",
                        value: "encuesta"
                    },
                    {
                        label: "Evento",
                        emoji: "🥳",
                        description: "Te notifica cuándo haya un nuevo Evento.",
                        value: "evento"
                    },
                    {
                        label: "Sugerencias",
                        emoji: "📧",
                        description: "Te notifica cuándo haya una nueva Sugerencia.",
                        value: "sugerencia"
                    },
                    {
                        label: "Postulaciones",
                        emoji: "📝",
                        description: "Te notifica cuándo haya una actualización sobre las Postulaciones.",
                        value: "postulacion"
                    },
                    {
                        label: "Revivir chat",
                        emoji: "❇️",
                        description: "Te notifica cuándo se necesite Revivir el chat general.",
                        value: "revivir"
                    },
                ]
            )
        )

        msg.channel.send("https://cdn.discordapp.com/attachments/901313790765854720/941377157521883216/roles_svsp.gif").then(tm=>{
            msg.channel.send({embeds: [embGenero], components: [menuGenero]})
            msg.channel.send({embeds: [embEdad], components: [menuEdad]})
            msg.channel.send({embeds: [embVideojuegos], components: [menuVideojuegos]})
            msg.channel.send({embeds: [embColores], components: [menuColores]})
            msg.channel.send({embeds: [embNotificaciones], components: [menuNotificaciones]})
        })
    }

    if(comando == "ticket" && msg.member.permissions.has("ADMINISTRATOR")){
        const embTicket = new Discord.MessageEmbed()
        .setTitle(`<:ticket:962122515348590623> Tickets`)
        .setDescription(`Para crear un ticket has clic en el boton de abajo.`)
        .addFields(
            {name: `❓ **¿Qué es un Ticket?**`, value: `Es un canal privado en el cual solo tu y el equipo de soporte pueden ver y utilizar, en el cual el equipo se encargará de resolver tus dudas y ayudarte en lo que necesites y esté a nuestro alcance.`},
            {name: `⛔ **¿Qué no deves de hacer?**`, value: `No debes de abrir tickets solo por diversión y no trates mal a el miembro de soporte que te atienda, nosotros seremos amables contigo, en caso de que algún miembro no te trate bien reportalo por MD a <@717420870267830382>.`},
            // {name: ``, value: ``},
            // {name: ``, value: ``},
        )
        .setColor(msg.guild.me.displayHexColor)
        .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
        .setTimestamp()

        const boton = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setCustomId("crearTicket")
            .setEmoji("962127203645136896")
            .setLabel("Crear ticket")
            .setStyle("SUCCESS")
        )
        msg.channel.send({embeds: [embTicket], components: [boton]}).then(tm => {
            msg.delete().catch(c=> console.log(c))
        })
    }

    if(comando == "informacion" && msg.member.permissions.has("ADMINISTRATOR")){
        const embInformacion = new Discord.MessageEmbed()
        .setTitle(`<a:Info:926972188018479164> Información`)
        .setDescription(`Utiliza el menú de abajo para obtener información sobre la opción que elijas.`)
        .setColor(msg.guild.me.displayHexColor)

        const menu = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("información_jaja")
            .setPlaceholder(`📚 ¡Selecciona una opción!`)
            .addOptions([
                {
                    label: `Servidor`,
                    emoji: `💚`,
                    description: `Muestra información del servidor.`,
                    value: `servidor`
                },
                {
                    label: `Categoría importante`,
                    emoji: `💠`,
                    description: `Muestra información de los canales de esa categoría.`,
                    value: `categoría-importante`
                },
                {
                    label: `Categoría colaboradores`,
                    emoji: `💎`,
                    description: `Muestra información de la categoría.`,
                    value: `categoría-colaboradores`
                },
                {
                    label: `Categoría Promociones VIP`,
                    emoji: `✨`,
                    description: `Muestra información de los canales de esa categoría.`,
                    value: `categoría-promociones-vip`
                },
                {
                    label: `Categoría promociónate`,
                    emoji: `📣`,
                    description: `Muestra información de los canales de esa categoría.`,
                    value: `categoría-promociónate`
                },
                {
                    label: `Categoría general`,
                    emoji: `🧭`,
                    description: `Muestra información de los canales de esa categoría.`,
                    value: `categoría-general`
                },
                {
                    label: `Categoría user x user`,
                    emoji: `👥`,
                    description: `Muestra información de los canales de esa categoría.`,
                    value: `categoría-user-x-user`
                },
                {
                    label: `Categoría entretenimiento`,
                    emoji: `🎮`,
                    description: `Muestra información de los canales de esa categoría.`,
                    value: `categoría-entretenimiento`
                },
                {
                    label: `Categoría audio`,
                    emoji: `🔊`,
                    description: `Muestra información de los canales de esa categoría.`,
                    value: `categoría-audio`
                },
                {
                    label: `Categoría registros`,
                    emoji: `📝`,
                    description: `Muestra información de los canales de esa categoría.`,
                    value: `categoría-registros`
                },
                {
                    label: `Categoría soporte`,
                    emoji: `🔰`,
                    description: `Muestra información de los canales de esa categoría.`,
                    value: `categoría-soporte`
                },
                {
                    label: `Categoría estadísticas`,
                    emoji: `📊`,
                    description: `Muestra información de los canales de esa categoría.`,
                    value: `categoría-estadísticas`
                },
                {
                    label: `Roles exclusivos`,
                    emoji: `🏆`,
                    description: `Muestra información de todos los roles exclusivos.`,
                    value: `roles-exclusivos`
                },
                {
                    label: `Roles personales`,
                    emoji: `🧑`,
                    description: `Muestra información de todos los roles personales.`,
                    value: `roles-personales`
                },
                {
                    label: `Roles de ping`,
                    emoji: `🔔`,
                    description: `Muestra información de todos los roles de ping o notificaciones.`,
                    value: `roles-ping`
                },
                {
                    label: `Roles de nivel`,
                    emoji: `🎖️`,
                    description: `Muestra información de todos los roles de nivel.`,
                    value: `roles-nivel`
                },
                {
                    label: `Roles color`,
                    emoji: `🌈`,
                    description: `Muestra información de todos los roles de color.`,
                    value: `roles-color`
                },
                {
                    label: `Roles de economía`,
                    emoji: `💸`,
                    description: `Muestra información de todos los roles de economía.`,
                    value: `roles-economía`
                },
                {
                    label: `Roles del personal`,
                    emoji: `👮`,
                    description: `Muestra información de los roles del personal del servidor.`,
                    value: `roles-personal`
                },
                {
                    label: `Otros roles`,
                    emoji: `♻️`,
                    description: `Muestra información de todos los demás roles.`,
                    value: `otros-roles`
                },
                {
                    label: `Bot del servidor`,
                    emoji: `🤖`,
                    description: `Muestra información del bot del servidor.`,
                    value: `bot-servidor`
                },
            ])
        )

        msg.channel.send({embeds: [embInformacion], components: [menu]}).then(tm=>{
            msg.delete()
        })
    }

    if(comando == "eliminarcolaborador" && msg.member.permissions.has("ADMINISTRATOR")){
        msg.channel.sendTyping()
        let dataCol = await colaboradoresDB.findById(servidorID), arrayCo = dataCol.colaboradores, miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])

        if(miembro){
            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojiError} Error`)
            .setDescription(`El miembro que has proporcionado *(${miembro})* no es colaborador del servidro.`)
            .setColor(colorErr)
            if(!dataCol.colaboradores.some(s=>s.id == miembro.id))return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(td=> setTimeout(()=>{
                    msg.delete().catch(c=>console.log(c))
                    td.delete().catch(c=>console.log(c))
                }, 20000))
            }, 400)

            let exColaborador = arrayCo.find(f=>f.id == miembro.id)
            miembro.roles.remove(dataCol.datos.rolID)
            msg.guild.channels.cache.get(exColaborador.canalID).delete(`El miembro ${miembro.user.tag} ya no es colaborador del servidor.`).then(async td=>{
                exColaborador.colaborador = false
                exColaborador.tiempo = false
                exColaborador.canalID = false
                exColaborador.fecha = Date.now()
                await colaboradoresDB.findByIdAndUpdate(servidorID, {colaboradores: arrayCo})
                const embEliminado = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setTitle(`<a:afirmativo:856966728806432778> Colaborador eliminado`)
                .setDescription(`El miembro ${miembro} ya no es colaborado del servidor.`)
                .setColor("GREEN")
                .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEliminado]})
                }, 400)
            })
        }else{
            const embError2 = new Discord.MessageEmbed()
            .setTitle(`${emojiError} Error`)
            .setDescription(`No has proporcionado a ningún miembro.`)
            .setColor(colorErr)
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(td=> setTimeout(()=>{
                    msg.delete().catch(c=>console.log(c))
                    td.delete().catch(c=>console.log(c))
                }, 20000))
            }, 400)
        }
    }

    if(comando == "addalianzas" && msg.author.id == creadorID){
        msg.channel.sendTyping()
        let dataAli = await alianzasDB.findOne({_id: msg.guildId}), arrayAl = dataAli.miembros, miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])

        if(miembro){
            const embAddAli = new Discord.MessageEmbed()
            .setTitle(`Alianzas agregadas`)
            .setDescription(`${msg.author} le a agregado **${args[1]}** alianzas a ${miembro}.`)
            .setColor("GREEN")
            if(arrayAl.some(s=>s.id == miembro.id)){
                arrayAl.forEach(async (valorAl) => {
                    if(valorAl.id == miembro.id){
                        valorAl.cantidad+=Number(args[1])
                        await alianzasDB.findByIdAndUpdate(msg.guildId, {miembros: arrayAl})
                        setTimeout(()=> {
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddAli]})
                        }, 400)
                    }
                })
            }else{
                arrayAl.push({tag: miembro.user.tag, id: miembro.id, cantidad: Number(args[1])})
                await alianzasDB.findByIdAndUpdate(msg.guildId, {miembros: arrayAl})
                setTimeout(()=> {
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddAli]})
                }, 400)
            }
        }else{
            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojiError} Error`)
            .setDescription(`No puede encontrar al miembro o has proporcionado mal al miembro.`)
            .setColor(colorErr)
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                    msg.delete().catch(c=> console.log(c))
                    et.delete().catch(c=> console.log(c))
                }, 20000))
            }, 400)
        }
    }
    
    if(comando == "removealianzas" && msg.author.id == creadorID){
        msg.channel.sendTyping()
        let dataAli = await alianzasDB.findOne({_id: msg.guildId}), arrayAl = dataAli.miembros, miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])

        if(miembro){
            const embAddAli = new Discord.MessageEmbed()
            .setTitle(`Alianzas eliminadas`)
            .setDescription(`${msg.author} le a eliminado **${args[1]}** alianzas a ${miembro}.`)
            .setColor("RED")
            if(arrayAl.some(s=>s.id == miembro.id)){
                arrayAl.forEach(async (valorAl) => {
                    if(valorAl.id == miembro.id){
                        valorAl.cantidad-=Number(args[1])
                        await alianzasDB.findByIdAndUpdate(msg.guildId, {miembros: arrayAl})
                        setTimeout(()=> {
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddAli]})
                        }, 400)
                    }
                })
            }else{
                arrayAl.push({tag: miembro.user.tag, id: miembro.id, cantidad: -Number(args[1])})
                await alianzasDB.findByIdAndUpdate(msg.guildId, {miembros: arrayAl})
                setTimeout(()=> {
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddAli]})
                }, 400)
            }
        }else{
            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojiError} Error`)
            .setDescription(`No puede encontrar al miembro o has proporcionado mal al miembro.`)
            .setColor(colorErr)
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                    msg.delete().catch(c=> console.log(c))
                    et.delete().catch(c=> console.log(c))
                }, 20000))
            }, 400)
        }
    }

    if(comando == "removeusersystemali" && msg.author.id == creadorID){
        msg.channel.sendTyping()
        let dataAli = await alianzasDB.findOne({_id: msg.guildId}), arrayAl = dataAli.miembros, miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])

        if(miembro){
            const embAddAli = new Discord.MessageEmbed()
            .setTitle(`Miembro eliminado del sistema`)
            .setDescription(`${msg.author} ha eliminado del sistema de alianzas al miembro ${miembro}.`)
            .setColor("GOLD")
            if(arrayAl.some(s=>s.id == miembro.id)){
                arrayAl.forEach(async (valorAl, posicion) => {
                    if(valorAl.id == miembro.id){
                        arrayAl.splice(posicion, 1)
                        await alianzasDB.findByIdAndUpdate(msg.guildId, {miembros: arrayAl})
                        setTimeout(()=> {
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddAli]})
                        }, 400)
                    }
                })
            }else{
                const embError2 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`El miembro que has proporcionado *(${miembro})* no esta en el sistema de alianza.`)
                .setColor(colorErr)
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(et=> setTimeout(()=>{
                        msg.delete().catch(c=> console.log(c))
                        et.delete().catch(c=> console.log(c))
                    }, 20000))
                }, 400)
            }
        }else{
            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojiError} Error`)
            .setDescription(`No puede encontrar al miembro o has proporcionado mal al miembro.`)
            .setColor(colorErr)
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                    msg.delete().catch(c=> console.log(c))
                    et.delete().catch(c=> console.log(c))
                }, 20000))
            }, 400)
        }
    }

    if(comando == "expulsarpersonal" && msg.author.id == creadorID){
        msg.channel.sendTyping()
        let dataPer = await personalDB.findById(servidorID), arrayPr = dataPer.personal, miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])
        
        if(miembro){
            let persona = arrayPr.find(f=> f.id==miembro.id)
            const embPersonalEliminado = new Discord.MessageEmbed()
            .setTitle(`Miembro del personal expulsado`)
            .setDescription(`${miembro} ha sido expulsado del personal del servidor.`)
            .setColor("GREEN")

            const embPersonalDM = new Discord.MessageEmbed()
            .setThumbnail(msg.guild.iconURL({dynamic: true}))
            .setTitle(`Has sido expulsado del personal de ${msg.guild.name}`)
            .setDescription(`${args[1] ? `**Razón:** ${args.splice(1).join(" ")}`: "*No han proporcionado una razón.*"}`)
            .setColor("RED")
            if(persona){
                persona.miembro = false
                persona.historial.push({fecha: Date.now(), accion: `Fue expulsado/a del personal del servidor por ${msg.author.tag} *(${msg.author.id})*.`})
                dataPer.datos.roles.map(m=> miembro.roles.remove(m))
                await personalDB.findByIdAndUpdate(servidorID, {personal: arrayPr})
            }
            miembro.send({embeds: [embPersonalDM]}).then(tdm => {
                embPersonalEliminado
                .setFooter(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                setTimeout(()=> {
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPersonalEliminado]})
                }, 400)
            }).catch(cdm => {
                embPersonalEliminado
                .setFooter(`No pude enviar el mensaje al ex miembro del personal.`, miembro.displayAvatarURL({dynamic: true}))
                setTimeout(()=> {
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPersonalEliminado]})
                }, 400)
            })

            const embRegistro = new Discord.MessageEmbed()
            .setAuthor(`Ejecutado por el dueño`, int.user.displayAvatarURL({dynamic: true}))
            .setTitle(`📝 Registro del comando p.expulsarpersonal`)
            .addFields(
                {name: `📌 **Utilizado en:**`, value: `${int.channel}\n**ID:** ${int.channelId}`},
                {name: `🚪 **Ex miembro del personal:**`, value: `${miembro}\n**ID:** ${miembro.id}`},
                {name: `📄 **Razón:**`, value: `${args[1] ? args.splice(1).join(" "): "*No han proporcionado una razón.*"}`}
            )
            .setColor("#00FF83")
            .setFooter(miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            int.guild.channels.cache.get(dataPer.datos.canalRegistro).send({embeds: [embRegistro]})

        }else{
            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojiError} Error`)
            .setDescription(`No puede encontrar al miembro o has proporcionado mal al miembro.`)
            .setColor(colorErr)
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                    msg.delete().catch(c=> console.log(c))
                    et.delete().catch(c=> console.log(c))
                }, 20000))
            }, 400)
        }
    }
})


// Auto moderacion
client.on("messageCreate",async msg => {
    if(msg.author.id == creadorID || msg.guildId != servidorID || msg.author.bot) return;

    let dataBot = await botDB.findById(client.user.id)
    let canalesPerIDs = msg.guild.channels.cache.filter(fc => dataBot.datos.autoModeracion.categoriasIgnorar.includes(fc.parentId)).map(mc => mc.id)
    let otrosIDCha = dataBot.datos.autoModeracion.canalesIgnorar
    for(let i=0; i<otrosIDCha.length; i++){
        canalesPerIDs.push(otrosIDCha[i])
    }

    if(msg.content == "p.canalesModerados"){
        if(msg.guild.ownerId === msg.author.id){
            let tabla = []
            for(let i=0; i<canalesPerIDs.length; i++){
                tabla.push(`**${i+1} .** <#${msg.guild.channels.cache.get(canalesPerIDs[i]).id}>`)
            }

            const embChaMod = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`Hay un total de **${canalesPerIDs.length}** canales que tienen des activada la auto moderación de enlaces.\n\n${tabla.join("\n")}`)
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embChaMod]})
        }
    }

    if(msg.member.roles.cache.has("887444598715219999") || msg.member.permissions.has("ADMINISTRATOR")) return;

    if(!canalesPerIDs.some(s=> s == msg.channelId)){
        let enlaces = [{urls: ["discord.gg/","discord.com/invite/"]},{urls: ["youtube.com","youtu.be"]},{urls: ["twitch.tv"]},{urls: ["tiktok.com","vm.tiktok.com"]},{urls: ["twitter.com"]},{urls: ["instagram.com"]},{urls: ["https:","http:",".com"]}]
        let titulos = ["<a:DiscordLogo:973995348974505984> Auto moderación de enlaces de Discord","<:youtubelogo:855166340780130354> Auto moderación de enlaces de YouTube","<:TwitchEmblema:855167274193125396> Auto moderación de enlaces de Twitch","<:Mamadatok:855167926875979837> Auto moderación de enlaces de TikTok",`<:TwitterLogo:855168545566490664> Auto moderación de enlaces de Twitter`,"<:instagram:855169028376494080> Auto moderación de enlaces de Instagram","🔗 Auto moderación de enlaces"]
        let descripciones = [` de **Discord**, el canal correcto para publicar un enlace de **Discord** es <#823381769750577163> o <#836315643070251008>`,` de **YouTube**, el canal correcto para publicar un enlace de **YouTube** es <#823961526297165845> o <#836315643070251008>`,` de **Twitch**, el canal correcto para publicar un enlace de **Twitch** es <#823381980389310464> o <#836315643070251008>`,` de **TikTok**, el canal correcto para publicar un enlace de **TikTok** es <#827295990360965153> o <#836315643070251008>`,` de **Twitter**, el canal correcto para publicar un enlace de **Twitter** es <#823381924344758313> o <#836315643070251008>`,` de **Instagram**, el canal correcto para publicar un enlace de **Instagram** es <#823382007391584276> o <#836315643070251008>`,`, si quiere hacer promoción hágalo en los canales de la categoría **<#785729364288339978>** como <#836315643070251008>.\nSi esta perdido y necesita ayuda mencione a un <@&831669132607881236>.`]
        let colores = ["#5965F1","#FE0100","#6441a5","#030303","#1CA1F3","#ED0D6E",colorErr]

        for(m in enlaces){
            let count = 0
            if(enlaces[m].urls.some(s=> msg.content.includes(s)) && count == 0){
                count++
                const embWarn = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle(titulos[m])
                .setDescription(`Lo ciento ${msg.author} en este canal no esta permitido publicar enlaces${descripciones[m]}`)
                .setColor(colores[m])
                .setFooter(`🛑 Advertencia por ${client.user.tag}`,client.user.displayAvatarURL())
                .setTimestamp()

                setTimeout(()=>{
                    msg.delete().catch(c=>console.log(c))

                    msg.channel.send({embeds: [embWarn], content: `<@${msg.author.id}>`}).then(tw=>{
                        setTimeout(()=>{
                            tw.delete().catch(c=>console.log(c))
                        },24000)
                    })
                }, 800)

                if(autoModeracion.some(s=> s.miembroID == msg.author.id)){
                    autoModeracion.forEach((valor, ps) =>{
                        if(valor.miembroID == msg.author.id){
                            valor.advertencias++
                            if(valor.advertencias >= 2){
                                const embAdvertenciaMD = new Discord.MessageEmbed()
                                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                                .setTitle(`🔗 Auto moderación de enlaces`)
                                .setDescription(`Esta prohibido publicar enlaces en en canal <#${msg.channelId}>, evita hacerlo de nuevo para no sancionarte.`)
                                .setColor(colorErr)
                                msg.author.send({embeds: [embAdvertenciaMD]}).catch(c=>console.log(c))
                            }

                            if(valor.advertencias == 3){
                                msg.member.timeout(4*60*60000, `Por auto moderación de enlaces, el miembro ha enviado ${valor.advertencias} enlaces en canales los cuales no esta permitido.`)
                            }
                            if(valor.advertencias == 4){
                                msg.member.timeout(8*60*60000, `Por auto moderación de enlaces, el miembro ha enviado ${valor.advertencias} enlaces en canales los cuales no esta permitido.`)
                            }
                            if(valor.advertencias == 5){
                                msg.member.timeout(10*60*60000, `Por auto moderación de enlaces, el miembro ha enviado ${valor.advertencias} enlaces en canales los cuales no esta permitido.`)
                            }
                            if(valor.advertencias == 6){
                                msg.member.kick(`Por auto moderación de enlaces, el miembro ha enviado ${valor.advertencias} enlaces en canales los cuales no esta permitido.`)
                            }
                            if(valor.advertencias == 7){
                                msg.member.ban(`Por auto moderación de enlaces, el miembro ha enviado ${valor.advertencias} enlaces en canales los cuales no esta permitido.`)
                            }
                        }
                    })
                }else{
                    autoModeracion.push({miembroID: msg.author.id, advertencias: 1})
                } 
                return;
            }
        }
    }

    let canales = [
        {id: "823381769750577163", color: "#5965F1", urls: ["discord.gg/","discord.com/invite/"], titulo: `<:DiscordLogo:855164382387109908> Auto moderación de enlaces de Discord`, descripcion: `Este canal no es el correcto para publicar enlaces de **Discord**, puedes publicar enlaces de Discord en su canal <#823381769750577163> o <#836315643070251008>.`},
        {id: "823961526297165845", color: "#FE0100", urls: ["youtube.com","youtu.be"], titulo: `<:youtubelogo:855166340780130354> Auto moderación de enlaces de YouTube`, descripcion: `Este canal no es el correcto para publicar enlaces de **YouTube**, puedes publicar enlaces de YouTube en su canal <#823961526297165845> o <#836315643070251008>.`},
        {id: "823381980389310464", color: "#6441a5", urls: ["twitch.tv"], titulo: `<:TwitchEmblema:855167274193125396> Auto moderación de enlaces de Twitch`, descripcion: `Este canal no es el correcto para publicar enlaces de **Twitch**, puedes publicar enlaces de Twitch en su canal <#823381980389310464> o <#836315643070251008>.`},
        {id: "823382007391584276", color: "#ED0D6E", urls: ["instagram.com"], titulo: `<:instagram:855169028376494080> Auto moderación de enlaces de Instagram`, descripcion: `Este canal no es el correcto para publicar enlaces de **Instagram**, puedes publicar enlaces de Instagram en su canal <#823382007391584276> o <#836315643070251008>.`},
        {id: "827295990360965153", color: "#030303", urls: ["tiktok.com","vm.tiktok.com"], titulo: `<:Mamadatok:855167926875979837> Auto moderación de enlaces de TikTok`, descripcion: `Este canal no es el correcto para publicar enlaces de **TikTok**, puedes publicar enlaces de TikTok en su canal <#827295990360965153> o <#836315643070251008>.`},
        {id: "823381924344758313", color: "#1CA1F3", urls: ["twitter.com"], titulo: `<:TwitterLogo:855168545566490664> Auto moderación de enlaces de Twitter`, descripcion: `Este canal no es el correcto para publicar enlaces de **Twitter**, puedes publicar enlaces de Twitter en su canal <#823381924344758313> o <#836315643070251008>.`}, 
    ]

    if(canales.some(s=> s.id == msg.channelId) && ["https://", "www", ".com"].some(s=> msg.content.includes(s))){
        let canal = canales.find(f=>f.id == msg.channelId)
        if(!canal.urls.some(s=> msg.content.includes(s))){
            canales.forEach((valorCh, psCh)=> {
                if(valorCh.urls.some(s=> msg.content.includes(s))){
                    const embAdvertencia = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle(valorCh.titulo)
                    .setDescription(valorCh.descripcion)
                    .setColor(valorCh.color)
                    .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
        
                    setTimeout(()=>{
                        msg.delete().catch(c=>console.log(c))
        
                        msg.channel.send({embeds: [embAdvertencia], content: `<@${msg.author.id}>`}).then(tw=>{
                            setTimeout(()=>{
                                tw.delete().catch(c=>console.log(c))
                            },24000)
                        })
                    }, 800)

                    if(autoModeracion.some(s=> s.miembroID == msg.author.id)){
                        autoModeracion.forEach((valor, ps) =>{
                            if(valor.miembroID == msg.author.id){
                                valor.advertencias++
                                if(valor.advertencias >= 2){
                                    const embAdvertenciaMD = new Discord.MessageEmbed()
                                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                                    .setTitle(`🔗 Auto moderación de enlaces`)
                                    .setDescription(`Esta prohibido publicar enlaces en en canal <#${msg.channelId}>, evita hacerlo de nuevo para no sancionarte.`)
                                    .setColor(colorErr)
                                    msg.author.send({embeds: [embAdvertenciaMD]}).catch(c=>console.log(c))
                                }
        
                                if(valor.advertencias == 3){
                                    msg.member.timeout(4*60*60000, `Por auto moderación de enlaces, el miembro ha enviado ${valor.advertencias} enlaces en canales los cuales no esta permitido.`)
                                }
                                if(valor.advertencias == 4){
                                    msg.member.timeout(8*60*60000, `Por auto moderación de enlaces, el miembro ha enviado ${valor.advertencias} enlaces en canales los cuales no esta permitido.`)
                                }
                                if(valor.advertencias == 5){
                                    msg.member.timeout(10*60*60000, `Por auto moderación de enlaces, el miembro ha enviado ${valor.advertencias} enlaces en canales los cuales no esta permitido.`)
                                }
                                if(valor.advertencias == 6){
                                    msg.member.kick(`Por auto moderación de enlaces, el miembro ha enviado ${valor.advertencias} enlaces en canales los cuales no esta permitido.`)
                                }
                                if(valor.advertencias == 7){
                                    msg.member.ban(`Por auto moderación de enlaces, el miembro ha enviado ${valor.advertencias} enlaces en canales los cuales no esta permitido.`)
                                }
                            }
                        })
                    }else{
                        autoModeracion.push({miembroID: msg.author.id, advertencias: 1})
                    } 
                }
            })
        }
    }
})

client.on("messageDelete", async msgd => {
    if(msgd.guildId != servidorID) return;

    let dataTs = await ticketsDB.findById(servidorID), arrayTs = dataTs.tickets, ticket = arrayTs.find(f=> f.id==msgd.channelId)
    if(arrayTs.some(s=> s.id==msgd.channelId) && ticket.msgCerrarID == msgd.id && !ticket.cerrado){
        const botonCerrar = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setCustomId("cerrarTicket")
            .setEmoji("962574398190145566")
            .setLabel("Cerrar ticket")
            .setStyle("SECONDARY")
            .setDisabled(false)
        )

        await msgd.channel.messages.fetch(ticket.msgPrincipalID, {force: true}).then(msgPrincipal => {
            msgPrincipal.edit({components: [botonCerrar]})
        }).catch(c=> console.log(c))
        ticket.msgCerrarID = false
        await ticketsDB.findByIdAndUpdate(servidorID, {tickets: arrayTs})
    }

    let dataSor = await sorteosDB.findById(servidorID), arraySo = dataSor.sorteos
    if(arraySo.some(s=>s.id == msgd.id)){
        arraySo.splice(arraySo.findIndex(f=>f.id == msgd.id),1)
        await sorteosDB.findByIdAndUpdate(servidorID, {sorteos: arraySo})
    }

    let dataEnc = await encuestasDB.findById(servidorID), arrayEn = dataEnc.encuestas
    if(arrayEn.some(s=>s.id == msgd.id)){
        arrayEn.splice(arrayEn.findIndex(f=>f.id == msgd.id),1)
        await encuestasDB.findByIdAndUpdate(servidorID, {encuestas: arrayEn})
    }
})

// _____________________________
// Registros
client.on("guildBanAdd",async gba => {
    if(gba.guild.id != "12313") return;

    let dataBot = await botDB.findById(client.user.id)
    const embBaneado = new Discord.MessageEmbed()
    .setThumbnail(gba.user.displayAvatarURL({dynamic: true}))
    .setTitle(`${emojiError} Usuario baneado`)
    .setDescription(`👤 ${gba.user.tag}\n\n🆔 ${gba.user.id}\n\n📝 Razon: ${(await gba.guild.bans.fetch()).filter(fb => fb.user.id === gba.user.id).map(mb => mb.reason)}`)
    .setColor(colorErr)
    .setFooter(gba.guild.name,gba.guild.iconURL())
    .setTimestamp()
    client.channels.cache.get(dataBot.datos.registros.ban).send({embeds: [embBaneado]})
})

client.on("guildBanRemove", async gbr => {
    if(gbr.guild.id != "12312") return;
    
    let dataBot = await botDB.findById(client.user.id)
    const embDesbaneado = new Discord.MessageEmbed()
    .setThumbnail(gbr.user.displayAvatarURL({dynamic: true}))
    .setTitle("<a:afirmativo:856966728806432778> Usuario desbaneado")
    .setDescription(`👤 ${gbr.user.tag}\n\n🆔 ${gbr.user.id}`)
    .setColor("#00ff00")
    .setFooter(gbr.guild.name,gbr.guild.iconURL())
    .setTimestamp()
    client.channels.cache.get(dataBot.datos.registros.unban).send({embeds: [embDesbaneado]})
})

client.on("channelDelete", async cd => {
    if(cd.guildId != servidorID) return;

    let dataTs = await ticketsDB.findById(servidorID), arrayTs = dataTs.tickets, objetoDs = dataTs.datos, servidor2 = client.guilds.cache.get("949860813915705354"),  descripcion = cd.topic.split(" ")
    if(dataTs.tickets.some(s=>s.id == cd.id)){
        descripcion[0] = emojiError
        let ticket = arrayTs.find(f=> f.id == cd.id), canalesCategoria = servidor2.channels.cache.filter(f=> f.parentId == objetoDs.categoriaID), categoria = servidor2.channels.cache.get(objetoDs.categoriaID)
        if(canalesCategoria.size==50){
            servidor2.channels.create(`📚 Grupo de tickets ${Number(categoria.name.match(/(\d+)/g).pop())+1}`, {type: "GUILD_CATEGORY"}).then(async tc=>{
                tc.edit({position: categoria.position})
                objetoDs.categoriaID=tc.id
                arrayTs.splice(arrayTs.findIndex(f=> f.id == cd.id), 1)
                await ticketsDB.findByIdAndUpdate(servidorID, {datos: objetoDs, tickets: arrayTs})
                servidor2.channels.cache.get(ticket.copiaID).edit({name: `『🔒』ticket ${cd.name.match(/(\d+)/g).pop()} eliminado`, parent: objetoDs.categoriaID, position: 0, topic: `${descripcion.join(" ").replace(".", " ").concat(" *eliminado*.")}`})
            })

        }else{
            arrayTs.splice(arrayTs.findIndex(f=> f.id == cd.id), 1)
            await ticketsDB.findByIdAndUpdate(servidorID, {datos: objetoDs, tickets: arrayTs})
            servidor2.channels.cache.get(ticket.copiaID).edit({name: `『🔒』ticket ${cd.name.match(/(\d+)/g).pop()} eliminado`, parent: objetoDs.categoriaID, topic: `${descripcion.join(" ").replace(".", " ").concat(" *eliminado*.")}`}).then(async tc=>{
                let numTicket = Number(tc.name.match(/(\d+)/g).pop())
                let posicion = servidor2.channels.cache.filter(f=> f.parentId==objetoDs.categoriaID && Number(f.name.match(/(\d+)/g).pop())<numTicket).map(m=> Object({pos: m.position, num: Number(m.name.match(/(\d+)/g).pop())})).sort((a,b)=> a.num - b.num).pop().pos
                setTimeout(async ()=> {
                    await tc.edit({position: posicion})
                }, 4000)
            })
        }
    }
})

process.on("unhandledRejection", err => {
    console.log(err)
    const embErr = new Discord.MessageEmbed()
    .setTitle(`${emojiError} Ocurrió un error`)
    .setDescription(`\`\`\`js\n${err}\`\`\``)
    .setColor("ff0000")
    .setTimestamp()
    // client.channels.cache.get("931619970520060166").send({embeds: [embErr]})
})

client.on("shardError", async err => {
    console.log(err)
    const embErr = new Discord.MessageEmbed()
    .setTitle(`${emojiError} Ocurrió un error`)
    .setDescription(`\`\`\`js\n${err}\`\`\``)
    .setColor("ff0000")
    .setTimestamp()
    // client.channels.cache.get("931619970520060166").send({embeds: [embErr]})
})

client.login(token)