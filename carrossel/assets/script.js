var equipeUrl = 'https://bimworks.com.br/wp-json/wp/v2/equipe?order=asc'

/**
 * inicia o carrosel com os dados da api
 * @author Vinicius de Santana
 */
class Carrossel {
    constructor (idSelector) {
        // verifica se o id é válido
        /** contém todas as seções em seu interior e ele prório é HTMLElement
         */ 
        this.el = document.getElementById(idSelector)
        if (this.el == null) throw new TypeError('precisa de seletor')
        fetch(equipeUrl)
            .then(res => res.json())
            .then(json => this.init(json))
    }
    
    /** 
     * @returns {void}
     * @param {[{}]} dados
     * @author Vinicius de Santana
    */
    init(dados) {
        /** Contém os cards gerados */
        this.itens = []
        for (const dado of dados) {
            var newCard = this.newCard(dado)
            this.itens.push(newCard)
            this.el.append(newCard)
        }
        /** Navegação para a esquerda */
        this.left = this.leftArrow()
        this.el.append(this.left)
        /** Navegação para a direita */
        this.right = this.rightArrow()
        this.el.append(this.right)
    }
    
    /** 
     * @returns {HTMLElement}
     * @author Vinicius de Santana
    */
    leftArrow() {
        var leftArrow = document.createElement('div')
        leftArrow.classList.add('leftArrow')
        leftArrow.innerText = '<'
        leftArrow.addEventListener('click', () => {
            this.toLeft()
        })
        return leftArrow
    }
    /** 
     * @returns {HTMLElement}
     * @author Vinicius de Santana
    */
    rightArrow() {
        var rightArrow = document.createElement('div')
        rightArrow.classList.add('rightArrow')
        rightArrow.innerText = '>'
        rightArrow.addEventListener('click', () => {
            this.toRight()
        })
        return rightArrow
    }

    /**
     * move o carrossel da direita para a esquerda
     * @author Vinicius de Santana
     */
    toRight() {
        /* O tamanho do offset para desabilitar a navegação é o tamanho de um item * o tamanho do array -1
        deste valor remove o tamanho do carrosel */
        var lastOffset = (this.itens[0].offsetWidth * (this.itens.length -1)) - this.el.offsetWidth
        this.el.scrollLeft += this.itens[0].offsetWidth
        this.left.classList.remove('disabled')
        if (this.el.scrollLeft >= lastOffset){
            this.cloneItensInRight()
        }
    }

    /**
     * move o carrossel da esquerda para a direita
     * @author Vinicius de Santana
     */
    toLeft() {
        this.el.scrollLeft -= this.itens[0].offsetWidth
        this.right.classList.remove('disabled')
        if (this.el.scrollLeft <= 1){
            this.cloneItensInLeft()
        }
    }
    
    /** 
     * @param {{}} data
     * @returns {HTMLElement}
     * @author Vinicius de Santana
    */
    newCard(data){
        //novo card
        var card = document.createElement('div') 
        card.classList.add('col-12', 'col-md-3', 'sobre-card')
        //adiciona o head com imagem, nome e cargo do cidadão
        card.appendChild(this.newHead(data))
        card.appendChild(this.newText(data))
        card.appendChild(this.newFoot(data))
        return card
    }
   
    /** 
     * @param {{}} data
     * @returns {HTMLElement}
     * @author Vinicius de Santana
    */
   newHead(data){
        //novo head
        var head = document.createElement('div') 
        head.classList.add('head')
        /**imagem do cidadão */
        var img = document.createElement('img')
        img.src = data.acf.imagem.sizes.large
        img.alt = data.acf.imagem.alt
        /**nome do cidadão */
        var pNome = document.createElement('p')
        pNome.classList.add('name')
        pNome.innerHTML = data.title.rendered
        /**cargo do cidadão */
        var pCargo = document.createElement('p')
        pCargo.classList.add('cargo')
        pCargo.innerHTML = data.acf.cargo
        //adiciona imagem, nome e cargo do cidadão
        head.appendChild(img)
        head.appendChild(pNome)
        head.appendChild(pCargo)
        return head
    }
    
    /** 
     * @param {{}} data
     * @returns {HTMLElement}
     * @author Vinicius de Santana
    */
   newText(data){
        //novo head
        var text = document.createElement('div') 
        text.classList.add('text')
        text.innerHTML = data.acf.texto
        return text
    }
    
    /** 
     * @param {{}} data
     * @returns {HTMLElement}
     * @author Vinicius de Santana
    */
   newFoot(data){
        //novo head
        var foot = document.createElement('div') 
        foot.classList.add('foot')// acf.linkedin
        /** link para o linkedIn */
        var link = document.createElement('a')
        link.href = data.acf.linkedin
        link.innerHTML = '<img src="https://bimworks.com.br/wp-content/uploads/2020/07/linkedin.svg" alt="">'
        foot.appendChild(link)
        return foot
    }

    /** 
     * clana os cards e os adiciona ao carrossel para dar o efeito de inifito
     * @author Vinicius de Santana
    */
    cloneItensInRight(){
        for (const item of this.itens) {
            this.el.append(item.cloneNode(true))
        }
    }

    /** 
     * clana os cards e os adiciona ao carrossel para dar o efeito de inifito
     * @author Vinicius de Santana
    */
    cloneItensInLeft(){
        var firstchild = this.el.firstElementChild
        /**valor do offset no momento inicial
         * esse valor muda no elemento depois de criado novos elementos
         */
        var firstchildinitialOffset = firstchild.offsetLeft
        for (const item of this.itens) {
            this.el.insertBefore(item.cloneNode(true), firstchild)
        }
        this.el.classList.add('creatingCards')
        this.el.scrollLeft = firstchild.offsetLeft - firstchildinitialOffset
        this.el.classList.remove('creatingCards')
        this.toLeft()
    }
}
document.addEventListener('DOMContentLoaded', () =>{
    carrossel = new Carrossel('equipe')
})
