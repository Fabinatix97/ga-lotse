/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseModal,
  BaseModalPropsRequiredClose,
  QueryBoundary,
} from "@eshg/lib-portal";

import { FinalizeInspectionModalContent } from "@/lib/businessModules/inspection/components/inspection/execution/FinalizeInspectionModalContent";

export type FinalizeInspectionModalProps = {
  inspectionId: string;
} & Omit<BaseModalPropsRequiredClose, "children" | "modalTitle">;

export function FinalizeInspectionModal({
  sx,
  ...props
}: Readonly<FinalizeInspectionModalProps>) {
  return (
    <QueryBoundary>
      <BaseModal
        key="finalize-inspection-modal"
        modalTitle="Signatur"
        sx={{ width: 820, ...sx }}
        {...props}
      >
        <FinalizeInspectionModalContent {...props} />
      </BaseModal>
    </QueryBoundary>
  );
}
