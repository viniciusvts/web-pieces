/**
 * classe que define o countdown
 * @param {HTMLElement} _div div do contator que possui a estrutura esperada
 * @param {Date} _finishDate data final do contator
 * @author Vinicius de Santana
 */
function Countdown(_div, _finishDate) {
    if ((_finishDate.getTime() - Date.now()) < 0){
        throw new Error('Data já passou')
    }
    if(typeof _div == 'undefined' || typeof _finishDate == 'undefined') {
        throw new  TypeError('parametro devem ser definidos')
    }
    this.finishDate = _finishDate
    try {
        this.divDia = _div.querySelector('.day')
        this.divHora = _div.querySelector('.hour')
        this.divMin = _div.querySelector('.min')
        this.divSec = _div.querySelector('.sec')
    } catch (error) {
        throw new TypeError('parametro não é uma div válida')
    }
    this.setCountdown = _setCountdown
    setInterval(()=>{ this.setCountdown(this.finishDate) }, 1000) 

    /**
     * função seta o horário no front partir de uma data
     * @param {Date} _toThisdate 
     * @author Vinicius de Santana
     */
    function _setCountdown(_toThisdate) {
        // define os valores em milisegundos
        const secInMilli = 1000
        const minInMilli = secInMilli * 60
        const hourInMilli = minInMilli * 60
        const dayInMilli = hourInMilli * 24
        // define a data atual e obtem a diferença
        let dateDiference = _toThisdate.getTime() - Date.now()
        // obtem quantos dias faltam e diminui da diferença
        const days = Math.floor(dateDiference / dayInMilli)
        dateDiference = dateDiference - (days * dayInMilli)
        // obtem quantas horas faltam e diminui a diferença
        const hours = Math.floor(dateDiference / hourInMilli)
        dateDiference = dateDiference - (hours * hourInMilli)
        // obtem quantas minuutos faltam e diminui a diferença
        const min = Math.floor(dateDiference / minInMilli)
        dateDiference = dateDiference - (min * minInMilli)
        // obtem quantas segundos faltam e diminui a diferença
        const sec = Math.floor(dateDiference / secInMilli)
        // printa no contador
        this.divDia.innerText = days
        this.divHora.innerText = hours
        if(hours < 10) this.divHora.prepend('0')
        this.divMin.innerText = min
        if(min < 10) this.divMin.prepend('0')
        this.divSec.innerText = sec
        if(sec < 10) this.divSec.prepend('0')
    }
}

window.addEventListener('load', function() {
    let finishDate = new Date('2020-04-29T09:00:00') // ano, dia, mes, hora, minuto, segundo
    div = document.querySelector('.watch')
    countdown = new Countdown(div, finishDate)
})