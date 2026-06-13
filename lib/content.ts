// French vocabulary content — holiday conversational focus
// Sources: frequency lists, DELF A1/A2 vocab, holiday corpus

export type CardType = 'word' | 'sentence' | 'grammar' | 'multiple-choice';
export type Category = 'greetings' | 'campsite' | 'bakery' | 'restaurant' | 'shopping' | 'directions' | 'numbers' | 'core' | 'grammar';

export interface Card {
  id: string;
  type: CardType;
  category: Category;
  front: string;      // what user sees first
  back: string;       // answer / translation
  hint?: string;      // grammar note or usage tip
  choices?: string[]; // for multiple-choice cards (includes correct answer)
  correctChoice?: string;
}

const cards: Card[] = [
  // ─── GREETINGS & PLEASANTRIES ───────────────────────────────────────────────
  { id: 'g01', type: 'word', category: 'greetings', front: 'Bonjour', back: 'Hello / Good morning', hint: 'Safe for any time before 6pm' },
  { id: 'g02', type: 'word', category: 'greetings', front: 'Bonsoir', back: 'Good evening', hint: 'Use from around 6pm' },
  { id: 'g03', type: 'word', category: 'greetings', front: 'Salut', back: 'Hi / Bye (informal)', hint: 'Between friends only' },
  { id: 'g04', type: 'word', category: 'greetings', front: 'Au revoir', back: 'Goodbye' },
  { id: 'g05', type: 'word', category: 'greetings', front: 'À bientôt', back: 'See you soon' },
  { id: 'g06', type: 'word', category: 'greetings', front: 'À demain', back: 'See you tomorrow' },
  { id: 'g07', type: 'word', category: 'greetings', front: 'Merci', back: 'Thank you' },
  { id: 'g08', type: 'word', category: 'greetings', front: 'Merci beaucoup', back: 'Thank you very much' },
  { id: 'g09', type: 'word', category: 'greetings', front: 'De rien', back: "You're welcome" },
  { id: 'g10', type: 'word', category: 'greetings', front: 'S\'il vous plaît', back: 'Please (formal)', hint: 'svp — always use with strangers' },
  { id: 'g11', type: 'word', category: 'greetings', front: 'Excusez-moi', back: 'Excuse me (formal)' },
  { id: 'g12', type: 'word', category: 'greetings', front: 'Pardon', back: 'Sorry / Pardon' },
  { id: 'g13', type: 'word', category: 'greetings', front: 'Enchanté(e)', back: 'Nice to meet you' },
  { id: 'g14', type: 'sentence', category: 'greetings', front: 'Ça va ?', back: 'How\'s it going?' },
  { id: 'g15', type: 'sentence', category: 'greetings', front: 'Ça va bien, merci.', back: 'I\'m doing well, thank you.' },
  { id: 'g16', type: 'sentence', category: 'greetings', front: 'Comment vous appelez-vous ?', back: 'What\'s your name? (formal)' },
  { id: 'g17', type: 'sentence', category: 'greetings', front: 'Je m\'appelle Bart.', back: 'My name is Bart.' },
  { id: 'g18', type: 'sentence', category: 'greetings', front: 'Je suis néerlandais.', back: 'I\'m Dutch.' },
  { id: 'g19', type: 'sentence', category: 'greetings', front: 'Vous parlez anglais ?', back: 'Do you speak English?' },
  { id: 'g20', type: 'sentence', category: 'greetings', front: 'Je ne parle pas bien français.', back: 'I don\'t speak French well.' },
  { id: 'g21', type: 'sentence', category: 'greetings', front: 'Pouvez-vous répéter, s\'il vous plaît ?', back: 'Can you repeat that, please?' },
  { id: 'g22', type: 'sentence', category: 'greetings', front: 'Plus lentement, s\'il vous plaît.', back: 'More slowly, please.' },
  { id: 'g23', type: 'sentence', category: 'greetings', front: 'Je ne comprends pas.', back: 'I don\'t understand.' },
  { id: 'g24', type: 'sentence', category: 'greetings', front: 'C\'est très gentil !', back: 'That\'s very kind!' },
  { id: 'g25', type: 'sentence', category: 'greetings', front: 'Bonne journée !', back: 'Have a good day!' },
  { id: 'g26', type: 'sentence', category: 'greetings', front: 'Bonne soirée !', back: 'Have a good evening!' },

  // ─── CAMPSITE ───────────────────────────────────────────────────────────────
  { id: 'c01', type: 'sentence', category: 'campsite', front: 'Avez-vous de la place ?', back: 'Do you have space?' },
  { id: 'c02', type: 'sentence', category: 'campsite', front: 'Je voudrais réserver un emplacement.', back: 'I\'d like to reserve a pitch.' },
  { id: 'c03', type: 'sentence', category: 'campsite', front: 'Pour deux nuits.', back: 'For two nights.' },
  { id: 'c04', type: 'sentence', category: 'campsite', front: 'C\'est combien par nuit ?', back: 'How much per night?' },
  { id: 'c05', type: 'sentence', category: 'campsite', front: 'Où sont les toilettes ?', back: 'Where are the toilets?' },
  { id: 'c06', type: 'sentence', category: 'campsite', front: 'Où est la douche ?', back: 'Where is the shower?' },
  { id: 'c07', type: 'sentence', category: 'campsite', front: 'Est-ce qu\'il y a du Wi-Fi ?', back: 'Is there Wi-Fi?' },
  { id: 'c08', type: 'sentence', category: 'campsite', front: 'Où est la réception ?', back: 'Where is the reception?' },
  { id: 'c09', type: 'sentence', category: 'campsite', front: 'Je peux payer par carte ?', back: 'Can I pay by card?' },
  { id: 'c10', type: 'sentence', category: 'campsite', front: 'On peut faire un feu de camp ?', back: 'Can we make a campfire?' },
  { id: 'c11', type: 'word', category: 'campsite', front: 'un emplacement', back: 'a pitch / spot', hint: 'Where you put your tent' },
  { id: 'c12', type: 'word', category: 'campsite', front: 'une tente', back: 'a tent' },
  { id: 'c13', type: 'word', category: 'campsite', front: 'un camping-car', back: 'a motorhome' },
  { id: 'c14', type: 'word', category: 'campsite', front: 'la piscine', back: 'the swimming pool' },
  { id: 'c15', type: 'sentence', category: 'campsite', front: 'À quelle heure ferme la réception ?', back: 'What time does reception close?' },

  // ─── BAKERY ─────────────────────────────────────────────────────────────────
  { id: 'b01', type: 'sentence', category: 'bakery', front: 'Une baguette, s\'il vous plaît.', back: 'One baguette, please.' },
  { id: 'b02', type: 'sentence', category: 'bakery', front: 'Deux croissants, s\'il vous plaît.', back: 'Two croissants, please.' },
  { id: 'b03', type: 'sentence', category: 'bakery', front: 'Avez-vous des pains au chocolat ?', back: 'Do you have pain au chocolat?' },
  { id: 'b04', type: 'sentence', category: 'bakery', front: 'C\'est tout, merci.', back: 'That\'s all, thank you.' },
  { id: 'b05', type: 'sentence', category: 'bakery', front: 'Ça fait combien ?', back: 'How much is it?' },
  { id: 'b06', type: 'sentence', category: 'bakery', front: 'Je voudrais une tarte aux pommes.', back: 'I\'d like an apple tart.' },
  { id: 'b07', type: 'sentence', category: 'bakery', front: 'Vous avez du pain de campagne ?', back: 'Do you have country bread?' },
  { id: 'b08', type: 'word', category: 'bakery', front: 'une boulangerie', back: 'a bakery' },
  { id: 'b09', type: 'word', category: 'bakery', front: 'une pâtisserie', back: 'a pastry shop' },
  { id: 'b10', type: 'word', category: 'bakery', front: 'un croissant', back: 'a croissant' },
  { id: 'b11', type: 'word', category: 'bakery', front: 'un pain au chocolat', back: 'a chocolate pastry' },
  { id: 'b12', type: 'word', category: 'bakery', front: 'une tarte', back: 'a tart / pie' },
  { id: 'b13', type: 'sentence', category: 'bakery', front: 'À emporter ou sur place ?', back: 'To take away or eat in?' },

  // ─── RESTAURANT / CAFÉ ──────────────────────────────────────────────────────
  { id: 'r01', type: 'sentence', category: 'restaurant', front: 'Une table pour deux, s\'il vous plaît.', back: 'A table for two, please.' },
  { id: 'r02', type: 'sentence', category: 'restaurant', front: 'La carte, s\'il vous plaît.', back: 'The menu, please.' },
  { id: 'r03', type: 'sentence', category: 'restaurant', front: 'Qu\'est-ce que vous recommandez ?', back: 'What do you recommend?' },
  { id: 'r04', type: 'sentence', category: 'restaurant', front: 'Je prends ça.', back: 'I\'ll have that.' },
  { id: 'r05', type: 'sentence', category: 'restaurant', front: 'L\'addition, s\'il vous plaît.', back: 'The bill, please.' },
  { id: 'r06', type: 'sentence', category: 'restaurant', front: 'C\'était délicieux !', back: 'It was delicious!' },
  { id: 'r07', type: 'sentence', category: 'restaurant', front: 'Un café, s\'il vous plaît.', back: 'A coffee, please.' },
  { id: 'r08', type: 'sentence', category: 'restaurant', front: 'De l\'eau, s\'il vous plaît.', back: 'Some water, please.' },
  { id: 'r09', type: 'word', category: 'restaurant', front: 'la carte', back: 'the menu', hint: 'le menu = set menu' },
  { id: 'r10', type: 'word', category: 'restaurant', front: 'l\'addition', back: 'the bill' },

  // ─── DIRECTIONS ─────────────────────────────────────────────────────────────
  { id: 'd01', type: 'sentence', category: 'directions', front: 'Où est la supermarché ?', back: 'Where is the supermarket?' },
  { id: 'd02', type: 'sentence', category: 'directions', front: 'C\'est loin ?', back: 'Is it far?' },
  { id: 'd03', type: 'sentence', category: 'directions', front: 'Tournez à gauche.', back: 'Turn left.' },
  { id: 'd04', type: 'sentence', category: 'directions', front: 'Tournez à droite.', back: 'Turn right.' },
  { id: 'd05', type: 'sentence', category: 'directions', front: 'Tout droit.', back: 'Straight ahead.' },
  { id: 'd06', type: 'word', category: 'directions', front: 'à gauche', back: 'to the left' },
  { id: 'd07', type: 'word', category: 'directions', front: 'à droite', back: 'to the right' },
  { id: 'd08', type: 'word', category: 'directions', front: 'tout droit', back: 'straight ahead' },
  { id: 'd09', type: 'word', category: 'directions', front: 'près de', back: 'near / close to' },
  { id: 'd10', type: 'word', category: 'directions', front: 'loin de', back: 'far from' },

  // ─── NUMBERS & TIME ─────────────────────────────────────────────────────────
  { id: 'n01', type: 'word', category: 'numbers', front: 'un / une', back: '1' },
  { id: 'n02', type: 'word', category: 'numbers', front: 'deux', back: '2' },
  { id: 'n03', type: 'word', category: 'numbers', front: 'trois', back: '3' },
  { id: 'n04', type: 'word', category: 'numbers', front: 'quatre', back: '4' },
  { id: 'n05', type: 'word', category: 'numbers', front: 'cinq', back: '5' },
  { id: 'n06', type: 'word', category: 'numbers', front: 'six', back: '6' },
  { id: 'n07', type: 'word', category: 'numbers', front: 'sept', back: '7' },
  { id: 'n08', type: 'word', category: 'numbers', front: 'huit', back: '8' },
  { id: 'n09', type: 'word', category: 'numbers', front: 'neuf', back: '9' },
  { id: 'n10', type: 'word', category: 'numbers', front: 'dix', back: '10' },
  { id: 'n11', type: 'word', category: 'numbers', front: 'vingt', back: '20' },
  { id: 'n12', type: 'word', category: 'numbers', front: 'cinquante', back: '50' },
  { id: 'n13', type: 'word', category: 'numbers', front: 'cent', back: '100' },
  { id: 'n14', type: 'sentence', category: 'numbers', front: 'Il est quelle heure ?', back: 'What time is it?' },
  { id: 'n15', type: 'sentence', category: 'numbers', front: 'Il est dix heures.', back: 'It\'s ten o\'clock.' },

  // ─── CORE VOCAB (top frequency words for conversation) ───────────────────────
  { id: 'w01', type: 'word', category: 'core', front: 'oui', back: 'yes' },
  { id: 'w02', type: 'word', category: 'core', front: 'non', back: 'no' },
  { id: 'w03', type: 'word', category: 'core', front: 'peut-être', back: 'maybe' },
  { id: 'w04', type: 'word', category: 'core', front: 'bien sûr', back: 'of course' },
  { id: 'w05', type: 'word', category: 'core', front: 'voilà', back: 'here you go / there it is' },
  { id: 'w06', type: 'word', category: 'core', front: 'c\'est', back: 'it is / this is' },
  { id: 'w07', type: 'word', category: 'core', front: 'il y a', back: 'there is / there are' },
  { id: 'w08', type: 'word', category: 'core', front: 'je voudrais', back: 'I would like', hint: 'More polite than "je veux"' },
  { id: 'w09', type: 'word', category: 'core', front: 'je peux', back: 'I can / May I' },
  { id: 'w10', type: 'word', category: 'core', front: 'je dois', back: 'I must / I have to' },
  { id: 'w11', type: 'word', category: 'core', front: 'combien', back: 'how much / how many' },
  { id: 'w12', type: 'word', category: 'core', front: 'où', back: 'where' },
  { id: 'w13', type: 'word', category: 'core', front: 'quand', back: 'when' },
  { id: 'w14', type: 'word', category: 'core', front: 'comment', back: 'how' },
  { id: 'w15', type: 'word', category: 'core', front: 'pourquoi', back: 'why' },
  { id: 'w16', type: 'word', category: 'core', front: 'qu\'est-ce que', back: 'what (is)' },
  { id: 'w17', type: 'word', category: 'core', front: 'très', back: 'very' },
  { id: 'w18', type: 'word', category: 'core', front: 'trop', back: 'too (much)' },
  { id: 'w19', type: 'word', category: 'core', front: 'assez', back: 'enough / quite' },
  { id: 'w20', type: 'word', category: 'core', front: 'aussi', back: 'also / too' },
  { id: 'w21', type: 'word', category: 'core', front: 'encore', back: 'again / more / still' },
  { id: 'w22', type: 'word', category: 'core', front: 'maintenant', back: 'now' },
  { id: 'w23', type: 'word', category: 'core', front: 'aujourd\'hui', back: 'today' },
  { id: 'w24', type: 'word', category: 'core', front: 'demain', back: 'tomorrow' },
  { id: 'w25', type: 'word', category: 'core', front: 'hier', back: 'yesterday' },
  { id: 'w26', type: 'word', category: 'core', front: 'bon / bonne', back: 'good' },
  { id: 'w27', type: 'word', category: 'core', front: 'grand / grande', back: 'big / large / tall' },
  { id: 'w28', type: 'word', category: 'core', front: 'petit / petite', back: 'small / little' },
  { id: 'w29', type: 'word', category: 'core', front: 'chaud / chaude', back: 'hot / warm' },
  { id: 'w30', type: 'word', category: 'core', front: 'froid / froide', back: 'cold' },
  { id: 'w31', type: 'word', category: 'core', front: 'ouvert / ouverte', back: 'open' },
  { id: 'w32', type: 'word', category: 'core', front: 'fermé / fermée', back: 'closed' },
  { id: 'w33', type: 'word', category: 'core', front: 'libre', back: 'free / available' },
  { id: 'w34', type: 'word', category: 'core', front: 'occupé / occupée', back: 'busy / occupied' },
  { id: 'w35', type: 'word', category: 'core', front: 'un homme', back: 'a man' },
  { id: 'w36', type: 'word', category: 'core', front: 'une femme', back: 'a woman' },
  { id: 'w37', type: 'word', category: 'core', front: 'un enfant', back: 'a child' },
  { id: 'w38', type: 'sentence', category: 'core', front: 'Quelle belle journée !', back: 'What a beautiful day!' },
  { id: 'w39', type: 'sentence', category: 'core', front: 'Il fait beau.', back: 'The weather is nice.' },
  { id: 'w40', type: 'sentence', category: 'core', front: 'Il fait chaud.', back: 'It\'s hot.' },
  { id: 'w41', type: 'sentence', category: 'core', front: 'Pas de problème !', back: 'No problem!' },
  { id: 'w42', type: 'sentence', category: 'core', front: 'C\'est parfait !', back: 'That\'s perfect!' },
  { id: 'w43', type: 'sentence', category: 'core', front: 'Je ne sais pas.', back: 'I don\'t know.' },
  { id: 'w44', type: 'sentence', category: 'core', front: 'C\'est dommage.', back: 'That\'s a pity.' },
  { id: 'w45', type: 'sentence', category: 'core', front: 'Avec plaisir !', back: 'With pleasure!' },

  // ─── GRAMMAR DRILLS ─────────────────────────────────────────────────────────
  { id: 'gr01', type: 'grammar', category: 'grammar', front: 'être — je ___', back: 'je suis', hint: 'I am' },
  { id: 'gr02', type: 'grammar', category: 'grammar', front: 'être — vous ___', back: 'vous êtes', hint: 'you are (formal/plural)' },
  { id: 'gr03', type: 'grammar', category: 'grammar', front: 'avoir — j\'___', back: 'j\'ai', hint: 'I have' },
  { id: 'gr04', type: 'grammar', category: 'grammar', front: 'avoir — vous ___', back: 'vous avez', hint: 'you have' },
  { id: 'gr05', type: 'grammar', category: 'grammar', front: 'aller — je ___', back: 'je vais', hint: 'I go / I\'m going' },
  { id: 'gr06', type: 'grammar', category: 'grammar', front: 'aller — nous ___', back: 'nous allons', hint: 'we go' },
  { id: 'gr07', type: 'grammar', category: 'grammar', front: 'vouloir — je ___', back: 'je veux', hint: 'I want (direct — use voudrais to be polite)' },
  { id: 'gr08', type: 'grammar', category: 'grammar', front: 'pouvoir — je ___', back: 'je peux', hint: 'I can / I am able to' },
  { id: 'gr09', type: 'grammar', category: 'grammar', front: 'faire — je ___', back: 'je fais', hint: 'I do / I make' },
  { id: 'gr10', type: 'grammar', category: 'grammar', front: 'Gender: ___ boulangerie', back: 'la boulangerie', hint: 'la = feminine' },
  { id: 'gr11', type: 'grammar', category: 'grammar', front: 'Gender: ___ pain', back: 'le pain', hint: 'le = masculine' },
  { id: 'gr12', type: 'grammar', category: 'grammar', front: 'Gender: ___ eau', back: 'l\'eau', hint: 'feminine — drops le/la before vowel' },
  { id: 'gr13', type: 'grammar', category: 'grammar', front: 'Passé composé: j\'___ mangé', back: 'j\'ai mangé', hint: 'avoir + past participle' },
  { id: 'gr14', type: 'grammar', category: 'grammar', front: 'Passé composé: je ___ allé(e)', back: 'je suis allé(e)', hint: 'être + past participle for movement verbs' },
  { id: 'gr15', type: 'grammar', category: 'grammar', front: 'Negation: Je ___ parle ___ français.', back: 'Je ne parle pas français.', hint: 'ne ... pas wraps the verb' },
  { id: 'gr16', type: 'grammar', category: 'grammar', front: 'Article: du, de la, de l\', des = ?', back: 'Partitive articles', hint: 'Use for uncountable quantities: du pain, de l\'eau' },

  // ─── MULTIPLE CHOICE ────────────────────────────────────────────────────────
  {
    id: 'mc01', type: 'multiple-choice', category: 'greetings',
    front: 'How do you say "thank you very much"?',
    back: 'Merci beaucoup', correctChoice: 'Merci beaucoup',
    choices: ['Merci beaucoup', 'Au revoir', 'S\'il vous plaît', 'Enchanté']
  },
  {
    id: 'mc02', type: 'multiple-choice', category: 'campsite',
    front: 'You arrive at a campsite. What do you ask?',
    back: 'Avez-vous de la place ?', correctChoice: 'Avez-vous de la place ?',
    choices: ['Avez-vous de la place ?', 'C\'est combien ?', 'Où est la douche ?', 'Je voudrais manger.']
  },
  {
    id: 'mc03', type: 'multiple-choice', category: 'bakery',
    front: 'What does "Ça fait combien ?" mean?',
    back: 'How much is it?', correctChoice: 'How much is it?',
    choices: ['How much is it?', 'What is that?', 'Do you have more?', 'Is it good?']
  },
  {
    id: 'mc04', type: 'multiple-choice', category: 'core',
    front: 'Which is the polite way to say "I want"?',
    back: 'Je voudrais', correctChoice: 'Je voudrais',
    choices: ['Je voudrais', 'Je veux', 'Je dois', 'Je peux']
  },
  {
    id: 'mc05', type: 'multiple-choice', category: 'grammar',
    front: 'Complete: "Je ___ allé au camping."',
    back: 'suis', correctChoice: 'suis',
    choices: ['suis', 'ai', 'vais', 'suis été']
  },
  {
    id: 'mc06', type: 'multiple-choice', category: 'restaurant',
    front: 'How do you ask for the bill?',
    back: 'L\'addition, s\'il vous plaît.', correctChoice: 'L\'addition, s\'il vous plaît.',
    choices: ['L\'addition, s\'il vous plaît.', 'La carte, s\'il vous plaît.', 'C\'était délicieux !', 'Une table pour deux.']
  },
  {
    id: 'mc07', type: 'multiple-choice', category: 'directions',
    front: '"Tournez à gauche" means?',
    back: 'Turn left', correctChoice: 'Turn left',
    choices: ['Turn left', 'Turn right', 'Go straight', 'Stop here']
  },
  {
    id: 'mc08', type: 'multiple-choice', category: 'greetings',
    front: 'A stranger walks in. You say?',
    back: 'Bonjour !', correctChoice: 'Bonjour !',
    choices: ['Bonjour !', 'Salut !', 'Bonsoir !', 'Ça va ?']
  },
  {
    id: 'mc09', type: 'multiple-choice', category: 'core',
    front: 'What does "il y a" mean?',
    back: 'there is / there are', correctChoice: 'there is / there are',
    choices: ['there is / there are', 'he has', 'it goes', 'here it is']
  },
  {
    id: 'mc10', type: 'multiple-choice', category: 'grammar',
    front: 'Gender: ___ café (masculine or feminine?)',
    back: 'le café', correctChoice: 'le café',
    choices: ['le café', 'la café', 'un cafée', 'de café']
  },
];

export default cards;

export function getCardsByCategory(category: Category): Card[] {
  return cards.filter(c => c.category === category);
}

export function getAllCards(): Card[] {
  return cards;
}

export function getCardById(id: string): Card | undefined {
  return cards.find(c => c.id === id);
}
