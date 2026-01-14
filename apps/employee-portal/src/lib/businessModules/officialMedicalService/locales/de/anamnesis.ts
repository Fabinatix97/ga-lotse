/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddiction,
  ApiCurrentMedicalCondition,
  ApiEatingDisorder,
  ApiFillingPerson,
  ApiHeartDisease,
  ApiMaritalStatus,
  ApiMentalIllness,
  ApiOpticalAidAnswer,
  ApiThyroidDisease,
  ApiYesNoDontKnowAnswer,
} from "@eshg/official-medical-service-api";

export const anamnesis = {
  content: {
    affectedPerson: {
      title: "Angaben zur Person",
      fillingPerson: {
        label: "Angaben zur ausfüllenden Person",
        required: "Pflichtfeld ausfüllen",
        values: {
          [ApiFillingPerson.Employee]:
            "Der Bogen wird von einem / einer Mitarbeiter:in des Gesundheitsamts ausgefüllt.",
          [ApiFillingPerson.AffectedPerson]:
            "Die betroffene Person füllt diesen Bogen selbst aus.",
          [ApiFillingPerson.LegalGuardian]:
            "Der Bogen wird von einem / einer gesetzlichen Vertreter:in ausgefüllt.",
        },
      },
      maritalStatus: {
        label: "Familienstand",
        placeholder: "Auswählen",
        required: "Pflichtfeld ausfüllen",
        values: {
          [ApiMaritalStatus.Unmarried]: "Ledig",
          [ApiMaritalStatus.Married]: "Verheiratet",
          [ApiMaritalStatus.Widowed]: "Verwitwet",
          [ApiMaritalStatus.Divorced]: "Geschieden",
          [ApiMaritalStatus.NoSelection]: "Keine Auswahl",
        },
      },
      numberOfChildren: {
        label: "Anzahl Kinder",
        required: "Pflichtfeld ausfüllen",
      },
      yearsOfBirthOfChildren: {
        label: "Geburtsjahr Kind {{index}}",
        firstChildLabel: "Geburtsjahr erstes Kind",
        lastChildLabel: "Geburtsjahr letztes Kind",
      },
      occupation: {
        label: "Beruf",
      },
    },
    currentHealthCondition: {
      title: "Aktueller Gesundheitszustand",
      currentMedicalConditionsInfo: {
        answer: {
          label: "Liegen aktuell Beschwerden vor?",
          required: "Pflichtfeld ausfüllen",
        },
        descriptionOfCondition: {
          label: "Beschreibung der Beschwerde",
          placeholder: "Auswählen",
          required: "Pflichtfeld ausfüllen",
          values: {
            [ApiCurrentMedicalCondition.Attacks]: "Anfälle",
            [ApiCurrentMedicalCondition.LackOfAppetite]: "Appetitlosigkeit",
            [ApiCurrentMedicalCondition.ShortnessOfBreath]: "Atemnot",
            [ApiCurrentMedicalCondition.JointTrouble]: "Gelenkbeschwerden",
            [ApiCurrentMedicalCondition.EarNoseThroat]: "Hals / Nase / Ohren",
            [ApiCurrentMedicalCondition.HeartTrouble]: "Herzbeschwerden",
            [ApiCurrentMedicalCondition.Cough]: "Husten",
            [ApiCurrentMedicalCondition.Headache]: "Kopfschmerzen",
            [ApiCurrentMedicalCondition.NightSweats]: "Nachtschweiß",
            [ApiCurrentMedicalCondition.NervousTrouble]: "Nervöse Beschwerden",
            [ApiCurrentMedicalCondition.PainfulUrination]:
              "Schmerzhaftes Wasserlassen",
            [ApiCurrentMedicalCondition.ImpairedVisionEyeTrouble]:
              "Sehstörungen / Augenbeschwerden",
            [ApiCurrentMedicalCondition.MoodAndMotivationSwings]:
              "Stimmungs- und Antriebsschwankungen",
            [ApiCurrentMedicalCondition.WeightLossOrGain]:
              "Gewichtsabnahme / -zunahme",
            [ApiCurrentMedicalCondition.RheumaticDisorders]:
              "Rheumatische Beschwerden",
            [ApiCurrentMedicalCondition.BackPain]: "Rückenschmerzen",
            [ApiCurrentMedicalCondition.Pain]: "Schmerzen",
            [ApiCurrentMedicalCondition.HearingLoss]: "Schwerhörigkeit",
            [ApiCurrentMedicalCondition.Insomnia]: "Schlafstörungen",
            [ApiCurrentMedicalCondition.Vertigo]: "Schwindel",
            [ApiCurrentMedicalCondition.Addiction]:
              "Suchtkrankheiten / ehemalige Suchtkrankheiten",
            [ApiCurrentMedicalCondition.Indigestion]: "Verdauungsbeschwerden",
            [ApiCurrentMedicalCondition.Trembling]: "Zittern",
            [ApiCurrentMedicalCondition.Other]:
              "Sonstiges (Konkretisieren in “Nähere Angaben”)",
            [ApiCurrentMedicalCondition.NoSelection]: "Keine Auswahl",
          },
        },
        particulars: {
          label: "Nähere Angaben",
          required: "Pflichtfeld ausfüllen",
        },
      },
      medicalImagingFindingsInfo: {
        answer: {
          label: "Ergaben bildgebende Verfahren (Röntgen, CT, MRT) Befunde?",
          required: "Pflichtfeld ausfüllen",
        },
        result: {
          label: "Ergebnis",
          required: "Pflichtfeld ausfüllen",
        },
      },
      medicationDietarySupplementsOrDrugsInfo: {
        answer: {
          label:
            "Nehmen Sie zurzeit oder haben Sie in der Vergangenheit Medikamente, Nahrungsergänzungsmittel oder Drogen eingenommen?",
          required: "Pflichtfeld ausfüllen",
        },
        substances: {
          label: "Mittel angeben",
          required: "Pflichtfeld ausfüllen",
        },
      },
      healthyAndCapableInfo: {
        answer: {
          label: "Fühlen Sie sich gesund und leistungsfähig?",
          required: "Pflichtfeld ausfüllen",
        },
      },
      sportsInfo: {
        answer: {
          label: "Betätigen Sie sich sportlich?",
          required: "Pflichtfeld ausfüllen",
        },
        formOfSport: {
          label: "Sportart",
          required: "Pflichtfeld ausfüllen",
        },
      },
      opticalAidInfo: {
        answer: {
          label: "Tragen Sie eine Sehhilfe?",
          required: "Pflichtfeld ausfüllen",
          values: {
            [ApiOpticalAidAnswer.YesGlasses]: "Ja, Brille",
            [ApiOpticalAidAnswer.YesContactLenses]: "Ja, Kontaktlinsen",
            [ApiOpticalAidAnswer.No]: "Nein",
          },
        },
      },
      primaryCareDoctorOrAttendingPhysician: {
        label: "Hausarzt oder behandelnder Arzt",
        required: "Pflichtfeld ausfüllen",
      },
    },
    healthFitnessAndDisability: {
      title: "Gesundheitliche Eignung und Behinderung",
      priorExaminationInfo: {
        hasPriorExaminations: {
          label:
            "Wurden Sie schon einmal auf Ihre gesundheitliche Eignung untersucht (z. B. Musterung, Gesundheitsamt, Betriebsärztlicher Dienst)?",
          required: "Pflichtfeld ausfüllen",
        },
        year: {
          label: "Wann?",
          required: "Pflichtfeld ausfüllen",
        },
        place: {
          label: "Wo?",
          required: "Pflichtfeld ausfüllen",
        },
        reason: {
          label: "Weshalb?",
          required: "Pflichtfeld ausfüllen",
        },
        result: {
          label: "Ergebnis",
          required: "Pflichtfeld ausfüllen",
        },
      },
      disabilityInfo: {
        hasDisability: {
          label:
            "Besteht eine Behinderung oder liegt ein Bescheid des Versorgungsamtes über eine Behinderung bzw.\nSchwerbehinderung vor?",
          required: "Pflichtfeld ausfüllen",
        },
        reason: {
          label: "Weshalb?",
          required: "Pflichtfeld ausfüllen",
        },
        degree: {
          label: "Grad der Behinderung",
          required: "Pflichtfeld ausfüllen",
        },
      },
    },
    medicalHistory: {
      title: "Gesundheitliche Vorgeschichte",
      hadPastDiseasesOrDisabilities: {
        label:
          "Hatten Sie in der Vergangenheit Krankheiten oder Behinderungen?",
        required: "Pflichtfeld ausfüllen",
      },
      heartDiseaseInfo: {
        answer: {
          label: "Herz-, Kreislauf-, Gefäßerkrankungen",
          required: "Pflichtfeld ausfüllen",
        },
        which: {
          label: "Welche?",
          required: "Pflichtfeld ausfüllen",
          placeholder: "Auswählen",
          values: {
            [ApiHeartDisease.HypertensionHypotension]:
              "Hypertonie / Hypotonie (hoher / niedriger Blutdruck)",
            [ApiHeartDisease.CardiacArrhythmia]:
              "Herzrythmusstörungen: Bradycardie / Tachykardie (langsamer / schneller Herzschlag)",
            [ApiHeartDisease.CoronaryHeartDisease]:
              "Koronare Herzkrankheit (KHK)",
            [ApiHeartDisease.HeartAttack]: "Herzinfarkt",
            [ApiHeartDisease.Stroke]: "Schlaganfall",
          },
        },
        bypass: {
          label: "Bypass",
        },
        stent: {
          label: "Stent",
        },
      },
      nervousSystemInfo: {
        answer: {
          label:
            "Nervensystem (z.B. Kopfschmerzen, Migräne, Multiple Skelose (MS), Epilepsie, Parkinson, etc.)",
          required: "Pflichtfeld ausfüllen",
        },
      },
      bonesJointsAndSpineInfo: {
        answer: {
          label: "Knochen- und Gelenksystem / Wirbelsäule",
          required: "Pflichtfeld ausfüllen",
        },
        which: {
          label: "Welche?",
          required: "Pflichtfeld ausfüllen",
        },
      },
      bladderKidneysAbdominalOrganInfo: {
        answer: {
          label:
            "Blase, Nieren, Unterleibsorgan (z.B. Harnwegsinfekte, Nierenbeckenentzündung, Endometriose, etc.)",
          required: "Pflichtfeld ausfüllen",
        },
      },
      allergiesAndIntoleranceInfo: {
        answer: {
          label:
            "Allergien / Unverträglichkeiten (z.B. Lactose, Fructose, Medikamente, Heuschnupfen)",
          required: "Pflichtfeld ausfüllen",
        },
        which: {
          label: "Welche?",
          required: "Pflichtfeld ausfüllen",
        },
      },
      earNoseThroatInfo: {
        answer: {
          label: "Hals / Nasen / Ohren",
          required: "Pflichtfeld ausfüllen",
        },
      },
      bronchiaLungsInfo: {
        answer: {
          label: "Bronchien / Lunge (z.B. Astma bronchiale, COPD)",
          required: "Pflichtfeld ausfüllen",
        },
      },
      cancerInfo: {
        answer: {
          label: "Krebserkrankung",
          required: "Pflichtfeld ausfüllen",
        },
        whichAndWhen: {
          label: "Welche und wann?",
          required: "Pflichtfeld ausfüllen",
        },
        chemoRadiationTherapy: {
          label: "Chemo- / Strahlentherapie",
        },
      },
      stomachAndIntestinesInfo: {
        answer: {
          label: "Magen / Darm (z.B. Morbus Crohn, Colitis ulcerosa)",
          required: "Pflichtfeld ausfüllen",
        },
      },
      liverInfo: {
        answer: {
          label:
            "Leber (z.B. Fettleber (Steatosis hepatis), Hepatitis, Gallensteine, Gallenblase)",
          required: "Pflichtfeld ausfüllen",
        },
      },
      diabetesInfo: {
        answer: {
          label: "Diabetes",
          required: "Pflichtfeld ausfüllen",
        },
      },
      eatingDisorderInfo: {
        answer: {
          label: "Essstörung",
          required: "Pflichtfeld ausfüllen",
        },
        which: {
          label: "Welche?",
          required: "Pflichtfeld ausfüllen",
          placeholder: "Auswählen",
          values: {
            [ApiEatingDisorder.AnorexieNervosa]:
              "Anorexie Nervosa (Magersucht)",
            [ApiEatingDisorder.BulimieNervosa]:
              "Bulimie Nervosa (Ess-Brech-Sucht)",
          },
        },
      },
      mentalIllnessInfo: {
        answer: {
          label: "Psychische Erkrankung",
          required: "Pflichtfeld ausfüllen",
        },
        description: {
          label: "Beschreibung",
          required: "Pflichtfeld ausfüllen",
        },
        which: {
          label: "Welche?",
          required: "Pflichtfeld ausfüllen",
          placeholder: "Auswählen",
          values: {
            [ApiMentalIllness.Depression]: "Depression",
            [ApiMentalIllness.AnxietyDisorder]: "Angststörung",
            [ApiMentalIllness.SomatizationDisorder]: "Somatisierungsstörung",
            [ApiMentalIllness.Borderline]: "Borderline",
            [ApiMentalIllness.BipolarDisorder]: "Bipolare Störung",
            [ApiMentalIllness.Psychosis]: "Psychose",
            [ApiMentalIllness.ObsessiveCompulsiveDisorder]: "Zwangsstörung",
          },
        },
      },
      thyroidInfo: {
        answer: {
          label: "Schilddrüse",
          required: "Pflichtfeld ausfüllen",
        },
        which: {
          label: "Welche?",
          required: "Pflichtfeld ausfüllen",
          placeholder: "Auswählen",
          values: {
            [ApiThyroidDisease.Hypothyreosis]:
              "Hypothyreose (Schilddrüsenunterfunktion)",
            [ApiThyroidDisease.Nodule]: "Knoten (kalt, warm, heiß)",
            [ApiThyroidDisease.Hyperthyreoisis]:
              "Hyperthyreose (Schilddrüsenüberfunktion)",
            [ApiThyroidDisease.HashimotoThyreoiditis]: "Hashimoto-Thyreoiditis",
          },
        },
      },
      addictionsInfo: {
        answer: {
          label: "Suchterkrankungen",
          required: "Pflichtfeld ausfüllen",
        },
        description: {
          label: "Beschreibung",
          required: "Pflichtfeld ausfüllen",
        },
        which: {
          label: "Welche?",
          required: "Pflichtfeld ausfüllen",
          placeholder: "Auswählen",
          values: {
            [ApiAddiction.Alcohol]: "Alkohol",
            [ApiAddiction.Cannabis]: "Cannabis",
            [ApiAddiction.Nicotine]: "Nikotine",
            [ApiAddiction.IllegalDrugs]: "Illegale Drogen",
          },
        },
        amount: {
          label: "Tägliche / wöchentliche / monatliche Menge",
          required: "Pflichtfeld ausfüllen",
        },
        since: {
          label: "Seit wann",
          required: "Pflichtfeld ausfüllen",
        },
        notAnymoreSince: {
          label: "Nicht mehr seit",
        },
      },
      tuberculosisInfo: {
        answer: {
          label: "Tuberkulose",
          required: "Pflichtfeld ausfüllen",
        },
      },
      overweightInfo: {
        answer: {
          label: "Übergewicht / Adipositas",
          required: "Pflichtfeld ausfüllen",
        },
        description: {
          label: "Beschreibung",
          required: "Pflichtfeld ausfüllen",
        },
        heightInCm: {
          label: "Körpergröße (in cm)",
          required: "Pflichtfeld ausfüllen",
        },
        weightInKg: {
          label: "Körpergewicht (in kg)",
          required: "Pflichtfeld ausfüllen",
        },
      },
      boneFractureBrainTraumaInfo: {
        answer: {
          label: "Unfälle: Knochenbruch / Hirntrauma",
          required: "Pflichtfeld ausfüllen",
        },
        description: {
          label: "Beschreibung",
          required: "Pflichtfeld ausfüllen",
        },
        whatWhenAndWhere: {
          label: "Was, wann und wie?",
          required: "Pflichtfeld ausfüllen",
        },
      },
      miscellaneousInfo: {
        answer: {
          label: "Sonstiges",
          required: "Pflichtfeld ausfüllen",
        },
        description: {
          label: "Beschreibung",
          required: "Pflichtfeld ausfüllen",
        },
      },
    },
    retirement: {
      title: "Antrag auf Rente",
      appliedForRetirement: {
        label: "Haben Sie eine Rente beantragt?",
        required: "Pflichtfeld ausfüllen",
      },
      reason: {
        label: "Weshalb?",
        required: "Pflichtfeld ausfüllen",
      },
      reductionOfEarningCapacity: {
        label: "Minderung der Erwerbsfähigkeit",
        required: "Pflichtfeld ausfüllen",
      },
    },
    booleanWithUnknown: {
      values: {
        [ApiYesNoDontKnowAnswer.Yes]: "Ja",
        [ApiYesNoDontKnowAnswer.No]: "Nein",
        [ApiYesNoDontKnowAnswer.DontKnow]: "Weiß ich nicht",
      },
    },
  },
};
