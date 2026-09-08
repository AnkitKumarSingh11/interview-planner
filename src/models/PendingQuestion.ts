import mongoose, { Schema, Model } from 'mongoose';

const PendingQuestionSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    trackId: { type: String, required: true },
    trackTitle: { type: String },
    sectionId: { type: String },
    parentTopic: { type: String, required: true },
    subsectionId: { type: String },
    subsectionTitle: { type: String, required: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    url: { type: String },
    notes: { type: String },
    submittedAt: { type: String, required: true },
  },
  { timestamps: true }
);

export const PendingQuestionModel: Model<any> =
  mongoose.models.PendingQuestion || mongoose.model('PendingQuestion', PendingQuestionSchema);
