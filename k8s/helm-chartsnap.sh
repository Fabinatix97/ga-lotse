#!/bin/bash
# Copyright 2026 SCOOP Software GmbH, cronn GmbH
# SPDX-License-Identifier: AGPL-3.0-only


set -e

if [ -d "helmcharts/eshg-ctr/values/prod1/" ]; then
  yq eval-all '. as $item ireduce ({}; . * $item )' helmcharts/eshg-ctr/values/prod1/values.prod.central.yaml   helmcharts/eshg-ctr/values/cronn-test1/values.deploy-test.central.override.yaml   > helmcharts/eshg-ctr/values/cronn-test1/values.deploy-test.central.yaml
  yq eval-all '. as $item ireduce ({}; . * $item )' helmcharts/eshg-gas/values/prod1/values.prod.frankfurt.yaml helmcharts/eshg-gas/values/cronn-test1/values.deploy-test.frankfurt.override.yaml > helmcharts/eshg-gas/values/cronn-test1/values.deploy-test.frankfurt.yaml
fi

exitCode=0

for chart in ./helmcharts/*; do
  if [ ! -f "${chart}/Chart.yaml" ]; then
    continue
  fi

  helm dependency update "$chart"

  for k8sEnv in "${chart}"/values/*; do
    if [ ! -d "$k8sEnv" ]; then
      continue;
    fi

    for f in "${k8sEnv}"/values.*.yaml; do
      if [[ "$f" == *".deploy-test."* ]]; then
        commonValuesFile="${k8sEnv}"/../prod1/values.common.yaml
      else
        commonValuesFile="${k8sEnv}"/values.common.yaml
      fi

      if [ -f "$f" ] && [[ "$f" != *".override."* ]] && [[ "$f" != *".common."* ]]; then
        if ! helm chartsnap --fail-helm-error --chart "${chart}" -f "$f" --namespace snapshot-ns --config-file .chartsnap.yaml "$@" -- --values "$commonValuesFile" --values "$f" --set isSnapshot=true; then
          exitCode=1
        fi
      fi
    done
  done
done

exit $exitCode
