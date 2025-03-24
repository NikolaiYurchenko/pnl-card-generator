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

export const getNameFontSize = (name: string) => {
  const config = {
    maxSize: 120,
    minSize: 10,
    letterSpacing: .5,
  };

  const containerWidth = 567;
  const nameLength = name.length;

  if (nameLength < 5) {
    return `${config.maxSize}px`;
  }

  const spacingInPixels = config.letterSpacing * 16 * (nameLength - 2);

  const fontSize = Math.max(
      config.minSize,
      Math.min(config.maxSize, (containerWidth - spacingInPixels) / (nameLength * 1.2))
  );

  return `${fontSize}px`;
}
