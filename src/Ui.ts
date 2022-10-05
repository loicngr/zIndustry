export class Ui {
    element: HTMLDivElement

    constructor() {
        const element = document.createElement('div')
        element.style.position = 'fixed'
        element.style.inset = '0'
        element.style.textShadow = '1px 1px 2px black'
        element.style.textTransform = 'uppercase'
        element.style.fontSize = '12px'

        document.body.insertBefore(element, document.body.childNodes[0])

        this.element = element

        this.init()
    }

    private init(): void {
        const ul = document.createElement('ul')
        const liKeyZ = document.createElement('li')
        liKeyZ.innerText = `Z: Move Up`
        const liKeyS = document.createElement('li')
        liKeyS.innerText = `S: Move Down`
        const liKeyD = document.createElement('li')
        liKeyD.innerText = `D: Move Right`
        const liKeyQ = document.createElement('li')
        liKeyQ.innerText = `Q: Move Left`
        const liKeyE = document.createElement('li')
        liKeyE.innerText = `E: Place bush`
        const liKeyF = document.createElement('li')
        liKeyF.innerText = `F: Debug in console`
        const liKeyF1 = document.createElement('li')
        liKeyF1.innerText = `F1: Toggle grid`

        ul.appendChild(liKeyZ)
        ul.appendChild(liKeyS)
        ul.appendChild(liKeyD)
        ul.appendChild(liKeyQ)
        ul.appendChild(liKeyE)
        ul.appendChild(liKeyF)
        ul.appendChild(liKeyF1)

        this.element.appendChild(ul)
    }
}