import React, { useEffect, useMemo, useRef, useState } from 'react';
import { appWindow } from '@tauri-apps/api/window'
import { app } from '@tauri-apps/api';
import { } from '@tauri-apps/api/http';
import { emit, listen } from '@tauri-apps/api/event'
// import { Row, Table, TableData } from './components/table';
import styles from './App.module.css'
import BookCard from './components/bookCard';
import { Book } from './classes/Book';
import DataTable, { TableColumn } from 'react-data-table-component';
import { isReturnStatement } from 'typescript';
import Card, { CardButtons } from './components/Card';

const headers = {
  code: { title: "Código", style: { width: '60px', textAlign: 'right' } },
  title: { title: "Título" },
  author: { title: "Autor" },
  editorial: { title: "Editorial" }
}

const rows = [
  new Book({ code: 11, title: "Harry Potter 1", author: "JK Rowling", editorial: "pepe" }),
  new Book({ code: 12, title: "Harry Potter 2", author: "JK Rowling", editorial: "pepe" }),
  new Book({ code: 13, title: "Harry Potter 3", author: "JK Rowling", editorial: "pepe" }),
  new Book({ code: 14, title: "Harry Potter 4", author: "JK Rowling", editorial: "pepe" }),
  new Book({ code: 15, title: "Harry Potter 5", author: "JK Rowling", editorial: "pepe" }),
  new Book({ code: 16, title: "Harry Potter 6", author: "JK Rowling", editorial: "pepe" }),
]


for (let i = 0; i < 10000; i++) {
  rows.push(new Book({ code: 17 + i, title: "Harry Potter 7" + i, author: "JK Rowling", editorial: "pepe" }))
}


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
    name: 'autor',
    selector: row => row.author,
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

function App() {

  useEffect(() => {
    appWindow.listen("tauri://", ({ event, payload }) => {
      console.log(event, payload)
    })
    appWindow.listen('tauri://resize', ({ event, payload }) => {
      console.log(event, payload)
    })
  }, [])

  const [book, setBook] = useState<Book | null>(null)
  const ref = useRef<HTMLElement | null>(null)
  const [filter, setFilter] = useState('')

  const [selectedRow, setSelectedRow] = useState<Book[]>([])

  const filteredRows = useMemo(() => {
    if (filter.trim() == '') return rows
    return rows.filter(book => book.matchFilter(filter))
  }, [filter])

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
              console.log(books, selectedRow)
            }}
            paginationRowsPerPageOptions={[20, 50, 100, 200, 500]}
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
              <button>Nuevo libro</button>
              {book && <button>Prestar libro</button>}
            </CardButtons>
          </Card>
          <Card>
            <h1>Navegación</h1>
            <CardButtons>
              <button>Ir a entregas y devoluciones</button>
            </CardButtons>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
