const CurrencyHelper = require("../helper/CurrencyHelper");

class BitcoinPortfolio {
  constructor(_satoshiAmount, _bitcoinAveragePrice, _totalPaidPrice) {
    this.satoshiAmount = _satoshiAmount;
    this.bitcoinAveragePrice = _bitcoinAveragePrice;
    this.totalPaidPrice = _totalPaidPrice;
  }

  addAmount(_amount, _paidPrice) {
    if (_amount <= 0) return;

    this.totalPaidPrice += _paidPrice;
    this.satoshiAmount += _amount;

    const totalSatoshiAmount = this.satoshiAmount;
    if (totalSatoshiAmount !== 0) {
      const totalValue = this.totalPaidPrice;
      this.bitcoinAveragePrice = CurrencyHelper.parseToCurrency(
        CurrencyHelper.parseBitcoinToSatoshi(totalValue / totalSatoshiAmount)
      );
    } else {
      this.bitcoinAveragePrice = 0;
    }
  }

  removeAmount(_amount) {
    if (_amount > this.satoshiAmount) {
      this.#restartPrices;
      return;
    }
    this.satoshiAmount -= _amount;
    if (this.satoshiAmount == 0) {
      this.#restartPrices();
    }
  }

  #restartPrices() {
    this.bitcoinAveragePrice = 0;
    this.totalPaidPrice = 0;
  }
}

module.exports = BitcoinPortfolio;
