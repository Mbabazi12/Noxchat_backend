import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface BetDocument extends Document {
  sessionId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  outcome: 'win' | 'loss' | 'pending';
  settledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BetSchema = new Schema<BetDocument>({
  sessionId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  amount: { type: Number, required: true, min: 1, max: 50 },
  outcome: { type: String, required: true, enum: ['win', 'loss', 'pending'] },
  settledAt: { type: Date },
}, {
  timestamps: true,
});

BetSchema.index({ userId: 1, createdAt: -1 });

export const BetModel: Model<BetDocument> = mongoose.models.Bet || mongoose.model<BetDocument>('Bet', BetSchema);
