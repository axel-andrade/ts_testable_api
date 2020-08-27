import { SoccerGames, SoccerGamesResponse } from '@src/clients/soccerGames';
import soccerGamesNormalizedResponse from '@test/fixtures/soccer_games_normalized_response.json';
import * as soccerGamesResponse from '@test/fixtures/soccer_games_response.json';
import * as HTTPAdapter from '@src/adapters/request';

jest.mock('@src/adapters/request');

describe('Cliente SoccerGames', () => {

  // Criando mock da class de request
  const MockedRequestClass = HTTPAdapter.Request as jest.Mocked<typeof HTTPAdapter.Request>
  // Criando mock para instancia da class de request
  const mockedRequestInstance = new HTTPAdapter.Request() as jest.Mocked<HTTPAdapter.Request>;
  
  it('deve retornar a lista de jogos normalizada do serviço SoccerGames', async () => {
    const date = new Date();
    mockedRequestInstance.get.mockResolvedValue({ data: soccerGamesResponse } as HTTPAdapter.Response);
    const soccerGameService = new SoccerGames(mockedRequestInstance);
    const response = await soccerGameService.getGames(date);
    expect(response).toEqual(soccerGamesNormalizedResponse);
  });

  it('deve excluir jogos com dados incompletos', async () => {
    const date = new Date();
    const incompleteResponse = {
      games: [
        {
          isFinished: false,
          city: "Belo Horizonte",
          state: "MG"
        },
      ],
    } as SoccerGamesResponse;
    mockedRequestInstance.get.mockResolvedValue({ data: incompleteResponse } as HTTPAdapter.Response);
    const soccerGamesService = new SoccerGames(mockedRequestInstance);
    const response = await soccerGamesService.getGames(date);
    expect(response).toEqual([]);
  });

  it('deve obter um erro genérico do serviço SoccerGames quando a solicitação falha antes de chegar ao serviço', async () => {
    const date = new Date();
    mockedRequestInstance.get.mockRejectedValue({ message: 'Network Error' });
    const soccerGamesService = new SoccerGames(mockedRequestInstance);
    await expect(soccerGamesService.getGames(date)).rejects.toThrow(
      'Erro inesperado ao tentar se comunicar com o serviço SoccerGames: Network Error'
    );
  });

  it('deve obter um SoccerGamesResponseError quando o serviço SoccerGames responder com erro', async () => {
    const date = new Date();
    // mocando o error de request como true
    MockedRequestClass.isRequestError.mockReturnValue(true);
    mockedRequestInstance.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });
    const soccerGameService = new SoccerGames(mockedRequestInstance);
    await expect(soccerGameService.getGames(date)).rejects.toThrow(
      'Erro inesperado retornado pelo serviço SoccerGames: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
