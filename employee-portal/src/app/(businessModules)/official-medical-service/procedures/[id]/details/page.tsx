/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { OfficialMedicalServiceDetailsPageProps } from "@/app/(businessModules)/official-medical-service/procedures/[id]/layout";

export default function OfficialMedicalServiceProcedureDetailsPage(
  props: OfficialMedicalServiceDetailsPageProps,
) {
  return <div>ID: {props.params.id}</div>;
}
