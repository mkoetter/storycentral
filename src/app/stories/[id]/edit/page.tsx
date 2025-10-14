import { notFound } from 'next/navigation'
import StoryForm from '@/components/StoryForm'
import dbConnect from '@/lib/db'
import Story from '@/lib/models/Story'
import mongoose from 'mongoose'

interface EditStoryPageProps {
  params: {
    id: string
  }
}

/**
 * Edit story page
 * Displays form for editing an existing story
 */
export default async function EditStoryPage({ params }: EditStoryPageProps) {
  const { id } = params

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound()
  }

  try {
    await dbConnect()

    const story = await Story.findById(id).lean()

    if (!story) {
      notFound()
    }

    // Convert MongoDB document to plain object
    const storyData = JSON.parse(JSON.stringify(story))

    return <StoryForm story={storyData} isEdit={true} />
  } catch (error) {
    console.error('Error fetching story:', error)
    notFound()
  }
}
