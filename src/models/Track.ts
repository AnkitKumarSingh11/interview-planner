import mongoose, { Schema, Model } from 'mongoose';

const QuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    url: { type: String },
    notes: { type: String },
    custom: { type: Boolean, default: false },
    status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved' },
    submittedAt: { type: String },
  },
  { _id: false }
);

const SubsectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    questions: [QuestionSchema],
  },
  { _id: false }
);

const SectionSchema = new Schema(
  {
    id: { type: String, required: true },
    topic: { type: String, required: true },
    sectionTitle: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    originalWeightDays: { type: Number, default: 7 },
    subsections: [SubsectionSchema],
  },
  { _id: false }
);

const TrackSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    roadmapStartDate: { type: String },
    targetDays: { type: Number, default: 90 },
    sections: [SectionSchema],
  },
  { timestamps: true }
);

export const TrackModel: Model<any> =
  mongoose.models.Track || mongoose.model('Track', TrackSchema);
