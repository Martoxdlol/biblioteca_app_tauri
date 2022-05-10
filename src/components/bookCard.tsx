import React, { useState } from "react";
import { Book } from "../classes/Book";
import Card, { CardButtons } from "./Card";
import TextField from "./textField";

export default function BookCard({ book, ref }: { book: Book, ref: React.MutableRefObject<HTMLElement | null> }) {
    const [code, setCode] = useState(book.code.toString())
    const [title, setTitle] = useState(book.title)
    const [author, setAuthor] = useState(book.author)
    const [editorial, setEditorial] = useState(book.editorial)
    const [description, setDescription] = useState(book.description)

    function reset() {
        setCode(book.code.toString())
        setTitle(book.title.toString())
        setAuthor(book.author.toString())
        setEditorial(book.editorial.toString())
        setDescription(book.description.toString())
    }

    return <Card>
        <h1>{book.title}</h1>
        <TextField id="code" label="Código" value={code} onChange={e => setCode(e.target.value)} />
        <TextField id="title" label="Título" value={title} onChange={e => setTitle(e.target.value)} />
        <TextField id="author" label="Autor" value={author} onChange={e => setAuthor(e.target.value)} />
        <TextField id="editorial" label="Editorial" value={editorial} onChange={e => setEditorial(e.target.value)} />
        <TextField id="description" label="Descripción" value={description} onChange={e => setDescription(e.target.value)} multiline={true}/>
        <CardButtons>
            <button onClick={reset}>Cancelar</button>
            <button>Guardar</button>
        </CardButtons>
    </Card>
}