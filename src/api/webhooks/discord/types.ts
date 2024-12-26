import type {
  ApplicationCommandTypes,
  CamelizedDiscordInteractionData,
  CamelizedDiscordInteraction as DenoDiscordInteration,
  InteractionResponse as DenoInteractionResponse,
  DiscordMessageFlag,
  InteractionCallbackData,
  InteractionResponseTypes,
  InteractionTypes,
} from "@discordeno/types"
import type { MessageComponents } from "@discordeno/types/dist/types/discordeno"
//
// Helpers
//
//
type NeverBrand = { __neverBrand: never }
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

//
// interaction definitions & their respective payload data type
//
//

export type UnknownInteraction = Omit<DenoDiscordInteration, "data" | "components"> & {
  components?: MessageComponents | undefined
}
export type BaseInteraction<Type extends InteractionTypes, Data> = Omit<UnknownInteraction, "data" | "components"> &
  (Data extends NeverBrand ? { type: Type } : { type: Type; data: Data })

export type Interaction =
  | PingInteraction
  | ApplicationCommandAutocompleteInteraction
  | ChatInputApplicationCommandInteraction
  | UserContextMenuApplicationCommandInteraction
  | MessageContextMenuApplicationCommandInteraction
  | ModalSubmitInteraction
  | MessageComponentInteraction

export type PingInteractionData = never
export type PingInteraction = BaseInteraction<InteractionTypes.Ping, NeverBrand>

export type ApplicationCommandInteractionData = WithRequired<
  Pick<
    CamelizedDiscordInteractionData,
    "id" | "name" | "type" | "resolved" | "options" | "guildId" | "targetId" | "options"
  >,
  "options"
>
export type ApplicationCommandInteraction = BaseInteraction<
  InteractionTypes.ApplicationCommand,
  ApplicationCommandInteractionData
>

export type ChatInputApplicationCommandInteraction = ApplicationCommandInteraction & {
  data: { type: ApplicationCommandTypes.ChatInput }
}

export type UserContextMenuApplicationCommandInteraction = WithRequired<
  ApplicationCommandInteraction & {
    data: { type: ApplicationCommandTypes.User }
  },
  "user"
>

export type MessageContextMenuApplicationCommandInteraction = WithRequired<
  ApplicationCommandInteraction & {
    data: { type: ApplicationCommandTypes.Message }
  },
  "message"
>

export type ContextMenuApplicationCommandInteraction =
  | UserContextMenuApplicationCommandInteraction
  | MessageContextMenuApplicationCommandInteraction

export type ApplicationCommandAutocompleteInteractionData = ApplicationCommandInteractionData
export type ApplicationCommandAutocompleteInteraction = BaseInteraction<
  InteractionTypes.ApplicationCommandAutocomplete,
  ApplicationCommandAutocompleteInteractionData
>

export type ModalSubmitInteractionData = Required<Pick<CamelizedDiscordInteractionData, "customId" | "components">>
export type ModalSubmitInteraction = BaseInteraction<InteractionTypes.ModalSubmit, ModalSubmitInteractionData>

export type MessageComponentInteractionData = WithRequired<
  Pick<CamelizedDiscordInteractionData, "customId" | "componentType" | "values" | "resolved">,
  "customId" | "componentType"
>

type MessageComponentInteractionInternal = BaseInteraction<
  InteractionTypes.MessageComponent,
  MessageComponentInteractionData
>
export type MessageComponentInteraction = WithRequired<MessageComponentInteractionInternal, "message">

//
// interaction response type
//
//

export type BaseInteractionResponse<
  Type extends InteractionResponseTypes,
  Data,
  // biome-ignore lint/complexity/noBannedTypes: irrlevant
> = Omit<UnknownInteractionResponse, "data"> & (Data extends NeverBrand ? {} : { type: Type; data: Data })

export type InteractionResponse =
  | PongInteractionResponse
  | ChannelMessageWithSourceResponse
  | DeferredChannelMessageWithSourceResponse
  | DeferredUpdateMessageResponse
  | UpdateMessageResponse
  | ApplicationCommandAutocompleteResultResponse
  | ModalResponse
  | PremiumRequiredResponse

export type UnknownInteractionResponse = DenoInteractionResponse

export type PongInteractionResponseData = never
export type PongInteractionResponse = BaseInteractionResponse<InteractionResponseTypes.Pong, NeverBrand>

export type ChannelMessageWithSourceResponseData = Pick<
  InteractionCallbackData,
  "tts" | "content" | "embeds" | "allowedMentions" | "flags" | "components" | "files"
>

export type ChannelMessageWithSourceResponse = BaseInteractionResponse<
  InteractionResponseTypes.ChannelMessageWithSource,
  ChannelMessageWithSourceResponseData
>

export type DeferredChannelMessageWithSourceResponseData = never
export type DeferredChannelMessageWithSourceResponse = BaseInteractionResponse<
  InteractionResponseTypes.DeferredChannelMessageWithSource,
  { flags?: DiscordMessageFlag.Ephemeral }
>

export type DeferredUpdateMessageResponseData = never
export type DeferredUpdateMessageResponse = BaseInteractionResponse<
  InteractionResponseTypes.DeferredUpdateMessage,
  NeverBrand
>

export type UpdateMessageResponseData = Pick<
  InteractionCallbackData,
  "tts" | "content" | "embeds" | "allowedMentions" | "flags" | "components"
>
export type UpdateMessageResponse = BaseInteractionResponse<
  InteractionResponseTypes.UpdateMessage,
  UpdateMessageResponseData
>

export type ApplicationCommandAutocompleteResultData = Required<Pick<InteractionCallbackData, "choices">>
export type ApplicationCommandAutocompleteResultResponse = BaseInteractionResponse<
  InteractionResponseTypes.ApplicationCommandAutocompleteResult,
  ApplicationCommandAutocompleteResultData
>

export type ModalResponseData = Required<Pick<InteractionCallbackData, "title" | "customId" | "components">>
export type ModalResponse = BaseInteractionResponse<InteractionResponseTypes.Modal, ModalResponseData>

export type PremiumRequiredResponseData = never
export type PremiumRequiredResponse = BaseInteractionResponse<InteractionResponseTypes.PremiumRequired, NeverBrand>

//
// Helpers to select correct response based on Interaction
//
//
export type InteractionResponseSelector<I extends Interaction> = I extends PingInteraction
  ? ValidPingInteractionResponse
  : I extends
        | ChatInputApplicationCommandInteraction
        | UserContextMenuApplicationCommandInteraction
        | MessageContextMenuApplicationCommandInteraction
    ? ValidApplicationCommandInteractionResponse
    : I extends ModalSubmitInteraction
      ? ValidModalInteractionResponse
      : I extends MessageComponentInteraction
        ? ValidMessageComponentInteractionResponse
        : I extends ApplicationCommandAutocompleteInteraction
          ? ValidAutocompleteInteractionResponse
          : never
export type InteractionFollowupSelector<I extends Interaction> = I extends PingInteraction
  ? ValidPingInteractionFollowup
  : I extends
        | ChatInputApplicationCommandInteraction
        | UserContextMenuApplicationCommandInteraction
        | MessageContextMenuApplicationCommandInteraction
    ? ValidApplicationCommandInteractionFollowup
    : I extends ModalSubmitInteraction
      ? ValidModalInteractionFollowup
      : I extends MessageComponentInteraction
        ? ValidMessageComponentInteractionFollowup
        : I extends ApplicationCommandAutocompleteInteraction
          ? ValidAutocompleteInteractionFollowup
          : never

export type InteractionDeferSelector<I extends Interaction> = I extends PingInteraction
  ? ValidPingInteractionDefer
  : I extends
        | ChatInputApplicationCommandInteraction
        | UserContextMenuApplicationCommandInteraction
        | MessageContextMenuApplicationCommandInteraction
    ? ValidApplicationCommandInteractionDefer
    : I extends ModalSubmitInteraction
      ? ValidModalInteractionDefer
      : I extends MessageComponentInteraction
        ? ValidMessageComponentInteractionDefer
        : I extends ApplicationCommandAutocompleteInteraction
          ? ValidAutocompleteInteractionDefer
          : never

//
// Helpers to select possible responses to a message
//
//
export type ValidPingInteractionResponse = PongInteractionResponse
export type ValidMessageComponentInteractionResponse = ApplicationCommandAutocompleteResultResponse
export type ValidApplicationCommandInteractionResponse =
  | ChannelMessageWithSourceResponse
  | DeferredChannelMessageWithSourceResponse
  | ModalResponse
  | PremiumRequiredResponse
export type ValidModalInteractionResponse =
  | UpdateMessageResponse
  | DeferredUpdateMessageResponse
  | PremiumRequiredResponse
export type ValidAutocompleteInteractionResponse = ApplicationCommandAutocompleteResultResponse

//
// Helpers to select possible followups _after_ deferring a message
//
//
export type ValidPingInteractionFollowup = never
export type ValidMessageComponentInteractionFollowup = never
export type ValidApplicationCommandInteractionFollowup =
  | ChannelMessageWithSourceResponse
  | ModalResponse
  | PremiumRequiredResponse
export type ValidModalInteractionFollowup = UpdateMessageResponse | PremiumRequiredResponse
export type ValidAutocompleteInteractionFollowup = never

//
// Helpers to select possible defer responses to a message
//
//
export type ValidPingInteractionDefer = never
export type ValidMessageComponentInteractionDefer = DeferredUpdateMessageResponse
export type ValidApplicationCommandInteractionDefer = DeferredChannelMessageWithSourceResponse
export type ValidModalInteractionDefer = DeferredUpdateMessageResponse
export type ValidAutocompleteInteractionDefer = never
