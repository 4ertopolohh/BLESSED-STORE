function estimateMeasurements(product, category) {
  const size = product.size.trim();
  const normalize = value => Number(value.replace(',', '.'));
  const metric = (label, value) => ({ label, value: Math.round(value * 10) / 10 });

  if (category === 'Джинсы' || /^W\d+/i.test(size)) {
    const denim = /^W(\d+)(?:\s*L(\d+))?$/i.exec(size);
    if (!denim) return [];
    const values = [metric('Половина пояса', Number(denim[1]) * 2.54 / 2)];
    if (denim[2]) values.push(metric('Длина по внутреннему шву', Number(denim[2]) * 2.54));
    return values;
  }

  const topSizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const topIndex = topSizes.indexOf(size.toUpperCase());
  const topKinds = {
    'Футболки': { width: 50, length: 69 },
    'Толстовки': { width: 56, length: 68 },
    'Куртки': { width: 55, length: 65 },
  };
  const top = Object.hasOwn(topKinds, category) ? topKinds[category] : null;
  if (top && topIndex >= 0) {
    const stepsFromMedium = topIndex - topSizes.indexOf('M');
    return [
      metric('Ширина под проймами', top.width + stepsFromMedium * 3),
      metric('Длина по спинке', top.length + stepsFromMedium * 2),
    ];
  }

  const shoe = /^(?:EU\s*)?(\d{2}(?:[.,]\d+)?)$/i.exec(size);
  if (category === 'Обувь' && shoe) {
    return [metric('Ориентир по длине стопы', normalize(shoe[1]) * 2 / 3 - 1.5)];
  }

  const centimeters = /^(\d+(?:[.,]\d+)?)\s*см$/i.exec(size);
  if (category === 'Аксессуары' && centimeters) {
    return [metric('Длина по маркировке', normalize(centimeters[1]))];
  }

  return [];
}
