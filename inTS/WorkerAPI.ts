interface ResponseCallback {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

interface MessageData {
  id: string;
  data?: any;
  responseId?: number;
}

class WorkerAPI {
  private nextResponseId: number = 0;
  private responseCBs: Map<number, ResponseCallback> = new Map();
  private worker: Worker;
  private port: MessagePort;
  public onWrite: ((text: string) => void) | null = null;

  constructor() {
    this.nextResponseId = 0;
    this.responseCBs = new Map();
    this.worker = new Worker('worker.js');
    const channel = new MessageChannel();
    this.port = channel.port1;
    this.port.onmessage = this.onmessage.bind(this);

    const remotePort = channel.port2;
    this.worker.postMessage({ id: 'constructor', data: remotePort }, [remotePort]);
  }

  setShowTiming(value: boolean): void {
    this.port.postMessage({ id: 'setShowTiming', data: value });
  }

  terminate(): void {
    this.worker.terminate();
  }

  private async runAsync(id: string, options: any): Promise<any> {
    const responseId = this.nextResponseId++;
    const responsePromise = new Promise((resolve, reject) => {
      this.responseCBs.set(responseId, { resolve, reject });
    });
    this.port.postMessage({ id, responseId, data: options });
    return await responsePromise;
  }

  async compileToAssembly(options: any): Promise<any> {
    return this.runAsync('compileToAssembly', options);
  }

  async compileTo6502(options: any): Promise<any> {
    return this.runAsync('compileTo6502', options);
  }

  compileLinkRun(contents: string): void {
    this.port.postMessage({ id: 'compileLinkRun', data: contents });
  }

  postCanvas(offscreenCanvas: OffscreenCanvas): void {
    this.port.postMessage({ id: 'postCanvas', data: offscreenCanvas }, [offscreenCanvas]);
  }

  private onmessage(event: MessageEvent<MessageData>): void {
    switch (event.data.id) {
      case 'write':
        if (this.onWrite) {
          this.onWrite(event.data.data);
        }
        break;

      case 'runAsync': {
        const responseId = event.data.responseId;
        if (responseId !== undefined) {
          const promise = this.responseCBs.get(responseId);
          if (promise) {
            this.responseCBs.delete(responseId);
            promise.resolve(event.data.data);
          }
        }
        break;
      }
    }
  }
}

export default WorkerAPI;