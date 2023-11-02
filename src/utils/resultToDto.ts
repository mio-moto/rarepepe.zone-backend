import { PepeApiResult } from "#contracts/api-results";
import { PepeResult } from "#contracts/generators";


export const resultToDto = (pepe: PepeResult): PepeApiResult => ({ type: pepe.type, url: pepe.url });
export const resultsToDto = (pepes: PepeResult[]): PepeApiResult[] => pepes.map(resultToDto);