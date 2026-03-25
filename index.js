require('dotenv').config();
const { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder, Partials } = require('discord.js');

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("ERROR: Missing TOKEN, CLIENT_ID, or GUILD_ID.");
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName('flood')
    .setDescription('Send messages with Madea emblem')
    .setDMPermission(true)
    .addStringOption(o => o.setName('message').setDescription('Message to send').setRequired(true))
    .addIntegerOption(o => o.setName('count').setDescription('Number of times to send (1-16)')),
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if bot is alive')
    .setDMPermission(true),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('Guild commands registered!');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Global commands registered!');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
})();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

client.once(Events.ClientReady, () => {
  console.log(`Bot is online as ${client.user.tag}`);
  const statuses = [
    { name: 'Madea Taking Over', type: 0 },
    { name: 'Textin Yo Ho', type: 2 },
    { name: 'You a bitch nigga', type: 3 },
    { name: 'Come Die', type: 5 },
  ];
  let i = 0;
  setInterval(() => {
    client.user.setPresence({ activities: [statuses[i]], status: 'online' });
    i = (i + 1) % statuses.length;
  }, 10000);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  try {
    if (interaction.commandName === 'ping') {
     await interaction.reply('Madea is alive!');
