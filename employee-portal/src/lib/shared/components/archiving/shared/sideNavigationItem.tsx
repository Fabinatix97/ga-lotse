/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Inventory2Outlined } from "@mui/icons-material";
import { entries } from "remeda";

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import {
  SideNavigationItem,
  SideNavigationSubItem,
  hasUserRole,
} from "@eshg/lib-employee-portal";

import { useServerConfig } from "@/lib/baseModule/api/queries/config";

import { routes } from "./routes";

type SubItemMap = Partial<Record<ApiBusinessModule, SideNavigationSubItem>>;

const subItemsArchiveMap: SubItemMap = {
  [ApiBusinessModule.OfficialMedicalService]: {
    name: "Amtsärztl. Dienst",
    href: routes.archive.module.officialMedicalService,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.Inspection]: {
    name: "Begehung",
    href: routes.archive.module.inspection,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.SchoolEntry]: {
    name: "Einschulung",
    href: routes.archive.module.schoolEntry,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.TravelMedicine]: {
    name: "Impfberatung",
    href: routes.archive.module.travelMedicine,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.MeaslesProtection]: {
    name: "Masernschutz",
    href: routes.archive.module.measlesProtection,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.MedicalRegistry]: {
    name: "Medizinalaufsicht",
    href: routes.archive.module.medicalRegistry,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.StiProtection]: {
    name: "HIV-STI",
    href: routes.archive.module.stiProtection,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
};

const subItemsArchiveAdminMap: SubItemMap = {
  [ApiBusinessModule.OfficialMedicalService]: {
    name: "Amtsärztl. Dienst",
    href: routes.archiveAdmin.module.officialMedicalService,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.Inspection]: {
    name: "Begehung",
    href: routes.archiveAdmin.module.inspection,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.SchoolEntry]: {
    name: "Einschulung",
    href: routes.archiveAdmin.module.schoolEntry,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.TravelMedicine]: {
    name: "Impfberatung",
    href: routes.archiveAdmin.module.travelMedicine,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.MeaslesProtection]: {
    name: "Masernschutz",
    href: routes.archiveAdmin.module.measlesProtection,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.MedicalRegistry]: {
    name: "Medizinalaufsicht",
    href: routes.archiveAdmin.module.medicalRegistry,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.StiProtection]: {
    name: "HIV-STI",
    href: routes.archiveAdmin.module.stiProtection,
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
};

export function useArchivingSideNavigationItems(): SideNavigationItem[] {
  const { activeModules } = useServerConfig().data;
  return [
    {
      type: "SideNavigationParentItem",
      name: "Archivierung",
      decorator: <Inventory2Outlined />,
      subItems: filterActiveModules(subItemsArchiveMap, activeModules),
    },
    {
      type: "SideNavigationParentItem",
      name: "Archiv-Admin",
      decorator: <Inventory2Outlined />,
      subItems: filterActiveModules(subItemsArchiveAdminMap, activeModules),
    },
  ];
}

function filterActiveModules(
  itemMap: SubItemMap,
  activeModules: ApiBusinessModule[],
) {
  return entries(itemMap)
    .filter(([module]) => activeModules.includes(module))
    .map(([_, item]) => item);
}
