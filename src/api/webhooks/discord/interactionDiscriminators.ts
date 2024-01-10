import {
    APIApplicationCommandAutocompleteInteraction,
    InteractionType,
    APIChatInputApplicationCommandInteraction,
    ApplicationCommandType,
    APIContextMenuInteraction,
    APIModalSubmitInteraction,
    APIMessageComponentInteraction,
    APIApplicationCommandInteraction,
    APIPingInteraction,
} from "discord-api-types/v10";
import { APIUnknownInteraction } from ".";

// export type InteractionTypes = APIPingInteraction | APIApplicationCommandAutocompleteInteraction |

// @ts-expect-error APIPingInteraction is omitting a field, which typescript does not like
export const isPingInteraction = (interaction: APIUnknownInteraction): interaction is APIPingInteraction =>
    interaction.type === InteractionType.Ping;

export const isAutocompleteInteraction = (
    interaction: APIUnknownInteraction,
): interaction is APIApplicationCommandAutocompleteInteraction =>
    interaction.type === InteractionType.ApplicationCommandAutocomplete;

export const isApplicationInteraction = (
    interaction: APIUnknownInteraction,
): interaction is APIChatInputApplicationCommandInteraction => {
    if (interaction.type !== InteractionType.ApplicationCommand) {
        return false;
    }
    const applicationCommand = interaction as APIApplicationCommandInteraction;
    return applicationCommand.data.type === ApplicationCommandType.ChatInput;
};

export const isContextMenuInteraction = (
    interaction: APIUnknownInteraction,
): interaction is APIContextMenuInteraction => {
    if (interaction.type !== InteractionType.ApplicationCommand) {
        return false;
    }
    const applicationCommand = interaction as APIApplicationCommandInteraction;
    return (
        applicationCommand.data.type === ApplicationCommandType.Message ||
        applicationCommand.data.type === ApplicationCommandType.User
    );
};

export const isMessageContextMenuInteraction = (
    interaction: APIUnknownInteraction,
): interaction is APIContextMenuInteraction => {
    if (interaction.type !== InteractionType.ApplicationCommand) {
        return false;
    }
    const applicationCommand = interaction as APIApplicationCommandInteraction;
    return applicationCommand.data.type === ApplicationCommandType.Message;
};

export const isUserContextMenuInteraction = (
    interaction: APIUnknownInteraction,
): interaction is APIContextMenuInteraction => {
    if (interaction.type !== InteractionType.ApplicationCommand) {
        return false;
    }
    const applicationCommand = interaction as APIApplicationCommandInteraction;
    return applicationCommand.data.type === ApplicationCommandType.User;
};

export const isModalInteraction = (interaction: APIUnknownInteraction): interaction is APIModalSubmitInteraction =>
    interaction.type === InteractionType.ModalSubmit;

export const isComponentInteraction = (
    interaction: APIUnknownInteraction,
): interaction is APIMessageComponentInteraction => interaction.type === InteractionType.MessageComponent;

export const interactionTypeName = (interaction: APIUnknownInteraction) => {
    if (isPingInteraction(interaction)) {
        return "Ping";
    }
    if (isAutocompleteInteraction(interaction)) {
        return "Autocomplete";
    }
    if (isApplicationInteraction(interaction)) {
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

export const interactionName = (interaction: APIUnknownInteraction) => {
    if (
        isAutocompleteInteraction(interaction) ||
        isApplicationInteraction(interaction) ||
        isContextMenuInteraction(interaction)
    ) {
        return interaction.data.name;
    }
    if (isModalInteraction(interaction) || isComponentInteraction(interaction)) {
        return interaction.data.custom_id;
    }

    return interaction.id;
};
