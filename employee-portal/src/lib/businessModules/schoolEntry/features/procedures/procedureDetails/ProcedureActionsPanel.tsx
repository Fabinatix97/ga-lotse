/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiSchoolEntryFeature } from "@eshg/employee-portal-api/schoolEntry";
import { ReactNode } from "react";

import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/schoolEntry/api/queries/featureTogglesApi";
import { CloseProcedureModal } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/CloseProcedureModal";
import { DeleteProcedureModal } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/DeleteProcedureModal";
import { ReopenProcedureModal } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/ReopenProcedureModal";
import { OpenModalButton } from "@/lib/shared/components/buttons/OpenModalButton";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";

export function ProcedureActionsPanel(props: { procedure: ProcedureDetails }) {
  const closeProcedureEnabled = useIsNewFeatureEnabled(
    ApiSchoolEntryFeature.CloseProcedure,
  );
  const deleteProcedureEnabled = useIsNewFeatureEnabled(
    ApiSchoolEntryFeature.DeleteProcedure,
  );
  const reopenProcedureEnabled = useIsNewFeatureEnabled(
    ApiSchoolEntryFeature.ReopenProcedure,
  );

  const buttons: ReactNode[] = [];

  if (closeProcedureEnabled && !props.procedure.isClosed) {
    buttons.push(
      <OpenModalButton
        key="closeProcedure"
        renderModal={(modalProps) => (
          <CloseProcedureModal procedure={props.procedure} {...modalProps} />
        )}
      >
        Vorgang abschließen
      </OpenModalButton>,
    );
  }

  if (reopenProcedureEnabled && props.procedure.isClosed) {
    buttons.push(
      <OpenModalButton
        key="reopenProcedure"
        renderModal={(modalProps) => (
          <ReopenProcedureModal procedure={props.procedure} {...modalProps} />
        )}
        color="danger"
      >
        Vorgang wiedereröffnen
      </OpenModalButton>,
    );
  }

  if (deleteProcedureEnabled && props.procedure.isDeletable) {
    buttons.push(
      <OpenModalButton
        key="deleteProcedure"
        renderModal={(modalProps) => (
          <DeleteProcedureModal procedure={props.procedure} {...modalProps} />
        )}
        color="danger"
      >
        Vorgang löschen
      </OpenModalButton>,
    );
  }

  if (buttons.length === 0) {
    return null;
  }

  return <ContentPanel>{buttons}</ContentPanel>;
}
