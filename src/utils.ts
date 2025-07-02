import type { RequestPayload, RequestPayloadFilesUpload } from './types';

export function isFile(payload: RequestPayload): payload is RequestPayloadFilesUpload {
  return (<RequestPayloadFilesUpload>payload).file !== undefined;
}
