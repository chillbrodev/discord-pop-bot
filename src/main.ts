import { configs } from "./config.ts";
import { HelpHandler } from "./command-handlers/help/help-handler.ts";
import { DatabaseInterface } from "./db/db-interface.ts";
import { DatabaseFactory } from "./db/db-factory.ts";
import * as Discord from "@discord";
import { GatewayIntentBits, MessageFlags, Routes } from "discord/types";
import { REST } from "@discord/rest";
import { ListFlagsHandler } from "./command-handlers/list-flags/list-flags-handler.ts";
import { EmbedBuilder } from "@discord/builders";
import { ResetFlagsHandler } from "./command-handlers/reset-flags/reset-flags-handler.ts";
import { GuildProgressHandler } from "./command-handlers/guild-progress/guild-progress-handler.ts";
import { isQuarmFlag, popFlags, popFlagsLookup } from "./flags/flags.ts";
import { NextStepsHandler } from "./command-handlers/next-steps/next-steps-handler.ts";
import { TrackFlagHandler } from "./command-handlers/track-flag/track-flag-handler.ts";
import { ActionRowBuilder, StringSelectMenuBuilder } from "@discord/builders";

const db: DatabaseInterface = DatabaseFactory.createDatabase(configs);
const helpHandler = new HelpHandler();
const listFlagsHandler = new ListFlagsHandler();
const resetFlagsHandler = new ResetFlagsHandler(db);
const guildProgressHandler = new GuildProgressHandler(db, popFlags);
const nextStepsHandler = new NextStepsHandler(db, popFlags);
const trackFlagHandler = new TrackFlagHandler(db, popFlags);

// Initialize client with necessary intents
const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("debug", console.log); // Logs low-level events
client.on("warn", console.warn); // Logs warnings
client.on("error", console.error); // Logs errors

client.once("ready", async () => {
  const userId = client.user?.id;
  const userTag = client.user?.tag;
  if (!userId) {
    console.error("Client user ID is not available.");
    return;
  }

  if (!userTag) {
    console.error("Client user TAG is not available.");
    return;
  }

  console.log(`Logged in as ${userTag} with ID ${userId}`);
  const rest = new REST({ version: "10" }).setToken(configs.token);

  try {
    console.log("Refreshing application commands...");

    // First, delete all existing commands
    console.log("Deleting all existing commands...");
    await rest.put(Routes.applicationCommands(userId), {
      body: [],
    });

    // Then register the new commands
    console.log("Registering new commands...");
    await rest.put(Routes.applicationCommands(userId), {
      body: [
        helpHandler.discordCommand,
        listFlagsHandler.discordCommand,
        resetFlagsHandler.discordCommand,
        guildProgressHandler.discordCommand,
        nextStepsHandler.discordCommand,
        trackFlagHandler.discordCommand,
      ],
    });

    console.log("Successfully reloaded application commands.");
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (interaction: Discord.Interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  // Defer reply for commands that might take longer to process
  if (
    [nextStepsHandler.name, guildProgressHandler.name].includes(commandName)
  ) {
    await interaction.deferReply();
  }

  const targetUser = interaction.user;
  const userId = targetUser.id;
  const guildId = interaction.guild ? interaction.guild.id : "dm";

  // Get the guild member object instead of using displayName directly
  let displayName: string = targetUser.username; // Default fallback

  // If this is in a guild context, try to get the member's nickname
  if (interaction.guild) {
    const member = interaction.member;
    if (member instanceof Discord.GuildMember) {
      displayName = member.nickname || targetUser.displayName;
    } else {
      console.warn("Member is not a GuildMember instance.");
    }

    console.log(`Display name: ${displayName}`);
    await db.initPlayer(userId, guildId, displayName);
  }

  console.log(
    `Received command: ${commandName} from user: ${displayName} (${userId}) in guild: ${guildId}`
  );
  switch (commandName) {
    case helpHandler.name: {
      const help = new HelpHandler();
      await interaction.reply(help.printHelp());
      break;
    }

    case listFlagsHandler.name: {
      const flagList = listFlagsHandler.listFlags();
      // Create an embed to display the flags
      const flagEmbed = new EmbedBuilder()
        .setTitle("Planes of Power Flags")
        .setDescription(flagList)
        .setColor(0x0099ff);
      await interaction.reply({ embeds: [flagEmbed] });
      break;
    }

    case resetFlagsHandler.name: {
      const resetSuccess = await resetFlagsHandler.resetFlags(userId, guildId);
      if (resetSuccess) {
        await interaction.reply("Your flags have been reset.");
      } else {
        await interaction.reply("Failed to reset your flags.");
      }
      break;
    }

    case guildProgressHandler.name: {
      const report = await guildProgressHandler.guildProgressReport(guildId);
      if (!report) {
        await interaction.editReply(
          "No players in this server have tracked any PoP flags yet."
        );
        return;
      }

      const progressEmbed = new EmbedBuilder()
        .setTitle(`Planes of Power Guild Progress Report`)
        .setDescription(
          `Total Players Tracking: ${report.guildProgress} | Quarm Slayers: ${report.quarmSlayers}`
        )
        .setColor(0x7289da)
        .setTimestamp();

      progressEmbed.addFields({
        name: "Top Players",
        value: report.playerList,
        inline: false,
      });

      await interaction.editReply({ embeds: [progressEmbed] });

      break;
    }

    case nextStepsHandler.name: {
      const report = await nextStepsHandler.nextStepsReport(userId, guildId);
      if (report.availableFlags.length === 0) {
        if (report.popComplete) {
          await interaction.editReply(
            "🎉 You have completed all Planes of Power content including Quarm!"
          );
          return;
        }
      } else {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(`${displayName}'s Next Available Flags`)
              .setDescription(report.availableFlags.join("\n"))
              .setColor(0x00ff00)
              .setTimestamp(),
          ],
        });
      }
      break;
    }

    case trackFlagHandler.name: {
      const flagOptions = await trackFlagHandler.provideFlagOptions(
        userId,
        guildId
      );

      if (flagOptions.length === 0) {
        await interaction.reply(
          "No flags are currently available for you to complete."
        );
        return;
      }

      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("flag_choice")
          .setPlaceholder("Select a flag to mark as completed")
          .addOptions(
            flagOptions.map((flag) => ({
              label: flag.label,
              value: flag.flagKey,
            }))
          )
      );

      const response = await interaction.reply({
        content: "Please select a flag to mark as completed:",
        components: [row],
        withResponse: true,
        flags: MessageFlags.Ephemeral,
      });

      try {
        // This filter ensures only the original user can interact with the buttons

        const confirmation =
          await response.resource?.message?.awaitMessageComponent({
            time: 60_000, // 1minute
            filter: (messageInteraction) =>
              messageInteraction.user.id === interaction.user.id,
          });

        if (!confirmation) {
          await interaction.editReply({
            content: "You did not select a flag in time.",
            components: [],
          });
          return;
        }

        if (confirmation.isStringSelectMenu()) {
          const flagKey = confirmation.values[0];
          console.log(
            `User ${userId} in guild ${guildId} is attempting to complete flag ${flagKey}`
          );

          // Mark the flag as completed in the database
          console.log(
            `Marking flag ${flagKey} as completed for user ${userId} in guild ${guildId}`
          );
          await trackFlagHandler.trackFlag(userId, guildId, flagKey);

          // Special message for completing Quarm
          if (isQuarmFlag(popFlagsLookup[flagKey])) {
            await confirmation.update({
              content: `🎉 **CONGRATULATIONS!** ${displayName} has completed the full Planes of Power progression and defeated Quarm!`,
              components: [],
            });
          } else {
            await confirmation.update({
              content: `✅ ${displayName} has completed the flag: ${popFlagsLookup[flagKey].name}`,
              components: [],
            });
          }
        }
      } catch (error) {
        console.error("Error sending interaction response:", error);
      }
      break;
    }
  }
});

client.on("error", (error: unknown) => {
  console.error("Discord client error:", error);
});

// Login to Discord
client.login(configs.token);
