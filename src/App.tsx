import React, { useEffect } from 'react';
import { appWindow } from '@tauri-apps/api/window'
import { app } from '@tauri-apps/api';
import { } from '@tauri-apps/api/http';
import { emit, listen } from '@tauri-apps/api/event'
import { Table, TableData } from './table';


const headers = {
  code: "Código",
  title: "Título",
  author: "Autor",
  editorial: "Editorial"
}

const rows = [
  { code: 11, title: "Harry Potter 1", author: "JK Rowling", editorial: "pepe" },
  { code: 12, title: "Harry Potter 2", author: "JK Rowling", editorial: "pepe" },
  { code: 13, title: "Harry Potter 3", author: "JK Rowling", editorial: "pepe" },
  { code: 14, title: "Harry Potter 4", author: "JK Rowling", editorial: "pepe" },
  { code: 15, title: "Harry Potter 5", author: "JK Rowling", editorial: "pepe" },
  { code: 16, title: "Harry Potter 6", author: "JK Rowling", editorial: "pepe" },
  { code: 17, title: "Harry Potter 7", author: "JK Rowling", editorial: "pepe" },
]


function App() {

  useEffect(() => {
    console.log(app)
    console.log(appWindow)
    appWindow.listen("tauri://", ({ event, payload }) => {
      console.log(event, payload)
    })
    appWindow.listen('tauri://resize', ({ event, payload }) => {
      console.log(event, payload)
    })
  })


  return (
    <div className="App">
      <div>
        <Table
          data={new TableData(headers, rows)}
          onSelectonChange={console.log}
          onEnterPressed={console.log}
        ></Table>
      </div>
    </div>
  );
}

export default App;
