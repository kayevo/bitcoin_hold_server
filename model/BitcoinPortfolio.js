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
    const totalValue = this.totalPaidPrice;
    this.bitcoinAveragePrice = CurrencyHelper.parseToCurrency(
      CurrencyHelper.parseBitcoinToSatoshi(totalValue / totalSatoshiAmount)
    );
  }

  removeAmount(_amount, _receivedPrice) {
    if (_amount <= 0 || _amount > this.satoshiAmount) return;
    if(_amount == this.satoshiAmount){
      this.resetProperties();
      return
    }

    this.totalPaidPrice -= _receivedPrice;
    this.satoshiAmount -= _amount;

    const totalSatoshiAmount = this.satoshiAmount;
      const totalValue = this.totalPaidPrice;
      this.bitcoinAveragePrice = CurrencyHelper.parseToCurrency(
        CurrencyHelper.parseBitcoinToSatoshi(totalValue / totalSatoshiAmount)
      );
  }

  resetProperties() {
    this.bitcoinAveragePrice = 0;
    this.totalPaidPrice = 0;
    this.satoshiAmount = 0;
  }
}

module.exports = BitcoinPortfolio;
