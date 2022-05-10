import styles from './textField.module.css'

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label?: string
    multiline?: boolean
}

export default function TextField(props: Props) {
    return <div className={styles.field}>
        <label htmlFor={props.id}>{props.label}</label>
        {props.multiline ? <textarea {...(props as any)} /> : <input{...props} />}

    </div>
}