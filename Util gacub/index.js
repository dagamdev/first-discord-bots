const { Client, EmbedBuilder, Collection, ButtonBuilder, ActionRowBuilder, AttachmentBuilder, SelectMenuBuilder, version, MessageType, ActivityType, ChannelType, ButtonStyle } = require("discord.js")
const client = new Client({ intents: 131071, ws: { properties: { $browser: "Discord Android" } } });
const ms = require("ms"), mongoose = require("mongoose"), { SlashCommandBuilder, ContextMenuCommandBuilder } = require("@discordjs/builders"), Canvas = require("canvas"), isURL = require("isurl");
const creadorID = "717420870267830382", creadoresID = ["717420870267830382", "825186118050775052"], colorEmb = "#2c889f", colorEmbInfo = "#2c889f", ColorError = "#ff0000", emojis = { negativo: "<a:negativo:856967325505159169>", acierto: "<a:afirmativo:856966728806432778>", puntos: "<:StaffPoint:957357854120116234>", lupa: "<:lupa:958820188457930892>" }, invitacion = "https://discord.com/api/oauth2/authorize?client_id=935707268090056734&permissions=1239568329975&scope=bot%20applications.commands", serverSuport = "https://discord.gg/G7GUD7eNCb", webPage = "https://util-bot.netlify.app/"
const { token, mongoUrl, enviroment } = require('./config')
Canvas.registerFont("./tipo.otf", { family: "MADE TOMMY" });

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conectado correctamente a la base de datos.")
}).catch(e => {
    console.log("Ocurrió un error al conectarse con la DB", e)
})

// Sistema de historial
const esquemaHistoriales = new mongoose.Schema({
    _id: { type: String, required: true },
    sanciones: { type: Object, required: true },
    usuarios: { type: Array, required: true }
})
const historialesDB = mongoose.model("Historiales", esquemaHistoriales)

// Prefijo configurable
const confPrefijo = new mongoose.Schema({
    _id: { type: String, required: true },
    servidores: { type: Array, required: true }
})
const prefijosDB = mongoose.model("Prefijo", confPrefijo)

// Sistema de puntos
const puntosMongo = new mongoose.Schema({
    _id: { type: String, required: true },
    serverName: { type: String, required: true },
    datos: { type: Object, required: true },
    miembros: { type: Object, required: true }
})
const puntosDB = mongoose.model("Sistema de puntos", puntosMongo)

// AFK DB
const awayFromKeyboard = new mongoose.Schema({
    _id: { type: String, required: true },
    servidor: { type: Object, required: true },
    miembros: { type: Array, required: true }
})
const afkDB = mongoose.model("AFK DB", awayFromKeyboard)

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
    historial: [{ mensajeID: "", miembroID: "" }]
}

client.on("ready", async () => {
    let miServidor = client.guilds.cache.get("940034044819828767"), hermano = client.users.cache.get("843185929002025030"), svsp = client.guilds.cache.get("773249398431809586")
    console.log(client.user.username, "Hola, estoy listo")
    const embReady = new EmbedBuilder()
    .setTitle(`${emojis.acierto} Estoy conectado`)
    .setDescription(`Desde Northflank ||server||.`)
    .setColor("00ff00")
    .setTimestamp()
    const canalLogStart = miServidor.channels.cache.get("940078303694442566")
    canalLogStart.sendTyping()
    setTimeout(()=> {
        canalLogStart.send({ embeds: [embReady] })
    }, 2000)


    function presencias() {
        let estadoId = 0
        const estadosDia = [
            {
                id: 1,
                estado: {
                    name: `${client.guilds.cache.size.toLocaleString()} servidores.`,
                    type: ActivityType.Watching
                }
            },
            {
                id: 2,
                estado: {
                    name: "u!help",
                    type: ActivityType.Listening
                }
            },
            {
                id: 2,
                estado: {
                    name: "/help",
                    type: ActivityType.Listening
                }
            },
            {
                id: 3,
                estado: {
                    name: `${client.users.cache.size.toLocaleString()} usuarios.`,
                    type: ActivityType.Watching
                }
            },
            {
                id: 4,
                estado: {
                    name: "u!invite",
                    type: ActivityType.Listening
                }
            },
            {
                id: 5,
                estado: {
                    name: `${svsp.name} mi servidor de origen.`,
                    type: ActivityType.Watching
                }
            },
            {
                id: 6,
                estado: {
                    name: `moderar con mi hermanó ${hermano.username}`,
                    type: ActivityType.Playing
                }
            },
            {
                id: 7,
                estado: {
                    name: `mis 42 comandos.`,
                    type: ActivityType.Watching
                }
            },
        ]

        const estadosNoche = [
            {
                id: 1,
                estado: {
                    name: `mis sueños, estoy durmiendo.`,
                    type: ActivityType.Watching
                }
            },
            {
                id: 2,
                estado: {
                    name: `a los usuarios y durmiendo.`,
                    type: ActivityType.Listening
                }
            }
        ]

        let tiempo = new Date(), bueltas = 1
        if (tiempo.getHours() - 5 > 20 || tiempo.getHours() - 5 < 8) {
            let estadoRandom = estadosNoche[Math.floor(Math.random() * estadosNoche.length)]
            for (let e = 0; e < bueltas; e++) {
                if (estadoRandom.id == estadoId) {
                    estadoRandom = estadosNoche[Math.floor(Math.random() * estadosNoche.length)]
                    bueltas++
                } else {
                    client.user.setPresence({ status: "idle", activities: [estadosNoche[Math.floor(Math.random() * estadosNoche.length)].estado] })
                }
            }
        } else {
            let estadoRandom = estadosDia[Math.floor(Math.random() * estadosDia.length)]
            for (let e = 0; e < bueltas; e++) {
                if (estadoRandom.id == estadoId) {
                    estadoRandom = estadosDia[Math.floor(Math.random() * estadosDia.length)]
                    bueltas++
                } else {
                    client.user.setPresence({ status: "online", activities: [estadosDia[Math.floor(Math.random() * estadosDia.length)].estado] })
                }
            }
        }
    }
    presencias()

    setInterval(() => {
        presencias()
    }, 4 * 60000)

    async function slashCommands() {
        const helpCmd = new SlashCommandBuilder()
            .setName("help")
            .setDescription(`❓ ¿Necesitas ayuda?, breve introducción al bot.`)

        //? Sistema de puntos
        const pointsInfoCmd = new SlashCommandBuilder()
            .setName(`points-info`)
            .setDescription(`📗 Información sobre el sistema de puntos.`)

        const pointsCmd = new SlashCommandBuilder()
            .setName("points")
            .setNameLocalizations({ "es-ES": "puntos" })
            .setDescription("🔢 Muestra los puntos que tienes o tiene un miembro.")
            .setDescriptionLocalizations({ "en-US": "Shows the points you have or a member has." })
            .addUserOption(user => user.setName(`miembro`).setDescription(`🧑 Miembro a ver sus puntos.`).setRequired(false))

        const addPointsCmd = new SlashCommandBuilder()
            .setName("add-points")
            .setDescription(`➕ Agrega puntos a un miembro del staff.`)
            .addUserOption(user => user.setName(`miembro`).setDescription(`🧑 Miembro a agregar puntos.`).setRequired(true))
            .addIntegerOption(integer => integer.setName(`cantidad`).setDescription(`🔢 La cantidad de puntos a dar.`).setRequired(true))

        const removePointsCmd = new SlashCommandBuilder()
            .setName("remove-points")
            .setDescription(`➖ Eliminar puntos a un miembro del staff.`)
            .addUserOption(user => user.setName(`miembro`).setDescription(`🧑 Miembro a eliminar puntos.`).setRequired(true))
            .addIntegerOption(integer => integer.setName(`cantidad`).setDescription(`🔢 La cantidad de puntos a eliminar.`).setRequired(true))

        const setStaffRoleCmd = new SlashCommandBuilder()
            .setName("set-staff-role")
            .setDescription(`📥 Establece un rol del staff o personal del servidor para el sistema de puntos.`)
            .addRoleOption(rol => rol.setName("rol").setDescription(`El rol a establecer.`).setRequired(true))

        const deleteStaffRoleCmd = new SlashCommandBuilder()
            .setName("delete-staff-role")
            .setDescription(`📤 Elimina un rol establecido como rol del staff del servidor para el sistema de puntos.`)
            .addRoleOption(rol => rol.setName("rol").setDescription(` El rol a eliminar.`).setRequired(true))

        const setEmojiPointsCmd = new SlashCommandBuilder()
            .setName(`set-emoji-points`)
            .setDescription(`🧿 Establece un símbolo o emoji personalizado para el sistema de puntos.`)
            .addStringOption(emoji => emoji.setName(`emoji`).setDescription(`😁 El emoji a establecer.`).setRequired(true))

        const removeSystemUserCmd = new SlashCommandBuilder()
            .setName(`remove-system-user`)
            .setDescription(`⭕ Elimina a un miembro del servidor del sistema de puntos.`)
            .addUserOption(user => user.setName(`usuario`).setDescription(`👤 Usuario a eliminar del sistema.`).setRequired(true))

        const pointsLeaderboardCmd = new SlashCommandBuilder()
            .setName(`points-leaderboard`)
            .setDescription(`🏆 Muestra una tabla de clasificaciones del sistema de puntos.`)

        const pointSystemStatusCmd = new SlashCommandBuilder()
            .setName(`point-system-status`)
            .setDescription(`📊 Muestra el estado del sistema de puntos en el servidor.`)

        const updatePointsSystemCmd = new SlashCommandBuilder()
            .setName(`update-points-system`)
            .setDescription(`♾️ Elimina del sistema de puntos a todos los miembros que ya no se encuentran en el servidor.`)


        let servidor = client.guilds.cache.get("940034044819828767")
        let commands = [helpCmd, pointsInfoCmd, pointsCmd, addPointsCmd, removePointsCmd, setStaffRoleCmd, deleteStaffRoleCmd, setEmojiPointsCmd, removeSystemUserCmd, pointsLeaderboardCmd, pointSystemStatusCmd, updatePointsSystemCmd]
        for (let command of commands) {
            if (!(await client.application.commands.fetch()).some(s => s.name == command.name)) {
                client.application.commands.create(command).then(c=> console.log(`Comando ${c.name} publico creado.`))
            }
        }
    
        // servidor.commands.create(pointsCmd.toJSON())
        // console.log((await servidor.commands.fetch()).map(m=> m.name+" | "+m.id))
        // servidor.commands.edit("985227802250997810", {name: pointsCmd.name})
    }
    slashCommands()
})

function erroresInt(tipo = false, errores = false) {
    try {
        if (!tipo) {
            throw new Error("No has establecido el tipo de elemento en la funcion errores.")
        }
        if (!errores) {
            throw new Error("No has establecido los errores del comando.")
        }

        for (error of errores) {
            const embError = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(error.descripcion)
                .setColor(ColorError)
            if (error.condicion) {
                tipo.reply({ ephemeral: true, embeds: [embError] })
                return true
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const cooldowns = new Map()
client.on("interactionCreate", async int => {
    if (int.isCommand()) {
        if (int.commandName == "help") {
            botDB.comandos.usos++
            let dataPre = await prefijosDB.findById(client.user.id), prefijo = dataPre.servidores.some(s => s.id == int.guildId) ? dataPre.servidores.find(f => f.id == int.guildId).prefijo : "u!"
            const embHelp = new EmbedBuilder()
                .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                .setThumbnail(client.user.displayAvatarURL())
                .setTitle(`Hola, soy **${client.user.username}** un Bot multi funcional`)
                .setDescription(`Tengo comandos informativos, comandos de moderación, comandos de administración y sistemas como el sistema de puntos.\nMi prefijo en este servidor es: \`\`${prefijo}\`\`\nPara conocer mis comandos utiliza el comando \`\`${prefijo}comandos\`\`.\nPor ahora solo están disponibles **12** comandos de barra diagonal, si tienes alguna duda, sugerencia puedes entrar a mi [servidor de soporte](${serverSuport}) para resolver tus dudas o hacer una sugerencia.`)
                .setColor(colorEmb)
                .setFooter({ text: int.guild.name, iconURL: int.guild.iconURL() })
                .setTimestamp()

            int.deferReply().then(()=> {
                setTimeout( () => {
                    int.editReply({ embeds: [embHelp] })
                }, 500)
            })
        }

        //? Sistema de puntos
        if (int.commandName == "points-info") {
            botDB.comandos.usos++
            let dataSP = await puntosDB.findById(int.guildId)
            if (dataSP) {
                let objeto = dataSP.datos
                objeto.comandosUsos++
                await puntosDB.findByIdAndUpdate(int.guildId, { datos: objeto })
            }

            int.deferReply()
            const embInfoP = new EmbedBuilder()
                .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                .setTitle(`${emojis.puntos} ¿Qué es el sistema de Puntos?`)
                .setDescription(`Es un sistema creado con la intención de ayudar a los dueños y administradores de servidores a tener una mejor forma de administrar las acciones de lo demás miembros del staff y determinar con mayor facilidad cuando un miembro del staff se merece un acenso.\n\n📑 **Comandos:** *10*\n\`\`/points\`\` **|** Muestra la cantidad de puntos que tienes o tiene un miembro.\n\`\`/add-points\`\` **|** Agrega puntos a un miembro.\n\`\`/remove-points\`\` **|** Elimina puntos a un miembro.\n\`\`/set-staff-role\`\` **|** Establece un rol del staff o personal del servidor.\n\`\`/delete-staff-role\`\` **|** Elimina un rol establecido como rol del staff del servidor.\n\`\`/set-emoji-points\`\` **|** Establece un símbolo o emoji personalizado para el sistema de puntos.\n\`\`/remove-system-user\`\` **|** Elimina a un miembro del sistema de puntos del servidor.\n\`\`/points-leaderboard\`\` **|** Muestra una tabla de clasificaciones con los miembros que han utilizado el sistema de puntos y sus respectivos puntos.\n\`\`/point-system-status\`\` **|** Muestra el estado del sistema en el servidor.\n\`\`/update-points-system\`\` **|** Actualiza el sistema de puntos en el servidor eliminando del sistema a todos los usuarios que se han ido del servidor.`)
                .setColor(colorEmb)
                .setFooter({ text: int.guild.name, iconURL: int.guild.iconURL() })
                .setTimestamp()
            setTimeout(async () => {
                await int.editReply({ embeds: [embInfoP] })
            }, 500)
        }
        if (int.commandName == "points") {
            botDB.comandos.usos++
            let dataSP = await puntosDB.findById(int.guildId), puntos = 0, miembro = int.options.getUser("miembro") ? int.guild.members.cache.get(int.options.getUser("miembro").id) : false

            let erroresP = [
                { condicion: miembro.id == client.user.id, descripcion: `El miembro proporcionado *(${miembro})* soy yo, yo no puedo utilizar el sistema de puntos.` },
                { condicion: miembro && miembro.user.bot, descripcion: `El miembro que has proporcionado *(${miembro})* es un bot, un bot no puede utilizar el sistema de puntos.` },
                { condicion: dataSP && dataSP.datos.rolesPersonal.length > 0 && !dataSP.datos.rolesPersonal.some(s => int.member.roles.cache.has(s)), descripcion: `No puedes utilizar este comando ya que no eres miembro del personal del servidor.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresInt(int, erroresP)) return;

            await int.deferReply()
            if (!dataSP) {
                let nuevaDataSP = new puntosDB({
                    _id: int.guildId,
                    serverName: int.guild.name,
                    datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [] },
                    miembros: [{ id: int.user.id, nombre: int.user.tag, puntos: 0 }]
                })
                await nuevaDataSP.save()
            }
            if (miembro) {
                puntos = dataSP ? dataSP.miembros.some(s => s.id == miembro.id) ? dataSP.miembros.find(f => f.id == miembro.id).puntos : 0 : 0
                const embPuntos = new EmbedBuilder()
                    .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                    .setDescription(`${miembro.id == int.user.id ? "Tienes" : `${miembro} tiene`} ${dataSP ? dataSP.datos.emoji : emojis.puntos} **${puntos.toLocaleString()}** puntos.`)
                    .setColor(int.guild.members.me.displayHexColor)
                    .setFooter({ text: miembro.id == int.user.id ? int.guild.name : miembro.nickname ? miembro.nickname : miembro.user.username, iconURL: miembro.id == int.user.id ? int.guild.iconURL() : miembro.user.displayAvatarURL() })
                    .setTimestamp()
                setTimeout(async () => {
                    await int.editReply({ embeds: [embPuntos] })
                }, 500)

            } else {
                puntos = dataSP ? dataSP.miembros.some(s => s.id == int.user.id) ? dataSP.miembros.find(f => f.id == int.user.id).puntos : 0 : 0
                const embPuntos = new EmbedBuilder()
                    .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                    .setDescription(`Tienes ${dataSP ? dataSP.datos.emoji : emojis.puntos} **${puntos.toLocaleString()}** puntos.`)
                    .setColor(int.guild.members.me.displayHexColor)
                    .setFooter({text: int.guild.name, iconURL: int.guild.iconURL()})
                    .setTimestamp()
                setTimeout(async () => {
                    await int.editReply({ embeds: [embPuntos] })
                }, 500)
            }
        }
        if (int.commandName == "add-points") {
            botDB.comandos.usos++
            let dataSP = await puntosDB.findById(int.guildId), miembro = int.guild.members.cache.get(int.options.getUser("miembro").id), cantidad = int.options.getInteger("cantidad"), puntosMiembro = dataSP ? dataSP.miembros.some(s => s.id == miembro.id) ? dataSP.miembros.find(f => f.id == miembro.id).puntos : 0 : 0

            let erroresP = [
                { condicion: !int.member.permissions.has('Administrator'), descripcion: `No tienes los permisos suficientes para ejecutar el comando.` },
                { condicion: miembro.id == client.user.id, descripcion: `El miembro proporcionado *(${miembro})* soy yo, yo no puedo utilizar el sistema de puntos.` },
                { condicion: miembro && miembro.user.bot, descripcion: `El miembro que has proporcionado *(${miembro})* es un bot, un bot no puede utilizar el sistema de puntos.` },
                { condicion: int.user.id != int.guild.ownerId && miembro.id == int.guild.ownerId, descripcion: `El miembro proporcionado *(${miembro})* es el dueño del servidor, no puedes agregarle puntos.` },
                { condicion: int.user.id != int.guild.ownerId && int.member.roles.highest.comparePositionTo(miembro.roles.highest) < 0, descripcion: `El rol mas alto del miembro proporcionado *(${miembro})* es igual o mayor a tu rol mas alto por lo tanto no le puedes agregar puntos.` },
                { condicion: cantidad <= 0, descripcion: `No puedes agregar **0** puntos o un numero negativo de puntos a un miembro.` },
                { condicion: puntosMiembro == 1000000000, descripcion: `El miembro ya tiene la máxima cantidad de puntos por miembro la cual es ${dataSP ? dataSP.datos.emoji : emojis.puntos} **${(1000000000).toLocaleString()}** puntos.` },
                { condicion: (puntosMiembro + cantidad) > 1000000000, descripcion: `La cantidad que has proporcionado excedería el limite de puntos del miembro, puedes agregar una cantidad igual o menor a ${dataSP ? dataSP.datos.emoji : emojis.puntos} **${(1000000000 - puntosMiembro).toLocaleString()}** puntos al miembro.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresInt(int, erroresP)) return;

            if (!cooldowns.has("/add-points")) {
                cooldowns.set("/add-points", new Collection())
            }
            const datosComando = cooldowns.get("/add-points"), tiempoActual = Date.now()

            if (datosComando.has(int.user.id)) {
                const tiempoUltimo = datosComando.get(int.user.id) + 10000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando */add-points*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return int.reply({ ephemeral: true, embeds: [embEnfriarse] })
            }

            int.deferReply()
            if (dataSP) {
                let objeto = dataSP.datos, array = dataSP.miembros
                objeto.comandosUsos++
                objeto.puntosAgregados += cantidad

                array.some(s => s.id == miembro.id) ? array.find(f => f.id == miembro.id).puntos += cantidad : array.push({ id: miembro.id, nombre: miembro.user.tag, puntos: cantidad })
                await puntosDB.findByIdAndUpdate(int.guildId, { datos: objeto, miembros: array })
                const embAddPoints = new EmbedBuilder()
                    .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                    .setTitle(`${emojis.acierto} Puntos agregados al miembro`)
                    .setDescription(`Se ${int.user.id == miembro.id ? "te" : "le"} han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos ${int.user.id == miembro.id ? "." : `a **${miembro}**.`}`)
                    .setColor('Green')
                    .setFooter({ text: miembro.id == int.user.id ? int.guild.name : miembro.nickname ? miembro.nickname : miembro.user.username, iconURL: miembro.id == int.user.id ? int.guild.iconURL() : miembro.user.displayAvatarURL() })
                    .setTimestamp()
                setTimeout(async () => {
                    await int.editReply({ embeds: [embAddPoints] })
                }, 500)

            } else {
                let nuevaDataSP = new puntosDB({
                    _id: int.guildId,
                    serverName: int.guild.name,
                    datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: cantidad, puntosEliminados: 0, rolesPersonal: [] },
                    miembros: [{ id: miembro.id, nombre: miembro.user.tag, puntos: cantidad }]
                })
                await nuevaDataSP.save()

                const embAddPoints = new EmbedBuilder()
                    .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                    .setTitle(`${emojis.acierto} Puntos agregados al miembro`)
                    .setDescription(`Se ${int.user.id == miembro.id ? "te" : "le"} han agregado ${emojis.puntos} **${cantidad.toLocaleString()}** puntos ${int.user.id == miembro.id ? "." : `a **${miembro}**.`}`)
                    .setColor('Green')
                    .setFooter({ text: miembro.id == int.user.id ? int.guild.name : miembro.nickname ? miembro.nickname : miembro.user.username, iconURL: miembro.id == int.user.id ? int.guild.iconURL() : miembro.user.displayAvatarURL() })
                    .setTimestamp()
                setTimeout(async () => {
                    await int.editReply({ embeds: [embAddPoints] })
                }, 500)
            }

            datosComando.set(int.user.id, tiempoActual)
            setTimeout(() => {
                datosComando.delete(int.user.id)
            }, 10000)
        }
        if (int.commandName == "remove-points") {
            botDB.comandos.usos++
            let dataSP = await puntosDB.findById(int.guildId), miembro = int.guild.members.cache.get(int.options.getUser("miembro").id), cantidad = int.options.getInteger("cantidad"), puntosMiembro = dataSP ? dataSP.miembros.some(s => s.id == miembro.id) ? dataSP.miembros.find(f => f.id == miembro.id).puntos : 0 : 0

            let erroresP = [
                { condicion: !int.member.permissions.has('Administrator'), descripcion: `No tienes los permisos suficientes para ejecutar el comando.` },
                { condicion: miembro.id == client.user.id, descripcion: `El miembro proporcionado *(${miembro})* soy yo, yo no puedo utilizar el sistema de puntos.` },
                { condicion: miembro && miembro.user.bot, descripcion: `El miembro que has proporcionado *(${miembro})* es un bot, un bot no puede utilizar el sistema de puntos.` },
                { condicion: int.user.id != int.guild.ownerId && miembro.id == int.guild.ownerId, descripcion: `El miembro proporcionado *(${miembro})* es el dueño del servidor, no puedes agregarle puntos.` },
                { condicion: int.user.id != int.guild.ownerId && int.member.roles.highest.comparePositionTo(miembro.roles.highest) < 0, descripcion: `El rol mas alto del miembro proporcionado *(${miembro})* es igual o mayor a tu rol mas alto por lo tanto no le puedes agregar puntos.` },
                { condicion: cantidad <= 0, descripcion: `No puedes eliminar **0** puntos o un numero negativo de puntos a un miembro.` },
                { condicion: puntosMiembro <= -1000000000, descripcion: `El miembro ya tiene la máxima cantidad de puntos negativos por miembro la cual es ${dataSP ? dataSP.datos.emoji : emojis.puntos} **${(-1000000000).toLocaleString()}** puntos.` },
                { condicion: (puntosMiembro - cantidad) < -1000000000, descripcion: `La cantidad que has proporcionado excedería el limite de puntos negativos del miembro, puedes eliminar una cantidad igual o menor a **${(-1000000000 - puntosMiembro).toLocaleString()}** del miembro.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresInt(int, erroresP)) return;

            if (!cooldowns.has("/remove-points")) {
                cooldowns.set("/remove-points", new Collection())
            }
            const datosComando = cooldowns.get("/remove-points"), tiempoActual = Date.now()

            if (datosComando.has(int.user.id)) {
                const tiempoUltimo = datosComando.get(int.user.id) + 10000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando */remove-points*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return int.reply({ ephemeral: true, embeds: [embEnfriarse] })
            }

            int.deferReply()
            if (dataSP) {
                let objeto = dataSP.datos, array = dataSP.miembros
                objeto.comandosUsos++
                objeto.puntosEliminados += cantidad

                array.some(s => s.id == miembro.id) ? array.find(f => f.id == miembro.id).puntos -= cantidad : array.push({ id: miembro.id, nombre: miembro.user.tag, puntos: -cantidad })
                await puntosDB.findByIdAndUpdate(int.guildId, { datos: objeto, miembros: array })

            } else {
                let nuevaDataSP = new puntosDB({
                    _id: int.guildId,
                    serverName: int.guild.name,
                    datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: cantidad, rolesPersonal: [] },
                    miembros: [{ id: miembro.id, nombre: miembro.user.tag, puntos: -cantidad }]
                })
                await nuevaDataSP.save()
            }
            const embAddPoints = new EmbedBuilder()
                .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                .setDescription(`Se ${int.user.id == miembro.id ? "te" : "le"} han eliminado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos ${int.user.id == miembro.id ? "." : `a **${miembro}**.`}`)
                .setColor('Red')
                .setFooter({ text: miembro.id == int.user.id ? int.guild.name : miembro.nickname ? miembro.nickname : miembro.user.username, iconURL: miembro.id == int.user.id ? int.guild.iconURL() : miembro.user.displayAvatarURL() })
                .setTimestamp()
            setTimeout(async () => {
                await int.editReply({ embeds: [embAddPoints] })
            }, 500)

            datosComando.set(int.user.id, tiempoActual)
            setTimeout(() => {
                datosComando.delete(int.user.id)
            }, 10000)
        }
        if (int.commandName == "set-staff-role") {
            botDB.comandos.usos++
            let dataSP = await puntosDB.findById(int.guildId), rol = int.options.getRole("rol")

            let erroresP = [
                { condicion: !int.member.permissions.has('Administrator'), descripcion: `No tienes los permisos suficientes para ejecutar el comando.` },
                { condicion: rol.managed, descripcion: `El rol proporcionado *(${rol})* es exclusivo para un bot, proporciona otro rol.` },
                { condicion: rol.id == int.guildId, descripcion: `El rol proporcionado *(${rol})* el el rol @everyone un rol invisible que todos tienen, proporciona otro rol.` },
                { condicion: dataSP && dataSP.datos.rolesPersonal.length >= 3, descripcion: `Ya se han establecido **3** roles del personal de este servidor en el sistema de puntos, no puedes agregar mas roles.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresInt(int, erroresP)) return;

            if (!cooldowns.has("/set-staff-role")) {
                cooldowns.set("/set-staff-role", new Collection())
            }
            const datosComando = cooldowns.get("/set-staff-role"), tiempoActual = Date.now()

            if (datosComando.has(int.user.id)) {
                const tiempoUltimo = datosComando.get(int.user.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando */set-staff-role*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return int.reply({ ephemeral: true, embeds: [embEnfriarse] })
            }

            if (dataSP) {
                let objeto = dataSP.datos
                objeto.comandosUsos++
                objeto.rolesPersonal.push(rol.id)
                await puntosDB.findByIdAndUpdate(int.guildId, { datos: objeto })
            } else {
                let nuevaDataSP = new puntosDB({
                    _id: int.guildId,
                    serverName: int.guild.name,
                    datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [rol.id] },
                    miembros: [{ id: int.user.id, nombre: int.user.tag, puntos: 0 }]
                })
                await nuevaDataSP.save()
            }

            int.deferReply()
            const embStaffRol = new EmbedBuilder()
                .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                .setTitle(`${emojis.acierto} Rol del personal establecido`)
                .setDescription(`El rol ${rol} ha sido establecido como rol del personal del servidor en el sistema de puntos.`)
                .setColor('Green')
                .setFooter({ text: int.guild.name, iconURL: int.guild.iconURL() })
                .setTimestamp()
            setTimeout(async () => {
                await int.editReply({ embeds: [embStaffRol] })
            }, 500)

            datosComando.set(int.user.id, tiempoActual)
            setTimeout(() => {
                datosComando.delete(int.user.id)
            }, 60000)
        }
        if (int.commandName == "delete-staff-role") {
            botDB.comandos.usos++
            let dataSP = await puntosDB.findById(int.guildId), rol = int.options.getRole("rol")

            let erroresP = [
                { condicion: !int.member.permissions.has('Administrator'), descripcion: `No tienes los permisos suficientes para ejecutar el comando.` },
                { condicion: !dataSP, descripcion: `En este servidor no se ha utilizado el sistema de puntos por lo tanto no hay roles del personal del servidor establecidos que puedas eliminar.` },
                { condicion: dataSP.datos.rolesPersonal.length == 0, descripcion: `No hay roles establecidos como roles del personal del servidor en el sistema.` },
                { condicion: rol.managed, descripcion: `El rol proporcionado *(${rol})* es exclusivo para un bot por lo tanto no esta establecido como rol del personal de este servidor en el sistema.` },
                { condicion: rol.id == int.guildId, descripcion: `El rol proporcionado *(${rol})* es el rol @everyone un rol invisible que todos tienen ese rol no esta registrado en el sistema.` },
                { condicion: !dataSP.datos.rolesPersonal.some(s => s == rol.id), descripcion: `El rol proporcionado *(${rol})* no se encontró registrado en el sistema, utiliza el comando \`\`/point-system-status\`\` el cual te mostrara cuales son los role registrados en el sistema.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresInt(int, erroresP)) return;

            if (!cooldowns.has("/delete-staff-role")) {
                cooldowns.set("/delete-staff-role", new Collection())
            }
            const datosComando = cooldowns.get("/delete-staff-role"), tiempoActual = Date.now()

            if (datosComando.has(int.user.id)) {
                const tiempoUltimo = datosComando.get(int.user.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando */delete-staff-role*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return int.reply({ ephemeral: true, embeds: [embEnfriarse] })
            }

            if (dataSP) {
                let objeto = dataSP.datos
                objeto.comandosUsos++
                objeto.rolesPersonal.splice(objeto.rolesPersonal.findIndex(f => f == rol.id), 1)
                await puntosDB.findByIdAndUpdate(int.guildId, { datos: objeto })
            } else {
                let nuevaDataSP = new puntosDB({
                    _id: int.guildId,
                    serverName: int.guild.name,
                    datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [rol.id] },
                    miembros: [{ id: int.user.id, nombre: int.user.tag, puntos: 0 }]
                })
                await nuevaDataSP.save()
            }

            int.deferReply()
            const embStaffRol = new EmbedBuilder()
                .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                .setTitle(`${emojis.negativo} Se ha eliminado un rol`)
                .setDescription(`Se ha eliminado el rol ${rol} anterior mente establecido en el sistema como un rol del personal del servidor.`)
                .setColor('Red')
                .setFooter({ text: int.guild.name, iconURL: int.guild.iconURL() })
                .setTimestamp()
            setTimeout(async () => {
                await int.editReply({ embeds: [embStaffRol] })
            }, 500)

            datosComando.set(int.user.id, tiempoActual)
            setTimeout(() => {
                datosComando.delete(int.user.id)
            }, 60000)
        }
        if (int.commandName == "set-emoji-points") {
            botDB.comandos.usos++
            let dataSP = await puntosDB.findById(int.guildId), emoji = int.options.getString("emoji")

            let erroresP = [
                { condicion: !int.member.permissions.has('Administrator'), descripcion: `No tienes los permisos suficientes para ejecutar el comando.` },
                { condicion: !isNaN(emoji), descripcion: `No puedes establecer números como símbolo del sistema de puntos.` },
                { condicion: !/\p{Emoji}/gu.test(emoji), descripcion: `El argumento proporcionado *(${emoji})* no es un emoji.` },
                { condicion: ["<", ">"].some(s => emoji.includes(s)) ? !int.guild.emojis.cache.find(f => f.id == emoji.split(":")[2].substring(0, 18)) : false, descripcion: `El argumento proporcionado *(${emoji})* es un emoji de un servidor el cual no estoy por lo tanto no puedes establecerlo como símbolo del sistema.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresInt(int, erroresP)) return;

            if (!cooldowns.has("/delete-staff-role")) {
                cooldowns.set("/delete-staff-role", new Collection())
            }
            const datosComando = cooldowns.get("/delete-staff-role"), tiempoActual = Date.now()

            if (datosComando.has(int.user.id)) {
                const tiempoUltimo = datosComando.get(int.user.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando */delete-staff-role*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return int.reply({ ephemeral: true, embeds: [embEnfriarse] })
            }

            if (dataSP) {
                let objeto = dataSP.datos
                objeto.comandosUsos++
                objeto.emoji = emoji
                await puntosDB.findByIdAndUpdate(int.guildId, { serverName: int.guild.name, datos: objeto })

            } else {
                let nuevaDataSP = new puntosDB({
                    _id: int.guildId,
                    serverName: int.guild.name,
                    datos: { emoji: emoji, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [] },
                    miembros: [{ id: int.user.id, nombre: int.user.tag, puntos: 0 }]
                })
                await nuevaDataSP.save()
            }

            int.deferReply()
            const embSetEmoji = new EmbedBuilder()
                .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                .setTitle(`${emojis.acierto} Símbolo establecido`)
                .setDescription(`El emoji ${emoji} se a establecido como símbolo del sistema de puntos.`)
                .setColor('Green')
                .setFooter({ text: int.guild.name, iconURL: int.guild.iconURL() })
                .setTimestamp()
            setTimeout(async () => {
                await int.editReply({ embeds: [embSetEmoji] })
            }, 500)

            datosComando.set(int.user.id, tiempoActual)
            setTimeout(() => {
                datosComando.delete(int.user.id)
            }, 60000)
        }
        if (int.commandName == "remove-system-user") {
            botDB.comandos.usos++
            let dataSP = await puntosDB.findById(int.guildId), miembro = int.guild.members.cache.get(int.options.getUser("usuario").id), puntos = 0

            let erroresP = [
                { condicion: !int.member.permissions.has('Administrator'), descripcion: `No tienes los permisos suficientes para ejecutar el comando.` },
                { condicion: miembro.id == client.user.id, descripcion: `El miembro proporcionado *(${miembro})* soy yo, yo no puedo utilizar el sistema por lo tanto no estoy en el.` },
                { condicion: miembro.user.bot, descripcion: `El miembro proporcionado *(${miembro})* es un bot, un bot no puede utilizar el sistema de puntos.` },
                { condicion: int.user.id != int.guild.ownerId && miembro.id == int.user.id, descripcion: `El miembro proporcionado *(${miembro})* eres tu mismo, no te puedes eliminar a ti mismo del sistema.` },
                { condicion: int.user.id != int.guild.ownerId && miembro.id == int.guild.ownerId, descripcion: `El miembro proporcionado *(${miembro})* es el dueño del servidor, no lo puedes eliminar del sistema.` },
                { condicion: int.user.id != int.guild.ownerId && int.member.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, descripcion: `El miembro proporcionado *(${miembro})* tiene un rol igual o mayor que tu rol mas alto por lo tanto no lo puedes eliminar del sistema.` },
                { condicion: !dataSP, descripcion: `No se ha utilizado el sistema de puntos en este servidor por lo tanto ningún usuario esta registrado en el sistema.` },
                { condicion: !dataSP.miembros.some(s => s.id == miembro.id), descripcion: `El miembro proporcionado *(${miembro})* no esta en el sistema de puntos.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresInt(int, erroresP)) return;

            if (!cooldowns.has("/delete-staff-role")) {
                cooldowns.set("/delete-staff-role", new Collection())
            }
            const datosComando = cooldowns.get("/delete-staff-role"), tiempoActual = Date.now()

            if (datosComando.has(int.user.id)) {
                const tiempoUltimo = datosComando.get(int.user.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando */delete-staff-role*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return int.reply({ ephemeral: true, embeds: [embEnfriarse] })
            }

            let objeto = dataSP.datos, arrayM = dataSP.miembros
            puntos = arrayM.find(f => f.id == miembro.id).puntos
            objeto.comandosUsos++
            arrayM.splice(arrayM.findIndex(f => f.id == miembro.id), 1)
            await puntosDB.findByIdAndUpdate(int.guildId, { datos: objeto, miembros: arrayM })

            const embRemoveUserSystem = new EmbedBuilder()
                .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                .setTitle("🗑️ Miembro eliminado del sistema")
                .setDescription(`El miembro ${miembro} ha sido eliminado del sistema de puntos en el cual tenia ${dataSP.datos.emoji} **${puntos.toLocaleString()}** puntos.`)
                .setColor(int.guild.members.me.displayHexColor)
                .setTimestamp()
                .setFooter({ text: miembro.nickname ? miembro.nickname : miembro.user.username, iconURL: miembro.displayAvatarURL() })
            setTimeout(async () => {
                await int.editReply({ embeds: [embRemoveUserSystem] })
            }, 500)

            datosComando.set(int.user.id, tiempoActual)
            setTimeout(() => {
                datosComando.delete(int.user.id)
            }, 60000)
        }
        if (int.commandName == "points-leaderboard") {
            botDB.comandos.usos++
            let dataSP = await puntosDB.findById(int.guildId), ordenPs = dataSP.miembros.filter(f => client.users.cache.get(f.id)).sort((a, b) => b.puntos - a.puntos), top = []

            let erroresP = [
                { condicion: dataSP && !dataSP.datos.rolesPersonal.some(s => int.member.roles.cache.has(s)), descripcion: `No puedes utilizar este comando ya que no eres miembro del personal del servidor.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresInt(int, erroresP)) return;

            if (dataSP) {
                let objeto = dataSP.datos
                objeto.comandosUsos++
                await puntosDB.findByIdAndUpdate(int.guildId, { datos: objeto })

                for (let i in ordenPs) {
                    let usuario = client.users.cache.get(ordenPs[i].id)
                    if (int.user.id == usuario.id) {
                        top.push(`**${Number(i) == 0 ? "🥇" : Number(i) == 1 ? "🥈" : Number(i) == 2 ? "🥉" : Number(i) + 1}. [${usuario.tag}](${usuario.displayAvatarURL({  format: "png" || "gif", size: 4096 })}) - ${dataSP.datos.emoji} ${ordenPs[i].puntos}**\n<@${usuario.id}>`)
                    } else {
                        top.push(`**${Number(i) == 0 ? "🥇" : Number(i) == 1 ? "🥈" : Number(i) == 2 ? "🥉" : Number(i) + 1}.** [${usuario.tag}](${usuario.displayAvatarURL({  format: "png" || "gif", size: 4096 })}) - ${dataSP.datos.emoji} **${ordenPs[i].puntos}**\n<@${usuario.id}>`)
                    }
                }

                let segPage = 0, descripcion = `Total de miembros que han utilizado el sistema: **${ordenPs.length}**\n\n`
                if (String(ordenPs.length).slice(-1) === "0") {
                    segPage = Math.floor(ordenPs.length / 10)
                } else {
                    segPage = Math.floor(ordenPs.length / 10 + 1)
                }

                int.deferReply()
                if (segPage <= 1) {
                    const embTopP = new EmbedBuilder()
                        .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                        .setDescription(descripcion + top.slice(0, 10).join("\n\n"))
                        .setColor(int.guild.members.me.displayHexColor)
                        .setFooter({ text: `Pagina - 1/${segPage}`, iconURL: int.guild.iconURL() })
                        .setTimestamp()
                    setTimeout(async () => {
                        await int.editReply({ embeds: [embTopP] })
                    }, 500)
                } else {
                    let cps1 = 0, cps2 = 10, pagina = 1

                    const embTopP = new EmbedBuilder()
                        .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                        .setDescription(descripcion + top.slice(cps1, cps2).join("\n\n"))
                        .setColor(int.guild.members.me.displayHexColor)
                        .setFooter({ text: `Pagina - ${pagina}/${segPage}`, iconURL: int.guild.iconURL() })
                        .setTimestamp()

                    const botones1 = new ActionRowBuilder()
                        .setComponents(
                            [
                                new ButtonBuilder()
                                    .setCustomId("1")
                                    .setLabel("Anterior")
                                    .setEmoji("<a:LeftArrow:942155020017754132>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(true),
                           
                                new ButtonBuilder()
                                    .setCustomId("2")
                                    .setLabel("Siguiente ")
                                    .setEmoji("<a:RightArrow:942154978859044905>")
                                    .setStyle(ButtonStyle.Primary)
                            ]
                        )

                    const botones2 = new ActionRowBuilder()
                        .setComponents(
                            [
                                new ButtonBuilder()
                                    .setCustomId("1")
                                    .setLabel("Anterior")
                                    .setEmoji("<a:LeftArrow:942155020017754132>")
                                    .setStyle(ButtonStyle.Primary),
                            
                                new ButtonBuilder()
                                    .setCustomId("2")
                                    .setLabel("Siguiente")
                                    .setEmoji("<a:RightArrow:942154978859044905>")
                                    .setStyle(ButtonStyle.Primary)
                            ]
                        )

                    const botones3 = new ActionRowBuilder()
                        .setComponents(
                            [
                                new ButtonBuilder()
                                    .setCustomId("1")
                                    .setLabel("Anterior")
                                    .setEmoji("<a:LeftArrow:942155020017754132>")
                                    .setStyle(ButtonStyle.Primary),
                            
                                new ButtonBuilder()
                                    .setCustomId("2")
                                    .setLabel("Siguiente")
                                    .setEmoji("<a:RightArrow:942154978859044905>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(true)
                            ]
                        )

                    setTimeout(async () => {
                        await int.editReply({ embeds: [embTopP], components: [botones1] }).then(async msg => {
                            await int.channel.messages.fetch(msg.id, { force: true }).then(mensaje => {
                                const colector = mensaje.createMessageComponentCollector({ filter: u => u.user.id == int.user.id, time: segPage * 60000 })

                                setTimeout(() => {
                                    mensaje.edit({ embeds: [embTopP], components: [] }).catch(c => c)
                                }, segPage * 60000)

                                colector.on("collect", async bt => {
                                    if (bt.customId == "Si") {
                                        if (ttp2 - 10 <= 10) {
                                            ttp1 -= 10, ttp2 -= 10, pagina--

                                            embTopP
                                                .setDescription(descripcion + topC.slice(ttp1, ttp2).join("\n\n"))
                                                .setFooter({text: `Pagina ${pagina}/${segPage}`, iconURL: int.guild.iconURL()})
                                            await bt.update({ embeds: [embTopP], components: [botones2] })
                                        } else {
                                            ttp1 -= 10, ttp2 -= 10, pagina--

                                            embTopP
                                                .setDescription(descripcion + topC.slice(ttp1, ttp2).join("\n\n"))
                                                .setFooter({text: `Pagina ${pagina}/${segPage}`, iconURL: int.guild.iconURL()})
                                            await bt.update({ embeds: [embTopP], components: [botones1] })
                                        }
                                    }
                                    if (bt.customId == "No") {
                                        if (ttp2 + 10 >= ordenado.length) {
                                            ttp1 += 10, ttp2 += 10, pagina++

                                            embTopP
                                                .setDescription(descripcion + topC.slice(ttp1, ttp2).join("\n\n"))
                                                .setFooter({text: `Pagina ${pagina}/${segPage}`, iconURL: int.guild.iconURL()})
                                            await bt.update({ embeds: [embTopP], components: [botones3] })
                                        } else {
                                            ttp1 += 10, ttp2 += 10, pagina++

                                            embTopP
                                                .setDescription(descripcion + topC.slice(ttp1, ttp2).join("\n\n"))
                                                .setFooter({text: `Pagina ${pagina}/${segPage}`, iconURL: int.guild.iconURL()})
                                            await bt.update({ embeds: [embTopP], components: [botones1] })
                                        }
                                    }
                                })
                            }).catch(ct => {
                                const embError = new EmbedBuilder()
                                    .setTitle(`${emojiError} Error`)
                                    .setDescription(`Lo ciento ha ocurrido un error y no se cual es el motivo.`)
                                    .setColor(colorErr)
                                int.editReply({ embeds: [embError], components: [] })
                            })
                        })
                    }, 500)
                }

            } else {
                const embSinRegistro = new EmbedBuilder()
                    .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                    .setDescription(`No se ha registrado ningún miembro de este servidor al sistema de puntos, para saber mas del sistema utiliza el comando \`\`/points-info\`\`.`)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({ text: int.guild.name, iconURL: int.guild.iconURL() })
                    .setTimestamp()
                setTimeout(async () => {
                    await int.editReply({ embeds: [embSinRegistro] })
                }, 500)
            }
        }
        if (int.commandName == "point-system-status") {
            botDB.comandos.usos++
            let dataSP = await puntosDB.findById(int.guildId)

            let erroresP = [
                { condicion: !dataSP, descripcion: `No tengo datos sobre el sistema de puntos en este servidor ya que no se a utilizado el sistema en este servidor.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresInt(int, erroresP)) return;

            let objeto = dataSP.datos
            objeto.comandosUsos++
            await puntosDB.findByIdAndUpdate(int.guildId, { datos: objeto })
            let totalPuntos = dataSP.datos.puntosAgregados + dataSP.datos.puntosEliminados

            await int.deferReply()
            const embPointsSystem = new EmbedBuilder()
                .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                .setTitle(`<:status:957353077650886716> Estado del sistema de puntos`)
                .setFields(
                    { name: `👥 **Miembros que han utilizado el sistema:**`, value: `**${dataSP.miembros.length.toLocaleString()}**`, inline: true },
                    { name: `🔢 **Comandos del sistema usados:**`, value: `**${dataSP.datos.comandosUsos.toLocaleString()}**`, inline: true },
                    { name: `${dataSP.datos.emoji} **Puntos agregados y eliminados:** ${totalPuntos.toLocaleString()}`, value: `${totalPuntos >= 1 ? `Agregados: **${dataSP.datos.puntosAgregados}** | ${(dataSP.datos.puntosAgregados * 100 / totalPuntos).toFixed(2)}%\nEliminados: **${dataSP.datos.puntosEliminados}** | ${(dataSP.datos.puntosEliminados * 100 / totalPuntos).toFixed(2)}%` : "*No se ha agregado ni eliminado ningún punto*"}`, inline: true },
                    { name: `❓ **Símbolo del sistema:**`, value: `${dataSP.datos.emoji == emojis.puntos ? `*Predeterminado: ${emojis.puntos}*` : `Personalizado: ${dataSP.datos.emoji}`}`, inline: true },
                    { name: `👮 **Roles del personal:** ${dataSP.datos.rolesPersonal.length >= 1 ? dataSP.datos.rolesPersonal.length : ""}`, value: `${dataSP.datos.rolesPersonal.length >= 1 ? dataSP.datos.rolesPersonal.map(m => `<@&${m}>`).join(", ") : `*Sin roles*`}`, inline: true },
                    // {name: ``, value: ``, inline: true},
                )
                .setColor(int.guild.members.me.displayHexColor)
                .setFooter({ text: int.guild.name, iconURL: int.guild.iconURL() })
            setTimeout(async () => {
                await int.editReply({ embeds: [embPointsSystem] })
            }, 500)
        }
        if (int.commandName == "update-points-system") {
            botDB.comandos.usos++
            let dataSP = await puntosDB.findById(int.guildId), objeto = dataSP.datos, arrayMs = dataSP ? dataSP.miembros : [], falsosMiembros = dataSP ? arrayMs.filter(f => !int.guild.members.cache.get(f.id)) : false

            let erroresP = [
                { condicion: !int.member.permissions.has('Administrator'), descripcion: `No tienes los permisos suficientes para ejecutar el comando.` },
                { condicion: !dataSP, descripcion: `No se ha utilizado el sistema en este servidor por lo tanto no hay usuarios que eliminar.` },
                { condicion: falsosMiembros.length <= 0, descripcion: `No hay usuarios en el sistema que no estén en el servidor.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresInt(int, erroresP)) return;

            objeto.comandosUsos++
            arrayMs.forEach((valorMs, psMs) => {
                if (falsosMiembros.some(s => s.id == valorMs.id)) {
                    arrayMs.splice(psMs, 1)
                }
            })
            await puntosDB.findByIdAndUpdate(int.guildId, { datos: objeto, miembros: arrayMs })

            int.deferReply()
            const embUpdateSistemP = new EmbedBuilder()
                .setAuthor({ name: int.member.nick ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                .setTitle(`${emojis.acierto} Sistema actualizado`)
                .setDescription(`Se han eliminado datos de **${falsosMiembros.length.toLocaleString()}** usuarios que no se encontraron en el servidor.`)
                .setColor(int.guild.members.me.displayHexColor)
                .setFooter({ text: int.guild.name, iconURL: int.guild.iconURL() })
                .setTimestamp()
            setTimeout(() => {
                int.editReply({ embeds: [embUpdateSistemP] })
            }, 500)
        }
    }

    if (int.isButton()) {
        if (int.customId == "advertencias") {
            int.deferUpdate()
            let dataHis = await historialesDB.findById(client.user.id), hisBotDB = botDB.historial.find(f => f.mensajeID == int.message.id), usuario = dataHis.usuarios.find(f => f.id == hisBotDB.miembroID), servidor = usuario.servidores.some(s => s.id == int.guildId) ? usuario.servidores.find(f => f.id == int.guildId) : undefined
            let miembro = int.guild.members.cache.get(hisBotDB.miembroID), historial = [], descripcion = "", cantidad = 0

            function condicionText(parTexto) {
                if (historial[cantidad].length < 1900 && (historial[cantidad].length + parTexto.length) < 1900) {
                    historial[cantidad] = historial[cantidad].concat(parTexto)
                } else {
                    historial.push(parTexto)
                    cantidad++
                }
            }

            async function elseContenido(usSv) {
                let servidor = client.guilds.cache.get(usSv.id)
                if (historial.length >= 1) {
                    let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({  format: "png" || "gif", size: 2048 })}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                    condicionText(tituloSv)
                } else {
                    historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({  format: "png" || "gif", size: 2048 })}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                }
            }

            if (usuario.servidores.some(s => s.id == int.guildId)) {
                if (servidor.advertencias.length > 0) {
                    let svsAdv = usuario.servidores.filter(f => f.advertencias.length > 0 && f.id != int.guildId).length
                    descripcion = svsAdv >= 1 ? miembro.id == int.user.id ? `${miembro} tienes **${servidor.advertencias.length}** advertencias en este servidor y en otros **${svsAdv}** servidores tambien tienes y son las siguientes.\n\n` : `El miembro ${miembro} tiene **${servidor.advertencias.length}** advertencias en este servidor y en otros **${svsAdv}** servidores tambien tiene y son las siguientes.\n\n` : miembro.id == int.user.id ? `${miembro} solo tienes **${servidor.advertencias.length}** advertencias en este servidor, las cuales son las siguientes.\n\n` : `El miembro ${miembro} solo tiene **${servidor.advertencias.length}** advertencias en este servidor, las cuales son las siguientes.\n\n`

                    historial.push(`<:wer:920166217086537739> **Servidor:** [${int.guild.name}](${int.guild.iconURL({  format: "png" || "gif", size: 2048 })}) **|** ${int.guild.members.cache.size.toLocaleString()} miembros\n\n`)
                    for (let i = 0; i < servidor.advertencias.length; i++) {
                        let moderador = await client.users.fetch(servidor.advertencias[i].autor, { force: true })
                        let texto = `**${i + 1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${servidor.advertencias[i].tiempo}:F> *(<t:${servidor.advertencias[i].tiempo}:R>)*\n📄 Por la razón:\n*${servidor.advertencias[i].razon}*\n`
                        condicionText(texto)
                    }
                    for (let usSv of usuario.servidores) {
                        if (usSv.advertencias.length >= 1 && usSv.id != int.guildId) {
                            elseContenido(usSv)
                            for (let a = 0; a < usSv.advertencias.length; a++) {
                                let moderador = await client.users.fetch(usSv.advertencias[a].autor, { force: true })
                                let texto = `**${a + 1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${usSv.advertencias[a].tiempo}:F> *(<t:${usSv.advertencias[a].tiempo}:R>)*\n📄 Por la razón:\n*${usSv.advertencias[a].razon}*\n`
                                condicionText(texto)
                            }
                        }
                    }
                } else {
                    let svsAdv = usuario.servidores.filter(f => f.advertencias.length > 0).length
                    descripcion = svsAdv >= 1 ? miembro.id == int.user.id ? `${miembro} no tienes advertencias en este servidor pero en otros **${svsAdv}** servidores si tienes y son las siguientes.\n\n` : `El miembro ${miembro} no tiene advertencias en este servidor pero en otros **${svsAdv}** servidores si tiene y son las siguientes.\n\n` : null
                    for (let usSv of usuario.servidores) {
                        if (usSv.advertencias.length >= 1) {
                            elseContenido(usSv)
                            for (let a = 0; a < usSv.advertencias.length; a++) {
                                let moderador = await client.users.fetch(usSv.advertencias[a].autor, { force: true })
                                let texto = `**${a + 1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${usSv.advertencias[a].tiempo}:F> *(<t:${usSv.advertencias[a].tiempo}:R>)*\n📄 Por la razón:\n*${usSv.advertencias[a].razon}*\n`
                                condicionText(texto)
                            }
                        }
                    }
                }
            } else {
                let svsAdv = usuario.servidores.filter(f => f.advertencias.length > 0).length
                descripcion = svsAdv >= 1 ? miembro.id == int.user.id ? `${miembro} no tienes advertencias en este servidor pero en otros **${svsAdv}** servidores si tienes y son las siguientes.\n\n` : `El miembro ${miembro} no tiene advertencias en este servidor pero en otros **${svsAdv}** servidores si tiene y son las siguientes.\n\n` : null
                for (let usSv of usuario.servidores) {
                    if (usSv.advertencias.length >= 1) {
                        elseContenido(usSv)
                        for (let a = 0; a < usSv.advertencias.length; a++) {
                            let moderador = await client.users.fetch(usSv.advertencias[a].autor, { force: true })
                            let texto = `**${a + 1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${usSv.advertencias[a].tiempo}:F> *(<t:${usSv.advertencias[a].tiempo}:R>)*\n📄 Por la razón:\n*${usSv.advertencias[a].razon}*\n`
                            condicionText(texto)
                        }
                    }
                }
            }

            let totalPag = historial.length
            const embHistorial = new EmbedBuilder()
                .setAuthor({ name: int.member.nickname ? int.member.nickname : int.user.username, iconURL: int.user.displayAvatarURL() })
                .setTitle(`<:advertencia:929204500739268608> Advertencias`)
                .setColor(int.guild.members.me.displayHexColor)
                .setFooter({text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: 1/${totalPag}`, iconURL: miembro.displayAvatarURL()})
                .setTimestamp()
            if (historial.length <= 1) {
                embHistorial
                    .setDescription(descripcion + historial.slice(0, 1))
                int.channel.messages.fetch(hisBotDB.mensajeID, { force: true }).then(mensaje => {
                    mensaje.edit({ embeds: [embHistorial], components: [] })
                }).catch(c => {
                    console.log("No se pudo editar el mensaje.")
                })
            } else {
                const botones = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente ")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Primary)
                        ]
                    )

                let hi1 = 0, hi2 = 1, pagina = 1
                embHistorial
                    .setDescription(descripcion + historial.slice(hi1, hi2))

                await int.channel.messages.fetch(hisBotDB.mensajeID, { force: true }).then(mensaje => {
                    mensaje.edit({ embeds: [embHistorial], components: [botones] })
                    let filtro = i => i.user.id == int.user.id
                    const colector = mensaje.createMessageComponentCollector({ filter: filtro, time: 4 * 60000 })

                    setTimeout(() => {
                        mensaje.edit({ embeds: [embHistorial], components: [] })
                    }, 4 * 60000)

                    colector.on("collect", async botn => {
                        if (botn.customId == "1") {
                            if (hi2 - 1 <= 1) {
                                hi1--, hi2--, pagina--

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL()})
                                botones.components[0].data.style = ButtonStyle.Secondary
                                botones.components[0].data.disabled = true
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embHistorial], components: [botones] })

                            } else {
                                hi1--, hi2--, pagina--

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL()})
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embHistorial], components: [botones] })
                            }
                        }
                        if (botn.customId == "2") {
                            if (hi2 + 1 >= totalPag) {
                                hi1++, hi2++, pagina++

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL()})
                                botones.components[0].data.disabled = false
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[1].data.style = ButtonStyle.Secondary
                                botones.components[1].data.disabled = true
                                await botn.update({ embeds: [embHistorial], components: [botones] })

                            } else {
                                hi1++, hi2++, pagina++

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL()})
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embHistorial], components: [botones] })
                            }
                        }
                    })
                }).catch(c => {
                    console.log("Error al intentar obtener el mensaje")
                })
            }
        }// 334 a 182
        if (int.customId == "aislamientos") {
            int.deferUpdate()
            let dataHis = await historialesDB.findById(client.user.id), hisBotDB = botDB.historial.find(f => f.mensajeID == int.message.id), usuario = dataHis.usuarios.find(f => f.id == hisBotDB.miembroID), servidor = usuario.servidores.some(s => s.id == int.guildId) ? usuario.servidores.find(f => f.id == int.guildId) : undefined
            let miembro = int.guild.members.cache.get(hisBotDB.miembroID), descripcion = "", historial = [], cantidad = 0

            function condicionText(parTexto) {
                if (historial[cantidad].length < 1900 && (historial[cantidad].length + parTexto.length) < 1900) {
                    historial[cantidad] = historial[cantidad].concat(parTexto)
                } else {
                    historial.push(parTexto)
                    cantidad++
                }
            }

            async function elseContenido(usSv) {
                let servidor = client.guilds.cache.get(usSv.id)
                if (historial.length >= 1) {
                    let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({  format: "png" || "gif", size: 2048 })}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`
                    condicionText(tituloSv)
                } else {
                    historial.push(`<:wer:920166217086537739> **Servidor:** [${servidor.name}](${servidor.iconURL({  format: "png" || "gif", size: 2048 })}) **|** ${servidor.members.cache.size.toLocaleString()} miembros\n\n`)
                }
            }

            if (usuario.servidores.some(s => s.id == int.guildId)) {
                if (servidor.aislamientos.length > 0) {
                    let svsAis = usuario.servidores.filter(f => f.aislamientos.length > 0 && f.id != int.guildId).length
                    descripcion = svsAis >= 1 ? miembro.id == int.user.id ? `${miembro} tienes **${servidor.aislamientos.length}** aislamientos en este servidor y en otros **${svsAis}** servidores tambien tienes y son los siguientes.\n\n` : `El miembro ${miembro} tiene **${servidor.aislamientos.length}** aislamientos en este servidor y en otros **${svsAis}** servidores tambien tiene y son los siguientes.\n\n` : miembro.id == int.user.id ? `${miembro} solo tienes **${servidor.aislamientos.length}** aislamientos en este servidor, las cuales son los siguientes.\n\n` : `El miembro ${miembro} solo tiene **${servidor.aislamientos.length}** aislamientos en este servidor, las cuales son los siguientes.\n\n`
                    historial.push(`<:wer:920166217086537739> **Servidor:** [${int.guild.name}](${int.guild.iconURL({  format: "png" || "gif", size: 2048 })}) **|** ${int.guild.members.cache.size.toLocaleString()} miembros\n\n`)
                    for (let i = 0; i < servidor.aislamientos.length; i++) {
                        let moderador = await client.user.fetch(servidor.aislamientos[i].autor, { force: true })
                        let texto = `**${i + 1}.** 👮 Aislado temporalmente por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${servidor.aislamientos[i].tiempo}:F> *(<t:${servidor.aislamientos[i].tiempo}:R>)*\n<:aislacion:947965052772814848> Durante ${servidor.aislamientos[i].aislamiento}\n📄 Por la razón:\n*${servidor.aislamientos[i].razon}*\n`
                        condicionText(texto)
                    }
                    for (let usSv of usuario.servidores) {
                        if (usSv.aislamientos.length >= 1 && usSv.id != int.guildId) {
                            elseContenido(usSv)
                            for (let a = 0; a < usSv.aislamientos.length; a++) {
                                let moderador = await client.user.fetch(servidor.aislamientos[a].autor, { force: true })
                                let texto = `**${a + 1}.** 👮 Aislado temporalmente por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${usSv.aislamientos[a].tiempo}:F> *(<t:${usSv.aislamientos[a].tiempo}:R>)*\n<:aislacion:947965052772814848> Durante ${servidor.aislamientos[a].aislamiento}\n📄 Por la razón:\n*${servidor.aislamientos[a].razon}*\n`
                                condicionText(texto)
                            }
                        }
                    }

                } else {
                    let svsAis = usuario.servidores.filter(f => f.aislamientos.length > 0).length
                    descripcion = svsAis >= 1 ? miembro.id == int.user.id ? `${miembro} no tienes aislamientos en este servidor pero en otros **${svsAis}** servidores si tienes y son los siguientes.\n\n` : `El miembro ${miembro} no tiene aislamientos en este servidor pero en otros **${svsAis}** servidores si tiene y son los siguientes.\n\n` : null
                    for (let usSv of usuario.servidores) {
                        if (usSv.aislamientos.length >= 1) {
                            elseContenido(usSv)
                            for (let a = 0; a < usSv.aislamientos.length; a++) {
                                let moderador = await client.user.fetch(servidor.aislamientos[a].autor, { force: true })
                                let texto = `**${a + 1}.** 👮 Aislado temporalmente por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${usSv.aislamientos[a].tiempo}:F> *(<t:${usSv.aislamientos[a].tiempo}:R>)*\n<:aislacion:947965052772814848> Durante ${servidor.aislamientos[a].aislamiento}\n📄 Por la razón:\n*${servidor.aislamientos[a].razon}*\n`
                                condicionText(texto)
                            }
                        }
                    }
                }
            } else {
                let svsAis = usuario.servidores.filter(f => f.aislamientos.length > 0).length
                descripcion = svsAis >= 1 ? miembro.id == int.user.id ? `${miembro} no tienes aislamientos en este servidor pero en otros **${svsAis}** servidores si tienes y son los siguientes.\n\n` : `El miembro ${miembro} no tiene aislamientos en este servidor pero en otros **${svsAis}** servidores si tiene y son los siguientes.\n\n` : null
                for (let usSv of usuario.servidores) {
                    if (usSv.aislamientos.length >= 1) {
                        elseContenido(usSv)
                        for (let a = 0; a < usSv.aislamientos.length; a++) {
                            let moderador = await client.user.fetch(usSv.aislamientos[a].autor, { force: true })
                            let texto = `**${a + 1}.** 👮 Aislado temporalmente por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${usSv.aislamientos[a].tiempo}:F> *(<t:${usSv.aislamientos[a].tiempo}:R>)*\n<:aislacion:947965052772814848> Durante ${usSv.aislamientos[a].aislamiento}\n📄 Por la razón:\n*${usSv.aislamientos[a].razon}*\n`
                            condicionText(texto)
                        }
                    }
                }
            }

            let totalPag = historial.length
            const embHistorial = new EmbedBuilder()
                .setAuthor({name: int.member.nickname || int.user.username, iconURL: int.user.displayAvatarURL()})
                .setTitle(`<:aislacion:947965052772814848> Aislamientos`)
                .setColor(int.guild.members.me.displayHexColor)
                .setFooter({text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: 1/${totalPag}`, iconURL: miembro.displayAvatarURL()})
                .setTimestamp()
            if (historial.length <= 1) {
                embHistorial
                    .setDescription(descripcion + historial.slice(0, 1))
                int.channel.messages.fetch(hisBotDB.mensajeID, { force: true }).then(mensaje => {
                    mensaje.edit({ embeds: [embHistorial], components: [] })
                }).catch(c => {
                    console.log("No se pudo editar el mensaje.")
                })
            } else {
                const botones = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente ")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Primary)
                        ]
                    )

                let hi1 = 0, hi2 = 1, pagina = 1
                embHistorial
                    .setDescription(descripcion + historial.slice(hi1, hi2))

                await int.channel.messages.fetch(hisBotDB.mensajeID, { force: true }).then(mensaje => {
                    mensaje.edit({ embeds: [embHistorial], components: [botones] })
                    let filtro = i => i.user.id === int.user.id
                    const colector = mensaje.createMessageComponentCollector({ filter: filtro, time: 4 * 60000 })

                    setTimeout(() => {
                        mensaje.edit({ embeds: [embHistorial], components: [] })
                    }, 4 * 60000)

                    colector.on("collect", async botn => {
                        if (botn.customId == "1") {
                            if (hi2 - 1 <= 1) {
                                hi1--, hi2--, pagina--

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({ text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL() })
                                botones.components[0].data.style = ButtonStyle.Secondary
                                botones.components[0].data.disabled = true
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embHistorial], components: [botones] })

                            } else {
                                hi1--, hi2--, pagina--

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({ text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL() })
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embHistorial], components: [botones] })
                            }
                        }
                        if (botn.customId == "2") {
                            if (hi2 + 1 >= totalPag) {
                                hi1++, hi2++, pagina++

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({ text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL() })
                                botones.components[0].data.disabled = false
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[1].data.style = ButtonStyle.Secondary
                                botones.components[1].data.disabled = true
                                await botn.update({ embeds: [embHistorial], components: [botones] })

                            } else {
                                hi1++, hi2++, pagina++

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({ text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL() })
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embHistorial], components: [botones] })
                            }
                        }
                    })
                }).catch(c => {
                    console.log("Error al intentar obtener el mensaje")
                })
            }
        }// 339 a 183
        if (int.customId == "expulsiones") {
            int.deferUpdate()
            let dataHis = await historialesDB.findById(client.user.id), hisBotDB = botDB.historial.find(f => f.mensajeID == int.message.id), usuario = dataHis.usuarios.find(f => f.id == hisBotDB.miembroID), servidor = usuario.servidores.some(s => s.id == int.guildId) ? usuario.servidores.find(f => f.id == int.guildId) : undefined
            let miembro = int.guild.members.cache.get(hisBotDB.miembroID), historial = [], descripcion = "", cantidad = 0

            function condicionText(parTexto) {
                if (historial[cantidad].length < 1900 && (historial[cantidad].length + parTexto.length) < 1900) {
                    historial[cantidad] = historial[cantidad].concat(parTexto)
                } else {
                    historial.push(parTexto)
                    cantidad++
                }
            }

            async function elseContenido(usSv) {
                let servidorC = client.guilds.cache.get(usSv.id)
                if (historial.length >= 1) {
                    let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidorC.name}](${servidorC.iconURL({  format: "png" || "gif", size: 2048 })}) **|** ${servidorC.members.cache.size.toLocaleString()} miembros\n\n`
                    condicionText(tituloSv)
                } else {
                    historial.push(`<:wer:920166217086537739> **Servidor:** [${servidorC.name}](${servidorC.iconURL({  format: "png" || "gif", size: 2048 })}) **|** ${servidorC.members.cache.size.toLocaleString()} miembros\n\n`)
                }
            }

            if (usuario.servidores.some(s => s.id === int.guildId)) {
                if (servidor.expulsiones.length > 0) {
                    let svsExp = usuario.servidores.filter(f => f.expulsiones.length > 0 && f.id != int.guildId).length
                    descripcion = svsExp >= 1 ? miembro.id == int.user.id ? `${miembro} tienes **${servidor.expulsiones.length}** expulsiones en este servidor y en otros **${svsExp}** servidores tambien tienes y son las siguientes.\n\n` : `El miembro ${miembro} tiene **${servidor.expulsiones.length}** expulsiones en este servidor y en otros **${svsExp}** servidores tambien tiene y son las siguientes.\n\n` : miembro.id == int.user.id ? `${miembro} solo tienes **${servidor.expulsiones.length}** expulsiones en este servidor, las cuales son las siguientes.\n\n` : `El miembro ${miembro} solo tiene **${servidor.expulsiones.length}** expulsiones en este servidor, las cuales son las siguientes.\n\n`
                    historial.push(`<:wer:920166217086537739> **Servidor:** [${int.guild.name}](${int.guild.iconURL({  format: "png" || "gif", size: 2048 })}) **|** ${int.guild.members.cache.size.toLocaleString()} miembros\n\n`)
                    for (let i = 0; i < servidor.expulsiones.length; i++) {
                        let moderador = await client.users.fetch(servidor.expulsiones[i].autor, { force: true })
                        let texto = `**${i + 1}.** 👮 Expulsado por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${servidor.expulsiones[i].tiempo}:F> *(<t:${servidor.expulsiones[i].tiempo}:R>)*\n📄 Por la razón:\n*${servidor.expulsiones[i].razon}*\n`
                        condicionText(texto)
                    }
                    for (let usSv of usuario.servidores) {
                        if (usSv.expulsiones.length >= 1 && usSv.id != int.guildId) {
                            elseContenido(usSv)
                            for (let a = 0; a < usSv.expulsiones.length; a++) {
                                let moderador = await client.users.fetch(usSv.expulsiones[a].autor, { force: true })
                                let texto = `**${a + 1}.** 👮 Expulsado por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${usSv.expulsiones[a].tiempo}:F> *(<t:${usSv.expulsiones[a].tiempo}:R>)*\n📄 Por la razón:\n*${usSv.expulsiones[a].razon}*\n`
                                condicionText(texto)
                            }
                        }
                    }

                } else {
                    let svsExp = usuario.servidores.filter(f => f.expulsiones.length > 0).length
                    descripcion = svsExp >= 1 ? miembro.id == int.user.id ? `${miembro} no tienes expulsiones en este servidor pero en otros **${svsExp}** servidores si tienes y son las siguientes.\n\n` : `El miembro ${miembro} no tiene expulsiones en este servidor pero en otros **${svsExp}** servidores si tiene y son las siguientes.\n\n` : null
                    for (let usSv of usuario.servidores) {
                        if (usSv.expulsiones.length >= 1) {
                            elseContenido(usSv)
                            for (let a = 0; a < usSv.expulsiones.length; a++) {
                                let moderador = await client.users.fetch(usSv.expulsiones[a].autor, { force: true })
                                let texto = `**${a + 1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${usSv.expulsiones[a].tiempo}:F> *(<t:${usSv.expulsiones[a].tiempo}:R>)*\n📄 Por la razón:\n*${usSv.expulsiones[a].razon}*\n`
                                condicionText(texto)
                            }
                        }
                    }
                }
            } else {
                let svsExp = usuario.servidores.filter(f => f.expulsiones.length > 0).length
                descripcion = svsExp >= 1 ? miembro.id == int.user.id ? `${miembro} no tienes expulsiones en este servidor pero en otros **${svsExp}** servidores si tienes y son las siguientes.\n\n` : `El miembro ${miembro} no tiene expulsiones en este servidor pero en otros **${svsExp}** servidores si tiene y son las siguientes.\n\n` : null
                for (let usSv of usuario.servidores) {
                    if (usSv.expulsiones.length >= 1) {
                        elseContenido(usSv)
                        for (let a = 0; a < usSv.expulsiones.length; a++) {
                            let moderador = await client.users.fetch(usSv.expulsiones[a].autor, { force: true })
                            let texto = `**${a + 1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${usSv.expulsiones[a].tiempo}:F> *(<t:${usSv.expulsiones[a].tiempo}:R>)*\n📄 Por la razón:\n*${usSv.expulsiones[a].razon}*\n`
                            condicionText(texto)
                        }
                    }
                }
            }

            let totalPag = historial.length
            const embHistorial = new EmbedBuilder()
                .setAuthor({name: int.member.nickname || int.user.username, iconURL: int.user.displayAvatarURL()})
                .setTitle(`<:salir12:879519859694776360> Expulsiones`)
                .setColor(int.guild.members.me.displayHexColor)
                .setFooter({text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: 1/${totalPag}`, iconURL: miembro.displayAvatarURL()})
                .setTimestamp()
            if (historial.length <= 1) {
                embHistorial
                    .setDescription(descripcion + historial.slice(0, 1))
                int.channel.messages.fetch(hisBotDB.mensajeID, { force: true }).then(mensaje => {
                    mensaje.edit({ embeds: [embHistorial], components: [] })
                }).catch(c => {
                    console.log("No se pudo editar el mensaje.")
                })
            } else {
                const botones = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente ")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Primary)
                        ]
                    )

                let hi1 = 0, hi2 = 1, pagina = 1
                embHistorial
                    .setDescription(descripcion + historial.slice(hi1, hi2))

                await int.channel.messages.fetch(hisBotDB.mensajeID, { force: true }).then(mensaje => {
                    mensaje.edit({ embeds: [embHistorial], components: [botones] })
                    let filtro = i => i.user.id === int.user.id
                    const colector = mensaje.createMessageComponentCollector({ filter: filtro, time: 4 * 60000 })

                    setTimeout(() => {
                        mensaje.edit({ embeds: [embHistorial], components: [] })
                    }, 4 * 60000)

                    colector.on("collect", async botn => {
                        if (botn.customId === "1") {
                            if (hi2 - 1 <= 1) {
                                hi1--, hi2--, pagina--

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({ text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL() })
                                botones.components[0].data.style = ButtonStyle.Secondary
                                botones.components[0].data.disabled = true
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embHistorial], components: [botones] })
                            } else {
                                hi1--, hi2--, pagina--

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({ text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL() })
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embHistorial], components: [botones] })
                            }
                        }
                        if (botn.customId === "2") {
                            if (hi2 + 1 >= totalPag) {
                                hi1++, hi2++, pagina++

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({ text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL() })
                                botones.components[0].data.disabled = false
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[1].data.style = ButtonStyle.Secondary
                                botones.components[1].data.disabled = true
                                await botn.update({ embeds: [embHistorial], components: [botones] })
                            } else {
                                hi1++, hi2++, pagina++

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({ text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL() })
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embHistorial], components: [botones] })
                            }
                        }
                    })
                }).catch(c => {
                    console.log("Error al intentar obtener el mensaje")
                })
            }
        }// 324 a 178
        if (int.customId == "baneos") {
            int.deferUpdate()
            let dataHis = await historialesDB.findById(client.user.id), hisBotDB = botDB.historial.find(f => f.mensajeID == int.message.id), usuario = dataHis.usuarios.find(f => f.id == hisBotDB.miembroID), servidorDB = usuario.servidores.some(s => s.id == int.guildId) ? usuario.servidores.find(f => f.id == int.guildId) : undefined
            let miembro = int.guild.members.cache.get(hisBotDB.miembroID), historial = [], descripcion = "", cantidad = 0

            function condicionText(parTexto) {
                if (historial[cantidad].length < 1900 && (historial[cantidad].length + parTexto.length) < 1900) {
                    historial[cantidad] = historial[cantidad].concat(parTexto)
                } else {
                    historial.push(parTexto)
                    cantidad++
                }
            }

            async function elseContenido(usSv) {
                let servidorC = client.guilds.cache.get(usSv.id)
                if (historial.length >= 1) {
                    let tituloSv = `\n\n<:wer:920166217086537739> **Servidor:** [${servidorC.name}](${servidorC.iconURL({  format: "png" || "gif", size: 2048 })}) **|** ${servidorC.members.cache.size.toLocaleString()} miembros\n\n`
                    condicionText(tituloSv)
                } else {
                    historial.push(`<:wer:920166217086537739> **Servidor:** [${servidorC.name}](${servidorC.iconURL({  format: "png" || "gif", size: 2048 })}) **|** ${servidorC.members.cache.size.toLocaleString()} miembros\n\n`)
                }
            }

            if (usuario.servidores.some(s => s.id == int.guildId)) {
                if (servidorDB.baneos.length > 0) {
                    let svsBan = usuario.servidores.filter(f => f.baneos.length > 0 && f.id != int.guildId).length
                    descripcion = svsBan >= 1 ? miembro.id == int.user.id ? `${miembro} tienes **${servidorDB.baneos.length}** baneos en este servidor y en otros **${svsBan}** servidores tambien tienes y son los siguientes.\n\n` : `El miembro ${miembro} tiene **${servidorDB.baneos.length}** baneos en este servidor y en otros **${svsBan}** servidores tambien tiene y son los siguientes.\n\n` : miembro.id == int.user.id ? `${miembro} solo tienes **${servidorDB.baneos.length}** baneos en este servidor, las cuales son los siguientes.\n\n` : `El miembro ${miembro} solo tiene **${servidorDB.baneos.length}** baneos en este servidor, las cuales son los siguientes.\n\n`
                    historial.push(`<:wer:920166217086537739> **Servidor:** [${int.guild.name}](${int.guild.iconURL({  format: "png" || "gif", size: 2048 })}) **|** ${int.guild.members.cache.size.toLocaleString()} miembros\n\n`)
                    for (let i = 0; i < servidorDB.baneos.length; i++) {
                        let moderador = await client.users.fetch(servidorDB.baneos[i].autor, { force: true })
                        let texto = `**${i + 1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${servidorDB.baneos[i].tiempo}:F> *(<t:${servidorDB.baneos[i].tiempo}:R>)*\n📄 Por la razón:\n*${servidorDB.baneos[i].razon}*\n`
                        condicionText(texto)
                    }
                    for (let usSv of usuario.servidores) {
                        if (usSv.baneos.length >= 1 && usSv.id != int.guildId) {
                            elseContenido(usSv)
                            for (let a = 0; a < usSv.baneos.length; a++) {
                                let moderador = await client.users.fetch(usSv.baneos[a].autor, { force: true })
                                let texto = `**${a + 1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${usSv.baneos[a].tiempo}:F> *(<t:${usSv.baneos[a].tiempo}:R>)*\n📄 Por la razón:\n*${usSv.baneos[a].razon}*\n`
                                condicionText(texto)
                            }
                        }
                    }
                } else {
                    let svsBan = usuario.servidores.filter(f => f.baneos.length > 0).length
                    descripcion = svsBan >= 1 ? miembro.id == int.user.id ? `${miembro} no tienes baneos en este servidor pero en otros **${svsBan}** servidores si tienes y son los siguientes.\n\n` : `El miembro ${miembro} no tiene baneos en este servidor pero en otros **${svsBan}** servidores si tiene y son los siguientes.\n\n` : null
                    for (let usSv of usuario.servidores) {
                        if (usSv.baneos.length >= 1) {
                            elseContenido(usSv)
                            for (let a = 0; a < usSv.baneos.length; a++) {
                                let moderador = await client.users.fetch(usSv.baneos[a].autor, { force: true })
                                let texto = `**${a + 1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${usSv.baneos[a].tiempo}:F> *(<t:${usSv.baneos[a].tiempo}:R>)*\n📄 Por la razón:\n*${usSv.baneos[a].razon}*\n`
                                condicionText(texto)
                            }
                        }
                    }
                }
            } else {
                let svsBan = usuario.servidores.filter(f => f.baneos.length > 0).length
                descripcion = svsBan >= 1 ? miembro.id == int.user.id ? `${miembro} no tienes baneos en este servidor pero en otros **${svsBan}** servidores si tienes y son los siguientes.\n\n` : `El miembro ${miembro} no tiene baneos en este servidor pero en otros **${svsBan}** servidores si tiene y son los siguientes.\n\n` : null
                for (let usSv of usuario.servidores) {
                    if (usSv.baneos.length >= 1) {
                        elseContenido(usSv)
                        for (let a = 0; a < usSv.baneos.length; a++) {
                            let moderador = await client.users.fetch(usSv.baneos[a].autor, { force: true })
                            let texto = `**${a + 1}.** 👮 Advertido por [${moderador.tag}](${moderador.displayAvatarURL({  format: "png" || "gif", size: 2048 })})\n<:calendario:952037404561264661> El <t:${usSv.baneos[a].tiemp}:F> *(<t:${usSv.baneos[a].tiemp}:R>)*\n📄 Por la razón:\n*${usSv.baneos[a].razon}*\n`
                            condicionText(texto)
                        }
                    }
                }
            }

            let totalPag = historial.length
            const embHistorial = new EmbedBuilder()
                .setAuthor({name: int.member.nickname || int.user.username, iconURL: int.user.displayAvatarURL()})
                .setTitle(`⛔ Baneos`)
                .setColor(int.guild.members.me.displayHexColor)
                .setFooter({text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: 1/${totalPag}`, iconURL: miembro.displayAvatarURL()})
                .setTimestamp()
            if (historial.length <= 1) {
                embHistorial
                    .setDescription(descripcion + historial.slice(0, 1))
                int.channel.messages.fetch(hisBotDB.mensajeID, { force: true }).then(mensaje => {
                    mensaje.edit({ embeds: [embHistorial], components: [] })
                }).catch(c => {
                    console.log("No se pudo editar el mensaje.")
                })
            } else {
                const botones = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                       
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente ")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Primary)
                        ]
                    )

                let hi1 = 0, hi2 = 1, pagina = 1
                embHistorial
                    .setDescription(descripcion + historial.slice(hi1, hi2))

                await int.channel.messages.fetch(hisBotDB.mensajeID, { force: true }).then(mensaje => {
                    mensaje.edit({ embeds: [embHistorial], components: [botones] })
                    let filtro = i => i.user.id === int.user.id
                    const colector = mensaje.createMessageComponentCollector({ filter: filtro, time: 4 * 60000 })

                    setTimeout(() => {
                        mensaje.edit({ embeds: [embHistorial], components: [] })
                    }, 4 * 60000)

                    colector.on("collect", async botn => {
                        if (botn.customId == "1") {
                            if (hi2 - 1 <= 1) {
                                hi1--, hi2--, pagina--

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({ text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL() })
                                botones.components[0].data.style = ButtonStyle.Secondary
                                botones.components[0].data.disabled = true
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embHistorial], components: [botones] })
                            } else {
                                hi1--, hi2--, pagina--

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({ text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL() })
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embHistorial], components: [botones] })
                            }
                        }
                        if (botn.customId == "2") {
                            if (hi2 + 1 >= totalPag) {
                                hi1++, hi2++, pagina++

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({ text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL() })
                                botones.components[0].data.disabled = false
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[1].data.style = ButtonStyle.Secondary
                                botones.components[1].data.disabled = true
                                await botn.update({ embeds: [embHistorial], components: [botones] })
                            } else {
                                hi1++, hi2++, pagina++

                                embHistorial
                                    .setDescription(descripcion + historial.slice(hi1, hi2))
                                    .setFooter({ text: `${miembro.nickname ? miembro.nickname : miembro.user.tag} | Pagina: ${pagina}/${totalPag}`, iconURL: miembro.displayAvatarURL() })
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embHistorial], components: [botones] })
                            }
                        }
                    })
                }).catch(c => {
                    console.log("Error al intentar obtener el mensaje")
                })
            }
        }// 332 a 177
    }

    if (int.isSelectMenu()) {
        if (int.customId == "rolesColores") {
            let opciones = [
                { rolID: "985631910581653556", valor: "negro" },
                { rolID: "985631917330268201", valor: "cafe" },
                { rolID: "985631924619976806", valor: "rojo" },
                { rolID: "985631921184837673", valor: "naranja" },
                { rolID: "985631931595104276", valor: "amarillo" },
                { rolID: "985631934879244378", valor: "verde-claro" },
                { rolID: "985631938373116004", valor: "verde" },
                { rolID: "985631941665652757", valor: "cian" },
                { rolID: "985634743930454017", valor: "azul-claro" },
                { rolID: "985634749437587516", valor: "azul" },
                { rolID: "985634753048903770", valor: "morado" },
                { rolID: "985631927853785169", valor: "rosa" },
                { rolID: "985634755984908318", valor: "magenta" },
                { rolID: "985631914507518023", valor: "gris" },
                { rolID: "985634992317157456", valor: "blanco" },
            ]
            opciones.forEach((opcion, ps) => {
                if (int.values[0] == opcion.valor) {

                    if (opciones.some(s => int.member.roles.cache.has(s.rolID))) {
                        if (int.member.roles.cache.has(opcion.rolID)) {
                            const embYaTienesElRol = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Ya tienes el rol`)
                                .setDescription(`Ya tienes el rol **<@&${opcion.rolID}>**.`)
                                .setColor(ColorError)
                            int.reply({ ephemeral: true, embeds: [embYaTienesElRol] })

                        } else {
                            let rolesEliminar = opciones.filter(f => f.rolID != opcion.rolID && int.member.roles.cache.some(s => s.id == f.rolID)).map(m => m.rolID)
                            const embTienesUnRol = new EmbedBuilder()
                                .setTitle(`🔁 Cambio de roles`)
                                .setDescription(`Se te ${rolesEliminar.length == 1 ? "ha removido el rol" : "han removido los roles"} ${rolesEliminar.map(m => `**<@&${m}>**`).join(`, `)} y se te ha agregado el rol **<@&${opcion.rolID}>** ya que no puedes tener **2** o mas roles de colores.`)
                                .setColor(int.guild.members.me.displayHexColor)
                            rolesEliminar.map(m => int.member.roles.remove(m))
                            int.member.roles.add(opcion.rolID)
                            int.reply({ ephemeral: true, embeds: [embTienesUnRol] })
                        }

                    } else {
                        const embRolAgregado = new EmbedBuilder()
                            .setTitle(`${emojis.acierto} Rol agregado`)
                            .setDescription(`Se te ha agregado el rol **<@&${opcion.rolID}>**.`)
                            .setColor("#00ff00")
                        int.member.roles.add(opcion.rolID)
                        int.reply({ ephemeral: true, embeds: [embRolAgregado] })
                    }
                }
            })
        }
    }
})

client.on("guildMemberAdd", async gma => {
    if (gma.guild.id != "940034044819828767") return
    gma.roles.add("943666003349491752")
    const miServidor = client.guilds.cache.get("940034044819828767")
    const welcomeChannel = miServidor.channels.cache.get("940070775715672064")
    welcomeChannel.sendTyping()
    let imagen = "https://cdn.discordapp.com/attachments/967650956340756571/985667806915883081/estela_de_luces.jpg"
    const canvas = Canvas.createCanvas(1000, 500);
    const context = canvas.getContext("2d");
    const fondo = await Canvas.loadImage(imagen);

    context.drawImage(fondo, 0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#000000";
    context.strokeRect(0,0, canvas.width, canvas.height);

    context.beginPath();
    context.arc(500, 160, 145, 0, Math.PI * 2, true);
    context.fillStyle = `${miServidor.members.me.displayHexColor}`;
    context.stroke();
    context.fill();

    context.textAlign = "center"
    context.font = "80px MADE TOMMY"
    context.fillStyle = "#ffffff"
    context.fillText("Bienvenid@", 500, 375)

    context.font = '45px MADE TOMMY';
    context.fillStyle = '#ffffff';
    context.fillText(`${gma.user.tag}`, 500, 435);

    context.font = '38px MADE TOMMY'
    context.fillStyle = '#ffffff';
    context.fillText(`¡Disfruta del servidor!`, 500, 480);

    context.beginPath();
    context.arc(500, 160, 140, 0, Math.PI * 2, true);
    context.fillStyle = `${miServidor.members.me.displayHexColor}`;
    context.closePath();
    context.clip();

    const avatar = await Canvas.loadImage(gma.user.displayAvatarURL({format: "jpg", size: 2048}))
    context.drawImage(avatar, 360, 20, 280, 280);

    const finalImg = new AttachmentBuilder(canvas.toBuffer(), "imagen.png")

    let embBienvenida = new EmbedBuilder()
    .setAuthor({name: client.user.tag, iconURL: client.user.displayAvatarURL({dynamic: true})})
    .setImage(`attachment://imagen.png`)
    .setTitle("👋 ¡Bienvenido/a!")
    .setDescription(`🌈 Pasate por el canal <#940070777032675338> en el podrás obtener roles que cambiarán el color de tu nombre dentro del servidor.\n\n📏 También pásate por el canal <#940034044819828770> el canal de reglas, léelas para evitar sanciones.`)
    .setColor(miServidor.members.me.displayHexColor)
    .setFooter({text: `Bienvenido/a a ${miServidor.name}`, iconURL: miServidor.iconURL({dynamic: true})})
    .setTimestamp()
    welcomeChannel.send({embeds: [embBienvenida], files: [finalImg], content: `**¡Hola <@${gma.user.id}>!**`})
})

client.on("guildMemberRemove", async gmr => {
    dataAFK = await afkDB.findById(gmr.guild.id)
    if (dataAFK && dataAFK.miembros.some(s => s.id == gmr.user.id)) {
        let arrayMs = dataAFK.miembros
        arrayMs.splice(arrayMs.findIndex(f => f.id == gmr.user.id), 1)
        await afkDB.findByIdAndUpdate(gmr.guild.id, { miembros: arrayMs })
    }
})

function erroresMsg(tipo = false, errores = false) {
    try {
        if (!tipo) {
            throw new Error("No has establecido el tipo de elemento en la funcion errores.")
        }
        if (!errores) {
            throw new Error("No has establecido los errores del comando.")
        }

        for (error of errores) {
            const embError = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(error.descripcion)
                .setColor(ColorError)
            if (error.condicion) {
                setTimeout(() => {
                    tipo.reply({ allowedMentions: { repliedUser: false }, embeds: [embError] }).then(tm => setTimeout(() => {
                        tipo.delete().catch(t => t)
                        tm.delete().catch(t => t)
                    }, 30000))
                }, 500)
                return true
            }
        }
    } catch (error) {
        console.log(error)
    }
}
let guild = {
    id: '',
    channelId: ''
}
client.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    guild.id = msg.guildId
    guild.channelId = msg.channelId
    let dataPre = await prefijosDB.findById(client.user.id), dataAFK = await afkDB.findById(msg.guildId), prefijo = enviroment ? '|' : "u!"

    if ((!enviroment) && dataPre.servidores.some(s => s.id == msg.guildId)) {
        prefijo = dataPre.servidores.find(f => f.id == msg.guildId).prefijo
    }

    if (dataAFK) {
        if (dataAFK.miembros.some(s => s.id == msg.author.id)) {
            msg.channel.sendTyping()
            const embRemoveAFK = new EmbedBuilder()
                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                .setTitle("💤 Estado AFK removido")
                .setDescription(`${msg.author} tu estado AFK se a removido.`)
                .setColor(msg.guild.members.me.displayHexColor)
                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                .setTimestamp()

            if (dataAFK.miembros.find(f => f.id == msg.author.id).apodo == msg.author.username) {
                msg.member.setNickname(null, `Razón: el miembro ha eliminado su estado AFK.`).catch(c => {
                    return;
                })
                setTimeout(() => {
                    msg.reply({ embeds: [embRemoveAFK] }).then(ma => setTimeout(() => {
                        ma.delete().catch(c => {
                            return;
                        })
                    }, 10000))
                }, 500)

                for (let f = 0; f < dataAFK.miembros.length; f++) {
                    if (dataAFK.miembros[f].id == msg.author.id) {
                        dataAFK.miembros.splice(f, 1)
                        await dataAFK.save()
                    }
                }
            } else {
                msg.member.setNickname(dataAFK.miembros.find(f => f.id == msg.author.id).apodo, `Razón: el miembro ha eliminado su estado AFK.`).catch(c => {
                    return;
                })
                setTimeout(() => {
                    msg.reply({ embeds: [embRemoveAFK] }).then(ma => setTimeout(() => {
                        ma.delete().catch(c => {
                            return;
                        })
                    }, 10000))
                }, 500)

                for (let f = 0; f < dataAFK.miembros.length; f++) {
                    if (dataAFK.miembros[f].id == msg.author.id) {
                        dataAFK.miembros.splice(f, 1)
                        await dataAFK.save()
                    }
                }
            }
        }

        for (let i in dataAFK.miembros) {
            if (msg.mentions.members.some(s => s.id === dataAFK.miembros[i].id)) {
                msg.channel.sendTyping()
                const embAvisoAFK = new EmbedBuilder()
                    .setTitle("💤 AFK")
                    .setDescription(`<@${dataAFK.miembros[i].id}> se encuentra AFK desde <t:${dataAFK.miembros[i].tiempo}:R> por la razón \`\`${dataAFK.miembros[i].razon}\`\``)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setTimestamp()
                setTimeout(() => {
                    msg.reply({ embeds: [embAvisoAFK] })
                }, 500)
            }
        }
    }

    if (!msg.guild.members.me.permissionsIn(msg.channel).has('SendMessages')) return;
    
    if (msg.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
        msg.channel.sendTyping()
        const emb = new EmbedBuilder()
            .setAuthor({name: msg.author.username, iconURL: msg.author.displayAvatarURL()})
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(`Hola, soy **${client.user.username}** un Bot multi fundacional, tengo comandos de moderación, comandos informativos y sistemas como el sistema de inter promoción.`)
            .setDescription(`Usa el comando \`\`${prefijo}comandos\`\` para conocer todos mis comandos.\nMi prefijo en este servidor es: ${"``"}${prefijo}${"``"}\n[📨 **Invítame a tu servidor**](${invitacion})\n[🔧 **Servidor de soporte**](${serverSuport})`)
            .setColor(colorEmb)
            .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
            .setTimestamp()

        setTimeout(() => {
            msg.reply({ embeds: [emb] })
        }, 500)
    }

    if (msg.channelId == "940075586771111936") {
        // Boost/mejoras
        // MessageType.GuildBoostTier1
        let msgTypes = ["USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1", "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2", "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3"]
        if (msgTypes.concat("USER_PREMIUM_GUILD_SUBSCRIPTION").some(s => msg.type == s)) {
            const embBoost = new EmbedBuilder()
                .setTitle(`<a:BoostAnimado:931289485700911184> Nueva mejora ${msgTypes.some(s => msg.type == s) ? "y nuevo nivel" : ""}`)
                .setDescription(`¡**Gracias** ${msg.author} por la mejora!${msgTypes.some(s => msg.type == s) ? `, por tu mejora el servidor alcanzo el nivel **${msgTypes.findIndex(f => msg.type == f) + 1}**` : ""}`)
                .setColor(msg.member.displayHexColor)
            setTimeout(() => {
                msg.channel.send({ embeds: [embBoost], content: `<@${msg.author.id}>` }).then(mb => {
                    mb.pin()
                })
            }, 500)
        }

        let cantidad = Math.floor(Math.random() * 88) + 11
        if (msg.content.toLowerCase() == "hola" && cantidad >= 40 && cantidad <= 60) {
            msg.channel.sendTyping()
            setTimeout(() => {
                msg.reply("Hola")
            }, 600)
        }
        let xds = ["xd", "jaja", "jajaja", "sjsjs", "jsjs", "jiji", "XD", "Xd", "xD"]
        if (xds.some(s => s == msg.content.toLowerCase()) && cantidad >= 40 && cantidad <= 60) {
            msg.channel.sendTyping()
            setTimeout(() => {
                msg.channel.send(xds[Math.floor(Math.random() * xds.length)])
            }, 600)
        }
    }


    if (!msg.content.startsWith(prefijo)) return;
    const args = msg.content.slice(prefijo.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase()


    if (["help", "ayuda"].some(s => comando == s)) {
        msg.channel.sendTyping()
        botDB.comandos.usos++

        const embHelp = new EmbedBuilder()
            .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(`Hola, soy **${client.user.username}** un Bot multi funcional, tengo comandos de moderación, comandos informativos y sistemas como el sistema de puntos.`)
            .setDescription(`Usa el comando \`\`${prefijo}comandos\`\` para conocer todos mis comandos.\nMi prefijo en este servidor es: \`\`${prefijo}\`\`\n[📨 **Invítame a tu servidor**](${invitacion})\n[🔧 **Servidor de soporte**](${serverSuport})`)
            .setColor(colorEmb)
            .setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL()})
            .setTimestamp()

        setTimeout(() => {
            msg.reply({ embeds: [embHelp] })
        }, 500)
    }

    if (["comandos", "commands", "cmds"].some(s => comando == s)) {
        msg.channel.sendTyping()
        botDB.comandos.usos++
        const embComandos = new EmbedBuilder()
            .setAuthor({ name: msg.member.nickname ? msg.member.nickname : msg.author.tag, iconURL: msg.author.displayAvatarURL() })
            .setTitle("📑 Comandos")
            .setDescription(`Un **comando** es una orden/instrucción que les das al Bot y a la que el Bot responde de cierta forma de acuerdo a la orden o nombre del comando.`)
            .setFields(
                {name: `🌎 **Comandos generales:** *14*`, value: `*Comandos que todos pueden utilizar*.\n\n\`\`${prefijo}afk\`\` **|** Te establece el estado AFK dentro del servidor.\n\`\`${prefijo}user\`\` **|** Muestra información del usuario.\n\`\`${prefijo}stats\`\` **|** Muestra estadisticas generales de todos los servidores.\n\`\`${prefijo}jumbo\`\` **|** Muestra en grande un emoji del servidor.\n\`\`${prefijo}emojis\`\` **|** Muestra todos los emojis del servidor.\n\`\`${prefijo}avatar\`\` **|** Muestra el avatar del usuario.\n\`\`${prefijo}server\`\` **|** Muestra información del servidor.\n\`\`${prefijo}invite\`\` **|** Te muestra la invitación del bot.\n\`\`${prefijo}qrcode\`\` **|** Genera un código QR de un enlace.\n\`\`${prefijo}botinfo\`\` **|** Te muestra información del bot.\n\`\`${prefijo}invites\`\` **|** Muestra las invitaciones que has creado en el servidor.\n\`\`${prefijo}stickers\`\` **|** Te muestra todos los stikers del servidor.\n\`\`${prefijo}reportbug\`\` **|** Reporta errores del bot.\n\`\`${prefijo}inviteinfo\`\` **|** Muestra información de una invitación.`}
            )
            .setFooter({ text: msg.guild.name, iconURL: msg.guild.iconURL() })
            .setColor(colorEmb)
            .setTimestamp()


        const menuComandos = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId("1")
                    .setPlaceholder("📑 Selecciona un menu para ver los comandos de el.")
                    .addOptions([
                        {
                            emoji: "🌎",
                            label: "Generales",
                            description: "Muestra los comandos generales.",
                            value: "generales",
                            default: true
                        },
                        {
                            emoji: "👮",
                            label: "Moderación",
                            description: "Muestra los comandos de moderación.",
                            value: "moderacion"
                        },
                        {
                            emoji: "💎",
                            label: "Administración",
                            description: "Muestra los comandos de administración.",
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

        setTimeout(async () => {
            const mensajeSend = await msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embComandos], components: [menuComandos] })
            // const filtro = i=> i.user.id == msg.author.id;
            const colector = mensajeSend.createMessageComponentCollector({ time: 2 * 60000 })

            colector.on("collect", async menu => {
                if (menu.values[0] == "generales") {
                    embComandos.data.fields[0].name = `🌎 **Comandos generales:** *14*`
                    embComandos.data.fields[0].value = `*Comandos que todos pueden utilizar*.\n\n\`\`${prefijo}afk\`\` **|** Te establece el estado AFK dentro del servidor.\n\`\`${prefijo}user\`\` **|** Muestra información del usuario.\n\`\`${prefijo}stats\`\` **|** Muestra estadisticas generales de todos los servidores.\n\`\`${prefijo}jumbo\`\` **|** Muestra en grande un emoji del servidor.\n\`\`${prefijo}emojis\`\` **|** Muestra todos los emojis del servidor.\n\`\`${prefijo}avatar\`\` **|** Muestra el avatar del usuario.\n\`\`${prefijo}server\`\` **|** Muestra información del servidor.\n\`\`${prefijo}invite\`\` **|** Te muestra la invitación del bot.\n\`\`${prefijo}qrcode\`\` **|** Genera un código QR de un enlace.\n\`\`${prefijo}botinfo\`\` **|** Te muestra información del bot.\n\`\`${prefijo}invites\`\` **|** Muestra las invitaciones que has creado en el servidor.\n\`\`${prefijo}stickers\`\` **|** Te muestra todos los stikers del servidor.\n\`\`${prefijo}reportbug\`\` **|** Reporta errores del bot.\n\`\`${prefijo}inviteinfo\`\` **|** Muestra información de una invitación.`
                    menu.deferUpdate()
                    menuComandos.components[0].options.find(f => f.data.default).data.default = false
                    menuComandos.components[0].options.find(f => f.data.value == "generales").data.default = true
                    mensajeSend.edit({ embeds: [embComandos], components: [menuComandos] })
                }

                if (menu.values[0] == "moderacion") {
                    embComandos.data.fields[0].name = `👮 **Comandos de moderacion:** *11*`
                    embComandos.data.fields[0].value = `*Comandos que solo los moderadores pueden utilizar*.\n\n\`\`${prefijo}record\`\` **|** Muestra el historial de sanciones de un miembro.\n\`\`${prefijo}deleterecord\`\` **|** Elimina una o varias sanciones del historial de un miembro.\n\`\`${prefijo}warn\`\` **|** Advierte a un miembro.\n\`\`${prefijo}mute\`\` **|** Aísla temporalmente a un miembro.\n\`\`${prefijo}unmute\`\` **|** Elimina el aislamiento temporal de un miembro.\n\`\`${prefijo}mutelist\`\` **|** Muestra una lista de todos los miembros que están aislados en el servidor.\n\`\`${prefijo}kick\`\` **|** Expulsa a un miembro del servidor.\n\`\`${prefijo}ban\`\` **|** Prohíbe a un usuario entrar al servidor.\n\`\`${prefijo}unban\`\` **|** Elimina la prohibición de un miembro al servidor.\n\`\`${prefijo}clear\`\` **|** Elimina múltiples mensajes en un canal o de un miembro.\n\`\`${prefijo}banlist\`\` **|** Te muestra una lista de los usuarios baneados en el servidor.`
                    menu.deferUpdate()
                    menuComandos.components[0].options.find(f => f.data.default).data.default = false
                    menuComandos.components[0].options.find(f => f.data.value == "moderacion").data.default = true
                    mensajeSend.edit({ embeds: [embComandos], components: [menuComandos] })
                }

                if (menu.values[0] == "administracion") {
                    embComandos.data.fields[0].name = `💎 **Comandos de administración:** *8*`
                    embComandos.data.fields[0].value = `*Comandos que solo los administradores pueden utilizar*.\n\n\`\`${prefijo}setprefix\`\` **|** Establece un prefijo personalizado en este servidor.\n\`\`${prefijo}addrol\`\` **|** Añade un rol a un miembro o mas en el servidor.\n\`\`${prefijo}removerol\`\` **|** Remueve un rol de un miembro o mas en el servidor.\n\`\`${prefijo}createchannel\`\` **|** Crea un canal en el servidor.\n\`\`${prefijo}deletechannel\`\` **|** Elimina un canal del servidor.\n\`\`${prefijo}setslowmode\`\` **|** Establece el modo pausado de un canal de texto.\n\`\`${prefijo}memberswithrole\`\` **|** Muestra una lista con todos los miembros que tienen un rol.\n\`\`${prefijo}memberswithouttherole\`\` **|** Muestra una lista con todos los miembros que no tienen un rol.`
                    menu.deferUpdate()
                    menuComandos.components[0].options.find(f => f.data.default).data.default = false
                    menuComandos.components[0].options.find(f => f.data.value == "administracion").data.default = true
                    mensajeSend.edit({ embeds: [embComandos], components: [menuComandos] })
                }

                if (menu.values[0] == "puntos") {
                    embComandos.data.fields[0].name = `${emojis.puntos} **Comandos del sistem de puntos:** *10*`
                    embComandos.data.fields[0].value = `*Algunos comandos sólo los pueden utilizar los administradores o miembros del staff*.\n\n\`\`${prefijo}points\`\` **|** Muestra la cantidad de puntos que tienes o tiene un miembro.\n\`\`${prefijo}addpoints\`\` **|** Agrega puntos a un miembro.\n\`\`${prefijo}removepoints\`\` **|** Elimina puntos a un miembro.\n\`\`${prefijo}setstaffrole\`\` **|** Establece un rol del staff o personal del servidor.\n\`\`${prefijo}deletestaffrole\`\` **|** Elimina un rol establecido como rol del staff del servidor.\n\`\`${prefijo}setemojipoints\`\` **|** Establece un símbolo o emoji personalizado para el sistema de puntos.\n\`\`${prefijo}pointsleaderboard\`\` **|** Muestra una tabla de clasificaciones con los miembros que han utilizado el sistema de puntos y sus respectivos puntos.\n\`\`${prefijo}pointsystemstatus\`\` **|** Muestra el estado del sistema en el servidor.\n\`\`${prefijo}removeusersystemp\`\` **|** Elimina a un miembro del sistema de puntos del servidor.\n\`\`${prefijo}updatepointssystem\`\` **|** Actualiza el sistema de puntos en el servidor eliminando del sistema a todos los usuarios que se han ido del servidor.`
                    menu.deferUpdate()
                    menuComandos.components[0].options.find(f => f.data.default).data.default = false
                    menuComandos.components[0].options.find(f => f.data.value == "puntos").data.default = true
                    mensajeSend.edit({ embeds: [embComandos], components: [menuComandos] })
                }
            })
            setTimeout(() => {
                // msg.delete()
                mensajeSend.edit({ embeds: [embComandos], components: [] })
            }, 2 * 60000)
        }, 500)
    }

    //? 🌐 Comandos generales
    {
        if (comando == "afk") {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let dataAFK = await afkDB.findById(msg.guildId)

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando afk`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}afk <Razón>\`\`` },
                    { name: "Ejemplo:", value: `${prefijo}afk Necesito descansar.` },
                    { name: "Alias:", value: `\`\`afk\`\`` },
                    { name: "Descripción:", value: `Establece tu estado dentro del servidor como AFK y notifica a todos los miembros que te mencionen por que tu estado AFK.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (args[0] == "info") return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            if (dataAFK) {
                if (msg.member.nickname) {
                    if (msg.member.nickname.length <= 26) {
                        msg.member.setNickname(`[AFK] ${msg.member.nickname}`, `Razón: el miembro ha establecido su estado a AFK.`).catch(c => {
                            return;
                        })
                    }
                    const embAFK = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname, iconURL: msg.author.displayAvatarURL()})
                        .setTitle("💤 AFK establecido")
                        .setDescription(`${msg.author} se ha establecido tu estado AFK\n\n📝 **Razón:** ${args.join(" ") ? args.join(" ") : "*No has proporcionado una razón*"}`)
                        .setColor(msg.guild.members.me.displayHexColor)
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embAFK] })
                    }, 500)

                    let us = dataAFK.servidor.usos
                    dataAFK.servidor = { nombre: msg.guild.name, creado: Math.floor(msg.guild.createdAt / 1000), usos: us + 1 }
                    dataAFK.miembros.push({ id: msg.author.id, tag: msg.author.tag, apodo: msg.member.nickname, razon: args.join(" ") ? args.join(" ") : "*No ha proporcionado una razón*", tiempo: Math.floor(Date.now() / 1000) })
                    await dataAFK.save()

                } else {
                    if (msg.author.username.length <= 26) {
                        msg.member.setNickname(`[AFK] ${msg.author.username}`, `Razón: el miembro ha establecido su estado a AFK.`).catch(c => {
                            return;
                        })
                    }

                    const embAFK = new EmbedBuilder()
                        .setAuthor({name: msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setTitle("💤 AFK establecido")
                        .setDescription(`${msg.author} se ha establecido tu estado AFK\n\n📝 **Razón:** ${args.join(" ") ? args.join(" ") : "*No has proporcionado una razón*"}`)
                        .setColor(msg.guild.members.me.displayHexColor)
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embAFK] })
                    }, 500)

                    let us = dataAFK.servidor.usos
                    dataAFK.servidor = { nombre: msg.guild.name, creado: Math.floor(msg.guild.createdAt / 1000), usos: us + 1 }
                    dataAFK.miembros.push({ id: msg.author.id, tag: msg.author.tag, apodo: msg.author.username, razon: args.join(" ") ? args.join(" ") : "*No ha proporcionado una razón*", tiempo: Math.floor(Date.now() / 1000) })
                    await dataAFK.save()
                }

            } else {
                if (msg.member.nickname) {
                    if (msg.member.nickname.length <= 26) {
                        msg.member.setNickname(`[AFK] ${msg.member.nickname}`, `Razón: el miembro ha establecido su estado a AFK.`).catch(c => {
                            return;
                        })
                    }
                    let nuevaData = new afkDB({
                        _id: msg.guildId,
                        servidor: { nombre: msg.guild.name, creado: Math.floor(msg.guild.createdAt / 1000), usos: 1 },
                        miembros: [{ id: msg.author.id, tag: msg.author.tag, apodo: msg.member.nickname, razon: args.join(" ") ? args.join(" ") : "*No ha proporcionado una razón*", tiempo: Math.floor(Date.now() / 1000) }]
                    })

                    const embAFK = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname, iconURL: msg.author.displayAvatarURL()})
                        .setTitle("💤 AFK establecido")
                        .setDescription(`${msg.author} se ha establecido tu estado AFK\n\n📝 **Razón:** ${args.join(" ") ? args.join(" ") : "*No has proporcionado una razón*"}`)
                        .setColor(msg.guild.members.me.displayHexColor)
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embAFK] })
                    }, 500)
                    await nuevaData.save()

                } else {
                    if (msg.author.username.length <= 26) {
                        msg.member.setNickname(`[AFK] ${msg.author.username}`, `Razón: el miembro ha establecido su estado a AFK.`).catch(c => {
                            return;
                        })
                    }
                    let nuevaData = new afkDB({
                        _id: msg.guildId,
                        servidor: { nombre: msg.guild.name, creado: Math.floor(msg.guild.createdAt / 1000), usos: 1 },
                        miembros: [{ id: msg.author.id, tag: msg.author.tag, apodo: msg.author.username, razon: args.join(" ") ? args.join(" ") : "*No ha proporcionado una razón*", tiempo: Math.floor(Date.now() / 1000) }]
                    })

                    const embAFK = new EmbedBuilder()
                        .setAuthor({name: msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setTitle("💤 AFK establecido")
                        .setDescription(`${msg.author} se ha establecido tu estado AFK\n\n📝 **Razón:** ${args.join(" ") ? args.join(" ") : "*No has proporcionado una razón*"}`)
                        .setColor(msg.guild.members.me.displayHexColor)
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embAFK] })
                    }, 500)
                    await nuevaData.save()
                }
            }
        }

        if (["user", "usuario", "userinfo"].some(s => comando == s)) {
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
                "offline": "<:desconectado:910277715293245541> Desconectado",
                "online": "<:online:910277439928807434> Conectado"
            }
            let tyEstado = {
                "0": "Jugando a",
                "1": "Trasmitiendo",
                "2": "Escuchando",
                "3": "Viendo",
                "4": "Personalizada:",
                "5": "Compitiendo",
            }
            let insignias = {
                "BugHunterLevel1": "<:BughunterLevel1:920743741512368178> Cazador de bugs nivel 1",
                "BugHunterLevel2": "<:BughunterLevel2:920744747914657842> Cazador de bugs nivel 2",
                "CertifiedModerator": "<:DiscordCertifiedModerator:920751094928384041> Moderador",
                "Staff": "<:DiscordEmployee:920745583151575071> Empleado de Discord",
                "PremiumEarlySupporter": "<:EarlySupporter:920741677931569182>",
                "VerifiedDeveloper": "<:VerifiedBotDeveloper:920746956706414693> Desarrollador de bots verificado ",
                "HypeSquadOnlineHouse1": "<:HouseBravery:920750033660416103> Bravery",
                "HypeSquadOnlineHouse2": "<:HouseBrilliance:920749159743635457> Brilliance",
                "HypeSquadOnlineHouse3": "<:HouaseBalance:920750191508860928> Balance",
                "Hypesquad": "<:HypeSquad:920754083940413500> Eventos de la hypesquad",
                "Partner": "<:DiscordPartner:920746109259898890> Servidor socio",
                "VerifiedBot": "<:VerifiedBot:920750538012885013> Bot verificado",
                "TeamPseudoUser": "👥"
            }

            let alias = ["user", "usuario", "userinfo"]
            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando invites`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}userinfo <Usuario>\`\`` },
                    { name: "Ejemplos: **3**", value: `${prefijo}userinfo ${msg.author}\n${prefijo}userinfo ${msg.author.id}\n${prefijo}userinfo ${msg.author.tag}` },
                    { name: `Alias: **${alias.length}**`, value: alias.map(m => `\`\`${m}\`\``).join(`, `) },
                    { name: "Descripción:", value: `Muestra información de un usuario ya sea miembro del servidor o un usuario externo.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (["help", "ayuda", "info"].some(s => args[0] == s)) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag === args.join(" "))

            let actyvidad = null
            let miemPresence = miembro ? miembro.presence : msg.member.presence
            if (miemPresence?.activities.length >= 1) {
                if (miemPresence?.activities[0].type === "CUSTOM") {
                    actyvidad = `${miemPresence?.activities[0].emoji ? miemPresence?.activities[0].emoji : ""} ${miemPresence?.activities[0].state}`
                } else {
                    actyvidad = `${tyEstado[miemPresence?.activities[0].type]} ${miemPresence?.activities[0].emoji ? miemPresence?.activities[0].emoji : ""} ${miemPresence?.activities[0].name}`
                }
            } else {
                actyvidad = "*Sin texto de estado*"
            }

            let bannerUser = miembro ? miembro.id == msg.author.id ? await client.users.fetch(msg.author.id, { force: true }) : await client.users.fetch(miembro.id, { force: true }) : await client.users.fetch(msg.author.id, { force: true })
            const embMiembro = new EmbedBuilder()
                .setAuthor({ name: miembro ? miembro.id == msg.author.id ? `Tu información ${msg.member.nickname ? msg.member.nickname : msg.author.username}` : `Información de ${miembro.nickname ? miembro.nickname : miembro.user.username} pedida por ${msg.member.nickname ? msg.member.nickname : msg.author.username}` : `Tu información ${msg.member.nickname ? msg.member.nickname : msg.author.username}`, iconURL: msg.author.displayAvatarURL() })
                .setThumbnail(miembro ? miembro.id == msg.author.id ? msg.author.displayAvatarURL({  format: "png" || "gif", size: 4096 }) : miembro.displayAvatarURL({  format: "png" || "gif", size: 4096 }) : msg.author.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                .setImage(bannerUser.bannerURL({  format: "jpg" || "gif", size: 4096 }))
                .setDescription(miembro ? miembro.id == msg.author.id ? `👤 Tu: ${msg.author}` : miembro.user.bot ? `🤖 Bot: ${miembro}` : `👤 Miembro: ${miembro}` : `👤 Tu: ${msg.author}`)
                .setFields(
                    { name: "🏷 **Tag:**", value: `${miembro ? miembro.id == msg.author.id ? msg.author.tag : miembro.user.tag : msg.author.tag}`, inline: true },
                    { name: "🆔 **ID:**", value: `${miembro ? miembro.id == msg.author.id ? msg.author.id : miembro.id : msg.author.id}`, inline: true },
                    { name: "📌 **Apodo:**", value: `${miembro ? miembro.nickname !== null ? `${miembro.nickname}` : "*Ninguno*" : msg.member.nickname !== null ? `${msg.member.nickname}` : "*Ninguno*"}`, inline: true },
                    { name: `${miembro ? miembro.user.bot ? "📅 **Fue creado:**" : "📅 **Creo la cuenta:**" : "📅 **Creaste la cuenta:**"}`, value: `${miembro ? `<t:${Math.round(miembro.user.createdAt / 1000)}:R>` : `<t:${Math.round(msg.author.createdAt / 1000)}:R>`}`, inline: true },
                    { name: `${miembro ? miembro.id == msg.author.id ? "📥 **Te uniste:**" : "📥 **Se unio:**" : "📥 **Te uniste:**"}`, value: `${miembro ? `<t:${Math.round(miembro.joinedAt / 1000)}:R>` : `<t:${Math.round(msg.member.joinedAt / 1000)}:R>`}`, inline: true },
                    { name: `⚙️ **Plataforma:**`, value: `${miemPresence?.clientStatus ? plataforma[Object.keys(miemPresence?.clientStatus)[0]] : "*No obtenida*"}`, inline: true },
                    { name: "<a:BoostAnimado:931289485700911184> **Booster:**", value: `${miembro ? miembro.id == msg.author.id ? msg.member.premiumSince ? `Eres booster desde <t:${Math.floor(msg.member.premiumSinceTimestamp / 1000)}:R>` : "*No eres Booster*" : miembro.premiumSince ? `Es booster desde <t:${Math.floor(miembro.premiumSinceTimestamp / 1000)}:R>` : "*No es Booster*" : msg.member.premiumSince ? `Eres booster desde <t:${Math.floor(msg.member.premiumSinceTimestamp / 1000)}:R>` : "*No eres Booster*"}`, inline: true },
                    { name: `<:aislacion:947965052772814848> **Aislamiento temporal:**`, value: `${miembro ? miembro.isCommunicationDisabled() ? `Si, termina <t:${Math.floor(miembro.communicationDisabledUntilTimestamp / 1000)}:R>` : "*No*" : "No"}`, inline: true },
                    { name: `🎖 **Insignias:** ${miembro ? miembro.user.flags.toArray().length : msg.author.flags.toArray().length}`, value: `${miembro ? miembro.user.flags.toArray().length ? miembro.user.flags.toArray().map(i => insignias[i]).join("\n") : miembro.id == msg.author.id ? "*No tienes insignias*" : "*No tiene insignias*" : msg.author.flags.toArray().length ? msg.author.flags.toArray().map(i => insignias[i]).join("\n") : "*No tienes insignias*"}`, inline: true },
                    { name: "🔍 **Estado:**", value: `${presencia[miemPresence?.status]}\n${actyvidad}`, inline: true },
                )
                .setColor(miembro ? miembro.user.hexAccentColor ? miembro.user.hexAccentColor : msg.guild.members.me.displayHexColor : msg.author.hexAccentColor ? msg.author.hexAccentColor : msg.guild.members.me.displayHexColor)
                .setFooter( miembro ? miembro.id == msg.author.id ? { text: msg.guild.name, iconURL: msg.guild.iconURL() } : { text: miembro.user.tag, iconURL: miembro.displayAvatarURL() } : { text: msg.guild.name, iconURL: msg.guild.iconURL() })
                .setTimestamp()
            miembro ? miembro.user.bot ? embMiembro.data.fields.splice(6, 1) : null : null
            miembro ? miembro.id != msg.author.id && !miembro.user.bot ? "hola" : embMiembro.data.fields.length == 9 ? embMiembro.data.fields.splice(6, 1) : embMiembro.data.fields.splice(7, 1) : embMiembro.data.fields.length == 9 ? embMiembro.data.fields.splice(6, 1) : embMiembro.data.fields.splice(7, 1)
            if (!args[0] || miembro) {
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMiembro] })
                }, 500)
            }

            let erroresP = [
                { condicion: args[0] && !miembro && isNaN(args[0]), descripcion: `El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor o usuario externo, proporciona una mención, ID o etiqueta valida.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresMsg(msg, erroresP)) return;


            if (args[0] && !miembro) {
                await client.users.fetch(args[0], { force: true }).then(async usuario => {
                    const embUser = new EmbedBuilder()
                        .setAuthor({ name: `Información de ${usuario.tag} pedida por ${msg.member.nickname ? msg.member.nickname : msg.author.username}`, iconURL: msg.author.displayAvatarURL() })
                        .setThumbnail(usuario.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                        .setImage(usuario.bannerURL({  format: "jpg" || "gif", size: 4096 }))
                        .setDescription(usuario.bot ? `🤖 Bot externo: ${usuario}` : `👤 Usuario externo: ${usuario}`)
                        .setFields(
                            { name: "🏷 **Tag:**", value: `${usuario.tag}`, inline: true },
                            { name: "🆔 **ID:**", value: `${usuario.id}`, inline: true },
                            { name: usuario.bot ? "📅 **Fue creado:**" : "📅 **Creo la cuenta:**", value: `<t:${Math.round(usuario.createdAt / 1000)}:R>`, inline: true },
                            { name: `🎖 **Insignias:** ${usuario.flags.toArray().length}`, value: `${usuario.flags.toArray().length ? usuario.flags.toArray().map(i => insignias[i]).join("\n") : "*No tiene insignias*"}`, inline: true },
                            { name: "⛔ **Baneado:**", value: `${(await msg.guild.bans.fetch()).find(f => f.user.id === usuario.id) ? `__Si, por la razón:__ *${(await msg.guild.bans.fetch()).find(f => f.user.id === usuario.id).reason}*` : "*No*"}`, inline: true },
                        )
                        .setColor(usuario.hexAccentColor ? usuario.hexAccentColor : msg.guild.members.me.displayHexColor)
                        .setFooter({ text: msg.guild.name, iconURL: msg.guild.iconURL() })
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embUser] })
                    }, 500)

                }).catch(c => {
                    const embErrU1 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El argumento proporcionado (*${args[0]}*) no es una ID valida aun que este conformado por 18 caracteres numericos no coresponde con la ID de ningun usuario de Discord.`)
                        .setColor(ColorError)
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrU1] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => c)
                            dt.delete().catch(e => e)
                        }, 30000));
                    }, 500)
                })
            }
        }

        if (comando == "stats") {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let textCh = client.channels.cache.filter(ft => ft.type == ChannelType.GuildText).size, voiseCH = client.channels.cache.filter(fv => fv.type == ChannelType.GuildVoice).size, cateCh = client.channels.cache.filter(fc => fc.type == ChannelType.GuildCategory).size

            let ping = client.ws.ping <= 60 ? "<:30ms:917227036890791936>" : client.ws.ping > 60 && client.ws.ping < 120 ? "<:60ms:917227058399162429>" : client.ws.ping > 120 ? "<:150ms:917227075243503626>" : "*error*"

            const embStats = new EmbedBuilder()
                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                .setTitle("<:grafica:958856872981585981> Estadisticas")
                .setFields(
                    { name: "<:wer:920166217086537739> **Servidores:**", value: `${client.guilds.cache.size.toLocaleString()}`, inline: true },
                    { name: "📑 **Comandos:**", value: `43`, inline: true },
                    { name: "<:cronometro:948693729588441149> **Uptime:**", value: `${ms(client.uptime)}`, inline: true },
                    { name: `${ping} **Ping:**`, value: `${client.ws.ping} ms`, inline: true },
                    { name: "🔢 **Usos de comandos:**", value: `${botDB.comandos.usos.toLocaleString()}`, inline: true },
                    { name: `😀 **Emojis:** ${client.emojis.cache.size.toLocaleString()}`, value: `${client.emojis.cache.filter(fn => !fn.animated).size.toLocaleString()} normales\n${client.emojis.cache.filter(fa => fa.animated).size.toLocaleString()} animados`, inline: true },
                    { name: `👥 **Usuarios: ${client.users.cache.size.toLocaleString()}**`, value: `👤 ${client.users.cache.filter(fu => !fu.bot).size.toLocaleString()} miembros\n🤖 ${client.users.cache.filter(fb => fb.bot).size.toLocaleString()} bots`, inline: true },
                    { name: ` **Canales: ${(textCh + voiseCH + cateCh).toLocaleString()}**`, value: `<:canaldetexto:904812801925738557> ${textCh.toLocaleString()} texto\n <:canaldevoz:904812835295596544> ${voiseCH.toLocaleString()} voz\n<:carpeta:920494540111093780> ${cateCh.toLocaleString()} categorías`, inline: true },
                )
                .setColor(msg.guild.members.me.displayHexColor)
                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                .setTimestamp()
            setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embStats] })
            }, 500)
        }

        if (comando == "jumbo") {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let emojisSV = msg.guild.emojis.cache.map(e => e)
            let emR = Math.floor(Math.random() * emojisSV.length)
            const embInfo = new EmbedBuilder()
                .setAuthor({name: `${emojis.lupa} Comando jumbo`})
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}jumbo <Emoji>\`\`` },
                    { name: "Ejemplo:", value: `${prefijo}jumbo ${emojisSV[emR]}` },
                    { name: "Alias:", value: `\`\`jumbo\`\`` },
                    { name: "Descripción:", value: `Da una imagen ampliada del emoji proporcionado.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let emoji = client.emojis.cache.find(em => em.id === args[0].split(":")[2].split(">")[0])

            let condicionales = [!/\p{Emoji}/gu.test(args[0]), !args[0].includes(":"), !emoji]
            let descripciones = [`El argumento proporcionado \`\`${args[0]}\`\` no es un emoji.`, `El emoji proporcionado es un emoji publico, no puedo darte una imagen ampliada de el, proporciona un emoji de este servidor o de otro servidor.`, `No he podido encontrar ese emoji, puede ser por que no estoy en el servidor de origen de ese emoji.`]
            for (let e = 0; e < condicionales.length; e++) {
                if (condicionales[e]) {
                    const embErrEmojis = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[e])
                        .setColor(ColorError)
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrEmojis] }).then(tm => setTimeout(() => {
                            msg.delete().catch(t => {
                                return;
                            })
                            tm.delete().catch(t => {
                                return;
                            })
                        }, 30000))
                    }, 500)
                }
            }

            const embJumbo = new EmbedBuilder()
                .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                .setImage(emoji.url)
                .setDescription(`[**${emoji.name}**](${emoji.url})`)
                .setColor(msg.guild.members.me.displayHexColor)
                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                .setTimestamp()
            setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embJumbo] })
            }, 500)
        }

        if (comando == "emojis") {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let emojisAl = ["😃", "😄", "😅", "🤣", "😊", "🤪", "😐", "😝", "🤑", "😡"], emojRandom = Math.floor(Math.random() * emojisAl.length), emojis = msg.guild.emojis.cache

            const embNoEmojis = new EmbedBuilder()
                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                .setTitle(`${emojisAl[emojRandom]} Emojis del servidor`)
                .setDescription(`*Este servidor no tiene emojis propios.*`)
                .setColor(msg.guild.members.me.displayHexColor)
                .setTimestamp()
            if (emojis.size <= 0) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embNoEmojis] })
            }, 500)

            if (msg.guild.emojis.cache.size <= 10) {
                const embEmojis = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setTitle(`${emojisAl[emojRandom]} Emojis del servidor`)
                    .setDescription(`Emojis: **${emojis.size}**\n\n${emojis.map(e => e).map((en, e) => `**${e + 1}.**  ${en}\n\`\`${en}\`\`\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado" : "Normal"}`).slice(0, 10).join("\n\n")}`)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({text: `Pagina - 1/1`, iconURL: msg.guild.iconURL()})
                    .setTimestamp()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEmojis] })
                }, 500)

            } else {
                let segPage
                if (String(emojis.size).slice(-1) === "0") {
                    segPage = Math.floor(emojis.size / 10)
                } else {
                    segPage = Math.floor(emojis.size / 10 + 1)
                }

                let em1 = 0, em2 = 10, pagina = 1, descripcion = `Emojis: **${emojis.size}**\n\n`

                const embEmojis = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setTitle(`${emojisAl[emojRandom]} Emojis del servidor`)
                    .setDescription(descripcion + emojis.map(e => e).map((en, e) => `**${e + 1}.**  ${en}\n\`\`${en}\`\`\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado" : "Normal"}`).slice(em1, em2).join("\n\n"))
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                    .setTimestamp()

                const botones = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Primary)
                        ]
                    )

                setTimeout(async () => {
                    const mensajeSend = await msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEmojis], components: [botones] })
                    const filtro = i => i.user.id === msg.author.id;
                    const colector = mensajeSend.createMessageComponentCollector({ filter: filtro, time: segPage * 60000 })

                    setTimeout(() => {
                        mensajeSend.edit({ embeds: [embEmojis], components: [] })
                    }, segPage * 60000)

                    colector.on("collect", async botn => {
                        if (botn.customId === "1") {
                            if (em2 - 10 <= 10) {
                                em1 -= 10, em2 -= 10, pagina--

                                embEmojis
                                    .setDescription(descripcion + emojis.map(e => e).map((en, e) => `**${e + 1}.**  ${en}\n\`\`${en}\`\`\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado" : "Normal"}`).slice(em1, em2).join("\n\n"))
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                botones.components[0].data.style = ButtonStyle.Secondary
                                botones.components[0].data.disabled = true
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embEmojis], components: [botones] })

                            } else {
                                em1 -= 10, em2 -= 10, pagina--

                                embEmojis
                                    .setDescription(descripcion + emojis.map(e => e).map((en, e) => `**${e + 1}.**  ${en}\n\`\`${en}\`\`\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado" : "Normal"}`).slice(em1, em2).join("\n\n"))
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embEmojis], components: [botones] })
                            }
                        }
                        if (botn.customId == "2") {
                            if (em2 + 10 >= emojis.size) {
                                em1 += 10, em2 += 10, pagina++

                                embEmojis
                                    .setDescription(descripcion + emojis.map(e => e).map((en, e) => `**${e + 1}.**  ${en}\n\`\`${en}\`\`\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado" : "Normal"}`).slice(em1, em2).join("\n\n"))
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                botones.components[0].data.disabled = false
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[1].data.style = ButtonStyle.Secondary
                                botones.components[1].data.disabled = true
                                return await botn.update({ embeds: [embEmojis], components: [botones] })

                            } else {
                                em1 += 10, em2 += 10, pagina++

                                embEmojis
                                    .setDescription(descripcion + emojis.map(e => e).map((en, e) => `**${e + 1}.**  ${en}\n\`\`${en}\`\`\n**Nombre:** [${en.name}](${en.url})\n**Tipo:** ${en.animated ? "Animado" : "Normal"}`).slice(em1, em2).join("\n\n"))
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                return await botn.update({ embeds: [embEmojis], components: [botones] })
                            }
                        }
                    })
                }, 500)
            }
        }

        if (["stickers", "pegatinas"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let stikers = msg.guild.stickers.cache

            const embNoStikers = new EmbedBuilder()
                .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                .setTitle(`<:sticker:920136186687795262> Stickers del servidor`)
                .setDescription(`*Este servidor no tiene stickers propios.*`)
                .setColor(msg.guild.members.me.displayHexColor)
                .setTimestamp()
            if (stikers.size <= 0) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embNoStikers] })
            }, 500)

            if (stikers.size <= 10) {
                const embStikers = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                    .setTitle(`<:sticker:920136186687795262> Stickers del servidor`)
                    .setDescription(`Stickers: **${stikers.size}**\n\n${stikers.map(e => e).map((en, e) => `**${e + 1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(0, 10).join("\n\n")}`)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({text: `Pagina - 1/1`, iconURL: msg.guild.iconURL()})
                    .setTimestamp()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embStikers] })
                }, 500)

            } else {
                let segPage
                if (String(stikers.size).slice(-1) === "0") {
                    segPage = Math.floor(stikers.size / 10)
                } else {
                    segPage = Math.floor(stikers.size / 10 + 1)
                }

                let em1 = 0, em2 = 10, pagina = 1

                const embEmojis = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                    .setTitle(`<:sticker:920136186687795262> Stickers del servidor`)
                    .setDescription(`Stickers: **${stikers.size}**\n\n${stikers.map(e => e).map((en, e) => `**${e + 1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(em1, em2).join("\n\n")}`)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                    .setTimestamp()

                const botones = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente ")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Primary)
                        ]
                    )

                setTimeout(async () => {
                    const mensajeSend = await msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEmojis], components: [botones] })
                    const filtro = i => i.user.id === msg.author.id;
                    const colector = mensajeSend.createMessageComponentCollector({ filter: filtro, time: segPage * 60000 })

                    setTimeout(() => {
                        mensajeSend.edit({ embeds: [embEmojis], components: [] })
                    }, segPage * 60000)

                    colector.on("collect", async botn => {
                        if (botn.customId === "1") {
                            if (em2 - 10 <= 10) {
                                em1 -= 10, em2 -= 10, pagina--

                                embEmojis
                                    .setDescription(`Stickers: **${stikers.size}**\n\n${stikers.map(e => e).map((en, e) => `**${e + 1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(em1, em2).join("\n\n")}`)
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                botones.components[0].data.style = ButtonStyle.Secondary
                                botones.components[0].data.disabled = true
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embEmojis], components: [botones] })
                            } else {
                                em1 -= 10, em2 -= 10, pagina--

                                embEmojis
                                    .setDescription(`Stickers: **${stikers.size}**\n\n${stikers.map(e => e).map((en, e) => `**${e + 1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(em1, em2).join("\n\n")}`)
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embEmojis], components: [botones] })
                            }
                        }
                        if (botn.customId === "2") {
                            if (em2 + 10 >= emojis.size) {
                                em1 += 10, em2 += 10, pagina++

                                embEmojis
                                    .setDescription(`Stickers: **${stikers.size}**\n\n${stikers.map(e => e).map((en, e) => `**${e + 1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(em1, em2).join("\n\n")}`)
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                botones.components[0].data.disabled = false
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[1].data.style = ButtonStyle.Secondary
                                botones.components[1].data.disabled = true
                                return await botn.update({ embeds: [embEmojis], components: [botones] })
                            } else {
                                em1 += 10, em2 += 10, pagina++

                                embEmojis
                                    .setDescription(`Stickers: **${stikers.size}**\n\n${stikers.map(e => e).map((en, e) => `**${e + 1}.** \n**Nombre:** [${en.name}](${en.url})\n**Formato:** ${en.format}\n**Descripcion:** ${en.description}\n**ID:** ${en.id}`).slice(em1, em2).join("\n\n")}`)
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                return await botn.update({ embeds: [embEmojis], components: [botones] })
                            }
                        }
                    })
                })
            }
        }

        if (comando == "botslists" && msg.author.id == creadorID) {
            msg.channel.sendTyping()
            botDB.comandos.usos++

            const embBotsLists = new EmbedBuilder()
                .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                .setTitle("🤖 Bots lists")
                .setDescription(`[<:topgg:934246215342772234> Top.gg](https://top.gg/bot/841531159778426910)\n[<:CDBotList:934253710446559242> CDBotList](https://www.cdbotlist.xyz/bots/841531159778426910)`)
                .setColor(msg.guild.members.me.displayHexColor)
                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                .setTimestamp()

            const botones = new ActionRowBuilder()
                .addComponents(
                    [
                        new ButtonBuilder()
                            .setLabel("Top.gg")
                            .setEmoji("<:topgg:934246215342772234>")
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://top.gg/bot/841531159778426910")
                    ],
                    [
                        new ButtonBuilder()
                            .setLabel("CDBotList")
                            .setEmoji("<:CDBotList:934253710446559242>")
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://www.cdbotlist.xyz/bots/841531159778426910")
                    ]
                )
            setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embBotsLists], components: [botones] })
            }, 500)
        }

        if (["avatar", "icon", "icono"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let alias = ["avatar", "icon", "icono"]
            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando invites`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}avatar <Usuario o servidor>\`\`` },
                    { name: "Ejemplos: **4**", value: `${prefijo}avatar ${msg.author}\n${prefijo}avatar ${msg.author.id}\n${prefijo}avatar ${msg.author.tag}\n${prefijo}avatar *servidor*` },
                    { name: `Alias: **${alias.length}**`, value: alias.map(m => `\`\`${m}\`\``).join(`, `) },
                    { name: "Descripción:", value: `Muestra el avatar o icono de un usuario ya sea miembro del servidor o usuario externo también muestra el icono del servidor si se utiliza una de las siguientes palabras como argumento *server*, *servidor*, *guild* o *sv*.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (["help", "ayuda", "info"].some(s => args[0] == s)) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag == args.join(" "))

            let erroresP = [
                { condicion: args[0] && !["server", "servidor", "guild", "sv"].some(s => args[0] == s) && !miembro && !isNaN(args[0]) && args[0].length < 18, descripcion: `El argumento numérico  ingresado (*${args[0]}*) no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.` },
                { condicion: args[0] && !["server", "servidor", "guild", "sv"].some(s => args[0] == s) && !miembro && !isNaN(args[0]) && args[0].length > 18, descripcion: `El argumento numérico  ingresado (*${args[0]}*) no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.` },
                { condicion: args[0] && !["server", "servidor", "guild", "sv"].some(s => args[0] == s) && !miembro && isNaN(args[0]), descripcion: `El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor o usuario externo, proporciona una mención, ID o etiqueta valida.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresMsg(msg, erroresP)) return;

            const embAvatar = new EmbedBuilder()
            .setAuthor({ name: miembro ? miembro.id == msg.author.id ? `Tu avatar ${msg.member.nickname || msg.author.tag}` : `Avatar de ${miembro.nickname || miembro.user.tag} pedido por ${msg.member.nickname || msg.author.tag}` : args[0] && ["server", "servidor", "guild", "sv"].some(s => args[0] == s) ? `Avatar del servidor pedido por ${msg.member.nickname || msg.author.tag}` : `Tu avatar ${msg.member.nickname || msg.author.tag}`, iconURL: msg.author.displayAvatarURL() })
            .setTitle("Avatar")
            .setURL(miembro ? miembro.id == msg.author.id ? msg.author.displayAvatarURL({  format: "png" || "gif", size: 4096 }) : miembro.displayAvatarURL({  format: "png" || "gif", size: 4096 }) : args[0] && ["server", "servidor", "guild", "sv"].some(s => args[0] == s) ? msg.guild.iconURL({  format: "png" || "gif", size: 4096 }) : msg.author.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
            .setImage(miembro ? miembro.id == msg.author.id ? msg.author.displayAvatarURL({  format: "png" || "gif", size: 4096 }) : miembro.displayAvatarURL({  format: "png" || "gif", size: 4096 }) : args[0] && ["server", "servidor", "guild", "sv"].some(s => args[0] == s) ? msg.guild.iconURL({  format: "png" || "gif", size: 4096 }) : msg.author.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
            .setColor(miembro ? miembro.user.hexAccentColor || msg.guild.members.me.displayHexColor : msg.author.hexAccentColor || msg.guild.members.me.displayHexColor)
            .setFooter({ text: msg.guild.name, iconURL: msg.guild.iconURL() })
            .setTimestamp()

            if (args[0] ? ["server", "servidor", "guild", "sv"].some(s => args[0] == s) || miembro : true) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embAvatar] })
            }, 500)

            if (args[0] && !["server", "servidor", "guild", "sv"].some(s => args[0] == s) && !miembro) {
                await client.users.fetch(args[0], { force: true }).then(usuario => {
                    embAvatar.data.author = { name: `Avatar de ${usuario.tag} pedido por ${msg.member.nickname || msg.author.tag}`, iconURL: msg.author.displayAvatarURL() }
                    embAvatar.data.url = usuario.displayAvatarURL({  format: "png", size: 4096 })
                    embAvatar.data.image = { url: usuario.displayAvatarURL({  format: "png", size: 4096 }) }
                    embAvatar.setColor(usuario.hexAccentColor || msg.guild.members.me.displayHexColor)
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embAvatar] })
                    }, 500)

                }).catch(c => {
                    const embErrU1 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El argumento proporcionado (${args[0]}) no es una ID valida aun que este conformado por 18 caracteres numericos no coresponde con la ID de ningun usuario de Discord.`)
                        .setColor(ColorError)
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrU1] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => c)
                            dt.delete().catch(e => e)
                        }, 30000));
                    }, 500)
                })
            }
        }

        if (["server", "servidor"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let feat = {
                "ANIMATED_ICON": "Icono animado",
                "ANIMATED_BANNER": "Banner animado",
                "AUTO_MODERATION": "Moderación automática",
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
                "TEXT_IN_VOICE_ENABLED": "Texto en voz habilitado",
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
                "NEW_THREAD_PERMISSIONS": "Permisos para hilos nuevos",
                "HAS_DIRECTORY_ENTRY": "Tiene entrada de directorio",
                "HUB": "Centro",
                "INVITES_DISABLED": "Invitaciones deshabilitadas",
                "LINKED_TO_HUB": "Vinculo al centro",
                "RELAY_ENABLED": "Relé habilitado",
                "ROLE_ICONS": "Iconos de rol",
                "APPLICATION_COMMAND_PERMISSIONS_V2": "Permisos de comando de aplicación V2"
            }

            let verificacion = {
                "0": "Ninguno",
                "1": "Bajo",
                "2": "Medio",
                "3": "Alto",
                "4": "Muy alto"
            }

            let levelMejora = {
                "0": "Ninguno",
                "1": "<:Tier1:921852504713625670> Nivel 1",
                "2": "<:Tier2:921852557691863082> Nivel 2",
                "3": "<:Tier3:921852589933469716> Nivel 3"
            }

            let filterNSFW = {
                "0": "Deshabilitado",
                "1": "Miembros sin rol",
                "2": "Todos los miembros"
            }

            let notifi = {
                "0": "Todos los mensajes",
                "1": "Solo menciones"
            }

            let imgs = []

            msg.guild.bannerURL() ? imgs.push(`[Banner](${msg.guild.bannerURL({ size: 4096, format: "png" })})`) : ""
            msg.guild.discoverySplashURL() ? imgs.push(`[Splash](${msg.guild.splashURL({ size: 4096, format: "png" })})`) : ""
            msg.guild.splashURL() ? imgs.push(`[Discovery](${msg.guild.discoverySplashURL({ size: 4096, format: "png" })})`) : ""

            let mgmc = msg.guild.members.cache
            let enlinea = mgmc.filter(fm => fm.presence?.status == 'online').size
            let ausente = mgmc.filter(fm => fm.presence?.status == 'idle').size
            let nomolestar = mgmc.filter(fm => fm.presence?.status == 'dnd').size
            let todos = msg.guild.memberCount
            let bots = msg.guild.members.cache.filter(fb => fb.user.bot).size.toLocaleString()

            let chText = msg.guild.channels.cache.filter(t => t.type == ChannelType.GuildText).size, chVoize = msg.guild.channels.cache.filter(v => v.type == ChannelType.GuildVoice).size, chCategorie = msg.guild.channels.cache.filter(c => c.type == ChannelType.GuildCategory).size

            const embServer = new EmbedBuilder()
            .setThumbnail(msg.guild.iconURL({  format: "png" || "gif", size: 4096 }))
            .setAuthor({name: msg.guild.name, iconURL: msg.guild.iconURL()})
            .setImage(msg.guild.bannerURL({ format: "png", size: 4096 }))
            .setTitle("<a:Info:926972188018479164> Informacion del servidor")
            .setColor(msg.guild.members.me.displayHexColor)
            .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
            .setTimestamp()
            if (msg.guild.features.length >= 1 && msg.guild.members.me.permissions.has(['BanMembers', 'ManageGuild'])) {
                embServer.setFields(
                    { name: "📃 **Descripcion:**", value: `${msg.guild.description !== null ? msg.guild.description : "Sin descripción"}` },
                    { name: "🆔 **ID:**", value: `${msg.guild.id}`, inline: true },
                    { name: "👑 **Propiedad de:**", value: `<@${msg.guild.ownerId}>`, inline: true },
                    { name: `📅 **Creado:**`, value: `<t:${Math.floor(msg.guild.createdAt / 1000)}:R>`, inline: true },
                    { name: `<:verified:947322016086753330> **Verificado:**`, value: `${msg.guild.verified ? "Si" : "No"}`, inline: true },
                    { name: `<:DiscordPartner:920746109259898890> **Socio:**`, value: `${msg.guild.partnered ? "Si es socio" : "No es socio"}`, inline: true },
                    { name: `😃 **Emojis:** ${msg.guild.emojis.cache.size.toLocaleString()}`, value: `${msg.guild.emojis.cache.filter(n => !n.animated).size.toLocaleString()} normales\n${msg.guild.emojis.cache.filter(a => a.animated).size.toLocaleString()} animados`, inline: true },
                    { name: `<:sticker:920136186687795262> **Stikers:**`, value: `${msg.guild.stickers.cache.size.toLocaleString()}`, inline: true },
                    { name: "💈 **Roles:**", value: `${msg.guild.roles.cache.size}`, inline: true },
                    { name: `✉ **Invitaciones creadas:**`, value: `${(await msg.guild.invites.fetch()).size.toLocaleString()}`, inline: true },
                    { name: `⛔ **Baneos:**`, value: `${(await msg.guild.bans.fetch()).size.toLocaleString()}`, inline: true },
                    { name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true },
                    { name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true },
                    { name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true },
                    { name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true },
                    { name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true },
                    { name: `<:menu:947318717371527178> **Canales:** ${(chText + chVoize + chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()} categoía`, inline: true },
                    { name: `👥 **Miembros:** ${msg.guild.memberCount.toLocaleString()}`, value: `👤 ${mgmc.filter(u => !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:910277439928807434> ${(enlinea + ausente + nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true },
                    { name: `📋 **Características:** ${msg.guild.features.length}`, value: `${msg.guild.features.length>0 ? msg.guild.features.map(f => feat[f]).join(" **|** ") : '*No hay*'}`, inline: false },
                )

            } else {
                if (msg.guild.members.me.permissions.has(['BanMembers', 'ManageGuild'])) {
                    embServer.setFields(
                        { name: "📃 **Descripcion:**", value: `${msg.guild.description !== null ? msg.guild.description : "Sin descripción"}` },
                        { name: "🆔 **ID:**", value: `${msg.guild.id}`, inline: true },
                        { name: "👑 **Propiedad de:**", value: `<@${msg.guild.ownerId}>`, inline: true },
                        { name: `📅 **Creado:**`, value: `<t:${Math.floor(msg.guild.createdAt / 1000)}:R>`, inline: true },
                        { name: `<:verified:947322016086753330> **Verificado:**`, value: `${msg.guild.verified ? "Si" : "No"}`, inline: true },
                        { name: `<:DiscordPartner:920746109259898890> **Socio:**`, value: `${msg.guild.partnered ? "Si es socio" : "No es socio"}`, inline: true },
                        { name: `😃 **Emojis:** ${msg.guild.emojis.cache.size.toLocaleString()}`, value: `${msg.guild.emojis.cache.filter(n => !n.animated).size.toLocaleString()} normales\n${msg.guild.emojis.cache.filter(a => a.animated).size.toLocaleString()} animados`, inline: true },
                        { name: `<:sticker:920136186687795262> **Stikers:**`, value: `${msg.guild.stickers.cache.size.toLocaleString()}`, inline: true },
                        { name: "💈 **Roles:**", value: `${msg.guild.roles.cache.size}`, inline: true },
                        { name: `✉ **Invitaciones creadas:**`, value: `${(await msg.guild.invites.fetch()).size.toLocaleString()}`, inline: true },
                        { name: `⛔ **Baneos:**`, value: `${(await msg.guild.bans.fetch()).size.toLocaleString()}`, inline: true },
                        { name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true },
                        { name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true },
                        { name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true },
                        { name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true },
                        { name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true },
                        { name: `<:menu:947318717371527178> **Canales:** ${(chText + chVoize + chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()} categoía`, inline: true },
                        { name: `👥 **Miembros:** ${msg.guild.memberCount.toLocaleString()}`, value: `👤 ${mgmc.filter(u => !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:910277439928807434> ${(enlinea + ausente + nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true },
                    )

                } else {
                    if (msg.guild.members.me.permissions.has('BanMembers')) {
                        embServer.setFields(
                            { name: "📃 **Descripcion:**", value: `${msg.guild.description !== null ? msg.guild.description : "Sin descripción"}` },
                            { name: "🆔 **ID:**", value: `${msg.guild.id}`, inline: true },
                            { name: "👑 **Propiedad de:**", value: `<@${msg.guild.ownerId}>`, inline: true },
                            { name: `📅 **Creado:**`, value: `<t:${Math.floor(msg.guild.createdAt / 1000)}:R>`, inline: true },
                            { name: `<:verified:947322016086753330> **Verificado:**`, value: `${msg.guild.verified ? "Si" : "No"}`, inline: true },
                            { name: `<:DiscordPartner:920746109259898890> **Socio:**`, value: `${msg.guild.partnered ? "Si es socio" : "No es socio"}`, inline: true },
                            { name: `😃 **Emojis:** ${msg.guild.emojis.cache.size.toLocaleString()}`, value: `${msg.guild.emojis.cache.filter(n => !n.animated).size.toLocaleString()} normales\n${msg.guild.emojis.cache.filter(a => a.animated).size.toLocaleString()} animados`, inline: true },
                            { name: `<:sticker:920136186687795262> **Stikers:**`, value: `${msg.guild.stickers.cache.size.toLocaleString()}`, inline: true },
                            { name: "💈 **Roles:**", value: `${msg.guild.roles.cache.size}`, inline: true },
                            { name: `⛔ **Baneos:**`, value: `${(await msg.guild.bans.fetch()).size.toLocaleString()}`, inline: true },
                            { name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true },
                            { name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true },
                            { name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true },
                            { name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true },
                            { name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true },
                            { name: `<:menu:947318717371527178> **Canales:** ${(chText + chVoize + chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()} categoía`, inline: true },
                            { name: `👥 **Miembros:** ${msg.guild.memberCount.toLocaleString()}`, value: `👤 ${mgmc.filter(u => !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:910277439928807434> ${(enlinea + ausente + nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true },
                        )

                    } else {
                        if (msg.guild.members.me.permissions.has('ManageGuild')) {
                            embServer.setFields(
                                { name: "📃 **Descripcion:**", value: `${msg.guild.description !== null ? msg.guild.description : "Sin descripción"}` },
                                { name: "🆔 **ID:**", value: `${msg.guild.id}`, inline: true },
                                { name: "👑 **Propiedad de:**", value: `<@${msg.guild.ownerId}>`, inline: true },
                                { name: `📅 **Creado:**`, value: `<t:${Math.floor(msg.guild.createdAt / 1000)}:R>`, inline: true },
                                { name: `<:verified:947322016086753330> **Verificado:**`, value: `${msg.guild.verified ? "Si" : "No"}`, inline: true },
                                { name: `<:DiscordPartner:920746109259898890> **Socio:**`, value: `${msg.guild.partnered ? "Si es socio" : "No es socio"}`, inline: true },
                                { name: `😃 **Emojis:** ${msg.guild.emojis.cache.size.toLocaleString()}`, value: `${msg.guild.emojis.cache.filter(n => !n.animated).size.toLocaleString()} normales\n${msg.guild.emojis.cache.filter(a => a.animated).size.toLocaleString()} animados`, inline: true },
                                { name: `<:sticker:920136186687795262> **Stikers:**`, value: `${msg.guild.stickers.cache.size.toLocaleString()}`, inline: true },
                                { name: "💈 **Roles:**", value: `${msg.guild.roles.cache.size}`, inline: true },
                                { name: `✉ **Invitaciones creadas:**`, value: `${(await msg.guild.invites.fetch()).size.toLocaleString()}`, inline: true },
                                { name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true },
                                { name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true },
                                { name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true },
                                { name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true },
                                { name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true },
                                { name: `<:menu:947318717371527178> **Canales:** ${(chText + chVoize + chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()} categoía`, inline: true },
                                { name: `👥 **Miembros:** ${msg.guild.memberCount.toLocaleString()}`, value: `👤 ${mgmc.filter(u => !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:910277439928807434> ${(enlinea + ausente + nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true },
                            )

                        } else {
                            embServer.setFields(
                                { name: "📃 **Descripcion:**", value: `${msg.guild.description !== null ? msg.guild.description : "Sin descripción"}` },
                                { name: "🆔 **ID:**", value: `${msg.guild.id}`, inline: true },
                                { name: "👑 **Propiedad de:**", value: `<@${msg.guild.ownerId}>`, inline: true },
                                { name: `📅 **Creado:**`, value: `<t:${Math.floor(msg.guild.createdAt / 1000)}:R>`, inline: true },
                                { name: `<:verified:947322016086753330> **Verificado:**`, value: `${msg.guild.verified ? "Si" : "No"}`, inline: true },
                                { name: `<:DiscordPartner:920746109259898890> **Socio:**`, value: `${msg.guild.partnered ? "Si es socio" : "No es socio"}`, inline: true },
                                { name: `😃 **Emojis:** ${msg.guild.emojis.cache.size.toLocaleString()}`, value: `${msg.guild.emojis.cache.filter(n => !n.animated).size.toLocaleString()} normales\n${msg.guild.emojis.cache.filter(a => a.animated).size.toLocaleString()} animados`, inline: true },
                                { name: `<:sticker:920136186687795262> **Stikers:**`, value: `${msg.guild.stickers.cache.size.toLocaleString()}`, inline: true },
                                { name: "💈 **Roles:**", value: `${msg.guild.roles.cache.size}`, inline: true },
                                { name: "🔎 **Nivel de verificacion:**", value: `${verificacion[msg.guild.verificationLevel]}`, inline: true },
                                { name: "<:boost:921843079596609566> **Mejoras:**", value: `${msg.guild.premiumSubscriptionCount}`, inline: true },
                                { name: `🏆 **Nivel de mejoras:**`, value: `${levelMejora[msg.guild.premiumTier]}`, inline: true },
                                { name: `🔞 **Filtro de contenido explicito:**`, value: `${filterNSFW[msg.guild.explicitContentFilter]}`, inline: true },
                                { name: `<:notificacion:920493717398356010> **Notificaciones:**`, value: `${notifi[msg.guild.defaultMessageNotifications]}`, inline: true },
                                { name: `<:menu:947318717371527178> **Canales:** ${(chText + chVoize + chCategorie).toLocaleString()}`, value: `<:canaldetexto:904812801925738557> ${chText.toLocaleString()} texto\n<:canaldevoz:904812835295596544> ${chVoize.toLocaleString()} voz\n<:carpeta:920494540111093780> ${chCategorie.toLocaleString()} categoía`, inline: true },
                                { name: `👥 **Miembros:** ${msg.guild.memberCount.toLocaleString()}`, value: `👤 ${mgmc.filter(u => !u.user.bot).size.toLocaleString()} usuarios\n🤖 ${bots} bots\n<:online:910277439928807434> ${(enlinea + ausente + nomolestar).toLocaleString()} conectados\n<:desconectado:910277715293245541> ${(todos - enlinea - ausente - nomolestar).toLocaleString()} desconectados`, inline: true },
                            )
                        }
                    }
                }
            }
            imgs.length >= 1 ? embServer.fields.push({ name: `\u200B`, value: `${imgs.join(" | ")}`, inline: true }) : ""
            setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embServer] })
            }, 500)
        }

        if (comando == "invite") {
            msg.channel.sendTyping()
            botDB.comandos.usos++

            const inv = new EmbedBuilder()
                .setAuthor({name: `hola ${msg.member.nickname || msg.author.tag}`, iconURL: msg.author.displayAvatarURL()})
                .setDescription(`[__**Invítame**__](${invitacion}) a tu servidor.`)
                .setColor(colorEmb)
                .setTimestamp()

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Invítame")
                        .setEmoji("🔗")
                        .setStyle(ButtonStyle.Link)
                        .setURL(invitacion)
                )

            setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [inv], components: [row] })
            }, 500)

        }

        if (["qrcode", "qr"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let urQR = `http://api.qrserver.com/v1/create-qr-code/?data=${args[0]}&size=600x600`

            if (!args[0]) {
                if (msg.guild.members.me.permissions.has('ManageGuild')) {
                    const embInfo = new EmbedBuilder()
                        .setTitle(`${emojis.lupa} Comando qrcode`)
                        .setFields(
                            { name: "Uso:", value: `\`\`${prefijo}qrcode <URL o link>\`\`` },
                            { name: "Ejemplo:", value: `${prefijo}qrcode ${(await msg.guild.invites.fetch()).map(mi => mi.url).slice(0, 1)}` },
                            { name: "Alias:", value: `\`\`qrcode\`\`, \`\`qr\`\`` },
                            { name: "Descripción:", value: `Crea un código QR de el enlace o URL proporcionada.` }
                        )
                        .setColor(colorEmbInfo)
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
                    }, 500)
                } else {
                    const embInfo = new EmbedBuilder()
                        .setTitle(`${emojis.lupa} Comando qrcode`)
                        .setFields(
                            { name: "Uso:", value: `\`\`${prefijo}qrcode <URL o link>\`\`` },
                            { name: "Ejemplo", value: `${prefijo}qrcode https://discord.gg/yKfWU4uykc` },
                            { name: "Alias:", value: `\`\`${prefijo}qrcode\`\`, \`\`${prefijo}qr\`\`` },
                            { name: "Descripción:", value: `Crea un código QR de el enlace o URL proporcionada.` }
                        )
                        .setColor(colorEmbInfo)
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
                    }, 500)
                }
            }

            const embErr1 = new EmbedBuilder()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`El argumento proporcionado no es un enlace.`)
            .setColor(ColorError)
            .setTimestamp()
            if (!(args[0].includes(".com") || args[0].includes("hattp://") || args[0].includes("https://"))) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr1] })
            }, 500)

            const embErr2 = new EmbedBuilder()
            .setTitle(`${emojis.negativo} Error`)
            .setDescription(`El enlace proporcionado no es valido.`)
            .setColor(ColorError)
            .setTimestamp()
            if (!isURL(new URL(args[0]))) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr2] })
            }, 500)

            const attachment = new AttachmentBuilder(urQR, {name: `imagen.png`})

            const embQR = new EmbedBuilder()
                .setAuthor({name: `Codigo QR creado por ${msg.member.nickname || msg.author.tag}`, iconURL: msg.author.displayAvatarURL()})
                .setImage(`attachment://imagen.png`)
                .setColor(msg.guild.members.me.displayHexColor)
                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                .setTimestamp()

            setTimeout(() => {
                msg.delete().catch(c => console.error(c))
                msg.channel.send({ embeds: [embQR], files: [attachment] }).catch(() => msg.reply("Ubo un error. quizás no introdujiste bien el enlace."))
            }, 500)
        }

        if (["reportbug", "reportarerror", "repbug"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando reportbug`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}reportbug <Reporte>\`\`` },
                    { name: "Ejemplos: **2**", value: `${prefijo}reportbug El comando say no funciona.` },
                    { name: "Alias: **3**", value: `\`\`reportbug\`\`, \`\`reportarerror\`\`, \`\`repbug\`\`` },
                    { name: "Descripción:", value: `Reporta un bug *(error)* del bot en caso de tener un error, ayudas mocho a mejorar el bot reportando errores.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let canalReportes = client.channels.cache.get("950962633580896276")

            const embAdvertencia = new EmbedBuilder()
                .setTitle(`<:advertencia:929204500739268608> Advertencia`)
                .setDescription(`¿Estás seguro/a ${msg.author} de enviar tu reporte?\n\n<:report:959201948169564210> **Reporte:**\n${args.join(" ")}`)
                .setColor('Yellow')

            const embConfirmar = new EmbedBuilder()
                .setTitle(`${emojis.acierto} Reporte enviado`)
                .setDescription(`Tu reporte ha sido enviado a mi [servidor](${serverSuport}) de soporte para que le eche un vistazo mi creador y arregle el problema, gracias por reportar.`)
                .setColor('Green')

            const embCancelar = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Reporte cancelado`)
                .setDescription(`Has cancelado tu reporte, no dudes en reportar cualquier fallo, es muy importante para mi que muestren mis errores a mi creador.`)
                .setColor('Red')

            const embAccionCancelada = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Acción cancelada`)
                .setDescription(`Se ha cancelado la acción por que has demorado mucho en responder.`)
                .setColor('Red')

            const botones = new ActionRowBuilder()
                .addComponents(
                    [
                        new ButtonBuilder()
                            .setCustomId("confirmar")
                            .setEmoji(emojis.acierto)
                            .setLabel("Confirmar")
                            .setStyle(ButtonStyle.Success),
                    
                        new ButtonBuilder()
                            .setCustomId("cancelar")
                            .setEmoji(emojis.negativo)
                            .setLabel("Cancelar")
                            .setStyle(ButtonStyle.Danger)
                    ]
                )

            setTimeout(async () => {
                const mensajeEmb = await msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embAdvertencia], components: [botones] })
                const colector = mensajeEmb.createMessageComponentCollector({ filter: i => i.user.id == msg.author.id, time: 60000 })
                let interuptor = true
                setTimeout(() => {
                    if (interuptor) {
                        mensajeEmb.edit({ embeds: [embAccionCancelada], components: [] })
                    }
                }, 60000)

                colector.on("collect", async cll => {
                    if (cll.customId == "confirmar") {
                        cll.update({ embeds: [embConfirmar], components: [] }).then(tb => {
                            const embReporte = new EmbedBuilder()
                                .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                .setThumbnail(msg.author.displayAvatarURL({extension: "png", size: 2048 }))
                                .setTitle(`<:report:959201948169564210> Nuevo reporte`)
                                .setFields(
                                    { name: `👤 **Reporte de:**`, value: `${msg.author.tag}\n${msg.author.id}`, inline: true },
                                    { name: `📤 **Desde:**`, value: `${msg.guild.name}\n${msg.guild.id}`, inline: true },
                                    { name: `📄 **Reporte:**`, value: `${args.join(" ")}`, inline: true },
                                )
                                .setColor(msg.guild.members.me.displayHexColor)
                                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                .setTimestamp()
                            canalReportes.send({ embeds: [embReporte] })
                            interuptor = false
                        })
                    }
                    if (cll.customId == "cancelar") {
                        cll.update({ embeds: [embCancelar], components: [] })
                        interuptor = false
                    }
                })
            }, 500)
        }

        if (comando == "botinfo") {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let creador = client.users.cache.get(creadorID)

            const infBot = new EmbedBuilder()
                .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL() })
                .setThumbnail(client.user.displayAvatarURL())
                .setTitle(`<:util:947316902647189554> ${client.user.username}`)
                .setDescription(`Soy un bot enfocado en serte de lo mas útil posible en tu servidor contando con comandos de moderación, administración, comandos de sistemas que te pueden ser de gran utilidad en tu servidor, *si tienes alguna duda o necesitas información adicional sobre mi pueden entrar en mi [servidor](${serverSuport}) de soporte, para conocer mis términos de servicio en mi [pagina](${webPage}) web*.\n📅 Creado <t:${Math.floor(client.user.createdAt / 1000)}:R> por ${client.users.cache.get(creadorID).tag}\n`)
                .setFields(
                    { name: `\u200B`, value: `<:status:957353077650886716> **Sistema:**`, inline: false },
                    { name: `<:node:958824377166737428> **Node:**`, value: `${process.version}`, inline: true },
                    { name: `<:discordjs:958825301624881162> **Discord.js:**`, value: `v${version}`, inline: true },
                    { name: `<:mongoDB:958817120769151046> **Mongoose:**`, value: `v${mongoose.version}`, inline: true },
                    { name: `<:host:958828608389009429> **Host:**`, value: `<:heroku:958814911243374602> Heroku`, inline: true },
                    { name: `<:memoria:958829662644109352> **Memoria:**`, value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`, inline: true },
                    { name: `\u200B`, value: `\u200B`, inline: false },
                    { name: `<a:gears_loading:958170921590489148> **Sistemas:**`, value: `${emojis.puntos} **Sistema de puntos:**\nFase final *(puede tener cambios)*, para mas información sobre el sistema utiliza el comando \`\`${prefijo}pointsinfo\`\`.\n\n${emojis.alianza} **Sistema de auto alianzas:**\nFace beta *(pueden haber errores)*, para mas información sobre el sistema utiliza el comando \`\`${prefijo}alliancesinfo\`\``, inline: true },
                )
                .setFooter({ text: `Creador: ${creador.tag}`, iconURL: creador.displayAvatarURL() })
                .setColor(colorEmb)
                .setTimestamp()
            setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [infBot] })
            }, 500)
        }

        if (["invites", "invs", "invitaciones"].some(s => comando == s)) {
            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag == args.join(" ")), invitaciones = miembro ? (await msg.guild.invites.fetch()).filter(f => f.inviterId == miembro.id).map(m => m) : (await msg.guild.invites.fetch()).filter(f => f.inviterId == msg.author.id).map(m => m), tabla = []
            msg.channel.sendTyping()
            botDB.comandos.usos++

            let erroresP = [
                { condicion: !msg.guild.members.me.permissions.has('ManageGuild'), descripcion: `No tengo los permisos suficientes para ejecutar el comando, requiero del permiso \`\`Gestionar servidor\`\`.` },
                { condicion: args[0] && !["help", "ayuda", "info"].some(s => args[0] == s) && !miembro, descripcion: `El argumento que has proporcionado *(${args.join(" ")})* no se reconoce como un miembro del servido, asegúrate de ingresar bien al miembro.` },
                { condicion: !miembro && invitaciones.length == 0, descripcion: `No has creado ninguna invitación en este servidor.` },
                { condicion: miembro && invitaciones.length == 0, descripcion: `El miembro que has proporcionado *(${miembro})* no ha creado ninguna invitación.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresMsg(msg, erroresP)) return;

            let alias = ["invites", "invs", "invitaciones"]
            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando invites`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}invites <Miembro>\`\`` },
                    { name: "Ejemplos: **3**", value: `${prefijo}invites ${msg.author}\n${prefijo}invites ${msg.author.id}\n${prefijo}invites ${msg.author.tag}` },
                    { name: `Alias: **${alias.length}**`, value: alias.map(m => `\`\`${m}\`\``).join(`, `) },
                    { name: "Descripción:", value: `Muestra todas las invitaciones que has creado en este servidor o todas las que ha creado otro miembro del servidor o un bot.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (["help", "ayuda", "info"].some(s => args[0] == s)) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let bueltas = 1
            for (let inv of invitaciones) {
                tabla.push(`**${bueltas}.** [${inv.code}](${inv.url}) **|** Usos: ${inv.uses.toLocaleString()}\n${inv.url} **|** ${inv.maxAge != 0 ? `expira: <t:${Math.floor(inv.expiresAt / 1000)}:R>` : `no expira`}`)
                bueltas++
            }

            let descripcion = (miembro ? miembro.id == msg.author.id ? `Has creado **${tabla.length.toLocaleString()}** ` : `El miembro ${miembro} ha creado **${tabla.length.toLocaleString()}** ` : `Has creado **${tabla.length.toLocaleString()}** `) + (tabla.length == 1 ? "invitación la cual es la siguiente.\n\n" : "invitaciones las cuales son las siguientes.\n\n")
            if (tabla.length <= 10) {
                const embInviteaciones = new EmbedBuilder()
                    .setAuthor({ name: msg.member.nickname ? msg.member.nickname : msg.author.username, iconURL: msg.author.displayAvatarURL() })
                    .setTitle(`✉️ Invitaciones`)
                    .setDescription(descripcion + tabla.slice(0, 10).join("\n\n"))
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({ text: `Pagina - 1/1`, iconURL: miembro ? miembro.id == msg.author.id ? msg.guild.iconURL() : miembro.displayAvatarURL() : msg.guild.iconURL() })
                    .setTimestamp()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInviteaciones] })
                }, 500)

            } else {
                let segPage = 0
                if (String(tabla.length).slice(-1) == "0") {
                    segPage = Math.floor(tabla.length / 10)
                } else {
                    segPage = Math.floor(tabla.length / 10 + 1)
                }

                let in1 = 0, in2 = 10, pagina = 1

                const embInviteaciones = new EmbedBuilder()
                    .setAuthor({ name: msg.member.nickname ? msg.member.nickname : msg.author.username, iconURL: msg.author.displayAvatarURL() })
                    .setTitle(`✉️ Invitaciones`)
                    .setDescription(descripcion + tabla.slice(in1, in2).join("\n\n"))
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({ text: `Pagina - 1/1`, iconURL: miembro ? miembro.id == msg.author.id ? msg.guild.iconURL() : msg.author.displayAvatarURL() : msg.guild.iconURL() })
                    .setTimestamp()

                const botones = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Secondary),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente ")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Primary)
                        ]
                    )

                setTimeout(async () => {
                    const mensajeSend = await msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInviteaciones], components: [botones1] })
                    const filtro = i => i.user.id === msg.author.id;
                    const colector = mensajeSend.createMessageComponentCollector({ filter: filtro, time: segPage * 60000 })

                    setTimeout(() => {
                        mensajeSend.edit({ embeds: [embInviteaciones], components: [] })
                    }, segPage * 60000)

                    colector.on("collect", async botn => {
                        if (botn.customId === "1") {
                            if (in2 - 10 <= 10) {
                                in1 -= 10, in2 -= 10, pagina--
                                embInviteaciones
                                    .setDescription(descripcion + tabla.slice(in1, in2).join("\n\n"))
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                botones.components[0].data.style = ButtonStyle.Secondary
                                botones.components[0].data.disabled = true
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embInviteaciones], components: [botones] })

                            } else {
                                in1 -= 10, in2 -= 10, pagina--
                                embInviteaciones
                                    .setDescription(descripcion + tabla.slice(in1, in2).join("\n\n"))
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                await botn.update({ embeds: [embInviteaciones], components: [botones] })
                            }
                        }
                        if (botn.customId === "2") {
                            if (in2 + 10 >= tabla.length) {
                                in1 += 10, in2 += 10, pagina++
                                embInviteaciones
                                    .setDescription(descripcion + tabla.slice(in1, in2).join("\n\n"))
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                botones.components[0].data.disabled = false
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[1].data.style = ButtonStyle.Secondary
                                botones.components[1].data.disabled = true

                                return await botn.update({ embeds: [embInviteaciones], components: [botones] })

                            } else {
                                in1 += 10, in2 += 10, pagina++

                                embInviteaciones
                                    .setDescription(descripcion + tabla.slice(in1, in2).join("\n\n"))
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                botones.components[0].data.style = ButtonStyle.Primary
                                botones.components[0].data.disabled = false
                                botones.components[1].data.disabled = false
                                botones.components[1].data.style = ButtonStyle.Primary
                                return await botn.update({ embeds: [embInviteaciones], components: [botones] })
                            }
                        }
                    })
                }, 500)
            }
        }

        if (["inviteinfo", "invinfo"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++

            let alias = ["inviteinfo", "invinfo"]
            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando invites`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}inviteinfo <Invitación>\`\`` },
                    { name: "Ejemplos: **3**", value: `${prefijo}inviteinfo https://discord.gg/G7GUD7eNCb\n${prefijo}inviteinfo G7GUD7eNCb\n${prefijo}inviteinfo https://discord.com/invite/G7GUD7eNCb` },
                    { name: `Alias: **${alias.length}**`, value: alias.map(m => `\`\`${m}\`\``).join(`, `) },
                    { name: "Descripción:", value: `Muestra información de la invitación que proporciones, no importa si la invitación es externa de igual manera mostrara información de la invitación.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            await client.fetchInvite(`${args[0]}`).then(invite => {
                const embInviteInfo = new EmbedBuilder()
                    .setAuthor({ name: msg.member.nickname ? msg.member.nickname : msg.author.username, iconURL: msg.author.displayAvatarURL({  format: "png" || "gif", size: 1024 }) })
                    .setTitle(`<a:Info:926972188018479164> Información de invitación`)
                    // .setDescription(`Invitación creada por ${msg.guild.members.cache.has(invite.inviterId) ? `**<@${invite.inviterId}>**` : `[**${invite.inviter.tag}**](${invite.inviter.displayAvatarURL({ format: "png"||"gif", size: 1024})}), ID: \`\`${invite.inviterId}\`\``} en el canal **${invite.guild.id==msg.guildId ? invite.channel : invite.channel.name}** ${invite.guild.id==msg.guildId ? "*en este servidor.*" : `en el servidor **${invite.guild.name}** el cual cuenta con **${invite.memberCount.toLocaleString()}** miembros, **${invite.presenceCount.toLocaleString()}** conectados y **${(invite.memberCount-invite.presenceCount).toLocaleString()}** desconectados.`}`)
                    .setFields(
                        { name: `<:servidores:954823483794276383> **Servidor:**`, value: `${invite.guild.id == msg.guildId ? "*de este servidor*" : `**${invite.guild.name}** el cual cuenta con **${invite.memberCount.toLocaleString()}** miembros, **${invite.presenceCount.toLocaleString()}** conectados y **${(invite.memberCount - invite.presenceCount).toLocaleString()}** desconectados.`}` },
                        { name: `<:calendario:952037404561264661> **Creada:**`, value: `en el canal **${invite.guild.id == msg.guildId ? invite.channel : invite.channel.name}**, por ${msg.guild.members.cache.has(invite.inviterId) ? `**<@${invite.inviterId}>**` : `[**${invite.inviter.tag}**](${invite.inviter.displayAvatarURL({  format: "png" || "gif", size: 1024 })}), ID: \`\`${invite.inviterId}\`\``}` },
                        // {name: ``, value: ``},
                        // {name: ``, value: ``},
                    )
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({ text: invite.guild.name, iconURL: invite.guild.iconURL() })
                    .setTimestamp()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInviteInfo] })
                }, 500)

            }).catch(ci => {
                console.log("catch")
                const embError = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`El argumento proporcionado *(${args[0]})* no es un código o URL de una invitación valida.`)
                    .setColor(ColorError)
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError] }).then(tm => setTimeout(() => {
                        msg.delete().catch(t => t)
                        tm.delete().catch(t => t)
                    }, 30000))
                }, 500)
            })
        }
    }


    //* 👮 Comandos de moderacion
    {
        if (["record", "historial"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let dataHis = await historialesDB.findOne({ _id: client.user.id })

            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Permiso requerido: Banear miembros, Expulsar miembros o Aislar miembros."})
                .setTimestamp()
            if (!['KickMembers' || 'BanMembers' || 'ModerateMembers'].some(s=> msg.member.permissions.has(s))) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(dt => setTimeout(() => {
                    msg.delete().catch(c => {
                        return;
                    })
                    dt.delete().catch(e => {
                        return;
                    })
                }, 30000))
            }, 500)

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando record`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}record <Mencion del miembro>\`\`\n\`\`${prefijo}record <ID del miembro>\`\`\n\`\`${prefijo}record <Etiqueta del miembro>\`\`` },
                    { name: "Ejemplos: **2**", value: `${prefijo}record ${msg.author}\n${prefijo}record ${msg.author.id}\n${prefijo}record ${msg.author.tag}` },
                    { name: "Alias: **1**", value: `\`\`record\`\`, \`\`historial\`\`` },
                    { name: "Descripción:", value: `Muestra el historial de un miembro, en el historial encontraras las advertencias, muteos, expulsiones y baneos que ha tenido en otros servidores y en este servidor.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let botones1 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle(ButtonStyle.Success)])
            let botones2 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle(ButtonStyle.Primary)])
            let botones3 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle(ButtonStyle.Secondary)])
            let botones4 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle(ButtonStyle.Danger)])

            let botones5 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle(ButtonStyle.Success)], [new ButtonBuilder().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle(ButtonStyle.Primary)])
            let botones6 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle(ButtonStyle.Success)], [new ButtonBuilder().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle(ButtonStyle.Secondary)])
            let botones7 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle(ButtonStyle.Success)], [new ButtonBuilder().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle(ButtonStyle.Danger)])

            let botones8 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle(ButtonStyle.Success)], [new ButtonBuilder().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle(ButtonStyle.Primary)], [new ButtonBuilder().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle(ButtonStyle.Secondary)])
            let botones9 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle(ButtonStyle.Success)], [new ButtonBuilder().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle(ButtonStyle.Secondary)], [new ButtonBuilder().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle(ButtonStyle.Danger)])
            let botones10 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle(ButtonStyle.Success)], [new ButtonBuilder().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle(ButtonStyle.Primary)], [new ButtonBuilder().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle(ButtonStyle.Danger)])

            let botones11 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle(ButtonStyle.Primary)], [new ButtonBuilder().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle(ButtonStyle.Secondary)])
            let botones12 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle(ButtonStyle.Primary)], [new ButtonBuilder().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle(ButtonStyle.Danger)])

            let botones13 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle(ButtonStyle.Primary)], [new ButtonBuilder().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle(ButtonStyle.Secondary)], [new ButtonBuilder().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle(ButtonStyle.Danger)])

            let botones14 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle(ButtonStyle.Secondary)], [new ButtonBuilder().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle(ButtonStyle.Danger)])
            let botones15 = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("advertencias").setEmoji("929204500739268608").setLabel("Advertencias").setStyle(ButtonStyle.Success)], [new ButtonBuilder().setCustomId("aislamientos").setEmoji("947965052772814848").setLabel("Aislamientos").setStyle(ButtonStyle.Primary)], [new ButtonBuilder().setCustomId("expulsiones").setEmoji("879519859694776360").setLabel("Expulsiones").setStyle(ButtonStyle.Secondary)], [new ButtonBuilder().setCustomId("baneos").setEmoji("⛔").setLabel("Baneos").setStyle(ButtonStyle.Danger)])

            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag === args.join(" "))

            if (miembro) {
                if (msg.author.id === miembro.id) {
                    if (dataHis.usuarios.some(s => s.id === miembro.id)) {
                        let posicionUS
                        let adv = 0
                        let ais = 0
                        let exp = 0
                        let ban = 0
                        for (let i = 0; i < dataHis.usuarios.length; i++) {
                            if (dataHis.usuarios[i].id === miembro.id) {
                                posicionUS = i
                                for (let m = 0; m < dataHis.usuarios[i].servidores.length; m++) {
                                    adv += dataHis.usuarios[i].servidores[m].advertencias.length
                                    ais += dataHis.usuarios[i].servidores[m].aislamientos.length
                                    exp += dataHis.usuarios[i].servidores[m].expulsiones.length
                                    ban += dataHis.usuarios[i].servidores[m].baneos.length
                                }
                            }
                        }

                        if (dataHis.usuarios[posicionUS].servidores.some(s => s.id === msg.guildId)) {
                            let posicionSV
                            for (let s = 0; s < dataHis.usuarios[posicionUS].servidores.length; s++) {
                                if (dataHis.usuarios[posicionUS].servidores[s].id === msg.guildId) {
                                    posicionSV = s
                                }
                            }
                            let advert = dataHis.usuarios[posicionUS].servidores[posicionSV].advertencias.length
                            let aislam = dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos.length
                            let expuls = dataHis.usuarios[posicionUS].servidores[posicionSV].expulsiones.length
                            let baneos = dataHis.usuarios[posicionUS].servidores[posicionSV].baneos.length

                            if ((advert + aislam + expuls + baneos) <= 0) {
                                if ((adv + ais + exp + ban) <= 0) {
                                    const embHistorial = new EmbedBuilder()
                                        .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                        .setTitle("<:historial:949522609266110485> Historial")
                                        .setDescription(`*${miembro} no tienes sanciones en ningun servidor de los **${dataHis.usuarios[posicionUS].servidores.length}** servidores en donde antes si tenias sanciones.*`)
                                        .setColor(colorEmb)
                                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                        .setTimestamp()
                                    setTimeout(() => {
                                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embHistorial] })
                                    }, 500)
                                } else {
                                    let botones
                                    let condicionales = [adv > 0 && ais <= 0 && exp <= 0 && ban <= 0, adv <= 0 && ais > 0 && exp <= 0 && ban <= 0, adv <= 0 && ais <= 0 && exp > 0 && ban <= 0, adv <= 0 && ais <= 0 && exp <= 0 && ban > 0, adv > 0 && ais > 0 && exp <= 0 && ban <= 0, adv > 0 && ais <= 0 && exp > 0 && ban <= 0, adv > 0 && ais <= 0 && exp <= 0 && ban > 0, adv > 0 && ais > 0 && exp > 0 && ban <= 0, adv > 0 && ais <= 0 && exp > 0 && ban > 0, adv > 0 && ais > 0 && exp <= 0 && ban > 0, adv <= 0 && ais > 0 && exp > 0 && ban > 0, adv <= 0 && ais > 0 && exp > 0 && ban <= 0, adv <= 0 && ais > 0 && exp <= 0 && ban > 0, adv <= 0 && ais <= 0 && exp > 0 && ban > 0, adv > 0 && ais > 0 && exp > 0 && ban > 0]
                                    let valorBotones = [botones1, botones2, botones3, botones4, botones5, botones6, botones7, botones8, botones9, botones10, botones11, botones12, botones13, botones14, botones15]
                                    for (let i = 0; i < condicionales.length; i++) {
                                        if (condicionales[i]) {
                                            botones = valorBotones[i]
                                        }
                                    }

                                    const embHistorial = new EmbedBuilder()
                                        .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                        .setTitle("<:historial:949522609266110485> Historial")
                                        .setDescription(`*${miembro} no tienes sanciones en este servidor.*\n\nEn los **${dataHis.usuarios[posicionUS].servidores.filter(f => f.advertencias.length > 0 || f.aislamientos.length > 0 || f.expulsiones.length > 0 || f.baneos.length > 0).length}** servidores que tengo registro sobre ti tienes un total de **${adv}** advertencias, **${ais}** aislamientos, **${exp}** expulsiones y **${ban}** baneos.`)
                                        .setColor(colorEmb)
                                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                        .setTimestamp()

                                    setTimeout(() => {
                                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embHistorial], components: [botones] }).then(mensaje => {
                                            botDB.historial.push({ mensajeID: mensaje.id, miembroID: miembro.id })
                                            setTimeout(() => {
                                                if (embHistorial.description === mensaje.embeds[0].description) {
                                                    mensaje.edit({ embeds: [embHistorial], components: [] }).catch(c => {
                                                        return;
                                                    })
                                                }
                                            }, 60000)
                                        })
                                    }, 500)
                                }
                            } else {
                                let botones
                                let condicionales = [adv > 0 && ais <= 0 && exp <= 0 && ban <= 0, adv <= 0 && ais > 0 && exp <= 0 && ban <= 0, adv <= 0 && ais <= 0 && exp > 0 && ban <= 0, adv <= 0 && ais <= 0 && exp <= 0 && ban > 0, adv > 0 && ais > 0 && exp <= 0 && ban <= 0, adv > 0 && ais <= 0 && exp > 0 && ban <= 0, adv > 0 && ais <= 0 && exp <= 0 && ban > 0, adv > 0 && ais > 0 && exp > 0 && ban <= 0, adv > 0 && ais <= 0 && exp > 0 && ban > 0, adv > 0 && ais > 0 && exp <= 0 && ban > 0, adv <= 0 && ais > 0 && exp > 0 && ban > 0, adv <= 0 && ais > 0 && exp > 0 && ban <= 0, adv <= 0 && ais > 0 && exp <= 0 && ban > 0, adv <= 0 && ais <= 0 && exp > 0 && ban > 0, adv > 0 && ais > 0 && exp > 0 && ban > 0]
                                let valorBotones = [botones1, botones2, botones3, botones4, botones5, botones6, botones7, botones8, botones9, botones10, botones11, botones12, botones13, botones14, botones15]
                                for (let i = 0; i < condicionales.length; i++) {
                                    if (condicionales[i]) {
                                        botones = valorBotones[i]
                                    }
                                }

                                const embHistorial = new EmbedBuilder()
                                    .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                    .setTitle("<:historial:949522609266110485> Historial")
                                    .setDescription(`${miembro} tienes **${advert}** advertencias, **${aislam}** aislamientos, **${expuls}** expulsiones y **${baneos}** baneos.\n\nEn los **${dataHis.usuarios[posicionUS].servidores.filter(f => f.advertencias.length > 0 || f.aislamientos.length > 0 || f.expulsiones.length > 0 || f.baneos.length > 0).length}** servidores que tengo registro sobre ti tienes un total de **${adv}** advertencias, **${ais}** aislamientos, **${exp}** expulsiones y **${ban}** baneos.`)
                                    .setColor(colorEmb)
                                    .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                    .setTimestamp()

                                setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embHistorial], components: [botones] }).then(mensaje => {
                                        botDB.historial.push({ mensajeID: mensaje.id, miembroID: miembro.id })
                                        setTimeout(() => {
                                            if (embHistorial.description === mensaje.embeds[0].description) {
                                                mensaje.edit({ embeds: [embHistorial], components: [] }).catch(c => {
                                                    return;
                                                })
                                            }
                                        }, 60000)
                                    })
                                }, 500)
                            }
                        } else {
                            if ((adv + ais + exp + ban) <= 0) {
                                const embHistorial = new EmbedBuilder()
                                    .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                    .setTitle("<:historial:949522609266110485> Historial")
                                    .setDescription(`*${miembro} no tienes sanciones en ningun servidor de los **${dataHis.usuarios[posicionUS].servidores.length}** servidores en donde antes si tenias sanciones.*`)
                                    .setColor(colorEmb)
                                    .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                    .setTimestamp()
                                setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embHistorial] })
                                }, 500)
                            } else {
                                let botones
                                let condicionales = [adv > 0 && ais <= 0 && exp <= 0 && ban <= 0, adv <= 0 && ais > 0 && exp <= 0 && ban <= 0, adv <= 0 && ais <= 0 && exp > 0 && ban <= 0, adv <= 0 && ais <= 0 && exp <= 0 && ban > 0, adv > 0 && ais > 0 && exp <= 0 && ban <= 0, adv > 0 && ais <= 0 && exp > 0 && ban <= 0, adv > 0 && ais <= 0 && exp <= 0 && ban > 0, adv > 0 && ais > 0 && exp > 0 && ban <= 0, adv > 0 && ais <= 0 && exp > 0 && ban > 0, adv > 0 && ais > 0 && exp <= 0 && ban > 0, adv <= 0 && ais > 0 && exp > 0 && ban > 0, adv <= 0 && ais > 0 && exp > 0 && ban <= 0, adv <= 0 && ais > 0 && exp <= 0 && ban > 0, adv <= 0 && ais <= 0 && exp > 0 && ban > 0, adv > 0 && ais > 0 && exp > 0 && ban > 0]
                                let valorBotones = [botones1, botones2, botones3, botones4, botones5, botones6, botones7, botones8, botones9, botones10, botones11, botones12, botones13, botones14, botones15]
                                for (let i = 0; i < condicionales.length; i++) {
                                    if (condicionales[i]) {
                                        botones = valorBotones[i]
                                    }
                                }

                                const embHistorial = new EmbedBuilder()
                                    .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                    .setTitle("<:historial:949522609266110485> Historial")
                                    .setDescription(`*${miembro} no tienes historial de sanciones en este servidor.*\n\nEn los **${dataHis.usuarios[posicionUS].servidores.filter(f => f.advertencias.length > 0 || f.aislamientos.length > 0 || f.expulsiones.length > 0 || f.baneos.length > 0).length}** servidores que tengo registro sobre ti tienes un total de **${adv}** advertencias, **${ais}** aislamientos, **${exp}** expulsiones y **${ban}** baneos.`)
                                    .setColor(colorEmb)
                                    .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                    .setTimestamp()

                                setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embHistorial], components: [botones] }).then(mensaje => {
                                        botDB.historial.push({ mensajeID: mensaje.id, miembroID: miembro.id })
                                        setTimeout(() => {
                                            if (embHistorial.description === mensaje.embeds[0].description) {
                                                mensaje.edit({ embeds: [embHistorial], components: [] }).catch(c => {
                                                    return;
                                                })
                                            }
                                        }, 60000)
                                    })
                                }, 500)
                            }
                        }
                    } else {
                        const embHistorial = new EmbedBuilder()
                            .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                            .setTitle("<:historial:949522609266110485> Historial")
                            .setDescription(`*${miembro} no tienes historial de sanciones.*`)
                            .setColor(colorEmb)
                            .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                            .setTimestamp()
                        setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embHistorial] })
                        }, 500)
                    }
                } else {
                    const embErr1 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El miembro proporcionado ${miembro} es un bot, los bots no pueden tener historial de sanciones.`)
                        .setColor(ColorError)
                        .setTimestamp()
                    if (miembro.user.bot) return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr1] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)

                    if (dataHis.usuarios.some(s => s.id === miembro.id)) {
                        let posicionUS
                        let adv = 0
                        let ais = 0
                        let exp = 0
                        let ban = 0
                        for (let i = 0; i < dataHis.usuarios.length; i++) {
                            if (dataHis.usuarios[i].id === miembro.id) {
                                posicionUS = i
                                for (let m = 0; m < dataHis.usuarios[i].servidores.length; m++) {
                                    adv += dataHis.usuarios[i].servidores[m].advertencias.length
                                    ais += dataHis.usuarios[i].servidores[m].aislamientos.length
                                    exp += dataHis.usuarios[i].servidores[m].expulsiones.length
                                    ban += dataHis.usuarios[i].servidores[m].baneos.length
                                }
                            }
                        }

                        if (dataHis.usuarios[posicionUS].servidores.some(s => s.id === msg.guildId)) {
                            let posicionSV
                            for (let s = 0; s < dataHis.usuarios[posicionUS].servidores.length; s++) {
                                if (dataHis.usuarios[posicionUS].servidores[s].id === msg.guildId) {
                                    posicionSV = s
                                }
                            }
                            let advert = dataHis.usuarios[posicionUS].servidores[posicionSV].advertencias.length
                            let aislam = dataHis.usuarios[posicionUS].servidores[posicionSV].aislamientos.length
                            let expuls = dataHis.usuarios[posicionUS].servidores[posicionSV].expulsiones.length
                            let baneos = dataHis.usuarios[posicionUS].servidores[posicionSV].baneos.length

                            if ((advert + aislam + expuls + baneos) <= 0) {
                                if ((adv + ais + exp + ban) <= 0) {
                                    const embHistorial = new EmbedBuilder()
                                        .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                        .setTitle("<:historial:949522609266110485> Historial")
                                        .setDescription(`*El miembro ${miembro} no tiene sanciones en ningun servidor de los **${dataHis.usuarios[posicionUS].servidores.filter(f => f.advertencias.length > 0 || f.aislamientos.length > 0 || f.expulsiones.length > 0 || f.baneos.length > 0).length}** servidores en donde antes si tenia sanciones.*`)
                                        .setColor(colorEmb)
                                        .setFooter({text: miembro.nickname || miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                                        .setTimestamp()
                                    setTimeout(() => {
                                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embHistorial] })
                                    }, 500)
                                } else {
                                    let botones
                                    let condicionales = [adv > 0 && ais <= 0 && exp <= 0 && ban <= 0, adv <= 0 && ais > 0 && exp <= 0 && ban <= 0, adv <= 0 && ais <= 0 && exp > 0 && ban <= 0, adv <= 0 && ais <= 0 && exp <= 0 && ban > 0, adv > 0 && ais > 0 && exp <= 0 && ban <= 0, adv > 0 && ais <= 0 && exp > 0 && ban <= 0, adv > 0 && ais <= 0 && exp <= 0 && ban > 0, adv > 0 && ais > 0 && exp > 0 && ban <= 0, adv > 0 && ais <= 0 && exp > 0 && ban > 0, adv > 0 && ais > 0 && exp <= 0 && ban > 0, adv <= 0 && ais > 0 && exp > 0 && ban > 0, adv <= 0 && ais > 0 && exp > 0 && ban <= 0, adv <= 0 && ais > 0 && exp <= 0 && ban > 0, adv <= 0 && ais <= 0 && exp > 0 && ban > 0, adv > 0 && ais > 0 && exp > 0 && ban > 0]
                                    let valorBotones = [botones1, botones2, botones3, botones4, botones5, botones6, botones7, botones8, botones9, botones10, botones11, botones12, botones13, botones14, botones15]
                                    for (let i = 0; i < condicionales.length; i++) {
                                        if (condicionales[i]) {
                                            botones = valorBotones[i]
                                        }
                                    }
                                    const embHistorial = new EmbedBuilder()
                                        .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                        .setTitle("<:historial:949522609266110485> Historial")
                                        .setDescription(`*El miembro ${miembro} no tiene sanciones en este servidor.*\n\nEn los **${dataHis.usuarios[posicionUS].servidores.filter(f => f.advertencias.length > 0 || f.aislamientos.length > 0 || f.expulsiones.length > 0 || f.baneos.length > 0).length}** servidores que tengo registro sobre el miembro tiene un total de **${adv}** advertencias, **${ais}** aislamientos, **${exp}** expulsiones y **${ban}** baneos.`)
                                        .setColor(colorEmb)
                                        .setFooter({text: miembro.nickname || miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                                        .setTimestamp()

                                    setTimeout(() => {
                                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embHistorial], components: [botones] }).then(mensaje => {
                                            botDB.historial.push({ mensajeID: mensaje.id, miembroID: miembro.id })
                                            setTimeout(() => {
                                                if (embHistorial.description === mensaje.embeds[0].description) {
                                                    mensaje.edit({ embeds: [embHistorial], components: [] }).catch(c => {
                                                        return;
                                                    })
                                                }
                                            }, 60000)
                                        })
                                    }, 500)
                                }
                            } else {
                                let botones
                                let condicionales = [adv > 0 && ais <= 0 && exp <= 0 && ban <= 0, adv <= 0 && ais > 0 && exp <= 0 && ban <= 0, adv <= 0 && ais <= 0 && exp > 0 && ban <= 0, adv <= 0 && ais <= 0 && exp <= 0 && ban > 0, adv > 0 && ais > 0 && exp <= 0 && ban <= 0, adv > 0 && ais <= 0 && exp > 0 && ban <= 0, adv > 0 && ais <= 0 && exp <= 0 && ban > 0, adv > 0 && ais > 0 && exp > 0 && ban <= 0, adv > 0 && ais <= 0 && exp > 0 && ban > 0, adv > 0 && ais > 0 && exp <= 0 && ban > 0, adv <= 0 && ais > 0 && exp > 0 && ban > 0, adv <= 0 && ais > 0 && exp > 0 && ban <= 0, adv <= 0 && ais > 0 && exp <= 0 && ban > 0, adv <= 0 && ais <= 0 && exp > 0 && ban > 0, adv > 0 && ais > 0 && exp > 0 && ban > 0]
                                let valorBotones = [botones1, botones2, botones3, botones4, botones5, botones6, botones7, botones8, botones9, botones10, botones11, botones12, botones13, botones14, botones15]
                                for (let i = 0; i < condicionales.length; i++) {
                                    if (condicionales[i]) {
                                        botones = valorBotones[i]
                                    }
                                }

                                const embHistorial = new EmbedBuilder()
                                    .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                    .setTitle("<:historial:949522609266110485> Historial")
                                    .setDescription(`El miembro ${miembro} tiene en este servidor **${advert}** advertencias, **${aislam}** aislamientos, **${expuls}** expulsiones y **${baneos}** baneos.\n\nEn los **${dataHis.usuarios[posicionUS].servidores.filter(f => f.advertencias.length > 0 || f.aislamientos.length > 0 || f.expulsiones.length > 0 || f.baneos.length > 0).length}** servidores que tengo registro sobre el miembro tiene un total de **${adv}** advertencias, **${ais}** aislamientos, **${exp}** expulsiones y **${ban}** baneos.`)
                                    .setColor(colorEmb)
                                    .setFooter({text: miembro.nickname || miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                                    .setTimestamp()

                                setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embHistorial], components: [botones] }).then(mensaje => {
                                        botDB.historial.push({ mensajeID: mensaje.id, miembroID: miembro.id })
                                        setTimeout(() => {
                                            if (embHistorial.description === mensaje.embeds[0].description) {
                                                mensaje.edit({ embeds: [embHistorial], components: [] }).catch(c => {
                                                    return;
                                                })
                                            }
                                        }, 60000)
                                    })
                                }, 500)
                            }
                        } else {
                            if ((adv + ais + exp + ban) <= 0) {
                                const embHistorial = new EmbedBuilder()
                                    .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                    .setTitle("<:historial:949522609266110485> Historial")
                                    .setDescription(`*El miembro ${miembro} no tiene sanciones en ningun servidor de los **${dataHis.usuarios[posicionUS].servidores.length}** servidores en donde antes si tenia sanciones.*`)
                                    .setColor(colorEmb)
                                    .setFooter({text: miembro.nickname || miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                                    .setTimestamp()
                                setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embHistorial] })
                                }, 500)
                            } else {
                                let botones
                                let condicionales = [adv > 0 && ais <= 0 && exp <= 0 && ban <= 0, adv <= 0 && ais > 0 && exp <= 0 && ban <= 0, adv <= 0 && ais <= 0 && exp > 0 && ban <= 0, adv <= 0 && ais <= 0 && exp <= 0 && ban > 0, adv > 0 && ais > 0 && exp <= 0 && ban <= 0, adv > 0 && ais <= 0 && exp > 0 && ban <= 0, adv > 0 && ais <= 0 && exp <= 0 && ban > 0, adv > 0 && ais > 0 && exp > 0 && ban <= 0, adv > 0 && ais <= 0 && exp > 0 && ban > 0, adv > 0 && ais > 0 && exp <= 0 && ban > 0, adv <= 0 && ais > 0 && exp > 0 && ban > 0, adv <= 0 && ais > 0 && exp > 0 && ban <= 0, adv <= 0 && ais > 0 && exp <= 0 && ban > 0, adv <= 0 && ais <= 0 && exp > 0 && ban > 0, adv > 0 && ais > 0 && exp > 0 && ban > 0]
                                let valorBotones = [botones1, botones2, botones3, botones4, botones5, botones6, botones7, botones8, botones9, botones10, botones11, botones12, botones13, botones14, botones15]
                                for (let i = 0; i < condicionales.length; i++) {
                                    if (condicionales[i]) {
                                        botones = valorBotones[i]
                                    }
                                }

                                const embHistorial = new EmbedBuilder()
                                    .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                    .setTitle("<:historial:949522609266110485> Historial")
                                    .setDescription(`*El miembro ${miembro} no tiene historial de sanciones en este servidor.*\n\nEn los **${dataHis.usuarios[posicionUS].servidores.filter(f => f.advertencias.length > 0 || f.aislamientos.length > 0 || f.expulsiones.length > 0 || f.baneos.length > 0).length}** servidores que tengo registro sobre el miembro tiene un total de **${adv}** advertencias, **${ais}** aislamientos, **${exp}** expulsiones y **${ban}** baneos.`)
                                    .setColor(colorEmb)
                                    .setFooter({text: miembro.nickname || miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                                    .setTimestamp()

                                setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embHistorial], components: [botones] }).then(mensaje => {
                                        botDB.historial.push({ mensajeID: mensaje.id, miembroID: miembro.id })
                                        setTimeout(() => {
                                            if (embHistorial.description === mensaje.embeds[0].description) {
                                                mensaje.edit({ embeds: [embHistorial], components: [] }).catch(c => {
                                                    return;
                                                })
                                            }
                                        }, 60000)
                                    })
                                }, 500)
                            }
                        }
                    } else {
                        const embHistorial = new EmbedBuilder()
                            .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                            .setTitle("<:historial:949522609266110485> Historial")
                            .setDescription(`*El miembro ${miembro} no tiene historial de sanciones.*`)
                            .setColor(colorEmb)
                            .setFooter({text: miembro.nickname || miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                            .setTimestamp()
                        setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embHistorial] })
                        }, 500)
                    }
                }
            } else {
                let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`, `El argumento proporcionado *(${args[0]})* tiene las caracteristicas de una **ID**, es numérico, contiene **18** caracteres pero no coresponde con la **ID** de ningun miembro del servidor.`]
                let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0]), args[0].length == 18]

                for (let i = 0; i < descripciones.length; i++) {
                    if (condicionales[i]) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }
            }
        }

        if (["deleterecord", "delrecord", "eliminarregistro", "delregistro"].some(s => comando == s)) {
            botDB.comandos.usos++
            msg.channel.sendTyping()
            let dataHis = await historialesDB.findById(client.user.id)
            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag == args.join(" ")) || false, sancion = args[1]

            let alias = ["deleterecord", "delrecord", "eliminarregistro", "delregistro"]
            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando deleterecord`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}deleterecord <Miembro> <Tipo de sanción> <Cantidad de sanciones a eliminar>\`\`` },
                    { name: "Ejemplos: **3**", value: `${prefijo}deleterecord ${msg.author} advertencias ${Math.floor(Math.random() * (20 - 1) + 1)}\n${prefijo}deleterecord ${msg.author.id} aislamientos ${Math.floor(Math.random() * (20 - 1) + 1)}\n${prefijo}deleterecord ${msg.author.tag} expulsiones ${Math.floor(Math.random() * (20 - 1) + 1)}` },
                    { name: `Alias: **${alias.length}**`, value: alias.map(m => `\`\`${m}\`\``).join(`, `) },
                    { name: "Descripción:", value: `Elimina sanciones del historial de un miembro del servidor.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let erroresP = [
                { condicion: !miembro && !isNaN(args[0]) && args[0].length < 18, descripcion: `El argumento numérico proporcionado *(${args[0]})* no es una **ID** valida ya que contiene menos de **18** caracteres numéricos, una **ID** esta constituida por **18** caracteres numéricos.` },
                { condicion: !miembro && !isNaN(args[0]) && args[0].length > 18, descripcion: `El argumento numérico proporcionado *(${args[0]})* no es una **ID** ya que contiene mas de **18** caracteres numéricos, una **ID** esta constituida por 18 caracteres numéricos.` },
                { condicion: !miembro && isNaN(args[0]), descripcion: `El argumento proporcionado *(${args[0]})* no se reconoce como una **mención**, **ID** o **etiqueta** de un miembro del servidor, proporciona una **mención**, **ID** o **etiqueta** valida de un miembro del servidor.` },
                { condicion: !miembro && args[0].length == 18, descripcion: `El argumento proporcionado *(${args[0]})* tiene todas las caracteristicas de una **ID** es numérico y contines **18** caracteres numéricos pero no es una **ID** de ningun miembro de este servidor.` },
            ]
            if (erroresMsg(msg, erroresP)) return;

            let miembData = miembro ? dataHis.usuarios.some(s => s.id == miembro.id) : false, serverUserData = miembData ? dataHis.usuarios.find(f => f.id == miembro.id).servidores.some(s => s.id == msg.guildId) ? true : false : false
            let erroresP2 = [
                { condicion: !msg.member.permissions.has('Administrator'), descripcion: `No tienes los permisos suficientes para ejecutar el comando.` },
                { condicion: miembro && miembro.id == client.user.id, descripcion: `El miembro proporcionado *(${miembro})* soy yo, yo soy un bot por lo tanto no tengo historial de sanciones.` },
                { condicion: miembro && miembro.user.bot, descripcion: `El miembro proporcionado *(${miembro})* es un bot, los bots no tienen historial de sanciones.` },
                { condicion: miembro && msg.author.id != msg.guild.ownerId && miembro.id != msg.author.id && msg.member.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, descripcion: `El rol con la posicion mas alta del miembro proporcionado *(${miembro})* tiene una posicion igual o mayor a tu rol mas alto por lo tanto no le puedes eliminar ninguna sancion de su historial.` },
                { condicion: miembro && !miembData, descripcion: `El miembro proporcionado *(${miembro})* no tiene historial de sanciones por lo tanto no tiene sanciones que puedas eliminarle.` },
                { condicion: miembro && !serverUserData, descripcion: `El miembro proporcionado *(${miembro})* no tiene sanciones en este servidor por lo tanto no le puedes eliminar ninguna sanción.` },
                { condicion: miembro && !sancion, descripcion: `No has proporcionado el tipo de sanción que eliminaras del historial del miembro, puedes consultar las sanciones que tiene el miembro utilizando el comando \`\`${prefijo}record\`\`.` },
                { condicion: miembro && sancion && !["warns", "timeouts", "kicks", "bans", "advertencias", "aislamientos", "expulsiones", "baneos"].some(s => s == sancion.toLowerCase()), descripcion: `El segundo argumento proporcionado *(${args[1]})* no es un tipo de sanción, proporciona el tipo de sanción que le eliminaras del historial al miembro.` },
                { condicion: miembro && !args[2], descripcion: `No has proporcionado el tercer y ultimo argumento el cual es la cantidad de sanciones que eliminaras del historial del miembro.` },
                { condicion: miembro && isNaN(args[2]), descripcion: `El tercer argumento proporcionado *(${args[2]})* no es numérico, proporciona un argumentó numérico con la cantidad de sanciones a eliminar.` },
                { condicion: miembro && args[2] <= 0, descripcion: `El tercer argumento proporcionado *(${args[2]})* es **0** o un número menor negativo, no puedes eliminar 0 o una cantidad negativa de sanciones.` },
                { condicion: miembro && ["warns", "advertencias"].some(s => s == args[1].toLowerCase()) && serverUserData && dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).advertencias.length == 0, descripcion: miembro.id == msg.author.id ? `No tienes registros de advertencias que puedas eliminarte de este servidor.` : `El miembro proporcionado *(${miembro})* no tiene registros de advertencias que puedas eliminarle de este servidor.` },
                { condicion: miembro && ["timeouts", "aislamientos"].some(s => s == args[1].toLowerCase()) && serverUserData && dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).aislamientos.length == 0, descripcion: miembro.id == msg.author.id ? `No tienes registros de aislamientos que puedas eliminarte de este servidor.` : `El miembro proporcionado *(${miembro})* no tiene registros de aislamientos que puedas eliminarle de este servidor.` },
                { condicion: miembro && ["kicks", "expulsiones"].some(s => s == args[1].toLowerCase()) && serverUserData && dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).expulsiones.length == 0, descripcion: miembro.id == msg.author.id ? `No tienes registros de expulsiones que puedas eliminarte de este servidor.` : `El miembro proporcionado *(${miembro})* no tiene registros de expulsiones que puedas eliminarle de este servidor.` },
                { condicion: miembro && ["bans", "baneos"].some(s => s == args[1].toLowerCase()) && serverUserData && dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).baneos.length == 0, descripcion: miembro.id == msg.author.id ? `No tienes registros de baneos que puedas eliminarte de este servidor.` : `El miembro proporcionado *(${miembro})* no tiene registros de baneos que puedas eliminarle de este servidor.` },
                { condicion: miembro && ["warns", "advertencias"].some(s => s == args[1].toLowerCase()) && serverUserData && dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).advertencias.length < Math.floor(args[2]), descripcion: miembro.id == msg.author.id ? `Tienes **${dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).advertencias.length}** registros de advertencias y te quieres eliminar **${Math.floor(args[2])}**, no te puedes eliminar mas registros de advertencias de los que tienes.` : `El miembro proporcionado *(${miembro})* tiene **${dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).advertencias.length}** registros de advertencias y le quieres eliminar **${Math.floor(args[2])}**, no le puedes eliminar mas registros de advertencias de los que tiene.` },
                { condicion: miembro && ["timeouts", "aislamientos"].some(s => s == args[1].toLowerCase()) && serverUserData && dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).aislamientos.length < Math.floor(args[2]), descripcion: miembro.id == msg.author.id ? `Tienes **${dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).aislamientos.length}** registros de aislamientos y te quieres eliminar **${Math.floor(args[2])}**, no te puedes eliminar mas registros de aislamientos de los que tienes.` : `El miembro proporcionado *(${miembro})* tiene **${dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).aislamientos.length}** registros de aislamientos y le quieres eliminar **${Math.floor(args[2])}**, no le puedes eliminar mas registros de aislamientos de los que tiene.` },
                { condicion: miembro && ["kicks", "expulsiones"].some(s => s == args[1].toLowerCase()) && serverUserData && dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).expulsiones.length < Math.floor(args[2]), descripcion: miembro.id == msg.author.id ? `Tienes **${dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).expulsiones.length}** registros de expulsiones y te quieres eliminar **${Math.floor(args[2])}**, no te puedes eliminar mas registros de expulsiones de los que tienes.` : `El miembro proporcionado *(${miembro})* tiene **${dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).expulsiones.length}** registros de expulsiones y le quieres eliminar **${Math.floor(args[2])}**, no le puedes eliminar mas registros de expulsiones de los que tiene.` },
                { condicion: miembro && ["bans", "baneos"].some(s => s == args[1].toLowerCase()) && serverUserData && dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).baneos.length < Math.floor(args[2]), descripcion: miembro.id == msg.author.id ? `Tienes **${dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).baneos.length}** registros de baneos y te quieres eliminar **${Math.floor(args[2])}**, no te puedes eliminar mas registros de baneos de los que tienes.` : `El miembro proporcionado *(${miembro})* tiene **${dataHis.usuarios.find(f => f.id == miembro.id).servidores.find(f => f.id == msg.guildId).baneos.length}** registros de baneos y le quieres eliminar **${Math.floor(args[2])}**, no le puedes eliminar mas registros de baneos de los que tiene.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresMsg(msg, erroresP2)) return;

            const embDeleteHis = new EmbedBuilder()
                .setAuthor({ name: msg.member.nickname ? msg.member.nickname : msg.author.username, iconURL: msg.author.displayAvatarURL() })
                .setColor('Green')
                .setFooter(miembro.id == msg.author.id ? { text: msg.guild.name, iconURL: msg.guild.iconURL() } : { text: miembro.user.tag, iconURL: miembro.displayAvatarURL() })
                .setTimestamp()

            if (["warns", "advertencias"].some(s => s == args[1].toLowerCase())) {
                let objeto = dataHis.sanciones, array = dataHis.usuarios
                objeto.advertencias -= Math.floor(args[2])
                array.find(f => f.id == miembro.id).servidores.find(s => s.id == msg.guildId).advertencias.splice(0, Math.floor(args[2]))
                await historialesDB.findByIdAndUpdate(client.user.id, { sanciones: objeto, usuarios: array })

                embDeleteHis
                    .setTitle(`${emojis.acierto} Advertencias eliminadas`)
                    .setDescription(`Se ${miembro.id == msg.author.id ? "te ha" : "le han"} eliminado **${Math.floor(args[2])}** registros de advertencias ${miembro.id == msg.author.id ? `de` : `del miembro ${miembro} de`} este servidor.`)
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embDeleteHis] })
                }, 500)
            }

            if (["timeouts", "aislamientos"].some(s => s == args[1].toLowerCase())) {
                let objeto = dataHis.sanciones, array = dataHis.usuarios
                objeto.aislamientos -= Math.floor(args[2])
                array.find(f => f.id == miembro.id).servidores.find(s => s.id == msg.guildId).aislamientos.splice(0, Math.floor(args[2]))
                await historialesDB.findByIdAndUpdate(client.user.id, { sanciones: objeto, usuarios: array })

                embDeleteHis
                    .setTitle(`${emojis.acierto} Aislamientos eliminados`)
                    .setDescription(`Se ${miembro.id == msg.author.id ? "te ha" : "le han"} eliminado **${Math.floor(args[2])}** registros de aislamientos ${miembro.id == msg.author.id ? `de` : `del miembro ${miembro} de`} este servidor.`)
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embDeleteHis] })
                }, 500)
            }

            if (["kicks", "expulsiones"].some(s => s == args[1].toLowerCase())) {
                let objeto = dataHis.sanciones, array = dataHis.usuarios
                objeto.expulsiones -= Math.floor(args[2])
                array.find(f => f.id == miembro.id).servidores.find(s => s.id == msg.guildId).expulsiones.splice(0, Math.floor(args[2]))
                await historialesDB.findByIdAndUpdate(client.user.id, { sanciones: objeto, usuarios: array })

                embDeleteHis
                    .setTitle(`${emojis.acierto} Expulsiones eliminadas`)
                    .setDescription(`Se ${miembro.id == msg.author.id ? "te ha" : "le han"} eliminado **${Math.floor(args[2])}** registros de expulsiones ${miembro.id == msg.author.id ? `de` : `del miembro ${miembro} de`} este servidor.`)
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embDeleteHis] })
                }, 500)
            }

            if (["bans", "baneos"].some(s => s == args[1].toLowerCase())) {
                let objeto = dataHis.sanciones, array = dataHis.usuarios
                objeto.baneos -= Math.floor(args[2])
                array.find(f => f.id == miembro.id).servidores.find(s => s.id == msg.guildId).baneos.splice(0, Math.floor(args[2]))
                await historialesDB.findByIdAndUpdate(client.user.id, { sanciones: objeto, usuarios: array })

                embDeleteHis
                    .setTitle(`${emojis.acierto} Baneos eliminados`)
                    .setDescription(`Se ${miembro.id == msg.author.id ? "te ha" : "le han"} eliminado **${Math.floor(args[2])}** registros de baneos ${miembro.id == msg.author.id ? `de` : `del miembro ${miembro} de`} este servidor.`)
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embDeleteHis] })
                }, 500)
            }
        }// 922 lineas a 117

        if (["warn", "advertir"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let dataHis = await historialesDB.findOne({ _id: client.user.id })
            const embErr1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Permiso requerido: Aislar miembros, Expulsar miembros o Banear miembros."})
                .setTimestamp()
            if (!msg.member.permissions.has('ModerateMembers') && !msg.member.permissions.has('KickMembers') && !msg.member.permissions.has('BanMembers')) {
                return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr1] }).then(dt => setTimeout(() => {
                        msg.delete().catch(c => {
                            return;
                        })
                        dt.delete().catch(e => {
                            return;
                        })
                    }, 30000))
                }, 500)
            }

            if (!cooldowns.has("warn")) {
                cooldowns.set("warn", new Collection())
            }

            const tiempoActual = Date.now()
            const datosComando = cooldowns.get("warn")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
                console.log(tiempoUltimo - tiempoActual)

                const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
                const embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando warn")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }


            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando warn`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}warn <Mencion del miembro> <Razón>\`\`\n\`\`${prefijo}warn <ID del miembro> <Razón>\`\`\n\`\`${prefijo}warn <Tag/etiqueta del miembro> <Razón>\`\`` },
                    { name: "Ejemplos: **3**", value: `${prefijo}warn ${msg.author} Mal uso de canales.\n${prefijo}warn ${msg.author.id} Uso de palabras in adecuadas.\n${prefijo}warn ${msg.author.tag} Crear un conflicto.` },
                    { name: "Alias: **2**", value: `\`\`warn\`\`, \`\`advertir\`\`` },
                    { name: "Descripción:", value: `Envía una advertencia aun miembro del servidor por medio del bot.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500);


            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag === args[0])
            let razon = args.slice(1).join(" ")

            if (!miembro) {
                let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`, `El argumento proporcionado *(${args[0]})* tiene las características de una ID, es numérico, contiene **18** caracteres pero no es una ID de ningún miembro del servidor.`]
                let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0]), !msg.guild.members.cache.find(f => f.id == args[0])]

                for (let i = 0; i < descripciones.length; i++) {
                    if (condicionales[i]) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }
            }

            if (miembro) {
                if (msg.author.id === msg.guild.ownerId) {
                    const embErr0 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`No he podido enviar la advertencia al usuario, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                        .setColor(ColorError)
                        .setTimestamp()

                    let descripciones = [`El usuario proporcionado soy yo, no me puedo advertir a mi mismo.`, `El usuario proporcionado es un bot, no puedes advertir a un bot.`, `¿Por que quieres advertirte a ti mismo si eres el propietario del servidor?, no puedo realizar esa acción.`, `No has proporcionado una razón, proporciona una razón de la advertencia.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionales = [miembro.id === client.user.id, miembro.user.bot, miembro.id === msg.author.id, !razon, razon.length > 1000]

                    for (let i = 0; i < descripciones.length; i++) {
                        if (condicionales[i]) {
                            const embErrMiembro = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[i])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    dt.delete().catch(e => {
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embMencion = new EmbedBuilder()
                        .setAuthor({name: msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setThumbnail(miembro.user.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                        .setTitle("<:advertencia:929204500739268608> Miembro advertido")
                        .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.id}\n\n📝 **razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#E5DA00")
                        .setFooter({text: miembro.user.tag, iconURL: miembro.user.displayAvatarURL()})
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMencion] })
                    }, 500)

                    const embMDMencion = new EmbedBuilder()
                        .setAuthor({name: miembro.user.tag, iconURL: miembro.user.displayAvatarURL()})
                        .setTitle("<:advertencia:929204500739268608> Has sido advertido")
                        .setDescription(`📝 **Por la razón:**\n${razon}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                        .setColor("#E5DA00")
                        .setFooter({text: `En el servidor: ${msg.guild.name}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    miembro.send({ embeds: [embMDMencion] }).catch(c => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr0] }).then(tm => setTimeout(() => {
                            msg.delete().catch(cm => {
                                return;
                            })
                            tm.delete().catch(e => {
                                return;
                            })
                        }, 30000))
                    })

                    if (dataHis.usuarios.some(s => s.id === miembro.id)) {
                        let posicion
                        for (let i = 0; i < dataHis.usuarios.length; i++) {
                            if (dataHis.usuarios[i].id === miembro.id) {
                                posicion = i
                            }
                        }

                        if (dataHis.usuarios[posicion].servidores.some(s => s.id === msg.guildId)) {
                            let guiPosicion
                            for (let g = 0; g < dataHis.usuarios[posicion].servidores.length; g++) {
                                if (dataHis.usuarios[posicion].servidores[g].id === msg.guildId) {
                                    guiPosicion = g
                                }
                            }

                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores[guiPosicion].advertencias.push({ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon })

                            dataHis.usuarios[posicion] = momentaneaDB
                        } else {
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores.push({ id: msg.guildId, nombre: msg.guild.name, advertencias: [{ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon }], aislamientos: [], expulsiones: [], baneos: [] })
                            dataHis.usuarios[posicion] = momentaneaDB
                        }
                    } else {
                        dataHis.usuarios.push({ id: miembro.id, tag: miembro.user.tag, servidores: [{ autor: msg.author.id, id: msg.guildId, nombre: msg.guild.name, advertencias: [{ tiempo: Math.floor(msg.createdAt / 1000), razon: razon }], aislamientos: [], expulsiones: [], baneos: [] }] })
                    }

                    let adv = dataHis.sanciones.advertencias
                    let ais = dataHis.sanciones.aislamientos
                    let exp = dataHis.sanciones.expulsiones
                    let ban = dataHis.sanciones.baneos
                    dataHis.sanciones = { advertencias: adv + 1, aislamientos: ais, expulsiones: exp, baneos: ban }
                    await dataHis.save()

                } else {
                    const embErr0 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`No he podido enviar la advertencia al usuario, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                        .setColor(ColorError)
                        .setTimestamp()

                    let descripciones = [`El usuario proporcionado soy yo, no me puedo advertir a mi mismo.`, `El usuario proporcionado es un bot, no puedes advertir a un bot.`, `¿Por que quieres advertirte a ti mismo?, no puedo realizar esa acción.`, `Ese miembro es el dueño del servidor, no puedes advertir al dueño del servidor.`, `Ese miembro tiene un rol igual o mayor al tuyo por lo tanto no lo puedes advertir.`, `No has proporcionado una razón, proporciona una razón de la advertencia.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionales = [miembro.id === client.user.id, miembro.user.bot, miembro.id === msg.author.id, miembro.id === msg.guild.ownerId, msg.member.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, !razon, razon.length > 1000]

                    for (let i = 0; i < descripciones.length; i++) {
                        if (condicionales[i]) {
                            const embErrMiembro = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[i])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    dt.delete().catch(e => {
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }


                    const embMencion = new EmbedBuilder()
                        .setAuthor({name: msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setThumbnail(miembro.user.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                        .setTitle("<:advertencia:929204500739268608> Miembro advertido")
                        .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.id}\n\n📝 **razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#E5DA00")
                        .setFooter({text: miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMencion] })
                    }, 500)

                    const embMDMencion = new EmbedBuilder()
                        .setAuthor({name: miembro.user.tag, iconURL: miembro.user.displayAvatarURL()})
                        .setTitle("<:advertencia:929204500739268608> Has sido advertido")
                        .setDescription(`📝 **Por la razón:**\n${razon}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                        .setColor("#E5DA00")
                        .setFooter({text: `En el servidor: ${msg.guild.name}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    miembro.send({ embeds: [embMDMencion] }).catch(c => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr0] }).then(tm => setTimeout(() => {
                            msg.delete().catch(cm => {
                                return;
                            })
                            tm.delete().catch(e => {
                                return;
                            })
                        }, 30000))
                    })

                    if (dataHis.usuarios.some(s => s.id === miembro.id)) {
                        let posicion
                        for (let i = 0; i < dataHis.usuarios.length; i++) {
                            if (dataHis.usuarios[i].id === miembro.id) {
                                posicion = i
                            }
                        }

                        if (dataHis.usuarios[posicion].servidores.some(s => s.id === msg.guildId)) {
                            let guiPosicion
                            for (let g = 0; g < dataHis.usuarios[posicion].servidores.length; g++) {
                                if (dataHis.usuarios[posicion].servidores[g].id === msg.guildId) {
                                    guiPosicion = g
                                }
                            }

                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores[guiPosicion].advertencias.push({ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon })

                            dataHis.usuarios[posicion] = momentaneaDB
                        } else {
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores.push({ id: msg.guildId, nombre: msg.guild.name, advertencias: [{ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon }], aislamientos: [], expulsiones: [], baneos: [] })
                            dataHis.usuarios[posicion] = momentaneaDB
                        }
                    } else {
                        dataHis.usuarios.push({ id: miembro.id, tag: miembro.user.tag, servidores: [{ autor: msg.author.id, id: msg.guildId, nombre: msg.guild.name, advertencias: [{ tiempo: Math.floor(msg.createdAt / 1000), razon: razon }], aislamientos: [], expulsiones: [], baneos: [] }] })
                    }

                    let adv = dataHis.sanciones.advertencias
                    let ais = dataHis.sanciones.aislamientos
                    let exp = dataHis.sanciones.expulsiones
                    let ban = dataHis.sanciones.baneos
                    dataHis.sanciones = { advertencias: adv + 1, aislamientos: ais, expulsiones: exp, baneos: ban }
                    await dataHis.save()
                }
            }

            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }

        if (["mute", "aislar"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let dataHis = await historialesDB.findOne({ _id: client.user.id })
            let condicionalesP = [!msg.member.permissions.has('ModerateMembers'), !msg.guild.members.me.permissions.has('ModerateMembers')]
            let descripcionesP = [`No tienes los permisos suficientes para ejecutar el comando.`, `No tengo los permisos suficientes para ejecutar el comando.`]
            for (let p = 0; p < descripcionesP.length; p++) {
                if (condicionalesP[p]) {
                    const embErrMiembro = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripcionesP[p])
                        .setColor(ColorError)
                        .setFooter({text: "Permiso requerido: Aislar temporalmente a miembros"})
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            if (!cooldowns.has("mute")) {
                cooldowns.set("mute", new Collection())
            }

            const tiempoActual = Date.now()
            const datosComando = cooldowns.get("mute")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
                console.log(tiempoUltimo - tiempoActual)

                const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
                const embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando mute")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => client)
                        msg.delete().catch(c => c)
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            let tiempos = ["1m", "5m", "10m", "30m", "1h", "2h", "4h", "8h", "16h", "1d", "2d", "4d", "10d", "20d"]
            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando mute`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}mute <Mencion del miembro> <Tiempo del aislamiento> <Razón>\`\`\n\`\`${prefijo}mute <ID del miembro> <Tiempo del aislamiento> <Razón>\`\`\n\`\`${prefijo}mute <Etiqueta del miembro> <Tiempo del aislamiento> <Razón>\`\`` },
                    { name: "Ejemplos: **3**", value: `${prefijo}mute ${msg.author} ${tiempos[Math.floor(Math.random() * tiempos.length)]} Mal uso de canales.\n${prefijo}mute ${msg.author.id} ${tiempos[Math.floor(Math.random() * tiempos.length)]} Uso de palabras in adecuadas.\n${prefijo}mute ${msg.author.tag} ${tiempos[Math.floor(Math.random() * tiempos.length)]} Publicar enlaces.` },
                    { name: "Alias: **2**", value: `\`\`mute\`\`, \`\`aislar\`\`` },
                    { name: "Descripción:", value: `Aísla a un miembro durante el tiempo que quieras dentro de el servidor, al hacer esto el miembro asilado no podrá interactuar de ninguna forma con el servidor, no podrá enviar mensajes, añadir reacciones, unirse a un canal de voz, etc.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500);

            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag === args[0])
            let tiempo = args.slice(1)[0]
            let razon = args.slice(2).join(" ")

            if (!miembro) {
                let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`, `El argumento proporcionado *(${args[0]})* tiene las caracteristicas de una **ID**, es numérico, contiene **18** caracteres pero no coresponde con la **ID** de ningun miembro del servidor.`]
                let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0]), args[0].length == 18]

                for (let i = 0; i < descripciones.length; i++) {
                    if (condicionales[i]) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }
            }

            if (miembro) {
                if (msg.author.id === msg.guild.ownerId) {
                    const embErr0 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`No he podido enviar al miembro la razón por la que fue aislado, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                        .setColor(ColorError)
                        .setTimestamp()

                    let descripciones = [`El usuario proporcionado soy yo, no me puedo aislar a mi mismo.`, `El usuario proporcionado es un bot, no se puede aislar a un bot.`, `¿Por que quieres aislarte a ti mismo si eres el propietario del servidor?, no puedo realizar esa acción.`, `El miembro proporcionado es un administrador en el servidor o tiene permiso de administrador, no lo puedo aislar.`, `El miembro proporcionado ya esta aislado temporalmente y su aislamiento temporal termina <t:${Math.floor(miembro.communicationDisabledUntilTimestamp / 1000)}:R>`, `No proporcionaste el tiempo que estará aislado el miembro.`]
                    let condicionales = [miembro.id === client.user.id, miembro.user.bot, miembro.id === msg.author.id, miembro.permissions.has('Administrator'), miembro.isCommunicationDisabled(), !tiempo]

                    for (let i = 0; i < descripciones.length; i++) {
                        if (condicionales[i]) {
                            const embErrMiembro = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[i])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    dt.delete().catch(e => {
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embErr1 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`No proporcionaste bien el tiempo el cual durara el miembro aislado.\n\n**Ejemplos:**\n10 minutos = **10m**\n2 horas = **2h**\n5 días = **5d**`)
                        .setColor(ColorError)
                        .setTimestamp()
                    if (!ms(tiempo)) return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr1] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)

                    let descripciones2 = [`No puedes aislar a un miembro por menos de **1** minuto.`, `No puedes aislar a un miembro por mas de **20** días.`, `No has proporcionado una razón, proporciona una razón del aislamiento.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionales2 = [ms(tiempo) < 60000, ms(tiempo) > 1728000000, !razon, razon.length > 1000]

                    for (let i = 0; i < descripciones2.length; i++) {
                        if (condicionales2[i]) {
                            const embErrMiembro = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones2[i])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    dt.delete().catch(e => {
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embMencion = new EmbedBuilder()
                        .setAuthor({name: msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setThumbnail(miembro.user.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                        .setTitle("<:aislacion:947965052772814848> Miembro aislado/a")
                        .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.id}\n\n⏱️ **Aislado/a por:** ${tiempo}\n\n📝 **razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#0283F6")
                        .setFooter({text: miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                        .setTimestamp()
                    miembro.timeout(ms(tiempo), `Miembro aislado/a temporalmente por: ${msg.author.tag} durante ${tiempo} por la razón: ${razon}`).then(ta => {
                        setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMencion] })
                        }, 500)
                    })

                    const embMDMencion = new EmbedBuilder()
                        .setAuthor({name: miembro.user.tag, iconURL: miembro.user.displayAvatarURL()})
                        .setTitle("<:aislacion:947965052772814848> Has sido aislado/a")
                        .setDescription(`⏱️ **Aislado/a por:** ${tiempo}\n\n📝 **Por la razón:**\n${razon}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                        .setColor("#0283F6")
                        .setFooter({text: `En el servidor: ${msg.guild.name}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    miembro.send({ embeds: [embMDMencion] }).catch(c => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr0] }).then(tm => setTimeout(() => {
                            tm.delete().catch(e => {
                                return;
                            })
                        }, 30000))
                    })

                    if (dataHis.usuarios.some(s => s.id === miembro.id)) {
                        let posicion
                        for (let i = 0; i < dataHis.usuarios.length; i++) {
                            if (dataHis.usuarios[i].id === miembro.id) {
                                posicion = i
                            }
                        }

                        if (dataHis.usuarios[posicion].servidores.some(s => s.id === msg.guildId)) {
                            let guiPosicion
                            for (let g = 0; g < dataHis.usuarios[posicion].servidores.length; g++) {
                                if (dataHis.usuarios[posicion].servidores[g].id === msg.guildId) {
                                    guiPosicion = g
                                }
                            }

                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores[guiPosicion].aislamientos.push({ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), aislamiento: tiempo, razon: razon })

                            dataHis.usuarios[posicion] = momentaneaDB
                        } else {
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores.push({ id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [{ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), aislamiento: tiempo, razon: razon }], expulsiones: [], baneos: [] })
                            dataHis.usuarios[posicion] = momentaneaDB
                        }
                    } else {
                        dataHis.usuarios.push({ id: miembro.id, tag: miembro.user.tag, servidores: [{ autor: msg.author.id, id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [{ tiempo: Math.floor(msg.createdAt / 1000), aislamiento: tiempo, razon: razon }], expulsiones: [], baneos: [] }] })
                    }

                    let adv = dataHis.sanciones.advertencias
                    let ais = dataHis.sanciones.aislamientos
                    let exp = dataHis.sanciones.expulsiones
                    let ban = dataHis.sanciones.baneos
                    dataHis.sanciones = { advertencias: adv, aislamientos: ais + 1, expulsiones: exp, baneos: ban }
                    await dataHis.save()

                } else {
                    const embErr0 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`No he podido enviar al miembro la razón por la que fue aislado, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                        .setColor(ColorError)
                        .setTimestamp()

                    let descripciones = [`El usuario proporcionado soy yo, no me puedo aislar a mi mismo.`, `El usuario proporcionado es un bot, no se puede aislar a un bot.`, `¿Por que quieres aislarte a ti mismo?, no puedo realizar esa acción.`, `El miembro proporcionado es el dueño del servidor, no puedes aislar temporalmente al dueño del servidor, nadie puede.`, `El miembro proporcionado es un administrador en el servidor o tiene permiso de administrador, no lo puedo aislar.`, `El miembro proporcionado tiene un rol igual o mayor al tuyo por lo tanto no lo puedes aislar temporalmente.`, `El miembro proporcionado tiene un rol igual o mayor al mío por lo tanto no lo puedo aislar temporalmente.`, `El miembro proporcionado ya esta aislado temporalmente y su aislamiento temporal termina <t:${Math.floor(miembro.communicationDisabledUntilTimestamp / 1000)}:R>`, `No proporcionaste el tiempo que estará aislado el miembro.`]
                    let condicionales = [miembro.id === client.user.id, miembro.user.bot, miembro.id === msg.author.id, miembro.id === msg.guild.ownerId, miembro.permissions.has('Administrator'), msg.member.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, msg.guild.members.me.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, miembro.isCommunicationDisabled(), !tiempo]

                    for (let i = 0; i < descripciones.length; i++) {
                        if (condicionales[i]) {
                            const embErrMiembro = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[i])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    dt.delete().catch(e => {
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embErr1 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`No proporcionaste bien el tiempo el cual durara el miembro aislado.\n\n**Ejemplos:**\n10 minutos = **10m**\n2 horas = **2h**\n5 días = **5d**`)
                        .setColor(ColorError)
                        .setTimestamp()
                    if (!ms(tiempo)) return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr1] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)

                    let descripciones2 = [`No puedes aislar a un miembro por menos de **1** minuto.`, `No puedes aislar a un miembro por mas de **20** días.`, `No has proporcionado una razón, proporciona una razón del aislamiento.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                    let condicionales2 = [ms(tiempo) < 60000, ms(tiempo) > 1728000000, !razon, razon.length > 1000]

                    for (let i = 0; i < descripciones2.length; i++) {
                        if (condicionales2[i]) {
                            const embErrMiembro = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones2[i])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    dt.delete().catch(e => {
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }


                    const embMencion = new EmbedBuilder()
                        .setAuthor({name: msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setThumbnail(miembro.user.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                        .setTitle("<:aislacion:947965052772814848> Miembro aislado/a")
                        .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.id}\n\n⏱️ **Aislado/a por:** ${tiempo}\n\n📝 **razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#0283F6")
                        .setFooter({text: miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                        .setTimestamp()
                    miembro.timeout(ms(tiempo), `Miembro aislado/a temporalmente por: ${msg.author.tag} durante ${tiempo} por la razón: ${razon}`).then(ta => {
                        setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMencion] })
                        }, 500)
                    })

                    const embMDMencion = new EmbedBuilder()
                        .setAuthor({name: miembro.user.tag, iconURL: miembro.user.displayAvatarURL()})
                        .setTitle("<:aislacion:947965052772814848> Has sido aislado/a")
                        .setDescription(`⏱️ **Aislado/a por:** ${tiempo}\n\n📝 **Por la razón:**\n${razon}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                        .setColor("#0283F6")
                        .setFooter({text: `En el servidor: ${msg.guild.name}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    miembro.send({ embeds: [embMDMencion] }).catch(c => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr0] }).then(tm => setTimeout(() => {
                            tm.delete().catch(e => {
                                return;
                            })
                        }, 30000))
                    })

                    if (dataHis.usuarios.some(s => s.id === miembro.id)) {
                        let posicion
                        for (let i = 0; i < dataHis.usuarios.length; i++) {
                            if (dataHis.usuarios[i].id === miembro.id) {
                                posicion = i
                            }
                        }

                        if (dataHis.usuarios[posicion].servidores.some(s => s.id === msg.guildId)) {
                            let guiPosicion
                            for (let g = 0; g < dataHis.usuarios[posicion].servidores.length; g++) {
                                if (dataHis.usuarios[posicion].servidores[g].id === msg.guildId) {
                                    guiPosicion = g
                                }
                            }

                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores[guiPosicion].aislamientos.push({ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), aislamiento: tiempo, razon: razon })

                            dataHis.usuarios[posicion] = momentaneaDB
                        } else {
                            let momentaneaDB = dataHis.usuarios[posicion]
                            momentaneaDB.servidores.push({ id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [{ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), aislamiento: tiempo, razon: razon }], expulsiones: [], baneos: [] })
                            dataHis.usuarios[posicion] = momentaneaDB
                        }
                    } else {
                        dataHis.usuarios.push({ id: miembro.id, tag: miembro.user.tag, servidores: [{ autor: msg.author.id, id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [{ tiempo: Math.floor(msg.createdAt / 1000), aislamiento: tiempo, razon: razon }], expulsiones: [], baneos: [] }] })
                    }

                    let adv = dataHis.sanciones.advertencias
                    let ais = dataHis.sanciones.aislamientos
                    let exp = dataHis.sanciones.expulsiones
                    let ban = dataHis.sanciones.baneos
                    dataHis.sanciones = { advertencias: adv, aislamientos: ais + 1, expulsiones: exp, baneos: ban }
                    await dataHis.save()
                }

            }

            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }

        if (comando == "unmute") {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let condicionalesP = [!msg.member.permissions.has('ModerateMembers'), !msg.guild.members.me.permissions.has('ModerateMembers')]
            let descripcionesP = [`No tienes los permisos suficientes para ejecutar el comando.`, `No tengo los permisos suficientes para ejecutar el comando.`]
            for (let p = 0; p < descripcionesP.length; p++) {
                if (condicionalesP[p]) {
                    const embErrMiembro = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripcionesP[p])
                        .setColor(ColorError)
                        .setFooter({text: "Permiso requerido: Aislar temporalmente a miembros"})
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            if (!cooldowns.has("unmute")) {
                cooldowns.set("unmute", new Collection())
            }

            const tiempoActual = Date.now()
            const datosComando = cooldowns.get("unmute")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
                console.log(tiempoUltimo - tiempoActual)

                const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
                const embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando unmute")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }


            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando unmute`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}unmute <Mencion del miembro>\`\`\n\`\`${prefijo}unmute <ID del miembro>\`\`\n\`\`${prefijo}unmute <Etiqueta del miembro>\`\`` },
                    { name: "Ejemplos: **3**", value: `${prefijo}unmute ${msg.author}\n${prefijo}unmute ${msg.author.id}\n${prefijo}unmute ${msg.author.tag}` },
                    { name: "Alias: **1**", value: `\`\`unmute\`\`` },
                    { name: "Descripción:", value: `Elimina el aislamiento temporal de un miembro.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500);

            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag === args[0])

            if (!miembro) {
                let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`, `El argumento proporcionado *(${args[0]})* tiene las caracteristicas de una **ID**, es numérico, contiene **18** caracteres pero no coresponde con la **ID** de ningun miembro del servidor.`]
                let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0]), args[0].length == 18]

                for (let i = 0; i < descripciones.length; i++) {
                    if (condicionales[i]) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }
            }

            if (miembro) {
                if (msg.author.id === msg.guild.ownerId) {
                    const embErr0 = new EmbedBuilder()
                        .setTitle("<a:negativo:856967325505159169> Error")
                        .setDescription(`No he podido enviar al miembro el mensaje de notificación por su eliminación del aislamiento, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                        .setColor(ColorError)
                        .setTimestamp()

                    let descripciones = [`El miembro proporcionado soy yo, no estoy aislado.`, `El miembro proporcionado es un bot, no se puede aislar a un bot por lo tanto ese bot no esta aislado.`, `El miembro que has proporcionado eres tu, tu no estas aislado temporalmente.`, `El miembro proporcionado no esta aislado temporalmente.`, `El miembro proporcionado es administrador o tiene permiso de administrador, no le puedo eliminar el aislamiento.`]
                    let condicionales = [miembro.id === client.user.id, miembro.user.bot, miembro.id === msg.author.id, !miembro.isCommunicationDisabled(), miembro.permissions.has('Administrator')]

                    for (let i = 0; i < descripciones.length; i++) {
                        if (condicionales[i]) {
                            const embErrMiembro = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[i])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    dt.delete().catch(e => {
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    const embMencion = new EmbedBuilder()
                        .setAuthor({name: msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setThumbnail(miembro.user.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                        .setTitle("<a:afirmativo:856966728806432778> Aislamiento temporal eliminado del miembro")
                        .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.id}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor('Green')
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    miembro.timeout(null, `Aislamiento temporal eliminado del miembro por: ${msg.author.tag}`).then(ta => {
                        setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMencion] })
                        }, 500)
                    })

                    const embMDMencion = new EmbedBuilder()
                        .setAuthor({name: miembro.user.tag, iconURL: miembro.user.displayAvatarURL()})
                        .setTitle("<a:afirmativo:856966728806432778> Tu aislamiento temporal ha sido eliminado")
                        .setDescription(`👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                        .setColor('Green')
                        .setFooter({text: `En el servidor: ${msg.guild.name}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    miembro.send({ embeds: [embMDMencion] }).catch(c => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr0] }).then(tm => setTimeout(() => {
                            tm.delete().catch(e => {
                                return;
                            })
                        }, 30000))
                    })

                } else {
                    const embErr0 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`No he podido enviar al miembro el mensaje de notificación por su eliminación del aislamiento, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                        .setColor(ColorError)
                        .setTimestamp()

                    let descripciones = [`El miembro proporcionado soy yo, no estoy aislado.`, `El miembro proporcionado es un bot, no se puede aislar a un bot por lo tanto ese bot no esta aislado.`, `El miembro que has proporcionado eres tu, tu no estas aislado temporalmente.`, `El miembro proporcionado es el dueño del servidor, nadie lo puede aislar por lo tanto no tiene aislamiento que puedas eliminarle.`, `El miembro proporcionado tiene un rol igual o mayor al tuyo por lo tanto no le puedes eliminar el aislamiento.`, `El miembro proporcionado tiene un rol igual o mayor al mío por lo tanto no le puedo eliminar el aislamiento.`, `El miembro proporcionado no esta aislado temporalmente.`, `El miembro proporcionado es administrador o tiene permiso de administrador, no le puedo eliminar el aislamiento.`]
                    let condicionales = [miembro.id === client.user.id, miembro.user.bot, miembro.id === msg.author.id, miembro.id === msg.guild.ownerId, msg.member.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, msg.guild.members.me.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, !miembro.isCommunicationDisabled(), miembro.permissions.has('Administrator')]

                    for (let i = 0; i < descripciones.length; i++) {
                        if (condicionales[i]) {
                            const embErrMiembro = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[i])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    dt.delete().catch(e => {
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }


                    const embMencion = new EmbedBuilder()
                        .setAuthor({name: msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setThumbnail(miembro.user.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                        .setTitle("<a:afirmativo:856966728806432778> Aislamiento temporal eliminado del miembro")
                        .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.id}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor('Green')
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    miembro.timeout(null, `Aislamiento temporal eliminado del miembro por: ${msg.author.tag}`).then(ta => {
                        setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMencion] })
                        }, 500)
                    })

                    const embMDMencion = new EmbedBuilder()
                        .setAuthor({name: miembro.user.tag, iconURL: miembro.user.displayAvatarURL()})
                        .setTitle("<a:afirmativo:856966728806432778> Tu aislamiento temporal ha sido eliminado")
                        .setDescription(`👮 **Por el moderador:**\n${msg.author}\n**ID:**${msg.author.id}`)
                        .setColor('Green')
                        .setFooter({text: `En el servidor: ${msg.guild.name}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    miembro.send({ embeds: [embMDMencion] }).catch(c => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr0] }).then(tm => setTimeout(() => {
                            tm.delete().catch(e => {
                                return;
                            })
                        }, 30000))
                    })
                }

            }

            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }

        if (["mutelist", "aislados"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let aislados = msg.guild.members.cache.filter(f => f.isCommunicationDisabled())

            const embMuteList = new EmbedBuilder()
                .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                .setTitle("<:aislacion:947965052772814848> Miembros aislados")
                .setDescription(`*No hay miembros aislados en este servidor.*`)
                .setColor("#0083FF")
                .setTimestamp()
            if (aislados.size <= 0) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMuteList] })
            }, 500)

            if (aislados.size <= 10) {
                const embMuteList = new EmbedBuilder()
                    .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("<:aislacion:947965052772814848> Miembros aislados")
                    .setDescription(`Hay un total de **${aislados.size.toLocaleString()}** miembros con aislamiento temporal.\n\n${aislados.map(p => p).map((a, n) => `**${n + 1}.** [${a.user.tag}](${a.user.displayAvatarURL()}) su aislamiento termina <t:${Math.floor(a.communicationDisabledUntilTimestamp / 1000)}:R>`).join("\n")}`)
                    .setColor("#0083FF")
                    .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                    .setTimestamp()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMuteList] })
                }, 500)
            } else {
                let segPage
                if (String(aislados.map(m => m).length).slice(-1) === "0") {
                    segPage = Math.floor(aislados.size / 10)
                } else {
                    segPage = Math.floor(aislados.size / 10 + 1)
                }

                let ai1 = 0, ai2 = 10, pagina = 1

                const embMuteList = new EmbedBuilder()
                    .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("<:aislacion:947965052772814848> Miembros aislados")
                    .setDescription(`Hay un total de **${aislados.size.toLocaleString()}** miembros con aislamiento temporal.\n\n${aislados.map(p => p).map((a, n) => `**${n + 1}.** [${a.user.tag}](${a.user.displayAvatarURL()}) su aislamiento termina <t:${Math.floor(a.communicationDisabledUntilTimestamp / 1000)}:R>`).slice(ai1, ai2).join("\n")}`)
                    .setColor("#0083FF")
                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                    .setTimestamp()

                const botones1 = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente ")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Primary)
                        ]
                    )

                const botones2 = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Primary),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Primary)
                        ]
                    )

                const botones3 = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Primary),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        ]
                    )

                setTimeout(async () => {
                    const mensajeSend = await msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMuteList], components: [botones1] })
                    const filtro = i => i.user.id === msg.author.id;
                    const colector = mensajeSend.createMessageComponentCollector({ filter: filtro, time: segPage * 60000 })

                    setTimeout(() => {
                        mensajeSend.edit({ embeds: [embMuteList], components: [] })
                    }, segPage * 60000)

                    colector.on("collect", async botn => {
                        if (botn.customId === "1") {
                            if (ai2 - 10 <= 10) {
                                ai1 -= 10, ai2 -= 10, pagina--

                                embMuteList
                                    .setDescription(`Hay un total de **${aislados.size.toLocaleString()}** miembros con aislamiento temporal.\n\n${aislados.map(p => p).map((a, n) => `**${n + 1}.** [${a.user.tag}](${a.user.displayAvatarURL()}) su aislamiento termina <t:${Math.floor(a.communicationDisabledUntilTimestamp / 1000)}:R>`).slice(ai1, ai2).join("\n")}`)
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                return await botn.update({ embeds: [embMuteList], components: [botones1] })
                            }
                            ai1 -= 10, ai2 -= 10, pagina--

                            embMuteList
                                .setDescription(`Hay un total de **${aislados.size.toLocaleString()}** miembros con aislamiento temporal.\n\n${aislados.map(p => p).map((a, n) => `**${n + 1}.** [${a.user.tag}](${a.user.displayAvatarURL()}) su aislamiento termina <t:${Math.floor(a.communicationDisabledUntilTimestamp / 1000)}:R>`).slice(ai1, ai2).join("\n")}`)
                                .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                            await botn.update({ embeds: [embMuteList], components: [botones2] })
                        }
                        if (botn.customId === "2") {
                            if (ai2 + 10 >= aislados.size) {
                                ai1 += 10, ai2 += 10, pagina++

                                embMuteList
                                    .setDescription(`Hay un total de **${aislados.size.toLocaleString()}** miembros con aislamiento temporal.\n\n${aislados.map(p => p).map((a, n) => `**${n + 1}.** [${a.user.tag}](${a.user.displayAvatarURL()}) su aislamiento termina <t:${Math.floor(a.communicationDisabledUntilTimestamp / 1000)}:R>`).slice(ai1, ai2).join("\n")}`)
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                return await botn.update({ embeds: [embMuteList], components: [botones3] })
                            }
                            ai1 += 10, ai2 += 10, pagina++

                            embMuteList
                                .setDescription(`Hay un total de **${aislados.size.toLocaleString()}** miembros con aislamiento temporal.\n\n${aislados.map(p => p).map((a, n) => `**${n + 1}.** [${a.user.tag}](${a.user.displayAvatarURL()}) su aislamiento termina <t:${Math.floor(a.communicationDisabledUntilTimestamp / 1000)}:R>`).slice(ai1, ai2).join("\n")}`)
                                .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                            return await botn.update({ embeds: [embMuteList], components: [botones2] })
                        }
                    })
                })
            }
        }

        if (["kick", "expulsar"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let dataHis = await historialesDB.findOne({ _id: client.user.id })
            let condicionalesP = [!msg.member.permissions.has('KickMembers'), !msg.guild.members.me.permissions.has('KickMembers')]
            let descripcionesP = [`No tienes los permisos suficientes para ejecutar el comando.`, `No tengo los permisos suficientes para ejecutar el comando.`]
            for (let p = 0; p < descripcionesP.length; p++) {
                if (condicionalesP[p]) {
                    const embErrMiembro = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripcionesP[p])
                        .setColor(ColorError)
                        .setFooter({text: "Permiso requerido: Expulsar miembros"})
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            if (!cooldowns.has("kick")) {
                cooldowns.set("kick", new Collection())
            }

            const tiempoActual = Date.now()
            const datosComando = cooldowns.get("kick")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
                console.log(tiempoUltimo - tiempoActual)

                const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
                const embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando kick")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
            .setTitle(`${emojis.lupa} Comando kick`)
            .setFields(
                { name: "Uso:", value: `\`\`${prefijo}kick <Mencion del miembro> <Razón>\`\`\n\`\`${prefijo}kick <ID del miembro> <Razón>\`\`\n\`\`${prefijo}kick <Etiqueta del miembro> <Razón>\`\`` },
                { name: "Ejemplos: **3**", value: `${prefijo}kick ${msg.author} Romper una regla.\n${prefijo}kick ${msg.author.id} Flood en canales.\n${prefijo}kick ${msg.author.tag} Spam al MD.` },
                { name: "Alias: **2**", value: `\`\`kick\`\`, \`\`expulsar\`\`` },
                { name: "Descripción:", value: `Expulsa a un miembro del servidor, al expulsarlo el bot le enviara un mensaje con la razón de la expulsión.` }
            )
            .setColor(colorEmbInfo)
            .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)


            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag === args[0])
            let razon = args.slice(1).join(" ")

            if (!miembro) {
                let descripciones = [`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`]
                let condicionales = [isNaN(args[0])]

                for (let i = 0; i < descripciones.length; i++) {
                    if (condicionales[i]) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }
            }

            if (miembro) {
                if (msg.author.id === msg.guild.ownerId) {
                    let condicionalesOw = [miembro.id === client.user.id, miembro.id === msg.author.id]
                    let descripcionesOw = [`El miembro proporcionado soy yo, no me puedo expulsar a mi mismo.`, `El miembro proporcionado eres tu, eres el dueño o dueña del servidor no te puedo expulsar.`]

                    for (let o = 0; o < descripcionesOw.length; o++) {
                        if (condicionalesOw[o]) {
                            const embErrMiembro = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripcionesOw[o])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    dt.delete().catch(e => {
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }


                    if (miembro.user.bot) {
                        let descripcionesB = [`El miembro proporcionado es un bot y tiene un rol igual o mayor que el mío por lo tanto no puedo expulsarlo.`, `No has proporcionado la razón por la que expulsaras a ese bot, proporciona la razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                        let condicionalesB = [msg.guild.members.me.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, !razon, razon.length > 1000]

                        for (let o = 0; o < descripcionesB.length; o++) {
                            if (condicionalesB[o]) {
                                const embErrMiembro = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(descripcionesB[o])
                                    .setColor(ColorError)
                                    .setTimestamp()
                                return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        dt.delete().catch(e => {
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }

                        const embedKickB = new EmbedBuilder()
                            .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                            .setThumbnail(miembro.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                            .setTitle("<:salir12:879519859694776360> Bot expulsado")
                            .setDescription(`🤖 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                            .setColor("#F78701")
                            .setFooter({text: miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                            .setTimestamp()
                        miembro.kick(`Bot expulsado por: ${msg.author.tag} el ${msg.createdAt.toLocaleDateString()} por la razón: ${razon}`).then(k => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embedKickB] })
                        })

                    } else {
                        const embErr0 = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`No he podido enviar la razón al miembro por la que fue expulsado, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                            .setColor(ColorError)
                            .setTimestamp()

                        let descripcionesU = [`El miembro proporcionado tiene un rol igual o mayor que el mío por lo tanto no puedo expulsarlo.`, `No has proporcionado la razón por la que expulsaras al miembro, proporciona la razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                        let condicionalesU = [msg.guild.members.me.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, !razon, razon.length > 1000]

                        for (let o = 0; o < descripcionesU.length; o++) {
                            if (condicionalesU[o]) {
                                const embErrMiembro = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(descripcionesU[o])
                                    .setColor(ColorError)
                                    .setTimestamp()
                                return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        dt.delete().catch(e => {
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }

                        const embedKickM = new EmbedBuilder()
                            .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                            .setTitle("<:salir12:879519859694776360> Miembro expulsado")
                            .setThumbnail(miembro.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                            .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                            .setColor("#F78701")
                            .setFooter({text: miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                            .setTimestamp()

                        const embedKickMD = new EmbedBuilder()
                            .setAuthor({name: miembro.user.tag, iconURL: miembro.user.displayAvatarURL()})
                            .setTitle("<:salir12:879519859694776360> Has sido expulsado")
                            .setDescription(`📝 **Por la razón:** ${razon}\n\n👮 **Por el moderador:** ${msg.author}\n**ID:** ${msg.author.id}`)
                            .setColor("#F78701")
                            .setFooter({text: `Del el servidor: ${msg.guild.name}`, iconURL: msg.guild.iconURL()})
                            .setTimestamp()
                        miembro.send({ embeds: [embedKickMD] }).catch(e => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr0] }).then(e => setTimeout(() => {
                                e.delete().catch(c => {
                                    return;
                                })
                            }, 30000))
                        })
                        miembro.kick(`Miembro expulsado por: ${msg.author.tag} el ${msg.createdAt.toLocaleDateString()} por la razón: ${razon}`).then(k => {
                            setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embedKickM] })
                            }, 500)
                        })

                        if (dataHis.usuarios.some(s => s.id === miembro.id)) {
                            let posicion
                            for (let i = 0; i < dataHis.usuarios.length; i++) {
                                if (dataHis.usuarios[i].id === miembro.id) {
                                    posicion = i
                                }
                            }

                            if (dataHis.usuarios[posicion].servidores.some(s => s.id === msg.guildId)) {
                                let guiPosicion
                                for (let g = 0; g < dataHis.usuarios[posicion].servidores.length; g++) {
                                    if (dataHis.usuarios[posicion].servidores[g].id === msg.guildId) {
                                        guiPosicion = g
                                    }
                                }

                                let momentaneaDB = dataHis.usuarios[posicion]
                                momentaneaDB.servidores[guiPosicion].expulsiones.push({ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon })

                                dataHis.usuarios[posicion] = momentaneaDB
                            } else {
                                let momentaneaDB = dataHis.usuarios[posicion]
                                momentaneaDB.servidores.push({ id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [{ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon }], baneos: [] })
                                dataHis.usuarios[posicion] = momentaneaDB
                            }
                        } else {
                            dataHis.usuarios.push({ id: miembro.id, tag: miembro.user.tag, servidores: [{ autor: msg.author.id, id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [{ tiempo: Math.floor(msg.createdAt / 1000), razon: razon }], baneos: [] }] })
                        }

                        let adv = dataHis.sanciones.advertencias
                        let ais = dataHis.sanciones.aislamientos
                        let exp = dataHis.sanciones.expulsiones
                        let ban = dataHis.sanciones.baneos
                        dataHis.sanciones = { advertencias: adv, aislamientos: ais, expulsiones: exp + 1, baneos: ban }
                        await dataHis.save()
                    }
                } else {
                    let condicionalesNor = [miembro.id === client.user.id, miembro.id === msg.author.id, miembro.id === msg.guild.ownerId]
                    let descripcionesNor = [`El miembro proporcionado soy yo, no me puedo expulsar a mi mismo.`, `¿Por que quieres que te expulse de este increíble servidor?, no puedo realizar esa acción.`, `El miembro proporcionado es el dueño del servidor, no lo puedes expulsar de su propio servidor.`]

                    for (let o = 0; o < descripcionesP.length; o++) {
                        if (condicionalesNor[o]) {
                            const embErrMiembro = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripcionesNor[o])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    dt.delete().catch(e => {
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    if (miembro.user.bot) {
                        let descripcionesB = [`El bot proporcionado tiene un rol igual o mayor que el tuyo por lo tanto no puedes expulsarlo.`, `El miembro proporcionado es un bot y tiene un rol igual o mayor que el mío por lo tanto no puedo expulsarlo.`, `No has proporcionado la razón por la que expulsaras a ese bot, proporciona la razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                        let condicionalesB = [msg.member.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, msg.guild.members.me.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, !razon, razon.length > 1000]

                        for (let o = 0; o < descripcionesB.length; o++) {
                            if (condicionalesB[o]) {
                                const embErrMiembro = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(descripcionesB[o])
                                    .setColor(ColorError)
                                    .setTimestamp()
                                return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        dt.delete().catch(e => {
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }

                        const embedMencion = new EmbedBuilder()
                            .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                            .setThumbnail(miembro.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                            .setTitle("<:salir12:879519859694776360> Bot expulsado")
                            .setDescription(`🤖 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                            .setColor("#F78701")
                            .setFooter({text: miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                            .setTimestamp()
                        miembro.kick(`Bot expulsado por: ${msg.author.tag} el ${msg.createdAt.toLocaleDateString()} por la razón: ${razon}`).then(k => {
                            setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embedMencion] })
                            }, 500)
                        })

                    } else {
                        const embErr0 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`No he podido enviar la razón al miembro por la que fue expulsado, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                        .setColor(ColorError)
                        .setTimestamp()

                        let descripcionesB = [`El miembro proporcionado tiene un rol igual o mayor que el tuyo por lo tanto no puedes expulsarlo.`, `El miembro proporcionado tiene un rol igual o mayor que el mío por lo tanto no puedo expulsarlo.`, `No has proporcionado la razón por la que expulsaras a ese miembro, proporciona la razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                        let condicionalesB = [msg.member.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, msg.guild.members.me.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, !razon, razon.length > 1000]

                        for (let o = 0; o < descripcionesB.length; o++) {
                            if (condicionalesB[o]) {
                                const embErrMiembro = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(descripcionesB[o])
                                    .setColor(ColorError)
                                    .setTimestamp()
                                return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        dt.delete().catch(e => {
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }

                        const embErrb3 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`No has proporcionado la razón por la que expulsaras a ese miembro, proporciona la razón.`)
                        .setColor(ColorError)
                        .setTimestamp()
                        if (!razon) return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrb3] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000))
                        }, 500)

                        const embedKickM = new EmbedBuilder()
                        .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                        .setThumbnail(miembro.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                        .setTitle("<:salir12:879519859694776360> Miembro expulsado")
                        .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#F78701")
                        .setFooter({text: miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                        .setTimestamp()

                        const embedKickMDM = new EmbedBuilder()
                        .setAuthor({name: miembro.user.tag, iconURL: miembro.user.displayAvatarURL()})
                        .setTitle("<:salir12:879519859694776360> Has sido expulsado")
                        .setDescription(`📝 **Por la razón:** ${razon}\n\n👮 **Por el moderador:** ${msg.author}\n**ID:** ${msg.author.id}`)
                        .setColor("#F78701")
                        .setFooter({text: `Del el servidor: ${msg.guild.name}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                        miembro.send({ embeds: [embedKickMDM] }).catch(e => {
                            setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr0] }).then(er => setTimeout(() => {
                                    er.delete().catch(c => {
                                        return;
                                    })
                                }, 30000))
                            }, 500)
                        })
                        miembro.kick(`Miembro expulsado por: ${msg.author.tag} el ${msg.createdAt.toLocaleDateString()} por la razón: ${razon}`).then(k=>{
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embedKickM]})
                            }, 500)
                        })

                        if (dataHis.usuarios.some(s => s.id === miembro.id)) {
                            let posicion
                            for (let i = 0; i < dataHis.usuarios.length; i++) {
                                if (dataHis.usuarios[i].id === miembro.id) {
                                    posicion = i
                                }
                            }

                            if (dataHis.usuarios[posicion].servidores.some(s => s.id === msg.guildId)) {
                                let guiPosicion
                                for (let g = 0; g < dataHis.usuarios[posicion].servidores.length; g++) {
                                    if (dataHis.usuarios[posicion].servidores[g].id === msg.guildId) {
                                        guiPosicion = g
                                    }
                                }

                                let momentaneaDB = dataHis.usuarios[posicion]
                                momentaneaDB.servidores[guiPosicion].expulsiones.push({ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon })

                                dataHis.usuarios[posicion] = momentaneaDB
                            } else {
                                let momentaneaDB = dataHis.usuarios[posicion]
                                momentaneaDB.servidores.push({ id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [{ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon }], baneos: [] })
                                dataHis.usuarios[posicion] = momentaneaDB
                            }
                        } else {
                            dataHis.usuarios.push({ id: miembro.id, tag: miembro.user.tag, servidores: [{ autor: msg.author.id, id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [{ tiempo: Math.floor(msg.createdAt / 1000), razon: razon }], baneos: [] }] })
                        }

                        let adv = dataHis.sanciones.advertencias
                        let ais = dataHis.sanciones.aislamientos
                        let exp = dataHis.sanciones.expulsiones
                        let ban = dataHis.sanciones.baneos
                        dataHis.sanciones = { advertencias: adv, aislamientos: ais, expulsiones: exp + 1, baneos: ban }
                        await dataHis.save()
                    }
                }
            }

            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }

        if (["ban", "prohibir"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let dataHis = await historialesDB.findOne({ _id: client.user.id })
            let condicionalesP = [!msg.member.permissions.has('BanMembers'), !msg.guild.members.me.permissions.has('BanMembers')]
            let descripcionesP = [`No tienes los permisos suficientes para ejecutar el comando.`, `No tengo los permisos suficientes para ejecutar el comando.`]
            for (let p = 0; p < descripcionesP.length; p++) {
                if (condicionalesP[p]) {
                    const embErrMiembro = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripcionesP[p])
                        .setColor(ColorError)
                        .setFooter({text: "Permiso requerido: Banear miembros"})
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            if (!cooldowns.has("ban")) {
                cooldowns.set("ban", new Collection())
            }

            const tiempoActual = Date.now()
            const datosComando = cooldowns.get("ban")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
                console.log(tiempoUltimo - tiempoActual)

                const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
                const embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando ban")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
            .setAuthor({name: `${emojis.lupa} Comanod ban`})
            .setFields(
                { name: "Uso:", value: `\`\`${prefijo}ban <Mencion del miembro> <Razón>\`\`\n\`\`${prefijo}ban <ID del miembro o usuario externo> <Razón>\`\`\n\`\`${prefijo}ban <Etiqueta del miembro> <Razón>\`\`` },
                { name: "Ejemplo:", value: `${prefijo}ban ${msg.author} Publicar URLs maliciosas.\n${prefijo}ban ${msg.author.id} Romper múltiples reglas en el servidor.\n${prefijo}ban ${msg.author.tag} Incumplimiento del ToS de Discord` },
                { name: "Alias: **2**", value: `\`\`ban\`\`, \`\`prohibir\`\`` },
                { name: "Descripción:", value: `Expulsa al miembro del servidor y le prohive la entrada al servidor.` }
            )
            .setColor(colorEmbInfo)
            .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag === args[0])
            let razon = args.slice(1).join(" ")

            if (miembro) {
                if (msg.author.id === msg.guild.ownerId) {
                    let descripcionesB = [`¿Por que me quieres banear de este increíble servidor?, no puedo realizar esa acción.`, `¿Por que te quieres banear de tu propio servidor?, no puedo realizar esa acción.`]
                    let condicionalesB = [miembro.id === client.user.id, miembro.id === msg.author.id]

                    for (let i = 0; i < descripcionesB.length; i++) {
                        if (condicionalesB[i]) {
                            const embErr = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripcionesB[i])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    dt.delete().catch(e => {
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    if (miembro.user.bot) {
                        let descripcionesB = [`El bot proporcionado tiene un rol igual o mayor al mío por lo tanto no lo puedo banear del servidor.`, `No has proporcionado la razón por la que banearas al bot, proporciona una razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                        let condicionalesB = [msg.guild.members.me.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, !razon, razon.length > 1000]

                        for (let o = 0; o < descripcionesB.length; o++) {
                            if (condicionalesB[o]) {
                                const embErrMiembro = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(descripcionesB[o])
                                    .setColor(ColorError)
                                    .setTimestamp()
                                return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        dt.delete().catch(e => {
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }

                        const embBaneo = new EmbedBuilder()
                            .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                            .setThumbnail(miembro.user.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                            .setTitle("⛔ Bot baneado")
                            .setDescription(`🤖 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                            .setColor("#ff0000")
                            .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                            .setTimestamp()
                        miembro.ban({ reason: `Razón: ${razon} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}` }).then(ban => {
                            setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embBaneo] })
                            }, 500)
                        })

                    } else {
                        let descripcionesU = [`El miembro proporcionado tiene un rol igual o mayor al mío por lo tanto no lo puedo banear del servidor.`, `No has proporcionado la razón por la que banearas al miembro, proporciona una razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                        let condicionalesU = [msg.guild.members.me.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, !razon, razon.length > 1000]

                        for (let o = 0; o < descripcionesU.length; o++) {
                            if (condicionalesU[o]) {
                                const embErrMiembro = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(descripcionesU[o])
                                    .setColor(ColorError)
                                    .setTimestamp()
                                return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        dt.delete().catch(e => {
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }

                        const embBaneo = new EmbedBuilder()
                            .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                            .setThumbnail(miembro.user.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                            .setTitle("⛔ Miembro baneado")
                            .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                            .setColor("#ff0000")
                            .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                            .setTimestamp()

                        const embMeMD = new EmbedBuilder()
                            .setAuthor({name: miembro.user.tag, iconURL: miembro.user.displayAvatarURL()})
                            .setTitle("⛔ Has sido baneado")
                            .setDescription(`📝 **Por la razón:** ${razon}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:** ${msg.author.id}`)
                            .setColor("#ff0000")
                            .setFooter({text: `Del servidor: ${msg.guild.name}`, iconURL: msg.guild.iconURL()})
                            .setTimestamp()
                        miembro.ban({ reason: `Razón: ${razon} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}` }).then(ban => {
                            setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embBaneo] })
                            }, 500)
                            miembro.send({ embeds: [embMeMD] }).catch(c => {
                                return;
                            })
                        })

                        if (dataHis.usuarios.some(s => s.id === miembro.id)) {
                            let posicion
                            for (let i = 0; i < dataHis.usuarios.length; i++) {
                                if (dataHis.usuarios[i].id === miembro.id) {
                                    posicion = i
                                }
                            }

                            if (dataHis.usuarios[posicion].servidores.some(s => s.id === msg.guildId)) {
                                let guiPosicion
                                for (let g = 0; g < dataHis.usuarios[posicion].servidores.length; g++) {
                                    if (dataHis.usuarios[posicion].servidores[g].id === msg.guildId) {
                                        guiPosicion = g
                                    }
                                }

                                let momentaneaDB = dataHis.usuarios[posicion]
                                momentaneaDB.servidores[guiPosicion].baneos.push({ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon })

                                dataHis.usuarios[posicion] = momentaneaDB
                            } else {
                                let momentaneaDB = dataHis.usuarios[posicion]
                                momentaneaDB.servidores.push({ id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [], baneos: [{ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon }] })
                                dataHis.usuarios[posicion] = momentaneaDB
                            }
                        } else {
                            dataHis.usuarios.push({ id: miembro.id, tag: miembro.user.tag, servidores: [{ id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [], baneos: [{ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon }] }] })
                        }

                        let adv = dataHis.sanciones.advertencias
                        let ais = dataHis.sanciones.aislamientos
                        let exp = dataHis.sanciones.expulsiones
                        let ban = dataHis.sanciones.baneos
                        dataHis.sanciones = { advertencias: adv, aislamientos: ais, expulsiones: exp, baneos: ban + 1 }
                        await dataHis.save()
                    }
                } else {
                    let descripcionesB = [`¿Por que me quieres banear de este increíble servidor?, no puedo realizar esa acción.`, `¿Por que te quieres banear de este increíble servidor?, no puedo realizar esa acción.`]
                    let condicionalesB = [miembro.id === client.user.id, miembro.id === msg.author.id]

                    for (let i = 0; i < descripcionesB.length; i++) {
                        if (condicionalesB[i]) {
                            const embErr = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripcionesB[i])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    dt.delete().catch(e => {
                                        return;
                                    })
                                }, 30000));
                            }, 500)
                        }
                    }

                    if (miembro.user.bot) {
                        let descripcionesBb = [`El bot proporcionado tiene un rol igual o mayor al mío por lo tanto no lo puedo banear del servidor.`, `No puedes banear a un bot con el mismo rol o mayor que tu.`, `No has proporcionado la razón por que banearas a ese bot, proporciona una razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                        let condicionalesBb = [msg.guild.members.me.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, msg.member.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, !razon, razon.length > 1000]

                        for (let i = 0; i < descripcionesBb.length; i++) {
                            if (condicionalesBb[i]) {
                                const embErr = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(descripcionesBb[i])
                                    .setColor(ColorError)
                                    .setTimestamp()
                                return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        dt.delete().catch(e => {
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }

                        const embBaneo = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                        .setThumbnail(miembro.user.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                        .setTitle("⛔ Bot baneado")
                        .setDescription(`🤖 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#ff0000")
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                        miembro.ban({ reason: `Razón: ${razon} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}` }).then(ban => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embBaneo] })
                        })
                    } else {
                        let descripcionesBb = [`El miembro proporcionado es el dueño del servidor, nadie puede banear el dueño del servidor.`, `El miembro proporcionado tiene un rol igual o mayor al mío por lo tanto no lo puedo banear del servidor.`, `El miembro propocionado tiene un rol igual o mayor al tuyo por lo tanto no lo puedes banear del servidor.`, `No has proporcionado la razón por que banearas al miembro, proporciona una razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                        let condicionalesBb = [miembro.id === msg.guild.ownerId, msg.guild.members.me.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, msg.member.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, !razon, razon.length > 1000]

                        for (let i = 0; i < descripcionesBb.length; i++) {
                            if (condicionalesBb[i]) {
                                const embErr = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(descripcionesBb[i])
                                    .setColor(ColorError)
                                    .setTimestamp()
                                return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        dt.delete().catch(e => {
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }

                        const embBaneo = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                        .setThumbnail(miembro.user.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                        .setTitle("⛔ Miembro baneado")
                        .setDescription(`👤 ${miembro}\n${miembro.user.tag}\n${miembro.user.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#ff0000")
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()

                        const embMeMD = new EmbedBuilder()
                        .setAuthor({name: miembro.user.tag, iconURL: miembro.user.displayAvatarURL()})
                        .setTitle("⛔ Has sido baneado")
                        .setDescription(`📝 **Por la razón:** ${razon}\n\n👮 **Por el moderador:**\n${msg.author}\n**ID:** ${msg.author.id}`)
                        .setColor("#ff0000")
                        .setFooter({text: `Del servidor: ${msg.guild.name}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                        miembro.ban({reason: `Razón: ${razon} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}`}).then(ban=>{
                            setTimeout(()=>{
                                msg.reply({allowedMentions: {repliedUser: false}, embeds: [embBaneo]})
                            }, 500)
                            miembro.send({embeds: [embMeMD]}).catch(c=>{
                                return;
                            })
                        })

                        if (dataHis.usuarios.some(s => s.id === miembro.id)) {
                            let posicion
                            for (let i = 0; i < dataHis.usuarios.length; i++) {
                                if (dataHis.usuarios[i].id === miembro.id) {
                                    posicion = i
                                }
                            }

                            if (dataHis.usuarios[posicion].servidores.some(s => s.id === msg.guildId)) {
                                let guiPosicion
                                for (let g = 0; g < dataHis.usuarios[posicion].servidores.length; g++) {
                                    if (dataHis.usuarios[posicion].servidores[g].id === msg.guildId) {
                                        guiPosicion = g
                                    }
                                }

                                let momentaneaDB = dataHis.usuarios[posicion]
                                momentaneaDB.servidores[guiPosicion].baneos.push({ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon })

                                dataHis.usuarios[posicion] = momentaneaDB
                            } else {
                                let momentaneaDB = dataHis.usuarios[posicion]
                                momentaneaDB.servidores.push({ id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [], baneos: [{ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon }] })
                                dataHis.usuarios[posicion] = momentaneaDB
                            }
                        } else {
                            dataHis.usuarios.push({ id: miembro.id, tag: miembro.user.tag, servidores: [{ id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [], baneos: [{ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon }] }] })
                        }

                        let adv = dataHis.sanciones.advertencias
                        let ais = dataHis.sanciones.aislamientos
                        let exp = dataHis.sanciones.expulsiones
                        let ban = dataHis.sanciones.baneos
                        dataHis.sanciones = { advertencias: adv, aislamientos: ais, expulsiones: exp, baneos: ban + 1 }
                        await dataHis.save()

                    }
                }
            } else {
                await client.users.fetch(args[0], { force: true }).then(async usuario => {
                    if (usuario.bot) {
                        let descripcionesBb = [`El bot proporcionado ya esta baneado en este servidor.`, `No has proporcionado la razón por la que banearas a ese bot externo, proporciona una razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                        let condicionalesBb = [(await msg.guild.bans.fetch()).find(f => f.user.id === usuario.id), !razon, razon.length > 1000]

                        for (let i = 0; i < descripcionesBb.length; i++) {
                            if (condicionalesBb[i]) {
                                const embErr = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(descripcionesBb[i])
                                    .setColor(ColorError)
                                    .setTimestamp()
                                return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        dt.delete().catch(e => {
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }

                        const embBaneo = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname ? msg.member.nickname : msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                        .setThumbnail(usuario.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                        .setTitle("⛔ Bot externo baneado")
                        .setDescription(`🤖 ${usuario.tag}\n${usuario.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#ff0000")
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                        msg.guild.members.ban(usuario.id, { reason: `Razón: ${razon} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}` }).then(ban => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embBaneo] })
                        })
                    } else {
                        let descripcionesBb = [`El usuario proporcionado ya esta baneado en este servidor.`, `No has proporcionado la razón por la que banearas a ese usuario externo, proporciona una razón.`, `La razón que has proporcionado supera los **1000** caracteres, proporciona una razón mas corta.`]
                        let condicionalesBb = [(await msg.guild.bans.fetch()).find(f => f.user.id === usuario.id), !razon, razon.length > 1000]

                        for (let i = 0; i < descripcionesBb.length; i++) {
                            if (condicionalesBb[i]) {
                                const embErr = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(descripcionesBb[i])
                                    .setColor(ColorError)
                                    .setTimestamp()
                                return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        dt.delete().catch(e => {
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }

                        const embBaneo = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname ? msg.member.nickname : msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                        .setThumbnail(usuario.displayAvatarURL({  format: "png" || "gif", size: 4096 }))
                        .setTitle("⛔ Usuario externo baneado")
                        .setDescription(`👤 ${usuario.tag}\n${usuario.id}\n\n📝 **Razón:** ${razon}\n\n👮 **Moderador:** ${msg.author}\n${msg.author.id}`)
                        .setColor("#ff0000")
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()

                        msg.guild.members.ban(usuario.id, { reason: `Razón: ${razon} | Por: ${msg.author.tag}/ID: ${msg.author.id} | Fecha: ${msg.createdAt.toLocaleDateString()}` }).then(ban => {
                            setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embBaneo] })
                            }, 500)
                        })

                        if (dataHis.usuarios.some(s => s.id === usuario.id)) {
                            let posicion
                            for (let i = 0; i < dataHis.usuarios.length; i++) {
                                if (dataHis.usuarios[i].id === usuario.id) {
                                    posicion = i
                                }
                            }

                            if (dataHis.usuarios[posicion].servidores.some(s => s.id === msg.guildId)) {
                                let guiPosicion
                                for (let g = 0; g < dataHis.usuarios[posicion].servidores.length; g++) {
                                    if (dataHis.usuarios[posicion].servidores[g].id === msg.guildId) {
                                        guiPosicion = g
                                    }
                                }

                                let momentaneaDB = dataHis.usuarios[posicion]
                                momentaneaDB.servidores[guiPosicion].baneos.push({ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon })

                                dataHis.usuarios[posicion] = momentaneaDB
                            } else {
                                let momentaneaDB = dataHis.usuarios[posicion]
                                momentaneaDB.servidores.push({ id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [], baneos: [{ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon }] })
                                dataHis.usuarios[posicion] = momentaneaDB
                            }
                        } else {
                            dataHis.usuarios.push({ id: usuario.id, tag: usuario.tag, servidores: [{ id: msg.guildId, nombre: msg.guild.name, advertencias: [], aislamientos: [], expulsiones: [], baneos: [{ autor: msg.author.id, tiempo: Math.floor(msg.createdAt / 1000), razon: razon }] }] })
                        }

                        let adv = dataHis.sanciones.advertencias
                        let ais = dataHis.sanciones.aislamientos
                        let exp = dataHis.sanciones.expulsiones
                        let ban = dataHis.sanciones.baneos
                        dataHis.sanciones = { advertencias: adv, aislamientos: ais, expulsiones: exp, baneos: ban + 1 }
                        await dataHis.save()
                    }
                }).catch(c => {
                    const embErrU1 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El argumento proporcionado (${args[0]}) no es una ID valida ni coresponde con la de ningun usuario de Discord, verifique la ID.`)
                        .setColor(ColorError)
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrU1] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)
                })
            }

            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }

        if (comando == "unban") {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let condicionalesP = [!msg.member.permissions.has('BanMembers'), !msg.guild.members.me.permissions.has('BanMembers')]
            let descripcionesP = [`No tienes los permisos suficientes para ejecutar el comando.`, `No tengo los permisos suficientes para ejecutar el comando.`]
            for (let p = 0; p < descripcionesP.length; p++) {
                if (condicionalesP[p]) {
                    const embErrMiembro = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripcionesP[p])
                        .setColor(ColorError)
                        .setFooter({text: "Permiso requerido: Banear miembros"})
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            const embErrP3 = new EmbedBuilder()
                .setTitle("📄")
                .setDescription(`No se ha encontrado ningún miembro baneado en este servidor.`)
                .setColor(colorEmbInfo)
                .setTimestamp()
            if ((await msg.guild.bans.fetch()).size === 0) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP3] }).then(tm => setTimeout(() => {
                    msg.delete().catch(c => {
                        return;
                    })
                    tm.delete().catch(e => {
                        return;
                    })
                }, 30000))
            }, 500)

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando unban`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}unban <ID del usuario baneado>\`\`` },
                    { name: "Ejemplo:", value: `${prefijo}unban ${(await msg.guild.bans.fetch()).map(mb => mb.user.id).slice(0, 1)}` },
                    { name: "Alias:", value: `\`\`unban\`\`` },
                    { name: "Descripción:", value: `Expulsa al miembro del servidor y le prohive la entrada al servidor.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)


            let descripciones = [`El argumento proporcionado (${args}) no es una ID de un usuario ya que contiene caracteres no numericos, una ID solo esta formada por caracteres numericos.`, `El argumento numérico  ingresado *(${args})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`]
            let condicionales = [isNaN(args), !isNaN(args) && args[0].length < 18, !isNaN(args) && args[0].length > 18]


            for (let i = 0; i < descripciones.length; i++) {
                if (condicionales[i]) {
                    const embErr = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[i])
                        .setColor(ColorError)
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            if (msg.guild.members.cache.get(args)) {
                let descripcionesM = [`La ID proporcionada es mía, yo no estoy baneado.`, `La ID proporcionada es tuya y tu eres el dueño del servidor, claramente no estas baneado.`, `La ID proporcionada es tuya, claramente no estas baneado.`, `La ID proporcionada es del dueño/a del servidor, es imposible que este baneado/a de su propio servidor`, `La ID proporcionada es de <@${msg.guild.members.cache.get(args).id}> un bot del servidor que no esta baneado.`, `La ID proporcionada es de <@${msg.guild.members.cache.get(args).id}> un miembro del servidor que no esta baneado.`]
                let condicionalesM = [args === client.user.id, args === msg.author.id && msg.author.id === msg.guild.ownerId, args === msg.author.id, !msg.author.id === msg.guild.ownerId && args === msg.guild.ownerId, msg.guild.members.cache.get(args).user.bot, !msg.guild.members.cache.get(args).user.bot]


                for (let i = 0; i < descripcionesM.length; i++) {
                    if (condicionalesM[i]) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesM[i])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }
            } else {
                await client.users.fetch(args[0], { force: true }).then(async usuario => {
                    if (usuario.bot) {
                        const embErrU1 = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`La ID proporcionada es de un bot el cual no esta baneado en el servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                        if (!(await msg.guild.bans.fetch()).find(fb => fb.user.id === usuario.id)) return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrU1] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)

                        const embUban = new EmbedBuilder()
                            .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                            .setThumbnail(usuario.displayAvatarURL())
                            .setTitle("<a:afirmativo:856966728806432778> Bot des baneado")
                            .setDescription(`🤖 ${usuario.tag}\n${usuario.id}\n\n👮 **Por el moderador:**\n${msg.author}\n${msg.author.id}`)
                            .setColor('Green')
                            .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                            .setTimestamp()
                        msg.guild.members.unban(usuario.id).then(un => {
                            setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embUban] })
                            }, 500)
                        })
                    } else {
                        const embErrU1 = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`La ID proporcionada es de un usuario el cual no esta baneado en el servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                        if (!(await msg.guild.bans.fetch()).find(fb => fb.user.id === usuario.id)) return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrU1] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)

                        const embUban = new EmbedBuilder()
                            .setAuthor({name: msg.member.nickname || msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                            .setThumbnail(usuario.displayAvatarURL())
                            .setTitle("<a:afirmativo:856966728806432778> Usuario des baneado")
                            .setDescription(`👤 ${usuario.tag}\n${usuario.id}\n\n👮 **Por el moderador:**\n${msg.author}\n${msg.author.id}`)
                            .setColor('Green')
                            .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                            .setTimestamp()
                        msg.guild.members.unban(usuario.id).then(un => {
                            setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embUban] })
                            }, 500)
                        })
                    }
                }).catch(c => {
                    const embErrU1 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El argumento proporcionado (${args}) no es una **ID** valida aun que este conformado por **18** caracteres numericos no coresponde con la de ningun usuario de Discord.`)
                        .setColor(ColorError)
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrU1] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)
                })
            }
        }

        if (["clear", "cl", "delete", "eliminar"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let condicionalesP = [!msg.member.permissions.has('ManageMessages'), !msg.guild.members.me.permissions.has('ManageMessages')]
            let descripcionesP = [`No tienes los permisos suficientes para ejecutar el comando.`, `No tengo los permisos suficientes para ejecutar el comando.`]
            for (let c = 0; c < descripcionesP.length; c++) {
                if (condicionalesP[c]) {
                    const embErrMiembro = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripcionesP[c])
                        .setColor(ColorError)
                        .setFooter({text: "Permiso requerido: Gestionar mensajes"})
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            if (!cooldowns.has("clear")) {
                cooldowns.set("clear", new Collection())
            }

            const tiempoActual = Date.now()
            const datosComando = cooldowns.get("clear")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
                console.log(tiempoUltimo - tiempoActual)

                const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
                const embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando clear")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando clear`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}clear <Cantidad de emensajes>\`\`\n\`\`${prefijo}clear <Mencion del miembro> <Cantidad de emensajes>\`\`\n\`\`${prefijo}clear <ID del miembro> <Cantidad de emensajes>\`\`` },
                    { name: "Ejemplos: **3**", value: `${prefijo}clear ${Math.floor(Math.random(1) * 100)}\n${prefijo}clear ${msg.author} ${Math.floor(Math.random(1) * 100)}\n${prefijo}clear ${msg.author.id} ${Math.floor(Math.random(1) * 100)}` },
                    { name: "Alias: **4**", value: `\`\`clear\`\`, \`\`cl\`\`, \`\`delete\`\`, \`\`eliminar\`\`` },
                    { name: "Descripción:", value: `Elimina varios mensajes de un canal a la vez y elimina varios mensajes de un usuario en un canal a la vez.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag === args.join(" "))

            if (miembro) {
                let condicionalesCM = [!args[1], isNaN(args[1]), args[1] <= 1, args[1] > 100]
                let descripcionesCM = [`No has proporcionado la cantidad de mensajes del miembro a eliminar.`, `Has proporcionado un valor no numérico, introduce un valor numérico.`, `Has proporcionado una cantidad menor o igual a **1**, proporciona una cantidad mayor a **1** de mensajes a eliminar.`, `Has proporcionado una cantidad mayor a **100**, el máximo de mensajes que puedo eliminar es de **100**, proporciona una cantidad igual o menor a **100**.`]
                for (let c = 0; c < descripcionesCM.length; c++) {
                    if (condicionalesCM[c]) {
                        const embErrMiembro = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesCM[c])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                msg.delete()
                let cantidad = 0
                for (let c = 0; c < args[1]; c++) {
                    let mensajes = await msg.channel.messages.fetch({ limit: 100 })
                    let filtro = mensajes.filter(f => Date.now() - f.createdTimestamp < ms("14d") && f.author.id === miembro.id).map(c => c).slice(0, Number(args[1]))

                    cantidad += filtro.length

                    const embClear = new EmbedBuilder()
                        .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                        .setTitle("🗑 Mensajes eliminados del miembro")
                        .setDescription(`${msg.author} ha eliminado **${filtro.length}** mensajes del miembro ${miembro}.`)
                        .setColor(colorEmb)

                    await msg.channel.bulkDelete(filtro).then(s => {
                        if (cantidad >= args[1]) {
                            setTimeout(() => {
                                msg.channel.send({ embeds: [embClear] }).then(tm => setTimeout(() => {
                                    tm.delete().catch(e => {
                                        return;
                                    })
                                }, 20000))
                            }, 800)
                        }
                    })
                }
            } else {

                let condicionalesC = [isNaN(args[0]), args[0] <= 2, args[0] > 100]
                let descripcionesC = [`Has introducido un valor no numérico, introduce un valor numérico.`, `Introduce un valor mayor a 1`, `Has introducido un valor mayor a 100, el máximo de mensajes que puedo eliminar es de 100, introduce un valor igual o menor a 100.`]
                for (let c = 0; c < descripcionesC.length; c++) {
                    if (condicionalesC[c]) {
                        const embErrMiembro = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesC[c])
                            .setColor(ColorError)
                            .setFooter({text: "Permiso requerido: Gestionar mensajes"})
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                msg.delete().catch(c => {
                    console.log("Error")
                })
                if (Number(args[0]) === 100) {
                    let mensajes = await msg.channel.messages.fetch({ limit: 100 })
                    const filtro = mensajes.filter(mmm => Date.now() - mmm.createdTimestamp < ms("14d"))
                    console.log(filtro)
                    await msg.channel.bulkDelete(filtro)

                    const embClear = new EmbedBuilder()
                        .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                        .setTitle("🗑 Mensajes eliminados")
                        .setDescription(`${msg.author} ha eliminado **${filtro.size}** mensajes.`)
                        .setColor(colorEmb)

                    setTimeout(() => {
                        msg.channel.send({ embeds: [embClear] }).then(tm => setTimeout(() => {
                            tm.delete().catch(e => {
                                return;
                            })
                        }, 20000))
                    }, 800)
                } else {
                    let mensajes = await msg.channel.messages.fetch({ limit: Math.floor(Number(args[0])) })
                    const filtro = mensajes.filter(mmm => Date.now() - mmm.createdTimestamp < ms("14d"))
                    console.log(filtro)
                    await msg.channel.bulkDelete(filtro)

                    const embClear = new EmbedBuilder()
                        .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                        .setTitle("🗑 Mensajes eliminados")
                        .setDescription(`${msg.author} ha eliminado **${filtro.size - 1}** mensajes.`)
                        .setColor(colorEmb)

                    setTimeout(() => {
                        msg.channel.send({ embeds: [embClear] }).then(tm => setTimeout(() => {
                            tm.delete().catch(e => {
                                return;
                            })
                        }, 20000))
                    }, 800)
                }
            }

            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }

        if (["banlist", "blist"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Requiero del permiso: Banear miembros."})
                .setTimestamp()
            if (!msg.guild.members.me.permissions.has('BanMembers')) return msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                msg.delete().catch(c => {
                    return;
                })
                tm.delete().catch(e => {
                    return;
                })
            }, 30000))

            const embErrP2 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Requieres del permiso: Banear miembros."})
                .setTimestamp()
            if (!msg.member.permissions.has('BanMembers')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP2] }).then(tm => setTimeout(() => {
                    msg.delete().catch(c => {
                        return;
                    })
                    tm.delete().catch(e => {
                        return;
                    })
                }, 30000))
            }, 500)

            let gb = await msg.guild.bans.fetch()

            const embBans0 = new EmbedBuilder()
                .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                .setTitle("🧾 Miembros baneados")
                .setDescription(`*No hay miembros baneados en este servidor.*`)
                .setColor(msg.guild.members.me.displayHexColor)
                .setTimestamp()
            if (gb.size <= 0) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embBans0] })
            }, 500)

            if (gb.size <= 10) {
                const embBanlist10 = new EmbedBuilder()
                    .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("🧾 Miembros baneados")
                    .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m => m).map((bm, i) => `**${i + 1}. [${bm.user.tag}](${bm.user.displayAvatarURL()})**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}`).join("\n\n")}`)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                    .setTimestamp()
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embBanlist10] })

            } else {
                let segPage
                if (String(gb.size).slice(-1) === "0") {
                    segPage = Math.floor(gb.size / 10)
                } else {
                    segPage = Math.floor(gb.size / 10 + 1)
                }

                let ba1 = 0, ba2 = 10, pagina = 1

                const embBanlist = new EmbedBuilder()
                    .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("🧾 Miembros baneados")
                    .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m => m).map((bm, i) => `**${i + 1}. [${bm.user.tag}](${bm.user.displayAvatarURL()})**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}`).slice(ba1, ba2).join("\n\n")}`)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                    .setTimestamp()

                const botones1 = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente ")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Primary)
                        ]
                    )

                const botones2 = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Primary),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Primary)
                        ]
                    )

                const botones3 = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Primary),
                      
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        ]
                    )

                setTimeout(async () => {
                    const mensajeSend = await msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embBanlist], components: [botones1] })
                    const filtro = i => i.user.id === msg.author.id;
                    const colector = mensajeSend.createMessageComponentCollector({ filter: filtro, time: segPage * 60000 })

                    setTimeout(() => {
                        mensajeSend.edit({ embeds: [embBanlist], components: [] })
                    }, segPage * 60000)

                    colector.on("collect", async botn => {
                        if (botn.customId === "1") {
                            if (ba2 - 10 <= 10) {
                                ba1 -= 10, ba2 -= 10, pagina--

                                embBanlist
                                    .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m => m).map((bm, i) => `**${i + 1}. [${bm.user.tag}](${bm.user.displayAvatarURL()})**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}`).slice(ba1, ba2).join("\n\n")}`)
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                return await botn.update({ embeds: [embBanlist], components: [botones1] })
                            }
                            ba1 -= 10, ba2 -= 10, pagina--

                            embBanlist
                                .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m => m).map((bm, i) => `**${i + 1}. [${bm.user.tag}](${bm.user.displayAvatarURL()})**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}`).slice(ba1, ba2).join("\n\n")}`)
                                .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                            await botn.update({ embeds: [embBanlist], components: [botones2] })
                        }
                        if (botn.customId === "2") {
                            if (ba2 + 10 >= gb.size) {
                                ba1 += 10, ba2 += 10, pagina++

                                embBanlist
                                    .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m => m).map((bm, i) => `**${i + 1}. [${bm.user.tag}](${bm.user.displayAvatarURL()})**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}`).slice(ba1, ba2).join("\n\n")}`)
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                return await botn.update({ embeds: [embBanlist], components: [botones3] })
                            }
                            ba1 += 10, ba2 += 10, pagina++

                            embBanlist
                                .setDescription(`Hay un total de **${gb.size}** usuarios baneados en este servidor.\n\n${gb.map(m => m).map((bm, i) => `**${i + 1}. [${bm.user.tag}](${bm.user.displayAvatarURL()})**\n**ID:** ${bm.user.id}\n**Razón del baneo:**\n${bm.reason}`).slice(ba1, ba2).join("\n\n")}`)
                                .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                            return await botn.update({ embeds: [embBanlist], components: [botones2] })
                        }
                    })
                })
            }
        }

        if (["dmsend", "md", "md"].some(s => comando == s) && msg.author.id == creadorID) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Permiso requerido: Gestionar mensajes, Expulsar miembros o Banear miembros"})
                .setTimestamp()
            if (!msg.member.permissions.has('ManageMessages') || !msg.member.permissions.has('KickMembers') || !msg.member.permissions.has('BanMembers')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(dt => setTimeout(() => {
                    msg.delete().catch(c => {
                        return;
                    })
                    dt.delete().catch(e => {
                        return;
                    })
                }, 30000));
            })

            if (!cooldowns.has("dmsend")) {
                cooldowns.set("dmsend", new Collection())
            }

            const tiempoActual = Date.now()
            const datosComando = cooldowns.get("dmsend")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000;
                console.log(tiempoUltimo - tiempoActual)

                const enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000);
                const embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando dmsend")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
                .setTitle("🔎 Comando dmsend")
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}dmsend <Mencion del miembro> <Mensaje>\`\`\n\`\`${prefijo}dmsend <ID del miembro> <Mensaje>\`\`\n\`\`${prefijo}dmsend <Etiqueta del miembro> <Mensaje>\`\`` },
                    { name: "Ejemplos: **3**", value: `${prefijo}dmsend ${msg.author} Mensaje a enviar.\n${prefijo}dmsend ${msg.author.id} Mensaje a enviar.\n${prefijo}dmsend ${msg.author.tag} Mensaje a enviar` },
                    { name: "Alias: **3**", value: `\`\`dmsend\`\`, \`\`dm\`\`, \`\`md\`\`` },
                    { name: "Descripción:", value: `Envía aun mensaje por medio del bot a un miembro del servidor.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag === args[0])
            let mensaje = args.slice(1).join(" ")

            if (!miembro) {
                let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro del servidor.`]
                let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

                for (let i = 0; i < descripciones.length; i++) {
                    if (condicionales[i]) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }
            }

            if (miembro) {
                const embErr1 = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`No pude enviar el mensaje directo al miembro, puede ser por que el usuario tiene bloqueado los mensajes directos.`)
                    .setColor(ColorError)
                    .setTimestamp()

                let condicionalesD = [miembro.id === client.user.id, miembro.id === msg.author.id, miembro.user.bot, !mensaje]
                let descripcionesD = [`El miembro proporcionado soy yo, ¿Por que me quieres enviar un mensaje?, de nada serviría, no puedo realizar la acción.`, `El miembro proporcionado eres tu, ¿Para que quieres que te envié un mensaje creado por ti?, no puedo realizar esa acción.`, `El miembro proporcionado es un bot, no puedo enviar un mensaje directo a un bot.`, `No has proporcionado el mensaje a enviar, proporciona el mensaje a enviarle al miembro.`]
                for (let c = 0; c < descripcionesD.length; c++) {
                    if (condicionalesD[c]) {
                        const embErrMiembro = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripcionesD[c])
                            .setColor(ColorError)
                            .setFooter({text: "Permiso requerido: Gestionar mensajes"})
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrMiembro] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }

                const emdSendDM = new EmbedBuilder()
                    .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                    .setThumbnail(miembro.user.displayAvatarURL())
                    .setTitle("📤 Mensaje enviado al miembro")
                    .setDescription(`👤 ${miembro}\n**ID:** ${miembro.id}\n\n📝 **Mensaje:** ${mensaje}\n\n👮 **Enviado por:** ${msg.author}\n**ID:** ${msg.author.id}`)
                    .setColor(colorEmb)
                    .setFooter({text: miembro.user.tag, iconURL: miembro.displayAvatarURL()})
                    .setTimestamp()

                const embMDSend = new EmbedBuilder()
                    .setAuthor({name: miembro.user.tag, iconURL: miembro.user.displayAvatarURL()})
                    .setTitle("📥 Mensaje entrante")
                    .setDescription(`📝 **Mensaje:** ${mensaje}\n\n👮 **Enviado por:** ${msg.author.tag}\n**ID:** ${msg.author.id}`)
                    .setColor(colorEmb)
                    .setFooter({text: `Desde el servidor: ${msg.guild.name}`, iconURL: msg.guild.iconURL()})
                    .setTimestamp()
                miembro.send({ embeds: [embMDSend] }).then(tm => {
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [emdSendDM] })
                    }, 500)
                }).catch(t => {
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr1] }).then(tm => setTimeout(() => {
                            msg.delete().catch(t => {
                                return;
                            })
                            tm.delete().catch(t => {
                                return;
                            })
                        }, 30000))
                    })
                })
            }

            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }
    }


    //! 💎 Comandos de administracion
    {
        if (comando == "setprefix") {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let dataPre = await prefijosDB.findById(client.user.id)
            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando, solo un administrador del servidor puede ejecutar el comando.`)
                .setColor(ColorError)
                .setTimestamp()
            if (!msg.member.permissions.has('Administrator')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            if (!cooldowns.has("setprefix")) {
                cooldowns.set("setprefix", new Collection())
            }

            const tiempoActual = Date.now(), datosComando = cooldowns.get("setprefix")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 4 * 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *setprefix*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando setPrefix`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}setprefix <Nuevo prefijo>\`\`` },
                    { name: "Ejemplo:", value: `${prefijo}setprefix u/` },
                    { name: "Alias:", value: `\`\`setprefix\`\`` },
                    { name: "Descripción:", value: `Establece un prefijo personalizado para el servidor.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)


            const embErrP2 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No puedes establecer un emoji como prefijo.`)
                .setColor(ColorError)
                .setTimestamp()
            if (/\p{Emoji}/gu.test(args[0])) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP2] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            const embErrP3 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No puedes establecer un prefijo con mas de **3** caracteres.`)
                .setColor(ColorError)
                .setTimestamp()
            if (args[0].length > 3) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP3] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)


            if (!dataPre.servidores.some(s => s.id === msg.guildId)) {
                dataPre.servidores.push({ nombre: msg.guild.name, id: msg.guildId, prefijo: args[0] })

                const embPrefix = new EmbedBuilder()
                    .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("⚙️ Prefijo cambiado")
                    .setDescription(`Nuevo prefijo: \`\`${args[0]}\`\``)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setTimestamp()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embPrefix] })
                }, 500)
                await dataPre.save()
            } else {
                let posicion
                for (let p = 0; p < dataPre.servidores.length; p++) {
                    if (dataPre.servidores[p].id === msg.guildId) {
                        posicion = p
                    }
                }

                const embErr2 = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`El nuevo prefijo que has proporcionado *(${args[0]})* es el mismo prefijo que el actual.`)
                    .setColor('Red')
                    .setTimestamp()
                if (dataPre.servidores[posicion].prefijo === args[0]) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr2] }).then(tm => setTimeout(() => {
                        msg.delete().catch(t => {
                            return;
                        })
                        tm.delete().catch(t => {
                            return;
                        })
                    }, 30000))
                }, 500)

                dataPre.servidores[posicion] = { nombre: msg.guild.name, id: msg.guildId, prefijo: args[0] }

                const embPrefix = new EmbedBuilder()
                    .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("⚙️ Prefijo cambiado")
                    .setDescription(`Nuevo prefijo: \`\`${args[0]}\`\``)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setTimestamp()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embPrefix] })
                }, 500)
                await dataPre.save()
            }

            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 4 * 60000)
        }

        if (["setslowmode", "setslow", "slowmode"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Permiso requerido:  Gestionar canales"})
                .setTimestamp()
            if (!msg.member.permissions.has('ManageChannels')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            const embErrP2 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Permiso requerido: Gestionar canales"})
                .setTimestamp()
            if (!msg.guild.members.me.permissions.has('ManageChannels')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP2] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            if (!cooldowns.has("setslowmode")) {
                cooldowns.set("setslowmode", new Collection())
            }

            const tiempoActual = Date.now(), datosComando = cooldowns.get("setslowmode")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *setslowmode*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            let tiempos = ["10s", "2m", "30m", "1h", "6h", "12h"]
            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando setSlowMode`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}setSlowMode <Mención del canal> <Tiempo a establecer el modo pausado>\`\`\n\`\`${prefijo}setSlowMode <ID del canal> <Tiempo a establecer el modo pausado>\`\`` },
                    { name: "Ejemplos:", value: `${prefijo}setSlowMode ${msg.channel} ${tiempos[Math.floor(Math.random() * tiempos.length)]}\n${prefijo}setSlowMode ${msg.channelId} ${tiempos[Math.floor(Math.random() * tiempos.length)]}` },
                    { name: "Alias:", value: `\`\`setslowmode\`\`, \`\`setslow\`\`, \`\`slowmode\`\`` },
                    { name: "Descripción:", value: `Establece el tiempo del modo pausado de un canal de texto.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let canal = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0])

            if (canal) {
                let descripciones = [`El canal proporcionado (${canal}) no es de tipo texto, el modo pausado solo se puede establecer en canales de tipo texto.`, `No has proporcionado el tiempo del modo pausado a establecer para el canal.`, `No solo ingreses números determina si son *segundos*, *minutos* o *horas* con \`\`s\`\` segundos, con \`\`m\`\` minutos, con \`\`h\`\` horas, al final del numero, ejemplo \`\`10s\`\`.`, `El tiempo del modo pausado de un canal no debe de superar las **6** horas, proporciona una cantidad menor.`, `No proporcionaste bien la cantidad de tiempo para el modo pausado del canal.`]
                let condicionales = [!canal.type == ChannelType.GuildText, !args[1], !isNaN(args[1]), ms(args[1]) / 1000 >= 21600, !ms(args[1])]
                for (let d = 0; d < descripciones.length; d++) {
                    if (condicionales[d]) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[d])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(et => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                et.delete().catch(c => {
                                    return;
                                })
                            }, 30000))
                        }, 500)
                    }
                }

                const embSlow = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("⏲ Modo pausado")
                    .setDescription(`El modo pausado del canal ${canal} se ha establecido a **${args[1]}**.`)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setTimestamp()
                canal.setRateLimitPerUser(ms(args[1]) / 1000, `Modo pausado de ${args[1]} establecido en el canal por ${msg.author.tag}.`).then(tm => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embSlow] })
                }).catch(c => console.log(c))
            } else {
                let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado (*${args[0]}*) no se reconoce como una mención o ID de un canal del servidor, proporciona una mención o ID valida de un canal.`]
                let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

                for (let i = 0; i < descripciones.length; i++) {
                    if (condicionales[i]) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }
            }
            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }

        if (["addrol", "adddr"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let roles = msg.guild.roles.cache.filter(fr => !fr.managed && fr.id != msg.guildId).map(mr => mr)
            let random = Math.floor(Math.random() * roles.length)
            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Requieres del permiso: Gestionar roles."})
                .setTimestamp()
            if (!msg.member.permissions.has('ManageRoles')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            const embErrP2 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Requiero del permiso: Gestionar roles."})
                .setTimestamp()
            if (!msg.guild.members.me.permissions.has('ManageRoles')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP2] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            if (!cooldowns.has("addrol")) {
                cooldowns.set("addrol", new Collection())
            }

            const tiempoActual = Date.now(), datosComando = cooldowns.get("addrol")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *addrol*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando addrol`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}addrol <Mencion del miembro> <Mencion del rol>\`\`\n\`\`${prefijo}addrol <ID del miembro> <ID del rol>\`\`\n\`\`${prefijo}addrol <Mención o ID del rol> <palabra *all* o *todos*>\`\`` },
                    { name: "Ejemplos: ", value: `${prefijo}addrol ${msg.author} ${roles[random]}\n${prefijo}addrol ${msg.author} ${roles[random].id}\n${prefijo}addrol ${msg.author.id} ${roles[random].id}\n${prefijo}addrol ${msg.author.id} ${roles[random]}\n${prefijo}addrol ${roles[random]} all\n${prefijo}addrol todos ${roles[random].id}` },
                    { name: "Alias: *2*", value: `\`\`addrol\`\`, \`\`addr\`\`` },
                    { name: "Descripción:", value: `Agrega un rol a solo un miembro o a todos los miembros del servidor.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0]) || msg.guild.roles.cache.get(args[1])
            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.get(args[1])


            if (rol) {
                if (miembro) {
                    let descripciones = [`El rol proporcionado *(${rol})* es exclusivo para un bot, no se le puede agregar a ningún miembro.`, `El rol proporcionado *(${rol})* tiene una posición igual o mayor a la de mi rol mas alto por lo tanto no puedo agregar ese rol a ningún miembro.`, `El miembro proporcionado *(${miembro})* eres tu y ya tienes el rol ${rol}.`, `El miembro proporcionado *(${miembro})* ya tiene el rol ${rol}.`]
                    let condicionales = [rol.managed, msg.guild.members.me.roles.highest.comparePositionTo(rol) <= 0, miembro.id == msg.author.id && miembro.roles.cache.find(f => f.id == rol.id), miembro.roles.cache.find(f => f.id == rol.id)]
                    for (let d in descripciones) {
                        if (condicionales[d]) {
                            const embErr = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[d])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(et => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    et.delete().catch(c => {
                                        return;
                                    })
                                }, 30000))
                            }, 500)
                        }
                    }

                    if (msg.author.id == msg.guild.ownerId) {
                        if (miembro.id == msg.author.id) {
                            const embRoladd = new EmbedBuilder()
                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                .setTitle(`${emojis.acierto} Rol agregado al miembro`)
                                .setDescription(`Te he agregado el rol ${rol}.`)
                                .setColor('Green')
                                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                .setTimestamp()
                            miembro.roles.add(rol.id).then(() => setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embRoladd] })
                            }, 500))
                        } else {
                            const embRoladd = new EmbedBuilder()
                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                .setTitle(`${emojis.acierto} Rol agregado al miembro`)
                                .setDescription(`El rol ${rol} ha sido agregado al miembro ${miembro}.`)
                                .setColor('Green')
                                .setFooter({text: miembro.nickname || miembro.user.username, iconURL: miembro.displayAvatarURL()})
                                .setTimestamp()
                            miembro.roles.add(rol.id).then(() => setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embRoladd] })
                            }, 500))
                        }

                    } else {
                        if (miembro.id == msg.author.id) {
                            const embError1 = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(`El rol proporcionado *(${rol})* tiene la un mayor posición de tu rol mas alto por lo tanto no te lo puedo agregar.`)
                                .setColor(ColorError)
                                .setTimestamp()
                            if (msg.member.roles.highest.comparePositionTo(rol) <= 0) return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(et => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    et.delete().catch(c => {
                                        return;
                                    })
                                }, 30000))
                            }, 500)

                            const embRoladd = new EmbedBuilder()
                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                .setTitle(`${emojis.acierto} Rol agregado al miembro`)
                                .setDescription(`Te he agregado el rol ${rol}.`)
                                .setColor('Green')
                                .setFooter({text: miembro.nickname || miembro.user.username, iconURL: miembro.displayAvatarURL()})
                                .setTimestamp()
                            miembro.roles.add(rol.id).then(() => setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embRoladd] })
                            }, 500))
                        } else {
                            const embError1 = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(`El rol proporcionado *(${rol})* tiene la misma o mayor posición de tu rol mas alto por lo tanto no le puedes agregar el rol al miembro.`)
                                .setColor(ColorError)
                                .setTimestamp()
                            if (msg.member.roles.highest.comparePositionTo(rol) <= 0) return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(et => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    et.delete().catch(c => {
                                        return;
                                    })
                                }, 30000))
                            }, 500)

                            const embRoladd = new EmbedBuilder()
                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                .setTitle(`${emojis.acierto} Rol agregado al miembro`)
                                .setDescription(`El rol ${rol} ha sido agregado al miembro ${miembro}.`)
                                .setColor('Green')
                                .setFooter({text: miembro.nickname || miembro.user.username, iconURL: miembro.displayAvatarURL()})
                                .setTimestamp()
                            miembro.roles.add(rol.id).then(() => setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embRoladd] })
                            }, 500))
                        }
                    }

                    datosComando.set(msg.author.id, tiempoActual);
                    setTimeout(() => {
                        datosComando.delete(msg.author.id)
                    }, 60000)

                } else {
                    if (args[0] && args[1]) {
                        if (["all", "todos"].some(s => s == args[0].toLowerCase()) || ["all", "todos"].some(s => s == args[1].toLowerCase())) {
                            let descripciones = [`El rol proporcionado *(${rol})* es exclusivo para un bot, no se le puede agregar a ningún miembro.`, `El rol proporcionado *(${rol})* tiene una posición igual o mayor a la de mi rol mas alto por lo tanto no puedo agregar ese rol a ningún miembro.`, `Ahora estoy agregando un rol a todos los miembros del servidor, no puedo agregar **2** o mas roles a todos los miembros a la vez.`]
                            let condicionales = [rol.managed, msg.guild.members.me.roles.highest.comparePositionTo(rol) <= 0, botDB.servidor.some(s => s.id == msg.guildId) && botDB.servidor.find(f => f.id == msg.guildId).comandos.addrol]
                            for (let d in descripciones) {
                                if (condicionales[d]) {
                                    const embErr = new EmbedBuilder()
                                        .setTitle(`${emojis.negativo} Error`)
                                        .setDescription(descripciones[d])
                                        .setColor(ColorError)
                                        .setTimestamp()
                                    return setTimeout(() => {
                                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(et => setTimeout(() => {
                                            msg.delete().catch(c => {
                                                return;
                                            })
                                            et.delete().catch(c => {
                                                return;
                                            })
                                        }, 30000))
                                    }, 500)
                                }
                            }

                            if (msg.guild.ownerId == msg.author.id) {
                                let noLoTienen = msg.guild.members.cache.filter(f => !f.roles.cache.has(rol.id)).map(n => n), siLoTienen = msg.guild.members.cache.filter(f => f.roles.cache.has(rol.id)).map(s => s), cantidad = 0, descripcion = ""

                                const embCargando = new EmbedBuilder()
                                    .setTitle(`<a:loading:958171113370828830> Agregando el rol a todos..`)
                                    .setDescription(`Se esta agregando el rol ${rol} a todos lo miembros, tenga paciencia esto puede tardar aproximadamente ${ms(noLoTienen.length * 1000)}.`)
                                    .setColor(msg.guild.members.me.displayHexColor)
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embCargando] }).then(tm => {
                                    if (botDB.servidor.some(s => s.id == msg.guildId)) {
                                        botDB.servidor.find(f => f.id == msg.guildId).comandos.addrol = true
                                    } else {
                                        botDB.servidor.push({ id: msg.guildId, comandos: { addrol: true, removerol: false } })
                                    }

                                    let intervalo = setInterval(() => {
                                        if (cantidad < noLoTienen.length) {
                                            noLoTienen[cantidad].roles.add(rol.id)
                                            cantidad++
                                        } else {
                                            clearInterval(intervalo)
                                            if (siLoTienen.length > 0) {
                                                descripcion = `He añadido el rol ${rol} a **${noLoTienen.length.toLocaleString()}** miembros y **${siLoTienen.length.toLocaleString()}** ya tenían el rol.`
                                            } else {
                                                descripcion = `He añadido el rol ${rol} a **${noLoTienen.length.toLocaleString()}** miembros.`
                                            }
                                            const embRoladd = new EmbedBuilder()
                                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                                .setTitle(`${emojis.acierto} Rol agregado a todos los miembros`)
                                                .setDescription(descripcion)
                                                .setColor('Green')
                                                .setTimestamp()
                                            tm.edit({ embeds: [embRoladd] }).then(td => {
                                                botDB.servidor.find(f => f.id == msg.guildId).comandos.addrol = false
                                            })

                                            datosComando.set(msg.author.id, tiempoActual);
                                            setTimeout(() => {
                                                datosComando.delete(msg.author.id)
                                            }, 60000)
                                        }
                                    }, 1000)
                                })
                            } else {
                                const embError1 = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(`El rol proporcionado *(${rol})* tiene la misma o mayor posición de tu rol mas alto por lo tanto no lo puedes agregar a ningún miembro. `)
                                    .setColor(ColorError)
                                    .setTimestamp()
                                if (msg.member.roles.highest.comparePositionTo(rol) <= 0) return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(et => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        et.delete().catch(c => {
                                            return;
                                        })
                                    }, 30000))
                                }, 500)

                                let noLoTienen = msg.guild.members.cache.filter(f => !f.roles.cache.has(rol.id)).map(n => n), siLoTienen = msg.guild.members.cache.filter(f => f.roles.cache.has(rol.id)).map(s => s), cantidad = 0, descripcion = ""

                                const embCargando = new EmbedBuilder()
                                    .setTitle(`<a:loading:958171113370828830> Agregando el rol a todos..`)
                                    .setDescription(`Se esta agregando el rol ${rol} a todos los miembros, tenga paciencia esto puede tardar aproximadamente ${ms(noLoTienen.length * 1000)}.`)
                                    .setColor(msg.guild.members.me.displayHexColor)
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embCargando] }).then(tm => {
                                    if (botDB.servidor.some(s => s.id == msg.guildId)) {
                                        botDB.servidor.find(f => f.id == msg.guildId).comandos.addrol = true
                                    } else {
                                        botDB.servidor.push({ id: msg.guildId, comandos: { addrol: true, removerol: false } })
                                    }

                                    let intervalo = setInterval(() => {
                                        if (cantidad < noLoTienen.length) {
                                            noLoTienen[cantidad].roles.add(rol.id)
                                            cantidad++
                                        } else {
                                            clearInterval(intervalo)
                                            if (siLoTienen.length > 0) {
                                                descripcion = `He añadido el rol ${rol} a **${noLoTienen.length.toLocaleString()}** miembros y **${siLoTienen.length.toLocaleString()}** ya tenían el rol.`
                                            } else {
                                                descripcion = `He añadido el rol ${rol} a **${noLoTienen.length.toLocaleString()}** miembros.`
                                            }
                                            const embRoladd = new EmbedBuilder()
                                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                                .setTitle(`${emojis.acierto} Rol agregado a todos los miembros`)
                                                .setDescription(descripcion)
                                                .setColor('Green')
                                                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                                .setTimestamp()
                                            tm.edit({ embeds: [embRoladd] }).then(td => {
                                                botDB.servidor.find(f => f.id == msg.guildId).comandos.addrol = false
                                            })

                                            datosComando.set(msg.author.id, tiempoActual);
                                            setTimeout(() => {
                                                datosComando.delete(msg.author.id)
                                            }, 60000)
                                        }
                                    }, 1000)
                                })
                            }

                        } else {
                            let descripciones = [`El primer argumento proporcionado *(${args[0]})* no es una **mención** o **ID** de un miembro del servidor ni es la palabra *all* o *todos*, proporciona una **mención** o **ID** de un miembro en caso de que quieras agregar el rol ${rol} a un miembro, en caso de querer agregar el rol ${rol} a todos los miembros del servidor proporciona la palabra *all* o *todos*.`, `El segundo argumento proporcionado *(${args[1]})* no es una **mención** o **ID** de un miembro del servidor ni es la palabra *all* o *todos*, proporciona una **mención** o **ID** de un miembro en caso de que quieras agregar el rol ${rol} a un miembro, en caso de querer agregar el rol ${rol} a todos lo miembros del servidor proporciona la palabra *all* o *todos*.`]
                            let condicionales = [!isNaN(args[0]) && args[0].length != 18 || isNaN(args[0]) && !["@", "&", "<", ">"].some(s => args[0].includes(s)), !isNaN(args[1]) && args[1].length != 18 || isNaN(args[1]) && !["@", "&", "<", ">"].some(s => args[1].includes(s))]
                            for (let d in descripciones) {
                                if (condicionales[d]) {
                                    const embError = new EmbedBuilder()
                                        .setTitle(`${emojis.negativo} Error`)
                                        .setDescription(descripciones[d])
                                        .setColor(ColorError)
                                        .setTimestamp()
                                    return setTimeout(() => {
                                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError] }).then(et => setTimeout(() => {
                                            msg.delete().catch(c => {
                                                return;
                                            })
                                            et.delete().catch(c => {
                                                return;
                                            })
                                        }, 30000))
                                    }, 500)
                                }
                            }
                        }
                    } else {
                        const embError1 = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`Solo has proporcionado el rol *(${rol})* a agregar pero no has proporcionado al miembro o la palabra *all* o *todos* con las cuales se agregara el rol a todos los miembros del servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(et => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                et.delete().catch(c => {
                                    return;
                                })
                            }, 30000))
                        }, 500)
                    }
                }
            } else {
                const embError1 = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`No has proporcionado lo mas importante que es el rol, asegúrate de proporcionar correctamente la mención o ID del rol.`)
                    .setColor(ColorError)
                    .setTimestamp()
                return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(et => setTimeout(() => {
                        msg.delete().catch(c => {
                            return;
                        })
                        et.delete().catch(c => {
                            return;
                        })
                    }, 30000))
                }, 500)
            }
        }

        if (["removerol", "remover", "rmr"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let roles = msg.guild.roles.cache.filter(fr => !fr.managed && fr.id != msg.guildId).map(mr => mr)
            let random = Math.floor(Math.random() * roles.length)
            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Requieres del permiso: Gestionar roles."})
                .setTimestamp()
            if (!msg.member.permissions.has('ManageRoles')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            const embErrP2 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Requiero del permiso: Gestionar roles."})
                .setTimestamp()
            if (!msg.guild.members.me.permissions.has('ManageRoles')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP2] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            if (!cooldowns.has("removerol")) {
                cooldowns.set("removerol", new Collection())
            }

            const tiempoActual = Date.now(), datosComando = cooldowns.get("removerol")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *removerol*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando removerol`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}removerol <Mencion del miembro> <Mencion del rol>\`\`\n\`\`${prefijo}removerol <ID del miembro> <ID del rol>\`\`` },
                    { name: "Ejemplos: ", value: `${prefijo}removerol ${msg.author} ${roles[random]}\n${prefijo}removerol ${msg.author} ${roles[random].id}\n${prefijo}removeRol ${msg.author.id} ${roles[random].id}\n${prefijo}removeRol ${msg.author.id} ${roles[random]}` },
                    { name: "Alias: *3*", value: `\`\`removerol\`\`, \`\`remover\`\`, \`\`rmr\`\`` },
                    { name: "Descripción:", value: `Elimina un rol de un miembro o de todos los miembros del servidor.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0]) || msg.guild.roles.cache.get(args[1])
            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.get(args[1])


            if (rol) {
                if (miembro) {
                    let descripciones = [`El rol proporcionado *(${rol})* es exclusivo para un bot, no se le puede remover de ningún miembro ya que solo lo puede tener un bot.`, `El rol proporcionado *(${rol})* tiene una posición igual o mayor a la de mi rol mas alto por lo tanto no puedo remover ese rol de ningún miembro.`, `El miembro proporcionado *(${miembro})* eres tu y no tienes el rol ${rol}.`, `El miembro proporcionado *(${miembro})* no tiene el rol ${rol}.`]
                    let condicionales = [rol.managed, msg.guild.members.me.roles.highest.comparePositionTo(rol) <= 0, miembro.id == msg.author.id && !miembro.roles.cache.find(f => f.id == rol.id), !miembro.roles.cache.find(f => f.id == rol.id)]
                    for (let d in descripciones) {
                        if (condicionales[d]) {
                            const embError = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[d])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError] }).then(et => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    et.delete().catch(c => {
                                        return;
                                    })
                                }, 30000))
                            }, 500)
                        }
                    }

                    if (msg.author.id == msg.guild.ownerId) {
                        if (miembro.id == msg.author.id) {
                            const embRolRemove = new EmbedBuilder()
                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                .setTitle(`${emojis.acierto} Rol removido del miembro`)
                                .setDescription(`Te he removido el rol ${rol}.`)
                                .setColor('Green')
                                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                .setTimestamp()
                            miembro.roles.remove(rol.id).then(() => setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embRolRemove] })
                            }, 500))
                        } else {
                            const embRolRemove = new EmbedBuilder()
                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                .setTitle(`${emojis.acierto} Rol removido del miembro`)
                                .setDescription(`El rol ${rol} ha sido removido del miembro ${miembro}.`)
                                .setColor('Green')
                                .setFooter({text: miembro.nickname || miembro.user.username, iconURL: miembro.displayAvatarURL()})
                                .setTimestamp()
                            miembro.roles.remove(rol.id).then(() => setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embRolRemove] })
                            }, 500))
                        }

                    } else {
                        if (miembro.id == msg.author.id) {
                            const embError1 = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(`El rol proporcionado *(${rol})* tiene la misma o mayor posición de tu rol mas alto por lo tanto no te puedo remover el rol.`)
                                .setColor(ColorError)
                                .setTimestamp()
                            if (msg.member.roles.highest.comparePositionTo(rol) <= 0) return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(et => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    et.delete().catch(c => {
                                        return;
                                    })
                                }, 30000))
                            }, 500)

                            const embRolRemove = new EmbedBuilder()
                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                .setTitle(`${emojis.acierto} Rol removido del miembro`)
                                .setDescription(`Te he removido el rol ${rol}.`)
                                .setColor('Green')
                                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                .setTimestamp()
                            miembro.roles.remove(rol.id).then(() => setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embRolRemove] })
                            }, 500))
                        } else {
                            const embError1 = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(`El rol proporcionado *(${rol})* tiene la misma o mayor posición de tu rol mas alto por lo tanto no lo puedes remover de ningún miembro.`)
                                .setColor(ColorError)
                                .setTimestamp()
                            if (msg.member.roles.highest.comparePositionTo(rol) <= 0) return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(et => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    et.delete().catch(c => {
                                        return;
                                    })
                                }, 30000))
                            }, 500)

                            const embRolRemove = new EmbedBuilder()
                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                .setTitle(`${emojis.acierto} Rol removido del miembro`)
                                .setDescription(`El rol ${rol} ha sido removido del miembro ${miembro}.`)
                                .setColor('Green')
                                .setFooter({text: miembro.nickname || miembro.user.username, iconURL: miembro.displayAvatarURL()})
                                .setTimestamp()
                            miembro.roles.remove(rol.id).then(() => setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embRolRemove] })
                            }, 500))
                        }
                    }

                    datosComando.set(msg.author.id, tiempoActual);
                    setTimeout(() => {
                        datosComando.delete(msg.author.id)
                    }, 60000)

                } else {
                    if (args[0] && args[1]) {
                        if (["all", "todos"].some(s => s == args[0].toLowerCase()) || ["all", "todos"].some(s => s == args[1].toLowerCase())) {
                            let descripciones = [`El rol proporcionado *(${rol})* es exclusivo para un bot, no se le puede remover de ningún miembro ya que solo lo puede tener un bot.`, `El rol proporcionado *(${rol})* tiene una posición igual o mayor a la de mi rol mas alto por lo tanto no puedo remover ese rol de ningún miembro.`, `Ahora estoy agregando un rol a todos los miembros del servidor, no puedo agregar **2** o mas roles a todos los miembros a la vez.`]
                            let condicionales = [rol.managed, msg.guild.members.me.roles.highest.comparePositionTo(rol) <= 0, botDB.servidor.some(s => s.id == msg.guildId) && botDB.servidor.find(f => f.id == msg.guildId).comandos.removerol]
                            for (let d in descripciones) {
                                if (condicionales[d]) {
                                    const embError = new EmbedBuilder()
                                        .setTitle(`${emojis.negativo} Error`)
                                        .setDescription(descripciones[d])
                                        .setColor(ColorError)
                                        .setTimestamp()
                                    return setTimeout(() => {
                                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError] }).then(et => setTimeout(() => {
                                            msg.delete().catch(c => {
                                                return;
                                            })
                                            et.delete().catch(c => {
                                                return;
                                            })
                                        }, 30000))
                                    }, 500)
                                }
                            }

                            if (msg.guild.ownerId == msg.author.id) {
                                let noLoTienen = msg.guild.members.cache.filter(f => !f.roles.cache.has(rol.id)).map(n => n), siLoTienen = msg.guild.members.cache.filter(f => f.roles.cache.has(rol.id)).map(s => s), cantidad = 0, descripcion = ""

                                const embCargando = new EmbedBuilder()
                                    .setTitle(`<a:loading:958171113370828830> Rremoviendo el rol de todos..`)
                                    .setDescription(`Se esta removiendo el rol ${rol} de todos los miembros, tenga paciencia esto puede tardar aproximadamente ${ms(siLoTienen.length * 1000)}`)
                                    .setColor(msg.guild.members.me.displayHexColor)
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embCargando] }).then(tm => {
                                    if (botDB.servidor.some(s => s.id == msg.guildId)) {
                                        botDB.servidor.find(f => f.id == msg.guildId).comandos.removerol = true
                                    } else {
                                        botDB.servidor.push({ id: msg.guildId, comandos: { addrol: false, removerol: true } })
                                    }

                                    let intervalo = setInterval(() => {
                                        if (cantidad < siLoTienen.length) {
                                            siLoTienen[cantidad].roles.remove(rol.id)
                                            cantidad++
                                        } else {
                                            clearInterval(intervalo)
                                            if (noLoTienen.length > 0) {
                                                descripcion = `He removido el rol ${rol} de **${siLoTienen.length.toLocaleString()}** miembros y **${noLoTienen.length.toLocaleString()}** no tenían el rol.`
                                            } else {
                                                descripcion = `He removido el rol ${rol} de **${siLoTienen.length.toLocaleString()}** miembros.`
                                            }
                                            const embRolRemove = new EmbedBuilder()
                                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                                .setTitle(`${emojis.acierto} Rol removido de todos los miembros`)
                                                .setDescription(descripcion)
                                                .setColor('Green')
                                                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                                .setTimestamp()
                                            tm.edit({ embeds: [embRolRemove] }).then(td => {
                                                botDB.servidor.find(f => f.id == msg.guildId).comandos.removerol = false
                                            })

                                            datosComando.set(msg.author.id, tiempoActual);
                                            setTimeout(() => {
                                                datosComando.delete(msg.author.id)
                                            }, 60000)
                                        }
                                    }, 1000)
                                })
                            } else {
                                const embError1 = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(`El rol proporcionado *(${rol})* tiene la misma o mayor posición de tu rol mas alto por lo tanto no lo puedes remover de ningún miembro.`)
                                    .setColor(ColorError)
                                    .setTimestamp()
                                if (msg.member.roles.highest.comparePositionTo(rol) <= 0) return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(et => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        et.delete().catch(c => {
                                            return;
                                        })
                                    }, 30000))
                                }, 500)

                                let noLoTienen = msg.guild.members.cache.filter(f => !f.roles.cache.has(rol.id)).map(n => n), siLoTienen = msg.guild.members.cache.filter(f => f.roles.cache.has(rol.id)).map(s => s), cantidad = 0, descripcion = ""

                                const embCargando = new EmbedBuilder()
                                    .setTitle(`<a:loading:958171113370828830> Rremoviendo el rol de todos..`)
                                    .setDescription(`Se esta removiendo el rol ${rol} de todos los miembros, tenga paciencia esto puede tardar aproximadamente ${ms(siLoTienen.length * 1000)}`)
                                    .setColor(msg.guild.members.me.displayHexColor)
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embCargando] }).then(tm => {
                                    if (botDB.servidor.some(s => s.id == msg.guildId)) {
                                        botDB.servidor.find(f => f.id == msg.guildId).comandos.removerol = true
                                    } else {
                                        botDB.servidor.push({ id: msg.guildId, comandos: { addrol: false, removerol: true } })
                                    }

                                    let intervalo = setInterval(() => {
                                        if (cantidad < siLoTienen.length) {
                                            siLoTienen[cantidad].roles.remove(rol.id)
                                            cantidad++
                                        } else {
                                            clearInterval(intervalo)
                                            if (noLoTienen.length > 0) {
                                                descripcion = `He removido el rol ${rol} de **${siLoTienen.length.toLocaleString()}** miembros y **${noLoTienen.length.toLocaleString()}** no tenían el rol.`
                                            } else {
                                                descripcion = `He removido el rol ${rol} de **${siLoTienen.length.toLocaleString()}** miembros.`
                                            }
                                            const embRolRemove = new EmbedBuilder()
                                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                                .setTitle(`${emojis.acierto} Rol removido de todos los miembros`)
                                                .setDescription(descripcion)
                                                .setColor('Green')
                                                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                                .setTimestamp()
                                            tm.edit({ embeds: [embRolRemove] }).then(td => {
                                                botDB.servidor.find(f => f.id == msg.guildId).comandos.removerol = false
                                            })

                                            datosComando.set(msg.author.id, tiempoActual);
                                            setTimeout(() => {
                                                datosComando.delete(msg.author.id)
                                            }, 60000)
                                        }
                                    }, 1000)
                                })
                            }
                        } else {
                            let descripciones = [`El primer argumento proporcionado *(${args[0]})* no es una **mención** o **ID** de un miembro del servidor ni es la palabra *all* o *todos*, proporciona una **mención** o **ID** de un miembro en caso de que quieras remover el rol ${rol} de un miembro, en caso de querer remover el rol ${rol} de todos los miembros del servidor proporciona la palabra *all* o *todos*.`, `El segundo argumento proporcionado *(${args[1]})* no es una **mención** o **ID** de un miembro del servidor ni es la palabra *all* o *todos*, proporciona una **mención** o **ID** de un miembro en caso de que quieras remover el rol ${rol} de un miembro, en caso de querer remover el rol ${rol} a todos los miembros del servidor proporciona la palabra *all* o *todos*.`]
                            let condicionales = [!isNaN(args[0]) && args[0].length != 18 || isNaN(args[0]) && !["@", "&", "<", ">"].some(s => args[0].includes(s)), !isNaN(args[1]) && args[1].length != 18 || isNaN(args[1]) && !["@", "&", "<", ">"].some(s => args[1].includes(s))]
                            for (let d in descripciones) {
                                if (condicionales[d]) {
                                    const embError = new EmbedBuilder()
                                        .setTitle(`${emojis.negativo} Error`)
                                        .setDescription(descripciones[d])
                                        .setColor(ColorError)
                                        .setTimestamp()
                                    return setTimeout(() => {
                                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError] }).then(et => setTimeout(() => {
                                            msg.delete().catch(c => {
                                                return;
                                            })
                                            et.delete().catch(c => {
                                                return;
                                            })
                                        }, 30000))
                                    }, 500)
                                }
                            }
                        }
                    } else {
                        const embError1 = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`Solo has proporcionado el rol *(${rol})* a remover pero no has proporcionado al miembro o la palabra *all* o *todos* con las cuales se removera el rol de todos los miembros del servidor.`)
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(et => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                et.delete().catch(c => {
                                    return;
                                })
                            }, 30000))
                        }, 500)
                    }
                }
            } else {
                const embError1 = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`No has proporcionado lo mas importante que es el rol, asegúrate de proporcionar correctamente la mención o ID del rol.`)
                    .setColor(ColorError)
                    .setTimestamp()
                return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(et => setTimeout(() => {
                        msg.delete().catch(c => {
                            return;
                        })
                        et.delete().catch(c => {
                            return;
                        })
                    }, 30000))
                }, 500)
            }
        }

        if (["createchannel", "createcha", "crech"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let categoriasGMS = msg.guild.channels.cache.filter(fc => fc.type === "GUILD_CATEGORY").map(mc => mc.id)
            let randomCat = Math.floor(Math.random() * categoriasGMS.length)

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
            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Requieres del permiso: Gestionar roles."})
                .setTimestamp()
            if (!msg.member.permissions.has('ManageChannels')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            const embErrP2 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Requiero del permiso: Gestionar roles."})
                .setTimestamp()
            if (!msg.guild.members.me.permissions.has('ManageChannels')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP2] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            if (!cooldowns.has("createchannel")) {
                cooldowns.set("createchannel", new Collection())
            }

            const tiempoActual = Date.now(), datosComando = cooldowns.get("createchannel")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *createchannel*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando createchannel`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}createchannel <Nombre del canal>\`\`\n\`\`${prefijo}createchannel <Nombre del canal> <Tipo de canal (texto o voz)>\`\`\n\`\`${prefijo}createchannel <Nombre del canal> <Tipo de canal (texto o voz)> <ID de la categoría en la que se creara>\`\`` },
                    { name: "Ejemplos:", value: `${prefijo}createchannel Chat\n${prefijo}createchannel Reglas texto\n${prefijo}createchannel Musica voz ${categoriasGMS[randomCat]}` },
                    { name: "Alias: *3*", value: `\`\`createchannel\`\`, \`\`createcha\`\`, \`\`crech\`\`` },
                    { name: "Descripción:", value: `Crea un canal de texto o voz en una categoría.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let tipoCanal = ""

            if (args[0]) {
                if (args[1]) {
                    if (isNaN(args[1])) {
                        const embErr1 = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El segundo argumento que has proporcionado *(${args[1]})* no es igual a las palabra **texto** o **voz** las cuales determinan el tipo de canal que seré creado.`)
                            .setColor(ColorError)
                            .setTimestamp()
                        if (!["texto", "voz"].some(s => s == args[1].toLowerCase())) return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr1] }).then(et => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                et.delete().catch(c => {
                                    return;
                                })
                            }, 30000))
                        }, 500)
                        console.log(args[0])
                        console.log(args[1])

                        if (args[2]) {
                            let descripciones = [`El argumento numérico  ingresado *(${args[2]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args[2]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El tercer argumento proporcionado (*${args[2]}*) no es una ID de una categoría valido ya que no es numérico, proporciona una ID valida.`]
                            let condicionales = [!isNaN(args[2]) && args[2].length < 18, !isNaN(args[2]) && args[2].length > 18, isNaN(args[2])]

                            for (let i = 0; i < descripciones.length; i++) {
                                if (condicionales[i]) {
                                    const embErr = new EmbedBuilder()
                                        .setTitle(`${emojis.negativo} Error`)
                                        .setDescription(descripciones[i])
                                        .setColor(ColorError)
                                        .setTimestamp()
                                    return setTimeout(() => {
                                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                            msg.delete().catch(c => {
                                                return;
                                            })
                                            dt.delete().catch(e => {
                                                return;
                                            })
                                        }, 30000));
                                    }, 500)
                                }
                            }

                            if (args[1].toLowerCase() == "texto") {
                                tipoCanal = "GUILD_TEXT"
                            } else {
                                if (args[1].toLowerCase() == "voz") {
                                    tipoCanal = "GUILD_VOICE"
                                } else {
                                    tipoCanal = "GUILD_TEXT"
                                }
                            }

                            msg.guild.channels.create(`${args[0]}`, { type: `${tipoCanal}`, parent: `${args[2]}` }).then(cc => setTimeout(() => {
                                const embCreateCha = new EmbedBuilder()
                                    .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                    .setTitle(`${emojis.acierto} Canal creado`)
                                    .setDescription(`**Canal:** ${cc}\n**Nombre:** ${cc.name}\n**ID:** ${cc.id}\n\n**Tipo:** ${tiposDeCanales[cc.type]}\n\n**Categoría:** ${cc.parent ? cc.parent : "*Sin categoría*"}`)
                                    .setColor('Green')
                                    .setTimestamp()
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embCreateCha] })
                            }, 300))

                        } else {
                            if (args[1].toLowerCase() == "texto") {
                                tipoCanal = "GUILD_TEXT"
                            } else {
                                if (args[1].toLowerCase() == "voz") {
                                    tipoCanal = "GUILD_VOICE"
                                } else {
                                    tipoCanal = "GUILD_TEXT"
                                }
                            }

                            msg.guild.channels.create(`${args[0]}`, { type: `${tipoCanal}`, parent: `${msg.channel.parentId}` }).then(cc => setTimeout(() => {
                                const embCreateCha = new EmbedBuilder()
                                    .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                    .setTitle(`${emojis.acierto} Canal creado`)
                                    .setDescription(`**Canal:** ${cc}\n**Nombre:** ${cc.name}\n**ID:** ${cc.id}\n\n**Tipo:** ${tiposDeCanales[cc.type]}\n\n**Categoría:** ${cc.parent ? cc.parent : "*Sin categoría*"}`)
                                    .setColor('Green')
                                    .setTimestamp()
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embCreateCha] })
                            }, 300))
                        }
                    } else {
                        let descripciones = [`El segundo argumento proporcionado *(${args[2]})* es numérico por lo tanto debería ser una ID de una categoría pero no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El segundo argumento proporcionado *(${args[2]})* es numérico por lo tanto debería ser una ID de una categoría pero no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`]
                        let condicionales = [!isNaN(args[2]) && args[2].length < 18, !isNaN(args[2]) && args[2].length > 18]

                        for (let i = 0; i < descripciones.length; i++) {
                            if (condicionales[i]) {
                                const embErr = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(descripciones[i])
                                    .setColor(ColorError)
                                    .setTimestamp()
                                return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        dt.delete().catch(e => {
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }


                        msg.guild.channels.create(`${args[0]}`, { parent: `${args[1]}` }).then(cc => setTimeout(() => {
                            const embCreateCha = new EmbedBuilder()
                                .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                                .setTitle(`${emojis.acierto} Canal creado`)
                                .setDescription(`**Canal:** ${cc}\n**Nombre:** ${cc.name}\n**ID:** ${cc.id}\n\n**Tipo:** ${tiposDeCanales[cc.type]}\n\n**Categoría:** ${cc.parent ? cc.parent : "*Sin categoría*"}`)
                                .setColor('Green')
                                .setTimestamp()
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embCreateCha] })
                        }, 300))
                    }
                } else {
                    const embErr3 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El primer argumento *(${args[0]})* el cual será el nombre del canal supera los **80** caracteres los cuales son muchos para el nombre de un canal.`)
                        .setColor(ColorError)
                        .setTimestamp()
                    if (args[0].length > 80) return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr3] }).then(et => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            et.delete().catch(c => {
                                return;
                            })
                        }, 30000))
                    }, 500)

                    msg.guild.channels.create(`${args[0]}`, { parent: msg.channel.parentId }).then(cc => setTimeout(() => {
                        const embCreateCha = new EmbedBuilder()
                            .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                            .setTitle(`${emojis.acierto} Canal creado`)
                            .setDescription(`**Canal:** ${cc}\n**Nombre:** ${cc.name}\n**ID:** ${cc.id}\n\n**Tipo:** ${tiposDeCanales[cc.type]}\n\n**Categoría:** ${cc.parent ? cc.parent : "*Sin categoría*"}`)
                            .setColor('Green')
                            .setTimestamp()
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embCreateCha] })
                    }, 300))
                }
            }

            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }

        if (["deletechannel", "deletecha", "delch"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let canalesAlDel = msg.guild.channels.cache.filter(fc => fc.type === "GUILD_TEXT").map(mc => mc)
            let randomChanne = Math.floor(Math.random() * canalesAlDel.length)

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


            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Requieres del permiso: Gestionar roles."})
                .setTimestamp()
            if (!msg.member.permissions.has('ManageChannels')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            const embErrP2 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tengo los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Requiero del permiso: Gestionar roles."})
                .setTimestamp()
            if (!msg.guild.members.me.permissions.has('ManageChannels')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP2] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            if (!cooldowns.has("deletechannel")) {
                cooldowns.set("deletechannel", new Collection())
            }

            const tiempoActual = Date.now(), datosComando = cooldowns.get("deletechannel")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *deletechannel*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando deletechannel`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}deletechannel <Mencion del canal>\`\`\n\`\`${prefijo}deletechannel <ID del canal>\`\`` },
                    { name: "Ejemplos:", value: `${prefijo}deletechannel ${canalesAlDel[randomChanne]}\n${prefijo}deletechannel ${canalesAlDel[randomChanne].id}` },
                    { name: "Alias: *3*", value: `\`\`deletechannel\`\`, \`\`deletecha\`\`, \`\`delch\`\`` },
                    { name: "Descripción:", value: `Elimina un canal del servidor.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })

            let canal = msg.mentions.channels.first() || msg.guild.channels.cache.get(args[0])

            if (canal) {
                const embDeleteCha = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("⭕ Canal eliminado")
                    .setDescription(`**Nombre:** ${canal.name}\n**ID:** ${canal.id}\n**Tipo:** ${tiposDeCanales[canal.type]}\n**Categoría:** ${canal.parent ? canal.parent : "*Sin categoría*"}`)
                    .setColor('Red')
                    .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                    .setTimestamp()
                canal.delete().then(ch => setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embDeleteCha] })
                }, 300))
            } else {
                let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado (*${args[0]}*) no se reconoce como una mención o ID de un canal del servidor, proporciona una mención o ID valida de un canal.`]
                let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

                for (let i = 0; i < descripciones.length; i++) {
                    if (condicionales[i]) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }
            }

            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }

        if (["memberswithrole", "memberswr", "miembrosconelrol", "mcer"].some(s => comando == s)) {
            botDB.comandos.usos++
            let roles = msg.guild.roles.cache.filter(fr => !fr.managed && fr.id != msg.guildId).map(mr => mr)
            msg.channel.sendTyping()
            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Permiso requerido:  Gestionar roles"})
                .setTimestamp()
            if (!msg.member.permissions.has('ManageRoles')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            if (!cooldowns.has("memberswithrole")) {
                cooldowns.set("memberswithrole", new Collection())
            }

            const tiempoActual = Date.now(), datosComando = cooldowns.get("memberswithrole")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *memberswithrole*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando memberswithrole`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}memberswithrole <Mención del rol>\`\`\n\`\`${prefijo}memberswithrole <ID del rol>\`\`` },
                    { name: "Ejemplos:", value: `${prefijo}memberswithrole ${roles[Math.floor(Math.random() * roles.length)]}\n${prefijo}memberswithrole ${roles[Math.floor(Math.random() * roles.length)].id}` },
                    { name: "Alias:", value: `\`\`memberswithrole\`\`, \`\`memberswr\`\`, \`\`miembrosconelrol\`\`, \`\`mcer\`\`` },
                    { name: "Descripción:", value: `Muestra una lista de todos los miembros del servidor que tienen el rol proporcionado.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0])

            if (rol) {
                const embError1 = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`El rol proporcionado ${rol} es un rol exclusivo de un bot, solo un bot puede tener ese rol el cual es ${msg.guild.members.cache.find(f => f.roles.cache.has(rol.id))}`)
                    .setColor(ColorError)
                    .setTimestamp()
                if (rol.managed) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] })
                }, 500)

                const embError2 = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`El rol proporcionado ${rol} es el rol que todos los miembros tienen por defecto al entrar al servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                if (rol.id == msg.guildId) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError2] })
                }, 500)

                let miembros = msg.guild.members.cache.filter(f => f.roles.cache.has(rol.id)).map(r => r)

                const embNoMiembros = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("👥 Miembros con el rol")
                    .setDescription(`${rol}\n*No hay miembros con ese rol.*`)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                    .setTimestamp()
                if (miembros.length <= 0) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embNoMiembros] })
                }, 500)

                let segPage
                if (String(miembros.length).slice(-1) == "0") {
                    segPage = Math.floor(miembros.length / 10)
                } else {
                    segPage = Math.floor(miembros.length / 10 + 1)
                }

                if (miembros.length <= 10) {
                    const embMiembros = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setTitle("👥 Miembros con el rol")
                        .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros con el rol.\n\n${miembros.map((m, r) => `**${r + 1}.** [${m.user.tag}](${m.user.displayAvatarURL({  format: "png" || "gif", size: 4096 })})\n${m}`).join("\n\n")}`)
                        .setColor(msg.guild.members.me.displayHexColor)
                        .setFooter({text: `Pagina - 1/${segPage}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMiembros] })
                    }, 500)
                } else {
                    let m1 = 0, m2 = 10, pagina = 1, descripcion = `${rol}\nHay **${miembros.length.toLocaleString()}** miembros con el rol.\n\n`

                    const embMiembros = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setTitle("👥 Miembros con el rol")
                        .setDescription(descripcion + miembros.map((m, r) => `**${r + 1}.** [${m.user.tag}](${m.user.displayAvatarURL({  format: "png" || "gif", size: 4096 })})\n${m}`).slice(m1, m2).join("\n\n"))
                        .setColor(msg.guild.members.me.displayHexColor)
                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()

                    const botones1 = new ActionRowBuilder()
                        .setComponents(
                            [
                                new ButtonBuilder()
                                    .setCustomId("1")
                                    .setLabel("Anterior")
                                    .setEmoji("<a:LeftArrow:942155020017754132>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(true),
                            
                                new ButtonBuilder()
                                    .setCustomId("2")
                                    .setLabel("Siguiente ")
                                    .setEmoji("<a:RightArrow:942154978859044905>")
                                    .setStyle(ButtonStyle.Primary)
                            ]
                        )

                    const botones2 = new ActionRowBuilder()
                        .setComponents(
                            [
                                new ButtonBuilder()
                                    .setCustomId("1")
                                    .setLabel("Anterior")
                                    .setEmoji("<a:LeftArrow:942155020017754132>")
                                    .setStyle(ButtonStyle.Primary),
                            
                                new ButtonBuilder()
                                    .setCustomId("2")
                                    .setLabel("Siguiente")
                                    .setEmoji("<a:RightArrow:942154978859044905>")
                                    .setStyle(ButtonStyle.Primary)
                            ]
                        )

                    const botones3 = new ActionRowBuilder()
                        .setComponents(
                            [
                                new ButtonBuilder()
                                    .setCustomId("1")
                                    .setLabel("Anterior")
                                    .setEmoji("<a:LeftArrow:942155020017754132>")
                                    .setStyle(ButtonStyle.Primary),
                            
                                new ButtonBuilder()
                                    .setCustomId("2")
                                    .setLabel("Siguiente")
                                    .setEmoji("<a:RightArrow:942154978859044905>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(true)
                            ]
                        )

                    setTimeout(async () => {
                        const mensajeSend = await msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMiembros], components: [botones1] })
                        const colector = mensajeSend.createMessageComponentCollector({ filter: i => i.user.id == msg.author.id, time: segPage * 60000 })

                        setTimeout(() => {
                            mensajeSend.edit({ embeds: [embMiembros], components: [] })
                        }, segPage * 60000)

                        colector.on("collect", async botn => {
                            if (botn.customId == "1") {
                                if (m2 - 10 <= 10) {
                                    m1 -= 10, m2 -= 10, pagina--

                                    embMiembros
                                        .setDescription(descripcion + miembros.map((m, r) => `**${r + 1}.** [${m.user.tag}](${m.user.displayAvatarURL({  format: "png" || "gif", size: 4096 })})\n${m}`).slice(m1, m2).join("\n\n"))
                                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                    await botn.update({ embeds: [embMiembros], components: [botones1] })
                                } else {
                                    m1 -= 10, m2 -= 10, pagina--

                                    embMiembros
                                        .setDescription(descripcion + miembros.map((m, r) => `**${r + 1}.** [${m.user.tag}](${m.user.displayAvatarURL({  format: "png" || "gif", size: 4096 })})\n${m}`).slice(m1, m2).join("\n\n"))
                                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                    await botn.update({ embeds: [embMiembros], components: [botones2] })
                                }
                            }
                            if (botn.customId == "2") {
                                if (m2 + 10 >= miembros.length) {
                                    m1 += 10, m2 += 10, pagina++

                                    embMiembros
                                        .setDescription(descripcion + miembros.map((m, r) => `**${r + 1}.** [${m.user.tag}](${m.user.displayAvatarURL({  format: "png" || "gif", size: 4096 })})\n${m}`).slice(m1, m2).join("\n\n"))
                                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                    await botn.update({ embeds: [embMiembros], components: [botones3] })
                                } else {
                                    m1 += 10, m2 += 10, pagina++

                                    embMiembros
                                        .setDescription(descripcion + miembros.map((m, r) => `**${r + 1}.** [${m.user.tag}](${m.user.displayAvatarURL({  format: "png" || "gif", size: 4096 })})\n${m}`).slice(m1, m2).join("\n\n"))
                                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                    await botn.update({ embeds: [embMiembros], components: [botones2] })
                                }
                            }
                        })
                    }, 500)
                }
            } else {
                let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado (*${args[0]}*) no se reconoce como una mención o ID de un rol del servidor, proporciona una mención o ID de un rol del servidor.`]
                let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

                condicionales.forEach((valorCs, ps) => {
                    if (valorCs) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[ps])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                })
            }

            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }

        if (["memberswithouttherole", "mwtr", "miembrossinelrol", "mser"].some(s => comando == s)) {
            botDB.comandos.usos++
            let roles = msg.guild.roles.cache.filter(fr => !fr.managed && fr.id != msg.guildId).map(mr => mr)
            msg.channel.sendTyping()
            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Permiso requerido:  Gestionar roles"})
                .setTimestamp()
            if (!msg.member.permissions.has('ManageRoles')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            if (!cooldowns.has("memberswithouttherole")) {
                cooldowns.set("memberswithouttherole", new Collection())
            }

            const tiempoActual = Date.now(), datosComando = cooldowns.get("memberswithouttherole")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *memberswithouttherole*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando memberswithouttherole`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}memberswithouttherole <Mención del rol>\`\`\n\`\`${prefijo}memberswithouttherole <ID del rol>\`\`` },
                    { name: "Ejemplos:", value: `${prefijo}memberswithouttherole ${roles[Math.floor(Math.random() * roles.length)]}\n${prefijo}memberswithouttherole ${roles[Math.floor(Math.random() * roles.length)].id}` },
                    { name: "Alias:", value: `\`\`memberswithouttherole\`\`, \`\`mwtr\`\`, \`\`miembrossinelrol\`\`, \`\`mser\`\`` },
                    { name: "Descripción:", value: `Muestra una lista de todos los miembros del servidor que no tienen el rol proporcionado.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0])

            if (rol) {
                const embError1 = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`El rol proporcionado ${rol} es un rol exclusivo de un bot, solo un bot puede tener ese rol el cual es ${msg.guild.members.cache.find(f => f.roles.cache.has(rol.id))}, todos los demás miembros no tienen el rol.`)
                    .setColor(ColorError)
                    .setTimestamp()
                if (rol.managed) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] })
                }, 500)

                const embError2 = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`El rol proporcionado ${rol} es el rol que todos los miembros tienen por defecto al entrar al servidor, no hay ningún miembro en el servidor que no tenga ese rol.`)
                    .setColor(ColorError)
                    .setTimestamp()
                if (rol.id == msg.guildId) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError2] })
                }, 500)

                let miembros = msg.guild.members.cache.filter(f => !f.roles.cache.has(rol.id)).map(r => r)

                const embNoMiembros = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("👥 Miembros sin el rol")
                    .setDescription(`${rol}\n*Todos los miembros tienen el rol.*`)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                    .setTimestamp()
                if (miembros.length == 0) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embNoMiembros] })
                }, 500)

                let segPage
                if (String(miembros.length).slice(-1) == "0") {
                    segPage = Math.floor(miembros.length / 10)
                } else {
                    segPage = Math.floor(miembros.length / 10 + 1)
                }

                if (miembros.length <= 10) {
                    const embMiembros = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setTitle("👥 Miembros sin el rol")
                        .setDescription(`${rol}\nHay **${miembros.length.toLocaleString()}** miembros sin el rol.\n\n${miembros.map((m, r) => `**${r + 1}.** [${m.user.tag}](${m.user.displayAvatarURL({  format: "png" || "gif", size: 4096 })})\n${m}`).join("\n\n")}`)
                        .setColor(msg.guild.members.me.displayHexColor)
                        .setFooter({text: `Pagina - 1/${segPage}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMiembros] })
                    }, 500)
                } else {
                    let m1 = 0, m2 = 10, pagina = 1, descripcion = `${rol}\nHay **${miembros.length.toLocaleString()}** miembros sin el rol.\n\n`

                    const embMiembros = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setTitle("👥 Miembros sin el rol")
                        .setDescription(descripcion + miembros.map((m, r) => `**${r + 1}.** [${m.user.tag}](${m.user.displayAvatarURL({  format: "png" || "gif", size: 4096 })})\n${m}`).slice(m1, m2).join("\n\n"))
                        .setColor(msg.guild.members.me.displayHexColor)
                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()

                    const botones1 = new ActionRowBuilder()
                        .setComponents(
                            [
                                new ButtonBuilder()
                                    .setCustomId("1")
                                    .setLabel("Anterior")
                                    .setEmoji("<a:LeftArrow:942155020017754132>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(true),
                            
                                new ButtonBuilder()
                                    .setCustomId("2")
                                    .setLabel("Siguiente ")
                                    .setEmoji("<a:RightArrow:942154978859044905>")
                                    .setStyle(ButtonStyle.Primary)
                            ]
                        )

                    const botones2 = new ActionRowBuilder()
                        .setComponents(
                            [
                                new ButtonBuilder()
                                    .setCustomId("1")
                                    .setLabel("Anterior")
                                    .setEmoji("<a:LeftArrow:942155020017754132>")
                                    .setStyle(ButtonStyle.Primary),
                            
                                new ButtonBuilder()
                                    .setCustomId("2")
                                    .setLabel("Siguiente")
                                    .setEmoji("<a:RightArrow:942154978859044905>")
                                    .setStyle(ButtonStyle.Primary)
                            ]
                        )

                    const botones3 = new ActionRowBuilder()
                        .setComponents(
                            [
                                new ButtonBuilder()
                                    .setCustomId("1")
                                    .setLabel("Anterior")
                                    .setEmoji("<a:LeftArrow:942155020017754132>")
                                    .setStyle(ButtonStyle.Primary),
                            
                                new ButtonBuilder()
                                    .setCustomId("2")
                                    .setLabel("Siguiente")
                                    .setEmoji("<a:RightArrow:942154978859044905>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(true)
                            ]
                        )

                    setTimeout(async () => {
                        const mensajeSend = await msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embMiembros], components: [botones1] })
                        const filtro = i => i.user.id === msg.author.id;
                        const colector = mensajeSend.createMessageComponentCollector({ filter: filtro, time: segPage * 60000 })

                        setTimeout(() => {
                            mensajeSend.edit({ embeds: [embMiembros], components: [] })
                        }, segPage * 60000)

                        colector.on("collect", async botn => {
                            if (botn.customId === "1") {
                                if (m2 - 10 <= 10) {
                                    m1 -= 10, m2 -= 10, pagina--

                                    embMiembros
                                        .setDescription(descripcion + miembros.map((m, r) => `**${r + 1}.** [${m.user.tag}](${m.user.displayAvatarURL({  format: "png" || "gif", size: 4096 })})\n${m}`).slice(m1, m2).join("\n\n"))
                                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                    await botn.update({ embeds: [embMiembros], components: [botones1] })
                                } else {
                                    m1 -= 10, m2 -= 10, pagina--

                                    embMiembros
                                        .setDescription(descripcion + miembros.map((m, r) => `**${r + 1}.** [${m.user.tag}](${m.user.displayAvatarURL({  format: "png" || "gif", size: 4096 })})\n${m}`).slice(m1, m2).join("\n\n"))
                                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                    await botn.update({ embeds: [embMiembros], components: [botones2] })
                                }
                            }
                            if (botn.customId === "2") {
                                if (m2 + 10 >= miembros.length) {
                                    m1 += 10, m2 += 10, pagina++

                                    embMiembros
                                        .setDescription(descripcion + miembros.map((m, r) => `**${r + 1}.** [${m.user.tag}](${m.user.displayAvatarURL({  format: "png" || "gif", size: 4096 })})\n${m}`).slice(m1, m2).join("\n\n"))
                                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                    return await botn.update({ embeds: [embMiembros], components: [botones3] })
                                } else {
                                    m1 += 10, m2 += 10, pagina++

                                    embMiembros
                                        .setDescription(descripcion + miembros.map((m, r) => `**${r + 1}.** [${m.user.tag}](${m.user.displayAvatarURL({  format: "png" || "gif", size: 4096 })})\n${m}`).slice(m1, m2).join("\n\n"))
                                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                    await botn.update({ embeds: [embMiembros], components: [botones2] })
                                }
                            }
                        })
                    }, 500)
                }
            } else {
                let descripciones = [`El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado (*${args[0]}*) no se reconoce como una mención o ID de un rol del servidor, proporciona una mención o ID de un rol del servidor.`]
                let condicionales = [!isNaN(args[0]) && args[0].length < 18, !isNaN(args[0]) && args[0].length > 18, isNaN(args[0])]

                condicionales.forEach((valorCs, ps) => {
                    if (valorCs) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[ps])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                })
            }

            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }
    }


    //todo 🟢 Sistema de puntos
    {
        if (["pointsinfo", "pointsysteminfo", "pssysteminfo", "puntosinfo"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let dataSP = await puntosDB.findOne({ _id: msg.guildId })

            if (dataSP) {
                let objeto = dataSP.datos
                objeto.comandosUsos++
                await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto })
            }

            const embInfoP = new EmbedBuilder()
                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                .setTitle(`${emojis.puntos} ¿Qué es el sistema de Puntos?`)
                .setDescription(`Es un sistema creado con la intención de ayudar a los dueños y administradores de servidores a tener una mejor forma de administrar las acciones de lo demás miembros del staff y determinar con mayor facilidad cuando un miembro del staff se me rece un acenso.\n\n📑 **Comandos:** *10*\n\`\`${prefijo}points\`\` **|** Muestra la cantidad de puntos que tienes o tiene un miembro.\n\`\`${prefijo}addpoints\`\` **|** Agrega puntos a un miembro.\n\`\`${prefijo}removepoints\`\` **|** Elimina puntos a un miembro.\n\`\`${prefijo}setstaffrole\`\` **|** Establece un rol del staff o personal del servidor.\n\`\`${prefijo}deletestaffrole\`\` **|** Elimina un rol establecido como rol del staff del servidor.\n\`\`${prefijo}setemojipoints\`\` **|** Establece un símbolo o emoji personalizado para el sistema de puntos.\n\`\`${prefijo}pointsleaderboard\`\` **|** Muestra una tabla de clasificaciones con los miembros que han utilizado el sistema de puntos y sus respectivos puntos.\n\`\`${prefijo}pointsystemstatus\`\` **|** Muestra el estado del sistema en el servidor.\n\`\`${prefijo}removeusersystemp\`\` **|** Elimina a un miembro del sistema de puntos del servidor.\n\`\`${prefijo}updatepointssystem\`\` **|** Actualiza el sistema de puntos en el servidor eliminando del sistema a todos los usuarios que se han ido del servidor.`)
                .setColor(colorEmb)
                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                .setTimestamp()
            setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfoP] })
            }, 500)
        }

        if (["points", "puntos", "ps"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let dataSP = await puntosDB.findOne({ _id: msg.guildId }), puntos = 0
            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag == args[0])
            if (miembro) {
                let descripciones = [`El miembro proporcionado *(${miembro})* soy yo, yo no puedo usar el sistema de puntos.`, `El miembro proporcionado *(${miembro})* es un bot, los bots no pueden usar el sistema de puntos.`]
                let condicionales = [miembro.id == client.user.id, miembro.user.bot]

                for (let i in descripciones) {
                    if (condicionales[i]) {
                        const embError = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }


                if (dataSP) {
                    let objeto = dataSP.datos
                    objeto.comandosUsos++

                    const embError1 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`No puedes usar este comando ya que no eres miembro del personal del servidor.`)
                        .setColor(ColorError)
                        .setTimestamp()
                    if (dataSP.datos.rolesPersonal.length >= 1 && !msg.member.permissions.has('Administrator') && !dataSP.datos.rolesPersonal.some(s => msg.member.roles.cache.has(s))) return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)

                    if (miembro.id == msg.author.id) {
                        if (dataSP.miembros.some(s => s.id == miembro.id)) {
                            for (let i in dataSP.miembros) {
                                if (dataSP.miembros[i].id == miembro.id) {
                                    puntos = dataSP.miembros[i].puntos
                                }
                            }

                            const embPMi = new EmbedBuilder()
                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: miembro.user.displayAvatarURL()})
                                .setDescription(`Tienes ${dataSP.datos.emoji} **${puntos.toLocaleString()}** puntos.`)
                                .setColor(msg.guild.members.me.displayHexColor)
                                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                .setTimestamp()
                            setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embPMi] })
                            }, 500)
                        } else {
                            let array = dataSP.miembros
                            array.push({ id: msg.author.id, nombre: msg.author.tag, puntos: 0 })
                            await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto, miembros: array })

                            const embPMi = new EmbedBuilder()
                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                .setDescription(`Tienes ${dataSP.datos.emoji} **0** puntos.`)
                                .setColor(msg.guild.members.me.displayHexColor)
                                .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                                .setTimestamp()

                            setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embPMi] })
                            }, 400)
                        }
                    } else {
                        if (dataSP.miembros.some(s => s.id == miembro.id)) {
                            for (let i in dataSP.miembros) {
                                if (dataSP.miembros[i].id == miembro.id) {
                                    puntos = dataSP.miembros[i].puntos
                                }
                            }

                            const embPMi = new EmbedBuilder()
                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                .setDescription(`${miembro} tiene ${dataSP.datos.emoji} **${puntos.toLocaleString()}** puntos.`)
                                .setColor(msg.guild.members.me.displayHexColor)
                                .setFooter({text: miembro.nickname || miembro.user.username, iconURL: miembro.user.displayAvatarURL()})
                                .setTimestamp()
                            setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embPMi] })
                            }, 500)

                        } else {
                            let array = dataSP.miembros
                            array.push({ id: miembro.id, nombre: miembro.user.tag, puntos: 0 })
                            await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto, miembros: array })

                            const embPMi = new EmbedBuilder()
                                .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                                .setDescription(`${miembro} tiene ${dataSP.datos.emoji} **0** puntos.`)
                                .setColor(msg.guild.members.me.displayHexColor)
                                .setFooter({text: miembro.nickname || miembro.user.username, iconURL: miembro.user.displayAvatarURL()})
                                .setTimestamp()

                            setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embPMi] })
                            }, 400)
                        }
                    }

                } else {
                    if (miembro.id == msg.author.id) {
                        let nuevaDataSP = new puntosDB({
                            _id: msg.guildId,
                            serverName: msg.guild.name,
                            datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [] },
                            miembros: [{ id: msg.author.id, nombre: msg.author.tag, puntos: 0 }]
                        })

                        const embPMi = new EmbedBuilder()
                            .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: miembro.user.displayAvatarURL()})
                            .setDescription(`Tienes ${emojis.puntos} **0** puntos.`)
                            .setColor(msg.guild.members.me.displayHexColor)
                            .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                            .setTimestamp()
                        await nuevaDataSP.save()

                        setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embPMi] })
                        }, 400)

                    } else {
                        let nuevaDataSP = new puntosDB({
                            _id: msg.guildId,
                            serverName: msg.guild.name,
                            datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [] },
                            miembros: [{ id: msg.author.id, nombre: msg.author.tag, puntos: 0 }, { id: miembro.id, nombre: miembro.user.tag, puntos: 0 }]
                        })

                        const embPMi = new EmbedBuilder()
                            .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                            .setDescription(`${miembro} tiene ${emojis.puntos} **0** puntos.`)
                            .setColor(msg.guild.members.me.displayHexColor)
                            .setFooter({text: miembro.nickname || miembro.user.username, iconURL: miembro.user.displayAvatarURL()})
                            .setTimestamp()
                        await nuevaDataSP.save()

                        setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embPMi] })
                        }, 400)
                    }
                }

            } else {
                if (dataSP) {
                    let objeto = dataSP.datos
                    objeto.comandosUsos++

                    const embError1 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`No puedes usar este comando ya que no eres miembro del personal del servidor.`)
                        .setColor(ColorError)
                        .setTimestamp()
                    if (dataSP.datos.rolesPersonal.length >= 1 && !dataSP.datos.rolesPersonal.some(s => msg.member.roles.cache.has(s))) return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)

                    if (dataSP.miembros.some(s => s.id == msg.author.id)) {
                        for (let i in dataSP.miembros) {
                            if (dataSP.miembros[i].id == msg.author.id) {
                                puntos = dataSP.miembros[i].puntos
                            }
                        }

                        const embPAu = new EmbedBuilder()
                            .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                            .setDescription(`Tienes ${dataSP.datos.emoji} **${puntos.toLocaleString()}** puntos.`)
                            .setColor(msg.guild.members.me.displayHexColor)
                            .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                            .setTimestamp()
                        setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embPAu] })
                        }, 500)

                    } else {
                        let array = dataSP.miembros
                        array.push({ id: msg.author.id, nombre: msg.author.tag, puntos: 0 })
                        await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto, miembros: array })

                        const embPAu = new EmbedBuilder()
                            .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                            .setDescription(`Tienes ${dataSP.datos.emoji} **0** puntos.`)
                            .setColor(msg.guild.members.me.displayHexColor)
                            .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                            .setTimestamp()

                        setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embPAu] })
                        }, 400)
                    }

                } else {
                    let nuevaDataSP = new puntosDB({
                        _id: msg.guildId,
                        serverName: msg.guild.name,
                        datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [] },
                        miembros: [{ id: msg.author.id, nombre: msg.author.tag, puntos: 0 }]
                    })

                    const embPAu = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setDescription(`Tienes ${emojis.puntos} **0** puntos.`)
                        .setColor(msg.guild.members.me.displayHexColor)
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    await nuevaDataSP.save()

                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embPAu] })
                    }, 400)
                }
            }
        }

        if (["setstaffrole", "establecerrolstaff", "setstaffr"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let roles = msg.guild.roles.cache.map(m => m)
            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Permiso requerido:  Administrador"})
                .setTimestamp()
            if (!msg.member.permissions.has('Administrator')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            if (!cooldowns.has("setstaffrole")) {
                cooldowns.set("setstaffrole", new Collection())
            }

            const datosComando = cooldowns.get("setstaffrole"), tiempoActual = Date.now()

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *setstaffrole*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando setstaffrole`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}setstaffrole <Mención del rol>\`\`\n\`\`${prefijo}setstaffrole <ID del rol>\`\`` },
                    { name: "Ejemplos:", value: `${prefijo}setstaffrole ${roles[Math.floor(Math.random() * roles.length)]}\n${prefijo}setstaffrole ${roles[Math.floor(Math.random() * roles.length)].id}` },
                    { name: "Alias: **3**", value: `\`\`setstaffrole\`\`, \`\`establecerrolstaff\`\`, \`\`setstaffr\`\`, ` },
                    { name: "Descripción:", value: `Establece un rol o mas, como máximo **3** roles los cuales si el miembro tiene uno de ellos podrá utilizar el sistema de puntos, en caso de que no este establecido ningún rol cualquier miembro del servidor con acceso al bot podrá utilizar el sistema.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let dataSP = await puntosDB.findOne({ _id: msg.guildId })
            let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0])

            if (rol) {
                let descripciones = [`El rol proporcionado *(${rol})* es exclusivo para un bot, proporciona otro rol.`, `El rol proporcionado *(${rol})* el el rol @everyone un rol invisible que todos tienen, proporciona otro rol.`]
                let condicionales = [rol.managed, rol.id == msg.guildId]
                for (let r in descripciones) {
                    if (condicionales[r]) {
                        const embError = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[r])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError] }).then(et => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                et.delete().catch(c => {
                                    return;
                                })
                            }, 30000))
                        }, 500)
                    }
                }

                if (dataSP) {
                    let objeto = dataSP.datos
                    objeto.comandosUsos++
                    await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto })

                    const embError1 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`Ya se han establecido **3** roles del personal de este servidor en el sistema de puntos, no puedes agregar mas roles.`)
                        .setColor(ColorError)
                        .setTimestamp()
                    if (dataSP.datos.rolesPersonal.length >= 3) return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(et => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            et.delete().catch(c => {
                                return;
                            })
                        }, 30000))
                    }, 500)

                    objeto.rolesPersonal.push(rol.id)
                    await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto })

                    const embStaffRol = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setTitle(`${emojis.acierto} Rol del personal establecido`)
                        .setDescription(`El rol ${rol} ha sido establecido como rol del personal del servidor en el sistema de puntos.`)
                        .setColor(msg.guild.members.me.displayHexColor)
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()

                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embStaffRol] })
                    }, 400)
                } else {
                    let nuevaDataSP = new puntosDB({
                        _id: msg.guildId,
                        serverName: msg.guild.name,
                        datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [rol.id] },
                        miembros: [{ id: msg.author.id, nombre: msg.author.tag, puntos: 0 }]
                    })

                    const embStaffRol = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setTitle(`${emojis.acierto} Rol del personal establecido`)
                        .setDescription(`El rol ${rol} ha sido establecido como rol del personal del servidor en el sistema de puntos.`)
                        .setColor('Green')
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    await nuevaDataSP.save()

                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embStaffRol] })
                    }, 400)
                }
            } else {
                let descripciones = [`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención o ID de un rol del servidor, proporciona una mención o ID valida de un rol.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado *(${args[0]})* tiene las características de una ID, es numérico, contiene **18** caracteres pero no es una **ID** de ningún rol del servidor.`]
                let condicionales = [isNaN(args[0]), args[0].length < 18, args[0].length > 18, true]

                for (let i = 0; i < descripciones.length; i++) {
                    if (condicionales[i]) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }
            }

            datosComando.set(msg.author.id, tiempoActual)
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }

        if (["deletestaffrole", "eliminarrolstaff", "deletestaffr"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let roles = msg.guild.roles.cache.map(m => m)
            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Permiso requerido:  Administrador"})
                .setTimestamp()
            if (!msg.member.permissions.has('Administrator')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            if (!cooldowns.has("deletestaffrole")) {
                cooldowns.set("deletestaffrole", new Collection())
            }

            const datosComando = cooldowns.get("deletestaffrole"), tiempoActual = Date.now()

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *deletestaffrole*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando deletestaffrole`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}deletestaffrole <Mención del rol>\`\`\n\`\`${prefijo}deletestaffrole <ID del rol>\`\`` },
                    { name: "Ejemplos:", value: `${prefijo}deletestaffrole ${roles[Math.floor(Math.random() * roles.length)]}\n${prefijo}deletestaffrole ${roles[Math.floor(Math.random() * roles.length)].id}` },
                    { name: "Alias: **3**", value: `\`\`deletestaffrole\`\`, \`\`eliminarrolstaff\`\`, \`\`deletestaffr\`\`, ` },
                    { name: "Descripción:", value: `Elimina un rol anteriormente establecido como rol del personal del servidor en este servidor.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let dataSP = await puntosDB.findOne({ _id: msg.guildId })
            let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0])

            const embError1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`En este servidor no se ha utilizado el sistema de puntos por lo tanto no hay roles del personal del servidor establecidos que puedas eliminar.`)
                .setColor(ColorError)
                .setTimestamp()
            if (!dataSP) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(et => setTimeout(() => {
                    msg.delete().catch(c => {
                        return;
                    })
                    et.delete().catch(c => {
                        return;
                    })
                }, 30000))
            }, 500)

            if (rol) {
                if (dataSP) {
                    let objeto = dataSP.datos
                    objeto.comandosUsos++
                    await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto })

                    let descripciones = [`No hay roles establecidos como roles del personal del servidor en el sistema.`, `El rol proporcionado *(${rol})* es exclusivo para un bot por lo tanto no esta establecido como rol del personal de este servidor en el sistema.`, `El rol proporcionado *(${rol})* se el rol @everyone un rol invisible que todos tienen ese rol no esta registrado en el sistema.`, `El rol proporcionado *(${rol})* no se encontró registrado en el sistema, utiliza el comando \`\`${prefijo}pointsystemstatus\`\` el cual te mostrara cuales son los role registrados en el sistema.`]
                    let condicionales = [dataSP.datos.rolesPersonal.length == 0, rol.managed, rol.id == msg.guildId, !dataSP.datos.rolesPersonal.some(s => s == rol.id)]
                    for (let r in descripciones) {
                        if (condicionales[r]) {
                            const embError = new EmbedBuilder()
                                .setTitle(`${emojis.negativo} Error`)
                                .setDescription(descripciones[r])
                                .setColor(ColorError)
                                .setTimestamp()
                            return setTimeout(() => {
                                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError] }).then(et => setTimeout(() => {
                                    msg.delete().catch(c => {
                                        return;
                                    })
                                    et.delete().catch(c => {
                                        return;
                                    })
                                }, 30000))
                            }, 500)
                        }
                    }

                    for (let r in dataSP.datos.rolesPersonal) {
                        if (dataSP.datos.rolesPersonal[r] == rol.id) {
                            objeto.rolesPersonal.splice(r, 1)
                        }
                    }
                    await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto })

                    const embRemoveRolStaff = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setTitle(`${emojis.negativo} Se ha eliminado un rol`)
                        .setDescription(`Se ha eliminado el rol ${rol} anterior mente establecido en el sistema como un rol del personal del servidor.`)
                        .setColor('Red')
                        .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embRemoveRolStaff] })
                    }, 500)
                }
            } else {
                let descripciones = [`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención o ID de un rol del servidor, proporciona una mención o ID valida de un rol.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado *(${args[0]})* tiene las características de una ID, es numérico, contiene **18** caracteres pero no es una **ID** de ningún rol del servidor.`]
                let condicionales = [isNaN(args[0]), args[0].length < 18, args[0].length > 18, true]

                for (let i = 0; i < descripciones.length; i++) {
                    if (condicionales[i]) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }
            }

            datosComando.set(msg.author.id, tiempoActual)
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }

        if (["añadirpuntos", "addpoints", "addp"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++

            let alias = ["añadirpuntos", "addpoints", "addp"]
            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando addpoints`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}addpoints <Miembro> <Puntos a dar>\`\`` },
                    { name: "Ejemplos:", value: `${prefijo}addpoints ${msg.author} ${Math.round(Math.random() * (200 - 1) + 1)}\n${prefijo}addpoints ${msg.author.id} ${Math.round(Math.random(1) * 200)}\n${prefijo}addpoints ${msg.author.tag} ${Math.round(Math.random(1) * 200)}` },
                    { name: `Alias: **${alias.length}**`, value: alias.map(m => `\`\`${m}\`\``).join(`, `) },
                    { name: "Descripción:", value: `Agrega puntos a un miembro.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let dataSP = await puntosDB.findById(msg.guildId), miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag == args[0]), cantidad = isNaN(args[1]) ? args[1] : Math.floor(args[1]), puntosMiembro = dataSP && miembro ? dataSP.miembros.some(s => s.id == miembro.id) ? dataSP.miembros.find(f => f.id == miembro.id).puntos : 0 : 0

            let erroresP = [
                { condicion: args[0] && !miembro && !isNaN(args[0]) && args[0].length < 18, descripcion: `El argumento numérico  ingresado (*${args[0]}*) no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.` },
                { condicion: args[0] && !miembro && !isNaN(args[0]) && args[0].length > 18, descripcion: `El argumento numérico  ingresado (*${args[0]}*) no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.` },
                { condicion: args[0] && !miembro && isNaN(args[0]), descripcion: `El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor o usuario externo, proporciona una mención, ID o etiqueta valida.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresMsg(msg, erroresP)) return;

            let erroresP1 = [
                { condicion: !msg.member.permissions.has('Administrator'), descripcion: `No tienes los permisos suficientes para ejecutar el comando, el permiso requerido es \`\`administrador\`\`.` },
                { condicion: miembro.id == client.user.id, descripcion: `El miembro proporcionado *(${miembro})* soy yo, yo no puedo utilizar el sistema de puntos.` },
                { condicion: miembro && miembro.user.bot, descripcion: `El miembro que has proporcionado *(${miembro})* es un bot, un bot no puede utilizar el sistema de puntos.` },
                { condicion: msg.author.id != msg.guild.ownerId && miembro.id == msg.guild.ownerId, descripcion: `El miembro proporcionado *(${miembro})* es el dueño del servidor, no puedes agregarle puntos.` },
                { condicion: msg.author.id != msg.guild.ownerId && msg.member.roles.highest.comparePositionTo(miembro.roles.highest) < 0, descripcion: `El rol mas alto del miembro proporcionado *(${miembro})* es igual o mayor a tu rol mas alto por lo tanto no le puedes agregar puntos.` },
                { condicion: !cantidad, descripcion: `No has proporcionado la cantidad de puntos a dar al miembro.` },
                { condicion: cantidad && isNaN(cantidad), descripcion: `El argumento proporcionado *(${cantidad})* no es numérico, debe de ser numérico ya que debe de ser la cantidad de puntos a dar al miembro.` },
                { condicion: cantidad && cantidad <= 0, descripcion: `No puedes agregar **0** puntos o un numero negativo de puntos a un miembro.` },
                { condicion: puntosMiembro >= 1000000000, descripcion: `El miembro ya tiene la máxima cantidad de puntos por miembro la cual es ${dataSP ? dataSP.datos.emoji : emojis.puntos} **${(1000000000).toLocaleString()}** puntos.` },
                { condicion: cantidad && (puntosMiembro + cantidad) > 1000000000, descripcion: `La cantidad que has proporcionado excedería el limite de puntos del miembro, puedes agregar una cantidad igual o menor a ${dataSP ? dataSP.datos.emoji : emojis.puntos} **${(1000000000 - puntosMiembro).toLocaleString()}** puntos al miembro.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresMsg(msg, erroresP1)) return;

            if (!cooldowns.has("addpoints")) {
                cooldowns.set("addpoints", new Collection())
            }

            const datosComando = cooldowns.get("addpoints"), tiempoActual = Date.now()

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 10000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *addpoints*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => c)
                        msg.delete().catch(c => c)
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embAddPoints = new EmbedBuilder()
                .setAuthor({ name: msg.member.nick ? msg.member.nickname : msg.author.username, iconURL: msg.author.displayAvatarURL() })
                .setTitle(`${emojis.acierto} Puntos agregados al miembro`)
                .setDescription(`Se ${msg.author.id == miembro.id ? "te" : "le"} han agregado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos ${msg.author.id == miembro.id ? "." : `a **${miembro}**.`}`)
                .setColor('Green')
                .setFooter({ text: miembro.id == msg.author.id ? msg.guild.name : miembro.nickname ? miembro.nickname : miembro.user.username, iconURL: miembro.id == msg.author.id ? msg.guild.iconURL() : miembro.user.displayAvatarURL() })
                .setTimestamp()
            setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embAddPoints] })
            }, 500)
            if (dataSP) {
                let objeto = dataSP.datos, array = dataSP.miembros
                objeto.comandosUsos++
                objeto.puntosAgregados += cantidad

                array.some(s => s.id == miembro.id) ? array.find(f => f.id == miembro.id).puntos += cantidad : array.push({ id: miembro.id, nombre: miembro.user.tag, puntos: cantidad })
                await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto, miembros: array })

            } else {
                let nuevaDataSP = new puntosDB({
                    _id: msg.guildId,
                    serverName: msg.guild.name,
                    datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: cantidad, puntosEliminados: 0, rolesPersonal: [] },
                    miembros: [{ id: miembro.id, nombre: miembro.user.tag, puntos: cantidad }]
                })
                await nuevaDataSP.save()
            }

            datosComando.set(msg.author.id, tiempoActual)
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 10000)
        }

        if (["quitarpuntos", "removepoints", "removep"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++

            let alias = ["quitarpuntos", "removepoints", "removep"]
            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando addpoints`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}addpoints <Miembro> <Puntos a dar>\`\`` },
                    { name: "Ejemplos:", value: `${prefijo}addpoints ${msg.author} ${Math.round(Math.random() * (200 - 1) + 1)}\n${prefijo}addpoints ${msg.author.id} ${Math.round(Math.random(1) * 200)}\n${prefijo}addpoints ${msg.author.tag} ${Math.round(Math.random(1) * 200)}` },
                    { name: `Alias: **${alias.length}**`, value: alias.map(m => `\`\`${m}\`\``).join(`, `) },
                    { name: "Descripción:", value: `Agrega puntos a un miembro.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let dataSP = await puntosDB.findById(msg.guildId), miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag == args[0]), cantidad = isNaN(args[1]) ? args[1] : Math.floor(args[1]), puntosMiembro = dataSP && miembro ? dataSP.miembros.some(s => s.id == miembro.id) ? dataSP.miembros.find(f => f.id == miembro.id).puntos : 0 : 0

            let erroresP = [
                { condicion: args[0] && !miembro && !isNaN(args[0]) && args[0].length < 18, descripcion: `El argumento numérico  ingresado (*${args[0]}*) no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.` },
                { condicion: args[0] && !miembro && !isNaN(args[0]) && args[0].length > 18, descripcion: `El argumento numérico  ingresado (*${args[0]}*) no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.` },
                { condicion: args[0] && !miembro && isNaN(args[0]), descripcion: `El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor o usuario externo, proporciona una mención, ID o etiqueta valida.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresMsg(msg, erroresP)) return;

            let erroresP1 = [
                { condicion: !msg.member.permissions.has('Administrator'), descripcion: `No tienes los permisos suficientes para ejecutar el comando, el permiso requerido es \`\`administrador\`\`.` },
                { condicion: miembro.id == client.user.id, descripcion: `El miembro proporcionado *(${miembro})* soy yo, yo no puedo utilizar el sistema de puntos.` },
                { condicion: miembro && miembro.user.bot, descripcion: `El miembro que has proporcionado *(${miembro})* es un bot, un bot no puede utilizar el sistema de puntos.` },
                { condicion: msg.author.id != msg.guild.ownerId && miembro.id == msg.guild.ownerId, descripcion: `El miembro proporcionado *(${miembro})* es el dueño del servidor, no puedes eliminarle puntos.` },
                { condicion: msg.author.id != msg.guild.ownerId && msg.member.roles.highest.comparePositionTo(miembro.roles.highest) < 0, descripcion: `El rol mas alto del miembro proporcionado *(${miembro})* es igual o mayor a tu rol mas alto por lo tanto no le puedes eliminar puntos.` },
                { condicion: !cantidad, descripcion: `No has proporcionado la cantidad de puntos a eliminar del miembro.` },
                { condicion: cantidad && isNaN(cantidad), descripcion: `El argumento proporcionado *(${cantidad})* no es numérico, debe de ser numérico ya que debe de ser la cantidad de puntos a eliminar del miembro.` },
                { condicion: cantidad && cantidad <= 0, descripcion: `No puedes eliminar **0** puntos o un numero negativo de puntos a un miembro.` },
                { condicion: puntosMiembro <= -1000000000, descripcion: `El miembro ya tiene la máxima cantidad de puntos negativos por miembro la cual es ${dataSP ? dataSP.datos.emoji : emojis.puntos} **${(-1000000000).toLocaleString()}** puntos.` },
                { condicion: cantidad && (puntosMiembro - cantidad) < -1000000000, descripcion: `La cantidad que has proporcionado excedería el limite de puntos negativos del miembro, puedes eliminar una cantidad igual o menor a **${(-1000000000 - puntosMiembro).toLocaleString()}** del miembro.` },
                // {condicion: "", descripcion: ``},
            ]
            if (erroresMsg(msg, erroresP1)) return;

            if (!cooldowns.has("removepoints")) {
                cooldowns.set("removepoints", new Collection())
            }

            const tiempoActual = Date.now(), datosComando = cooldowns.get("removepoints")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 10000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *removepoints*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embAddPoints = new EmbedBuilder()
                .setAuthor({ name: msg.member.nick ? msg.member.nickname : msg.author.username, iconURL: msg.author.displayAvatarURL() })
                .setTitle(`${emojis.negativo} Puntos del miembro eliminados`)
                .setDescription(`Se ${msg.author.id == miembro.id ? "te" : "le"} han eliminado ${dataSP.datos.emoji} **${cantidad.toLocaleString()}** puntos ${msg.author.id == miembro.id ? "." : `a **${miembro}**.`}`)
                .setColor('Red')
                .setFooter({ text: miembro.id == msg.author.id ? msg.guild.name : miembro.nickname ? miembro.nickname : miembro.user.username, iconURL: miembro.id == msg.author.id ? msg.guild.iconURL() : miembro.user.displayAvatarURL() })
                .setTimestamp()
            setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embAddPoints] })
            }, 500)

            if (dataSP) {
                let objeto = dataSP.datos, array = dataSP.miembros
                objeto.comandosUsos++
                objeto.puntosEliminados += cantidad

                array.some(s => s.id == miembro.id) ? array.find(f => f.id == miembro.id).puntos -= cantidad : array.push({ id: miembro.id, nombre: miembro.user.tag, puntos: -cantidad })
                await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto, miembros: array })

            } else {
                let nuevaDataSP = new puntosDB({
                    _id: msg.guildId,
                    serverName: msg.guild.name,
                    datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: cantidad, rolesPersonal: [] },
                    miembros: [{ id: miembro.id, nombre: miembro.user.tag, puntos: -cantidad }]
                })
                await nuevaDataSP.save()
            }

            datosComando.set(msg.author.id, tiempoActual)
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 10000)
        }

        if (["pointsleaderboard", "toppoints", "topp"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let dataSP = await puntosDB.findOne({ _id: msg.guildId })

            if (dataSP) {
                let objeto = dataSP.datos
                objeto.comandosUsos++
                await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto })

                const embError1 = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`No puedes usar este comando ya que no eres miembro del personal del servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                if (dataSP.datos.rolesPersonal.length >= 1 && !dataSP.datos.rolesPersonal.some(s => msg.member.roles.cache.has(s))) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(dt => setTimeout(() => {
                        msg.delete().catch(c => {
                            return;
                        })
                        dt.delete().catch(e => {
                            return;
                        })
                    }, 30000));
                }, 500)

                const embed = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setDescription(`No hay ningún miembro en la base de datos del sistema de puntos de este servidor, para saber mas sobre el sistema utiliza el comando \`\`${prefijo}pointsinfo\`\`.`)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                    .setTimestamp()
                if (dataSP.miembros.length <= 0) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embed] })
                }, 500)

                let ordenPs = [], top = []
                for (let i in dataSP.miembros) {
                    let usuario = client.users.cache.get(dataSP.miembros[i].id)
                    if (usuario) {
                        ordenPs.push({ id: usuario.id, puntos: dataSP.miembros[i].puntos })
                    }
                }
                ordenPs.sort((a, b) => b.puntos - a.puntos)



                for (let i in ordenPs) {
                    let usuario = client.users.cache.get(ordenPs[i].id)
                    if (usuario) {
                        top.push(`**${Number(i) + 1}.** [${usuario.tag}](${usuario.displayAvatarURL({  format: "png" || "gif", size: 4096 })}) - ${dataSP.datos.emoji} **${ordenPs[i].puntos}**\n<@${usuario.id}>`)
                    }
                }

                let segPage
                if (String(ordenPs.length).slice(-1) === "0") {
                    segPage = Math.floor(ordenPs.length / 10)
                } else {
                    segPage = Math.floor(ordenPs.length / 10 + 1)
                }

                if (segPage <= 1) {
                    const embTopP = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(0, 10).join("\n\n")}`)
                        .setColor(msg.guild.members.me.displayHexColor)
                        .setFooter({text: `Pagina - 1/${segPage}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embTopP] })
                    })
                } else {
                    let cps1 = 0, cps2 = 10, pagina = 1

                    const embTopP = new EmbedBuilder()
                        .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                        .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(cps1, cps2).join("\n\n")}`)
                        .setColor(msg.guild.members.me.displayHexColor)
                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                        .setTimestamp()

                    const botones1 = new ActionRowBuilder()
                        .setComponents(
                            [
                                new ButtonBuilder()
                                    .setCustomId("1")
                                    .setLabel("Anterior")
                                    .setEmoji("<a:LeftArrow:942155020017754132>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(true),
                            
                                new ButtonBuilder()
                                    .setCustomId("2")
                                    .setLabel("Siguiente ")
                                    .setEmoji("<a:RightArrow:942154978859044905>")
                                    .setStyle(ButtonStyle.Primary)
                            ]
                        )

                    const botones2 = new ActionRowBuilder()
                        .setComponents(
                            [
                                new ButtonBuilder()
                                    .setCustomId("1")
                                    .setLabel("Anterior")
                                    .setEmoji("<a:LeftArrow:942155020017754132>")
                                    .setStyle(ButtonStyle.Primary),
                            
                                new ButtonBuilder()
                                    .setCustomId("2")
                                    .setLabel("Siguiente")
                                    .setEmoji("<a:RightArrow:942154978859044905>")
                                    .setStyle(ButtonStyle.Primary)
                            ]
                        )

                    const botones3 = new ActionRowBuilder()
                        .setComponents(
                            [
                                new ButtonBuilder()
                                    .setCustomId("1")
                                    .setLabel("Anterior")
                                    .setEmoji("<a:LeftArrow:942155020017754132>")
                                    .setStyle(ButtonStyle.Primary),
                           
                                new ButtonBuilder()
                                    .setCustomId("2")
                                    .setLabel("Siguiente")
                                    .setEmoji("<a:RightArrow:942154978859044905>")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(true)
                            ]
                        )

                    setTimeout(async () => {
                        const mensajeSend = await msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embTopP], components: [botones1] })
                        const filtro = i => i.user.id === msg.author.id;
                        const colector = mensajeSend.createMessageComponentCollector({ filter: filtro, time: segPage * 60000 })

                        setTimeout(() => {
                            mensajeSend.edit({ embeds: [embTopP], components: [] })
                        }, segPage * 60000)

                        colector.on("collect", async botn => {
                            if (botn.customId === "1") {
                                if (cps2 - 10 <= 10) {
                                    cps1 -= 10, cps2 -= 10, pagina--

                                    embTopP
                                        .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(cps1, cps2).join("\n\n")}`)
                                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                    await botn.update({ embeds: [embTopP], components: [botones1] })
                                } else {
                                    cps1 -= 10, cps2 -= 10, pagina--

                                    embTopP
                                        .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(cps1, cps2).join("\n\n")}`)
                                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                    await botn.update({ embeds: [embTopP], components: [botones2] })
                                }
                            }
                            if (botn.customId === "2") {
                                if (cps2 + 10 >= ordenPs.length) {
                                    cps1 += 10, cps2 += 10, pagina++

                                    embTopP
                                        .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(cps1, cps2).join("\n\n")}`)
                                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                    await botn.update({ embeds: [embTopP], components: [botones3] })
                                } else {
                                    cps1 += 10, cps2 += 10, pagina++

                                    embTopP
                                        .setDescription(`Total de miembros que han usado el sistema: **${ordenPs.length}**\n\n${top.slice(cps1, cps2).join("\n\n")}`)
                                        .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                    await botn.update({ embeds: [embTopP], components: [botones2] })
                                }
                            }
                        })
                    })
                }
            } else {
                nuevaDataSP = new puntosDB({
                    _id: msg.guildId,
                    serverName: msg.guild.name,
                    datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [] },
                    miembros: [{ id: msg.author.id, nombre: msg.author.tag, puntos: 0 }]
                })

                const embed = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setDescription(`No se ha registrado ningún miembro de este servidor al sistema de puntos, para saber mas del sistema utiliza el comando \`\`${prefijo}pointsinfo\`\`.`)
                    .setColor(msg.guild.members.me.displayHexColor)
                await nuevaDataSP.save()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embed] })
                }, 500)
            }
        }

        if (["setemojipoints", "setemojip", "setep"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            let dataSP = await puntosDB.findOne({ _id: msg.guildId })
            let emojisR = msg.guild.emojis.cache.map(e => e)

            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Permiso requerido:  Administrador"})
                .setTimestamp()
            if (!msg.member.permissions.has('Administrator')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            if (!cooldowns.has("setemojipoints")) {
                cooldowns.set("setemojipoints", new Collection())
            }

            const datosComando = cooldowns.get("setemojipoints"), tiempoActual = Date.now()

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *setemojipoints*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando setemojipoints`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}setemojipoints <Emoji a establecer>\`\`` },
                    { name: "Ejemplo:", value: `${prefijo}setemojipoints ${emojisR[Math.floor(Math.random() * emojisR.length)]}` },
                    { name: "Alias: **3**", value: `\`\`setemojipoints\`\`, \`\`setemojip\`\`, \`\`setep\`\`, ` },
                    { name: "Descripción:", value: `Establece un emoji como símbolo para el sistema de puntos.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let descripciones = [`No puedes establecer números como símbolo del sistema de puntos.`, `El argumento proporcionado *(${args[0]})* no es un emoji.`, `El argumento proporcionado *(${args[0]})* es un emoji de un servidor el cual no estoy por lo tanto no puedes establecerlo como símbolo del sistema.`]
            let condicionales = [!isNaN(args[0]), !/\p{Emoji}/gu.test(args[0]), ["<", ">"].some(s => args[0].includes(s)) ? !msg.guild.emojis.cache.find(f => f.id == args[0].split(":")[2].split(">")[0]) : false]

            for (let i = 0; i < descripciones.length; i++) {
                if (condicionales[i]) {
                    const embErr = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(descripciones[i])
                        .setColor(ColorError)
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                            msg.delete().catch(c => {
                                return;
                            })
                            dt.delete().catch(e => {
                                return;
                            })
                        }, 30000));
                    }, 500)
                }
            }

            if (dataSP) {
                let objeto = dataSP.datos
                objeto.comandosUsos++
                objeto.emoji = args[0]
                await puntosDB.findByIdAndUpdate(msg.guildId, { serverName: msg.guild.name, datos: objeto })

                const embSetE = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("<a:afirmativo:856966728806432778> Símbolo establecido")
                    .setDescription(`El emoji ${args[0]} se a establecido como símbolo del sistema de puntos.`)
                    .setColor('Green')
                    .setTimestamp()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embSetE] })
                }, 400)
            } else {
                let nuevaDataSP = new puntosDB({
                    _id: msg.guildId,
                    serverName: msg.guild.name,
                    datos: { emoji: args[0], comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [] },
                    miembros: [{ id: msg.author.id, nombre: msg.author.tag, puntos: 0 }]
                })

                const embSetE = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("<a:afirmativo:856966728806432778> Símbolo establecido")
                    .setDescription(`El emoji ${args[0]} se a establecido como el símbolo del sistema de puntos.`)
                    .setColor('Green')
                    .setTimestamp()
                await nuevaDataSP.save()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embSetE] })
                }, 400)
            }

            datosComando.set(msg.author.id, tiempoActual)
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }

        if (["pointsystemstatus", "pointstatus", "psystemstatus", "pss"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++

            let dataSP = await puntosDB.findById(msg.guildId)

            if (dataSP) {
                let objeto = dataSP.datos
                objeto.comandosUsos++
                await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto })
                let totalPuntos = dataSP.datos.puntosAgregados + dataSP.datos.puntosEliminados

                const embPointsSystem = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setTitle(`<:status:957353077650886716> Estado del sistema de puntos`)
                    .setFields(
                        { name: `👥 **Miembros que han utilizado el sistema:**`, value: `**${dataSP.miembros.length.toLocaleString()}**`, inline: true },
                        { name: `🔢 **Comandos del sistema usados:**`, value: `**${dataSP.datos.comandosUsos.toLocaleString()}**`, inline: true },
                        { name: `${dataSP.datos.emoji} **Puntos agregados y eliminados:** ${totalPuntos.toLocaleString()}`, value: `${totalPuntos >= 1 ? `Agregados: **${dataSP.datos.puntosAgregados}** | ${(dataSP.datos.puntosAgregados * 100 / totalPuntos).toFixed(2)}%\nEliminados: **${dataSP.datos.puntosEliminados}** | ${(dataSP.datos.puntosEliminados * 100 / totalPuntos).toFixed(2)}%` : "*No se ha agregado ni eliminado ningún punto*"}`, inline: true },
                        { name: `❓ **Símbolo del sistema:**`, value: `${dataSP.datos.emoji == emojis.puntos ? `*Predeterminado: ${emojis.puntos}*` : `Personalizado: ${dataSP.datos.emoji}`}`, inline: true },
                        { name: `👮 **Roles del personal:** ${dataSP.datos.rolesPersonal.length >= 1 ? dataSP.datos.rolesPersonal.length : ""}`, value: `${dataSP.datos.rolesPersonal.length >= 1 ? dataSP.datos.rolesPersonal.map(m => `<@&${m}>`).join(", ") : `*Sin roles*`}`, inline: true },
                        // {name: ``, value: ``, inline: true},
                    )
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embPointsSystem] })
                }, 500)

            } else {
                let nuevaDataSP = new puntosDB({
                    _id: msg.guildId,
                    serverName: msg.guild.name,
                    datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [] },
                    miembros: [{ id: msg.author.id, nombre: msg.author.tag, puntos: 0 }]
                })
                await nuevaDataSP.save()

                const embError1 = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`No tengo datos sobre el sistema de puntos en este servidor ya que no se a utilizado el sistema en este servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(tm => setTimeout(() => {
                        msg.delete().catch(t => {
                            return;
                        })
                        tm.delete().catch(t => {
                            return;
                        })
                    }, 30000))
                }, 500)
            }
        }

        if (["updatepointssystem", "updatepsystem", "updateps"].some(s => comando == s)) {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Permiso requerido:  Administrador"})
                .setTimestamp()
            if (!msg.member.permissions.has('Administrator')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            let dataSP = await puntosDB.findOne({ _id: msg.guildId })

            if (dataSP) {
                let objeto = dataSP.datos
                objeto.comandosUsos++
                let arrayMs = dataSP.miembros

                let falsosMiembros = arrayMs.filter(f => !msg.guild.members.cache.get(f.id))

                const embError1 = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`No hay usuarios en el sistema que no estén en el servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                if (falsosMiembros.length <= 0) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(tm => setTimeout(() => {
                        msg.delete().catch(t => {
                            return;
                        })
                        tm.delete().catch(t => {
                            return;
                        })
                    }, 30000))
                }, 500)

                arrayMs.forEach((valorMs, psMs) => {
                    if (falsosMiembros.some(s => s.id == valorMs.id)) {
                        arrayMs.splice(psMs, 1)
                    }
                })
                await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto, miembros: array })

                const embUpdateSistemP = new EmbedBuilder()
                    .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setTitle(`${emojis.acierto} Sistema actualizado`)
                    .setDescription(`Se han eliminado datos de **${falsosMiembros.length.toLocaleString()}** usuarios que no se encontraron en el servidor.`)
                    .setColor(msg.guild.members.me.displayHexColor)
                    .setFooter({text: msg.guild.name, iconURL: msg.guild.iconURL()})
                    .setTimestamp()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embUpdateSistemP] })
                }, 400)
            } else {

                let nuevaDataSP = new puntosDB({
                    _id: msg.guildId,
                    serverName: msg.guild.name,
                    datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [] },
                    miembros: [{ id: msg.author.id, nombre: msg.author.tag, puntos: 0 }]
                })
                await nuevaDataSP.save()

                const embError1 = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`No hay usuarios en el sistema que no estén en el servidor.`)
                    .setColor(ColorError)
                    .setTimestamp()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(tm => setTimeout(() => {
                        msg.delete().catch(t => {
                            return;
                        })
                        tm.delete().catch(t => {
                            return;
                        })
                    }, 30000))
                }, 500)
            }
        }

        if (comando == "removeusersystemp") {
            msg.channel.sendTyping()
            botDB.comandos.usos++
            const embErrP1 = new EmbedBuilder()
                .setTitle(`${emojis.negativo} Error`)
                .setDescription(`No tienes los permisos suficientes para ejecutar el comando.`)
                .setColor(ColorError)
                .setFooter({text: "Permiso requerido:  Administrador"})
                .setTimestamp()
            if (!msg.member.permissions.has('Administrator')) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                    msg.delete().catch(t => {
                        return;
                    })
                    tm.delete().catch(t => {
                        return;
                    })
                }, 30000))
            }, 500)

            if (!cooldowns.has("removeusersystemp")) {
                cooldowns.set("removeusersystemp", new Collection())
            }

            const tiempoActual = Date.now(), datosComando = cooldowns.get("removeusersystemp")

            if (datosComando.has(msg.author.id)) {
                const tiempoUltimo = datosComando.get(msg.author.id) + 60000, enfriamiento = Math.floor((tiempoUltimo - tiempoActual) / 1000), embEnfriarse = new EmbedBuilder()
                    .setTitle("<:cronometro:948693729588441149> Enfriamiento/cooldown del comando *removeusersystemp*")
                    .setDescription(`Espera **${enfriamiento}** segundos para volver a utilizar el comando.`)
                    .setColor('Blue')

                if (tiempoActual < tiempoUltimo) return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embEnfriarse] }).then(tf => setTimeout(() => {
                        tf.delete().catch(c => {
                            return;
                        })
                        msg.delete().catch(c => {
                            return;
                        })
                    }, tiempoUltimo - tiempoActual))
                }, 500)
            }

            const embInfo = new EmbedBuilder()
                .setTitle(`${emojis.lupa} Comando removeusersystemp`)
                .setFields(
                    { name: "Uso:", value: `\`\`${prefijo}removeusersystemp <Mención del miembro>\`\`\n\`\`${prefijo}removeusersystemp <ID del miembro>\`\`\n\`\`${prefijo}removeusersystemp <Etiqueta del miembro>\`\`` },
                    { name: "Ejemplos:", value: `${prefijo}removeusersystemp ${msg.author}\n${prefijo}removeusersystemp ${msg.author.id}\n${prefijo}removeusersystemp ${msg.author.tag}` },
                    { name: "Alias:", value: `\`\`removeusersystemp\`\`` },
                    { name: "Descripción:", value: `Elimina al miembro proporcionado del sistema de puntos.` }
                )
                .setColor(colorEmbInfo)
                .setTimestamp()
            if (!args[0]) return setTimeout(() => {
                msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfo] })
            }, 500)

            let dataSP = await puntosDB.findOne({ _id: msg.guildId })
            let miembro = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.guild.members.cache.find(f => f.user.tag == args[0])

            if (miembro) {
                if (msg.author.id == msg.guild.ownerId) {
                    if (dataSP) {
                        let objeto = dataSP.datos
                        objeto.comandosUsos++

                        let descripciones = [`El miembro proporcionado *(${miembro})* soy yo, yo no estoy  en el sistema de puntos.`, `El miembro proporcionado *(${miembro})* es un bot, un bot no puede estar en el sistema de puntos.`, `El miembro proporcionado *(${miembro})* no esta en el sistema de puntos.`]
                        let condicionales = [miembro.id == client.user.id, miembro.user.bot, !dataSP.miembros.some(s => s.id == miembro.id)]
                        for (let i in descripciones) {
                            if (condicionales[i]) {
                                const embErr = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(descripciones[i])
                                    .setColor(ColorError)
                                    .setTimestamp()
                                return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        dt.delete().catch(e => {
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }

                        let posicion = 0, puntos = 0
                        for (let i in dataSP.miembros) {
                            if (dataSP.miembros[i].id === miembro.id) {
                                posicion = i
                                puntos = dataSP.miembros[i].puntos
                            }
                        }

                        let array = dataSP.miembros
                        array.splice(posicion, 1)
                        await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto, miembros: array })

                        const embRemoveUserSystem = new EmbedBuilder()
                            .setAuthor({name: msg.member.nickname || msg.author.username, iconURL: msg.author.displayAvatarURL()})
                            .setTitle("🗑️ Miembro eliminado del sistema")
                            .setDescription(`El miembro ${miembro} ha sido eliminado del sistema de puntos en el cual tenia ${dataSP.datos.emoji} **${puntos.toLocaleString()}** puntos.`)
                            .setColor(msg.guild.members.me.displayHexColor)
                            .setFooter({text: miembro.nickname || miembro.user.username, iconURL: miembro.displayAvatarURL()})
                            .setTimestamp()
                        setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embRemoveUserSystem] })
                        }, 500)

                    } else {
                        const embError1 = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* no esta en el sistema de puntos.`)
                            .setColor(ColorError)
                            .setTimestamp()

                        let nuevaDataSP = new puntosDB({
                            _id: msg.guildId,
                            serverName: msg.guild.name,
                            datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [] },
                            miembros: [{ id: msg.author.id, nombre: msg.author.tag, puntos: 0 }]
                        })
                        await nuevaDataSP.save()

                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(te => setTimeout(() => {
                                te.delete().catch(c => {
                                    console.error(c)
                                })
                                msg.delete().catch(c => {
                                    console.error(c)
                                })
                            }, 30000))
                        }, 400)
                    }

                } else {
                    if (dataSP) {
                        let objeto = dataSP.datos
                        objeto.comandosUsos++

                        let descripciones = [`El miembro proporcionado *(${miembro})* soy yo, yo no estoy  en el sistema de puntos.`, `El miembro proporcionado *(${miembro})* eres tu mismo, no te puedes eliminar a ti mismo del sistema.`, `El miembro proporcionado *(${miembro})* es el dueño del servidor, no lo puedes eliminar del sistema.`, `El miembro proporcionado *(${miembro})* es un bot, un bot no puede estar en el sistema de puntos.`, `El miembro proporcionado *(${miembro})* tiene un rol igual o mayor que tu rol mas alto por lo tanto no lo puedes eliminar del sistema.`, `El miembro proporcionado *(${miembro})* no esta en el sistema de puntos.`]
                        let condicionales = [miembro.id == client.user.id, miembro.id == msg.author.id, miembro.id == msg.guild.ownerId, miembro.user.bot, msg.member.roles.highest.comparePositionTo(miembro.roles.highest) <= 0, !dataSP.miembros.some(s => s.id == miembro.id)]

                        for (let i = 0; i < descripciones.length; i++) {
                            if (condicionales[i]) {
                                const embErr = new EmbedBuilder()
                                    .setTitle(`${emojis.negativo} Error`)
                                    .setDescription(descripciones[i])
                                    .setColor(ColorError)
                                    .setTimestamp()
                                return setTimeout(() => {
                                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                        msg.delete().catch(c => {
                                            return;
                                        })
                                        dt.delete().catch(e => {
                                            return;
                                        })
                                    }, 30000));
                                }, 500)
                            }
                        }

                        let posicion = 0, puntos = 0
                        for (let i in dataSP.miembros) {
                            if (dataSP.miembros[i].id == miembro.id) {
                                posicion = i
                                puntos = dataSP.miembros[i].puntos
                            }
                        }

                        let array = dataSP.miembros
                        array.splice(posicion, 1)
                        await puntosDB.findByIdAndUpdate(msg.guildId, { datos: objeto, miembros: array })

                        const embRemoveUserSystem = new EmbedBuilder()
                            .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                            .setTitle("🗑️ Miembro eliminado del sistema")
                            .setDescription(`El miembro ${miembro} ha sido eliminado del sistema de puntos en el cual tenia ${dataSP.datos.emoji} **${puntos.toLocaleString()}** puntos.`)
                            .setColor(msg.guild.members.me.displayHexColor)
                            .setTimestamp()
                        setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embRemoveUserSystem] })
                        }, 400)

                    } else {
                        const embError1 = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`El miembro proporcionado *(${miembro})* no esta en el sistema de puntos.`)
                            .setColor(ColorError)
                            .setTimestamp()

                        let nuevaDataSP = new puntosDB({
                            _id: msg.guildId,
                            serverName: msg.guild.name,
                            datos: { emoji: emojis.puntos, comandosUsos: 1, puntosAgregados: 0, puntosEliminados: 0, rolesPersonal: [] },
                            miembros: [{ id: msg.author.id, nombre: msg.author.tag, puntos: 0 }]
                        })
                        await nuevaDataSP.save()

                        setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embError1] }).then(te => setTimeout(() => {
                                te.delete().catch(c => {
                                    console.error(c)
                                })
                                msg.delete().catch(c => {
                                    console.error(c)
                                })
                            }, 30000))
                        }, 400)
                    }
                }
            } else {
                let descripciones = [`El argumento proporcionado (*${args[0]}*) no se reconoce como una mención, ID o etiqueta de un miembro del servidor, proporciona una mención, ID o etiqueta valida de un miembro.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID valida ya que contiene menos de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento numérico  ingresado *(${args[0]})* no es una ID ya que contiene mas de **18** caracteres numéricos, una ID esta constituida por 18 caracteres numéricos.`, `El argumento proporcionado *(${args[0]})* tiene las caracteristicas de una **ID**, es numérico, contiene **18** caracteres pero no coresponde con la **ID** de ningun miembro del servidor.`]
                let condicionales = [isNaN(args[0]), args[0].length < 18, args[0].length > 18, !msg.guild.members.cache.find(f => f.id == args[0])]

                for (let i = 0; i < descripciones.length; i++) {
                    if (condicionales[i]) {
                        const embErr = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(descripciones[i])
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErr] }).then(dt => setTimeout(() => {
                                msg.delete().catch(c => {
                                    return;
                                })
                                dt.delete().catch(e => {
                                    return;
                                })
                            }, 30000));
                        }, 500)
                    }
                }
            }

            datosComando.set(msg.author.id, tiempoActual);
            setTimeout(() => {
                datosComando.delete(msg.author.id)
            }, 60000)
        }
    }


    //? 👑 Comandos para el creador
    if(creadoresID.some(s => s == msg.author.id)){
        if (comando == "autoroles") {
            let rolesColores = ["985631910581653556", "985631917330268201", "985631924619976806", "985631921184837673", "985631931595104276", "985631934879244378", "985631938373116004", "985631941665652757", "985634743930454017", "985634749437587516", "985634753048903770", "985631927853785169", "985634755984908318", "985631914507518023", "985634992317157456"]
            const embAutoRoles = new EmbedBuilder()
                .setTitle(`🌈 Roles de colores`)
                .setDescription(`Estos roles pueden cambiar el color de tu nombre dentro del servidor solo elije uno en el menú de abajo.\n\n${rolesColores.map(m => `> **<@&${m}>**`).join("\n")}`)
                .setColor(msg.guild.members.me.displayHexColor)
    
            const menuAutoRoles = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId("rolesColores")
                        .setPlaceholder(`👆 Selecciona una opción.`)
                        .setOptions(
                            [
                                {
                                    emoji: "🍫",
                                    label: `Negro`,
                                    // description: ``,
                                    value: `negro`
                                },
                                {
                                    emoji: "☕",
                                    label: `Café`,
                                    // description: ``,
                                    value: `cafe`
                                },
                                {
                                    emoji: "🧨",
                                    label: `Rojo`,
                                    // description: ``,
                                    value: `rojo`
                                },
                                {
                                    emoji: "🏀",
                                    label: `Naranja`,
                                    // description: ``,
                                    value: `naranja`
                                },
                                {
                                    emoji: "🎗️",
                                    label: `Amarillo`,
                                    // description: ``,
                                    value: `amarillo`
                                },
                                {
                                    emoji: "🍏",
                                    label: `Verde claro`,
                                    // description: ``,
                                    value: `verde-claro`
                                },
                                {
                                    emoji: "🌵",
                                    label: `Verde`,
                                    // description: ``,
                                    value: `verde`
                                },
                                {
                                    emoji: "🧼",
                                    label: `Cian`,
                                    // description: ``,
                                    value: `cian`
                                },
                                {
                                    emoji: "🧵",
                                    label: `Azul claro`,
                                    // description: ``,
                                    value: `azul-claro`
                                },
                                {
                                    emoji: "🧿",
                                    label: `Azul`,
                                    // description: ``,
                                    value: `azul`
                                },
                                {
                                    emoji: "🟣",
                                    label: `Morado`,
                                    // description: ``,
                                    value: `morado`
                                },
                                {
                                    emoji: "🌸",
                                    label: `Rosa`,
                                    // description: ``,
                                    value: `rosa`
                                },
                                {
                                    emoji: "🌷",
                                    label: `Magenta`,
                                    // description: ``,
                                    value: `magenta`
                                },
                                {
                                    emoji: "🦭",
                                    label: `Gris`,
                                    // description: ``,
                                    value: `gris`
                                },
                                {
                                    emoji: "🏐",
                                    label: `Blanco`,
                                    // description: ``,
                                    value: `blanco`
                                },
                            ]
                        )
                )
            msg.channel.send({ embeds: [embAutoRoles], components: [menuAutoRoles] }).then(msg.delete())
        }
        if ((comando == "time" || comando == "tiempo")) {
            let tiempo = new Date()
    
            const embTiempo = new EmbedBuilder()
            .setTitle(`⌚ Tiempo`)
            .setDescription(`Son las ${tiempo.getHours()}:${tiempo.getMinutes()}:${tiempo.getSeconds()}`)
            .setColor(msg.guild.members.me.displayHexColor)
            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embTiempo] })
        }
        if(comando == "eval"){
            const code = await eval(args.join(" "))
            const evalEmb = new EmbedBuilder()
            .setTitle("Command eval")
            .setDescription(`\`\`\`js\n${code}\`\`\``)
            .setColor(colorEmb)
            msg.reply({allowedMentions: {repliedUser: false}, embeds: [evalEmb]})
        }
        if ((comando == "crearinvite" || comando == "crearinv" || comando == "crinv")) {
            msg.channel.sendTyping()
            let servidor = client.guilds.cache.get(args[0]), canal = client.channels.cache.get(args[0])
    
            if (servidor) {
                let canalesCrearInv = servidor.channels.cache.filter(f => f.type == "GUILD_TEXT" && servidor.members.me.permissionsIn(f).has("CREATE_INSTANT_INVITE")).map(m => m)
                if (canalesCrearInv.length > 0) {
                    canalesCrearInv[0].createInvite({ maxAge: 0, reason: "Mi creador quiere visitar este servidor." }).then(invi => setTimeout(() => {
                        msg.channel.send({ content: `La invitacion se creo y es:\n${invi}` })
                    }, 400))
                } else {
                    const embErrP1 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`En el servidor que has proporcionado no tengo permiso en ningún canal para crear una invitación.`)
                        .setColor(ColorError)
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                            msg.delete().catch(t => {
                                return;
                            })
                            tm.delete().catch(t => {
                                return;
                            })
                        }, 20000))
                    }, 400)
                }
            } else {
                if (canal) {
                    let servidorDelCanal = client.guilds.cache.get(canal.guildId)
    
                    const embErrP1 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`El canal que has proporcionado *(${canal.name})* del servidor ${servidorDelCanal.name} no es un canal de texto por lo tanto no puedo crear una invitación en el.`)
                        .setColor(ColorError)
                        .setTimestamp()
                    if (!canal.type == "GUILD_TEXT") return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                            msg.delete().catch(t => {
                                return;
                            })
                            tm.delete().catch(t => {
                                return;
                            })
                        }, 20000))
                    }, 400)
    
                    if (servidorDelCanal.members.me.permissionsIn(canal).has("CREATE_INSTANT_INVITE")) {
                        canal.createInvite({ maxAge: 0, reason: "Mi creador quiere visitar este servidor." }).then(invi => setTimeout(() => {
                            msg.channel.send({ content: `La invitacion se creo y es:\n${invi}` })
                        }, 400))
                    } else {
                        const embErrP1 = new EmbedBuilder()
                            .setTitle(`${emojis.negativo} Error`)
                            .setDescription(`En el canal que has proporcionado el cual es del servidor ${servidorDelCanal.name} no tengo permisos para crear una invitación.`)
                            .setColor(ColorError)
                            .setTimestamp()
                        return setTimeout(() => {
                            msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                                msg.delete().catch(t => {
                                    return;
                                })
                                tm.delete().catch(t => {
                                    return;
                                })
                            }, 20000))
                        }, 400)
                    }
                } else {
                    const embErrP1 = new EmbedBuilder()
                        .setTitle(`${emojis.negativo} Error`)
                        .setDescription(`No encontré el servidor o el canal que has proporcionado, recuerda que debes de proporcionar una **ID** valida de uno de los dos.`)
                        .setColor(ColorError)
                        .setTimestamp()
                    return setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                            msg.delete().catch(t => {
                                return;
                            })
                            tm.delete().catch(t => {
                                return;
                            })
                        }, 20000))
                    }, 400)
                }
            }
        }
        if ((comando == "serverinfo" || comando == "svinfo")) {
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
    
            if (servidor) {
                let creador = servidor.members.cache.get(servidor.ownerId)
                if (servidor.members.me.permissions.has('ManageGuild')) {
                    let inURL = (await servidor.invites.fetch()).filter(f => f.maxAge == 0).map(mi => mi.url).slice(0, 1)
                    if (inURL.length == 0) {
                        inURL = (await servidor.invites.fetch()).map(mi => mi.url).slice(0, 1)
                        if (inURL.length == 0) {
                            inURL = "El servidor no tiene invitaciones que pueda proporcionarte."
                        }
                    }
    
                    const embInfoSv = new EmbedBuilder()
                        .setAuthor({name: creador.user.tag, iconURL: creador.user.displayAvatarURL()})
                        .setThumbnail(servidor.iconURL({  format: "png" || "gif", size: 4096 }))
                        .setImage(servidor.bannerURL({  format: "png" || "gif", size: 4096 }))
                        .setTitle(`<a:Info:926972188018479164> Información del servidor ${servidor.name}`)
                        .setDescription(servidor.description ? "📄 **Descripción:**\n" + servidor.description : "*El servidor no tiene descripción.*")
                        .setFields(
                            { name: `<:wer:920166217086537739> **servidor:**`, value: `ID: ${servidor.id}\nCreado: <t:${Math.floor(servidor.createdAt / 1000)}:R>\nMiembros: ${servidor.members.cache.size.toLocaleString()}\nUsuarios: ${servidor.members.cache.filter(f => !f.user.bot).size.toLocaleString()}\nBots: ${servidor.members.cache.filter(f => f.user.bot).size.toLocaleString()}`, inline: true },
                            { name: `👑 **Creador:**`, value: `Tag: ${creador.user.tag}\nID: ${creador.id}\nCreo su cuenta: <t:${Math.floor(creador.user.createdAt / 1000)}:R>`, inline: true },
                            { name: `📨 **Invitaciones:** ${(await servidor.invites.fetch()).size.toLocaleString()}`, value: `${(await servidor.invites.fetch()).map(m => `Creada por: [${m.inviter.tag}](${m.inviter.displayAvatarURL({  format: "png" || "gif", size: 4096 })}) | Usos:${m.uses.toLocaleString()}  | Code: ${m.code} | Creada: <t:${Math.floor(m.createdAt / 1000)}:R>`).slice(0, 4).join("\n\n")}`, inline: true },
                            { name: `📃 **Permisos:** ${servidor.members.me.permissions.toArray().length}`, value: `${servidor.members.me.permissions.toArray().map(m => `__${permisos[m]}__`).join(", ")}`, inline: true },
                            // {name: ``, value: ``, inline: true},
                            // {name: ``, value: ``, inline: true},
                        )
                        .setColor(servidor.members.me.displayHexColor)
                        .setFooter({text: `${servidor.name} • Miembros: ${servidor.members.cache.size}`, iconURL: servidor.iconURL()})
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfoSv], content: `${inURL}` })
                    }, 400)
                } else {
                    const embInfoSv = new EmbedBuilder()
                        .setAuthor({name: creador.user.tag, iconURL: creador.user.displayAvatarURL()})
                        .setThumbnail(servidor.iconURL({  format: "png" || "gif", size: 4096 }))
                        .setImage(servidor.bannerURL({  format: "png" || "gif", size: 4096 }))
                        .setTitle(`<a:Info:926972188018479164> Información del servidor ${servidor.name}`)
                        .setDescription(servidor.description ? "📄 **Descripción:**\n" + servidor.description : "*El servidor no tiene descripción.*")
                        .setFields(
                            { name: `<:wer:920166217086537739> **servidor:**`, value: `ID: ${servidor.id}\nCreado: <t:${Math.floor(servidor.createdAt / 1000)}:R>\nMiembros: ${servidor.members.cache.size.toLocaleString()}\nUsuarios: ${servidor.members.cache.filter(f => !f.user.bot).size.toLocaleString()}\nBots: ${servidor.members.cache.filter(f => f.user.bot).size.toLocaleString()}`, inline: true },
                            { name: `👑 **Creador:**`, value: `Tag: ${creador.user.tag}\nID: ${creador.id}\nCreo su cuenta: <t:${Math.floor(creador.user.createdAt / 1000)}:R>`, inline: true },
                            { name: `📃 **Permisos:** ${servidor.members.me.permissions.toArray().length}`, value: `${servidor.members.me.permissions.toArray().map(m => `__${permisos[m]}__`).join(", ")}`, inline: true },
                        )
                        .setColor(servidor.me.displayHexColor)
                        .setFooter({text: `${servidor.name} • Miembros: ${servidor.members.cache.size}`, iconURL: servidor.iconURL()})
                        .setTimestamp()
                    setTimeout(() => {
                        msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embInfoSv] })
                    }, 400)
                }
            } else {
                const embErrP1 = new EmbedBuilder()
                    .setTitle(`${emojis.negativo} Error`)
                    .setDescription(`Al parecer no estoy en ese servidor ya que no lo encontré.`)
                    .setColor(ColorError)
                    .setTimestamp()
                return setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embErrP1] }).then(tm => setTimeout(() => {
                        msg.delete().catch(t => {
                            return;
                        })
                        tm.delete().catch(t => {
                            return;
                        })
                    }, 20000))
                }, 400)
            }
        }
        if ((comando == "servers" || comando == "servidores" || comando == "svs")) {
            msg.channel.sendTyping()
            let servidores = client.guilds.cache.map(m => Object({ id: m.id, miembros: m.memberCount })).sort((a, b) => b.miembros - a.miembros), segPage, s0 = 0, s1 = 10, pagina = 1;
            if (String(client.guilds.cache.size).slice(-1) === "0") {
                segPage = Math.floor(client.guilds.cache.size / 10)
            } else {
                segPage = Math.floor(client.guilds.cache.size / 10 + 1)
            }
    
    
            if (client.guilds.cache.size <= 0) {
                const embServidores = new EmbedBuilder()
                    .setAuthor({name: msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("🧾 Lista de servidores en los que estoy.")
                    .setDescription(`<:wer:920166217086537739>  **Servidores:** ${servidores.length.toLocaleString()}\n\n${servidores.map((m, s) => `**${s + 1}.** [${client.guilds.cache.get(m.id)}](${client.guilds.cache.get(m.id).iconURL({  format: "png" || "gif", size: 4096 })}) **|** 👥 ${m.miembros.toLocaleString()}\n🆔 ${m.id}`).slice(s0, s1).join("\n\n")}`)
                    .setColor(colorEmb)
                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                    .setTimestamp()
                setTimeout(() => {
                    msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embServidores] })
                }, 400)
    
            } else {
                const embServidores = new EmbedBuilder()
                    .setAuthor({name: msg.author.username, iconURL: msg.author.displayAvatarURL()})
                    .setTitle("🧾 Lista de servidores en los que estoy.")
                    .setDescription(`<:wer:920166217086537739>  **Servidores:** ${servidores.length.toLocaleString()}\n\n${servidores.map((m, s) => `**${s + 1}.** [${client.guilds.cache.get(m.id)}](${client.guilds.cache.get(m.id).iconURL({  format: "png" || "gif", size: 4096 })}) **|** 👥 ${m.miembros.toLocaleString()}\n🆔 ${m.id}`).slice(s0, s1).join("\n\n")}`)
                    .setColor(colorEmb)
                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                    .setTimestamp()
    
                const botones1 = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente ")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Primary)
                        ]
                    )
    
                const botones2 = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Primary),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Primary)
                        ]
                    )
    
                const botones3 = new ActionRowBuilder()
                    .setComponents(
                        [
                            new ButtonBuilder()
                                .setCustomId("1")
                                .setLabel("Anterior")
                                .setEmoji("<a:LeftArrow:942155020017754132>")
                                .setStyle(ButtonStyle.Primary),
                        
                            new ButtonBuilder()
                                .setCustomId("2")
                                .setLabel("Siguiente")
                                .setEmoji("<a:RightArrow:942154978859044905>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        ]
                    )
    
                setTimeout(async () => {
                    const mensajeSend = await msg.reply({ allowedMentions: { repliedUser: false }, embeds: [embServidores], components: [botones1] })
                    const colector = mensajeSend.createMessageComponentCollector({ filter: i => i.user.id == msg.author.id, time: segPage * 60000 })
    
                    setTimeout(() => {
                        mensajeSend.edit({ embeds: [embServidores], components: [] })
                    }, 60000)
    
                    colector.on("collect", async botn => {
                        if (botn.customId === "1") {
                            if (s1 - 10 <= 10) {
                                s0 -= 10, s1 -= 10, pagina--
    
                                embServidores
                                    .setDescription(`<:wer:920166217086537739>  **Servidores:** ${servidores.length.toLocaleString()}\n\n${servidores.map((m, s) => `**${s + 1}.** [${client.guilds.cache.get(m.id)}](${client.guilds.cache.get(m.id).iconURL({  format: "png" || "gif", size: 4096 })}) **|** 👥 ${m.miembros.toLocaleString()}\n🆔 ${m.id}`).slice(s0, s1).join("\n\n")}`)
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                return await botn.update({ embeds: [embServidores], components: [botones1] })
                            } else {
                                s0 -= 10, s1 -= 10, pagina--
    
                                embServidores
                                    .setDescription(`<:wer:920166217086537739>  **Servidores:** ${servidores.length.toLocaleString()}\n\n${servidores.map((m, s) => `**${s + 1}.** [${client.guilds.cache.get(m.id)}](${client.guilds.cache.get(m.id).iconURL({  format: "png" || "gif", size: 4096 })}) **|** 👥 ${m.miembros.toLocaleString()}\n🆔 ${m.id}`).slice(s0, s1).join("\n\n")}`)
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                await botn.update({ embeds: [embServidores], components: [botones2] })
                            }
                        }
                        if (botn.customId === "2") {
                            if (s1 + 10 >= servidores.length) {
                                s0 += 10, s1 += 10, pagina++
    
                                embServidores
                                    .setDescription(`<:wer:920166217086537739>  **Servidores:** ${servidores.length.toLocaleString()}\n\n${servidores.map((m, s) => `**${s + 1}.** [${client.guilds.cache.get(m.id)}](${client.guilds.cache.get(m.id).iconURL({  format: "png" || "gif", size: 4096 })}) **|** 👥 ${m.miembros.toLocaleString()}\n🆔 ${m.id}`).slice(s0, s1).join("\n\n")}`)
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                await botn.update({ embeds: [embServidores], components: [botones3] })
                            } else {
                                s0 += 10, s1 += 10, pagina++
    
                                embServidores
                                    .setDescription(`<:wer:920166217086537739>  **Servidores:** ${servidores.length.toLocaleString()}\n\n${servidores.map((m, s) => `**${s + 1}.** [${client.guilds.cache.get(m.id)}](${client.guilds.cache.get(m.id).iconURL({  format: "png" || "gif", size: 4096 })}) **|** 👥 ${m.miembros.toLocaleString()}\n🆔 ${m.id}`).slice(s0, s1).join("\n\n")}`)
                                    .setFooter({text: `Pagina - ${pagina}/${segPage}`, iconURL: msg.guild.iconURL()})
                                await botn.update({ embeds: [embServidores], components: [botones2] })
                            }
                        }
                    })
                }, 400)
            }
        }
    }
})


// Registro de nuevo servidor 
client.on("guildCreate", async gc => {
    let servidorSP = client.guilds.cache.get("940034044819828767"), dueño = gc.members.cache.get(gc.ownerId)

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
    if (gc.members.me.permissions.has('ManageGuild')) {
        let invite = (await gc.invites.fetch()).filter(f => f.maxAge == 0).map(m => m.url).slice(0, 2).join("\n")
        if (invite.length <= 0) {
            invite = (await gc.invites.fetch()).map(i => i.url).slice(0, 2).join("\n")
            if (invite.length <= 0) {
                invite = "No hay invitaciones en el servidor"
            }
        }
        const embGC = new EmbedBuilder()
            .setAuthor({name: dueño.user.tag, iconURL: dueño.user.displayAvatarURL()})
            .setThumbnail(gc.iconURL({  format: "png" || "gif", size: 4096 }))
            .setImage(gc.bannerURL({  format: "png" || "gif", size: 4096 }))
            .setTitle("➕ Añadido en un nuevo servidor")
            .setDescription(`${gc.name}\n${gc.description ? gc.description : "No tiene descripción"}`)
            .setFields(
                { name: `<:wer:920166217086537739> **Servidor:**`, value: `🆔 ID: ${gc.id}\n📅 Creado el <t:${Math.floor(gc.createdAt / 1000)}:F> *(<t:${Math.floor(gc.createdAt / 1000)}:R>)*`, inline: true },
                { name: `👥 **Miembros:** ${gc.members.cache.size.toLocaleString()}`, value: `👤 Usuarios: ${gc.members.cache.filter(fm => !fm.user.bot).size}\n🤖 Bots: ${gc.members.cache.filter(fb => fb.user.bot).size.toLocaleString()}`, inline: true },
                { name: `🌈 **Roles:** ${gc.roles.cache.size}`, value: `${gc.roles.cache.filter(f => !f.managed && f.id != gc.id).map(m => Object({ posicion: m.position, nombre: m.name })).slice(0, 10).sort((a, b) => b.posicion - a.posicion).map(r => r.nombre).slice(0, 10).join(", ")}`, inline: true },
                { name: `📑 **Canales:** ${gc.channels.cache.size.toLocaleString()}`, value: `<:canaldetexto:904812801925738557> texto ${gc.channels.cache.filter(f => f.type == "GUILD_TEXT").size}\n<:canaldevoz:904812835295596544> voz ${gc.channels.cache.filter(f => f.type == "GUILD_VOICE").size}\n<:carpeta:920494540111093780> categorías ${gc.channels.cache.filter(f => f.type == "GUILD_CATEGORY").size}`, inline: true },
                { name: `👑 **Dueño:**`, value: `${dueño.user.tag}\n🆔 ${dueño.id}`, inline: true },
                { name: `📨 **Invitaciones:**`, value: `${(await gc.invites.fetch()).size.toLocaleString()}`, inline: true },
                { name: `🗒️ **Permisos:** ${gc.members.me.permissions.toArray().length}`, value: `${gc.members.me.permissions.toArray().map(m => permisos[m]).join(", ")}`, inline: true }
            )
            .setColor('Green')
            .setTimestamp()
        servidorSP.channels.cache.get("940078302880743505").send({ embeds: [embGC], content: `${invite}` })
    } else {
        const embGC = new EmbedBuilder()
            .setAuthor({name: dueño.user.tag, iconURL: dueño.user.displayAvatarURL()})
            .setThumbnail(gc.iconURL({  format: "png" || "gif", size: 4096 }))
            .setImage(gc.bannerURL({  format: "png" || "gif", size: 4096 }))
            .setTitle("➕ Añadido en un nuevo servidor")
            .setDescription(`${gc.name}\n${gc.description ? gc.description : "No tiene descripción"}`)
            .setFields(
                { name: `<:wer:920166217086537739> **Servidor:**`, value: `🆔 ID: ${gc.id}\n📅 Creado el <t:${Math.floor(gc.createdAt / 1000)}:F> *(<t:${Math.floor(gc.createdAt / 1000)}:R>)*`, inline: true },
                { name: `👥 **Miembros:** ${gc.members.cache.size.toLocaleString()}`, value: `👤 Usuarios: ${gc.members.cache.filter(fm => !fm.user.bot).size}\n🤖 Bots: ${gc.members.cache.filter(fb => fb.user.bot).size.toLocaleString()}`, inline: true },
                { name: `🌈 **Roles:** ${gc.roles.cache.size}`, value: `${gc.roles.cache.filter(f => !f.managed && f.id != gc.id).map(m => Object({ posicion: m.position, nombre: m.name })).slice(0, 10).sort((a, b) => b.posicion - a.posicion).map(r => r.nombre).slice(0, 10).join(", ")}`, inline: true },
                { name: `📑 **Canales:** ${gc.channels.cache.size.toLocaleString()}`, value: `<:canaldetexto:904812801925738557> texto ${gc.channels.cache.filter(f => f.type == "GUILD_TEXT").size}\n<:canaldevoz:904812835295596544> voz ${gc.channels.cache.filter(f => f.type == "GUILD_VOICE").size}\n<:carpeta:920494540111093780> categorías ${gc.channels.cache.filter(f => f.type == "GUILD_CATEGORY").size}`, inline: true },
                { name: `👑 **Dueño:**`, value: `${dueño.user.tag}\n🆔 ${dueño.id}`, inline: true },
                { name: `🗒️ **Permisos:** ${gc.members.me.permissions.toArray().length}`, value: `${gc.members.me.permissions.toArray().map(m => permisos[m]).join(", ")}`, inline: true }
            )
            .setColor('Green')
            .setTimestamp()
        servidorSP.channels.cache.get("940078302880743505").send({ embeds: [embGC], content: `No pude obtener ninguna invitación al servidor.` })
    }
});

// Registro de expulsion de servidor
client.on("guildDelete", async gd => {
    if(!gd.name) return
    let dueño = gd.members.cache.get(gd.ownerId), servidorSP = client.guilds.cache.get("940034044819828767")
    const embGD = new EmbedBuilder()
        .setAuthor({name: dueño.user.tag, iconURL: dueño.user.displayAvatarURL()})
        .setThumbnail(gd.iconURL({  format: "png" || "gif", size: 4096 }))
        .setImage(gd.bannerURL({  format: "png" || "gif", size: 4096 }))
        .setTitle("➖ Expulsado de un servidor")
        .setDescription(`${gd.name}\n${gd.description ? gd.description : "No tiene descripción"}`)
        .setFields(
            { name: `<:wer:920166217086537739> **Servidor:**`, value: `🆔 ID: ${gd.id}\n📅 Creado el <t:${Math.floor(gd.createdAt / 1000)}:F> *(<t:${Math.floor(gd.createdAt / 1000)}:R>)*`, inline: true },
            { name: `👥 **Miembros:** ${gd.members.cache.size.toLocaleString()}`, value: `👤 Usuarios: ${gd.members.cache.filter(fm => !fm.user.bot).size}\n🤖 Bots: ${gd.members.cache.filter(fb => fb.user.bot).size.toLocaleString()}`, inline: true },
            { name: `🌈 **Roles:** ${gd.roles.cache.size}`, value: `${gd.roles.cache.filter(f => !f.managed && f.id != gd.id).map(m => Object({ posicion: m.position, nombre: m.name })).slice(0, 10).sort((a, b) => b.posicion - a.posicion).map(r => r.nombre).slice(0, 10).join(", ")}`, inline: true },
            { name: `👑 **Dueño:**`, value: `${dueño.user.tag}\n🆔 ${dueño.id}` },
        )
        .setColor('Red')
        .setTimestamp()
    servidorSP.channels.cache.get("940078302880743505").send({ embeds: [embGD] })

    let dataSP = await puntosDB.findById(gd.id)
    if (dataSP) {
        await puntosDB.findByIdAndDelete(gd.id)
    }

    let dataAFK = await afkDB.findById(gd.id)
    if (dataAFK) {
        await afkDB.findByIdAndDelete(gd.id)
    }
});

process.on("unhandledRejection", err => {
    const server = client.guilds.cache.get(guild.id)
    const embErr = new EmbedBuilder()
    .setTitle(`${emojis.negativo} Ocurio un error`)
    .setDescription(`\`\`\`js\n${err}\n\nGuild: ${guild.id}\nChannel: ${guild.channelId}\`\`\``)
    .setColor("ff0000")
    .setTimestamp()
    if(server) embErr.setFooter({text: server.name, iconURL: server.iconURL()})
    client.channels.cache.get("960294374258933821").send({ embeds: [embErr] })
    console.error(err)
})

client.on("shardError", async err => {
    const server = client.guilds.cache.get(guild.id)
    const embErr = new EmbedBuilder()
    .setTitle(`${emojis.negativo} Ocurio un error`)
    .setDescription(`\`\`\`js\n${err.name}\n${err.message}\n${err.stack}\n\nGuild: ${guild.id}\nChannel: ${guild.channelId}\`\`\``)
    .setColor("ff0000")
    .setTimestamp()
    if(server) embErr.setFooter({text: server.name, iconURL: server.iconURL()})
    client.channels.cache.get("960294374258933821").send({ embeds: [embErr] })
    console.error(err)
})

client.login(token);