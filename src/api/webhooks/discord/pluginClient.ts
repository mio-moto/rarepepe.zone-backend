import { loggerFactory } from "#/logging";
import {
  APIInteractionResponse,
  InteractionType,
  APIBaseInteraction,
  APIInteractionResponseCallbackData,
  APIChatInputApplicationCommandInteraction,
  APIContextMenuInteraction,
  APIApplicationCommandAutocompleteInteraction,
  MessageFlags,
  RESTPostAPIWebhookWithTokenJSONBody,
  APIModalSubmitInteraction,
  APIMessageComponentInteraction,
  APICommandAutocompleteInteractionResponseCallbackData,
  APIModalInteractionResponseCallbackData,
} from "discord-api-types/v10";
import { APIUnknownInteraction, AnyGatewayResult } from ".";
import {
  createInteractionResponse_DeferredChannelMessage,
  createInteractionResponse_DeferredMessageUpdate,
  createInteractionResponse_ChannelMessage,
  createInteractionResponse_Pong,
  createModalInteractionResponse,
  createApplicationCommandResponse_Autocomplete,
  createInteractionResponse_UpdateMessage,
} from "./messagePayloads";
import {
  interactionName as getInteractionName,
  interactionTypeName as getInteractionTypeName,
  isApplicationInteraction,
  isAutocompleteInteraction,
  isComponentInteraction,
  isContextMenuInteraction,
  isModalInteraction,
  isPingInteraction,
} from "./interactionDiscriminators";
import { DiscordEnvironment, Rabscuttle } from "./rabscuttle";
import { tryInvoke } from "#/utils/tryInvoke";

const GatewayTimeout = 2_500;
const logger = loggerFactory("WEBHK:Discord:Client");

type InteractionResponse = APIInteractionResponse;
type InteractionDefer =
  | Parameters<typeof createInteractionResponse_DeferredChannelMessage>[0]
  | Parameters<typeof createInteractionResponse_DeferredMessageUpdate>;
type BaseInteraction<Type extends InteractionType, Data> = APIBaseInteraction<Type, Data>;

export interface PluginClient<
  Response extends InteractionResponse,
  Defer extends InteractionDefer,
  Interaction extends BaseInteraction<Type, Data>,
  Type extends InteractionType,
  Data,
> {
  reply: (response: Response) => Promise<void>;
  defer: (options: Defer) => Promise<void>;
  interaction: Interaction;
}

enum ResponseState {
  NotReplied,
  Deferred,
  Replied,
}

type GatewayResultResolver = ReturnType<typeof Promise.withResolvers<AnyGatewayResult>>["resolve"];

type DiscordMessage = RESTPostAPIWebhookWithTokenJSONBody;
type DeferFlags = Pick<APIInteractionResponseCallbackData, "flags">;

interface MessageClient<Interaction extends APIUnknownInteraction, Message = DiscordMessage, Defer = DeferFlags> {
  reply: (message: Message) => Promise<void>;
  defer: (flags?: Defer) => Promise<void>;
  edit: (message: Message) => Promise<void>;
  interaction: Interaction;
}

interface ModalClient {
  modal: (modal: APIModalInteractionResponseCallbackData) => Promise<void>;
}

const modalStrategy = ({
  interaction,
  environment,
  resolve,
  currentState,
  setState,
}: {
  interaction: APIUnknownInteraction;
  environment: DiscordEnvironment;
  resolve: GatewayResultResolver;
  currentState: () => ResponseState;
  setState: (state: ResponseState) => unknown;
}) => {
  const { client } = environment.discord;
  return {
    modal: async (modal: APIModalInteractionResponseCallbackData) => {
      const state = currentState();
      switch (state) {
        case ResponseState.NotReplied:
          setState(ResponseState.Replied);
          resolve({ status: 200, body: createModalInteractionResponse(modal) });
          return;
        case ResponseState.Deferred:
          setState(ResponseState.Replied);
          await client.interactions.response.create(
            interaction.id,
            interaction.token,
            createModalInteractionResponse(modal),
          );
          return;
        case ResponseState.Replied:
          logger.warn("Cannot create a modal after an interaction has been replied to");
          return;
        default:
          logger.warn("While trying to respond with a modal, response fell through");
          return;
      }
    },
  };
};

const interactionMessageStrategy = <T extends APIUnknownInteraction>({
  interaction,
  environment,
  resolve,
  currentState,
  setState,
}: {
  interaction: T;
  environment: DiscordEnvironment;
  resolve: GatewayResultResolver;
  currentState: () => ResponseState;
  setState: (state: ResponseState) => unknown;
}): MessageClient<T, APIInteractionResponseCallbackData, DeferFlags> => {
  const { client } = environment.discord;

  return {
    reply: async message => {
      const state = currentState();
      switch (state) {
        case ResponseState.NotReplied:
          setState(ResponseState.Replied);
          resolve({ status: 200, body: createInteractionResponse_ChannelMessage(message) });
          return;
        case ResponseState.Deferred:
          setState(ResponseState.Replied);
          await client.interactions.response.create(
            interaction.id,
            interaction.token,
            createInteractionResponse_ChannelMessage(message),
          );
          return;
        case ResponseState.Replied:
          setState(ResponseState.Replied);
          await client.interactions.response.editOriginal(interaction.token, message);
          return;
        default:
          logger.warn("While replying, the call fell through");
          return;
      }
    },
    defer: async flags => {
      const state = currentState();
      switch (state) {
        case ResponseState.NotReplied:
          setState(ResponseState.Deferred);
          resolve({ status: 200, body: createInteractionResponse_DeferredChannelMessage(flags) });
          return;
        case ResponseState.Deferred:
          logger.warn("Cannot defer message that's already deferred");
          return;
        case ResponseState.Replied:
          logger.warn("Cannot defer message that's already replied to");
          return;
        default:
          logger.warn("While deferring, the call fell through");
          return;
      }
    },
    edit: async message => {
      const state = currentState();
      switch (state) {
        case ResponseState.NotReplied:
          setState(ResponseState.Replied);
          resolve({ status: 200, body: createInteractionResponse_ChannelMessage(message) });
          return;
        case ResponseState.Deferred:
          setState(ResponseState.Replied);
          await client.interactions.response.create(
            interaction.id,
            interaction.token,
            createInteractionResponse_ChannelMessage(message),
          );
          return;
        case ResponseState.Replied:
          setState(ResponseState.Replied);
          await client.interactions.response.editOriginal(interaction.token, message);
          return;
      }
    },
    interaction: interaction,
  };
};

const componentInteractionStrategy = <T extends APIUnknownInteraction>({
  interaction,
  environment,
  resolve,
  currentState,
  setState,
}: {
  interaction: T;
  environment: DiscordEnvironment;
  resolve: GatewayResultResolver;
  currentState: () => ResponseState;
  setState: (state: ResponseState) => unknown;
}): MessageClient<T, APIInteractionResponseCallbackData, DeferFlags> => {
  const { client } = environment.discord;

  return {
    reply: async message => {
      const state = currentState();
      switch (state) {
        case ResponseState.NotReplied:
          setState(ResponseState.Replied);
          resolve({ status: 200, body: createInteractionResponse_UpdateMessage(message) });
          return;
        case ResponseState.Deferred:
          setState(ResponseState.Replied);
          await client.interactions.response.editOriginal(interaction.token, message);
          return;
        case ResponseState.Replied:
          setState(ResponseState.Replied);
          await client.interactions.response.editOriginal(interaction.token, message);
          return;
        default:
          logger.warn("While replying, the call fell through");
          return;
      }
    },
    defer: async (_flags) => {
      const state = currentState();
      switch (state) {
        case ResponseState.NotReplied:
          setState(ResponseState.Deferred);
          resolve({ status: 200, body: createInteractionResponse_DeferredMessageUpdate() });
          return;
        case ResponseState.Deferred:
          logger.warn("Cannot defer message that's already deferred");
          return;
        case ResponseState.Replied:
          logger.warn("Cannot defer message that's already replied to");
          return;
        default:
          logger.warn("While deferring, the call fell through");
          return;
      }
    },
    edit: async message => {
      const state = currentState();
      switch (state) {
        case ResponseState.NotReplied:
          setState(ResponseState.Replied);
          resolve({ status: 200, body: createInteractionResponse_UpdateMessage(message) });
          return;
        case ResponseState.Deferred:
          setState(ResponseState.Replied);
          await client.interactions.response.editOriginal(interaction.token, message);
          return;
        case ResponseState.Replied:
          setState(ResponseState.Replied);
          await client.interactions.response.editOriginal(interaction.token, message);
          return;
      }
    },
    interaction: interaction,
  };
};

const autocompleteStrategy = ({
  interaction,
  resolve,
  currentState,
  setState,
}: {
  interaction: APIApplicationCommandAutocompleteInteraction;
  environment: DiscordEnvironment;
  resolve: GatewayResultResolver;
  currentState: () => ResponseState;
  setState: (state: ResponseState) => unknown;
}): AutocompleteInteractionClient => {
  return {
    reply: async message => {
      const state = currentState();
      switch (state) {
        case ResponseState.NotReplied:
          logger.warn("Throwing the component response as server response");
          logger.warn(JSON.stringify({ status: 200, body: createApplicationCommandResponse_Autocomplete(message) }));
          setState(ResponseState.Replied);
          resolve({ status: 200, body: createApplicationCommandResponse_Autocomplete(message) });
          return;
        case ResponseState.Deferred:
          logger.warn("Replying to a deferred autocomplete is not implemented");
          // setState(ResponseState.Replied);
          // environment.client.interactionFollowup.create(interaction, message);
          return;
        case ResponseState.Replied:
          logger.warn("Editing an autocomplete is not implemented");
          // setState(ResponseState.Replied);
          // environment.client.interactionResponse.update(interaction, message);
          return;
        default:
          logger.warn("While replying, the call fell through");
      }
    },
    defer: async () => {
      const state = currentState();
      switch (state) {
        case ResponseState.NotReplied:
          setState(ResponseState.Deferred);
          resolve({ status: 200, body: createInteractionResponse_DeferredMessageUpdate() });
          return;
        case ResponseState.Deferred:
          logger.warn("Cannot defer message that's already deferred");
          return;
        case ResponseState.Replied:
          logger.warn("Cannot defer message that's already replied to");
          return;
        default:
          logger.warn("While deferring, the call fell through");
          return;
      }
    },
    edit: async () => {
      logger.warn("Cannot edit an autocomplete interaction");
    },
    interaction: interaction,
  };
};

export type ApplicationInteractionClient = MessageClient<
  APIChatInputApplicationCommandInteraction,
  APIInteractionResponseCallbackData
> &
  ModalClient;
export type ContextMenuInteractionClient = MessageClient<
  APIContextMenuInteraction,
  APIInteractionResponseCallbackData
> &
  ModalClient;
export type AutocompleteInteractionClient = MessageClient<
  APIApplicationCommandAutocompleteInteraction,
  APICommandAutocompleteInteractionResponseCallbackData,
  undefined
>;
export type ComponentInteractionClient = MessageClient<
  APIMessageComponentInteraction,
  APIInteractionResponseCallbackData
> &
  ModalClient;
export type ModalInteractionClient = MessageClient<APIModalSubmitInteraction, APIInteractionResponseCallbackData>;

const selectDeferCreator = (interaction: APIUnknownInteraction) => {
  if (
    isAutocompleteInteraction(interaction) ||
    isApplicationInteraction(interaction) ||
    isContextMenuInteraction(interaction)
  ) {
    return createInteractionResponse_DeferredChannelMessage;
  }

  if (isComponentInteraction(interaction) || isModalInteraction(interaction)) {
    return createInteractionResponse_DeferredMessageUpdate;
  }

  throw new Error("No defer method for this interaction");
};

export const dispatchInteractionResponseClient = (
  resolve: GatewayResultResolver,
  interaction: APIUnknownInteraction,
  environment: DiscordEnvironment,
  rabs: Rabscuttle,
) => {
  if (isPingInteraction(interaction)) {
    logger.silly("Interaction is PING, responding with PONG");
    resolve({ status: 200, body: createInteractionResponse_Pong() });
    return;
  }

  const deferCreator = selectDeferCreator(interaction);
  const interactionName = getInteractionName(interaction);
  const interactionType = getInteractionTypeName(interaction);
  let responseState = ResponseState.NotReplied;
  const intervalHandle = setTimeout(() => {
    // just in case, if the handle has not been cancelled
    if (responseState === ResponseState.NotReplied) {
      return;
    }
    responseState = ResponseState.Deferred;
    logger.info(
      `An interaction for '${interactionType} ${interactionName}' took more than ${GatewayTimeout}ms, deferring response`,
    );
    resolve({ status: 200, body: deferCreator() });
  });

  const currentState = () => responseState;
  const setState = (state: ResponseState) => {
    if (state !== ResponseState.NotReplied) {
      clearTimeout(intervalHandle);
    }
    responseState = state;
  };

  if (isApplicationInteraction(interaction)) {
    const message = interactionMessageStrategy({ interaction, environment, resolve, currentState, setState });
    const modal = modalStrategy({ interaction, environment, resolve, currentState, setState });
    const command = rabs.interactions[interactionName];
    if (!command) {
      logger.warn(`An interaction '${interaction.id}' (command name: '${interaction.data.name}') has no plugin`);
      message.reply({ content: "Unknown interaction command, sorry.", flags: MessageFlags.Ephemeral });
      return;
    }
    tryInvoke(() => {
      logger.debug(`Invoking interaction '${interaction.id}' against plugin with name '${command.name}'`);
      command.onNewInteraction({ ...message, ...modal }, environment);
    });
    return;
  }

  if (isContextMenuInteraction(interaction)) {
    const message = interactionMessageStrategy({ interaction, environment, resolve, currentState, setState });
    const modal = modalStrategy({ interaction, environment, resolve, currentState, setState });
    const command = rabs.contextMenu[interactionName];
    if (!command) {
      logger.warn(
        `A context menu interaction '${interaction.id}' (command name: '${interaction.data.name}') has no plugin`,
      );
      message.reply({ content: "Unknown context manu interaction, sorry.", flags: MessageFlags.Ephemeral });
      return;
    }
    tryInvoke(() => {
      logger.debug(`Invoking context menu interaction '${interaction.id}' against plugin with name '${command.name}'`);
      command.onNewContextAction({ ...message, ...modal }, environment);
    });
    return;
  }

  if (isAutocompleteInteraction(interaction)) {
    const message = autocompleteStrategy({ interaction, environment, resolve, currentState, setState });
    const command = rabs.autocompletes[interactionName];
    if (!command) {
      logger.warn(
        `A autocomplete interaction '${interaction.id}' (from command name: '${interaction.data.name}') has no plugin`,
      );
      message.reply({});
      return;
    }
    tryInvoke(() => {
      logger.debug(`Invoking autocomplete interaction '${interaction.id}' against plugin with name '${command.name}'`);
      command.onAutoComplete(message, environment);
    });
    return;
  }

  if (isComponentInteraction(interaction)) {
    const message = componentInteractionStrategy({ interaction, environment, resolve, currentState, setState });
    const modal = modalStrategy({ interaction, environment, resolve, currentState, setState });
    const componentId = interaction.data.custom_id;
    const plugins = rabs.components.filter(x => x.publishedComponentIds.includes(componentId));
    if (plugins.length <= 0) {
      logger.warn(
        `No plugin has a component registered for interaction '${interaction.id}' (component name: '${componentId}')`,
      );
      // returning here the message should just do a non-edit and end the interaction
      message.reply(interaction.message);
      return;
    }
    tryInvoke(() => {
      logger.debug(
        `Invoking component interaction '${interaction.id}' (component name: ${componentId}) against plugin${
          plugins.length > 1 ? "s" : ""
        }: [${plugins.map(x => x.name).join(", ")}]`,
      );
      plugins.forEach(x => x.onNewButtonClick({ ...message, ...modal }, environment));
    });
    return;
  }

  if (isModalInteraction(interaction)) {
    const message = interactionMessageStrategy({ interaction, environment, resolve, currentState, setState });
    const modalId = interaction.data.custom_id;
    const plugins = rabs.modals.filter(x => x.publishedModalIds.includes(modalId));
    if (plugins.length <= 0) {
      logger.warn(`No plugin has a modal registered for interaction '${interaction.id}' (modal name: '${modalId}')`);
      // returning here the message should just do a non-edit and end the interaction
      message.reply({});
      return;
    }
    tryInvoke(() => {
      logger.debug(
        `Invoking modal interaction '${interaction.id}' (modal name: ${modalId}) against plugin${
          plugins.length > 1 ? "s" : ""
        }: [${plugins.map(x => x.name).join(", ")}]`,
      );
      plugins.forEach(x => x.onModalSubmit(message, environment));
    });
    return;
  }

  logger.warn(
    `An interaction '${interaction.id}' (${interactionType} / ${interactionName}) fell through all types and handlers. This should not have happened.`,
  );
  resolve({ status: 400 });
};
