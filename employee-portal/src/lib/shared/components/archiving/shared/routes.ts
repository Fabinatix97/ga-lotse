/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export const routes = {
  archive: {
    module: {
      inspection: `/archiving/inspection`,
      measlesProtection: `/archiving/measles-protection`,
      schoolEntry: `/archiving/school-entry`,
      travelMedicine: `/archiving/travel-medicine`,
      stiProtection: `/archiving/sti-protection`,
    },
  },
  archiveAdmin: {
    module: {
      inspection: `/archiving-admin/inspection`,
      measlesProtection: `/archiving-admin/measles-protection`,
      schoolEntry: `/archiving-admin/school-entry`,
      travelMedicine: `/archiving-admin/travel-medicine`,
      stiProtection: `/archiving-admin/sti-protection`,
    },
  },
} as const;
