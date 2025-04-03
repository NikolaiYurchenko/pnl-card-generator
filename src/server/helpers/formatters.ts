const THOUSAND = 1000;

export const formatToString = (val: number) => {
  let value = val;

  if (val >= THOUSAND || val <= -THOUSAND) {
    value = Math.trunc(val);
  }

  return {
    value: `${ val < 0 ? '' : '+' }${Number(value).toLocaleString("en-US")}`,
    isNegative: val < 0,
  }
}

export const formatNumber = (val: number, isUsd?: boolean) => {
  let value = val;

  if (val >= THOUSAND || val <= -THOUSAND) {
    value = Math.trunc(val);
  }

  return `${val < 0 ? '-' : ''}${isUsd ? '$' : ''}${Number(Math.abs(value)).toLocaleString("en-US")}`
}
