/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
} from "@eshg/lib-employee-portal";
import { PropsWithChildren } from "react";

import { ProcedureDetailsToolbar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/ProceduresDetailsToolbar";

export type OfficialMedicalServiceDetailsPageProps = Readonly<{
  params: OfficialMedicalServiceDetailsPageParams;
}>;

export interface OfficialMedicalServiceDetailsPageParams {
  id: string;
}

export default function OfficialMedicalServiceDetailsLayout(
  props: PropsWithChildren<OfficialMedicalServiceDetailsPageProps>,
) {
  return (
    <StickyToolbarLayout
      toolbar={<ProcedureDetailsToolbar id={props.params.id} />}
    >
      <MainContentLayout fullViewportHeight>{props.children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
