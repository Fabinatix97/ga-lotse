/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isString } from "remeda";

export function createPrecachedInspectionIdsBroadCastChannelEndpoint() {
  return new BroadcastChannel("precached-inspection-ids");
}

enum MessageType {
  InspectionChanged = "inspection-changed",
}

interface InspectionChanged {
  type: MessageType.InspectionChanged;
  inspectionId: string;
}

export function createInspectionChangedMessage(
  inspectionId: string,
): InspectionChanged {
  return {
    type: MessageType.InspectionChanged,
    inspectionId,
  };
}

export function isInspectionChangedMessage(
  message: unknown,
): message is InspectionChanged {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    message.type === MessageType.InspectionChanged &&
    "inspectionId" in message &&
    isString(message.inspectionId)
  );
}
