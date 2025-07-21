/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RefObject, useEffect, useRef } from "react";

import {
  ApiExaminationResult,
  ApiUpdateChildDetailsInBulkRequest,
  ApiUpdateExaminationsInBulkRequest,
} from "@eshg/dental-api";
import { getEntityId } from "@eshg/lib-employee-portal";

import {
  AbsenceExaminationResult,
  ExaminationResult,
  FluoridationExaminationResult,
  ScreeningExaminationResult,
} from "../../../../api/models/ExaminationResult";
import { mapToothDiagnosesToRequest } from "../../../../utils/examination";
import { ProphylaxisSessionExamination } from "../../api/models/ProphylaxisSessionExamination";
import { useUpdateProphylaxisSessionExaminations } from "../../api/mutations/details";

import { useProphylaxisSessionStore } from "./ProphylaxisSessionStoreProvider";

export function useSyncOutgoingProphylaxisSessionChanges() {
  const lastSynchronizedExaminationChanges = useRef<Set<string> | null>(null);
  const lastSynchronizedParticipantDetailsChanges = useRef<Set<string> | null>(
    null,
  );
  const prophylaxisSessionId = useProphylaxisSessionStore((state) => state.id);
  const participants = useProphylaxisSessionStore(
    (state) => state.participants,
  );
  const changedExaminationsById = useProphylaxisSessionStore(
    (state) => state.changedExaminationsById,
  );
  const changedParticipantDetailsById = useProphylaxisSessionStore(
    (state) => state.changedParticipantDetailsById,
  );

  const { mutate: updateProphylaxisSessionExaminations } =
    useUpdateProphylaxisSessionExaminations(prophylaxisSessionId);

  useEffect(() => {
    if (
      changedExaminationsById.size > 0 ||
      changedParticipantDetailsById.size > 0
    ) {
      const examinationUpdates = resolveChangedParticipants(
        changedExaminationsById,
        lastSynchronizedExaminationChanges,
        participants,
        (participant) => participant.examinationId,
      ).map(mapExaminationToRequest);
      const childUpdates = resolveChangedParticipants(
        changedParticipantDetailsById,
        lastSynchronizedParticipantDetailsChanges,
        participants,
        (participant) => participant.id,
      ).map(mapParticipantDetailsToRequest);

      if (examinationUpdates.length > 0 || childUpdates.length > 0) {
        updateProphylaxisSessionExaminations({
          examinationUpdates,
          childUpdates,
        });
      }
    }
  }, [
    changedExaminationsById,
    changedParticipantDetailsById,
    participants,
    updateProphylaxisSessionExaminations,
  ]);
}

function resolveChangedParticipants(
  changedParticipantsById: Set<string>,
  lastSynchronizedChanges: RefObject<Set<string> | null>,
  participants: ProphylaxisSessionExamination[],
  getReferenceId: (participant: ProphylaxisSessionExamination) => string,
): ProphylaxisSessionExamination[] {
  if (changedParticipantsById === lastSynchronizedChanges.current) {
    return [];
  }

  lastSynchronizedChanges.current = changedParticipantsById;
  return participants.filter((participant) =>
    changedParticipantsById.has(getReferenceId(participant)),
  );
}

function mapParticipantDetailsToRequest(
  examination: ProphylaxisSessionExamination,
): ApiUpdateChildDetailsInBulkRequest {
  return {
    childId: examination.id,
    version: examination.version,
    firstName: examination.firstName,
    lastName: examination.lastName,
    dateOfBirth: examination.dateOfBirth,
    gender: examination.gender,
    groupName: examination.groupName,
    fluoridationConsent: examination.currentFluoridationConsent,
    procedureLabels: examination.procedureLabels.map(getEntityId),
  };
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
    blackStain: screeningResult.blackStain,
    toothDiagnoses: mapToothDiagnosesToRequest(screeningResult.toothDiagnoses),
    individualProphylaxis: screeningResult.individualProphylaxis,
    fissureSealing: screeningResult.fissureSealing,
    tartarRemoval: screeningResult.tartarRemoval,
    gingivitisTreatment: screeningResult.gingivitisTreatment,
    orthodonticTreatment: screeningResult.orthodonticTreatment,
    plaqueTreatment: screeningResult.plaqueTreatment,
    inspectionAppointment: screeningResult.inspectionAppointment,
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
