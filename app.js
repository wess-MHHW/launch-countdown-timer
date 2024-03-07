// SET INITIAL DATE
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 8);
targetDate.setHours(targetDate.getHours() + 23);
targetDate.setMinutes(targetDate.getMinutes() + 55);
targetDate.setSeconds(targetDate.getSeconds() + 41);

/* functions */
// SELECT TIME SEGMENT ELEMENTS
function getTimeSegmentElements(timeSegmentElement) {
  const segmentDisplay = timeSegmentElement.querySelector(".segment-display");
  const segmentDisplayTop = segmentDisplay.querySelector(
    ".segment-display__top"
  );
  const segmentDisplayBottom = segmentDisplay.querySelector(
    ".segment-display__bottom"
  );

  const segmentOverlay = segmentDisplay.querySelector(".segment-overlay");
  const segmentOverlayTop = segmentOverlay.querySelector(
    ".segment-overlay__top"
  );
  const segmentOverlayBottom = segmentOverlay.querySelector(
    ".segment-overlay__bottom"
  );

  return {
    segmentDisplayTop,
    segmentDisplayBottom,
    segmentOverlay,
    segmentOverlayTop,
    segmentOverlayBottom,
  };
}

// UPDATE TIME SEGMENT ELEMENTS
function updateSegmentValues(displayElement, overlayElement, value) {
  displayElement.textContent = value.toString().padStart(2, "0");
  overlayElement.textContent = value.toString().padStart(2, "0");
}

// START ANIMATION AND UPDATE TIME SEGMENTS
function updateTimeSegment(timeSegmentElement, timeValue) {
  const segmentElements = getTimeSegmentElements(timeSegmentElement);

  // SAME TIME VALUE
  if (
    parseInt(segmentElements.segmentDisplayTop.textContent, 10) === timeValue
  ) {
    return;
  }

  // DIFFERENT TIME VALUE
  segmentElements.segmentOverlay.classList.add("flip");

  updateSegmentValues(
    segmentElements.segmentDisplayTop,
    segmentElements.segmentOverlayBottom,
    timeValue
  );

  segmentElements.segmentOverlay.addEventListener(
    "animationend",
    finishAnimation
  );

  function finishAnimation() {
    segmentElements.segmentOverlay.classList.remove("flip");
    updateSegmentValues(
      segmentElements.segmentDisplayBottom,
      segmentElements.segmentOverlayTop,
      timeValue
    );

    this.removeEventListener("animationend", finishAnimation);
  }
}

// TARGET TIME SECTION AND UPDATE TIME SEGMENTS
function updateTimeSection(sectionID, timeValue) {
  const sectionElement = document.getElementById(sectionID);
  const timeSegment = sectionElement.querySelector(".time-segment");

  updateTimeSegment(timeSegment, timeValue);
}

// GET TIME VALUES
function getTimeRemaining(targetDateTime) {
  const nowTime = Date.now();
  const complete = nowTime >= targetDateTime;

  if (complete) {
    return {
      complete,
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0,
    };
  }

  const secondsRemaining = Math.floor((targetDateTime - nowTime) / 1000);
  const days = Math.floor(secondsRemaining / 86400);
  const hours = Math.floor((secondsRemaining % 86400) / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  return {
    complete,
    seconds,
    minutes,
    hours,
    days,
  };
}

// UPDATE ALL SEGMENTS
function updateAllSegments() {
  const timeRemaining = getTimeRemaining(new Date(targetDate).getTime());

  updateTimeSection("seconds", timeRemaining.seconds);
  updateTimeSection("minutes", timeRemaining.minutes);
  updateTimeSection("hours", timeRemaining.hours);
  updateTimeSection("days", timeRemaining.days);

  return timeRemaining.complete;
}

// LOGIC
const countdownTimer = setInterval(() => {
  const isComplete = updateAllSegments();

  if (isComplete) {
    clearInterval(countdownTimer);
  }
}, 1000);

updateAllSegments();
