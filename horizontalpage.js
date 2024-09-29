let arrowLeft = document.getElementById('arrowleft'); 
arrowLeft.addEventListener('click', moveLeft)

let arrowRight =document.getElementById('arrowright'); 
arrowRight.addEventListener('click', moveRight)
const translatePattern = /translate\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)/;
const step = 100; // Step size for moving
function moveLeft() {
    console.log('Moving left step clicks');
    adjustTranslation(-step);
}

function moveRight() {
    console.log('Moving right step clicks');
    adjustTranslation(step);
}

function adjustTranslation(StepInput) {
const element = document.getElementById('movingTool2');

let transform = element.getAttribute('transform');
console.log(typeof(transform)); 
    console.log('Current transform:', transform);


    const translatePattern = /translate\(\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)/;
    let translateMatch = transform.match(translatePattern);

    if (!translateMatch) {
        console.error('No valid translate function found in the transform attribute. Adding one.');
    
        transform += ` translate(${StepInput}, 0)`;
        console.log('Updated transform:', transform);
        element.setAttribute('transform', transform);
        return;
    }

    let x = parseFloat(translateMatch[1]);
    let y = parseFloat(translateMatch[2]);

    console.log('Current X:', x, 'Current Y:', y)
    x += StepInput;
    const newTransform = transform.replace(translatePattern, `translate(${x}, ${y})`);
    console.log('New transform:', newTransform);

    element.setAttribute('transform', newTransform);
}



//this section of code moves the viewport width ways// 
// Get the container element
const container = document.querySelector('.container');

arrowLeft.addEventListener('click', () => {
    container.scrollTo({
        left: container.scrollLeft - window.innerWidth * 0.3,
        behavior: 'smooth'
    });
});

// Scroll the container to the right
arrowRight.addEventListener('click', scrollToRight); 

arrowLeft.addEventListener('click', scrollToLeft); 
    
function scrollToLeft () {
container.scrollTo({
    left: container.scrollLeft - window.innerWidth * 0.3,
    behavior: 'smooth'
});
}

function scrollToRight () {
container.scrollTo({
    left: container.scrollLeft + window.innerWidth * 0.3,
    behavior: 'smooth'
});
}



container.addEventListener('scroll', showArrows);

// this block of codes means that when the page loads you can't see the left hand button) 

function showArrows () { 
    if (container.scrollLeft > 0) {
    arrowLeft.style.display = 'block';
    } else {
     arrowLeft.display = 'none';
    }
}


// this creates an event listener allowing for the page to move left and right// 

document.addEventListener('keydown', moveWithArrow);

function moveWithArrow (click) { 
    if (click.key === 'ArrowLeft') { 
        moveLeft();
        scrollToLeft(); 
        console.log('it moved left')
    }
    else if (click.key ==='ArrowRight') {
    moveRight();
    scrollToRight();  
    console.log('it moved right')
    }
}


//code for the hamburger menu //

const hamburgerBtn = document.getElementById('hamburgerBtn'); 
const hamburgerClose = document.getElementById('hamburgerClose'); 
const navMenu = document.querySelector('.navMenu'); 
console.log(navMenu); 
console.log(hamburgerBtn); 
console.log(hamburgerClose); 


window.addEventListener('resize', (event) => { 
    if (window.innerWidth > 600) { 
        hamburgerBtn.style.display = 'none'; 
        hamburgerClose.style.display = 'none'; 
        navMenu.style.display = 'flex';  
    } else {
        hamburgerBtn.style.display = 'block'; 
        hamburgerClose.style.display = 'none';
        navMenu.style.display = 'none';  
    }
});

hamburgerBtn.addEventListener('click', (event) => {
    if (window.innerWidth < 600) {
        if (navMenu.style.display === 'none' || navMenu.style.display === '') {
            navMenu.style.display = 'flex';
            hamburgerBtn.style.display = 'none';
            hamburgerClose.style.display = 'block';
        }
    }
});

hamburgerClose.addEventListener('click', (event) => { 
    if (window.innerWidth < 600) {
        hamburgerClose.style.display = 'none';
        navMenu.style.display = 'none';
        hamburgerBtn.style.display = 'block';
    }
});



// until the rest of the pages are developed, i am adding an event listener to all the cards so they take to the one developed side // 

let timelineCards = document.querySelectorAll('.section'); 
console.log(timelineCards); 

timelineCards.forEach(item => { 
    if (item.id !== 'section13') { 
        item.addEventListener('click', (event) => {
            window.location.href = 'firstpage.html';
        });
    } else { 
        item.addEventListener('click', (event) => { 
            window.location.href = 'filterpage.html';
        });
    }
});
