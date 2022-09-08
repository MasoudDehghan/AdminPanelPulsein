// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  version : "1.7.5 Development",
  apiUrl: "http://185.50.37.108:8080/taftan/rest",
  fileServerUrl: "http://185.50.37.108:8080/blueberry",
  webSocketAddress : "ws://185.50.37.108:8080/taftan/portal"
  // apiUrl: "https://pulsein.pro/taftan/rest",
  // fileServerUrl: "https://pulsein.pro/blueberry",
  // webSocketAddress : "wss://pulsein.pro/taftan/portal"
};

