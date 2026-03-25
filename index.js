console.log("Bot starting...");

console.log("Starting bot...");
console.log("TOKEN:", process.env.TOKEN ? "FOUND" : "MISSING");

const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try { await command.execute(interaction); }
  catch (err) { console.error(err); }
});

// login
client.login(process.env.TOKEN);

const LOG_CHANNEL_ID = '1483502170497220734'; // put your copied ID

client.once('clientReady', () => {
  // find the channel
  const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
  if (logChannel) {
    logChannel.send(`✅ Bot started as ${client.user.tag}`);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
  if (logChannel) {
    logChannel.send(`💬 Command used: /${interaction.commandName} by ${interaction.user.tag}`);
