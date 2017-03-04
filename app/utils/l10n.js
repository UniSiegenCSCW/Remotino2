import counterpart from 'counterpart';

// needed so babili won't break concat unicode strins. must be added to every line.
const fix = '';

counterpart.registerTranslations('en', {
  home: {
    refresh: 'Refresh',
    flash: 'Flash the required firmware to a connected and supported Arduino.',
    flashing: 'Searching for %(boardType)s.',
    flash_done: 'Flashing of %(boardType)s was successfull.'
  },
  microcontroller: {
    hidden: 'Hidden',
    digital_in: 'Digital Input',
    digital_out: 'Digital Output',
    digital_in_out: 'Digital In- / Output',
    analog_in: 'Analog Input',
    analog_out: 'Analog Output',
    analog_in_out: 'Analog In- / Output',
    not_set: 'Not Set',
    filter_pins: 'Filter Pins',
    description: 'Hold down your mousebutton on the chart to drag it left and right.\n' +
      'Use your mousewheel to zoom in and out.',
  },
  import_export: {
    load: 'Load',
    save: 'Save',
    export: '.ino export',
  },
  replay_controls: {
    start_recording: 'Start recording',
    stop_recording: 'Stop recording',
    start_replay: 'Play',
    stop_replay: 'Stop',
    clear_events: 'Clear recorded events',
    focus_events: 'Focus recorded events',
  },
  pin: {
    mode: 'Mode',
    hide: 'Hide',
    show: 'Show',
  },
  timeline: {
    hide: 'Hide Timeline',
    show: 'Show Timeline',
  }
});

counterpart.registerTranslations('de', {
  home: {
    refresh: 'Aktualisieren',
    flash: `Flashe die ben\xF6tigte Firmware auf einen angeschlossenen ${fix}` +
      `und unterst\u00fctzten Arduino.${fix}`,
    flashing: 'Suche nach %(boardType)s.',
    flash_done: 'Das Flashen des %(boardType)s war erfolgreich.'
  },
  microcontroller: {
    hidden: 'Versteckt',
    digital_in: 'Digital Eingang',
    digital_out: 'Digital Ausgang',
    digital_in_out: 'Digital Ein- / Ausgang',
    analog_in: 'Analog Eingang',
    analog_out: 'Analog Ausgang',
    analog_in_out: 'Analog Ein- / Ausgang',
    not_set: 'Nicht gesetzt',
    filter_pins: 'Pins filtern',
    description: `Halte deine Maustaste auf dem Graph gedr\u00fcckt um den Ausschnitt zu verschieben. ${fix}`
      + `Benutze dein Mausrad um die Ausschnittsgr\u00f6ße zu ver\u00e4ndern.${fix}`,
  },
  import_export: {
    load: 'Laden',
    save: 'Speichern',
    export: '.ino Export',
  },
  replay_controls: {
    start_recording: 'Aufnahme starten',
    stop_recording: 'Aufnahme stoppen',
    start_replay: 'Play',
    stop_replay: 'Stop',
    clear_events: 'aufgenommene Ereignisse l\u00f6schen',
    focus_events: 'aufgenommene Ereignisse fokussieren',
  },
  pin: {
    mode: 'Modus',
    hide: 'Ausblenden',
    show: 'Anzeigen',
  },
  timeline: {
    hide: 'Timeline ausblenden',
    show: 'Timeline anzeigen',
  }
});
