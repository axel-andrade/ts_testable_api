import { SoccerGames } from '@src/clients/soccerGames';
import soccerGamesNormalizedResponse from '@test/fixtures/soccer_games_normalized_response.json';
import { ResultGameService, Hunche } from '../resultGame';

jest.mock('@src/clients/soccerGames');

describe('Result Games Service', () => {
    it('deve retornar a lista de jogos com os palpites, caso existirem', async () => {
        SoccerGames.prototype.getGames = jest
        .fn()
        .mockResolvedValue(soccerGamesNormalizedResponse);
        
        const hunches: Hunche[] = [
            {
                gameId: '1',
                homeScore: 0,
                visitorScore: 1,
                userId: 'user-id'
            }
        ];

        const expectedResponse = [
            {
              "gameId": "1",  
              "division": "A",
              "homeTeam": {
                "name": "Atlético Mineiro",
                "score": 0
              },
              "visitorTeam": {
                "name": "Cruzeiro",
                "score": 0
              },
              "isFinished": false,
              "date": "2020-08-22T16:00:00.605Z",
              "city": "Belo Horizonte",
              "state": "MG",
              "hunches": hunches
            },
            {
              "gameId": "2",
              "division": "A",
              "homeTeam": {
                "name": "Internacional",
                "score": 0
              },
              "visitorTeam": {
                "name": "Grêmio",
                "score": 0
              },
              "isFinished": false,
              "date": "2020-08-22T16:00:00.605Z",
              "city": "Porto Alegre",
              "state": "RS",
              "hunches": []
            },
            {
              "gameId": "3",
              "division": "A",
              "homeTeam": {
                "name": "Fluminense",
                "score": 0
              },
              "visitorTeam": {
                "name": "Botafogo",
                "score": 0
              },
              "isFinished": false,
              "date": "2020-08-22T16:00:00.605Z",
              "city": "Rio de Janeiro",
              "state": "RJ",
              "hunches": []
            }
      ];
    
      const resultGameService = new ResultGameService(new SoccerGames());
      const gamesWithHunches = await resultGameService.addHunchesInGames(hunches);
      expect(gamesWithHunches).toEqual(expectedResponse);
    });
});