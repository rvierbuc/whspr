import React, { useState } from 'react';
import WaveSurferComponent from './WaveSurfer';
import { IoIosArrowUp } from 'react-icons/io';
import { IoIosArrowDown } from 'react-icons/io';

export const VerticalCarousel = ({ posts, leadingText, audioContext }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const onHome = true;
  // determine which items appear above the active item
  const halfwayIndex = Math.ceil(posts.length / 2);
  // determine the height/spacing of each item
  const itemHeight = 52;
  // determine at what point an item is moved from the top to the bottom
  const shuffleThreshold = halfwayIndex * itemHeight;
  // determine which items should be visible. Prevents "ghost" transitions
  const visibleStyleThreshold = shuffleThreshold / 2;

  const handleClick = (direction) => {   
    setActiveIndex((prevIndex) => {
      if (direction === 'next') {
      // If we are at the end of the carousel, set the index to 0
        if (prevIndex + 1 > posts.length - 1) {
          return 0;
        }
        // Otherwise increment the index by 1
        return prevIndex + 1;
      }

      // If we are on the first slide and click previous, go to the last slide
      if (prevIndex - 1 < 0) {
        return posts.length - 1;
      }
      // We are moving backwards in the carousel, decrement index by 1
      return prevIndex - 1;
    });
  };

  const determinePlacement = (itemIndex) => {
    // Position item in the center of list
    if (activeIndex === itemIndex) { return 0; }

    // Targeting items in the second part of the list
    if (itemIndex >= halfwayIndex) {
      // If moving backwards from index 0 to the last item, move the value downwards
	  if (activeIndex > (itemIndex - halfwayIndex)) {
	    return (itemIndex - activeIndex) * itemHeight;
	  } else {
        // Negative value moves upwards towards the top of the list
	    return -((posts.length + activeIndex) - itemIndex) * itemHeight;
	  }
    }

    // Spacing for items after the current index
    if (itemIndex > activeIndex) {
	  return (itemIndex - activeIndex) * itemHeight;
    }

    // Spacing for items before the current index
    if (itemIndex < activeIndex) {
      // If passing the negative threshold, move into a positive positioning
	  if ((activeIndex - itemIndex) * itemHeight >= shuffleThreshold) {
	    return (posts.length - (activeIndex - itemIndex)) * itemHeight;
	  }
      // Move into a negative positioning
	  return -(activeIndex - itemIndex) * itemHeight;
    }

  };
  return (
		<div className="outer-container">
	    <div className="carousel-wrapper">
				<IoIosArrowUp
          type="button"
          className="carousel-button prev"
          onClick={() => handleClick('prev')}
        >
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-arrow-up-circle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
          </svg> */}
        </IoIosArrowUp>

        <div className="carousel">
    <div className="leading-text">
    <img 
            id='lead-img'
            src={require('../style/whspr-your.png')}
            width={'auto'}
            height={'200px'}
            alt="whspr logo"
            onClick={() => handleAuth()}
            style={{ cursor: 'pointer' }}
            />
      
    </div>
    <div className="slides">
      <div className="carousel-inner">
        {posts.map((item, i) => (
          <button
            type="button"
            onClick={() => setActiveIndex(i)}
            //className={`carousel-item-${Math.abs(determinePlacement(i)) <= visibleStyleThreshold ? 'visible' : '' }`}
            className='carousel-item active'
            key={item.id}
            style={{ transform: `translateY(${determinePlacement(i)}px)` }}
          >
            {item.introLine}
          </button>
        ))}
      </div>
    </div>
  </div>

				
			<div className="content">
      {/* this is where the wavesurfer will go pass down the post */}
      <WaveSurferComponent 
      audioUrl={posts[activeIndex].soundUrl}
      postId={posts[activeIndex].id}
      postObj={posts[activeIndex]}
      userId={posts[activeIndex].user.id}
      onProfile={false}
      onUserProfile={false}
      onHome={onHome}
      audioContext={audioContext}
      waveHeight={500}
      containerType='home'
      ></WaveSurferComponent>
      </div>
      <IoIosArrowDown
          type="button"
          className="carousel-button next"
          onClick={() => handleClick('next')}
        >
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
          </svg> */}
        </IoIosArrowDown>
			</div>
		</div>
  );
};
/**
 * ${Math.abs(determinePlacement(i)) <= visibleStyleThreshold ? 'visible' : '' }
 * ${activeIndex === i ? 'active' : ''}
 */