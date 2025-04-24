/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { routes } from "@/lib/configurator/shared/routes";

export type ConfiguratorModuleName = keyof typeof routes;

export const configuratorNameMapping: Record<ConfiguratorModuleName, string> = {
  baseModule: "Grundmodul",
  schoolEntry: "Einschulungsuntersuchung",
  travelMedicine: "Impfberatung",
  measlesProtection: "Masernschutz",
  medicalRegistry: "Medizinalaufsicht",
  stiProtection: "HIV-STI Beratung",
  sexWork: "Sexarbeit",
  officialMedicalService: "Amtsärztliche Dienste",
  opendata: "Open Data",
};
