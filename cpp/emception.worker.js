import * as Comlink from "comlink";
import Emception from "../cpp/emception.js";

const emception = new Emception();
globalThis.emception = emception;
Comlink.expose(emception);
