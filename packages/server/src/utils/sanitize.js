const omitKeys = ["password_hash"];

export function sanitize(input) {
  return deepRemoveKeys(input);
}

function deepRemoveKeys(obj) {
  if (typeof obj !== "object" || obj === null || obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepRemoveKeys(item));
  }

  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (!omitKeys.includes(key)) {
      newObj[key] = deepRemoveKeys(obj[key]);
    }
  });
  return newObj;
}
