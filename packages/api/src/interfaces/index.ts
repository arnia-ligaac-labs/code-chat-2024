export type TMessage = {
  readonly id: string;
  readonly timestamp: string;
  readonly message: string;
}

export type TConversation = {
  readonly id: string;
  readonly timestamp: string;
  readonly title?: string; 
  readonly messages?: TMessage[];
}