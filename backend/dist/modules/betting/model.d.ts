import { Document, Model, Types } from 'mongoose';
export interface BetDocument extends Document {
    sessionId: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    outcome: 'win' | 'loss' | 'pending';
    settledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BetModel: Model<BetDocument>;
//# sourceMappingURL=model.d.ts.map