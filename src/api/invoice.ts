import createRequest from '@/utils/api.utils';;
import value from './value.json'
import { InvoiceSettingDto } from '@/utils/interface.utils';

function fetchInvoiceTemplates() {
  return [value.GetResponse, null]
  // return createRequest("/api/v1/invoice/templates", "get");
}

function saveInvoiceSettings(payload: InvoiceSettingDto) {
  return [value.PostResponse, null]
  // return createRequest("/api/v1/invoice/settings", "post", payload);
}

export { fetchInvoiceTemplates, saveInvoiceSettings };

