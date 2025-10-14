'use client'

import Link from 'next/link'
import { IStory } from '@/lib/models/Story'

interface StoryCardProps {
  story: IStory
}

/**
 * StoryCard component
 * Displays a single story in card format with key information
 */
export default function StoryCard({ story }: StoryCardProps) {
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isOverdue = story.deadline && new Date(story.deadline) < new Date()

  return (
    <Link href={`/stories/${story._id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 flex-1">
            {story.title}
          </h3>
          <div className="flex gap-2 ml-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                priorityColors[story.priority]
              }`}
            >
              {story.priority}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[story.status]
              }`}
            >
              {story.status}
            </span>
          </div>
        </div>

        {story.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {story.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {story.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
          {story.tags?.length > 3 && (
            <span className="text-gray-500 text-xs">
              +{story.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            {story.category && (
              <span className="flex items-center">
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                {story.category}
              </span>
            )}
            {story.journalists && story.journalists.length > 0 && (
              <span className="flex items-center">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {story.journalists.length} journalist
                {story.journalists.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {story.deadline && (
            <span
              className={`flex items-center ${
                isOverdue ? 'text-red-600 font-medium' : ''
              }`}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(story.deadline)}
              {isOverdue && ' (Overdue)'}
            </span>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
          Updated {formatDate(story.updatedAt)}
        </div>
      </div>
    </Link>
  )
}
