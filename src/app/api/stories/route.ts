import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Story from '@/lib/models/Story'

/**
 * GET /api/stories
 * Retrieves all stories with optional filtering and pagination
 *
 * Query parameters:
 * - status: Filter by status (draft, active, archived, completed)
 * - priority: Filter by priority (low, medium, high, urgent)
 * - category: Filter by category
 * - search: Search in title and description
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build query object
    const query: any = {}

    if (status) {
      query.status = status
    }

    if (priority) {
      query.priority = priority
    }

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ]
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Fetch stories with pagination
    const stories = await Story.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Story.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: stories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching stories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stories' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/stories
 * Creates a new story
 *
 * Request body should include story fields (title is required)
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()

    // Create new story
    const story = await Story.create(body)

    return NextResponse.json(
      {
        success: true,
        data: story,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating story:', error)

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

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'A story with this slug already exists',
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create story' },
      { status: 500 }
    )
  }
}
