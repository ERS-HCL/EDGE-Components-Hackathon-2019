import { TIMEOUT_EVENTS_TO_LISTEN } from "../constants/pageConstants.js";
function isEmpty(dta) {
  if (dta && typeof dta == "string" && dta != "") {
    return false;
  } else {
    return true;
  }
}

function isValidDate(dateVal) {
  let dt = new Date(dateVal);
  return !isNaN(dt.valueOf());
}
function validTimerProps(props) {
  if (
    !isEmpty(props.dayLabel) &&
    !isEmpty(props.hourLabel) &&
    !isEmpty(props.minLabel) &&
    !isEmpty(props.secLabel) &&
    !isEmpty(props.startDateUtc) &&
    !isEmpty(props.expiryDateUtc) &&
    !isEmpty(props.beforeExpiryLabel) &&
    !isEmpty(props.afterExpiryLabel) &&
    !isEmpty(props.afterExpiryAdditionalLabel) &&
    !isEmpty(props.showTimer) &&
    (props.showTimer == "true" || props.showTimer == "false")
  ) {
    return true;
  } else {
    return false;
  }
}

function milliSecondsToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return hrs + " Hrs " + ":" + mins + " mins " + ":" + secs + " secs ";
}

function inactivityTime(alertTime, postInactivityWaitTime) {
  var timeOut;
  window.onunload = removeListeners;

  function addListener() {
    var events = TIMEOUT_EVENTS_TO_LISTEN;
    events.forEach(function(name) {
      window.addEventListener(name, resetTimer, true);
    });
    resetTimer();
  }

  function removeListeners() {
    var events = TIMEOUT_EVENTS_TO_LISTEN;
    events.forEach(function(name) {
      window.removeEventListener(name, resetTimer, true);
    });
  }

  function timeOutNotification() {
    let waitTill = new Date().setMilliseconds(
      new Date().getMilliseconds() + postInactivityWaitTime
    );
    if (
      window.confirm(
        "The webpage is idle for " +
          milliSecondsToTime(alertTime) +
          " web page will be active till " +
          new Date(waitTill) +
          " Are you willing to stay on the page?"
      )
    ) {
      if (new Date() < waitTill) {
        /* eslint-disable no-console */
        console.log(
          "Timer has been reset as the user clicked 'ok' with in the accepted time range"
        );
        resetTimer();
      } else {
        /* eslint-disable no-console */
        console.log(
          "User clicked 'ok' after the time range so timer is cleared."
        );
        clearTimerAndRemoveListerners();
      }
    } else {
      clearTimerAndRemoveListerners();
    }
  }

  function clearTimerAndRemoveListerners() {
    clearTimer();
    removeListeners();
    /* eslint-disable no-console */
    console.log("Web page timed out! Do the business logic here!");
  }

  function clearTimer() {
    clearTimeout(timeOut);
  }

  function resetTimer() {
    clearTimer();
    timeOut = setTimeout(timeOutNotification, alertTime);
  }
  addListener();
}

export {
  isEmpty,
  isValidDate,
  validTimerProps,
  milliSecondsToTime,
  inactivityTime
};
