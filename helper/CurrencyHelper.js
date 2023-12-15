class CurrencyHelper {
  roundUpCurrency(_currencyValue) {
    return Math.ceil(_currencyValue * 10) / 10;
  }

  parseToCurrency(_value) {
    return parseFloat(_value.toFixed(2));
  }

  parseBitcoinToSatoshi(_bitcoinValue) {
    return _bitcoinValue * Math.pow(10, 8);
  }

  parseSatoshiToBitcoin(_bitcoinValue) {
    return _bitcoinValue / Math.pow(10, 8);
  }

  calculatePercentageProfit(_value, _valueWithProfit) {
    if (_value === 0) {
      return 0.0;
    }

    const percentageProfit = this.parseToCurrency(((_valueWithProfit - _value) / _value) * 100.0) ;
    return percentageProfit;
  }
}

module.exports = new CurrencyHelper();
