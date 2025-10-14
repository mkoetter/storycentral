import mongoose, { Schema, Model, Document } from 'mongoose'

/**
 * Journalist type definition
 */
export interface IJournalist {
  name: string
  email: string
  role: string
}

/**
 * Source type definition
 */
export interface ISource {
  name: string
  contact: string
  notes: string
}

/**
 * Timeline event type definition
 */
export interface ITimelineEvent {
  date: Date
  event: string
  description: string
}

/**
 * Attachment type definition
 */
export interface IAttachment {
  filename: string
  url: string
  type: string
}

/**
 * Story document interface
 */
export interface IStory extends Document {
  title: string
  slug: string
  description: string
  status: 'draft' | 'active' | 'archived' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  tags: string[]
  journalists: IJournalist[]
  sources: ISource[]
  timeline: ITimelineEvent[]
  notes: string
  attachments: IAttachment[]
  publishedAt?: Date
  deadline?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Story schema definition
 */
const StorySchema = new Schema<IStory>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this story'],
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived', 'completed'],
      default: 'draft',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    category: {
      type: String,
      default: 'General',
    },
    tags: [
      {
        type: String,
      },
    ],
    journalists: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: { type: String, default: 'Reporter' },
      },
    ],
    sources: [
      {
        name: { type: String, required: true },
        contact: { type: String },
        notes: { type: String },
      },
    ],
    timeline: [
      {
        date: { type: Date, required: true },
        event: { type: String, required: true },
        description: { type: String },
      },
    ],
    notes: {
      type: String,
    },
    attachments: [
      {
        filename: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String },
      },
    ],
    publishedAt: {
      type: Date,
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

/**
 * Create slug from title before saving
 */
StorySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
  }
  next()
})

/**
 * Story model
 * Uses singleton pattern to prevent model recompilation during hot reloads
 */
const Story: Model<IStory> =
  mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema)

export default Story
