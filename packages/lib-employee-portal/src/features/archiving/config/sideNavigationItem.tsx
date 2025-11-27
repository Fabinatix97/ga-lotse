/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Inventory2Outlined } from "@mui/icons-material";
import { entries } from "remeda";

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";

import { useGetPublicConfig } from "../../../api/queries/publicConfig";
import {
  SideNavigationItem,
  SideNavigationSubItem,
} from "../../../types/sideNavigation";
import { hasUserRole } from "../../auth/utils/accessChecks";

import { archivingAdminRoutes, archivingRoutes } from "./routes";

type SubItemMap = Partial<Record<ApiBusinessModule, SideNavigationSubItem>>;

const subItemsArchiveMap: SubItemMap = {
  [ApiBusinessModule.OfficialMedicalService]: {
    name: "Amtsärztl. Dienst",
    href: archivingRoutes.module[ApiBusinessModule.OfficialMedicalService],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.Inspection]: {
    name: "Hygiene",
    href: archivingRoutes.module[ApiBusinessModule.Inspection],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.SchoolEntry]: {
    name: "Einschulung",
    href: archivingRoutes.module[ApiBusinessModule.SchoolEntry],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.TravelMedicine]: {
    name: "Impfberatung",
    href: archivingRoutes.module[ApiBusinessModule.TravelMedicine],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.MeaslesProtection]: {
    name: "Masernschutz",
    href: archivingRoutes.module[ApiBusinessModule.MeaslesProtection],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.MedicalRegistry]: {
    name: "Medizinalaufsicht",
    href: archivingRoutes.module[ApiBusinessModule.MedicalRegistry],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.StiProtection]: {
    name: "HIV-STI",
    href: archivingRoutes.module[ApiBusinessModule.StiProtection],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.Dental]: {
    name: "Zahnärztl. Dienst",
    href: archivingRoutes.module[ApiBusinessModule.Dental],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
  [ApiBusinessModule.MedsAbroad]: {
    name: "Reisen mit BtM",
    href: archivingRoutes.module[ApiBusinessModule.MedsAbroad],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchive),
  },
};

const subItemsArchiveAdminMap: SubItemMap = {
  [ApiBusinessModule.OfficialMedicalService]: {
    name: "Amtsärztl. Dienst",
    href: archivingAdminRoutes.module[ApiBusinessModule.OfficialMedicalService],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.Inspection]: {
    name: "Hygiene",
    href: archivingAdminRoutes.module[ApiBusinessModule.Inspection],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.SchoolEntry]: {
    name: "Einschulung",
    href: archivingAdminRoutes.module[ApiBusinessModule.SchoolEntry],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.TravelMedicine]: {
    name: "Impfberatung",
    href: archivingAdminRoutes.module[ApiBusinessModule.TravelMedicine],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.MeaslesProtection]: {
    name: "Masernschutz",
    href: archivingAdminRoutes.module[ApiBusinessModule.MeaslesProtection],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.MedicalRegistry]: {
    name: "Medizinalaufsicht",
    href: archivingAdminRoutes.module[ApiBusinessModule.MedicalRegistry],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.StiProtection]: {
    name: "HIV-STI",
    href: archivingAdminRoutes.module[ApiBusinessModule.StiProtection],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.Dental]: {
    name: "Zahnärztl. Dienst",
    href: archivingAdminRoutes.module[ApiBusinessModule.Dental],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
  [ApiBusinessModule.MedsAbroad]: {
    name: "Reisen mit BtM",
    href: archivingAdminRoutes.module[ApiBusinessModule.MedsAbroad],
    accessCheck: hasUserRole(ApiUserRole.ProcedureArchiveAdmin),
  },
};

export function useArchivingSideNavigationItems(): SideNavigationItem[] {
  const { activeModules } = useGetPublicConfig().data;
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
