import styles from '../App.module.css'
import BookCard from '../components/bookCard';
import { Book } from '../classes/Book';
import DataTable, { TableColumn } from 'react-data-table-component';
import Card, { CardButtons } from '../components/Card';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useNavigate } from 'react-router-history-pro';
import { libraryEventsDatabase } from '../data/database';
import { LibraryEvent, LibraryEventLoan } from '../classes/LibraryEvent';

const actions: { [key: string]: string } = {
    loan: "Prestar",
    return: "Devolver"
}

const columns: TableColumn<LibraryEvent>[] = [
    {
        name: 'Acción',
        selector: row => actions[row.action],
    },
    {
        name: 'Quien',
        selector: row => row.user,
    },
    {
        name: 'Libros',
        selector: row => row.booksList.map(b => b.code.toString() + ": " + b.title).join(', '),
    },
];

function LibraryEventsPage() {
    // Data
    const [rows, setRows] = useState<LibraryEvent[]>([])
    useEffect(() => {
        return libraryEventsDatabase.subscribe(events => setRows(events))
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
                        // onRowClicked={row => {
                        //     setSelectedRow([row])
                        // }}
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
                    <Card>
                        <h1>Prestamo</h1>
                        <CardButtons>
                            <button>Devolver libros</button>
                        </CardButtons>
                    </Card>
                    <Card>
                        <h1>Navegación</h1>
                        <CardButtons>
                            <button onClick={() => history.back()}>Volver</button>
                        </CardButtons>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default LibraryEventsPage;
