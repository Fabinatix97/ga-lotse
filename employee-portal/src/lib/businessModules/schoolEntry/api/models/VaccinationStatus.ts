/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiOtherVaccination,
  ApiVaccinationSchemeValue,
  ApiVaccinationStatus,
} from "@eshg/employee-portal-api/schoolEntry";

import {
  Versioned,
  mapVersioned,
} from "@/lib/businessModules/schoolEntry/api/models/Versioned";

export interface VaccinationStatus extends Versioned {
  vaccinationScheme?: ApiVaccinationSchemeValue;
  diphtheria?: number;
  tetanus?: number;
  pertussis?: number;
  hib?: number;
  polio?: number;
  hepatitisB?: number;
  pneumococcus?: number;
  mmr?: number;
  varicella?: number;
  meningococcusB?: number;
  meningococcusC?: number;
  hepatitisA?: number;
  rota?: number;
  tbe?: number;
  otherVaccinations: ApiOtherVaccination[];
  vaccinationPassPresented?: boolean;
  perkombiHbv?: boolean;
}

export function mapVaccinationStatus(
  response: ApiVaccinationStatus,
): VaccinationStatus {
  return {
    ...mapVersioned(response),
    vaccinationScheme: response.vaccinationScheme,
    diphtheria: response.diphtheria,
    tetanus: response.tetanus,
    pertussis: response.pertussis,
    hib: response.hib,
    polio: response.polio,
    hepatitisB: response.hepatitisB,
    pneumococcus: response.pneumococcus,
    mmr: response.mmr,
    varicella: response.varicella,
    meningococcusB: response.meningococcusB,
    meningococcusC: response.meningococcusC,
    hepatitisA: response.hepatitisA,
    rota: response.rota,
    tbe: response.tbe,
    otherVaccinations: response.otherVaccinations,
    vaccinationPassPresented: response.vaccinationPassPresented,
    perkombiHbv: response.perkombiHbv,
  };
}
