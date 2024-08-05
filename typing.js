const words = 'in one good real one not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set up number part form want against great problem can because head so first this here would course become help year first end want both fact public long word down also long for without new turn against the because write seem line interest call not if line thing what work people way may old consider leave hold want life between most place may if go who need fact such program where which end off child down change to from people high during people find to however into small new general it do that could old for last get another hand much eye great no work and with but good there last think can around use like number never since world need what we around part show new come seem while some and since still small these you general which seem will place come order form how about just also they with state late use both early too lead general seem there point take general seem few out like might under if ask while such interest feel word right again how about system such between late want fact up problem stand new say move a lead small however large public out by eye here over so be way use like say people work for since interest so face order school good not most run problem group run she late other problem real form what just high no man do under would to each too end point give number child through so this large see get form also all those course to work during about he plan still so like down he look down where course at who plan way so since come against he all who at world because while so few last these mean take house who old way large no first too now off would in this course present order home public school back own little about he develop of do over help day house stand present another by few come that down last or use say take would each even govern play around back under some line think she even when from do real problem between long as there school do as mean to all on other good may from might call world thing life turn of he look last problem after get show want need thing old other during be again develop come from consider the now number say life interest to system only group world same state school one problem between for turn run at very against eye must go both still all a as so after play eye little be those should out after which these both much house become both school this he real and may mean time by real number other as feel at end ask plan come turn by all head increase he present increase use stand after see order lead than system here ask in of look point little too without each for both but right we come world much own set we right off long those stand go both but under now must real general then before with much those at no of we only back these person plan from run new as own take early just increase only look open follow get that on system the mean plan man over it possible if most late line would first without real hand say turn point small set at in system however to be home show new again come under because about show face child know person large program how over could thing from out world while nation stand part run have look what many system order some one program you great could write day do he any also where child late face eye run still again on by as call high the must by late little mean never another seem to leave because for day against public long number word about after much need open change also'.split(' ');
const wordCount = words.length;
const gameTime = 30 * 1000;
window.timer = null;
window.gamestart = null;

function rand(){
    const randind = Math.ceil(Math.random() * wordCount)
    return words[randind -1];
}

function addClass(el,name){
el.className += ' '+ name ;
}


function removeClass(el,name){
    el.className = el.className.replace(name,'');
}

function format(word){
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
    document.getElementById('words').innerHTML = '';
    for(let i=0;i<200;i++){
        document.getElementById('words').innerHTML += format(rand());
    }
   addClass(document.querySelector('.word'),'current')
   addClass(document.querySelector('.letter'),'current')
   document.getElementById('info').innerHTML = gameTime /1000 +'';
   window.timer = null;
   window.gamestart = null;
}


function wpm() {
    const wrd = [...document.querySelectorAll('.word')];
    const lastWord = document.querySelector('.word.current');
    const lastWordIndex = wrd.indexOf(lastWord);
    const typed = wrd.slice(0,lastWordIndex);
    const correctword = typed.filter(word =>{
        const ltrs = [...word.children];
        const inc = ltrs.filter(letter => letter.className.includes('incorrect'));
        const cor = ltrs.filter(letter => letter.className.includes('correct'));
        return inc.length === 0 && cor.length === ltrs.length;
    });
    return correctword.length / gameTime * 60000;
}


function gameover(){
    clearInterval(window.timer);
    addClass(document.getElementById('game'),'over');
    const result = wpm();
    document.getElementById('info').innerHTML = `WPM : ${result}`;
}

document.getElementById('game').addEventListener('keyup',ev =>{
    const key= ev.key;
    const curword = document.querySelector('.word.current');
    const curletter=document.querySelector('.letter.current');
    const expected = curletter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBSapace = key === 'Backspace';
    const isFirst = curletter === curword.firstChild;




    if(document.querySelector('#game.over')){
        return;
    }
    

    if(!window.timer && isLetter){
        window.timer = setInterval(()=>{
            if(!window.gamestart){
                window.gamestart = new Date().getTime();
            }
            const curTime = new Date().getTime();
            const timePassed = curTime-window.gamestart;
            const sPassed = Math.round(timePassed / 1000); 
            const sLeft = (gameTime /1000) -sPassed;
            if(sLeft <= 0){
                gameover();
                return;
            }
            document.getElementById('info').innerHTML = sLeft + '';
        },1000);
    }

    //letter movement
    if (isLetter){
        if(curletter){
            addClass(curletter,key === expected ? 'correct' : 'incorrect');
            removeClass(curletter,'current');
            if(curletter.nextSibling){
                addClass(curletter.nextSibling,'current');
            }
            
        }
        else{
            const newletter = document.createElement('span');
            newletter.innerHTML = key;
            newletter.className = 'letter incorrect extra';
            curword.appendChild(newletter);
        }
    }

    //space movement
    if(isSpace){
        if(expected !== ' '){
            const letterinvalid =[...document.querySelectorAll('.word.current .letter:not(.correct)')];
            letterinvalid.forEach(letter =>{
                addClass(letter,'incorrect');
            });
        }
        removeClass(curword,'current');
        addClass(curword.nextSibling,'current');
        if(curletter){
            removeClass(curletter,'current');
        }
        addClass(curword.nextSibling.firstChild,'current');
    }

    //backapace movement
    if(isBSapace){
        if(curletter && isFirst){
            //make prevoius word current ,last letter current
            removeClass(curword,'current');
            addClass(curword.previousSibling,'current');
            removeClass(curletter,'current');
            addClass(curword.previousSibling.lastChild,'current');
            removeClass(curword.previousSibling.lastChild,'incorrect');
            removeClass(curword.previousSibling.lastChild,'correct');
        }
        if(curletter && !isFirst){
            //move back one letter, invalidate letter
            removeClass(curletter,'current');
            addClass(curletter.previousSibling,'current');
            removeClass(curletter.previousSibling,'incorrect');
            removeClass(curletter.previousSibling,'correct');
        }
         if(!curletter){
            addClass(curword.lastChild,'current');
            removeClass(curword.lastChild,'incorrect');
            removeClass(curword.lastChild,'correct');
        }
    }
    //move lines
    if(curword.getBoundingClientRect().top > 280){
        const words = document.getElementById('words');
        const margin= parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin-35) + 'px';
    }
    if(curword.getBoundingClientRect().top < 100 && isBSapace){
        const words = document.getElementById('words');
        const margin= parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin+35) + 'px';
    }


    //move cursor 
    const nextletter = document.querySelector('.letter.current');
    const nextword = document.querySelector('.word.current');
    const cursor =document.getElementById('cur');
    cursor.style.top=(nextletter || nextword).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left=(nextletter || nextword).getBoundingClientRect()[nextletter? 'left' : 'right'] + 'px';

});

document.getElementById('start').addEventListener('click', ()=>{
    clearInterval(window.timer);
    removeClass(game,'over');
    newGame();
});

const wth = window.screen.width;
if (wth< 600){
    document.getElementById('err').style.display = 'block';
    document.getElementById('game').style.display ='none';
    document.getElementById('header').style.display ='none';
}
newGame();

