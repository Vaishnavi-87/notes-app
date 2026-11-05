import { Modal } from './Modal.jsx'
import { NoteForm } from './NoteForm.jsx'

export function NoteModal({ note, onSubmit, onClose }) {
  const isEditing = Boolean(note)

  return (
    <Modal
      title={isEditing ? 'Edit note' : 'New note'}
      description={
        isEditing
          ? 'Changes are saved to the database as soon as you confirm.'
          : 'Notes are stored in SQLite and are available right away.'
      }
      onClose={onClose}
      size="large"
    >
      <NoteForm
        note={note}
        submitLabel={isEditing ? 'Save changes' : 'Create note'}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
