import { getDb } from './connection.js'
import { countNotes, insertNote } from './notesRepository.js'

const sampleNotes = [
  {
    title: 'Welcome to Notes',
    content:
      'This is a seeded note. Create, edit, search and delete notes to your heart\'s content — everything is stored in SQLite.',
  },
  {
    title: 'Groceries for the week',
    content:
      'Coffee beans, oat milk, sourdough bread, tomatoes, basil, olive oil, eggs, and something sweet for the weekend.',
  },
  {
    title: 'Sprint retro notes',
    content:
      'Ship the search endpoint earlier next sprint. The debounce on the client works well, but we should also throttle server-side queries.',
  },
  {
    title: 'Reading list',
    content:
      '"Designing Data-Intensive Applications", "The Pragmatic Programmer", and a short paper on SQLite write-ahead logging.',
  },
  {
    title: 'Trip ideas — coastal weekend',
    content:
      'Take the train, stay near the harbour, book the small seafood place on the pier, and pack a rain jacket just in case.',
  },
]

const force = process.argv.includes('--force')
const existing = countNotes()

if (existing > 0 && !force) {
  console.log(
    `Database already contains ${existing} notes. Run "npm run db:seed -- --force" to add samples anyway.`,
  )
  process.exit(0)
}

for (const note of sampleNotes) {
  insertNote(note)
}

console.log(`Seeded ${sampleNotes.length} notes into ${countNotes()} total.`)
getDb().close()
