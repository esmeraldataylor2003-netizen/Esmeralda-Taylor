import { CombinedChallengeMeta, OptionalSceneData } from '../types/game';

export const OPTIONAL_SCENES: OptionalSceneData[] = [
  {
    chapterId: 1,
    title: 'Recanto do Carvalho Antigo',
    intro:
      'Enquanto descansam junto às raízes do grande carvalho, podes observar de perto os sinais da vida no bosque sem mexer nos ninhos.',
    helperGirl: 'esmeralda',
    helperDog: 'athenas',
    spots: [
      {
        id: 'cap1-spot-1',
        icon: 'squirrel',
        label: 'Esquilo no ramo',
        category: 'animal',
        detailText:
          'Um esquilo rápido guarda bolotas lá em cima! Observamos de longe em silêncio para não o assustar.',
        dogBehavior: 'Athenas levanta as orelhas a olhar para o tronco e mantém-se quieta.',
      },
      {
        id: 'cap1-spot-2',
        icon: 'pinecone',
        label: 'Pinha aberta',
        category: 'natureza',
        detailText:
          'A pinha seca abriu as escamas ao sol para soltar as suas sementes no chão do bosque.',
        dogBehavior: 'Athenas dá uma cheiradela rápida à pinha e volta para junto da Esmeralda.',
      },
      {
        id: 'cap1-spot-3',
        icon: 'mushroom_red',
        label: 'Cogumelo vermelho',
        category: 'natureza',
        detailText:
          'Cogumelos do bosque são para admirar apenas com os olhos — nunca devemos apanhá-los nem provar!',
        dogBehavior: 'Athenas passa ao lado do cogumelo sem lhe tocar, obedecendo ao sinal da Esmeralda.',
      },
      {
        id: 'cap1-spot-4',
        icon: 'ladybug',
        label: 'Joaninha na folha',
        category: 'animal',
        detailText:
          'Uma joaninha às pintinhas descansa numa folha verde porque ajuda a proteger as plantas do bosque.',
        dogBehavior: 'Athenas pisca os olhos com curiosidade enquanto a Larissa aponta devagar.',
        hardOnly: true,
      },
    ],
    coopPrompt: 'Como podemos ajudar a manter este recanto do bosque bonito?',
    coopOptions: [
      {
        id: 'cap1-coop-a',
        label: 'Guardar o papel do nosso lanche dentro da mochila rosa',
        result:
          'Excelente! Levar o lixo de volta connosco protege os esquilos e as plantas do bosque.',
      },
      {
        id: 'cap1-coop-b',
        label: 'Caminhar sempre pelo trilho marcado para não pisar os rebentos',
        result:
          'Boa escolha! Assim as flores pequenas continuam a crescer saudáveis.',
      },
    ],
    summaryDiscovery: 'Observámos o esquilo, a pinha e os cuidados seguros do Bosque Dourado.',
  },
  {
    chapterId: 2,
    title: 'Margem Tranquila dos Juncos',
    intro:
      'Antes de seguir para o jardim, a Larissa convida-te a observar quem vive junto às águas claras do riacho.',
    helperGirl: 'larissa',
    helperDog: 'lucky',
    spots: [
      {
        id: 'cap2-spot-1',
        icon: 'frog',
        label: 'Rã na pedra húmida',
        category: 'animal',
        detailText:
          'Uma rã verde apanha sol em silêncio. As rãs gostam de água limpa e sombreada pelos juncos.',
        dogBehavior: 'Lucky mantém-se sentado na relva sem saltar para a água.',
      },
      {
        id: 'cap2-spot-2',
        icon: 'water_drop',
        label: 'Água cristalina',
        category: 'natureza',
        detailText:
          'A água corre limpinha porque ninguém atirou lixo nem ramos para o riacho.',
        dogBehavior: 'Lucky bebe um pouco de água limpa da garrafa de passeio na sua tigela dobrável.',
      },
      {
        id: 'cap2-spot-3',
        icon: 'leaf_green',
        label: 'Folha de nenúfar',
        category: 'natureza',
        detailText:
          'As folhas largas flutuam devagar e servem de sombra fresca para os peixinhos pequeninos.',
        dogBehavior: 'Lucky inclina a cabeça ao ver a folha mexer com a corrente.',
      },
      {
        id: 'cap2-spot-4',
        icon: 'duckling',
        label: 'Ninho nos juncos',
        category: 'animal',
        detailText:
          'Ali está o ninho quentinho feito de ervas secas, agora com os patinhos todos reunidos.',
        dogBehavior: 'Lucky abana a cauda baixinho e recua um passo para dar espaço aos patinhos.',
        hardOnly: true,
      },
    ],
    coopPrompt: 'Um galho pequeno caiu mesmo à frente do trilho da ponte. O que fazemos?',
    coopOptions: [
      {
        id: 'cap2-coop-a',
        label: 'Desviar o galho para a borda com cuidado',
        result:
          'Boa! Assim ninguém tropeça ao passar e o galho continua a fazer parte da natureza.',
      },
      {
        id: 'cap2-coop-b',
        label: 'Passar por cima devagar e avisar quem vem atrás',
        result:
          'Muito atencioso! Avisar os amigos evita quedas junto ao riacho.',
      },
    ],
    summaryDiscovery: 'Identificámos a rã, os nenúfares e cuidámos da passagem junto ao Riacho.',
  },
  {
    chapterId: 3,
    title: 'Canteiro dos Girassóis Altos',
    intro:
      'No cantinho mais ensolarado do jardim da vizinha, há pequenos ajudantes da natureza que fazem as flores crescer.',
    helperGirl: 'esmeralda',
    helperDog: 'athenas',
    spots: [
      {
        id: 'cap3-spot-1',
        icon: 'butterfly',
        label: 'Borboleta pousada',
        category: 'animal',
        detailText:
          'As borboletas transportam pólen de flor em flor. Nunca tocamos nas asas delas porque são muito delicadas.',
        dogBehavior: 'Athenas fica imóvel enquanto a borboleta pousa perto do girassol.',
      },
      {
        id: 'cap3-spot-2',
        icon: 'flower_sun',
        label: 'Girassol virado ao sol',
        category: 'natureza',
        detailText:
          'Os girassóis rodam devagar ao longo do dia para acompanhar a luz do sol!',
        dogBehavior: 'Athenas cheira a terra húmida à volta do caule forte.',
      },
      {
        id: 'cap3-spot-3',
        icon: 'hedgehog',
        label: 'Ouriço à sombra',
        category: 'animal',
        detailText:
          'O ouriço dorme de dia debaixo das folhas frescas e ajuda o jardim à noite comendo insetos.',
        dogBehavior: 'Athenas mantém distância respeitosa dos espinhos do ouriço.',
      },
      {
        id: 'cap3-spot-4',
        icon: 'strawberry',
        label: 'Morangueiro em flor',
        category: 'natureza',
        detailText:
          'Junto à horta crescem morangos vermelhos que amadurecem devagar com água e sol.',
        dogBehavior: 'Athenas olha para a Esmeralda à espera antes de se aproximar do canteiro.',
        hardOnly: true,
      },
    ],
    coopPrompt: 'Como podemos ajudar a vizinha a cuidar do jardim comunitário?',
    coopOptions: [
      {
        id: 'cap3-coop-a',
        label: 'Guardar o regador e as ferramentas no banco de madeira',
        result:
          'Perfeito! Ferramentas arrumadas mantêm o jardim seguro para crianças e animais.',
      },
      {
        id: 'cap3-coop-b',
        label: 'Deixar um pratinho raso com água limpa para as abelhas e passarinhos',
        result:
          'Que gesto bonito! Nos dias quentes, os bichinhos precisam de água segura.',
      },
    ],
    summaryDiscovery: 'Conhecemos a borboleta, o ouriço e cuidámos dos girassóis do Jardim.',
  },
  {
    chapterId: 4,
    title: 'Miradouro do Moinho Colorido',
    intro:
      'Do alto da colina consegue ver-se todo o percurso já feito! Descobre os detalhes lá em cima com a Larissa e o Lucky.',
    helperGirl: 'larissa',
    helperDog: 'lucky',
    spots: [
      {
        id: 'cap4-spot-1',
        icon: 'compass',
        label: 'Rosa-dos-ventos no poste',
        category: 'objeto',
        detailText:
          'A placa redonda no poste mostra Norte, Sul, Este e Oeste — combina mesmo com a bússola da Esmeralda!',
        dogBehavior: 'Lucky encosta o focinho à base de madeira do poste e abana a cauda.',
      },
      {
        id: 'cap4-spot-2',
        icon: 'flower_pink',
        label: 'Flores silvestres da colina',
        category: 'natureza',
        detailText:
          'Estas flores resistentes abanam com a brisa da colina sem partir os caules.',
        dogBehavior: 'Lucky trota em círculo na relva aberta, feliz com o vento fresco.',
      },
      {
        id: 'cap4-spot-3',
        icon: 'bell',
        label: 'Sino do vento',
        category: 'objeto',
        detailText:
          'Um pequeno sino pendurado junto ao moinho toca suave quando a brisa aumenta.',
        dogBehavior: 'Lucky inclina as orelhas atentas ao som leve do sino.',
      },
      {
        id: 'cap4-spot-4',
        icon: 'rainbow',
        label: 'Arco-íris nas gotas da brisa',
        category: 'natureza',
        detailText:
          'Quando o sol brilha através das nuvens húmidas, aparecem cores suaves no céu do vale.',
        dogBehavior: 'Lucky senta-se ao lado da Larissa a descansar depois da subida.',
        hardOnly: true,
      },
    ],
    coopPrompt: 'A mochila da Esmeralda está pesada da subida. Como se ajudam?',
    coopOptions: [
      {
        id: 'cap4-coop-a',
        label: 'A Larissa leva o caderno-mapa e a Esmeralda leva a bússola',
        result:
          'Dividir tarefas torna o passeio mais leve e divertido para as duas amigas!',
      },
      {
        id: 'cap4-coop-b',
        label: 'Fazer uma pausa de dois minutos para respirar fundo e beber água',
        result:
          'Muito bem! Descansar um pouco dá energia a todos, incluindo à Athenas e ao Lucky.',
      },
    ],
    summaryDiscovery: 'Observámos o miradouro do vento e partilhámos tarefas na Colina do Moinho.',
  },
  {
    chapterId: 5,
    title: 'Tapete de Piquenique das Lanternas',
    intro:
      'Junto à Árvore das Estrelas está preparado um tapete acolhedor de fim de tarde para celebrar com calma.',
    helperGirl: 'esmeralda',
    helperDog: 'athenas',
    spots: [
      {
        id: 'cap5-spot-1',
        icon: 'lantern',
        label: 'Lanterna de papel colorida',
        category: 'objeto',
        detailText:
          'As lanternas usam pequenas luzinhas de pilha seguras para iluminar o tapete sem calor nem perigo.',
        dogBehavior: 'Athenas observa a luz suave da lanterna sem tentar mordê-la.',
      },
      {
        id: 'cap5-spot-2',
        icon: 'apple',
        label: 'Fruta do lanche partilhado',
        category: 'objeto',
        detailText:
          'Maçãs lavadas para as meninas e biscoitos próprios para cães — cada um come o que lhe faz bem!',
        dogBehavior: 'Athenas e Lucky sentam-se quietos à espera da sua porção.',
      },
      {
        id: 'cap5-spot-3',
        icon: 'star',
        label: 'Estrela de madeira pintada',
        category: 'objeto',
        detailText:
          'Feita à mão pelas crianças do bairro para marcar o fim do trilho da natureza.',
        dogBehavior: 'Lucky dá um latido alegre baixinho e encosta a cabeça na mão da Larissa.',
      },
      {
        id: 'cap5-spot-4',
        icon: 'leaf_gold',
        label: 'Marca-páginas dourado',
        category: 'natureza',
        detailText:
          'Uma folha seca prensada que guarda a memória de todo o passeio no caderno da avó.',
        dogBehavior: 'Athenas deita-se confortavelmente sobre o canto do tapete.',
        hardOnly: true,
      },
    ],
    coopPrompt: 'Antes de regressar a casa com a família, o que fazem no tapete?',
    coopOptions: [
      {
        id: 'cap5-coop-a',
        label: 'Arrumar todas as garrafas e guardanapos na mochila',
        result:
          'Exemplo perfeito! Deixamos a Árvore das Estrelas tão limpa como a encontrámos.',
      },
      {
        id: 'cap5-coop-b',
        label: 'Escovar suavemente o pelo da Athenas e do Lucky para tirar folhinhas',
        result:
          'Que carinho! Os cães adoram cuidados gentis depois de um dia no campo.',
      },
    ],
    summaryDiscovery: 'Cuidámos do tapete de piquenique e celebrámos com segurança na Árvore das Estrelas.',
  },
];

export const COMBINED_CHALLENGES: CombinedChallengeMeta[] = [
  {
    chapterId: 1,
    title: 'Contar os Tesouros Observados',
    combinedTypes: 'Observação + Contagem',
    goal: 'Observar um grupo de objetos do bosque e contar quantos pertencem a cada tipo.',
    storyContext:
      'A Esmeralda quer confirmar se não ficou nenhuma bolota nem folha dourada perdida antes de fechar a mochila.',
    easySummary: 'Observar 6 peças e contar quantas são Folhas Douradas.',
    hardSummary: 'Observar 9 peças, identificar Bolotas e Folhas Douradas e somar os dois grupos.',
    helperDog: 'athenas',
  },
  {
    chapterId: 2,
    title: 'Trilho de Ritmo pelas Pedras',
    combinedTypes: 'Labirinto + Padrões',
    goal: 'Escolher o caminho até à margem seguindo apenas as pedras que respeitam o padrão do trilho.',
    storyContext:
      'As pedras firmes do riacho têm desenhos pintados; o Lucky aponta as pedras certas seguindo a ordem.',
    easySummary: 'Escolher as 3 pedras seguintes na ordem Sol → Folha → Sol.',
    hardSummary: 'Atravessar um mini-percurso de 4 passos seguindo sempre o ciclo Gota → Folha → Flor.',
    helperDog: 'lucky',
  },
  {
    chapterId: 3,
    title: 'Memória das Casinhas do Jardim',
    combinedTypes: 'Memória + Lógica',
    goal: 'Recordar onde estão os desenhos dos moradores e ligá-los às suas casinhas pelas pistas.',
    storyContext:
      'Para arrumar o caderno do jardim, a Larissa precisa de lembrar onde está cada cartão e confirmar onde mora.',
    easySummary: 'Abrir 2 pares simples e colocar o Coelho na casa certa com 1 pista.',
    hardSummary: 'Encontrar 3 pares escondidos e usar 2 pistas lógicas para colocar os 3 moradores nas casas.',
    helperDog: 'athenas',
  },
  {
    chapterId: 4,
    title: 'Cesto das Palavras Certas',
    combinedTypes: 'Classificação Lógica + Palavras Simples',
    goal: 'Descobrir o grupo certo de desenhos e formar a palavra que identifica esse cesto.',
    storyContext:
      'Os cestos do piquenique e do trilho precisam de uma etiqueta nova com a palavra certa.',
    easySummary: 'Encontrar o desenho diferente entre frutas e montar a palavra UVA.',
    hardSummary: 'Separar o intruso do grupo da natureza e montar a palavra ARVORE.',
    helperDog: 'lucky',
  },
  {
    chapterId: 5,
    title: 'Convite Luminoso da Equipa',
    combinedTypes: 'Contagem + Palavra + Padrão',
    goal: 'Contar as luzes do piquenique, confirmar o padrão e montar a palavra da nossa equipa.',
    storyContext:
      'Para fechar o caderno-mapa da avó, Esmeralda e Larissa preenchem a página de recordação final.',
    easySummary: 'Contar 4 estrelas e formar a palavra LUZ.',
    hardSummary: 'Contar estrelas + lanternas (8) e formar a palavra EQUIPA.',
    helperDog: 'athenas',
  },
];
