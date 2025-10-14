import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Story from '@/lib/models/Story'
import mongoose from 'mongoose'

/**
 * GET /api/stories/[id]
 * Retrieves a single story by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const { id } = params

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid story ID' },
        { status: 400 }
      )
    }

    const story = await Story.findById(id).lean()

    if (!story) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: story,
    })
  } catch (error) {
    console.error('Error fetching story:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch story' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/stories/[id]
 * Updates a story by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const { id } = params

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid story ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Update story
    const story = await Story.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!story) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: story,
    })
  } catch (error: any) {
    console.error('Error updating story:', error)

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update story' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/stories/[id]
 * Deletes a story by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const { id } = params

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid story ID' },
        { status: 400 }
      )
    }

    const story = await Story.findByIdAndDelete(id)

    if (!story) {
      return NextResponse.json(
        { success: false, error: 'Story not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Story deleted successfully' },
    })
  } catch (error) {
    console.error('Error deleting story:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete story' },
      { status: 500 }
    )
  }
}
