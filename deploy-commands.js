require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes, SlashCommandBuilder } = require('discord.js');

// ✅ Make sure all required env variables exist
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("ERROR: Missing TOKEN, CLIENT_ID, or GUILD_ID.");
  process.exit(1);
}

// ✅ Define commands
const commands = [
  new SlashCommandBuilder()
    .setName('flood')
    .setDescription('Send messages with Madea emblem')
    .addStringOption(option =>
      option.setName('message')
            .setDescription('Message to send')
            .setRequired(true))
    .addIntegerOption(option =>
      option.setName('count')
            .setDescription('Number of times to send (1-16)'))
].map(cmd => cmd.toJSON());

// ✅ Create REST client with bot token
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    // Register commands for a specific guild (faster for testing)
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ Commands registered successfully!');
  } catch (error) {
    // Detailed error logging
    console.error('❌ Failed to register commands. Check your TOKEN, CLIENT_ID, and GUILD_ID:');
    console.error(error);
  }
})();
