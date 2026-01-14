/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A handle that can be used to access the dirty state (and the resetForm
 * function) of the form from outside components. Example:
 * ```
 *   const ref = useRef<SidebarFormHandle>(null);
 *
 *   function handleClose() {
 *     if (ref.current?.dirty)
 *       ref.current?.resetForm();
 *   }
 *
 *   <OuterComponent onClose={handleClose}>
 *     <SidebarForm ref={ref}> ... </SidebarForm>
 *   </OuterComponent>
 * ```
 */
export interface SidebarFormHandle {
  dirty: boolean;
  resetForm: () => void;
  resetErrors: () => void;
}
