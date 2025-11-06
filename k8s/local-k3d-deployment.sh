#!/bin/bash
# Copyright 2025 SCOOP Software GmbH, cronn GmbH
# SPDX-License-Identifier: AGPL-3.0-only


start=$(date +%s)

set -euo pipefail

function usage() {
>&2 cat << EOF
Usage: $0
  [ -n | --no-build ]
  [ -r | --remote-registry <name> ]
  [ -v | --version-tag <name> ]
  [ -p | --production-config <name> ]
  [ -t | --tls-port <port> ]
  [ -h | --help ]
EOF
exit 1
}

# defaults
buildApplication=true
remoteRegistry=""
registry=""
repository=""
productionConfig=""
tlsPort=443
versionTag="latest"
CI_REGISTRY=${CI_REGISTRY:-}
LOCAL_KUBECTL_CONTEXT_NAME="k3d-ga-lotse"

if ! args=$(getopt -a -o hnv:r:t:p: --long help,no-build,version-tag:,remote-registry:,tls-port:,production-config: -- "$@"); then
  usage
fi

eval set -- "${args}"
while :
do
  case $1 in
    -h | --help)              usage                              ;;
    -n | --no-build)          buildApplication=false   ; shift   ;;
    -r | --remote-registry)   remoteRegistry="$2"      ; shift 2 ;;
    -v | --version-tag)       versionTag="$2"          ; shift 2 ;;
    -p | --production-config) productionConfig="$2"    ; shift 2 ;;
    -t | --tls-port)          tlsPort="$2"             ; shift 2 ;;
    --) shift; break ;;
    *) >&2 echo Unsupported option: "$1"
       usage ;;
  esac
done

productionConfigYaml="helmcharts/eshg-gas/values/prod1/values.prod.${productionConfig}.yaml"
if [ -n "$productionConfig" ] && [ ! -f "$productionConfigYaml" ]; then
  echo "Cannot start production similar config $productionConfig invalid"
  echo "$productionConfigYaml not found"
  exit 1
fi

if [ -n "$remoteRegistry" ]; then
  registry=$(echo "$remoteRegistry" | cut -d'/' -f1)
  repository=$(echo "$remoteRegistry" | cut -d'/' -f2-)
fi

function waitForCRD() {
  crd="$1"
  until kubectl get "customresourcedefinitions.apiextensions.k8s.io/$crd" 1>/dev/null; do
    echo "Waiting for CRD $crd"
    sleep 2;
  done
}

function setupNamespace() {
  namespace="$1"
  if ! kubectl get namespaces --no-headers | grep -w "$namespace" > /dev/null; then
    kubectl create namespace "$namespace"
    kubectl -n "$namespace" create configmap ca --from-file cacerts=./k3d/cacerts --from-file ca.crt=./k3d/certs/tls.crt

    if [ -n "$CI_REGISTRY" ]; then
      kubectl -n "$namespace" create secret docker-registry gitlab-registry-pull-secret \
        --docker-server="$CI_REGISTRY" \
        --docker-username="$CI_REGISTRY_USER" \
        --docker-password="$CI_REGISTRY_PASSWORD"
    fi
  fi
}

if ! which "k3d"; then
  echo "You need to install k3d!"
  echo "See https://k3d.io/stable/#installation"
  exit 1
fi

if [ "$tlsPort" -lt 1024 ] && [ "$(whoami)" != "root" ]; then
  if ! setcap -v "cap_net_bind_service=+ep" "$(which k3d)" 1>/dev/null; then
    echo "To make this work you need to bind to port ${tlsPort}."
    echo "So please add the capability to your k3d executable using"
    echo "sudo setcap \"cap_net_bind_service=+ep\" \"\$(which k3d)\""
    echo "or run this script as root / using sudo (not recommended and not tested!)"
    exit 1
  fi
fi

if [ "$buildApplication" = true ]; then
  cd ../backend || exit 1
  echo "Build docker images"
  ./gradlew buildDockerImage

  cd .. || exit 1
  ./gradlew buildDockerImage
  cd k8s || exit 1
fi

if [ -z "$registry" ]; then
  echo "Create registry and push images there"

  if [ "$(k3d registry list -o json | jq 'any(.name == "k3d-ga-lotse-registry")')" == "false" ]; then
    k3d registry create ga-lotse-registry --port 5050
  fi

  for image in $(docker image ls --filter=reference='ga-lotse/*' --format "{{.Repository}}"); do
    docker tag "$image" "localhost:5050/${image}"
    docker push --quiet "localhost:5050/${image}"
  done
fi

echo "Create cluster"

mkdir -p k3d/certs

if [ "$(k3d cluster list -o json | jq 'any(.name == "ga-lotse")')" == "false" ]; then
  if [ -z "$registry" ]; then
    registryOption=(--registry-use k3d-ga-lotse-registry:5050)
  else
    registryOption=()
  fi

  k3d cluster create ga-lotse \
    --agents 2 -p "8080:80@loadbalancer" \
    --port "${tlsPort}:443@loadbalancer" \
    "${registryOption[@]}" \
    --wait

  master_nodes=$(kubectl get nodes -o custom-columns=":metadata.name" -l "node-role.kubernetes.io/control-plane=true" --no-headers)
  kubectl taint node "$master_nodes" node-role.kubernetes.io/control-plane:NoSchedule

  echo "Setup cert-manager and certificates"

  helm repo add jetstack https://charts.jetstack.io
  helm repo update
  helm upgrade --install \
    cert-manager jetstack/cert-manager \
    --namespace cert-manager \
    --create-namespace \
    --set crds.enabled=true

  if [ ! -f "k3d/certs/tls.key" ] || [ ! -f "k3d/certs/tls.crt" ]; then
    rm -v "k3d/certs/tls.crt" "k3d/certs/tls.key" 2>/dev/null || true
    openssl req -new -newkey rsa:4096 -days 3650 -nodes -x509 \
      -subj "/C=DE/ST=Bonn/L=NRW/CN=LocalCA" \
      -keyout k3d/certs/tls.key -out k3d/certs/tls.crt
  fi

  imageName="${CI_DEPENDENCY_PROXY_DIRECT_GROUP_IMAGE_PREFIX:-docker.io}/$(grep eclipse ../backend/buildSrc/src/main/groovy/eshg.service.gradle | cut -d\' -f2)"
  docker run --rm --user "$(id -u):$(id -g)" -v "$(pwd)/k3d:/host" --entrypoint /bin/bash "$imageName" \
   -c "cp /opt/java/openjdk/lib/security/cacerts /host/ && keytool -importcert -alias localca -keystore /host/cacerts -storepass changeit -file /host/certs/tls.crt -noprompt"

  kubectl -n cert-manager create secret generic local-rootca --from-file tls.key=./k3d/certs/tls.key --from-file tls.crt=./k3d/certs/tls.crt

  waitForCRD clusterissuers.cert-manager.io

  kubectl apply -f - <<EOF
  apiVersion: cert-manager.io/v1
  kind: ClusterIssuer
  metadata:
    name: local-ca
  spec:
    ca:
      secretName: local-rootca
EOF

  waitForCRD certificates.cert-manager.io
  waitForCRD ingressroutetcps.traefik.io
else
  echo "Cluster 'ga-lotse' already exists"
fi

CURRENT_CONTEXT=$(kubectl config current-context)
if [[ "$CURRENT_CONTEXT" != "$LOCAL_KUBECTL_CONTEXT_NAME" ]]; then
  echo "You are on context '$CURRENT_CONTEXT'. This script should only run on cluster '$LOCAL_KUBECTL_CONTEXT_NAME'."
  echo "Aborting to prevent accidental deployment."
  exit 1
fi

echo "Install central services"

namespace="central"
setupNamespace "$namespace"

if [ -n "$registry" ]; then
  setList="image.registry=${registry},image.repository=${repository}"
else
  setList="dummy=value"
fi

helm dependency update helmcharts/eshg-ctr
helm upgrade --install \
  --values helmcharts/eshg-ctr/values/local/values.common.yaml \
  --values helmcharts/eshg-ctr/values/local/values.local.yaml \
  --namespace "$namespace" \
  --create-namespace \
  --set "${setList}" \
  --set image.tag="$versionTag" \
  eshg helmcharts/eshg-ctr

echo "Wait for all deployments to become healthy..."
kubectl -n "$namespace" wait --timeout=900s --for=condition=available --all deployments

echo "Install health department"

namespace="frankfurt"
setupNamespace "$namespace"

helm dependency update helmcharts/eshg-gas

if [ -z "$productionConfig" ]; then
  helm upgrade --install \
    --values helmcharts/eshg-gas/values/local/values.common.yaml \
    --values helmcharts/eshg-gas/values/local/values.local.yaml \
    --namespace "$namespace" \
    --create-namespace \
    --set "${setList}" \
    --set image.tag="$versionTag" \
    eshg helmcharts/eshg-gas
else
  helm upgrade --install \
    --values helmcharts/eshg-gas/values/prod1/values.common.yaml \
    --values "$productionConfigYaml" \
    --values helmcharts/eshg-gas/values/local/values.local.prod.override.yaml \
    --namespace "$namespace" \
    --create-namespace \
    --set "${setList}" \
    --set image.tag="$versionTag" \
    eshg helmcharts/eshg-gas
fi


if [ -z "$productionConfig" ]; then
  echo
  echo
  echo "You need to adjust your hosts file or use some other DNS resolver"
  echo
  for h in $(yq eval '.. | select(type == "!!str" and test("^[^\\.].+\\.local$"))' helmcharts/eshg-ctr/values/local/values.local.yaml helmcharts/eshg-gas/values/local/values.local.yaml  | sort | uniq | grep -vE '(^\-\-\-$|^centralrepository.*$)'); do
    echo "127.0.0.1       $h"
  done
  echo
  echo
  echo "Citizen portal: https://$(grep "citizenportal:" helmcharts/eshg-gas/values/local/values.local.yaml  | cut -d: -f2 | tr -d '[:blank:]')/"
  echo "Employee portal: https://$(grep "employeeportal:" helmcharts/eshg-gas/values/local/values.local.yaml  | cut -d: -f2 | tr -d '[:blank:]')/"
  echo "Login data:"
  echo "Username: dummy"
  echo "Password: $(kubectl -n "$namespace" get secrets/keycloak-test-user-secrets -oyaml | yq '.data.test-users-secret-override | @base64d')"
  echo
  echo "Keycloak admin: https://$(grep "keycloak:" helmcharts/eshg-gas/values/local/values.local.yaml | cut -d: -f2 | tr -d '[:blank:]')/"
  echo "Login data:"
  echo "Username: admin"
  echo "Password: $(kubectl -n "$namespace" get secrets/keycloak-admin -oyaml | yq '.data.password | @base64d')"
  echo
fi

echo "Wait for all deployments to become healthy..."
kubectl -n "$namespace" wait --timeout=900s --for=condition=available --all deployments

echo
echo
echo "To clean everything up run:"
echo "k3d cluster delete ga-lotse && k3d registry delete ga-lotse-registry"
echo

end=$(date +%s)
runtime=$((end - start))
echo "Total deployment time: $runtime seconds"
