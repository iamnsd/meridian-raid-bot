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
  'Выбери уровень экипировки:',
  'В каком часовом поясе ты находишься?',
  'Укажи временной интервал активности (в формате HH:mm - HH:mm):'
];

const answers = {};

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

client.on('message', (message) => {
	
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

      // Отправляем первый вопрос
      message.author.send(questions[currentQuestion]);
    }
    return;
  }

  if (isSurveyActive && currentQuestion < questions.length) {
	console.log('Survey is active, processing question.');
    // Обработка ответов на вопросы
    const answer = message.content;

    switch (currentQuestion) {
      case 1:
        if (!levelOptions.includes(answer)) {
          message.author.send('Пожалуйста, выбери один из вариантов ответа.');
          return;
        }
        break;
      case 2:
        if (!timezoneOptions.includes(answer)) {
          message.author.send('Пожалуйста, выбери один из вариантов ответа.');
          return;
        }
        break;
      case 3:
        // Проверка формата времени (пример: 10:00 - 12:00)
        const timeFormat = /^([01]\d|2[0-3]):([0-5]\d) - ([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeFormat.test(answer)) {
          message.author.send('Пожалуйста, укажи временной интервал в правильном формате (HH:mm - HH:mm).');
          return;
        }
        break;
    }

    // Сохранение ответа
    answers[questions[currentQuestion]] = answer;
    currentQuestion++;

    // Если еще есть вопросы, отправляем следующий
    if (currentQuestion < questions.length) {
      message.author.send(questions[currentQuestion]);
    } else {
      // Если вопросы закончились, выводим собранную информацию
      message.author.send('Спасибо за предоставленную информацию!');
      Object.entries(answers).forEach(([question, answer]) => {
        message.author.send(`${question}: ${answer}`);
      });

      // Сброс данных после завершения
      isSurveyActive = false;
      currentQuestion = 0;
      answers = {};
    }
  }
  console.log('No action taken for this message.');
});

async function main() {
  try {
    await client.login(TOKEN);
  } catch (err) {
    console.log(err);
  }
}

main();