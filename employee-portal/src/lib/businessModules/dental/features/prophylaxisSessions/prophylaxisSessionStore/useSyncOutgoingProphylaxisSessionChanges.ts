/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiExaminationResult,
  ApiUpdateExaminationsInBulkRequest,
} from "@eshg/dental-api";
import { ChildExamination } from "@eshg/dental/api/models/ChildExamination";
import {
  AbsenceExaminationResult,
  ExaminationResult,
  FluoridationExaminationResult,
  ScreeningExaminationResult,
} from "@eshg/dental/api/models/ExaminationResult";
import { useUpdateProphylaxisSessionExaminations } from "@eshg/dental/api/mutations/prophylaxisSessionApi";
import { useEffect, useRef } from "react";

import { useProphylaxisSessionStore } from "./ProphylaxisSessionStoreProvider";

export function useSyncOutgoingProphylaxisSessionChanges() {
  const lastSynchronizedChanges = useRef<Set<string> | null>(null);
  const prophylaxisSessionId = useProphylaxisSessionStore((state) => state.id);
  const participants = useProphylaxisSessionStore(
    (state) => state.participants,
  );
  const changedExaminationsById = useProphylaxisSessionStore(
    (state) => state.changedExaminationsById,
  );
  const markAsSynchronized = useProphylaxisSessionStore(
    (state) => state.markAsSynchronized,
  );
  const { mutate: updateProphylaxisSessionExaminations } =
    useUpdateProphylaxisSessionExaminations(prophylaxisSessionId, {
      /**
       * pass success handler as hook option to ensure execution
       * @see https://tkdodo.eu/blog/mastering-mutations-in-react-query#some-callbacks-might-not-fire
       */
      onSuccess: markAsSynchronized,
    });

  useEffect(() => {
    if (
      changedExaminationsById.size > 0 &&
      changedExaminationsById !== lastSynchronizedChanges.current
    ) {
      lastSynchronizedChanges.current = changedExaminationsById;
      const changedExaminations = participants.filter((participant) =>
        changedExaminationsById.has(participant.examinationId),
      );
      updateProphylaxisSessionExaminations(
        changedExaminations.map(mapExaminationToRequest),
      );
    }
  }, [
    changedExaminationsById,
    participants,
    updateProphylaxisSessionExaminations,
    markAsSynchronized,
  ]);
}

function mapExaminationToRequest(
  examination: ChildExamination,
): ApiUpdateExaminationsInBulkRequest {
  return {
    id: examination.examinationId,
    version: examination.examinationVersion,
    result: mapExaminationResultToRequest(examination.result),
    note: examination.note,
  };
}

function mapExaminationResultToRequest(
  examinationResult: ExaminationResult | undefined,
): ApiExaminationResult | undefined {
  switch (examinationResult?.type) {
    case "screening":
      return mapScreeningResult(examinationResult);
    case "fluoridation":
      return mapFluoridationResult(examinationResult);
    case "absence":
      return mapAbsenceResult(examinationResult);
    case undefined:
      return undefined;
  }
}

function mapScreeningResult(
  screeningResult: ScreeningExaminationResult,
): ApiExaminationResult {
  return {
    type: "ScreeningExaminationResult",
    dentitionType: screeningResult.dentitionType,
    fluorideVarnishApplied: screeningResult.fluorideVarnishApplied,
    oralHygieneStatus: screeningResult.oralHygieneStatus,
    toothDiagnoses: Object.values(screeningResult.toothDiagnoses),
  };
}

function mapFluoridationResult(
  fluoridationResult: FluoridationExaminationResult,
): ApiExaminationResult {
  return {
    type: "FluoridationExaminationResult",
    fluorideVarnishApplied: fluoridationResult.fluorideVarnishApplied,
  };
}

function mapAbsenceResult(
  absenceResult: AbsenceExaminationResult,
): ApiExaminationResult {
  return {
    type: "AbsenceExaminationResult",
    reasonForAbsence: absenceResult.reasonForAbsence,
  };
}
