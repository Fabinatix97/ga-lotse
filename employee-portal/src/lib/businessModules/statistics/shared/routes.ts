/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/statistics";
const evaluationsPath = `${basePath}/evaluations`;
const reportsPath = `${basePath}/reports`;

export const routes = {
  evaluations: {
    index: evaluationsPath,
    details: (id: string) => ({
      index: `${evaluationsPath}/${id}`,
      table: `${evaluationsPath}/${id}/table`,
      reports: `${evaluationsPath}/${id}/reports`,
      dataQuality: `${evaluationsPath}/${id}/data-quality`,
    }),
    templates: {
      index: `${evaluationsPath}/templates`,
      repository: `${evaluationsPath}/templates/repository`,
    },
  },
  reports: {
    index: reportsPath,
    details: (id: string) => ({ index: `${reportsPath}/${id}` }),
  },
  geoShapes: { index: `${basePath}/geo-shapes` },
} as const;
