const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

const asesoriasChannelId = '763976832365887488';
let asesoriasChannel;

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log('I am ready!')
    client.channels.fetch(`${asesoriasChannelId}`)
        .then(channel => asesoriasChannel = channel)
});

function registrar(message, mae, materia) {
    message.channel.send('Asesoria registrada :D')
    console.log(asesoriasChannel)
    asesoriasChannel.send(`Alumno: ${message.author}, Mae: ${mae}, Materia: ${materia}, fecha: ${new Date().toDateString()}`)
}

function printCommands(c, message) {
    message.channel.send("Por favor indica uno de los siguientes comandos: " + Object.keys(commands).join(', '))
}

function checkPermission(member, role) {
    return member.roles.highest.name === role || member.roles.highest.name === 'Admin'
}

function getAsesorias(message) {

    if (!checkPermission(message.member, 'Admin')) {
        message.member.createDM()
            .then(dm => {
                dm.send('F. No cuentas con los permisos para correr este comando :(')
            })
    } else {

        const asesorias = []

        asesoriasChannel.messages.fetch()
            .then(messages => {
                messages = messages.toJSON()
                for (m of messages) {
                    asesorias.push(m.content)
                }
                message.member.createDM()
                    .then(dm => {
                        dm.send(asesorias.join('; '))
                    })
            })
    }

}

function getConectados(message) {
    if (!checkPermission(message.member, 'Admin')) {
        message.member.createDM()
            .then(dm => {
                dm.send('F. No cuentas con los permisos para correr este comando :(')
            })
    } else {

        const conectados = [];
        let members = message.channel.members
        members = members.filter(m => m.presence.status === 'online')
        members.map(c => conectados.push(c.user.username))
        message.member.createDM()
            .then(dm => {
                dm.send(`${message.channel.name} conectados ${conectados.length} en dia ${new Date().toDateString()}`)
                dm.send(conectados.join(' ; '))
            })
    }
}

const commands = {
    registrar: (c, message) => registrar(message, c[2], c[3]),
    metricas: (c, message) => getAsesorias(message),
    conectados: (c, message) => getConectados(message)
}

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
    member.createDM().then(dm => {
        dm.send("Hola! Soy un bot")
        dm.send(`Te doy la bienvenida ${member} a el discord de MAE. Te invitamos a leer el canal de bienvenida. Cualquier duda, entra a el canal de voz "pasillo mae"`)
        dm.send("Me están enseñando a ser de utilidad para ti. Próximamente podrás apoyarte en mi cuando no haya maes conectados :D")
    })
});

client.on('message', message => {


    const text = message.content

    if (message.channel.type === 'dm') {
        if (message.content.includes('gracias')) {
            message.channel.send(':D')
        } else {
            if (message.author.id !== client.user.id) {
                message.channel.send("Aún estoy aprendiendo. Si requieres ayuda, entra al canal del voz 'pasillo mae'")
            }
        }
    }

    if (text.startsWith('!b')) {
        const command = text.split(' ')

        if (command.length === 1 || Object.keys(commands).includes(command[0])) {
            printCommands(command, message)
        } else {
            commands[command[1]](command, message)
        }
    }
})

// Log our bot in using the token from https://discord.com/developers/applications
client.login('NzYzOTQzNTk4NDc0Nzg4ODk1.X3_D6w.BqyxK3ReBvqo-BxvdX18s0OE1Eg');
