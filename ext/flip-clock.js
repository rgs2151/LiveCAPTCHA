; (function ($) {
  $(document).ready(function () {
    $('#start').click(function() {
      $('.flip-clock-container').each(function () {
        var result = prepareFlipItems($(this));
        var flipElements = result.flipElements;
        var timestamp = result.timestamp;
        setState(flipElements, timestamp, $(this));
      });
    });
  });

  function completeUpdateState(flipElements, values, flipContainer) {
    return setTimeout(function () {
      for (var key in flipElements)
        for (var i = 0; i < 2; i++)
          if (flipElements[key].digits[i].flipping) {
            flipElements[key].digits[i].currentValue = flipElements[key].digits[i].nextValue;
            flipElements[key].digits[i].element.children('.flip-digit-current').attr('data-digit', flipElements[key].digits[i].currentValue);
            var number = flipElements[key].digits[1].nextValue * 10 + flipElements[key].digits[0].nextValue;
            var nextValue = computeNextValue(number, key);
            for (var j = i; j < 2; j++)
              if (flipElements[key].digits[j].nextValue != nextValue[j]) {
                flipElements[key].digits[j].nextValue = nextValue[j];
                flipElements[key].digits[j].element.children('.flip-digit-next').attr('data-digit', flipElements[key].digits[j].nextValue);
              }
            flipElements[key].digits[i].flipping = false;
            flipElements[key].digits[i].element.removeClass('flipping');
          }
      flipContainer.trigger('afterFlipping', values);
    }, 900);
  }

  function updateState(flipElements, timestamp, flipContainer) {
    var values = {};
    var digitValues = {};
    values.seconds = timestamp % 60;
    values.minutes = Math.floor(timestamp / 60 % 60);
    values.hours = Math.floor(timestamp / 60 / 60 % 24);
    values.days = Math.floor(timestamp / 60 / 60 / 24);
    digitValues.seconds = numberToDigits(values.seconds);
    digitValues.minutes = numberToDigits(values.minutes);
    digitValues.hours = numberToDigits(values.hours);
    digitValues.days = numberToDigits(values.days);
    for (var key in flipElements)
      for (var i = 0; i < 2; i++)
        if (digitValues[key].digits[i] != flipElements[key].digits[i].currentValue) {
          flipElements[key].digits[i].flipping = true;
          flipElements[key].digits[i].element.addClass('flipping');
        }
    flipContainer.trigger('beforeFlipping', values);
    return completeUpdateState(flipElements, values, flipContainer);
  }

  function setState(flipElements, timestamp, flipContainer) {
    var countDown = setInterval(function () {
      updateState(flipElements, --timestamp, flipContainer);
      if (!timestamp) {
        flipContainer.trigger('done');
        return clearInterval(countDown)
      }
    }, 1000);
    return;
  }

  function prepareFlipItems(flipContainer) {
    var flipElements = {};
    var timestamp = 0;
    var itemCount = 0;
    flipContainer.children().each(function () {
      var element = $(this);
      var number = parseInt(element.text());
      var getFlipItemChildObj = prepareFlipItemChild(element, number);

      if (element.hasClass('flip-item-seconds')) {
        timestamp += number;
        flipElements.seconds = getFlipItemChildObj('seconds');
      }
      else if (element.hasClass('flip-item-minutes')) {
        timestamp += number * 60;
        flipElements.minutes = getFlipItemChildObj('minutes');
      }
      else if (element.hasClass('flip-item-hours')) {
        timestamp += number * 60 * 60;
        flipElements.hours = getFlipItemChildObj('hours');
      }
      else if (element.hasClass('flip-item-days')) {
        timestamp += number * 24 * 60 * 60;
        flipElements.days = getFlipItemChildObj('days');
      }
    });
    flipContainer[0].style.setProperty('--item-count', itemCount);
    return {
      flipElements: flipElements,
      timestamp: timestamp
    };
    function prepareFlipItemChild(element, number) {
      return function (flipType) {
        var digitsComponent = new DigitsComponent(number, flipType);
        element.html(digitsComponent.render());
        for (var i = 0; i < 2; i++)
          $.extend(digitsComponent.digits[i], {
            element: $(element.children()[i]),
            flipping: false
          });
        itemCount++;
        return {
          parentElement: element,
          digits: digitsComponent.digits
        };
      }
    }
  }

  function DigitsComponent(number, flipType) {
    (function constructor(number, flipType) {
      $.extend(this, setDigitValues(number, flipType));
    }).call(this, number, flipType);
    this.render = function () {
      return document.createRange().createContextualFragment(`
        <div class="flip-digit">
          <span class="flip-digit-next" data-digit="${this.digits[0].nextValue}"></span>
          <span class="flip-digit-current" data-digit="${this.digits[0].currentValue}"></span>
        </div>
        <div class="flip-digit">
          <span class="flip-digit-next" data-digit="${this.digits[1].nextValue}"></span>
          <span class="flip-digit-current" data-digit="${this.digits[1].currentValue}"></span>
        </div>
      `);
    }
  }

  function setDigitValues(number, flipType) {
    var nextValue = computeNextValue(number, flipType);
    return {
      digits: [
        {
          currentValue: number % 10,
          nextValue: nextValue[0]
        },
        {
          currentValue: Math.floor(number / 10),
          nextValue: nextValue[1]
        }
      ]
    };
  }

  function computeNextValue(number, flipType) {
    var nextNumber = number - 1;
    if (!number)
      nextNumber = flipType === 'hours' ? 23 : 59;
    // console.log(flipType, 'number:', number, 'whichDigit:', whichDigit, 'result:', whichDigit ? Math.floor(nextNumber / 10) : nextNumber % 10);
    return [nextNumber % 10, Math.floor(nextNumber / 10)];
  }

  function numberToDigits(number) {
    return {
      digits: [
        number % 10,
        Math.floor(number / 10)
      ]
    };
  }

})(jQuery);