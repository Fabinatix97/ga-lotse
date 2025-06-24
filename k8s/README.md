# eshg-k8s

## Local Helm Installation

For locally installing helm please refer to [the official docs](https://helm.sh/docs/intro/install/) since
there are many different possibilities depending on your operating system.

## Handling of different target clusters

Each helm chart has a `values` subdirectory to separate the configuration by target kubernetes cluster and responsibility.
Additionally, each subdirectory contains a `values.common.yaml` file which will be supplied to helm before the "target" values file.

Current target clusters:

* `cronn-dev`: cronn managed test instances
* `cronn-test1`: cronn test environments on VSHN `c-frankfurt-ga-test1` test cluster
* `vshn-test1`: VSHN test / "non-production" environments on VSHN `c-frankfurt-ga-test1` test cluster
* `prod1`: production instances on `c-frankfurt-ga-prod1` cluster

## Chart Snapshots with chartsnap

All chart and values combinations are checked by [helm chartsnap](https://github.com/jlandowner/helm-chartsnap).
The snapshots are saved for each chart individually in the `__snapshots__` directory beneath each helm chart and
are verified as part of the (merge) pipelines.

### Verify and update snapshots

* as gradle tasks:
```shell
# check
./gradlew k8s:verifySnapshots
```
```shell
# upgrade
./gradlew k8s:updateSnapshots
```

* locally
```shell
# install plugin
helm plugin install --version 0.4.2 https://github.com/jlandowner/helm-chartsnap
# check
./helm-chartsnap.sh
# update
./helm-chartsnap.sh --update-snapshot
```

### Gitlab CI stage image

The image used during gitlab pipeline execution is the one built (locally) by the
gradle task `:k8s:buildDockerImage` and pushed to the gitlab container registry:

```shell
docker login -u <TOKEN_USERNAME> -p <TOKEN> registry.gitlab.com
./gradlew :k8s:buildDockerImage
docker tag helm-chartsnap:<VERSION> registry.gitlab.com/ga-ffm/ga-lotse/ga-lotse-code/helm-chartsnap:<VERSION>
docker push registry.gitlab.com/ga-ffm/ga-lotse/ga-lotse-code/helm-chartsnap:<VERSION>
```

The helm version is based on the version currently used by the `$OC_IMAGE` during deployments.

### Remarks

Chartsnap supports masking variable content (for example the generated secrets) by specify the values via JSON path.
That would work in our use case except for the local service directory JSON import, as secrets are part of the JSON file.
Instead, these values are forced to a fixed value by setting the value `isSnapshot=true`.

## Local deployment

For testing / development purposes the application can be deployed to a local kubernetes setup. The values files in `values/local/values.local.yaml` in the respective helmcharts are used for this.

### Prerequisites

* helm
* k3d (dockerized k3s)
* Linux with root access

### Installation

The script [local-k3d-deployment.sh](local-k3d-deployment.sh) contains an almost fully automated installation. It basically does the following steps:

1. Build docker images
2. Create local OCI registry listening at port 5050
3. Push images to registry
4. Create kubernetes cluster with 2 agents (load balancer listens at 8080 for HTTP and 443 for TLS traffic)
5. Install cert-manager and create certificate for a "self-signed CA"
6. Install central services into namespace "central"
7. Install "Frankfurt like" health department instance into namespace "frankfurt"

The script will output a list of the "public" host names of the application before it finishes. These need to be resolvable by the web browser for a keycloak authentification among other things to work. The easiest way to achieve this, is to append the entries to the local `hosts` file (`/etc/hosts`) - other methods to resolve DNS names locally should work too. Please note that in the helm chart configuration the hostnames are identical to the cluster local service URLs to make DNS resolution inside the cluster work for these "public" domains as well.

For a better experience the browser can be configured to trust the self-signed CA. For this, the [public certificate](k3d/certs/tls.crt) must be imported into the browser as certificate authority which is trusted for websites. The script will not generate a new certificate as long as both the public certificate and the private key (tls.crt and tls.key) exist.

### Removal

The whole cluster and registry can be removed with:

```shell
k3d cluster delete ga-lotse
k3d registry delete ga-lotse-registry
```

### Notes

* The installation script checks whether the registry / cluster / namespaces already exist and it _should_ only update the images and helm releases on consecutive runs.
* The databases are deployed as `Statefulset`s with PVCs for data storage. This is not a production-safe configuration and should only be used for testing / development.
* The configuration currently only enables the school-entry and inspection module as to not overwhelm the local machine. Enabling more business modules is straightforward by enabling the respective toggle in the [values.local.yaml](helmcharts/eshg-gas/values/local/values.local.yaml) file and (re-)running the installation script. (For chat to work, you need to enable the chatmanagement and synapse toggle.)

