/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiConsultationType,
  ApiPersonLanguage,
} from "@eshg/prostitute-protection-api";

export interface ApiProstituteProtectionProcedureOverview {
  accessCode?: string;
  appointment?: {
    end: Date;
    start: Date;
  };
  appointmentStart?: Date;
  createdAt: Date;
  id: string;
  dateOfBirth: Date | undefined;
  firstName: string | undefined;
  lastName: string;
  alias: string | undefined;
  status: string;
  assignedEmployee: string;
  consultationType: ApiConsultationType;
  languages?: ApiPersonLanguage[];
}

export const proceduresMock: ApiProstituteProtectionProcedureOverview[] = [
  {
    accessCode: "QTHBGJWk8LCuNbyav",
    appointment: {
      end: new Date("2026-05-17T02:17:00.123Z"),
      start: new Date("2026-05-17T00:45:00.123Z"),
    },
    appointmentStart: new Date("2026-05-17T00:45:00.123Z"),
    createdAt: new Date("2025-05-17T00:00:00.123Z"),
    id: "00b883cc-edbb-4756-b315-954aa40e527e",
    status: "OPEN",
    dateOfBirth: new Date("2000-08-04T00:00:00+02:00"),
    firstName: undefined,
    lastName: "Doe",
    alias: "Ella",
    assignedEmployee: "Max Mustermann",
    consultationType: ApiConsultationType.Initial,
    languages: [ApiPersonLanguage.German],
  },
  {
    accessCode: "8XkNqDysy6c7hfeB5",
    appointment: {
      end: new Date("2025-12-31T03:02:00.123Z"),
      start: new Date("2025-12-31T01:14:00.123Z"),
    },
    appointmentStart: new Date("2025-12-31T01:14:00.123Z"),
    createdAt: new Date("2024-02-01T00:00:00.123Z"),
    id: "9bb4a85f-03c7-4ba7-94dc-b8af3a16c4dd",
    status: "OPEN",
    dateOfBirth: new Date("1991-05-04T00:00:00+02:00"),
    firstName: "Rachel",
    lastName: "Moore",
    alias: "Rea",
    assignedEmployee: "Max Mustermann",
    consultationType: ApiConsultationType.Initial,
    languages: [ApiPersonLanguage.English, ApiPersonLanguage.French],
  },
  {
    accessCode: "fAq3TrESF36wVQqNU",
    appointment: {
      end: new Date("2026-02-01T01:40:00.123Z"),
      start: new Date("2026-02-01T00:23:00.123Z"),
    },
    appointmentStart: new Date("2026-02-01T00:23:00.123Z"),
    createdAt: new Date("2025-02-01T00:00:00.123Z"),
    id: "c43bb343-cce5-445e-b529-d7145ad3fbc9",
    status: "OPEN",
    dateOfBirth: new Date("1985-04-18T00:00:00+02:00"),
    firstName: "Olivia",
    lastName: "Scott",
    alias: "Liv",
    assignedEmployee: "Max Mustermann",
    consultationType: ApiConsultationType.Initial,
    languages: [ApiPersonLanguage.German, ApiPersonLanguage.French],
  },
  {
    accessCode: "66mBZwYbkoiYsvpx7",
    appointment: {
      end: new Date("2026-02-01T03:21:00.123Z"),
      start: new Date("2026-02-01T01:38:00.123Z"),
    },
    appointmentStart: new Date("2026-02-01T01:38:00.123Z"),
    createdAt: new Date("2025-02-01T00:00:00.123Z"),
    id: "e1005492-810d-4719-ba34-92eb89505881",
    status: "OPEN",
    dateOfBirth: new Date("1979-06-24T00:00:00+02:00"),
    firstName: undefined,
    lastName: "Collins",
    alias: "John Doe",
    assignedEmployee: "Max Mustermann",
    consultationType: ApiConsultationType.Initial,
    languages: [ApiPersonLanguage.English],
  },
  {
    accessCode: "jaMGpFPWredyxKTHq",
    appointment: {
      end: new Date("2025-12-01T03:08:00.123Z"),
      start: new Date("2025-12-01T01:42:00.123Z"),
    },
    appointmentStart: new Date("2025-12-01T01:42:00.123Z"),
    createdAt: new Date("2025-10-01T00:00:00.123Z"),
    id: "c34f20e6-63b0-4167-85d2-c1aa204746a5",
    status: "OPEN",
    dateOfBirth: new Date("1981-03-04T00:00:00+02:00"),
    firstName: "Hannah",
    lastName: "Cooper",
    alias: "Hannah",
    assignedEmployee: "Max Mustermann",
    consultationType: ApiConsultationType.Initial,
    languages: [ApiPersonLanguage.Polish, ApiPersonLanguage.German],
  },
  {
    accessCode: "NxM7feUaEMsSYQ5Vr",
    appointment: {
      end: new Date("2026-02-01T02:11:00.123Z"),
      start: new Date("2026-02-01T00:28:00.123Z"),
    },
    appointmentStart: new Date("2026-02-01T00:28:00.123Z"),
    createdAt: new Date("2025-10-01T00:00:00.123Z"),
    id: "4c6c75d9-7a81-4014-a771-79cc51848780",
    status: "OPEN",
    dateOfBirth: new Date("1975-11-04T00:00:00+02:00"),
    firstName: "John",
    lastName: "Doe",
    alias: "J.D.",
    assignedEmployee: "Max Mustermann",
    consultationType: ApiConsultationType.Initial,
    languages: [ApiPersonLanguage.Hungarian, ApiPersonLanguage.Russian],
  },
  {
    accessCode: "mt86PEp9PLiUi5P3h",
    appointment: {
      end: new Date("2025-12-11T03:22:00.123Z"),
      start: new Date("2025-12-11T01:41:00.123Z"),
    },
    appointmentStart: new Date("2025-12-11T01:41:00.123Z"),
    createdAt: new Date("2025-02-01T00:00:00.123Z"),
    id: "f17d2180-a4e5-4e43-908b-efc17a4a1cf2",
    status: "OPEN",
    dateOfBirth: new Date("1985-10-13T00:00:00+02:00"),
    firstName: "Liam",
    lastName: "Turner",
    alias: "Liam",
    assignedEmployee: "Max Mustermann",
    consultationType: ApiConsultationType.Initial,
    languages: undefined,
  },
  {
    accessCode: "gWzCAvF9HLCrXFefx",
    appointment: {
      end: new Date("2026-02-21T02:19:00.123Z"),
      start: new Date("2026-02-21T01:48:00.123Z"),
    },
    appointmentStart: new Date("2026-02-21T01:48:00.123Z"),
    createdAt: new Date("2025-02-01T00:00:00.123Z"),
    id: "de90b9ff-5d6b-41bb-bdc3-2932f21b920f",
    status: "OPEN",
    dateOfBirth: new Date("1985-05-04T00:00:00+02:00"),
    firstName: "Emily",
    lastName: "Parker",
    alias: "Emily",
    assignedEmployee: "Max Mustermann",
    consultationType: ApiConsultationType.Initial,
    languages: [
      ApiPersonLanguage.Russian,
      ApiPersonLanguage.German,
      ApiPersonLanguage.English,
    ],
  },
];
