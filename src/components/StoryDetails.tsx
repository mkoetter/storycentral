'use client'

import { IStory } from '@/lib/models/Story'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface StoryDetailsProps {
  story: IStory
}

/**
 * StoryDetails component
 * Displays detailed information about a single story
 */
export default function StoryDetails({ story }: StoryDetailsProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    archived: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-purple-100 text-purple-700',
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDateShort = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  /**
   * Handles story deletion
   */
  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this story? This action cannot be undone.'
      )
    ) {
      return
    }

    try {
      setDeleting(true)
      const response = await fetch(`/api/stories/${story._id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete story')
      }

      router.push('/stories')
    } catch (error) {
      console.error('Error deleting story:', error)
      alert('Failed to delete story. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/stories"
          className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Stories
        </Link>

        <div className="flex justify-between items-start mt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {story.title}
            </h1>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  priorityColors[story.priority]
                }`}
              >
                {story.priority}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[story.status]
                }`}
              >
                {story.status}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/stories/${story._id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {story.description && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {story.description}
              </p>
            </div>
          )}

          {/* Notes */}
          {story.notes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Notes
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{story.notes}</p>
            </div>
          )}

          {/* Timeline */}
          {story.timeline && story.timeline.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Timeline
              </h2>
              <div className="space-y-4">
                {story.timeline
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-24 text-sm text-gray-500">
                        {formatDateShort(event.date)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {event.event}
                        </h3>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {story.sources && story.sources.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Sources
              </h2>
              <div className="space-y-4">
                {story.sources.map((source, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-medium text-gray-900">{source.name}</h3>
                    {source.contact && (
                      <p className="text-sm text-gray-600">{source.contact}</p>
                    )}
                    {source.notes && (
                      <p className="text-sm text-gray-700 mt-2">
                        {source.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Details
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Category</dt>
                <dd className="text-gray-900 font-medium">
                  {story.category || 'None'}
                </dd>
              </div>
              {story.deadline && (
                <div>
                  <dt className="text-gray-500">Deadline</dt>
                  <dd className="text-gray-900 font-medium">
                    {formatDateShort(story.deadline)}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900">{formatDate(story.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="text-gray-900">{formatDate(story.updatedAt)}</dd>
              </div>
              {story.publishedAt && (
                <div>
                  <dt className="text-gray-500">Published</dt>
                  <dd className="text-gray-900">
                    {formatDate(story.publishedAt)}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Journalists */}
          {story.journalists && story.journalists.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Team
              </h2>
              <div className="space-y-3">
                {story.journalists.map((journalist, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900">
                      {journalist.name}
                    </h3>
                    <p className="text-sm text-gray-600">{journalist.email}</p>
                    <p className="text-xs text-gray-500">{journalist.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {story.attachments && story.attachments.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Attachments
              </h2>
              <div className="space-y-2">
                {story.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    {attachment.filename}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
