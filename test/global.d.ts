declare namespace NodeJS {
  interface Global {
    testRequest: import('supertest').SuperTest<import('supertest').Test>;
  }
}

/* 
  O .d é de declaration.
  Este arquivo tem como objetivo adicionar um tipo na interface global do namespace NodeJS.
  O import do tipo do supertest deve ser feito inline dentro do declare, pois, para que o typescript trate o como tipo global.
  Se fosse utilizando o import fora do declar, o typescript trataria como um tipo local. 
  Link com informações: https://stackoverflow.com/questions/39040108/import-class-in-definition-file-d-ts/51114250#51114250
*/
