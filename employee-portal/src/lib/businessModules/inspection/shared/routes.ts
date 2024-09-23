/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/inspection";
const checklistsPath = `${basePath}/checklist`;
const repositoryPath = `${basePath}/repository`;
const checklistDefinitionsPath = `${checklistsPath}/def`;
const facilitiesPath = `${basePath}/facility`;
const facilitiesWebSearchPath = `${facilitiesPath}/search`;
const objectTypesPath = `${basePath}/objecttype`;
const teamviewPath = `${basePath}/teamview`;
const proceduresPath = `${basePath}/procedures`;
const textBlocksPath = `${basePath}/textblocks`;
const inboxPath = `${basePath}/inbox`;
const packlistsPath = `${basePath}/packlist`;
const packlistDefinitionsPath = `${packlistsPath}/def`;

export const routes = {
  index: basePath,
  checklists: {
    definitions: {
      index: checklistDefinitionsPath,
      new: `${checklistDefinitionsPath}/new`,
      newVersion: (checklistDefId: string, checklistVersionId: string) =>
        `${checklistDefinitionsPath}/${checklistDefId}/versions/${checklistVersionId}/new`,
      viewVersion: (checklistDefId: string, checklistVersionId: string) =>
        `${checklistDefinitionsPath}/${checklistDefId}/versions/${checklistVersionId}`,
    },
  },
  repository: {
    index: repositoryPath,
    definitions: {
      viewCoreCldVersion: (
        repositoryChecklistDefinitionId: number,
        version: number,
      ) =>
        `${repositoryPath}/core-checklist/${repositoryChecklistDefinitionId}/versions/${version}`,
      viewCldVersion: (
        repositoryChecklistDefinitionId: number,
        version: number,
      ) =>
        `${repositoryPath}/checklist/${repositoryChecklistDefinitionId}/versions/${version}`,
    },
  },
  facilities: {
    webSearch: {
      index: facilitiesWebSearchPath,
      new: `${facilitiesWebSearchPath}/new`,
      edit: (webSearchId: string) =>
        `${facilitiesWebSearchPath}/${webSearchId}`,
      results: (webSearchId: string) =>
        `${facilitiesWebSearchPath}/${webSearchId}/results`,
    },
  },
  objectTypes: {
    index: objectTypesPath,
  },
  teamview: {
    index: teamviewPath,
  },
  procedures: {
    index: proceduresPath,
    details: (procedureId: string) => `${proceduresPath}/${procedureId}`,
    basedata: (procedureId: string) =>
      `${proceduresPath}/${procedureId}/basedata`,
    planning: (procedureId: string) =>
      `${proceduresPath}/${procedureId}/planning`,
    execution: (procedureId: string) =>
      `${proceduresPath}/${procedureId}/execution`,
    reportResult: (procedureId: string) =>
      `${proceduresPath}/${procedureId}/reportresult`,
    reportEditor: (procedureId: string, reportId: string) =>
      `${proceduresPath}/${procedureId}/reportresult/edit/${reportId}`,
    progressEntries: (procedureId: string) => ({
      index: `${proceduresPath}/${procedureId}/progress-entries`,
      details: (entryId: string) =>
        `${routes.procedures.progressEntries(procedureId).index}/${entryId}/details`,
    }),
    new: (procedureId: string) => `${proceduresPath}/new/${procedureId}`,
  },
  textBlocks: {
    index: textBlocksPath,
  },
  packlists: {
    definitions: {
      index: packlistDefinitionsPath,
      new: `${packlistDefinitionsPath}/new`,
      newVersion: (packlistDefId: string, packlistVersionId: string) =>
        `${packlistDefinitionsPath}/${packlistDefId}/versions/${packlistVersionId}/new`,
      viewVersion: (packlistDefId: string, packlistVersionId: string) =>
        `${packlistDefinitionsPath}/${packlistDefId}/versions/${packlistVersionId}`,
    },
  },
  inbox: {
    index: inboxPath,
    details: (inboxProcedureId: string) =>
      `${inboxPath}/${inboxProcedureId}/details`,
  },
} as const;
