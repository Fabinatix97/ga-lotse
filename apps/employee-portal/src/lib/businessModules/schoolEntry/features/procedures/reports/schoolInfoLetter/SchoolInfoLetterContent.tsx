/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack, Typography } from "@mui/joy";
import { FormikProps } from "formik";

import { ContentPanel, ContentPanelTitle } from "@eshg/lib-employee-portal";

import {
  SchoolInfoLetter,
  SchoolInfoLetterExaminationType,
} from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";
import {
  eyeExaminationInfoOtherEnum,
  hearingExaminationInfoOtherEnum,
  mapMeaslesProtectionComplete,
  physiciansRecommendationEnum,
  schoolAndPromotionHintsEnum,
  schoolInfoLetterExaminationTypeEnum,
  therapyAndPromotionInfoEnum,
} from "@/lib/businessModules/schoolEntry/features/procedures/reports/schoolInfoLetter/mappings";

import { LetterFieldBooleanRadioGroup } from "./LetterFieldBooleanRadioGroup";
import { LetterFieldCheckboxGroupField } from "./LetterFieldCheckboxGroupField";
import { LetterFieldHorizontalRadioGroup } from "./LetterFieldHorizontalRadioGroup";
import { LetterFieldMeaslesContraIndication } from "./LetterFieldMeaslesContraIndication";
import { LetterFieldSingleCheckbox } from "./LetterFieldSingleCheckbox";
import { LetterFieldTextarea } from "./LetterFieldTextarea";
import { LetterHeader } from "./LetterHeader";

export function SchoolInfoLetterContent({
  formikProps,
  data,
}: {
  formikProps: FormikProps<SchoolInfoLetter>;
  data: {
    defaultValuesLetter: SchoolInfoLetter;
    savedLetter: SchoolInfoLetter | undefined;
  };
}) {
  return (
    <Stack>
      <ContentPanel>
        <ContentPanelTitle>Schulinfobrief Konfigurator</ContentPanelTitle>
        <Sheet
          sx={(theme) => ({
            borderRadius: theme.spacing(3),
            paddingBlock: theme.spacing(6),
            paddingInline: theme.spacing(22),
          })}
        >
          <Stack gap={4.5}>
            <LetterHeader values={formikProps.values} />

            <Stack gap={3}>
              <LetterFieldHorizontalRadioGroup
                field="type"
                differentValues={
                  schoolInfoLetterExaminationTypeEnum[
                    data.defaultValuesLetter.type
                  ]
                }
                defaultValue={data.defaultValuesLetter.type}
                options={[
                  {
                    value: SchoolInfoLetterExaminationType.RegularExamination,
                    label:
                      schoolInfoLetterExaminationTypeEnum.REGULAR_EXAMINATION,
                  },
                  {
                    value: SchoolInfoLetterExaminationType.CanChild,
                    label: schoolInfoLetterExaminationTypeEnum.CAN_CHILD,
                  },
                  {
                    value: SchoolInfoLetterExaminationType.EntryLevel,
                    label: schoolInfoLetterExaminationTypeEnum.ENTRY_LEVEL,
                  },
                ]}
              />

              <LetterFieldSingleCheckbox
                field="postponed"
                label="Zurückgestellt"
                defaultValue={data.defaultValuesLetter.postponed}
              />
            </Stack>

            <Stack gap={3}>
              <Typography level="h3">
                Schul- und förderrelevante Hinweise
              </Typography>
              <LetterFieldCheckboxGroupField
                mapToReadableName={schoolAndPromotionHintsEnum}
                field="schoolAndPromotionHints"
                defaultValue={data.defaultValuesLetter.schoolAndPromotionHints}
                threeColumnStyling
              />

              <LetterFieldTextarea
                field="note"
                label="Bemerkung"
                defaultValue={data.defaultValuesLetter.note}
                minRows={5}
              />
            </Stack>

            <Stack gap={3}>
              <Typography level="h3">Masernschutz</Typography>
              <LetterFieldHorizontalRadioGroup
                differentValues={
                  mapMeaslesProtectionComplete(
                    data.defaultValuesLetter.measlesProtectionComplete,
                  ) ?? ""
                }
                field="measlesProtectionComplete"
                defaultValue={
                  data.defaultValuesLetter.measlesProtectionComplete
                }
                options={[
                  {
                    value: "yes",
                    label: mapMeaslesProtectionComplete("yes"),
                  },
                  {
                    value: "no",
                    label: mapMeaslesProtectionComplete("no"),
                  },
                  {
                    value: "undefined",
                    label: mapMeaslesProtectionComplete("undefined"),
                  },
                ]}
              />

              <LetterFieldSingleCheckbox
                defaultValue={
                  data.defaultValuesLetter.vaccinationPassNotPresented
                }
                field="vaccinationPassNotPresented"
                label="Impfbuch nicht vorgelegt"
              />
            </Stack>

            <LetterFieldMeaslesContraIndication
              defaultValue={data.defaultValuesLetter}
            />

            <Stack gap={3}>
              <Typography level="h3">Sehen</Typography>
              <LetterFieldBooleanRadioGroup
                field="eyeExaminationInfoConspicuous"
                defaultValue={
                  data.defaultValuesLetter.eyeExaminationInfoConspicuous
                }
                subtitle="Sehscreening auffällig"
              />

              <LetterFieldCheckboxGroupField
                field="eyeExaminationInfoOther"
                mapToReadableName={eyeExaminationInfoOtherEnum}
                defaultValue={data.defaultValuesLetter.eyeExaminationInfoOther}
                subtitle="Sonstige Angaben"
              />
            </Stack>

            <Stack gap={3}>
              <Typography level="h3">Hören</Typography>
              <LetterFieldBooleanRadioGroup
                field="hearingExaminationInfoConspicuous"
                defaultValue={
                  data.defaultValuesLetter.hearingExaminationInfoConspicuous
                }
                subtitle="Hörscreening auffällig"
              />

              <LetterFieldCheckboxGroupField
                field="hearingExaminationInfoOther"
                mapToReadableName={hearingExaminationInfoOtherEnum}
                defaultValue={
                  data.defaultValuesLetter.hearingExaminationInfoOther
                }
                subtitle="Sonstige Angaben"
              />
            </Stack>

            <Stack gap={3}>
              <Typography level="h3">Gesundheitliche Einschränkung</Typography>
              <LetterFieldSingleCheckbox
                defaultValue={
                  data.defaultValuesLetter.consultationWithCustodianRecommended
                }
                field="consultationWithCustodianRecommended"
                label="Rücksprache mit den Personensorgeberechtigten empfohlen"
                subtitle="Sonstige Angaben"
              />
            </Stack>

            <Stack gap={3}>
              <Typography level="h3">
                Laufende Therapien / Fördermaßnahmen
              </Typography>
              <LetterFieldCheckboxGroupField
                field="therapyAndPromotionInfo"
                mapToReadableName={therapyAndPromotionInfoEnum}
                defaultValue={data.defaultValuesLetter.therapyAndPromotionInfo}
              />
            </Stack>

            <Stack gap={3}>
              <Typography level="h3">Schulärztliche Empfehlung</Typography>
              <LetterFieldCheckboxGroupField
                field="physiciansRecommendation"
                mapToReadableName={physiciansRecommendationEnum}
                defaultValue={data.defaultValuesLetter.physiciansRecommendation}
                orientation="vertical"
              />
              <LetterFieldSingleCheckbox
                defaultValue={
                  data.defaultValuesLetter
                    .referredToFurtherConsultationFromSchool
                }
                field="referredToFurtherConsultationFromSchool"
                label="auf weitere Beratung der Schule verwiesen"
              />
            </Stack>

            <LetterFieldTextarea
              field="parentsWishNote"
              label="Elternwunsch"
              defaultValue={data.defaultValuesLetter.parentsWishNote}
              minRows={1}
            />

            <LetterFieldTextarea
              field="customRecommendation"
              label="Persönliche Bemerkung"
              defaultValue={data.defaultValuesLetter.customRecommendation}
              minRows={1}
            />
          </Stack>
        </Sheet>
      </ContentPanel>
    </Stack>
  );
}
