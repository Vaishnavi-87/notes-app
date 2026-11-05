import { Modal } from './Modal.jsx'
import { PencilIcon, TrashIcon } from './Icons.jsx'
import { formatDateTime } from '../utils/date.js'

export function NoteViewModal({ note, onEdit, onDelete, onClose }) {
  const hasContent = Boolean(note.content.trim())

  return (
    <Modal
      title={note.title}
      onClose={onClose}
      size="large"
      footer={
        <>
          <button type="button" className="button button--ghost" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="button button--ghost button--danger-ghost"
            onClick={() => onDelete(note)}
          >
            <TrashIcon />
            Delete
          </button>
          <button type="button" className="button button--primary" onClick={() => onEdit(note)}>
            <PencilIcon />
            Edit
          </button>
        </>
      }
    >
      <div className="note-view">
        <dl className="note-view__meta">
          <div>
            <dt>Created</dt>
            <dd>
              <time dateTime={note.createdAt}>{formatDateTime(note.createdAt)}</time>
            </dd>
          </div>
          <div>
            <dt>Last updated</dt>
            <dd>
              <time dateTime={note.updatedAt}>{formatDateTime(note.updatedAt)}</time>
            </dd>
          </div>
        </dl>

        <p className={`note-view__content${hasContent ? '' : ' note-view__content--empty'}`}>
          {hasContent ? note.content : 'This note has no content.'}
        </p>
      </div>
    </Modal>
  )
}
