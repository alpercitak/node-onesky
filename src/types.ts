interface onesky_params {
  PUBLIC_KEY: string;
  SECRET_KEY: string;
}

interface request_payload {}

interface request_payload_files_list extends request_payload {
  page?: number;
  per_page?: number;
}

interface request_payload_files_upload extends request_payload {
  file: {
    value: object;
    options: object;
  };
  file_format: string;
  locale?: string;
  is_keeping_all_strings?: boolean;
  is_allow_translation_same_as_original?: boolean;
}

interface request_payload_files_delete extends request_payload {
  file_name: string;
}

interface request_payload_project_groups_list extends request_payload {
  page?: number;
  per_page?: number;
}

interface request_payload_project_groups_create extends request_payload {
  name: string;
  locale?: string;
}
