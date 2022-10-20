const CurrencyHelper = require("../helper/CurrencyHelper");

class BitcoinPortfolio {
  constructor(_satoshiAmount, _bitcoinAveragePrice) {
    this.satoshiAmount = _satoshiAmount;
    this.bitcoinAveragePrice = _bitcoinAveragePrice;
  }

  addFunds(_funds, _payedPrice) {
    this.satoshiAmount += _funds;
    this.bitcoinAveragePrice = CurrencyHelper.parseToCurrency(
      CurrencyHelper.parseBitcoinToSatoshi(
        (this.bitcoinAveragePrice + _payedPrice) / this.satoshiAmount
      )
    );
  }

  removeFunds(_funds) {
    this.satoshiAmount -= _funds;
    if (this.satoshiAmount == 0) {
      this.#restartAveragePrice();
    }
  }

  #restartAveragePrice() {
    this.bitcoinAveragePrice = 0;
  }
}

module.exports = BitcoinPortfolio;
