/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Formik } from "formik";

import { MultiStepForm, useMultiStepForm } from "@eshg/lib-portal";

const FORM_VALUES = {
  stepOne: {
    valueOne: 1,
    valueTwo: "two",
  },
  stepTwo: {
    valueThree: 3,
    valueFour: "four",
  },
};

export default function MultiStepFormPage() {
  return (
    <MultiStepForm<typeof FORM_VALUES>
      steps={[
        ({ values }) => <StepOne {...values.stepOne} />,
        ({ values }) => <StepTwo {...values.stepTwo} />,
      ]}
    >
      {({ Outlet, currentStep }) => {
        return (
          // eslint-disable-next-line no-console
          <Formik initialValues={FORM_VALUES} onSubmit={console.log}>
            {(props) => (
              <>
                <span>Step: {currentStep}</span>
                <Outlet {...props} />
              </>
            )}
          </Formik>
        );
      }}
    </MultiStepForm>
  );
}

function StepOne(props: typeof FORM_VALUES.stepOne) {
  const { goForward, goBack } = useMultiStepForm();
  return (
    <>
      <span>StepOne</span>
      <button onClick={goForward}>Forward</button>
      <button onClick={goBack}>Back</button>
      <pre>{JSON.stringify(props, undefined, 2)}</pre>
    </>
  );
}

function StepTwo(props: typeof FORM_VALUES.stepTwo) {
  const { goForward, goBack } = useMultiStepForm();
  return (
    <>
      <span>StepTwo</span>
      <button onClick={goForward}>Forward</button>
      <button onClick={goBack}>Back</button>
      <pre>{JSON.stringify(props, undefined, 2)}</pre>
    </>
  );
}
