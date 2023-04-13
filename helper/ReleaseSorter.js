import dayjs from "dayjs";

/**
 * A utility class that sorts an object with dates as keys.
 * @class ReleaseSorter
 */
export class ReleaseSorter {
    sortByDate(groupedReleases) {
      const dates = Object.keys(groupedReleases);
      return dates.sort((a, b) => {
        const dateA = dayjs(a).toDate();
        const dateB = dayjs(b).toDate();
        return dateA - dateB;
      }).map(date => [date, groupedReleases[date]]);
    }
  }
  