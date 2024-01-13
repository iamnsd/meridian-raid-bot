import { config } from 'dotenv';
config();
import {
  Client,
  GatewayIntentBits,
  Routes,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';


const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = '1074328033395216464';

const ROLES = {
  COURSE1: '1074716801432297592',
  COURSE2: '',
  COURSE3: '',
  COURSE4: '',
  COURSE5: '',
};

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [];

client.on('ready', async () => {
  console.log('Bot is online');

   const channel = client.channels.cache.get('1074328034070503487');
   console.log(channel);
   channel.send({
     content: 'Выберите один или несколько интересующих курсов',
     components: [
       new ActionRowBuilder().setComponents(
         new ButtonBuilder()
           .setCustomId('course1')
		   .setEmoji('🐧')
           .setLabel('Linux курс "exec-rm"')
           .setStyle(ButtonStyle.Success),
         new ButtonBuilder()
           .setCustomId('course2')
           .setLabel('Основы сетей')
           .setStyle(ButtonStyle.Secondary)
		   .setDisabled(true),
//         new ButtonBuilder()
//           .setCustomId('course3')
//           .setLabel('Курс 3')
//           .setStyle(ButtonStyle.Primary),
//         new ButtonBuilder()
//           .setCustomId('course4')
//           .setLabel('Курс 4')
//           .setStyle(ButtonStyle.Primary),
//         new ButtonBuilder()
//           .setCustomId('course5')
//           .setLabel('Курс 5')
//           .setStyle(ButtonStyle.Primary)
       ),
     ],
   });
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    const role = interaction.guild.roles.cache.get(
      ROLES[interaction.customId.toUpperCase()] 
    );

    if (!role)
      return interaction.reply({ content: 'Для выбранного курса не найдена соответствующая роль Discord сервера', ephemeral: true });

    const hasRole = interaction.member.roles.cache.has(role.id);
    console.log(hasRole);

    if (hasRole)
      return interaction.member.roles
        .remove(role)
        .then((member) =>
          interaction.reply({
            content: `Роль ${role} удалена для пользователя ${member}`,
            ephemeral: true,
          })
        )
        .catch((err) => {
          console.log(err);
          return interaction.reply({
            content: `Упс, что то пошло не так. Роль ${role} не была удалена у пользователя ${member}`,
            ephemeral: true,
          });
        });
    else
      return interaction.member.roles
        .add(role)
        .then((member) =>
          interaction.reply({
            content: `В соответствии с выбранным курсом роль ${role} была назначена пользователю ${member}`,
            ephemeral: true,
          })
        )
        .catch((err) => {
          console.log(err);
          return interaction.reply({
            content: `Упс, что то пошло не так. Роль ${role} не была удалена у пользователя ${member}`,
            ephemeral: true,
          });
        });
  }
});

async function main() {
  try {
    client.login(TOKEN);
  } catch (err) {
    console.log(err);
  }
}

main();