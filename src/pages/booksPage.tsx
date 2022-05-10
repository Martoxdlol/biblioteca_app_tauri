import styles from '../App.module.css'
import BookCard from '../components/bookCard';
import { Book } from '../classes/Book';
import DataTable, { TableColumn } from 'react-data-table-component';
import Card, { CardButtons } from '../components/Card';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-history-pro';
import { booksDatabase } from '../data/database';
import { ask } from '@tauri-apps/api/dialog';

// const rows = [
//     new Book({ code: 11, title: "Harry Potter 1", author: "JK Rowling", gender: 'Fantasia', editorial: "pepe" }),
//     new Book({ code: 12, title: "Harry Potter 2", author: "JK Rowling", editorial: "pepe" }),
//     new Book({ code: 13, title: "Harry Potter 3", author: "JK Rowling", editorial: "pepe" }),
//     new Book({ code: 14, title: "Harry Potter 4", author: "JK Rowling", editorial: "pepe" }),
//     new Book({ code: 15, title: "Harry Potter 5", author: "JK Rowling", editorial: "pepe" }),
//     new Book({ code: 16, title: "Harry Potter 6", author: "JK Rowling", editorial: "pepe" }),
// ]

// for (let i = 0; i < 10000; i++) {
//     rows.push(new Book({ code: 17 + i, title: "Harry Potter 7" + i, author: "JK Rowling", gender: 'Fantasia', editorial: "pepe" }))
// }


const columns: TableColumn<Book>[] = [
    {
        name: 'Código',
        selector: row => row.code,
    },
    {
        name: 'Título',
        selector: row => row.title,
    },
    {
        name: 'Autor',
        selector: row => row.author,
    },
    {
        name: 'Género',
        selector: row => row.gender,
    },
    {
        name: 'Editorial',
        selector: row => row.editorial,
    },
    {
        name: 'Estado',
        selector: row => "getEstado(" + row.code + ")",
    },
];

function BooksPage() {
    // Data
    const [rows, setRows] = useState<Book[]>([])
    useEffect(() => {
        console.log(1)
        return booksDatabase.subscribeBooks(books => setRows(books))
    }, [])

    // Current state
    const [book, setBook] = useState<Book | null>(null)
    const [filter, setFilter] = useState('')
    const [selectedRow, setSelectedRow] = useState<Book[]>([])

    // Reference
    const ref = useRef<HTMLElement | null>(null)

    // Filter data
    const filteredRows = useMemo(() => {
        if (filter.trim() == '') return rows
        return rows.filter(book => book.matchFilter(filter))
    }, [filter, rows])

    // Navigation
    const navigate = useNavigate()

    function newBook() {
        const b = new Book({ code: booksDatabase.lastId + 1, author: '', title: '', description: '', editorial: '', gender: '' })
        setBook(b)
    }

    return (
        <div className={styles.app}>
            <div className={styles.container}>
                <div>
                    <DataTable
                        columns={columns}
                        data={filteredRows}
                        onRowClicked={row => {
                            setSelectedRow([row])
                        }}
                        pagination={true}
                        paginationComponentOptions={{}}
                        paginationPerPage={30}
                        fixedHeader={true}
                        highlightOnHover={true}
                        fixedHeaderScrollHeight={'calc(100vh - 56px)'}
                        selectableRowsSingle={true}
                        selectableRows={true}
                        selectableRowSelected={(book: Book) => {
                            return selectedRow[0] == book
                        }}
                        onSelectedRowsChange={({ selectedRows: books }) => {
                            if (books.length == 0 && selectedRow.length === 0) return;
                            if (books[0] !== selectedRow[0]) setSelectedRow(books)
                            setBook(books[0])
                        }}
                        paginationRowsPerPageOptions={[25, 50, 100, 200, 500]}
                    />
                </div>
                <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                    <Card>
                        <input type="text" value={filter} onChange={e => setFilter(e.target.value)} className={styles.filter} placeholder="Buscar" />
                    </Card>
                    {book && <BookCard key={book.code} book={book as any as Book} ref={ref} />}
                    <Card>
                        <h1>Acciones</h1>
                        <CardButtons>
                            <button onClick={newBook}>Cargar nuevo libro</button>
                            {book && <button>Prestar libro</button>}
                        </CardButtons>
                    </Card>
                    <Card>
                        <h1>Navegación</h1>
                        <CardButtons>
                            <button onClick={() => navigate("/prestamos")}>Ir a prestamos y devoluciones</button>
                        </CardButtons>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default BooksPage;
