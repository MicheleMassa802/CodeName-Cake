// for use in the Calendar and other date related components

const monthMap = {
  0: "Jan.",
  1: "Feb.",
  2: "Mar.",
  3: "Apr.",
  4: "May",
  5: "Jun.",
  6: "Jul.",
  7: "Aug.",
  8: "Sep.",
  9: "Oct.",
  10: "Nov.",
  11: "Dec."
};

const maxYear = new Date().getFullYear() + 3;
const minYear = 2023; // application release date

const maxDate = `${maxYear}-12-31`;
const minDate = `${minYear}-01-01`;

const getTodaysDate = () => {
  const today = new Date();
  // go back 4 hours to account for time zone differences
  today.setHours(today.getHours() - 4);
  // transform into yyyy-mm-dd string
  let month = today.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  } else {
    month = month.toString();
  }
  return `${today.getFullYear()}-${month}-${today.getDate()}`;
}

const dateToString = (date) => {
  // subtract 4 hours to account for time zone differences
  date.setHours(date.getHours() - 4);
  // transform into yyyy-mm-dd string
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  } else {
    month = month.toString();
  }
  return `${date.getFullYear()}-${month}-${date.getDate()}`;
}

const prevMonth = (monthInt) => {
  console.log("Prev Month");
  if (monthInt !== 0) {
    return monthInt - 1;
  }
  // otw
  return monthInt; // which should be 0
} 

const nextMonth = (monthInt) => {
  console.log("Next Month");
  if (monthInt !== 11) {
    return monthInt + 1;
  }
  // otw
  return monthInt; // which should be 11
}

const prevYear = (yearInt) => {
  console.log("Prev Year");
  if (yearInt !== minYear) {
    return yearInt - 1;
  }
  // otw
  return yearInt; // which should be 2023
}

const nextYear = (yearInt) => {
  console.log("Next Year");
  if (yearInt !== maxYear) {
    return yearInt + 1;
  }
  // otw
  return yearInt; // which should be current year + 3
}

const getDaysInMonth = (year, month) => {
  const date = new Date(year, month, 1);
  
  // get to the months last day
  date.setMonth(date.getMonth() + 1);
  date.setDate(date.getDate() - 1);
  // add all days from 1 to the last day into a dictionary and return it
  return date.getDate();
}

const getEmptyCalendar = (year, month) => {
  // get days to fill dictionary with
  const days = getDaysInMonth(year, month);

  const emptyCal = {}; // made into a dictionary of day:[watered down orders]
  for (let i = 1; i <= days; i++) {
    emptyCal[i] = [];
  }

  return emptyCal;
}

const isFuture = (date) => {
  // date is a string in the format YYYY-MM-DD
  const otherDate = date.split("-"); // array of [yyyy, mm, dd]
  const today = getTodaysDate().split("-");  // array of [yyyy, mm, dd]

  // all of this to avoid JS's dogshit date object

  if (otherDate[0] > today[0]) {
    return true;
  } else if (otherDate[0] === today[0]) {
    if (otherDate[1] > today[1]) {
      return true;
    } else if (otherDate[1] === today[1]) {
      if (otherDate[2] >= today[2]) {
        return true;
      }
    }
  }
  // otw
  return false;
}

const isPast = (date) => {
  // date is a string in the format YYYY-MM-DD
  const otherDate = date.split("-"); // array of [yyyy, mm, dd]
  const today = getTodaysDate().split("-");  // array of [yyyy, mm, dd]

  // all of this to avoid JS's dogshit date object

  if (otherDate[0] < today[0]) {
    return true;
  } else if (otherDate[0] === today[0]) {
    if (otherDate[1] < today[1]) {
      return true;
    } else if (otherDate[1] === today[1]) {
      if (otherDate[2] < today[2]) {
        return true;
      }
    }
  }
  // otw
  return false;
}

  
export default {
  monthMap,
  prevMonth,
  nextMonth,
  prevYear,
  nextYear,
  maxDate,
  minDate,
  getTodaysDate,
  dateToString,
  getEmptyCalendar,
  isFuture,
  isPast
};