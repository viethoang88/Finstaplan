export const createId = () => {
  let id = "";
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export const valueFormatter = (
  d,
  currency = "USD",
  languageFormat = "en-US"
) => {
  const val = d?.value ? d.value : d?.formattedValue ? d.formattedValue : d;

  if (val === undefined) return 0;

  return `${new Intl.NumberFormat(languageFormat, {
    style: "currency",
    currency: currency,
    // maximumSignificantDigits: 2,
  }).format(val)}`;
};
