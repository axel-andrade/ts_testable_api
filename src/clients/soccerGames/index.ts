import config, { IConfig } from 'config';
import { InternalError } from '@src/util/errors/internal-error';
import * as HTTPAdapter from '@src/adapters/request';

export enum DivisionType {
  A = 'A',
  B = 'B',
  C = 'C'
}
export interface SoccerTeam {
  readonly name: string;
  readonly score: number;
}

export interface SoccerGame {
  gameId: string;
  division: DivisionType;
  homeTeam: SoccerTeam;
  visitorTeam: SoccerTeam;
  isFinished: boolean;
  date: string;
  city: string;
  state: string;
}

export interface SoccerGamesResponse {
  games: SoccerGame[];
}

/**
 * This error type is used when a request reaches out to the StormGlass API but returns an error
 */
export class SoccerGamesUnexpectedResponseError extends InternalError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * This error type is used when something breaks before the request reaches out to the StormGlass API
 * eg: Network error, or request validation error
 */
export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Erro inesperado ao tentar se comunicar com o serviço SoccerGames';
    super(`${internalMessage}: ${message}`);
  }
}

export class SoccerGamesResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
     'Erro inesperado retornado pelo serviço SoccerGames';
    super(`${internalMessage}: ${message}`);
  }
}

export class SoccerGames {

  constructor(protected request = new HTTPAdapter.Request()) {}

  public async getGames(date: Date): Promise<SoccerGame[]> {
    try {
      const response = await this.request.get<SoccerGamesResponse>('https://drive.google.com/file/d/1tXu_xrwKYwOxdWAwBowJBJGttVADNao_/view');
      return this.normalizeResponse(response.data);
    } catch (err) {
      /**
       * Verificando se é um erro de request 
       */
      if (HTTPAdapter.Request.isRequestError(err)) {
        throw new SoccerGamesResponseError(
          `Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`
        );
      }
      throw new ClientRequestError(err.message);
    }
  }

  private normalizeResponse(
    response: SoccerGamesResponse
  ): SoccerGame[] {
    return response.games.filter(this.isValidGame.bind(this));
  }

  private isValidGame(game: Partial<SoccerGame>): boolean {
    return !!(
      game.homeTeam && this.isValidTeam(game.homeTeam) && 
      game.visitorTeam && this.isValidTeam(game.visitorTeam) && 
      typeof game.isFinished === 'boolean' && 
      game.date &&
      game.city &&
      game.state
    );
  }

  private isValidTeam(team: Partial<SoccerTeam>): boolean {
      return !! ( 
          team.name && 
          typeof team.score == 'number' &&
          team.score >= 0
      );
  }
}
