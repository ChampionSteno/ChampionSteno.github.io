$(document).ready(function() {

  $.timerval = 0;
  $.running = false;
  $.timerID = 0;
  $.stopwatchID = 0;
  $.chronoID = 0;
  $.chronoval = 0;

  $("#main_btn").prop('disabled', true);

  /* The text fields are listened to, and the timer value is kept updated.
   * When it's valid, the button is enabled, otherwise it's disabled.
   */
  var check_nums = function () {
    var wps = + $("#input_wps").val();
    var wpm = + $("#input_wpm").val();
    var sw_m = + $("#input_sw_m").val();
    var sw_s = + $("#input_sw_s").val();

    if (isNaN(wps) || isNaN(wpm) || wps <= 0 || wpm <= 0 ||
        isNaN(sw_m) || isNaN(sw_s) || sw_m < 0 || sw_s < 0 || sw_s >= 60) {
      // Invalid numbers.
      $("#main_btn").prop('disabled', true);
      $("#tick_info").html("Please enter valid numbers.");
    } else {
      $.timerval = wps / (wpm / 60);
      $("#main_btn").prop('disabled', false);
      $("#tick_info").html("Tick every " + $.timerval.toFixed(2) + " seconds.");
    }
  };

  $("#input_wps").change(check_nums);
  $("#input_wpm").change(check_nums);
  $("#input_wps").keyup(check_nums);
  $("#input_wpm").keyup(check_nums);
  $("#input_sw_m").change(check_nums);
  $("#input_sw_s").change(check_nums);
  $("#input_sw_m").keyup(check_nums);
  $("#input_sw_s").keyup(check_nums);

  /* Utlity to format $.chronoval to a MM:SS string. */
  var chrono_format = function() {
    var mins = Math.floor($.chronoval / 60);
    var secs = $.chronoval % 60;
    if (secs < 10)
      return mins + ":0" + secs;
    return mins + ":" + secs;
  };

  /* Implements start/stop of the timer.
   * If the timer is not running, a click activates the timer and disables the
   * inputs. If the timer is running, a click deactivates it and enables the
   * inputs. */
  var button_action = function () {
    if ($.running) {

      // Change state.
      clearInterval($.timerID);
      clearTimeout($.stopwatchID);
      clearInterval($.chronoID);
      $.running = false;

      // Set buttons and inputs.
      $("#main_btn").html('Start');
      $("#input_wps").prop('disabled', false);
      $("#input_wpm").prop('disabled', false);
      $("#input_sw_m").prop('disabled', false);
      $("#input_sw_s").prop('disabled', false);
      $("#chronometer_info").hide();

    } else {

      // Set timer, stopwatch and state.
      $.timerID = setInterval(function () {
       $('#tick_sound')[0].play();
      }, $.timerval * 1000);
      var sw_m = + $("#input_sw_m").val() || 0;
      var sw_s = + $("#input_sw_s").val() || 0;
      var sw_time = 1000 * (sw_s + sw_m * 60);
      if (sw_time > 0) {
        $.stopwatchID = setTimeout(function () {
            $('#bell_sound')[0].play();
            button_action();
          }, sw_time);
      }
      $.running = true;

      // Set and show chronometer, adjusted every second.
      $.chronoval = sw_m * 60 + sw_s;
      $.chronoID = setInterval(function () {
        $.chronoval--;
        $('#chronometer_info').html(chrono_format());
      }, 1000);
      $('#chronometer_info').html(chrono_format());

      // Set buttons and inputs.
      $("#main_btn").html('Stop');
      $("#main_btn").focus(); // to ensure focus is not lost
      $("#input_wps").prop('disabled', true);
      $("#input_wpm").prop('disabled', true);
      $("#input_sw_m").prop('disabled', true);
      $("#input_sw_s").prop('disabled', true);
      $("#chronometer_info").show();

      $('#tick_sound')[0].play();

    }
  };

  $(document).keyup(function (e) {
    if(e.which == 13 && !$("#main_btn").prop('disabled')){
      button_action();
    }
  });

  // Avoids a double call in case of Enter pressed
  $("#main_btn").on('keyup keypress', function (e) {
    if(e.which == 13)
      e.preventDefault();
  });

  $("#main_btn").click(button_action); // click event on the button.

  check_nums(); // Trigger a check for initial values.

});
