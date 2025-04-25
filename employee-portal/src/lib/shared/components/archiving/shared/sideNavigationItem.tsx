/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Inventory2Outlined } from "@mui/icons-material";

import { ApiUserRole } from "@eshg/base-api";
import { SideNavigationItem, hasUserRole } from "@eshg/lib-employee-portal";

import { routes } from "./routes";

export const sideNavigationItems: SideNavigationItem[] = [
  {
    type: "SideNavigationParentItem",
    name: "Archivierung",
    decorator: <Inventory2Outlined />,
    subItems: [
      {
        name: "Begehung",
        href: routes.archive.module.inspection,
        accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
      },
      {
        name: "Einschulung",
        href: routes.archive.module.schoolEntry,
        accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
      },
      {
        name: "Impfberatung",
        href: routes.archive.module.travelMedicine,
        accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
      },
      {
        name: "Masernschutz",
        href: routes.archive.module.measlesProtection,
        accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
      },
      {
        name: "Medizinalaufsicht",
        href: routes.archive.module.medicalRegistry,
        accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
      },
      {
        name: "HIV-STI",
        href: routes.archive.module.stiProtection,
        accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
      },
    ],
  },
  {
    type: "SideNavigationParentItem",
    name: "Archiv-Admin",
    decorator: <Inventory2Outlined />,
    subItems: [
      {
        name: "Begehung",
        href: routes.archiveAdmin.module.inspection,
        accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
      },
      {
        name: "Einschulung",
        href: routes.archiveAdmin.module.schoolEntry,
        accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
      },
      {
        name: "Impfberatung",
        href: routes.archiveAdmin.module.travelMedicine,
        accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
      },
      {
        name: "Masernschutz",
        href: routes.archiveAdmin.module.measlesProtection,
        accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
      },
      {
        name: "Medizinalaufsicht",
        href: routes.archiveAdmin.module.medicalRegistry,
        accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
      },
      {
        name: "HIV-STI",
        href: routes.archiveAdmin.module.stiProtection,
        accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
      },
    ],
  },
];
