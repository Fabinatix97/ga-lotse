/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export const de = {
  common: {
    no: "Nein",
    yes: "Ja",
    reset: "Zurücksetzen",
    month: "Monat",
    year: "Jahr",
    delete: "Entfernen",
  },
  form: {
    enumOptions: {
      noSelection: "keine Auswahl",
    },
    multipleSelectionPossible: "Mehrfachauswahl möglich",
  },
  validation: {
    email: "Bitte eine gültige Email angeben.",
    length:
      "Bitte eine Textlänge zwischen {{startInclusive}} und {{endInclusive}} Zeichen angeben.",
    pastOrTodayDate: "Das Datum liegt in der Zukunft.",
    number: "Bitte eine Nummer angeben.",
    pleaseEnterYearInRange:
      "Bitte ein Jahr zwischen {{min}} und {{max}} eingeben",

    file: {
      wrongType:
        "Bitte eine Datei vom Typ {{types, list(style: 'short'; type: 'disjunction';)}} auswählen.",
      invalidName:
        "Ungültiger Dateiname: Nur Basisbuchstaben (kein ä, ß, é, ñ etc.), Zahlen, Bindestriche '-' und Unterstriche '_' erlaubt.",
      nameTooLong: "Bitte eine Datei mit einem kürzeren Dateinamen auswählen.",
      invalidExtension:
        "Bitte eine Datei mit einer gültigen Dateiendung auswählen.",
      tooLarge: "Bitte eine Datei kleiner {{maxFileSize}} auswählen.",
    },

    lifetimeDoctorNumber: "Bitte eine gültige lebenslange Arztnummer angeben.",

    zipCode: "Bitte eine gültige Postleitzahl angeben.",
  },
};
