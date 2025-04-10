/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";
import { useMemo } from "react";

import { ConfiguratorModuleName } from "@/lib/configurator/api/models/configuratorModuleName";
import { useUpdateDepartmentInfo } from "@/lib/configurator/api/mutations/useUpdateDepartmentInfo";
import { useGetDepartmentInfo } from "@/lib/configurator/api/queries/useGetDepartmentInfo";
import {
  ConfiguratorForm,
  FormSection,
} from "@/lib/configurator/components/shared/ConfiguratorForm";
import { useTabStatus } from "@/lib/configurator/components/shared/hooks/useTabStatus";

enum FormNames {
  USE_INFO_OF_HEALTH_DEPARTMENT = "useInfoOfHealthDepartment",
  DEPARTMENT_NAME = "departmentName",
  ABBREVIATION = "abbreviation",
  STREET = "street",
  HOUSE_NUMBER = "houseNumber",
  country = "country",
  POSTAL_CODE = "postalCode",
  CITY = "city",
  PHONE_NUMBER = "phoneNumber",
  HOMEPAGE = "homepage",
  EMAIL = "email",
  LATITUDE = "latitude",
  LONGITUDE = "longitude",
}

export interface DepartmentInfoFormModel extends FormikValues {
  [FormNames.USE_INFO_OF_HEALTH_DEPARTMENT]?: "DEFAULT" | "CUSTOM";
  [FormNames.DEPARTMENT_NAME]: string;
  [FormNames.ABBREVIATION]: string;
  [FormNames.STREET]: string;
  [FormNames.HOUSE_NUMBER]: string;
  [FormNames.country]: string;
  [FormNames.POSTAL_CODE]: string;
  [FormNames.CITY]: string;
  [FormNames.PHONE_NUMBER]: string;
  [FormNames.HOMEPAGE]: string;
  [FormNames.EMAIL]: string;
  [FormNames.LATITUDE]: number | "";
  [FormNames.LONGITUDE]: number | "";
}

export type DepartmentInfoModuleName = Exclude<
  ConfiguratorModuleName,
  "officialMedicalService"
>;

export function DepartmentInfo(props: { module: DepartmentInfoModuleName }) {
  const { currentTabStatus } = useTabStatus({
    moduleName: props.module,
    tabButtonName:
      props.module === "baseModule"
        ? "Angaben zum Gesundheitsamt"
        : "Angaben zur Fachabteilung",
  });
  const { baseValues: defaultValues, moduleValues: initialValues } =
    useGetDepartmentInfo(props.module);
  const onSubmit = useUpdateDepartmentInfo(props.module);
  const showChooser = props.module !== "baseModule";

  function title() {
    switch (props.module) {
      case "baseModule":
        return "Angaben zum Gesundheitsamt";
      case "measlesProtection":
        return "Angaben zur Fachabteilung Masernschutz";
      case "medicalRegistry":
        return "Angaben zur Fachabteilung Medizinalaufsicht";
      case "schoolEntry":
        return "Angaben zur Fachabteilung Einschulung";
      case "sexWork":
        return "Angaben zur Fachabteilung Sexarbeit";
      case "stiProtection":
        return "Angaben zur Fachabteilung HIV-STI-Beratung";
      case "travelMedicine":
        return "Angaben zur Fachabteilung Impfberatung";
    }
  }

  const sections = useMemo(() => {
    const formSections = [
      {
        content: {
          type: "field",
          rows: [
            {
              fields: [
                {
                  type: "text",
                  name: FormNames.DEPARTMENT_NAME,
                  label: "Name des Gesundheitsamts",
                  required: "Bitte den Namen des Gesundheitsamts angeben",
                },
              ],
            },
            {
              fields: [
                {
                  type: "text",
                  name: FormNames.ABBREVIATION,
                  label: "Kürzel",
                  required: "Bitte das Kürzel angeben",
                },
              ],
            },
          ],
        },
      },
      {
        title: "Adresse und Kontakt",
        content: {
          type: "field",
          rows: [
            {
              fields: [
                {
                  type: "text",
                  name: FormNames.STREET,
                  label: "Straße",
                  required: "Bitte die Straße angeben",
                },
                {
                  type: "text",
                  name: FormNames.HOUSE_NUMBER,
                  label: "Haus Nr.",
                  required: "Bitte die Hausnummer angeben",
                  width: {
                    width: "20%",
                  },
                },
              ],
            },
            {
              fields: [
                {
                  type: "text",
                  name: FormNames.country,
                  label: "Adresszusatz",
                },
              ],
            },
            {
              fields: [
                {
                  type: "text",
                  name: FormNames.POSTAL_CODE,
                  label: "Postleitzahl",
                  required: "Bitte die Postleitzahl angeben",
                  maxLength: 5,
                  width: {
                    width: "20%",
                  },
                },
                {
                  type: "text",
                  name: FormNames.CITY,
                  label: "Ort",
                  required: "Bitte den Ort angeben",
                },
              ],
            },
            {
              fields: [
                {
                  type: "text",
                  name: FormNames.PHONE_NUMBER,
                  label: "Telefonnummer",
                  required: "Bitte die Telefonnummer angeben",
                },
              ],
            },
            {
              fields: [
                {
                  type: "text",
                  name: FormNames.HOMEPAGE,
                  label: "Webseite",
                  required: "Bitte die URL zu der Webseite angeben",
                },
              ],
            },
            {
              fields: [
                {
                  type: "text",
                  name: FormNames.EMAIL,
                  label: "E-Mail-Adresse",
                  required: "Bitte die E-Mail-Adresse angeben",
                },
              ],
            },
          ],
        },
      },
      {
        title: "GPS-Koordinaten",
        content: {
          type: "field",
          rows: [
            {
              fields: [
                {
                  type: "number",
                  name: FormNames.LATITUDE,
                  label: "Breitengrad",
                  required: "Bitte den Breitengrad angeben",
                  placeholder: "z.B. 50.2435345543",
                },
                {
                  type: "number",
                  name: FormNames.LONGITUDE,
                  label: "Längengrad",
                  required: "Bitte den Längengrad angeben",
                  placeholder: "z.B. 8.692728306879",
                },
              ],
            },
          ],
        },
      },
    ] satisfies FormSection[];

    if (showChooser) {
      return [
        {
          content: {
            type: "choose",
            name: FormNames.USE_INFO_OF_HEALTH_DEPARTMENT,
            options: [
              {
                label: "Angaben von Gesundheitsamt übernehmen",
                value: "DEFAULT",
                sections: [
                  {
                    content: {
                      type: "text",
                      entries: [
                        {
                          label: "Name des Gesundheitsamts",
                          content: defaultValues.departmentName,
                        },
                        {
                          label: "Kürzel",
                          content: defaultValues.abbreviation,
                        },
                      ],
                    },
                  },
                  {
                    content: {
                      type: "text",
                      title: "Adresse und Kontakt",
                      entries: [
                        {
                          label: "Straße, Haus Nr.",
                          content: `${defaultValues.street} ${defaultValues.houseNumber}`,
                        },
                        {
                          label: "Land",
                          content:
                            defaultValues.country.length === 0
                              ? "Nicht definiert"
                              : defaultValues.country,
                        },
                        {
                          label: "Postleitzahl, Ort",
                          content: `${defaultValues.postalCode} ${defaultValues.city}`,
                        },
                        {
                          label: "Telefonnummer",
                          content: defaultValues.phoneNumber,
                        },
                        {
                          label: "Webseite",
                          content: defaultValues.homepage,
                        },
                        {
                          label: "E-Mail-Adresse",
                          content: defaultValues.email,
                        },
                      ],
                    },
                  },
                  {
                    content: {
                      type: "text",
                      title: "GPS-Koordinaten",
                      entries: [
                        {
                          label: "Breitengrad, Längengrad",
                          content: `${defaultValues.latitude}, ${defaultValues.longitude}`,
                        },
                      ],
                    },
                  },
                ],
              },
              {
                label: "Abweichende Angaben für Fachabteilung",
                value: "CUSTOM",
                sections: formSections,
              },
            ],
          },
        } satisfies FormSection,
      ];
    }
    return formSections;
  }, [showChooser, defaultValues]);

  return (
    <ConfiguratorForm
      sheets={[
        {
          title: title(),
          sections,
        },
      ]}
      initialValues={initialValues}
      onSubmit={onSubmit}
      status={currentTabStatus}
    />
  );
}
