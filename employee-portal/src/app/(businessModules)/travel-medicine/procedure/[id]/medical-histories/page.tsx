/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { MedicalHistoriesContent } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/medicalHistory/MedicalHistoryContent";

export default function MedicalHistories(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = props.params;

  return <MedicalHistoriesContent procedureId={id}></MedicalHistoriesContent>;
}
