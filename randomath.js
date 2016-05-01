module.exports = {
  uniqueRandomNumbers(amount, lowerLimit, upperLimit) {
    let uniqueNumbers = [];
    while (uniqueNumbers.length != amount) {
      let currentRandom = this.randomNumberInRange(lowerLimit, upperLimit);
      if (uniqueNumbers.indexOf(currentRandom) === -1) {
        uniqueNumbers.push(currentRandom);
      }
    }
    return uniqueNumbers;
  },

  randomNumberInRange(lowerLimit, upperLimit) {
    return Math.floor( Math.random() * (1 + upperLimit - lowerLimit)) + lowerLimit;
  }
};
