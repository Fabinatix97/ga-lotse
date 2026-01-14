/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Button, ButtonProps, IconButton } from "@mui/joy";
import { createElement, useState } from "react";

interface ToggleButtonProps extends Omit<ButtonProps, "onToggle"> {
  asIcon?: boolean;
  onToggle?: (pressed: boolean) => void;
}

/**
 * A toggle button.
 *
 * See <a href="https://mui.com/joy-ui/react-toggle-button-group/#basics">
 * here</a> for explanation: <i>"Note that Joy UI doesn't provide a Toggle
 * Button component but rather a Toggle Button Group container component. The
 * reason for that is that according to the WAI ARIA pattern, it's better to
 * use aria-pressed on the Button or Icon Button component instead."<i>
 */
export function ToggleButton(props: ToggleButtonProps) {
  const { onClick, onToggle, asIcon, children, defaultChecked, ...restProps } =
    props;
  const [pressed, setPressed] = useState(defaultChecked ?? false);

  const Component = asIcon ? IconButton : Button;

  return (
    <>
      {createElement(
        Component,
        {
          onClick: (e) => {
            const newValue = !pressed;
            setPressed(newValue);
            onToggle?.(newValue);
            onClick?.(e);
          },
          ...restProps,
        },
        children,
      )}
    </>
  );
}
