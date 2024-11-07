import { Injectable } from '@nestjs/common';
import { ChildProcess, fork } from 'child_process';
import { resolve } from 'node:path';
import { setTimeout } from 'timers/promises';

const taskFile = resolve(__dirname, './task');

type CreateCluster = {
  limitProcess: number;
  onMessage: (message: any) => Promise<void>;
};

type DataMessage = {
  message: 'done' | 'close';
  length: number;
};

type WorkerServiceInput = {
  limitProcess: number;
  onMessage: (message: any) => Promise<void>;
};

function processesLifecycle(processes: ChildProcess[], index = 0) {
  return () => {
    if (index >= processes.length) index = 0;
    console.log(`Process ${index} selected`);
    return { idx: index, process: processes[index++] };
  };
}

@Injectable()
export class WorkService {
  constructor() {}

  private async createCluster({ limitProcess, onMessage }: CreateCluster) {
    const processes = new Map<number, ChildProcess>();

    for (let i = 1; i <= limitProcess; i++) {
      const child = fork(taskFile);

      child.on('exit', () => {
        console.log(`Child process ${child.pid} exited`);
        processes.delete(child.pid);
      });

      //   child.on('close', () => {
      //     console.log(`Child process ${child.pid} closed`);
      //     process.exit(1);
      //   });

      child.on('message', (data: DataMessage) => {
        if (data.message !== 'done') return;
        onMessage(data.length);
      });

      processes.set(child.pid, child);
    }

    await setTimeout(1000);

    return {
      getProcess: processesLifecycle([...processes.values()]),
      killAll: () => {
        processes.forEach((child) => child.kill());
      },
    };
  }

  async handler({ limitProcess, onMessage }: WorkerServiceInput) {
    const { getProcess, killAll } = await this.createCluster({
      limitProcess,
      onMessage,
    });

    const send = (data: any) => {
      const { idx, process } = getProcess();
      console.log(`Sending message to process ${idx}`);
      process.send({ idx, data });
    };

    return {
      send: send.bind(this),
      killAll: killAll.bind(this),
    };
  }
}
