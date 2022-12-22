export default class DateHelpers {
    static getFullName(user) {
      return `${user.firstName} ${user.lastName}`;
    }
  
    static getCategory(userPoints) {
      return userPoints > 70 ? 'A' : 'B';
    }

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
      const temp = date.getMonth()+1
      return temp
    }
  }