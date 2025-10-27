// server/src/config/constants.js

export const BLOCK_TYPES = {
  HEADING: 'heading',
  PARAGRAPH: 'paragraph',
  CODE: 'code',
  LIST: 'list',
  CALLOUT: 'callout',
  IMAGE: 'image',
  VIDEO: 'video'
};

export const LIST_TYPES = {
  BULLET: 'bullet',
  NUMBERED: 'numbered',
  CHECKBOX: 'checkbox'
};

export const CALLOUT_VARIANTS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success'
};

export const CONFERENCES = [
  'React Conf',
  'React Summit',
  'React Advanced',
  'React Day',
  'React Europe',
  'React Rally'
];

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

export const JWT = {
  EXPIRATION: '7d',
  REFRESH_EXPIRATION: '30d'
};