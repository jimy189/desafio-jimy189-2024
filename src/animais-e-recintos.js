export const recintos = [
    { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
    { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
    { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
    { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
    { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
];

export const animaisPermitidos = {
    LEAO: { tamanho: 3, bioma: ['savana'], carnivoro: true },
    LEOPARDO: { tamanho: 2, bioma: ['savana'], carnivoro: true },
    CROCODILO: { tamanho: 3, bioma: ['rio'], carnivoro: true },
    MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
    GAZELA: { tamanho: 2, bioma: ['savana'], carnivoro: false },
    HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
};

export function validaEntrada(animal, quantidade) {
    if (!animaisPermitidos[animal.toUpperCase()]) {
        return { erro: "Animal inválido" };
    }
    if (quantidade <= 0 || !Number.isInteger(quantidade)) {
        return { erro: "Quantidade inválida" };
    }
    return null;
}

export function analise(animal, quantidade) {
    const erro = validaEntrada(animal, quantidade);
    if (erro) return erro;

    const { tamanho, bioma, carnivoro } = animaisPermitidos[animal.toUpperCase()];
    let recintosViaveis = [];

    recintos.forEach((recinto) => {
        const espacoOcupado = recinto.animais.reduce(
            (acc, animalExistente) => acc + animalExistente.quantidade * animaisPermitidos[animalExistente.especie.toUpperCase()].tamanho,
            0
        );
        let espacoLivre = recinto.tamanhoTotal - espacoOcupado;

         // Verificação de bioma compatível
         const biomaCompativel = animal.toUpperCase() === 'CROCODILO'
         ? recinto.bioma === 'rio'
         : bioma.some((b) => recinto.bioma.includes(b));

        // Carnívoros não podem misturar com outras espécies
        const carnivorosCompativeis = recinto.animais.every(
            (a) => a.especie === animal || !animaisPermitidos[a.especie.toUpperCase()].carnivoro
        );

        // Verificar a regra de hipopótamo (só permite múltiplas espécies em savana e rio)
        const hipopotamoRegra = animal.toUpperCase() === 'HIPOPOTAMO' && recinto.bioma.includes('savana e rio');

        // Macacos não gostam de ficar sozinhos
        const macacoRegra = animal.toUpperCase() === 'MACACO' && (recinto.animais.length > 0 || quantidade > 1);

       // Verificar se o recinto contém espécies diferentes
       const contemEspeciesDiferentes = recinto.animais.some(a => a.especie !== animal);

       // Se o recinto já contém espécies diferentes, ocupar 1 espaço extra
       if (contemEspeciesDiferentes) espacoLivre -= 1;

        // Verificação final de espaço livre, bioma e regras específicas
        if (
            biomaCompativel &&
            espacoLivre >= tamanho * quantidade &&
            (recinto.animais.length === 0 || carnivorosCompativeis) &&
            (animal.toUpperCase() !== 'HIPOPOTAMO' || hipopotamoRegra) &&
            (animal.toUpperCase() !== 'MACACO' || macacoRegra)
        ) {
            const espacoLivreAposAlocacao = espacoLivre - tamanho * quantidade;
            recintosViaveis.push(
                `Recinto ${recinto.numero} (espaço livre: ${espacoLivreAposAlocacao} total: ${recinto.tamanhoTotal})`
            );
        }
    });

    return recintosViaveis.length > 0 ? { recintosViaveis } : { erro: "Não há recinto viável" };
}
