import { ask, confirm } from "@tauri-apps/api/dialog";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { Book } from "../classes/Book";
import { LibraryEvent } from "../classes/LibraryEvent";
import { booksDatabase, LibraryEventsDatabase } from "../data/database";
import Card, { CardButtons } from "./Card";
import DeleteButton from "./deleteBoutton";
import TextField from "./textField";

export default function LibraryEventCard({ libraryEvent, libraryEventsDatabase }: { libraryEvent: LibraryEvent, libraryEventsDatabase: LibraryEventsDatabase }) {

    const date = useMemo(() => {
        const d = moment(libraryEvent.date)
        const p = d.format("DD/MM/YYYY")
        return p + ' - ' + d.fromNow()
    }, [libraryEvent])
    
    return <Card>
        <h1>{LibraryEvent.actionsNames[libraryEvent.action]}</h1>
        <TextField value={date} label={libraryEvent.date ? "Prestado el" : "Devuelto el"} disabled />
        <TextField value={libraryEvent.user} label={libraryEvent.isLoan ? "Prestado a" : "Devuelto por"} disabled />
        <DeleteButton onDelete={() => libraryEventsDatabase.delete(libraryEvent)} />
    </Card>
}