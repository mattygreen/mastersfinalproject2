
let jsonData = null;

const  pixelPerDay= 0.1; 
        
function timelineDifference(array) {
    if (array.dateDifference !== 0 && array.dateDifference != null) {
        return array.dateDifference * pixelPerDay; 
    } 
    return 0;
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
         const date1 = newData[i - 1].date;
         const date2 = newData[i].date;     
         const daysDifference = dateDifferenceDays(date1, date2);
         console.log(daysDifference); 
         newData[i-1].dateDifference = daysDifference;
         console.log(newData[i])
}
        console.log(newData); 

        // this section filters so that it only the data from the site// 
        const filteredNewData = newData.filter(item => item.theme === 'education' || item.theme === 'labels')
        console.log(filteredNewData); 
        /*the next lines of code workout a formula to create the difference between the timeline elements to show progression of time
        let firstElement = newData[0]; 
        let firstElementDate= firstElement.date; 
        console.log(firstElement); 

        let lastElement = newData.pop(); 
        console.log(lastElement); 
        lastElementDate = lastElement.date; 
        let totalSize = dateDifferenceDays(firstElementDate, lastElementDate); 
        console.log(totalSize); 
        I've commented out this code because the lastElement.pop removes the last element of the array, and I wanted to keep this here, so that I can refer back to but it deos result in significant code. 
        */ 

        let currentGap = 30; 
        let heightofTimelineBox =200; 
        function heightofTimeline(array) { 
            let arraylength= array.length; 
            return arraylength* (heightofTimelineBox+currentGap); 

        }
       let currentHeight = heightofTimeline(newData)
        console.log(currentHeight); 
        // so in this exemplar Timeline the difference between the different Timeline eleemnts in total is about 5000 days we, therefore, don't want to make the timeline too long - we could do 0.5 px per day. //
        

        





        createTimeLineStructure(filteredNewData);
        createBootstrapCarousel(filteredNewData);

        // once the modal boxes and boostrap carousels have been created, now add the intersection observers onto the entries. The code for this was influenced by this Tutorial https://www.youtube.com/watch?v=2IbRtjez6ag // 
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



// this code was partly influenced by this tutorial which shows how to manipulate the DOM with Javascript https://agirlcodes.medium.com/build-a-crud-todo-app-with-vanilla-javascript-and-fetch-api-44a664c0de52 creating dynamic apps// 

function createTimeLineStructure(data) {
    const listContainer = document.getElementById('listContainer');
    listContainer.innerHTML=''; 
    const modalsContainer = document.getElementById('modalsContainer');
    modalsContainer.innerHTML=''; 

    data.forEach(item => {


        // the coding method for this section was learned from this tutorial. In this section, the code is checking what the theme is and if the theme is not labels, which are time labels within the json document, it will then create create the modal box and the button that was clicked// 
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
    }
    else { 

        //this code just creates a div then imbeds on 
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
window.addEventListener('scroll', () => {

    if (isAtBottomOfScreen()) {
        downArrow.style.display = 'none';
    } else {
        downArrow.style.display = 'block';
    }
});

