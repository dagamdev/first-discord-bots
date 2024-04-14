const Discord = require("discord.js"), client = new Discord.Client({intents: 32767, ws:{properties:{$browser: "Discord Android"}}});

const token = require("./config.json").tokenÚtil, ms = require("ms"), mongoose = require("mongoose"), isURL = require("isurl");

const creadorID = "717420870267830382", creadoresID = ["717420870267830382","825186118050775052"], colorEmb = "#2c889f", colorEmbInfo = "#2c889f", ColorError = "#ff0000", emojis = {negativo: "<a:negativo:856967325505159169>", acierto: "<a:afirmativo:856966728806432778>", puntos: "<:StaffPoint:957357854120116234>", lupa: "<:lupa:958820188457930892>"}, invitacion = "https://discord.com/api/oauth2/authorize?client_id=935707268090056734&permissions=1239568329975&scope=bot%20applications.commands", serverSuport = "https://discord.gg/G7GUD7eNCb"

mongoose.connect("mongodb+srv://Music:oQJo4VnF3rXj615k@ssbot.jbt17.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Conectado correctamente a la base de datos.")
}).catch(e=>{
    console.log("Ocurrió un error al conectarse con la DB", e)
})

// Sistema de historial
const esquemaHistoriales = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    sanciones: {
        type: Object,
        required: true
    },
    usuarios: {
        type: Array,
        required: true
    }
})
const historiales = mongoose.model("Historiales", esquemaHistoriales)


// Prefijo configurable
const confPrefijo = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    servidores: {
        type: Array,
        required: true
    }
})
const mPrefix = mongoose.model("Prefijo", confPrefijo)


// Sistema de puntos
const puntosMongo = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    serverName: {
        type: String,
        required: true
    },
    datos: {
        type: Object,
        required: true
    },
    miembros: {
        type: Object,
        required: true
    }
})
const sPuntos = mongoose.model("Sistema de puntos", puntosMongo) 

// AFK DB
const awayFromKeyboard = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    }, 
    servidor: {
        type: Object,
        required: true
    }, 
    miembros: {
        type: Array,
        required: true
    }
})
const dbAFK = mongoose.model("AFK DB", awayFromKeyboard)

let botDB = {
    comandos: {
        usos: 0,
    },
    servidor: [
        {
            id: "940034044819828767",
            comandos: {
                addrol: false,
                removerol: false
            }
        }
    ],
    historial: [{mensajeID: "", miembroID: ""}] 
}


client.on("ready",async () => {
    let miServidor = client.guilds.cache.get("940034044819828767"), hermano = client.users.cache.get("843185929002025030"), svsp = client.guilds.cache.get("773249398431809586")
    console.log(client.user.username, "Hola, estoy listo")
    const embReady = new Discord.MessageEmbed()
    .setTitle(`${emojis.acierto} Estoy conectado`)
    .setDescription(`Desde <:heroku:958814911243374602> Heroku pijamas.`)
    .setColor("00ff00")
    .setTimestamp()
    miServidor.channels.cache.get("940078303694442566").send({embeds: [embReady]})

    const estado = [
        {
            name: `${client.guilds.cache.size.toLocaleString()} servidores.`,
            type: "WATCHING"
        },
        {
            name: "u!help",
            type: "LISTENING"
        },
        {
            name: `${client.users.cache.size.toLocaleString()} usuarios.`,
            type: "WATCHING"
        },
        {
            name: "u!invite",
            type: "LISTENING"
        },
        {
            name: `${svsp.name} mi servidor de origen.`,
            type: "WATCHING"
        },
        {
            name: `moderar con mi hermanó ${hermano.username}`,
            type: "PLAYING"
        },
        {
            name: `mis 42 comandos.`,
            type: "WATCHING"
        },
    ]

    const autoPresencia = () => {
        let aleatorio = Math.floor(Math.random()*estado.length)
        client.user.setPresence({
            activities: [estado[aleatorio]]
        })
    }
    autoPresencia()
    setInterval(()=>{
        autoPresencia()
    }, 2*60000)
})

client.on("interactionCreate", async int => {
    if(int.isButton()){
        if(int.customId === "advertencias"){
            int.deferUpdate()
            let dataHis = await historiales.findOne({_id: client.user.id})
            let posicionVA
            for(let i in botDB.historial){
                if(botDB.historial[i].mensajeID === int.message.id){
                    posicionVA = i
                }
            }
            let posicionUS
            for(let u=0; u<dataHis.usuarios.length; u++){
                if(dataHis.usuarios[u].id === botDB.historial[posicionVA].miembroID){
                    posicionUS = u
                }
            }
            console.log(botDB.historial[posicionVA])
            let miembro = int.guild.members.cache.get(botDB.historial[posicionVA].miembroID)
            let historial = []
            let descripcion = ""

            if(dataHis.usuarios[posicionUS].servidores.some(s=> s.id === int.guildId)){
                let posicionSV
                for(let s=0; s<dataHis.usuarios[posicionUS].servidores.length; s++){
                    if(dataHis.usuarios[posicionUS].servidores[s].id === int.guildId){
                        posicionSV = s
                    }
                }

                if(dataHis.usuarios[posicionUS].servidores[posicionSV].advertencias.length > 0){
                    let svsAdv = dataHis.usuarios[posicionUS].servidores.filter(f=> f.advertencias.length > 0 && f.id != int.guildId).length
                    console.log(svsAdv)
                    if(svsAdv>=1){
                        if(miembro.id == int.user.id){
                            descripcion = `${miembro} tienes advertencias en este servidor y en otros **${svsAdv}** servidores tambien tienes y son las siguientes.\n\n`
                        }else{
                            descripcion = `El miembro ${miembro} tiene advertencias en este servidor y en otros **${svsAdv}** servidores tambien tiene y son las siguientes.\n\n`
                        }
                    }else{
                        if(miembro.id == int.user.id){
                            descripcion = `${miembro} solo tienes advertencias en este servidor, las cuales son las siguientes.\n\n`
                        }else{
                            descripcion = `El miembro ${miembro} solo tiene advertencias en este servidor, las cuales son las siguientes.\n\n`
                        }
                    }
                    let cantidad = 0
                    historial.push(`<:wer:920166217086537739> **Servidor:** [${int.guild.name}](${int.guild.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${int.guild.members.cache.size.toLocaleString()} miembros\n\n`)
                    for(let i=0; i<dataHis.usuarios[posicionUS].servidores[posicionSV].advertencias.length; i++){
                        let tiempo = dataHis.usuarios[posicionUS].servidores[posicionSV].advertencias[i].tiempo
                        let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[posicionSV].advertencias[i].autor, {force: true})
                        let texto = `**${i+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[posicionSV].advertencias[i].razon}*\n`
                        if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                            historial[cantidad] = historial[cantidad].concat(texto)
                        }else{
                            historial.push(texto)
                            cantidad++
                        }
                    }
                    for(let h=0; h<dataHis.usuarios[posicionUS].servidores.length; h++){
                        if(dataHis.usuarios[posicionUS].servidores[h].advertencias.length>=1 && dataHis.usuarios[posicionUS].servidores[h].id != int.guildId){
                            let servidor = client.guilds.cache.get(dataHis.usuarios[posicionUS].servidores[h].id)
                            if(historial.length >= 1){
                                let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + tituloSv.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(tituloSv)
                                }else{
                                    historial.push(tituloSv)
                                    cantidad++
                                }
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].advertencias.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].advertencias[a].tiempo
                                    let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].advertencias[a].autor, {force: true})
                                    let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].advertencias[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }else{
                                historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].advertencias.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].advertencias[a].tiempo
                                    let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].advertencias[a].autor, {force: true})
                                    let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].advertencias[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }
                        }
                    }
                }else{
                    let svsAdv = dataHis.usuarios[posicionUS].servidores.filter(f=> f.advertencias.length > 0).length
                    if(svsAdv>=1){
                        if(miembro.id == int.user.id){
                            descripcion = `${miembro} no tienes advertencias en este servidor pero en otros **${svsAdv}** servidores si tienes y son las siguientes.\n\n`
                        }else{
                            descripcion = `El miembro ${miembro} no tiene advertencias en este servidor pero en otros **${svsAdv}** servidores si tiene y son las siguientes.\n\n`
                        }
                    }
                    
                    let cantidad = 0
                    for(let h=0; h<dataHis.usuarios[posicionUS].servidores.length; h++){
                        if(dataHis.usuarios[posicionUS].servidores[h].advertencias.length>=1){
                            let servidor = client.guilds.cache.get(dataHis.usuarios[posicionUS].servidores[h].id)
                            if(historial.length >= 1){
                                let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + tituloSv.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(tituloSv)
                                }else{
                                    historial.push(tituloSv)
                                    cantidad++
                                }
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].advertencias.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].advertencias[a].tiempo
                                    let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].advertencias[a].autor, {force: true})
                                    let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].advertencias[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }else{
                                historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].advertencias.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].advertencias[a].tiempo
                                    let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].advertencias[a].autor, {force: true})
                                    let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].advertencias[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }
                        }
                    }
                }
            }else{
                let svsAdv = dataHis.usuarios[posicionUS].servidores.filter(f=> f.advertencias.length > 0).length
                if(svsAdv>=1){
                    if(miembro.id == int.user.id){
                        descripcion = `${miembro} no tienes advertencias en este servidor pero en otros **${svsAdv}** servidores si tienes y son las siguientes.\n\n`
                    }else{
                        descripcion = `El miembro ${miembro} no tiene advertencias en este servidor pero en otros **${svsAdv}** servidores si tiene y son las siguientes.\n\n`
                    }
                }

                let cantidad = 0
                for(let h=0; h<dataHis.usuarios[posicionUS].servidores.length; h++){
                    if(dataHis.usuarios[posicionUS].servidores[h].advertencias.length>=1){
                        let servidor = client.guilds.cache.get(dataHis.usuarios[posicionUS].servidores[h].id)
                        if(historial.length >= 1){
                            let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                            if(historial[cantidad].length<1900 && (historial[cantidad].length + tituloSv.length)<1900){
                                historial[cantidad] = historial[cantidad].concat(tituloSv)
                            }else{
                                historial.push(tituloSv)
                                cantidad++
                            }
                            for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].advertencias.length; a++){
                                let tiempo = dataHis.usuarios[posicionUS].servidores[h].advertencias[a].tiempo
                                let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].advertencias[a].autor, {force: true})
                                let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].advertencias[a].razon}*\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(texto)
                                }else{
                                    historial.push(texto)
                                    cantidad++
                                }
                            }
                        }else{
                            historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                            for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].advertencias.length; a++){
                                let tiempo = dataHis.usuarios[posicionUS].servidores[h].advertencias[a].tiempo
                                let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].advertencias[a].autor, {force: true})
                                let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].advertencias[a].razon}*\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(texto)
                                }else{
                                    historial.push(texto)
                                    cantidad++
                                }
                            }
                        }
                    }
                }
            }

            let totalPag = historial.length

            if(historial.length<=1){
                const embHistorial = new Discord.MessageEmbed()    
                .setAuthor(int.member.nickname ? int.member.nickname: int.user.username,int.user.displayAvatarURL({dynamic: true}))
                .setTitle(`<:advertencia:929204500739268608> Advertencias`)
                .setDescription(descripcion+historial.slice(0,1))
                .setColor(int.guild.me.displayHexColor)
                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: 1/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                int.channel.messages.fetch(botDB.historial[posicionVA].mensajeID, {force: true}).then(mensaje=>{
                    mensaje.edit({embeds: [embHistorial], components: []})
                }).catch(c=>{
                    console.log("No se pudo editar el mensaje.")
                })
            }else{
                const botones1 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente ")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )

                const botones2 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )

                const botones3 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ]
                )

                let hi1 = 0
                let hi2 = 1
                let pagina = 1
                const embHistorial = new Discord.MessageEmbed()    
                .setAuthor(int.member.nickname ? int.member.nickname: int.user.username,int.user.displayAvatarURL({dynamic: true}))
                .setTitle(`<:advertencia:929204500739268608> Advertencias`)
                .setDescription(descripcion+historial.slice(hi1,hi2))
                .setColor(int.guild.me.displayHexColor)
                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                
                await int.channel.messages.fetch(botDB.historial[posicionVA].mensajeID, {force: true}).then(mensaje =>{
                    mensaje.edit({embeds: [embHistorial], components: [botones1]})
                    let filtro = i=> i.user.id === int.user.id
                    const colector = mensaje.createMessageComponentCollector({filter: filtro, time: 4*60000})

                    setTimeout(()=>{
                        mensaje.edit({embeds: [embHistorial], components: []})
                    }, 4*60000)

                    colector.on("collect", async botn => {
                        if(botn.customId === "1"){
                            if(hi2 - 1 <= 1){
                                hi1 -= 1
                                hi2 -= 1
                                pagina -= 1
        
                                embHistorial
                                .setDescription(descripcion+historial.slice(hi1,hi2))
                                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                                return await botn.update({embeds: [embHistorial], components: [botones1]})
                            }
                            hi1 -= 1
                            hi2 -= 1
                            pagina -= 1
        
                            embHistorial
                            .setDescription(descripcion+historial.slice(hi1,hi2))
                            .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                            await botn.update({embeds: [embHistorial], components: [botones2]})
                        }
                        if(botn.customId === "2"){
                            if(hi2 + 1 >= totalPag){
                                hi1 += 1
                                hi2 += 1
                                pagina += 1
        
                                embHistorial
                                .setDescription(descripcion+historial.slice(hi1,hi2))
                                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                                return await botn.update({embeds: [embHistorial], components: [botones3]})
                            }
                            hi1 += 1
                            hi2 += 1
                            pagina += 1
        
                            embHistorial
                            .setDescription(descripcion+historial.slice(hi1,hi2))
                            .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                            return await botn.update({embeds: [embHistorial], components: [botones2]})
                        }
                    })
                }).catch(c=>{
                    console.log("Error al intentar obtener el mensaje")
                })
            }
        }
        if(int.customId === "aislamientos"){
            int.deferUpdate()
            let dataHis = await historiales.findOne({_id: client.user.id})
            let posicionVA
            for(let i=0; i<botDB.historial.length; i++){
                if(botDB.historial[i].mensajeID === int.message.id){
                    posicionVA = i
                }
            }
            let posicionUS
            for(let u=0; u<dataHis.usuarios.length; u++){
                if(dataHis.usuarios[u].id === botDB.historial[posicionVA].miembroID){
                    posicionUS = u
                }
            }
            console.log(botDB.historial[posicionVA])
            let miembro = int.guild.members.cache.get(botDB.historial[posicionVA].miembroID)
            let descripcion = ""
            let historial = []

            if(dataHis.usuarios[posicionUS].servidores.some(s=> s.id === int.guildId)){
                let posicionSV
                for(let s=0; s<dataHis.usuarios[posicionUS].servidores.length; s++){
                    if(dataHis.usuarios[posicionUS].servidores[s].id === int.guildId){
                        posicionSV = s
                    }
                }

                if(dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos.length > 0){
                    let svsAis = dataHis.usuarios[posicionUS].servidores.filter(f=> f.aislamientos.length > 0 && f.id != int.guildId).length
                    if(svsAis>=1){
                        if(miembro.id == int.user.id){
                            descripcion = `${miembro} tienes aislamientos en este servidor y en otros **${svsAis}** servidores tambien tienes y son los siguientes.\n\n`
                        }else{
                            descripcion = `El miembro ${miembro} tiene aislamientos en este servidor y en otros **${svsAis}** servidores tambien tiene y son los siguientes.\n\n`
                        }
                    }else{
                        if(miembro.id == int.user.id){
                            descripcion = `${miembro} solo tienes aislamientos en este servidor, las cuales son los siguientes.\n\n`
                        }else{
                            descripcion = `El miembro ${miembro} solo tiene aislamientos en este servidor, las cuales son los siguientes.\n\n`
                        }
                    }
                    
                    let cantidad = 0
                    historial.push(`<:wer:920166217086537739> **Servidor:** [${int.guild.name}](${int.guild.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${int.guild.members.cache.size.toLocaleString()} miembros\n\n`)
                    for(let i=0; i<dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos.length; i++){
                        let tiempo = dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[i].tiempo
                        let aislamiento = dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[i].aislamiento
                        let moderador = await client.user.fetch(dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[i].autor, {force: true})
                        let texto = `**${i+1}.** 👮 Aislado temporalmente por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n<:aislacion:947965052772814848> Durante ${aislamiento}\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[i].razon}*\n`
                        if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                            historial[cantidad] = historial[cantidad].concat(texto)
                        }else{
                            historial.push(texto)
                            cantidad++
                        }
                    }
                    for(let h=0; h<dataHis.usuarios[posicionUS].servidores.length; h++){
                        if(dataHis.usuarios[posicionUS].servidores[h].aislamientos.length>=1 && dataHis.usuarios[posicionUS].servidores[h].id != int.guildId){
                            let servidor = client.guilds.cache.get(dataHis.usuarios[posicionUS].servidores[h].id)
                            if(historial.length >= 1){
                                let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + tituloSv.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(tituloSv)
                                }else{
                                    historial.push(tituloSv)
                                    cantidad++
                                }
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].aislamientos.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].aislamientos[a].tiempo
                                    let aislamiento = dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].aislamiento
                                    let moderador = await client.user.fetch(dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].autor, {force: true})
                                    let texto = `**${i+1}.** 👮 Aislado temporalmente por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n<:aislacion:947965052772814848> Durante ${aislamiento}\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }else{
                                historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].aislamientos.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].aislamientos[a].tiempo
                                    let aislamiento = dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].aislamiento
                                    let moderador = await client.user.fetch(dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].autor, {force: true})
                                    let texto = `**${i+1}.** 👮 Aislado temporalmente por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n<:aislacion:947965052772814848> Durante ${aislamiento}\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }
                        }
                    }
                }else{
                    let svsAis = dataHis.usuarios[posicionUS].servidores.filter(f=> f.aislamientos.length > 0).length
                    if(svsAis>=1){
                        if(miembro.id == int.user.id){
                            descripcion = `${miembro} no tienes aislamientos en este servidor pero en otros **${svsAis}** servidores si tienes y son los siguientes.\n\n`
                        }else{
                            descripcion = `El miembro ${miembro} no tiene aislamientos en este servidor pero en otros **${svsAis}** servidores si tiene y son los siguientes.\n\n`
                        }
                    }
                    
                    let cantidad = 0
                    for(let h=0; h<dataHis.usuarios[posicionUS].servidores.length; h++){
                        if(dataHis.usuarios[posicionUS].servidores[h].aislamientos.length>=1){
                            let servidor = client.guilds.cache.get(dataHis.usuarios[posicionUS].servidores[h].id)
                            if(historial.length >= 1){
                                let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + tituloSv.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(tituloSv)
                                }else{
                                    historial.push(tituloSv)
                                    cantidad++
                                }
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].aislamientos.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].aislamientos[a].tiempo
                                    let aislamiento = dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].aislamiento
                                    let moderador = await client.user.fetch(dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].autor, {force: true})
                                    let texto = `**${i+1}.** 👮 Aislado temporalmente por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n<:aislacion:947965052772814848> Durante ${aislamiento}\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }else{
                                historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].aislamientos.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].advertencias[a].tiempo
                                    let aislamiento = dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].aislamiento
                                    let moderador = await client.user.fetch(dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].autor, {force: true})
                                    let texto = `**${i+1}.** 👮 Aislado temporalmente por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n<:aislacion:947965052772814848> Durante ${aislamiento}\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }
                        }
                    }
                }
            }else{
                let svsAis = dataHis.usuarios[posicionUS].servidores.filter(f=> f.aislamientos.length > 0).length
                if(svsAis>=1){
                    if(miembro.id == int.user.id){
                        descripcion = `${miembro} no tienes aislamientos en este servidor pero en otros **${svsAis}** servidores si tienes y son los siguientes.\n\n`
                    }else{
                        descripcion = `El miembro ${miembro} no tiene aislamientos en este servidor pero en otros **${svsAis}** servidores si tiene y son los siguientes.\n\n`
                    }
                }
                
                let cantidad = 0
                for(let h=0; h<dataHis.usuarios[posicionUS].servidores.length; h++){
                    if(dataHis.usuarios[posicionUS].servidores[h].aislamientos.length>=1){
                        let servidor = client.guilds.cache.get(dataHis.usuarios[posicionUS].servidores[h].id)
                        if(historial.length >= 1){
                            let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                            if(historial[cantidad].length<1900 && (historial[cantidad].length + tituloSv.length)<1900){
                                historial[cantidad] = historial[cantidad].concat(tituloSv)
                            }else{
                                historial.push(tituloSv)
                                cantidad++
                            }
                            for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].aislamientos.length; a++){
                                let tiempo = dataHis.usuarios[posicionUS].servidores[h].aislamientos[a].tiempo
                                let aislamiento = dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].aislamiento
                                let moderador = await client.user.fetch(dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].autor, {force: true})
                                let texto = `**${i+1}.** 👮 Aislado temporalmente por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n<:aislacion:947965052772814848> Durante ${aislamiento}\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].razon}*\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(texto)
                                }else{
                                    historial.push(texto)
                                    cantidad++
                                }
                            }
                        }else{
                            historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                            for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].aislamientos.length; a++){
                                let tiempo = dataHis.usuarios[posicionUS].servidores[h].aislamientos[a].tiempo
                                let aislamiento = dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].aislamiento
                                let moderador = await client.user.fetch(dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].autor, {force: true})
                                let texto = `**${i+1}.** 👮 Aislado temporalmente por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n<:aislacion:947965052772814848> Durante ${aislamiento}\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos[a].razon}*\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(texto)
                                }else{
                                    historial.push(texto)
                                    cantidad++
                                }
                            }
                        }
                    }
                }
            }

            let totalPag = historial.length

            if(historial.length<=1){
                const embHistorial = new Discord.MessageEmbed()    
                .setAuthor(int.member.nickname ? int.member.nickname: int.user.username,int.user.displayAvatarURL({dynamic: true}))
                .setTitle(`<:aislacion:947965052772814848> Aislamientos`)
                .setDescription(descripcion+historial.slice(0,1))
                .setColor(int.guild.me.displayHexColor)
                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: 1/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                int.channel.messages.fetch(botDB.historial[posicionVA].mensajeID, {force: true}).then(mensaje=>{
                    mensaje.edit({embeds: [embHistorial], components: []})
                }).catch(c=>{
                    console.log("No se pudo editar el mensaje.")
                })
            }else{
                const botones1 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente ")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )

                const botones2 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )

                const botones3 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ]
                )

                let hi1 = 0, hi2 = 1, pagina = 1
                const embHistorial = new Discord.MessageEmbed()    
                .setAuthor(int.member.nickname ? int.member.nickname: int.user.username,int.user.displayAvatarURL({dynamic: true}))
                .setTitle(`<:aislacion:947965052772814848> Aislamientos`)
                .setDescription(descripcion+historial.slice(hi1,hi2))
                .setColor(int.guild.me.displayHexColor)
                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                
                await int.channel.messages.fetch(botDB.historial[posicionVA].mensajeID, {force: true}).then(mensaje =>{
                    mensaje.edit({embeds: [embHistorial], components: [botones1]})
                    let filtro = i=> i.user.id === int.user.id
                    const colector = mensaje.createMessageComponentCollector({filter: filtro, time: 4*60000})

                    setTimeout(()=>{
                        mensaje.edit({embeds: [embHistorial], components: []})
                    }, 4*60000)

                    colector.on("collect", async botn => {
                        if(botn.customId === "1"){
                            if(hi2 - 1 <= 1){
                                hi1 -= 1
                                hi2 -= 1
                                pagina -= 1
        
                                embHistorial
                                .setDescription(descripcion+historial.slice(hi1,hi2))
                                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                                return await botn.update({embeds: [embHistorial], components: [botones1]})
                            }
                            hi1 -= 1
                            hi2 -= 1
                            pagina -= 1
        
                            embHistorial
                            .setDescription(descripcion+historial.slice(hi1,hi2))
                            .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                            await botn.update({embeds: [embHistorial], components: [botones2]})
                        }
                        if(botn.customId === "2"){
                            if(hi2 + 1 >= totalPag){
                                hi1 += 1
                                hi2 += 1
                                pagina += 1
        
                                embHistorial
                                .setDescription(descripcion+historial.slice(hi1,hi2))
                                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                                return await botn.update({embeds: [embHistorial], components: [botones3]})
                            }
                            hi1 += 1
                            hi2 += 1
                            pagina += 1
        
                            embHistorial
                            .setDescription(descripcion+historial.slice(hi1,hi2))
                            .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                            return await botn.update({embeds: [embHistorial], components: [botones2]})
                        }
                    })
                }).catch(c=>{
                    console.log("Error al intentar obtener el mensaje")
                })
            }
        }
        if(int.customId === "expulsiones"){
            int.deferUpdate()
            let dataHis = await historiales.findOne({_id: client.user.id})
            let posicionVA
            for(let i=0; i<botDB.historial.length; i++){
                if(botDB.historial[i].mensajeID === int.message.id){
                    posicionVA = i
                }
            }
            let posicionUS
            for(let u=0; u<dataHis.usuarios.length; u++){
                if(dataHis.usuarios[u].id === botDB.historial[posicionVA].miembroID){
                    posicionUS = u
                }
            }
            console.log(botDB.historial[posicionVA])
            let miembro = int.guild.members.cache.get(botDB.historial[posicionVA].miembroID)
            let historial = []
            let descripcion = ""

            if(dataHis.usuarios[posicionUS].servidores.some(s=> s.id === int.guildId)){
                let posicionSV
                for(let s=0; s<dataHis.usuarios[posicionUS].servidores.length; s++){
                    if(dataHis.usuarios[posicionUS].servidores[s].id === int.guildId){
                        posicionSV = s
                    }
                }

                if(dataHis.usuarios[posicionUS].servidores[posicionSV].expulsiones.length > 0){
                    let svsExp = dataHis.usuarios[posicionUS].servidores.filter(f=> f.expulsiones.length > 0 && f.id != int.guildId).length
                    if(svsExp>=1){
                        if(miembro.id == int.user.id){
                            descripcion = `${miembro} tienes **${dataHis.usuarios[posicionUS].servidores[posicionSV].expulsiones.length}** expulsiones en este servidor y en otros **${svsExp}** servidores tambien tienes y son las siguientes.\n\n`
                        }else{
                            descripcion = `El miembro ${miembro} tiene **${dataHis.usuarios[posicionUS].servidores[posicionSV].expulsiones.length}** expulsiones en este servidor y en otros **${svsExp}** servidores tambien tiene y son las siguientes.\n\n`
                        }
                    }else{
                        if(miembro.id == int.user.id){
                            descripcion = `${miembro} solo tienes **${dataHis.usuarios[posicionUS].servidores[posicionSV].expulsiones.length}** expulsiones en este servidor, las cuales son las siguientes.\n\n`
                        }else{
                            descripcion = `El miembro ${miembro} solo tiene **${dataHis.usuarios[posicionUS].servidores[posicionSV].expulsiones.length}** expulsiones en este servidor, las cuales son las siguientes.\n\n`
                        }
                    }
                    
                    let cantidad = 0
                    historial.push(`<:wer:920166217086537739> **Servidor:** [${int.guild.name}](${int.guild.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${int.guild.members.cache.size.toLocaleString()} miembros\n\n`)
                    for(let i=0; i<dataHis.usuarios[posicionUS].servidores[posicionSV].expulsiones.length; i++){
                        let tiempo = dataHis.usuarios[posicionUS].servidores[posicionSV].expulsiones[i].tiempo
                        let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[posicionSV].expulsiones[i].autor, {force: true})
                        let texto = `**${i+1}.** 👮 Expulsado por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[posicionSV].expulsiones[i].razon}*\n`
                        if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                            historial[cantidad] = historial[cantidad].concat(texto)
                        }else{
                            historial.push(texto)
                            cantidad++
                        }
                    }
                    for(let h=0; h<dataHis.usuarios[posicionUS].servidores.length; h++){
                        if(dataHis.usuarios[posicionUS].servidores[h].expulsiones.length>=1 && dataHis.usuarios[posicionUS].servidores[h].id != int.guildId){
                            let servidor = client.guilds.cache.get(dataHis.usuarios[posicionUS].servidores[h].id)
                            if(historial.length >= 1){
                                let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + tituloSv.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(tituloSv)
                                }else{
                                    historial.push(tituloSv)
                                    cantidad++
                                }
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].expulsiones.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].tiempo
                                    let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].autor, {force: true})
                                    let texto = `**${a+1}.** 👮 Expulsado por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }else{
                                historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].expulsiones.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].tiempo
                                    let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].autor, {force: true})
                                    let texto = `**${a+1}.** 👮 Expulsado por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }
                        }
                    }
                }else{
                    let svsExp = dataHis.usuarios[posicionUS].servidores.filter(f=> f.expulsiones.length > 0).length
                    if(svsExp>=1){
                        if(miembro.id == int.user.id){
                            descripcion = `${miembro} no tienes expulsiones en este servidor pero en otros **${svsExp}** servidores si tienes y son las siguientes.\n\n`
                        }else{
                            descripcion = `El miembro ${miembro} no tiene expulsiones en este servidor pero en otros **${svsExp}** servidores si tiene y son las siguientes.\n\n`
                        }
                    }
                    
                    let cantidad = 0
                    for(let h=0; h<dataHis.usuarios[posicionUS].servidores.length; h++){
                        if(dataHis.usuarios[posicionUS].servidores[h].expulsiones.length>=1){
                            let servidor = client.guilds.cache.get(dataHis.usuarios[posicionUS].servidores[h].id)
                            if(historial.length >= 1){
                                let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + tituloSv.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(tituloSv)
                                }else{
                                    historial.push(tituloSv)
                                    cantidad++
                                }
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].expulsiones.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].tiempo
                                    let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].autor, {force: true})
                                    let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }else{
                                historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].expulsiones.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].tiempo
                                    let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].autor, {force: true})
                                    let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }
                        }
                    }
                }
            }else{
                let svsExp = dataHis.usuarios[posicionUS].servidores.filter(f=> f.expulsiones.length > 0).length
                if(svsExp>=1){
                    if(miembro.id == int.user.id){
                        descripcion = `${miembro} no tienes expulsiones en este servidor pero en otros **${svsExp}** servidores si tienes y son las siguientes.\n\n`
                    }else{
                        descripcion = `El miembro ${miembro} no tiene expulsiones en este servidor pero en otros **${svsExp}** servidores si tiene y son las siguientes.\n\n`
                    }
                }

                let cantidad = 0
                for(let h=0; h<dataHis.usuarios[posicionUS].servidores.length; h++){
                    if(dataHis.usuarios[posicionUS].servidores[h].expulsiones.length>=1){
                        let servidor = client.guilds.cache.get(dataHis.usuarios[posicionUS].servidores[h].id)
                        if(historial.length >= 1){
                            let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                            if(historial[cantidad].length<1900 && (historial[cantidad].length + tituloSv.length)<1900){
                                historial[cantidad] = historial[cantidad].concat(tituloSv)
                            }else{
                                historial.push(tituloSv)
                                cantidad++
                            }
                            for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].expulsiones.length; a++){
                                let tiempo = dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].tiempo
                                let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].autor, {force: true})
                                let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].razon}*\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(texto)
                                }else{
                                    historial.push(texto)
                                    cantidad++
                                }
                            }
                        }else{
                            historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                            for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].expulsiones.length; a++){
                                let tiempo = dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].tiempo
                                let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].autor, {force: true})
                                let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].expulsiones[a].razon}*\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(texto)
                                }else{
                                    historial.push(texto)
                                    cantidad++
                                }
                            }
                        }
                    }
                }
            }

            let totalPag = historial.length

            if(historial.length<=1){
                const embHistorial = new Discord.MessageEmbed()    
                .setAuthor(int.member.nickname ? int.member.nickname: int.user.username,int.user.displayAvatarURL({dynamic: true}))
                .setTitle(`<:salir12:879519859694776360> Expulsiones`)
                .setDescription(descripcion+historial.slice(0,1))
                .setColor(int.guild.me.displayHexColor)
                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: 1/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                int.channel.messages.fetch(botDB.historial[posicionVA].mensajeID, {force: true}).then(mensaje=>{
                    mensaje.edit({embeds: [embHistorial], components: []})
                }).catch(c=>{
                    console.log("No se pudo editar el mensaje.")
                })
            }else{
                const botones1 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente ")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )

                const botones2 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )

                const botones3 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ]
                )

                let hi1 = 0, hi2 = 1, pagina = 1
                const embHistorial = new Discord.MessageEmbed()    
                .setAuthor(int.member.nickname ? int.member.nickname: int.user.username,int.user.displayAvatarURL({dynamic: true}))
                .setTitle(`<:salir12:879519859694776360> Expulsiones`)
                .setDescription(descripcion+historial.slice(hi1,hi2))
                .setColor(int.guild.me.displayHexColor)
                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                
                await int.channel.messages.fetch(botDB.historial[posicionVA].mensajeID, {force: true}).then(mensaje =>{
                    mensaje.edit({embeds: [embHistorial], components: [botones1]})
                    let filtro = i=> i.user.id === int.user.id
                    const colector = mensaje.createMessageComponentCollector({filter: filtro, time: 4*60000})

                    setTimeout(()=>{
                        mensaje.edit({embeds: [embHistorial], components: []})
                    }, 4*60000)

                    colector.on("collect", async botn => {
                        if(botn.customId === "1"){
                            if(hi2 - 1 <= 1){
                                hi1 -= 1, hi2 -= 1, pagina -= 1
        
                                embHistorial
                                .setDescription(descripcion+historial.slice(hi1,hi2))
                                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                                return await botn.update({embeds: [embHistorial], components: [botones1]})
                            }
                            hi1 -= 1, hi2 -= 1, pagina -= 1
        
                            embHistorial
                            .setDescription(descripcion+historial.slice(hi1,hi2))
                            .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                            await botn.update({embeds: [embHistorial], components: [botones2]})
                        }
                        if(botn.customId === "2"){
                            if(hi2 + 1 >= totalPag){
                                hi1 += 1, hi2 += 1, pagina += 1
        
                                embHistorial
                                .setDescription(descripcion+historial.slice(hi1,hi2))
                                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                                return await botn.update({embeds: [embHistorial], components: [botones3]})
                            }
                            hi1 += 1, hi2 += 1, pagina += 1
        
                            embHistorial
                            .setDescription(descripcion+historial.slice(hi1,hi2))
                            .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                            return await botn.update({embeds: [embHistorial], components: [botones2]})
                        }
                    })
                }).catch(c=>{
                    console.log("Error al intentar obtener el mensaje")
                })
            }
        }
        if(int.customId === "baneos"){
            int.deferUpdate()
            let dataHis = await historiales.findOne({_id: client.user.id})
            let posicionVA
            for(let i=0; i<botDB.historial.length; i++){
                if(botDB.historial[i].mensajeID === int.message.id){
                    posicionVA = i
                }
            }
            let posicionUS
            for(let u=0; u<dataHis.usuarios.length; u++){
                if(dataHis.usuarios[u].id === botDB.historial[posicionVA].miembroID){
                    posicionUS = u
                }
            }
            console.log(botDB.historial[posicionVA])
            let miembro = int.guild.members.cache.get(botDB.historial[posicionVA].miembroID)
            let historial = []
            let descripcion = ""

            if(dataHis.usuarios[posicionUS].servidores.some(s=> s.id === int.guildId)){
                let posicionSV
                for(let s=0; s<dataHis.usuarios[posicionUS].servidores.length; s++){
                    if(dataHis.usuarios[posicionUS].servidores[s].id === int.guildId){
                        posicionSV = s
                    }
                }

                if(dataHis.usuarios[posicionUS].servidores[posicionSV].baneos.length > 0){
                    let svsBan = dataHis.usuarios[posicionUS].servidores.filter(f=> f.baneos.length > 0 && f.id != int.guildId).length
                    if(svsBan>=1){
                        if(miembro.id == int.user.id){
                            descripcion = `${miembro} tienes **${dataHis.usuarios[posicionUS].servidores[posicionSV].baneos.length}** baneos en este servidor y en otros **${svsBan}** servidores tambien tienes y son los siguientes.\n\n`
                        }else{
                            descripcion = `El miembro ${miembro} tiene **${dataHis.usuarios[posicionUS].servidores[posicionSV].baneos.length}** baneos en este servidor y en otros **${svsBan}** servidores tambien tiene y son los siguientes.\n\n`
                        }
                    }else{
                        if(miembro.id == int.user.id){
                            descripcion = `${miembro} solo tienes **${dataHis.usuarios[posicionUS].servidores[posicionSV].baneos.length}** baneos en este servidor, las cuales son los siguientes.\n\n`
                        }else{
                            descripcion = `El miembro ${miembro} solo tiene **${dataHis.usuarios[posicionUS].servidores[posicionSV].baneos.length}** baneos en este servidor, las cuales son los siguientes.\n\n`
                        }
                    }
                    
                    let cantidad = 0
                    historial.push(`<:wer:920166217086537739> **Servidor:** [${int.guild.name}](${int.guild.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${int.guild.members.cache.size.toLocaleString()} miembros\n\n`)
                    for(let i=0; i<dataHis.usuarios[posicionUS].servidores[posicionSV].baneos.length; i++){
                        let tiempo = dataHis.usuarios[posicionUS].servidores[posicionSV].baneos[i].tiempo
                        let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[posicionSV].baneos[i].autor, {force: true})
                        let texto = `**${i+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[posicionSV].baneos[i].razon}*\n`
                        if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                            historial[cantidad] = historial[cantidad].concat(texto)
                        }else{
                            historial.push(texto)
                            cantidad++
                        }
                    }
                    for(let h=0; h<dataHis.usuarios[posicionUS].servidores.length; h++){
                        if(dataHis.usuarios[posicionUS].servidores[h].baneos.length>=1 && dataHis.usuarios[posicionUS].servidores[h].id != int.guildId){
                            let servidor = client.guilds.cache.get(dataHis.usuarios[posicionUS].servidores[h].id)
                            if(historial.length >= 1){
                                let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + tituloSv.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(tituloSv)
                                }else{
                                    historial.push(tituloSv)
                                    cantidad++
                                }
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].baneos.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].baneos[a].tiempo
                                    let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].baneos[a].autor, {force: true})
                                    let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].baneos[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }else{
                                historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].baneos.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].baneos[a].tiempo
                                    let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].baneos[a].autor, {force: true})
                                    let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].baneos[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }
                        }
                    }
                }else{
                    let svsBan = dataHis.usuarios[posicionUS].servidores.filter(f=> f.baneos.length > 0).length
                    if(svsBan>=1){
                        if(miembro.id == int.user.id){
                            descripcion = `${miembro} no tienes baneos en este servidor pero en otros **${svsBan}** servidores si tienes y son los siguientes.\n\n`
                        }else{
                            descripcion = `El miembro ${miembro} no tiene baneos en este servidor pero en otros **${svsBan}** servidores si tiene y son los siguientes.\n\n`
                        }
                    }
                    
                    let cantidad = 0
                    for(let h=0; h<dataHis.usuarios[posicionUS].servidores.length; h++){
                        if(dataHis.usuarios[posicionUS].servidores[h].baneos.length>=1){
                            let servidor = client.guilds.cache.get(dataHis.usuarios[posicionUS].servidores[h].id)
                            if(historial.length >= 1){
                                let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + tituloSv.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(tituloSv)
                                }else{
                                    historial.push(tituloSv)
                                    cantidad++
                                }
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].baneos.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].baneos[a].tiempo
                                    let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].baneos[a].autor, {force: true})
                                    let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].baneos[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }else{
                                historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                                for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].baneos.length; a++){
                                    let tiempo = dataHis.usuarios[posicionUS].servidores[h].baneos[a].tiempo
                                    let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].baneos[a].autor, {force: true})
                                    let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].baneos[a].razon}*\n`
                                    if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                        historial[cantidad] = historial[cantidad].concat(texto)
                                    }else{
                                        historial.push(texto)
                                        cantidad++
                                    }
                                }
                            }
                        }
                    }
                }
            }else{
                let svsBan = dataHis.usuarios[posicionUS].servidores.filter(f=> f.baneos.length > 0).length
                if(svsBan>=1){
                    if(miembro.id == int.user.id){
                        descripcion = `${miembro} no tienes baneos en este servidor pero en otros **${svsBan}** servidores si tienes y son los siguientes.\n\n`
                    }else{
                        descripcion = `El miembro ${miembro} no tiene baneos en este servidor pero en otros **${svsBan}** servidores si tiene y son los siguientes.\n\n`
                    }
                }
                
                let cantidad = 0
                for(let h=0; h<dataHis.usuarios[posicionUS].servidores.length; h++){
                    if(dataHis.usuarios[posicionUS].servidores[h].advertencias.length>=1){
                        let servidor = client.guilds.cache.get(dataHis.usuarios[posicionUS].servidores[h].id)
                        if(historial.length >= 1){
                            let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                            if(historial[cantidad].length<1900 && (historial[cantidad].length + tituloSv.length)<1900){
                                historial[cantidad] = historial[cantidad].concat(tituloSv)
                            }else{
                                historial.push(tituloSv)
                                cantidad++
                            }
                            for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].baneos.length; a++){
                                let tiempo = dataHis.usuarios[posicionUS].servidores[h].baneos[a].tiempo
                                let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].baneos[a].autor, {force: true})
                                let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].baneos[a].razon}*\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(texto)
                                }else{
                                    historial.push(texto)
                                    cantidad++
                                }
                            }
                        }else{
                            historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({dynamic: true, format: "png"||"gif", size: 2048})}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                            for(let a=0; a<dataHis.usuarios[posicionUS].servidores[h].baneos.length; a++){
                                let tiempo = dataHis.usuarios[posicionUS].servidores[h].baneos[a].tiempo
                                let moderador = await client.users.fetch(dataHis.usuarios[posicionUS].servidores[h].baneos[a].autor, {force: true})
                                let texto = `**${a+1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 2048})})\n<:calendario:952037404561264661> El <t:${tiempo}:F> *(<t:${tiempo}:R>)*\n📄 Por la razón:\n*${dataHis.usuarios[posicionUS].servidores[h].baneos[a].razon}*\n`
                                if(historial[cantidad].length<1900 && (historial[cantidad].length + texto.length)<1900){
                                    historial[cantidad] = historial[cantidad].concat(texto)
                                }else{
                                    historial.push(texto)
                                    cantidad++
                                }
                            }
                        }
                    }
                }
            }

            let totalPag = historial.length

            if(historial.length<=1){
                const embHistorial = new Discord.MessageEmbed()    
                .setAuthor(int.member.nickname ? int.member.nickname: int.user.username,int.user.displayAvatarURL({dynamic: true}))
                .setTitle(`⛔ Baneos`)
                .setDescription(descripcion+historial.slice(0,1))
                .setColor(int.guild.me.displayHexColor)
                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: 1/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                int.channel.messages.fetch(botDB.historial[posicionVA].mensajeID, {force: true}).then(mensaje=>{
                    mensaje.edit({embeds: [embHistorial], components: []})
                }).catch(c=>{
                    console.log("No se pudo editar el mensaje.")
                })
            }else{
                const botones1 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente ")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )

                const botones2 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )

                const botones3 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ]
                )

                let hi1 = 0, hi2 = 1, pagina = 1
                const embHistorial = new Discord.MessageEmbed()    
                .setAuthor(int.member.nickname ? int.member.nickname: int.user.username,int.user.displayAvatarURL({dynamic: true}))
                .setTitle(`⛔ Baneos`)
                .setDescription(descripcion+historial.slice(hi1,hi2))
                .setColor(int.guild.me.displayHexColor)
                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                
                await int.channel.messages.fetch(botDB.historial[posicionVA].mensajeID, {force: true}).then(mensaje =>{
                    mensaje.edit({embeds: [embHistorial], components: [botones1]})
                    let filtro = i=> i.user.id === int.user.id
                    const colector = mensaje.createMessageComponentCollector({filter: filtro, time: 4*60000})

                    setTimeout(()=>{
                        mensaje.edit({embeds: [embHistorial], components: []})
                    }, 4*60000)

                    colector.on("collect", async botn => {
                        if(botn.customId === "1"){
                            if(hi2 - 1 <= 1){
                                hi1 -= 1
                                hi2 -= 1
                                pagina -= 1
        
                                embHistorial
                                .setDescription(descripcion+historial.slice(hi1,hi2))
                                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                                return await botn.update({embeds: [embHistorial], components: [botones1]})
                            }
                            hi1 -= 1
                            hi2 -= 1
                            pagina -= 1
        
                            embHistorial
                            .setDescription(descripcion+historial.slice(hi1,hi2))
                            .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                            await botn.update({embeds: [embHistorial], components: [botones2]})
                        }
                        if(botn.customId === "2"){
                            if(hi2 + 1 >= totalPag){
                                hi1 += 1
                                hi2 += 1
                                pagina += 1
        
                                embHistorial
                                .setDescription(descripcion+historial.slice(hi1,hi2))
                                .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                                return await botn.update({embeds: [embHistorial], components: [botones3]})
                            }
                            hi1 += 1
                            hi2 += 1
                            pagina += 1
        
                            embHistorial
                            .setDescription(descripcion+historial.slice(hi1,hi2))
                            .setFooter(`${miembro.nickname ? miembro.nickname: miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, miembro.displayAvatarURL({dynamic: true}))
                            return await botn.update({embeds: [embHistorial], components: [botones2]})
                        }
                    })
                }).catch(c=>{
                    console.log("Error al intentar obtener el mensaje")
                })
            }
        }
    }
})


client.on("messageCreate", async msg => {
    if(msg.author.bot)return;

    let dataAFK = await dbAFK.findOne({_id: msg.guildId}), dataPre = await mPrefix.findOne({_id: client.user.id}), pref

    if(dataPre.servidores.some(s=> s.id == msg.guildId)){
        pref = dataPre.servidores.find(f=> f.id == msg.guildId).prefijo
    }else{
        pref = "u!"
    }


    if(dataAFK){
        if(dataAFK.miembros.some(s=>s.id == msg.author.id)){
            msg.channel.sendTyping()
            const embRemoveAFK = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("💤 Estado AFK removido")
            .setDescription(`${msg.author} tu estado AFK se a removido.`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
            .setTimestamp()

            if(dataAFK.miembros.find(f=> f.id == msg.author.id).apodo == msg.author.username){
                msg.member.setNickname(null, `Razón: el miembro ha eliminado su estado AFK.`).catch(c=>{
                    return;
                })
                setTimeout(()=>{
                    msg.reply({embeds: [embRemoveAFK]}).then(ma=> setTimeout(()=>{
                        ma.delete().catch(c=>{
                            return; 
                        })
                    }, 10000))
                }, 500)
                
                for(let f=0; f<dataAFK.miembros.length; f++){
                    if(dataAFK.miembros[f].id == msg.author.id){
                        dataAFK.miembros.splice(f,1)
                        await dataAFK.save()
                    }
                }
            }else{
                msg.member.setNickname(dataAFK.miembros.find(f=> f.id == msg.author.id).apodo, `Razón: el miembro ha eliminado su estado AFK.`).catch(c=>{
                    return;
                })
                setTimeout(()=>{
                    msg.reply({embeds: [embRemoveAFK]}).then(ma=> setTimeout(()=>{
                        ma.delete().catch(c=>{
                            return; 
                        })
                    }, 10000))
                }, 500)
                
                for(let f=0; f<dataAFK.miembros.length; f++){
                    if(dataAFK.miembros[f].id == msg.author.id){
                        dataAFK.miembros.splice(f,1)
                        await dataAFK.save()
                    }
                }
            }
        }

        for(let i in dataAFK.miembros){
            if(msg.mentions.members.some(s=> s.id === dataAFK.miembros[i].id)){
                msg.channel.sendTyping()
                const embAvisoAFK = new Discord.MessageEmbed()
                .setTitle("💤 AFK")
                .setDescription(`<@${dataAFK.miembros[i].id}> se encuentra AFK desde <t:${dataAFK.miembros[i].tiempo}:R> por la razón \`\`${dataAFK.miembros[i].razon}\`\``)
                .setColor(msg.guild.me.displayHexColor)
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({embeds: [embAvisoAFK]})
                }, 500)
            }
        }
    }



    if(!msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return;
    if(msg.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){
        msg.channel.sendTyping()
        const emb = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`Hola, soy **${client.user.username}** un Bot multi fundacional, tengo comandos de moderación, comandos informativos y sistemas como el sistema de inter promoción.`)
        .setDescription(`Usa el comando \`\`${pref}comandos\`\` para conocer todos mis comandos.\nMi prefijo en este servidor es: ${"``"}${pref}${"``"}\n[📨 **Invítame a tu servidor**](${invitacion})\n[🔧 **Servidor de soporte**](https://discord.gg/fbE2sqA5kj)`)
        .setColor(colorEmb)
        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
        .setTimestamp()
        
        setTimeout(()=>{
            msg.reply({embeds: [emb]})
        }, 500)
    }    
})


const cooldowns = new Map()

client.on("messageCreate", async msg => {
    if(msg.author.bot) return; 
    let dataPre = await mPrefix.findOne({_id: client.user.id}), prefijo

    if(dataPre.servidores.some(s=> s.id == msg.guildId)){
        prefijo = dataPre.servidores.find(f=> f.id == msg.guildId).prefijo
    }else{
        prefijo = "u!"
    }


    if(!msg.content.startsWith(prefijo) || !msg.guild.me.permissionsIn(msg.channel).has("SEND_MESSAGES")) return; 
    const args = msg.content.slice(prefijo.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase()


    if(comando == "help"){
        msg.channel.sendTyping()
        botDB.comandos.usos++

        const emb = new Discord.MessageEmbed()
        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`Hola, soy **${client.user.username}** un Bot multi fundacional, tengo comandos de moderación, comandos informativos y sistemas como el sistema de inter promoción.`)
        .setDescription(`Usa el comando \`\`${prefijo}comandos\`\` para conocer todos mis comandos.\nMi prefijo en este servidor es: ${"``"}${prefijo}${"``"}\b\n[📨 **Invítame a tu servidor**](${invitacion})\n[🔧 **Servidor de soporte**](https://discord.gg/fbE2sqA5kj)`)
        .setColor(colorEmb)
        .setFooter(client.user.username,client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()
        
        setTimeout(()=>{
            msg.reply({embeds: [emb]})
        }, 500)
    }

    if(comando == "comandos" || comando == "cmds"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        const embComandos = new Discord.MessageEmbed()
        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("📑 Comandos")
        .setDescription(`Un **comando** es una orden/instrucción que les das al Bot y a la que el Bot responde de cierta forma de acuerdo a la orden o nombre del comando.\n\n🌎 **Comandos generales:** *12*\nComandos que todos pueden usar.\n\n\`\`${prefijo}afk\`\` **|** Te establece el estado AFK dentro del servidor.\n\`\`${prefijo}user\`\` **|** Muestra información del usuario.\n\`\`${prefijo}stats\`\` **|** Muestra estadisticas generales de todos los servidores.\n\`\`${prefijo}jumbo\`\` **|** Muestra en grande un emoji del servidor.\n\`\`${prefijo}emojis\`\` **|** Muestra todos los emojis del servidor.\n\`\`${prefijo}avatar\`\` **|** Muestra el avatar del usuario.\n\`\`${prefijo}server\`\` **|** Muestra información del servidor.\n\`\`${prefijo}invite\`\` **|** Te muestra la invitación del bot.\n\`\`${prefijo}qrcode\`\` **|** Genera un código QR de un enlace.\n\`\`${prefijo}stikers\`\` **|** Te muestra todos los stikers del servidor.\n\`\`${prefijo}botinfo\`\` **|** Te muestra información del bot.\n\`\`${prefijo}reportbug\`\` **|** Reporta errores del bot.`)
        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
        .setColor(colorEmb)
        .setTimestamp()


        const menu = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("1")
            .setPlaceholder("📑 Selecciona un menu para ver los comandos de el.")
            .addOptions([
                {
                    emoji: "🌎",
                    label: "Generales",
                    description: "Muestra los comandos generales.",
                    value: "generales"
                },
                {
                    emoji: "👮",
                    label: "Moderacion",
                    description: "Muestra los comandos de moderacion.",
                    value: "moderacion"
                },
                {
                    emoji: "💎",
                    label: "Adminidtracion",
                    description: "Muestra los comandos de admonidtracion.",
                    value: "administracion"
                },
                {
                    emoji: emojis.puntos,
                    label: "Puntos",
                    description: "Te muestra los comandos del sistema de puntos.",
                    value: "puntos"
                }
            ])
        )

        setTimeout(async ()=>{
            const mensajeSend = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embComandos], components: [menu]})
            const filtro = i=> i.user.id === msg.author.id;
            const colector = mensajeSend.createMessageComponentCollector({filter: filtro, time: 6*60000})

            colector.on("collect", async menu => {
                if(menu.values[0] === "generales"){

                    embComandos
                    .setDescription(`Un **comando** es una orden/instrucción que les das al Bot y a la que el Bot responde de cierta forma de acuerdo a la orden o nombre del comando.\n\n🌎 **Comandos generales:** *12*\nComandos que todos pueden usar.\n\n\`\`${prefijo}afk\`\` **|** Te establece el estado AFK dentro del servidor.\n\`\`${prefijo}user\`\` **|** Muestra información del usuario.\n\`\`${prefijo}stats\`\` **|** Muestra estadisticas generales de todos los servidores.\n\`\`${prefijo}jumbo\`\` **|** Muestra en grande un emoji del servidor.\n\`\`${prefijo}emojis\`\` **|** Muestra todos los emojis del servidor.\n\`\`${prefijo}avatar\`\` **|** Muestra el avatar del usuario.\n\`\`${prefijo}server\`\` **|** Muestra información del servidor.\n\`\`${prefijo}invite\`\` **|** Te muestra la invitación del bot.\n\`\`${prefijo}qrcode\`\` **|** Genera un código QR de un enlace.\n\`\`${prefijo}stikers\`\` **|** Te muestra todos los stikers del servidor.\n\`\`${prefijo}botInfo\`\` **|** Te muestra información del bot.\n\`\`${prefijo}reportbug\`\` **|** Reporta errores del bot.`)
                    await menu.deferUpdate()
                    mensajeSend.edit({embeds: [embComandos]})
                }

                if(menu.values[0] === "moderacion"){
                    
                    embComandos
                    .setDescription(`Un **comando** es una orden/instrucción que les das al Bot y a la que el Bot responde de cierta forma de acuerdo  a la orden o nombre del comando.\n\n👮 **Comandos de moderacion:** *12*\nComandos que solo los moderadores pueden usar.\n\n\`\`${prefijo}record\`\` **|** Muestra el historial de sanciones de un miembro.\n\`\`${prefijo}deleterecord\`\` **|** Elimina una o varias sanciones del historial de un miembro.\n\`\`${prefijo}warn\`\` **|** Advierte a un miembro.\n\`\`${prefijo}mute\`\` **|** Aísla temporalmente a un miembro.\n\`\`${prefijo}unmute\`\` **|** Elimina el aislamiento temporal de un miembro.\n\`\`${prefijo}mutelist\`\` **|** Muestra una lista de todos los miembros que están aislados en el servidor.\n\`\`${prefijo}kick\`\` **|** Expulsa a un miembro del servidor.\n\`\`${prefijo}ban\`\` **|** Prohíbe a un usuario entrar al servidor.\n\`\`${prefijo}unban\`\` **|** Elimina la prohibición de un miembro al servidor.\n\`\`${prefijo}clear\`\` **|** Elimina múltiples mensajes en un canal o de un miembro.\n\`\`${prefijo}dmsend\`\` **|** Envía un mensaje directo por medio del bot a un miembro.\n\`\`${prefijo}banlist\`\` **|** Te muestra una lista de los usuarios baneados en el servidor.`)
                    menu.deferUpdate()
                    mensajeSend.edit({embeds: [embComandos]})
                }

                if(menu.values[0] === "administracion"){
                    
                    embComandos
                    .setDescription(`Un **comando** es una orden/instrucción que les das al Bot y a la que el Bot responde de cierta forma de acuerdo  a la orden o nombre del comando.\n\n💎 **Comandos de administración:** *8*\nComandos que solo los administradores pueden usar.\n\n\`\`${prefijo}setprefix\`\` **|** Establece un prefijo personalizado en este servidor.\n\`\`${prefijo}addrol\`\` **|** Añade un rol a un miembro o mas en el servidor.\n\`\`${prefijo}removerol\`\` **|** Remueve un rol de un miembro o mas en el servidor.\n\`\`${prefijo}createchannel\`\` **|** Crea un canal en el servidor.\n\`\`${prefijo}deletechannel\`\` **|** Elimina un canal del servidor.\n\`\`${prefijo}setslowmode\`\` **|** Establece el modo pausado de un canal de texto.\n\`\`${prefijo}memberswithrole\`\` **|** Muestra una lista con todos los miembros que tienen un rol.\n\`\`${prefijo}memberswithouttherole\`\` **|** Muestra una lista con todos los miembros que no tienen un rol.`)
                    menu.deferUpdate()
                    mensajeSend.edit({embeds: [embComandos]})
                }

                if(menu.values[0] === "puntos"){
                    embComandos
                    .setDescription(`Un **comando** es una orden/instrucción que les das al Bot y a la que el Bot responde de cierta forma de acuerdo  a la orden o nombre del comando.\n\n${emojis.puntos} **Comandos del sistem de puntos:** *10*\nComandos del sistema de puntos.\n\n\`\`${prefijo}points\`\` **|** Muestra la cantidad de puntos que tienes o tiene un miembro.\n\`\`${prefijo}addpoints\`\` **|** Agrega puntos a un miembro.\n\`\`${prefijo}removepoints\`\` **|** Elimina puntos a un miembro.\n\`\`${prefijo}setstaffrole\`\` **|** Establece un rol del staff o personal del servidor.\n\`\`${prefijo}deletestaffrole\`\` **|** Elimina un rol establecido como rol del staff del servidor.\n\`\`${prefijo}setemojipoints\`\` **|** Establece un símbolo o emoji personalizado para el sistema de puntos.\n\`\`${prefijo}pointsleaderboard\`\` **|** Muestra una tabla de clasificaciones con los miembros que han utilizado el sistema de puntos y sus respectivos puntos.\n\`\`${prefijo}pointsystemstatus\`\` **|** Muestra el estado del sistema en el servidor.\n\`\`${prefijo}removeusersystemp\`\` **|** Elimina a un miembro del sistema de puntos del servidor.\n\`\`${prefijo}updatepointssystem\`\` **|** Actualiza el sistema de puntos en el servidor eliminando del sistema a todos los usuarios que se han ido del servidor.`)
                    menu.deferUpdate()
                    mensajeSend.edit({embeds: [embComandos]})
                }
            })
            setTimeout(()=>{
                // msg.delete()
                mensajeSend.edit({embeds: [embComandos], components: []})
            }, 6*60000)
        }, 500)    
    }

    // 🌐 Comandos generales
    if(comando == "afk"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let dataAFK = await dbAFK.findOne({_id: msg.guildId})

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando afk`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}afk <Razón>\`\``},
            {name: "Ejemplo:", value: `${prefijo}afk Necesito descansar.`},
            {name: "Alias:", value: `\`\`afk\`\``},
            {name: "Descripción:", value: `Establece tu estado dentro del servidor como AFK y notifica a todos los miembros que te mencionen por que tu estado AFK.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(args[0] == "info") return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        if(dataAFK){
            if(msg.member.nickname){
                if(msg.member.nickname.length <= 26){
                    msg.member.setNickname(`[AFK] ${msg.member.nickname}`, `Razón: el miembro ha establecido su estado a AFK.`).catch(c=>{
                        return;
                    })
                }
                const embAFK = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname, msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("💤 AFK establecido")
                .setDescription(`${msg.author} se ha establecido tu estado AFK\n\n📝 **Razón:** ${args.join(" ") ? args.join(" "): "*No has proporcionado una razón*"}`)
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAFK]})
                }, 500)

                let us = dataAFK.servidor.usos
                dataAFK.servidor = {nombre: msg.guild.name, creado: Math.floor(msg.guild.createdAt / 1000), usos: us + 1}
                dataAFK.miembros.push({id: msg.author.id, tag: msg.author.tag, apodo: msg.member.nickname, razon: args.join(" ") ? args.join(" "): "*No ha proporcionado una razón*", tiempo: Math.floor(Date.now() / 1000)})
                await dataAFK.save()

            }else{
                if(msg.author.username.length <= 26){
                    msg.member.setNickname(`[AFK] ${msg.author.username}`, `Razón: el miembro ha establecido su estado a AFK.`).catch(c=>{
                        return;
                    })
                }
                
                const embAFK = new Discord.MessageEmbed()
                .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("💤 AFK establecido")
                .setDescription(`${msg.author} se ha establecido tu estado AFK\n\n📝 **Razón:** ${args.join(" ") ? args.join(" "): "*No has proporcionado una razón*"}`)
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAFK]})
                }, 500)

                let us = dataAFK.servidor.usos
                dataAFK.servidor = {nombre: msg.guild.name, creado: Math.floor(msg.guild.createdAt / 1000), usos: us + 1}
                dataAFK.miembros.push({id: msg.author.id, tag: msg.author.tag, apodo: msg.author.username, razon: args.join(" ") ? args.join(" "): "*No ha proporcionado una razón*", tiempo: Math.floor(Date.now() / 1000)})
                await dataAFK.save()
            }   

        }else{
            if(msg.member.nickname){
                if(msg.member.nickname.length <= 26){
                    msg.member.setNickname(`[AFK] ${msg.member.nickname}`, `Razón: el miembro ha establecido su estado a AFK.`).catch(c=>{
                        return;
                    })
                }
                let nuevaData = new dbAFK({
                    _id: msg.guildId,
                    servidor: {nombre: msg.guild.name, creado: Math.floor(msg.guild.createdAt / 1000), usos: 1},
                    miembros: [{id: msg.author.id, tag: msg.author.tag, apodo: msg.member.nickname, razon: args.join(" ") ? args.join(" "): "*No ha proporcionado una razón*", tiempo: Math.floor(Date.now() / 1000)}]
                })
    
                const embAFK = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname, msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("💤 AFK establecido")
                .setDescription(`${msg.author} se ha establecido tu estado AFK\n\n📝 **Razón:** ${args.join(" ") ? args.join(" "): "*No has proporcionado una razón*"}`)
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAFK]})
                }, 500)
                await nuevaData.save()  
                
            }else{
                if(msg.author.username.length <= 26){
                    msg.member.setNickname(`[AFK] ${msg.author.username}`, `Razón: el miembro ha establecido su estado a AFK.`).catch(c=>{
                        return;
                    })
                }
                let nuevaData = new dbAFK({
                    _id: msg.guildId,
                    servidor: {nombre: msg.guild.name, creado: Math.floor(msg.guild.createdAt / 1000), usos: 1},
                    miembros: [{id: msg.author.id, tag: msg.author.tag, apodo: msg.author.username, razon: args.join(" ") ? args.join(" "): "*No ha proporcionado una razón*", tiempo: Math.floor(Date.now() / 1000)}]
                })
    
                const embAFK = new Discord.MessageEmbed()
                .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("💤 AFK establecido")
                .setDescription(`${msg.author} se ha establecido tu estado AFK\n\n📝 **Razón:** ${args.join(" ") ? args.join(" "): "*No has proporcionado una razón*"}`)
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAFK]})
                }, 500)
                await nuevaData.save()  
            }
        }
    }

    if(comando == "user"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let plataforma = {
            "desktop": "💻 Escritorio/PC",
            "mobile": "📱 Móvil",
            "web": "🌐 Pagina web"
        }
        let presencia = {
            "dnd": "<:nomolestar:910277499865407539> No molestar",
            "idle": "<:ausente:910277557516124180> Ausente",
            "undefined": "<:desconectado:910277715293245541> Desconectado",
            "offline": "<:desconectado:910277715293245541> Desconectado",
            "online": "<:online:910277439928807434> Conectado"
        }

        let tyEstado = {
            "CUSTOM": "Personalizada:",
            "COMPETING": "Compitiendo",
            "LISTENING": "Escuchando",
            "PLAYING": "Jugando a",
            "STREAMING": "Trasmitiendo",
            "WATCHING": "Viendo"
        }

        let insignias = {
            "BUGHUNTER_LEVEL_1": "<:BughunterLevel1:920743741512368178> Cazador de bugs nivel 1",
            "BUGHUNTER_LEVEL_2": "<:BughunterLevel2:920744747914657842> Cazador de bugs nivel 2",
            "DISCORD_CERTIFIED_MODERATOR": "<:DiscordCertifiedModerator:920751094928384041> Moderador",
            "DISCORD_EMPLOYEE": "<:DiscordEmployee:920745583151575071> Empleado de Discord",
            "EARLY_SUPPORTER": "<:EarlySupporter:920741677931569182>",
            "EARLY_VERIFIED_BOT_DEVELOPER": "<:VerifiedBotDeveloper:920746956706414693> Desarrollador de bots verificado ",
            "HOUSE_BALANCE": "<:HouaseBalance:920750191508860928> Balance",
            "HOUSE_BRAVERY": "<:HouseBravery:920750033660416103> Bravery",
            "HOUSE_BRILLIANCE": "<:HouseBrilliance:920749159743635457> Brilliance",
            "HYPESQUAD_EVENTS": "<:HypeSquad:920754083940413500> Eventos de la hypesquad",
            "PARTNERED_SERVER_OWNER": "<:DiscordPartner:920746109259898890> Servidor socio",
            "VERIFIED_BOT": "<:VerifiedBot:920750538012885013> Bot verificado",
            "TEAM_USER": "👥"
        }

        let actyvidadA 
        if(msg.member.presence?.activities.length <= 0){
            actyvidadA = "Sin texto de estado"
        }
        if(msg.member.presence?.activities.length >=1){
            if(msg.member.presence?.activities[0].type === "CUSTOM"){
                actyvidadA = `${msg.member.presence?.activities[0].emoji ? msg.member.presence?.activities[0].emoji: ""} ${msg.member.presence?.activities[0].state}`
            }else{
                actyvidadA = `${tyEstado[msg.member.presence?.activities[0].type]} ${msg.member.presence?.activities[0].emoji ? msg.member.presence?.activities[0].emoji: ""} ${msg.member.presence?.activities[0].name}`
            }
        }

        let mBanner = await client.users.fetch(msg.author.id, {force: true})
        const embUser = new Discord.MessageEmbed()
        .setAuthor(`Tu información ${msg.member.nickname ? msg.member.nickname: msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(msg.author.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})) 
        .setImage(mBanner.bannerURL({dynamic: true, format: "jpg"||"gif", size: 4096}))
        .setDescription(`👤 Tu: ${msg.author}`)
        .addFields(
            {name: "🏷 **Tag:**", value: `${msg.author.tag}`, inline: true},
            {name: "🆔 **ID:**", value: `${msg.author.id}`, inline: true},
            {name: "📌 **Apodo:**", value: `${msg.member.nickname !== null ? `${msg.member.nickname}`: "*Ninguno*"}`, inline: true},
            {name: "📅 **Creaste la cuenta:**", value: `<t:${Math.round(msg.author.createdAt / 1000)}:R>`, inline: true},
            {name: "📥 **Te uniste:**", value: `<t:${Math.round(msg.member.joinedAt / 1000)}:R>`, inline: true},
            {name: `⚙️ **Plataforma:**`, value: `${msg.member.presence?.clientStatus ? plataforma[Object.keys(msg.member.presence?.clientStatus)[0]]: "*No obtenida*"}`, inline: true},
            {name: "<a:BoostAnimado:931289485700911184> **Booster:**", value: `${msg.member.premiumSince ? `Eres booster desde <t:${Math.floor(msg.member.premiumSinceTimestamp / 1000)}:R>`: "*No eres Booster*"}`, inline: true},
            {name: `🎖 **Insignias:** ${msg.author.flags.toArray().length}`, value: `${msg.author.flags.toArray().length ? msg.author.flags.toArray().map(i=> insignias[i]).join("\n") : "*No tienes insignias*"}`, inline: true},
            {name: "🔍 **Estado:**", value: `${presencia[msg.member.presence?.status]}\n${actyvidadA}`, inline: true},
        )
        .setColor(msg.author.hexAccentColor ? msg.author.hexAccentColor: msg.guild.me.displayHexColor)
        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})
        }, 500)

        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag === args.join(" "))

        if(miembro){
            let actyvidad 
            if(miembro.presence?.activities.length <= 0){
                actyvidad = "*Sin texto de estado*"
            }
            if(miembro.presence?.activities.length >=1){
                if(miembro.presence?.activities[0].type === "CUSTOM"){
                    actyvidad = `${miembro.presence?.activities[0].emoji ? miembro.presence?.activities[0].emoji: ""} ${miembro.presence?.activities[0].state}`
                }else{
                    actyvidad = `${tyEstado[miembro.presence?.activities[0].type]} ${miembro.presence?.activities[0].emoji ? miembro.presence?.activities[0].emoji: ""} ${miembro.presence?.activities[0].name}`
                }
            }

            let miemBanner = await client.users.fetch(miembro.id, {force: true})

            const embUser = new Discord.MessageEmbed()
            .setAuthor(`Información de ${msg.member.nickname ? msg.member.nickname: msg.author.username} pedida por el`,msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
            .setImage(miemBanner.bannerURL({dynamic: true, format: "png" || "gif", size: 4096}))
            .setDescription(`👤 Tu ${miembro}`)
            .addFields(
                {name: "🏷 **Tag:**", value: `${miembro.user.tag}`, inline: true},
                {name: "🆔 **ID:**", value: `${miembro.id}`, inline: true},
                {name: "📌 **Apodo:**", value: `${miembro.nickname !== null ? miembro.nickname: "*Ninguno*"}`, inline: true},
                {name: "📅 **Creaste la cuenta:**", value: `<t:${Math.round(miembro.user.createdAt / 1000)}:R>`, inline: true},
                {name: "📥 **Te uniste :**", value: `<t:${Math.round(miembro.joinedAt / 1000)}:R>`, inline: true},
                {name: `⚙️ **Plataforma:**`, value: `${miembro.presence?.clientStatus ? plataforma[Object.keys(miembro.presence?.clientStatus)[0]]: "*No obtenida*"}`, inline: true},
                {name: "<a:BoostAnimado:931289485700911184> **Booster:**", value: `${miembro.premiumSince ? `Eres booster desde <t:${Math.floor(msg.member.premiumSinceTimestamp / 1000)}:R>`: "*No eres Booster*"}`, inline: true},
                {name: `🎖 **Insignias:** ${miembro.user.flags.toArray().length}`, value: `${miembro.user.flags.toArray().length ? miembro.user.flags.toArray().map(i=> insignias[i]).join("\n") : "*No tienes insignias*"}`, inline: true},
                {name: "🔍 **Estado:**", value: `${presencia[miembro.presence?.status]}\n${actyvidad}`, inline: true},
            )
            .setColor(miembro.user.hexAccentColor ? miembro.user.hexAccentColor: msg.guild.me.displayHexColor)
            .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            if(miembro.id === msg.author.id) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})
            }, 500)
            
       
            if(miembro.user.bot){
                const embUser = new Discord.MessageEmbed()
                .setAuthor(`Información de ${miembro.user.username} pedida por ${msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                // .setImage(miemBanner.bannerURL({dynamic: true, format: "png" || "gif", size: 4096}))
                .setDescription(`🤖 Bot: ${miembro}`)
                .addFields(
                    {name: "🏷 **Tag:**", value: `${miembro.user.tag}`, inline: true},
                    {name: "🆔 **ID:**", value: `${miembro.user.id}`, inline: true},
                    {name: "📌 **Apodo:**", value: `${miembro.nickname !== null ? `${miembro.nickname}`: "*Ninguno*"}`, inline: true},
                    {name: "📅 **Fue creado:**", value: `<t:${Math.round(miembro.user.createdAt / 1000)}:R>`, inline: true},
                    {name: "📥 **Se unio:**", value: `<t:${Math.round(miembro.joinedAt / 1000)}:R>`, inline: true},
                    {name: `⚙️ **Plataforma:**`, value: `${miembro.presence?.clientStatus ? plataforma[Object.keys(miembro.presence?.clientStatus)[0]]: "*No obtenida*"}`, inline: true},
                    {name: `🎖 **Insignias:** ${miembro.user.flags.toArray().length}`, value: `${miembro.user.flags.toArray().length ? miembro.user.flags.toArray().map(i=> insignias[i]).join("\n") : "*No tiene insignias*"}`, inline: true},
                    {name: "🔍 **Estado:**", value: `${presencia[miembro.presence?.status]}\n${actyvidad}`, inline: true},
                )
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})
                }, 500)
            }else{
                const embUser = new Discord.MessageEmbed()
                .setAuthor(`Información de ${miembro.nickname ? miembro.nickname: miembro.user.username} pedida por ${msg.member.nickname ? msg.member.nickname: msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})) 
                .setImage(miemBanner.bannerURL({dynamic: true, format: "png" || "gif", size: 4096}))
                .setDescription(`👤 Miembro: ${miembro}`)
                .addFields(
                    {name: "🏷 **Tag:**", value: `${miembro.user.tag}`, inline: true},
                    {name: "🆔 **ID:**", value: `${miembro.user.id}`, inline: true},
                    {name: "📌 **Apodo:**", value: `${miembro.nickname !== null ? `${miembro.nickname}`: "*Ninguno*"}`, inline: true},
                    {name: "📅 **Creo la cuenta:**", value: `<t:${Math.round(miembro.user.createdAt / 1000)}:R>`, inline: true},
                    {name: "📥 **Se unio:**", value: `<t:${Math.round(miembro.joinedAt / 1000)}:R>`, inline: true},
                    {name: `⚙️ **Plataforma:**`, value: `${miembro.presence?.clientStatus ? plataforma[Object.keys(miembro.presence?.clientStatus)[0]]: "*No obtenida*"}`, inline: true},
                    {name: "<a:BoostAnimado:931289485700911184> **Booster:**", value: `${miembro.premiumSince ? `Es booster desde <t:${Math.floor(miembro.premiumSinceTimestamp / 1000)}:R>`: "*No es Booster*"}`, inline: true},
                    {name: `<:aislacion:947965052772814848> **Aislamiento temporal:**`, value: `${miembro.isCommunicationDisabled() ? `Si, termina <t:${Math.floor(miembro.communicationDisabledUntilTimestamp / 1000)}:R>`: "*No*"}`, inline: true},
                    {name: `🎖 **Insignias:** ${miembro.user.flags.toArray().length}`, value: `${miembro.user.flags.toArray().length ? miembro.user.flags.toArray().map(i=> insignias[i]).join("\n") : "*No tiene insignias*"}`, inline: true},
                    {name: "🔍 **Estado:**", value: `${presencia[miembro.presence?.status]}\n${actyvidad}`, inline: true},
                )
                .setColor(miembro.user.hexAccentColor ? miembro.user.hexAccentColor: msg.guild.me.displayHexColor)
                .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})
                }, 500)
            }
    
        }else{
            let descripciones = [`El argumento numérico  ingresado (*${args[0]}*) no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado (*${args[0]}*) no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor o usuario externo, proporciona una mención, ID o etiqueta valida.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
            await client.users.fetch(args[0], {force: true}).then(async usuario =>{
                if(usuario.bot){
                    console.log(usuario.hexAccentColor)
                    const embUser = new Discord.MessageEmbed()
                    .setAuthor(`Información de ${usuario.tag} pedida por ${msg.member.nickname ? msg.member.nickname: msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(usuario.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})) 
                    .setImage(usuario.bannerURL({dynamic: true, format: "jpg"||"gif", size: 4096}))
                    .setDescription(`🤖 Bot externo: ${usuario}`)
                    .addFields(
                        {name: "🏷 **Tag:**", value: `${usuario.tag}`, inline: true},
                        {name: "🆔 **ID:**", value: `${usuario.id}`, inline: true},
                        {name: "📅 **Fue creado:**", value: `<t:${Math.round(usuario.createdAt / 1000)}:R>`, inline: true},
                        {name: `🎖 **Insignias:** ${usuario.flags.toArray().length}`, value: `${usuario.flags.toArray().length ? usuario.flags.toArray().map(i=> insignias[i]).join("\n") : "*No tiene insignias*"}`, inline: true},
                        {name: "⛔ **Baneado:**", value: `${(await msg.guild.bans.fetch()).find(f=> f.user.id === usuario.id) ? `__Si, por la razón:__ *${(await msg.guild.bans.fetch()).find(f=> f.user.id === usuario.id).reason}*`: "*No*"}`, inline: true},
                    )
                    .setColor(msg.guild.me.displayHexColor)
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})
                    }, 500)
                }else{
                    const embUser = new Discord.MessageEmbed()
                    .setAuthor(`Información de ${usuario.tag} pedida por ${msg.member.nickname ? msg.member.nickname: msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(usuario.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})) 
                    .setImage(usuario.bannerURL({dynamic: true, format: "jpg"||"gif", size: 4096}))
                    .setDescription(`👤 Usuario externo: ${usuario}`)
                    .addFields(
                        {name: "🏷 **Tag:**", value: `${usuario.tag}`, inline: true},
                        {name: "🆔 **ID:**", value: `${usuario.id}`, inline: true},
                        {name: "📅 **Creo la cuenta:**", value: `<t:${Math.round(usuario.createdAt / 1000)}:R>`, inline: true},
                        {name: `🎖 **Insignias:** ${usuario.flags.toArray().length}`, value: `${usuario.flags.toArray().length ? usuario.flags.toArray().map(i=> insignias[i]).join("\n") : "*No tiene insignias*"}`, inline: true},
                        {name: "⛔ **Baneado:**", value: `${(await msg.guild.bans.fetch()).find(f=> f.user.id === usuario.id) ? `__Si, por la razón:__ *${(await msg.guild.bans.fetch()).find(f=> f.user.id === usuario.id).reason}*`: "*No*"}`, inline: true},
                    )
                    .setColor(usuario.hexAccentColor ? usuario.hexAccentColor: msg.guild.me.displayHexColor)
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUser]})
                    }, 500)
                }
            }).catch(c=>{
                const embErrU1 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`El argumento proporcionado (*${args[0]}*) no es una ID valida aun que este conformado por 18 caracteres numericos no coresponde con la ID de ningun usuario de Discord.`)
                .setColor(ColorError)
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrU1]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)
            })
        }     
    }

    if(comando == "stats"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let textCh = client.channels.cache.filter(ft=>ft.type==="GUILD_TEXT").size, voiseCH = client.channels.cache.filter(fv=>fv.type==="GUILD_VOICE").size, cateCh = client.channels.cache.filter(fc=>fc.type==="GUILD_CATEGORY").size

        let ping
        if(client.ws.ping <= 60){
            ping = "<:30ms:917227036890791936>"
        }
        if(client.ws.ping > 60 && client.ws.ping < 120){
            ping = "<:60ms:917227058399162429>"
        }
        if(client.ws.ping > 120){
            ping = "<:150ms:917227075243503626>"
        }

        const embed = new Discord.MessageEmbed()
        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("<:grafica:958856872981585981> Estadisticas")
        .addFields(
            {name: "<:wer:920166217086537739> **Servidores:**", value: `${client.guilds.cache.size.toLocaleString()}`, inline: true},
            {name: "📑 **Comandos:**", value: `42`, inline: true},
            {name: "<:cronometro:948693729588441149> **Uptime:**", value: `${ms(client.uptime)}`, inline: true},
            {name: `${ping} **Ping:**`, value: `${client.ws.ping} ms`, inline: true},
            {name: "🔢 **Usos de comandos:**", value: `${botDB.comandos.usos.toLocaleString()}`, inline: true},
            {name: `😀 **Emojis:** ${client.emojis.cache.size.toLocaleString()}`, value: `${client.emojis.cache.filter(fn=>!fn.animated).size.toLocaleString()} normales\n${client.emojis.cache.filter(fa=>fa.animated).size.toLocaleString()} animados`,inline: true},
            {name: `👥 **Usuarios: ${client.users.cache.size.toLocaleString()}**`, value: `👤 ${client.users.cache.filter(fu => !fu.bot).size.toLocaleString()} miembros\n🤖 ${client.users.cache.filter(fb => fb.bot).size.toLocaleString()} bots`, inline: true},
            {name: ` **Canales: ${(textCh+voiseCH+cateCh).toLocaleString()}**`, value: `<:canaldetexto:904812801925738557> ${textCh.toLocaleString()} texto\n <:canaldevoz:904812835295596544> ${voiseCH.toLocaleString()} voz\n<:carpeta:920494540111093780> ${cateCh.toLocaleString()} categorías`, inline: true},
        )
        .setColor(msg.guild.me.displayHexColor)
        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
        .setTimestamp()
        setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})
        }, 500)
    }

    if(comando == "jumbo"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let emojisSV = msg.guild.emojis.cache.map(e=>e)
        let emR = Math.floor(Math.random()*emojisSV.length)
        const embInfo = new Discord.MessageEmbed()
        .setAuthor(`${emojis.lupa} Comando jumbo`)
        .addFields(
            {name: "Uso:", value: `${"``"}${prefijo}jumbo <Emoji>${"``"}`},
            {name: "Ejemplo:", value: `${prefijo}jumbo ${emojisSV[emR]}`},
            {name: "Alias:", value: `\`\`jumbo\`\``},
            {name: "Descripción:", value: `Da una imagen ampliada del emoji proporcionado.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let emoji = client.emojis.cache.find(em=> em.id === args[0].split(":")[2].split(">")[0])

        let condicionales = [!/\p{Emoji}/gu.test(args[0]), !args[0].includes(":"), !emoji]
        let descripciones = [`El argumento proporcionado \`\`${args[0]}\`\` no es un emoji.`, `El emoji proporcionado es un emoji publico, no puedo darte una imagen ampliada de el, proporciona un emoji de este servidor o de otro servidor.`, `No he podido encontrar ese emoji, puede ser por que no estoy en el servidor de origen de ese emoji.`]
        for(let e=0; e<condicionales.length; e++){
            if(condicionales[e]){
                const embErrEmojis = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(descripciones[e])
                .setColor(ColorError)
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: { repliedUser: false}, embeds: [embErrEmojis]}).then(tm=> setTimeout(()=>{
                        msg.delete().catch(t=> {
                            return;
                        })
                        tm.delete().catch(t=> {
                            return;
                        })
                    }, 30000))
                }, 500)
            }
        }
        
        const embJumbo = new Discord.MessageEmbed()
        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setImage(emoji.url)
        .setDescription(`[**${emoji.name}**](${emoji.url})`)
        .setColor(msg.guild.me.displayHexColor)
        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
        .setTimestamp()
        setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embJumbo]})
        }, 500)
    }

    if(comando == "emojis"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let emojisAl = ["😃","😄","😅","🤣","😊","🤪","😐","😝","🤑","😡"], emojRandom = Math.floor(Math.random()*emojisAl.length), emojis = msg.guild.emojis.cache
        
        const embNoEmojis = new Discord.MessageEmbed()
        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle(`${emojisAl[emojRandom]} Emojis del servidor`)
        .setDescription(`*Este servidor no tiene emojis propios.*`)
        .setColor(msg.guild.me.displayHexColor)
        .setTimestamp()
        if(emojis.size <= 0) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embNoEmojis]})
        }, 500)

        if(msg.guild.emojis.cache.size <= 10){
            const embEmojis = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`${emojisAl[emojRandom]} Emojis del servidor`)
            .setDescription(`Emojis: **${emojis.size}**\n\n${emojis.map(e=>e).map((en, e)=>`**${e+1}.**  ${en}\n${"``"}${en}${"``"}\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado": "Normal"}`).slice(0,10).join("\n\n")}`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(`Pagina - 1/1`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEmojis]})
            }, 500)

        }else{
            let segPage
            if(String(emojis.size).slice(-1) === "0"){
                segPage = Math.floor(emojis.size / 10)
            }else{
                segPage = Math.floor(emojis.size / 10 + 1)
            }

            let em1 = 0, em2 = 10, pagina = 1

            const embEmojis = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`${emojisAl[emojRandom]} Emojis del servidor`)
            .setDescription(`Emojis: **${emojis.size}**\n\n${emojis.map(e=>e).map((en, e)=>`**${e+1}.**  ${en}\n${"``"}${en}${"``"}\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado": "Normal"}`).slice(em1,em2).join("\n\n")}`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()

            const botones1 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("SECONDARY")
                    .setDisabled(true)
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente ")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("PRIMARY")
                ]
            )

            const botones2 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("PRIMARY")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("PRIMARY")
                ]
            )

            const botones3 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("PRIMARY")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("SECONDARY")
                    .setDisabled(true)
                ]
            )

            setTimeout(async () => {
                const mensajeSend = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEmojis], components: [botones1]})
                const filtro = i=> i.user.id === msg.author.id;
                const colector = mensajeSend.createMessageComponentCollector({filter: filtro, time: segPage*60000})
    
                setTimeout(()=>{
                    mensajeSend.edit({embeds: [embEmojis], components: []})
                }, segPage*60000)
    
                colector.on("collect", async botn => {
                    if(botn.customId === "1"){
                        if(em2 - 10 <= 10){
                            em1-=10, em2-=10, pagina--
    
                            embEmojis
                            .setDescription(`Emojis: **${emojis.size}**\n\n${emojis.map(e=>e).map((en, e)=>`**${e+1}.**  ${en}\n${"``"}${en}${"``"}\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado": "Normal"}`).slice(em1,em2).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            return await botn.update({embeds: [embEmojis], components: [botones1]})
                        }
                        em1-=10, em2-=10, pagina--
    
                        embEmojis
                        .setDescription(`Emojis: **${emojis.size}**\n\n${emojis.map(e=>e).map((en, e)=>`**${e+1}.**  ${en}\n${"``"}${en}${"``"}\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado": "Normal"}`).slice(em1,em2).join("\n\n")}`)
                        .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                        await botn.update({embeds: [embEmojis], components: [botones2]})
                    }
                    if(botn.customId === "2"){
                        if(em2 + 10 >= emojis.size){
                            em1+=10, em2+=10, pagina++
    
                            embEmojis
                            .setDescription(`Emojis: **${emojis.size}**\n\n${emojis.map(e=>e).map((en, e)=>`**${e+1}.**  ${en}\n${"``"}${en}${"``"}\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado": "Normal"}`).slice(em1,em2).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            return await botn.update({embeds: [embEmojis], components: [botones3]})
                        }
                        em1+=10, em2+=10, pagina++
    
                        embEmojis
                        .setDescription(`Emojis: **${emojis.size}**\n\n${emojis.map(e=>e).map((en, e)=>`**${e+1}.**  ${en}\n${"``"}${en}${"``"}\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado": "Normal"}`).slice(em1,em2).join("\n\n")}`)
                        .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                        return await botn.update({embeds: [embEmojis], components: [botones2]})
                    }
                })
            }, 500)
        }
    }

    if(comando == "stikers"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let stikers = msg.guild.stickers.cache

        const embNoStikers = new Discord.MessageEmbed()
        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle(`<:sticker:920136186687795262> Stikers del servidor`)
        .setDescription(`*Este servidor no tiene stikers propios.*`)
        .setColor(msg.guild.me.displayHexColor)
        .setTimestamp()
        if(stikers.size <= 0) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embNoStikers]})
        }, 500)

        if(stikers.size <= 10){
            const embStikers = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`<:sticker:920136186687795262> Stikers del servidor`)
            .setDescription(`Stikers: **${stikers.size}**\n\n${stikers.map(e=>e).map((en, e)=>`**${e+1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(0,10).join("\n\n")}`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(`Pagina - 1/1`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embStikers]})
            }, 500)

        }else{
            let segPage
            if(String(stikers.size).slice(-1) === "0"){
                segPage = Math.floor(stikers.size / 10)
            }else{
                segPage = Math.floor(stikers.size / 10 + 1)
            }

            let em1 = 0, em2 = 10, pagina = 1

            const embEmojis = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`<:sticker:920136186687795262> Stikers del servidor`)
            .setDescription(`Stikers: **${stikers.size}**\n\n${stikers.map(e=>e).map((en, e)=>`**${e+1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(em1,em2).join("\n\n")}`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()

            const botones1 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("SECONDARY")
                    .setDisabled(true)
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente ")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("PRIMARY")
                ]
            )

            const botones2 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("PRIMARY")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("PRIMARY")
                ]
            )

            const botones3 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("PRIMARY")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("SECONDARY")
                    .setDisabled(true)
                ]
            )

            setTimeout(async () => {
                const mensajeSend = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEmojis], components: [botones1]})
                const filtro = i=> i.user.id === msg.author.id;
                const colector = mensajeSend.createMessageComponentCollector({filter: filtro, time: segPage*60000})
    
                setTimeout(()=>{
                    mensajeSend.edit({embeds: [embEmojis], components: []})
                }, segPage*60000)
    
                colector.on("collect", async botn => {
                    if(botn.customId === "1"){
                        if(em2 - 10 <= 10){
                            em1-=10, em2-=10, pagina--
    
                            embEmojis
                            .setDescription(`Stikers: **${stikers.size}**\n\n${stikers.map(e=>e).map((en, e)=>`**${e+1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(em1,em2).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            return await botn.update({embeds: [embEmojis], components: [botones1]})
                        }
                        em1-=10, em2-=10, pagina--
    
                        embEmojis
                        .setDescription(`Stikers: **${stikers.size}**\n\n${stikers.map(e=>e).map((en, e)=>`**${e+1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(em1,em2).join("\n\n")}`)
                        .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                        await botn.update({embeds: [embEmojis], components: [botones2]})
                    }
                    if(botn.customId === "2"){
                        if(em2 + 10 >= emojis.size){
                            em1+=10, em2+=10, pagina++
    
                            embEmojis
                            .setDescription(`Stikers: **${stikers.size}**\n\n${stikers.map(e=>e).map((en, e)=>`**${e+1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(em1,em2).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            return await botn.update({embeds: [embEmojis], components: [botones3]})
                        }
                        em1+=10, em2+=10, pagina++
    
                        embEmojis
                        .setDescription(`Stikers: **${stikers.size}**\n\n${stikers.map(e=>e).map((en, e)=>`**${e+1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(em1,em2).join("\n\n")}`)
                        .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                        return await botn.update({embeds: [embEmojis], components: [botones2]})
                    }
                })
            })
        }
    }

    if(comando == "botslists" && msg.author.id == creadorID){
        msg.channel.sendTyping()
        botDB.comandos.usos++

        const embBotsLists = new Discord.MessageEmbed()
        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("🤖 Bots lists")
        .setDescription(`[<:topgg:934246215342772234> Top.gg](https://top.gg/bot/841531159778426910)\n[<:CDBotList:934253710446559242> CDBotList](https://www.cdbotlist.xyz/bots/841531159778426910)`)
        .setColor(msg.guild.me.displayHexColor)
        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
        .setTimestamp()

        const botones = new Discord.MessageActionRow()
        .addComponents(
            [
                new Discord.MessageButton()
                .setLabel("Top.gg")
                .setEmoji("<:topgg:934246215342772234>")
                .setStyle("LINK")
                .setURL("https://top.gg/bot/841531159778426910")
            ],
            [
                new Discord.MessageButton()
                .setLabel("CDBotList")
                .setEmoji("<:CDBotList:934253710446559242>")
                .setStyle("LINK")
                .setURL("https://www.cdbotlist.xyz/bots/841531159778426910")
            ]
        )
        setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBotsLists], components: [botones]})
        }, 500)
    }
    
    if(comando == "avatar"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        const embAva = new Discord.MessageEmbed()
        .setAuthor(`Tu avatar ${msg.member.nickname ? msg.member.nickname: msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("Avatar")
        .setURL(msg.author.displayAvatarURL({dynamic: true, format: "png" || "gif", size: 4096}))
        .setImage(msg.author.displayAvatarURL({dynamic: true, format: "png" || "gif", size: 4096}))
        .setColor(msg.guild.me.displayHexColor)
        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAva]})
        }, 500)

        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag === args.join(" "))

        if(miembro){
            const embAva = new Discord.MessageEmbed()
            .setAuthor(`Avatar de ${miembro.nickname ? miembro.nickname: miembro.user.tag} pedido por ${msg.member.nickname ? msg.member.nickname: msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("Avatar")
            .setURL(miembro.user.displayAvatarURL({dynamic: true, format: "png", size: 4096}))
            .setImage(miembro.user.displayAvatarURL({dynamic: true, format: "png", size: 4096}))
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(msg.guild.name,msg.guild.iconURL({dynamic:true}))
            .setTimestamp()
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAva]})
            }, 500)
        }else{
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida.`, `El argumento proporcionado *(${args[0]})* tiene las caracteristicas de una **ID**, es numérico, contiene **18** caracteres pero no coresponde con la **ID** de ningun miembro del servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0]), args[0].length == 18]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            await client.users.fetch(args[0], {force: true}).then(usuario=>{
                const embAva = new Discord.MessageEmbed()
                .setAuthor(`Avatar de ${usuario.tag} pedido por ${msg.member.nickname ? msg.member.nickname: msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("Avatar")
                .setURL(usuario.displayAvatarURL({dynamic: true, format: "png", size: 4096}))
                .setImage(usuario.displayAvatarURL({dynamic: true, format: "png", size: 4096}))
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(msg.guild.name,msg.guild.iconURL({dynamic:true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAva]})
                }, 500)
            }).catch(c=>{
                const embErrU1 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`El argumento proporcionado (${args[0]}) no es una ID valida aun que este conformado por 18 caracteres numericos no coresponde con la ID de ningun usuario de Discord.`)
                .setColor(ColorError)
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrU1]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)
            })
        }
    }

    if(comando == "server" || comando === "servidor"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let feat = {
            "ANIMATED_ICON": "Icono animado",
            "BANNER": "Banner",
            "COMMERCE": "Comercio",
            "COMMUNITY": "Comunidad",
            "DISCOVERABLE": "Reconocible",
            "FEATURABLE": "Destacado",
            "INVITE_SPLASH": "Invite splash",
            "MEMBER_VERIFICATION_GATE_ENABLED": "Puerta de verificación de miembros habilitada",
            "MONETIZATION_ENABLED": "Monetización habilitada",
            "MORE_STICKERS": "Mas pegatinas",
            "NEWS": "Noticias",
            "PARTNERED": "Asociado",
            "THREADS_ENABLED": "Hilos habilitados",
            "PREVIEW_ENABLED": "Vista previa habilitada",
            "PRIVATE_THREADS": "Hilos privados",
            "SEVEN_DAY_THREAD_ARCHIVE": "Archivo de hilo de siete días",
            "THREE_DAY_THREAD_ARCHIVE": "Archivo de hilo de tres días",
            "TICKETED_EVENTS_ENABLED": "Eventos con ticket habilitados",
            "VANITY_URL": "URL personalizada",
            "VERIFIED": "Verificado",
            "VIP_REGIONS": "Regiones VIP",
            "WELCOME_SCREEN_ENABLED": "Pantalla de bienvenida habilitada",
            "ENABLED_DISCOVERABLE_BEFORE": "Descubrimiento habilitado antes",
            "NEW_THREAD_PERMISSIONS": "Permisos para hilos nuevos"
        }

        let verificacion ={
            "NONE": "Ninguno",
            "LOW": "Bajo",
            "MEDIUM": "Medio",
            "HIGH": "Alto",
            "VERY_HIGH": "Muy alto"
        }

        let levelMejora = {
            "NONE": "Ninguno",
            "TIER_1": "<:Tier1:921852504713625670> Nivel 1",
            "TIER_2": "<:Tier2:921852557691863082> Nivel 2",
            "TIER_3": "<:Tier3:921852589933469716> Nivel 3"
        }

        let filterNSFW = {
            "DISABLED": "Deshabilitado",
            "MEMBERS_WITHOUT_ROLES": "Miembros sin rol",
            "ALL_MEMBERS": "Todos los miembros"
        }

        let notifi = {
            "ALL_MESSAGES": "Todos los mensajes",
            "ONLY_MENTIONS": "Solo menciones"
        }

        let imgs 
        
        if(msg.guild.bannerURL() && msg.guild.discoverySplashURL() && msg.guild.splashURL()){
            imgs = `[Banner](${msg.guild.bannerURL({size: 4096, format: "png"})}) | [Splash](${msg.guild.splashURL({size: 4096, format: "png"})}) | [Discovery](${msg.guild.discoverySplashURL({size: 4096, format: "png"})})`
        }else{
            if(msg.guild.splashURL() && msg.guild.discoverySplashURL()){
                imgs = `[Splash](${msg.guild.splashURL({size: 4096, format: "png"})}) | [Discovery](${msg.guild.discoverySplashURL({size: 4096, format: "png"})})`
            }else{
                if(msg.guild.bannerURL() && msg.guild.splashURL()){
                    imgs = `[Banner](${msg.guild.bannerURL({size: 4096, format: "png"})}) | [Splash](${msg.guild.splashURL({size: 4096, format: "png"})})`
                }else{
                    if(msg.guild.bannerURL() && msg.guild.discoverySplashURL()){
                        imgs = `[Banner](${msg.guild.bannerURL({size: 4096, format: "png"})}) | [Discovery](${msg.guild.discoverySplashURL({size: 4096, format: "png"})})`
                    }else{
                        if(msg.guild.bannerURL()){
                            imgs = `[Banner](${msg.guild.bannerURL({size: 4096, format: "png"})})`
                        }else{
                            if(msg.guild.splashURL()){
                                imgs = `[Splash](${msg.guild.splashURL({size: 4096, format: "png"})})`
                            }else{
                                if(msg.guild.discoverySplashURL()){
                                    imgs = `[Discovery](${msg.guild.discoverySplashURL({size: 4096, format: "png"})})`
                                }else{
                                    imgs = "\u200B"
                                }
                            }
                        }
                    }
                }
            }
        }


        let mgmc = msg.guild.members.cache
        let enlinea = mgmc.filter(fm => fm.presence?.status === "online" ).size
        let ausente = mgmc.filter(fm => fm.presence?.status === "idle").size
        let nomolestar = mgmc.filter(fm => fm.presence?.status === "dnd").size
        let todos = msg.guild.members.cache.size
        let bots = msg.guild.members.cache.filter(fb => fb.user.bot).size.toLocaleString()

        let chText = msg.guild.channels.cache.filter(t=>t.type==="GUILD_TEXT").size, chVoize = msg.guild.channels.cache.filter(v=>v.type==="GUILD_VOICE").size, chCategorie = msg.guild.channels.cache.filter(c=>c.type==="GUILD_CATEGORY").size

        if(msg.guild.features.length >= 1 && msg.guild.me.permissions.has(["BAN_MEMBERS","MANAGE_GUILD"])){
            const embServer = new Discord.MessageEmbed()
            .setThumbnail(msg.guild.iconURL({dynamic: true, format: "png"||"gif", size: 4096}))
            .setAuthor(msg.guild.name,msg.guild.iconURL({dynamic: true}))
            .setImage(msg.guild.bannerURL({format: "png", size: 4096}))
            .setTitle("<a:Info:926972188018479164> Informacion del servidor")
            .addFields(
                {name: "📃 **Descripcion:**", value: `${msg.guild.description !== null ? msg.guild.description: "Sin descripción"}`},
                {name: "🆔 **ID:**", value: `${msg.guild.id}`, inline: true},
                {name: "👑 **Propiedad de:**", value: `<@${msg.guild.ownerId}>`, inline: true},
                {name: `📅 **Creado:**`, value: `<t:${Math.floor(msg.guild.createdAt / 1000)}:R>`, inline: true},
                {name: `<:verified:947322016086753330> **Verificado:**`, value: `${msg.guild.verified ? "Si": "No"}`, inline: true},
                {name: `<:DiscordPartner:920746109259898890> **Socio:**`, value: `${msg.guild.partnered ? "Si es socio": "No es socio"}`, inline: true},
                {name: `😃 **Emojis:** ${msg.guild.emojis.cache.size.toLocaleString()}`, value: `${msg.guild.emojis.cache.filter(n=> !n.animated).size.toLocaleString()} normales\n${msg.guild.emojis.cache.filter(a=> a.animated).size.toLocaleString()} animados`, inline: true},
                {name: `<:sticker:920136186687795262> **Stikers:**`, value: `${msg.guild.stickers.cache.size.toLocaleString()}`, inline: true},
                {name: "💈 **Roles:**", value: `${msg.guild.roles.cache.size}`, inline: true},
                {name: `✉ **Invitaciones creadas:**`, value: `${(await msg.guild.invites.fetch()).size.toLocaleString()}`, inline: true},
                {name: `⛔ **Baneos:**`, value: `${(await msg.guild.bans.fetch()).size.toLocaleString()}`, inline: true},
                {name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true},
                {name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true},
                {name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true},
                {name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true},
                {name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true},
                {name: `<:menu:947318717371527178> **Canales:** ${(chText+chVoize+chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()}`, inline: true},
                {name: `👥 **Miembros:** ${msg.guild.members.cache.size.toLocaleString()}`, value: `👤 ${mgmc.filter(u=> !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:910277439928807434> ${(enlinea+ausente+nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true},
                {name: `📋 **Características:** ${msg.guild.features.length}`, value: `${msg.guild.features.map(f=> feat[f]).join(" **|** ")}`, inline: false},
                {name: `\u200B`, value: `${imgs}`, inline: true},
            )
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embServer]})
            }, 500)

        }else{
            if(msg.guild.me.permissions.has(["BAN_MEMBERS","MANAGE_GUILD"])){        
                const embServer = new Discord.MessageEmbed()
                .setThumbnail(msg.guild.iconURL({dynamic: true, format: "png"||"gif", size: 4096}))
                .setAuthor(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                .setImage(msg.guild.bannerURL({format: "png", size: 4096}))
                .setTitle("<a:Info:926972188018479164> Informacion del servidor")
                .addFields(
                    {name: "📃 **Descripcion:**", value: `${msg.guild.description !== null ? msg.guild.description: "Sin descripción"}`},
                    {name: "🆔 **ID:**", value: `${msg.guild.id}`, inline: true},
                    {name: "👑 **Propiedad de:**", value: `<@${msg.guild.ownerId}>`, inline: true},
                    {name: `📅 **Creado:**`, value: `<t:${Math.floor(msg.guild.createdAt / 1000)}:R>`, inline: true},
                    {name: `<:verified:947322016086753330> **Verificado:**`, value: `${msg.guild.verified ? "Si": "No"}`, inline: true},
                    {name: `<:DiscordPartner:920746109259898890> **Socio:**`, value: `${msg.guild.partnered ? "Si es socio": "No es socio"}`, inline: true},
                    {name: `😃 **Emojis:** ${msg.guild.emojis.cache.size.toLocaleString()}`, value: `${msg.guild.emojis.cache.filter(n=> !n.animated).size.toLocaleString()} normales\n${msg.guild.emojis.cache.filter(a=> a.animated).size.toLocaleString()} animados`, inline: true},
                    {name: `<:sticker:920136186687795262> **Stikers:**`, value: `${msg.guild.stickers.cache.size.toLocaleString()}`, inline: true},
                    {name: "💈 **Roles:**", value: `${msg.guild.roles.cache.size}`, inline: true},
                    {name: `✉ **Invitaciones creadas:**`, value: `${(await msg.guild.invites.fetch()).size.toLocaleString()}`, inline: true},
                    {name: `⛔ **Baneos:**`, value: `${(await msg.guild.bans.fetch()).size.toLocaleString()}`, inline: true},
                    {name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true},
                    {name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true},
                    {name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true},
                    {name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true},
                    {name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true},
                    {name: `<:menu:947318717371527178> **Canales:** ${(chText+chVoize+chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()}`, inline: true},
                    {name: `👥 **Miembros:** ${msg.guild.members.cache.size.toLocaleString()}`, value: `👤 ${mgmc.filter(u=> !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:904556872005222480> ${(enlinea+ausente+nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true},
                    {name: `\u200B`, value: `${imgs}`, inline: true},
                )
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embServer]})
                }, 500)

            }else{
                if(msg.guild.me.permissions.has("BAN_MEMBERS")){
                    const embServer = new Discord.MessageEmbed()
                    .setThumbnail(msg.guild.iconURL({dynamic: true, format: "png"||"gif", size: 4096}))
                    .setAuthor(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setImage(msg.guild.bannerURL({format: "png", size: 4096}))
                    .setTitle("<a:Info:926972188018479164> Informacion del servidor")
                    .addFields(
                        {name: "📃 **Descripcion:**", value: `${msg.guild.description !== null ? msg.guild.description: "Sin descripción"}`},
                        {name: "🆔 **ID:**", value: `${msg.guild.id}`, inline: true},
                        {name: "👑 **Propiedad de:**", value: `<@${msg.guild.ownerId}>`, inline: true},
                        {name: `📅 **Creado:**`, value: `<t:${Math.floor(msg.guild.createdAt / 1000)}:R>`, inline: true},
                        {name: `<:verified:947322016086753330> **Verificado:**`, value: `${msg.guild.verified ? "Si": "No"}`, inline: true},
                        {name: `<:DiscordPartner:920746109259898890> **Socio:**`, value: `${msg.guild.partnered ? "Si es socio": "No es socio"}`, inline: true},
                        {name: `😃 **Emojis:** ${msg.guild.emojis.cache.size.toLocaleString()}`, value: `${msg.guild.emojis.cache.filter(n=> !n.animated).size.toLocaleString()} normales\n${msg.guild.emojis.cache.filter(a=> a.animated).size.toLocaleString()} animados`, inline: true},
                        {name: `<:sticker:920136186687795262> **Stikers:**`, value: `${msg.guild.stickers.cache.size.toLocaleString()}`, inline: true},
                        {name: "💈 **Roles:**", value: `${msg.guild.roles.cache.size}`, inline: true},
                        {name: `⛔ **Baneos:**`, value: `${(await msg.guild.bans.fetch()).size.toLocaleString()}`, inline: true},
                        {name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true},
                        {name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true},
                        {name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true},
                        {name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true},
                        {name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true},
                        {name: `<:menu:947318717371527178> **Canales:** ${(chText+chVoize+chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()}`, inline: true},
                        {name: `👥 **Miembros:** ${msg.guild.members.cache.size.toLocaleString()}`, value: `👤 ${mgmc.filter(u=> !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:904556872005222480> ${(enlinea+ausente+nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true},
                        {name: `\u200B`, value: `${imgs}`, inline: true},
                    )
                    .setColor(msg.guild.me.displayHexColor)
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embServer]})
                    }, 500)
                }else{
                    if(msg.guild.me.permissions.has("MANAGE_GUILD")){
                        const embServer = new Discord.MessageEmbed()
                        .setThumbnail(msg.guild.iconURL({dynamic: true, format: "png"||"gif", size: 4096}))
                        .setAuthor(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                        .setImage(msg.guild.bannerURL({format: "png", size: 4096}))
                        .setTitle("<a:Info:926972188018479164> Informacion del servidor")
                        .addFields(
                            {name: "📃 **Descripcion:**", value: `${msg.guild.description !== null ? msg.guild.description: "Sin descripción"}`},
                            {name: "🆔 **ID:**", value: `${msg.guild.id}`, inline: true},
                            {name: "👑 **Propiedad de:**", value: `<@${msg.guild.ownerId}>`, inline: true},
                            {name: `📅 **Creado:**`, value: `<t:${Math.floor(msg.guild.createdAt / 1000)}:R>`, inline: true},
                            {name: `<:verified:947322016086753330> **Verificado:**`, value: `${msg.guild.verified ? "Si": "No"}`, inline: true},
                            {name: `<:DiscordPartner:920746109259898890> **Socio:**`, value: `${msg.guild.partnered ? "Si es socio": "No es socio"}`, inline: true},
                            {name: `😃 **Emojis:** ${msg.guild.emojis.cache.size.toLocaleString()}`, value: `${msg.guild.emojis.cache.filter(n=> !n.animated).size.toLocaleString()} normales\n${msg.guild.emojis.cache.filter(a=> a.animated).size.toLocaleString()} animados`, inline: true},
                            {name: `<:sticker:920136186687795262> **Stikers:**`, value: `${msg.guild.stickers.cache.size.toLocaleString()}`, inline: true},
                            {name: "💈 **Roles:**", value: `${msg.guild.roles.cache.size}`, inline: true},
                            {name: `✉ **Invitaciones creadas:**`, value: `${(await msg.guild.invites.fetch()).size.toLocaleString()}`, inline: true},
                            {name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true},
                            {name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true},
                            {name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true},
                            {name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true},
                            {name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true},
                            {name: `<:menu:947318717371527178> **Canales:** ${(chText+chVoize+chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()}`, inline: true},
                            {name: `👥 **Miembros:** ${msg.guild.members.cache.size.toLocaleString()}`, value: `👤 ${mgmc.filter(u=> !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:904556872005222480> ${(enlinea+ausente+nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true},
                            {name: `\u200B`, value: `${imgs}`, inline: true},
                        )
                        .setColor(msg.guild.me.displayHexColor)
                        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embServer]})
                        }, 500)

                    }else{
                        const embServer = new Discord.MessageEmbed()
                        .setThumbnail(msg.guild.iconURL({dynamic: true, format: "png"||"gif", size: 4096}))
                        .setAuthor(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                        .setImage(msg.guild.bannerURL({format: "png", size: 4096}))
                        .setTitle("<a:Info:926972188018479164> Informacion del servidor")
                        .addFields(
                            {name: "📃 **Descripcion:**", value: `${msg.guild.description !== null ? msg.guild.description: "Sin descripción"}`},
                            {name: "🆔 **ID:**", value: `${msg.guild.id}`, inline: true},
                            {name: "👑 **Propiedad de:**", value: `<@${msg.guild.ownerId}>`, inline: true},
                            {name: `📅 **Creado:**`, value: `<t:${Math.floor(msg.guild.createdAt / 1000)}:R>`, inline: true},
                            {name: `<:verified:947322016086753330> **Verificado:**`, value: `${msg.guild.verified ? "Si": "No"}`, inline: true},
                            {name: `<:DiscordPartner:920746109259898890> **Socio:**`, value: `${msg.guild.partnered ? "Si es socio": "No es socio"}`, inline: true},
                            {name: `😃 **Emojis:** ${msg.guild.emojis.cache.size.toLocaleString()}`, value: `${msg.guild.emojis.cache.filter(n=> !n.animated).size.toLocaleString()} normales\n${msg.guild.emojis.cache.filter(a=> a.animated).size.toLocaleString()} animados`, inline: true},
                            {name: `<:sticker:920136186687795262> **Stikers:**`, value: `${msg.guild.stickers.cache.size.toLocaleString()}`, inline: true},
                            {name: "💈 **Roles:**", value: `${msg.guild.roles.cache.size}`, inline: true},
                            {name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true},
                            {name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true},
                            {name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true},
                            {name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true},
                            {name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true},
                            {name: `<:menu:947318717371527178> **Canales:** ${(chText+chVoize+chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()}`, inline: true},
                            {name: `👥 **Miembros:** ${msg.guild.members.cache.size.toLocaleString()}`, value: `👤 ${mgmc.filter(u=> !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:904556872005222480> ${(enlinea+ausente+nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true},
                            {name: `\u200B`, value: `${imgs}`, inline: true},
                        )
                        .setColor(msg.guild.me.displayHexColor)
                        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embServer]})
                        }, 500)
                    }
                }
            }
        }
    }
    
    if(comando == "invite"){
        msg.channel.sendTyping()
        botDB.comandos.usos++

        const inv = new Discord.MessageEmbed()
        .setAuthor(`hola ${msg.member.nickname ? msg.member.nickname: msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
        .setDescription(`[__**Invítame**__](${invitacion}) a tu servidor.`)
        .setColor(colorEmb)
        .setTimestamp()
        
        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setLabel("Invítame")
            .setEmoji("🔗")
            .setStyle("LINK")
            .setURL(invitacion)
        )

        setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [inv], components: [row]})
        }, 500)

    }

    if(comando == "qrcode" || comando === "qr"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let urQR = `http://api.qrserver.com/v1/create-qr-code/?data=${args[0]}&size=600x600`
        console.log(isURL.lenient(args[0]))

        if(!args[0]){
            if(msg.guild.me.permissions.has("MANAGE_GUILD")){
                const embInfo = new Discord.MessageEmbed()
                .setTitle(`${emojis.lupa} Comando qrcode`)
                .addFields(
                    {name: "Uso:", value: `${"``"}${prefijo}qrcode <URL o link>${"``"}`},
                    {name: "Ejemplo:", value: `${prefijo}qrcode ${(await msg.guild.invites.fetch()).map(mi => mi.url).slice(0,1)}`},
                    {name: "Alias:", value: `\`\`qrcode\`\`, \`\`qr\`\``},
                    {name: "Descripción:", value: `Crea un código QR de el enlace o URL proporcionada.`}
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
                }, 500)
            }else{
                const embInfo = new Discord.MessageEmbed()
                .setTitle(`${emojis.lupa} Comando qrcode`)
                .addFields(
                    {name: "Uso:", value: `${"``"}${prefijo}qrcode <URL o link>${"``"}`},
                    {name: "Ejemplo", value: `${prefijo}qrcode https://discord.gg/yKfWU4uykc`},
                    {name: "Alias:", value: `\`\`${prefijo}qrcode\`\`, \`\`${prefijo}qr\`\``},
                    {name: "Descripción:", value: `Crea un código QR de el enlace o URL proporcionada.`}
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
                }, 500)
            }
        }

        const embErr1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`El argumento proporcionado no es un enlace.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!args[0].includes(".com") || !args[0].includes("hattp://") || !args[0].includes("https://")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]})
        }, 500)

        const embErr2 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`El enlace proporcionado no es valido.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!isURL(new URL(args[0]))) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]})
        }, 500)

        const attachment = new Discord.MessageAttachment(urQR, `imagen.png`)

        const embQR = new Discord.MessageEmbed()
        .setAuthor(`Codigo QR creado por ${msg.member.nickname ? msg.member.nickname: msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
        .setImage(`attachment://imagen.png`)
        .setColor(msg.guild.me.displayHexColor)
        .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
        .setTimestamp()

        setTimeout(()=>{
            msg.delete().catch(c=> console.error(c))
            msg.channel.send({embeds: [embQR], files: [attachment]}).catch(()=> msg.reply("Ubo un error. quizás no introdujiste bien el enlace."))
        }, 500)
    }

    if(comando == "reportbug" || comando == "reportarerror" || comando == "repbug"){
        msg.channel.sendTyping()
        botDB.comandos.usos++

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando reportbug`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}reportbug <Reporte>\`\``},
            {name: "Ejemplos: **2**", value: `${prefijo}reportbug El comando say no funciona.`},
            {name: "Alias: **3**", value: `\`\`reportbug\`\`, \`\`reportarerror\`\`, \`\`repbug\`\``},
            {name: "Descripción:", value: `Reporta un bug *(error)* del bot en caso de tener un error, ayudas mocho a mejorar el bot reportando errores.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let canalReportes = client.guilds.cache.get("940034044819828767").channels.cache.get("950962633580896276")

        const embAdvertencia = new Discord.MessageEmbed()
        .setTitle(`<:advertencia:929204500739268608> Advertencia`)
        .setDescription(`¿Estás seguro/a ${msg.author} de enviar tu reporte?\n\n<:report:959201948169564210> **Reporte:**\n${args.join(" ")}`)
        .setColor("YELLOW")

        const embConfirmar = new Discord.MessageEmbed()
        .setTitle(`${emojis.acierto} Reporte enviado`)
        .setDescription(`Tu reporte ha sido enviado a mi [servidor](${serverSuport}) de soporte para que le eche un vistazo mi creador y arregle el problema, gracias por reportar.`)
        .setColor("GREEN")

        const embCancelar = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Reporte cancelado`)
        .setDescription(`Has cancelado tu reporte, no dudes en reportar cualquier fallo, es muy importante para mi que muestren mis errores a mi creador.`)
        .setColor("RED")

        const embAccionCancelada = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Acción cancelada`)
        .setDescription(`Se ha cancelado la acción por que has demorado mucho en responder.`)
        .setColor("RED")

        const botones = new Discord.MessageActionRow()
        .addComponents(
            [
                new Discord.MessageButton()
                .setCustomId("confirmar")
                .setEmoji(emojis.acierto)
                .setLabel("Confirmar")
                .setStyle("SUCCESS")
            ],
            [
                new Discord.MessageButton()
                .setCustomId("cancelar")
                .setEmoji(emojis.negativo)
                .setLabel("Cancelar")
                .setStyle("DANGER")
            ]
        )

        setTimeout(async ()=>{
            const mensajeEmb = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAdvertencia], components: [botones]})
            const colector = mensajeEmb.createMessageComponentCollector({filter: i=> i.user.id == msg.author.id, time: 60000})
            let interuptor = true
            setTimeout(()=>{
                if(interuptor){
                    mensajeEmb.edit({embeds: [embAccionCancelada], components: []})
                }
            }, 60000)

            colector.on("collect",async cll => {
                if(cll.customId == "confirmar"){
                    cll.update({embeds: [embConfirmar], components: []}).then(tb=>{
                        const embReporte = new Discord.MessageEmbed()
                        .setAuthor(msg.author.tag, msg.author.displayAvatarURL({dynamic: true}))
                        .setThumbnail(msg.author.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                        .setTitle(`<:report:959201948169564210> Nuevo reporte`)
                        .addFields(
                            {name: `👤 **Reporte de:**`, value: `${msg.author.tag}\n${msg.author.id}`, inline: true},
                            {name: `📤 **Desde:**`, value: `${msg.guild.name}\n${msg.guild.id}`, inline: true},
                            {name: `📄 **Reporte:**`, value: `${args.join(" ")}`, inline: true},
                        )
                        .setColor(msg.guild.me.displayHexColor)
                        .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        canalReportes.send({embeds: [embReporte]})
                        interuptor = false
                    })
                }
                if(cll.customId == "cancelar"){
                    cll.update({embeds: [embCancelar], components: []})
                    interuptor = false
                }
            })
        }, 500)
    }

    if(comando == "botinfo"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let creador = client.users.cache.get(creadorID)

        const infBot = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`<:util:947316902647189554> ${client.user.username}`)
        .setDescription(`Soy un bot enfocado en serte de lo mas útil en tu servidor contando con comandos de moderación, administración, comandos de sistemas que te pueden ser de gran utilidad en tu servidor.\n📅 Creado <t:${Math.floor(client.user.createdAt / 1000)}:R> por ${client.users.cache.get(creadorID).tag}\n`)
        .addFields(
            {name: `\u200B`, value: `<:status:957353077650886716> **Sistema:**`, inline: false},
            {name: `<:node:958824377166737428> **Node:**`, value: `${process.version}`, inline: true},
            {name: `<:discordjs:958825301624881162> **Discord.js:**`, value: `v${Discord.version}`, inline: true},
            {name: `<:mongoDB:958817120769151046> **Mongoose:**`, value: `v${mongoose.version}`, inline: true},
            {name: `<:host:958828608389009429> **Host:**`, value: `<:heroku:958814911243374602> Heroku`, inline: true},
            {name: `<:memoria:958829662644109352> **Memoria:**`, value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`, inline: true},
            {name: `\u200B`, value: `\u200B`, inline: false},
            {name: `<a:gears_loading:958170921590489148> **Sistemas:**`, value: `${emojis.puntos} **Sistema de puntos:**\nFase final *(puede tener cambios)*, para mas información sobre el sistema utiliza el comando \`\`${prefijo}pointsinfo\`\`.\n\n🤝 **Sistema de auto alianzas:**\nEn desarollo...`, inline: true},
        )      
        .setFooter(`Creador: ${creador.tag}`,creador.displayAvatarURL({dynamic: true}))
        .setColor(colorEmb)
        .setTimestamp()
        setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [infBot]})
        }, 500)
    }




    // 👮 Comandos de moderacion
    if(comando == "record" || comando == "historial"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let dataHis = await historiales.findOne({_id: client.user.id})
        
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Banear miembros, Expulsar miembros o Aislar miembros.")
        .setTimestamp()
        if(!msg.member.permissions.has("KICK_MEMBERS" || "BAN_MEMBERS" || "MODERATE_MEMBERS")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(dt => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                dt.delete().catch(e=>{
                    return;
                })
            }, 30000))
        }, 500)

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando record`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}record <Mencion del miembro>\`\`\n\`\`${prefijo}record <ID del miembro>\`\`\n\`\`${prefijo}record <Etiqueta del miembro>\`\``},
            {name: "Ejemplos: **2**", value: `${prefijo}record ${msg.author}\n${prefijo}record ${msg.author.id}\n${prefijo}record ${msg.author.tag}`},
            {name: "Alias: **1**", value: `\`\`record\`\`, \`\`historial\`\``},
            {name: "Descripción:", value: `Muestra el historial de un miembro, en el historial encontraras las advertencias, muteos, expulsiones y baneos que ha tenido en otros servidores y en este servidor.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let botones1 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle("SUCCESS")])
        let botones2 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle("PRIMARY")])
        let botones3 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle("SECONDARY")])
        let botones4 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle("DANGER")])

        let botones5 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle("SUCCESS")],[new Discord.MessageButton().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle("PRIMARY")])
        let botones6 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle("SUCCESS")],[new Discord.MessageButton().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle("SECONDARY")])
        let botones7 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle("SUCCESS")],[new Discord.MessageButton().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle("DANGER")])

        let botones8 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle("SUCCESS")],[new Discord.MessageButton().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle("PRIMARY")],[new Discord.MessageButton().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle("SECONDARY")])
        let botones9 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle("SUCCESS")],[new Discord.MessageButton().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle("SECONDARY")],[new Discord.MessageButton().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle("DANGER")])
        let botones10 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle("SUCCESS")],[new Discord.MessageButton().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle("PRIMARY")],[new Discord.MessageButton().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle("DANGER")])

        let botones11 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle("PRIMARY")],[new Discord.MessageButton().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle("SECONDARY")])
        let botones12 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle("PRIMARY")],[new Discord.MessageButton().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle("DANGER")])

        let botones13 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle("PRIMARY")],[new Discord.MessageButton().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle("SECONDARY")],[new Discord.MessageButton().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle("DANGER")])

        let botones14 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle("SECONDARY")],[new Discord.MessageButton().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle("DANGER")])
        let botones15 = new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle("SUCCESS")],[new Discord.MessageButton().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle("PRIMARY")],[new Discord.MessageButton().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle("SECONDARY")],[new Discord.MessageButton().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle("DANGER")])

        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag === args.join(" "))

        if(miembro){
            if(msg.author.id === miembro.id){
                if(dataHis.usuarios.some(s=> s.id === miembro.id)){
                    let posicionUS
                    let adv = 0
                    let ais = 0
                    let exp = 0
                    let ban = 0
                    for(let i=0; i<dataHis.usuarios.length; i++){
                        if(dataHis.usuarios[i].id === miembro.id){
                            posicionUS = i
                            for(let m=0; m<dataHis.usuarios[i].servidores.length; m++){
                                adv += dataHis.usuarios[i].servidores[m].advertencias.length
                                ais += dataHis.usuarios[i].servidores[m].aislamientos.length
                                exp += dataHis.usuarios[i].servidores[m].expulsiones.length
                                ban += dataHis.usuarios[i].servidores[m].baneos.length 
                            }
                        }
                    }
    
                    if(dataHis.usuarios[posicionUS].servidores.some(s=> s.id === msg.guildId)){
                        let posicionSV
                        for(let s=0; s<dataHis.usuarios[posicionUS].servidores.length; s++){
                            if(dataHis.usuarios[posicionUS].servidores[s].id === msg.guildId){
                                posicionSV = s
                            }
                        }
                        let advert = dataHis.usuarios[posicionUS].servidores[posicionSV].advertencias.length
                        let aislam = dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos.length
                        let expuls = dataHis.usuarios[posicionUS].servidores[posicionSV].expulsiones.length
                        let baneos = dataHis.usuarios[posicionUS].servidores[posicionSV].baneos.length
    
                        if((advert+aislam+expuls+baneos) <= 0){
                            if((adv+ais+exp+ban) <= 0){
                                const embHistorial = new Discord.MessageEmbed()
                                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                                .setTitle("<:historial:949522609266110485> Historial")
                                .setDescription(`*${miembro} no tienes sanciones en ningun servidor de los **${dataHis.usuarios[posicionUS].servidores.length}** servidores en donde antes si tenias sanciones.*`)
                                .setColor(colorEmb)
                                .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                                .setTimestamp()
                                setTimeout(()=>{
                                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embHistorial]})
                                }, 500)
                            }else{
                                let botones
                                let condicionales = [adv>0 && ais<=0 && exp<=0 && ban<=0, adv<=0 && ais>0 && exp<=0 && ban<=0, adv<=0 && ais<=0 && exp>0 && ban<=0, adv<=0 && ais<=0 && exp<=0 && ban>0,    adv>0 && ais>0 && exp<=0 && ban<=0, adv>0 && ais<=0 && exp>0 && ban<=0, adv>0 && ais<=0 && exp<=0 && ban>0,    adv>0 && ais>0 && exp>0 && ban<=0, adv>0 && ais<=0 && exp>0 && ban>0, adv>0 && ais>0 && exp<=0 && ban>0,    adv<=0 && ais>0 && exp>0 && ban>0, adv<=0 && ais>0 && exp>0 && ban<=0, adv<=0 && ais>0 && exp<=0 && ban>0,   adv<=0 && ais<=0 && exp>0 && ban>0, adv>0 && ais>0 && exp>0 && ban>0]
                                let valorBotones = [botones1,botones2,botones3,botones4, botones5,botones6,botones7, botones8,botones9,botones10, botones11,botones12,botones13, botones14,botones15]
                                for(let i=0; i<condicionales.length; i++){
                                    if(condicionales[i]){
                                        botones = valorBotones[i]
                                    }
                                }

                                const embHistorial = new Discord.MessageEmbed()
                                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                                .setTitle("<:historial:949522609266110485> Historial")
                                .setDescription(`*${miembro} no tienes sanciones en este servidor.*\n\nEn los **${dataHis.usuarios[posicionUS].servidores.filter(f=> f.advertencias.length>0 || f.aislamientos.length>0 || f.expulsiones.length>0 || f.baneos.length>0).length}** servidores que tengo registro sobre ti tienes un total de **${adv}** advertencias, **${ais}** aislamientos, **${exp}** expulsiones y **${ban}** baneos.`)
                                .setColor(colorEmb)
                                .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                                .setTimestamp()
    
                                setTimeout(()=>{
                                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embHistorial], components: [botones]}).then(mensaje=>{
                                        botDB.historial.push({mensajeID: mensaje.id, miembroID: miembro.id})
                                        setTimeout(()=>{
                                            if(embHistorial.description === mensaje.embeds[0].description){
                                                mensaje.edit({embeds: [embHistorial], components: []}).catch(c=>{
                                                    return;
                                                })
                                            }
                                        }, 60000)
                                    })
                                }, 500)
                            }
                        }else{
                            let botones
                            let condicionales = [adv>0 && ais<=0 && exp<=0 && ban<=0, adv<=0 && ais>0 && exp<=0 && ban<=0, adv<=0 && ais<=0 && exp>0 && ban<=0, adv<=0 && ais<=0 && exp<=0 && ban>0,    adv>0 && ais>0 && exp<=0 && ban<=0, adv>0 && ais<=0 && exp>0 && ban<=0, adv>0 && ais<=0 && exp<=0 && ban>0,    adv>0 && ais>0 && exp>0 && ban<=0, adv>0 && ais<=0 && exp>0 && ban>0, adv>0 && ais>0 && exp<=0 && ban>0,    adv<=0 && ais>0 && exp>0 && ban>0, adv<=0 && ais>0 && exp>0 && ban<=0, adv<=0 && ais>0 && exp<=0 && ban>0,   adv<=0 && ais<=0 && exp>0 && ban>0, adv>0 && ais>0 && exp>0 && ban>0]
                            let valorBotones = [botones1,botones2,botones3,botones4, botones5,botones6,botones7, botones8,botones9,botones10, botones11,botones12,botones13, botones14,botones15]
                            for(let i=0; i<condicionales.length; i++){
                                if(condicionales[i]){
                                    botones = valorBotones[i]
                                }
                            }

                            const embHistorial = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle("<:historial:949522609266110485> Historial")
                            .setDescription(`${miembro} tienes **${advert}** advertencias, **${aislam}** aislamientos, **${expuls}** expulsiones y **${baneos}** baneos.\n\nEn los **${dataHis.usuarios[posicionUS].servidores.filter(f=> f.advertencias.length>0 || f.aislamientos.length>0 || f.expulsiones.length>0 || f.baneos.length>0).length}** servidores que tengo registro sobre ti tienes un total de **${adv}** advertencias, **${ais}** aislamientos, **${exp}** expulsiones y **${ban}** baneos.`)
                            .setColor(colorEmb)
                            .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
    
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embHistorial], components: [botones]}).then(mensaje=>{
                                    botDB.historial.push({mensajeID: mensaje.id, miembroID: miembro.id})
                                    setTimeout(()=>{
                                        if(embHistorial.description === mensaje.embeds[0].description){
                                            mensaje.edit({embeds: [embHistorial], components: []}).catch(c=>{
                                                return;
                                            })
                                        }
                                    }, 60000)
                                })
                            }, 500)
                        }
                    }else{
                        if((adv+ais+exp+ban) <= 0){
                            const embHistorial = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle("<:historial:949522609266110485> Historial")
                            .setDescription(`*${miembro} no tienes sanciones en ningun servidor de los **${dataHis.usuarios[posicionUS].servidores.length}** servidores en donde antes si tenias sanciones.*`)
                            .setColor(colorEmb)
                            .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embHistorial]})
                            }, 500)
                        }else{
                            let botones
                            let condicionales = [adv>0 && ais<=0 && exp<=0 && ban<=0, adv<=0 && ais>0 && exp<=0 && ban<=0, adv<=0 && ais<=0 && exp>0 && ban<=0, adv<=0 && ais<=0 && exp<=0 && ban>0,    adv>0 && ais>0 && exp<=0 && ban<=0, adv>0 && ais<=0 && exp>0 && ban<=0, adv>0 && ais<=0 && exp<=0 && ban>0,    adv>0 && ais>0 && exp>0 && ban<=0, adv>0 && ais<=0 && exp>0 && ban>0, adv>0 && ais>0 && exp<=0 && ban>0,    adv<=0 && ais>0 && exp>0 && ban>0, adv<=0 && ais>0 && exp>0 && ban<=0, adv<=0 && ais>0 && exp<=0 && ban>0,   adv<=0 && ais<=0 && exp>0 && ban>0, adv>0 && ais>0 && exp>0 && ban>0]
                            let valorBotones = [botones1,botones2,botones3,botones4, botones5,botones6,botones7, botones8,botones9,botones10, botones11,botones12,botones13, botones14,botones15]
                            for(let i=0; i<condicionales.length; i++){
                                if(condicionales[i]){
                                    botones = valorBotones[i]
                                }
                            }

                            const embHistorial = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle("<:historial:949522609266110485> Historial")
                            .setDescription(`*${miembro} no tienes historial de sanciones en este servidor.*\n\nEn los **${dataHis.usuarios[posicionUS].servidores.filter(f=> f.advertencias.length>0 || f.aislamientos.length>0 || f.expulsiones.length>0 || f.baneos.length>0).length}** servidores que tengo registro sobre ti tienes un total de **${adv}** advertencias, **${ais}** aislamientos, **${exp}** expulsiones y **${ban}** baneos.`)
                            .setColor(colorEmb)
                            .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
    
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embHistorial], components: [botones]}).then(mensaje=>{
                                    botDB.historial.push({mensajeID: mensaje.id, miembroID: miembro.id})
                                    setTimeout(()=>{
                                        if(embHistorial.description === mensaje.embeds[0].description){
                                            mensaje.edit({embeds: [embHistorial], components: []}).catch(c=>{
                                                return;
                                            })
                                        }
                                    }, 60000)
                                })
                            }, 500)
                        }
                    }
                }else{
                    const embHistorial = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("<:historial:949522609266110485> Historial")
                    .setDescription(`*${miembro} no tienes historial de sanciones.*`)
                    .setColor(colorEmb)
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embHistorial]})
                    }, 500)
                }
            }else{
                const embErr1 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`El miembro proporcionado ${miembro} es un bot, los bots no pueden tener historial de sanciones.`)
                .setColor(ColorError)
                .setTimestamp()
                if(miembro.user.bot) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)

                if(dataHis.usuarios.some(s=> s.id === miembro.id)){
                    let posicionUS
                    let adv = 0
                    let ais = 0
                    let exp = 0
                    let ban = 0
                    for(let i=0; i<dataHis.usuarios.length; i++){
                        if(dataHis.usuarios[i].id === miembro.id){
                            posicionUS = i
                            for(let m=0; m<dataHis.usuarios[i].servidores.length; m++){
                                adv += dataHis.usuarios[i].servidores[m].advertencias.length
                                ais += dataHis.usuarios[i].servidores[m].aislamientos.length
                                exp += dataHis.usuarios[i].servidores[m].expulsiones.length
                                ban += dataHis.usuarios[i].servidores[m].baneos.length 
                            }
                        }
                    }

                    if(dataHis.usuarios[posicionUS].servidores.some(s=> s.id === msg.guildId)){
                        let posicionSV
                        for(let s=0; s<dataHis.usuarios[posicionUS].servidores.length; s++){
                            if(dataHis.usuarios[posicionUS].servidores[s].id === msg.guildId){
                                posicionSV = s
                            }
                        }
                        let advert = dataHis.usuarios[posicionUS].servidores[posicionSV].advertencias.length
                        let aislam = dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos.length
                        let expuls = dataHis.usuarios[posicionUS].servidores[posicionSV].expulsiones.length
                        let baneos = dataHis.usuarios[posicionUS].servidores[posicionSV].baneos.length

                        if((advert+aislam+expuls+baneos) <= 0){
                            if((adv+ais+exp+ban) <= 0){
                                const embHistorial = new Discord.MessageEmbed()
                                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                                .setTitle("<:historial:949522609266110485> Historial")
                                .setDescription(`*El miembro ${miembro} no tiene sanciones en ningun servidor de los **${dataHis.usuarios[posicionUS].servidores.filter(f=> f.advertencias.length>0 || f.aislamientos.length>0 || f.expulsiones.length>0 || f.baneos.length>0).length}** servidores en donde antes si tenia sanciones.*`)
                                .setColor(colorEmb)
                                .setFooter(miembro.nickname ? miembro.nickname: miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                                setTimeout(()=>{
                                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embHistorial]})
                                }, 500)
                            }else{
                                let botones
                                let condicionales = [adv>0 && ais<=0 && exp<=0 && ban<=0, adv<=0 && ais>0 && exp<=0 && ban<=0, adv<=0 && ais<=0 && exp>0 && ban<=0, adv<=0 && ais<=0 && exp<=0 && ban>0,    adv>0 && ais>0 && exp<=0 && ban<=0, adv>0 && ais<=0 && exp>0 && ban<=0, adv>0 && ais<=0 && exp<=0 && ban>0,    adv>0 && ais>0 && exp>0 && ban<=0, adv>0 && ais<=0 && exp>0 && ban>0, adv>0 && ais>0 && exp<=0 && ban>0,    adv<=0 && ais>0 && exp>0 && ban>0, adv<=0 && ais>0 && exp>0 && ban<=0, adv<=0 && ais>0 && exp<=0 && ban>0,   adv<=0 && ais<=0 && exp>0 && ban>0, adv>0 && ais>0 && exp>0 && ban>0]
                                let valorBotones = [botones1,botones2,botones3,botones4, botones5,botones6,botones7, botones8,botones9,botones10, botones11,botones12,botones13, botones14,botones15]
                                for(let i=0; i<condicionales.length; i++){
                                    if(condicionales[i]){
                                        botones = valorBotones[i]
                                    }
                                }
                                const embHistorial = new Discord.MessageEmbed()
                                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                                .setTitle("<:historial:949522609266110485> Historial")
                                .setDescription(`*El miembro ${miembro} no tiene sanciones en este servidor.*\n\nEn los **${dataHis.usuarios[posicionUS].servidores.filter(f=> f.advertencias.length>0 || f.aislamientos.length>0 || f.expulsiones.length>0 || f.baneos.length>0).length}** servidores que tengo registro sobre el miembro tiene un total de **${adv}** advertencias, **${ais}** aislamientos, **${exp}** expulsiones y **${ban}** baneos.`)
                                .setColor(colorEmb)
                                .setFooter(miembro.nickname ? miembro.nickname: miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                                .setTimestamp()

                                setTimeout(()=>{
                                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embHistorial], components: [botones]}).then(mensaje=>{
                                        botDB.historial.push({mensajeID: mensaje.id, miembroID: miembro.id})
                                        setTimeout(()=>{
                                            if(embHistorial.description === mensaje.embeds[0].description){
                                                mensaje.edit({embeds: [embHistorial], components: []}).catch(c=>{
                                                    return;
                                                })
                                            }
                                        }, 60000)
                                    })
                                }, 500)
                            }
                        }else{
                            let botones
                            let condicionales = [adv>0 && ais<=0 && exp<=0 && ban<=0, adv<=0 && ais>0 && exp<=0 && ban<=0, adv<=0 && ais<=0 && exp>0 && ban<=0, adv<=0 && ais<=0 && exp<=0 && ban>0,    adv>0 && ais>0 && exp<=0 && ban<=0, adv>0 && ais<=0 && exp>0 && ban<=0, adv>0 && ais<=0 && exp<=0 && ban>0,    adv>0 && ais>0 && exp>0 && ban<=0, adv>0 && ais<=0 && exp>0 && ban>0, adv>0 && ais>0 && exp<=0 && ban>0,    adv<=0 && ais>0 && exp>0 && ban>0, adv<=0 && ais>0 && exp>0 && ban<=0, adv<=0 && ais>0 && exp<=0 && ban>0,   adv<=0 && ais<=0 && exp>0 && ban>0, adv>0 && ais>0 && exp>0 && ban>0]
                            let valorBotones = [botones1,botones2,botones3,botones4, botones5,botones6,botones7, botones8,botones9,botones10, botones11,botones12,botones13, botones14,botones15]
                            for(let i=0; i<condicionales.length; i++){
                                if(condicionales[i]){
                                    botones = valorBotones[i]
                                }
                            }

                            const embHistorial = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle("<:historial:949522609266110485> Historial")
                            .setDescription(`El miembro ${miembro} tiene en este servidor **${advert}** advertencias, **${aislam}** aislamientos, **${expuls}** expulsiones y **${baneos}** baneos.\n\nEn los **${dataHis.usuarios[posicionUS].servidores.filter(f=> f.advertencias.length>0 || f.aislamientos.length>0 || f.expulsiones.length>0 || f.baneos.length>0).length}** servidores que tengo registro sobre el miembro tiene un total de **${adv}** advertencias, **${ais}** aislamientos, **${exp}** expulsiones y **${ban}** baneos.`)
                            .setColor(colorEmb)
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()

                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embHistorial], components: [botones]}).then(mensaje=>{
                                    botDB.historial.push({mensajeID: mensaje.id, miembroID: miembro.id})
                                    setTimeout(()=>{
                                        if(embHistorial.description === mensaje.embeds[0].description){
                                            mensaje.edit({embeds: [embHistorial], components: []}).catch(c=>{
                                                return;
                                            })
                                        }
                                    }, 60000)
                                })
                            }, 500)
                        }
                    }else{
                        if((adv+ais+exp+ban) <= 0){
                            const embHistorial = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle("<:historial:949522609266110485> Historial")
                            .setDescription(`*El miembro ${miembro} no tiene sanciones en ningun servidor de los **${dataHis.usuarios[posicionUS].servidores.length}** servidores en donde antes si tenia sanciones.*`)
                            .setColor(colorEmb)
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embHistorial]})
                            }, 500)
                        }else{
                            let botones
                            let condicionales = [adv>0 && ais<=0 && exp<=0 && ban<=0, adv<=0 && ais>0 && exp<=0 && ban<=0, adv<=0 && ais<=0 && exp>0 && ban<=0, adv<=0 && ais<=0 && exp<=0 && ban>0,    adv>0 && ais>0 && exp<=0 && ban<=0, adv>0 && ais<=0 && exp>0 && ban<=0, adv>0 && ais<=0 && exp<=0 && ban>0,    adv>0 && ais>0 && exp>0 && ban<=0, adv>0 && ais<=0 && exp>0 && ban>0, adv>0 && ais>0 && exp<=0 && ban>0,    adv<=0 && ais>0 && exp>0 && ban>0, adv<=0 && ais>0 && exp>0 && ban<=0, adv<=0 && ais>0 && exp<=0 && ban>0,   adv<=0 && ais<=0 && exp>0 && ban>0, adv>0 && ais>0 && exp>0 && ban>0]
                            let valorBotones = [botones1,botones2,botones3,botones4, botones5,botones6,botones7, botones8,botones9,botones10, botones11,botones12,botones13, botones14,botones15]
                            for(let i=0; i<condicionales.length; i++){
                                if(condicionales[i]){
                                    botones = valorBotones[i]
                                }
                            }

                            const embHistorial = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle("<:historial:949522609266110485> Historial")
                            .setDescription(`*El miembro ${miembro} no tiene historial de sanciones en este servidor.*\n\nEn los **${dataHis.usuarios[posicionUS].servidores.filter(f=> f.advertencias.length>0 || f.aislamientos.length>0 || f.expulsiones.length>0 || f.baneos.length>0).length}** servidores que tengo registro sobre el miembro tiene un total de **${adv}** advertencias, **${ais}** aislamientos, **${exp}** expulsiones y **${ban}** baneos.`)
                            .setColor(colorEmb)
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()

                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embHistorial], components: [botones]}).then(mensaje=>{
                                    botDB.historial.push({mensajeID: mensaje.id, miembroID: miembro.id})
                                    setTimeout(()=>{
                                        if(embHistorial.description === mensaje.embeds[0].description){
                                            mensaje.edit({embeds: [embHistorial], components: []}).catch(c=>{
                                                return;
                                            })
                                        }
                                    }, 60000)
                                })
                            }, 500)
                        }
                    }
                }else{
                    const embHistorial = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("<:historial:949522609266110485> Historial")
                    .setDescription(`*El miembro ${miembro} no tiene historial de sanciones.*`)
                    .setColor(colorEmb)
                    .setFooter(miembro.nickname ? miembro.nickname: miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embHistorial]})
                    }, 500)
                }
            }
        }else{
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`, `El argumento proporcionado *(${args[0]})* tiene las caracteristicas de una **ID**, es numérico, contiene **18** caracteres pero no coresponde con la **ID** de ningun miembro del servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0]), args[0].length == 18]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }
    }

    if(comando == "deleterecord" || comando == "eliminarregistro"){
        botDB.comandos.usos++
        msg.channel.sendTyping()

        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Administrador.")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(dt => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                dt.delete().catch(e=>{
                    return;
                })
            }, 30000))
        }, 500)

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando deleterecord`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}deleterecord <Mencion del miembro> <Tipo de sanciones a eliminar> <Cantidad de sanciones a eliminar>\`\`\n\`\`${prefijo}deleterecord <ID del miembro> <Tipo de sanciones a eliminar> <Cantidad de sanciones a eliminar>\`\`\n\`\`${prefijo}deleterecord <Etiqueta del miembro> <Tipo de sanciones a eliminar> <Cantidad de sanciones a eliminar>\`\``},
            {name: "Ejemplos: **3**", value: `${prefijo}deleterecord ${msg.author} advertencias ${Math.floor(Math.random()*(20-1)+1)}\n${prefijo}deleterecord ${msg.author.id} aislamientos ${Math.floor(Math.random()*(20-1)+1)}\n${prefijo}deleterecord ${msg.author.tag} expulsiones ${Math.floor(Math.random()*(20-1)+1)}`},
            {name: "Alias: **2**", value: `\`\`deleterecord\`\`, \`\`eliminarregistro\`\``},
            {name: "Descripción:", value: `Elimina sanciones del historial de un miembro del servidor.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let dataHis = await historiales.findOne({_id: client.user.id})
        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag == args.join(" ")), sancion = args[1]
        
        if(miembro){
            if(dataHis){
                if(msg.guild.ownerId == msg.author.id){
                    let descripciones = [`El miembro proporcionado *(${miembro})* soy yo, yo soy un bot por lo tanto no tengo historial de sanciones.`, `El miembro proporcionado *(${miembro})* es un bot, los bots no tienen historial de sanciones.`, `El miembro proporcionado *(${miembro})* no tiene historial de sanciones por lo tanto no tiene sanciones que puedas eliminarle.`, `El miembro proporcionado *(${miembro})* no tiene sanciones en este servidor por lo tanto no le puedes eliminar ninguna sanción.`, `No has proporcionado el tipo de sanción que eliminaras del historial del miembro, puedes consultar las sanciones que tiene el miembro utilizando el comando \`\`${prefijo}record\`\`.`, `El segundo argumento proporcionado *(${args[1]})* no es un tipo de sanción, proporciona el tipo de sanción que le eliminaras del historial al miembro.`, `No has proporcionado el tercer y ultimo argumento el cual es la cantidad de sanciones que eliminaras del historial del miembro.`, `El tercer argumento proporcionado *(${args[2]})* no es numérico, proporciona un argumentó numérico con la cantidad de sanciones a eliminar.`]
                    let condicionales = [miembro.id == client.user.id, miembro.user.bot, !dataHis.usuarios.some(s=>s.id == miembro.id), !dataHis.usuarios.find(f=>f.id == miembro.id).servidores.some(s=>s.id == msg.guildId), !sancion, !["warns", "timeouts", "kicks", "bans", "advertencias", "aislamientos", "expulsiones", "baneos"].some(s=>s == args[1].toLowerCase()), !args[2], isNaN(args[2])]
        
                    for(let i in descripciones){
                        if(condicionales[i]){
                            const embErr = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    if(["warns", "advertencias"].some(s=>s == args[1].toLowerCase())){
                        if(miembro.id == msg.author.id){
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`No tienes registros de advertencias que puedas eliminarte de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).advertencias.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`Tienes **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).advertencias.length}** registros de advertencias y te quieres eliminar **${Math.floor(args[2])}**, no te puedes eliminar mas registros de advertencias de los que tienes.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).advertencias.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            let objeto = dataHis.sanciones,array = dataHis.usuarios
                            objeto.advertencias-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).advertencias.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Advertencias eliminadas`)
                            .setDescription(`Se te ha eliminado **${Math.floor(args[2])}** registros de advertencias de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)

                        }else{
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* no tiene registros de advertencias que puedas eliminarle de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).advertencias.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* tiene **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).advertencias.length}** registros de advertencias y le quieres eliminar **${Math.floor(args[2])}**, no le puedes eliminar mas registros de advertencias de los que tiene.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).advertencias.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            let objeto = dataHis.sanciones,array = dataHis.usuarios
                            objeto.advertencias-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).advertencias.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Advertencias eliminadas`)
                            .setDescription(`Se le han eliminado **${Math.floor(args[2])}** registros de advertencias del miembro ${miembro} de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)
                        }
                    }

                    if(["timeouts", "aislamientos"].some(s=>s == args[1].toLowerCase())){
                        if(miembro.id == msg.author.id){
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`No tienes registros de aislamientos que puedas eliminarte de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).aislamientos.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`Tienes **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).aislamientos.length}** registros de aislamientos y te quieres eliminar **${Math.floor(args[2])}**, no te puedes eliminar mas registros de aislamientos de los que tienes.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).aislamientos.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
    
                            let objeto = dataHis.sanciones, array = dataHis.usuarios
                            objeto.aislamientos-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).aislamientos.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Aislamientos eliminados`)
                            .setDescription(`Se te han eliminado **${Math.floor(args[2])}** registros de aislamientos de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)

                        }else{
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* no tiene registros de aislamientos que puedas eliminarle de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).aislamientos.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* tiene **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).aislamientos.length}** registros de aislamientos y le quieres eliminar **${Math.floor(args[2])}**, no le puedes eliminar mas registros de aislamientos de los que tiene.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).aislamientos.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
    
                            let objeto = dataHis.sanciones, array = dataHis.usuarios
                            objeto.aislamientos-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).aislamientos.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Aislamientos eliminados`)
                            .setDescription(`Se le han eliminado **${Math.floor(args[2])}** registros de aislamientos del miembro ${miembro} de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)
                        }
                    }

                    if(["kicks", "expulsiones"].some(s=>s == args[1].toLowerCase())){
                        if(miembro.id == msg.author.id){
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`No tienes registros de expulsiones que puedas eliminarte de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).expulsiones.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`Tienes **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).expulsiones.length}** registros de expulsiones y te quieres eliminar **${Math.floor(args[2])}**, no te puedes eliminar mas registros de expulsiones de los que tienes.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).expulsiones.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
    
                            let objeto = dataHis.sanciones, array = dataHis.usuarios
                            objeto.expulsiones-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).expulsiones.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Expulsiones eliminadas`)
                            .setDescription(`Se te han eliminado **${Math.floor(args[2])}** registros de expulsiones de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)

                        }else{
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* no tiene registros de expulsiones que puedas eliminarle de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).expulsiones.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* tiene **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).expulsiones.length}** registros de expulsiones y le quieres eliminar **${Math.floor(args[2])}**, no le puedes eliminar mas registros de expulsiones de los que tiene.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).expulsiones.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
    
                            let objeto = dataHis.sanciones, array = dataHis.usuarios
                            objeto.expulsiones-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).expulsiones.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Expulsiones eliminadas`)
                            .setDescription(`Se le han eliminado **${Math.floor(args[2])}** registros de expulsiones del miembro ${miembro} de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)
                        }
                    }

                    if(["bans", "baneos"].some(s=>s == args[1].toLowerCase())){
                        if(miembro.id == msg.author.id){
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`No tienes registros de baneos que puedas eliminarte de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).baneos.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`Tienes **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).baneos.length}** registros de baneos y te quieres eliminar **${Math.floor(args[2])}**, no te puedes eliminar mas registros de baneos de los que tienes.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).baneos.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
    
                            let objeto = dataHis.sanciones, array = dataHis.usuarios
                            objeto.baneos-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).baneos.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Baneos eliminados`)
                            .setDescription(`Se te han eliminado **${Math.floor(args[2])}** registros de baneos de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)

                        }else{
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* no tiene registros de baneos que puedas eliminarle de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).baneos.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* tiene **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).baneos.length}** registros de baneos y le quieres eliminar **${Math.floor(args[2])}**, no le puedes eliminar mas registros de baneos de los que tiene.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).baneos.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
    
                            let objeto = dataHis.sanciones, array = dataHis.usuarios
                            objeto.baneos-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).baneos.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Baneos eliminadas`)
                            .setDescription(`Se le han eliminado **${Math.floor(args[2])}** registros de baneos del miembro ${miembro} de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)
                        }
                    }

                }else{
                    let descripciones = [`El miembro proporcionado *(${miembro})* soy yo, yo soy un bot por lo tanto no tengo historial de sanciones.`, `El miembro proporcionado *(${miembro})* es un bot, los bots no tienen historial de sanciones.`, `El rol con la posicion mas alta del miembro proporcionado *(${miembro})* tiene una posicion igual o mayor a tu rol mas alto por lo tanto no le puedes eliminar ninguna sancion de su historial.`, `El miembro proporcionado *(${miembro})* no tiene historial de sanciones por lo tanto no tiene sanciones que puedas eliminarle.`, `El miembro proporcionado *(${miembro})* no tiene sanciones en este servidor por lo tanto no le puedes eliminar ninguna sanción.`, `No has proporcionado el tipo de sanción que eliminaras del historial del miembro, puedes consultar las sanciones que tiene el miembro utilizando el comando \`\`${prefijo}record\`\`.`, `El segundo argumento proporcionado *(${args[1]})* no es un tipo de sanción, proporciona el tipo de sanción que le eliminaras del historial al miembro.`, `No has proporcionado el tercer y ultimo argumento el cual es la cantidad de sanciones que eliminaras del historial del miembro.`, `El tercer argumento proporcionado *(${args[2]})* no es numérico, proporciona un argumentó numérico con la cantidad de sanciones a eliminar.`]
                    let condicionales = [miembro.id == client.user.id, miembro.user.bot, msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<=0, !dataHis.usuarios.some(s=>s.id == miembro.id), !dataHis.usuarios.find(f=>f.id == miembro.id).servidores.some(s=>s.id == msg.guildId), !sancion, !["warns", "timeouts", "kicks", "bans", "advertencias", "aislamientos", "expulsiones", "baneos"].some(s=>s == args[1].toLowerCase()), !args[2], isNaN(args[2])]
        
                    for(let i in descripciones){
                        if(condicionales[i]){
                            const embErr = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    if(["warns", "advertencias"].some(s=>s == args[1].toLowerCase())){
                        if(miembro.id == msg.author.id){
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`No tienes registros de advertencias que puedas eliminarte de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).advertencias.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`Tienes **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).advertencias.length}** registros de advertencias y te quieres eliminar **${Math.floor(args[2])}**, no te puedes eliminar mas registros de advertencias de los que tienes.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).advertencias.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            let objeto = dataHis.sanciones,array = dataHis.usuarios
                            objeto.advertencias-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).advertencias.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Advertencias eliminadas`)
                            .setDescription(`Se te ha eliminado **${Math.floor(args[2])}** registros de advertencias de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)

                        }else{
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* no tiene registros de advertencias que puedas eliminarle de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).advertencias.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* tiene **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).advertencias.length}** registros de advertencias y le quieres eliminar **${Math.floor(args[2])}**, no le puedes eliminar mas registros de advertencias de los que tiene.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).advertencias.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            let objeto = dataHis.sanciones,array = dataHis.usuarios
                            objeto.advertencias-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).advertencias.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Advertencias eliminadas`)
                            .setDescription(`Se le han eliminado **${Math.floor(args[2])}** registros de advertencias del miembro ${miembro} de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)
                        }
                    }

                    if(["timeouts", "aislamientos"].some(s=>s == args[1].toLowerCase())){
                        if(miembro.id == msg.author.id){
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`No tienes registros de aislamientos que puedas eliminarte de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).aislamientos.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`Tienes **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).aislamientos.length}** registros de aislamientos y te quieres eliminar **${Math.floor(args[2])}**, no te puedes eliminar mas registros de aislamientos de los que tienes.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).aislamientos.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
    
                            let objeto = dataHis.sanciones, array = dataHis.usuarios
                            objeto.aislamientos-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).aislamientos.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Aislamientos eliminados`)
                            .setDescription(`Se te han eliminado **${Math.floor(args[2])}** registros de aislamientos de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)

                        }else{
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* no tiene registros de aislamientos que puedas eliminarle de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).aislamientos.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* tiene **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).aislamientos.length}** registros de aislamientos y le quieres eliminar **${Math.floor(args[2])}**, no le puedes eliminar mas registros de aislamientos de los que tiene.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).aislamientos.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
    
                            let objeto = dataHis.sanciones, array = dataHis.usuarios
                            objeto.aislamientos-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).aislamientos.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Aislamientos eliminados`)
                            .setDescription(`Se le han eliminado **${Math.floor(args[2])}** registros de aislamientos del miembro ${miembro} de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)
                        }
                    }

                    if(["kicks", "expulsiones"].some(s=>s == args[1].toLowerCase())){
                        if(miembro.id == msg.author.id){
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`No tienes registros de expulsiones que puedas eliminarte de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).expulsiones.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`Tienes **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).expulsiones.length}** registros de expulsiones y te quieres eliminar **${Math.floor(args[2])}**, no te puedes eliminar mas registros de expulsiones de los que tienes.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).expulsiones.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
    
                            let objeto = dataHis.sanciones, array = dataHis.usuarios
                            objeto.expulsiones-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).expulsiones.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Expulsiones eliminadas`)
                            .setDescription(`Se te han eliminado **${Math.floor(args[2])}** registros de expulsiones de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)

                        }else{
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* no tiene registros de expulsiones que puedas eliminarle de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).expulsiones.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* tiene **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).expulsiones.length}** registros de expulsiones y le quieres eliminar **${Math.floor(args[2])}**, no le puedes eliminar mas registros de expulsiones de las que tiene.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).expulsiones.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
    
                            let objeto = dataHis.sanciones, array = dataHis.usuarios
                            objeto.expulsiones-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).expulsiones.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Expulsiones eliminadas`)
                            .setDescription(`Se le han eliminado **${Math.floor(args[2])}** registros de expulsiones del miembro ${miembro} de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)
                        }
                    }

                    if(["bans", "baneos"].some(s=>s == args[1].toLowerCase())){
                        if(miembro.id == msg.author.id){
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`No tienes registros de baneos que puedas eliminarte de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).baneos.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`Tienes **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).baneos.length}** registros de baneos y te quieres eliminar **${Math.floor(args[2])}**, no te puedes eliminar mas registros de baneos de los que tienes.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).baneos.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
    
                            let objeto = dataHis.sanciones, array = dataHis.usuarios
                            objeto.baneos-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).baneos.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Baneos eliminados`)
                            .setDescription(`Se te han eliminado **${Math.floor(args[2])}** registros de baneos de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)

                        }else{
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* no tiene registros de baneos que puedas eliminarle de este servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).baneos.length == 0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)

                            const embError2 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* tiene **${dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).baneos.length}** registros de baneos y le quieres eliminar **${Math.floor(args[2])}**, no le puedes eliminar mas registros de baneos de los que tiene.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(dataHis.usuarios.find(f=>f.id == miembro.id).servidores.find(f=>f.id == msg.guildId).baneos.length < Math.floor(args[2])) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
    
                            let objeto = dataHis.sanciones, array = dataHis.usuarios
                            objeto.baneos-=Math.floor(args[2])
                            array.find(f=>f.id == miembro.id).servidores.find(s=>s.id == msg.guildId).baneos.splice(0,Math.floor(args[2]))
                            await historiales.findByIdAndUpdate(client.user.id, {sanciones: objeto, usuarios: array})

                            const embDeleteHis = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Baneos eliminadas`)
                            .setDescription(`Se le han eliminado **${Math.floor(args[2])}** registros de baneos del miembro ${miembro} de este servidor.`)
                            .setColor("GREEN")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteHis]})
                            }, 500)
                        }
                    }
                }
            }

        }else{
            let descripciones = [`El argumento numérico  proporcionado *(${args[0]})* no es una **ID** valida ya que contiene menos de **18** caracteres numéricos, una **ID** esta constituida por **18** caracteres numéricos.`, `El argumento numérico proporcionado *(${args[0]})* no es una **ID** ya que contiene mas de **18** caracteres numéricos, una **ID** esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado *(${args[0]})* no se reconoce como una **mención**, **ID** o **etiqueta** de un miembro del servidor, proporciona una **mención**, **ID** o **etiqueta** valida de un miembro del servidor.`, `El argumento proporcionado *(${args[0]})* tiene todas las caracteristicas de una **ID** es numérico y contines **18** caracteres numéricos pero no es una **ID** de ningun miembro de este servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0]), args[0].length == 18]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }
    }

    if(comando == "warn" || comando == "advertir"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let dataHis = await historiales.findOne({_id: client.user.id})
        const embErr1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Aislar miembros, Expulsar miembros o Banear miembros.")
        .setTimestamp()
        if(!msg.member.permissions.has("MODERATE_MEMBERS") && !msg.member.permissions.has("KICK_MEMBERS") && !msg.member.permissions.has("BAN_MEMBERS")){
            return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                }, 30000))
            }, 500)
        }

        if(!cooldowns.has("warn")){
            cooldowns.set("warn", new Discord.Collection())
        }

        const tiempoActual = Date.now()
        const datosComando = cooldowns.get("warn")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
            console.log(tiempoUltimo - tiempoActual)

            const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
            const embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando warn")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

    
        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando warn`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}warn <Mencion del miembro> <Razón>\`\`\n\`\`${prefijo}warn <ID del miembro> <Razón>\`\`\n\`\`${prefijo}warn <Tag/etiqueta del miembro> <Razón>\`\``},
            {name: "Ejemplos: **3**", value: `${prefijo}warn ${msg.author} Mal uso de canales.\n${prefijo}warn ${msg.author.id} Uso de palabras in adecuadas.\n${prefijo}warn ${msg.author.tag} Crear un conflicto.`},
            {name: "Alias: **2**", value: `\`\`warn\`\`, \`\`advertir\`\``},
            {name: "Descripción:", value: `Envía una advertencia aun miembro del servidor por medio del bot.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500);


        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag === args[0])
        let razon = args.slice(1).join(" ")

        if(!miembro){
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`, `El argumento proporcionado *(${args[0]})* tiene las características de una ID, es numérico, contiene **18** caracteres pero no es una ID de ningún miembro del servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0]), !msg.guild.members.cache.find(f=> f.id == args[0])]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }

        if(miembro){
            if(msg.author.id === msg.guild.ownerId){
                const embErr0 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No he podido enviar la advertencia al usuario, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                .setColor(ColorError)
                .setTimestamp()

                let descripciones = [`El usuario proporcionado soy yo, no me puedo advertir a mi mismo.`, `El usuario proporcionado es un bot, no puedes advertir a un bot.`,`¿Por que quieres advertirte a ti mismo si eres el propietario del servidor?, no puedo realizar esa acción.`, `No has proporcionado una razón, proporciona una razón de la advertencia.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                let condicionales = [miembro.id === client.user.id, miembro.user.bot, miembro.id === msg.author.id, !razon, razon.length > 1000]

                for(let i=0; i<descripciones.length; i++){
                    if(condicionales[i]){
                        const embErrMiembro = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                const embMencion = new Discord.MessageEmbed()
                .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                .setTitle("<:advertencia:929204500739268608> Miembro advertido")
                .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.id}\n\n📝 **razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                .setColor("#E5DA00")
                .setFooter(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                setTimeout(() =>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMencion]})
                }, 500)

                const embMDMencion = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("<:advertencia:929204500739268608> Has sido advertido")
                .setDescription(`📝 **Por la razón:**\n${razon}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                .setColor("#E5DA00")
                .setFooter(`En el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                miembro.send({embeds: [embMDMencion]}).catch(c=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr0]}).then(tm=>setTimeout(()=>{
                        msg.delete().catch(cm=>{
                            return;
                        })
                        tm.delete().catch(e=>{
                            return;
                        })
                    }, 30000))
                })

                if(dataHis.usuarios.some(s=> s.id === miembro.id)){
                    let posicion
                    for(let i=0; i<dataHis.usuarios.length; i++){
                        if(dataHis.usuarios[i].id === miembro.id){
                            posicion = i
                        }
                    }

                    if(dataHis.usuarios[posicion].servidores.some(s=> s.id === msg.guildId)){
                        let guiPosicion 
                        for(let g=0; g<dataHis.usuarios[posicion].servidores.length; g++){
                            if(dataHis.usuarios[posicion].servidores[g].id === msg.guildId){
                                guiPosicion = g
                            }
                        }

                        let momentaneaDB = dataHis.usuarios[posicion]
                        momentaneaDB.servidores[guiPosicion].advertencias.push({autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon})

                        dataHis.usuarios[posicion] = momentaneaDB
                    }else{
                        let momentaneaDB = dataHis.usuarios[posicion]
                        momentaneaDB.servidores.push({id: msg.guildId, nombre: msg.guild.name, advertencias: [{autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon}], aislamientos: [], expulsiones: [], baneos: []})
                        dataHis.usuarios[posicion] = momentaneaDB
                    }
                }else{
                    dataHis.usuarios.push({id: miembro.id, tag: miembro.user.tag, servidores: [{autor: msg.author.id, id: msg.guildId, nombre: msg.guild.name, advertencias: [{tiempo: Math.floor(msg.createdAt / 1000), razon: razon}], aislamientos: [], expulsiones: [], baneos: []}]})
                }

                let adv = dataHis.sanciones.advertencias
                let ais = dataHis.sanciones.aislamientos
                let exp = dataHis.sanciones.expulsiones
                let ban = dataHis.sanciones.baneos
                dataHis.sanciones = {advertencias: adv+1, aislamientos: ais, expulsiones: exp, baneos: ban}
                await dataHis.save()

            }else{
                const embErr0 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No he podido enviar la advertencia al usuario, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                .setColor(ColorError)
                .setTimestamp()

                let descripciones = [`El usuario proporcionado soy yo, no me puedo advertir a mi mismo.`, `El usuario proporcionado es un bot, no puedes advertir a un bot.`,`¿Por que quieres advertirte a ti mismo?, no puedo realizar esa acción.`, `Ese miembro es el dueño del servidor, no puedes advertir al dueño del servidor.`, `Ese miembro tiene un rol igual o mayor al tuyo por lo tanto no lo puedes advertir.` ,`No has proporcionado una razón, proporciona una razón de la advertencia.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                let condicionales = [miembro.id === client.user.id, miembro.user.bot, miembro.id === msg.author.id, miembro.id === msg.guild.ownerId, msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<=0, !razon, razon.length > 1000]

                for(let i=0; i<descripciones.length; i++){
                    if(condicionales[i]){
                        const embErrMiembro = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }


                const embMencion = new Discord.MessageEmbed()
                .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                .setTitle("<:advertencia:929204500739268608> Miembro advertido")
                .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.id}\n\n📝 **razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                .setColor("#E5DA00")
                .setFooter(miembro.user.tag,miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMencion]})
                }, 500)

                const embMDMencion = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("<:advertencia:929204500739268608> Has sido advertido")
                .setDescription(`📝 **Por la razón:**\n${razon}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                .setColor("#E5DA00")
                .setFooter(`En el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                miembro.send({embeds: [embMDMencion]}).catch(c=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr0]}).then(tm=>setTimeout(()=>{
                        msg.delete().catch(cm=>{
                            return;
                        })
                        tm.delete().catch(e=>{
                            return;
                        })
                    }, 30000))
                })

                if(dataHis.usuarios.some(s=> s.id === miembro.id)){
                    let posicion
                    for(let i=0; i<dataHis.usuarios.length; i++){
                        if(dataHis.usuarios[i].id === miembro.id){
                            posicion = i
                        }
                    }

                    if(dataHis.usuarios[posicion].servidores.some(s=> s.id === msg.guildId)){
                        let guiPosicion 
                        for(let g=0; g<dataHis.usuarios[posicion].servidores.length; g++){
                            if(dataHis.usuarios[posicion].servidores[g].id === msg.guildId){
                                guiPosicion = g
                            }
                        }

                        let momentaneaDB = dataHis.usuarios[posicion]
                        momentaneaDB.servidores[guiPosicion].advertencias.push({autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon})

                        dataHis.usuarios[posicion] = momentaneaDB
                    }else{
                        let momentaneaDB = dataHis.usuarios[posicion]
                        momentaneaDB.servidores.push({id: msg.guildId, nombre: msg.guild.name, advertencias: [{autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon}], aislamientos: [], expulsiones: [], baneos: []})
                        dataHis.usuarios[posicion] = momentaneaDB
                    }
                }else{
                    dataHis.usuarios.push({id: miembro.id, tag: miembro.user.tag, servidores: [{autor: msg.author.id, id: msg.guildId, nombre: msg.guild.name, advertencias: [{tiempo: Math.floor(msg.createdAt / 1000), razon: razon}], aislamientos: [], expulsiones: [], baneos: []}]})
                }

                let adv = dataHis.sanciones.advertencias
                let ais = dataHis.sanciones.aislamientos
                let exp = dataHis.sanciones.expulsiones
                let ban = dataHis.sanciones.baneos
                dataHis.sanciones = {advertencias: adv+1, aislamientos: ais, expulsiones: exp, baneos: ban}
                await dataHis.save()
            }
        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "mute" || comando == "aislar"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let dataHis = await historiales.findOne({_id: client.user.id})
        let condicionalesP = [!msg.member.permissions.has("MODERATE_MEMBERS"), !msg.guild.me.permissions.has("MODERATE_MEMBERS")]
        let descripcionesP = [`No tienes los permisos suficientes para ejecutar el comando.`, `No tengo los permisos suficientes para ejecutar el comando.`]
        for(let p=0; p<descripcionesP.length; p++){
            if(condicionalesP[p]){
                const embErrMiembro = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(descripcionesP[p])
                .setColor(ColorError)
                .setFooter("Permiso requerido: Aislar temporalmente a miembros")
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)
            }
        }

        if(!cooldowns.has("mute")){
            cooldowns.set("mute", new Discord.Collection())
        }

        const tiempoActual = Date.now()
        const datosComando = cooldowns.get("mute")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
            console.log(tiempoUltimo - tiempoActual)

            const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
            const embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando mute")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        let tiempos = ["1m", "5m", "10m", "30m", "1h", "2h", "4h", "8h", "16h", "1d", "2d", "4d", "10d", "20d"]
        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando mute`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}mute <Mencion del miembro> <Tiempo del aislamiento> <Razón>\`\`\n\`\`${prefijo}mute <ID del miembro> <Tiempo del aislamiento> <Razón>\`\`\n\`\`${prefijo}mute <Etiqueta del miembro> <Tiempo del aislamiento> <Razón>\`\``},
            {name: "Ejemplos: **3**", value: `${prefijo}mute ${msg.author} ${tiempos[Math.floor(Math.random()*tiempos.length)]} Mal uso de canales.\n${prefijo}mute ${msg.author.id} ${tiempos[Math.floor(Math.random()*tiempos.length)]} Uso de palabras in adecuadas.\n${prefijo}mute ${msg.author.tag} ${tiempos[Math.floor(Math.random()*tiempos.length)]} Publicar enlaces.`},
            {name: "Alias: **2**", value: `\`\`mute\`\`, \`\`aislar\`\``},
            {name: "Descripción:", value: `Aísla a un miembro durante el tiempo que quieras dentro de el servidor, al hacer esto el miembro asilado no podrá interactuar de ninguna forma con el servidor, no podrá enviar mensajes, añadir reacciones, unirse a un canal de voz, etc.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500);

        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag === args[0])
        let tiempo = args.slice(1)[0]
        let razon = args.slice(2).join(" ")

        if(!miembro){
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`, `El argumento proporcionado *(${args[0]})* tiene las caracteristicas de una **ID**, es numérico, contiene **18** caracteres pero no coresponde con la **ID** de ningun miembro del servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0]), args[0].length == 18]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }

        if(miembro){
            if(msg.author.id === msg.guild.ownerId){
                const embErr0 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No he podido enviar al miembro la razón por la que fue aislado, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                .setColor(ColorError)
                .setTimestamp()

                let descripciones = [`El usuario proporcionado soy yo, no me puedo aislar a mi mismo.`, `El usuario proporcionado es un bot, no se puede aislar a un bot.`,`¿Por que quieres aislarte a ti mismo si eres el propietario del servidor?, no puedo realizar esa acción.`, `El miembro proporcionado es un administrador en el servidor o tiene permiso de administrador, no lo puedo aislar.`, `El miembro proporcionado ya esta aislado temporalmente y su aislamiento temporal termina <t:${Math.floor(miembro.communicationDisabledUntilTimestamp / 1000)}:R>`, `No proporcionaste el tiempo que estará aislado el miembro.`]
                let condicionales = [miembro.id === client.user.id, miembro.user.bot, miembro.id === msg.author.id, miembro.permissions.has("ADMINISTRATOR"), miembro.isCommunicationDisabled(), !tiempo]

                for(let i=0; i<descripciones.length; i++){
                    if(condicionales[i]){
                        const embErrMiembro = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                const embErr1 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No proporcionaste bien el tiempo el cual durara el miembro aislado.\n\n**Ejemplos:**\n10 minutos = **10m**\n2 horas = **2h**\n5 días = **5d**`)
                .setColor(ColorError)
                .setTimestamp()
                if(!ms(tiempo)) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)

                let descripciones2 = [`No puedes aislar a un miembro por menos de **1** minuto.`, `No puedes aislar a un miembro por mas de **20** días.`, `No has proporcionado una razón, proporciona una razón del aislamiento.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                let condicionales2 = [ms(tiempo) < 60000, ms(tiempo) > 1728000000, !razon, razon.length > 1000]

                for(let i=0; i<descripciones2.length; i++){
                    if(condicionales2[i]){
                        const embErrMiembro = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones2[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                const embMencion = new Discord.MessageEmbed()
                .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                .setTitle("<:aislacion:947965052772814848> Miembro aislado/a")
                .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.id}\n\n⏱️ **Aislado/a por:** ${tiempo}\n\n📝 **razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                .setColor("#0283F6")
                .setFooter(miembro.user.tag,miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                miembro.timeout(ms(tiempo), `Miembro aislado/a temporalmente por: ${msg.author.tag} durante ${tiempo} por la razón: ${razon}`).then(ta=>{
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMencion]})
                    }, 500)
                })

                const embMDMencion = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("<:aislacion:947965052772814848> Has sido aislado/a")
                .setDescription(`⏱️ **Aislado/a por:** ${tiempo}\n\n📝 **Por la razón:**\n${razon}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                .setColor("#0283F6")
                .setFooter(`En el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                miembro.send({embeds: [embMDMencion]}).catch(c=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr0]}).then(tm=>setTimeout(()=>{
                        tm.delete().catch(e=>{
                            return;
                        })
                    }, 30000))
                })

                if(dataHis.usuarios.some(s=> s.id === miembro.id)){
                    let posicion
                    for(let i=0; i<dataHis.usuarios.length; i++){
                        if(dataHis.usuarios[i].id === miembro.id){
                            posicion = i
                        }
                    }

                    if(dataHis.usuarios[posicion].servidores.some(s=> s.id === msg.guildId)){
                        let guiPosicion 
                        for(let g=0; g<dataHis.usuarios[posicion].servidores.length; g++){
                            if(dataHis.usuarios[posicion].servidores[g].id === msg.guildId){
                                guiPosicion = g
                            }
                        }

                        let momentaneaDB = dataHis.usuarios[posicion]
                        momentaneaDB.servidores[guiPosicion].aislamientos.push({autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), aislamiento: tiempo, razon: razon})

                        dataHis.usuarios[posicion] = momentaneaDB
                    }else{
                        let momentaneaDB = dataHis.usuarios[posicion]
                        momentaneaDB.servidores.push({id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [{autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), aislamiento: tiempo, razon: razon}], expulsiones: [], baneos: []})
                        dataHis.usuarios[posicion] = momentaneaDB
                    }
                }else{
                    dataHis.usuarios.push({id: miembro.id, tag: miembro.user.tag, servidores: [{autor: msg.author.id, id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [{tiempo: Math.floor(msg.createdAt / 1000), aislamiento: tiempo, razon: razon}], expulsiones: [], baneos: []}]})
                }

                let adv = dataHis.sanciones.advertencias
                let ais = dataHis.sanciones.aislamientos
                let exp = dataHis.sanciones.expulsiones
                let ban = dataHis.sanciones.baneos
                dataHis.sanciones = {advertencias: adv, aislamientos: ais+1, expulsiones: exp, baneos: ban}
                await dataHis.save()

            }else{
                const embErr0 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No he podido enviar al miembro la razón por la que fue aislado, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                .setColor(ColorError)
                .setTimestamp()

                let descripciones = [`El usuario proporcionado soy yo, no me puedo aislar a mi mismo.`, `El usuario proporcionado es un bot, no se puede aislar a un bot.`,`¿Por que quieres aislarte a ti mismo?, no puedo realizar esa acción.`, `El miembro proporcionado es el dueño del servidor, no puedes aislar temporalmente al dueño del servidor, nadie puede.`, `El miembro proporcionado es un administrador en el servidor o tiene permiso de administrador, no lo puedo aislar.`, `El miembro proporcionado tiene un rol igual o mayor al tuyo por lo tanto no lo puedes aislar temporalmente.`, `El miembro proporcionado tiene un rol igual o mayor al mío por lo tanto no lo puedo aislar temporalmente.`, `El miembro proporcionado ya esta aislado temporalmente y su aislamiento temporal termina <t:${Math.floor(miembro.communicationDisabledUntilTimestamp / 1000)}:R>`, `No proporcionaste el tiempo que estará aislado el miembro.`]
                let condicionales = [miembro.id === client.user.id, miembro.user.bot, miembro.id === msg.author.id, miembro.id === msg.guild.ownerId, miembro.permissions.has("ADMINISTRATOR"), msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<=0, msg.guild.me.roles.highest.comparePositionTo(miembro.roles.highest)<=0, miembro.isCommunicationDisabled(), !tiempo]
                
                for(let i=0; i<descripciones.length; i++){
                    if(condicionales[i]){
                        const embErrMiembro = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                const embErr1 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No proporcionaste bien el tiempo el cual durara el miembro aislado.\n\n**Ejemplos:**\n10 minutos = **10m**\n2 horas = **2h**\n5 días = **5d**`)
                .setColor(ColorError)
                .setTimestamp()
                if(!ms(tiempo)) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)

                let descripciones2 = [`No puedes aislar a un miembro por menos de **1** minuto.`, `No puedes aislar a un miembro por mas de **20** días.`, `No has proporcionado una razón, proporciona una razón del aislamiento.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                let condicionales2 = [ms(tiempo) < 60000, ms(tiempo) > 1728000000, !razon, razon.length > 1000]

                for(let i=0; i<descripciones2.length; i++){
                    if(condicionales2[i]){
                        const embErrMiembro = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones2[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }


                const embMencion = new Discord.MessageEmbed()
                .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                .setTitle("<:aislacion:947965052772814848> Miembro aislado/a")
                .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.id}\n\n⏱️ **Aislado/a por:** ${tiempo}\n\n📝 **razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                .setColor("#0283F6")
                .setFooter(miembro.user.tag,miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                miembro.timeout(ms(tiempo), `Miembro aislado/a temporalmente por: ${msg.author.tag} durante ${tiempo} por la razón: ${razon}`).then(ta=>{
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMencion]})
                    }, 500)
                })

                const embMDMencion = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("<:aislacion:947965052772814848> Has sido aislado/a")
                .setDescription(`⏱️ **Aislado/a por:** ${tiempo}\n\n📝 **Por la razón:**\n${razon}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                .setColor("#0283F6")
                .setFooter(`En el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                miembro.send({embeds: [embMDMencion]}).catch(c=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr0]}).then(tm=>setTimeout(()=>{
                        tm.delete().catch(e=>{
                            return;
                        })
                    }, 30000))
                })

                if(dataHis.usuarios.some(s=> s.id === miembro.id)){
                    let posicion
                    for(let i=0; i<dataHis.usuarios.length; i++){
                        if(dataHis.usuarios[i].id === miembro.id){
                            posicion = i
                        }
                    }

                    if(dataHis.usuarios[posicion].servidores.some(s=> s.id === msg.guildId)){
                        let guiPosicion 
                        for(let g=0; g<dataHis.usuarios[posicion].servidores.length; g++){
                            if(dataHis.usuarios[posicion].servidores[g].id === msg.guildId){
                                guiPosicion = g
                            }
                        }

                        let momentaneaDB = dataHis.usuarios[posicion]
                        momentaneaDB.servidores[guiPosicion].aislamientos.push({autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), aislamiento: tiempo, razon: razon})

                        dataHis.usuarios[posicion] = momentaneaDB
                    }else{
                        let momentaneaDB = dataHis.usuarios[posicion]
                        momentaneaDB.servidores.push({id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [{autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), aislamiento: tiempo, razon: razon}], expulsiones: [], baneos: []})
                        dataHis.usuarios[posicion] = momentaneaDB
                    }
                }else{
                    dataHis.usuarios.push({id: miembro.id, tag: miembro.user.tag, servidores: [{autor: msg.author.id, id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [{tiempo: Math.floor(msg.createdAt / 1000), aislamiento: tiempo, razon: razon}], expulsiones: [], baneos: []}]})
                }

                let adv = dataHis.sanciones.advertencias
                let ais = dataHis.sanciones.aislamientos
                let exp = dataHis.sanciones.expulsiones
                let ban = dataHis.sanciones.baneos
                dataHis.sanciones = {advertencias: adv, aislamientos: ais+1, expulsiones: exp, baneos: ban}
                await dataHis.save()
            }

        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "unmute"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let condicionalesP = [!msg.member.permissions.has("MODERATE_MEMBERS"), !msg.guild.me.permissions.has("MODERATE_MEMBERS")]
        let descripcionesP = [`No tienes los permisos suficientes para ejecutar el comando.`, `No tengo los permisos suficientes para ejecutar el comando.`]
        for(let p=0; p<descripcionesP.length; p++){
            if(condicionalesP[p]){
                const embErrMiembro = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(descripcionesP[p])
                .setColor(ColorError)
                .setFooter("Permiso requerido: Aislar temporalmente a miembros")
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)
            }
        }

        if(!cooldowns.has("unmute")){
            cooldowns.set("unmute", new Discord.Collection())
        }

        const tiempoActual = Date.now()
        const datosComando = cooldowns.get("unmute")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
            console.log(tiempoUltimo - tiempoActual)

            const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
            const embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando unmute")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }
        

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando unmute`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}unmute <Mencion del miembro>\`\`\n\`\`${prefijo}unmute <ID del miembro>\`\`\n\`\`${prefijo}unmute <Etiqueta del miembro>\`\``},
            {name: "Ejemplos: **3**", value: `${prefijo}unmute ${msg.author}\n${prefijo}unmute ${msg.author.id}\n${prefijo}unmute ${msg.author.tag}`},
            {name: "Alias: **1**", value: `\`\`unmute\`\``},
            {name: "Descripción:", value: `Elimina el aislamiento temporal de un miembro.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500);

        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag === args[0])

        if(!miembro){
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`, `El argumento proporcionado *(${args[0]})* tiene las caracteristicas de una **ID**, es numérico, contiene **18** caracteres pero no coresponde con la **ID** de ningun miembro del servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0]), args[0].length == 18]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }

        if(miembro){
            if(msg.author.id === msg.guild.ownerId){
                const embErr0 = new Discord.MessageEmbed()
                .setTitle("<a:negativo:856967325505159169> Error")
                .setDescription(`No he podido enviar al miembro el mensaje de notificación por su eliminación del aislamiento, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                .setColor(ColorError)
                .setTimestamp()

                let descripciones = [`El miembro proporcionado soy yo, no estoy aislado.`, `El miembro proporcionado es un bot, no se puede aislar a un bot por lo tanto ese bot no esta aislado.`, `El miembro que has proporcionado eres tu, tu no estas aislado temporalmente.`, `El miembro proporcionado no esta aislado temporalmente.`, `El miembro proporcionado es administrador o tiene permiso de administrador, no le puedo eliminar el aislamiento.`]
                let condicionales = [miembro.id === client.user.id, miembro.user.bot, miembro.id === msg.author.id, !miembro.isCommunicationDisabled(), miembro.permissions.has("ADMINISTRATOR")]

                for(let i=0; i<descripciones.length; i++){
                    if(condicionales[i]){
                        const embErrMiembro = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                const embMencion = new Discord.MessageEmbed()
                .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                .setTitle("<a:afirmativo:856966728806432778> Aislamiento temporal eliminado del miembro")
                .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.id}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                .setColor("GREEN")
                .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                miembro.timeout(null, `Aislamiento temporal eliminado del miembro por: ${msg.author.tag}`).then(ta=>{
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMencion]})
                    }, 500)
                })

                const embMDMencion = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("<a:afirmativo:856966728806432778> Tu aislamiento temporal ha sido eliminado")
                .setDescription(`👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                .setColor("GREEN")
                .setFooter(`En el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                miembro.send({embeds: [embMDMencion]}).catch(c=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr0]}).then(tm=>setTimeout(()=>{
                        tm.delete().catch(e=>{
                            return;
                        })
                    }, 30000))
                })

            }else{
                const embErr0 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No he podido enviar al miembro el mensaje de notificación por su eliminación del aislamiento, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                .setColor(ColorError)
                .setTimestamp()

                let descripciones = [`El miembro proporcionado soy yo, no estoy aislado.`, `El miembro proporcionado es un bot, no se puede aislar a un bot por lo tanto ese bot no esta aislado.`, `El miembro que has proporcionado eres tu, tu no estas aislado temporalmente.`, `El miembro proporcionado es el dueño del servidor, nadie lo puede aislar por lo tanto no tiene aislamiento que puedas eliminarle.`, `El miembro proporcionado tiene un rol igual o mayor al tuyo por lo tanto no le puedes eliminar el aislamiento.`, `El miembro proporcionado tiene un rol igual o mayor al mío por lo tanto no le puedo eliminar el aislamiento.`, `El miembro proporcionado no esta aislado temporalmente.`, `El miembro proporcionado es administrador o tiene permiso de administrador, no le puedo eliminar el aislamiento.`]
                let condicionales = [miembro.id === client.user.id, miembro.user.bot, miembro.id === msg.author.id, miembro.id === msg.guild.ownerId, msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<=0, msg.guild.me.roles.highest.comparePositionTo(miembro.roles.highest)<=0, !miembro.isCommunicationDisabled(), miembro.permissions.has("ADMINISTRATOR")]
                
                for(let i=0; i<descripciones.length; i++){
                    if(condicionales[i]){
                        const embErrMiembro = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }


                const embMencion = new Discord.MessageEmbed()
                .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                .setTitle("<a:afirmativo:856966728806432778> Aislamiento temporal eliminado del miembro")
                .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.id}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                .setColor("GREEN")
                .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                miembro.timeout(null, `Aislamiento temporal eliminado del miembro por: ${msg.author.tag}`).then(ta=>{
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMencion]})
                    }, 500)
                })

                const embMDMencion = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("<a:afirmativo:856966728806432778> Tu aislamiento temporal ha sido eliminado")
                .setDescription(`👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                .setColor("GREEN")
                .setFooter(`En el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                miembro.send({embeds: [embMDMencion]}).catch(c=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr0]}).then(tm=>setTimeout(()=>{
                        tm.delete().catch(e=>{
                            return;
                        })
                    }, 30000))
                })
            }

        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "mutelist" || comando == "aislados"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let aislados = msg.guild.members.cache.filter(f=> f.isCommunicationDisabled())

        const embMuteList = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("<:aislacion:947965052772814848> Miembros aislados")
        .setDescription(`*No hay miembros aislados en este servidor.*`)
        .setColor("#0083FF")
        .setTimestamp()
        if(aislados.size <=0) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMuteList]})
        }, 500)

        if(aislados.size <= 10){
            const embMuteList = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("<:aislacion:947965052772814848> Miembros aislados")
            .setDescription(`Hay un total de **${aislados.size.toLocaleString()}** miembros con aislamiento temporal.\n\n${aislados.map(p=>p).map((a, n)=> `**${n+1}.** [${a.user.tag}](${a.user.displayAvatarURL({dynamic: true})}) su aislamiento termina <t:${Math.floor(a.communicationDisabledUntilTimestamp / 1000)}:R>`).join("\n")}`)
            .setColor("#0083FF")
            .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMuteList]})
            }, 500)
        }else{
            let segPage
            if(String(aislados.map(m=>m).length).slice(-1) === "0"){
                segPage = Math.floor(aislados.size / 10)
            }else{
                segPage = Math.floor(aislados.size / 10 + 1)
            }

            let ai1 = 0, ai2 = 10, pagina = 1

            const embMuteList = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("<:aislacion:947965052772814848> Miembros aislados")
            .setDescription(`Hay un total de **${aislados.size.toLocaleString()}** miembros con aislamiento temporal.\n\n${aislados.map(p=>p).map((a, n)=> `**${n+1}.** [${a.user.tag}](${a.user.displayAvatarURL({dynamic: true})}) su aislamiento termina <t:${Math.floor(a.communicationDisabledUntilTimestamp / 1000)}:R>`).slice(ai1,ai2).join("\n")}`)
            .setColor("#0083FF")
            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            
            const botones1 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("SECONDARY")
                    .setDisabled(true)
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente ")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("PRIMARY")
                ]
            )

            const botones2 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("PRIMARY")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("PRIMARY")
                ]
            )

            const botones3 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("PRIMARY")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("SECONDARY")
                    .setDisabled(true)
                ]
            )

            setTimeout(async ()=>{
                const mensajeSend = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMuteList], components: [botones1]})
                const filtro = i=> i.user.id === msg.author.id;
                const colector = mensajeSend.createMessageComponentCollector({filter: filtro, time: segPage * 60000})

                setTimeout(()=>{
                    mensajeSend.edit({embeds: [embMuteList], components: []})
                }, segPage * 60000)
    
                colector.on("collect", async botn => {
                    if(botn.customId === "1"){
                        if(ai2 - 10 <= 10){
                            ai1-=10, ai2-=10, pagina--
    
                            embMuteList
                            .setDescription(`Hay un total de **${aislados.size.toLocaleString()}** miembros con aislamiento temporal.\n\n${aislados.map(p=>p).map((a, n)=> `**${n+1}.** [${a.user.tag}](${a.user.displayAvatarURL({dynamic: true})}) su aislamiento termina <t:${Math.floor(a.communicationDisabledUntilTimestamp / 1000)}:R>`).slice(ai1,ai2).join("\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            return await botn.update({embeds: [embMuteList], components: [botones1]})
                        }
                        ai1-=10, ai2-=10, pagina--
    
                        embMuteList
                        .setDescription(`Hay un total de **${aislados.size.toLocaleString()}** miembros con aislamiento temporal.\n\n${aislados.map(p=>p).map((a, n)=> `**${n+1}.** [${a.user.tag}](${a.user.displayAvatarURL({dynamic: true})}) su aislamiento termina <t:${Math.floor(a.communicationDisabledUntilTimestamp / 1000)}:R>`).slice(ai1,ai2).join("\n")}`)
                        .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                        await botn.update({embeds: [embMuteList], components: [botones2]})
                    }
                    if(botn.customId === "2"){
                        if(ai2 + 10 >= aislados.size){
                            ai1+=10, ai2+=10, pagina++
    
                            embMuteList
                            .setDescription(`Hay un total de **${aislados.size.toLocaleString()}** miembros con aislamiento temporal.\n\n${aislados.map(p=>p).map((a, n)=> `**${n+1}.** [${a.user.tag}](${a.user.displayAvatarURL({dynamic: true})}) su aislamiento termina <t:${Math.floor(a.communicationDisabledUntilTimestamp / 1000)}:R>`).slice(ai1,ai2).join("\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            return await botn.update({embeds: [embMuteList], components: [botones3]})
                        }
                        ai1+=10, ai2+=10, pagina++
    
                        embMuteList
                        .setDescription(`Hay un total de **${aislados.size.toLocaleString()}** miembros con aislamiento temporal.\n\n${aislados.map(p=>p).map((a, n)=> `**${n+1}.** [${a.user.tag}](${a.user.displayAvatarURL({dynamic: true})}) su aislamiento termina <t:${Math.floor(a.communicationDisabledUntilTimestamp / 1000)}:R>`).slice(ai1,ai2).join("\n")}`)
                        .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                        return await botn.update({embeds: [embMuteList], components: [botones2]})
                    }
                })
            })
        }
    }

    if(comando == "kick" || comando == "expulsar"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let dataHis = await historiales.findOne({_id: client.user.id})
        let condicionalesP = [!msg.member.permissions.has("KICK_MEMBERS"), !msg.guild.me.permissions.has("KICK_MEMBERS")]
        let descripcionesP = [`No tienes los permisos suficientes para ejecutar el comando.`, `No tengo los permisos suficientes para ejecutar el comando.`]
        for(let p=0; p<descripcionesP.length; p++){
            if(condicionalesP[p]){
                const embErrMiembro = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(descripcionesP[p])
                .setColor(ColorError)
                .setFooter("Permiso requerido: Expulsar miembros")
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)
            }
        }

        if(!cooldowns.has("kick")){
            cooldowns.set("kick", new Discord.Collection())
        }

        const tiempoActual = Date.now()
        const datosComando = cooldowns.get("kick")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
            console.log(tiempoUltimo - tiempoActual)

            const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
            const embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando kick")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando kick`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}kick <Mencion del miembro> <Razón>\`\`\n\`\`${prefijo}kick <ID del miembro> <Razón>\`\`\n\`\`${prefijo}kick <Etiqueta del miembro> <Razón>\`\``},
            {name: "Ejemplos: **3**", value: `${prefijo}kick ${msg.author} Romper una regla.\n${prefijo}kick ${msg.author.id} Flood en canales.\n${prefijo}kick ${msg.author.tag} Spam al MD.`},
            {name: "Alias: **2**", value: `\`\`kick\`\`, \`\`expulsar\`\``},
            {name: "Descripción:", value: `Expulsa a un miembro del servidor, al expulsarlo el bot le enviara un mensaje con la razón de la expulsión.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false},embeds: [embInfo]})
        }, 500)
    

        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag === args[0])
        let razon = args.slice(1).join(" ")

        if(!miembro){
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`, `El argumento proporcionado *(${args[0]})* tiene las caracteristicas de una **ID**, es numérico, contiene **18** caracteres pero no coresponde con la **ID** de ningun miembro del servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0]), args[0].length == 18]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }

        if(miembro){
            if(msg.author.id === msg.guild.ownerId){
                let condicionalesOw = [miembro.id === client.user.id, miembro.id === msg.author.id]
                let descripcionesOw = [`El miembro proporcionado soy yo, no me puedo expulsar a mi mismo.`, `El miembro proporcionado eres tu, eres el dueño o dueña del servidor no te puedo expulsar.`]

                for(let o=0; o<descripcionesOw.length; o++){
                    if(condicionalesOw[o]){
                        const embErrMiembro = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripcionesOw[o])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }


                if(miembro.user.bot){
                    let descripcionesB = [`El miembro proporcionado es un bot y tiene un rol igual o mayor que el mío por lo tanto no puedo expulsarlo.`, `No has proporcionado la razón por la que expulsaras a ese bot, proporciona la razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionalesB = [msg.guild.me.roles.highest.comparePositionTo(miembro.roles.highest)<=0, !razon, razon.length > 1000]

                    for(let o=0; o<descripcionesB.length; o++){
                        if(condicionalesB[o]){
                            const embErrMiembro = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesB[o])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embedKickB = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                    .setTitle("<:salir12:879519859694776360> Bot expulsado")
                    .setDescription(`🤖 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#F78701")
                    .setFooter(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    miembro.kick(`Bot expulsado por: ${msg.author.tag} el ${msg.createdAt.toLocaleDateString()} por la razón: ${razon}`).then(k=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embedKickB]})
                    })

                }else{
                    const embErr0 = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`No he podido enviar la razón al miembro por la que fue expulsado, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                    .setColor(ColorError)
                    .setTimestamp()

                    let descripcionesU = [`El miembro proporcionado tiene un rol igual o mayor que el mío por lo tanto no puedo expulsarlo.`, `No has proporcionado la razón por la que expulsaras al miembro, proporciona la razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionalesU = [msg.guild.me.roles.highest.comparePositionTo(miembro.roles.highest)<=0, !razon, razon.length > 1000]

                    for(let o=0; o<descripcionesU.length; o++){
                        if(condicionalesU[o]){
                            const embErrMiembro = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesU[o])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embedKickM = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("<:salir12:879519859694776360> Miembro expulsado")
                    .setThumbnail(miembro.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                    .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#F78701")
                    .setFooter(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                    .setTimestamp()

                    const embedKickMD = new Discord.MessageEmbed()
                    .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                    .setTitle("<:salir12:879519859694776360> Has sido expulsado")
                    .setDescription(`📝 **Por la razón:** ${razon}\n\n👮 **Por el moderador:** ${msg.author}\n**ID:** ${msg.author.id}`)
                    .setColor("#F78701")
                    .setFooter(`Del el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    miembro.send({embeds: [embedKickMD]}).catch(e=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr0]}).then(e=> setTimeout(()=>{
                            e.delete().catch(c=>{
                                return; 
                            })
                        }, 30000))
                    })
                    miembro.kick(`Miembro expulsado por: ${msg.author.tag} el ${msg.createdAt.toLocaleDateString()} por la razón: ${razon}`).then(k=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embedKickM]})
                        }, 500)
                    })

                    if(dataHis.usuarios.some(s=> s.id === miembro.id)){
                        let posicion
                        for(let i=0; i<dataHis.usuarios.length; i++){
                            if(dataHis.usuarios[i].id === miembro.id){
                                posicion = i
                            }
                        }
    
                        if(dataHis.usuarios[posicion].servidores.some(s=> s.id === msg.guildId)){
                            let guiPosicion 
                            for(let g=0; g<dataHis.usuarios[posicion].servidores.length; g++){
                                if(dataHis.usuarios[posicion].servidores[g].id === msg.guildId){
                                    guiPosicion = g
                                }
                            }
    
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores[guiPosicion].expulsiones.push({autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon})
    
                            dataHis.usuarios[posicion] = momentaneaDB
                        }else{
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores.push({id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [{autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon}], baneos: []})
                            dataHis.usuarios[posicion] = momentaneaDB
                        }
                    }else{
                        dataHis.usuarios.push({id: miembro.id, tag: miembro.user.tag, servidores: [{autor: msg.author.id, id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [{tiempo: Math.floor(msg.createdAt / 1000), razon: razon}], baneos: []}]})
                    }

                    let adv = dataHis.sanciones.advertencias
                    let ais = dataHis.sanciones.aislamientos
                    let exp = dataHis.sanciones.expulsiones
                    let ban = dataHis.sanciones.baneos
                    dataHis.sanciones = {advertencias: adv, aislamientos: ais, expulsiones: exp+1, baneos: ban}
                    await dataHis.save()
                }
            }else{
                let condicionalesNor = [miembro.id === client.user.id, miembro.id === msg.author.id, miembro.id === msg.guild.ownerId]
                let descripcionesNor = [`El miembro proporcionado soy yo, no me puedo expulsar a mi mismo.`, `¿Por que quieres que te expulse de este increíble servidor?, no puedo realizar esa acción.`, `El miembro proporcionado es el dueño del servidor, no lo puedes expulsar de su propio servidor.`]

                for(let o=0; o<descripcionesP.length; o++){
                    if(condicionalesNor[o]){
                        const embErrMiembro = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripcionesNor[o])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                if(miembro.user.bot){
                    let descripcionesB = [`El bot proporcionado tiene un rol igual o mayor que el tuyo por lo tanto no puedes expulsarlo.`, `El miembro proporcionado es un bot y tiene un rol igual o mayor que el mío por lo tanto no puedo expulsarlo.`, `No has proporcionado la razón por la que expulsaras a ese bot, proporciona la razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionalesB = [msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<=0, msg.guild.me.roles.highest.comparePositionTo(miembro.roles.highest)<=0, !razon, razon.length > 1000]

                    for(let o=0; o<descripcionesB.length; o++){
                        if(condicionalesB[o]){
                            const embErrMiembro = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesB[o])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embedMencion = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                    .setTitle("<:salir12:879519859694776360> Bot expulsado")
                    .setDescription(`🤖 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#F78701")
                    .setFooter(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    miembro.kick(`Bot expulsado por: ${msg.author.tag} el ${msg.createdAt.toLocaleDateString()} por la razón: ${razon}`).then(k=>{
                        setTimeout(()=> {
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embedMencion]})
                        }, 500)
                    })

                }else{
                    const embErr0 = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`No he podido enviar la razón al miembro por la que fue expulsado, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                    .setColor(ColorError)
                    .setTimestamp()

                    let descripcionesB = [`El miembro proporcionado tiene un rol igual o mayor que el tuyo por lo tanto no puedes expulsarlo.`, `El miembro proporcionado tiene un rol igual o mayor que el mío por lo tanto no puedo expulsarlo.`, `No has proporcionado la razón por la que expulsaras a ese miembro, proporciona la razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionalesB = [msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<=0, msg.guild.me.roles.highest.comparePositionTo(miembro.roles.highest)<=0, !razon, razon.length > 1000]

                    for(let o=0; o<descripcionesB.length; o++){
                        if(condicionalesB[o]){
                            const embErrMiembro = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesB[o])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embErrb3 = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`No has proporcionado la razón por la que expulsaras a ese miembro, proporciona la razón.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!razon) return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrb3]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000))
                    }, 500)

                    const embedKickM = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                    .setTitle("<:salir12:879519859694776360> Miembro expulsado")
                    .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#F78701")
                    .setFooter(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                    .setTimestamp()

                    const embedKickMDM = new Discord.MessageEmbed()
                    .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                    .setTitle("<:salir12:879519859694776360> Has sido expulsado")
                    .setDescription(`📝 **Por la razón:** ${razon}\n\n👮 **Por el moderador:** ${msg.author}\n**ID:** ${msg.author.id}`)
                    .setColor("#F78701")
                    .setFooter(`Del el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    miembro.send({embeds: [embedKickMDM]}).catch(e=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr0]}).then(er=> setTimeout(()=>{
                                er.delete().catch(c=> {
                                    return;
                                })
                            }, 30000))
                        }, 500)
                    })
                    // miembro.kick(`Miembro expulsado por: ${msg.author.tag} el ${msg.createdAt.toLocaleDateString()} por la razón: ${razon}`).then(k=>{
                    //     setTimeout(()=>{
                    //         msg.reply({allowedMentions: {repliedUser: false}, embeds: [embedKickM]})
                    //     }, 500)
                    // })

                    if(dataHis.usuarios.some(s=> s.id === miembro.id)){
                        let posicion
                        for(let i=0; i<dataHis.usuarios.length; i++){
                            if(dataHis.usuarios[i].id === miembro.id){
                                posicion = i
                            }
                        }
    
                        if(dataHis.usuarios[posicion].servidores.some(s=> s.id === msg.guildId)){
                            let guiPosicion 
                            for(let g=0; g<dataHis.usuarios[posicion].servidores.length; g++){
                                if(dataHis.usuarios[posicion].servidores[g].id === msg.guildId){
                                    guiPosicion = g
                                }
                            }
    
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores[guiPosicion].expulsiones.push({autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon})
    
                            dataHis.usuarios[posicion] = momentaneaDB
                        }else{
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores.push({id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [{autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon}], baneos: []})
                            dataHis.usuarios[posicion] = momentaneaDB
                        }
                    }else{
                        dataHis.usuarios.push({id: miembro.id, tag: miembro.user.tag, servidores: [{autor: msg.author.id, id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [{tiempo: Math.floor(msg.createdAt / 1000), razon: razon}], baneos: []}]})
                    }

                    let adv = dataHis.sanciones.advertencias
                    let ais = dataHis.sanciones.aislamientos
                    let exp = dataHis.sanciones.expulsiones
                    let ban = dataHis.sanciones.baneos
                    dataHis.sanciones = {advertencias: adv, aislamientos: ais, expulsiones: exp+1, baneos: ban}
                    await dataHis.save()
                }
            }
        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "ban" || comando == "prohibir"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let dataHis = await historiales.findOne({_id: client.user.id})
        let condicionalesP = [!msg.member.permissions.has("BAN_MEMBERS"), !msg.guild.me.permissions.has("BAN_MEMBERS")]
        let descripcionesP = [`No tienes los permisos suficientes para ejecutar el comando.`, `No tengo los permisos suficientes para ejecutar el comando.`]
        for(let p=0; p<descripcionesP.length; p++){
            if(condicionalesP[p]){
                const embErrMiembro = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(descripcionesP[p])
                .setColor(ColorError)
                .setFooter("Permiso requerido: Banear miembros")
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)
            }
        }

        if(!cooldowns.has("ban")){
            cooldowns.set("ban", new Discord.Collection())
        }

        const tiempoActual = Date.now()
        const datosComando = cooldowns.get("ban")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
            console.log(tiempoUltimo - tiempoActual)

            const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
            const embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando ban")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setAuthor(`${emojis.lupa} Comanod ban`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}ban <Mencion del miembro> <Razón>\`\`\n\`\`${prefijo}ban <ID del miembro o usuario externo> <Razón>\`\`\n\`\`${prefijo}ban <Etiqueta del miembro> <Razón>\`\``},
            {name: "Ejemplo:", value: `${prefijo}ban ${msg.author} Publicar URLs maliciosas.\n${prefijo}ban ${msg.author.id} Romper múltiples reglas en el servidor.\n${prefijo}ban ${msg.author.tag} Incumplimiento del ToS de Discord`},
            {name: "Alias: **2**", value: `\`\`ban\`\`, \`\`prohibir\`\``},
            {name: "Descripción:", value: `Expulsa al miembro del servidor y le prohive la entrada al servidor.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag === args[0])
        let razon = args.slice(1).join(" ")

        if(miembro){
            if(msg.author.id === msg.guild.ownerId){
                let descripcionesB = [`¿Por que me quieres banear de este increíble servidor?, no puedo realizar esa acción.`,`¿Por que te quieres banear de tu propio servidor?, no puedo realizar esa acción.`]
                let condicionalesB = [miembro.id === client.user.id, miembro.id === msg.author.id]

                for(let i=0; i<descripcionesB.length; i++){
                    if(condicionalesB[i]){
                        const embErr = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripcionesB[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                if(miembro.user.bot){
                    let descripcionesB = [`El bot proporcionado tiene un rol igual o mayor al mío por lo tanto no lo puedo banear del servidor.`, `No has proporcionado la razón por la que banearas al bot, proporciona una razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionalesB = [msg.guild.me.roles.highest.comparePositionTo(miembro.roles.highest)<=0, !razon, razon.length > 1000]

                    for(let o=0; o<descripcionesB.length; o++){
                        if(condicionalesB[o]){
                            const embErrMiembro = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesB[o])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embBaneo = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                    .setTitle("⛔ Bot baneado")
                    .setDescription(`🤖 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#ff0000")
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    miembro.ban({reason: `Razón: ${razon} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`}).then(ban=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBaneo]})
                        }, 500)
                    })
    
                }else{
                    let descripcionesU = [`El miembro proporcionado tiene un rol igual o mayor al mío por lo tanto no lo puedo banear del servidor.`, `No has proporcionado la razón por la que banearas al miembro, proporciona una razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionalesU = [msg.guild.me.roles.highest.comparePositionTo(miembro.roles.highest)<=0, !razon, razon.length > 1000]

                    for(let o=0; o<descripcionesU.length; o++){
                        if(condicionalesU[o]){
                            const embErrMiembro = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesU[o])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embBaneo = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                    .setTitle("⛔ Miembro baneado")
                    .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#ff0000")
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
    
                    const embMeMD = new Discord.MessageEmbed()
                    .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                    .setTitle("⛔ Has sido baneado")
                    .setDescription(`📝 **Por la razón:** ${razon}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:** ${msg.author.id}`)
                    .setColor("#ff0000")
                    .setFooter(`Del servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    miembro.ban({reason: `Razón: ${razon} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`}).then(ban=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBaneo]})
                        }, 500)
                        miembro.send({embeds: [embMeMD]}).catch(c=>{
                            return;
                        })
                    })

                    if(dataHis.usuarios.some(s=> s.id === miembro.id)){
                        let posicion
                        for(let i=0; i<dataHis.usuarios.length; i++){
                            if(dataHis.usuarios[i].id === miembro.id){
                                posicion = i
                            }
                        }
    
                        if(dataHis.usuarios[posicion].servidores.some(s=> s.id === msg.guildId)){
                            let guiPosicion 
                            for(let g=0; g<dataHis.usuarios[posicion].servidores.length; g++){
                                if(dataHis.usuarios[posicion].servidores[g].id === msg.guildId){
                                    guiPosicion = g
                                }
                            }
    
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores[guiPosicion].baneos.push({autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon})
    
                            dataHis.usuarios[posicion] = momentaneaDB
                        }else{
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores.push({id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [], baneos: [{autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon}]})
                            dataHis.usuarios[posicion] = momentaneaDB
                        }
                    }else{
                        dataHis.usuarios.push({id: miembro.id, tag: miembro.user.tag, servidores: [{id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [], baneos: [{autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon}]}]})
                    }

                    let adv = dataHis.sanciones.advertencias
                    let ais = dataHis.sanciones.aislamientos
                    let exp = dataHis.sanciones.expulsiones
                    let ban = dataHis.sanciones.baneos
                    dataHis.sanciones = {advertencias: adv, aislamientos: ais, expulsiones: exp, baneos: ban+1}
                    await dataHis.save()
                }
            }else{
                let descripcionesB = [`¿Por que me quieres banear de este increíble servidor?, no puedo realizar esa acción.`, `¿Por que te quieres banear de este increíble servidor?, no puedo realizar esa acción.`]
                let condicionalesB = [miembro.id === client.user.id, miembro.id === msg.author.id]

                for(let i=0; i<descripcionesB.length; i++){
                    if(condicionalesB[i]){
                        const embErr = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripcionesB[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                if(miembro.user.bot){
                    let descripcionesBb = [`El bot proporcionado tiene un rol igual o mayor al mío por lo tanto no lo puedo banear del servidor.`, `No puedes banear a un bot con el mismo rol o mayor que tu.`, `No has proporcionado la razón por que banearas a ese bot, proporciona una razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionalesBb = [msg.guild.me.roles.highest.comparePositionTo(miembro.roles.highest)<=0, msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<=0, !razon, razon.length > 1000]

                    for(let i=0; i<descripcionesBb.length; i++){
                        if(condicionalesBb[i]){
                            const embErr = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesBb[i])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embBaneo = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                    .setTitle("⛔ Bot baneado")
                    .setDescription(`🤖 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#ff0000")
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    miembro.ban({reason: `Razón: ${razon} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`}).then(ban=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBaneo]})
                    })
                }else{
                    let descripcionesBb = [`El miembro proporcionado es el dueño del servidor, nadie puede banear el dueño del servidor.`, `El miembro proporcionado tiene un rol igual o mayor al mío por lo tanto no lo puedo banear del servidor.`, `El miembro propocionado tiene un rol igual o mayor al tuyo por lo tanto no lo puedes banear del servidor.`, `No has proporcionado la razón por que banearas al miembro, proporciona una razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionalesBb = [miembro.id === msg.guild.ownerId, msg.guild.me.roles.highest.comparePositionTo(miembro.roles.highest)<=0, msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<=0, !razon, razon.length > 1000]

                    for(let i=0; i<descripcionesBb.length; i++){
                        if(condicionalesBb[i]){
                            const embErr = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesBb[i])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embBaneo = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                    .setTitle("⛔ Miembro baneado")
                    .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#ff0000")
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
    
                    const embMeMD = new Discord.MessageEmbed()
                    .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                    .setTitle("⛔ Has sido baneado")
                    .setDescription(`📝 **Por la razón:** ${razon}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:** ${msg.author.id}`)
                    .setColor("#ff0000")
                    .setFooter(`Del servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    // miembro.ban({reason: `Razón: ${razon} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`}).then(ban=>{
                    //     setTimeout(()=>{
                    //         msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBaneo]})
                    //     }, 500)
                    //     miembro.send({embeds: [embMeMD]}).catch(c=>{
                    //         return;
                    //     })
                    // })

                    if(dataHis.usuarios.some(s=> s.id === miembro.id)){
                        let posicion
                        for(let i=0; i<dataHis.usuarios.length; i++){
                            if(dataHis.usuarios[i].id === miembro.id){
                                posicion = i
                            }
                        }
    
                        if(dataHis.usuarios[posicion].servidores.some(s=> s.id === msg.guildId)){
                            let guiPosicion 
                            for(let g=0; g<dataHis.usuarios[posicion].servidores.length; g++){
                                if(dataHis.usuarios[posicion].servidores[g].id === msg.guildId){
                                    guiPosicion = g
                                }
                            }
    
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores[guiPosicion].baneos.push({autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon})
    
                            dataHis.usuarios[posicion] = momentaneaDB
                        }else{
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores.push({id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [], baneos: [{autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon}]})
                            dataHis.usuarios[posicion] = momentaneaDB
                        }
                    }else{
                        dataHis.usuarios.push({id: miembro.id, tag: miembro.user.tag, servidores: [{id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [], baneos: [{autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon}]}]})
                    }

                    let adv = dataHis.sanciones.advertencias
                    let ais = dataHis.sanciones.aislamientos
                    let exp = dataHis.sanciones.expulsiones
                    let ban = dataHis.sanciones.baneos
                    dataHis.sanciones = {advertencias: adv, aislamientos: ais, expulsiones: exp, baneos: ban+1}
                    await dataHis.save()
                
                }
            }
        }else{
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención o etiqueta del miembro que quieres banear o la ID del usuario externo a banear.`, `El argumento proporcionado *(${args[0]})* tiene las caracteristicas de una **ID**, es numérico, contiene **18** caracteres pero no coresponde con la **ID** de ningun miembro del servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0]), args[0].length == 18]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            await client.users.fetch(args[0], {force: true}).then(async usuario=>{
                if(usuario.bot){
                    let descripcionesBb = [`El bot proporcionado ya esta baneado en este servidor.`, `No has proporcionado la razón por la que banearas a ese bot externo, proporciona una razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionalesBb = [(await msg.guild.bans.fetch()).find(f=> f.user.id === usuario.id), !razon, razon.length > 1000]

                    for(let i=0; i<descripcionesBb.length; i++){
                        if(condicionalesBb[i]){
                            const embErr = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesBb[i])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embBaneo = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(usuario.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                    .setTitle("⛔ Bot externo baneado")
                    .setDescription(`🤖 ${usuario.tag}\n${usuario.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#ff0000")
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    msg.guild.members.ban(usuario.id, {reason: `Razón: ${razon} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`}).then(ban=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBaneo]})
                    })
                }else{
                    let descripcionesBb = [`El usuario proporcionado ya esta baneado en este servidor.`, `No has proporcionado la razón por la que banearas a ese usuario externo, proporciona una razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionalesBb = [(await msg.guild.bans.fetch()).find(f=> f.user.id === usuario.id), !razon, razon.length > 1000]

                    for(let i=0; i<descripcionesBb.length; i++){
                        if(condicionalesBb[i]){
                            const embErr = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesBb[i])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embBaneo = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(usuario.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
                    .setTitle("⛔ Usuario externo baneado")
                    .setDescription(`👤 ${usuario.tag}\n${usuario.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                    .setColor("#ff0000")
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
    
                    msg.guild.members.ban(usuario.id, {reason: `Razón: ${razon} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`}).then(ban=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBaneo]})
                        }, 500)
                    })
                
                    if(dataHis.usuarios.some(s=> s.id === usuario.id)){
                        let posicion
                        for(let i=0; i<dataHis.usuarios.length; i++){
                            if(dataHis.usuarios[i].id === usuario.id){
                                posicion = i
                            }
                        }
    
                        if(dataHis.usuarios[posicion].servidores.some(s=> s.id === msg.guildId)){
                            let guiPosicion 
                            for(let g=0; g<dataHis.usuarios[posicion].servidores.length; g++){
                                if(dataHis.usuarios[posicion].servidores[g].id === msg.guildId){
                                    guiPosicion = g
                                }
                            }
    
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores[guiPosicion].baneos.push({autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon})
    
                            dataHis.usuarios[posicion] = momentaneaDB
                        }else{
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores.push({id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [], baneos: [{autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon}]})
                            dataHis.usuarios[posicion] = momentaneaDB
                        }
                    }else{
                        dataHis.usuarios.push({id: usuario.id, tag: usuario.tag, servidores: [{id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [], baneos: [{autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon}]}]})
                    }

                    let adv = dataHis.sanciones.advertencias
                    let ais = dataHis.sanciones.aislamientos
                    let exp = dataHis.sanciones.expulsiones
                    let ban = dataHis.sanciones.baneos
                    dataHis.sanciones = {advertencias: adv, aislamientos: ais, expulsiones: exp, baneos: ban+1}
                    await dataHis.save()
                }
            }).catch(c=>{
                const embErrU1 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`El argumento proporcionado (${args[0]}) no es una ID valida aun que este conformado por 18 caracteres numericos no coresponde con la de ningun usuario de Discord.`)
                .setColor(ColorError)
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrU1]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)
            })
        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "unban"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let condicionalesP = [!msg.member.permissions.has("BAN_MEMBERS"), !msg.guild.me.permissions.has("BAN_MEMBERS")]
        let descripcionesP = [`No tienes los permisos suficientes para ejecutar el comando.`, `No tengo los permisos suficientes para ejecutar el comando.`]
        for(let p=0; p<descripcionesP.length; p++){
            if(condicionalesP[p]){
                const embErrMiembro = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(descripcionesP[p])
                .setColor(ColorError)
                .setFooter("Permiso requerido: Banear miembros")
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)
            }
        }

        const embErrP3 = new Discord.MessageEmbed()
        .setTitle("📄")
        .setDescription(`No se ha encontrado ningún miembro baneado en este servidor.`)
        .setColor(colorEmbInfo)
        .setTimestamp()
        if((await msg.guild.bans.fetch()).size === 0) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP3]}).then(tm => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                tm.delete().catch(e=>{
                    return;
                })
            }, 30000))
        }, 500)

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando unban`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}unban <ID del usuario baneado>\`\``},
            {name: "Ejemplo:", value: `${prefijo}unban ${(await msg.guild.bans.fetch()).map(mb => mb.user.id).slice(0,1)}`},
            {name: "Alias:", value: `\`\`unban\`\``},
            {name: "Descripción:", value: `Expulsa al miembro del servidor y le prohive la entrada al servidor.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)


        let descripciones = [`El argumento proporcionado (${args}) no es una ID de un usuario ya que contiene caracteres no numericos, una ID solo esta formada por caracteres numericos.`, `El argumento numérico  ingresado *(${args})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`]
        let condicionales = [isNaN(args), !isNaN(args) && args[0].length < 18, !isNaN(args) && args[0].length > 18]


        for(let i=0; i<descripciones.length; i++){
            if(condicionales[i]){
                const embErr = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(descripciones[i])
                .setColor(ColorError)
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)
            }
        }

        if(msg.guild.members.cache.get(args)){
            let descripcionesM = [`La ID proporcionada es mía, yo no estoy baneado.`, `La ID proporcionada es tuya y tu eres el dueño del servidor, claramente no estas baneado.`, `La ID proporcionada es tuya, claramente no estas baneado.`, `La ID proporcionada es del dueño/a del servidor, es imposible que este baneado/a de su propio servidor`, `La ID proporcionada es de <@${msg.guild.members.cache.get(args).id}> un bot del servidor que no esta baneado.`, `La ID proporcionada es de <@${msg.guild.members.cache.get(args).id}> un miembro del servidor que no esta baneado.`]
            let condicionalesM = [args === client.user.id, args === msg.author.id && msg.author.id === msg.guild.ownerId, args === msg.author.id, !msg.author.id === msg.guild.ownerId && args === msg.guild.ownerId, msg.guild.members.cache.get(args).user.bot, !msg.guild.members.cache.get(args).user.bot] 


            for(let i=0; i<descripcionesM.length; i++){
                if(condicionalesM[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripcionesM[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }else{
            await client.users.fetch(args[0], {force: true}).then(async usuario=>{
                if(usuario.bot){
                    const embErrU1 = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`La ID proporcionada es de un bot el cual no esta baneado en el servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!(await msg.guild.bans.fetch()).find(fb => fb.user.id === usuario.id)) return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrU1]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)

                    const embUban = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(usuario.displayAvatarURL({dynamic: true}))
                    .setTitle("<a:afirmativo:856966728806432778> Bot des baneado")
                    .setDescription(`🤖 ${usuario.tag}\n${usuario.id}\n\n👮 **Por el moderador:**\n${msg.author}\n${msg.author.id}`)
                    .setColor("GREEN")
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    msg.guild.members.unban(usuario.id).then(un=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUban]})
                        }, 500)
                    }) 
                }else{
                    const embErrU1 = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`La ID proporcionada es de un usuario el cual no esta baneado en el servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!(await msg.guild.bans.fetch()).find(fb => fb.user.id === usuario.id)) return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrU1]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)

                    const embUban = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(usuario.displayAvatarURL({dynamic: true}))
                    .setTitle("<a:afirmativo:856966728806432778> Usuario des baneado")
                    .setDescription(`👤 ${usuario.tag}\n${usuario.id}\n\n👮 **Por el moderador:**\n${msg.author}\n${msg.author.id}`)
                    .setColor("GREEN")
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    msg.guild.members.unban(usuario.id).then(un=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUban]})
                        }, 500)
                    }) 
                }
            }).catch(c=>{
                const embErrU1 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`El argumento proporcionado (${args}) no es una **ID** valida aun que este conformado por **18** caracteres numericos no coresponde con la de ningun usuario de Discord.`)
                .setColor(ColorError)
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrU1]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)
            })
        }
    }

    if(comando == "clear" || comando == "cl" || comando == "delete" || comando == "eliminar"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let condicionalesP = [!msg.member.permissions.has("MANAGE_MESSAGES"), !msg.guild.me.permissions.has("MANAGE_MESSAGES")]
        let descripcionesP = [`No tienes los permisos suficientes para ejecutar el comando.`, `No tengo los permisos suficientes para ejecutar el comando.`]
        for(let c=0; c<descripcionesP.length; c++){
            if(condicionalesP[c]){
                const embErrMiembro = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(descripcionesP[c])
                .setColor(ColorError)
                .setFooter("Permiso requerido: Gestionar mensajes")
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)
            }
        }

        if(!cooldowns.has("clear")){
            cooldowns.set("clear", new Discord.Collection())
        }

        const tiempoActual = Date.now()
        const datosComando = cooldowns.get("clear")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
            console.log(tiempoUltimo - tiempoActual)

            const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
            const embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando clear")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando clear`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}clear <Cantidad de emensajes>\`\`\n\`\`${prefijo}clear <Mencion del miembro> <Cantidad de emensajes>\`\`\n\`\`${prefijo}clear <ID del miembro> <Cantidad de emensajes>\`\``},
            {name: "Ejemplos: **3**", value: `${prefijo}clear ${Math.floor(Math.random(1)*100)}\n${prefijo}clear ${msg.author} ${Math.floor(Math.random(1)*100)}\n${prefijo}clear ${msg.author.id} ${Math.floor(Math.random(1)*100)}`},
            {name: "Alias: **4**", value: `\`\`clear\`\`, \`\`cl\`\`, \`\`delete\`\`, \`\`eliminar\`\``},
            {name: "Descripción:", value: `Elimina varios mensajes de un canal a la vez y elimina varios mensajes de un usuario en un canal a la vez.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag === args.join(" "))

        if(miembro){
            let condicionalesCM = [!args[1], isNaN(args[1]), args[1] <= 1, args[1] > 100]
            let descripcionesCM = [`No has proporcionado la cantidad de mensajes del miembro a eliminar.`, `Has proporcionado un valor no numérico, introduce un valor numérico.`, `Has proporcionado una cantidad menor o igual a **1**, proporciona una cantidad mayor a **1** de mensajes a eliminar.`, `Has proporcionado una cantidad mayor a **100**, el máximo de mensajes que puedo eliminar es de **100**, proporciona una cantidad igual o menor a **100**.`]
            for(let c=0; c<descripcionesCM.length; c++){
                if(condicionalesCM[c]){
                    const embErrMiembro = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripcionesCM[c])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            msg.delete()
            let cantidad = 0
            for(let c=0; c<args[1]; c++){
                let mensajes = await msg.channel.messages.fetch({limit: 100})
                let filtro = mensajes.filter(f=> Date.now() - f.createdTimestamp < ms("14d") && f.author.id === miembro.id).map(c=>c).slice(0,Number(args[1]))

                cantidad += filtro.length

                const embClear = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("🗑 Mensajes eliminados del miembro")
                .setDescription(`${msg.author} ha eliminado **${filtro.length}** mensajes del miembro ${miembro}.`)
                .setColor(colorEmb)

                await msg.channel.bulkDelete(filtro).then(s=>{
                    if(cantidad >= args[1]){
                        setTimeout(()=>{
                            msg.channel.send({embeds: [embClear]}).then(tm => setTimeout(()=>{
                                tm.delete().catch(e=>{
                                    return;
                                })
                            },20000))
                        },800)
                    }
                })
            }
        }else{

            let condicionalesC = [isNaN(args[0]), args[0] <= 2, args[0] > 100]
            let descripcionesC = [`Has introducido un valor no numérico, introduce un valor numérico.`, `Introduce un valor mayor a 1`, `Has introducido un valor mayor a 100, el máximo de mensajes que puedo eliminar es de 100, introduce un valor igual o menor a 100.`]
            for(let c=0; c<descripcionesC.length; c++){
                if(condicionalesC[c]){
                    const embErrMiembro = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripcionesC[c])
                    .setColor(ColorError)
                    .setFooter("Permiso requerido: Gestionar mensajes")
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            msg.delete().catch(c=>{
                console.log("Error")
            })
            if(Number(args[0]) === 100){
                let mensajes = await msg.channel.messages.fetch({limit: 100})
                const filtro = mensajes.filter(mmm=> Date.now() - mmm.createdTimestamp < ms("14d"))
                console.log(filtro)
                await msg.channel.bulkDelete(filtro)

                const embClear = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("🗑 Mensajes eliminados")
                .setDescription(`${msg.author} ha eliminado **${filtro.size}** mensajes.`)
                .setColor(colorEmb)

                setTimeout(()=>{
                    msg.channel.send({embeds: [embClear]}).then(tm => setTimeout(()=>{
                        tm.delete().catch(e=>{
                            return;
                        })
                    },20000))
                },800)
            }else{
                let mensajes = await msg.channel.messages.fetch({limit: Math.floor(Number(args[0]))})
                const filtro = mensajes.filter(mmm=> Date.now() - mmm.createdTimestamp < ms("14d"))
                console.log(filtro)
                await msg.channel.bulkDelete(filtro)

                const embClear = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("🗑 Mensajes eliminados")
                .setDescription(`${msg.author} ha eliminado **${filtro.size - 1}** mensajes.`)
                .setColor(colorEmb)

                setTimeout(()=>{
                    msg.channel.send({embeds: [embClear]}).then(tm => setTimeout(()=>{
                        tm.delete().catch(e=>{
                            return;
                        })
                    },20000))
                },800)
            }
        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "banlist" || comando == "blist"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Banear miembros.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("BAN_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            tm.delete().catch(e=>{
                return;
            })
        }, 30000))

        const embErrP2 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Banear miembros.")
        .setTimestamp()
        if(!msg.member.permissions.has("BAN_MEMBERS")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                tm.delete().catch(e=>{
                    return;
                })
            }, 30000))
        }, 500)

        let gb = await msg.guild.bans.fetch()

        const embBans0 = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("🧾 Miembros baneados")
        .setDescription(`*No hay miembros baneados en este servidor.*`)
        .setColor(msg.guild.me.displayHexColor)
        .setTimestamp()
        if(gb.size <= 0) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBans0]})
        }, 500)

        if(gb.size <= 10){
            const embBanlist10 = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("🧾 Miembros baneados")
            .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m=>m).map((bm, i) => `**${i+1}. [${bm.user.tag}](${bm.user.displayAvatarURL({dynamic: true})})**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}`).join("\n\n")}`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBanlist10]})

        }else{
            let segPage
            if(String(gb.size).slice(-1) === "0"){
                segPage = Math.floor(gb.size / 10)
            }else{
                segPage = Math.floor(gb.size / 10 + 1)
            }

            let ba1 = 0, ba2 = 10, pagina = 1

            const embBanlist = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("🧾 Miembros baneados")
            .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m=>m).map((bm, i) => `**${i+1}. [${bm.user.tag}](${bm.user.displayAvatarURL({dynamic: true})})**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}`).slice(ba1,ba2).join("\n\n")}`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            
            const botones1 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("SECONDARY")
                    .setDisabled(true)
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente ")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("PRIMARY")
                ]
            )

            const botones2 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("PRIMARY")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("PRIMARY")
                ]
            )

            const botones3 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("PRIMARY")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("SECONDARY")
                    .setDisabled(true)
                ]
            )

            setTimeout(async ()=> {
                const mensajeSend = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBanlist], components: [botones1]})
                const filtro = i=> i.user.id === msg.author.id;
                const colector = mensajeSend.createMessageComponentCollector({filter: filtro, time: segPage * 60000})

                setTimeout(()=>{
                    mensajeSend.edit({embeds: [embBanlist], components: []})
                }, segPage * 60000)
    
                colector.on("collect", async botn => {
                    if(botn.customId === "1"){
                        if(ba2 - 10 <= 10){
                            ba1-=10, ba2-=10, pagina--
    
                            embBanlist
                            .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m=>m).map((bm, i) => `**${i+1}. [${bm.user.tag}](${bm.user.displayAvatarURL({dynamic: true})})**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}`).slice(ba1,ba2).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            return await botn.update({embeds: [embBanlist], components: [botones1]})
                        }
                        ba1-=10, ba2-=10, pagina--
    
                        embBanlist
                        .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m=>m).map((bm, i) => `**${i+1}. [${bm.user.tag}](${bm.user.displayAvatarURL({dynamic: true})})**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}`).slice(ba1,ba2).join("\n\n")}`)
                        .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                        await botn.update({embeds: [embBanlist], components: [botones2]})
                    }
                    if(botn.customId === "2"){
                        if(ba2 + 10 >= gb.size){
                            ba1+=10, ba2+=10, pagina++
    
                            embBanlist
                            .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m=>m).map((bm, i) => `**${i+1}. [${bm.user.tag}](${bm.user.displayAvatarURL({dynamic: true})})**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}`).slice(ba1,ba2).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            return await botn.update({embeds: [embBanlist], components: [botones3]})
                        }
                        ba1+=10, ba2+=10, pagina++
    
                        embBanlist
                        .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m=>m).map((bm, i) => `**${i+1}. [${bm.user.tag}](${bm.user.displayAvatarURL({dynamic: true})})**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}`).slice(ba1,ba2).join("\n\n")}`)
                        .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                        return await botn.update({embeds: [embBanlist], components: [botones2]})
                    }
                })                
            })
        }
    }

    if(comando == "dmsend" || comando == "dm" || comando == "md" && msg.author.id == creadorID){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Gestionar mensajes, Expulsar miembros o Banear miembros")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_MESSAGES") || !msg.member.permissions.has("KICK_MEMBERS") || !msg.member.permissions.has("BAN_MEMBERS")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(dt => setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                dt.delete().catch(e=>{
                    return;
                })
            }, 30000));
        })

        if(!cooldowns.has("dmsend")){
            cooldowns.set("dmsend", new Discord.Collection())
        }

        const tiempoActual = Date.now()
        const datosComando = cooldowns.get("dmsend")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
            console.log(tiempoUltimo - tiempoActual)

            const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
            const embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando dmsend")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando dmsend")
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}dmsend <Mencion del miembro> <Mensaje>\`\`\n\`\`${prefijo}dmsend <ID del miembro> <Mensaje>\`\`\n\`\`${prefijo}dmsend <Etiqueta del miembro> <Mensaje>\`\``},
            {name: "Ejemplos: **3**", value: `${prefijo}dmsend ${msg.author} Mensaje a enviar.\n${prefijo}dmsend ${msg.author.id} Mensaje a enviar.\n${prefijo}dmsend ${msg.author.tag} Mensaje a enviar`},
            {name: "Alias: **3**", value: `\`\`dmsend\`\`, \`\`dm\`\`, \`\`md\`\``},
            {name: "Descripción:", value: `Envía aun mensaje por medio del bot a un miembro del servidor.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag === args[0])
        let mensaje = args.slice(1).join(" ")

        if(!miembro){
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }

        if(miembro){
            const embErr1 = new Discord.MessageEmbed()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`No pude enviar el mensaje directo al miembro, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
            .setColor(ColorError)
            .setTimestamp()

            let condicionalesD = [miembro.id === client.user.id, miembro.id === msg.author.id, miembro.user.bot, !mensaje]
            let descripcionesD = [`El miembro proporcionado soy yo, ¿Por que me quieres enviar un mensaje?, de nada serviría, no puedo realizar la acción.`, `El miembro proporcionado eres tu, ¿Para que quieres que te envié un mensaje creado por ti?, no puedo realizar esa acción.`, `El miembro proporcionado es un bot, no puedo enviar un mensaje directo a un bot.`, `No has proporcionado el mensaje a enviar, proporciona el mensaje a enviarle al miembro.`]
            for(let c=0; c<descripcionesD.length; c++){
                if(condicionalesD[c]){
                    const embErrMiembro = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripcionesD[c])
                    .setColor(ColorError)
                    .setFooter("Permiso requerido: Gestionar mensajes")
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrMiembro]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            const emdSendDM = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setThumbnail(miembro.user.displayAvatarURL({dynamic: true}))
            .setTitle("📤 Mensaje enviado al miembro")
            .setDescription(`👤 ${miembro}\n**ID:** ${miembro.id}\n\n📝 **Mensaje:** ${mensaje}\n\n👮 **Enviado por:** ${msg.author}\n**ID:** ${msg.author.id}`)
            .setColor(colorEmb)
            .setFooter(miembro.user.tag,miembro.displayAvatarURL({dynamic: true}))
            .setTimestamp()
        
            const embMDSend = new Discord.MessageEmbed()
            .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
            .setTitle("📥 Mensaje entrante")
            .setDescription(`📝 **Mensaje:** ${mensaje}\n\n👮 **Enviado por:** ${msg.author.tag}\n**ID:** ${msg.author.id}`)
            .setColor(colorEmb)
            .setFooter(`Desde el servidor: ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            miembro.send({embeds: [embMDSend]}).then(tm =>{
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [emdSendDM]})
                }, 500)
            }).catch(t=>{
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete().catch(t=>{
                            return;
                        })
                    }, 30000))
                })
            })
        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }
    


    // 💎 Comandos de administracion
    if(comando == "setprefix"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let dataPre = await mPrefix.findOne({_id: client.user.id})
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando, solo un administrador del servidor puede ejecutar el comando.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("setprefix")){
            cooldowns.set("setprefix", new Discord.Collection())
        }

        const tiempoActual = Date.now(), datosComando = cooldowns.get("setprefix")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 4*60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *setprefix*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando setPrefix`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}setprefix <Nuevo prefijo>\`\``},
            {name: "Ejemplo:", value: `${prefijo}setprefix u/`},
            {name: "Alias:", value: `\`\`setprefix\`\``},
            {name: "Descripción:", value: `Establece un prefijo personalizado para el servidor.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false},embeds: [embInfo]})
        }, 500)


        const embErrP2 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No puedes establecer un emoji como prefijo.`)
        .setColor(ColorError)
        .setTimestamp()
        if(/\p{Emoji}/gu.test(args[0])) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },30000))
        }, 500)

        const embErrP3 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No puedes establecer un prefijo con mas de **3** caracteres.`)
        .setColor(ColorError)
        .setTimestamp()
        if(args[0].length > 3) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP3]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            },30000))
        }, 500)


        if(!dataPre.servidores.some(s=> s.id === msg.guildId)){
            dataPre.servidores.push({nombre: msg.guild.name, id: msg.guildId, prefijo: args[0]})

            const embPrefix = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("⚙️ Prefijo cambiado")
            .setDescription(`Nuevo prefijo: \`\`${args[0]}\`\``)
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPrefix]})
            }, 500)
            await dataPre.save()
        }else{
            let posicion
            for(let p=0; p<dataPre.servidores.length; p++){
                if(dataPre.servidores[p].id === msg.guildId){
                    posicion = p
                }
            }

            const embErr2 = new Discord.MessageEmbed()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`El nuevo prefijo que has proporcionado *(${args[0]})* es el mismo prefijo que el actual.`)
            .setColor("RED")
            .setTimestamp()
            if(dataPre.servidores[posicion].prefijo === args[0]) return setTimeout(()=>{
                msg.reply({allowedMentions: { repliedUser: false}, embeds: [embErr2]}).then(tm=> setTimeout(()=>{
                    msg.delete().catch(t=> {
                        return;
                    })
                    tm.delete().catch(t=> {
                        return;
                    })
                }, 30000))
            }, 500)

            dataPre.servidores[posicion] = {nombre: msg.guild.name, id: msg.guildId, prefijo: args[0]}

            const embPrefix = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("⚙️ Prefijo cambiado")
            .setDescription(`Nuevo prefijo: \`\`${args[0]}\`\``)
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPrefix]})
            }, 500)
            await dataPre.save()
        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 4*60000)
    }

    if(comando == "setslowmode" || comando == "setslow" || comando == "slowmode"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido:  Gestionar canales")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_CHANNELS")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        const embErrP2 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido: Gestionar canales")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_CHANNELS")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("setslowmode")){
            cooldowns.set("setslowmode", new Discord.Collection())
        }

        const tiempoActual = Date.now(), datosComando = cooldowns.get("setslowmode")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *setslowmode*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        let tiempos = ["10s","2m","30m","1h","6h","12h"]
        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando setSlowMode`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}setSlowMode <Mención del canal> <Tiempo a establecer el modo pausado>\`\`\n\`\`${prefijo}setSlowMode <ID del canal> <Tiempo a establecer el modo pausado>\`\``},
            {name: "Ejemplos:", value: `${prefijo}setSlowMode ${msg.channel} ${tiempos[Math.floor(Math.random()*tiempos.length)]}\n${prefijo}setSlowMode ${msg.channelId} ${tiempos[Math.floor(Math.random()*tiempos.length)]}`},
            {name: "Alias:", value: `\`\`setslowmode\`\`, \`\`setslow\`\`, \`\`slowmode\`\``},
            {name: "Descripción:", value: `Establece el tiempo del modo pausado de un canal de texto.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let canal = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0])

        if(canal){
            let descripciones = [`El canal proporcionado (${canal}) no es de tipo texto, el modo pausado solo se puede establecer en canales de tipo texto.`, `No has proporcionado el tiempo del modo pausado a establecer para el canal.`, `No solo ingreses números determina si son *segundos*, *minutos* o *horas* con \`\`s\`\` segundos, con \`\`m\`\` minutos, con \`\`h\`\` horas, al final del numero, ejemplo \`\`10s\`\`.`, `El tiempo del modo pausado de un canal no debe de superar las **6** horas, proporciona una cantidad menor.`, `No proporcionaste bien la cantidad de tiempo para el modo pausado del canal.`]
            let condicionales = [!canal.isText(), !args[1], !isNaN(args[1]), ms(args[1])/1000 >= 21600, !ms(args[1])]
            for(let d=0; d<descripciones.length; d++){
                if(condicionales[d]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[d])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(et=> setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            et.delete().catch(c=>{
                                return;
                            })
                        }, 30000))
                    }, 500)
                }
            }

            const embSlow = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("⏲ Modo pausado")
            .setDescription(`El modo pausado del canal ${canal} se ha establecido a **${args[1]}**.`)
            .setColor(msg.guild.me.displayHexColor)
            .setTimestamp()
            canal.setRateLimitPerUser(ms(args[1]) / 1000, `Modo pausado de ${args[1]} establecido en el canal por ${msg.author.tag}.`).then(tm=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embSlow]})
            }).catch(c=> console.log(c))
        }else{
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención o ID de un canal del servidor, proporciona una mención o ID valida de un canal.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }
        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "addrol" || comando == "addr"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let roles = msg.guild.roles.cache.filter(fr => !fr.managed && fr.id != msg.guildId).map(mr => mr)
        let random = Math.floor(Math.random()* roles.length)
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_ROLES")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        const embErrP2 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_ROLES")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("addrol")){
            cooldowns.set("addrol", new Discord.Collection())
        }

        const tiempoActual = Date.now(), datosComando = cooldowns.get("addrol")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *addrol*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando addrol`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}addrol <Mencion del miembro> <Mencion del rol>\`\`\n\`\`${prefijo}addrol <ID del miembro> <ID del rol>\`\`\n\`\`${prefijo}addrol <Mención o ID del rol> <palabra *all* o *todos*>\`\``},
            {name: "Ejemplos: ", value: `${prefijo}addrol ${msg.author} ${roles[random]}\n${prefijo}addrol ${msg.author} ${roles[random].id}\n${prefijo}addrol ${msg.author.id} ${roles[random].id}\n${prefijo}addrol ${msg.author.id} ${roles[random]}\n${prefijo}addrol ${roles[random]} all\n${prefijo}addrol todos ${roles[random].id}`},
            {name: "Alias: *2*", value: `\`\`addrol\`\`, \`\`addr\`\``},
            {name: "Descripción:", value: `Agrega un rol a solo un miembro o a todos los miembros del servidor.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false},embeds: [embInfo]})
        }, 500)

        let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0])|| msg.guild.roles.cache.get(args[1])
        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.get(args[1])


        if(rol){
            if(miembro){
                let descripciones = [`El rol proporcionado *(${rol})* es exclusivo para un bot, no se le puede agregar a ningún miembro.`, `El rol proporcionado *(${rol})* tiene una posición igual o mayor a la de mi rol mas alto por lo tanto no puedo agregar ese rol a ningún miembro.`, `El miembro proporcionado *(${miembro})* eres tu y ya tienes el rol ${rol}.`, `El miembro proporcionado *(${miembro})* ya tiene el rol ${rol}.`]
                let condicionales = [rol.managed, msg.guild.me.roles.highest.comparePositionTo(rol)<=0, miembro.id == msg.author.id && miembro.roles.cache.find(f=> f.id == rol.id), miembro.roles.cache.find(f=> f.id == rol.id)]
                for(let d in descripciones){
                    if(condicionales[d]){
                        const embErr = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[d])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(et=> setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                et.delete().catch(c=>{
                                    return;
                                })
                            }, 30000))
                        }, 500)
                    }
                }

                if(msg.author.id == msg.guild.ownerId){
                    if(miembro.id == msg.author.id){
                        const embRoladd = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`${emojis.acierto} Rol agregado al miembro`)
                        .setDescription(`Te he agregado el rol ${rol}.`)
                        .setColor("GREEN")
                        .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        miembro.roles.add(rol.id).then(() => setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRoladd]})
                        }, 500))
                    }else{
                        const embRoladd = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`${emojis.acierto} Rol agregado al miembro`)
                        .setDescription(`El rol ${rol} ha sido agregado al miembro ${miembro}.`)
                        .setColor("GREEN")
                        .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        miembro.roles.add(rol.id).then(() => setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRoladd]})
                        }, 500))
                    }

                }else{
                    if(miembro.id == msg.author.id){
                        const embError1 = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El rol proporcionado *(${rol})* tiene la un mayor posición de tu rol mas alto por lo tanto no te lo puedo agregar.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.member.roles.highest.comparePositionTo(rol)<=0) return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                et.delete().catch(c=>{
                                    return;
                                })
                            }, 30000))
                        }, 500)

                        const embRoladd = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`${emojis.acierto} Rol agregado al miembro`)
                        .setDescription(`Te he agregado el rol ${rol}.`)
                        .setColor("GREEN")
                        .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        miembro.roles.add(rol.id).then(() => setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRoladd]})
                        }, 500))
                    }else{
                        const embError1 = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El rol proporcionado *(${rol})* tiene la misma o mayor posición de tu rol mas alto por lo tanto no le puedes agregar el rol al miembro.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.member.roles.highest.comparePositionTo(rol)<=0) return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                et.delete().catch(c=>{
                                    return;
                                })
                            }, 30000))
                        }, 500)

                        const embRoladd = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`${emojis.acierto} Rol agregado al miembro`)
                        .setDescription(`El rol ${rol} ha sido agregado al miembro ${miembro}.`)
                        .setColor("GREEN")
                        .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        miembro.roles.add(rol.id).then(() => setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRoladd]})
                        }, 500))
                    }
                }

                datosComando.set(msg.author.id, tiempoActual);
                setTimeout(()=>{
                    datosComando.delete(msg.author.id)
                }, 60000)

            }else{
                if(args[0] && args[1]){
                    if(["all", "todos"].some(s=>s == args[0].toLowerCase()) || ["all", "todos"].some(s=>s == args[1].toLowerCase())){
                        let descripciones = [`El rol proporcionado *(${rol})* es exclusivo para un bot, no se le puede agregar a ningún miembro.`, `El rol proporcionado *(${rol})* tiene una posición igual o mayor a la de mi rol mas alto por lo tanto no puedo agregar ese rol a ningún miembro.`, `Ahora estoy agregando un rol a todos los miembros del servidor, no puedo agregar **2** o mas roles a todos los miembros a la vez.`]
                        let condicionales = [rol.managed, msg.guild.me.roles.highest.comparePositionTo(rol)<=0, botDB.servidor.some(s=>s.id == msg.guildId) && botDB.servidor.find(f=> f.id == msg.guildId).comandos.addrol]
                        for(let d in descripciones){
                            if(condicionales[d]){
                                const embErr = new Discord.MessageEmbed()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[d])
                                .setColor(ColorError)
                                .setTimestamp()
                                return setTimeout(()=>{
                                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(et=> setTimeout(()=>{
                                        msg.delete().catch(c=>{
                                            return;
                                        })
                                        et.delete().catch(c=>{
                                            return;
                                        })
                                    }, 30000))
                                }, 500)
                            }
                        }

                        if(msg.guild.ownerId == msg.author.id){
                            let noLoTienen = msg.guild.members.cache.filter(f=> !f.roles.cache.has(rol.id)).map(n=>n), siLoTienen = msg.guild.members.cache.filter(f=> f.roles.cache.has(rol.id)).map(s=>s), cantidad = 0, descripcion = ""

                            const embCargando = new Discord.MessageEmbed()
                            .setTitle(`<a:loading:958171113370828830> Agregando el rol a todos..`)
                            .setDescription(`Se esta agregando el rol ${rol} a todos lo miembros, tenga paciencia esto puede tardar aproximadamente ${ms(noLoTienen.length*1000)}.`)
                            .setColor(msg.guild.me.displayHexColor)
                            msg.reply({allowedMentions: { repliedUser: false}, embeds: [embCargando]}).then(tm=>{
                                if(botDB.servidor.some(s=> s.id == msg.guildId)){
                                    botDB.servidor.find(f=>f.id == msg.guildId).comandos.addrol = true
                                }else{
                                    botDB.servidor.push({id: msg.guildId, comandos: {addrol: true, removerol: false}})
                                }

                                let intervalo = setInterval(()=>{
                                    if(cantidad < noLoTienen.length){
                                        noLoTienen[cantidad].roles.add(rol.id)
                                        cantidad++
                                    }else{
                                        clearInterval(intervalo)
                                        if(siLoTienen.length > 0){
                                            descripcion = `He añadido el rol ${rol} a **${noLoTienen.length.toLocaleString()}** miembros y **${siLoTienen.length.toLocaleString()}** ya tenían el rol.`
                                        }else{
                                            descripcion = `He añadido el rol ${rol} a **${noLoTienen.length.toLocaleString()}** miembros.`
                                        }
                                        const embRoladd = new Discord.MessageEmbed()
                                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                                        .setTitle(`${emojis.acierto} Rol agregado a todos los miembros`)
                                        .setDescription(descripcion)
                                        .setColor("GREEN")
                                        .setTimestamp()
                                        tm.edit({embeds: [embRoladd]}).then(td=>{
                                            botDB.servidor.find(f=>f.id == msg.guildId).comandos.addrol = false
                                        })

                                        datosComando.set(msg.author.id, tiempoActual);
                                        setTimeout(()=>{
                                            datosComando.delete(msg.author.id)
                                        }, 60000)
                                    }
                                }, 1000)
                            })
                        }else{
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El rol proporcionado *(${rol})* tiene la misma o mayor posición de tu rol mas alto por lo tanto no lo puedes agregar a ningún miembro. `)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(msg.member.roles.highest.comparePositionTo(rol)<=0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    et.delete().catch(c=>{
                                        return;
                                    })
                                }, 30000))
                            }, 500)

                            let noLoTienen = msg.guild.members.cache.filter(f=> !f.roles.cache.has(rol.id)).map(n=>n), siLoTienen = msg.guild.members.cache.filter(f=> f.roles.cache.has(rol.id)).map(s=>s), cantidad = 0, descripcion = ""

                            const embCargando = new Discord.MessageEmbed()
                            .setTitle(`<a:loading:958171113370828830> Agregando el rol a todos..`)
                            .setDescription(`Se esta agregando el rol ${rol} a todos los miembros, tenga paciencia esto puede tardar aproximadamente ${ms(noLoTienen.length*1000)}.`)
                            .setColor(msg.guild.me.displayHexColor)
                            msg.reply({allowedMentions: { repliedUser: false}, embeds: [embCargando]}).then(tm=>{
                                if(botDB.servidor.some(s=> s.id == msg.guildId)){
                                    botDB.servidor.find(f=>f.id == msg.guildId).comandos.addrol = true
                                }else{
                                    botDB.servidor.push({id: msg.guildId, comandos: {addrol: true, removerol: false}})
                                }

                                let intervalo = setInterval(()=>{
                                    if(cantidad < noLoTienen.length){
                                        noLoTienen[cantidad].roles.add(rol.id)
                                        cantidad++
                                    }else{
                                        clearInterval(intervalo)
                                        if(siLoTienen.length > 0){
                                            descripcion = `He añadido el rol ${rol} a **${noLoTienen.length.toLocaleString()}** miembros y **${siLoTienen.length.toLocaleString()}** ya tenían el rol.`
                                        }else{
                                            descripcion = `He añadido el rol ${rol} a **${noLoTienen.length.toLocaleString()}** miembros.`
                                        }
                                        const embRoladd = new Discord.MessageEmbed()
                                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                                        .setTitle(`${emojis.acierto} Rol agregado a todos los miembros`)
                                        .setDescription(descripcion)
                                        .setColor("GREEN")
                                        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                                        .setTimestamp()
                                        tm.edit({embeds: [embRoladd]}).then(td=>{
                                            botDB.servidor.find(f=>f.id == msg.guildId).comandos.addrol = false
                                        })

                                        datosComando.set(msg.author.id, tiempoActual);
                                        setTimeout(()=>{
                                            datosComando.delete(msg.author.id)
                                        }, 60000)
                                    }
                                }, 1000)
                            })
                        }

                    }else{
                        let descripciones = [`El primer argumento proporcionado *(${args[0]})* no es una **mención** o **ID** de un miembro del servidor ni es la palabra *all* o *todos*, proporciona una **mención** o **ID** de un miembro en caso de que quieras agregar el rol ${rol} a un miembro, en caso de querer agregar el rol ${rol} a todos los miembros del servidor proporciona la palabra *all* o *todos*.`, `El segundo argumento proporcionado *(${args[1]})* no es una **mención** o **ID** de un miembro del servidor ni es la palabra *all* o *todos*, proporciona una **mención** o **ID** de un miembro en caso de que quieras agregar el rol ${rol} a un miembro, en caso de querer agregar el rol ${rol} a todos lo miembros del servidor proporciona la palabra *all* o *todos*.`]
                        let condicionales = [!isNaN(args[0]) && args[0].length != 18 || isNaN(args[0]) && !["@","&","<",">"].some(s=> args[0].includes(s)), !isNaN(args[1]) && args[1].length != 18 || isNaN(args[1]) && !["@","&","<",">"].some(s=> args[1].includes(s))]
                        for(let d in descripciones){
                            if(condicionales[d]){
                                const embError = new Discord.MessageEmbed()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[d])
                                .setColor(ColorError)
                                .setTimestamp()
                                return setTimeout(()=>{
                                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError]}).then(et=> setTimeout(()=>{
                                        msg.delete().catch(c=>{
                                            return;
                                        })
                                        et.delete().catch(c=>{
                                            return;
                                        })
                                    }, 30000))
                                }, 500)
                            }
                        }
                    }
                }else{
                    const embError1 = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`Solo has proporcionado el rol *(${rol})* a agregar pero no has proporcionado al miembro o la palabra *all* o *todos* con las cuales se agregara el rol a todos los miembros del servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            et.delete().catch(c=>{
                                return;
                            })
                        }, 30000))
                    }, 500)
                }
            }
        }else{
            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`No has proporcionado lo mas importante que es el rol, asegúrate de proporcionar correctamente la mención o ID del rol.`)
            .setColor(ColorError)
            .setTimestamp()
            return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    et.delete().catch(c=>{
                        return;
                    })
                }, 30000))
            }, 500)
        }
    }

    if(comando == "removerol" || comando == "remover" || comando == "rmr"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let roles = msg.guild.roles.cache.filter(fr => !fr.managed && fr.id != msg.guildId).map(mr => mr)
        let random = Math.floor(Math.random()* roles.length)
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_ROLES")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        const embErrP2 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_ROLES")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("removerol")){
            cooldowns.set("removerol", new Discord.Collection())
        }

        const tiempoActual = Date.now(), datosComando = cooldowns.get("removerol")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *removerol*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando removerol`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}removerol <Mencion del miembro> <Mencion del rol>\`\`\n\`\`${prefijo}removerol <ID del miembro> <ID del rol>\`\``},
            {name: "Ejemplos: ", value: `${prefijo}removerol ${msg.author} ${roles[random]}\n${prefijo}removerol ${msg.author} ${roles[random].id}\n${prefijo}removeRol ${msg.author.id} ${roles[random].id}\n${prefijo}removeRol ${msg.author.id} ${roles[random]}`},
            {name: "Alias: *3*", value: `\`\`removerol\`\`, \`\`remover\`\`, \`\`rmr\`\``},
            {name: "Descripción:", value: `Elimina un rol de un miembro o de todos los miembros del servidor.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false},embeds: [embInfo]})
        }, 500)

        let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0])|| msg.guild.roles.cache.get(args[1])
        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.get(args[1])


        if(rol){
            if(miembro){
                let descripciones = [`El rol proporcionado *(${rol})* es exclusivo para un bot, no se le puede remover de ningún miembro ya que solo lo puede tener un bot.`, `El rol proporcionado *(${rol})* tiene una posición igual o mayor a la de mi rol mas alto por lo tanto no puedo remover ese rol de ningún miembro.`, `El miembro proporcionado *(${miembro})* eres tu y no tienes el rol ${rol}.`, `El miembro proporcionado *(${miembro})* no tiene el rol ${rol}.`]
                let condicionales = [rol.managed, msg.guild.me.roles.highest.comparePositionTo(rol)<=0, miembro.id == msg.author.id && !miembro.roles.cache.find(f=> f.id == rol.id), !miembro.roles.cache.find(f=> f.id == rol.id)]
                for(let d in descripciones){
                    if(condicionales[d]){
                        const embError = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[d])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError]}).then(et=> setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                et.delete().catch(c=>{
                                    return;
                                })
                            }, 30000))
                        }, 500)
                    }
                }

                if(msg.author.id == msg.guild.ownerId){
                    if(miembro.id == msg.author.id){
                        const embRolRemove = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`${emojis.acierto} Rol removido del miembro`)
                        .setDescription(`Te he removido el rol ${rol}.`)
                        .setColor("GREEN")
                        .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        miembro.roles.remove(rol.id).then(() => setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRolRemove]})
                        }, 500))
                    }else{
                        const embRolRemove = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`${emojis.acierto} Rol removido del miembro`)
                        .setDescription(`El rol ${rol} ha sido removido del miembro ${miembro}.`)
                        .setColor("GREEN")
                        .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        miembro.roles.remove(rol.id).then(() => setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRolRemove]})
                        }, 500))
                    }

                }else{
                    if(miembro.id == msg.author.id){
                        const embError1 = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El rol proporcionado *(${rol})* tiene la misma o mayor posición de tu rol mas alto por lo tanto no te puedo remover el rol.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.member.roles.highest.comparePositionTo(rol)<=0) return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                et.delete().catch(c=>{
                                    return;
                                })
                            }, 30000))
                        }, 500)

                        const embRolRemove = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`${emojis.acierto} Rol removido del miembro`)
                        .setDescription(`Te he removido el rol ${rol}.`)
                        .setColor("GREEN")
                        .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        miembro.roles.remove(rol.id).then(() => setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRolRemove]})
                        }, 500))
                    }else{
                        const embError1 = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El rol proporcionado *(${rol})* tiene la misma o mayor posición de tu rol mas alto por lo tanto no lo puedes remover de ningún miembro.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(msg.member.roles.highest.comparePositionTo(rol)<=0) return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                et.delete().catch(c=>{
                                    return;
                                })
                            }, 30000))
                        }, 500)

                        const embRolRemove = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`${emojis.acierto} Rol removido del miembro`)
                        .setDescription(`El rol ${rol} ha sido removido del miembro ${miembro}.`)
                        .setColor("GREEN")
                        .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        miembro.roles.remove(rol.id).then(() => setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRolRemove]})
                        }, 500))
                    }
                }
                
                datosComando.set(msg.author.id, tiempoActual);
                setTimeout(()=>{
                    datosComando.delete(msg.author.id)
                }, 60000)

            }else{
                if(args[0] && args[1]){
                    if(["all", "todos"].some(s=>s == args[0].toLowerCase()) || ["all", "todos"].some(s=>s == args[1].toLowerCase())){
                        let descripciones = [`El rol proporcionado *(${rol})* es exclusivo para un bot, no se le puede remover de ningún miembro ya que solo lo puede tener un bot.`, `El rol proporcionado *(${rol})* tiene una posición igual o mayor a la de mi rol mas alto por lo tanto no puedo remover ese rol de ningún miembro.`, `Ahora estoy agregando un rol a todos los miembros del servidor, no puedo agregar **2** o mas roles a todos los miembros a la vez.`]
                        let condicionales = [rol.managed, msg.guild.me.roles.highest.comparePositionTo(rol)<=0, botDB.servidor.some(s=>s.id == msg.guildId) && botDB.servidor.find(f=> f.id == msg.guildId).comandos.removerol]
                        for(let d in descripciones){
                            if(condicionales[d]){
                                const embError = new Discord.MessageEmbed()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[d])
                                .setColor(ColorError)
                                .setTimestamp()
                                return setTimeout(()=>{
                                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError]}).then(et=> setTimeout(()=>{
                                        msg.delete().catch(c=>{
                                            return;
                                        })
                                        et.delete().catch(c=>{
                                            return;
                                        })
                                    }, 30000))
                                }, 500)
                            }
                        }

                        if(msg.guild.ownerId == msg.author.id){
                            let noLoTienen = msg.guild.members.cache.filter(f=> !f.roles.cache.has(rol.id)).map(n=>n), siLoTienen = msg.guild.members.cache.filter(f=> f.roles.cache.has(rol.id)).map(s=>s), cantidad = 0, descripcion = ""
                        
                            const embCargando = new Discord.MessageEmbed()
                            .setTitle(`<a:loading:958171113370828830> Rremoviendo el rol de todos..`)
                            .setDescription(`Se esta removiendo el rol ${rol} de todos los miembros, tenga paciencia esto puede tardar aproximadamente ${ms(siLoTienen.length*1000)}`)
                            .setColor(msg.guild.me.displayHexColor)
                            msg.reply({allowedMentions: { repliedUser: false}, embeds: [embCargando]}).then(tm=> {
                                if(botDB.servidor.some(s=> s.id == msg.guildId)){
                                    botDB.servidor.find(f=>f.id == msg.guildId).comandos.removerol = true
                                }else{
                                    botDB.servidor.push({id: msg.guildId, comandos: {addrol: false, removerol: true}})
                                }

                                let intervalo = setInterval(()=>{
                                    if(cantidad < siLoTienen.length){
                                        siLoTienen[cantidad].roles.remove(rol.id)
                                        cantidad++
                                    }else{
                                        clearInterval(intervalo)
                                        if(noLoTienen.length > 0){
                                            descripcion = `He removido el rol ${rol} de **${siLoTienen.length.toLocaleString()}** miembros y **${noLoTienen.length.toLocaleString()}** no tenían el rol.`
                                        }else{
                                            descripcion = `He removido el rol ${rol} de **${siLoTienen.length.toLocaleString()}** miembros.`
                                        }
                                        const embRolRemove = new Discord.MessageEmbed()
                                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                                        .setTitle(`${emojis.acierto} Rol removido de todos los miembros`)
                                        .setDescription(descripcion)
                                        .setColor("GREEN")
                                        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                                        .setTimestamp()
                                        tm.edit({embeds: [embRolRemove]}).then(td=>{
                                            botDB.servidor.find(f=>f.id == msg.guildId).comandos.removerol = false
                                        })

                                        datosComando.set(msg.author.id, tiempoActual);
                                        setTimeout(()=>{
                                            datosComando.delete(msg.author.id)
                                        }, 60000)
                                    }
                                }, 1000)
                            })   
                        }else{
                            const embError1 = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El rol proporcionado *(${rol})* tiene la misma o mayor posición de tu rol mas alto por lo tanto no lo puedes remover de ningún miembro.`)
                            .setColor(ColorError)
                            .setTimestamp()
                            if(msg.member.roles.highest.comparePositionTo(rol)<=0) return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    et.delete().catch(c=>{
                                        return;
                                    })
                                }, 30000))
                            }, 500)

                            let noLoTienen = msg.guild.members.cache.filter(f=> !f.roles.cache.has(rol.id)).map(n=>n), siLoTienen = msg.guild.members.cache.filter(f=> f.roles.cache.has(rol.id)).map(s=>s), cantidad = 0, descripcion = ""
                        
                            const embCargando = new Discord.MessageEmbed()
                            .setTitle(`<a:loading:958171113370828830> Rremoviendo el rol de todos..`)
                            .setDescription(`Se esta removiendo el rol ${rol} de todos los miembros, tenga paciencia esto puede tardar aproximadamente ${ms(siLoTienen.length*1000)}`)
                            .setColor(msg.guild.me.displayHexColor)
                            msg.reply({allowedMentions: { repliedUser: false}, embeds: [embCargando]}).then(tm=> {
                                if(botDB.servidor.some(s=> s.id == msg.guildId)){
                                    botDB.servidor.find(f=>f.id == msg.guildId).comandos.removerol = true
                                }else{
                                    botDB.servidor.push({id: msg.guildId, comandos: {addrol: false, removerol: true}})
                                }

                                let intervalo = setInterval(()=>{
                                    if(cantidad < siLoTienen.length){
                                        siLoTienen[cantidad].roles.remove(rol.id)
                                        cantidad++
                                    }else{
                                        clearInterval(intervalo)
                                        if(noLoTienen.length > 0){
                                            descripcion = `He removido el rol ${rol} de **${siLoTienen.length.toLocaleString()}** miembros y **${noLoTienen.length.toLocaleString()}** no tenían el rol.`
                                        }else{
                                            descripcion = `He removido el rol ${rol} de **${siLoTienen.length.toLocaleString()}** miembros.`
                                        }
                                        const embRolRemove = new Discord.MessageEmbed()
                                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                                        .setTitle(`${emojis.acierto} Rol removido de todos los miembros`)
                                        .setDescription(descripcion)
                                        .setColor("GREEN")
                                        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                                        .setTimestamp()
                                        tm.edit({embeds: [embRolRemove]}).then(td=>{
                                            botDB.servidor.find(f=>f.id == msg.guildId).comandos.removerol = false
                                        })

                                        datosComando.set(msg.author.id, tiempoActual);
                                        setTimeout(()=>{
                                            datosComando.delete(msg.author.id)
                                        }, 60000)
                                    }
                                }, 1000)
                            })          
                        }             
                    }else{
                        let descripciones = [`El primer argumento proporcionado *(${args[0]})* no es una **mención** o **ID** de un miembro del servidor ni es la palabra *all* o *todos*, proporciona una **mención** o **ID** de un miembro en caso de que quieras remover el rol ${rol} de un miembro, en caso de querer remover el rol ${rol} de todos los miembros del servidor proporciona la palabra *all* o *todos*.`, `El segundo argumento proporcionado *(${args[1]})* no es una **mención** o **ID** de un miembro del servidor ni es la palabra *all* o *todos*, proporciona una **mención** o **ID** de un miembro en caso de que quieras remover el rol ${rol} de un miembro, en caso de querer remover el rol ${rol} a todos los miembros del servidor proporciona la palabra *all* o *todos*.`]
                        let condicionales = [!isNaN(args[0]) && args[0].length != 18 || isNaN(args[0]) && !["@","&","<",">"].some(s=> args[0].includes(s)), !isNaN(args[1]) && args[1].length != 18 || isNaN(args[1]) && !["@","&","<",">"].some(s=> args[1].includes(s))]
                        for(let d in descripciones){
                            if(condicionales[d]){
                                const embError = new Discord.MessageEmbed()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[d])
                                .setColor(ColorError)
                                .setTimestamp()
                                return setTimeout(()=>{
                                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError]}).then(et=> setTimeout(()=>{
                                        msg.delete().catch(c=>{
                                            return;
                                        })
                                        et.delete().catch(c=>{
                                            return;
                                        })
                                    }, 30000))
                                }, 500)
                            }
                        }
                    }
                }else{
                    const embError1 = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`Solo has proporcionado el rol *(${rol})* a remover pero no has proporcionado al miembro o la palabra *all* o *todos* con las cuales se removera el rol de todos los miembros del servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            et.delete().catch(c=>{
                                return;
                            })
                        }, 30000))
                    }, 500)
                }
            }
        }else{
            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`No has proporcionado lo mas importante que es el rol, asegúrate de proporcionar correctamente la mención o ID del rol.`)
            .setColor(ColorError)
            .setTimestamp()
            return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    et.delete().catch(c=>{
                        return;
                    })
                }, 30000))
            }, 500)
        }   
    }

    if(comando == "createchannel" || comando == "createcha"  || comando == "crech"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let categoriasGMS = msg.guild.channels.cache.filter(fc => fc.type === "GUILD_CATEGORY").map(mc => mc.id)
        let randomCat = Math.floor(Math.random()* categoriasGMS.length)

        let tiposDeCanales = {
            "GUILD_TEXT": "texto",
            "GUILD_VOICE": "voz",
            "GUILD_CATEGORY": "categoría",
            "GUILD_NEWS": "anuncios",
            "GUILD_NEWS_THREAD": "hilo de anuncios",
            "GUILD_PRIVATE_THREAD": "hilo privado",
            "GUILD_PUBLIC_THREAD": "hilo publico",
            "GUILD_STAGE_VOICE": "escenario",
            "GUILD_STORE": "tienda"
        }
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_CHANNELS")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)
        
        const embErrP2 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_CHANNELS")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("createchannel")){
            cooldowns.set("createchannel", new Discord.Collection())
        }

        const tiempoActual = Date.now(), datosComando = cooldowns.get("createchannel")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *createchannel*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando createchannel`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}createchannel <Nombre del canal>\`\`\n\`\`${prefijo}createchannel <Nombre del canal> <Tipo de canal (texto o voz)>\`\`\n\`\`${prefijo}createchannel <Nombre del canal> <Tipo de canal (texto o voz)> <ID de la categoría en la que se creara>\`\``},
            {name: "Ejemplos:", value: `${prefijo}createchannel Chat\n${prefijo}createchannel Reglas texto\n${prefijo}createchannel Musica voz ${categoriasGMS[randomCat]}`},
            {name: "Alias: *3*", value: `\`\`createchannel\`\`, \`\`createcha\`\`, \`\`crech\`\``},
            {name: "Descripción:", value: `Crea un canal de texto o voz en una categoría.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=> {
            msg.reply({allowedMentions: {repliedUser: false},embeds: [embInfo]})
        }, 500) 
        
        let tipoCanal = ""
        
        
        if(args[0]){
            if(args[1]){
                if(isNaN(args[1])){
                    const embErr1 = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`El segundo argumento que has proporcionado *(${args[1]})* no es igual a las palabra **texto** o **voz** las cuales determinan el tipo de canal que seré creado.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    if(!["texto", "voz"].some(s=> s == args[1].toLowerCase())) return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(et=> setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            et.delete().catch(c=>{
                                return;
                            })
                        }, 30000))
                    }, 500)
    
                    if(args[2]){
                        let descripciones = [`El argumento numérico  ingresado *(${args[2]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[2]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El tercer argumento proporcionado (*${args[2]}*) no es una ID de una categoría valido ya que no es numérico, proporciona una ID valida.`]
                        let condicionales = [!isNaN(args[2]) && args[2].length < 18, !isNaN(args[2]) && args[2].length > 18, isNaN(args[2])]
    
                        for(let i=0; i<descripciones.length; i++){
                            if(condicionales[i]){
                                const embErr = new Discord.MessageEmbed()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[i])
                                .setColor(ColorError)
                                .setTimestamp()
                                return setTimeout(()=>{
                                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                        msg.delete().catch(c=>{
                                            return;
                                        })
                                        dt.delete().catch(e=>{
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }
    
                        if(args[1].toLowerCase() == "texto"){
                            tipoCanal = "GUILD_TEXT"
                        }else{
                            if(args[1].toLowerCase() == "voz"){
                                tipoCanal = "GUILD_VOICE"
                            }else{
                                tipoCanal = "GUILD_TEXT"
                            }
                        }
    
                        msg.guild.channels.create(`${args[0]}`,{type: `${tipoCanal}`, parent: `${args[2]}`}).then(cc=> setTimeout(()=>{
                            const embCreateCha = new Discord.MessageEmbed()
                            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.acierto} Canal creado`)
                            .setDescription(`**Canal:** ${cc}\n**Nombre:** ${cc.name}\n**ID:** ${cc.id}\n\n**Tipo:** ${tiposDeCanales[cc.type]}\n\n**Categoría:** ${cc.parent ? cc.parent: "*Sin categoría*"}`)
                            .setColor("GREEN")
                            .setTimestamp()
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embCreateCha]})
                        }, 300))
                    }
                }else{
                    let descripciones = [`El segundo argumento proporcionado *(${args[2]})* es numérico por lo tanto debería ser una ID de una categoría pero no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El segundo argumento proporcionado *(${args[2]})* es numérico por lo tanto debería ser una ID de una categoría pero no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`]
                    let condicionales = [!isNaN(args[2]) && args[2].length < 18, !isNaN(args[2]) && args[2].length > 18]
    
                    for(let i=0; i<descripciones.length; i++){
                        if(condicionales[i]){
                            const embErr = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }
                    
            
                    msg.guild.channels.create(`${args[0]}`,{parent: `${args[1]}`}).then(cc=> setTimeout(()=>{
                        const embCreateCha = new Discord.MessageEmbed()
                        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`${emojis.acierto} Canal creado`)
                        .setDescription(`**Canal:** ${cc}\n**Nombre:** ${cc.name}\n**ID:** ${cc.id}\n\n**Tipo:** ${tiposDeCanales[cc.type]}\n\n**Categoría:** ${cc.parent ? cc.parent: "*Sin categoría*"}`)
                        .setColor("GREEN")
                        .setTimestamp()
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embCreateCha]})
                    }, 300))
                }
            }else{
                const embErr3 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`El primer argumento *(${args[0]})* el cual será el nombre del canal supera los **80** caracteres los cuales son muchos para el nombre de un canal.`)
                .setColor(ColorError)
                .setTimestamp()
                if(args[0].length > 80) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(et=> setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        et.delete().catch(c=>{
                            return;
                        })
                    }, 30000))
                }, 500)

                msg.guild.channels.create(`${args[0]}`, {parent: msg.channel.parentId}).then(cc=> setTimeout(()=>{
                    const embCreateCha = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle(`${emojis.acierto} Canal creado`)
                    .setDescription(`**Canal:** ${cc}\n**Nombre:** ${cc.name}\n**ID:** ${cc.id}\n\n**Tipo:** ${tiposDeCanales[cc.type]}\n\n**Categoría:** ${cc.parent ? cc.parent: "*Sin categoría*"}`)
                    .setColor("GREEN")
                    .setTimestamp()
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embCreateCha]})
                }, 300)) 
            }
        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "deletechannel" || comando == "deletecha" || comando == "delch"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let canalesAlDel = msg.guild.channels.cache.filter(fc => fc.type === "GUILD_TEXT" ).map(mc => mc)
        let randomChanne = Math.floor(Math.random()* canalesAlDel.length)

        let tiposDeCanales = {
            "GUILD_TEXT": "texto",
            "GUILD_VOICE": "voz",
            "GUILD_CATEGORY": "categoría",
            "GUILD_NEWS": "anuncios",
            "GUILD_NEWS_THREAD": "hilo de anuncios",
            "GUILD_PRIVATE_THREAD": "hilo privado",
            "GUILD_PUBLIC_THREAD": "hilo publico",
            "GUILD_STAGE_VOICE": "escenario",
            "GUILD_STORE": "tienda"
        }


        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requieres del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_CHANNELS")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)
        
        const embErrP2 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Requiero del permiso: Gestionar roles.")
        .setTimestamp()
        if(!msg.guild.me.permissions.has("MANAGE_CHANNELS")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP2]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("deletechannel")){
            cooldowns.set("deletechannel", new Discord.Collection())
        }

        const tiempoActual = Date.now(), datosComando = cooldowns.get("deletechannel")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *deletechannel*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando deletechannel`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}deletechannel <Mencion del canal>\`\`\n\`\`${prefijo}deletechannel <ID del canal>\`\``},
            {name: "Ejemplos:", value: `${prefijo}deletechannel ${canalesAlDel[randomChanne]}\n${prefijo}deletechannel ${canalesAlDel[randomChanne].id}`},
            {name: "Alias: *3*", value: `\`\`deletechannel\`\`, \`\`deletecha\`\`, \`\`delch\`\``},
            {name: "Descripción:", value: `Elimina un canal del servidor.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false},embeds: [embInfo]}) 
        
        let canal = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0])
        
        if(canal){
            const embDeleteCha = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("⭕ Canal eliminado")
            .setDescription(`**Nombre:** ${canal.name}\n**ID:** ${canal.id}\n**Tipo:** ${tiposDeCanales[canal.type]}\n**Categoría:** ${canal.parent ? canal.parent: "*Sin categoría*"}`)
            .setColor("RED")
            .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            canal.delete().then(ch=> setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embDeleteCha]})
            }, 300))
        }else{
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención o ID de un canal del servidor, proporciona una mención o ID valida de un canal.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "memberswithrole" || comando == "memberswr" || comando == "miembrosconelrol" || comando == "mcer"){
        botDB.comandos.usos++
        let roles = msg.guild.roles.cache.filter(fr => !fr.managed && fr.id != msg.guildId).map(mr => mr)
        msg.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido:  Gestionar roles")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_ROLES")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("memberswithrole")){
            cooldowns.set("memberswithrole", new Discord.Collection())
        }

        const tiempoActual = Date.now(), datosComando = cooldowns.get("memberswithrole")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *memberswithrole*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando memberswithrole`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}memberswithrole <Mención del rol>\`\`\n\`\`${prefijo}memberswithrole <ID del rol>\`\``},
            {name: "Ejemplos:", value: `${prefijo}memberswithrole ${roles[Math.floor(Math.random()*roles.length)]}\n${prefijo}memberswithrole ${roles[Math.floor(Math.random()*roles.length)].id}`},
            {name: "Alias:", value: `\`\`memberswithrole\`\`, \`\`memberswr\`\`, \`\`miembrosconelrol\`\`, \`\`mcer\`\``},
            {name: "Descripción:", value: `Muestra una lista de todos los miembros del servidor que tienen el rol proporcionado.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0])

        if(rol){
            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`El rol proporcionado ${rol} es un rol exclusivo de un bot, solo un bot puede tener ese rol el cual es ${msg.guild.members.cache.find(f=>f.roles.cache.has(rol.id))}`)
            .setColor(ColorError)
            .setTimestamp()
            if(rol.managed) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]})
            }, 500)

            const embError2 = new Discord.MessageEmbed()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`El rol proporcionado ${rol} es el rol que todos los miembros tienen por defecto al entrar al servidor.`)
            .setColor(ColorError)
            .setTimestamp()
            if(rol.id == msg.guildId) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]})
            }, 500)

            let miembros = msg.guild.members.cache.filter(f=> f.roles.cache.has(rol.id)).map(r=> r)

            const embNoMiembros = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("👥 Miembros con el rol")
            .setDescription(`${rol}\n*No hay miembros con ese rol.*`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            if(miembros.length <= 0) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embNoMiembros]})
            }, 500)

            let segPage
            if(String(miembros.length).slice(-1) === "0"){
                segPage = Math.floor(miembros.length / 10)
            }else{
                segPage = Math.floor(miembros.length / 10 + 1)
            }

            if(miembros.length <= 10){
                const embMiembros = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("👥 Miembros con el rol")
                .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros con el rol.\n\n${miembros.map((m, r)=> `**${r+1}.** [${m.user.tag}](${m.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})\n${m}`).join("\n\n")}`)
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(`Pagina - 1/${segPage}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMiembros]})
                }, 500)
            }else{
                let m1 = 0, m2 = 10, pagina = 1

                const embMiembros = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("👥 Miembros con el rol")
                .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros con el rol.\n\n${miembros.map((m, r)=> `**${r+1}.** [${m.user.tag}](${m.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})\n${m}`).slice(m1,m2).join("\n\n")}`)
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()

                const botones1 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente ")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )

                const botones2 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )

                const botones3 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ]
                )

                setTimeout(async ()=> {
                    const mensajeSend = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMiembros], components: [botones1]})
                    const filtro = i=> i.user.id === msg.author.id;
                    const colector = mensajeSend.createMessageComponentCollector({filter: filtro, time: segPage * 60000})

                    setTimeout(()=>{
                        mensajeSend.edit({embeds: [embMiembros], components: []})
                    }, segPage * 60000)

                    colector.on("collect", async botn => {
                        if(botn.customId === "1"){
                            if(m2 - 10 <= 10){
                                m1-=10, m2-=10, pagina--

                                embMiembros
                                .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros con el rol.\n\n${miembros.map((m, r)=> `**${r+1}.** [${m.user.tag}](${m.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})\n${m}`).slice(m1,m2).join("\n\n")}`)
                                .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                                return await botn.update({embeds: [embMiembros], components: [botones1]})
                            }
                            m1-=10, m2-=10, pagina--

                            embMiembros
                            .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros con el rol.\n\n${miembros.map((m, r)=> `**${r+1}.** [${m.user.tag}](${m.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})\n${m}`).slice(m1,m2).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            await botn.update({embeds: [embMiembros], components: [botones2]})
                        }
                        if(botn.customId === "2"){
                            if(m2 + 10 >= miembros.length){
                                m1+=10, m2+=10, pagina++

                                embMiembros
                                .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros con el rol.\n\n${miembros.map((m, r)=> `**${r+1}.** [${m.user.tag}](${m.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})\n${m}`).slice(m1,m2).join("\n\n")}`)
                                .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                                return await botn.update({embeds: [embMiembros], components: [botones3]})
                            }
                            m1+=10, m2+=10, pagina++

                            embMiembros
                            .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros con el rol.\n\n${miembros.map((m, r)=> `**${r+1}.** [${m.user.tag}](${m.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})\n${m}`).slice(m1,m2).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            return await botn.update({embeds: [embMiembros], components: [botones2]})
                        }
                    })
                }, 500)
            }
        }else{
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención o ID de un rol del servidor, proporciona una mención o ID de un rol del servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "memberswithouttherole" || comando == "mwtr" || comando == "miembrossinelrol" || comando == "mser"){
        botDB.comandos.usos++
        let roles = msg.guild.roles.cache.filter(fr => !fr.managed && fr.id != msg.guildId).map(mr => mr)
        msg.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido:  Gestionar roles")
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_ROLES")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("memberswithouttherole")){
            cooldowns.set("memberswithouttherole", new Discord.Collection())
        }

        const tiempoActual = Date.now(), datosComando = cooldowns.get("memberswithouttherole")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *memberswithouttherole*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando memberswithouttherole`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}memberswithouttherole <Mención del rol>\`\`\n\`\`${prefijo}memberswithouttherole <ID del rol>\`\``},
            {name: "Ejemplos:", value: `${prefijo}memberswithouttherole ${roles[Math.floor(Math.random()*roles.length)]}\n${prefijo}memberswithouttherole ${roles[Math.floor(Math.random()*roles.length)].id}`},
            {name: "Alias:", value: `\`\`memberswithouttherole\`\`, \`\`mwtr\`\`, \`\`miembrossinelrol\`\`, \`\`mser\`\``},
            {name: "Descripción:", value: `Muestra una lista de todos los miembros del servidor que no tienen el rol proporcionado.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0])

        if(rol){
            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`El rol proporcionado ${rol} es un rol exclusivo de un bot, solo un bot puede tener ese rol el cual es ${msg.guild.members.cache.find(f=>f.roles.cache.has(rol.id))}, todos los demás miembros no tienen el rol.`)
            .setColor(ColorError)
            .setTimestamp()
            if(rol.managed) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]})
            }, 500)

            const embError2 = new Discord.MessageEmbed()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`El rol proporcionado ${rol} es el rol que todos los miembros tienen por defecto al entrar al servidor, no hay ningún miembro en el servidor que no tenga ese rol.`)
            .setColor(ColorError)
            .setTimestamp()
            if(rol.id == msg.guildId) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]})
            }, 500)

            let miembros = msg.guild.members.cache.filter(f=> !f.roles.cache.has(rol.id)).map(r=> r)

            const embNoMiembros = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("👥 Miembros sin el rol")
            .setDescription(`${rol}\n*Todos los miembros tienen el rol.*`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            if(miembros.length <= 0) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embNoMiembros]})
            }, 500)

            let segPage
            if(String(miembros.length).slice(-1) === "0"){
                segPage = Math.floor(miembros.length / 10)
            }else{
                segPage = Math.floor(miembros.length / 10 + 1)
            }

            if(miembros.length <= 10){
                const embMiembros = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("👥 Miembros sin el rol")
                .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros sin el rol.\n\n${miembros.map((m, r)=> `**${r+1}.** [${m.user.tag}](${m.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})\n${m}`).join("\n\n")}`)
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(`Pagina - 1/${segPage}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMiembros]})
                }, 500)
            }else{
                let m1 = 0, m2 = 10, pagina = 1

                const embMiembros = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("👥 Miembros sin el rol")
                .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros sin el rol.\n\n${miembros.map((m, r)=> `**${r+1}.** [${m.user.tag}](${m.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})\n${m}`).slice(m1,m2).join("\n\n")}`)
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()

                const botones1 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente ")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )

                const botones2 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )

                const botones3 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ]
                )

                setTimeout(async ()=>{
                    const mensajeSend = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embMiembros], components: [botones1]})
                    const filtro = i=> i.user.id === msg.author.id;
                    const colector = mensajeSend.createMessageComponentCollector({filter: filtro, time: segPage*60000})
    
                    setTimeout(()=>{
                        mensajeSend.edit({embeds: [embMiembros], components: []})
                    }, segPage*60000)
    
                    colector.on("collect", async botn => {
                        if(botn.customId === "1"){
                            if(m2 - 10 <= 10){
                                m1-=10, m2-=10, pagina--
    
                                embMiembros
                                .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros sin el rol.\n\n${miembros.map((m, r)=> `**${r+1}.** [${m.user.tag}](${m.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})\n${m}`).slice(m1,m2).join("\n\n")}`)
                                .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                                return await botn.update({embeds: [embMiembros], components: [botones1]})
                            }
                            m1-=10, m2-=10, pagina--
    
                            embMiembros
                            .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros sin el rol.\n\n${miembros.map((m, r)=> `**${r+1}.** [${m.user.tag}](${m.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})\n${m}`).slice(m1,m2).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            await botn.update({embeds: [embMiembros], components: [botones2]})
                        }
                        if(botn.customId === "2"){
                            if(m2 + 10 >= miembros.length){
                                m1+=10, m2+=10, pagina++
    
                                embMiembros
                                .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros sin el rol.\n\n${miembros.map((m, r)=> `**${r+1}.** [${m.user.tag}](${m.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})\n${m}`).slice(m1,m2).join("\n\n")}`)
                                .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                                return await botn.update({embeds: [embMiembros], components: [botones3]})
                            }
                            m1+=10, m2+=10, pagina++
    
                            embMiembros
                            .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros sin el rol.\n\n${miembros.map((m, r)=> `**${r+1}.** [${m.user.tag}](${m.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})})\n${m}`).slice(m1,m2).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            return await botn.update({embeds: [embMiembros], components: [botones2]})
                        }
                    })
                }, 500)
            }
        }else{
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención o ID de un rol del servidor, proporciona una mención o ID de un rol del servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }


    // 🟢 Sistema de puntos
    if(comando == "pointsinfo" || comando == "pointsysteminfo" || comando == "pssysteminfo" || comando == "puntosinfo"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let dataSP = await sPuntos.findOne({_id: msg.guildId})

        if(dataSP){
            let objeto = dataSP.datos
            objeto.comandosUsos++
            await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto})
        }
        
        const embInfoP = new Discord.MessageEmbed()
        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle(`${emojis.puntos} ¿Qué es el sistema de Puntos?`)
        .setDescription(`Es un sistema creado con la intención de ayudar a los dueños y administradores de servidores a tener una mejor forma de administrar las acciones de lo demás miembros del staff y determinar con mayor facilidad cuando un miembro del staff se me rece un acenso.\n\n📑 **Comandos:** *10*\n\`\`${prefijo}points\`\` **|** Muestra la cantidad de puntos que tienes o tiene un miembro.\n\`\`${prefijo}addpoints\`\` **|** Agrega puntos a un miembro.\n\`\`${prefijo}removepoints\`\` **|** Elimina puntos a un miembro.\n\`\`${prefijo}setstaffrole\`\` **|** Establece un rol del staff o personal del servidor.\n\`\`${prefijo}deletestaffrole\`\` **|** Elimina un rol establecido como rol del staff del servidor.\n\`\`${prefijo}setemojipoints\`\` **|** Establece un símbolo o emoji personalizado para el sistema de puntos.\n\`\`${prefijo}pointsleaderboard\`\` **|** Muestra una tabla de clasificaciones con los miembros que han utilizado el sistema de puntos y sus respectivos puntos.\n\`\`${prefijo}pointsystemstatus\`\` **|** Muestra el estado del sistema en el servidor.\n\`\`${prefijo}removeusersystemp\`\` **|** Elimina a un miembro del sistema de puntos del servidor.\n\`\`${prefijo}updatepointssystem\`\` **|** Actualiza el sistema de puntos en el servidor eliminando del sistema a todos los usuarios que se han ido del servidor.`)
        .setColor(colorEmb)
        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
        .setTimestamp()
        setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfoP]})
        }, 500)
    }

    if(comando == "points" || comando == "puntos" || comando == "ps"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let dataSP = await sPuntos.findOne({_id: msg.guildId}), puntos = 0
        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag == args[0])

        if(miembro){
            let descripciones = [`El miembro proporcionado *(${miembro})* soy yo, yo no puedo usar el sistema de puntos.`, `El miembro proporcionado *(${miembro})* es un bot, los bots no pueden usar el sistema de puntos.`]
            let condicionales = [miembro.id == client.user.id, miembro.user.bot]
    
            for(let i in descripciones){
                if(condicionales[i]){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            if(dataSP){
                let objeto = dataSP.datos
                objeto.comandosUsos++

                const embError1 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No puedes usar este comando ya que no eres miembro del personal del servidor.`)
                .setColor(ColorError)
                .setTimestamp()
                if(dataSP.datos.rolesPersonal.length >= 1 && !dataSP.datos.rolesPersonal.some(s=> msg.member.roles.cache.has(s))) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)

                if(miembro.id == msg.author.id){
                    if(dataSP.miembros.some(s=> s.id == miembro.id)){
                        for(let i in dataSP.miembros){
                            if(dataSP.miembros[i].id == miembro.id){
                                puntos = dataSP.miembros[i].puntos
                            }
                        }
            
                        const embPMi = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,miembro.user.displayAvatarURL({dynamic: true}))
                        .setDescription(`Tienes ${dataSP.datos.emoji} **${puntos.toLocaleString()}** puntos.`)
                        .setColor(msg.guild.me.displayHexColor)
                        .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        setTimeout(()=> {
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPMi]})
                        }, 500)
                    }else{
                        let array = dataSP.miembros
                        array.push({id: msg.author.id, nombre: msg.author.tag, puntos: 0})
                        await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})
        
                        const embPMi = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setDescription(`Tienes ${dataSP.datos.emoji} **0** puntos.`)
                        .setColor(msg.guild.me.displayHexColor)
                        .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()

                        setTimeout(()=> {
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPMi]})
                        }, 400)
                    }
                }else{
                    if(dataSP.miembros.some(s=> s.id == miembro.id)){
                        for(let i in dataSP.miembros){
                            if(dataSP.miembros[i].id == miembro.id){
                                puntos = dataSP.miembros[i].puntos
                            }
                        }
            
                        const embPMi = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,miembro.user.displayAvatarURL({dynamic: true}))
                        .setDescription(`${miembro} tiene ${dataSP.datos.emoji} **${puntos.toLocaleString()}** puntos.`)
                        .setColor(msg.guild.me.displayHexColor)
                        .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        setTimeout(()=> {
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPMi]})
                        }, 500)

                    }else{
                        let array = dataSP.miembros
                        array.push({id: miembro.id, nombre: miembro.user.tag, puntos: 0})
                        await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})
        
                        const embPMi = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setDescription(`${miembro} tiene ${dataSP.datos.emoji} **0** puntos.`)
                        .setColor(msg.guild.me.displayHexColor)
                        .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                        .setTimestamp()

                        setTimeout(()=> {
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPMi]})
                        }, 400)
                    }
                }

            }else{
                if(miembro.id == msg.author.id){
                    let nuevaDataSP = new sPuntos({
                        _id: msg.guildId,
                        serverName: msg.guild.name,
                        datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: []},
                        miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}]
                    })
    
                    const embPMi = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,miembro.user.displayAvatarURL({dynamic: true}))
                    .setDescription(`Tienes ${emojis.puntos} **0** puntos.`)
                    .setColor(msg.guild.me.displayHexColor)
                    .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    await nuevaDataSP.save()
    
                    setTimeout(()=> {
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPMi]})
                    }, 400)

                }else{
                    let nuevaDataSP = new sPuntos({
                        _id: msg.guildId,
                        serverName: msg.guild.name,
                        datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: []},
                        miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}, {id: miembro.id, nombre: miembro.user.tag, puntos: 0}]
                    })

                    const embPMi = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,miembro.user.displayAvatarURL({dynamic: true}))
                    .setDescription(`${miembro} tiene ${emojis.puntos} **0** puntos.`)
                    .setColor(msg.guild.me.displayHexColor)
                    .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    await nuevaDataSP.save()

                    setTimeout(()=> {
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPMi]})
                    }, 400)
                }    
            }

        }else{
            if(dataSP){
                let objeto = dataSP.datos
                objeto.comandosUsos++

                const embError1 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No puedes usar este comando ya que no eres miembro del personal del servidor.`)
                .setColor(ColorError)
                .setTimestamp()
                if(dataSP.datos.rolesPersonal.length >= 1 && !dataSP.datos.rolesPersonal.some(s=> msg.member.roles.cache.has(s))) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)

                if(dataSP.miembros.some(s=> s.id == msg.author.id)){
                    for(let i in dataSP.miembros){
                        if(dataSP.miembros[i].id == msg.author.id){
                            puntos = dataSP.miembros[i].puntos
                        }
                    }
        
                    const embPAu = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`Tienes ${dataSP.datos.emoji} **${puntos.toLocaleString()}** puntos.`)
                    .setColor(msg.guild.me.displayHexColor)
                    .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPAu]})
                    }, 500)

                }else{
                    let array = dataSP.miembros
                    array.push({id: msg.author.id, nombre: msg.author.tag, puntos: 0})
                    await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})
    
                    const embPAu = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`Tienes ${dataSP.datos.emoji} **0** puntos.`)
                    .setColor(msg.guild.me.displayHexColor)
                    .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()

                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPAu]})
                    }, 400)
                }

            }else{
                let nuevaDataSP = new sPuntos({
                    _id: msg.guildId,
                    serverName: msg.guild.name,
                    datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: []},
                    miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}]
                })

                const embPAu = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`Tienes ${emojis.puntos} **0** puntos.`)
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                await nuevaDataSP.save()
                
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPAu]})
                }, 400)
            }
        }
    }

    if(comando == "setstaffrole" || comando == "establecerrolstaff" || comando == "setstaffr"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let roles = msg.guild.roles.cache.map(m=> m)
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido:  Administrador")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("setstaffrole")){
            cooldowns.set("setstaffrole", new Discord.Collection())
        }

        const datosComando = cooldowns.get("setstaffrole"), tiempoActual = Date.now()

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *setstaffrole*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando setstaffrole`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}setstaffrole <Mención del rol>\`\`\n\`\`${prefijo}setstaffrole <ID del rol>\`\``},
            {name: "Ejemplos:", value: `${prefijo}setstaffrole ${roles[Math.floor(Math.random()*roles.length)]}\n${prefijo}setstaffrole ${roles[Math.floor(Math.random()*roles.length)].id}`},
            {name: "Alias: **3**", value: `\`\`setstaffrole\`\`, \`\`establecerrolstaff\`\`, \`\`setstaffr\`\`, `},
            {name: "Descripción:", value: `Establece un rol o mas, como máximo **3** roles los cuales si el miembro tiene uno de ellos podrá utilizar el sistema de puntos, en caso de que no este establecido ningún rol cualquier miembro del servidor con acceso al bot podrá utilizar el sistema.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let dataSP = await sPuntos.findOne({_id: msg.guildId})
        let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0])

        if(rol){
            let descripciones = [`El rol proporcionado *(${rol})* es exclusivo para un bot, proporciona otro rol.`, `El rol proporcionado *(${rol})* el el rol @everyone un rol invisible que todos tienen, proporciona otro rol.`]
            let condicionales = [rol.managed, rol.id == msg.guildId]
            for(let r in descripciones){
                if(condicionales[r]){
                    const embError = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[r])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError]}).then(et=> setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            et.delete().catch(c=>{
                                return;
                            })
                        }, 30000))
                    }, 500)
                }
            }

            if(dataSP){
                let objeto = dataSP.datos
                objeto.comandosUsos++
                await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto})

                const embError1 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`Ya se han establecido **3** roles del personal de este servidor en el sistema de puntos, no puedes agregar mas roles.`)
                .setColor(ColorError)
                .setTimestamp()
                if(dataSP.datos.rolesPersonal.length >= 3) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        et.delete().catch(c=>{
                            return;
                        })
                    }, 30000))
                }, 500)

                objeto.rolesPersonal.push(rol.id)
                await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto})

                const embStaffRol = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setTitle(`${emojis.acierto} Rol del personal establecido`)
                .setDescription(`El rol ${rol} ha sido establecido como rol del personal del servidor en el sistema de puntos.`)
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()

                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embStaffRol]})
                }, 400)
            }else{
                let nuevaDataSP = new sPuntos({
                    _id: msg.guildId,
                    serverName: msg.guild.name,
                    datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [rol.id]},
                    miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}]
                })

                const embStaffRol = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setTitle(`${emojis.acierto} Rol del personal establecido`)
                .setDescription(`El rol ${rol} ha sido establecido como rol del personal del servidor en el sistema de puntos.`)
                .setColor("GREEN")
                .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                await nuevaDataSP.save()

                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embStaffRol]})
                }, 400)
            }
        }else{
            let descripciones = [`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención o ID de un rol del servidor, proporciona una mención o ID valida de un rol.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado *(${args[0]})* tiene las características de una ID, es numérico, contiene **18** caracteres pero no es una **ID** de ningún rol del servidor.`]
            let condicionales = [isNaN(args[0]), args[0].length < 18, args[0].length > 18, true]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }

        datosComando.set(msg.author.id, tiempoActual)
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "deletestaffrole" || comando == "eliminarrolstaff" || comando == "deletestaffr"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let roles = msg.guild.roles.cache.map(m=> m)
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido:  Administrador")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("deletestaffrole")){
            cooldowns.set("deletestaffrole", new Discord.Collection())
        }

        const datosComando = cooldowns.get("deletestaffrole"), tiempoActual = Date.now()

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *deletestaffrole*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando deletestaffrole`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}deletestaffrole <Mención del rol>\`\`\n\`\`${prefijo}deletestaffrole <ID del rol>\`\``},
            {name: "Ejemplos:", value: `${prefijo}deletestaffrole ${roles[Math.floor(Math.random()*roles.length)]}\n${prefijo}deletestaffrole ${roles[Math.floor(Math.random()*roles.length)].id}`},
            {name: "Alias: **3**", value: `\`\`deletestaffrole\`\`, \`\`eliminarrolstaff\`\`, \`\`deletestaffr\`\`, `},
            {name: "Descripción:", value: `Elimina un rol anteriormente establecido como rol del personal del servidor en este servidor.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let dataSP = await sPuntos.findOne({_id: msg.guildId})
        let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0])

        const embError1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`En este servidor no se ha utilizado el sistema de puntos por lo tanto no hay roles del personal del servidor establecidos que puedas eliminar.`)
        .setColor(ColorError)
        .setTimestamp()
        if(!dataSP) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(et=> setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                et.delete().catch(c=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(rol){
            if(dataSP){
                let objeto = dataSP.datos
                objeto.comandosUsos++
                await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto})
        
                let descripciones = [`No hay roles establecidos como roles del personal del servidor en el sistema.`, `El rol proporcionado *(${rol})* es exclusivo para un bot por lo tanto no esta establecido como rol del personal de este servidor en el sistema.`, `El rol proporcionado *(${rol})* se el rol @everyone un rol invisible que todos tienen ese rol no esta registrado en el sistema.`, `El rol proporcionado *(${rol})* no se encontró registrado en el sistema, utiliza el comando \`\`${prefijo}pointsystemstatus\`\` el cual te mostrara cuales son los role registrados en el sistema.`]        
                let condicionales = [dataSP.datos.rolesPersonal.length==0, rol.managed, rol.id == msg.guildId, !dataSP.datos.rolesPersonal.some(s=> s == rol.id)]
                for(let r in descripciones){
                    if(condicionales[r]){
                        const embError = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[r])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError]}).then(et=> setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                et.delete().catch(c=>{
                                    return;
                                })
                            }, 30000))
                        }, 500)
                    }
                }

                for(let r in dataSP.datos.rolesPersonal){
                    if(dataSP.datos.rolesPersonal[r] == rol.id){
                        objeto.rolesPersonal.splice(r,1)
                    }
                }
                await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto})

                const embRemoveRolStaff = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                .setTitle(`${emojis.negativo} Se ha eliminado un rol`)
                .setDescription(`Se ha eliminado el rol ${rol} anterior mente establecido en el sistema como un rol del personal del servidor.`)
                .setColor("RED")
                .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRemoveRolStaff]})
                }, 500)
            }
        }else{
            let descripciones = [`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención o ID de un rol del servidor, proporciona una mención o ID valida de un rol.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado *(${args[0]})* tiene las características de una ID, es numérico, contiene **18** caracteres pero no es una **ID** de ningún rol del servidor.`]
            let condicionales = [isNaN(args[0]), args[0].length < 18, args[0].length > 18, true]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }

        datosComando.set(msg.author.id, tiempoActual)
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "añadirpuntos" || comando == "addpoints" || comando == "addp"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido:  Administrador")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("addpoints")){
            cooldowns.set("addpoints", new Discord.Collection())
        }

        const datosComando = cooldowns.get("addpoints"), tiempoActual = Date.now()

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *addpoints*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando addpoints`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}addpoints <Mención del miembro> <Puntos a dar>\`\`\n\`\`${prefijo}addpoints <ID del miembro> <Puntos a dar>\`\`\n\`\`${prefijo}addpoints <Etiqueta del miembro> <Puntos a dar>\`\``},
            {name: "Ejemplos:", value: `${prefijo}addpoints ${msg.author} ${Math.round(Math.random()*(200-1)+1)}\n${prefijo}addpoints ${msg.author.id} ${Math.round(Math.random(1)*200)}\n${prefijo}addpoints ${msg.author.tag} ${Math.round(Math.random(1)*200)}`},
            {name: "Alias: **3**", value: `\`\`addpoints\`\`, \`\`añadirpuntos\`\`, \`\`addp\`\`, `},
            {name: "Descripción:", value: `Agrega puntos a un miembro.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let dataSP = await sPuntos.findOne({_id: msg.guildId})

        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag == args[0])

        if(miembro){
            if(msg.author.id == msg.guild.ownerId){
                let descripciones = [`El miembro proporcionado *(${miembro})* soy yo, yo no puedo usar el sistema de puntos por lo tanto no me puedes agregar puntos.`, `El miembro proporcionado *(${miembro})* es un bot, los bots no pueden usar el sistema por lo tanto no le puedes agregar puntos.`, `No has proporcionado la cantidad de puntos a agregar al miembro.`, `El argumento proporcionado *(${args[1]})* no es numérico, debe de ser numérico ya que debe de ser la cantidad de puntos a agregar al miembro.`]
                let condicionales = [miembro.id == client.user.id, miembro.user.bot, !args[1], isNaN(args[1])]
        
                for(let i in descripciones){
                    if(condicionales[i]){
                        const embErr = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                let cantidad = Math.floor(args[1]), posicion = 0, puntosMiembro = 0

                if(dataSP){
                    let objeto = dataSP.datos
                    objeto.comandosUsos++
                    objeto.puntosAgregados+=cantidad

                    if(dataSP.miembros.some(s=> s.id == miembro.id)){
                        for(let i in dataSP.miembros){
                            if(dataSP.miembros[i].id == miembro.id){
                                puntosMiembro = dataSP.miembros[i].puntos
                                posicion = i
                            }
                        }

                        const embError1 = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El miembro ya tiene la máxima cantidad de puntos por miembro la cual es ${dataSP.datos.emoji} **${(1000000000).toLocaleString()}** puntos.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(puntosMiembro == 1000000000) return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)

                        const embError2 = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`La cantidad que has proporcionado excedería el limite de puntos del miembro, puedes agregar una cantidad igual o menor a ${dataSP.datos.emoji} **${(1000000000 - puntosMiembro).toLocaleString()}** puntos al miembro.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if((puntosMiembro+cantidad) > 1000000000) return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
            
                        let array = dataSP.miembros
                        array[posicion].puntos+=cantidad
                        await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})
            
                        if(miembro.id == msg.author.id){
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`<a:afirmativo:856966728806432778> Puntos agregados al miembro`)
                            .setDescription(`Se te han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos.`)
                            .setColor("GREEN")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()        
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400)
                        }else{
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`<a:afirmativo:856966728806432778> Puntos agregados al miembro`)
                            .setDescription(`Se le han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos a **${miembro}**.`)
                            .setColor("GREEN")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()        
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400)
                        } 

                    }else{
                        let array = dataSP.miembros
                        array.push({id: miembro.id, nombre: miembro.user.tag, puntos: cantidad})
                        await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})
        
                        if(miembro.id == msg.author.id){
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`<a:afirmativo:856966728806432778> Puntos agregados al miembro`)
                            .setDescription(`Se te han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos.`)
                            .setColor("GREEN")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()        
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400)
                        }else{
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`<a:afirmativo:856966728806432778> Puntos agregados al miembro`)
                            .setDescription(`Se le han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos a **${miembro}**.`)
                            .setColor("GREEN")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()        
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400)
                        }   
                    }

                }else{
                    if(miembro.id == msg.author.id){
                        let nuevaDataSP = new sPuntos({
                            _id: msg.guildId,
                            serverName: msg.guild.name,
                            datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: cantidad, puntosEliminados: 0, rolesPersonal: []},
                            miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: cantidad}]
                        })
                        await nuevaDataSP.save()

                        const embAddP = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`<a:afirmativo:856966728806432778> Puntos agregados al miembro`)
                        .setDescription(`Se te han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos.`)
                        .setColor("GREEN")
                        .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()        
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                        }, 400)
                    }else{
                        let nuevaDataSP = new sPuntos({
                            _id: msg.guildId,
                            serverName: msg.guild.name,
                            datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: cantidad, puntosEliminados: 0, rolesPersonal: []},
                            miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}, {id: miembro.id, nombre: miembro.user.tag, puntos: cantidad}]
                        })
                        await nuevaDataSP.save()

                        const embAddP = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`<a:afirmativo:856966728806432778> Puntos agregados al miembro`)
                        .setDescription(`Se le han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos a **${miembro}**.`)
                        .setColor("GREEN")
                        .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                        .setTimestamp()        
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                        }, 400)
                    }  
                }

            }else{
                let descripciones = [`El miembro proporcionado *(${miembro})* soy yo, yo no puedo usar el sistema de puntos por lo tanto no me puedes agregar puntos.`, `El miembro proporcionado *(${miembro})* es un bot, los bots no pueden usar el sistema por lo tanto no me puedes agregar puntos.`, `El miembro proporcionado *(${miembro})* es el dueño del servidor, no puedes agregarle puntos.`, `El rol mas alto del miembro proporcionado *(${miembro})* es igual o mayor a tu rol mas alto por lo tanto no le puedes agregar puntos.`, `No has proporcionado la cantidad de puntos a agregar al miembro.`, `El argumento proporcionado *(${args[1]})* no es numérico, debe de ser numérico ya que debe de ser la cantidad de puntos a agregar al miembro.`]
                let condicionales = [miembro.id == client.user.id, miembro.user.bot,  miembro.id == msg.guild.ownerId, msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<0, !args[1], isNaN(args[1])]
        
                for(let i in descripciones){
                    if(condicionales[i]){
                        const embErr = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                let cantidad = Math.floor(args[1]), posicion = 0, puntosMiembro = 0

                if(dataSP){
                    let objeto = dataSP.datos
                    objeto.comandosUsos++
                    objeto.puntosAgregados+=cantidad

                    if(dataSP.miembros.some(s=> s.id === miembro.id)){
                        for(let i in dataSP.miembros){
                            if(dataSP.miembros[i].id === miembro.id){
                                puntosMiembro = dataSP.miembros[i].puntos
                                posicion = i
                            }
                        }

                        const embError1 = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El miembro ya tiene la máxima cantidad de puntos por miembro la cual es ${dataSP.datos.emoji} **${(1000000000).toLocaleString()}** puntos.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(puntosMiembro == 1000000000) return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)

                        const embError2 = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`La cantidad que has proporcionado excedería  el limite de puntos del miembro, puedes agregar una cantidad igual o menor a ${dataSP.datos.emoji} **${(1000000000 - puntosMiembro).toLocaleString()}** puntos al miembro.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if((puntosMiembro+cantidad) > 1000000000) return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
            
                        let array = dataSP.miembros
                        array[posicion].puntos+=cantidad
                        await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})

                        if(miembro.id == msg.author.id){
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`<a:afirmativo:856966728806432778> Puntos agregados al miembro`)
                            .setDescription(`Se te han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos.`)
                            .setColor("GREEN")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()        
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400)
                        }else{
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`<a:afirmativo:856966728806432778> Puntos agregados al miembro`)
                            .setDescription(`Se le han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos a **${miembro}**.`)
                            .setColor("GREEN")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()        
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400)
                        }    

                    }else{
                        let array = dataSP.miembros
                        array.push({id: miembro.id, nombre: miembro.user.tag, puntos: cantidad})
                        await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})
        
                        if(miembro.id == msg.author.id){
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`<a:afirmativo:856966728806432778> Puntos agregados al miembro`)
                            .setDescription(`Se te han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos.`)
                            .setColor("GREEN")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()        
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400)
                        }else{
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`<a:afirmativo:856966728806432778> Puntos agregados al miembro`)
                            .setDescription(`Se le han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos a **${miembro}**.`)
                            .setColor("GREEN")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()        
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400)
                        }  
                    }

                }else{
                    if(miembro.id == msg.author.id){
                        let nuevaDataSP = new sPuntos({
                            _id: msg.guildId,
                            serverName: msg.guild.name,
                            datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: cantidad, puntosEliminados: 0, rolesPersonal: []},
                            miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: cantidad}]
                        })
                        await nuevaDataSP.save()

                        const embAddP = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`<a:afirmativo:856966728806432778> Puntos agregados al miembro`)
                        .setDescription(`Se te han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos.`)
                        .setColor("GREEN")
                        .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()        
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                        }, 400)
                    }else{
                        let nuevaDataSP = new sPuntos({
                            _id: msg.guildId,
                            serverName: msg.guild.name,
                            datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: cantidad, puntosEliminados: 0, rolesPersonal: []},
                            miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}, {id: miembro.id, nombre: miembro.user.tag, puntos: cantidad}]
                        })
                        await nuevaDataSP.save()

                        const embAddP = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`<a:afirmativo:856966728806432778> Puntos agregados al miembro`)
                        .setDescription(`Se le han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos a **${miembro}**.`)
                        .setColor("GREEN")
                        .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                        .setTimestamp()        
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                        }, 400)
                    }  
                }
            }
        }else{
            let descripciones = [`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado *(${args[0]})* tiene las características de una ID, es numérico, contiene **18** caracteres pero no es una ID de ningún miembro del servidor.`]
            let condicionales = [isNaN(args[0]), args[0].length < 18, args[0].length > 18, true]

            for(let i in descripciones){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }

        datosComando.set(msg.author.id, tiempoActual)
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "quitarpuntos" || comando == "removepoints" || comando == "removep"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido:  Administrador")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("removepoints")){
            cooldowns.set("removepoints", new Discord.Collection())
        }

        const tiempoActual = Date.now(), datosComando = cooldowns.get("removepoints")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *removepoints*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando removepoints`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}removepoints <Mención del miembro> <Puntos a eliminar>\`\`\n\`\`${prefijo}removepoints <ID del miembro> <Puntos a eliminar>\`\`\n\`\`${prefijo}removepoints <Etiqueta del miembro> <Puntos a eliminar>\`\``},
            {name: "Ejemplos: **3**", value: `${prefijo}removepoints ${msg.author} ${Math.round(Math.random(1)*200)}\n${prefijo}removepoints ${msg.author.id} ${Math.round(Math.random(1)*200)}\n${prefijo}removepoints ${msg.author.tag} ${Math.round(Math.random(1)*200)}`},
            {name: "Alias: **3**", value: `\`\`removepoints\`\`, \`\`quitarpuntos\`\`, \`\`removep\`\`, `},
            {name: "Descripción:", value: `Elimina puntos de un miembro.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let dataSP = await sPuntos.findOne({_id: msg.guildId})
        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag == args[0])

        if(miembro){
            if(msg.author.id == msg.guild.ownerId){
                let descripciones = [`El miembro proporcionado *(${miembro})* soy yo, yo no puedo usar el sistema de puntos por lo tanto no tengo puntos que me puedas eliminar.`, `El miembro proporcionado *(${miembro})* es un bot, los bots no pueden usar el sistema por lo tanto no tiene puntos que le puedas eliminar.`, `No has proporcionado la cantidad de puntos a eliminar del miembro.`, `El argumento proporcionado *(${args[1]})* no es numérico, debe de ser numérico ya que debe de ser la cantidad de puntos a eliminar del miembro.`]
                let condicionales = [miembro.id == client.user.id, miembro.user.bot, !args[1], isNaN(args[1])]
        
                for(let i in descripciones){
                    if(condicionales[i]){
                        const embErr = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                let cantidad = Math.floor(args[1]), posicion = 0, puntosMiembro = 0

                if(dataSP){
                    let objeto = dataSP.datos
                    objeto.comandosUsos++
                    objeto.puntosEliminados+=cantidad

                    if(dataSP.miembros.some(s=> s.id == miembro.id)){
                        for(let i in dataSP.miembros){
                            if(dataSP.miembros[i].id == miembro.id){
                                puntosMiembro = dataSP.miembros[i].puntos
                                posicion = i
                            }
                        }

                        const embError1 = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El miembro ya tiene la máxima cantidad de puntos negativos por miembro la cual es ${dataSP.datos.emoji} **${(-1000000000).toLocaleString()}** puntos.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(puntosMiembro == -1000000000) return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)

                        const embError2 = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`La cantidad que has proporcionado excedería el limite de puntos negativos del miembro, puedes eliminar una cantidad igual o menor a **${(-1000000000 - puntosMiembro).toLocaleString()}** del miembro.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if((puntosMiembro-cantidad) < -1000000000) return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
            
                        let array = dataSP.miembros
                        array[posicion].puntos-=cantidad
                        await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})
            
                        if(miembro.id == msg.author.id){
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                            .setDescription(`Se te han eliminado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos.`)
                            .setColor("RED")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400) 
                        }else{
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                            .setDescription(`Se le han eliminado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos a **${miembro}**.`)
                            .setColor("RED")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400) 
                        }  

                    }else{
                        let array = dataSP.miembros
                        array.push({id: miembro.id, nombre: miembro.user.tag, puntos: -cantidad})
                        await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})
        
                        if(miembro.id == msg.author.id){
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                            .setDescription(`Se te han eliminado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos.`)
                            .setColor("RED")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400) 
                        }else{
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                            .setDescription(`Se le han eliminado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos a **${miembro}**.`)
                            .setColor("RED")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400) 
                        }
                    }

                }else{
                    if(miembro.id == msg.author.id){
                        let nuevaDataSP = new sPuntos({
                            _id: msg.guildId,
                            serverName: msg.guild.name,
                            datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: cantidad, rolesPersonal: []},
                            miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: -cantidad}]
                        })
                        await nuevaDataSP.save()

                        const embAddP = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                        .setDescription(`Se te han eliminado ${emojis.puntos} **${cantidad.toLocaleString()}** puntos.`)
                        .setColor("RED")
                        .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                        }, 400) 
                    }else{
                        let nuevaDataSP = new sPuntos({
                            _id: msg.guildId,
                            serverName: msg.guild.name,
                            datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: cantidad, rolesPersonal: []},
                            miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}, {id: miembro.id, nombre: miembro.user.tag, puntos: -cantidad}]
                        })
                        await nuevaDataSP.save()

                        const embAddP = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                        .setDescription(`Se le han eliminado ${emojis.puntos} **${cantidad.toLocaleString()}** puntos a **${miembro}**.`)
                        .setColor("RED")
                        .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                        }, 400) 
                    }
                }

            }else{
                let descripciones = [`El miembro proporcionado *(${miembro})* soy yo, yo no puedo usar el sistema de puntos por lo tanto no tengo puntos que me puedas eliminar.`, `El miembro proporcionado *(${miembro})* es un bot, los bots no pueden usar el sistema por lo tanto no tiene puntos que le puedas eliminar.`, `El miembro proporcionado *(${miembro})* es el dueño del servidor, no puedes eliminarle puntos.`, `El rol mas alto del miembro proporcionado *(${miembro})* es igual o mayor a tu rol mas alto por lo tanto no le puedes eliminar puntos.`, `No has proporcionado la cantidad de puntos a eliminar del miembro.`, `El argumento proporcionado *(${args[1]})* no es numérico, debe de ser numérico ya que debe de ser la cantidad de puntos a eliminar del miembro.`]
                let condicionales = [miembro.id == client.user.id, miembro.user.bot,  miembro.id == msg.guild.ownerId, msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<=0, !args[1], isNaN(args[1])]
        
                for(let i in descripciones){
                    if(condicionales[i]){
                        const embErr = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[i])
                        .setColor(ColorError)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                let cantidad = Math.floor(args[1]), posicion = 0, puntosMiembro = 0

                if(dataSP){
                    let objeto = dataSP.datos
                    objeto.comandosUsos++
                    objeto.puntosEliminados+=cantidad

                    if(dataSP.miembros.some(s=> s.id == miembro.id)){
                        for(let i in dataSP.miembros){
                            if(dataSP.miembros[i].id == miembro.id){
                                puntosMiembro = dataSP.miembros[i].puntos
                                posicion = i
                            }
                        }

                        const embError1 = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El miembro ya tiene la máxima cantidad de puntos negativos por miembro la cual es ${dataSP.datos.emoji} **${(-1000000000).toLocaleString()}** puntos.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if(puntosMiembro == -1000000000) return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)

                        const embError2 = new Discord.MessageEmbed()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`La cantidad que has proporcionado excedería el limite de puntos negativos del miembro, puedes eliminar una cantidad igual o menor a **${(-1000000000 - puntosMiembro).toLocaleString()}** del miembro.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if((puntosMiembro-cantidad) < -1000000000) return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError2]}).then(dt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                dt.delete().catch(e=>{
                                    return;
                                })
                            }, 30000));
                        }, 500)
            
                        let array = dataSP.miembros
                        array[posicion].puntos-=cantidad
                        await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})
            
                        if(miembro.id == msg.author.id){
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                            .setDescription(`Se te han eliminado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos.`)
                            .setColor("RED")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400) 
                        }else{
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                            .setDescription(`Se le han eliminado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos a **${miembro}**.`)
                            .setColor("RED")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400) 
                        }  

                    }else{
                        let array = dataSP.miembros
                        array.push({id: miembro.id, nombre: miembro.user.tag, puntos: -cantidad})
                        await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})
        
                        if(miembro.id == msg.author.id){
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                            .setDescription(`Se te han eliminado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos.`)
                            .setColor("RED")
                            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400) 
                        }else{
                            const embAddP = new Discord.MessageEmbed()
                            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                            .setDescription(`Se le han eliminado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos a **${miembro}**.`)
                            .setColor("RED")
                            .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                            .setTimestamp()
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                            }, 400) 
                        }
                    }

                }else{
                    if(miembro.id == msg.author.id){
                        let nuevaDataSP = new sPuntos({
                            _id: msg.guildId,
                            serverName: msg.guild.name,
                            datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: cantidad, rolesPersonal: []},
                            miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: -cantidad}]
                        })
                        await nuevaDataSP.save()
                        
                        const embAddP = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                        .setDescription(`Se te han eliminado ${emojis.puntos} **${cantidad.toLocaleString()}** puntos.`)
                        .setColor("RED")
                        .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                        }, 400)
                    }else{
                        let nuevaDataSP = new sPuntos({
                            _id: msg.guildId,
                            serverName: msg.guild.name,
                            datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: cantidad, rolesPersonal: []},
                            miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}, {id: miembro.id, nombre: miembro.user.tag, puntos: -cantidad}]
                        })
                        await nuevaDataSP.save()

                        const embAddP = new Discord.MessageEmbed()
                        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                        .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                        .setDescription(`Se le han eliminado ${emojis.puntos} **${cantidad.toLocaleString()}** puntos a **${miembro}**.`)
                        .setColor("RED")
                        .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embAddP]})
                        }, 400) 
                    }
                }
            }
        }else{
            let descripciones = [`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado *(${args[0]})* tiene las características de una ID, es numérico, contiene **18** caracteres pero no es una ID de ningún miembro del servidor.`]
            let condicionales = [isNaN(args[0]), args[0].length < 18, args[0].length > 18, !msg.guild.members.cache.find(f=> f.id == args[0])]

            for(let i in descripciones){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }

        datosComando.set(msg.author.id, tiempoActual)
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "pointsleaderboard" || comando == "toppoints" || comando == "topp"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let dataSP = await sPuntos.findOne({_id: msg.guildId})

        if(dataSP){
            let objeto = dataSP.datos
            objeto.comandosUsos++
            await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto})
            
            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`No puedes usar este comando ya que no eres miembro del personal del servidor.`)
            .setColor(ColorError)
            .setTimestamp()
            if(dataSP.datos.rolesPersonal.length >= 1 && !dataSP.datos.rolesPersonal.some(s=> msg.member.roles.cache.has(s))) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(dt => setTimeout(()=>{
                    msg.delete().catch(c=>{
                        return;
                    })
                    dt.delete().catch(e=>{
                        return;
                    })
                }, 30000));
            }, 500)

            const embed = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`No hay ningún miembro en la base de datos del sistema de puntos de este servidor, para saber mas sobre el sistema utiliza el comando \`\`${prefijo}pointsinfo\`\`.`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(msg.guild.name, msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            if(dataSP.miembros.length <= 0) return setTimeout(()=> {
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})
            }, 500)
    
            let ordenPs = [], top = []
            for(let i in dataSP.miembros){
                let usuario = client.users.cache.get(dataSP.miembros[i].id)
                if(usuario){
                    ordenPs.push({id: usuario.id, puntos: dataSP.miembros[i].puntos})
                }
            }
            ordenPs.sort((a, b) => b.puntos - a.puntos)


            
            for(let i in ordenPs){
                let usuario = client.users.cache.get(ordenPs[i].id)
                if(usuario){
                    top.push(`**${Number(i)+1}.** [${usuario.tag}](${usuario.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})}) - ${dataSP.datos.emoji} **${ordenPs[i].puntos}**\n<@${usuario.id}>`)
                }
            }    
    
            let segPage 
            if(String(ordenPs.length).slice(-1) === "0"){
                segPage = Math.floor(ordenPs.length / 10)
            }else{
                segPage = Math.floor(ordenPs.length / 10 + 1)
            }
    
            if(segPage <= 1){
                const embTopP = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(0,10).join("\n\n")}`)
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(`Pagina - 1/${segPage}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embTopP]})
                })
            }else{
                let cps1 = 0, cps2 = 10, pagina = 1 
    
                const embTopP = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(cps1,cps2).join("\n\n")}`)
                .setColor(msg.guild.me.displayHexColor)
                .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
        
                const botones1 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente ")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )
    
                const botones2 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("PRIMARY")
                    ]
                )
    
                const botones3 = new Discord.MessageActionRow()
                .setComponents(
                    [
                        new Discord.MessageButton()
                        .setCustomId("1")
                        .setLabel("Anterior")
                        .setEmoji("<a:LeftArrow:942155020017754132>")
                        .setStyle("PRIMARY")
                    ],
                    [
                        new Discord.MessageButton()
                        .setCustomId("2")
                        .setLabel("Siguiente")
                        .setEmoji("<a:RightArrow:942154978859044905>")
                        .setStyle("SECONDARY")
                        .setDisabled(true)
                    ]
                )
    
                setTimeout(async () => {
                    const mensajeSend = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embTopP], components: [botones1]})
                    const filtro = i=> i.user.id === msg.author.id;
                    const colector = mensajeSend.createMessageComponentCollector({filter: filtro, time: segPage*60000})
        
                    setTimeout(()=>{
                        mensajeSend.edit({embeds: [embTopP], components: []})
                    }, segPage*60000)
        
                    colector.on("collect", async botn => {
                        if(botn.customId === "1"){
                            if(cps2 - 10 <= 10){
                                cps1-=10, cps2-=10, pagina--
        
                                embTopP
                                .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(cps1,cps2).join("\n\n")}`)
                                .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                                await botn.update({embeds: [embTopP], components: [botones1]})
                            }else{
                                cps1-=10, cps2-=10, pagina--
        
                                embTopP
                                .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(cps1,cps2).join("\n\n")}`)
                                .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                                await botn.update({embeds: [embTopP], components: [botones2]})
                            }
                        }
                        if(botn.customId === "2"){
                            if(cps2 + 10 >= ordenPs.length){
                                cps1+=10, cps2+=10, pagina++
        
                                embTopP
                                .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(cps1,cps2).join("\n\n")}`)
                                .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                                await botn.update({embeds: [embTopP], components: [botones3]})
                            }else{
                                cps1+=10, cps2+=10, pagina++
        
                                embTopP
                                .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(cps1,cps2).join("\n\n")}`)
                                .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                                await botn.update({embeds: [embTopP], components: [botones2]})
                            }
                        }
                    })
                })
            }
        }else{
            nuevaDataSP = new sPuntos({
                _id: msg.guildId,
                serverName: msg.guild.name,
                datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: []},
                miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}]
            })

            const embed = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
            .setDescription(`No se ha registrado ningún miembro de este servidor al sistema de puntos, para saber mas del sistema utiliza el comando \`\`${prefijo}pointsinfo\`\`.`)
            .setColor(msg.guild.me.displayHexColor)
            await nuevaDataSP.save()
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})
            }, 500)
        }
    }

    if(comando == "setemojipoints" || comando == "setemojip" || comando == "setep"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        let dataSP = await sPuntos.findOne({_id: msg.guildId})
        let emojis = msg.guild.emojis.cache.map(e=>e)

        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido:  Administrador")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("setemojipoints")){
            cooldowns.set("setemojipoints", new Discord.Collection())
        }

        const datosComando = cooldowns.get("setemojipoints"), tiempoActual = Date.now()

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *setemojipoints*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando setemojipoints`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}setemojipoints <Emoji a establecer>\`\``},
            {name: "Ejemplo:", value: `${prefijo}setemojipoints ${emojis[Math.floor(Math.random()*emojis.length)]}`},
            {name: "Alias: **3**", value: `\`\`setemojipoints\`\`, \`\`setemojip\`\`, \`\`setep\`\`, `},
            {name: "Descripción:", value: `Establece un emoji como símbolo para el sistema de puntos.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let descripciones = [`No puedes establecer números como símbolo del sistema de puntos.`, `El argumento proporcionado *(${args[0]})* no es un emoji.`, `El argumento proporcionado *(${args[0]})* es un emoji de un servidor el cual no estoy por lo tanto no puedes establecerlo como símbolo del sistema.`]
        let condicionales = [!isNaN(args[0]), !/\p{Emoji}/gu.test(args[0]), !msg.guild.emojis.cache.find(f=> f.id == args[0].split(":")[2].split(">")[0])]

        for(let i=0; i<descripciones.length; i++){
            if(condicionales[i]){
                const embErr = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(descripciones[i])
                .setColor(ColorError)
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        dt.delete().catch(e=>{
                            return;
                        })
                    }, 30000));
                }, 500)
            }
        }

        if(dataSP){
            let objeto = dataSP.datos
            objeto.comandosUsos++
            objeto.emoji = args[0]
            await sPuntos.findByIdAndUpdate(msg.guildId,{serverName: msg.guild.name, datos: objeto})
    
            const embSetE = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("<a:afirmativo:856966728806432778> Símbolo establecido")
            .setDescription(`El emoji ${args[0]} se a establecido como símbolo del sistema de puntos.`)
            .setColor("GREEN")
            .setTimestamp()
            setTimeout(()=> {
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embSetE]})
            }, 400)
        }else{
            let nuevaDataSP = new sPuntos({
                _id: msg.guildId,
                serverName: msg.guild.name,
                datos: {emoji: args[0], comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: []},
                miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}]
            })

            const embSetE = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle("<a:afirmativo:856966728806432778> Símbolo establecido")
            .setDescription(`El emoji ${args[0]} se a establecido como el símbolo del sistema de puntos.`)
            .setColor("GREEN")
            .setTimestamp()
            await nuevaDataSP.save()
            setTimeout(()=> {
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embSetE]})
            }, 400)
        }

        datosComando.set(msg.author.id, tiempoActual)
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }

    if(comando == "pointsystemstatus" || comando == "pointstatus" || comando == "psystemstatus" || comando == "pss"){
        msg.channel.sendTyping()
        botDB.comandos.usos++

        let dataSP = await sPuntos.findOne({_id: msg.guildId})

        if(dataSP){
            let objeto = dataSP.datos
            objeto.comandosUsos++
            await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto})
            let totalPuntos = dataSP.datos.puntosAgregados+dataSP.datos.puntosEliminados
            
            const embPointsSystem = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`<:status:957353077650886716> Estado del sistema de puntos`)
            .addFields(
                {name: `👥 **Miembros que han utilizado el sistema:**`, value: `**${dataSP.miembros.length.toLocaleString()}**`, inline: true},
                {name: `🔢 **Comandos del sistema usados:**`, value: `**${dataSP.datos.comandosUsos.toLocaleString()}**`, inline: true},
                {name: `${dataSP.datos.emoji} **Puntos agregados y eliminados:** ${totalPuntos.toLocaleString()}`, value: `${totalPuntos >=1 ? `Agregados: **${dataSP.datos.puntosAgregados}** | ${(dataSP.datos.puntosAgregados*100/totalPuntos).toFixed(2)}%\nEliminados: **${dataSP.datos.puntosEliminados}** | ${(dataSP.datos.puntosEliminados*100/totalPuntos).toFixed(2)}%`: "*No se ha agregado ni eliminado ningún punto*"}`, inline: true},
                {name: `❓ **Símbolo del sistema:**`, value: `${dataSP.datos.emoji == emojis.puntos ? `*Predeterminado: ${emojis.puntos}*`: `Personalizado: ${dataSP.datos.emoji}`}`, inline: true},
                {name: `👮 **Roles del personal:** ${dataSP.datos.rolesPersonal.length >= 1 ? dataSP.datos.rolesPersonal.length: ""}`, value: `${dataSP.datos.rolesPersonal.length >= 1 ? dataSP.datos.rolesPersonal.map(m=> `<@&${m}>`).join(", ") : `*Sin roles*`}`, inline: true},
                // {name: ``, value: ``, inline: true},
            )
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embPointsSystem]})
            }, 500)

        }else{
            let nuevaDataSP = new sPuntos({
                _id: msg.guildId,
                serverName: msg.guild.name,
                datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: []},
                miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}]
            })
            await nuevaDataSP.save()

            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`No tengo datos sobre el sistema de puntos en este servidor ya que no se a utilizado el sistema en este servidor.`)
            .setColor(ColorError)
            .setTimestamp()
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                }, 30000))
            }, 500)
        }
    }

    if(comando == "updatepointssystem" || comando == "updatepsystem" || comando == "updateps"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido:  Administrador")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        let dataSP = await sPuntos.findOne({_id: msg.guildId})

        if(dataSP){
            let objeto = dataSP.datos
            objeto.comandosUsos++
            let array = dataSP.miembros
           
            let falsosMiembros = array.filter(f=> !msg.guild.members.cache.get(f.id))

            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`No hay usuarios en el sistema que no estén en el servidor.`)
            .setColor(ColorError)
            .setTimestamp()
            if(falsosMiembros.length <= 0) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                }, 30000))
            }, 500)

            falsosMiembros.map(m=> {
                array.splice(array.indexOf(m.id),1) 
            })
            await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})

            const embUpdateSistemP = new Discord.MessageEmbed()
            .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`${emojis.acierto} Sistema actualizado`)
            .setDescription(`Se han eliminado datos de **${falsosMiembros.length.toLocaleString()}** usuarios que no se encontraron en el servidor.`)
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embUpdateSistemP]})
            }, 400)
        }else{

            let nuevaDataSP = new sPuntos({
                _id: msg.guildId,
                serverName: msg.guild.name,
                datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: []},
                miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}]
            })
            await nuevaDataSP.save()

            const embError1 = new Discord.MessageEmbed()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`No hay usuarios en el sistema que no estén en el servidor.`)
            .setColor(ColorError)
            .setTimestamp()
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                }, 30000))
            }, 500)
        }
    }

    if(comando == "removeusersystemp"){
        msg.channel.sendTyping()
        botDB.comandos.usos++
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojis.negativo} Error`)
        .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
        .setColor(ColorError)
        .setFooter("Permiso requerido:  Administrador")
        .setTimestamp()
        if(!msg.member.permissions.has("ADMINISTRATOR")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                msg.delete().catch(t=>{
                    return;
                })
                tm.delete().catch(t=>{
                    return;
                })
            }, 30000))
        }, 500)

        if(!cooldowns.has("removeusersystemp")){
            cooldowns.set("removeusersystemp", new Discord.Collection())
        }

        const tiempoActual = Date.now(), datosComando = cooldowns.get("removeusersystemp")

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new Discord.MessageEmbed()
            .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *removeusersystemp*")
            .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo) return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEnfriarse]}).then(tf=> setTimeout(()=>{
                    tf.delete().catch(c=>{
                        return;
                    })
                    msg.delete().catch(c=>{
                        return;
                    })
                }, tiempoUltimo - tiempoActual))
            }, 500)
        }

        const embInfo = new Discord.MessageEmbed()
        .setTitle(`${emojis.lupa} Comando removeusersystemp`)
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}removeusersystemp <Mención del miembro>\`\`\n\`\`${prefijo}removeusersystemp <ID del miembro>\`\`\n\`\`${prefijo}removeusersystemp <Etiqueta del miembro>\`\``},
            {name: "Ejemplos:", value: `${prefijo}removeusersystemp ${msg.author}\n${prefijo}removeusersystemp ${msg.author.id}\n${prefijo}removeusersystemp ${msg.author.tag}`},
            {name: "Alias:", value: `\`\`removeusersystemp\`\``},
            {name: "Descripción:", value: `Elimina al miembro proporcionado del sistema de puntos.`}
        )
        .setColor(colorEmbInfo)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 500)

        let dataSP = await sPuntos.findOne({_id: msg.guildId})
        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f=> f.user.tag == args[0])

        if(miembro){
            if(msg.author.id == msg.guild.ownerId){
                if(dataSP){
                    let objeto = dataSP.datos
                    objeto.comandosUsos++

                    let descripciones = [`El miembro proporcionado *(${miembro})* soy yo, yo no estoy  en el sistema de puntos.`, `El miembro proporcionado *(${miembro})* es un bot, un bot no puede estar en el sistema de puntos.`, `El miembro proporcionado *(${miembro})* no esta en el sistema de puntos.`]
                    let condicionales = [miembro.id == client.user.id, miembro.user.bot, !dataSP.miembros.some(s=> s.id == miembro.id)]
                    for(let i in descripciones){
                        if(condicionales[i]){
                            const embErr = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }
    
                    let posicion = 0, puntos = 0
                    for(let i in dataSP.miembros){
                        if(dataSP.miembros[i].id === miembro.id){
                            posicion = i
                            puntos = dataSP.miembros[i].puntos
                        }
                    }
    
                    let array = dataSP.miembros
                    array.splice(posicion,1)
                    await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})
    
                    const embRemoveUserSystem = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("🗑️ Miembro eliminado del sistema")
                    .setDescription(`El miembro ${miembro} ha sido eliminado del sistema de puntos en el cual tenia ${dataSP.datos.emoji} **${puntos.toLocaleString()}** puntos.`)
                    .setColor(msg.guild.me.displayHexColor)
                    .setFooter(miembro.nickname ? miembro.nickname: miembro.user.username, miembro.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRemoveUserSystem]})
                    }, 500)

                }else{
                    const embError1 = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`El miembro proporcionado *(${miembro})* no esta en el sistema de puntos.`)
                    .setColor(ColorError)
                    .setTimestamp()

                    let nuevaDataSP = new sPuntos({
                        _id: msg.guildId,
                        serverName: msg.guild.name,
                        datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: []},
                        miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}]
                    })
                    await nuevaDataSP.save()

                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(te=> setTimeout(()=>{
                            te.delete().catch(c=> {
                                console.error(c)
                            })
                            msg.delete().catch(c=> {
                                console.error(c)
                            })
                        }, 30000))
                    }, 400)
                }

            }else{
                if(dataSP){
                    let objeto = dataSP.datos
                    objeto.comandosUsos++

                    let descripciones = [`El miembro proporcionado *(${miembro})* soy yo, yo no estoy  en el sistema de puntos.`, `El miembro proporcionado *(${miembro})* eres tu mismo, no te puedes eliminar a ti mismo del sistema.`, `El miembro proporcionado *(${miembro})* es el dueño del servidor, no lo puedes eliminar del sistema.`, `El miembro proporcionado *(${miembro})* es un bot, un bot no puede estar en el sistema de puntos.`, `El miembro proporcionado *(${miembro})* tiene un rol igual o mayor que tu rol mas alto por lo tanto no lo puedes eliminar del sistema.`, `El miembro proporcionado *(${miembro})* no esta en el sistema de puntos.`]
                    let condicionales = [miembro.id == client.user.id, miembro.id == msg.author.id, miembro.id == msg.guild.ownerId, miembro.user.bot, msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<=0, !dataSP.miembros.some(s=> s.id == miembro.id)]

                    for(let i=0; i<descripciones.length; i++){
                        if(condicionales[i]){
                            const embErr = new Discord.MessageEmbed()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                            return setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                                    msg.delete().catch(c=>{
                                        return;
                                    })
                                    dt.delete().catch(e=>{
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    let posicion = 0, puntos = 0
                    for(let i in dataSP.miembros){
                        if(dataSP.miembros[i].id == miembro.id){
                            posicion = i
                            puntos = dataSP.miembros[i].puntos
                        }
                    }

                    let array = dataSP.miembros
                    array.splice(posicion,1)
                    await sPuntos.findByIdAndUpdate(msg.guildId, {datos: objeto, miembros: array})

                    const embRemoveUserSystem = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("🗑️ Miembro eliminado del sistema")
                    .setDescription(`El miembro ${miembro} ha sido eliminado del sistema de puntos en el cual tenia ${dataSP.datos.emoji} **${puntos.toLocaleString()}** puntos.`)
                    .setColor(msg.guild.me.displayHexColor)
                    .setTimestamp()
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embRemoveUserSystem]})
                    }, 400)

                }else{
                    const embError1 = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`El miembro proporcionado *(${miembro})* no esta en el sistema de puntos.`)
                    .setColor(ColorError)
                    .setTimestamp()

                    let nuevaDataSP = new sPuntos({
                        _id: msg.guildId,
                        serverName: msg.guild.name,
                        datos: {emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: []},
                        miembros: [{id: msg.author.id, nombre: msg.author.tag, puntos: 0}]
                    })
                    await nuevaDataSP.save()

                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embError1]}).then(te=> setTimeout(()=>{
                            te.delete().catch(c=> {
                                console.error(c)
                            })
                            msg.delete().catch(c=> {
                                console.error(c)
                            })
                        }, 30000))
                    }, 400)
                }
            }
        }else{
            let descripciones = [`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado *(${args[0]})* tiene las caracteristicas de una **ID**, es numérico, contiene **18** caracteres pero no coresponde con la **ID** de ningun miembro del servidor.`]
            let condicionales = [isNaN(args[0]), args[0].length < 18, args[0].length > 18, !msg.guild.members.cache.find(f=> f.id == args[0])]

            for(let i=0; i<descripciones.length; i++){
                if(condicionales[i]){
                    const embErr = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(descripciones[i])
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr]}).then(dt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            dt.delete().catch(e=>{
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }
        }

        datosComando.set(msg.author.id, tiempoActual);
        setTimeout(()=>{
            datosComando.delete(msg.author.id)
        }, 60000)
    }



    // 👑 Comandos para el creador
    if(comando == "crearinvite" || comando == "crearinv" || comando == "crinv" && creadoresID.some(s=>s==msg.author.id)){
        msg.channel.sendTyping()
        let servidor = client.guilds.cache.get(args[0]), canal = client.channels.cache.get(args[0])

        if(servidor){
            let canalesCrearInv = servidor.channels.cache.filter(f=> f.type == "GUILD_TEXT" && servidor.me.permissionsIn(f).has("CREATE_INSTANT_INVITE")).map(m=>m)
            if(canalesCrearInv.length > 0){
                canalesCrearInv[0].createInvite({maxAge: 0, reason: "Mi creador quiere visitar este servidor."}).then(invi=> setTimeout(()=>{
                    msg.channel.send({content: `La invitacion se creo y es:\n${invi}`})
                }, 400))
            }else{
                const embErrP1 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`En el servidor que has proporcionado no tengo permiso en ningún canal para crear una invitación.`)
                .setColor(ColorError)
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete().catch(t=>{
                            return;
                        })
                    }, 20000))
                }, 400) 
            }
        }else{
            if(canal){
                let servidorDelCanal = client.guilds.cache.get(canal.guildId)

                const embErrP1 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`El canal que has proporcionado *(${canal.name})* del servidor ${servidorDelCanal.name} no es un canal de texto por lo tanto no puedo crear una invitación en el.`)
                .setColor(ColorError)
                .setTimestamp()
                if(!canal.type == "GUILD_TEXT") return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete().catch(t=>{
                            return;
                        })
                    }, 20000))
                }, 400) 

                if(servidorDelCanal.me.permissionsIn(canal).has("CREATE_INSTANT_INVITE")){
                    canal.createInvite({maxAge: 0, reason: "Mi creador quiere visitar este servidor."}).then(invi=> setTimeout(()=>{
                        msg.channel.send({content: `La invitacion se creo y es:\n${invi}`})
                    }, 400))
                }else{
                    const embErrP1 = new Discord.MessageEmbed()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`En el canal que has proporcionado el cual es del servidor ${servidorDelCanal.name} no tengo permisos para crear una invitación.`)
                    .setColor(ColorError)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                            msg.delete().catch(t=>{
                                return;
                            })
                            tm.delete().catch(t=>{
                                return;
                            })
                        }, 20000))
                    }, 400) 
                }
            }else{
                const embErrP1 = new Discord.MessageEmbed()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No encontré el servidor o el canal que has proporcionado, recuerda que debes de proporcionar una **ID** valida de uno de los dos.`)
                .setColor(ColorError)
                .setTimestamp()
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(t=>{
                            return;
                        })
                        tm.delete().catch(t=>{
                            return;
                        })
                    }, 20000))
                }, 400)
            }
        }
    }

    if(comando == "serverinfo" || comando == "svinfo" && creadoresID.some(s=>s == msg.author.id)){
        msg.channel.sendTyping()
        let servidor = client.guilds.cache.get(args[0])
        let permisos = {
            'CREATE_INSTANT_INVITE': "Crear invitación",
            'KICK_MEMBERS': "Expulsar miembros",
            'BAN_MEMBERS': "Banear miembros",
            'ADMINISTRATOR': "Administrador",
            'MANAGE_CHANNELS': "Gestionar canales",
            'MANAGE_GUILD': "Gestionar servidor",
            'ADD_REACTIONS': "Añadir reacciones",
            'VIEW_AUDIT_LOG': "Ver registro de auditoría",
            'PRIORITY_SPEAKER': "Prioridad de palabra",
            'STREAM': "Vídeo",
            'VIEW_CHANNEL': "Ver canales",
            'SEND_MESSAGES': "Enviar mensajes",
            'SEND_TTS_MESSAGES': "Enviar mensajes de texto a voz",
            'MANAGE_MESSAGES': "Gestionar mensajes",
            'EMBED_LINKS': "Insertar enlaces",
            'ATTACH_FILES': "Adjuntar archivos",
            'READ_MESSAGE_HISTORY': "Leer el historial de mensajes",
            'MENTION_EVERYONE': "Mencionar todos los roles",
            'USE_EXTERNAL_EMOJIS': "Usar emojis externos",
            'VIEW_GUILD_INSIGHTS': "Ver información del servidor",
            'CONNECT': "Conectar",
            'SPEAK': "Hablar",
            'MUTE_MEMBERS': "Silenciar miembros",
            'DEAFEN_MEMBERS': "Ensordecer miembros",
            'MOVE_MEMBERS': "Mover miembros",
            'USE_VAD': "Usar actividad de voz",
            'CHANGE_NICKNAME': "Cambiar apodo",
            'MANAGE_NICKNAMES': "Gestionar apodos",
            'MANAGE_ROLES': "Gestionar roles",
            'MANAGE_WEBHOOKS': "Gestionar webhooks",
            'MANAGE_EMOJIS_AND_STICKERS': "Gestionar emojis y pegatinas",
            'USE_APPLICATION_COMMANDS': "Usar comandos de aplicaciones",
            'REQUEST_TO_SPEAK': "Solicitar hablar",
            'MANAGE_EVENTS': "Gestionar eventos",
            'MANAGE_THREADS': "Gestionar hilos",
            'USE_PUBLIC_THREADS': "Enviar mensajes en hilos",
            'CREATE_PUBLIC_THREADS': "Crear hilos públicos",
            'USE_PRIVATE_THREADS': "Enviar mensajes en hilos privados",
            'CREATE_PRIVATE_THREADS': "Crear hilos privados",
            'USE_EXTERNAL_STICKERS': "Usar pegatinas externas",
            'SEND_MESSAGES_IN_THREADS': "Enviar mensajes en hilos",
            'START_EMBEDDED_ACTIVITIES': "Prioridad de palabra",
            'MODERATE_MEMBERS': "Aislar temporalmente a miembros"
        }

        if(servidor){
            let creador = servidor.members.cache.get(servidor.ownerId)
            if(servidor.me.permissions.has("MANAGE_GUILD")){
                let inURL = (await servidor.invites.fetch()).filter(f=>f.maxAge == 0).map(mi => mi.url).slice(0,1)
                if(inURL.length == 0){
                    inURL = (await servidor.invites.fetch()).map(mi => mi.url).slice(0,1)
                    if(inURL.length == 0){
                        inURL = "El servidor no tiene invitaciones que pueda proporcionarte."
                    }
                }
    
                const embInfoSv = new Discord.MessageEmbed()
                .setAuthor(creador.user.tag,creador.user.displayAvatarURL({dynamic: true}))
                .setThumbnail(servidor.iconURL({dynamic: true, format: "png"||"gif", size: 4096}))
                .setImage(servidor.bannerURL({dynamic: true, format: "png"||"gif", size: 4096}))
                .setTitle(`<a:Info:926972188018479164> Información del servidor ${servidor.name}`)
                .setDescription(servidor.description ? "📄 **Descripción:**\n"+servidor.description: "*El servidor no tiene descripción.*")
                .addFields(
                    {name: `<:wer:920166217086537739> **servidor:**`, value: `ID: ${servidor.id}\nCreado: <t:${Math.floor(servidor.createdAt/1000)}:R>\nMiembros: ${servidor.members.cache.size.toLocaleString()}\nUsuarios: ${servidor.members.cache.filter(f=>!f.user.bot).size.toLocaleString()}\nBots: ${servidor.members.cache.filter(f=>f.user.bot).size.toLocaleString()}`, inline: true},
                    {name: `👑 **Creador:**`, value: `Tag: ${creador.user.tag}\nID: ${creador.id}\nCreo su cuenta: <t:${Math.floor(creador.user.createdAt/1000)}:R>`, inline: true},
                    {name: `📨 **Invitaciones:** ${(await servidor.invites.fetch()).size.toLocaleString()}`, value: `${(await servidor.invites.fetch()).map(m=>`Creada por: [${m.inviter.tag}](${m.inviter.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096})}) | Usos:${m.uses.toLocaleString()}  | Code: ${m.code} | Creada: <t:${Math.floor(m.createdAt/1000)}:R>`).slice(0,4).join("\n\n")}`, inline: true},
                    {name: `📃 **Permisos:** ${servidor.me.permissions.toArray().length}`, value: `${servidor.me.permissions.toArray().map(m=> `__${permisos[m]}__`).join(", ")}`, inline: true},
                    // {name: ``, value: ``, inline: true},
                    // {name: ``, value: ``, inline: true},
                )
                .setColor(servidor.me.displayHexColor)
                .setFooter(`${servidor.name} • Miembros: ${servidor.members.cache.size}`, servidor.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfoSv], content: `${inURL}`})
                }, 400)
            }else{
                const embInfoSv = new Discord.MessageEmbed()
                .setAuthor(creador.user.tag,creador.user.displayAvatarURL({dynamic: true}))
                .setThumbnail(servidor.iconURL({dynamic: true, format: "png"||"gif", size: 4096}))
                .setImage(servidor.bannerURL({dynamic: true, format: "png"||"gif", size: 4096}))
                .setTitle(`<a:Info:926972188018479164> Información del servidor ${servidor.name}`)
                .setDescription(servidor.description ? "📄 **Descripción:**\n"+servidor.description: "*El servidor no tiene descripción.*")
                .addFields(
                    {name: `<:wer:920166217086537739> **servidor:**`, value: `ID: ${servidor.id}\nCreado: <t:${Math.floor(servidor.createdAt/1000)}:R>\nMiembros: ${servidor.members.cache.size.toLocaleString()}\nUsuarios: ${servidor.members.cache.filter(f=>!f.user.bot).size.toLocaleString()}\nBots: ${servidor.members.cache.filter(f=>f.user.bot).size.toLocaleString()}`, inline: true},
                    {name: `👑 **Creador:**`, value: `Tag: ${creador.user.tag}\nID: ${creador.id}\nCreo su cuenta: <t:${Math.floor(creador.user.createdAt/1000)}:R>`, inline: true},
                    {name: `📃 **Permisos:** ${servidor.me.permissions.toArray().length}`, value: `${servidor.me.permissions.toArray().map(m=> `__${permisos[m]}__`).join(", ")}`, inline: true},
                )
                .setColor(servidor.me.displayHexColor)
                .setFooter(`${servidor.name} • Miembros: ${servidor.members.cache.size}`, servidor.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfoSv]})
                }, 400)
            }
        }else{
            const embErrP1 = new Discord.MessageEmbed()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`Al parecer no estoy en ese servidor ya que no lo encontré.`)
            .setColor(ColorError)
            .setTimestamp()
            return setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                    msg.delete().catch(t=>{
                        return;
                    })
                    tm.delete().catch(t=>{
                        return;
                    })
                }, 20000))
            }, 400)
        }
    }

    if(comando == "servers" || comando == "servidores" || comando == "svs" && creadoresID.some(s=>s==msg.author.id)){
        msg.channel.sendTyping()
        let servidores = client.guilds.cache.map(m=> Object({id: m.id, miembros: m.memberCount})).sort((a,b) => b.miembros - a.miembros), segPage, s0 = 0, s1 = 10, pagina = 1;
        if(String(client.guilds.cache.size).slice(-1) === "0"){
            segPage = Math.floor(client.guilds.cache.size / 10)
        }else{
            segPage = Math.floor(client.guilds.cache.size / 10 + 1)
        }
        

        if(client.guilds.cache.size <= 0){
            const embServidores = new Discord.MessageEmbed()
            .setAuthor(msg.author.username,msg.author.displayAvatarURL())
            .setTitle("🧾 Lista de servidores en los que estoy.")
            .setDescription(`<:wer:920166217086537739>  **Servidores:** ${servidores.length.toLocaleString()}\n\n${servidores.map((m, s)=> `**${s+1}.** [${client.guilds.cache.get(m.id)}](${client.guilds.cache.get(m.id).iconURL({dynamic: true, format: "png"||"gif", size: 4096})}) **|** 👥 ${m.miembros.toLocaleString()}\n🆔 ${m.id}`).slice(s0,s1).join("\n\n")}`)
            .setColor(colorEmb)
            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embServidores]})
            }, 400)

        }else{
            const embServidores = new Discord.MessageEmbed()
            .setAuthor(msg.author.username,msg.author.displayAvatarURL())
            .setTitle("🧾 Lista de servidores en los que estoy.")
            .setDescription(`<:wer:920166217086537739>  **Servidores:** ${servidores.length.toLocaleString()}\n\n${servidores.map((m, s)=> `**${s+1}.** [${client.guilds.cache.get(m.id)}](${client.guilds.cache.get(m.id).iconURL({dynamic: true, format: "png"||"gif", size: 4096})}) **|** 👥 ${m.miembros.toLocaleString()}\n🆔 ${m.id}`).slice(s0,s1).join("\n\n")}`)
            .setColor(colorEmb)
            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()

            const botones1 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("SECONDARY")
                    .setDisabled(true)
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente ")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("PRIMARY")
                ]
            )

            const botones2 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("PRIMARY")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("PRIMARY")
                ]
            )

            const botones3 = new Discord.MessageActionRow()
            .setComponents(
                [
                    new Discord.MessageButton()
                    .setCustomId("1")
                    .setLabel("Anterior")
                    .setEmoji("<a:LeftArrow:942155020017754132>")
                    .setStyle("PRIMARY")
                ],
                [
                    new Discord.MessageButton()
                    .setCustomId("2")
                    .setLabel("Siguiente")
                    .setEmoji("<a:RightArrow:942154978859044905>")
                    .setStyle("SECONDARY")
                    .setDisabled(true)
                ]
            )

            setTimeout(async () => {
                const mensajeSend = await msg.reply({allowedMentions: {repliedUser: false}, embeds: [embServidores], components: [botones1]})
                const colector = mensajeSend.createMessageComponentCollector({filter: i=>i.user.id == msg.author.id, time: segPage*60000})
    
                setTimeout(()=>{
                    mensajeSend.edit({embeds: [embServidores], components: []})
                }, 60000)
    
                colector.on("collect", async botn => {
                    if(botn.customId === "1"){
                        if(s1 - 10 <= 10){
                            s0-=10, s1-=10, pagina--
    
                            embServidores
                            .setDescription(`<:wer:920166217086537739>  **Servidores:** ${servidores.length.toLocaleString()}\n\n${servidores.map((m, s)=> `**${s+1}.** [${client.guilds.cache.get(m.id)}](${client.guilds.cache.get(m.id).iconURL({dynamic: true, format: "png"||"gif", size: 4096})}) **|** 👥 ${m.miembros.toLocaleString()}\n🆔 ${m.id}`).slice(s0,s1).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            return await botn.update({embeds: [embServidores], components: [botones1]})
                        }else{
                            s0-=10, s1-=10, pagina--
    
                            embServidores
                            .setDescription(`<:wer:920166217086537739>  **Servidores:** ${servidores.length.toLocaleString()}\n\n${servidores.map((m, s)=> `**${s+1}.** [${client.guilds.cache.get(m.id)}](${client.guilds.cache.get(m.id).iconURL({dynamic: true, format: "png"||"gif", size: 4096})}) **|** 👥 ${m.miembros.toLocaleString()}\n🆔 ${m.id}`).slice(s0,s1).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            await botn.update({embeds: [embServidores], components: [botones2]})
                        }
                    }
                    if(botn.customId === "2"){
                        if(s1 + 10 >= servidores.length){
                            s0+=10, s1+=10, pagina++
    
                            embServidores
                            .setDescription(`<:wer:920166217086537739>  **Servidores:** ${servidores.length.toLocaleString()}\n\n${servidores.map((m, s)=> `**${s+1}.** [${client.guilds.cache.get(m.id)}](${client.guilds.cache.get(m.id).iconURL({dynamic: true, format: "png"||"gif", size: 4096})}) **|** 👥 ${m.miembros.toLocaleString()}\n🆔 ${m.id}`).slice(s0,s1).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            await botn.update({embeds: [embServidores], components: [botones3]})
                        }else{
                            s0+=10, s1+=10, pagina++
    
                            embServidores
                            .setDescription(`<:wer:920166217086537739>  **Servidores:** ${servidores.length.toLocaleString()}\n\n${servidores.map((m, s)=> `**${s+1}.** [${client.guilds.cache.get(m.id)}](${client.guilds.cache.get(m.id).iconURL({dynamic: true, format: "png"||"gif", size: 4096})}) **|** 👥 ${m.miembros.toLocaleString()}\n🆔 ${m.id}`).slice(s0,s1).join("\n\n")}`)
                            .setFooter(`Pagina - ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                            await botn.update({embeds: [embServidores], components: [botones2]})
                        }
                    }
                })
            }, 400)
        }
    }
})


// Registro de nuevo servidor 
client.on("guildCreate", async gc => {
    let servidorSP = client.guilds.cache.get("940034044819828767"), dueño = gc.members.cache.get(gc.ownerId)
    
    if(gc.me.permissions.has("MANAGE_GUILD")){
        let invite = (await gc.invites.fetch()).filter(f=> f.maxAge == 0).map(m=>m.url).slice(0,2).join("\n")
        let permisos = {
            'CREATE_INSTANT_INVITE': "Crear invitación",
            'KICK_MEMBERS': "Expulsar miembros",
            'BAN_MEMBERS': "Banear miembros",
            'ADMINISTRATOR': "Administrador",
            'MANAGE_CHANNELS': "Gestionar canales",
            'MANAGE_GUILD': "Gestionar servidor",
            'ADD_REACTIONS': "Añadir reacciones",
            'VIEW_AUDIT_LOG': "Ver registro de auditoría",
            'PRIORITY_SPEAKER': "Prioridad de palabra",
            'STREAM': "Vídeo",
            'VIEW_CHANNEL': "Ver canales",
            'SEND_MESSAGES': "Enviar mensajes",
            'SEND_TTS_MESSAGES': "Enviar mensajes de texto a voz",
            'MANAGE_MESSAGES': "Gestionar mensajes",
            'EMBED_LINKS': "Insertar enlaces",
            'ATTACH_FILES': "Adjuntar archivos",
            'READ_MESSAGE_HISTORY': "Leer el historial de mensajes",
            'MENTION_EVERYONE': "Mencionar todos los roles",
            'USE_EXTERNAL_EMOJIS': "Usar emojis externos",
            'VIEW_GUILD_INSIGHTS': "Ver información del servidor",
            'CONNECT': "Conectar",
            'SPEAK': "Hablar",
            'MUTE_MEMBERS': "Silenciar miembros",
            'DEAFEN_MEMBERS': "Ensordecer miembros",
            'MOVE_MEMBERS': "Mover miembros",
            'USE_VAD': "Usar actividad de voz",
            'CHANGE_NICKNAME': "Cambiar apodo",
            'MANAGE_NICKNAMES': "Gestionar apodos",
            'MANAGE_ROLES': "Gestionar roles",
            'MANAGE_WEBHOOKS': "Gestionar webhooks",
            'MANAGE_EMOJIS_AND_STICKERS': "Gestionar emojis y pegatinas",
            'USE_APPLICATION_COMMANDS': "Usar comandos de aplicaciones",
            'REQUEST_TO_SPEAK': "Solicitar hablar",
            'MANAGE_EVENTS': "Gestionar eventos",
            'MANAGE_THREADS': "Gestionar hilos",
            'USE_PUBLIC_THREADS': "Enviar mensajes en hilos",
            'CREATE_PUBLIC_THREADS': "Crear hilos públicos",
            'USE_PRIVATE_THREADS': "Enviar mensajes en hilos privados",
            'CREATE_PRIVATE_THREADS': "Crear hilos privados",
            'USE_EXTERNAL_STICKERS': "Usar pegatinas externas",
            'SEND_MESSAGES_IN_THREADS': "Enviar mensajes en hilos",
            'START_EMBEDDED_ACTIVITIES': "Prioridad de palabra",
            'MODERATE_MEMBERS': "Aislar temporalmente a miembros"
        }
        if(invite.length <= 0){
            invite = (await gc.invites.fetch()).map(i=>i.url).slice(0,2).join("\n")
            if(invite.length <= 0){
                invite = "No hay invitaciones en el servidor"
            }
        }
        const embGC = new Discord.MessageEmbed()
        .setAuthor(dueño.user.tag,dueño.user.displayAvatarURL({dynamic: true}))
        .setThumbnail(gc.iconURL({dynamic: true, format: "png"||"gif", size: 4096}))
        .setImage(gc.bannerURL({dynamic: true, format: "png"||"gif", size: 4096}))
        .setTitle("➕ Añadido en un nuevo servidor")
        .setDescription(`${gc.name}\n${gc.description ? gc.description: "No tiene descripción"}`)
        .addFields(
            {name: `<:wer:920166217086537739> **Servidor:**`, value: `🆔 ID: ${gc.id}\n📅 Creado el <t:${Math.floor(gc.createdAt / 1000)}:F> *(<t:${Math.floor(gc.createdAt / 1000)}:R>)*`, inline: true},
            {name: `👥 **Miembros:** ${gc.members.cache.size.toLocaleString()}`, value: `👤 Usuarios: ${gc.members.cache.filter(fm => !fm.user.bot).size}\n🤖 Bots: ${gc.members.cache.filter(fb => fb.user.bot).size.toLocaleString()}`, inline: true},
            {name: `🌈 **Roles:** ${gc.roles.cache.size}`, value: `${gc.roles.cache.filter(f=> !f.managed && f.id != gc.id).map(m=> Object({posicion: m.position, nombre: m.name})).slice(0,10).sort((a,b)=> b.posicion-a.posicion).map(r=> r.nombre).slice(0,10).join(", ")}`, inline: true},
            {name: `📑 **Canales:** ${gc.channels.cache.size.toLocaleString()}`, value: `<:canaldetexto:904812801925738557> texto ${gc.channels.cache.filter(f=> f.type == "GUILD_TEXT").size}\n<:canaldevoz:904812835295596544> voz ${gc.channels.cache.filter(f=> f.type == "GUILD_VOICE").size}\n<:carpeta:920494540111093780> categorías ${gc.channels.cache.filter(f=> f.type == "GUILD_CATEGORY").size}`, inline: true},
            {name: `👑 **Dueño:**`, value: `${dueño.user.tag}\n🆔 ${dueño.id}`, inline: true},
            {name: `📨 **Invitaciones:**`, value: `${(await gc.invites.fetch()).size.toLocaleString()}`, inline: true},
            {name: `🗒️ **Permisos:** ${gc.me.permissions.toArray().length}`, value: `${gc.me.permissions.toArray().map(m=> permisos[m]).join(", ")}`, inline: true}
        )
        .setColor("GREEN")
        .setTimestamp()
        servidorSP.channels.cache.get("940078302880743505").send({embeds: [embGC], content: `${invite}`})
    }else{
        const embGC = new Discord.MessageEmbed()
        .setAuthor(dueño.user.tag,dueño.user.displayAvatarURL({dynamic: true}))
        .setThumbnail(gc.iconURL({dynamic: true, format: "png"||"gif", size: 4096}))
        .setImage(gc.bannerURL({dynamic: true, format: "png"||"gif", size: 4096}))
        .setTitle("➕ Añadido en un nuevo servidor")
        .setDescription(`${gc.name}\n${gc.description ? gc.description: "No tiene descripción"}`)
        .addFields(
            {name: `<:wer:920166217086537739> **Servidor:**`, value: `🆔 ID: ${gc.id}\n📅 Creado el <t:${Math.floor(gc.createdAt / 1000)}:F> *(<t:${Math.floor(gc.createdAt / 1000)}:R>)*`, inline: true},
            {name: `👥 **Miembros:** ${gc.members.cache.size.toLocaleString()}`, value: `👤 Usuarios: ${gc.members.cache.filter(fm => !fm.user.bot).size}\n🤖 Bots: ${gc.members.cache.filter(fb => fb.user.bot).size.toLocaleString()}`, inline: true},
            {name: `🌈 **Roles:** ${gc.roles.cache.size}`, value: `${gc.roles.cache.filter(f=> !f.managed && f.id != gc.id).map(m=> Object({posicion: m.position, nombre: m.name})).slice(0,10).sort((a,b)=> b.posicion-a.posicion).map(r=> r.nombre).slice(0,10).join(", ")}`, inline: true},
            {name: `📑 **Canales:** ${gc.channels.cache.size.toLocaleString()}`, value: `<:canaldetexto:904812801925738557> texto ${gc.channels.cache.filter(f=> f.type == "GUILD_TEXT").size}\n<:canaldevoz:904812835295596544> voz ${gc.channels.cache.filter(f=> f.type == "GUILD_VOICE").size}\n<:carpeta:920494540111093780> categorías ${gc.channels.cache.filter(f=> f.type == "GUILD_CATEGORY").size}`, inline: true},
            {name: `👑 **Dueño:**`, value: `${dueño.user.tag}\n🆔 ${dueño.id}`, inline: true},
            {name: `🗒️ **Permisos:** ${gc.me.permissions.toArray().length}`, value: `${gc.me.permissions.toArray().map(m=> permisos[m]).join(", ")}`, inline: true}
        )
        .setColor("GREEN")
        .setTimestamp()
        servidorSP.channels.cache.get("940078302880743505").send({embeds: [embGC], content: `No pude obtener ninguna invitación al servidor.`})
    }
})

// Registro de expulsion de servidor
client.on("guildDelete",async gd => {
    let dueño = gd.members.cache.get(gd.ownerId), servidorSP = client.guilds.cache.get("940034044819828767")
    const embGD = new Discord.MessageEmbed()
    .setAuthor(dueño.user.tag,dueño.user.displayAvatarURL({dynamic: true}))
    .setThumbnail(gd.iconURL({dynamic: true, format: "png"||"gif", size: 4096}))
    .setImage(gd.bannerURL({dynamic: true, format: "png"||"gif", size: 4096}))
    .setTitle("➖ Expulsado de un servidor")
    .setDescription(`${gd.name}\n${gd.description ? gd.description: "No tiene descripción"}`)
    .addFields(
        {name: `<:wer:920166217086537739> **Servidor:**`, value: `🆔 ID: ${gd.id}\n📅 Creado el <t:${Math.floor(gd.createdAt / 1000)}:F> *(<t:${Math.floor(gd.createdAt / 1000)}:R>)*`, inline: true},
        {name: `👥 **Miembros:** ${gd.members.cache.size.toLocaleString()}`, value: `👤 Usuarios: ${gd.members.cache.filter(fm => !fm.user.bot).size}\n🤖 Bots: ${gd.members.cache.filter(fb => fb.user.bot).size.toLocaleString()}`, inline: true},
        {name: `🌈 **Roles:** ${gd.roles.cache.size}`, value: `${gd.roles.cache.filter(f=> !f.managed && f.id != gd.id).map(m=> Object({posicion: m.position, nombre: m.name})).slice(0,10).sort((a,b)=> b.posicion-a.posicion).map(r=> r.nombre).slice(0,10).join(", ")}`, inline: true},
        {name: `👑 **Dueño:**`, value: `${dueño.user.tag}\n🆔 ${dueño.id}`},
    )
    .setColor("RED")
    .setTimestamp()
    servidorSP.channels.cache.get("940078302880743505").send({embeds: [embGD]})

})

client.on("warn", warn => {
    console.log(warn)
})

process.on("unhandledRejection", err => {
    const embErr = new Discord.MessageEmbed()
    .setTitle(`${emojis.negativo} Ocurio un error`)
    .setDescription(`\`\`\`js\n${err}\`\`\``)
    .setColor("ff0000")
    .setTimestamp()
    client.channels.cache.get("960294374258933821").send({embeds: [embErr]})
    console.error(err)
})

client.on("shardError", async err => {
    const embErr = new Discord.MessageEmbed()
    .setTitle(`${emojis.negativo} Ocurio un error`)
    .setDescription(`\`\`\`js\n${err}\`\`\``)
    .setColor("ff0000")
    .setTimestamp()
    client.channels.cache.get("960294374258933821").send({embeds: [embErr]})
    console.error(err)
})

client.login(token);