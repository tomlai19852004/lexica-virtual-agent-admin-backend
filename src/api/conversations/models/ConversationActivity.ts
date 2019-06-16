export interface ConversationActivity {
  userId: string;
  senderInfoId: string;
  seen: Date;
  suggestedAnswerClick?: number;
}
