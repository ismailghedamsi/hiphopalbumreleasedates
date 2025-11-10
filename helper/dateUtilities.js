export default class DateHelpers {

    static appendZero = (month) => {
        if (month < 10) {
            return "0" + month
        }
        return month
    }
    
    static getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    static getMonth(date){
      return date.getMonth() + 1
    }
  }