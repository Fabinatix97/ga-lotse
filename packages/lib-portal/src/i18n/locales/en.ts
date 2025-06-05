/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import type { de } from "./de";

export const en = {
  common: {
    no: "No",
    yes: "Yes",
    reset: "Reset",
    month: "Month",
    year: "Year",
    delete: "Delete",
  },
  form: {
    enumOptions: {
      noSelection: "no selection",
    },
    multipleSelectionPossible: "Multiple selection possible",
  },
  validation: {
    email: "Please enter a valid email address.",
    length:
      "Text must be between {{startInclusive}} and {{endInclusive}} symbols long.",
    pastOrTodayDate: "The date lies in the future.",
    number: "Please enter a number.",
    pleaseEnterYearInRange: "Please enter year between {{min}} and {{max}}",

    file: {
      wrongType:
        "Please select a file of type {{types, list(style: 'short'; type: 'disjunction';)}}.",
      invalidName:
        "Invalid file name: Only letters, numbers, hyphens '-' and underscores '_' allowed.",
      nameTooLong: "Please select a file with a shorter file name.",
      invalidExtension: "Please select a file with a valid file extension.",
      tooLarge: "Please select a file smaller than {{maxFileSize}}.",
    },

    lifetimeDoctorNumber: "Please enter a valid lifelong doctor's number.",

    zipCode: "Please enter a valid zip code.",
  },
} satisfies typeof de;
