/*! @author Vinicius de Santana*/
var urlBase = 'https://dnaformarketing.com.br/stant/'
document.addEventListener('DOMContentLoaded', function(){
    menu = new MenuAndSub('menuandsub')
})

/** Inicia o menu e os submenus
 * @author Vinicius de Santana
 */
class MenuAndSub {
    /** contrutor
     * @author Vinicius de Santana
     * @param {String} idSelector
     */
    constructor (idSelector) {
        // verifica se o id é válido
        /** contém todas as seções em seu interior e ele prório é HTMLElement
         * @type {{
                menu:HTMLElement,
                submenus:HTMLElement,
                conteudo:HTMLElement
            }}
         */ 
        this.el = document.getElementById(idSelector)
        if (this.el == null) throw new TypeError('precisa de seletor')
        // inicializa as variáveis
        /** coloca os ids nesta div para direcionar os links por hash */
        this.anchors = document.getElementById('anchors')
        this.el.menu = this.el.querySelector('.menu')
        this.el.conteudo = this.el.querySelector('.conteudo')
        /** @type {
        [
            {
                menu:{
                    sub:[{
                        conteudo:HTMLElement
                    }]
                }
            }
        ]
        } */
        this.menuItens = []
        fetch(urlBase + 'wp-json/wp/v2/funcionalidade/')
        .then(res => res.json())
        .then(json => this.init(json))
    }
    /** 
     * @returns {void}
     * @param {[{}]} data
    */
    init (data) {
        let isHashValid = false
        for (const dt of data) {
            let menuItem = {}
            menuItem.menu = this.createMenuItem(dt)
            //adiciona as informações a div
            menuItem.data = dt
            // já monta o menu nesse loop
            this.el.menu.appendChild(menuItem.menu)
            menuItem.menu.sub = this.createSubmenuItens(dt)
            this.menuItens.push(menuItem)
            this.anchors.append(this.createDivWithId(dt.slug))
            // caso tenha hash e seja igual ao slug, ativa o menu e submenu
            if (window.location.hash.substr(1) == dt.slug) {
                isHashValid = true
                menuItem.menu.classList.add('active')
                this.setContent(menuItem.menu.sub)
                setTimeout(this.scrollPageToId,1000)
            }
            // escuta o evento de mudança de hash para habilitar o correspondente
            //está aqui para não perder a referência a this
            window.addEventListener('hashchange', () => {
                this.scrollPageToId()
                var newHash = window.location.hash.substr(1)
                for (const item of this.menuItens) {
                    if (item.data.slug == newHash) {
                        this.limpaMenu()
                        item.menu.classList.add('active')
                        this.setContent(item.menu.sub)
                    }
                }
            })
        }
        //caso não tenha o hash ativa o primeiro
        if (!isHashValid) {
            this.menuItens[0].menu.classList.add('active')
            this.setContent(this.menuItens[0].menu.sub)
        }
        
        //inicia as configurações de mobile
        if (window.innerWidth < 992) {
            startMobileMenu(data.length)
        }
    }
    
    /** 
     * @returns {{}}
     * @param {{}} data
    */
    createMenuItem (data) {
        //cria a div de mais um item do menu
        let div = document.createElement('div')
        div.classList.add('col-6','col-lg', 'item')
        //cria a imagem exibida quando ativo e anexa a div
        let imgAtiva = document.createElement('img')
        imgAtiva.classList.add('ativo')
        imgAtiva.src = data.acf.icone_ativo.url
        imgAtiva.alt = data.acf.icone_ativo.alt
        div.appendChild(imgAtiva)
        //cria a imagem exibida quando inativo e anexa a div
        let imgInativa = document.createElement('img')
        imgInativa.classList.add('inativo')
        imgInativa.src = data.acf.icone_inativo.url
        imgInativa.alt = data.acf.icone_inativo.alt
        div.appendChild(imgInativa)
        // cria o paragrafo e o anexa a div
        let p = document.createElement('p')
        p.innerText = data.title.rendered
        div.appendChild(p)
        //adiciona o evento de click aui para não perder o contexto
        let that = this
        div.addEventListener('click', function () {
            that.limpaMenu()
            this.classList.add('active')
            that.setContent(this.sub)
            window.location.hash = data.slug
        })
        return div
    }
    /** 
     * @returns {{}}
     * @param {{}} data
    */
    createSubmenuItens(data){
        let subs = []
        for (const fc of data.acf.funcoes) {
            // cria a div do submenu
            let sub = document.createElement('div')
            sub.classList.add('item', 'col-md-auto')
            // cria o paragrafo e o adiciona a div
            let p = document.createElement('p')
            p.innerText = fc.nome_funcao
            sub.appendChild(p)
            // cria a div com o conteúdo de cada subitem
            sub.conteudo = this.createContentItens(fc)
            //adiciona o evento de click aui para não perder o contexto
            let that = this
            sub.addEventListener('click', function () {
                that.limpaSubmenu()
                this.classList.add('active')
                that.setContent(this.conteudo)
            })
            subs.push(sub)
        }
        return subs
    }
    /** 
     * @returns {{}}
     * @param {{}} data
    */
    createContentItens(data){
        let content = document.createElement('div')
        content.classList.add('row')
        //cria o lado esquerdo com o texto e adiciona a div
        let esq = document.createElement('div')
        esq.classList.add('col-12', 'col-lg-6', 'text')
        // cria o título e o adiciona a div
        let h4 = document.createElement('h4')
        h4.innerText = data.nome_funcao
        esq.appendChild(h4)
        // cria o paragrafo e o adiciona a div
        let p = document.createElement('p')
        p.innerText = data.descricao_funcao
        esq.appendChild(p)
        // adiciona ao content
        content.appendChild(esq)
        // cria o lado direito com a imagem e adiciona a div
        let dir = document.createElement('div')
        dir.classList.add('col-12', 'col-lg-6', 'img')
        let img =  document.createElement('img')
        img.src = data.imagem_funcao.url
        img.alt = data.imagem_funcao.alt
        dir.appendChild(img)
        content.appendChild(dir)
        return content
    }
    /** 
     * @returns {void}
     * @param {[]} data
    */
    setContent (content) {
        this.el.conteudo.innerHTML = ''
        for (const item of content) {
            this.el.conteudo.appendChild(item.conteudo)
        }
    }
    limpaMenu(){
        for (const item of this.menuItens) {
            item.menu.classList.remove('active')
        }
    }
    
    /** 
     * @returns {HTMLElement}
     * @param {String} id
    */
   createDivWithId (id) {
        var divId = document.createElement('div')
        divId.id = id
        return divId
    }
    
    /** 
    */
    scrollPageToId () {
        var id = window.location.hash.substr(1)
        var elem = document.getElementById(id)
        window.scrollTo(0, elem.getBoundingClientRect().top)
    }
}

// para mobile

/**@author Vinicius de Santana */
function nextsvg () {
    return '<svg fill="#ff4024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" style="enable-background:new 0 0 477.175 477.175;" xml:space="preserve"><g> <path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5 c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z "/></g></svg>'
}
/**@author Vinicius de Santana @param {Number} tamanho*/
function startMobileMenu (tamanho) {
    // configure dots
    let dots = document.getElementById('dots')
    let dot =[]
    for (let i = 0; i < tamanho; i+=2) {
        dot[i] = document.createElement('div')
        dot[i].classList.add('dot')
        dots.appendChild(dot[i])
    }
    //ativa o primeiro ponto
    dot[0].classList.add('active')
    // configure arrows
    let leftArrow = document.getElementById('left')
    let rightArrow = document.getElementById('right')
    leftArrow.innerHTML = nextsvg()
    rightArrow.innerHTML = nextsvg()
    // and action
    leftArrow.children[0].onclick = arrowMobileAction
    rightArrow.children[0].onclick = arrowMobileAction
}
/**@author Vinicius de Santana */
function arrowMobileAction(){
    let optionSection = document.querySelector('.menu')
    if (this.parentElement.getAttribute('id') == 'left') {
        optionSection.scrollLeft -= optionSection.offsetWidth
        updateDots('prev')
    } else {
        optionSection.scrollLeft += optionSection.offsetWidth
        updateDots('next')
    }
}
/** Atualiza os pontos
 * @author Vinicius de Santana 
 * @param {String} direction - next|prev */
function updateDots(direction) {
    if ((direction != "next") && (direction != "prev")){
        return new TypeError('Argumento precisa ser next|prev')
    }
    let dots = document.querySelectorAll('.dot')
    for (let i = 0; i < dots.length; i++) {
        if (dots[i].classList.contains('active')) {
            if (direction == 'next') {
                const next = i+1
                if (typeof dots[next] != 'undefined') {
                    dots[i].classList.remove('active')
                    dots[next].classList.add('active')
                    return
                }
            } else {
                const prev = i-1
                if (typeof dots[prev] != 'undefined') {
                    dots[i].classList.remove('active')
                    dots[prev].classList.add('active')
                    return
                }
            }
        }
    }
}
/*! end @author Vinicius de Santana*/