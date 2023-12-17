const CurrencyHelper = require("../helper/CurrencyHelper");

class Portfolio {
  // amount in satoshi / average price in bitcoin
  constructor(_amount = 0, _averagePrice = 0, _totalPaidValue = 0) {
    this.amount = _amount;
    this.averagePrice = _averagePrice;
    this.totalPaidValue = _totalPaidValue;
  }

  addAmount(_amount, _paidValue) {
    if (_amount <= 0) return;

    this.totalPaidValue += _paidValue;
    this.amount += _amount;

    const totalSatoshiAmount = this.amount;
    const totalValue = this.totalPaidValue;
    this.averagePrice = CurrencyHelper.parseToCurrency(
      CurrencyHelper.parseBitcoinToSatoshi(totalValue / totalSatoshiAmount)
    );
  }

  removeAmount(_amount) {
    if (_amount <= 0 || _amount > this.amount) return;
    if (_amount == this.amount) {
      this.resetProperties();
      return;
    }

    const resultAmount = this.amount - _amount;
    const resultTotalPaidValue = CurrencyHelper.parseToCurrency(
      (this.totalPaidValue * resultAmount) / this.amount
    );

    this.amount = resultAmount;
    this.totalPaidValue = resultTotalPaidValue;
  }

  resetProperties() {
    this.averagePrice = 0;
    this.totalPaidValue = 0;
    this.amount = 0;
  }
}

module.exports = Portfolio;
