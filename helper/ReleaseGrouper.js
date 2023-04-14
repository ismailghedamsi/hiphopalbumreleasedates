/**
 * A utility class that groups an array of releases by date.
 * @class ReleaseGrouper
 */

import dayjs from "dayjs";

export class ReleaseGrouper {
    groupByDate(releases) {
      return releases.reduce((acc, el) => {
        const date = dayjs(el.releaseDate).format('YYYY-MM-DD');
        acc[date] = acc[date] || [];
        acc[date].push(el);
        return acc;
      }, {});
    }
  }

  