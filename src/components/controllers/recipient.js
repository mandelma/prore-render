class Recipient {
    constructor (data) {
        this.data = data;
    }
    // Getter
    response (x) {
        return "Tere " + this.data + " " + x;
    }

    answer () {
        return  "Tere " + this.data;
    }

}

module.exports = {
    className: Recipient
}