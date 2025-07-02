export interface OneskyParams {
  PUBLIC_KEY: string;
  SECRET_KEY: string;
}

export interface RequestPayload {}

export interface RequestPayloadFilesList extends RequestPayload {
  page?: number;
  per_page?: number;
}

export interface RequestPayloadFilesUpload extends RequestPayload {
  file: {
    value: object;
    options: object;
  };
  file_format: string;
  locale?: string;
  is_keeping_all_strings?: boolean;
  is_allow_translation_same_as_original?: boolean;
}

export interface RequestPayloadFilesDelete extends RequestPayload {
  file_name: string;
}

export interface RequestPayloadProjectGroupsList extends RequestPayload {
  page?: number;
  per_page?: number;
}

export interface RequestPayloadProjectGroupsCreate extends RequestPayload {
  name: string;
  locale?: string;
}
