import { APIApplicationCommandAutocompleteResponse, APIInteractionResponse, APIInteractionResponseCallbackData, InteractionResponseType, APIInteractionResponseChannelMessageWithSource, APIInteractionResponseDeferredChannelMessageWithSource, APIInteractionResponsePong, APICommandAutocompleteInteractionResponseCallbackData, APIModalInteractionResponseCallbackData, APIModalInteractionResponse, APIPremiumRequiredInteractionResponse, APIInteractionResponseDeferredMessageUpdate, APIInteractionResponseUpdateMessage } from "discord-api-types/v10";

export const createInteractionResponse_Pong = (): APIInteractionResponsePong =>
    ({ type: InteractionResponseType.Pong });
export const createApplicationCommandResponse_Autocomplete = (data: APICommandAutocompleteInteractionResponseCallbackData): APIApplicationCommandAutocompleteResponse =>
    ({ type: InteractionResponseType.ApplicationCommandAutocompleteResult, data: data });
export const createModalInteractionResponse = (data: APIModalInteractionResponseCallbackData): APIModalInteractionResponse =>
    ({ type: InteractionResponseType.Modal, data: data });
export const createInteractionResponse_PremiumRequired = (): APIPremiumRequiredInteractionResponse =>
    ({ type: InteractionResponseType.PremiumRequired });
export const createInteractionResponse_ChannelMessage = (data: APIInteractionResponseCallbackData): APIInteractionResponseChannelMessageWithSource =>
    ({ type: InteractionResponseType.ChannelMessageWithSource, data: data });
export const createInteractionResponse_DeferredChannelMessage = (data?: Pick<APIInteractionResponseCallbackData, 'flags'>): APIInteractionResponseDeferredChannelMessageWithSource =>
    ({ type: InteractionResponseType.DeferredChannelMessageWithSource, data: data })
export const createInteractionResponse_DeferredMessageUpdate = (): APIInteractionResponseDeferredMessageUpdate =>
    ({ type: InteractionResponseType.DeferredMessageUpdate });
export const createInteractionResponse_UpdateMessage = (data?: APIInteractionResponseCallbackData): APIInteractionResponseUpdateMessage =>
    ({ type: InteractionResponseType.UpdateMessage, data: data });
