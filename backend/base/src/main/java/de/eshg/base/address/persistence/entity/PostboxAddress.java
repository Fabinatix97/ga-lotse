/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.address.persistence.entity;

public interface PostboxAddress extends Address {

  String getPostbox();

  void setPostbox(String postbox);
}
