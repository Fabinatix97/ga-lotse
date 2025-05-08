/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { CertificatesTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/CertificatesTable";

export default async function VaccinationConsultationCertificatesPage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = await props.params;

  return <CertificatesTable procedureId={id} />;
}
