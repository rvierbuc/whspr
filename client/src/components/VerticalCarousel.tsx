import React, { useState } from 'react';
import WaveSurferComponent from './WaveSurfer';

export const VerticalCarousel = ({ posts, leadingText, audioContext }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  // #1 above. Used to determine which items appear above the active item
  const halfwayIndex = Math.ceil(posts.length / 2);

  // #2 above. Used to determine the height/spacing of each item
  const itemHeight = 52;

  // #3 above. Used to determine at what point an item is moved from the top to the bottom
  const shuffleThreshold = halfwayIndex * itemHeight;

  // #4 above. Used to determine which items should be visible. Prevents "ghost" transitions
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
				<button
          type="button"
          className="carousel-button prev"
          onClick={() => handleClick('prev')}
        >
          Back
        </button>

        <div className="carousel">
    <div className="leading-text">
      <p>{leadingText}</p>
    </div>
    <div className="slides">
      <div className="carousel-inner">
        {posts.map((item, i) => (
          <button
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`carousel-item ${activeIndex === i ? 'active' : ''} ${Math.abs(determinePlacement(i)) <= visibleStyleThreshold ? 'visible' : '' }`}
            
            key={item.id}
            style={{ transform: `translateY(${determinePlacement(i)}px)` }}
          >
            {item.introLine}
          </button>
        ))}
      </div>
    </div>
  </div>

				<button
          type="button"
          className="carousel-button next"
          onClick={() => handleClick('next')}
        >
          Next
        </button>
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
      audioContext={audioContext}
      ></WaveSurferComponent>
      </div>
		</div>
  );
};