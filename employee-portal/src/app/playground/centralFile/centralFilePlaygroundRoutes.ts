/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const baseUrl = "/playground/centralFile";
const acceptUpdateBaseUrl = `${baseUrl}/acceptUpdate`;

export const centralFilePlaygroundRoutes = {
  index: baseUrl,
  acceptUpdate: {
    index: acceptUpdateBaseUrl,
    applyUpdate: `${acceptUpdateBaseUrl}/update`,
  },
};
