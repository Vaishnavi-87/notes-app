import { useState } from 'react'
import toast from 'react-hot-toast'

const TITLE_MAX_LENGTH = 100
const CONTENT_MAX_LENGTH = 20000

export function NoteForm({ note, submitLabel, onSubmit, onCancel }) {
  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  function validate() {
    const nextErrors = {}
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle) {
      nextErrors.title = 'A title is required.'
    } else if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      nextErrors.title = `Keep the title under ${TITLE_MAX_LENGTH} characters.`
    }

    if (!trimmedContent) {
      nextErrors.content = 'Content is required.'
    } else if (content.length > CONTENT_MAX_LENGTH) {
      nextErrors.content = `Keep the note under ${CONTENT_MAX_LENGTH} characters.`
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSaving) return

    if (!validate()) {
      toast.error('Please fix the highlighted fields before saving.')
      return
    }

    setIsSaving(true)
    try {
      await onSubmit({ title: title.trim(), content: content.trim() })
    } catch {
      // The failure is already reported through a toast, so the dialog stays
      // open with the user's text intact.
    } finally {
      setIsSaving(false)
    }
  }

  function handleTitleChange(event) {
    setTitle(event.target.value)
    if (errors.title) setErrors((current) => ({ ...current, title: undefined }))
  }

  function handleContentChange(event) {
    setContent(event.target.value)
    if (errors.content) setErrors((current) => ({ ...current, content: undefined }))
  }

  return (
    <form className="note-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <div className="field__header">
          <label className="field__label" htmlFor="note-title">
            Title <span className="field__required">(required)</span>
          </label>
          <span
            className={`field__counter${title.length > TITLE_MAX_LENGTH ? ' field__counter--over' : ''}`}
          >
            {title.length}/{TITLE_MAX_LENGTH}
          </span>
        </div>
        <input
          id="note-title"
          className={`field__input${errors.title ? ' field__input--invalid' : ''}`}
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="What is this note about?"
          autoFocus
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'note-title-error' : undefined}
        />
        {errors.title && (
          <p className="field__error" id="note-title-error">
            {errors.title}
          </p>
        )}
      </div>

      <div className="field">
        <div className="field__header">
          <label className="field__label" htmlFor="note-content">
            Content <span className="field__required">(required)</span>
          </label>
          <span className="field__counter">
            {content.length}/{CONTENT_MAX_LENGTH}
          </span>
        </div>
        <textarea
          id="note-content"
          className={`field__input field__input--textarea${errors.content ? ' field__input--invalid' : ''}`}
          value={content}
          onChange={handleContentChange}
          placeholder="Write anything you want to remember…"
          rows={8}
          maxLength={CONTENT_MAX_LENGTH}
          aria-invalid={Boolean(errors.content)}
          aria-describedby={errors.content ? 'note-content-error' : undefined}
        />
        {errors.content && (
          <p className="field__error" id="note-content-error">
            {errors.content}
          </p>
        )}
      </div>

      <div className="note-form__actions">
        <button type="button" className="button button--ghost" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
        <button type="submit" className="button button--primary" disabled={isSaving}>
          {isSaving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
