const month = ({num}) => {
    let name = ""
    if (num === 5) {
        name = "Mis siis"
    }
    switch (num) {
        case 0:
            name = "Tammikuu";
            break;
        case 1:
            name = "Helmikuu";
            break;
        case 2:
            name = "Maaliskuu";
            break;
        case 3:
            name = "Huhtikuu";
            break;
        case 4:
            name = "Toukokuu";
            break;
        case 5:
            name = "Kesäkuu";
            break;
        case 6:
            name = "Heinäkuu";
            break;
        case 7:
            name = "Elokuu";
            break;
        case 8:
            name = "Syyskuu";
            break;
        case 9:
            name = "Lokakuu";
            break;
        case 10:
            name = "Maaliskuu";
            break;
        case 11:
            name = "Joulukuu";
            break;
    }

    return name;
}

export default  month