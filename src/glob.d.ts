import { Address, ClusterSettings } from "cluster";
import EventEmitter from "events";
import * as net from "net";
type NetConnectOpts = any;

declare module cluster {
  export const isPrimary: boolean;
}
