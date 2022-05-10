import { confirm } from "@tauri-apps/api/dialog";
import React from "react";

export default function DeleteButton({ onDelete }: { onDelete: () => void }) {
    return <a style={{ color: 'red', fontWeight: '600', cursor: 'pointer' }}
        onClick={() => {
            confirm("¿Desea eliminar el elemento?", "Eliminar").then(yea => yea && onDelete())
        }}
    >Eliminar</a>
}