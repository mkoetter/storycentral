'use client'

import { useState, useEffect } from 'react'
import StoryCard from '@/components/StoryCard'
import StoryFilters, { FilterValues } from '@/components/StoryFilters'
import { IStory } from '@/lib/models/Story'

/**
 * Stories list page
 * Displays all stories with filtering and search capabilities
 */
export default function StoriesPage() {
  const [stories, setStories] = useState<IStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    status: '',
    priority: '',
    category: '',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  })

  /**
   * Fetches stories from the API with current filters
   */
  const fetchStories = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.category) params.append('category', filters.category)
      params.append('page', pagination.page.toString())
      params.append('limit', pagination.limit.toString())

      const response = await fetch(`/api/stories?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch stories')
      }

      const data = await response.json()

      if (data.success) {
        setStories(data.data)
        setPagination(data.pagination)
      } else {
        throw new Error(data.error || 'Failed to fetch stories')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching stories')
      console.error('Error fetching stories:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch stories on component mount and when filters change
  useEffect(() => {
    fetchStories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page])

  /**
   * Handles filter changes from StoryFilters component
   */
  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters)
    setPagination((prev) => ({ ...prev, page: 1 })) // Reset to page 1 on filter change
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Stories</h1>
        <p className="text-gray-600">
          Track and manage your team&apos;s storylines and investigations
        </p>
      </div>

      <StoryFilters onFilterChange={handleFilterChange} />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error loading stories</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && stories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No stories found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new story.
          </p>
          <div className="mt-6">
            <a
              href="/stories/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create New Story
            </a>
          </div>
        </div>
      )}

      {/* Stories Grid */}
      {!loading && !error && stories.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {stories.map((story) => (
              <StoryCard key={String(story._id)} story={story} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(pagination.pages, prev.page + 1),
                  }))
                }
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
