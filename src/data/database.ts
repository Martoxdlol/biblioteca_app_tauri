import { app } from "@tauri-apps/api";
import { readTextFile, writeFile, copyFile, renameFile, removeFile } from "@tauri-apps/api/fs";
import { Type } from "typescript";
import { Book } from "../classes/Book";
import { LibraryEvent, LibraryEventLoan, LibraryEventReturn } from "../classes/LibraryEvent";
import { CSV, CSVObj, CSVParseOptionsTypes } from "./CSV";



abstract class Database<ITEMTYPE, IDTYPE> {
    initializer: (obj: CSVObj) => ITEMTYPE
    types: CSVParseOptionsTypes
    csvPath: string
    getItemKey: (item: ITEMTYPE) => IDTYPE

    items?: Map<IDTYPE, ITEMTYPE>
    subscriptions: Set<(items: ITEMTYPE[]) => any> = new Set()

    constructor(csvPath: string, types: CSVParseOptionsTypes, getItemKey: (item: ITEMTYPE) => IDTYPE, initializer: (obj: CSVObj) => ITEMTYPE) {
        this.initializer = initializer
        this.types = types
        this.csvPath = csvPath
        this.getItemKey = getItemKey
    }

    async readFromCSVFile() {
        const text = await readTextFile(this.csvPath)
        return CSV.parse(text, { types: this.types }).map(this.initializer)
    }

    async getItems(): Promise<ITEMTYPE[]> {
        if (!this.items) {
            const items = await this.readFromCSVFile()
            const itemsByKey = new Map<IDTYPE, ITEMTYPE>()
            for (const item of items) {
                itemsByKey.set(this.getItemKey(item), item)
            }
            this.items = itemsByKey
        }
        return Array.from(this.items.values())
    }

    add(item: ITEMTYPE) {
        if (!this.items) {
            this.items = new Map<IDTYPE, ITEMTYPE>()
        }
        this.items.set(this.getItemKey(item), item)
        this.emitUpdate();
        this.save()
    }


    async deleteWithId(itemId: IDTYPE) {
        if (!this.items) {
            this.items = new Map<IDTYPE, ITEMTYPE>()
            return
        }
        this.items.delete(itemId)
        this.emitUpdate()
    }

    delete(item: ITEMTYPE) {
        return this.deleteWithId(this.getItemKey(item))
    }

    async emitUpdate() {
        const subs = this.subscriptions
        const items = await this.getItems()
        for (const cb of subs.values()) {
            cb(items)
        }
    }

    subscribe(callback: (items: ITEMTYPE[]) => any) {
        const subs = this.subscriptions
        subs.add(callback)
        this.getItems().then(callback)
        return () => { subs.delete(callback) }
    }

    get(id: IDTYPE) {
        return this.items?.get(id)
    }

    async save() {
        try {
            await removeFile(this.csvPath + ".copy-2")
        } catch (error) { }
        try {
            await renameFile(this.csvPath + ".copy-1", this.csvPath + ".copy-2")
        } catch (error) { }
        try {
            await copyFile(this.csvPath, this.csvPath + ".copy-1")
        } catch (error) { }
        writeFile({ path: this.csvPath, contents: CSV.encode([...(this.items?.values() || [])]) })
    }
}

class BookOrEventDB<T, V> extends Database<T, V> {
    biggestId?: any
    get lastId(): number {
        if (this.biggestId) return this.biggestId
        if (this.items) {
            for (const item of this.items.values()) {
                const id = this.getItemKey(item)
                if (!this.biggestId) this.biggestId = id
                if (id > this.biggestId!) this.biggestId = id
            }
            return this.biggestId || 1
        }
        return 0
    }
}

class BooksDatabase extends BookOrEventDB<Book, number> {
    biggestId?: number
    constructor() {
        super("./data/books.csv", { code: (c) => parseInt(c) }, (book) => book.code, r => new Book(r as any))
        this.subscribe(() => this.biggestId = undefined)
    }
}

class LibraryEventsDatabase extends BookOrEventDB<LibraryEvent, number> {
    biggestId?: number
    constructor() {
        super("./data/events.csv", { id: (c) => parseInt(c), date: d => new Date(d), books: books => books.split(',').map(book => booksDatabase.get(parseInt(book)) || null).filter(x => x !== null) }, (event) => event.id, r => {
            if (r.action === 'loan') return new LibraryEventLoan(r as any)
            if (r.action === 'return') return new LibraryEventReturn(r as any)
            return new LibraryEventLoan(r as any)
        })
        this.subscribe(() => this.biggestId = undefined)
    }
}

const booksDatabase = new BooksDatabase()
const libraryEventsDatabase = new LibraryEventsDatabase()
export { booksDatabase, libraryEventsDatabase }