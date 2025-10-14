import { notFound } from 'next/navigation'
import StoryDetails from '@/components/StoryDetails'
import dbConnect from '@/lib/db'
import Story from '@/lib/models/Story'
import mongoose from 'mongoose'

interface StoryPageProps {
  params: {
    id: string
  }
}

/**
 * Story detail page
 * Displays full information about a single story
 */
export default async function StoryPage({ params }: StoryPageProps) {
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

    return <StoryDetails story={storyData} />
  } catch (error) {
    console.error('Error fetching story:', error)
    notFound()
  }
}
