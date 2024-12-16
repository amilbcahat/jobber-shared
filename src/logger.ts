import {
  ElasticsearchTransformer,
  ElasticsearchTransport,
  LogData,
  TransformedData,
} from 'winston-elasticsearch';
import winston, { Logger } from 'winston';
import { transform } from 'typescript';

const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
};

export const winstonLogger = (
  elasticsearchNode: string,
  name: string,
  level: string
): Logger => {
  //Console for seeing in console output
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true,
    },
    elasticsearch: {
      level,
      transformer: esTransformer,
      clientOpts: {
        node: elasticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false,
      },
    },
  };

  //Creates transport for elasticsearch
  const esTransport: ElasticsearchTransport = new ElasticsearchTransport(
    options.elasticsearch
  );

  //Creates logger
  const logger: Logger = winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new winston.transports.Console(options.console), esTransport],
  });

  return logger;
};
