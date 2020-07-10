/*! Cria o componete e controla a mudança do conteúdo central */
document.addEventListener('DOMContentLoaded', ()=>{
    fetch('https://dnaformarketing.com.br/stant/wp-json/wp/v2/funcionalidade/')
    .then(res => res.json())
    .then(json => initProdutividade(json))
})
/** @author Vinicius de Santana @param {[{}]} json */
function initProdutividade (json) {
    //cria uma div para cada item e a adiciona ao dom,
    //retorna o array com a div anexada
    let allItens = createAllItens(json)
    // ativa o primeiro item e seta imagem central
    allItens[0].div.classList.add('active')
    let centerContent = document.getElementById('center-content')
    let titleContent = document.getElementById('title-content')
    centerContent.setAttribute('src', allItens[0].acf.funcoes[0].imagem_funcao.url)
    titleContent.innerHTML = allItens[0].acf.descricao
    //adiciona o evento de click a todos
    //o evento não está em uma função separada pq perde a referência de allItens
    for (let i = 0; i < allItens.length; i++) {
        allItens[i].div.onclick = function() {
            // remove active de todas as classes
            for (let j = 0; j < allItens.length; j++) {
                allItens[j].div.classList.remove('active')
                // na referencia a div do click, coloca a imagem no centro
                // e o texto no h2
                if (allItens[j].div.innerText == this.innerText){
                    centerContent.setAttribute('src', allItens[j].acf.funcoes[0].imagem_funcao.url)
                    titleContent.innerHTML = allItens[j].acf.descricao
                }
            }
            //ativa a div do click
            this.classList.add('active');
        }
    }
    //inicia as configurações de mobile
    if (window.innerWidth < 992) {
        startMobileMenu(json.length)
    }
}
/** @author Vinicius de Santana @param {[{}]} json */
function createAllItens (json) {
    let esq = document.getElementById('esq')
    let dir = document.getElementById('dir')
    for (let i = 0; i < json.length; i++) {
        json[i].div = createItem(json[i])
        json[i].div.innerHTML += nextsvg()
        if (i%2 && !(window.innerWidth < 992)) {
            dir.appendChild(json[i].div)
        }
        else {
            esq.appendChild(json[i].div)
        }
    }
    return json
}
/** @author Vinicius de Santana @param {{}} data */
function createItem (data) {
    let divElem = document.createElement('div')
    divElem.setAttribute('class', 'col-6 col-lg-12')
    //imagem quando ativo
    let imgElemAtivo = document.createElement('img')
    imgElemAtivo.setAttribute('src', data.acf.icone_ativo.url)
    imgElemAtivo.setAttribute('class', 'ativo')
    divElem.appendChild(imgElemAtivo)
    //imagem quando inativo
    let imgElemInativo = document.createElement('img')
    imgElemInativo.setAttribute('src', data.acf.icone_inativo.url)
    imgElemInativo.setAttribute('class', 'inativo')
    divElem.appendChild(imgElemInativo)
    //paragrafo
    let pElem = document.createElement('p')
    pElem.innerText = data.title.rendered
    divElem.appendChild(pElem)
    return divElem
}
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
    let optionSection = document.getElementById('esq')
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
/*! /end Cria o componete e controla a mudança do conteúdo central*/