const Discord = require("discord.js");
const intents = new Discord.Intents();
const client = new Discord.Client({intents: 32767});

const config = require("./config.json")
const token = config.tokenSVSPBot
const ms = require("ms")
const mongoose = require("mongoose")
const { SlashCommandBuilder, ContextMenuCommandBuilder } = require("@discordjs/builders");
const Canvas = require("canvas")
Canvas.registerFont("./tipo.otf", {family: "MADE TOMMY"})


const servidorID = "773249398431809586"
const creadorID = "717420870267830382"
const colorEmbInf = "#030303"
const colorErr = "#ff0000"
const IDCR = "941170978459910214"
const emojiError = "<a:negativo:856967325505159169>"


mongoose.connect("mongodb+srv://prueba:ET6nOatR5rqNgbCf@cluster0.ggred.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Conectado corectamente a la base de datos.")
}).catch(e=>{
    console.log("Ocurrio un error al conectarse con la DB", e)
})

// Sistema de alianzas
const alianzasSistem = new mongoose.Schema({
    _id: {type: String, required: true},
    miembros: {
        type: Array,
        required: true,
    }
})
const sisAlianzas = mongoose.model("Alianzas", alianzasSistem)

// Sistema de sugerencias
const sugerenciasSystem = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    sugerencias: {
        type: Object,
        required: true
    },
    mensajes: {
        type: Array,
        required: true
    },
    miembros: {
        type: Array,
        required: true
    }
})
const systemSug = mongoose.model("Sugerencias", sugerenciasSystem)

// Carcél
const carcelBaseDeDatos = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    prisioneros: {
        type: Array,
        required: true
    }
}) 
const carcelDB = mongoose.model("Carcel", carcelBaseDeDatos)

// Variables estadisiticas
let estadisticas = {
    entradas: 0,
    salidas: 0,
    mensajes: 0,
    comandos: 0
}

// DB auto moderacion
let autoModeracion = [{miembroID: "717420870267830382", advertencias: 0}]

client.on("ready", async () => {
    console.log(`${client.user.username}: Estoy listo.`)
    const servidor = client.guilds.cache.get(servidorID)
    let svch = servidor.channels.cache.get("828300239488024587")
    
    let dataSug = await systemSug.findOne({_id: servidorID})

    if(!dataSug){
        let nuevaData = systemSug.create({
            _id: servidorID,
            sugerencias: {cantidad: 0, aceptadas: 0, denegadas: 0, implementadas: 0, en_progreso: 0, no_sucedera: 0},
            mensajes: [],
            miembros: []
        })
        await nuevaData.save()
    }
    for(let i=0; i<dataSug.mensajes.length; i++){
        await svch.messages.fetch(dataSug.mensajes[i].id, {force: true}).then(async c=>{
            console.log("mensage cargado")
        })
    }


    const embEncendido = new Discord.MessageEmbed()
    .setAuthor("✅ Encendido de nuevo.")
    .setColor("#00ff00")
    .setFooter(client.user.username,client.user.displayAvatarURL())
    .setTimestamp()
    client.channels.cache.get("941170978459910214").send({embeds: [embEncendido]})

    const estados = [
        {
            name: "s.ayuda",
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

    const autoPresencia = () => {
        let aleatorio = Math.floor(Math.random()*estados.length)
        client.user.setPresence({
            activities: [estados[aleatorio]]
        })
    }
    autoPresencia()
    setInterval(()=>{
        autoPresencia()
    },60000)

    setInterval(async ()=>{
        let todosG = client.guilds.cache.get(servidorID).members.cache.size
        let soloMiembros = client.guilds.cache.get(servidorID).members.cache.filter(fm => !fm.user.bot).size
        let cantBots = client.guilds.cache.get(servidorID).members.cache.filter(fb => fb.user.bot).size
  
        let canalTodos =  client.channels.cache.get("823349420106973204")
        let canalMiembros = client.channels.cache.get("823349423349301318")
        let canalBots = client.channels.cache.get("823349426264997919")
  
        let estadoT = []
        let estadoM = []
        let estadoB = []

        var nose = 3

        if(canalTodos.name === `『👥』Todos: ${todosG}`){
            estadoT = "Sin actualización"
        }else{
            canalTodos.edit({name: `『👥』Todos: ${todosG}`})
            estadoT = "Se ha actualizado"
            nose = nose + 1
        }

        if(canalMiembros.name === `『👤』Miembros: ${soloMiembros}`){
            estadoM = "Sin actualización"
        }else{
            canalMiembros.edit({name: `『👤』Miembros: ${soloMiembros}`})
            estadoM = "Se ha actualizado"
            nose = nose + 1
        }

        if(canalBots.name === `『🤖』Bots: ${cantBots}`){
            estadoB = "Sin actualización"
        }else{
            canalBots.edit({name: `『🤖』Bots: ${cantBots}`})
            estadoB = "Se ha actualizado"
            nose= nose + 1
        }

        if(nose >= 4){
            const emb = new Discord.MessageEmbed()
            .setTitle("Actualización de estadísticas")
            .setDescription(`**『👥』Todos: ${todosG}**\n${estadoT}\n\n**『👤』Miembros: ${soloMiembros}**\n${estadoM}\n\n**『🤖』Bots: ${cantBots}**\n${estadoB}`)
            .setColor("#0095F7")
            .setTimestamp()
            client.channels.cache.get("941179540615598130").send({embeds: [emb]})
        }

        // De la carcel
        let dataCrcl = await carcelDB.findOne({_id: client.user.id})
        let tiempoActual = Date.now()
        let canalRegistro = servidor.channels.cache.get("891731115541430292")
        for(let d=0; d<dataCrcl.prisioneros.length; d++){
          let miembro = servidor.members.cache.get(dataCrcl.prisioneros[d].id)
            if(!miembro){
                dataCrcl.prisioneros.splice(d,1)
                await dataCrcl.save()
            }else{
                let msTime = ms(dataCrcl.prisioneros[d].condena)
                console.log((dataCrcl.prisioneros[d].tiempo + msTime) - tiempoActual)
                if((dataCrcl.prisioneros[d].tiempo + msTime) - tiempoActual <= 0){
                    const embMDS = new Discord.MessageEmbed()
                    .setAuthor(miembro.user.tag,miembro.displayAvatarURL({dynamic: true}))
                    .setTitle("<a:afirmativo:856966728806432778> Has salido de la cárcel")
                    .setDescription(`⏱ Cumpliste con la condena de **${dataCrcl.prisioneros[d].condena}** en la cárcel.`)
                    .setColor("#00ff00")
                    .setFooter(servidor.name,servidor.iconURL({dynamic: true}))
                    .setTimestamp()

                    const registroSa = new Discord.MessageEmbed()
                    .setTitle("<:salir12:879519859694776360> Pricionero liberado")
                    .setDescription(`👤 ${miembro}\n**Ha cumplido con la condena de:** ${dataCrcl.prisioneros[d].condena}\n**Por:** ${dataCrcl.prisioneros[d].razon}`)
                    .setColor("#00ff00")
                    .setTimestamp()

                    miembro.roles.remove("830260549098405935").then(r=>{
                        miembro.send({embeds: [embMDS]}).catch(c=>{
                            return;
                        })
                        canalRegistro.send({embeds: [registroSa]})
                    })

                    dataCrcl.prisioneros.splice(d,1)
                    await dataCrcl.save()
                }
            }
        }  
      }, 10*60000)



    const ayuda = new SlashCommandBuilder()
    .setName("ayuda")
    .setDescription(`✋ ¿Necesitas ayuda o estas perdido/a?, te muestra información que te puede ayudar.`)

    const reglas = new SlashCommandBuilder()
    .setName("reglas")
    .setDescription(`📜 Te muestra las reglas del servidor.`)

    const ping = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("🏓 Muestra el ping del bot")

    const avatar = new SlashCommandBuilder()
    .setName('avatar')
	.setDescription('👤 Muestra el avatar de un usuario')
    .addUserOption(userOP =>
        userOP
        .setName("miembro")
        .setDescription("Menciona a un miembro")
    )
	.addStringOption(option =>
		option
        .setName('id')
		.setDescription('Propirciona la ID de un usuario')
    )

    const encuesta = new SlashCommandBuilder()
    .setName("encuesta")
    .setDescription(`📋 Encuesta para postularse a Ayudante `)

    const cInfo = new ContextMenuCommandBuilder()
    .setName("info")
    .setType(2)

    // const alianzasInfo = new SlashCommandBuilder()
    // .setName("alianza")
    // .addSubcommand(req=>
    //     req
    //     .setName("requisitos")
    //     .setDescription("📋 Requisitos que debes de cumplir para hacer alianza con el servidor.")
    // ) 
    // .addSubcommand(suport=>
    //     suport
    //     .setName("soporte")
    //     .setDescription("👮 ¿Como?, ¿En donde? o ¿Con quien? solicitar una alianza.")
    // )

    const estadisticas = new SlashCommandBuilder()
    .setName("estadísticas")
    .setDescription(`📊 Muestra estadísticas del servidor.`)

    const crearalianza = new SlashCommandBuilder()
    .setName("crear-alianza")
    .setDescription("🔧 !Crea una alianza¡ (comando solo para el personal del servidor).")
    .addBooleanOption(ping=>
        ping
        .setName("notificación")
        .setDescription(`🔔 Notifica a los miembros que tienen el rol de alianza.`)
        .setRequired(true)
    )
    .addUserOption(us=>
        us
        .setName("aliado")
        .setDescription("🧑 Proporciona el aliado.")
        .setRequired(false)
    )

    const alianzas = new SlashCommandBuilder()
    .setName("alianzas")
    .setDescription(`🔢 Muestra la cantidad de alianzas que has echo o ha echo un miembro.`)
    .addUserOption(us=>
        us
        .setName("miembro")
        .setDescription(`👤 Proporciona un miembro para ver la cantidad de alianzas que ha echo.`)
        .setRequired(false)
    )

    const topoAlianzas = new SlashCommandBuilder()
    .setName("top-alianzas")
    .setDescription(`📊 Muestra una tabla de clasificaciones de todos los miembros que han echo alianzas.`)

    const sugerir = new SlashCommandBuilder()
    .setName("sugerir")
    .setDescription(`✉️ Has una sugerencia para el servidor.`)
    .addStringOption(st=>
        st
        .setName("sugerencia")
        .setDescription(`📝 Escribe tu sugerencia.`)
        .setRequired(true)
    )

    const sugerencias = new SlashCommandBuilder()
    .setName("sugerencias")
    .setDescription(`🗳️ Muestra la cantidad de sugerencias que has echo o ha echo un miembro.`)
    .addUserOption(us=>
        us
        .setName("miembro")
        .setDescription(`👤 Proporciona un miembro para ver la cantidad de sugerencias que ha echo.`)
        .setRequired(false)
    )

    const marcar = new SlashCommandBuilder()
    .setName("marcar")
    .setDescription(`🚥 Marca el estado de una sugerencia (implementada, en progreso, no sucederá).`)
    .addStringOption(st=>
        st
        .setName(`id`)
        .setDescription(`🆔 Proporciona la ID del mensaje de la sugerencia que quieres marcar.`)
        .setRequired(true)
    )

    const carcel = new SlashCommandBuilder()
    .setName("cárcel")
    .setDescription(`⛓️ Envía a un miembro a la cárcel.`)
    .addUserOption(us=>
        us
        .setName("miembro")
        .setDescription(` Proporciona al miembro a enviar a la carcel.`)
        .setRequired(true)
    )
    .addStringOption(st=>
        st 
        .setName("razon")
        .setDescription(` Proporciona la razon por la que el miembro ira a la carcel.`)
        .setRequired(true)
    )
    .addStringOption(tm=>
        tm
        .setName("tiempo")
        .setDescription(` Proporciona el tiempo en el que el miembro permanecera en la carcel.`)
        .setRequired(true)
    )

    const expulsar = new SlashCommandBuilder()
    .setName("expulsar")
    .setDescription(` Expulsa a un miembro del servidor.`)
    .addUserOption(us=>
        us 
        .setName("miembro")
        .setDescription(` Proporciona el miembro a expulsar.`)
        .setRequired(true)
    )
    .addStringOption(st=>
        st 
        .setName("razón")
        .setDescription(` Proporciona la razon por la que expulsaras al miembro.`)
        .setRequired(true)
        .setAutocomplete(true)
    )

    client.guilds.cache.get("842630591257772033").commands.create(expulsar)
    
    let commands = [ayuda, reglas, ping, avatar, encuesta, cInfo, estadisticas,  crearalianza, alianzas, topoAlianzas, sugerir, sugerencias, marcar]
    for(let i=0; i<commands.length; i++){
        servidor.commands.create(commands[i])
    }
})

let sistemMarcar = []
let coolSugerencias = []
client.on("interactionCreate", async int => {
    if(!int.user.id === creadorID) return;
    if(!int.guildId === servidorID) return;
    // if(!int.isCommand() && !int.isContextMenu() && !int.isSelectMenu()) return;

    if(int.commandName === "ayuda"){
        estadisticas.comandos = estadisticas.comandos + 1
        const embAyuda = new Discord.MessageEmbed()
        .setAuthor(`Hola ${int.user.username}`,int.user.displayAvatarURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`Soy ${client.user.username}`)
        .setDescription(`**El bot de ${int.guild.name}**, ¿necesitas información o ayuda?`)
        .addFields(
            {name: "<a:Info:926972188018479164> **Información**", value: "Puedes obtener información sobre los roles del servidor en el canal <#840364744228995092> y información sobre todos los canales en <#840364706715533322>."},
            {name: "<:staff:925429848380428339> **Soporte**", value: "Puedes obtener soporte sobre cualquier duda que tengas con relación al servidor, su configuración, obtener información mas detallada de algún rol, canal, sistema o reportar a un usuario en el canal <#830165896743223327> solo abre un ticket pregunta y espera el equipo de soporte te atenderá en un momento."}
        )
        .setColor(int.guild.me.displayHexColor)
        .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
        .setTimestamp()
        int.deferReply()
        
        setTimeout(()=>{
            int.editReply({embeds: [embAyuda]})
        }, 400)
    }

    if(int.commandName === "reglas"){
        estadisticas.comandos = estadisticas.comandos + 1
        const embReglas = new Discord.MessageEmbed()
        .setAuthor("📜 Reglas")
        // .setDescription(`> **1. Respetarse, no insultarse, aquí todos estamos para ayudarnos entre nosotros.**\n\n> **2. No usar palabras obscenas u ofensivas o seras advertido o directamente Baneado.**\n\n> 3. **Respetar la categoría de los canales** *(Ejemplo si son para promocionar solo se podrá promocionar o si son para hablar solo se usaran para hablar).*\n\n> **4. No hacer menciones como @user, @everyone, @here, a menos que se les permita por un rol, canal o un admin.**\n\n> **5.No mencionar a los admins, mods, helpers y usuario si no es por una buena razón y solo es por diversión.**\n\n> **6. No enviar spam al MD de las personas sin antes la persona lo aya permitido** *(ejemplo: primero preguntarle y si acepta ya mandarle el spam de lo contrario es sancionable).*\n\n> **7. No enviar su promoción *(spam)***, en un canal y salir del servidor si lo haces tu promocion sera eliminada.**\n\n> **8. Esta prohibido el contenido NSFW o +18 en canales los cuales no están creados para ese fin.**`)
        .setDescription(`> **1. __Flood__**\n> Inundación de mensajes o mejor conocido como flood esta acción esta prohibida, se considera flood cuando envías el mismo mensaje mas de 3 veces en un corto lapso de tiempo.\n\n> **2. __Spam al MD__**\n> Se considera spam al MD a la acción de enviar por mensaje directo un mensaje de promoción no deseado al miembro, esta acción esta prohibida.\n\n> **3. __Respetar la función de cada canal.__**\n> Respetar si el canal es solo para publicar contenido de YouYube o si es solo para usar un bot en concreto, normalmente en la descripción del canal te informa la finalidad del canal.\n\n> **4. __Menciones en masa o menciones masivas__**\n> Consiste en mencionar repetidas veces a un miembro o rol, esa acción esta prohibida.\n\n> **5. __Respeto mutuo__**\n> Respetarse entre ustedes, no hay necesidad de conflictos si algún usuario le molesta no haga conflicto haga un reporte al usuario.\n\n> **6. __Información personal__**\n> Tu información personal es valiosa para ti, por ello en el servidor no esta permitido actos de revelación de datos.\n\n> **7. __Publicar y salir del servidor__**\n> En el caso de que entres al servidor, publiques tu promoción y te salgas del servidor tu publicación será eliminada.\n\n> **8. __Contenido NSFW__**\n> El contenido explicito o contenido NSFW esta prohibido en canales normales.\n\n> **9. __Términos y condiciones de Discord__**\n> No incumplir el [ToS](https://discord.com/terms) de Discord.\n\n> **10. __Usar el sentido común__**\n> Compórtate adecuadamente, no hagas cosas que aunque no estén en las reglas están mal, en todo caso si el equipo de soporte se ve en la necesidad de sancionarte lo hará.\n\n*Al incumplir alguna de estas reglas tendrás una sanción, la gravedad o el tipo de sanción dependerá de cual hayas incumplido.*`)
        .setColor(int.guild.me.displayHexColor)
        .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
        .setTimestamp()
        int.deferReply()

        setTimeout(()=>{
            int.editReply({embeds: [embReglas]})
        }, 400)
    }

    if(int.commandName === "ping"){
        estadisticas.comandos = estadisticas.comandos + 1
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
        .setTimestamp()
        int.reply({embeds: [embPing]})
    }

    if(int.commandName === "avatar"){
        estadisticas.comandos = estadisticas.comandos + 1
        let mencion = int.options.getUser("miembro")

        if(mencion){
            const embAvaMe = new Discord.MessageEmbed()
            .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
            .setDescription(`[URL del avatar](${mencion.displayAvatarURL({dynamic: true, size: 4096, format: "png"})})`)
            .setImage(mencion.displayAvatarURL({dynamic: true, size: 4096}))
            .setColor(int.guild.me.displayHexColor)
            .setTimestamp()
            int.reply({allowedMentions: {repliedUser: false}, embeds: [embAvaMe]})
        }else{
            let usID = int.options.getString("id")
            if(usID){
                let usuario = await client.users.fetch(usID)
                const embAvaMe = new Discord.MessageEmbed()
                .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                .setDescription(`[URL del avatar](${usuario.displayAvatarURL({dynamic: true, size: 4096, format: "png"})})`)
                .setImage(usuario.displayAvatarURL({dynamic: true, size: 4096}))
                .setColor(int.guild.me.displayHexColor)
                .setTimestamp()
                int.reply({allowedMentions: {repliedUser: false}, embeds: [embAvaMe]})
            }else{
                const embAvaMe = new Discord.MessageEmbed()
                .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                .setDescription(`[URL del avatar](${int.user.displayAvatarURL({dynamic: true, size: 4096, format: "png"})})`)
                .setImage(int.user.displayAvatarURL({dynamic: true, size: 4096}))
                .setColor(int.guild.me.displayHexColor)
                .setTimestamp()
                int.reply({allowedMentions: {repliedUser: false}, embeds: [embAvaMe]}) 
            }
        }
    }

    if(int.commandName === "encuesta"){
        estadisticas.comandos = estadisticas.comandos + 1
        int.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No eres staff de este servidor, no puedes usar este comando.`)
        .setColor(colorErr)
        .setTimestamp()

        const embEncuesta = new Discord.MessageEmbed()
        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
        .setTitle(`<:diamante:787455888432168971> Postulación a **Ayudante** <:diamante:787455888432168971>`)
        .setDescription(`${"``"}1.${"``"} ¿Cuál es tu edad?\n${"``"}2.${"``"} ¿Por que quieres ser ayudante?\n${"``"}3.${"``"} ¿Cuánto tiempo le dedicarías al servidor?\n${"``"}4.${"``"} ¿Serias activo en el chat?\n${"``"}5.${"``"} ¿Que harías si miras a un Mod/Admi abusando de su rango?\n${"``"}6.${"``"} ¿Sabes bien la información de los roles/canales del servidor?\n${"``"}7.${"``"} Al estar en una situación difícil de controlar. ¿Qué harías?\n${"``"}8.${"``"} ¿Tienes paciencia?\n${"``"}9.${"``"} ¿Estas comprometido/a en que una ves siendo staff todo lo que mires se quedara solo en el grupo del staff?\n${"``"}10.${"``"} ¿Cómo ayudarías/Guiarías a un usuario?\n${"``"}11.${"``"} ¿Tienes experiencia siendo helper/ayudante?\n${"``"}12.${"``"} ¿Cómo conociste este server?\n${"``"}13.${"``"} ¿Cuál es tu pasado en Discord?\n${"``"}14.${"``"} ¿Alguna vez formaste parte de una squad o raideaste?\n${"``"}15.${"``"} Para ti, ¿De que se encarga un helper/ayudante?\n\n<:Pikachu_Feliz:925799716585881640> **Recuerda lo que aquí más importa es tu sinceridad, honestidad y conocimiento.** <:Pikachu_Feliz:925799716585881640>`)
        .setColor(int.guild.roles.cache.get("831669132607881236").hexColor)
        .setFooter(`${int.guild.name} - 2022`,int.guild.iconURL({dynamic: true}))
        .setTimestamp()

        if(int.member.roles.cache.get("831669132607881236")){
            int.reply({allowedMentions: {repliedUser: false}, embeds: [embEncuesta]})
        }else{
            if(int.member.permissions.has(["ADMINISTRATOR","BAN_MEMBERS"])){
                int.reply({allowedMentions: {repliedUser: false}, embeds: [embEncuesta]})
            }else{
                return int.reply({ephemeral: true, embeds: [embErrP1]})
            }
        }
    }

    if(int.commandName === "alianza"){
        estadisticas.comandos = estadisticas.comandos + 1
        if(int.options.getSubcommand("requisitos") === "requisitos"){
            console.log(int.options.getSubcommand("requisitos"))
            const embReqs = new Discord.MessageEmbed()
            .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
            .setTitle("📋 Requisitos para alianza")
            .setDescription(`**1.** Si tu servidor tiene menos de 60 miembros para hacer una alianza con nosotros debes de invitar a nuestro Bot <@896191100665081886> a tu servidor, si tienes mas 60 miembro solo cumple con los demás requisitos.\n**2.** Servidor no toxico, que no fomente ninguna práctica mala como el raideo.\n**3.** Servidor no enfocando en contenido NSFW, si tiene canales NSFW que tengan la restricción de edad activada.\n**4.** No eliminar la alianza, en caso de hacerlo nosotros lo aremos de la misma manera.\n\nSi tu servidor supera los 600 miembros y quieres hacer una alianza ay beneficios en tu alianza pondremos el rol <@&895394175481159680> el cual notifica a todos los usuarios que lo tienen.`)
            .setColor(int.guild.roles.cache.get("840704364158910475").hexColor)
            .setTimestamp()
            int.deferReply()

            setTimeout(()=>{
                int.editReply({embeds: [embReqs]})
            }, 600)
        }else{
            if(int.options.getSubcommand("soporte") === "soporte"){
                const embReqs = new Discord.MessageEmbed()
                .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                .setTitle("👮 Soporte")
                .setDescription("Una vez cumplas con los requisitos para realizar la alianza abre un ticket en <#830165896743223327> y pide una alianza, otra forma de pedir una alianza es pedírsela un miembro del equipo de soporte a cualquiera de los miembros que tengan los siguientes roles <@&831669132607881236>, <@&773271945894035486> y <@&847302489732153354>.")
                .setColor(int.guild.roles.cache.get("840704364158910475").hexColor)
                .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                .setTimestamp()
                int.deferReply()

                setTimeout(()=>{
                    int.editReply({embeds: [embReqs]})
                }, 600)
            }
        }
    }

    if(int.commandName === "info"){
        estadisticas.comandos = estadisticas.comandos + 1
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
        int.reply({embeds: [embInfo]})
    }

    if(int.commandName === "estadísticas"){
        estadisticas.comandos = estadisticas.comandos + 1
        let dataAli = await sisAlianzas.findOne({_id: int.guildId})
        let dataSug = await systemSug.findOne({_id: int.guildId})
        let alianzas = 0
        for(let i=0; i<dataAli.miembros.length; i++){
            alianzas = alianzas + dataAli.miembros[i].cantidad
        }

        const embEstadisticas = new Discord.MessageEmbed()
        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
        .setTitle("📊 Estadísticas")
        .setDescription(`Estadísticas por información recolectada hace ${ms(client.uptime)}.`)
        .addFields(
            {name: `👤 **Miembros:**`, value: `${int.guild.members.cache.size.toLocaleString()}`, inline: true},
            {name: `📑 **Canales:**`, value: `${int.guild.channels.cache.size.toLocaleString()}`, inline: true},
            {name: `📌 **Roles:**`, value: `${int.guild.roles.cache.size.toLocaleString()}`, inline: true},
            {name: `🤝 **Alianzas:**`, value: `Creadas: ${alianzas}`, inline: true},
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
        int.deferReply()

        setTimeout(()=>{
            int.editReply({embeds: [embEstadisticas]})
        }, 500)
    }

    if(int.commandName === "crear-alianza"){
        estadisticas.comandos = estadisticas.comandos + 1
        let dataAli = await sisAlianzas.findOne({_id: int.guildId})
        let servidor = client.guilds.cache.get("773249398431809586")
        let canal = servidor.channels.cache.get("826863938057797633")
        let canalLog = servidor.channels.cache.get("941880387020419083")

        let aliado = int.options.getUser("aliado")
        let notificacion = int.options.getBoolean("notificación")
        console.log(notificacion)

        const embErr1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No eres miembro de soporte del servidor, por lo tanto no puedes usar el comando.`)
        .setColor(colorErr)
        .setTimestamp()
        if(!int.guild.ownerId === int.user.id && !int.member.permissions.has("ADMINISTRATOR") && !int.member.roles.cache.has("887444598715219999")) return int.reply({embeds: [embErr1], ephemeral: true})


        const embAdvertencia = new Discord.MessageEmbed()
        .setTitle("⚠️ Advertencia")
        .setDescription(`Tienes 20 segundos para proporcionar la plantilla.`)
        .setColor(int.guild.me.displayHexColor)
        int.reply({embeds: [embAdvertencia], ephemeral: true})

        const filtro = fm => fm.author.id === int.user.id;

        const colector = int.channel.createMessageCollector({filter: filtro, time: 20000, max: 1})

        colector.on("collect",async m=> {
            if(m){
                let plantilla = m.content.replace(/@/g, "")
                setTimeout(()=>{
                    m.delete()
                }, 400)

                if(aliado){
                    const embErr2 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Un bot no puede ser un aliado.`)
                    .setColor(colorErr)
                    .setTimestamp()
                    if(aliado.bot) return int.reply({embeds: [embErr2], ephemeral: true})

                    const embErr3 = new Discord.MessageEmbed()
                    .setAuthor("❌ Error")
                    .setDescription(`Tu mismo no puedes elegirte como aliado, si quieres hacer una alianza con el servidor deja que otro miembro publique la plantilla te añada como aliado.`)
                    .setColor(colorErr)
                    .setTimestamp()
                    if(aliado.id === int.user.id) return int.reply({embeds: [embErr3], ephemeral: true})

                    console.log("aliado")
                    if(notificacion){
                        console.log("notificaciones Si")
                        const embPlantilla = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setDescription(`Alianza creada por ${int.user} y por el aliado ${aliado}, si quieres hacer una alianza abre un ticket en el canal <#830165896743223327>.`)
                        .setColor(servidor.roles.cache.get("840704364158910475").hexColor)
                        .setFooter(aliado.tag,aliado.displayAvatarURL({dynamic: true}))
                        canal.send({content: `${plantilla}\n<@&840704364158910475>`, embeds: [embPlantilla]}).then(t=>{
                            const embEnviada = new Discord.MessageEmbed()
                            .setTitle("✅ Alianza creada")
                            .setDescription(`Plantilla enviada al canal <#${canal.id}>, gracias por la alianza de ${aliado}.`)
                            .setColor(int.guild.me.displayHexColor)
                            .setTimestamp()
                            int.editReply({embeds: [embEnviada]})
                            int.guild.members.cache.get(aliado.id).roles.add("895394175481159680")
                        })
        
                        const embRegistro = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setTitle("✅ Alianza creada")
                        .setDescription(`Alianza creada por ${int.user}, gracias al aliado ${aliado}, se ha usado el ping <@&840704364158910475>.`)
                        .setColor(servidor.roles.cache.get("840704364158910475").hexColor)
                        .setFooter(aliado.tag,aliado.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        canalLog.send({embeds: [embRegistro]})

                        if(dataAli.miembros.some(s=> s.miembroID === int.user.id)){
                            let posicion
                            for(let i=0; i<dataAli.miembros.length; i++){
                                if(dataAli.miembros[i].miembroID === int.user.id){
                                    posicion = i
                                }
                            }
                            let alianzas = dataAli.miembros[posicion].cantidad
                
                            dataAli.miembros[posicion] = {tag: int.user.tag, miembroID: int.user.id, cantidad: alianzas + 1}
                            await dataAli.save()
                        }else{
                            dataAli.miembros.push({tag: int.user.tag, miembroID: int.user.id, cantidad: 1})
                            await dataAli.save()
                        }
                    }else{
                        console.log("notificaciones no")
                        const embPlantilla = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setDescription(`Alianza creada por ${int.user} y por el aliado ${aliado}, si quieres hacer una alianza abre un ticket en el canal <#830165896743223327>.`)
                        .setColor(servidor.roles.cache.get("840704364158910475").hexColor)
                        .setFooter(aliado.tag,aliado.displayAvatarURL({dynamic: true}))
                        canal.send({content: `${plantilla}`, embeds: [embPlantilla]}).then(t=>{
                            const embEnviada = new Discord.MessageEmbed()
                            .setTitle("✅ Alianza creada")
                            .setDescription(`Plantilla enviada al canal <#${canal.id}>, gracias por la alianza de ${aliado}.`)
                            .setColor(int.guild.me.displayHexColor)
                            .setTimestamp()
                            int.editReply({embeds: [embEnviada]})
                            int.guild.members.cache.get(aliado.id).roles.add("895394175481159680")
                        })
        
                        const embRegistro = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setTitle("✅ Alianza creada")
                        .setDescription(`Alianza creada por ${int.user}, gracias al aliado ${aliado}, no ha utilizado ping.`)
                        .setColor(servidor.roles.cache.get("840704364158910475").hexColor)
                        .setFooter(aliado.tag,aliado.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        canalLog.send({embeds: [embRegistro]})

                        if(dataAli.miembros.some(s=> s.miembroID === int.user.id)){
                            let posicion
                            for(let i=0; i<dataAli.miembros.length; i++){
                                if(dataAli.miembros[i].miembroID === int.user.id){
                                    posicion = i
                                }
                            }
                            let alianzas = dataAli.miembros[posicion].cantidad
                
                            dataAli.miembros[posicion] = {tag: int.user.tag, miembroID: int.user.id, cantidad: alianzas + 1}
                            await dataAli.save()
                        }else{
                            dataAli.miembros.push({tag: int.user.tag, miembroID: int.user.id, cantidad: 1})
                            await dataAli.save()
                        }
                    }
                }else{
                    console.log("no aliado")
                    if(notificacion){
                        console.log("notificaciones si")
                        const embPlantilla = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setDescription(`Alianza creada por ${int.user}, si quieres hacer una alianza abre un ticket en el canal <#830165896743223327>.`)
                        .setColor(servidor.roles.cache.get("840704364158910475").hexColor)
                        .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                        canal.send({content: `${plantilla}\n<@&840704364158910475>`, embeds: [embPlantilla]}).then(t=>{
                            const embEnviada = new Discord.MessageEmbed()
                            .setTitle("✅ Alianza creada")
                            .setDescription(`Plantilla enviada al canal <#${canal.id}>, gracias por la alianza.`)
                            .setColor(int.guild.me.displayHexColor)
                            .setTimestamp()
                            int.editReply({embeds: [embEnviada]})
                        })
        
                        const embRegistro = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setTitle("✅ Alianza creada")
                        .setDescription(`Alianza creada por ${int.user} que ha usado el ping <@&840704364158910475>.`)
                        .setColor(servidor.roles.cache.get("840704364158910475").hexColor)
                        .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        canalLog.send({embeds: [embRegistro]})

                        if(dataAli.miembros.some(s=> s.miembroID === int.user.id)){
                            let posicion
                            for(let i=0; i<dataAli.miembros.length; i++){
                                if(dataAli.miembros[i].miembroID === int.user.id){
                                    posicion = i
                                }
                            }
                            let alianzas = dataAli.miembros[posicion].cantidad
                
                            dataAli.miembros[posicion] = {tag: int.user.tag, miembroID: int.user.id, cantidad: alianzas + 1}
                            await dataAli.save()
                        }else{
                            dataAli.miembros.push({tag: int.user.tag, miembroID: int.user.id, cantidad: 1})
                            await dataAli.save()
                        }
                    }else{
                        console.log("notificaciones no")
                        const embPlantilla = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setDescription(`Alianza creada por ${int.user}, si quieres hacer una alianza abre un ticket en el canal <#830165896743223327>.`)
                        .setColor(servidor.roles.cache.get("840704364158910475").hexColor)
                        .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                        canal.send({content: `${plantilla}`, embeds: [embPlantilla]}).then(t=>{
                            const embEnviada = new Discord.MessageEmbed()
                            .setTitle("✅ Alianza creada")
                            .setDescription(`Plantilla enviada al canal <#${canal.id}>, gracias por la alianza.`)
                            .setColor(int.guild.me.displayHexColor)
                            .setTimestamp()
                            int.editReply({embeds: [embEnviada]})
                        })
        
                        const embRegistro = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setTitle("✅ Alianza creada")
                        .setDescription(`Alianza creada por ${int.user}, no ha utilizado ping.`)
                        .setColor(servidor.roles.cache.get("840704364158910475").hexColor)
                        .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                        canalLog.send({embeds: [embRegistro]})

                        if(dataAli.miembros.some(s=> s.miembroID === int.user.id)){
                            let posicion
                            for(let i=0; i<dataAli.miembros.length; i++){
                                if(dataAli.miembros[i].miembroID === int.user.id){
                                    posicion = i
                                }
                            }
                            let alianzas = dataAli.miembros[posicion].cantidad
                
                            dataAli.miembros[posicion] = {tag: int.user.tag, miembroID: int.user.id, cantidad: alianzas + 1}
                            await dataAli.save()
                        }else{
                            dataAli.miembros.push({tag: int.user.tag, miembroID: int.user.id, cantidad: 1})
                            await dataAli.save()
                        }
                    }
                }
                console.log(plantilla)
            }
        })

    }

    if(int.commandName === "alianzas"){
        estadisticas.comandos = estadisticas.comandos + 1
        let dataAli = await sisAlianzas.findOne({_id: int.guildId})
        if(!dataAli){
            let alianzas = await sisAlianzas.create({
                _id: int.guildId,
                miembros: {miembroID: int.user.id, cantidad: 0}
            })
            return await alianzas.save()
        }

        const embErr1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No eres miembro de soporte del servidor, por lo tanto no puedes usar el comando.`)
        .setColor(colorErr)
        .setTimestamp()
        if(!int.guild.ownerId === int.user.id && !int.member.permissions.has("ADMINISTRATOR") && !int.member.roles.cache.has("887444598715219999")) return int.reply({embeds: [embErr1], ephemeral: true})

        let miembro = int.options.getUser("miembro")
        int.deferReply()

        if(miembro){
            const embErr2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`Un bot no puede hacer alianzas, por lo tanto no tendrá ninguna alianza.`)
            .setColor(colorErr)
            .setTimestamp()
            if(miembro.bot) return int.reply({embeds: [embErr2], ephemeral: true})

            if(dataAli.miembros.some(s=> s.miembroID === miembro.id)){
                let posicion
                for(let i=0; i<dataAli.miembros.length; i++){
                    if(dataAli.miembros[i].miembroID === miembro.id){
                        posicion = i
                    }
                }

                if(miembro.id === int.user.id){
                    const embALianzas = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle("🤝 Alianzas")
                    .setDescription(`Has echo **${dataAli.miembros[posicion].cantidad}** alianzas.`)
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                    setTimeout(()=>{
                        int.editReply({embeds: [embALianzas]})
                    },500)
                }else{ 
                    const embALianzas = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle("🤝 Alianzas")
                    .setDescription(`${miembro} ha echo **${dataAli.miembros[posicion].cantidad}** alianzas.`)
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(miembro.tag,miembro.displayAvatarURL({dynamic: true}))
                    setTimeout(()=>{
                        int.editReply({embeds: [embALianzas]})
                    },500)
                }
            }else{
                if(miembro.id === int.user.id){
                    const embALianzas = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle("🤝 Alianzas")
                    .setDescription(`Has echo **0** alianzas.`)
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                    setTimeout(()=>{
                        int.editReply({embeds: [embALianzas]})
                    },500)
                    dataAli.miembros.push({tag: int.user.tag, miembroID: int.user.id, cantidad: 0})
                    await dataAli.save()
                }else{ 
                    const embALianzas = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle("🤝 Alianzas")
                    .setDescription(`${miembro} ha echo **0** alianzas.`)
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(miembro.tag,miembro.displayAvatarURL({dynamic: true}))
                    setTimeout(()=>{
                        int.editReply({embeds: [embALianzas]})
                    },500)
                }
            }
        }else{
            if(dataAli.miembros.some(s=> s.miembroID === int.user.id)){
                let posicion
                for(let i=0; i<dataAli.miembros.length; i++){
                    if(dataAli.miembros[i].miembroID === int.user.id){
                        posicion = i
                    }
                }

                const embALianzas = new Discord.MessageEmbed()
                .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                .setTitle("🤝 Alianzas")
                .setDescription(`Has echo **${dataAli.miembros[posicion].cantidad}** alianzas.`)
                .setColor(int.guild.me.displayHexColor)
                .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                setTimeout(()=>{
                    int.editReply({embeds: [embALianzas]})
                },500)
            }else{
                const embALianzas = new Discord.MessageEmbed()
                .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                .setTitle("🤝 Alianzas")
                .setDescription(`Has echo **0** alianzas.`)
                .setColor(int.guild.me.displayHexColor)
                .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                setTimeout(()=>{
                    int.editReply({embeds: [embALianzas]})
                },500)

                dataAli.miembros.push({tag: int.user.tag, miembroID: int.user.id, cantidad: 0})
                await dataAli.save()
            }
        }
    }

    if(int.commandName === "top-alianzas"){
        estadisticas.comandos = estadisticas.comandos + 1
        let dataAli = await sisAlianzas.findOne({_id: int.guildId})
        let ordenado = dataAli.miembros.sort((a,b)=> b.cantidad - a.cantidad)
        let topC = []
        for(let i=0; i<dataAli.miembros.length; i++){
            topC.push(`**${i+1}.** ${client.users.cache.get(dataAli.miembros[i].miembroID).tag} - **${(dataAli.miembros[i].cantidad).toLocaleString()}**`)
        }

        let segPage
        if(String(ordenado.length).slice(-1) === 0){
            segPage = Math.floor(ordenado.length / 10)
        }else{
            segPage = Math.floor(ordenado.length / 10 + 1)
        }

        let ttp1 = 0
        let ttp2 = 10
        let pagina = 1

            
        if(ordenado.length > 10){
            const embPriTop = new Discord.MessageEmbed()
            .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
            .setTitle(`🤝 Tabla de clasificaciones de alianzas`)
            .setColor(int.guild.me.displayHexColor)

            const embTop = new Discord.MessageEmbed()
            .setDescription(`Hay un total de **${(ordenado.length).toLocaleString()}** usuarios que están en la tabla.\n\n${topC.slice(ttp1,ttp2).join("\n")}`)
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
            int.reply({embeds: [embPriTop]})
             
            const mensajeSend = await int.channel.send({allowedMentions: {repliedUser: false}, embeds: [embTop], components: [botones1]})
            const filtro = i=> i.user.id === int.user.id;
            const colector = mensajeSend.createMessageComponentCollector({filter: filtro, time: 60000})


            colector.on("collect", async bt => {
                if(bt.customId === "Si"){
                    if(ttp2 - 10 <= 10){
                        ttp1 = ttp1 - 10
                        ttp2 = ttp2 - 10
                        pagina = pagina - 1
                        embTop
                        .setDescription(`Hay un total de **${(ordenado.length).toLocaleString()}** usuarios que están en la tabla.\n\n${topC.slice(ttp1,ttp2).join("\n")}`)
                        .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                        return await bt.update({embeds: [embTop], components: [botones1]})
                    }
                    ttp1 = ttp1 - 10
                    ttp2 = ttp2 - 10
                    pagina = pagina - 1
                    
                    embTop
                    .setDescription(`Hay un total de **${(ordenado.length).toLocaleString()}** usuarios que están en la tabla.\n\n${topC.slice(ttp1,ttp2).join("\n")}`)
                    .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                    await bt.update({embeds: [embTop], components: [botonesPrinc]})
                }
                if(bt.customId === "No"){
                    if(ttp2 + 10 >= ordenado.length){
                        ttp1 = ttp1 + 10
                        ttp2 = ttp2 + 10
                        pagina = pagina + 1
                        embTop
                        .setDescription(`Hay un total de **${(ordenado.length).toLocaleString()}** usuarios que están en la tabla.\n\n${topC.slice(ttp1,ttp2).join("\n")}`)
                        .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                        return await bt.update({embeds: [embTop], components: [botones2]})
                    }
                    ttp1 = ttp1 + 10
                    ttp2 = ttp2 + 10
                    pagina = pagina + 1

                    embTop
                    .setDescription(`Hay un total de **${(ordenado.length).toLocaleString()}** usuarios que están en la tabla.\n\n${topC.slice(ttp1,ttp2).join("\n")}`)
                    .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
                    await bt.update({embeds: [embTop], components: [botonesPrinc]})
                }
            })  
        }else{
            const embTop = new Discord.MessageEmbed()
            .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
            .setTitle(`🤝 Tabla de clasificaciones de alianzas`)
            .setDescription(`Hay un total de **${(ordenado.length).toLocaleString()}** usuarios que están en la tabla.\n\n${topC.slice(ttp1,ttp2).join("\n")}`)
            .setColor(int.guild.me.displayHexColor)
            .setFooter(`Pagina ${pagina}/${segPage}`,int.guild.iconURL({dynamic: true}))
            .setTimestamp()
            int.reply({allowedMentions: {repliedUser: false},embeds: [embTop]})
        }   
    }

    if(int.commandName === "marcar"){
        estadisticas.comandos = estadisticas.comandos + 1
        let dataSug = await systemSug.findOne({_id: int.guildId})

        const embErrP1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No eres administrador por lo tanto no puedes usar el comando.`)
        .setColor(colorErr)
        .setTimestamp()
        if(!int.guild.ownerId === int.user.id && !int.member.permissions.has("ADMINISTRATOR")) return int.reply({embeds: [embErrP1], ephemeral: true})

        let mensajeID = int.options.getString("id")

        const embErrP2 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`La ID proporcionada no pertenece a la de ninguna sugerencia que este en la base de datos.`)
        .setColor(colorErr)
        .setTimestamp()
        if(!dataSug.mensajes.some(s=> s.id === mensajeID)) return int.reply({embeds: [embErrP2], ephemeral: true})

        const embErrP3 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No se encontró ninguna sugerencia con esa ID.`)
        .setColor(colorErr)
        .setTimestamp()
        if(!int.guild.channels.cache.get("828300239488024587").messages.cache.get(mensajeID)) return int.reply({embeds: [embErrP3], ephemeral: true})

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

    if(int.commandName === "sugerencias"){
        estadisticas.comandos = estadisticas.comandos + 1
        let dataSug = await systemSug.findOne({_id: int.guildId})
        let miembro = int.options.getUser("miembro")
        if(!dataSug.miembros.some(s=> s.id === int.user.id)){
            dataSug.miembros.push({id: int.user.id, sugerencias: 0, aceptadas: 0, denegadas: 0})
            await dataSug.save()
        }

        if(miembro){
            console.log(miembro.user)
            const embErr2 = new Discord.MessageEmbed()
            .setAuthor("❌ Error")
            .setDescription(`Un bot no puede hacer sugerencias, por lo tanto no tendrá ninguna sugerencia.`)
            .setColor(colorErr)
            .setTimestamp()
            if(miembro.bot) return int.reply({embeds: [embErr2], ephemeral: true})
            int.deferReply()

            if(miembro.id === int.user.id){
                let posicion 
                for(let i=0; i<dataSug.miembros.length; i++){
                    if(dataSug.miembros[i].id === miembro.id){
                        posicion = i
                    }
                }

                if(dataSug.miembros[posicion].sugerencias <= 0){
                    const embSugerencias = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle("🗳️ Sugerencias")
                    .setDescription(`No has echo ninguna sugerencia.`)
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        int.editReply({embeds: [embSugerencias]})
                    }, 500)
                }else{
                    const embSugerencias = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle("🗳️ Sugerencias")
                    .setDescription(`Has echo un total de **${dataSug.miembros[posicion].sugerencias}** sugerencias de las cuales **${dataSug.miembros[posicion].aceptadas}** han sido aceptaadas y **${dataSug.miembros[posicion].denegadas}** denegadas.`)
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    int.reply({embeds: [embSugerencias]})
                    setTimeout(()=>{
                        int.editReply({embeds: [embSugerencias]})
                    }, 500)
                }
            }else{
                if(dataSug.miembros.some(s=> s.id === miembro.id)){
                    let posicion 
                    for(let i=0; i<dataSug.miembros.length; i++){
                        if(dataSug.miembros[i].id === miembro.id){
                            posicion = i
                        }
                    }

                    if(dataSug.miembros[posicion].sugerencias <= 0){
                        const embSugerencias = new Discord.MessageEmbed()
                        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                        .setTitle("🗳️ Sugerencias")
                        .setDescription(`${miembro} no ha echo ninguna sugerencia.`)
                        .setColor(int.guild.me.displayHexColor)
                        .setFooter(miembro.tag,miembro.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                        setTimeout(()=>{
                            int.editReply({embeds: [embSugerencias]})
                        }, 500)
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
                        }, 500)
                    }
                }else{
                    const embSugerencias = new Discord.MessageEmbed()
                    .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                    .setTitle("🗳️ Sugerencias")
                    .setDescription(`${miembro} no ha echo ninguna sugerencia.`)
                    .setColor(int.guild.me.displayHexColor)
                    .setFooter(miembro.tag,miembro.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    setTimeout(()=>{
                        int.editReply({embeds: [embSugerencias]})
                    }, 500)
                }
            }
        }else{
            let posicion 
            for(let i=0; i<dataSug.miembros.length; i++){
                if(dataSug.miembros[i].id === int.user.id){
                    posicion = i
                }
            }

            if(dataSug.miembros[posicion].sugerencias <= 0){
                const embSugerencias = new Discord.MessageEmbed()
                .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
                .setTitle("🗳️ Sugerencias")
                .setDescription(`No has echo ninguna sugerencia.`)
                .setColor(int.guild.me.displayHexColor)
                .setFooter(int.guild.name,int.guild.iconURL({dynamic: true}))
                .setTimestamp()
                setTimeout(()=>{
                    int.editReply({embeds: [embSugerencias]})
                }, 500)
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
                }, 500)
            }
        }
    }

    if(int.commandName === "sugerir"){
        estadisticas.comandos = estadisticas.comandos + 1

        const embCoolSug = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`Espera **10** minutos para volver a usar el comando.`)
        .setColor(colorErr)
        if(coolSugerencias.some(s=> s === int.user.id)) return int.reply({embeds: [embCoolSug], ephemeral: true})

        let dataSug = await systemSug.findOne({_id: int.guildId})
        let sugerencia = int.options.getString("sugerencia")
        console.log(sugerencia)

        dataSug.mensajes.push({id: "", origenID: "", autorID: int.user.id, sugerencia: sugerencia, estado: "normal", positivas: 0, negativas: 0})
        await dataSug.save()

        const embSugerencia = new Discord.MessageEmbed()
        .setAuthor(int.user.tag,int.user.displayAvatarURL({dynamic: true}))
        .setTitle("⚠️ ¿Estas seguro de enviar esa sugerencia?")
        .addField(`**Tu sugerencia:**`, `${sugerencia}`)
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

        int.reply({embeds: [embSugerencia], components: [botones], ephemeral: true})  
        coolSugerencias.push(int.user.id)
        setInterval(()=>{
            for(let i=0; i<coolSugerencias.length; i++){
                if(coolSugerencias[i] === int.user.id){
                    coolSugerencias.splice(i,1)
                }
            }
        }, 10*60000)  
    }

    if(int.isButton()){
        if(int.customId === "confirmar"){
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
                dataSug.sugerencias = {cantidad: cant + 1, aceptadas: acept, denegadas: den, implementadas: imple, en_progreso: enP, no_sucedera: noSus}
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
        if(int.customId === "cancelar"){
            let dataSug = await systemSug.findOne({_id: int.guildId})

            for(let i=0; i<dataSug.mensajes.length; i++){
                if(dataSug.mensajes[i].autorID === int.user.id){
                    dataSug.mensajes[i].splice(i,1)
                    await dataSug.save()
                }
            }
            

            const embCancel = new Discord.MessageEmbed()
            .setTitle("<a:negativo:856967325505159169> Acción cancelada")
            .setDescription(`Has cancelado la sugerencia.`)
            .setColor(colorErr)
            int.update({embeds: [embCancel], components: []})
        }

        if(int.customId === "aprobar"){
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
                if(dataSug.mensajes[i].origenID === int.message.id){
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

                if(dataSug.miembros.some(s=> s.id === miembro.id)){
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

        if(int.customId === "implementada"){
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
        if(int.customId === "en progreso"){
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
        if(int.customId === "no sucedera"){
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
        if(int.customId === "normal"){
            let dataSug = await systemSug.findOne({_id: int.guildId})
            let canal = int.guild.channels.cache.get("828300239488024587")
            let rol = int.guild.roles.cache.get("840704367467954247")

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
    }

    if(int.isSelectMenu()){
        if(int.customId === "genero"){
            let valores = ["mujer","hombre"]
            let roles = ["828720344869240832", "828720347246624769"]
            for(let i=0; i<valores.length; i++){
                if(int.values[0] === valores[i]){
                    if(int.member.roles.cache.has(roles[i])){
                        const embYaLoTiene = new Discord.MessageEmbed()
                        .setAuthor("➖ Error")
                        .setDescription(`Te he eliminado el rol <@&${roles[i]}>.`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        int.member.roles.remove(roles[i])
                        return int.reply({embeds: [embYaLoTiene], ephemeral: true})
                    }
    
                    for(let e=0; e<roles.length; e++){
                        if(int.member.roles.cache.has(roles[e])){
                            const embRemoveYAdd = new Discord.MessageEmbed()
                            .setAuthor("🔃 Intercambio de roles")
                            .setDescription(`Solo puedes tener un rol de **Genero** por lo tanto te he eliminado el rol ${int.guild.roles.cache.get(roles[e])} y te he agregado el rol ${int.guild.roles.cache.get(roles[i])} el cual has elegido ahora.`)
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

        if(int.customId === "edad"){
            let valores = ["-18","+18"]
            let roles = ["828720200924790834","828720340719894579"]
            for(let i=0; i<valores.length; i++){
                if(int.values[0] === valores[i]){
                    if(int.member.roles.cache.has(roles[i])){
                        const embYaLoTiene = new Discord.MessageEmbed()
                        .setAuthor("➖ Error")
                        .setDescription(`Te he eliminado el rol <@&${roles[i]}>.`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        int.member.roles.remove(roles[i])
                        return int.reply({embeds: [embYaLoTiene], ephemeral: true})
                    }
    
                    for(let e=0; e<roles.length; e++){
                        if(int.member.roles.cache.has(roles[e])){
                            const embRemoveYAdd = new Discord.MessageEmbed()
                            .setAuthor("🔃 Intercambio de roles")
                            .setDescription(`Solo puedes tener un rol de **Edad** por lo tanto te he eliminado el rol ${int.guild.roles.cache.get(roles[e])} y te he agregado el rol ${int.guild.roles.cache.get(roles[i])} el cual has elegido ahora.`)
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

        if(int.customId === "videojuegos"){
            let valores = ["fornite","minecraft","free","roblox","GTA","amongus"]
            let roles = ["886331637690953729","886331642074005545","886331630690631691", "885005724307054652","886331626643152906", "886331634272587806"]
            for(let i=0; i<valores.length; i++){
                if(int.values[0] === valores[i]){
                    if(int.member.roles.cache.has(roles[i])){
                        const embYaLoTiene = new Discord.MessageEmbed()
                        .setAuthor("➖ Error")
                        .setDescription(`Te he eliminado el rol <@&${roles[i]}>.`)
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

        if(int.customId === "colores"){
            let valores = ["negro","cafe","naranja","rojo","rosa","morado","azul","celeste","cian","verde","lima","amarillo","gris","blanco"]
            let roles = ["825913849504333874","825913858446327838","825913837944438815","823639766226436146","823639778926395393", "825913846571991100", "823639775499386881", "825913860992270347", "825913843645546506","823639769300467724", "825913834803560481","825913840981901312", "825913855392743444","825913852654780477"]
            for(let i=0; i<valores.length; i++){
                if(int.values[0] === valores[i]){
                    if(int.member.roles.cache.has(roles[i])){
                        const embYaLoTiene = new Discord.MessageEmbed()
                        .setAuthor("➖ Error")
                        .setDescription(`Te he eliminado el rol <@&${roles[i]}>.`)
                        .setColor("#ff0000")
                        .setTimestamp()
                        int.member.roles.remove(roles[i])
                        return int.reply({embeds: [embYaLoTiene], ephemeral: true})
                    }
    
                    for(let e=0; e<roles.length; e++){
                        if(int.member.roles.cache.has(roles[e])){
                            const embRemoveYAdd = new Discord.MessageEmbed()
                            .setAuthor("🔃 Intercambio de roles")
                            .setDescription(`Solo puedes tener un rol de **Colores** por lo tanto te he eliminado el rol ${int.guild.roles.cache.get(roles[e])} y te he agregado el rol ${int.guild.roles.cache.get(roles[i])} el cual has elegido ahora.`)
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

        if(int.customId === "notificaciones"){
            let valores = ["anuncio","alianza","sorteo","encuesta","evento","sugerencia","postulacion","revivir"]
            let roles = ["840704358949584926","840704364158910475","840704370387451965","840704372911505418","915015715239637002","840704367467954247","840704375190061076","850932923573338162"]
            for(let i=0; i<valores.length; i++){
                if(int.values[0] === valores[i]){
                    if(int.member.roles.cache.has(roles[i])){
                        const embYaLoTiene = new Discord.MessageEmbed()
                        .setAuthor("➖ Error")
                        .setDescription(`Te he eliminado el rol <@&${roles[i]}>.`)
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
    }
})

client.on("messageReactionAdd", async (mra, user) => {
    if(mra.message.guildId === servidorID){
        if(user.bot) return;
        let dataSug = await systemSug.findOne({_id: mra.message.guildId})
        let color = mra.message.guild.roles.cache.get("840704367467954247").hexColor

        for(let i=0; i<dataSug.mensajes.length; i++){
            if(dataSug.mensajes[i].id === mra.message.id){
                if(mra.emoji.id === "946826193032851516"){
                    mra.message.reactions.cache.get("946826212960010251").users.remove(user.id).then(console.log("elimine reaccion"))
                    console.log(mra.message.embeds[0])

                    let positivas = mra.count - 1
                    let negativas = dataSug.mensajes[i].negativas
                    let totales = positivas + negativas

                    let porcentajePositivo = String(positivas*100/totales).slice(0,5)
                    let porcentajeNegativo = String(negativas*100/totales).slice(0,5)


                    let carga = "█"
                    let vacio = " "
                    let diseñoPositivo = ""
                    let diseñoNegativo = ""
                    Number(porcentajePositivo)/100*20
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

                    console.log(positivas)

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

                    let orID = dataSug.mensajes[i].origenID
                    let miemID = dataSug.mensajes[i].autorID
                    let sug = dataSug.mensajes[i].sugerencia
                    let est = dataSug.mensajes[i].estado
                    dataSug.mensajes[i] = {id: mra.message.id, origenID: orID, autorID: miemID, sugerencia: sug, estado: est, positivas: positivas, negativas: negativas}
                    await dataSug.save()
                }

                if(mra.emoji.id === "946826212960010251"){
                    mra.message.reactions.cache.get("946826193032851516").users.remove(user.id)

                    let positivas = dataSug.mensajes[i].positivas
                    let negativas = mra.count - 1
                    let totales = positivas + negativas

                    let porcentajePositivo = String(positivas*100/totales).slice(0,5)
                    let porcentajeNegativo = String(negativas*100/totales).slice(0,5)


                    let carga = "█"
                    let vacio = " "
                    let diseñoPositivo = ""
                    let diseñoNegativo = ""
                    Number(porcentajePositivo)/100*20
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

                    let orID = dataSug.mensajes[i].origenID
                    let miemID = dataSug.mensajes[i].autorID
                    let sug = dataSug.mensajes[i].sugerencia
                    let est = dataSug.mensajes[i].estado
                    dataSug.mensajes[i] = {id: mra.message.id, origenID: orID, autorID: miemID, sugerencia: sug, estado: est, positivas: positivas, negativas: negativas}
                    await dataSug.save()
                }
            }
        }
    }
})

client.on("messageReactionRemove", async (mrr, user) => {
    if(mrr.message.guildId === servidorID){
        if(user.bot) return;
        let dataSug = await systemSug.findOne({_id: mrr.message.guildId})

        for(let i=0; i<dataSug.mensajes.length; i++){
            if(dataSug.mensajes[i].id === mrr.message.id){
                if(mrr.emoji.id === "946826193032851516"){
                    let positivas = mrr.count - 1
                    let negativas = dataSug.mensajes[i].negativas
                    let totales = positivas + negativas

                    let porcentajePositivo = String(positivas*100/totales).slice(0,5)
                    let porcentajeNegativo = String(negativas*100/totales).slice(0,5)


                    let carga = "█"
                    let vacio = " "
                    let diseñoPositivo = ""
                    let diseñoNegativo = ""
                    Number(porcentajePositivo)/100*20
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
                   
                    let orID = dataSug.mensajes[i].origenID
                    let miemID = dataSug.mensajes[i].autorID
                    let sug = dataSug.mensajes[i].sugerencia
                    let est = dataSug.mensajes[i].estado
                    dataSug.mensajes[i] = {id: mrr.message.id, origenID: orID, autorID: miemID, sugerencia: sug, estado: est, positivas: positivas, negativas: negativas}
                    await dataSug.save()
                }

                
                if(mrr.emoji.id === "946826212960010251"){
                    let positivas = dataSug.mensajes[i].positivas
                    let negativas = mrr.count - 1
                    let totales = positivas + negativas

                    let porcentajePositivo = String(positivas*100/totales).slice(0,5)
                    let porcentajeNegativo = String(negativas*100/totales).slice(0,5)


                    let carga = "█"
                    let vacio = " "
                    let diseñoPositivo = ""
                    let diseñoNegativo = ""
                    Number(porcentajePositivo)/100*20
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

                    let orID = dataSug.mensajes[i].origenID
                    let miemID = dataSug.mensajes[i].autorID
                    let sug = dataSug.mensajes[i].sugerencia
                    let est = dataSug.mensajes[i].estado
                    dataSug.mensajes[i] = {id: mrr.message.id, origenID: orID, autorID: miemID, sugerencia: sug, estado: est, positivas: positivas, negativas: negativas}
                    await dataSug.save()
                }
            }
        }
    }
})

//  Registros de bienvenidas y despedidas:
client.on("guildMemberAdd", addR => {
    if(addR.guild.id === "773249398431809586"){
        if(!addR.user.bot){
            addR.roles.add(["823372926707171358","887450254826418236","852684847901704192","830260569012699146","840704377962758204","887443737804931122","885301022677942272","887443742469029961"])
        }
    }
})

// Bienvenida con canvas
client.on("guildMemberAdd",async bme => {
    if(bme.guild.id === "773249398431809586"){
      estadisticas.entradas = estadisticas.entradas + 1
        if(bme.user.bot){
            const embBot = new Discord.MessageEmbed()
            .setTitle("🤖 Se unio un bot")
            .setThumbnail(bme.displayAvatarURL())
            .setDescription(`${bme}\n${bme.user.tag}\nCreado ${bme.user.createdAt.toLocaleString()}`)
            .setColor("#0084EC")
            .setTimestamp()
            client.channels.cache.get("830618607863988294").send({embeds: [embBot]})

            const embCreMD = new Discord.MessageEmbed()
            .setAuthor(bme.guild.name,bme.guild.iconURL({dynamic: true}))
            .setThumbnail(bme.displayAvatarURL())
            .setTitle("🤖 Se unio un Bot")
            .setDescription(`${bme}\n${bme.user.tag}\n${bme.user.id}\n${bme.user.createdAt.toLocaleString()}`)
            .setColor("#0084ec")
            .setTimestamp()
            client.users.cache.get(creadorID).send({embeds: [embCreMD]})
        }else{
            let imagen = "https://cdn.discordapp.com/attachments/901313790765854720/902607815359758356/fondoBienv.png"
            const canvas = Canvas.createCanvas(1000, 500);
            const context = canvas.getContext("2d");
            const fondo = await Canvas.loadImage(imagen);

            context.drawImage(fondo, 0, 0, canvas.width, canvas.height);
            context.strokeStyle = "#000000";
            context.strokeRect(0,0, canvas.width, canvas.height);

            context.beginPath();
            context.arc(500, 160, 145, 0, Math.PI * 2, true);
            context.fillStyle = `${bme.guild.me.displayHexColor}`;
            context.stroke();
            context.fill();

            context.textAlign = "center"
            context.font = "80px MADE TOMMY"
            context.fillStyle = "#ffffff"
            context.fillText("Bienvenid@", 500, 375)

            context.font = '45px MADE TOMMY';
            context.fillStyle = '#ffffff';
            context.fillText(`${bme.user.tag}`, 500, 435);

            context.font = '38px MADE TOMMY'
            context.fillStyle = '#ffffff';
            context.fillText(`disfruta del servidor`, 500, 480);

            context.beginPath();
            context.arc(500, 160, 140, 0, Math.PI * 2, true);
            context.fillStyle = `${bme.guild.me.displayHexColor}`;
            context.closePath();
            context.clip();

            const avatar = await Canvas.loadImage(bme.displayAvatarURL({format: "jpg", size: 2048}))
            context.drawImage(avatar, 360, 20, 280, 280);

            const finalImg = new Discord.MessageAttachment(canvas.toBuffer(), "imagen.png")


            const bienve = new Discord.MessageEmbed()
            .setAuthor(bme.user.tag,bme.user.displayAvatarURL({dynamic: true}))
            .setImage(`attachment://imagen.png`)
            .setTitle("👋 ¡Bienvenido/a!")
            .setDescription(`💈 Pasate por el canal <#823639152922460170> en el podrás obtener roles que cambiaran el color de tu nombre dentro del servidor, y muchos otros roles.\n\n📢 Promociona todo tipo de contenido en el canal **<#836315643070251008>**.\n\n📜 Tambien pásate por el canal <#823343749039259648> el canal de reglas, léelas para evitar sanciones.`)
            .setColor(`${bme.guild.me.displayHexColor}`)
            .setFooter(`Bienvenido/a a ${bme.guild.name}`,bme.guild.iconURL({dynamic: true}))
            .setTimestamp()
            client.channels.cache.get("837563299058679828").send({embeds: [bienve], files: [finalImg], content: `**Hola ${bme}**`})

            let usBanner = await client.users.fetch(bme.id, {force: true})
            const embBien = new Discord.MessageEmbed()
            .setAuthor(bme.user.tag,bme.user.displayAvatarURL({dynamic: true}))
            .setThumbnail(bme.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
            .setImage(usBanner.bannerURL({dynamic: true, format: "gif"||"png", size: 4096}))
            .setTitle("📥 Se unió un usuario")
            .setDescription(`${bme} **se unio al servidor.**\n📅 **Creacion de la cueta:**\n<t:${Math.round(bme.user.createdAt / 1000)}:R>`)
            .setColor("#00ff00")
            .setFooter(bme.guild.name,bme.guild.iconURL({dynamic: true}))
            .setTimestamp()
            client.channels.cache.get("830618607863988294").send({embeds: [embBien]})
        }
    }
})

client.on("guildMemberRemove",async des => {
    if(des.guild.id === servidorID){
        let mbanner = await client.users.fetch(des.id, {force: true})
        const embDes = new Discord.MessageEmbed()
        .setAuthor(des.user.username,des.user.displayAvatarURL({dynamic: true, format: "png"||"gif", size: 4096}))
        .setThumbnail(des.user.displayAvatarURL({dynamic: true}))
        .setImage(mbanner.bannerURL({dynamic: true, format: "png"||"gif", size: 4096}))
        .setTitle("📤 Se fue un miembro")
        .setDescription(`${des} **salio del servidor.**\n📥 **Seunio:**\n<t:${Math.round(des.joinedAt / 1000)}:R>`)
        .setColor("#ff0000")
        .setFooter(des.guild.name,des.guild.iconURL({dynamic: true}))
        .setTimestamp()
        client.channels.cache.get("830618607863988294").send({embeds: [embDes]})
    }
})


client.on("messageCreate", async msg => {
    if(msg.guildId === servidorID){
        estadisticas.mensajes = estadisticas.mensajes + 1
    }
    if(msg.author.bot) return;

    if(msg.channelId === "856425774446149673"){
        let cantidad = Math.floor(Math.random()*(100-1)+1)
        if(msg.content.toLowerCase() === "hola" && cantidad >= 30 && cantidad <= 60){
            msg.channel.sendTyping()
            setTimeout(()=>{
                msg.reply("Hola")
            }, 600)
        }
        let xds = ["xd","jaja","jajaja","sjsjs","jsjs","jiji","XD","Xd","xD"]
        if(xds.some(s=> s === msg.content.toLowerCase()) && cantidad >= 30 && cantidad <= 60){
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
        .setDescription(`**El bot de ${msg.guild.name}**, necesitas información o quieres usar algún comando mío, usa el comando ${"``"}s.comandos${"``"}`)
        .setColor("#1215B7")
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        msg.reply({embeds: [embedMen]})
    }

    if(msg.content === "||canvas"){
        let frases = ["¡Feliz año nuevo!","Gracias por estar aquí","Te deseamos un feliz y prospero año nuevo.","¡Increíble te uniste a este servidor y ahora este año será tu mejor año.","¡Bienvenido!, de parte del staff te deseamos que hagas realidad todas tus metas y objetivos."]
        let random = Math.floor(Math.random()*frases.length)
        const canvas = Canvas.createCanvas(1700, 1100);
        const context = canvas.getContext("2d");
        const fondo = await Canvas.loadImage(`https://cdn.discordapp.com/attachments/901313790765854720/926921024795181074/banner_2022.jpg`)
    
        context.drawImage(fondo, 0, 0, canvas.width, canvas.height);
        context.strokeStyle = "#000000";
        context.strokeRect(0,0, canvas.width, canvas.height);
    
        context.beginPath();
        context.arc(400, 260, 208, 0, Math.PI * 2, true);
        context.fillStyle = "#FEEE3B";
        context.stroke();
        context.fill();
    
        // context.textAlign = "center"
        context.font = "100px MADE TOMMY"
        context.fillStyle = "#FEEE3B"
        context.fillText("Bienvenid@", 680, 140)
    
        context.font = '80px MADE TOMMY';
        context.fillStyle = '#FEEE3B';
        context.fillText(`${msg.author.tag}`, 680, 274);
    
        context.font = '70px MADE TOMMY'
        context.fillStyle = '#FEEE3B';
        context.fillText(`¡Disfruta del servidor!`, 680, 392);
    
        context.beginPath();
        context.arc(400, 260, 200, 0, Math.PI * 2, true);
        context.fillStyle = "#FEEE3B"
        context.closePath();
        context.clip();
    
        const avatar = await Canvas.loadImage(msg.author.displayAvatarURL({format: "jpg", size: 2048}))
        context.drawImage(avatar, 200, 60, 400, 400);
    
        const finalImg = new Discord.MessageAttachment(canvas.toBuffer(), "imagen.png")
    
    
        const bienve = new Discord.MessageEmbed()
        .setAuthor(msg.guild.name,msg.guild.iconURL())
        .setImage(`attachment://imagen.png`)
        .setTitle("👋 ¡Bienvenido/a!")
        .setDescription(`**${msg.author}**\n\n💈 Pasate por el canal <#823639152922460170> en el podrás obtener roles que cambiaran el color de tu nombre dentro del servidor, y muchos otros roles.\n\n📢 Promociona todo tipo de contenido en el canal **<#836315643070251008>**.\n\n📜 Tambien pásate por el canal <#823343749039259648> el canal de reglas, léelas para evitar sanciones.`)
        .setColor("#FEEE3B")
        .setFooter(frases[random],client.user.displayAvatarURL())
        .setTimestamp()
    
        msg.channel.send({embeds: [bienve], files: [finalImg]})
      }
})

// Comandos
client.on("messageCreate", async msg => {
    const prefijo = "p."

    if(msg.author.bot) return;
    if(!msg.content.startsWith(prefijo)) return; 

    const args = msg.content.slice(prefijo.length).trim().split(/ +/g);
    const comando = args.shift()


    if(comando === "ayuda"){
        msg.channel.sendTyping()
        const embedMen = new Discord.MessageEmbed()
        .setAuthor(`Hola ${msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`Soy ${client.user.username}`)
        .setDescription(`**El bot de ${msg.guild.name}**, necesitas información o quieres usar algún comando mío, usa el comando ${"``"}s.comandos${"``"}`)
        .setColor(msg.guild.me.displayHexColor)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        setTimeout(()=>{
            msg.reply({embeds: [embedMen]})
        }, 400)
    }

    //Comandos
    if(comando === "comandos" || comando === "cmds"){
        msg.channel.sendTyping()
        let descripcion = []

        if(msg.member.permissions.has("ADMINISTRATOR")){
            descripcion = `**🌐 Generales:**\n\`\`${prefijo}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefijo}masInfo\`\` **|** Te muestra un canal en el que puedes encontrar mas información.\n\`\`${prefijo}suicide\`\` **|** Te suicidas.\n\`\`${prefijo}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.\n\n**🔰 Moderación:**\n\`\`encuesta\`\` **|** Publica la encuesta para postularse.\n\`\`${prefijo}clear\`\` **|** Elimina mensajes de un canal.\n\`\`${prefijo}carcel\`\` **|** Envia a un miembro a la cárcel.\n\`\`${prefijo}kick\`\` **|** Expulsa a un miembro.\n\`\`${prefijo}ban\`\` **|** Banea a un miembro.\n\`\`${prefijo}bans\`\` **|** Muestra una lista de baneos.\n\`\`${prefijo}unban\`\` **|** Elimina el ban a un usuario.\n\`\`${prefijo}addreaction\`\` **|** Agrega una reacción a un mensaje por medio del bot.`
        }else{
            if(msg.member.roles.cache.get("773271945894035486")){
                descripcion = `**🌐 Generales:**\n\`\`${prefijo}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefijo}masInfo\`\` **|** Te muestra un canal en el que puedes encontrar mas información.\n\`\`${prefijo}suicide\`\` **|** Te suicidas.\n\`\`${prefijo}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.\n\n**🔰 Moderación:**\n\`\`encuesta\`\` **|** Publica la encuesta para postularse.\n\`\`${prefijo}clear\`\` **|** Elimina mensajes de un canal.\n\`\`${prefijo}carcel\`\` **|** Envia a un miembro a la cárcel.\n\`\`${prefijo}kick\`\` **|** Expulsa a un miembro.\n\`\`${prefijo}ban\`\` **|** Banea a un miembro.\n\`\`${prefijo}bans\`\` **|** Muestra una lista de baneos.\n\`\`${prefijo}unban\`\` **|** Elimina el ban a un usuario.\n\`\`${prefijo}addreaction\`\` **|** Agrega una reacción a un mensaje por medio del bot.`
            }else{
                if(!msg.member.roles.cache.get("773271945894035486") || !msg.member.permissions.has("ADMINISTRATOR")){
                    descripcion = `**🌐 Generales:**\n\`\`${prefijo}reglas\`\` **|** Muestra las reglas del servidor.\n\`\`${prefijo}masInfo\`\` **|** Te muestra un canal en el que puedes encontrar mas información.\n\`\`${prefijo}suicide\`\` **|** Te suicidas.\n\`\`${prefijo}revivirChat\`\` **|** El bot menciona un rol para revivir el chat.`
                }
            }    
        }

        const embComandos = new Discord.MessageEmbed()
        .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("📃 Comandos")
        .setDescription(descripcion)
        .setColor(msg.guild.me.displayHexColor)
        .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
        .setTimestamp()
        setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embComandos]})
        }, 400)
    }

    if(comando === "useEmoji" || comando === "useemoji" || comando === "sendEmoji" || comando === "sendemoji"){
        msg.channel.sendTyping()
        let emojis = msg.guild.emojis.cache.map(m=>m)
        const embInfo = new Discord.MessageEmbed()
        .setTitle("🔎 Comando useEmoji")
        .addFields(
            {name: "**Uso:**", value: `${"``"}s.useEmoji <Nombre del emoji>${"``"}`},
            {name: "**Ejemplo:**", value: `s.useEmoji ${emojis[Math.floor(Math.random()*emojis.length)]}`}
        )
        .setColor(colorEmbInf)
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        let emoji = msg.guild.emojis.cache.filter(e=> e.name === args[0]).map(m=>m)

        const embErr1 = new Discord.MessageEmbed()
        .setAuthor("❌ Error")
        .setDescription(`No se encontro el emoji.`)
        .setTimestamp()
        if(!emoji) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tm=> {
            setTimeout(()=>{
                msg.delete().catch(c=>{
                    return;
                })
                tm.delete().catch(c=>{
                    return;
                })
            },30000)
        }).catch(c=>{
            return;
        })

        msg.delete().then(msg.channel.send(`${emoji}`))
    }

    if(comando === "masInfo"){
        msg.channel.sendTyping()
        const masIfn = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setDescription(`<#840364744228995092> en este canal encontraras información sobre la mayoría de los roles que hay en el servidor.\n\n<#840364706715533322> en este canal encontraras información sobre todos los canales públicos que hay en el servidor.`)
        .setColor(msg.guild.me.displayHexColor)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [masIfn]})
    }

    if(comando === "suicide"){
        let gifs = ["https://cdn.discordapp.com/attachments/928735661786267689/928736036186644540/suicide0.gif","https://cdn.discordapp.com/attachments/928735661786267689/928736036719312926/suicide1.gif"]

        const embSuicide = new Discord.MessageEmbed()
        .setAuthor(`${msg.author.tag} se suicido`,msg.author.displayAvatarURL({dynamic: true}))
        .setImage(gifs[Math.floor(Math.random()*gifs.length)])
        .setColor(msg.guild.me.displayHexColor)
        .setTimestamp()
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embSuicide]})
    }
    

    //Comandos de moderacion
    if(comando === "encuesta" || comando === "test"){
        msg.channel.sendTyping()
        const embErrP1 = new Discord.MessageEmbed()
        .setTitle(`${emojiError} Error`)
        .setDescription(`No eres staff de este servidor, no puedes usar este comando.`)
        .setColor(colorErr)
        .setTimestamp()

        const embEncuesta = new Discord.MessageEmbed()
        .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle(`<:diamante:787455888432168971> Postulación a **Ayudante** <:diamante:787455888432168971>`)
        .setDescription(`${"``"}1.${"``"} ¿Cuál es tu edad?\n${"``"}2.${"``"} ¿Por que quieres ser ayudante?\n${"``"}3.${"``"} ¿Cuánto tiempo le dedicarías al servidor?\n${"``"}4.${"``"} ¿Serias activo en el chat?\n${"``"}5.${"``"} ¿Que harías si miras a un Mod/Admi abusando de su rango?\n${"``"}6.${"``"} ¿Sabes bien la información de los roles/canales del servidor?\n${"``"}7.${"``"} Al estar en una situación difícil de controlar. ¿Qué harías?\n${"``"}8.${"``"} ¿Tienes paciencia?\n${"``"}9.${"``"} ¿Estas comprometido/a en que una ves siendo staff todo lo que mires se quedara solo en el grupo del staff?\n${"``"}10.${"``"} ¿Cómo ayudarías/Guiarías a un usuario?\n${"``"}11.${"``"} ¿Tienes experiencia siendo helper/ayudante?\n${"``"}12.${"``"} ¿Cómo conociste este server?\n${"``"}13.${"``"} ¿Cuál es tu pasado en Discord?\n${"``"}14.${"``"} ¿Alguna vez formaste parte de una squad o raideaste?\n${"``"}15.${"``"} Para ti, ¿De que se encarga un helper/ayudante?\n\n<:Pikachu_Feliz:925799716585881640> **Recuerda lo que aquí más importa es tu sinceridad, honestidad y conocimiento.** <:Pikachu_Feliz:925799716585881640>`)
        .setColor(msg.guild.roles.cache.get("831669132607881236").hexColor)
        .setFooter(`${msg.guild.name} - 2022`,msg.guild.iconURL({dynamic: true}))
        .setTimestamp()

        if(msg.member.roles.cache.get("831669132607881236")){
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEncuesta]})
            }, 400)
        }else{
            if(msg.member.permissions.has("ADMINISTRATOR")){
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEncuesta]})
                }, 400)
            }else{
                return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP1]}).then(tm => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        tm.delete().catch(c=>{
                            return;
                        })
                    }, 30000))
                }, 400)
            }
        }
    }

    if(comando === "carcel"){
        msg.channel.sendTyping()
        let dataCrcl = await carcelDB.findOne({_id: client.user.id})
        let canalRegistro = client.channels.cache.get("891731115541430292")
        const embErrp = new Discord.MessageEmbed()
        .setTitle(`${emojiError} Error`)
        .setDescription(`No eres moderador en el servidor por lo tanto no puedes ejecutar el comando.`)
        .setColor(colorErr)
        .setTimestamp()
        if(!msg.member.permissions.has("KICK_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrp]}).then(tm => setTimeout(()=>{
            msg.delete().catch(c=>{
                return;
            })
            tm.delete().catch(c=>{
                return;
            })
        },40000))


        const embInfo = new Discord.MessageEmbed()
        .setTitle("Comando carcel")
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}carcel <Mencion del miembro> <Razon> - <Tiempo>\`\`\n\`\`${prefijo}carcel <ID del miembro> <Razon> - <Tiempo>\`\``},
            {name: "Ejemplos:", value: `${prefijo}carcel ${msg.author} Spam al MD - 6h\n${prefijo}carcel ${msg.author.id} Mal uso de canales - 4h`}
        )
        .setColor(colorEmbInf)
        .setFooter(`Envia al miembro a la carcel durante un tiempo determinado.`)
        .setTimestamp()
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 400)


        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])
        let opcion = args.slice(1).join(" ").split(" - ")

        
        if(miembro){
            if(msg.author.id === msg.guild.ownerId){
                let descripciones = [`¿Por que me quieres enviar a la cárcel?, no puedo enviarme a la cárcel a mi mismo.`, `¿Por que quieres que te envié a la cárcel?, eres el dueño del servidor.`, `El miembro proporcionado es un bot, no puedo meter a un bot a la cárcel.`, `El miembro proporcionado ya esta en la cárcel.`, `No has ingresado la razón por la que el miembro ira a la cárcel, ingresa la razón.`, `Ingresa el tiempo que estará el miembro en la cárcel.`]
                let condicionales = [miembro.id === client.user.id, miembro.id === msg.author.id, miembro.bot, dataCrcl.prisioneros.some(s=> s.id === miembro.id), !opcion[0], !opcion[1]]

                for(let c=0; c<condicionales.length; c++){
                    if(condicionales[c]){
                        const embErrCarcel = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(descripciones[c])
                        .setColor(colorErr)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrCarcel]}).then(mbt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                mbt.delete().catch(c=>{
                                    return;
                                })
                            }, 30000));
                        }, 400)
                    }
                }

                const embCarcel = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("⛓️ Miembro enviado a la cárcel")
                .setDescription(`👤 **Miembro:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razón:** ${opcion[0]}\n\n⏱ **Tiempo en la carcel:** ${opcion[1]}`)
                .setColor("#ECDE03")
                .setFooter(miembro.nickname ? miembro.nickname: miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()


                const registro = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                .setTitle("<:advertencia:929204500739268608> Nuevo prisionero")
                .setDescription(`👤 ${miembro}\n**Condena:** ${opcion[1]}\n**Por:** ${opcion[0]}`)
                .setColor("#ff0000")
                .setTimestamp()
                canalRegistro.send({embeds: [registro]})


                const embMD = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.displayAvatarURL({dynamic: true}))
                .setTitle("⛓️ Has sido enviado a la cárcel")
                .setDescription(`📑 **Razon:** ${opcion[0]}\n\n⏱ **Tiempo en la cárcel:** ${opcion[1]}\n\n👮 **Moderador:** ${msg.author}`)
                .setColor("#ECDE03")
                .setFooter(`Incumpliste alguna regla de ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                miembro.roles.add("830260549098405935").then(async c=>{
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embCarcel]})
                    }, 400)
                    miembro.send({embeds: [embMD]}).catch(()=> msg.channel.send("No se le ha podido enviar el mensaje al miembro."))
                    dataCrcl.prisioneros.push({id: miembro.id, tag: miembro.user.tag, razon: opcion[0], condena: opcion[1], tiempo: Date.now()})
                    dataCrcl.cantidad += 1
                    await dataCrcl.save()
                })


                const embRegistro = new Discord.MessageEmbed()
                .setAuthor(`Ejecutado por ${msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("📝 Registro del comando s.carcel")
                .addFields(
                    {name: "📌 **Usado en el canal:**", value: `${msg.channel}\n${msg.channel.name}`},
                    {name: "👮 **Moderador:**", value: `${msg.author}\n**ID:** ${msg.author.id}`},
                    {name: "👤 **Miembro enviado a la cárcel:**", value: `${miembro}\n**ID:** ${miembro.id}`},
                    {name: "📑 **Razón:**", value: `${opcion[0]}`},
                    {name: "⏱ **Tiempo en la cárcel:**", value: `${opcion[1]}`}
                )
                .setColor("#ECDE03")
                .setFooter(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                msg.guild.channels.cache.get(IDCR).send({embeds: [embRegistro]})
            }else{
                let descripciones = [`¿Por que me quieres enviar a la cárcel?, no puedo enviarme a la cárcel a mi mismo.`, `¿Por que quieres que te envié a la cárcel?, no puedo realizar la acción.`, `El miembro proporcionado es un bot, no puedo meter a un bot a la cárcel.`, `El miembro proporcionado es el dueño del servidor y mi creador, no puedo enviarlo a la cárcel.`, `No puedes enviar a la cárcel a un miembro con igual o mayor rol que tu.`, `El miembro proporcionado ya esta en la cárcel.`, `No has ingresado la razón por la que el miembro ira a la cárcel, ingresa la razón.`, `Ingresa el tiempo que estará el miembro en la cárcel.`]
                let condicionales = [miembro.id === client.user.id, miembro.id === msg.author.id, miembro.bot, miembro.id === msg.guild.ownerId, msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<= 0, dataCrcl.prisioneros.some(s=> s.id === miembro.id), !opcion[0], !opcion[1]]

                for(let c=0; c<condicionales.length; c++){
                    if(condicionales[c]){
                        const embErrCarcel = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(descripciones[c])
                        .setColor(colorErr)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrCarcel]}).then(mbt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                mbt.delete().catch(c=>{
                                    return;
                                })
                            }, 30000));
                        }, 400)
                    }
                }

                const embCarcel = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(miembro.user.displayAvatarURL({dynamic: true}))
                .setTitle("⛓️ Miembro enviado a la cárcel")
                .setDescription(`👤 **Miembro:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razón:** ${opcion[0]}\n\n⏱ **Tiempo en la carcel:** ${opcion[1]}`)
                .setColor("#ECDE03")
                .setFooter(miembro.nickname ? miembro.nickname: miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                .setTimestamp()


                const registro = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag, miembro.displayAvatarURL({dynamic: true}))
                .setTitle("<:advertencia:929204500739268608> Nuevo prisionero")
                .setDescription(`👤 ${miembro}\n**Condena:** ${opcion[1]}\n**Por:** ${opcion[0]}`)
                .setColor("#ff0000")
                .setTimestamp()
                canalRegistro.send({embeds: [registro]})

                const embMD = new Discord.MessageEmbed()
                .setAuthor(miembro.user.tag,miembro.displayAvatarURL({dynamic: true}))
                .setTitle("⛓️ Has sido enviado a la cárcel")
                .setDescription(`📑 **Razon:** ${opcion[0]}\n\n⏱ **Tiempo en la cárcel:** ${opcion[1]}\n\n👮 **Moderador:** ${msg.author}`)
                .setColor("#ECDE03")
                .setFooter(`Incumpliste alguna regla de ${msg.guild.name}`,msg.guild.iconURL({dynamic: true}))
                .setTimestamp()
                miembro.roles.add("830260549098405935").then(async c=>{
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embCarcel]})
                    }, 400)
                    miembro.send({embeds: [embMD]}).catch(()=> msg.channel.send("No se le ha podido enviar el mensaje al miembro."))
                    dataCrcl.prisioneros.push({id: miembro.id, tag: miembro.user.tag, razon: opcion[0], condena: opcion[1], tiempo: Date.now()})
                    dataCrcl.cantidad += 1
                    await dataCrcl.save()
                })

                const embRegistro = new Discord.MessageEmbed()
                .setAuthor(`Ejecutado por ${msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("📝 Registro del comando s.carcel")
                .addFields(
                    {name: "📌 **Usado en el canal:**", value: `${msg.channel}\n${msg.channel.name}`},
                    {name: "👮 **Moderador:**", value: `${msg.author}\n**ID:** ${msg.author.id}`},
                    {name: "👤 **Miembro enviado a la cárcel:**", value: `${miembro}\n**ID:** ${miembro.id}`},
                    {name: "📑 **Razón:**", value: `${opcion[0]}`},
                    {name: "⏱ **Tiempo en la cárcel:**", value: `${opcion[1]}`}
                )
                .setColor("#ECDE03")
                .setFooter(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                msg.guild.channels.cache.get(IDCR).send({embeds: [embRegistro]})
            }
        }else{
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

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
        }        
    }

    if(comando === "kick"){
        msg.channel.sendTyping()
        const embErrP = new Discord.MessageEmbed()
        .setTitle(`${emojiError} Error`)
        .setDescription(`No eres moderador en el servidor por lo tanto no puedes ejecutar el comando.`)
        .setColor(colorErr)
        .setTimestamp()
        if(!msg.member.permissions.has("KICK_MEMBERS")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP]}).then(tnt => setTimeout(()=>{
            tnt.delete().catch(c=>{
                return;
            })
            msg.delete().catch(c=>{
                return;
            })
        }, 30000));
    
        const emmmsd = new Discord.MessageEmbed()
        .setTitle("Comando kick")
        .addFields(
            {name: "**Uso:**", value: `\`\`${prefijo}kick <Miembro mencionado> <Razón>\`\`\n\`\`${prefijo}kick <ID del miembro> <Razón>\`\``},
            {name: "Ejemplos:", value: `${prefijo}kick ${msg.author} Mal uso de canales.\n${prefijo}kick ${msg.author.id} spam al MD a mas de 1 miembro.`}
        )
        .setFooter(`Expulsa a un mimebro del servidor.`)
        .setColor("#000000")
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [emmmsd]})
        }, 400)


        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])
        let razon = args.slice(1).join(" ")

        if(miembro){
            if(msg.author.id === msg.guild.ownerId){
                let descripciones = [`¿Por que me quieres expulsar?, no puedo expulsarme a mi mismo.`, `¿Por que quieres que te expulse de tu propio servidor?, no puedo realizar la acción.`]
                let condicionales = [miembro.id === client.user.id, miembro.id === msg.author.id]

                for(let c=0; c<condicionales.length; c++){
                    if(condicionales[c]){
                        const embErrCarcel = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(descripciones[c])
                        .setColor(colorErr)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrCarcel]}).then(mbt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                mbt.delete().catch(c=>{
                                    return;
                                })
                            }, 30000));
                        }, 400)
                    }
                }

                if(miembro.user.bot){
                    const embErr1 = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(`No has proporcionado la razón por la que el miembro será expulsado del servidor.`)
                    .setColor(colorErr)
                    .setTimestamp()
                    if(!razon) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tnt => setTimeout(()=>{
                        tnt.delete().catch(c=>{
                            return;
                        })
                        msg.delete().catch(c=>{
                            return;
                        })
                    }, 30000));

                    const embK = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.avatarURL({dynamic: true}))
                    .setTitle("<:salir12:879519859694776360> Bot expulsado")
                    .setDescription(`🤖 **Ex bot:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}`)
                    .setFooter(miembro.user.tag,miembro.displayAvatarURL({dynamic: true}))
                    .setColor("#ff8001")
                    .setTimestamp()
                    miembro.kick(`Moderador ID: ${msg.author.id} | Bot expulsado: ${miembro.user.tag}, ID: ${miembro.user.id} | Razón: ${razon}`).then(k=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embK]})
                        }, 400)
                    })
    
                    const embReg = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("📝 Registro del comando kick")
                    .addFields(
                        {name: "📌 **Usado en:**", value: `${msg.channel}\n${msg.channel.name}`},
                        {name: "👮 **Moderador:**", value: `${msg.author}\n**ID:** ${msg.author.id}`},
                        {name: "🤖 **Bot expulsado:**", value: `${miembro}\n**ID:** ${miembro.id}`},
                        {name: "📑 **Razón:**", value: `${razon}`}
                    )
                    .setColor("#ff8001")
                    .setFooter(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    msg.guild.channels.cache.get(IDCR).send({embeds: [embReg]})
    
                }else{
                    const embErr1 = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(`No has proporcionado la razón por la que el miembro será expulsado del servidor.`)
                    .setColor(colorErr)
                    .setTimestamp()
                    if(!razon) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tnt => setTimeout(()=>{
                        tnt.delete().catch(c=>{
                            return;
                        })
                        msg.delete().catch(c=>{
                            return;
                        })
                    }, 30000));
    
                    const embK = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.avatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.avatarURL({dynamic: true}))
                    .setTitle("<:salir12:879519859694776360> Miembro expulsado")
                    .setDescription(`👤 **Ex miembro:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}`)
                    .setFooter(miembro.user.tag,miembro.displayAvatarURL({dynamic: true}))
                    .setColor("#ff8001")
                    .setTimestamp()
    
                    const embDm = new Discord.MessageEmbed()
                    .setAuthor(miembro.user.username,miembro.user.avatarURL({dynamic: true}))
                    .setThumbnail(msg.guild.iconURL())
                    .setTitle("<:salir12:879519859694776360> Has sido expulsado")
                    .setDescription(`**de:** ${msg.guild.name}\n\n📑 **Razón:** ${razon}`)
                    .setFooter(`Por el moderador: ${msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
                    .setColor("#ff8001")
                    .setTimestamp()
                
                    miembro.kick(`Moderador ID: ${msg.author.id} | Bot expulsado: ${miembro.user.tag}, ID: ${miembro.user.id} | Razón: ${razon}`).then(k=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embK]})
                        }, 400)
                        miembro.send({embeds: [embDm]}).catch(()=>{
                            return;
                        })
                    })
    
                    const embReg = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("📝 Registro del comando kick")
                    .addFields(
                        {name: "📌 **Usado en:**", value: `${msg.channel}\n${msg.channel.name}`},
                        {name: "👮 **Moderador:**", value: `${msg.author}\n**ID:** ${msg.author.id}`},
                        {name: "👤 **Miembro expulsado:**", value: `${miembro}\n**ID:** ${miembro.id}`},
                        {name: "📑 **Razón:**", value: `${razon}`}
                    )
                    .setColor("#ff8001")
                    .setFooter(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    msg.guild.channels.cache.get(IDCR).send({embeds: [embReg]})
                }
            }else{
                let descripciones = [`¿Por que me quieres expulsar?, no puedo expulsarme a mi mismo.`, `¿Por que quieres que te expulse del servidor?, no puedo realizar la acción.`]
                let condicionales = [miembro.id === client.user.id, miembro.id === msg.author.id]

                for(let c=0; c<condicionales.length; c++){
                    if(condicionales[c]){
                        const embErrCarcel = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(descripciones[c])
                        .setColor(colorErr)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrCarcel]}).then(mbt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                mbt.delete().catch(c=>{
                                    return;
                                })
                            }, 30000));
                        }, 400)
                    }
                }
            
                if(miembro.user.bot){
                    const embErr1 = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(`El bot tiene un rol igual o mayor al tuyo, no puedes expulsar a ese bot.`)
                    .setColor(colorErr)
                    .setTimestamp()
                    if(msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<= 0) setTimeout(()=>{
                        return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tnt => setTimeout(()=>{
                            tnt.delete().catch(c=>{
                                return;
                            })
                            msg.delete().catch(c=>{
                                return;
                            })
                        }, 30000));
                    }, 400)

                    const embErr2 = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(`No has ingresado la razón por la que el miembro será expulsado del servidor.`)
                    .setColor(colorErr)
                    .setTimestamp()
                    if(!razon) return setTimeout(()=>{
                        return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tnt => setTimeout(()=>{
                            tnt.delete().catch(c=>{
                                return;
                            })
                            msg.delete().catch(c=>{
                                return;
                            })
                        }, 30000));
                    }, 400)
                
                    const embK = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.avatarURL({dynamic: true}))
                    .setTitle("<:salir12:879519859694776360> Bot expulsado")
                    .setDescription(`🤖 **Ex bot:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}`)
                    .setFooter(miembro.user.tag,miembro.displayAvatarURL({dynamic: true}))
                    .setColor("#ff8001")
                    .setTimestamp()
                    miembro.kick(`Moderador ID: ${msg.author.id} | Bot expulsado: ${miembro.user.tag}, ID: ${miembro.user.id} | Razón: ${razon}`).then(k=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embK]})
                        }, 400)
                    })

                    const embReg = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("📝 Registro del comando kick")
                    .addFields(
                        {name: "📌 **Usado en:**", value: `${msg.channel}\n${msg.channel.name}`},
                        {name: "👮 **Moderador:**", value: `${msg.author}\n**ID:** ${msg.author.id}`},
                        {name: "🤖 **Bot expulsado:**", value: `${miembro}\n**ID:** ${miembro.id}`},
                        {name: "📑 **Razón:**", value: `${razon}`}
                    )
                    .setColor("#ff8001")
                    .setFooter(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    msg.guild.channels.cache.get(IDCR).send({embeds: [embReg]})

                }else{
                    const embErr1 = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(`El miembro proporcionado es el dueño del servidor y mi creador, no lo puedo expulsar.`)
                    .setColor(colorErr)
                    .setTimestamp()
                    if(miembro.id === msg.guild.ownerId) return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tnt => setTimeout(()=>{
                            tnt.delete().catch(c=>{
                                return;
                            })
                            msg.delete().catch(c=>{
                                return;
                            })
                        },30000));
                    }, 400)

                    const embErr2 = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(`El miembro tiene un rol igual o mayor al tuyo, no puedes expulsar a ese miembro.`)
                    .setColor(colorErr)
                    .setTimestamp()
                    if(msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<= 0) return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(tnt => setTimeout(()=>{
                            tnt.delete().catch(c=>{
                                return;
                            })
                            msg.delete().catch(c=>{
                                return;
                            })
                        }, 30000));
                    }, 400)

                    const embErr3 = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(`No has ingresado la razón por la que el miembro será expulsado del servidor.`)
                    .setColor(colorErr)
                    .setTimestamp()
                    if(!razon) return setTimeout(()=>{
                        return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr3]}).then(tnt => setTimeout(()=>{
                            tnt.delete().catch(c=>{
                                return;
                            })
                            msg.delete().catch(c=>{
                                return;
                            })
                        }, 30000));
                    }, 400)

                    const embK = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.avatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.avatarURL({dynamic: true}))
                    .setTitle("<:salir12:879519859694776360> Miembro expulsado")
                    .setDescription(`👤 **Ex miembro:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}`)
                    .setFooter(miembro.user.tag,miembro.displayAvatarURL({dynamic: true}))
                    .setColor("#ff8001")
                    .setTimestamp()
    
                    const embDm = new Discord.MessageEmbed()
                    .setAuthor(miembro.user.username,miembro.user.avatarURL({dynamic: true}))
                    .setThumbnail(msg.guild.iconURL())
                    .setTitle("<:salir12:879519859694776360> Has sido expulsado")
                    .setDescription(`**de:** ${msg.guild.name}\n\n📑 **Razón:** ${razon}`)
                    .setFooter(`Por el moderador: ${msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
                    .setColor("#ff8001")
                    .setTimestamp()
                
                    miembro.kick(`Moderador ID: ${msg.author.id} | Bot expulsado: ${miembro.user.tag}, ID: ${miembro.user.id} | Razón: ${razon}`).then(k=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embK]})
                        }, 400)
                        miembro.send({embeds: [embDm]}).catch(()=>{
                            return;
                        })
                    })
    
                    const embReg = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("📝 Registro del comando kick")
                    .addFields(
                        {name: "📌 **Usado en:**", value: `${msg.channel}\n${msg.channel.name}`},
                        {name: "👮 **Moderador:**", value: `${msg.author}\n**ID:** ${msg.author.id}`},
                        {name: "👤 **Miembro expulsado:**", value: `${miembro}\n**ID:** ${miembro.id}`},
                        {name: "📑 **Razón:**", value: `${razon}`}
                    )
                    .setColor("#ff8001")
                    .setFooter(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    msg.guild.channels.cache.get(IDCR).send({embeds: [embReg]})
                }
            }    
        }else{
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

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
        }
    }

    if(comando === "ban"){
        msg.channel.sendTyping()
        const embErrP = new Discord.MessageEmbed()
        .setTitle(`${emojiError} Error`)
        .setDescription(`No eres moderador en el servidor por lo tanto no puedes ejecutar el comando.`)
        .setColor(colorErr)
        .setTimestamp()
        if(!msg.member.permissions.has("BAN_MEMBERS")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP]}).then(tnt => setTimeout(()=>{
                tnt.delete().catch(c=>{
                    return;
                })
                msg.delete().catch(c=>{
                    return;
                })
            }, 30000));
        }, 400)

        const embInfo = new Discord.MessageEmbed()
        .setTitle("Comando ban")
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}ban <Mencion del miembro> <Razón>\`\`\n\`\`${prefijo}ban <ID del miembro> <Razón>\`\``},
            {name: "Ejemplos:", value: `${prefijo}ban ${msg.author} incumplir el [ToS](https://discord.com/terms) de Discord.\n${prefijo}ban ${msg.author.id} Publicar enlace malicioso.`}
        )
        .setFooter(`Banea a un miembro del servidor.`)
        .setColor("#000000")
        if(!args[0]) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})
        }, 400)

        let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0])
        let razon = args.slice(1).join(" ")

        if(miembro){
            if(msg.author.id === msg.guild.ownerId){
                let descripcionesB = [`**¿Por qué me quieres banear?**, no lo hagas te ha costado mucho tiempo crearme.`,`No puedo banearte, ¡eres el dueño del servidor!.`, `No has proporcionado una razón, proporciona una razón del baneo.`]
                let condicionalesB = [miembro.id === client.user.id, miembro.id === msg.author.id, !razon]

                for(let i=0; i<descripcionesB.length; i++){
                    if(condicionalesB[i]){
                        const embErr = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(descripcionesB[i])
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

                if(miembro.user.bot){
                    const embed = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.displayAvatarURL({dynamic: true}))
                    .setTitle("❌ Bot baneado")
                    .setDescription(`🤖 **Ex bot:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razon:** ${razon}\n\n👮 **Moderador:** ${msg.author}`)
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setColor("#FF0000")
                    .setTimestamp()

                    const embRegistro = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("📝 Registro del comando ban")
                    .setDescription(`Comando usado en el canal\n${msg.channel}`)
                    .addFields(
                        {name: "👮 **Moderador**", value: `${msg.author}\n**ID:** ${msg.author.id}`},
                        {name: "🤖 **Bot baneado**", value: `${miembro}\n**ID:** ${miembro.id}`},
                        {name: "📑**Razon:**", value: `${razon}`}
                    )
                    .setColor("#ff0000")
                    .setFooter(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    msg.guild.channels.cache.get(IDCR).send({embeds: [embRegistro]})
                    miembro.ban({reason: `Razon: ${razon}  | Moderador: ${msg.author.tag}  | Fecha: ${msg.createdAt.toLocaleTimeString()}`}).then(ban=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})
                        }, 400)
                    })

                }else{
                    const embed = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.displayAvatarURL({dynamic: true}))
                    .setTitle("❌ Miembro baneado")
                    .setDescription(`👤 **Ex miembro:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razon:** ${razon}\n\n👮 **Moderador:** ${msg.author}`)
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setColor("#FF0000")
                    .setTimestamp()

                    //  Embed mensaje directo
                    const embedMD = new Discord.MessageEmbed()
                    .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                    .setThumbnail(msg.guild.iconURL({dynamic: true}))
                    .setTitle("❌ Has sido baneado")
                    .setDescription(`**de:** ${msg.guild.name}\n\n📑**Razon:** ${razon}`)
                    .setFooter(`Por el moderador: ${msg.author.tag}`,msg.author.displayAvatarURL({dynamic: true}))
                    .setColor("#ff0000")
                    .setTimestamp()
                    
                    miembro.ban({reason: `Razon: ${razon}  | Moderador: ${msg.author.tag}  | Fecha: ${msg.createdAt.toLocaleTimeString()}`}).then(ban=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})
                        }, 400)
                        miembro.send({embeds: [embedMD]}).catch(()=> {
                            return;
                        })
                    })
                
                    const embRegistro = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("📝 Registro del comando ban")
                    .setDescription(`Comando usado en el canal\n${msg.channel}`)
                    .addFields(
                        {name: "👮 **Moderador**", value: `${msg.author}\n**ID:** ${msg.author.id}`},
                        {name: "👤 **Miembro baneado**", value: `${miembro}\n**ID:** ${miembro.id}`},
                        {name: "📑**Razon:**", value: `${razon}`}
                    )
                    .setColor("#ff0000")
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()
                    msg.guild.channels.cache.get(IDCR).send({embeds: [embRegistro]})
                }
            }else{
                let descripciones = [`¿Por que me quieres banear del servidor?, no puedo realizar esa acción.`, `¿Por que quieres que te banee de este servidor?, no puedo realizar esa acción.`, `No puedo banear a ese usuario ya que es el dueño del servidor y mi creador.`]
                let condicionales = [miembro.id === client.user.id, miembro.id === msg.author.id, miembro.id === msg.guild.ownerId]

                for(let c=0; c<condicionales.length; c++){
                    if(condicionales[c]){
                        const embErrCarcel = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(descripciones[c])
                        .setColor(colorErr)
                        .setTimestamp()
                        return setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrCarcel]}).then(mbt => setTimeout(()=>{
                                msg.delete().catch(c=>{
                                    return;
                                })
                                mbt.delete().catch(c=>{
                                    return;
                                })
                            }, 30000));
                        }, 400)
                    }
                }

                const embErr1 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`No puedes banear a un miembro con igual o mayor rol que tu.`)
                .setColor(colorErr)
                .setTimestamp()
                if(msg.member.roles.highest.comparePositionTo(miembro.roles.highest)<= 0) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(mbt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        mbt.delete().catch(c=>{
                            return;
                        })
                    }, 30000));
                }, 400)

                const embErr2 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`No has propotcionado la razón por la que el miembro sera baneado del servidor, proporciona la razón.`)
                .setColor(colorErr)
                .setTimestamp()
                if(!razon) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr2]}).then(mbt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        mbt.delete().catch(c=>{
                            return;
                        })
                    }, 30000));
                }, 400)

                if(miembro.user.bot){
                    const embed = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.displayAvatarURL({dynamic: true}))
                    .setTitle("⛔ Bot baneado")
                    .setDescription(`🤖 **Ex bot:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razon:** ${razon}\n\n👮 **Moderador:** ${msg.author}`)
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setColor("#FF0000")
                    .setTimestamp()

                    miembro.ban({reason: `Razon: ${razon}  | Moderador: ${msg.author.username}  | Fecha: ${msg.createdAt.toLocaleTimeString()}`}).then(b=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})
                        }, 400)
                    })

                    const embRegistro = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("📝 Registro del comando ban")
                    .setDescription(`Comando usado en el canal\n${msg.channel}`)
                    .addFields(
                        {name: "📌 **Usado en el canal:**", value: `${msg.channel}\n${msg.channel.name}`},
                        {name: "👮 **Moderador:**", value: `${msg.author}\n**ID:** ${msg.author.id}`},
                        {name: "🤖 **Bot baneado:**", value: `${miembro}\n**ID:** ${miembro.id}`},
                        {name: "📑**Razon:**", value: `${razon}`}
                    )
                    .setColor("#ff0000")
                    .setFooter(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    msg.guild.channels.cache.get(IDCR).send({embeds: [embRegistro]})

                }else{
                    const embed = new Discord.MessageEmbed()
                    .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(miembro.user.displayAvatarURL({dynamic: true}))
                    .setTitle("⛔ Miembro baneado")
                    .setDescription(`👤 **Ex miembro:** ${miembro}\n**ID:** ${miembro.id}\n\n📑 **Razon:** ${razon}\n\n👮 **Moderador:** ${msg.author}`)
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setColor("#FF0000")
                    .setTimestamp()

                    //  Embed mensaje directo
                    const embedMD = new Discord.MessageEmbed()
                    .setAuthor(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                    .setThumbnail(msg.guild.iconURL({dynamic: true}))
                    .setTitle("⛔ Has sido baneado")
                    .setDescription(`**de:** ${msg.guild.name}\n\n📑**Razon:** ${razon}`)
                    .setFooter(`Por el moderador: ${msg.author.username}`,msg.author.displayAvatarURL({dynamic: true}))
                    .setColor("#ff0000")
                    .setTimestamp()
                    
                    miembro.ban({reason: `Razon: ${razon}  | Moderador: ${msg.author.tag}  | Fecha: ${msg.createdAt.toLocaleTimeString()}`}).then(b=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})
                        }, 400)
                        miembro.send({embeds: [embedMD]}).catch(()=> {
                            return;
                        })
                    })
                
                    const embRegistro = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("📝 Registro del comando ban")
                    .setDescription(`Comando usado en el canal\n${msg.channel}`)
                    .addFields(
                        {name: "📌 **Usado en el canal:**", value: `${msg.channel}\n${msg.channel.name}`},
                        {name: "👮 **Moderador:**", value: `${msg.author}\n**ID:** ${msg.author.id}`},
                        {name: "👤 **Miembro baneado:**", value: `${miembro}\n**ID:** ${miembro.id}`},
                        {name: "📑**Razon:**", value: `${razon}`}
                    )
                    .setColor("#ff0000")
                    .setFooter(miembro.user.tag,miembro.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    msg.guild.channels.cache.get(IDCR).send({embeds: [embRegistro]})
                }
            }
        }else{
            let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`]
            let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

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

            await client.users.fetch(args[0], {force: true}).then(us=>{
                const embed = new Discord.MessageEmbed()
                .setAuthor(msg.member.nickname ? msg.member.nickname: msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setThumbnail(us.displayAvatarURL({dynamic: true}))
                .setTitle("⛔ Usuario externo baneado")
                .setDescription(`👤 **Usuario:** ${us.tag}\n**ID:** ${us.id}\n\n📑 **Razon:** ${razon}\n\n👮 **Moderador:** ${msg.author}`)
                .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                .setColor("#FF0000")
                .setTimestamp()
                
                msg.guild.members.ban(us.id, {reason: `Razon: ${razon}  | Moderador: ${msg.author.tag}  | Fecha: ${msg.createdAt.toLocaleTimeString()}`}).then(b=>{
                    setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embed]})
                    }, 400)
                })
            
                const embRegistro = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("📝 Registro del comando ban")
                .setDescription(`Comando usado en el canal\n${msg.channel}`)
                .addFields(
                    {name: "📌 **Usado en el canal:**", value: `${msg.channel}\n${msg.channel.name}`},
                    {name: "👮 **Moderador:**", value: `${msg.author}\n**ID:** ${msg.author.id}`},
                    {name: "👤 **Usuario externo baneado:**", value: `${us.tag}\n**ID:** ${us.id}`},
                    {name: "📑**Razon:**", value: `${razon}`}
                )
                .setColor("#ff0000")
                .setFooter(us.tag,us.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                msg.guild.channels.cache.get(IDCR).send({embeds: [embRegistro]})
            }).catch(c=>{
                const embErr1 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`La ID proporcionada (${args[0]}) no es valida.`)
                .setColor(colorErr)
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(mbt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        mbt.delete().catch(c=>{
                            return;
                        })
                    }, 30000));
                }, 400)
            })
        }  
    }

    if(comando === "unban"){
        msg.channel.sendTyping()
        let usBans = (await msg.guild.bans.fetch()).map(mb => mb.user.id)
        let randomB = Math.floor(Math.random()*usBans.length)
        const embErrP = new Discord.MessageEmbed()
        .setTitle(`${emojiError} Error`)
        .setDescription(`No eres moderador en el servidor por lo tanto no puedes ejecutar el comando.`)
        .setColor(colorErr)
        .setTimestamp()
        if(!msg.member.permissions.has("BAN_MEMBERS")) return setTimeout(()=>{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP]}).then(tnt => setTimeout(()=>{
                tnt.delete().catch(c=>{
                    return;
                })
                msg.delete().catch(c=>{
                    return;
                })
            },40000));
        }, 400)

        const embInfo = new Discord.MessageEmbed()
        .setTitle("Comando unban")
        .addFields(
            {name: "Uso:", value: `\`\`${prefijo}unban <ID del usuario baneado>\`\``},
            {name: "Ejemplos:", value: `${prefijo}unban ${usBans[randomB]}`}
        )
        .setColor("#000000")
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})

        let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`,`El argumento proporcionado (*${args[0]}*) no es una ID.`]
        let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

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


        let miembID = msg.guild.members.cache.get(args[0])

        if(miembID){
            if(miembID.user.bot){
                const embErr1 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`La ID proporcionada es de ${miembID} **|** ${miembID.user.tag}, un Bot del servidor que no esta baneado.`)
                .setColor(colorErr)
                .setTimestamp()
                if(miembID) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tnt => setTimeout(()=>{
                        tnt.delete().catch(c=>{
                            return;
                        })
                        msg.delete().catch(c=>{
                            return;
                        })
                    }, 30000));
                }, 400)
            }else{
                const embErr1 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`La ID proporcionada es de ${miembID} **|** ${miembID.user.tag}, un miembro del servidor que no esta baneado.`)
                .setColor(colorErr)
                .setTimestamp()
                if(miembID) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tnt => setTimeout(()=>{
                        tnt.delete().catch(c=>{
                            return;
                        })
                        msg.delete().catch(c=>{
                            return;
                        })
                    }, 30000));
                }, 400)
            }
        }else{
            await client.users.fetch(args[0]).then(async unb=>{
                const embErr1 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`Esa ID pertenece a un usuario que no esta banedo.`)
                .setColor(colorErr)
                .setTimestamp()
                if(!(await msg.guild.bans.fetch()).find(fb => fb.user.id === args[0])) return setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(tnt => setTimeout(()=>{
                        tnt.delete().catch(c=>{
                            return;
                        })
                        msg.delete().catch(c=>{
                            return;
                        })
                    }, 30000));
                }, 400)

                if(unb.bot){
                    const embBan = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(unb.displayAvatarURL({dynamic: true}))
                    .setTitle("✅ Bot desbaneado")
                    .setDescription(`🤖 **Bot:**\n${unb.username}\n**ID:** ${unb.id}`)
                    .setColor("#00ff00")
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()

                    const embReg = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("📝 Registro del comando unban")
                    .addFields(
                        {name: "📌 **Usado en:**", value: `${msg.channel}\n${msg.channel.name}`},
                        {name: "👮 **Moderador:**", value: `${msg.author}\n**ID:** ${msg.author.id}`},
                        {name: "🤖 **Bot desbaneado:**", value: `${unb.username}\n**ID:** ${unb.id}`}
                    )
                    .setColor("#00ff00")
                    .setFooter(unb.tag,unb.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    msg.guild.channels.cache.get(IDCR).send({embeds: [embReg]})
                    msg.guild.members.unban(unb.id, `Moderador: ${msg.author.tag} - ID: ${msg.author.id} | Bot: ${unb.tag} - ID: ${unb.id}`).then(un=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBan]})
                        }, 400)
                    })

                }else{
                    const embBan = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(unb.displayAvatarURL({dynamic: true}))
                    .setTitle("✅ Usuario desbaneado")
                    .setDescription(`👤 **Usuario:**\n${unb.tag}\n**ID:** ${unb.id}`)
                    .setColor("#00ff00")
                    .setFooter(msg.guild.name,msg.guild.iconURL({dynamic: true}))
                    .setTimestamp()

                    const embReg = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle("📝 Registro del comando unban")
                    .addFields(
                        {name: "📌 **Usado en:**", value: `${msg.channel}\n${msg.channel.name}`},
                        {name: "👮 **Moderador:**", value: `${msg.author}\n**ID:** ${msg.author.id}`},
                        {name: "👤 **Usuario desbaneado:**", value: `${unb.username}\n**ID:** ${unb.id}`}
                    )
                    .setColor("#00ff00")
                    .setFooter(unb.tag,unb.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                    msg.guild.channels.cache.get(IDCR).send({embeds: [embReg]})
                    msg.guild.members.unban(unb.id,`Moderador: ${msg.author.tag} - ID: ${msg.author.id} | Usuario: ${unb.tag} - ID: ${unb.id}`).then(un=>{
                        setTimeout(()=>{
                            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBan]})
                        }, 400)
                    })
                }
            }).catch(c=>{
                const embErr1 = new Discord.MessageEmbed()
                .setTitle(`${emojiError} Error`)
                .setDescription(`La ID proporcionada (${args[0]}) no es valida.`)
                .setColor(colorErr)
                .setTimestamp()
                setTimeout(()=>{
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErr1]}).then(mbt => setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })
                        mbt.delete().catch(c=>{
                            return;
                        })
                    }, 30000));
                }, 400)
            })
        }
        
    }

    if(comando === "bans"){
        msg.channel.sendTyping()
        if(!msg.member.permissions.has("BAN_MEMBERS")) return msg.channel.send("**No tienes los permisos suficientes para ejecutar el comando.**");
        let s0 = 0
        let s1 = 10
        let pagina = 1
        let bb = await msg.guild.bans.fetch()

        const bans = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("Usuarios baneados del servidor")
        .setDescription(`Hay un total del **${bb.size}** usuarios baneados\n\n${bb.map(m=>m).map((bm, i) => `**${i+1}.**\n👤: ${bm.user.tag}\n🆔: ${bm.user.id}\n📝 **Razon:** ${bm.reason}\n[**Avatar**](${bm.user.displayAvatarURL({dynamic: true})})`).slice(s0,s1).join("\n\n")}`)
        .setColor("#ff0000")
        .setFooter(`Pagina - ${pagina}/${Math.round(bb.size / 10)}`)
        .setTimestamp()

        const embBans = await msg.channel.send({embeds: [bans]})

        if(bb.size >= 199){
            await embBans.react("⏪")
            await embBans.react("⬅");
            await embBans.react("➡");
            await embBans.react("⏩")
        }else{
            if(bb.size >= 11){
                await embBans.react("⬅");
                await embBans.react("➡");
            }
        }


        const colector = embBans.createReactionCollector(rec => rec.id === msg.author.id)

        colector.on("collect", async reacion => {
            if(reacion.emoji.name === "⬅"){
                if(s0 <= 10) return await reacion.users.remove(msg.author.id)

                s0 = s0 - 10
                s1 = s1 - 10
                pagina = pagina - 1

                bans
                .setDescription(`Hay un total del **${bb.size}** usuarios baneados\n\n${bb.map(m=>m).map((bm, i) => `**${i+1}.**\n👤: ${bm.user.tag}\n🆔: ${bm.user.id}\n📝 **Razon:** ${bm.reason}\n[**Avatar**](${bm.user.displayAvatarURL({dynamic: true})})`).slice(s0,s1).join("\n\n")}`)
                .setFooter(`Pagina - ${pagina}/${Math.round(bb.size / 10)}`)
                embBans.edit({embeds: [bans]})
            }
            if(reacion.emoji.name === "➡" && reacion.users.cache.get(msg.author.id)){
                if(bb.size <= s1) return await reacion.users.remove(msg.author.id)

                s0 = s0 + 10
                s1 = s1 + 10
                pagina = pagina - 1

                bans
                .setDescription(`Hay un total del **${bb.size}** usuarios baneados\n\n${bb.map(m=>m).map((bm, i) => `**${i+1}.**\n👤: ${bm.user.tag}\n🆔: ${bm.user.id}\n📝 **Razon:** ${bm.reason}\n[**Avatar**](${bm.user.displayAvatarURL({dynamic: true})})`).slice(s0,s1).join("\n\n")}`)
                .setFooter(`Pagina - ${pagina}/${Math.round(bb.size / 10)}`)
                embBans.edit({embeds: [bans]})
            }
            if(reacion.emoji.name === "⏪"){
                if(s0 <= 50) return await reacion.users.remove(msg.author.id)

                s0 = s0 - 50
                s1 = s1 - 50
                pagina = pagina - 5

                bans
                .setDescription(`Hay un total del **${bb.size}** usuarios baneados\n\n${bb.map(m=>m).map((bm, i) => `**${i+1}.**\n👤: ${bm.user.tag}\n🆔: ${bm.user.id}\n📝 **Razon:** ${bm.reason}\n[**Avatar**](${bm.user.displayAvatarURL({dynamic: true})})`).slice(s0,s1).join("\n\n")}`)
                .setFooter(`Pagina - ${pagina}/${Math.round(bb.size / 10)}`)
                embBans.edit({embeds: [bans]})
            }
            if(reacion.emoji.name === "⏩" && reacion.users.cache.get(msg.author.id)){
                if(bb.size <= s1 + 50) return await reacion.users.remove(msg.author.id)

                s0 = s0 + 50
                s1 = s1 + 50
                pagina = pagina + 5

                bans
                .setDescription(`Hay un total del **${bb.size}** usuarios baneados\n\n${bb.map(m=>m).map((bm, i) => `**${i+1}.**\n👤: ${bm.user.tag}\n🆔: ${bm.user.id}\n📝 **Razon:** ${bm.reason}\n[**Avatar**](${bm.user.displayAvatarURL({dynamic: true})})`).slice(s0,s1).join("\n\n")}`)
                .setFooter(`Pagina - ${pagina}/${Math.round(bb.size / 10)}`)
                embBans.edit({embeds: [bans]})
            }
            await reacion.users.remove(msg.author.id)
        })
    }

    // Comando clear
    if(comando === "clear"){
        msg.channel.sendTyping()
        const embErrP = new Discord.MessageEmbed()
        .setTitle(`${emojiError} Error`)
        .setDescription(`No eres moderador en el servidor por lo tanto no puedes ejecutar el comando.`)
        .setColor(colorErr)
        .setTimestamp()
        if(!msg.member.permissions.has("MANAGE_MESSAGES")) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrP]}).then(tnt => setTimeout(()=>{
            tnt.delete().catch(c=>{
                return;
            })
            msg.delete().catch(c=>{
                return;
            })
        }, 30000));

    
        const embInfo = new Discord.MessageEmbed()
        .setTitle("Comando clear")
        .setDescription(`**Uso:**\n${"``"}s.clear <cantidad o all>${"``"}\n\n**Ejemplos:**\ns.clear 20\n*Elimina 20 mensajes*\ns.clear all\n*Elimina un maximo de 100 mensajes.*`)
        .setColor("#060606")
        .setFooter("Elimina mensajes de un canal.",client.user.displayAvatarURL())
        .setTimestamp()
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, embeds: [embInfo]})        


        if(args[0] === "all"){
            msg.delete()
            let mensagesDelCanal = await msg.channel.messages.fetch({limit: 100})
            let filtro = mensagesDelCanal.filter(f=> Date.now() - f.createdAt < ms("14d"))

            const embFin = new Discord.MessageEmbed()
            .setTitle("🗑 Mensajes eliminados")
            .setDescription(`**${msg.author}** ha eliminado **${filtro.size}** mensajes.`)
            .setColor("#030303")
            .setTimestamp()
            await msg.channel.bulkDelete(filtro).then(tc=>{
                setTimeout(()=>{
                    msg.channel.send({embeds: [embFin]}).then(d=>setTimeout(()=>{
                        d.delete().catch(c=>{
                            return;
                        })
                    }, 20000))
                }, 600)
            })
        }else{
            let descripciones = [`El argumenro proporcionado (${args[0]}) no es una cantidad numerica ni la palabra *all* la cual elimina un maximo de **100** mensajes de un canal.`, `No puedo eliminar 0 mensajes, proporciona una cantidad mayor a 0.`, `La cantidad ingresada es mayor a 100 ingresa una igual o menor a 100.`]
            let condicionales = [isNaN(args[0]), args[0] === 0, args[0] > 100]

            for(let c=0; c<condicionales.length; c++){
                if(condicionales[c]){
                    const embErrCarcel = new Discord.MessageEmbed()
                    .setTitle(`${emojiError} Error`)
                    .setDescription(descripciones[c])
                    .setColor(colorErr)
                    .setTimestamp()
                    return setTimeout(()=>{
                        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embErrCarcel]}).then(mbt => setTimeout(()=>{
                            msg.delete().catch(c=>{
                                return;
                            })
                            mbt.delete().catch(c=>{
                                return;
                            })
                        }, 30000));
                    }, 400)
                }
            }

            msg.delete()
            const embFin = new Discord.MessageEmbed()
            .setTitle("🗑 Mensajes eliminados")
            .setDescription(`**${msg.author}** ha eliminado **${args[0]}** mensajes.`)
            .setColor("#030303")
            .setTimestamp()
            let mensagesDelCanal = await msg.channel.messages.fetch({limit: Number(args[0])})
            let filtro = mensagesDelCanal.filter(f=> Date.now() - f.createdAt < ms("14d"))
            await msg.channel.bulkDelete(filtro).then(cl=>{
                setTimeout(()=>{
                    msg.channel.send({embeds: [embFin]}).then(dlt => setTimeout(()=>{
                        dlt.delete().catch(c=>{
                            return;
                        })
                    }, 20000))
                }, 800)
            })
        }
    }

    // Comandos de administradores
    // Comando que muestra los usuarios que tienen cierto rol
    if(comando === "meSiRol"){
        msg.channel.sendTyping()

        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send("**Solo un administrador del servidor puede ejecutar el comando.**")
        let rolID = args[0]
        if(!rolID){
            const emb = new Discord.MessageEmbed()
            .setTitle("Comando s.meSiRol")
            .setDescription(`**Uso:**\n${"``"}s.meSiRol <ID del rol>${"``"}\n\n**Ejemplo:**\ns.meSiRol ${msg.member.roles.cache.random().id}`)
            .setColor("#060606")
            .setFooter("Muestra los miembros que tienen ese rol.")
            .setTimestamp()
            msg.channel.send({embeds: [emb]})
        }else{
            if(!msg.guild.roles.cache.get(rolID)){
                const error = new Discord.MessageEmbed()
                .setTitle("❌ Error")
                .setDescription(`El argumento ingresado no es una ID o no se reconoce como una ID de un rol de este servidor.`)
                .setColor("#ff0000")
                .setTimestamp()
                msg.channel.send({embeds: [error]}).then(a => setTimeout(()=>{
                    msg.delete()
                    a.delete()
                },30000))
            }else{
                const miemRol = msg.guild.members.cache.filter(mr => mr.roles.cache.get(rolID))

                let s0 = 0
                let s1 = 20
                let pagina = 1

                const embMeR = new Discord.MessageEmbed()
                .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("Miembros que tienen el rol")
                .setDescription(`**<@&${rolID}>**\n**👥: ${miemRol.size}**\n\n${miemRol.map(m => m).map((mr, n) => `**${n + 1}. ${mr.user}**`).slice(s0, s1).join("\n\n")}`)
                .setColor("#030303")
                .setFooter(`Pagina - ${pagina}/${Math.round(miemRol.size / 20 + 1)}`,client.user.displayAvatarURL())
                .setTimestamp()
                const repa = await msg.channel.send({embeds: [embMeR]})

                if(miemRol.size >= 21){
                    await repa.react("⬅")
                    await repa.react("➡")
                }

                const colector = repa.createReactionCollector(ree => ree.id === msg.author.id)

                colector.on("collect", async reacion => {
                    if(reacion.emoji.name === "⬅"){
                        if(s0 <= 10) return await reacion.users.remove(msg.author.id);

                        s0 = s0 - 20
                        s1 = s1 - 20
                        pagina = pagina - 1

                        embMeR
                        .setDescription(`**Miembros que tienen el rol <@&${rolID}>**\n\n👥 **${miemRol.size}**\n\n${miemRol.map(m => m).map((mr, n) => `**${n + 1}. ${mr.user}**`).slice(s0, s1).join("\n\n")}`)
                        .setFooter(`Pagina - ${pagina}/${Math.round(miemRol.size / 20 + 1)}`)
                        repa.edit({embeds: [embMeR]})
                    }
                    if(reacion.emoji.name === "➡" && reacion.users.cache.get(msg.author.id)){
                        if(s1 >= miemRol.size)return await reacion.users.remove(msg.author.id);

                        s0 = s0 + 20
                        s1 = s1 + 20
                        pagina = pagina + 1

                        embMeR
                        .setDescription(`**Miembros que tienen el rol <@&${rolID}>**\n\n👥 **${miemRol.size}**\n\n${miemRol.map(m => m).map((mr, n) => `**${n + 1}. ${mr.user}**`).slice(s0, s1).join("\n\n")}`)
                        .setFooter(`Pagina - ${pagina}/${Math.round(miemRol.size / 20 + 1)}`)
                        repa.edit({embeds: [embMeR]})
                    }
                    await reacion.users.remove(msg.author.id)
                })
            }
        }
    }

    // Comandos que muestra todos los miembros que no tienen un rol espesisfico
    if(comando === "meNoRol"){
        msg.channel.sendTyping()

        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send("**Solo un administrador del servidor puede ejecutar el comando.**")
        let rolID = args[0]
        if(!rolID){
            const emb = new Discord.MessageEmbed()
            .setTitle("Comando s.meNoRol")
            .setDescription(`**Uso:**\n${"``"}s.meNoRol <ID del rol>${"``"}\n\n**Ejemplo:**\ns.meNoRol ${msg.member.roles.cache.random().id}`)
            .setColor("#030303")
            .setFooter("Muestra los miembros que no tienen ese rol.")
            .setTimestamp()
            msg.channel.send({embeds: [emb]})
        }else{
            if(!msg.guild.roles.cache.get(rolID)){
                const error = new Discord.MessageEmbed()
                .setTitle("❌ Error")
                .setDescription(`El argumento ingresado no es una ID o no se reconoce como una ID de un rol de este servidor.`)
                .setColor("#ff0000")
                .setTimestamp()
                msg.channel.send({embeds: [error]}).then(a => setTimeout(()=>{
                    msg.delete()
                    a.delete()
                },30000))
            }else{
                const miemRol = msg.guild.members.cache.filter(mr => !mr.roles.cache.get(rolID) && !mr.user.bot)

                let s0 = 0
                let s1 = 20
                let pagina = 1

                const embMeR = new Discord.MessageEmbed()
                .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
                .setTitle("Miembros que no tienen el rol")
                .setDescription(`**<@&${rolID}>**\n**👥: ${miemRol.size}**\n\n${miemRol.map(m => m).map((mr, n) => `**${n + 1}. ${mr.user}**`).slice(s0, s1).join("\n\n")}`)
                .setColor("#030303")
                .setFooter(`Pagina - ${pagina}/${Math.round(miemRol.size / 20 + 1)}`,client.user.displayAvatarURL())
                .setTimestamp()
                const repa = await msg.channel.send({embeds: [embMeR]})

                if(miemRol.size >= 21){
                    await repa.react("⬅")
                    await repa.react("➡")
                }

                const colector = repa.createReactionCollector(ree => ree.id === msg.author.id)

                colector.on("collect", async reacion => {
                    if(reacion.emoji.name === "⬅"){
                        if(s1 <= 10) return await reacion.users.remove(msg.author.id);

                        s0 = s0 - 20
                        s1 = s1 - 20
                        pagina = pagina - 1

                        embMeR
                        .setDescription(`**<@&${rolID}>**\n👥 **${miemRol.size}**\n\n${miemRol.map(m => m).map((mr, n) => `**${n + 1}. ${mr.user}**`).slice(s0, s1).join("\n\n")}`)
                        .setFooter(`Pagina - ${pagina}/${Math.round(miemRol.size / 20 + 1)}`)
                        repa.edit({embeds: [embMeR]})
                    }
                    if(reacion.emoji.name === "➡" && reacion.users.cache.get(msg.author.id)){
                        if(s1 >= miemRol.size)return await reacion.users.remove(msg.author.id);

                        s0 = s0 + 20
                        s1 = s1 + 20
                        pagina = pagina + 1

                        embMeR
                        .setDescription(`**<@&${rolID}>**\n👥 **${miemRol.size}**\n\n${miemRol.map(m => m).map((mr, n) => `**${n + 1}. ${mr.user}**`).slice(s0, s1).join("\n\n")}`)
                        .setFooter(`Pagina - ${pagina}/${Math.round(miemRol.size / 20 + 1)}`)
                        repa.edit({embeds: [embMeR]})
                    }
                    await reacion.users.remove(msg.author.id)
                })
            }
        }
    }
 
    if(comando.toLowerCase() === "addr" || comando.toLowerCase() === "addreaction"){
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

    if(comando === "roles"){
        const embGenero = new Discord.MessageEmbed()
        .setTitle("♀️♂️ Roles de genero")
        .setDescription(`Elige una opción en el menú de abajo para agregarte un rol y así determinar tu genero dentro del servidor.\n\n**<@&828720344869240832>\n\n<@&828720347246624769>**`)
        .setColor(msg.guild.me.displayHexColor)

        const menuGenero = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("genero")
            .setPlaceholder("📑 Elige una opción de acuerdo al rol que quieras obtener.")
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
            .setPlaceholder("📑 Elige una opción de acuerdo al rol que quieras obtener.")
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
        .setDescription(`Elige una o mas opciones en el menú de abajo para obtener un rol del videojuego que te guste y así los demás miembros sabrán que videojuegos te gustan.\n\n**<@&886331637690953729>\n\n<@&886331642074005545>\n\n<@&886331630690631691>\n\n<@&885005724307054652>\n\n<@&886331626643152906>\n\n<@&886331634272587806>**`)
        .setColor(msg.guild.me.displayHexColor)

        const menuVideojuegos = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("videojuegos")
            .setPlaceholder("📑 Elige una opción de acuerdo al rol que quieras obtener.")
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
        .setDescription(`Elige una opción para obtener un rol que cambiara el color de tu nombre dentro del servidor.\n\n**<@&825913849504333874>\n\n<@&825913858446327838>\n\n<@&825913837944438815>\n\n<@&823639766226436146>\n\n<@&823639778926395393>\n\n<@&825913846571991100>\n\n<@&823639775499386881>\n\n<@&825913860992270347>\n\n<@&825913843645546506>\n\n<@&823639769300467724>\n\n<@&825913834803560481>\n\n<@&825913840981901312>\n\n<@&825913855392743444>\n\n<@&825913852654780477>**`)
        .setColor(msg.guild.me.displayHexColor)

        const menuColores = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("colores")
            .setPlaceholder("📑 Elige una opción de acuerdo al rol que quieras obtener.")
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
        .setDescription(`Elige una opción para obtener un rol que te notificara de nuevos anuncios, alianzas, sorteos, encuestas, eventos, sugerencias de la comunidad o postulaciones a staff del servidor o puedes obtener un rol que te notifica cuando se necesite revivir el chat general el cual es <@&850932923573338162> y puede ser muy usado.\n\n**<@&840704358949584926>\n\n<@&840704364158910475>\n\n<@&840704370387451965>\n\n<@&840704372911505418>\n\n<@&915015715239637002>\n\n<@&840704367467954247>\n\n<@&840704375190061076>\n\n<@&850932923573338162>**`)
        .setColor(msg.guild.me.displayHexColor)

        const menuNotificaciones = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("notificaciones")
            .setPlaceholder("📑 Elige una opción de acuerdo al rol que quieras obtener.")
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


    // Luffy
    if(comando === "socio1" && ["825186118050775052", "717420870267830382"].some(s=> s === msg.author.id)){
        let servidor = client.guilds.cache.get("773249398431809586")
        let canal = servidor.channels.cache.get("823381769750577163")
        let socio = servidor.members.cache.get("930882758476169306")
        canal.sendTyping()

        const embSocio1 = new Discord.MessageEmbed()
        .setAuthor(socio.nickname ? socio.nickname: socio.user.username,socio.user.displayAvatarURL({dynamic: true}))
        .setTitle("𝑅𝑜𝑦𝑎𝑙𝑒 𝑝𝑙𝑎𝑦𝑒𝑟𝑠")
        .setDescription(`𝙃𝙤𝙡𝙖 𝙨𝙤𝙮 𝙪𝙣𝙤 𝙙𝙚 𝙡𝙤𝙨 𝙢𝙤𝙙𝙨 𝙙𝙚 𝙚𝙨𝙩𝙚 𝙨𝙚𝙧𝙫𝙞𝙙𝙤𝙧 𝙢𝙚 𝙜𝙪𝙨𝙩𝙖𝙧𝙞𝙖 𝙞𝙣𝙫𝙞𝙩𝙖𝙧𝙩𝙚 𝙖 𝙚𝙨𝙩𝙖 𝙘𝙤𝙢𝙞𝙣𝙞𝙙𝙖𝙙 𝙚𝙣 𝙘𝙧𝙚𝙘𝙞𝙢𝙞𝙚𝙣𝙩𝙤 𝙮 𝙨𝙤𝙘𝙞𝙖𝙗𝙡𝙚 𝙮𝙖 𝙩𝙚 𝙙𝙞𝙜𝙤 𝙘𝙤𝙣 𝙦𝙪𝙚 𝙘𝙤𝙣𝙩𝙖𝙢𝙤𝙨\n\n𝘾𝙝𝙖𝙩 𝙜𝙚𝙣𝙚𝙧𝙖𝙡 𝙥𝙖𝙧𝙖 𝙝𝙖𝙗𝙡𝙖𝙧 𝙘𝙤𝙣 𝙜𝙚𝙣𝙩𝙚 𝙮 𝙝𝙖𝙘𝙚𝙧 𝙖𝙢𝙞𝙜os\n\n𝘾𝙤𝙣𝙩𝙖𝙢𝙤𝙨 𝙘𝙤𝙣 𝙁𝙤𝙩𝙤 𝙐𝙣𝙞𝙘𝙖 💯\n\n𝙖𝙡𝙞𝙖𝙣𝙯𝙖𝙨 𝙥𝙖𝙧𝙖 𝙥𝙤𝙙𝙚𝙧 𝙝𝙖𝙘𝙚𝙧 𝙘𝙧𝙚𝙘𝙚𝙧 𝙩𝙪 𝙖𝙡𝙞𝙖𝙣𝙯𝙖!!\n\n𝘾𝙤𝙣𝙩𝙖𝙢𝙤𝙨 𝙘𝙤𝙣 𝙚𝙘𝙤𝙣𝙤𝙢𝙮 𝙚𝙣𝙩𝙧𝙚 𝙤𝙩𝙧𝙖𝙨\n\n𝘾𝙤𝙣𝙩𝙖𝙢𝙤𝙨 𝙘𝙤𝙣 𝙣𝙞𝙫𝙚𝙡 2 𝙚𝙣 𝙗𝙤𝙤𝙨𝙩\n\n𝘾𝙤𝙣𝙩𝙖𝙢𝙤𝙨 𝙘𝙤𝙣 𝙩𝙤𝙧𝙣𝙚𝙤𝙨 𝙙𝙚 𝙥𝙚𝙨 𝙢𝙤𝙗𝙞𝙡𝙚 𝙘𝙤𝙣 𝙧𝙚𝙘𝙤𝙢𝙥𝙚𝙣𝙨𝙖𝙨 𝙜𝙚𝙣𝙞𝙖𝙡𝙚𝙨!\n\n𝘾𝙤𝙣𝙩𝙖𝙢𝙤𝙨 𝙘𝙤𝙣 𝙎𝙩𝙖𝙛𝙛 24/7!!\n\n𝙘𝙤𝙣𝙩𝙖𝙢𝙤𝙨 𝙘𝙤𝙣 𝙙𝙞𝙣𝙖𝙢𝙞𝙘𝙖𝙨 𝙙𝙚 𝙥𝙧𝙚𝙢𝙞𝙤𝙨 𝙘𝙤𝙣 𝙗𝙖𝙡𝙤𝙣𝙚𝙨 𝙙𝙚 𝙤𝙧𝙤 𝙘𝙤𝙥𝙖 𝙙𝙚𝙡 𝙢𝙪𝙣𝙙𝙤 𝙘𝙝𝙖𝙢𝙥𝙞𝙤𝙣𝙨 𝙚𝙩c\n\n𝘾𝙤𝙣𝙩𝙖𝙢𝙤𝙨 𝙘𝙤𝙣 𝙜𝙚𝙣𝙩𝙚 𝙖𝙘𝙩𝙞𝙫𝙖 24/7\n\n𝘾𝙤𝙣𝙩𝙖𝙢𝙤𝙨 𝙘𝙤𝙣 𝙗𝙤𝙩𝙨 𝙙𝙚 𝙞𝙣𝙩𝙚𝙧𝙖𝙘𝙘𝙞𝙤𝙣\n\n𝙘𝙤𝙣𝙩𝙖𝙢𝙤𝙨 𝙘𝙤𝙣 𝙨𝙞𝙨𝙩𝙚𝙢𝙖 𝙙𝙚 𝙖𝙪𝙩𝙤𝙧𝙤𝙡𝙚𝙨\n\n𝘾𝙤𝙣𝙩𝙖𝙢𝙤𝙨 𝙘𝙤𝙣 𝙨𝙤𝙧𝙩𝙚𝙤𝙨 𝙙𝙚 𝙣𝙞𝙩𝙧𝙤 𝙪𝙣𝙚𝙩𝙚 𝙖𝙮 𝙪𝙣𝙤 𝙖𝙝𝙤𝙧𝙖 𝙢𝙞𝙨𝙢𝙤!\n\n𝙄𝙣𝙘𝙡𝙪𝙞𝙢𝙤𝙨 𝙩𝙖𝙢𝙗𝙞𝙚𝙣 𝙘𝙤𝙣 𝙨𝙚𝙧𝙫𝙞𝙙𝙤𝙧 𝙙𝙚 𝙢𝙞𝙣𝙚𝙘𝙧𝙖𝙛𝙩 𝙮 𝙘𝙡𝙖𝙣 𝙙𝙚 𝙘𝙡𝙖𝙨𝙝 𝙧𝙤𝙮𝙖𝙡𝙚 𝙣𝙤 𝙨𝙚 𝙩𝙚 𝙤𝙡𝙫𝙞𝙙𝙚 𝙡𝙚𝙚𝙧 𝙡𝙖𝙨 𝙧𝙚𝙜𝙡𝙖𝙨!\n\n𝙐𝙣𝙚𝙩𝙚! 𝘼𝙮𝙪𝙙𝙖𝙣𝙤𝙨 𝙖 𝙘𝙧𝙚𝙘𝙚𝙧 𝙔 𝙝𝙖𝙘𝙚𝙧 𝙪𝙣𝙖 𝙘𝙤𝙢𝙪𝙣𝙞𝙙𝙖𝙙 𝘽𝙪𝙨𝙘𝙖𝙢𝙤𝙨 𝙜𝙚𝙣𝙩𝙚 𝙦𝙪𝙚 𝙨𝙚𝙖 𝙖𝙘𝙩𝙞𝙫𝙖 𝙚𝙣 𝙩𝙤𝙙𝙤𝙨 𝙡𝙤𝙨 𝙖𝙨𝙥𝙚𝙘𝙩𝙤𝙨 𝙩𝙚 𝙚𝙨𝙥𝙚𝙧𝙖𝙢𝙤𝙨! `)
        .setColor(socio.displayHexColor)
        .setFooter(`Auto promocion de ${socio.user.tag} por ser socio del servidor, ¿quieres ser socio?, abre un ticket o habla con un administrador.`,servidor.iconURL({dynamic: true}))
        .setTimestamp()
        setTimeout(()=>{
            canal.send({embeds: [embSocio1], content: `https://discord.gg/cwMYtDQmgA`})
        },2000)
    }


    // Ryok
    if(comando === "socio2" && ["825186118050775052", "717420870267830382"].some(s=> s === msg.author.id)){
        let servidor = client.guilds.cache.get("773249398431809586")
        let canal = servidor.channels.cache.get("823381769750577163")
        let socio = servidor.members.cache.get("926318482834989056")
        canal.sendTyping()

        const embSocio2 = new Discord.MessageEmbed()
        .setAuthor(socio.nickname ? socio.nickname: socio.user.username,socio.user.displayAvatarURL({dynamic: true}))
        .setTitle("𝐅𝐔𝐓𝐔𝐑𝐄 | 𝐏𝐔𝐁𝐋𝐈𝐂𝐈𝐃𝐀𝐃")
        .setDescription(`\`\`Contamos con canales para publicitar:\n🔵 Servidores de DISCORD.\n🔴 Canales de YOUTUBE.\n🟣 Canales de TWITCH.\n⚪ Páginas WEB y PAYPAL.\nAdemás contamos con:\n👥 Canales J4J, Sub4Sub, etc...\n🎌 Canales para buscar compañeros/amigos.\n¿Qué esperas para PUBLICITAR GRATIS todo lo que desees?\`\``)
        .setColor(socio.displayHexColor)
        .setFooter(`Auto promocion de ${socio.user.tag} por ser socio del servidor, ¿quieres ser socio?, abre un ticket o habla con un administrador.`,servidor.iconURL({dynamic: true}))
        .setTimestamp()
        setTimeout(()=>{
            canal.send({embeds: [embSocio2], content: `https://discord.gg/WrYTAnyChJ`})
        },2000)
    }

    // Fernando De Leon
    if(comando === "socio3" && ["825186118050775052", "717420870267830382"].some(s=> s === msg.author.id)){
        let servidor = client.guilds.cache.get("773249398431809586")
        let canal = servidor.channels.cache.get("836315643070251008")
        let socio = servidor.members.cache.get("796748895387648010")
        canal.sendTyping()

        const embSocio3 = new Discord.MessageEmbed()
        .setAuthor(socio.nickname ? socio.nickname: socio.user.username,socio.user.displayAvatarURL({dynamic: true}))
        .setTitle("DevilCraft")
        .setDescription(`Buscas un Survival RPG bedrock y java  24/7 En linea?\n\n===>> DevilCraft es para ti [ 1.16 - 1.18+] <<===\n\n⁂〉⟼  Protecciones\n⁂〉⟼  Economia\n⁂〉⟼  Misiones\n⁂〉⟼  Tienda de usuarios(Casa de Subastas)\n⁂〉⟼  Tumbas\n⁂〉⟼  Habilidades(Tipo RPG)\n⁂〉⟼  Random teleport\n⁂〉⟼  Sin lag!\n⁂〉⟼  Eventos Semanales\n⁂〉⟼  Chat activo y comunidad.\n⁂〉⟼  Sorteos Mensuales\n⁂〉⟼  Miembros del personal amables y animados.\n⁂〉⟼  Beneficios de actividad.\n⁂〉⟼  Un lugar para conocer gente nueva y relajada.\n\n\nIP:   DEVILCRAFTSMP.COM\nPUERTO:  19132(Predeterminado)\n\nhttps://devilcraft.org/\n\nhttps://tienda.devilcraft.org/\n\nNO - ღ -P2W- ღ -\nInicio • [Sitio oficial de DevilCraft](https://devilcraft.org/)`)
        .setColor(socio.displayHexColor)
        .setFooter(`Auto promocion de ${socio.user.tag} por ser socio del servidor, ¿quieres ser socio?, abre un ticket o habla con un administrador.`,servidor.iconURL({dynamic: true}))
        .setTimestamp()
        setTimeout(()=>{
            canal.send({embeds: [embSocio3], content: `https://discord.gg/x4e7db4KsW`})
        },2000)
    }
})


// Auto reaciones para memes
client.on("messageCreate", async msg => {
    if(msg.author.bot) return;
    if(msg.channelId === "845396662930112533"){
        let mci = msg.content
        if(msg.attachments.size >= 1 || mci.includes(".png") || mci.includes(".jpg") || mci.includes(".mp4")){
            msg.react("😂")
            msg.react("😴")
        }
    }
})


// Auto moderacion
client.on("messageCreate",async msg => {
    if(!msg.author.id === creadorID) return;
    if(msg.author.bot) return;
    if(!msg.guildId === servidorID) return;

    let canalesPerIDs = msg.guild.channels.cache.filter(fc => ["785729364288339978","827295364167237644","913490278529261619","823655193886851143", "833120722695487518"].includes(fc.parentId)).map(mc => mc.id)
    let otrasIDCha = ["845396662930112533","914537165269110804","938905017509888040","834956208112795668"]
    for(let i=0; i<otrasIDCha.length; i++){
        canalesPerIDs.push(otrasIDCha[i])
    }
    let mcontenido = msg.content

    if(msg.content === "s.canalesModerados"){
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

    if(!canalesPerIDs.some(s=> s === msg.channelId)){
        let enlaces = [{urls: ["discord.gg/","discord.com/invite/"]},{urls: ["youtube.com","youtu.be"]},{urls: ["twitch.tv"]},{urls: ["tiktok.com","vm.tiktok.com"]},{urls: ["twitter.com"]},{urls: ["instagram.com"]},{urls: ["https:","http:",".com"]}]
        let titulos = ["<:DiscordLogo:855164382387109908> Auto moderación de enlaces de Discord","<:youtubelogo:855166340780130354> Auto moderación de enlaces de YouTube","<:TwitchEmblema:855167274193125396> Auto moderación de enlaces de Twitch","<:Mamadatok:855167926875979837> Auto moderación de enlaces de TikTok",`<:TwitterLogo:855168545566490664> Auto moderación de enlaces de Twitter`,"<:instagram:855169028376494080> Auto moderación de enlaces de Instagram","🔗 Auto moderación de enlaces"]
        let descripciones = [` de **Discord**, el canal correcto para publicar un enlace de **Discord** es <#823381769750577163> o <#836315643070251008>`,` de **YouTube**, el canal correcto para publicar un enlace de **YouTube** es <#823961526297165845> o <#836315643070251008>`,` de **Twitch**, el canal correcto para publicar un enlace de **Twitch** es <#823381980389310464> o <#836315643070251008>`,` de **TikTok**, el canal correcto para publicar un enlace de **TikTok** es <#827295990360965153> o <#836315643070251008>`,` de **Twitter**, el canal correcto para publicar un enlace de **Twitter** es <#823381924344758313> o <#836315643070251008>`,` de **Instagram**, el canal correcto para publicar un enlace de **Instagram** es <#823382007391584276> o <#836315643070251008>`,`, si quiere hacer promoción hágalo en los canales de la categoría **<#785729364288339978>** como <#836315643070251008>.\nSi esta perdido y necesita ayuda mencione a un <@&831669132607881236>.`]
        let colores = ["#5965F1","#FE0100","#6441a5","#030303","#1CA1F3","#ED0D6E",colorErr]

        for(let i=0; i<enlaces.length; i++){
            for(let e=0; e<enlaces[i].urls.length; e++){
                if(mcontenido.includes(enlaces[i].urls[e])){
                    const embWarn = new Discord.MessageEmbed()
                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                    .setTitle(titulos[i])
                    .setDescription(`Lo ciento ${msg.author} en este canal no esta permitido publicar enlaces${descripciones[i]}`)
                    .setColor(colores[i])
                    .setFooter(`🛑 Advertencia por ${client.user.tag}`,client.user.displayAvatarURL())
                    .setTimestamp()

                    setTimeout(()=>{
                        msg.delete().catch(c=>{
                            return;
                        })

                        msg.channel.send({embeds: [embWarn], content: `<@${msg.author.id}>`}).then(tw=>{
                            setTimeout(()=>{
                                tw.delete().catch(c=>{
                                    return;
                                })
                            },20000)
                        })
                    })

                    if(autoModeracion.some(s=> s.miembroID === msg.author.id)){
                        for(let w=0; w<autoModeracion.length; w++){
                            if(autoModeracion[w].miembroID === msg.author.id){
                                autoModeracion[w].advertencias = autoModeracion[w].advertencias + 1
                                if(autoModeracion[w].advertencias >= 2){
                                    const embAdvertenciaMD = new Discord.MessageEmbed()
                                    .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
                                    .setTitle(`🔗 Auto moderación de enlaces`)
                                    .setDescription(`Esta prohibido publicar enlaces en en canal <#${msg.channelId}>, evita hacerlo de nuevo para no sancionarte.`)
                                    .setColor(colorErr)
                                    msg.author.send({embeds: [embAdvertenciaMD]}).catch(c=>{
                                        return;
                                    })
                                }

                                if(autoModeracion[w].advertencias === 3){
                                    msg.member.timeout(4*60*60000, `Por auto moderación de enlaces, el miembro ha enviado ${autoModeracion[w].advertencias} enlaces en canales los cuales no esta permitido.`)
                                }
                                if(autoModeracion[w].advertencias === 4){
                                    msg.member.timeout(8*60*60000, `Por auto moderación de enlaces, el miembro ha enviado ${autoModeracion[w].advertencias} enlaces en canales los cuales no esta permitido.`)
                                }
                                if(autoModeracion[w].advertencias === 5){
                                    msg.member.timeout(10*60*60000, `Por auto moderación de enlaces, el miembro ha enviado ${autoModeracion[w].advertencias} enlaces en canales los cuales no esta permitido.`)
                                }
                                if(autoModeracion[w].advertencias === 6){
                                    msg.member.kick(`Por auto moderación de enlaces, el miembro ha enviado ${autoModeracion[w].advertencias} enlaces en canales los cuales no esta permitido.`)
                                }
                                if(autoModeracion[w].advertencias === 7){
                                    msg.member.ban(`Por auto moderación de enlaces, el miembro ha enviado ${autoModeracion[w].advertencias} enlaces en canales los cuales no esta permitido.`)
                                }
                                return;
                            }
                        }
                    }else{
                        autoModeracion.push({miembroID: msg.author.id, advertencias: 1})
                    }
                    return; 
                }
            }
        }
    }
})

// _____________________________
// Registros
client.on("guildBanAdd",async gba => {
    if(gba.guild.id === "773249398431809586"){
        const emb = new Discord.MessageEmbed()
        .setThumbnail(gba.user.displayAvatarURL({dynamic: true}))
        .setTitle("❌ Usuario baneado")
        .setDescription(`👤 ${gba.user.tag}\n\n🆔 ${gba.user.id}\n\n📝 Razon: ${(await gba.guild.bans.fetch()).filter(fb => fb.user.id === gba.user.id).map(mb => mb.reason)}`)
        .setColor(colorErr)
        .setFooter(gba.guild.name,gba.guild.iconURL())
        .setTimestamp()
        client.channels.cache.get("851150361312886784").send({embeds: [emb]})
    }
})

// // unban
client.on("guildBanRemove", async gbr => {
    if(gbr.guild.id === "773249398431809586"){
        const emb = new Discord.MessageEmbed()
        .setThumbnail(gbr.user.displayAvatarURL({dynamic: true}))
        .setTitle("❌ Usuario desbaneado")
        .setDescription(`👤 ${gbr.user.tag}\n\n🆔 ${gbr.user.id}`)
        .setColor("#00ff00")
        .setFooter(gbr.guild.name,gbr.guild.iconURL())
        .setTimestamp()
        client.channels.cache.get("851150361312886784").send({embeds: [emb]})
    }
})


// anti bots no verificados
client.on("guildMemberAdd", async gbm => {
    if(gbm.user.bot && gbm.guild.id === servidorID){
        if(!gbm.user.flags.has("VERIFIED_BOT")){
            gbm.kick("Razon: Bot no verificado.")

            const embAuntiB = new Discord.MessageEmbed()
            .setAuthor(gbm.user.tag,gbm.user.displayAvatarURL({dynamic: true}))
            .setTitle("Anti bots no verificados")
            .setDescription(`Se ha espulsado un bot no verificado que ha entrado en ${gbm.guild.name}`)
            .setColor(gbm.guild.me.displayHexColor)
            .setFooter(gbm.guild.name,gbm.guild.iconURL({dynamic: true}))
            .setTimestamp()
            client.users.cache.get("717420870267830382").send({embeds: [embAuntiB]})
        }
    }
})

process.on("unhandledRejection", err => {
    console.log(err)
    const embErr = new Discord.MessageEmbed()
    .setTitle(`Ocurio un error`)
    .setDescription(`\`\`\`js\n${err}\`\`\``)
    .setColor("ff0000")
    .setTimestamp()
    client.channels.cache.get("931619970520060166").send({embeds: [embErr]})
})

client.on("shardError", async err => {
    console.log(err)
    const embErr = new Discord.MessageEmbed()
    .setTitle(`Ocurio un error`)
    .setDescription(`\`\`\`js\n${err}\`\`\``)
    .setColor("ff0000")
    .setTimestamp()
    client.channels.cache.get("931619970520060166").send({embeds: [embErr]})
})

client.login(token)