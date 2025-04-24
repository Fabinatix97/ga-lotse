/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/configurator";

export const routes = {
  baseModule: {
    index: `${basePath}/base-module`,
    departmentInfo: `${basePath}/base-module/department-info`,
  },
  schoolEntry: {
    index: `${basePath}/school-entry`,
    departmentInfo: `${basePath}/school-entry/department-info`,
    openingHours: `${basePath}/school-entry/opening-hours`,
  },
  travelMedicine: {
    index: `${basePath}/travel-medicine`,
    departmentInfo: `${basePath}/travel-medicine/department-info`,
    openingHours: `${basePath}/travel-medicine/opening-hours`,
  },
  measlesProtection: {
    index: `${basePath}/measles-protection`,
    departmentInfo: `${basePath}/measles-protection/department-info`,
    openingHours: `${basePath}/measles-protection/opening-hours`,
  },
  medicalRegistry: {
    index: `${basePath}/medical-registry`,
    departmentInfo: `${basePath}/medical-registry/department-info`,
  },
  stiProtection: {
    index: `${basePath}/sti-protection`,
    departmentInfo: `${basePath}/sti-protection/department-info`,
    openingHours: `${basePath}/sti-protection/opening-hours`,
  },
  sexWork: {
    index: `${basePath}/sexwork`,
    departmentInfo: `${basePath}/sexwork/department-info`,
    openingHours: `${basePath}/sexwork/opening-hours`,
  },
  officialMedicalService: {
    index: `${basePath}/official-medical-service`,
    openingHours: `${basePath}/official-medical-service/opening-hours`,
  },
  opendata: {
    index: `${basePath}/opendata`,
  },
} as const;
