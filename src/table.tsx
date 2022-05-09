import { dialog } from "@tauri-apps/api";
import { message } from "@tauri-apps/api/dialog";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"

interface Stringable {
    toString(): string;
}

export type Row = {
    [key: string]: Stringable
}

export type Headers = {
    [key: string]: Stringable
}

export class TableData {
    headers: Headers
    rows: Row[]
    constructor(headers: Headers, rows: Row[]) {
        this.headers = headers;
        this.rows = rows;
    }
}

export type TableProps = {
    data: TableData
    onSelectonChange?: (row: Row | null) => any
    onEnterPressed?: (row: Row) => any
}

export function Table({ data, onSelectonChange, onEnterPressed }: TableProps) {
    const [pos, setPos] = useState(-1);
    const ref = useRef<HTMLTableRowElement>(null)
    const len = data.rows.length

    useEffect(() => {
        if (!onSelectonChange) return
        if (pos === -1) {
            onSelectonChange!(null)
        } else {
            onSelectonChange!(data.rows[pos])
        }
    }, [pos])

    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.focus()
        }
    }, [pos])
    return <table onKeyDown={e => {
        if (e.key == 'ArrowUp') {
            setPos(((pos === 0 ? len : pos) - 1) % len)
        }
        if (e.key == 'ArrowDown') {
            setPos((pos + 1) % len)
        }
        if (e.key == 'Enter') {
            pos !== -1 && onEnterPressed && onEnterPressed(data.rows[pos])
        }

    }}>
        <thead>
            <tr>
                {Object.keys(data.headers).map((key, i) => <th key={i}>{data.headers[key]?.toString()}</th>)}
            </tr>
        </thead>
        <tbody>
            {data.rows.map((row, i) => <tr key={i} tabIndex={i} onFocus={e => setPos(i)} ref={i === pos ? ref : null} onBlur={e => pos === i && setPos(-1)}>
                {Object.keys(data.headers).map((key, i) => <td key={i}>{row[key]?.toString()}</td>)}
            </tr>)}
        </tbody>
    </table>
}