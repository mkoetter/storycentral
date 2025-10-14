'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { IStory, IJournalist, ISource, ITimelineEvent } from '@/lib/models/Story'

interface StoryFormProps {
  story?: IStory
  isEdit?: boolean
}

/**
 * StoryForm component
 * Form for creating and editing stories
 */
export default function StoryForm({ story, isEdit = false }: StoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: story?.title || '',
    description: story?.description || '',
    status: (story?.status || 'draft') as 'draft' | 'active' | 'archived' | 'completed',
    priority: (story?.priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
    category: story?.category || '',
    tags: story?.tags?.join(', ') || '',
    notes: story?.notes || '',
    deadline: story?.deadline
      ? new Date(story.deadline).toISOString().split('T')[0]
      : '',
  })

  const [journalists, setJournalists] = useState<IJournalist[]>(
    story?.journalists || []
  )
  const [sources, setSources] = useState<ISource[]>(story?.sources || [])
  const [timeline, setTimeline] = useState<ITimelineEvent[]>(
    story?.timeline || []
  )

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        journalists,
        sources,
        timeline,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      }

      const url = isEdit ? `/api/stories/${story?._id}` : '/api/stories'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save story')
      }

      const data = await response.json()
      router.push(`/stories/${data.data._id}`)
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the story')
      setLoading(false)
    }
  }

  /**
   * Add a new journalist
   */
  const addJournalist = () => {
    setJournalists([...journalists, { name: '', email: '', role: 'Reporter' }])
  }

  /**
   * Remove a journalist
   */
  const removeJournalist = (index: number) => {
    setJournalists(journalists.filter((_, i) => i !== index))
  }

  /**
   * Update journalist field
   */
  const updateJournalist = (
    index: number,
    field: keyof IJournalist,
    value: string
  ) => {
    const updated = [...journalists]
    updated[index] = { ...updated[index], [field]: value }
    setJournalists(updated)
  }

  /**
   * Add a new source
   */
  const addSource = () => {
    setSources([...sources, { name: '', contact: '', notes: '' }])
  }

  /**
   * Remove a source
   */
  const removeSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index))
  }

  /**
   * Update source field
   */
  const updateSource = (index: number, field: keyof ISource, value: string) => {
    const updated = [...sources]
    updated[index] = { ...updated[index], [field]: value }
    setSources(updated)
  }

  /**
   * Add a new timeline event
   */
  const addTimelineEvent = () => {
    setTimeline([
      ...timeline,
      {
        date: new Date(),
        event: '',
        description: '',
      },
    ])
  }

  /**
   * Remove a timeline event
   */
  const removeTimelineEvent = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index))
  }

  /**
   * Update timeline event field
   */
  const updateTimelineEvent = (
    index: number,
    field: keyof ITimelineEvent,
    value: string | Date
  ) => {
    const updated = [...timeline]
    updated[index] = { ...updated[index], [field]: value }
    setTimeline(updated)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEdit ? 'Edit Story' : 'Create New Story'}
        </h1>
        <p className="text-gray-600">
          {isEdit
            ? 'Update the story information below'
            : 'Fill in the details to create a new story'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Basic Information
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Enter story title"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Brief description of the story"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as 'draft' | 'active' | 'archived' | 'completed' })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Priority
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="e.g., Politics, Sports, Business"
              />
            </div>

            <div>
              <label
                htmlFor="deadline"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="e.g., investigation, breaking, feature"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              id="notes"
              rows={6}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Additional notes and details"
            />
          </div>
        </div>
      </div>

      {/* Journalists */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
          <button
            type="button"
            onClick={addJournalist}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Journalist
          </button>
        </div>

        {journalists.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No journalists assigned yet. Click &quot;Add Journalist&quot; to add team
            members.
          </p>
        ) : (
          <div className="space-y-4">
            {journalists.map((journalist, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-md"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={journalist.name}
                  onChange={(e) =>
                    updateJournalist(index, 'name', e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={journalist.email}
                  onChange={(e) =>
                    updateJournalist(index, 'email', e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Role"
                    value={journalist.role}
                    onChange={(e) =>
                      updateJournalist(index, 'role', e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeJournalist(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sources */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Sources</h2>
          <button
            type="button"
            onClick={addSource}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Source
          </button>
        </div>

        {sources.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No sources added yet. Click &quot;Add Source&quot; to add sources.
          </p>
        ) : (
          <div className="space-y-4">
            {sources.map((source, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-md space-y-3"
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Source Name"
                    value={source.name}
                    onChange={(e) =>
                      updateSource(index, 'name', e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeSource(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Contact Information"
                  value={source.contact}
                  onChange={(e) =>
                    updateSource(index, 'contact', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
                <textarea
                  placeholder="Notes about this source"
                  rows={2}
                  value={source.notes}
                  onChange={(e) => updateSource(index, 'notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Timeline</h2>
          <button
            type="button"
            onClick={addTimelineEvent}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Event
          </button>
        </div>

        {timeline.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No timeline events yet. Click &quot;Add Event&quot; to add timeline events.
          </p>
        ) : (
          <div className="space-y-4">
            {timeline.map((event, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-md space-y-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={
                      event.date
                        ? new Date(event.date).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      updateTimelineEvent(
                        index,
                        'date',
                        new Date(e.target.value)
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Event Name"
                      value={event.event}
                      onChange={(e) =>
                        updateTimelineEvent(index, 'event', e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeTimelineEvent(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder="Event description"
                  rows={2}
                  value={event.description}
                  onChange={(e) =>
                    updateTimelineEvent(index, 'description', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Story' : 'Create Story'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
