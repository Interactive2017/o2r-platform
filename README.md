# The o2r-platform

_Leveraging reproducible research_

## Libraries

- AngularJS
- Bootstrap

## Dependencies

- [bower](https://bower.io/)

## Install

```bash
bower install
```

## Run only platform project in a container

```bash
docker build --tag platform .

docker run -d -p 80:80 platform
```

## Configure

Create a copy of the file `client/app/config/configSample.js` and name it `client/app/config/config.js`. You must configure the required application settings in this file, which is not part of the version control:

```JavaScript
window.__env.server = /*String containing server address*/;
window.__env.api = /*String containing base api*/;
window.__env.sizeRestriction = /*integer*/;
window.__env.disableTracking = /*true/false, default is true*/;
window.__env.enableDebug = /*true/false, default is false*/;
window.__env.piwik = /*String containing piwik server adress*/;
window.__env.userLevels = {};
window.__env.userLevels.admin = /*Integer containing the required user level for admin status*/;
window.__env.userLevels.regular = /*Integer containing the required user level for regular status*/;
window.__env.userLevels.restricted = /*Integer containing the required user level for restricted status*/;
```

## Development environment with Docker Compose

You can start all required o2r microservices (using latest images from [Docker Hub](https://hub.docker.com/r/o2rproject)) with just two commands using `docker-compose` (version `1.9.0+`) and Docker (version `1.13.0+`).

First, **read the instructions on "Basics" and "Prerequisites" to prepare your host machine in the [`reference-implementation`](https://github.com/o2r-project/reference-implementation) project**.

This project contains one `docker-compose` configuration (file `docker-compose.yml`) to run all microservices & databases, and mount the client application directly from the source directory `client`.
If you see an error related to the MongoDB in the first "up", abort and restart.

_The client must be build on the host!_

**Required settings**

Some of the settings to run the platform cannot be published for security reasons.
Therefor these must be provided at runtime using _environment variables_ as is described in the OS-specific instructions below.

The environment parameters are as follows:

- `OAUTH_CLIENT_ID` identifier for the platform with auth provider
- `OAUTH_CLIENT_SECRET` password for identification with the auth provider
- `OAUTH_URL_CALLBACK` the URL that the authentication service redirects the user to, important to complete the authentication, probably `http://localhost/api/v1/auth/login` (includes with machine IP when using Docker Toolbox)
- `ZENODO_TOKEN` authentication token for [Zenodo](https://zenodo.org/), required for shipping to Zenodo (optional)
- `SLACK_BOT_TOKEN` and `SLACK_VERIFICATION_TOKEN`, required for monitoring with Slack (optional)

### Linux

```bash
OAUTH_CLIENT_ID=<...> OAUTH_CLIENT_SECRET=<...> OAUTH_URL_CALLBACK=<...> ZENODO_TOKEN=<...> docker-compose up
```

### Windows with Docker for Windows

The environmental variables must be passed separately on Windows, followed by the docker-compose commands:

```powershell
$env:OAUTH_CLIENT_ID = <...>
$env:OAUTH_CLIENT_SECRET = <...>
$env:OAUTH_URL_CALLBACK = <...>
$env:ZENODO_TOKEN = <...>
docker-compose up
```

The services are available at `http://localhost`.

### Windows with Docker Toolbox

When using docker-compose with Docker Toolbox/Machine on Windows, [volume paths are no longer converted from by default](https://github.com/docker/compose/releases/tag/1.9.0), but we need this conversion to be able to mount the docker volume to the o2r microservices.
To re-enable this conversion for `docker-compose >= 1.9.0` set the environment variable `COMPOSE_CONVERT_WINDOWS_PATHS=1`.

Also, the client's defaults (i.e. using `localhost`) does not work.
We must mount a config file to point the API to the correct location, see `test/config-toolbox.js`.
You must mount this config file to the webserver (container `nginx`) by uncommenting the line in `docker-compose.yml`.

```
OAUTH_CLIENT_ID=<...> OAUTH_CLIENT_SECRET=<...> OAUTH_URL_CALLBACK=<...> ZENODO_TOKEN=<...> docker-compose up
```

The services are available at `http://<machine-ip>`.

### Restart from scratch

You can remove all containers and images by o2r with the following two commands on Linux:

```bash
docker ps -a | grep o2r | awk '{print $1}' | xargs docker rm -f
docker images | grep o2r | awk '{print $3}' | xargs docker rmi --force
```

## User levels

The o2r microservices require users to have specific [user level](http://o2r.info/o2r-web-api/user/#user-levels) to be allowed certain tasks.
By default, users may create compendia, but if you want to develop features for editors or admins, you can adjust a user's level in the admin view (.

## Proxy for o2r microservices

If you run the o2r microservices locally as a developer, it is useful to run a local nginx to make all API endpoints available under one port (`80`), and use the same nginx to serve the application in this repo.
A nginx configuration file to achieve this is `dev/nginx-microservices.conf`.

```bash
#sed -i -e 's|http://o2r.uni-muenster.de/api/v1|http://localhost/api/v1|g' js/app.js
docker run --rm --name o2r-platform -p 80:80 -v $(pwd)/test/nginx.conf:/etc/nginx/nginx.conf -v $(pwd)/client:/etc/nginx/html $(pwd)/test:/etc/nginx/html/test nginx
```

Note: If you want to run this in a Makefile, `$(CURDIR)` will come in handy to create the mount paths instead of using `$(pwd)`.

## WebSocket testing

The compose configuration also makes a simple test page for WebSockets available at http://localhost/dev/socket.html (file (`dev/socket.html`)).

## Platform Version

0.9.3

## License

o2r-platform is licensed under Apache License, Version 2.0, see file LICENSE.
Copyright &copy; 2017 - o2r project.
