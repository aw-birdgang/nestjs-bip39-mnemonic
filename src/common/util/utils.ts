import {
  parseUnits,
  formatEther,
  formatUnits,
  parseEther,
} from 'nestjs-ethers';
import { BigNumber } from '@ethersproject/bignumber';

export function getVariableName<TResult>(getVar: () => TResult): string {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''),
  );
  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }
  const fullMemberName = m[1];
  const memberParts = fullMemberName.split('.');
  return memberParts[memberParts.length - 1];
}

export function strEqual(a: string, b: string) {
  if (!a.match(b) === null) {
    return true;
  }
  return false;
}

export function extractToken(resource: string) {
  if (resource && resource.split(' ')[0] === 'Bearer') {
    return resource.split(' ')[1];
  }
  return null;
}

export function mergeStringToArray(resource1: string, resource2: string) {
  return '["' + resource1 + '","' + resource2 + '"]';
}

export function convertToNumber(value: string): number {
  return parseInt(value, 10);
}

export function convertParseEther(amount: string): BigNumber {
  return parseEther(amount);
}

export function convertFormatEther(amount: BigNumber): string {
  return formatEther(amount);
}

export function convertParseUnits(amount: string): BigNumber {
  return parseUnits(amount, 6);
}

export function convertParseUnitsGPEX(amount: string): BigNumber {
  return parseUnits(amount, 8);
}

export function convertFormatUnits(amount: BigNumber): string {
  return formatUnits(amount, 6);
}

export function multiplyBigNumber(
  value1: BigNumber,
  value2: number,
): BigNumber {
  if (value1.isZero()) {
    return BigNumber.from(0);
  }
  console.log('multiplyBigNumber');
  const result = value1.mul(value2);
  return result;
}
