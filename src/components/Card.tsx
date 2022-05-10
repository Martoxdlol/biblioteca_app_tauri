import React, { useState } from "react"; import styles from './Card.module.css'
import TextField from "./textField";

export default function Card({ children }: any) {
    return <div className={styles.card}>
        {children}
    </div>
}

export function CardButtons({ children }: any) {
    return <div className={styles.buttons}>
        {children}
    </div>
}