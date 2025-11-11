export const getObjectDiff = (oldObj, newObj) => {
  const diff = {};
  const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);
  
  for (const key of allKeys) {
    if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
      diff[key] = {
        old: oldObj[key],
        new: newObj[key]
      };
    }
  }
  
  return diff;
};

export const hasChanges = (oldObj, newObj) => {
  return Object.keys(getObjectDiff(oldObj, newObj)).length > 0;
};

export const formatDiff = (diff) => {
  return Object.entries(diff).map(([key, { old, new: newVal }]) => {
    return `${key}: ${JSON.stringify(old)} → ${JSON.stringify(newVal)}`;
  }).join('\n');
};

