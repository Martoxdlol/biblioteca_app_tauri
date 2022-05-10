export type CSVObj = { [key: string]: string }
export type CSVParseOptionsTypes = { [key: string]: (raw: string) => any }
export type CSVParseOptions = {
    delimiter?: string,
    lineBreak?: string,
    types?: CSVParseOptionsTypes
}

export class CSV {
    static parse(text: string, options: CSVParseOptions = {}): CSVObj[] {
        const lines = text.split(options.lineBreak ?? '\n');
        if (lines.length > 0) {
            const headers = lines.splice(0, 1)[0].trim().split(options?.delimiter ?? ';')
            const list = []
            for (const line of lines) {
                const values = line.trim().split(options.delimiter ?? ';')
                const obj: CSVObj = {}
                headers.forEach((key, i) => {
                    obj[key] = values[i] ?? ''
                    if (options.types && options.types[key]) {
                        obj[key] = options.types[key](obj[key])
                    }
                })
                list.push(obj)
            }
            return list
        }
        return []
    }

    static encode(items: Object[], toCSVAble?: (item: Object) => CSVObj, options: CSVParseOptions = {}) {
        let keys: string[] | undefined = undefined
        const lines = []
        for (const item of items) {
            const str: string[] = []
            const obj: CSVObj = toCSVAble ? toCSVAble(item) : anyObjectToCSVAble(item)
            if (!keys) {
                keys = Object.keys(obj)
                lines.push(keys.join(options.delimiter || ';'))
            }

            for (const key of (keys ?? [])) {
                str.push(obj[key]?.toString())
            }
            lines.push(str.join(options.delimiter || ';'))
        }
        return lines.join(options.lineBreak || '\n')
    }
}

function anyObjectToCSVAble(obj: any): CSVObj {
    const keys = Object.keys(obj)
    const _obj: CSVObj = {}
    for (const key of keys) {
        _obj[key] = (obj[key] || '').toString()
    }
    return _obj
}