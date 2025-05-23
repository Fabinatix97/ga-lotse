/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ConfiguratorEndpointName,
  ConfiguratorModuleName,
} from "@/lib/configurator/shared/types";

export const configuratorNameMapping: Record<ConfiguratorModuleName, string> = {
  BASE: "Grundmodul",
  SCHOOL_ENTRY: "Einschulungsuntersuchung",
  TRAVEL_MEDICINE: "Impfberatung",
  MEASLES_PROTECTION: "Masernschutz",
  MEDICAL_REGISTRY: "Medizinalaufsicht",
  STI_PROTECTION: "HIV-STI Beratung",
  SEX_WORK: "Sexarbeit",
  OFFICIAL_MEDICAL_SERVICE: "Amtsärztliche Dienste",
  OPEN_DATA: "Open Data",
};

export function getTabNamesByEndpointName(
  module: ConfiguratorModuleName,
  endpointName: ConfiguratorEndpointName,
): string {
  switch (endpointName) {
    case "ACKNOWLEDGEMENTS_MARKDOWNS_CONFIG":
      return "Danksagungen";
    case "DEPARTMENT_INFO":
      return module === "BASE"
        ? "Angaben zum Gesundheitsamt"
        : "Angaben zur Fachabteilung";
    case "IMPRINT_MARKDOWNS_CONFIG":
      return "Impressum";
    case "OPENING_HOURS":
      return "Öffnungszeiten";
    case "SCHOOL_ENTRY":
      return "Fachliche Einstellungen";
    case "NOTIFICATION":
      return "Kontaktmöglichkeit per E-Mail";
    case "PRIVACY_NOTICE":
      return "Datenschutzhinweise";
  }
}
