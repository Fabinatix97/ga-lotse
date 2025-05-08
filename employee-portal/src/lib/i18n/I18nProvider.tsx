/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import i18next from "i18next";
import { PropsWithChildren } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";

import { de as deLibPortal } from "@eshg/lib-portal/i18n/locales/de";
import { i18nNamespace as i18nNamespaceLibPortal } from "@eshg/lib-portal/i18n/namespace";

import { anamnesis as deOfficialMedicalServiceAnamnesis } from "@/lib/businessModules/officialMedicalService/locales/de/anamnesis";

const i18n = i18next.use(initReactI18next);

void i18n.init({
  // Only de is supported for now, no need to detect language
  lng: "de",
  resources: {
    de: {
      [i18nNamespaceLibPortal]: deLibPortal,
      "officialMedicalService/anamnesis": deOfficialMedicalServiceAnamnesis,
    },
  },
});

export function I18nProvider({ children }: PropsWithChildren) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
