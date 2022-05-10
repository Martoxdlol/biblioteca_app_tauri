import React from "react";
import HistoryPro from "history-pro";
import { HistoryProRouter, Route, Routes } from "react-router-history-pro";
import BooksPage from "./pages/booksPage";

const history = new HistoryPro()

export default function App() {
  return <HistoryProRouter history={history}>
    <Routes>
      <Route path="/" element={<BooksPage />}>
        
      </Route>
    </Routes>
  </HistoryProRouter>
}