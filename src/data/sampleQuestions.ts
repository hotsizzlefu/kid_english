import { Question } from '../store/mobileStore';

// 使用在线图片API生成儿童友好的图片
export const sampleQuestions: Question[] = [
  {
    id: '1',
    word: 'apple',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20apple%20with%20smiling%20face%2C%20bright%20red%20color%2C%20children%20book%20illustration%20style&image_size=square',
    audio: '/sounds/apple.mp3',
    options: ['apple', 'banana', 'orange', 'grape'],
    correctAnswer: 0,
    example: 'I eat a red apple every day. 我每天吃一个红苹果。'
  },
  {
    id: '2',
    word: 'cat',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20cat%20with%20big%20eyes%2C%20fluffy%20orange%20fur%2C%20sitting%20position%2C%20children%20book%20illustration%20style&image_size=square',
    audio: '/sounds/cat.mp3',
    options: ['dog', 'cat', 'bird', 'fish'],
    correctAnswer: 1,
    example: 'The cat is sleeping on the sofa. 猫正在沙发上睡觉。'
  },
  {
    id: '3',
    word: 'sun',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20sun%20with%20smiling%20face%2C%20bright%20yellow%20color%2C%20rays%20of%20light%2C%20children%20book%20illustration%20style&image_size=square',
    audio: '/sounds/sun.mp3',
    options: ['moon', 'star', 'sun', 'cloud'],
    correctAnswer: 2,
    example: 'The sun is shining brightly today. 今天阳光明媚。'
  },
  {
    id: '4',
    word: 'book',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20book%20with%20colorful%20cover%2C%20open%20pages%2C%20magic%20sparkles%2C%20children%20book%20illustration%20style&image_size=square',
    audio: '/sounds/book.mp3',
    options: ['book', 'pen', 'paper', 'bag'],
    correctAnswer: 0,
    example: 'I read an interesting book yesterday. 我昨天读了一本有趣的书。'
  },
  {
    id: '5',
    word: 'tree',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20tree%20with%20green%20leaves%2C%20brown%20trunk%2C%20birds%20nesting%2C%20children%20book%20illustration%20style&image_size=square',
    audio: '/sounds/tree.mp3',
    options: ['flower', 'tree', 'grass', 'leaf'],
    correctAnswer: 1,
    example: 'The big tree provides shade in summer. 这棵大树在夏天提供阴凉。'
  },
  {
    id: '6',
    word: 'dog',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20dog%20with%20floppy%20ears%2C%20happy%20expression%2C%20brown%20and%20white%20fur%2C%20children%20book%20illustration%20style&image_size=square',
    audio: '/sounds/dog.mp3',
    options: ['cat', 'dog', 'rabbit', 'hamster'],
    correctAnswer: 1,
    example: 'My dog likes to play fetch in the park. 我的狗喜欢在公园玩接球游戏。'
  },
  {
    id: '7',
    word: 'house',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20house%20with%20red%20roof%2C%20yellow%20walls%2C%20smoke%20from%20chimney%2C%20children%20book%20illustration%20style&image_size=square',
    audio: '/sounds/house.mp3',
    options: ['house', 'school', 'hospital', 'store'],
    correctAnswer: 0,
    example: 'My house has a beautiful garden. 我的房子有一个美丽的花园。'
  },
  {
    id: '8',
    word: 'car',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20car%20with%20bright%20colors%2C%20smiling%20face%2C%20wheels%20turning%2C%20children%20book%20illustration%20style&image_size=square',
    audio: '/sounds/car.mp3',
    options: ['bus', 'car', 'train', 'plane'],
    correctAnswer: 1,
    example: 'We drive our car to visit grandma. 我们开车去看望奶奶。'
  },
  {
    id: '9',
    word: 'ball',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20ball%20with%20colorful%20stripes%2C%20bouncing%20motion%2C%20children%20book%20illustration%20style&image_size=square',
    audio: '/sounds/ball.mp3',
    options: ['ball', 'doll', 'toy', 'game'],
    correctAnswer: 0,
    example: 'The children are playing with a red ball. 孩子们正在玩红球。'
  },
  {
    id: '10',
    word: 'bird',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20bird%20with%20colorful%20feathers%2C%20flying%20position%2C%20blue%20and%20yellow%20colors%2C%20children%20book%20illustration%20style&image_size=square',
    audio: '/sounds/bird.mp3',
    options: ['bird', 'butterfly', 'bee', 'dragonfly'],
    correctAnswer: 0,
    example: 'The little bird is singing in the tree. 小鸟在树上唱歌。'
  }
];

// 生成更多题目（30题用于每天的学习）
export const generateDailyQuestions = (day: number): Question[] => {
  // 这里可以根据日期生成不同的题目组合
  // 为了演示，我们重复使用现有的题目
  const questions = [];
  for (let i = 0; i < 30; i++) {
    const baseQuestion = sampleQuestions[i % sampleQuestions.length];
    questions.push({
      ...baseQuestion,
      id: `${day}-${i + 1}`,
      // 随机化选项顺序
      options: shuffleArray([...baseQuestion.options]),
      correctAnswer: 0 // 因为正确答案总是在第一个位置
    });
  }
  return questions;
};

// 数组随机排序函数
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}