import { Connection, connection, Document, Schema } from 'mongoose';
import { ConversationActivity } from '../models/ConversationActivity';
import CRUDRepository from 'lexica-dialog-repository/dist/CRUDRepository';

const schema = new Schema({
  seen: {
    required: true,
    type: Date,
  },
  senderInfoId: {
    required: true,
    type: String,
  },
  suggestedAnswerClick: {
    required: false,
    type: Number,
  },
  userId: {
    required: true,
    type: String,
  },
});

schema.index({ userId: 1, senderInfoId: 1 }, { unique: true });

interface ConversationActivityModel extends ConversationActivity, Document { }

class ConversationActivityRepository
  extends CRUDRepository<ConversationActivity, ConversationActivityModel> {

  constructor(connection: Connection) {
    super(connection.model<ConversationActivityModel>(
      'ConversationActivity',
      schema,
      'ConversationActivities',
    ));
  }

  public async findOneByUserIdAndSenderInfoId(userId: string, senderInfoId: string) {
    return this.model.findOne({ userId, senderInfoId });
  }

}

const conversationActivityRepository = new ConversationActivityRepository(connection);

export {
  ConversationActivityModel,
  ConversationActivityRepository,
  conversationActivityRepository,
};
