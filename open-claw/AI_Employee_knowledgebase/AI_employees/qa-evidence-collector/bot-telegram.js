const { Bot } = require("grammy");
const { runAgent } = require("./openclaw-runner");

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
const slug = "qa-evidence-collector";

bot.command("start", (ctx) => {
  ctx.reply("QA Evidence Collector is online. Send a message to start working.");
});

bot.on("message:text", async (ctx) => {
  try {
    const sessionId = `telegram-${slug}-${ctx.from?.id ?? 'unknown'}`;
    const reply = await runAgent({ message: ctx.message.text, sessionId });
    await ctx.reply(reply || "No response from agent.");
  } catch (error) {
    console.error(error);
    await ctx.reply("Something went wrong. Please try again.");
  }
});

bot.start();
console.log("Telegram bot is running for QA Evidence Collector.");
