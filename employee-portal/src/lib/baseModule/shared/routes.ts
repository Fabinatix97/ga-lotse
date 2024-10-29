/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureType } from "@eshg/employee-portal-api/base";
import { isDefined } from "remeda";

const accountPath = "/account";
const auditLogPath = "/auditlog";
const auditLogAuthorizePath = `${auditLogPath}/authorize`;
const proceduresPath = "/procedures";
const tasksPath = "/tasks";
const contactsPath = "/contacts";
const resourcesPath = "/resources";
const inventoryPath = "/inventory";
const usersPath = "/users";
const metricsPath = "/metrics";
const opendataPath = "/opendata";
const gdprPath = "/gdpr";

export const routes = {
  index: "/",
  account: {
    sessions: `${accountPath}/sessions`,
    loginProtocol: `${accountPath}/login-protocol`,
  },
  procedures: {
    index: proceduresPath,
  },
  tasks: {
    index: tasksPath,
  },
  calendar: "/calendar",
  contacts: {
    index: contactsPath,
    details: (contactId: string) => `${contactsPath}/${contactId}`,
    history: (contactId: string, historyId: number, addressId?: number) =>
      `${contactsPath}/${contactId}/history-details?historyId=${historyId}${isDefined(addressId) ? `&addressId=${addressId}` : ""}`,
  },
  gdpr: {
    index: gdprPath,
    details: (procedureId: string) => `${gdprPath}/${procedureId}`,
  },
  resources: {
    index: resourcesPath,
    details: (resourceId: string) => `${resourcesPath}/${resourceId}`,
  },
  inventory: {
    index: inventoryPath,
    details: (inventoryId: string) => `${inventoryPath}/${inventoryId}`,
  },
  users: {
    index: usersPath,
    details: (userId: string) => `${usersPath}/${userId}`,
  },
  metrics: {
    index: metricsPath,
    details: (businessModuleName: string, procedureType: ApiProcedureType) =>
      `${metricsPath}/${businessModuleName}/${procedureType}`,
  },
  auditlog: {
    index: auditLogPath,
    access: (source: string, date: string) =>
      `${auditLogPath}/${source}/${date}/decrypt`,
    authorize: {
      index: auditLogAuthorizePath,
      grantAccess: (source: string, date: string) =>
        `${auditLogAuthorizePath}/${source}/${date}/grant-access`,
    },
  },
  opendata: {
    index: opendataPath,
    details: (externalId: string) => `${opendataPath}/${externalId}`,
  },
  measlesProtection: "/measles-protection",
  inbox: "/inbox-procedures",
  chat: "/chat",
  releaseNotes: "/release-notes",
  acknowledgements: "/acknowledgements",
  privacy: "/privacy",
  accessibility: "/accessibility",
  contact: "/contact",
  usageNotes: "/usage-notes",
} as const;
