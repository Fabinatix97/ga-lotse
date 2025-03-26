/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCLAudioField,
  ApiCLImageField,
  ApiGetChecklistsResponse,
  ApiGetChecklistsResponseToJSON,
  ApiInspection,
  ApiInspectionToJSON,
} from "@eshg/inspection-api";
import { isString } from "remeda";
import { vi } from "vitest";

import { API_CACHE_NAME } from "@/serviceWorker/common/common";

import {
  API_INSPECTION_CHECKLISTS_PATH,
  API_INSPECTION_INSPECTIONS_INCIDENTS_PATH,
  API_INSPECTION_INSPECTIONS_PATH,
} from "./config";
import { decrypt, decryptJson, encryptJson } from "./cryptoMock";

export const apiCache: Record<string, Response> = {};

const notImplemented = new Error("not implemented");

function getKey(request: Request) {
  const url = isString(request) ? request : request.url;
  return url.replace(/^https?:\/\/[^/]*/, "");
}

const caches = {
  open(cacheName: string): Promise<Cache> {
    if (cacheName !== API_CACHE_NAME) {
      return Promise.reject(notImplemented);
    }
    return Promise.resolve({
      match: (request: Request): Promise<Response | undefined> => {
        const key = getKey(request);
        return Promise.resolve(apiCache[key]?.clone());
      },
      put: (request: Request, response: Response) => {
        const key = getKey(request);
        apiCache[key] = response;
        return Promise.resolve();
      },
      keys: (): Promise<readonly Request[]> => {
        return Promise.resolve(
          Object.keys(apiCache).map(
            (key) => new Request(`http://localhost${key}`),
          ),
        );
      },
      matchAll: (): Promise<Response[]> => {
        return Promise.resolve(
          Object.values(apiCache).map((response) => response.clone()),
        );
      },
      add: () => Promise.reject(notImplemented),
      addAll: () => Promise.reject(notImplemented),
      delete: () => Promise.reject(notImplemented),
    });
  },
};

vi.stubGlobal("caches", caches);

const INSPECTION: ApiInspection = {
  externalId: "00000000-0000-4000-8000-000000000000",
  title: "Begehung für Rothko, Mark",
  status: "IN_PROGRESS",
  challenging: false,
  facility: {
    id: "a4a9edf7-2d72-4173-b74f-b1502cc3bb7b",
    baseFacility: {
      id: "63f288cb-f921-4bbd-a992-8b6c3c41768e",
      name: "Rothko, Mark",
      emailAddresses: [],
      phoneNumbers: [],
      referenceVersion: 0,
      contactPersons: [],
      contactAddress: {
        country: "DE",
        city: "ffm",
        postalCode: "456",
        differentName: undefined,
        postbox: "123",
        type: "PostboxAddress",
      },
      differentBillingAddress: undefined,
      dataOrigin: "MANUAL",
      outdated: false,
    },
    banned: false,
    suspicious: false,
    active: true,
    objectType: {
      id: "ed76f01f-6021-48d2-a75b-716d83670184",
      name: "Ambulante medizinische Einrichtung",
      routineInterval: 730,
      complaintInterval: 365,
      standardDuration: 3,
      standardBufferTime: 2,
      emailAnnouncement: false,
    },
  },
  type: "INITIAL",
  phase: "EXECUTING",
  result: "OPEN",
  selectedChecklistDefinitionVersions: [],
  selectedPacklistDefinitionRevisions: [],
  inventories: [],
  resources: [],
  plannedAppointment: {
    start: new Date("0000-12-31T23:06:32Z"),
    end: new Date("0001-01-01T00:06:32Z"),
    assignedTo: {
      userId: "a9041175-bde5-4054-a0ba-c9a9713be621",
      username: "dummy",
      email: "dummy@ga-lotse.de",
      phoneNumber: "+49 555 123 100",
      externalChatUsername: "dummy",
      firstName: "Max",
      lastName: "Mustermann",
      enabled: true,
    },
  },
  executedAppointment: {
    start: new Date("0000-12-31T23:06:32Z"),
    end: new Date("0001-01-01T00:06:32Z"),
    assignedTo: {
      userId: "a9041175-bde5-4054-a0ba-c9a9713be621",
      username: "dummy",
      email: "dummy@ga-lotse.de",
      phoneNumber: "+49 555 123 100",
      externalChatUsername: "dummy",
      firstName: "Max",
      lastName: "Mustermann",
      enabled: true,
    },
  },
  announcement: undefined,
  reportId: undefined,
  reportInfo: undefined,
  followupInfo: undefined,
  incidents: [],
};

export const CHECKBOX_ELEMENT_INDEX = 0;
export const IMAGE_ELEMENT_INDEX = 1;
export const AUDIO_ELEMENT_INDEX = 2;
export const IMAGE_ELEMENT: { type: "IMAGE" } & ApiCLImageField = {
  type: "IMAGE",
  id: "00000000-0000-4000-8000-000000000003",
  context: {
    type: "IMAGE",
    id: "309a42a7-44c3-4dd3-aeb9-99c0cbcab48b",
    text: "Bild",
    mandatory: false,
    note: undefined,
    help: undefined,
  },
  imageMetaData: [],
  incident: false,
};
export const AUDIO_ELEMENT: { type: "AUDIO" } & ApiCLAudioField = {
  type: "AUDIO",
  id: "00000000-0000-5000-8000-000000000003",
  context: {
    type: "Audio",
    id: "b98e445c-e232-44e2-9213-bedcd7a44222",
    text: "Audio",
    mandatory: false,
    note: undefined,
    help: undefined,
  },
  audioMetaData: [],
  incident: false,
};

export const CHECKBOX_ELEMENT_TITLE = "checkbox element title";
const CHECKLIST: ApiGetChecklistsResponse = {
  checklists: [
    {
      id: "00000000-0000-4000-8000-000000000001",
      coreChecklist: false,
      context: {
        id: "1fa41831-815b-4092-80d1-25e9d0907af1",
        defId: "1f51f770-c494-4576-b04a-f083b728e8c8",
        name: "Arztpraxen und Praxen für ambulantes Operieren",
        description: "",
        validFrom: new Date("2024-02-01T00:00:00Z"),
        validTo: undefined,
        version: 1,
        repositoryVersion: undefined,
        sections: [
          {
            id: "2b6cd749-b144-4336-90ce-5d9e4da65437",
            title: "Händedesinfektion",
            elements: [
              {
                type: "CHECKBOX",
                id: "4b8372e3-cf01-4188-b412-952be1bcd7a0",
                text: CHECKBOX_ELEMENT_TITLE,
                mandatory: false,
                note: undefined,
                help: undefined,
                textModuleTrue: undefined,
                textModuleFalse: undefined,
              },
              {
                type: "IMAGE",
                id: "309a42a7-44c3-4dd3-aeb9-99c0cbcab48b",
                text: "Bild",
                mandatory: false,
                note: undefined,
                help: undefined,
              },
              {
                type: "AUDIO",
                id: "b98e445c-e232-44e2-9213-bedcd7a44222",
                text: "Audio",
                mandatory: false,
                note: undefined,
                help: undefined,
              },
            ],
          },
        ],
        expandable: true,
        deleted: false,
      },
      sections: [
        {
          id: "a2c19506-9a20-4043-8a63-7ae851ea737f",
          context: {
            id: "2b6cd749-b144-4336-90ce-5d9e4da65437",
            title: "Händedesinfektion",
            elements: [],
          },
          elements: [
            {
              type: "CHECKBOX",
              id: "00000000-0000-4000-8000-000000000002",
              context: {
                type: "CHECKBOX",
                id: "4b8372e3-cf01-4188-b412-952be1bcd7a0",
                text: CHECKBOX_ELEMENT_TITLE,
                mandatory: false,
                note: undefined,
                help: undefined,
                textModuleTrue: undefined,
                textModuleFalse: undefined,
              },
              checked: undefined,
              incident: false,
            },
            IMAGE_ELEMENT,
            AUDIO_ELEMENT,
          ],
        },
      ],
    },
  ],
};

apiCache[API_INSPECTION_INSPECTIONS_PATH] = new Response(
  await encryptJson(ApiInspectionToJSON(INSPECTION)),
);
apiCache[API_INSPECTION_CHECKLISTS_PATH] = new Response(
  await encryptJson(ApiGetChecklistsResponseToJSON(CHECKLIST)),
);
apiCache[API_INSPECTION_INSPECTIONS_INCIDENTS_PATH] = new Response(
  await encryptJson([]),
);

export async function getFromCache(path: string): Promise<unknown> {
  const response = apiCache[path];
  if (response) {
    return decryptJson(await response.clone().arrayBuffer());
  } else {
    return undefined;
  }
}

export async function getFileFromCache(path: string): Promise<ArrayBufferLike> {
  const response = apiCache[path];
  if (response) {
    return decrypt(await response.clone().arrayBuffer());
  } else {
    throw new Error(`${path} not found in cache`);
  }
}
