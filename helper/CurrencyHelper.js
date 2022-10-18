class CurrencyHelper {
  roundUpCurrency(_currencyValue) {
    return Math.ceil(_currencyValue * 10) / 10;
  }

  parseToCurrency(_value) {
    return parseFloat(_value.toFixed(2))
  }

  parseBitcoinToSatoshi(_bitcoinValue) {
    return _bitcoinValue * Math.pow(10, 8);
  }

  satoshiPriceToBitcoinPrice(_bitcoinValue) {
    return _bitcoinValue * Math.pow(10, 8);
  }
}

module.exports = CurrencyHelper;
