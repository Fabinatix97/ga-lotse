/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AbsenceExaminationResult,
  ExaminationResult,
  FluoridationExaminationResult,
  ProphylaxisSessionExamination,
  ScreeningExaminationResult,
  useUpdateProphylaxisSessionExaminations,
} from "@eshg/dental";
import {
  ApiExaminationResult,
  ApiUpdateExaminationsInBulkRequest,
} from "@eshg/dental-api";
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
  examination: ProphylaxisSessionExamination,
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
    mihStatus: screeningResult.mihStatus,
    orthodonticFindings: screeningResult.orthodonticFindings ?? [],
    orthodonticStatus: screeningResult.orthodonticStatus,
    plaque: screeningResult.plaque,
    calculus: screeningResult.calculus,
    gingivitis: screeningResult.gingivitis,
    parodontitis: screeningResult.parodontitis,
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
