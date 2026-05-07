const PHOTO1 = "photo1.jpg";
const PHOTO2 = "photo2.jpg";

// true = 測試模式（幾秒就能再抽一次），false = 正式模式（每小時只能抽一次）
const TEST_MODE = false;
const TEST_DRAW_SECONDS = 1;

const QA_LIST = [
  {
    question: "你想知道我想對你說什麼嗎",
    image: "fun1.jpg"
  },
  {
    question: "晚上要來點激情嗎",
    image: "fun2.jpg"
  },
  {
    question: "你要跟我再一起一輩子嗎",
    image: "fun3.jpg"
  }
];

const FORTUNE_LIST = [
  { name: "隱藏大獎", image: "fortune0.jpg", desc: "👽👾👻👾👽", rate: 1 },
  { name: "大吉", image: "fortune1.jpg", desc: "好運馬路 🐱✨", rate: 3 },
  { name: "吉", image: "fortune2.jpg", desc: "毛毛朋友幫🐱🐰", rate: 18 },
  { name: "中吉", image: "fortune3.jpg", desc: "老波妞 🐇", rate: 26 },
  { name: "小吉", image: "fortune4.jpg", desc: "水豚水豚 🌿", rate: 16 },
  { name: "末吉", image: "fortune5.jpg", desc: "懶惰馬路 🐈", rate: 14 },
  { name: "凶", image: "fortune6.jpg", desc: "神秘黑炭 ⚠️", rate: 12 },
  { name: "大凶", image: "fortune7.jpg", desc: "邪惡豆塔 😾", rate: 10 }
];

const PRIZE_LIST = [
  { name: "1", image: "prize1.jpg", rate: 0.5, desc: "包包獎 👜✨" },
  { name: "2", image: "prize2.jpg", rate: 1, desc: "鞋鞋衣服獎 👗🎉" },
  { name: "3", image: "prize3.jpg", rate: 2, desc: "化妝品獎 🪮🎁" },
  { name: "4", image: "prize4.jpg", rate: 3, desc: "美食獎 🍲" },
  { name: "5", image: "prize5.jpg", rate: 5, desc: "兜風獎 🚗" },
  { name: "6", image: "prize6.jpg", rate: 88.5, desc: "愛的抱抱老婆獎 🍀" }
];

const rotatingReminders = [
  "記得喝水 💧",
  "坐久屁股酸記得動動 ✨",
  "眼睛要休息 👀",
  "手腳動動 🙆",
  "深呼吸 🌿",
  "晚餐要吃啥 🐰",
];
