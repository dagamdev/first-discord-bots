const ms = require("ms");
const hola = "hola"
module.exports = {hola}
const Discord = require("discord.js"), client = new Discord.Client({intents: 32767}), mongoose = require("mongoose"), Canvas = require("canvas"), canvacord = require("canvacord"), { SlashCommandBuilder, ContextMenuCommandBuilder, roleMention } = require("@discordjs/builders"), servidorID = "842630591257772033", creadorID = "717420870267830382"
Canvas.registerFont("./tipo.otf", {family: "MADE TOMMY"});

// mongoose.connect("mongodb+url",{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(()=>{
//     console.log("Conectado correctamente a la base de datos.")
// }).catch(e=>{
//     console.log("Ocurrió un error al conectarse con la DB", e)
// })

// Sistema de niveles
const nivelesSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    canalID: {type: String, required: true},
    miembros: {type: Array, required: true}
})
const nivelesDB = mongoose.model("Niveles", nivelesSchema)
// 887829645649641472
let dataInterChat = [{servidorID: "842630591257772033", nombre: "🦾 Pruebas", canalID: "887829645649641472"},
    {servidorID: "949861760096145438", nombre: "Servidor 2", canalID: "949861762902138942"},
    {servidorID: "949860813915705354", nombre: "PCEM | Soporte", canalID: "978433547746574416"},
]
let mensajes = [
    {id: "96179", tiempo: Math.floor(Date.now()+ms("4d")), mensajesInt: [{id: "978448806704185434", canalID: "978433547746574416"}, {id: "978448802325340191", canalID: "949861762902138942"}]},
    {id: "45179", tiempo: Math.floor(Date.now()+ms("6d")), mensajesInt: [{id: "978448806704185434", canalID: "978433547746574416"}, {id: "978448802325340191", canalID: "949861762902138942"}]},
    {id: "11179", tiempo: Math.floor(Date.now()+ms("6d")), mensajesInt: [{id: "978448806704185434", canalID: "978433547746574416"}, {id: "978448802325340191", canalID: "949861762902138942"}]},
    {id: "32179", tiempo: Math.floor(Date.now()+ms("7d")), mensajesInt: [{id: "978448806704185434", canalID: "978433547746574416"}, {id: "978448802325340191", canalID: "949861762902138942"}]},
    {id: "16179", tiempo: Math.floor(Date.now()+ms("4d")), mensajesInt: [{id: "978448806704185434", canalID: "978433547746574416"}, {id: "978448802325340191", canalID: "949861762902138942"}]},
]
client.on("ready", async () => {
    console.log(`${client.user.username}: estoy listo.`)
    let servidor = client.guilds.cache.get("842630591257772033"), canal = servidor.channels.cache.get("856425774446149673"), david = servidor.members.cache.get(creadorID)

    client.fetchInvite(`G7GUD7eNCb`).then(inv=>{
        
        console.log(inv)
        console.log(inv.memberCount)
    }).catch(c=> console.log(c))

    // const embPr = new Discord.MessageEmbed()
    // .setTitle("hola esto es una prueba")
    // .setColor("RANDOM")
    // true ? embPr.addField("hola", "jja"): ""
    // true ? embPr.addField("gey", "claro que no"): ""
    // canal.send({embeds: [embPr]})

    // for(let l=0; l<50; l++){
    //     client.channels.cache.get("971209078221201408").send({content: "Con esa boquita besas a tu madre ??????????"})
    // }

    // client.channels.cache.get("971209078221201408").createInvite({maxAge: 0}).then(inv=> console.log(inv.url))

    // await canal.messages.fetch("973276313840386099", {force: true}).reply({content: `Hola`})
    async function revicionInterChat(){
        // console.log(dataInterChat.filter(f=>f.canalID != false))
        dataInterChat.filter(f=>f.canalID != false).forEach(async (objeto, ps) => {
            let servidorInt = client.guilds.cache.get(objeto.servidorID)
            if(servidorInt){
                let canal = servidorInt.channels.cache.get(objeto.canalID)
                if(canal){
                    // console.log((await canal.fetchWebhooks()).find(f=>f.owner.id == client.user.id))
                    if(!(await canal.fetchWebhooks()).find(f=>f.owner.id == client.user.id)){
                        canal.createWebhook(`Inter chat`, {avatar: "https://cdn.discordapp.com/attachments/967650956340756571/973083887293042708/heart.png", reason: `Imprescindible para el sistema de inter chat.`})
                    }
                }
            }
        })
    }
    mensajes.filter(f=> f.tiempo>=Math.floor(Date.now()+ms("6d"))).forEach((mensaje, ps) => {
        mensajes.splice(mensajes.findIndex(f=> f.id==mensaje.id),1)
    })
     

    function presencias () {
        const estadosDia = [
            {
                name: "ARK",
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
                name: `sus caras`,
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
        if(tiempo.getMinutes() > 10 && tiempo.getMinutes() < 14){
            client.user.setPresence({status: "idle", activities: [estadosNoche[Math.floor(Math.random()*estadosNoche.length)]]})
        }else{
            client.user.setPresence({status: "online", activities: [estadosDia[Math.floor(Math.random()*estadosDia.length)]]})
        }
    }
    presencias()
    // revicionInterChat()
    // console.log(mensajes)

    setInterval(()=>{
        presencias()
        // console.log(mensajes)
        // revicionInterChat()
        // console.log(mensajes)
    }, 60000)

    async function slashCommands(){
        const canvasCommand = new SlashCommandBuilder()
        .setName("canvas")
        .setDescription(`Un comando para probar cosas de canvas.`)
    
        const pruebasCommand = new SlashCommandBuilder()
        .setName("prueba")
        .setDescription(`Comando de pruebas`)
    
        const sayCommand = new SlashCommandBuilder()
        .setName(`say`)
        .setDescription(`📝 Replico el texto que me indiques.`)
        .addStringOption(cadena=> cadena.setName(`texto`).setDescription(`📄 Texto el cual replicare.`).setRequired(true))
    
        const nivelCommand = new SlashCommandBuilder()
        .setName(`nivel`)
        .setDescription(`🏅 Muestra tu nivel o el nivel de un miembro.`)
        .addUserOption(usuario=> usuario.setName(`miembro`).setDescription(`👤 Proporciona un miembro para ver su nivel.`).setRequired(false))
    
        const topNivelesCommand = new SlashCommandBuilder()
        .setName(`top`)
        .setDescription(`🏆 Muestra una tabla de clasificaciones de los miembros y sus niveles.`)
    
        let comandos = [canvasCommand, pruebasCommand, sayCommand, nivelCommand, topNivelesCommand]
        comandos.forEach(async (valor) => {
            if(! (await servidor.commands.fetch()).find(f=> f.name == valor.name)){
                servidor.commands.create(valor).then(tc=> console.log(`Comando ${valor.name} creado.`))
            }
        })
    }
    // slashCommands()
})

// Cooldown
const cooldowns = new Map()
let ediciones = 0, emojiError = "<a:negativo:856967325505159169>", colorErr = "#ff0000"
client.on("interactionCreate", async int => {
    console.log(int.isModalSubmit())
    if(int.isCommand()){
        if(int.commandName == "canvas"){
            const { createCanvas, loadImage } = require('canvas')
            const canvas = createCanvas(470, 250)
            const ctx = canvas.getContext('2d')
            
            ctx.strokeStyle = "#ffffff";
            ctx.strokeRect(0,0, canvas.width, canvas.height-1);

            ctx.fillStyle = "#d30f0e"
            ctx.fillRect(30, 30, 410, 190)
            ctx.strokeStyle = "rgba(0,0,0,.5)"
            ctx.lineWidth = 5
            ctx.strokeRect(130, 50, 200, 150)

            ctx.strokeStyle = "black"
            ctx.lineWidth = 3
            ctx.lineTo(200, 110)
            ctx.lineTo(220, 140)
            ctx.lineTo(180, 180)
            ctx.lineTo(255, 140)
            ctx.lineTo(240, 110)
            ctx.lineTo(290, 75)
            ctx.closePath()
            ctx.fillStyle = "#f4c521"
            ctx.fill()
            ctx.stroke()

            ctx.beginPath()

            ctx.lineWidth = 10
            const esquina1 = 50
            const esquina2 = 0
            const esquina3 = 50
            const esquina4 = 0

            ctx.lineTo(esquina1, 5)
            ctx.lineTo(canvas.width-esquina2, 5)
            ctx.lineTo(canvas.width-5, esquina2)
            ctx.lineTo(canvas.width-5, canvas.height-esquina3)
            ctx.lineTo(canvas.width-esquina3, canvas.height-5)
            ctx.lineTo(esquina4, canvas.height-5)
            ctx.lineTo(5, canvas.height-esquina4)
            ctx.lineTo(5, esquina1)
            ctx.closePath()
            ctx.stroke()

            const finalImg = new Discord.MessageAttachment(canvas.toBuffer(), "imagen.png")
                int.reply({files: [finalImg]})
            
            // Draw cat with lime helmet
            // loadImage(int.user.displayAvatarURL()).then((image) => {
            //     // ctx.drawImage(image, 50, 0, 70, 70)
            
            //     //   console.log('<img src="' + canvas.toDataURL() + '" />')
            //     const finalImg = new Discord.MessageAttachment(canvas.toBuffer(), "imagen.png")
            //     int.reply({files: [finalImg]})
            // })
        }
        if(int.commandName == "say"){
            int.channel.sendTyping()
            let texto = int.options.getString("texto"), definitivo = texto.replace(/@/g, "")

            const embEnviando = new Discord.MessageEmbed()
            .setTitle(`<a:loop:964162886865944617> Replicando el texto`)
            .setColor("BLUE")

            const embAutor = new Discord.MessageEmbed()
            .setTitle(`📝 Comando say utilizado`)
            .setDescription(`He replicado el texto que me has proporcionado.`)
            .setColor("GREEN")
            int.reply({ephemeral: true, embeds: [embEnviando]})

            setTimeout(()=>{
                int.channel.send({content: definitivo}).then(s=> {
                    int.editReply({embeds: [embAutor]})
                })
            }, 1000)
        }
        if(int.commandName == "prueba"){
            const modal = new Discord.Modal()
            .setCustomId("modal")
            .setTitle("Modal de prueba")
            
            const colorVavorito = new Discord.TextInputComponent()
            .setCustomId("colorFavorito")
            .setLabel("¿Cual es tu color favorito?")
            .setMaxLength(100)
            .setMinLength(10)
            .setStyle("SHORT")
            .setPlaceholder("hola")
            .setRequired(true)
            // .setValue("color")

            const coloresAction = new Discord.MessageActionRow().addComponents(colorVavorito)

            modal.addComponents(coloresAction)
            await int.showModal(modal)
        }
        if(int.commandName == "nivel"){
            int.deferReply()
            let dataNvl = await nivelesDB.findOne({_id: "843185929002025030"}), miembro = false, rank = new canvacord.Rank(), coloerTxt = "#6d7171", img = "https://cdn.discordapp.com/attachments/901313790765854720/967468662086840410/marcoNeon.png"

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
                    .setRequiredXP(miembroDB.lmt, coloerTxt)
                    .setStatus(miembro.presence?.status ? miembro.presence?.status: "offline")
                    .setProgressBar(["#5ff701", "#030b00"], "GRADIENT", true)
                    .setUsername(miembro.user.username, coloerTxt)
                    .setDiscriminator(miembro.user.discriminator)
                    .setLevel(miembroDB.nivel, "Nivel:", true)
                    .setLevelColor(coloerTxt)
                    .setRank(dataNvl.miembros.sort((a,b) => b.lmt - a.lmt).findIndex(f=> f.id == miembro.id)+1, "Top:", true)
                    .setRankColor(coloerTxt)
                    // .setOverlay("#0000ff", miembroDB.nivel, true)
                    
                    
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
                    .setRequiredXP(10, coloerTxt)
                    .setStatus(miembro.presence?.status ? miembro.presence?.status: "offline")
                    .setProgressBar(["#fff602", "#09ff02", "#02eaff"], "GRADIENT", true)
                    .setUsername(miembro.user.username, coloerTxt)
                    .setDiscriminator(miembro.user.discriminator)
                    .setLevel(0, "Nivel:", true)
                    .setLevelColor(coloerTxt)
                    .setRank(dataNvl.miembros.length+1, "Top:", true)
                    .setRankColor(coloerTxt)
                    // .setOverlay("#0000ff", miembroDB.nivel, true)
                    
                    
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
                    .setRequiredXP(miembroDB.lmt, coloerTxt)
                    .setStatus(int.member.presence?.status ? int.member.presence?.status: "offline")
                    .setProgressBar(["#fff602", "#09ff02", "#02eaff"], "GRADIENT", true)
                    .setUsername(int.user.username, coloerTxt)
                    .setDiscriminator(int.user.discriminator)
                    .setLevel(miembroDB.nivel, "Nivel:", true)
                    .setLevelColor(coloerTxt)
                    .setRank(dataNvl.miembros.sort((a,b) => b.lmt - a.lmt).findIndex(f=> f.id == int.user.id)+1, "Top:", true)
                    .setRankColor(coloerTxt)
                    // .setOverlay("#0000ff", miembroDB.nivel, true)
                    
                    
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
                    .setRequiredXP(10, coloerTxt)
                    .setStatus(int.member.presence?.status ? int.member.presence?.status: "offline")
                    .setProgressBar(["#fff602", "#09ff02", "#02eaff"], "GRADIENT", true)
                    .setUsername(int.user.username, coloerTxt)
                    .setDiscriminator(int.user.discriminator)
                    .setLevel(0, "Nivel:", true)
                    .setLevelColor(coloerTxt)
                    .setRank(dataNvl.miembros.length+1, "Top:", true)
                    .setRankColor(coloerTxt)
                    // .setOverlay("#0000ff", miembroDB.nivel, true)
                    
                    
                    rank.build().then(data=> {
                        const attachment = new Discord.MessageAttachment(data, `RankCard${int.user.username}.png`)
                        setTimeout(async ()=>{
                            await int.editReply({files: [attachment]})
                        }, 400)
                    })
                }
            }
        }
        if(int.commandName == "top"){
            int.deferReply()
            let dataNvl = await nivelesDB.findOne({_id: "843185929002025030"}), orden = dataNvl.miembros.sort((a,b) => b.lmt - a.lmt), tabla = []

            orden.forEach((valor, ps) => {
                if(valor.id == int.user.id){
                    tabla.push(`**${ps==0 ? "🥇": ps==1 ? "🥈": ps==2 ? "🥉": ps+1}. ${valor.tag} - XP: ${valor.lmt}**`)
                }else{
                    tabla.push(`**${ps==0 ? "🥇": ps==1 ? "🥈": ps==2 ? "🥉": ps+1}.** ${valor.tag} - XP: **${valor.lmt}**`)
                }
            })

            const embTopniveles = new Discord.MessageEmbed()
            .setAuthor(int.member.nick ? int.member.nickname: int.user.username, int.user.displayAvatarURL({dynamic: true}))
            .setTitle(`<:LvlUp:967475913707114507> Tabla de clasificaciones de niveles`)
            .setDescription(tabla.join("\n"))
            .setColor(int.guild.me.displayHexColor)
            .setFooter(int.guild.name, int.guild.iconURL({dynamic: true}))
            .setTimestamp()
            setTimeout(()=>{
                int.editReply({embeds: [embTopniveles]})
            }, 400)
        }
    }

    if(int.isModalSubmit()){
        if(int.customId == "modal"){
            const color = int.fields.getTextInputValue("colorFavorito")
            int.reply({ephemeral: true, content: `Hola te gusta ${color}`})
        }
    }
})


// const Discord = require("discord.js")
// const client = new Discord.Client({intents: 32767})

// client.on("messageCreate", async msg => {
//     const prefijo = "|"
//     if(!msg.content.startsWith(prefijo)) return;
//     const args = msg.content.slice(prefijo.length).trim().split(/ +/g);
//     const comando = args.shift().toLowerCase()
// })

// client.login("token")



client.on("messageCreate", async msg => {
    if(!msg.member) return

    let autoMod = [
        {activadores: ["pene", "vagina", "invecil", "porno", "imbecil"], titulo: `palabras prohibidas`, descripcion: `No puedes enviar ese tipo de palabras por el inter chat.`, color: `#0080FF`},
        {activadores: ["discord.gg/", "discord.com/invite/"], titulo: `invitaciones de Discord`, descripcion: `No puedes enviar invitaciones de Discord por el inter chat.`, color: `#FF9300`},
        {activadores: ["http://", "https://"], titulo: `enlaces`, descripcion: `No pueden enviar enlaces por el inter chat.`, color: colorErr},
    ]
    
    if(dataInterChat.some(s=>s.canalID == msg.channelId)){
        if(!cooldowns.has("crearTicket")){
            cooldowns.set("crearTicket", new Discord.Collection())
        }

        const tiempoActual = Date.now()
        const datosComando = cooldowns.get("crearTicket")

        for(m in autoMod){
            const embAutoModeracion = new Discord.MessageEmbed()
            .setTitle(`Auto moderacion de `+autoMod[m].titulo)
            .setDescription(autoMod[m].descripcion)
            .setColor(autoMod[m].color)
            if(![".png", ".jpg", ".mp4", ".jpeg", ".webp", ".gif"].some(a=> msg.content.toLowerCase().includes(a)) && autoMod[m].activadores.some(s=> msg.content.toLowerCase().includes(s))) return msg.reply({embeds: [embAutoModeracion]}).then(tm=>{
                per=true
                setTimeout(()=>{
                    msg.delete().catch(c=>c)
                    tm.delete().catch(C=>c)
                    per=false
                }, 10000)
            })
        }

        if(datosComando.has(msg.author.id)){
            const tiempoUltimo = datosComando.get(msg.author.id) + 2000;
            console.log(tiempoUltimo - tiempoActual)

            const embEnfriarse = new Discord.MessageEmbed()
            .setTitle("⏱️ Enfriamiento/cooldown")
            .setDescription(`Espera **2** segundos entre cada mensaje.`)
            .setColor("BLUE")

            if(tiempoActual < tiempoUltimo){
                if(msg.author.bot) return tr.delete().catch(c=> c)

                if(!msg.author.bot) return msg.reply({embeds: [embEnfriarse]}).then(tr=> setTimeout(()=> {
                    msg.delete().catch(c=> c)
                    tr.delete().catch(c=> c)
                }, 10000))
            }
        }
       
        if(msg.author.id == client.user.id && msg.embeds.length!=0 && ["auto moderacion", "Enfriamiento/cooldown"].some(s=> msg.embeds[0].title.includes(s))) return
        let mensajeID = 0
        let idGenerada = Math.floor(Math.random()*888888)+111111
        let bueltas = 1
        for(let g=0; g<bueltas; g++){
            if(mensajes.some(s=>s.id == idGenerada)){
                bueltas++
            }else{
                mensajes.push({id: idGenerada, tiempo: Date.now(), mensajesInt: []})
                mensajeID = idGenerada
            }
        }
        let mensaje = mensajes.find(f=> f.id == mensajeID)
        console.log(msg.mentions.users.size)
        console.log(msg.mentions.members.size)
        dataInterChat.filter(f=>f.canalID != false).forEach(async (objeto) => {
            if(!client.channels.cache.get(objeto.canalID).permissionsFor(client.user.id).has(["MANAGE_WEBHOOKS", "MANAGE_MESSAGES"])) return;
            if(objeto.canalID != msg.channelId){
                let canal = client.channels.cache.get(objeto.canalID)
                if(canal){
                    let webhook = (await canal.fetchWebhooks()).find(f=>f.owner.id == client.user.id)
                    if(webhook){
                        const interChatWebhook = new Discord.WebhookClient({url: webhook.url})
                        interChatWebhook.send({username: msg.author.username, avatarURL: msg.author.displayAvatarURL({dynamic: true, format: "png"}), content: msg.content.length>0 ? ["@everyone", "@here"].some(s=> msg.content.includes(s)) || (msg.content.includes("@") && msg.content.includes("<")) ? msg.content.replace(/@/g, ""): msg.content: " ", embeds: msg.author.bot ? msg.embeds: [], components: msg.components, files: msg.attachments.map(a=>a)}).then(tmw=>{
                            mensaje.mensajesInt.push({id: tmw.id, tiempo: Date.now(), canalID: canal.id})
                            console.log(tmw.id)
                        })
                        
                    }else{
                        canal.createWebhook(`Inter Chat`, {avatar: "https://cdn.discordapp.com/attachments/967650956340756571/973083887293042708/heart.png", reason: `Imprescindible para el sistema de inter chat.`}).then(tw=> {
                            const interChatWebhook = new Discord.WebhookClient({url: tw.url})
                            
                            interChatWebhook.send({username: msg.author.username, avatarURL: msg.author.displayAvatarURL({dynamic: true, format: "png"}), content: msg.content.length>0 ? ["@everyone", "@here"].some(s=> msg.content.includes(s)) ? msg.content.replace(/@/g, ""): msg.content: " ", embeds: msg.author.bot ? msg.embeds: [], components: msg.components, files: msg.attachments.map(a=>a)}).then(tmw=>{
                                mensaje.mensajesInt.push({id: tmw.id, canalID: canal.id})
                                console.log(tmw.id)
                            })
                        })
                    }
                }
            }
        })

        if(msg.author.id!=client.user.id){
            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(()=>{
                datosComando.delete(msg.author.id)
            }, 2000)
        }
    }


    if(!msg.content.startsWith("|")) return;
    const args = msg.content.slice(1).trim().split(/ +/g);
    const comando = args.shift().toLowerCase()

    

    if(comando == "setinterchat"){
        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply({allowedMentions: {repliedUser: false}, content: `❌ **|** No eres administrador del servidor, no puedes utilizar el comando.`})
        let canal = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0]) || false
        if(!canal) return msg.reply({allowedMentions: {repliedUser: false}, content: `❌ **|** No ha proporcionado correctamente el canal.`})
        let dataInChat = dataInterChat.find(f=>f.servidorID == msg.guildId)
        if(dataInChat){
            let errores = [
                {condicion: msg.guild.channels.cache.has(dataInChat.canalID) && dataInterChat.some(s=>s.canalID == canal.id), descripcion: `❌ **|** El canal *(${canal})* ya se encuentra establecido como canal para el sistema de inter chat.`},
                {condicion: msg.guild.channels.cache.has(dataInChat.canalID) && dataInterChat.some(s=>s.canalID != canal.id), descripcion: `❌ **|** No puedes establecer mas de **1** canal para el sistema de inter chat, ya tienes establecido el canal <#${dataInChat.canalID}>.`},
                {condicion: !msg.guild.me.permissionsIn(canal.id).has("MANAGE_WEBHOOKS"), descripcion: `❌ **|** No tengo permiso para gestionar **Webhooks** en ese canal, es imprescindible para que funcione correctamente el sistema.`},
                {condicion: !msg.guild.me.permissionsIn(canal).has("MANAGE_MESSAGES"), descripcion: `❌ **|** No tengo permiso para gestionar **mensajes** en el canal, es fundamental para el funcionamiento del sistema de inter chat.`},
            ]
            for(e in errores){
                if(errores[e].condicion) return msg.reply({allowedMentions: {repliedUser: false}, content: errores[e].descripcion})
            }

            dataInChat.canalID = canal.id
            const embEstablecido = new Discord.MessageEmbed()
            .setTitle(`✅ Canal establecido`)
            .setDescription(`Se ha establecido el canal ${canal} como el canal del sistema de inter chat.`)
            .setColor("GREEN")
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEstablecido]})
            if(!(await canal.fetchWebhooks()).find(f=>f.owner.id == client.user.id)){
                canal.createWebhook("Inter chat", {avatar: "https://cdn.discordapp.com/attachments/967650956340756571/973083887293042708/heart.png", reason: `Imprescindible para el sistema de inter chat.`}).then(tm=> console.log(tm))
            }
        }else{
            dataInterChat.push({servidorID: msg.guildId, nombre: msg.guild.name, canalID: canal.id})
            const embEstablecido = new Discord.MessageEmbed()
            .setTitle(`✅ Canal establecido`)
            .setDescription(`Se ha establecido el canal ${canal} como el canal del sistema de inter chat.`)
            .setColor("GREEN")
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEstablecido]})
            canal.createWebhook("Inter chat", {avatar: "https://cdn.discordapp.com/attachments/967650956340756571/973083887293042708/heart.png", reason: `Imprescindible para el sistema de inter chat.`}).then(tm=> console.log(tm))
        }
    }

    if(comando == "removeinterchat"){
        if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.reply({allowedMentions: {repliedUser: false}, content: `❌ **|** No eres administrador del servidor, no puedes utilizar el comando.`})
        let dataInChat = dataInterChat.find(f=>f.servidorID == msg.guildId)
        if(dataInChat){
            if(dataInChat.canalID == false){
                msg.reply({allowedMentions: {repliedUser: false}, content: `❌ **|** El sistema de inter chat ya se encuentra desactivado.`})
            }else{
                let canal = msg.guild.channels.cache.get(dataInChat.canalID)
                if(canal){
                    dataInChat.canalID = false
                    const embEliminado = new Discord.MessageEmbed()
                    .setTitle(`❌ Sistema desactivado`)
                    .setDescription(`Se ha desactivado el sistema de inter chat.`)
                    .setColor("RED")
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEliminado]})
                    let weboock = (await canal.fetchWebhooks()).find(f=>f.owner.id == client.user.id)
                    // console.log(weboock)
                    weboock.delete()
                    // (await canal.fetchWebhooks()).find(f=>f.owner.id == client.user.id).delete()
                }else{
                    dataInChat.canalID = false
                    const embEliminado = new Discord.MessageEmbed()
                    .setTitle(`❌ Sistema desactivado`)
                    .setDescription(`Se ha desactivado el sistema de inter chat.`)
                    .setColor("RED")
                    msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEliminado]})
                }
            }
        }else{
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [emojiError], content: `❌ **|** No puedes desactivar un sistema que nunca se ha activado en este servidor.`})
        }
    }

    if(comando == "interchatservers"){
        let filtro = dataInterChat.filter(f=>f.canalID != false && client.channels.cache.has(f.canalID)).sort((a,b)=> client.guilds.cache.get(b.servidorID).memberCount - client.guilds.cache.get(a.servidorID).memberCount), tabla = []
        for(f of filtro){
            let servidor = client.guilds.cache.get(f.servidorID)
            if(servidor.me.permissions.has("MANAGE_GUILD")){
                let invitacion = (await servidor.invites.fetch()).find(f=>f.inviterId == client.user.id)
                // ? (await servidor.invites.fetch()).find(f=>f.inviterId == client.user.id).url: client.channels.cache.get(f.canalID).createInvite({maxAge: 0}).then(inv=> invitacion = inv.url)
                if(invitacion){
                    invitacion = (await servidor.invites.fetch()).find(f=>f.inviterId == client.user.id).url
                }else{
                    client.channels.cache.get(f.canalID).createInvite({maxAge: 0}).then(inv=> {
                        invitacion = inv.url
                    })
                }
                if(servidor.id == msg.guildId){
                    tabla.push(`**${filtro.findIndex(i=>i.servidorID == f.servidorID)+1}. [${servidor.name}](${invitacion}) - ${servidor.memberCount.toLocaleString()} miembros**`)
                }else{
                    tabla.push(`**${filtro.findIndex(i=>i.servidorID == f.servidorID)+1}**. **[${servidor.name}](${invitacion})** - **${servidor.memberCount.toLocaleString()}** miembros`)
                }
            }else{
                if(servidor.id == msg.guildId){
                    tabla.push(`**${filtro.findIndex(i=>i.servidorID == f.servidorID)+1}. ${servidor.name} - ${servidor.memberCount.toLocaleString()} miembros**`)
                }else{
                    tabla.push(`**${filtro.findIndex(i=>i.servidorID == f.servidorID)+1}**. **${servidor.name}** - **${servidor.memberCount.toLocaleString()}** miembros`)
                }
            }
        }

        let segPage
        if(String(filtro.length).slice(-1) == 0){
            segPage = Math.floor(filtro.length / 10)
        }else{
            segPage = Math.floor(filtro.length / 10 + 1)
        }

        let ttp1 = 0, ttp2 = 10, pagina = 1, descripcion = `Hay un total de **${filtro.length.toLocaleString()}** ${filtro.length <= 1 ? "servidor que tiene": "servidores que tienen"} activado el sistema de inter chat.\n\n`
            
        if(filtro.length > 10){
            const embTop = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`💬 Servidores que tienen activo el sistema de inter chat`)
            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(`Pagina ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()

            const botonesPrinc = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton()
                .setCustomId("Si")
                .setLabel("Anterior")
                .setEmoji("⬅️")
                .setStyle("PRIMARY")
            ],
            [
                new Discord.MessageButton()
                .setCustomId("No")
                .setLabel("Siguiente")
                .setEmoji("➡️")
                .setStyle("PRIMARY")
            ])

            const botones1 = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton()
                .setCustomId("Si")
                .setLabel("Anterior")
                .setEmoji("⬅️")
                .setStyle("SECONDARY")
                .setDisabled(true)
            ],
            [
                new Discord.MessageButton()
                .setCustomId("No")
                .setLabel("Siguiente")
                .setEmoji("➡️")
                .setStyle("PRIMARY")
            ])

            const botones2 = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton()
                .setCustomId("Si")
                .setLabel("Anterior")
                .setEmoji("⬅️")
                .setStyle("PRIMARY")
            ],
            [
                new Discord.MessageButton()
                .setCustomId("No")
                .setLabel("Siguiente")
                .setEmoji("➡️")
                .setStyle("SECONDARY")
                .setDisabled(true)
            ])
               
            setTimeout(async ()=>{
                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embTop], components: [botones1]}).then(async msgs =>{
                    await msg.channel.messages.fetch(msgs.id, {force: true}).then(mensaje => {
                        const colector = mensaje.createMessageComponentCollector({filter: u=> u.user.id == msg.author.id, time: segPage*60000})
    
                        setTimeout(()=>{
                            mensaje.edit({embeds: [embTop], components: []}).catch(c=> console.log(c))
                        }, segPage*60000)

                        colector.on("collect", async bt => {
                            if(bt.customId == "Si"){
                                if(ttp2 - 10 <= 10){
                                    ttp1-=10, ttp2-=10, pagina--

                                    embTop
                                    .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                    .setFooter(`Pagina ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                                    await bt.update({embeds: [embTop], components: [botones1]})
                                }else{
                                    ttp1-=10, ttp2-=10, pagina--
                                
                                    embTop
                                    .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                    .setFooter(`Pagina ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                                    await bt.update({embeds: [embTop], components: [botonesPrinc]})
                                }
                            }
                            if(bt.customId == "No"){
                                if(ttp2 + 10 >= ordenado.length){
                                    ttp1+=10, ttp2+=10, pagina++
                                    
                                    embTop
                                    .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                    .setFooter(`Pagina ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                                    await bt.update({embeds: [embTop], components: [botones2]})
                                }else{
                                    ttp1+=10, ttp2+=10, pagina++
            
                                    embTop
                                    .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
                                    .setFooter(`Pagina ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
                                    await bt.update({embeds: [embTop], components: [botonesPrinc]})
                                }
                            }
                        })  
                    }).catch(ct=>{
                        const embError = new Discord.MessageEmbed()
                        .setTitle(`${emojiError} Error`)
                        .setDescription(`Lo ciento ha ocurrido un error y no se cual es el motivo.`)
                        .setColor(colorErr)
                        msg.reply({embeds: [embError], components: []})
                    })
                })
            }, 400)
        }else{
            const embTop = new Discord.MessageEmbed()
            .setAuthor(msg.author.tag,msg.author.displayAvatarURL({dynamic: true}))
            .setTitle(`💬 Servidores que tienen activo el sistema de inter chat`)
            .setDescription(descripcion+tabla.slice(ttp1,ttp2).join("\n\n"))
            .setColor(msg.guild.me.displayHexColor)
            .setFooter(`Pagina ${pagina}/${segPage}`,msg.guild.iconURL({dynamic: true}))
            .setTimestamp()
            setTimeout(()=>{
                msg.reply({allowedMentions: {repliedUser: false},embeds: [embTop]})
            }, 400)
        }   
        
    }

    if(comando == "deletemsg"){
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, content: `❌ **|** Proporciona una ID para eliminar el mensaje del sistema de inter chat.`})
        if(!mensajes.some(s=> s.id == args[0])) return msg.reply({allowedMentions: {repliedUser: false}, content: `❌ **|** No he encontrado ningún mensaje con esa ID, quizás has proporcionado mal la ID.`})

        let mensaje = mensajes.find(f=> f.id == args[0]), filtroIntMsg = mensaje.mensajesInt.filter(f=> client.channels.cache.get(f.canalID)), bueltas = 0, msgsEliminados = 0

        const embEliminando = new Discord.MessageEmbed()
        .setTitle(`<a:loop:978393770804531230> Eliminando mensaje del inter chat`)
        .setDescription(`Esto puede tardar aproximadamente **${filtroIntMsg.length}** segundos.`)
        .setColor("BLURPLE")
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embEliminando]}).then(tm=> {
            let intervalo = setInterval(async () => {
                if(bueltas < filtroIntMsg.length){
                    await client.channels.cache.get(filtroIntMsg[bueltas].canalID).messages.fetch(filtroIntMsg[bueltas].id, {force: true}).then(tms=>{
                        tms.delete().then(ttd => {
                            console.log("Mensaje eliminado")
                            msgsEliminados++
                        })
                    }).catch(cms=> cms)
                    bueltas++
                }else{
                    clearInterval(intervalo)
    
                    const embFinalizado = new Discord.MessageEmbed()
                    .setTitle(`🗑️ Mensaje del sistema de inter chat eliminado`)
                    .setDescription(`Se eliminaron **${msgsEliminados}** mensajes con la ID \`\`${args[0]}\`\``)
                    .setColor(msg.guild.me.displayHexColor)
                    tm.edit({embeds: [embFinalizado]})

                    mensajes.splice(mensajes.findIndex(f=> f.id == args[0]),1)
                }
            }, 1000)
        })
    }

    if(comando == "findid"){
        if(!args[0]) return msg.reply({allowedMentions: {repliedUser: false}, content: `❌ **|** Proporciona una ID para encontrar la ID general del mensaje.`})
        let mensaje = mensajes.find(f=> f.mensajesInt.some(s=> s.id==args[0]))
        console.log(mensaje)
        if(!mensaje) return msg.reply({allowedMentions: {repliedUser: false}, content: `❌ **|** No he encontrado ninguna ID general que pertenezca a esa ID.`})

        const embIDEncontrada = new Discord.MessageEmbed()
        .setTitle(`🆔 ID encontrada`)
        .setDescription(`La ID general de ese mensaje es \`\`${mensaje.id}\`\``)
        .setColor("GREEN")
        msg.reply({allowedMentions: {repliedUser: false}, embeds: [embIDEncontrada]})
    }

})


client.login(require("./config.json").tokPrueba)