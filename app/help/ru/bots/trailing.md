# Боты

## Бот TrailingStop

ПОШАГОВАЯ ИНСТРУКЦИЯ:

Начальные данные:

* sellAsset и getAsset: продаваемый актив и желаемый для получения соответственно;
* amount: количество продаваемого актива;
* stoploss и minAmount: цена, при которой создается ордер, и минимальное количество getAsset-актива;
* trailing percent: максимальная разница между ценой stoploss и текущей ценой.
* Поля stoploss и minAmount взаимосвязаны и показаны исключительно для удобства настройки бота.

При старте бот подписывается на новый блок в блокчейне. При получении нового блока он каждый раз производит проверку цены на рынке.

Если рыночная цена больше stoploss, чем на trailing_percent, цена stoploss корректируется на эту разницу. 

Если рыночная цена ниже stoploss + trailing_percent / 3, выставляется ордер для продажи актива sellAsset с ценой stoploss и объемом amount. После выставления ордера бот останавливает свою работу.

Видеоруководство вы можете найти по ссылке ниже:

https://golos.id/ru--blokcheijn/@blockchained/ru-anons-novogo-razdela-i-dvukh-publichnykh-torgovykh-botov-ot-rudex-spreadtrade-i-trailingstop