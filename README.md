# DragonCon Timer
> DragonCon LAN Gaming's timing application.

A timing application used to track user's in DragonCon's LAN Gaming area.

## Environment Variables
| Environment Variable      | Description                                                                                                                                         | Type    | Default Value |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|---------|---------------|
| PORT                      | The port the server runs on                                                                                                                         | int     | `9000`        |
| GQL_PATH                  | The path that the Apollo starts on                                                                                                                  | string  | `/gql`        |
| DB_CONNECTION_STRING      | The Mongo DB connection string for the site to use                                                                                                  | string  | N/A           |
| DB_CONNECTION_STRING_FILE | A file containing the Mongo DB connection string for the site to use. This is mainly used for passing the connection string through a docker secret | string  | N/A           |
| GENERATE_TELEMETRY        | A flag to enable or disable the generation of telemetry                                                                                             | boolean | `false`       |

## Copyright and license

Code and documentation copyright 2023 Cobbleopolis. Code released under [the MIT license](https://github.com/Cobbleopolis/DragonConTimer3/blob/master/LICENSE).