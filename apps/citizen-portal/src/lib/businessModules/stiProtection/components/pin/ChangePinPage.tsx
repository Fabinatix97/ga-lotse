/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik, FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";

import { FormPlus, useSnackbar } from "@eshg/lib-portal";
import { ApiUpdatePinRequest } from "@eshg/sti-protection-api";

import { useUpdatePin } from "@/lib/businessModules/stiProtection/api/mutations/citizenApi";
import { parsePin } from "@/lib/businessModules/stiProtection/components/appointment/PinField";
import { useCitizenRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { LogoutButton } from "@/lib/shared/components/buttons/LogoutButton";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";
import { useScopedRouter } from "@/lib/shared/components/scopedLinks";

import { ChangePinConfirm } from "./ChangePinConfirm";
import { ChangePinForm } from "./ChangePinForm";

export interface ChangePinFormData {
  currentPin?: string;
  newPin?: string;
  repeatedPin?: string;
  hasSavedPin: boolean;
  hasConfirmedPin: boolean;
}

const INITIAL_VALUES: ChangePinFormData = {
  hasSavedPin: false,
  hasConfirmedPin: false,
  currentPin: "",
  newPin: "",
  repeatedPin: "",
};

export function ChangePinPage() {
  const { t } = useTranslation("stiProtection/pin");
  const citizenRoutes = useCitizenRoutes();
  const router = useScopedRouter();
  const snackbar = useSnackbar();
  const updatePin = useUpdatePin();

  function mapToApi(values: ChangePinFormData): ApiUpdatePinRequest {
    return {
      currentPin: parsePin(values.currentPin!),
      newPin: parsePin(values.newPin!),
    };
  }

  async function handleSubmit(
    values: ChangePinFormData,
    formikHelpers: FormikHelpers<ChangePinFormData>,
  ) {
    const { setFieldValue, setFieldError, setSubmitting } = formikHelpers;

    if (!values.hasSavedPin) {
      await updatePin.mutateAsync(mapToApi(values), {
        onSuccess: () => {
          void setFieldValue("hasSavedPin", true).then(() => {
            setSubmitting(false);
            snackbar.confirmation(t("form.confirmation"));
          });
        },
        onError: () => {
          setFieldError("currentPin", t("form.current_pin.invalid"));
          snackbar.error(t("form.current_pin.invalid"));
        },
      });
    } else {
      router.push(citizenRoutes.personalArea.index(undefined));
    }
  }

  return (
    <PageLayout>
      <PageContent>
        <PageTitle
          toolbar={<LogoutButton text={t("translation:common.leave")} />}
        >
          {t("title")}
        </PageTitle>
        <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
          {({ values }) => (
            <FormPlus>
              {!values.hasSavedPin ? <ChangePinForm /> : <ChangePinConfirm />}
            </FormPlus>
          )}
        </Formik>
      </PageContent>
    </PageLayout>
  );
}
