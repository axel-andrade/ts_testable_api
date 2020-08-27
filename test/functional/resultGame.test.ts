describe('Testes funcionais da controller de resultados de jogos', () => {
  it('deve retornar a lista de jogos com resultados', async () => {
    const { body, status } = await global.testRequest.get('/v1/result-games');
    expect(200).toBe(status);
    expect(body).toEqual({});
  });
});
