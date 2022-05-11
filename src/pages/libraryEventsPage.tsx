import styles from '../App.module.css'
import BookCard from '../components/bookCard';
import { Book } from '../classes/Book';
import DataTable, { TableColumn } from 'react-data-table-component';
import Card, { CardButtons } from '../components/Card';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useNavigate } from 'react-router-history-pro';
import { booksDatabase, LibraryEventsDatabase } from '../data/database';
import { LibraryEvent, LibraryEventLoan } from '../classes/LibraryEvent';
import moment from 'moment';
import LibraryEventCard from '../components/libraryEventCard';

const columns: TableColumn<LibraryEvent>[] = [
    {
        name: 'Acción',
        selector: row => LibraryEvent.actionsNames[row.action],
    },
    {
        name: 'Prestado/devuelto a/por',
        selector: row => row.user,
    },
    {
        name: 'Fecha',
        selector: row => {
            const d = moment(row.date)
            const yd = d.year
            const yn = moment().year
            if (yn == yd) return d.format("d [de] MMMM")
            return d.format("d [de] MMMM del YYYY")
        },
    },
    {
        width: "70%",
        name: 'Libros',
        selector: row => row.booksList.map(b => b.code.toString() + ": " + b.title).join(', '),
    },
];

function LibraryEventsPage() {
    // Data
    const [rows, setRows] = useState<LibraryEvent[]>([])
    const [database, setDatabase] = useState<LibraryEventsDatabase>(new LibraryEventsDatabase())

    // Current
    const [libraryEvent, setLibraryEvent] = useState<LibraryEvent>()

    useEffect(() => {
        let cancel: Function
        booksDatabase.getItems().then((its) => {
            cancel = database.subscribe(events => setRows(events))
        })
        return () => cancel && cancel()
    }, [])


    // Navigation
    const navigate = useNavigate()
    const history = useHistory()

    return (
        <div className={styles.app}>
            <div className={styles.container}>
                <div>
                    <DataTable
                        columns={columns}
                        data={rows}
                        onRowClicked={row => {
                            setLibraryEvent(row)
                        }}
                        selectableRowSelected={row => libraryEvent === row}
                        selectableRowsHighlight={true}
                        pagination={true}
                        paginationComponentOptions={{}}
                        paginationPerPage={30}
                        fixedHeader={true}
                        highlightOnHover={true}
                        fixedHeaderScrollHeight={'calc(100vh - 56px)'}
                        selectableRowsSingle={true}
                        selectableRows={true}
                        paginationRowsPerPageOptions={[25, 50, 100, 200, 500]}
                    />
                </div>
                <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                    {libraryEvent && <LibraryEventCard libraryEvent={libraryEvent} libraryEventsDatabase={database} />}
                    <Card>
                        <h1>Prestamo</h1>
                        <CardButtons>
                            <button>Devolver libros</button>
                        </CardButtons>
                    </Card>
                    <Card>
                        <h1>Navegación</h1>
                        <CardButtons>
                            <button onClick={() => navigate('/')}>Ir a libros</button>
                        </CardButtons>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default LibraryEventsPage;
