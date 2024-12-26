import { type DiscordMessageFlag, InteractionResponseTypes } from "@discordeno/types"
import type {
  ApplicationCommandAutocompleteResultData,
  ApplicationCommandAutocompleteResultResponse,
  ChannelMessageWithSourceResponse,
  ChannelMessageWithSourceResponseData,
  DeferredChannelMessageWithSourceResponse,
  DeferredUpdateMessageResponse,
  ModalResponse,
  ModalResponseData,
  PongInteractionResponse,
  PremiumRequiredResponse,
  UpdateMessageResponse,
  UpdateMessageResponseData,
} from "./types"

export const createInteractionResponse_Pong = (): PongInteractionResponse => ({
  type: InteractionResponseTypes.Pong,
})
export const createInteractionResponse_Autocomplete = (
  data: ApplicationCommandAutocompleteResultData,
): ApplicationCommandAutocompleteResultResponse => ({
  type: InteractionResponseTypes.ApplicationCommandAutocompleteResult,
  data: data,
})
export const createInteractionResponse_Modal = (data: ModalResponseData): ModalResponse => ({
  type: InteractionResponseTypes.Modal,
  data: data,
})
export const createInteractionResponse_PremiumRequired = (): PremiumRequiredResponse => ({
  type: InteractionResponseTypes.PremiumRequired,
})
export const createInteractionResponse_ChannelMessage = (
  data: ChannelMessageWithSourceResponseData,
): ChannelMessageWithSourceResponse => ({
  type: InteractionResponseTypes.ChannelMessageWithSource,
  data: data,
})
export const createInteractionResponse_DeferredChannelMessage = (
  flags?: DiscordMessageFlag.Ephemeral,
): DeferredChannelMessageWithSourceResponse => ({
  type: InteractionResponseTypes.DeferredChannelMessageWithSource,
  data: { flags: flags },
})
export const createInteractionResponse_DeferredMessageUpdate = (): DeferredUpdateMessageResponse => ({
  type: InteractionResponseTypes.DeferredUpdateMessage,
})
export const createInteractionResponse_UpdateMessage = (data: UpdateMessageResponseData): UpdateMessageResponse => ({
  type: InteractionResponseTypes.UpdateMessage,
  data: data,
})
