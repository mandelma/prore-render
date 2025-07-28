const dateStrFormat = ({date}) => {
    const month = [];
    month[0]="Tammikuu";
    month[1]="Helmikuu";
    month[2]="Maaliskuu";
    month[3]="Huhtikuu";
    month[4]="Toukokuu";
    month[5]="Kesäkuu";
    month[6]="Heinäkuu";
    month[7]="Elokuu";
    month[8]="Syyskuu";
    month[9]="Lokakuu";
    month[10]="Marraskuu";
    month[11]="Joulukuu";

    //console.log("Date... " + date)

    const myDate = new Date(date);

    let hours = myDate.getHours();
    let minutes = myDate.getMinutes();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let timeStr = hours + ':' + minutes;

    return  month[new Date(date).getMonth()] + " " + myDate.getDate() + " / " + myDate.getFullYear() + " " + " klo " + timeStr;
}

export default dateStrFormat