require("dotenv").config();
const { Client, GatewayIntentBits, Events, Partials } = require("discord.js");

const TOKEN = process.env.TOKEN;

// ✅ Check token
if (!TOKEN) {
  console.error("ERROR: Missing TOKEN environment variable.");
  process.exit(1);
}

console.log("Starting bot...");

// ✅ Create ONE client only
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

// ✅ Ready event
client.once(Events.ClientReady, () => {
  console.log(`Bot is online as ${client.user.tag}`);
  console.log("Guilds this bot is in:");
  client.guilds.cache.forEach(g => console.log(g.id, g.name));

  // 🔁 Rotating statuses
  const statuses = [
    { name: "Madea Taking Over", type: 0 },
    { name: "Textin Yo Ho", type: 2 },
    { name: "Running the server", type: 3 },
    { name: "Watching everything 👀", type: 5 },
  ];

  let i = 0;
  setInterval(() => {
    client.user.setPresence({
      activities: [statuses[i]],
      status: "online",
    });
    i = (i + 1) % statuses.length;
  }, 10000);
});

// ✅ Slash command handler
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    // 🏓 Ping command
    if (interaction.commandName === "ping") {
      return interaction.reply("Madea is alive!");
    }

    // 💬 Flood command
    if (interaction.commandName === "flood") {
      const message = interaction.options.getString("message");
      let count = interaction.options.getInteger("count") || 1;

      // 🔒 Safety limits
      if (count > 16) count = 16;
      if (count < 1) count = 1;

      const channel = interaction.channel;

      if (!channel || !channel.isTextBased()) {
        return interaction.reply({
          content: "Cannot send messages here.",
          ephemeral: true,
        });
      }

      for (let i = 0; i < count; i++) {
        await channel.send(`${message} [Madea]`);
      }

      return interaction.reply({
        content: `Sent message ${count} times!`,
        ephemeral: true,
      });
    }

  } catch (err) {
    console.error("Error handling interaction:", err);

    if (!interaction.replied) {
      await interaction.reply({
        content: "Something went wrong!",
        ephemeral: true,
      });
    }
  }
});

// ✅ Catch crashes
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});

// 🔑 Login
client.login(TOKEN).catch((err) => {
  console.error("Login failed. Check your TOKEN:", err);
  process.exit(1);
});