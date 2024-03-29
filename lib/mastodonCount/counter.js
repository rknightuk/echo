import { urlRegex } from './url_regex.js';

const urlPlaceholder = 'xxxxxxxxxxxxxxxxxxxxxxx';

export function countableText(inputText) {
  return inputText
    .replace(urlRegex, urlPlaceholder)
    .replace(/(^|[^\/\w])@(([a-z0-9_]+)@[a-z0-9\.\-]+[a-z0-9]+)/ig, '$1@$3');
};