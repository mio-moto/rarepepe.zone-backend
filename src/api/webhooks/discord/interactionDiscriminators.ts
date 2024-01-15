import { ApplicationCommandTypes, InteractionTypes } from "@discordeno/types";
import {
    ApplicationCommandAutocompleteInteraction,
    ApplicationCommandInteraction,
    ChatInputApplicationCommandInteraction,
    ContextMenuApplicationCommandInteraction,
    MessageComponentInteraction,
    MessageContextMenuApplicationCommandInteraction,
    ModalSubmitInteraction,
    PingInteraction,
    UnknownInteraction,
    UserContextMenuApplicationCommandInteraction,
} from "./types";

export const isPingInteraction = (interaction: UnknownInteraction): interaction is PingInteraction =>
    interaction.type === InteractionTypes.Ping;

export const isAutocompleteInteraction = (
    interaction: UnknownInteraction,
): interaction is ApplicationCommandAutocompleteInteraction =>
    interaction.type === InteractionTypes.ApplicationCommandAutocomplete;

export const isApplicationCommandInteraction = (
    interaction: UnknownInteraction,
): interaction is ApplicationCommandInteraction => interaction.type === InteractionTypes.ApplicationCommand;

export const isChatInputApplicationCommandInteraction = (
    interaction: UnknownInteraction,
): interaction is ChatInputApplicationCommandInteraction =>
    isApplicationCommandInteraction(interaction) && interaction.data.type === ApplicationCommandTypes.ChatInput;

export const isContextMenuInteraction = (
    interaction: UnknownInteraction,
): interaction is ContextMenuApplicationCommandInteraction =>
    isApplicationCommandInteraction(interaction) &&
    (interaction.data.type === ApplicationCommandTypes.Message ||
        interaction.data.type === ApplicationCommandTypes.User);

export const isMessageContextMenuInteraction = (
    interaction: UnknownInteraction,
): interaction is MessageContextMenuApplicationCommandInteraction =>
    isApplicationCommandInteraction(interaction) && interaction.data.type === ApplicationCommandTypes.Message;

export const isUserContextMenuInteraction = (
    interaction: UnknownInteraction,
): interaction is UserContextMenuApplicationCommandInteraction =>
    isApplicationCommandInteraction(interaction) && interaction.data.type === ApplicationCommandTypes.User;

export const isModalInteraction = (interaction: UnknownInteraction): interaction is ModalSubmitInteraction =>
    interaction.type === InteractionTypes.ModalSubmit;

export const isComponentInteraction = (interaction: UnknownInteraction): interaction is MessageComponentInteraction =>
    interaction.type === InteractionTypes.MessageComponent;

export const interactionTypeName = (interaction: UnknownInteraction) => {
    if (isPingInteraction(interaction)) {
        return "Ping";
    }
    if (isAutocompleteInteraction(interaction)) {
        return "Autocomplete";
    }
    if (isChatInputApplicationCommandInteraction(interaction)) {
        return "Slash Command";
    }
    if (isUserContextMenuInteraction(interaction)) {
        return "User Context Menu";
    }
    if (isMessageContextMenuInteraction(interaction)) {
        return "Message Context Menu";
    }
    if (isModalInteraction(interaction)) {
        return "Modal";
    }
    if (isComponentInteraction(interaction)) {
        return "Component";
    }
    return "UNKNOWN";
};

export const interactionName = (interaction: UnknownInteraction) => {
    if (
        isAutocompleteInteraction(interaction) ||
        isChatInputApplicationCommandInteraction(interaction) ||
        isContextMenuInteraction(interaction)
    ) {
        return interaction.data.name;
    }
    if (isModalInteraction(interaction) || isComponentInteraction(interaction)) {
        return interaction.data.customId;
    }

    return interaction.id;
};
