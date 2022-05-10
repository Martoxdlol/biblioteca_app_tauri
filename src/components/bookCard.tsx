import { ask, confirm } from "@tauri-apps/api/dialog";
import React, { useState } from "react";
import { Book } from "../classes/Book";
import { booksDatabase } from "../data/database";
import Card, { CardButtons } from "./Card";
import DeleteButton from "./deleteBoutton";
import TextField from "./textField";

export default function BookCard({ book: _book, ref }: { book: Book, ref: React.MutableRefObject<HTMLElement | null> }) {
    const [book, setBook] = useState(_book)

    const [code, setCode] = useState(book.code.toString())
    const [title, setTitle] = useState(book.title)
    const [author, setAuthor] = useState(book.author)
    const [gender, setGender] = useState(book.gender)
    const [editorial, setEditorial] = useState(book.editorial)
    const [description, setDescription] = useState(book.description)

    function reset() {
        setCode(book.code.toString())
        setTitle(book.title.toString())
        setAuthor(book.author.toString())
        setGender(book.gender.toString())
        setEditorial(book.editorial.toString())
        setDescription(book.description.toString())
    }

    async function save() {
        const newCode = parseInt(code)
        if (newCode !== book.code && booksDatabase.get(newCode)) {
            const title = `Ya existe un libro con el mismo código`
            const message = `El libro "${booksDatabase.get(newCode)?.title}" ya tiene el código ${newCode.toString()}. ¿Desea sobreescribirlo?`
            if (!await confirm(message, title)) return
        }

        const newBook = new Book({ code: newCode, title, author, gender, editorial, description })
        booksDatabase.add(newBook)
        setBook(newBook)
    }

    return <Card>
        <h1>{book.title}</h1>
        <TextField id="code" label="Código" value={code} onChange={e => setCode(e.target.value)} />
        <TextField id="title" label="Título" value={title} onChange={e => setTitle(e.target.value)} />
        <TextField id="author" label="Autor" value={author} onChange={e => setAuthor(e.target.value)} />
        <TextField id="gender" label="Género" value={gender} onChange={e => setGender(e.target.value)} />
        <TextField id="editorial" label="Editorial" value={editorial} onChange={e => setEditorial(e.target.value)} />
        <TextField id="description" label="Descripción" value={description} onChange={e => setDescription(e.target.value)} multiline={true} />
        <DeleteButton onDelete={() => booksDatabase.delete(book)} />
        <CardButtons>
            <button onClick={reset}>Cancelar</button>
            <button onClick={save}>Guardar</button>
        </CardButtons>
    </Card>
}