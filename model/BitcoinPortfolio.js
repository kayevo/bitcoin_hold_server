const CurrencyHelper = require("../helper/CurrencyHelper");

class BitcoinPortfolio {
  constructor(_satoshiAmount, _bitcoinAveragePrice, _totalPaidValue) {
    this.satoshiAmount = _satoshiAmount;
    this.bitcoinAveragePrice = _bitcoinAveragePrice;
    this.totalPaidValue = _totalPaidValue;
  }

  addAmount(_amount, _paidValue) {
    if (_amount <= 0) return;

    this.totalPaidValue += _paidValue;
    this.satoshiAmount += _amount;

    const totalSatoshiAmount = this.satoshiAmount;
    const totalValue = this.totalPaidValue;
    this.bitcoinAveragePrice = CurrencyHelper.parseToCurrency(
      CurrencyHelper.parseBitcoinToSatoshi(totalValue / totalSatoshiAmount)
    );
  }

  removeAmount(_amount, _receivedValue) {
    if (_amount <= 0 || _amount > this.satoshiAmount) return;
    if(_amount == this.satoshiAmount){
      this.resetProperties();
      return
    }

    this.totalPaidValue -= _receivedValue;
    this.satoshiAmount -= _amount;

    const totalSatoshiAmount = this.satoshiAmount;
      const totalValue = this.totalPaidValue;
      this.bitcoinAveragePrice = CurrencyHelper.parseToCurrency(
        CurrencyHelper.parseBitcoinToSatoshi(totalValue / totalSatoshiAmount)
      );
  }

  resetProperties() {
    this.bitcoinAveragePrice = 0;
    this.totalPaidValue = 0;
    this.satoshiAmount = 0;
  }
}

module.exports = BitcoinPortfolio;
