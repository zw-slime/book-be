import * as fs from 'fs';
import * as path from 'path';

export interface Result<T> {
  result: T;
  err: Error;
}

export function readJson(filePath: string): Result<{ data: any }> {
  let jsonData;
  try {
    const data = fs.readFileSync(path.join('src', filePath));
    try {
      jsonData = JSON.parse(data.toString());
    } catch (e) {
      return { result: { data: [] }, err: e };
    }
  } catch (error) {
    console.log(error);
    return { result: { data: [] }, err: error };
  }
  return { result: jsonData, err: null };
}

export function writeJson(filePath, data): Result<{ data: string }> {
  let result;
  try {
    fs.writeFileSync(path.join('src', filePath), JSON.stringify(data));
    result = { data: 'success' };
  } catch (error) {
    console.log(error);
    return { result: { data: 'error' }, err: error };
  }
  return { result, err: null };
}

export function appendJson(
  filePath,
  jsonData,
): Result<{ data: number | null }> {
  let data;
  let result;
  data = readJson(filePath);

  if (data.err) {
    return data;
  }

  data.result.data.push({
    ...jsonData,
    id: data.result.data[data.result.data.length - 1].id + 1,
  });

  try {
    fs.writeFileSync(path.join('src', filePath), JSON.stringify(data.result));
    result = { data: data.result.data[data.result.data.length - 1].id };
  } catch (error) {
    console.log(error);
    return { result: { data: null }, err: error };
  }
  return { result, err: null };
}

export function deleteJson(filePath, id): Result<{ data: string }> {
  let data;
  data = readJson(filePath);

  if (data.err) {
    return data;
  }

  console.warn(data.result.data);

  const index = data.result.data.map(v => v.id).indexOf(id);
  if (index >= 0) {
    data.result.data.splice(index, 1);
    try {
      fs.writeFileSync(path.join('src', filePath), JSON.stringify(data.result));
      return {
        result: { data: 'success' },
        err: null,
      };
    } catch (error) {
      console.log(error);
      return { result: { data: 'error' }, err: error };
    }
  } else {
    return {
      result: { data: 'error' },
      err: { message: `id为${id}的cat不存在`, name: '' },
    };
  }
}
