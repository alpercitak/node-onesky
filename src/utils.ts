function isFile(payload: request_payload): payload is request_payload_files_upload {
  return (<request_payload_files_upload>payload).file !== undefined;
}
