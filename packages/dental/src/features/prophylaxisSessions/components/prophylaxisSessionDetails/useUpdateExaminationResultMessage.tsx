/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProphylaxisSessionExaminationUpdateResult } from "@eshg/dental-api";
import { useAlert, useSnackbar } from "@eshg/lib-portal";

import { ProphylaxisSessionExamination } from "../../api/models/ProphylaxisSessionExamination";
import { useProphylaxisSessionStore } from "../../stores/prophylaxisSession/ProphylaxisSessionStoreProvider";

interface UseUpdateExaminationResultMessage {
  open: (response: ApiProphylaxisSessionExaminationUpdateResult) => void;
  close: () => void;
}

export function useUpdateExaminationResultMessage(): UseUpdateExaminationResultMessage {
  const alert = useAlert();
  const snackbar = useSnackbar();

  const participants = useProphylaxisSessionStore(
    (state) => state.participants,
  );

  function open(response: ApiProphylaxisSessionExaminationUpdateResult): void {
    if (withoutErrors(response)) {
      snackbar.confirmation("Untersuchungen erfolgreich gespeichert.");
      return;
    }

    const openAlert =
      response.failedExaminationUpdates.length > 0
        ? alert.error
        : alert.warning;

    openAlert({
      title: "Es konnten nicht alle Daten gespeichert werden.",
      messageComponent: "div",
      message: (
        <>
          {personMessage(response.failedPersonUpdates, participants)}
          {examinationMessage(response.failedExaminationUpdates, participants)}
        </>
      ),
      closeable: true,
    });
  }

  function close(): void {
    alert.close();
  }

  return { open, close };
}

function withoutErrors(response: ApiProphylaxisSessionExaminationUpdateResult) {
  return (
    response.failedExaminationUpdates.length === 0 &&
    response.failedPersonUpdates.length === 0
  );
}

function personMessage(
  childIds: string[],
  participants: ProphylaxisSessionExamination[],
) {
  if (childIds.length === 0) {
    return "";
  }

  const children = childIds
    .map((id) => participants.find((p) => p.id === id))
    .filter((entry) => entry !== undefined);

  return getMessage("persönlichen Daten", childIds, children);
}

function examinationMessage(
  examinationIds: string[],
  participants: ProphylaxisSessionExamination[],
) {
  if (examinationIds.length === 0) {
    return "";
  }

  const children = examinationIds
    .map((id) => participants.find((p) => p.examinationId === id))
    .filter((entry) => entry !== undefined);

  return getMessage("Untersuchungsdaten", examinationIds, children);
}

function getName(child: ProphylaxisSessionExamination | undefined) {
  return `${child?.firstName ?? "<Vorname>"} ${child?.lastName ?? "<Nachname>"}`;
}

function getMessage(
  type: "Untersuchungsdaten" | "persönlichen Daten",
  ids: string[],
  children: ProphylaxisSessionExamination[],
) {
  const summary =
    ids.length === 1 ? (
      <>
        Die {type} von <strong>{getName(children[0])}</strong> konnten nicht
        gespeichert werden.
      </>
    ) : (
      <>
        Die {type} von {ids.length} Kindern konnten nicht gespeichert werden.
      </>
    );

  const list =
    ids.length > 1 ? (
      <ul>
        {children.map((child) => (
          <li key={child.id}>{getName(child)}</li>
        ))}
      </ul>
    ) : undefined;

  return (
    <>
      <p>{summary}</p>
      {list}
    </>
  );
}
