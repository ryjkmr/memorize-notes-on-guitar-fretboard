$(function () {

  Tone.Transport.bpm.value = 120;//テンポ設定
  Tone.Transport.scheduleRepeat(practice_to_tempo, '4n');//"8n"が来る度に'play_metronome'関数が呼び出される

  document.documentElement.addEventListener('mousedown', () => {
    if (Tone.context.state !== 'running') Tone.context.resume();
  });

  const SOUND_FILE_DIR = 'audio/';

  const piano_sound = new Tone.Sampler(
    {
      C3: SOUND_FILE_DIR + "piano_1_C.wav",
      D3: SOUND_FILE_DIR + "piano_3_D.wav",
      E3: SOUND_FILE_DIR + "piano_5_E.wav",
      F3: SOUND_FILE_DIR + "piano_6_F.wav",
      G3: SOUND_FILE_DIR + "piano_8_G.wav",
      A3: SOUND_FILE_DIR + "piano_10_A.wav",
      B3: SOUND_FILE_DIR + "piano_12_B.wav"
    }
  ).toDestination();

  const guitar_sound = new Tone.Sampler(
    {
      E2: SOUND_FILE_DIR + "guitar_1E.wav",
      F2: SOUND_FILE_DIR + "guitar_2F.wav",
      G2: SOUND_FILE_DIR + "guitar_3G.wav",
      A2: SOUND_FILE_DIR + "guitar_4A.wav",
      B2: SOUND_FILE_DIR + "guitar_5B.wav",
      C3: SOUND_FILE_DIR + "guitar_6C.wav",
      D3: SOUND_FILE_DIR + "guitar_7D.wav",
      E3: SOUND_FILE_DIR + "guitar_8E.wav",
      F3: SOUND_FILE_DIR + "guitar_9F.wav",
      G3: SOUND_FILE_DIR + "guitar_10G.wav",
      A3: SOUND_FILE_DIR + "guitar_11A.wav",
      B3: SOUND_FILE_DIR + "guitar_12B.wav",
      C4: SOUND_FILE_DIR + "guitar_13C.wav",
      D4: SOUND_FILE_DIR + "guitar_14D.wav",
      E4: SOUND_FILE_DIR + "guitar_15E.wav",
      F4: SOUND_FILE_DIR + "guitar_16F.wav",
      G4: SOUND_FILE_DIR + "guitar_17G.wav",
      A4: SOUND_FILE_DIR + "guitar_18A.wav",
      B4: SOUND_FILE_DIR + "guitar_19B.wav",
      C5: SOUND_FILE_DIR + "guitar_20C.wav",
      D5: SOUND_FILE_DIR + "guitar_21D.wav",
      E5: SOUND_FILE_DIR + "guitar_22E.wav",
      F5: SOUND_FILE_DIR + "guitar_23F.wav",
      G5: SOUND_FILE_DIR + "guitar_24G.wav"
    }
  ).toDestination();





  const kata_sound = new Tone.Sampler({ C4: SOUND_FILE_DIR + 'kata.wav' }).toDestination();

  let isTempoOn = false;
  let play_count = 0;

  function practice_to_tempo(time) {
    kata_sound.triggerAttackRelease("C4", "4n", time, 1);
    if (play_count >= 0) {//カウントインの処理
      if (play_count % 4 === 0) {
        $("#question").text(questions.get);
        play_target_note($("#question").text(), 0);
      }
    }
    play_count++;
  }

  const string_value_to_num = [, 24, 19, 15, 10, 5, 0];
  const num_to_sound = ["E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
    "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
    "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
    "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
    "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6"
  ]

  //#表記と♭表記の使い分け用の辞書。G#をGsと書くのはクラス名に#が使えないため。フラットは小文字のBで代用しているので問題ない
  const key_sharp = ["A", "As", "B", "C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs"];
  const key_flat = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"];


  class quenstionsClass {
    constructor(_q_array) {
      this._data = _q_array;
      this._counter = 0;
      this._shuffle();
    }
    get random() {
      //ランダムにデータをひとつ選んで返す
      const i = Math.floor(Math.random() * this._data.length);
      return this._data[i];
    }
    get data() {
      return questions._data;
    }

    _shuffle() {
      const _lastQuestion = this._data[this._counter];
      for (let _i = this._data.length - 1; _i > 0; _i--) {
        let _j = Math.floor(Math.random() * (_i + 1)); // 0 から i のランダムなインデックス
        [this._data[_i], this._data[_j]] = [this._data[_j], this._data[_i]]; // 要素を入れ替え
      }
      if (_lastQuestion == this._data[0]) [this._data[0], this._data[1]] = [this._data[1], this._data[0]];
    }

    get get() {
      const _result = this._data[this._counter];
      if (this._counter === (this._data.length - 1)) {
        this._shuffle();
        this._counter = 0
      } else {
        this._counter++;
      }
      return _result;
    }

    get next() {
      return this._data[this._counter];
    }

    set data(_a) {
      this._data = _a;
      this._counter = 0;
      if (_a.length > 1) this._shuffle();
    }
  }

  drawToneName();
  const questions = new quenstionsClass(listUpQuestion());


  $("#question").click(function () {
    reloadQuestions()
  });
  // $("#question").text(questions.get);

  function reloadQuestions(update = true) {
    questions.data = listUpQuestion();
    // console.log("questions.data:" + questions.data);
    if (questions.data.length < 1) return false;
    if (update) {
      $("#question").text(questions.get);
      play_target_note($("#question").text());
    }
    return true;
  }


  function drawToneName() {
    console.log($("input[name=disp-type]:checked").val());
    if ($("input[name=disp-type]:checked").val() == "flat") {
      for (let k of key_flat) {
        $("." + k + " span").text(k);
      }
    } else {
      for (let k of key_sharp) {
        $("." + k + " span").text(k.replace("s", "#"));
      }
    }
  }


  $("#showToneName").change(function () {
    if ($(this).prop('checked')) {
      $(".tone-name").css("visibility", "visible");
      setupfretBoardReaction(false);
    } else {
      $(".tone-name").css("visibility", "hidden");
      setupfretBoardReaction();
    };
  });


  $(".tone-name").css('visibility', 'hidden');
  setupfretBoardReaction();

  function setupfretBoardReaction(_hide_tone_name = true) {

    if (_hide_tone_name) {
      $(".flet-cell").on("mousedown touchstart", function (e) {
        if ($(this).hasClass("dimm1") | $(this).hasClass("dimm2")) return;
        const _tone = $(this).find("span");
        const _tone_number = string_value_to_num[$(this).siblings(".str-num").find("input").data("str_number")] +
          $(this).data("position");
        console.log(_tone_number);
        const time = Tone.now();
        guitar_sound.triggerAttackRelease(num_to_sound[_tone_number], "4n", time);

        _tone.css('visibility', 'visible');
        console.log(_tone.text());
        checkAnswer(_tone.text());
        e.preventDefault();
      });

      $(".flet-cell").on("mouseup touchend", function (e) {
        $(this).find("span").css('visibility', 'hidden');
        e.preventDefault();

      });

      $(".flet-cell").on("mouseleave", function (e) {
        $(this).find("span").css('visibility', 'hidden');
        e.preventDefault();
      });
      return;
    } else { //show tone name mode
      $(".flet-cell").on("mousedown touchstart", function (e) {
        if ($(this).hasClass("dimm1") | $(this).hasClass("dimm2")) return;
        const _tone = $(this).find("span");
        checkAnswer(_tone.text());
        e.preventDefault();
      });

      $(".flet-cell").off("mouseup");

      $(".flet-cell").off("mouseleave");

    }
  }

  //不要なフレット表示のオン・オフ
  $('.flet-on-off').click(function () {
    const className = ".pos-" + $(this).val();
    if ($(this).prop('checked')) {
      $(className).removeClass('dimm1');
      // $(className).css('visibility', 'visible');
    } else {
      $(className).addClass('dimm1');
      // $(className).css('visibility', 'hidden');
    };
    // $("#question").text("click to start");
    stopReset();
  });

  //不要な弦表示のオンオフ
  $('.str-on-off').click(function () {
    const className = ".str" + $(this).data("str_number");
    if ($(this).prop('checked')) {
      $(className).removeClass('dimm2');
      // $(className).css('visibility', 'visible');
    } else {
      $(className).addClass('dimm2');
      // $(className).css('visibility', 'hidden');
    };
    // $("#question").text("click to start");
    stopReset();
  });


  //全フレットの一括オン・オフ
  $('.all-on-off').click(function () {
    if ($(this).prop('checked')) {
      // $('.flet-cell').css('visibility', 'visible');
      $('.flet-cell').removeClass('dimm1');
      $('.flet-on-off').prop('checked', true);
    } else {
      $('.flet-cell').addClass('dimm1');
      $('.flet-on-off').prop('checked', false);
    };
    // $("#question").text("click to start");
    stopReset();
  });


  //#表示とb表示の切り替え
  $('.select-display-type').on("change", function () {
    drawToneName();
    stopReset();
  });


  $('#startBtn').mousedown(function () {
    if (!reloadQuestions(false)) return;
    isTempoOn = true;
    $("#question").text("get ready...");

    play_count = -4;//カウントイン
    Tone.Transport.seconds = 0;
    Tone.Transport.start();
    $("#stopBtn").prop("disabled", false);
    $(this).prop("disabled", true);

  });

  $('#stopBtn').mousedown(function () {
    stopReset();
  });

  function stopReset() {
    Tone.Transport.stop();
    $("#stopBtn").prop("disabled", true);
    $("#startBtn").prop("disabled", false);
    isTempoOn = false;
    $("#question").text("click to start");
  }

  $("#test").mousedown(function () {
  })


  function play_target_note(t, delay = 0.4) {
    const time = Tone.now();
    piano_sound.triggerAttackRelease(t + "3", "1n", time + delay);
  }

  function listUpQuestion() {
    const array = [];
    $(".tone-name").each(function (index, element) {
      if (!$(element).parent().hasClass("dimm1") & !$(element).parent().hasClass("dimm2")) {
        array.push($(element).text());
      }
    });
    return Array.from(new Set(array));
  }

  function checkAnswer(a) {
    if (a === $("#question").text()) {
      if (isTempoOn) return;
      $("#question").text(questions.get);
      play_target_note($("#question").text());
    }
  }

  $('#tempo_disp').val($('#tempo_slider').val());

  $('#tempo_slider').on('input', function () {
    const tempo = $(this).val();
    $('#tempo_disp').val(tempo);
    Tone.Transport.bpm.value = tempo;
  });

});

