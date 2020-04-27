# Contador relógio regressivo
dada uma determinada data no javascript inicia um contador regressivo
pode ser inicializado vários contadores em uma mesma página

## Determinando data no javascript
<code>
let finishDate = new Date('2020-04-29T09:00:00') // ano, dia, mes, hora, minuto, segundo
div = document.querySelector('.watch')
countdown = new Countdown(div, finishDate)
</code>

## Determinando tamanho no sass
o height será definido para 1/5 do width
<code>
$width: 500px;
</code>

## compile sass
<code>
sass --watch watch-countdown/assets/style.scss:watch-countdown/assets/style.css
</code>

Enjoy!
CC BY-NC