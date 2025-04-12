
// Frases filosóficas sobre a brevidade da vida

export const lifeQuotes = [
  "A vida é curta, a arte é longa. — Hipócrates",
  "O tempo é o bem mais valioso que um homem pode gastar. — Teofrasto",
  "O sábio não se senta para lamentar, mas se alegra por ter vivido. — William Shakespeare",
  "Nosso medo da morte é como nosso medo de oceano: está em sua vastidão, não em suas ondas. — Rabindranath Tagore",
  "O destino embaralha as cartas, e nós jogamos. — Arthur Schopenhauer",
  "A vida é como andar de bicicleta. Para manter o equilíbrio, você deve continuar se movendo. — Albert Einstein",
  "A vida é breve, mas se você souber usá-la, ela será longa o suficiente. — Sêneca",
  "Não é o tempo que muda as coisas, mas o que fazemos dele. — Thoreau",
  "Somente uma vida vivida para os outros vale a pena ser vivida. — Albert Einstein",
  "A vida é aquilo que acontece enquanto você está ocupado fazendo outros planos. — John Lennon",
  "A essência da vida é ir para frente; quem ficou parado, já morreu. — Machado de Assis",
  "A vida é um constante fluir; nada permanece o mesmo. — Heráclito",
  "Todo homem morre. Nem todo homem vive de verdade. — William Wallace",
  "A vida é como um eco: se não gosta do que vê, mude o que faz. — Jim Rohn",
  "A maior glória na vida não é nunca cair, mas levantar-se a cada vez que caímos. — Nelson Mandela",
  "A vida não examinada não vale a pena ser vivida. — Sócrates",
  "A vida é como uma câmera: foque no que é importante, capture bons momentos, desenvolva negativos em positivos. — Desconhecido",
  "O tempo é uma criança jogando dados: reino de criança. — Heráclito",
  "A vida sem reflexão não vale a pena ser vivida. — Sócrates",
  "Não conte os dias, faça os dias contarem. — Muhammad Ali",
  "A vida é realmente simples, mas insistimos em torná-la complicada. — Confúcio",
  "A maior descoberta da minha geração é que os seres humanos podem alterar suas vidas alterando suas atitudes mentais. — William James",
  "A felicidade não está em viver, mas em saber viver. — Fiódor Dostoiévski",
  "A vida é um eterno recomeço. — Jean-Paul Sartre",
  "A vida é curta para ser pequena. — Benjamin Disraeli",
  "A vida é uma aventura ousada ou não é nada. — Helen Keller",
  "A verdadeira sabedoria está em reconhecer a própria ignorância. — Sócrates",
  "O segredo da existência humana está não só em viver, mas também em saber para que se vive. — Fiódor Dostoiévski",
  "O homem não pode descobrir novos oceanos a menos que tenha coragem de perder de vista a costa. — André Gide",
  "Antes de julgar minha vida ou meu caráter, calce os meus sapatos e percorra o caminho que eu percorri. — Atticus",
  "Viva como se fosse morrer amanhã. Aprenda como se fosse viver para sempre. — Mahatma Gandhi",
  "O homem que remove montanhas começa carregando pequenas pedras. — Provérbio chinês",
  "É durante as tempestades que descobrimos a coragem dos navegantes. — Thomas Fuller",
  "Odeio como as pessoas romantizam o sofrimento em vez de valorizar cada momento. — Marina Keegan",
  "Não se pode entrar duas vezes no mesmo rio, pois novas águas estão sempre fluindo. — Heráclito",
  "Nada é permanente, exceto a mudança. — Heráclito",
  "A vida é o que fazemos dela. As viagens são os viajantes. O que vemos não é o que vemos, mas o que somos. — Fernando Pessoa",
  "Não devemos ter medo da morte, mas sim de nunca termos começado a viver. — Marcus Aurelius",
  "O homem que acha que sabe algo, não sabe nada. O homem que sabe que não sabe, sabe tudo. — Sócrates",
  "Todo mundo pensa em mudar o mundo, mas ninguém pensa em mudar a si mesmo. — Leon Tolstoy",
  "Somos o que repetidamente fazemos. A excelência, portanto, não é um ato, mas um hábito. — Aristóteles",
  "A mente que se abre a uma nova ideia jamais voltará ao seu tamanho original. — Albert Einstein",
  "Daqui a vinte anos, você estará mais desapontado pelas coisas que não fez do que pelas que fez. — Mark Twain",
  "Seja a mudança que você quer ver no mundo. — Mahatma Gandhi",
  "Não importa o quão devagar você vá, desde que você não pare. — Confúcio",
  "Tudo o que somos é resultado do que pensamos. — Buda",
  "A única maneira de fazer um excelente trabalho é amar o que você faz. — Steve Jobs",
  "O mais difícil não é aceitar que tudo termina, mas compreender que, às vezes, tudo termina antes mesmo de começar. — José Saramago",
  "Para cada minuto que você está com raiva, perde sessenta segundos de felicidade. — Ralph Waldo Emerson"
];

/**
 * Retorna uma frase aleatória sobre a brevidade da vida
 */
export const getRandomQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * lifeQuotes.length);
  return lifeQuotes[randomIndex];
};
