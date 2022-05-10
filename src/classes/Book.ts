type BookConstructor = {
    code: number
    title: string
    author: string
    gender?: string
    editorial?: string
    description?: string
}

export class Book {
    code: number
    title: string
    author: string
    editorial: string
    description: string
    gender: string

    constructor({ code, title, author, gender, editorial, description }: BookConstructor) {
        this.code = code
        this.title = title
        this.author = author
        this.gender = gender || ''
        this.editorial = editorial || ''
        this.description = description || ''
    }


    matchFilter(filter: string) {
        if (filter.trim() == '') return true
        filter = removeAccents(filter.trim().toLowerCase())
        const matchText = removeAccents(this.code + " " + this.title + this.author + this.gender + this.editorial + this.description)
        return matchText.toLowerCase().search(filter) !== -1
    }
}

const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 