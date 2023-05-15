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
  
export default {
  monthMap,
  prevMonth,
  nextMonth,
  prevYear,
  nextYear,
};