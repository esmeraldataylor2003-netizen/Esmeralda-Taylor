import { ChapterData } from '../types/game';

export const COVER_ILLUSTRATION =
  '/src/assets/images/capa_aventura_bosque_1795593916866.jpg';

export const CHAPTERS: ChapterData[] = [
  {
    id: 1,
    title: 'A Bússola da Clareira Dourada',
    placeName: 'Bosque Dourado',
    objective: 'Encontrar a bússola perdida e alinhar as marcas do trilho até ao riacho.',
    illustration: '/src/assets/images/cap1_bosque_dourado_1795593918590.jpg',
    storyLead:
      'A avó da Esmeralda deu-lhes um caderno-mapa de passeios pela natureza, mas quatro páginas soltaram-se com o vento de ontem. Na clareira do grande carvalho começa a primeira pista.',
    dialogues: [
      {
        speaker: 'esmeralda',
        text: 'Olha, Larissa! O meu caderno-mapa mostra este carvalho antigo, mas a minha bússola caiu no relvado quando abri a mochila.',
        dogAction: {
          dog: 'athenas',
          action: 'Athenas cheira devagar a relva dourada e abana a cauda.',
        },
      },
      {
        speaker: 'larissa',
        text: 'Boa, Athenas! Ela já sentiu o cheiro da madeira da bússola. E o Lucky está junto à ponte a olhar para as pedras do trilho!',
        dogAction: {
          dog: 'lucky',
          action: 'Lucky trota até à ponte e encosta a pata numa pedra.',
        },
      },
    ],
    choice: {
      prompt: 'Antes de procurar as pistas na relva, o que fazemos primeiro?',
      options: [
        {
          id: 'agua_caes',
          label: 'Dar água fresca à Athenas e ao Lucky',
          reactionSpeaker: 'esmeralda',
          reactionText:
            'Boa ideia! Cães exploradores precisam sempre de água fresca na tigela antes de caminhar.',
          dogNote: 'Athenas e Lucky bebem devagar e ficam cheios de energia.',
        },
        {
          id: 'verificar_mochila',
          label: 'Arrumar o caderno-mapa na mochila rosa',
          reactionSpeaker: 'larissa',
          reactionText:
            'Assim o mapa não volta a voar com o vento! Agora temos as mãos livres para procurar.',
          dogNote: 'Athenas senta-se atenta ao lado das meninas, à espera do sinal.',
        },
      ],
    },
    discoveryText:
      'Com a bússola de volta à mochila e o caminho de folhas alinhado, encontraste a Página 1 do mapa, que aponta para o Riacho Cristalino!',
    nextChapterHook: 'Seguindo pela ponte de madeira, já se ouve a água do riacho!',
    puzzles: [
      {
        id: 'cap1-obs',
        type: 'observation',
        title: 'Objetos Perdidos na Clareira',
        goal: 'Recuperar a bússola e os objetos do trilho escondidos na relva.',
        storyConnection: 'A bússola ajuda a Esmeralda a saber em que direção fica o riacho.',
        helperCharacter: 'athenas',
        helperLabel: 'Observar a Athenas',
      },
      {
        id: 'cap1-pat',
        type: 'pattern',
        title: 'O Padrão das Pedras do Trilho',
        goal: 'Completar a sequência das marcas do caminho até à ponte.',
        storyConnection: 'As marcas certas mostram por onde o trilho segue sem pisar os canteiros.',
        helperCharacter: 'lucky',
        helperLabel: 'Ver o Lucky no trilho',
      },
    ],
    rewardMessage:
      'Brilhante! Recuperaram a bússola e descobriram a primeira página do caderno-mapa!',
    sticker: {
      id: 'sticker-folha',
      name: 'Folha Dourada',
      description: 'Encontrada na clareira do Grande Carvalho com muita atenção.',
      color: '#F59E0B',
      chapterId: 1,
    },
    mapPieceLabel: 'Página 1 · Bosque Dourado',
  },
  {
    id: 2,
    title: 'As Pedras do Riacho Cristalino',
    placeName: 'Riacho Cristalino',
    objective: 'Ajudar os patinhos a atravessar pelas pedras baixas e contá-los em segurança.',
    illustration: '/src/assets/images/cap2_riacho_cristalino_1795593920194.jpg',
    storyLead:
      'Logo depois da ponte do bosque, a bússola guiou o grupo até ao Riacho Cristalino. Quatro patinhos ficaram separados da outra margem onde está o seu ninho.',
    dialogues: [
      {
        speaker: 'larissa',
        text: 'Olhem para ali! Os patinhos querem passar para o outro lado, mas as pedras lisas formam um ziguezague sobre a água.',
        dogAction: {
          dog: 'lucky',
          action: 'Lucky sobe devagar para a primeira pedra larga e olha para trás.',
        },
      },
      {
        speaker: 'esmeralda',
        text: 'Vamos manter a calma para não os assustar. O Lucky pode mostrar-nos as pedras firmes, e depois contamos todos os animais da margem.',
        dogAction: {
          dog: 'athenas',
          action: 'Athenas senta-se quieta junto aos juncos, observando sem ladrar.',
        },
      },
    ],
    choice: {
      prompt: 'Como devemos aproximar-nos dos patinhos junto à água?',
      options: [
        {
          id: 'andar_devagar',
          label: 'Caminhar devagar e falar baixinho',
          reactionSpeaker: 'esmeralda',
          reactionText:
            'Muito bem! Os animais da natureza ficam tranquilos quando nos mexemos sem pressa.',
          dogNote: 'Athenas deita-se calma na relva para não assustar os patinhos.',
        },
        {
          id: 'testar_pedras',
          label: 'Deixar o Lucky testar primeiro as pedras secas',
          reactionSpeaker: 'larissa',
          reactionText:
            'Boa! Assim sabemos quais são as pedras firmes e que não escorregam!',
          dogNote: 'Lucky dá um passo de cada vez com as quatro patas bem firmes.',
        },
      ],
    },
    discoveryText:
      'Presa entre os juncos secos da outra margem estava a Página 2 do mapa, indicando o caminho para o Jardim das Borboletas!',
    nextChapterHook: 'Atravessado o riacho, avistam-se os girassóis do jardim comunitário.',
    puzzles: [
      {
        id: 'cap2-maze',
        type: 'maze',
        title: 'Travessia das Pedras Seguras',
        goal: 'Encontrar o caminho pelas pedras firmes até à margem do ninho.',
        storyConnection: 'O Lucky guia a equipa sem pisar nas zonas fundas nem nos troncos molhados.',
        helperCharacter: 'lucky',
        helperLabel: 'Seguir o Lucky',
      },
      {
        id: 'cap2-count',
        type: 'counting',
        title: 'Contagem na Margem do Riacho',
        goal: 'Confirmar que todos os patinhos e sapinhos estão juntos e seguros.',
        storyConnection: 'Contar com cuidado garante que ninguém ficou para trás antes de seguir viagem.',
        helperCharacter: 'athenas',
        helperLabel: 'Contar com a Athenas',
      },
    ],
    rewardMessage:
      'Fantástico! Os patinhos chegaram ao ninho e encontraram a segunda página do mapa!',
    sticker: {
      id: 'sticker-patinho',
      name: 'Patinho Feliz',
      description: 'Atravessou o riacho em segurança com passos calmos.',
      color: '#0EA5E9',
      chapterId: 2,
    },
    mapPieceLabel: 'Página 2 · Riacho Cristalino',
  },
  {
    id: 3,
    title: 'As Caixinhas do Jardim Florido',
    placeName: 'Jardim das Borboletas',
    objective: 'Organizar as caixas de sementes e identificar a casinha de cada animal do jardim.',
    illustration: '/src/assets/images/cap3_jardim_memoria_1795593920964.jpg',
    storyLead:
      'A seguir ao riacho fica o jardim cuidado pelos vizinhos. A tartaruga mansa do lago está perto das caixas de sementes da horta, cujas tampas com desenhos se misturaram.',
    dialogues: [
      {
        speaker: 'esmeralda',
        text: 'Vejam! O vento de ontem também derrubou os desenhos das caixas de sementes e trocou as placas das casinhas dos bichinhos.',
        dogAction: {
          dog: 'athenas',
          action: 'Athenas cheira uma caixa pintada e encosta o focinho suavemente.',
        },
      },
      {
        speaker: 'larissa',
        text: 'Se juntarmos os pares certos e lermos as notas do caderno do jardim, deixamos tudo arrumado antes de subir à colina!',
        dogAction: {
          dog: 'lucky',
          action: 'Lucky abana a cauda junto aos girassóis, mantendo distância do canteiro.',
        },
      },
    ],
    choice: {
      prompt: 'Como querem começar a arrumar o jardim?',
      options: [
        {
          id: 'regar_flores',
          label: 'Regar os girassóis com o regador pequeno',
          reactionSpeaker: 'larissa',
          reactionText:
            'As plantas agradecem a água fresca da manhã! E agora vamos organizar as caixas.',
          dogNote: 'Athenas observa as gotinhas de água a cair na terra sem pisar as flores.',
        },
        {
          id: 'ler_caderno',
          label: 'Ler primeiro as notas sobre os bichinhos',
          reactionSpeaker: 'esmeralda',
          reactionText:
            'Boa estratégia! Ler com calma ajuda-nos a não trocar nenhuma casinha.',
          dogNote: 'Lucky deita-se à sombra de um girassol a descansar um pouquinho.',
        },
      ],
    },
    discoveryText:
      'Debaixo da última caixa organizada estava guardada a Página 3 do mapa, com o desenho de um moinho no alto da colina!',
    nextChapterHook: 'Olhando para cima, vêem-se as pás coloridas do Moinho da Colina.',
    puzzles: [
      {
        id: 'cap3-mem',
        type: 'memory',
        title: 'Pares das Caixinhas de Sementes',
        goal: 'Encontrar os pares de desenhos iguais para fechar cada caixa corretamente.',
        storyConnection: 'Separar as sementes por pares ajuda a plantar cada flor no sítio certo.',
        helperCharacter: 'athenas',
        helperLabel: 'Ver onde a Athenas cheira',
      },
      {
        id: 'cap3-logic',
        type: 'logic',
        title: 'Placas das Casinhas do Jardim',
        goal: 'Descobrir qual animal vive em cada abrigo usando as pistas do jardim.',
        storyConnection: 'Cada abrigo tem a comida e o tamanho certos para o seu morador.',
        helperCharacter: 'lucky',
        helperLabel: 'Pedir pista com o Lucky',
      },
    ],
    rewardMessage:
      'Que organização incrível! O jardim ficou impecável e revelou a terceira página do mapa!',
    sticker: {
      id: 'sticker-borboleta',
      name: 'Borboleta Arco-Íris',
      description: 'Visitante alegre dos girassóis bem cuidados do jardim.',
      color: '#EC4899',
      chapterId: 3,
    },
    mapPieceLabel: 'Página 3 · Jardim Colorido',
  },
  {
    id: 4,
    title: 'As Placas da Colina do Moinho',
    placeName: 'Colina do Moinho',
    objective: 'Reconstruir as placas com palavras e separar os objetos de cada cesto.',
    illustration: '/src/assets/images/cap4_colina_palavras_1795593921523.jpg',
    storyLead:
      'Subindo pelo trilho do jardim, chegaram ao alto da Colina do Moinho. Os passarinhos azuis pousaram nas placas de madeira cujos blocos de letras caíram na relva.',
    dialogues: [
      {
        speaker: 'larissa',
        text: 'Encontrei estes blocos com letras! Se montarmos as palavras certas nas placas, os outros caminheiros também encontram o caminho.',
        dogAction: {
          dog: 'lucky',
          action: 'Lucky apanha delicadamente um bloco de madeira caído junto ao poste.',
        },
      },
      {
        speaker: 'esmeralda',
        text: 'Obrigada, Lucky! E depois ainda temos de separar o que pertence ao cesto do lanche e o que pertence ao trilho.',
        dogAction: {
          dog: 'athenas',
          action: 'Athenas olha atenta para os cestos e inclina a cabeça.',
        },
      },
    ],
    choice: {
      prompt: 'Antes de montar as placas, o que verificam na colina?',
      options: [
        {
          id: 'ver_vento',
          label: 'Ver a direção do vento nas pás do moinho',
          reactionSpeaker: 'esmeralda',
          reactionText:
            'Boa observação! As pás giram devagar e mostram para que lado fica o vale das lanternas.',
          dogNote: 'Athenas levanta as orelhas para sentir a brisa fresca da colina.',
        },
        {
          id: 'juntar_blocos',
          label: 'Juntar todos os blocos de madeira do chão',
          reactionSpeaker: 'larissa',
          reactionText:
            'Assim não deixamos nada perdido na relva e temos todas as letras à mão!',
          dogNote: 'Lucky larga o bloco aos pés da Larissa e abana a cauda.',
        },
      ],
    },
    discoveryText:
      'Atrás da placa principal estava presa a Página 4 do mapa, mostrando a Árvore das Estrelas ao fundo do vale!',
    nextChapterHook: 'O sol começa a descer e as lanternas do vale acendem-se ao longe.',
    puzzles: [
      {
        id: 'cap4-word',
        type: 'word',
        title: 'Palavras das Placas do Trilho',
        goal: 'Formar as palavras corretas com os blocos de madeira caídos.',
        storyConnection: 'As placas completas indicam a direção segura até à Árvore das Estrelas.',
        helperCharacter: 'lucky',
        helperLabel: 'Ver bloco que o Lucky achou',
      },
      {
        id: 'cap4-odd',
        type: 'odd_one_out',
        title: 'Organizar os Cestos do Passeio',
        goal: 'Descobrir qual objeto não pertence ao mesmo grupo dos outros.',
        storyConnection: 'Separar bem os objetos mantém a mochila leve e o parque limpo.',
        helperCharacter: 'athenas',
        helperLabel: 'Observar a Athenas',
      },
    ],
    rewardMessage:
      'Muito bem! As placas voltaram ao sítio e encontraram a última página do caderno-mapa!',
    sticker: {
      id: 'sticker-passaro',
      name: 'Passarinho Cantor',
      description: 'Alegrou a Colina do Moinho junto às placas restauradas.',
      color: '#10B981',
      chapterId: 4,
    },
    mapPieceLabel: 'Página 4 · Colina do Moinho',
  },
  {
    id: 5,
    title: 'O Baú da Árvore das Estrelas',
    placeName: 'Árvore das Estrelas',
    objective: 'Abrir os três cadeados do baú de madeira usando tudo o que aprenderam no passeio.',
    illustration: '/src/assets/images/cap5_arvore_estrelas_1795593922690.jpg',
    storyLead:
      'Com todas as páginas reunidas no caderno-mapa, Esmeralda, Larissa, Athenas e Lucky chegaram ao ponto final do passeio: a grande árvore decorada com lanternas de papel e estrelas pintadas.',
    dialogues: [
      {
        speaker: 'esmeralda',
        text: 'Conseguimos juntar todo o mapa da minha avó! Ali está o baú de madeira com o carimbo final e os prémios do passeio!',
        dogAction: {
          dog: 'athenas',
          action: 'Athenas encosta-se contente à perna da Esmeralda.',
        },
      },
      {
        speaker: 'larissa',
        text: 'O baú tem três cadeados divertidos: um de padrão, um de contagem e uma palavra especial. Vamos abrir juntas!',
        dogAction: {
          dog: 'lucky',
          action: 'Lucky senta-se direito ao lado do baú a abanar a cauda.',
        },
      },
    ],
    choice: {
      prompt: 'Como celebram a chegada antes de abrir os três cadeados?',
      options: [
        {
          id: 'dar_biscoito',
          label: 'Dar um biscoito próprio para cães à Athenas e ao Lucky',
          reactionSpeaker: 'esmeralda',
          reactionText:
            'Mereceram! Foram os melhores companheiros de passeio do mundo!',
          dogNote: 'Athenas e Lucky sentam-se educadamente antes de receber o biscoito.',
        },
        {
          id: 'acender_lanternas',
          label: 'Admirar as lanternas coloridas com a Larissa',
          reactionSpeaker: 'larissa',
          reactionText:
            'Que vista bonita ao pôr do sol! Agora vamos abrir o Baú da Amizade!',
          dogNote: 'Athenas e Lucky descansam contentes sobre a relva macia.',
        },
      ],
    },
    discoveryText:
      'Dentro do Baú da Amizade estava o carimbo dourado do passeio completo e o autocolante especial da Árvore das Estrelas!',
    nextChapterHook: 'Uma aventura segura e cheia de descobertas fica guardada para sempre!',
    puzzles: [
      {
        id: 'cap5-finale',
        type: 'chest_finale',
        title: 'Os Três Cadeados do Baú',
        goal: 'Resolver o padrão das lanternas, contar as luzes e formar a palavra final.',
        storyConnection: 'Cada cadeado recorda uma habilidade usada ao longo dos cinco lugares.',
        helperCharacter: 'athenas',
        helperLabel: 'Pedir pista às meninas',
      },
    ],
    rewardMessage:
      'Viva! Abriram o Baú da Amizade! Cuidar dos animais, respeitar a natureza e trabalhar em equipa é a maior vitória!',
    sticker: {
      id: 'sticker-estrela',
      name: 'Estrela da Amizade',
      description: 'Prémio final por completar todos os cinco capítulos da aventura.',
      color: '#F97316',
      chapterId: 5,
    },
    mapPieceLabel: 'Carimbo Final · Árvore das Estrelas',
  },
];
