
const compare = (rec, prov) => {
    const receiverDate = new Date(rec.y, rec.m, rec.d, rec.hour, rec.min);
    const providerDate = new Date(prov.y, prov.m, prov.d, prov.hour, prov.min)
    return providerDate >= receiverDate;
}

const providerMatchingForClient = (re, pFrom, pTo) => {
    //const rDate = new Date(re.y, re.m, re.d, re.hour, re.min);
    const pFromDate = new Date(pFrom.y, pFrom.m, pFrom.d, pFrom.hour, pFrom.min);
    const pToDate = new Date(pTo.y, pTo.m, pTo.d, pTo.hour, pTo.min);
    return re >= pFromDate && re < pToDate;
}
export default { compare, providerMatchingForClient }