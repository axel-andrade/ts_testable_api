import { SoccerGames, SoccerGame } from '@src/clients/soccerGames';

export interface Hunche {
    gameId: string;
    homeScore: number;
    visitorScore: number;
    userId: string;
}

export type HuncheGroup = {
    [key: string]: Omit<Hunche, 'gameId'>[];
}

export interface SoccerGameWithHunche extends SoccerGame{
    hunches: Omit<Hunche, 'userId'>[];
}

export class ResultGameService {
    constructor(protected soccerGames = new SoccerGames()){}

    private getHunchesByGroup(hunches: Hunche[]): any {
        const obj: HuncheGroup = {};
        for(const hunche of hunches){
            const gameId = hunche.gameId;
            if(obj[gameId]){
               const currHunches: Hunche[]= obj[gameId] as [];
               currHunches.push(hunche);
               obj[gameId] = currHunches;
            }
            else{
               obj[gameId] = [hunche];
            }
        }

        return obj;
    }

    public async addHunchesInGames(hunches: Hunche[]): Promise<SoccerGameWithHunche[]> {

        const gamesOfRequest: SoccerGame[] = await this.soccerGames.getGames(new Date());
        const gamesWithHunches: SoccerGameWithHunche[] = [];
        const hunchesByGroupObj = this.getHunchesByGroup(hunches);

        if(gamesOfRequest.length >= 1){
            for(const game of gamesOfRequest){
                gamesWithHunches.push({
                    ...game,
                    hunches: hunchesByGroupObj[game.gameId] || []
                })
            }
        }
        
        return gamesWithHunches;
    }
}