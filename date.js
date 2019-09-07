exports.getDays = (a) => {
  const DAY = 60000 * 60 * 24;
  const now = new Date();

  const cutoffEnd = new Date(now.getFullYear(), 11, 32);
  const cutoffStart = new Date(now.getFullYear(), 0, 0);
  const cutoffStartNext = new Date(now.getFullYear() + 1, 0, 0);

  const date = new Date(now.getFullYear(), a.getMonth(), a.getDate());

  if( ((date - now) / DAY) < 0 ) {
      var newDate = new Date(now.getFullYear() + 1, date.getMonth(), date.getDate());
      var thisYearDays = (cutoffEnd - now) / DAY;
      var nextYearDays = (newDate - cutoffStartNext) / DAY;
      return thisYearDays + nextYearDays;
  } else {
      return (date - now) / DAY;
  }
}
