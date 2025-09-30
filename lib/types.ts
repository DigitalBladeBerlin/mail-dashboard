export type ImapAccount = {
  id: string;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  inbox: string;
  junk: string;
  trash: string;
};

export type RuleConf = {
  name: string;
  priority?: number;
  match: {
    from?: string[];
    from_domain?: string[];
    subject_regex?: string;
    body_contains?: string[];
    recipient?: string[];
    unread?: boolean;
    older_than_days?: number;
  };
  actions: (
    | { move_to_folder: string }
    | { add_label: string }
    | { star?: boolean }
  )[];
};
