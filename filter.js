


let sliderValue =document.getElementById('rangeNumber'); 
console.log(sliderValue); 

function filterDates() { 
    let currentDate = sliderValue.value; 
    let OutputID = document.getElementById('output'); 
    OutputID.innerHTML=currentDate; 
    console.log(currentDate); 
   }
   
   
   sliderValue.addEventListener('change', filterDates)
   


let jsonData = null;


//this line of code defines the size of the difference between the timeline boxes on dates. For example, the higher the pixel per day the greater difference there will be in time// 
const  pixelPerDay= 0.5; 
        
function timelineDifference(array) {
    if (array.dateDifference !== 0 && array.dateDifference != null) {
        return array.dateDifference * pixelPerDay; 
    } 
    return 0;
}



const filterControls = document.getElementById('filterControls');
console.log(filterControls)
const selectBtn = document.getElementById('selectBtn');
console.log(selectBtn);
selectBtn.addEventListener('click', displayDropDown)
checkboxcontainer = document.getElementById('checkboxcontainer');
const downChevron = document.getElementById('downChevron')
console.log(downChevron);
console.log(checkboxcontainer);
function displayDropDown() {
                if (checkboxcontainer.style.display === 'none' || checkboxcontainer.style.display === '') {
                    downChevron.style.transform = 'rotateX(180deg)'
                    checkboxcontainer.style.display = 'block';
                    let labels = document.getElementById('labelsforTimeline')
                    labels.style.display='none'; 
                } else {
                    checkboxcontainer.style.display = 'none';
                    downChevron.style.transform = 'rotateX(0deg)'
                }

            }

fetch('https://raw.githubusercontent.com/mattygreen/jsonData/main/datanewDate.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        jsonData = data;
        newData = jsonData.map(item => ({
            ...item,
            date: new Date(item.date)
        }));

        newData.sort((a, b) => a.date - b.date);

        console.log(newData); 

       function dateDifferenceDays (dateOne, dateTwo) { 
        let MilliSeconds = dateTwo - dateOne; 
        return MilliSeconds / (1000 * 60 * 60 * 24);
       }
       for (let i = 1; i < data.length; i++) {
        /* getting the full year here so that i can filter by it later, rather than filtering by the date, and also getting the the difference between the days so i can create a sense of time change */ 
        let yearOfDate = newData[i].date.getFullYear()
        newData[i].year= yearOfDate; 
         const date1 = newData[i - 1].date;
         const date2 = newData[i].date;     
         const daysDifference = dateDifferenceDays(date1, date2);
         console.log(daysDifference); 
         newData[i-1].dateDifference = daysDifference;
         console.log(newData[i])
}
        console.log(newData); 


        createTimeLineStructure(newData);
        createBootstrapCarousel(newData);

        const checkboxes = document.querySelectorAll('#checkboxcontainer input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => filterAndRenderComponents(newData));
        });

        let sliderValue =document.getElementById('rangeNumber'); 
        console.log(sliderValue); 

        function filterDates() { 
        let currentDate = parseInt(sliderValue.value); 
        let OutputID = document.getElementById('output'); 
        OutputID.innerHTML=currentDate; 
        console.log(currentDate); 
   }
   
   
   sliderValue.addEventListener('change',() => filterAndRenderComponents(newData)); 
   
    
        function filterAndRenderComponents(data) {
            console.log(Array.isArray(data)); 
            console.log(data); 
            const checkboxes = document.querySelectorAll('#checkboxcontainer input[type="checkbox"]:checked');
            const selectedCategories = Array.from(checkboxes).map(checkbox => checkbox.value);
            console.log(selectedCategories); 
            // Filter the data based on selected categories
              let currentDate = sliderValue.value; 
                let OutputID = document.getElementById('output'); 
        OutputID.innerHTML=currentDate; 
        console.log(currentDate)

            const filteredData = data.filter(item => selectedCategories.includes(item.theme) && item.year <= currentDate ); 

            console.log(filteredData); 
            createTimeLineStructure(filteredData); 
            createBootstrapCarousel(filteredData);
            
        }
         

        // once the modal boxes and boostrap carousels have been created, now add the intersection observers onto the entries. The code for this was influenced by this Tutorial // 
        let timelineboxselectorAnimate = document.querySelectorAll('.timelinebox');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle('show', entry.isIntersecting);
            });
        }, {
            threshold: 0.4
        });

        timelineboxselectorAnimate.forEach(card => {
            observer.observe(card);
        });

        //create the tab indexes for the page// 
        let finalindex;

        const timelineboxselector = document.querySelectorAll('.timelinebox');
        timelineboxselector.forEach((entry, index) => {
            entry.setAttribute('tabindex', index + 1);
            console.log(index)
            finalindex = index;
        });
        console.log(finalindex)
        let returnArrowIndex = finalindex + 1;
        console.log(returnArrowIndex);

        let reverseButton1 = document.getElementById('reverseButton1');
        reverseButton1.setAttribute('tabindex', returnArrowIndex);
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                let focusedItem = document.activeElement;

                if (focusedItem && focusedItem.classList.contains('timelinebox')) {
                    const modalId = focusedItem.getAttribute('data-id');

                    if (modalId) {
                        showModal(modalId);
                    }
                }
            }
        });

    })
    .catch(error => {
        console.error('the data failed to load', error);
    });

// building open and close functions for modals so that they are accessible, using Smashing Magazine best practice https://www.smashingmagazine.com/2014/09/making-modal-windows-better-for-everyone/// 


var lastFocus;

function showModal(modalid) {
    let modal = document.getElementById(modalid);
    modal.style.display = 'flex';
    lastFocus = document.activeElement;
    modal.setAttribute('tabindex', '0');
    modal.focus()


}

function closeModal() {

    let modals = document.querySelectorAll('.mymodal');
    modals.forEach(item => {
        item.style.display = 'none';
    });
    lastFocus.focus()

}



function createTimeLineStructure(data) {

    const listContainer = document.getElementById('listContainer');
    const modalsContainer = document.getElementById('modalsContainer');
    listContainer.innerHTML=''; 
    modalsContainer.innerHTML=''; 

    data.forEach(item => {
        if (item.theme!== 'labels') {
        const timelineTemplate = document.querySelector("[data-timeLine-template]")
        console.log(timelineTemplate);
        const timelineCard = timelineTemplate.content.cloneNode(true).children[0];
        console.log(timelineCard);
        const timelineTitle = timelineCard.querySelector('.timelineTitle');
        console.log(timelineTitle);
        timelineTitle.textContent = item.title;
        timelineCard.id = `timelinebox${item.id}`;
        timelineCard.style.marginBottom = timelineDifference(item) + 'px'; 

        ariatext = 'navigation to modal box transcripts for ';
        ariatitle = `${item.title}`;
        ariaLabelAttribute = ariatext + ariatitle;

        dataidlabel = `modal${item.id}`;
        timelineCard.setAttribute('data-id', dataidlabel);
        timelineCard.setAttribute('role', 'button');
        timelineCard.setAttribute('ariallabel', ariaLabelAttribute);

        timelineCard.style.cursor = 'pointer';
        timelineCard.addEventListener('click', function () {
            showModal(`modal${item.id}`);
        });
        listContainer.appendChild(timelineCard);

        // Create modal structure
        const modalTemplate = document.querySelector("[data-modal-template]")
        console.log(modalTemplate);
        const modalContentBox = modalTemplate.content.cloneNode(true).children[0];
        console.log(modalContentBox);
        modalsContainer.appendChild(modalContentBox);
        modalContentBox.id = `modal${item.id}`;
        modalContentBox.setAttribute('aria-hidden', 'true');
        const modalTitle = modalContentBox.querySelector('.titleForModal');
        modalTitle.textContent = item.title;
        console.log(modalContentBox);
        const closeButton = document.createElement('span');
        closeButton.className = 'closeBtn';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', closeModal)
        modalTitle.textContent = item.title;
        const imageCarouselContainerNew = modalContentBox.querySelector('[data-carousel-container]');
        console.log(imageCarouselContainerNew);
        imageCarouselContainerNew.id = `ImageContainer${item.id}`;

        console.log(modalContentBox);


        const modalBody = modalContentBox.querySelector('[data-modal-body]')
        modalBody.textContent = item.content;

        modalTitle.appendChild(closeButton);
        modalsContainer.appendChild(modalContentBox);


        //this section of the code checks whether there's an audio file within the JSON which has been fetched // 
        if (!item.hasOwnProperty('audiofile') || item.audiofile === "") {
            console.log('There is no audio file');
        }
        else {
            const audiotitle = document.createElement('h3')
            audiotitle.innerText = `${item.audiocontent}`;
            const audioTag = document.createElement('audio');
            const audiotagsource = document.createElement('source');
            audiotagsource.src = `${item.audiofile}`;
            audioTag.controls = true;
            modalBody.appendChild(audiotitle);
            modalBody.appendChild(audioTag);
            audioTag.appendChild(audiotagsource);
        }

        if (item.theme =='anti-racism') {
            timelineCard.style.borderLeftColor='turquoise'
        }
        else if (item.theme=='relations') {
            timelineCard.style.borderLeftColor='red'

        }
        else if (item.theme=='colour') {
            timelineCard.style.borderLeftColor='green'

        }
        else if (item.theme=='emigration') {
            timelineCard.style.borderLeftColor='yellow'

        }
        else if (item.theme=='historical') {
            timelineCard.style.borderLeftColor='brown'

        }
        else if (item.theme=='art') {
            timelineCard.style.borderLeftColor='blue'

        }
        else if (item.theme=='legislation') {
            timelineCard.style.borderLeftColor='grey'

        }
        else if (item.theme=='police') {
            timelineCard.style.borderLeftColor='darkolivegreen'

        }
        else if (item.theme=='riots') {
            timelineCard.style.borderLeftColor='purple'

        }
        else if (item.theme=='sports') {
            timelineCard.style.borderLeftColor='lightblue'

        }
        else if (item.theme=='radio') {
            timelineCard.style.borderLeftColor='darkred'

        }
        else if (item.theme=='education') {
            timelineCard.style.borderLeftColor='lightpink'

        }
     
    } 

    else  {
    let labelHolder = document.createElement('div'); 
    labelHolder.className='timeLabel'; 
    let titleForLabel= document.createElement('h3'); 
    titleForLabel.textContent= item.title; 
    listContainer.appendChild(labelHolder);
    labelHolder.appendChild(titleForLabel); 
}

    });


    window.onclick = function (event) {
        data.forEach(item => {
            const modal = document.getElementById(`modal${item.id}`);
            if (event.target == modal) {
                closeModal()
            }
        });
    }


    // add another event listener here for the for the use of the escape button close the modal box 
}


// this function and bootstrap code takes the Bootstrap code found on this website, and then builds an image carousel on the basis of the data that is pulled from the JSON// 

function createBootstrapCarousel(data) {

    data.forEach(item => {
        if (item.theme!== 'labels') {
        const carouselBase = document.getElementById(`ImageContainer${item.id}`);

        if (!item.TranscriptImages || item.TranscriptImages.length === 0) {
            const noTranscripts = document.createElement('div');
            noTranscripts.className = 'NoTranscripts';
            const noTranscriptsTitle = document.createElement('h3');
            noTranscriptsTitle.innerHTML = 'There are currently no transcripts for this entry';
            // add a picture that will show no transcript 
            noTranscripts.appendChild(noTranscriptsTitle);
            carouselBase.appendChild(noTranscripts);

            console.log('There are no images in this file yet');
        } else {
            // Create carousel container
            const divCreator = document.createElement('div');
            divCreator.className = 'carousel slide';
            divCreator.id = `carouselExampleControls${item.id}`;
            divCreator.setAttribute('data-ride', 'carousel');

            const divInner = document.createElement('div');
            divInner.className = 'carousel-inner';
            divCreator.appendChild(divInner);

            carouselBase.appendChild(divCreator);

            // Add carousel items
            item.TranscriptImages.forEach((transcriptItem, index) => {
                const carouselItemDiv = document.createElement('div');
                carouselItemDiv.className = 'carousel-item';
                if (index === 0) {
                    carouselItemDiv.classList.add('active');
                }

                const imgEntry = document.createElement('img');
                imgEntry.src = transcriptItem.image;
                imgEntry.className = 'd-block w-100'; // Fix the class name typo

                // Handle missing alt text
                if (!transcriptItem.alt || transcriptItem.alt.length === 0) {
                    imgEntry.alt = 'This image is missing alt text';
                    console.log('This image is missing alt text');
                } else {
                    imgEntry.alt = transcriptItem.alt;
                }
                carouselItemDiv.appendChild(imgEntry);
                divInner.appendChild(carouselItemDiv);
            });

            // https://getbootstrap.com/docs/4.0/components/carousel  i used this as the basis to develop the code for this section - this basically builds the html and cc classes that are visible in this section, but does it dynamically, so it takes into account the number of images or if they are not any images// 
            const carouselNext = document.createElement('a');
            carouselNext.className = 'carousel-control-next';
            carouselNext.href = `#carouselExampleControls${item.id}`;
            carouselNext.role = 'button';
            carouselNext.setAttribute('data-slide', 'next');

            const spanForNext = document.createElement('span');
            spanForNext.className = 'carousel-control-next-icon';
            spanForNext.setAttribute('aria-hidden', 'true');
            const spanForNextTwo = document.createElement('span');
            spanForNextTwo.className = 'sr-only';
            spanForNextTwo.innerText = 'Next';

            const carouselPrev = document.createElement('a');
            carouselPrev.className = 'carousel-control-prev';
            carouselPrev.href = `#carouselExampleControls${item.id}`;
            carouselPrev.role = 'button';
            carouselPrev.setAttribute('data-slide', 'prev');

            const spanForPrev = document.createElement('span');
            spanForPrev.className = 'carousel-control-prev-icon';
            spanForPrev.setAttribute('aria-hidden', 'true');
            const spanForPrevTwo = document.createElement('span');
            spanForPrevTwo.className = 'sr-only';
            spanForPrevTwo.innerText = 'Previous';
            carouselPrev.appendChild(spanForPrev);
            carouselPrev.appendChild(spanForPrevTwo);
            carouselNext.appendChild(spanForNext);
            carouselNext.appendChild(spanForNextTwo);

            divCreator.appendChild(carouselPrev);
            divCreator.appendChild(carouselNext);
        }
    }
    });

}



const reverseButtons = document.querySelectorAll('.reversebutton');


document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {

        let focusedItem = document.activeElement;
        if (focusedItem && focusedItem.id === 'reverseButton1') {
            window.location.href = 'index.html';
        }
    }


});

reverseButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});

const downArrow = document.getElementById('downArrow');

// Function to check if user is at the bottom of the page. This returns whether it is or not which can then be used in a conditional statement// 
function isAtBottomOfScreen() {
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
}

// Event listener for scroll


/* the function below compares two different arrays and then gives a number value of the difference between these arrays. I have done this so that I can space the timeline on the basis of the difference between the years, to give it a chronological and temporal feel*/


function getDifferentinYears(array) {
    const getYears = array.map(function (element) {
        let numberYears = element.date
        return numberYears

    })

    let numberYears = getYears.map(Number);
    console.log(numberYears);

    /*    
        console.log(getYears); 
        console.log(getYears[0]); 
        This found the numbers as strings, so I converted them to numbers seen above//console.log(typeof(getYears[0])); 
    
    */
    let differenceArray = numberYears.map(function (element, index, array) {

        let difference = array[index + 1] - array[index];
        return difference
    });
    return differenceArray;
}

// create a function that can decide the size of the timeline//

/*There are a few ideas here that i need to fleshout
1. the size of the timeline is x
x=numberofentries*spaceforentries*
spaceforentries=boxsize+reasonablegapbetweenthem

Do we want the entries to change because that will then change the formula?

*/



// this section creates the event listeners for the slider, search bar and date range// 





