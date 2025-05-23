/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDentitionType,
  ApiMihStatus,
  ApiOralHygieneStatus,
  ApiOrthodonticFinding,
  ApiOrthodonticStatus,
} from "@eshg/dental-api";
import { OptionalFieldValue } from "@eshg/lib-portal";

export interface ExaminationFormValues
  extends AdditionalInformationFormValues,
    NoteFormValues {}

export interface AdditionalInformationFormValues {
  dentitionType: OptionalFieldValue<ApiDentitionType>;
  oralHygieneStatus?: OptionalFieldValue<ApiOralHygieneStatus>;
  mihStatus?: OptionalFieldValue<ApiMihStatus>;
  orthodonticFindings: ApiOrthodonticFinding[];
  orthodonticStatus?: OptionalFieldValue<ApiOrthodonticStatus>;
  fluorideVarnishApplied: OptionalFieldValue<boolean>;
  plaque: boolean;
  calculus: boolean;
  gingivitis: boolean;
  parodontitis: boolean;
  individualProphylaxis: boolean;
  fissureSealing: boolean;
  tartarRemoval: boolean;
  gingivitisTreatment: boolean;
  orthodonticTreatment: boolean;
  plaqueTreatment: boolean;
  inspectionAppointment: boolean;
}

interface NoteFormValues {
  note: OptionalFieldValue<string>;
}

export type EmptinessRules<T> = {
  [K in keyof T]-?: (value: T[K]) => boolean;
};
