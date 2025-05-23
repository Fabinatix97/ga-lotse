/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Grid, Sheet, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { FormPlus, isAdult, isInteger, toUtcDate } from "@eshg/lib-portal";

import Loading from "@/app/[lang]/loading";
import {
  getReportCaseForm,
  setReportCaseForm,
} from "@/lib/businessModules/measlesProtection/helpers/reportCaseForm.storage";
import { useRoutes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { useReplaceSearchParams } from "@/lib/shared/hooks/searchParams/useReplaceSearchParams";
import { useSearchParam } from "@/lib/shared/hooks/useSearchParam";

import { ReportCaseOverview } from "./ReportCaseOverview";
import { ReportCaseSuccess } from "./ReportCaseSuccess";
import {
  AffectedPersonForm,
  createEmptyAffectedPerson,
} from "./subforms/AffectedPersonForm";
import {
  CustodiansFieldArray,
  createEmptyCustodian,
} from "./subforms/CustodianForm";
import { FacilityForm, facilityInitial } from "./subforms/FacilityForm";
import { AffectedPersonFormInputs, ReportMeaslesCase } from "./types";

export function FormHeader({ children }: { children: string }) {
  return (
    <Grid xxs={12}>
      <Typography level="h2">{children}</Typography>
    </Grid>
  );
}

export function FormSectionLabel({ value }: { value: string }) {
  return (
    <Grid xxs={12}>
      <Typography level="h3">{value}</Typography>
    </Grid>
  );
}

export const reportMeaslesCaseFormInitialValues: ReportMeaslesCase = {
  affectedPersons: [createEmptyAffectedPerson()],
  facility: facilityInitial,
  otherFacilityTypeInformation: "",
  type: "OTHER",
  confirmPrivacyNotice: false,
  confirmPrivacyPolicy: false,
};

export const reportCaseFormPages = {
  facilityInfo: {
    pageNumber: 0,
  },
  affectedPerson: {
    pageNumber: 1,
  },
  custodian: {
    pageNumber: 2,
  },
  review: {
    pageNumber: 3,
  },
  success: {
    pageNumber: 4,
  },
};

type ReportCaseFormPageOption = keyof typeof reportCaseFormPages;
export function getPageNumber(page: ReportCaseFormPageOption) {
  return reportCaseFormPages[page].pageNumber;
}

const reportCaseSubformStyles: SxProps = {
  backgroundColor: "white",
  borderRadius: "xl",
  p: 3,
  flex: 1,
  mr: byBreakpoint({
    mobile: 0,
    desktop: 2,
  }),
};

interface ReportMeaslesCaseFormProps {
  onSubmit: (reports: ReportMeaslesCase) => Promise<void>;
}

export function ReportCaseForm({ onSubmit }: ReportMeaslesCaseFormProps) {
  const router = useRouter();
  const routes = useRoutes();
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();
  const [pageNumber] = useSearchParam("page", "number");
  const [currentAffectedPersonIndex] = useSearchParam("person", "number");
  const [formValues, setFormValues] = useState<ReportMeaslesCase | null>(null);
  const formRef = useRef<FormikProps<ReportMeaslesCase>>(null);

  const goToPage = useCallback(
    (page: ReportCaseFormPageOption) => {
      replaceSearchParams([
        {
          name: "page",
          value: getPageNumber(page),
        },
        ...(currentAffectedPersonIndex
          ? [
              {
                name: "person",
                value: currentAffectedPersonIndex,
              },
            ]
          : []),
      ]);
    },
    [replaceSearchParams, currentAffectedPersonIndex],
  );

  useEffect(() => {
    if (
      !searchParams.get("page") ||
      !isInteger(pageNumber) ||
      pageNumber > reportCaseFormPages.success.pageNumber ||
      pageNumber < reportCaseFormPages.facilityInfo.pageNumber
    ) {
      goToPage("facilityInfo");
    }
  }, [goToPage, pageNumber, searchParams]);

  useEffect(() => {
    if (!formValues) {
      const storedReportCaseFormValues: ReportMeaslesCase | null =
        getReportCaseForm();

      setFormValues(
        storedReportCaseFormValues ?? reportMeaslesCaseFormInitialValues,
      );
    }
  }, [setFormValues, formValues]);

  async function handleRequiresCustodian() {
    if (!formRef.current || !isInteger(currentAffectedPersonIndex)) return;
    const { setValues, values } = formRef.current;
    const { affectedPersons } = values;

    if (!affectedPersons[currentAffectedPersonIndex]?.custodians?.length) {
      affectedPersons[currentAffectedPersonIndex] = {
        ...affectedPersons[currentAffectedPersonIndex],
        custodians: [createEmptyCustodian()],
      } as AffectedPersonFormInputs;

      const nextValues = {
        ...values,
        affectedPersons,
      };

      setReportCaseForm(nextValues);
      await setValues(nextValues);
    }
  }

  async function handleFormSubmit(
    values: ReportMeaslesCase,
    _helpers: FormikHelpers<ReportMeaslesCase>,
  ) {
    switch (pageNumber) {
      case reportCaseFormPages.review.pageNumber:
        await onSubmit(values);
        goToPage("success");
        break;
      case reportCaseFormPages.facilityInfo.pageNumber:
        goToPage("affectedPerson");
        break;
      case reportCaseFormPages.affectedPerson.pageNumber:
        if (!isInteger(currentAffectedPersonIndex)) return;
        const affectedPerson =
          values.affectedPersons[currentAffectedPersonIndex];
        if (!affectedPerson) return;

        if (!isAdult(toUtcDate(affectedPerson.dateOfBirth))) {
          await handleRequiresCustodian();
          goToPage("custodian");
        } else {
          goToPage("review");
        }
        break;
      case reportCaseFormPages.custodian.pageNumber:
        goToPage("review");
        break;
      default:
        break;
    }

    if (
      isInteger(pageNumber) &&
      pageNumber < reportCaseFormPages.review.pageNumber
    ) {
      setReportCaseForm(values);
    }
  }

  return !formValues ? (
    <Sheet
      sx={{
        ...reportCaseSubformStyles,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem",
        mr: 0,
      }}
    >
      <Loading />
    </Sheet>
  ) : (
    <Formik
      initialValues={formValues}
      innerRef={formRef}
      onSubmit={handleFormSubmit}
    >
      {() => (
        <Box
          component={FormPlus}
          sx={{
            display: "flex",
            flexDirection: byBreakpoint({
              mobile: "column-reverse",
              desktop: "row",
            }),
            mb: "4rem",
          }}
        >
          {pageNumber === reportCaseFormPages.facilityInfo.pageNumber && (
            <FacilityForm
              name="facility"
              sx={reportCaseSubformStyles}
              onCancel={() => {
                setReportCaseForm();
                router.push(routes.organizationPath.overview);
              }}
            />
          )}
          {pageNumber === reportCaseFormPages.affectedPerson.pageNumber && (
            <AffectedPersonForm
              sx={reportCaseSubformStyles}
              onCancel={() => goToPage("facilityInfo")}
            />
          )}
          {pageNumber === reportCaseFormPages.custodian.pageNumber && (
            <CustodiansFieldArray
              name={`affectedPersons.${currentAffectedPersonIndex}.custodians`}
              sx={reportCaseSubformStyles}
              onCancel={() => goToPage("affectedPerson")}
            />
          )}
          {pageNumber === reportCaseFormPages.review.pageNumber && (
            <ReportCaseOverview
              sx={reportCaseSubformStyles}
              onCancel={() => {
                setReportCaseForm();
                router.push(routes.organizationPath.overview);
              }}
            />
          )}
          {pageNumber === reportCaseFormPages.success.pageNumber && (
            <ReportCaseSuccess />
          )}
        </Box>
      )}
    </Formik>
  );
}
