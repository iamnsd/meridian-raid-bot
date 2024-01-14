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

const prefix = '!'; // Выберите префикс для команд бота

const questions = [
  'Привет! Какое у тебя имя персонажа?',
];

let answers = {};
let currentQuestion = 0;
let isSurveyActive = false;

const levelOptions = [
  '< 1490',
  '1490-1500',
  '1510-1540',
  '1540-1560',
  '1560-1580',
  '> 1580'
];

const timezoneOptions = [
  'МСК-4',
  'МСК-3',
  'МСК-2',
  'МСК-1',
  'МСК',
  'МСК+1',
  'МСК+2',
  'МСК+3',
  'МСК+4'
];


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers,] });

const commands = [];

client.on('ready', async () => {
  console.log('Bot is online');

});

client.on('messageCreate', async (message) => {
  console.log(`Received message: ${message.content}`);

  if (message.author.bot) return;

  if (message.content.startsWith(prefix)) {
    console.log('Message starts with prefix.');
    const command = message.content.slice(prefix.length).trim();
    console.log(`Command: ${command}`);

    if (command === 'raid' && !isSurveyActive) {
      console.log('Starting survey.');
      // Начало анкетирования по команде !raid
      isSurveyActive = true;
      currentQuestion = 0;

      // Отправляем первый вопрос в личные сообщения
      const dmChannel = await message.author.createDM();
      dmChannel.send(questions[currentQuestion]).catch((err) => console.error(err));
    }
    return;
  }

  // Проверяем, является ли сообщение ответом на текущий вопрос в опросе
  if (isSurveyActive && currentQuestion < questions.length && message.author.id === message.author.id) {
    console.log('Survey is active, processing question.');

    // Обработка ответов на вопросы
    const answer = message.content;

    switch (currentQuestion) {
      case 0:
        // Обработка имени персонажа
        break;
      // Добавьте обработку других вопросов

      default:
        break;
    }

    // Сохранение ответа
    answers[questions[currentQuestion]] = answer;
    currentQuestion++;

    // Если еще есть вопросы, отправляем следующий вопрос в личные сообщения
    if (currentQuestion < questions.length) {
      const dmChannel = await message.author.createDM();
      dmChannel.send(questions[currentQuestion]).catch((err) => console.error(err));
    } else {
      // Если вопросы закончились, выводим собранную информацию в текстовый канал
      // message.channel.send('Спасибо за предоставленную информацию!');
      // Object.entries(answers).forEach(([question, answer]) => {
      //  message.channel.send(`${question}: ${answer}`);
      // });

      // Отправляем информацию также в личный канал
      const dmChannel = await message.author.createDM();
      dmChannel.send('Спасибо за предоставленную информацию!');
      Object.entries(answers).forEach(([question, answer]) => {
        dmChannel.send(`${question}: ${answer}`);
      });

      // Сброс данных после завершения
      isSurveyActive = false;
      currentQuestion = 0;
      answers = {};
    }
  }
  console.log('No action taken for this message.');
});

// Добавим обработчик для личных сообщений
client.on('messageCreate', async (message) => {
  if (!message.guild) {
    // Обработка личных сообщений
    console.log(`Received DM: ${message.content}`);
    // Добавьте здесь код для обработки личных сообщений, если это необходимо
  }
});

async function main() {
  try {
    await client.login(TOKEN);
  } catch (err) {
    console.log(err);
  }
}

main();