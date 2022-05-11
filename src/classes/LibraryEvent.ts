import { Book } from "./Book"

export type libraryEventType = "loan" | "return"

export interface LibraryEventContructor {
    id: number
    date: Date
    user: string
    books: Book[] | Set<Book>
}

export class LibraryEvent {
    id: number
    date: Date
    user: string
    books: Set<Book>
    action: string = ''
    constructor({ books, id, date, user }: LibraryEventContructor) {
        this.id = id
        this.date = date
        this.user = user
        this.books = new Set<Book>(books)
    }

    get booksList() {
        return Array.from(this.books.values())
    }

    static actionsNames: { [key: string]: string } = {
        loan: "Prestar",
        return: "Devolver"
    }
    
    isLoan = false
    isReturn = false
}

export class LibraryEventLoan extends LibraryEvent {
    readonly action = 'loan'
    readonly isLoan = true
}

export class LibraryEventReturn extends LibraryEvent {
    readonly action = 'return'
    readonly isReturn = true
}