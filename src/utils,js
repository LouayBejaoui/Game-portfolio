export function displayDialogue(text , onDisplayEnd){
    const dialogueStyle = document.getElementById('text-container');
    const dialogue = document.getElementById('dialogue');
    dialogueStyle.style.display="block";

    let i=0;
    let te ='';
    const interfalRef = setInterval(()=>{
        if (i<text.length){
            te +=text[i];
            document.getElementById('dialogue').innerHTML=te;

            i++ ; 
            return
        }
        clearInterval(interfalRef);
    }, 5)

const closeBtn = document.getElementById('closeButton');

function onCloseBtn(){
    onDisplayEnd();
    dialogueStyle.style.display ='none';
    dialogue.innerHTML='';
    clearInterval(interfalRef);
    closeBtn?.removeEventListener('click', onCloseBtn);
}

closeBtn.addEventListener('click', onCloseBtn);


}

export function setCamScale(k) {
    const resizeFactor = k.width() / k.height();
    if (resizeFactor < 1) {
      k.camScale(k.vec2(1));
    } else {
      k.camScale(k.vec2(1.5));
    }
  }