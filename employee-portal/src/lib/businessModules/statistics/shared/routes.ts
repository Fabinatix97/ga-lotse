/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/statistics";
const statisticsPath = `${basePath}/statistics`;
const reportsPath = `${basePath}/reports`;

export const routes = {
  statistics: {
    index: statisticsPath,
    details: (id: string) => ({
      index: `${statisticsPath}/${id}`,
      table: `${statisticsPath}/${id}/table`,
      reports: `${statisticsPath}/${id}/reports`,
      dataQuality: `${statisticsPath}/${id}/data-quality`,
    }),
    evaluationTemplates: {
      index: `${statisticsPath}/evaluation-templates`,
    },
  },
  reports: {
    index: reportsPath,
    details: (id: string) => ({ index: `${reportsPath}/${id}` }),
  },
  geoShapes: { index: `${basePath}/geo-shapes` },
} as const;
