const STATIONS = [
  {
    id: 1,
    name: "站點一 鶯歌車站",
    icon: "🚆",
    questions: [
      {
        qtype: "選擇題",
        question: "仔細觀察鶯歌火車站的鐵道，你能數出幾條軌道？",
        options: ["6條", "8條", "10條", "12條"],
      },
      {
        qtype: "選擇題",
        question: "觀察車站最上方，兩個相望的動物造型是什麼？",
        options: ["魚", "貓", "狗", "鳥"],
      },
      {
        qtype: "選擇題",
        question: "你知道當時鶯歌車站主要轉運哪一種礦產嗎？",
        options: ["金礦", "鐵礦", "煤礦", "石灰石"],
        fact: "",
      },
      {
        qtype: "選擇題",
        question: "請問鶯歌車站最早的站名是什麼？",
        options: ["鷹哥石驛", "鶯歌石驛", "鷹哥驛", "鶯歌驛"],
        fact: "鶯歌車站最初稱為「鶯歌石驛」，得名自鄰近的鶯歌石地標，後來才逐漸簡化成現在的「鶯歌」站名",
      },
    ],
    dialogue: [
      {
        type: "line",
        char: "guide",
        text: "小明，我們到鶯歌車站了！你以前來過嗎？",
      },
      {
        type: "line",
        char: "hero",
        text: "第一次來鶯歌！之前只有經過，還真的沒仔細看過車站",
      },
      {
        type: "line",
        char: "guide",
        text: "那正好，先跟我來，我帶你去看看",
      },
      {
        type: "notice",
        text: "前往 ==建國路、文化路出口==\n【找到手扶梯旁的平台】\n⚠️請留意周遭環境，依照現場動線行走。",
        photo: "角色照片素材庫/站點一/鐵軌.jpg",
      },
      {
        type: "line",
        char: "guide",
        text: "到了嗎？往下看看，你發現了什麼？",
        background: "角色照片素材庫/站點一/鐵軌.jpg",
      },
      {
        type: "question",
        qIndex: 0,
        char: "guide",
        text: "數數看，現在這裡一共有幾條軌道？",
        correctReaction: "沒錯！以前的鶯歌車站，跟現在很不一樣",
        wrongHints: [
          "再靠近一點看，別漏數了最外側那一條……",
          "試著用手指一條一條數過去，仔細一點",
        ],
      },
      {
        type: "line",
        char: "hero",
        text: "真的嗎？以前是什麼樣子？",
      },
      {
        type: "story",
        text: "以前住在車站附近，吃飯時常會碰上煤灰\n風一吹，煤灰就飄進附近住家，有時飯還沒吃完，連湯上都浮著一層煤灰",
        photo: "角色照片素材庫/站點一/舊照片.jpg",
      },
      {
        type: "line",
        char: "guide",
        text: "那時候鐵路不只是載人，也跟附近的礦業有很大的關係",
      },
      {
        type: "question",
        qIndex: 2,
        char: "guide",
        text: "你知道當時鶯歌車站主要轉運哪一種礦產嗎？",
        correctReaction: "沒錯，就是煤礦！",
        wrongHints: ["再想想，剛才提到的「煤灰」就是線索喔！"],
      },
      {
        type: "line",
        char: "guide",
        text: "以前三峽、大溪採出的煤，會送到鶯歌車站，再運往全台。",
      },
      {
        type: "line",
        char: "guide",
        text: "當時鶯歌貨運繁盛，貨運量一度高居全台第二！",
      },
      {
        type: "line",
        char: "hero",
        text: "沒想到以前的鶯歌車站這麼熱鬧！",
      },
      {
        type: "line",
        char: "guide",
        text: "走吧！我們到前站看看",
      },
      {
        type: "notice",
        text: "請前往 一樓前站廣場。\n⚠️ 移動時請留意周遭環境，並依照車站動線行走。",
      },
      {
        type: "line",
        char: "guide",
        text: "剛才看了鐵軌，接著來看看車站本身吧！",
        background: "角色照片素材庫/站點一/台鐵鶯歌火車站.jpg",
      },
      {
        type: "line",
        char: "hero",
        text: "車站？有什麼特別的嗎？",
      },
      {
        type: "line",
        char: "guide",
        text: "抬頭看看，車站外觀藏著一個特別的設計喔！",
      },
      {
        type: "question",
        qIndex: 1,
        char: "guide",
        text: "觀察車站最上方，兩個相望的動物造型是什麼？",
        correctReaction: "沒錯，就是那兩隻鳥",
        wrongHints: ["再看清楚一點，牠們有翅膀會飛..."],
      },
      {
        type: "knowledge",
        text: "鶯歌車站牆面頂端的「兩隻鳥相望」設計，源自於在地著名的「鶯歌石」與三峽「鳶山」的民間傳說",
        photo: "角色照片素材庫/站點一/台鐵鶯歌火車站.jpg",
      },
      {
        type: "line",
        char: "guide",
        text: "看來你已經發現車站的特色了！再來考考你。",
      },
      {
        type: "line",
        char: "guide",
        text: "你知道這裡以前叫什麼名字嗎？",
      },
      {
        type: "question",
        qIndex: 3,
        char: "guide",
        text: "請問鶯歌車站最早的站名是什麼？",
        correctReaction: "沒錯，就是「鶯歌石驛」",
        wrongHints: ["再想想，那是一個更古老、更貼近地形的名字……"],
      },
      {
        type: "line",
        char: "guide",
        text: "來，你看這張老照片",
      },
      {
        type: "knowledge",
        title: "鶯歌車站舊照",
        text: "鶯歌車站最早於1901年（明治34年）8月25日設站，當時命名為鶯歌石驛（早期也曾稱鶯歌石乘降場或停車場）。",
        photo: "角色照片素材庫/站點一/鶯歌舊車站.jpg",
      },
      {
        type: "line",
        char: "hero",
        text: "原來「鶯歌石驛」是這樣來的",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯，這座車站還藏著不少故事呢",
      },
      {
        type: "line",
        char: "guide",
        text: "走吧，我們才剛開始！",
      },
      {
        type: "end",
      },
    ],
    background: "角色照片素材庫/站點一/火車站售票口.jpg",
    arrivePhoto: "角色照片素材庫/站點一/火車站售票口.jpg",
    arriveHint: "請實際前往站點，抵達後搭手扶梯前往二樓售票處才開始遊戲",
    characters: {
      guide: {
        name: "楊嚮導",
        portrait: "角色照片素材庫/角色/楊嚮導.png",
        side: "left",
      },
      hero: {
        name: "小明",
        portrait: "角色照片素材庫/角色/小明.png",
        side: "right",
      },
    },
    address: "新北市鶯歌區文化路68號",
    location: {
      lat: 24.95457,
      lng: 121.35515,
      radius: 40,
    },
  },
  {
    id: 2,
    name: "站點二 市拿陶藝",
    questions: [
      {
        qtype: "選擇題",
        question: "市拿陶藝的創辦人是誰？",
        options: ["許明徹", "許自然", "許元和", "許元國"],
      },
      {
        qtype: "選擇題",
        question: "「市拿」這個名字有什麼特別的意涵？",
        options: [
          "鶯歌的古地名",
          "一種傳統製陶方法",
          "與英文China有關",
          "取自早期原住民語意",
        ],
      },
      {
        qtype: "選擇題",
        question: "你知道市拿陶藝早期生產最有名的是哪一類陶瓷？",
        options: ["日用陶瓷", "建築陶瓷", "仿古藝術陶瓷", "工業陶瓷"],
      },
      {
        qtype: "選擇題",
        question:
          "早期鶯歌窯場常以煤炭燒窯，黑煙曾是街區常見的景象，後來窯業逐漸改用較乾淨的能源，這項改變主要是引進了哪種能源？",
        options: ["汽油", "天然氣", "電力", "柴油"],
      },
    ],
    dialogue: [
      {
        type: "line",
        char: "guide",
        text: "到了！這裡就是市拿陶藝",
      },
      {
        type: "line",
        char: "hero",
        text: "市拿陶藝？名字好特別",
      },
      {
        type: "line",
        char: "guide",
        text: "它和鶯歌陶瓷的發展可是很有關係喔！",
      },
      {
        type: "line",
        char: "guide",
        text: "先考考你，你知道是誰創辦的嗎？",
      },
      {
        type: "question",
        qIndex: 0,
        char: "guide",
        text: "市拿陶藝的創辦人是誰？",
        correctReaction: "答對了！",
      },
      {
        type: "knowledge",
        title: "許自然",
        text: "市拿陶藝於1972年由許自然先生創立，初期主要燒製仿古陶瓷， 成為當時首屈一指的現代官窯。",
        photo: "角色照片素材庫/站點二/許自然.jpg",
      },
      {
        type: "line",
        char: "hero",
        text: "原來市拿陶藝已經有這麼久的歷史了！",
      },
      {
        type: "line",
        char: "hero",
        text: "不過我一直很好奇，「市拿」這個名字是怎麼來的？",
      },
      {
        type: "line",
        char: "guide",
        text: "這就有故事了！你先猜猜看，「市拿」代表什麼意思？",
      },
      {
        type: "question",
        qIndex: 1,
        char: "guide",
        text: "「市拿」這個名字有什麼特別的意涵？",
        correctReaction: "答對了！「市拿」的名字和英文 China 有關。",
      },
      {
        type: "line",
        char: "hero",
        text: "原來背後還有這樣的故事",
      },
      {
        type: "line",
        char: "guide",
        text: "那你猜猜，市拿陶藝早期最有名的是哪一類陶瓷？",
      },
      {
        type: "question",
        qIndex: 2,
        char: "guide",
        text: "市拿陶藝早期生產最有名的是哪一類陶瓷？",
        correctReaction: "答對了！來看看仿古藝術陶瓷長什麼樣子吧！",
      },
      {
        type: "knowledge",
        title: "仿古藝術陶瓷",
        text: "市拿陶瓷以仿製元、明、清瓷器精品聞名，運用青花、粉彩、鬥彩、釉裡紅等傳統彩繪技法",
        photo: "角色照片素材庫/站點二/仿古陶瓷.jpg",
      },
      {
        type: "line",
        char: "guide",
        text: "因為做得夠精緻，這些仿古藝術陶瓷還曾經被當作禮物，贈送給外賓",
      },
      {
        type: "line",
        char: "guide",
        text: "市拿陶藝也培養不少人才，影響了鶯歌後來的陶瓷發展",
      },
      {
        type: "line",
        char: "hero",
        text: "原來市拿陶藝對鶯歌的陶瓷發展影響這麼大！",
      },
      {
        type: "line",
        char: "hero",
        text: "那以前的鶯歌，應該到處都是陶窯吧？",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！我生活在這裡的時候，常看到窯場冒著黑煙，空氣中也飄著煤灰",
      },
      {
        type: "line",
        char: "hero",
        text: "聽起來跟現在差好多！",
      },
      {
        type: "line",
        char: "guide",
        text: "是啊！後來隨著時代改變，窯場也開始改用新的能源",
      },
      {
        type: "line",
        char: "guide",
        text: "你知道後來主要引進了哪一種能源嗎？",
      },
      {
        type: "question",
        qIndex: 3,
        char: "guide",
        text: "早期鶯歌窯場常以煤炭燒窯，黑煙曾是街區常見的景象後來窯業逐漸改用較乾淨的能源，這項改變主要是引進了哪種能源？",
        correctReaction:
          "答對了！許自然擔任陶瓷工業同業公會理事長時，積極爭取將瓦斯管線引進鶯歌",
      },
      {
        type: "line",
        char: "hero",
        text: "原來他不只創辦市拿陶藝，也推動了鶯歌窯業的改變！",
      },
      {
        type: "knowledge",
        title: "瓦斯窯內部",
        text: "瓦斯的引進，讓鶯歌窯業逐步採用瓦斯窯，不只減少黑煙，也提升陶瓷品質、增加產品種類。",
        photo: "角色照片素材庫/站點二/瓦斯窯.jpg",
      },
      {
        type: "line",
        char: "hero",
        text: "原來市拿陶藝和鶯歌的發展有這麼深的關係！",
      },
      {
        type: "line",
        char: "guide",
        text: "鶯歌的故事可還沒說完呢！",
      },
      {
        type: "line",
        char: "hero",
        text: "那我們繼續去下一站看看吧！",
      },
      {
        type: "end",
      },
    ],
    characters: {
      guide: {
        name: "楊嚮導",
        portrait: "角色照片素材庫/角色/楊嚮導.png",
        side: "left",
      },
      hero: {
        name: "小明",
        portrait: "角色照片素材庫/角色/小明.png",
        side: "right",
      },
    },
    address: "新北市鶯歌區中正一路223巷19號",
    location: {
      lat: 24.957876912256797,
      lng: 121.35421614844424,
      radius: 50,
    },
    background: "角色照片素材庫/站點二/市拿陶藝.jpg",
  },
  {
    id: 3,
    name: "站點三 鶯歌石",
    questions: [
      {
        qtype: "選擇題",
        question: "傳說中，鶯歌石為什麼會少了一截？",
        options: [
          "巨石曾被山崩掩埋而成",
          "鄭成功下令開砲，轟斷了巨鳥的頭部",
          "後人開採造成缺口",
          "長年風吹雨淋自然風化",
        ],
      },
      {
        qtype: "選擇題",
        question:
          "找到鶯歌石岩洞旁的石碑，仔細觀察碑文碑文中提到，這塊石頭最初為什麼被稱為「鸚哥石」？",
        options: [
          "附近曾有許多鸚哥",
          "石頭形狀像鸚哥",
          "傳說鸚哥住在洞裡",
          "因為鄭成功曾在此養鸚哥",
        ],
      },
      {
        qtype: "選擇題",
        question:
          "觀察登山地圖,鶯歌除了「鶯歌石」這顆鳥形巨石外,哪座廟宇因供奉這顆「龜公石」,又被稱為「龜公廟」？",
        options: ["妙善宮", "宏德宮", "碧龍宮", "福德宮"],
      },
      {
        qtype: "選擇題",
        question:
          "現在的孫龍步道是一條登山步道,但在百年前這裡曾經有另一種用途,你知道孫龍步道的前身是什麼嗎？",
        options: [
          "運送陶土的道路",
          "採礦台車行駛的輕便鐵道",
          "軍事運輸道路",
          "茶葉運輸道路",
        ],
      },
    ],
    dialogue: [
      {
        type: "line",
        char: "hero",
        text: "我們接下來要去哪裡？",
      },
      {
        type: "line",
        char: "guide",
        text: "帶你去找鶯歌一個很有名的地標——鶯歌石！",
      },
      {
        type: "line",
        char: "hero",
        text: "鶯歌石？就是那顆很大的石頭嗎？",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！不過在找到它之前，先跟我走一段路吧",
      },
      {
        type: "notice",
        text: "從孫臏廟旁的孫龍步道開始",
        photo: "角色照片素材庫/站點三/孫龍步道.jpg",
      },
      {
        type: "line",
        char: "guide",
        text: "有沒有看到，前面有一輛台車？",
      },
      {
        type: "line",
        char: "hero",
        text: "這裡居然還保留著",
      },
      {
        type: "line",
        char: "guide",
        text: "那麼我就考考你，要仔細看看解說牌",
      },
      {
        type: "question",
        qIndex: 3,
        char: "guide",
        text: "現在的孫龍步道是一條登山步道,但在百年前這裡曾經有另一種用途,你知道孫龍步道的前身是什麼嗎？",
        correctReaction: "沒錯，這裡以前是採礦台車行駛的輕便鐵道",
      },
      {
        type: "line",
        char: "guide",
        text: "當時鶯歌山區礦業發展興盛，這條輕便道主要用來運送煤炭與物資",
      },
      {
        type: "line",
        char: "guide",
        text: "礦業沒落後，舊鐵道與台車道改建成平緩的步道，成為今日健行賞景的好去處",
      },
      {
        type: "line",
        char: "guide",
        text: "跟著這條路走下去，我們就要接近鶯歌石的登山處",
      },
      {
        type: "notice",
        text: "前往鶯歌石登山口",
        photo: "角色照片素材庫/站點三/步道入口.jpg",
      },
      {
        type: "line",
        char: "hero",
        text: "所以沿著這裡走上去，就能到鶯歌石了？",
        background: "角色照片素材庫/站點三/步道入口.jpg",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯，繼續往前走吧",
      },
      {
        type: "notice",
        text: "前往鶯歌石",
      },
      {
        type: "gpscheck",
        text: "請爬到鶯歌石旁，讓我們確認你已經抵達",
        location: {
          lat: 24.95877201729627,
          lng: 121.36043833303971,
          radius: 30,
        },
      },
      {
        type: "line",
        char: "hero",
        text: "哇，這就是鶯歌石！",
        background: "角色照片素材庫/站點三/鶯歌石.jpg",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯，它可是鶯歌很有代表性的地標",
      },
      {
        type: "line",
        char: "hero",
        text: "咦？不過它看起來……好像少了一角？",
      },
      {
        type: "line",
        char: "guide",
        text: "觀察得很仔細！你猜猜看，這一角為什麼會不見呢？",
      },
      {
        type: "question",
        qIndex: 0,
        char: "guide",
        text: "鶯歌石為什麼會少了一截？",
        correctReaction:
          "沒錯，是長期受到風吹、雨淋等自然作用，慢慢風化形成現在的樣子",
      },
      {
        type: "line",
        char: "hero",
        text: "原來不是以前被人打掉的喔！",
      },
      {
        type: "line",
        char: "guide",
        text: "關於鶯歌石，可不只有你眼前看到的這些。",
      },
      {
        type: "line",
        char: "hero",
        text: "難道還有什麼秘密？",
      },
      {
        type: "line",
        char: "guide",
        text: "找找附近的小石碑，也許會有答案",
      },
      {
        type: "notice",
        text: "尋找岩洞旁石碑",
        // 待補：岩洞旁石碑授權照片
      },
      {
        type: "line",
        char: "hero",
        text: "找到了！這上面好像有寫鶯歌石的由來",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯，仔細看看碑文",
      },
      {
        type: "question",
        qIndex: 1,
        char: "guide",
        text: "找到鶯歌石岩洞旁的石碑，仔細觀察碑文碑文中提到，這塊石頭最初為什麼被稱為「鸚哥石」？",
        correctReaction:
          "答對了，因為這顆石頭的形狀像鸚哥，所以早期被稱為「鸚哥石」",
      },
      {
        type: "line",
        char: "hero",
        text: "原來鶯歌石的名字是這樣來的！",
      },
      {
        type: "line",
        char: "guide",
        text: "鶯歌有趣的石頭可不只這一顆。走吧，我們先下山",
      },
      {
        type: "notice",
        text: "先回到一開始的步道入口",
        photo: "角色照片素材庫/站點三/步道入口.jpg",
      },
      {
        type: "line",
        char: "guide",
        text: "先別急著走，你還記得這裡的登山地圖嗎？",
        background: "角色照片素材庫/站點三/步道入口.jpg",
      },
      {
        type: "notice",
        text: "尋找附近有沒有登山步道導覽圖",
        photo: "角色照片素材庫/站點三/導覽地圖.jpg",
      },
      {
        type: "line",
        char: "hero",
        text: "地圖上還藏著什麼嗎？",
      },
      {
        type: "line",
        char: "guide",
        text: "剛才我們看了「鶯歌石」，其實山上還有另一顆特別的「龜公石」",
      },
      {
        type: "line",
        char: "hero",
        text: "龜公石？這名字也太特別了，是因為長得像烏龜嗎？",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！因為外形像烏龜，所以被稱為「龜公石」",
      },
      {
        type: "line",
        char: "guide",
        text: "而且附近有座廟就供奉著這顆龜公石，因此也被稱為「龜公廟」",
      },
      {
        type: "line",
        char: "hero",
        text: "那是哪座廟？",
      },
      {
        type: "line",
        char: "guide",
        text: "在這張登山地圖上，找找看吧！",
      },
      {
        type: "question",
        qIndex: 2,
        char: "guide",
        text: "觀察登山地圖,鶯歌除了「鶯歌石」這顆鳥形巨石外,哪座廟宇因供奉這顆「龜公石」,又被稱為「龜公廟」？",
        correctReaction: "沒錯，是碧龍宮",
        reactionBackground: "角色照片素材庫/站點三/碧龍宮.jpg",
      },
      {
        type: "knowledge",
        title: "碧龍宮",
        text: "鶯歌碧龍宮，全稱鶯山巖碧龍宮，俗稱龜公廟，是位於台灣新北市鶯歌區建德里牛灶坑山的廟宇，建廟原因是供奉一顆狀似龜殼的石頭。",
        photo: "角色照片素材庫/站點三/碧龍宮.jpg",
      },
      {
        type: "line",
        char: "hero",
        text: "那他有什麼民間故事嗎?",
      },
      {
        type: "line",
        char: "guide",
        text: "給你看一張照片，我來告訴你",
      },
      {
        type: "knowledge",
        title: "龜公石",
        text: "早年居民發現一塊帶有龜形紋路的石頭，認為它具有靈性並祭拜祈福。隨著信仰流傳，「龜公石」逐漸成為地方信仰與鶯歌的特色地標",
        photo: "角色照片素材庫/站點三/龜公石.jpg",
      },
      {
        type: "line",
        char: "hero",
        text: "原來龜公石背後還有這樣的故事！",
      },
      {
        type: "line",
        char: "guide",
        text: "鶯歌值得探索的地方還多著呢！",
      },
      {
        type: "line",
        char: "hero",
        text: "那我們繼續出發吧！",
      },
      {
        type: "end",
      },
    ],
    characters: {
      guide: {
        name: "楊嚮導",
        portrait: "角色照片素材庫/角色/楊嚮導.png",
        side: "left",
      },
      hero: {
        name: "小明",
        portrait: "角色照片素材庫/角色/小明.png",
        side: "right",
      },
    },
    address: "孫龍步道內；入口可由中正一路一帶進入",
    location: {
      lat: 24.958025499906736,
      lng: 121.35701852069056,
      radius: 50,
    },
    background: "角色照片素材庫/站點三/孫龍步道.jpg",
  },
  {
    id: 4,
    name: "站點四 尋找老煙囪",
    questions: [
      {
        qtype: "選擇題",
        question: "仔細觀察眼前的老煙囪，它最明顯的外觀特色是什麼？",
        options: ["圓形", "八角形", "四角形", "六角形"],
      },
      {
        qtype: "選擇題",
        question: "鶯歌四角窯主要使用什麼作為燃料？",
        options: ["木材", "天然氣", "煤炭", "瓦斯"],
      },
      {
        qtype: "選擇題",
        question: "鶯歌四角窯改良了傳統窯燒的方式，採用哪一種窯型設計？",
        options: ["直焰式", "平焰式", "倒焰式", "旋焰式"],
      },
      {
        qtype: "選擇題",
        question: "煙囪為何逐漸消失？主要原因是什麼",
        options: [
          "煙囪製造成本太高",
          "陶瓷工廠開始集中於特定區域內，所以被限制",
          "窯爐陸續被改用瓦斯窯取代",
          "排煙造成空氣汙染被禁止使用",
        ],
      },
    ],
    dialogue: [
      {
        type: "line",
        char: "hero",
        text: "這裡怎麼會有一座這麼大的煙囪？",
      },
      {
        type: "line",
        char: "guide",
        text: "這可是以前鶯歌窯場留下來的痕跡先觀察它的外型",
      },
      {
        type: "question",
        qIndex: 0,
        char: "guide",
        text: "仔細觀察眼前的老煙囪，它最明顯的外觀特色是什麼？",
        correctReaction: "四角形，所以也被稱為「四角窯」",
      },
      {
        type: "line",
        char: "hero",
        text: "以前的窯場都長這樣嗎？",
      },
      {
        type: "line",
        char: "guide",
        text: "不一定光是燒窯用的燃料，就有各種不同類型",
      },
      {
        type: "question",
        qIndex: 1,
        char: "guide",
        text: "鶯歌四角窯主要使用什麼作為燃料？",
        correctReaction: "以前主要燒煤炭窯燒時產生的煙氣，就會經由煙囪排出",
      },
      {
        type: "line",
        char: "hero",
        text: "難怪以前的鶯歌會有這麼多煙囪",
      },
      {
        type: "line",
        char: "guide",
        text: "而且當時的窯爐還改良了燒製方式",
      },
      {
        type: "question",
        qIndex: 2,
        char: "guide",
        text: "鶯歌四角窯改良了傳統窯燒的方式，採用哪一種窯型設計？",
        correctReaction:
          "採用「倒焰式」，讓火焰與熱氣流在窯內循環，提高燒製的均勻度",
      },
      {
        type: "line",
        char: "hero",
        text: "那這些煙囪為什麼後來越來越少？",
      },
      {
        type: "line",
        char: "guide",
        text: "因為鶯歌的窯業也開始換新的燒窯方式",
      },
      {
        type: "question",
        qIndex: 3,
        char: "guide",
        text: "煙囪為何逐漸消失？主要原因是什麼？",
        correctReaction:
          "後來窯爐陸續改用瓦斯窯，煤炭窯逐漸減少，煙囪也失去原本的功能",
      },
      {
        type: "line",
        char: "hero",
        text: "只是換了燃料，差別有這麼大嗎？",
      },
      {
        type: "line",
        char: "guide",
        text: "差很多瓦斯窯升溫快，溫度也比較容易精準控制",
      },
      {
        type: "line",
        char: "hero",
        text: "那是不是就不用一直顧著窯？",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯相比煤炭需要耗費大量人力顧窯，瓦斯窯的火候比較均勻，產品不良率也能降低，還能大幅提高產量",
      },
      {
        type: "line",
        char: "hero",
        text: "原來瓦斯窯不只是比較方便，連陶瓷生產的效率都提高了",
      },
      {
        type: "line",
        char: "guide",
        text: "所以從煤炭窯到瓦斯窯，不只是燃料改變，也是鶯歌陶瓷產業走向現代化的一個轉變",
      },
      {
        type: "line",
        char: "hero",
        text: "難怪以前到處看得到的煙囪，現在只剩下少數幾座",
      },
      {
        type: "line",
        char: "guide",
        text: "這座煙囪留下來的，就是那段窯業發展的痕跡",
      },
      {
        type: "line",
        char: "guide",
        text: "走吧，繼續探索其他地方",
      },
      {
        type: "end",
      },
    ],
    characters: {
      guide: {
        name: "楊嚮導",
        portrait: "角色照片素材庫/角色/楊嚮導.png",
        side: "left",
      },
      hero: {
        name: "小明",
        portrait: "角色照片素材庫/角色/小明.png",
        side: "right",
      },
    },
    address: "新北市鶯歌區北鶯里239號",
    location: {
      lat: 24.956125698562957,
      lng: 121.35937340990445,
      radius: 40,
    },
    background: "角色照片素材庫/站點四/合興窯煙囪.jpg",
  },
  {
    id: 5,
    name: "站點五 烘爐窯",
    questions: [
      {
        qtype: "選擇題",
        question:
          "仔細觀察附近古厝的牆面,會發現磚瓦的種類並不完全相同,為什麼一面牆上會出現不同種類的磚瓦？",
        options: [
          "因應不同工匠使用材料的習慣",
          "為了消化窯廠的瑕疵品及節省成本",
          "為了讓牆面更加美觀",
          "住戶刻意要求使用不同時期的磚瓦",
        ],
      },
      {
        qtype: "選擇題",
        question: "過去烘爐窯主要燒製哪一類陶瓷？",
        options: ["藝術陶瓷", "建築用磚瓦", "碗盤等生活器皿", "陶瓷玩偶"],
      },
      {
        qtype: "選擇題",
        question:
          "這座烘爐窯建於日治時期,見證了鶯歌陶業的發展誰在1929年建造了這座烘爐窯？",
        options: ["賴氏人家", "鶯歌政治人物", "賴婆", "陳斐然家族族人"],
      },
      {
        qtype: "複選題",
        question:
          "窯廠燒壞的器皿被打碎掩埋後，後來重新出現在故事巷這些老瓷片被如何再利用？",
        options: [
          "製作新陶器",
          "製作牆面裝飾",
          "鑲嵌於步道路面",
          "製作陶瓷藝術品",
        ],
        multi: true,
      },
    ],
    dialogue: [
      {
        type: "line",
        char: "hero",
        text: "這裡看起來跟剛剛的窯場又不太一樣",
      },
      {
        type: "line",
        char: "guide",
        text: "先看看附近的古厝，你有沒有發現牆面有點特別？",
      },
      {
        type: "line",
        char: "hero",
        text: "磚頭的顏色和樣子，好像不太一樣",
      },
      {
        type: "line",
        char: "guide",
        text: "仔細看，有些磚瓦甚至不是同一種",
      },
      {
        type: "question",
        qIndex: 0,
        char: "guide",
        text: "仔細觀察附近古厝的牆面，會發現磚瓦的種類並不完全相同。為什麼一面牆上會出現不同種類的磚瓦？",
        correctReaction:
          "以前窯廠燒製時，多少會出現瑕疵品這些磚瓦不一定會直接丟掉，有些就拿來蓋房子、砌牆，既能再利用，也能節省材料",
      },
      {
        type: "line",
        char: "hero",
        text: "原來以前的瑕疵品，反而成了現在古厝的一部分",
      },
      {
        type: "line",
        char: "guide",
        text: "這裡的烘爐窯，也和鶯歌以前的生活很有關係",
      },
      {
        type: "question",
        qIndex: 1,
        char: "guide",
        text: "過去烘爐窯主要燒製哪一類陶瓷？",
        correctReaction:
          "烘爐窯主要燒製碗、盤等生活器皿和當時居民的日常生活息息相關",
      },
      {
        type: "line",
        char: "guide",
        text: "而且這座窯本身也有一段歷史",
      },
      {
        type: "question",
        qIndex: 2,
        char: "guide",
        text: "這座烘爐窯建於日治時期，見證了鶯歌陶業的發展。誰在1929年建造了這座烘爐窯？",
        correctReaction: "沒錯，就是賴氏人家",
      },
      {
        type: "knowledge",
        text: "1929年，賴氏人家建造了這座烘爐窯，早期生產磚瓦與烘爐，戰後轉為製作陶器，後來更擴及碗盤與磁磚，見證了鶯歌陶瓷產業的時代轉變",
      },
      {
        type: "line",
        char: "hero",
        text: "原來這座窯已經有這麼久的歷史了",
      },
      {
        type: "line",
        char: "guide",
        text: "不過窯廠留下的不只有這座窯你再看看故事巷裡的地面",
      },
      {
        type: "notice",
        text: "先繼續往前走，探索一下",
      },
      {
        type: "line",
        char: "hero",
        text: "等等，地上這些好像是陶瓷碎片？",
        background: "角色照片素材庫/站點五/故事巷.jpg",
      },
      {
        type: "line",
        char: "guide",
        text: "你猜得沒錯以前窯廠燒壞的器皿，有些會打碎後掩埋後來這些老瓷片又被重新利用，成了故事巷裡的一部分",
      },
      {
        type: "question",
        qIndex: 3,
        char: "guide",
        text: "窯廠燒壞的器皿被打碎掩埋後，後來重新出現在故事巷。這些老瓷片被如何再利用？（複選）",
        correctReaction:
          "沒錯，這些老瓷片被用來製作牆面裝飾，也有些鑲嵌於步道路面",
      },
      {
        type: "line",
        char: "hero",
        text: "被當成廢料的瓷片，現在居然又變成了街道的一部分",
      },
      {
        type: "line",
        char: "guide",
        text: "所以你看到的這些老瓷片，其實也是鶯歌陶業留下來的記憶",
      },
      {
        type: "line",
        char: "hero",
        text: "從古厝的磚瓦，到烘爐窯，再到地上的瓷片，好像到處都找得到以前陶業留下的痕跡",
      },
      {
        type: "line",
        char: "hero",
        text: "一塊不起眼的瓷片，也有一段故事",
      },
      {
        type: "line",
        char: "guide",
        text: "走吧，繼續探索其他地方",
      },
      {
        type: "end",
      },
    ],
    characters: {
      guide: {
        name: "楊嚮導",
        portrait: "角色照片素材庫/角色/楊嚮導.png",
        side: "left",
      },
      hero: {
        name: "小明",
        portrait: "角色照片素材庫/角色/小明.png",
        side: "right",
      },
    },
    address: "新北市鶯歌區東鶯里文化路213巷內",
    location: {
      lat: 24.95353101601439,
      lng: 121.35555712927186,
      radius: 40,
    },
    background: "角色照片素材庫/站點五/烘爐窯.jpg",
  },
  {
    id: 6,
    name: "站點六 益成記",
    questions: [
      {
        qtype: "選擇題",
        question: "益成記窯場是由誰創辦？",
        options: ["吳鞍", "王龜生", "陳斐然", "陳發"],
      },
      {
        qtype: "選擇題",
        question: "益成記被稱為鶯歌的「陶瓷大學」與下列何者無關？",
        options: [
          "曾經是鶯歌製陶技術的重要傳承地",
          "培養過許多很有名的製陶師傅",
          "曾經研發許多生活用陶瓷品",
          "此處在當時是鶯歌重要的陶瓷交易場所",
        ],
      },
      {
        qtype: "選擇題",
        question: "益成記曾引進哪裡的陶藝師傅？",
        options: ["大陸景德鎮", "日本", "大陸福州", "台灣中南部"],
      },
    ],
    dialogue: [
      {
        type: "line",
        char: "hero",
        text: "這裡以前也是窯廠嗎？",
      },
      {
        type: "line",
        char: "guide",
        text: "這裡可是鶯歌以前很知名的窯廠——益成記",
      },
      {
        type: "line",
        char: "guide",
        text: "讓你猜猜，益成記是誰創辦的？",
      },
      {
        type: "question",
        qIndex: 0,
        char: "guide",
        text: "益成記窯場是由誰創辦？",
        correctReaction: "沒錯，就是陳斐然",
      },
      {
        type: "knowledge",
        text: "1924年，陳斐然設立「益成記陶器製造工場」，是早期鶯歌重要的陶瓷窯廠之一",
      },
      {
        type: "line",
        char: "hero",
        text: "原來已經有這麼久的歷史了",
      },
      {
        type: "line",
        char: "guide",
        text: "而且後人還給它一個很特別的稱號",
      },
      {
        type: "line",
        char: "guide",
        text: "曾被稱為鶯歌早期的「陶瓷大學」",
      },
      {
        type: "line",
        char: "hero",
        text: "陶瓷大學？為什麼會有這個稱號？",
      },
      {
        type: "line",
        char: "guide",
        text: "先讓你猜看看，等等再告訴你",
      },
      {
        type: "question",
        qIndex: 1,
        char: "guide",
        text: "益成記被稱為鶯歌的「陶瓷大學」，與下列何者無關？",
        correctReaction: "沒錯，這個稱號跟陶瓷交易沒有關係",
      },
      {
        type: "line",
        char: "guide",
        text: "益成記也是陶藝技術傳承的重要地方，許多師傅曾在這裡學習、研發新的陶瓷用品",
      },
      {
        type: "line",
        char: "hero",
        text: "那這些技術都是鶯歌自己發展出來的嗎？",
      },
      {
        type: "line",
        char: "guide",
        text: "當時還特別從外地請來師傅傳授技術，你猜他們是從哪裡來的？",
      },
      {
        type: "question",
        qIndex: 2,
        char: "guide",
        text: "益成記曾引進哪裡的陶藝師傅？",
        correctReaction: "沒錯，就是福州",
      },
      {
        type: "knowledge",
        text: "益成記曾引進福州的製陶師傅，例如李二妹等人，帶入「手擠坯」（土來走）等製陶技術",
      },
      {
        type: "line",
        char: "guide",
        text: "這些技術讓鶯歌能製作更多樣的陶器，促進了當地陶業的發展",
      },
      {
        type: "line",
        char: "hero",
        text: "益成記不只是生產陶瓷，也把外地的技術帶進鶯歌",
      },
      {
        type: "line",
        char: "guide",
        text: "一座窯廠，也能成為技術交流與傳承的地方",
      },
      {
        type: "line",
        char: "guide",
        text: "走吧，繼續看看鶯歌還留下哪些故事",
      },
      {
        type: "end",
      },
    ],
    characters: {
      guide: {
        name: "楊嚮導",
        portrait: "角色照片素材庫/角色/楊嚮導.png",
        side: "left",
      },
      hero: {
        name: "小明",
        portrait: "角色照片素材庫/角色/小明.png",
        side: "right",
      },
    },
    address: "文化路、現順億窯業一帶",
    location: {
      lat: 24.95355320078445,
      lng: 121.35488296931761,
      radius: 65,
    },
    background: "角色照片素材庫/站點六/益成記.jpg",
  },
  {
    id: 7,
    name: "站點七 大榕樹和窯工聚落遺址",
    questions: [
      {
        qtype: "選擇題",
        question:
          "早期鶯歌文化路有「兩陳一余」三大地主，兩陳家土地廣闊早期兩大家族是以什麼作為土地分界？",
        options: [
          "以道路作為分界",
          "以山脈作為分界",
          "以兩棵大榕樹連成一線作為界線",
          "以溪流作為分界",
        ],
      },
      {
        qtype: "選擇題",
        question:
          "早期鶯歌窯場缺乏工人，為了吸引外地陶工前來工作，窯廠老闆採取了什麼方式？",
        options: [
          "提供免費餐食與住宿",
          "提供土地讓陶工自行蓋房子",
          "提供高薪酬",
          "傳授陶瓷製作技藝當交換",
        ],
      },
      {
        qtype: "選擇題",
        question: "經過幾代人的傳承後，這些百年老屋為什麼還保留著？",
        options: [
          "老屋屋齡太舊，修繕成本太高",
          "土地與房屋產權複雜，難以整合",
          "聚落人口外移，無暇照顧",
          "老屋保存與都市開發產生衝突",
        ],
      },
    ],
    dialogue: [
      {
        type: "line",
        char: "hero",
        text: "這裡有一棵好大的榕樹！",
      },
      {
        type: "line",
        char: "guide",
        text: "你知道嗎？以前這棵榕樹可是很重要的「界線」",
      },
      {
        type: "question",
        qIndex: 0,
        char: "guide",
        text: "早期鶯歌文化路有「兩陳一余」三大地主，兩陳家土地廣闊。早期兩大家族是以什麼作為土地分界？",
        correctReaction: "沒錯，就是以兩棵大榕樹連成一線作為界線",
      },
      {
        type: "line",
        char: "hero",
        text: "原來這兩棵榕樹以前還是土地的分界！",
      },
      {
        type: "line",
        char: "guide",
        text: "當時這一帶大多還是農地後來火車站遷到文化路附近，窯場和工廠陸續興建，也帶來另一個問題——工人不夠",
        background: "角色照片素材庫/站點七/窯工部落.jpg",
      },
      {
        type: "line",
        char: "hero",
        text: "窯廠這麼多，當然需要很多工人吧？",
      },
      {
        type: "line",
        char: "guide",
        text: "所以窯廠老闆開始想辦法吸引外地陶工來工作",
      },
      {
        type: "question",
        qIndex: 1,
        char: "guide",
        text: "早期鶯歌窯場缺乏工人，為了吸引外地陶工前來工作，窯廠老闆採取了什麼方式？",
        correctReaction:
          "窯廠老闆提供土地，讓外地陶工自己蓋房子，連同家人一起住下來，也解決了工人居住的問題",
      },
      {
        type: "line",
        char: "hero",
        text: "原來如此，難怪這裡後來慢慢形成了陶工聚落！",
      },
      {
        type: "line",
        char: "guide",
        text: "這些房子經過幾代人的生活與傳承，有些一直保存到現在，但也延伸出一些問題所在",
      },
      {
        type: "question",
        qIndex: 2,
        char: "guide",
        text: "經過幾代人的傳承後，這些百年老屋為什麼還保留著？",
        correctReaction: "沒錯！其實不只是房子老舊，更大的問題是土地和房屋的產權比較複雜",
      },
      {
        type: "line",
        char: "hero",
        text: "難怪處理起來這麼不容易",
      },
      {
        type: "line",
        char: "guide",
        text: "也因為這些老屋和窯場保存下來，我們現在才能看見早期窯工聚落的樣貌",
      },
      {
        type: "line",
        char: "hero",
        text: "這樣走在這裡，好像真的能想像以前的生活",
      },
      {
        type: "line",
        char: "guide",
        text: "從土地分界、窯場，到工人聚落，都能看見鶯歌陶業發展留下的故事",
      },
      {
        type: "line",
        char: "guide",
        text: "走吧，下一站還有更多鶯歌的故事",
      },
      {
        type: "end",
      },
    ],
    characters: {
      guide: {
        name: "楊嚮導",
        portrait: "角色照片素材庫/角色/楊嚮導.png",
        side: "left",
      },
      hero: {
        name: "小明",
        portrait: "角色照片素材庫/角色/小明.png",
        side: "right",
      },
    },
    location: {
      lat: 24.952784092616902,
      lng: 121.35459372883528,
      radius: 40,
    },
    background: "角色照片素材庫/站點七/榕樹.jpg",
  },
  {
    id: 8,
    name: "站點八 陳映真故居",
    questions: [
      {
        qtype: "選擇題",
        question:
          "陳映真童年在鶯歌生活，身邊有許多陶工、礦工與搬運工這段經歷對他的創作有何影響？",
        options: [
          "讓他對研究工人議題有興趣",
          "讓他對成為工程議題有興趣",
          "使他更能深刻體會勞動階級的生活",
          "讓他對鶯歌文史相關創作有興趣",
        ],
      },
      {
        qtype: "選擇題",
        question: "陳映真創辦《人間》雜誌,主要希望透過報導為什麼發聲？",
        options: [
          "社會各界知名人士",
          "人世間的悲歡離合",
          "社會底層與弱勢族群",
          "人間藝術工作者",
        ],
      },
      {
        qtype: "選擇題",
        question: "下列哪一項曾出現在《山路》小說中所描寫的鶯歌景象？",
        options: [
          "鶯歌石與臺車道",
          "鶯歌老街與陶瓷博物館",
          "鶯歌車站與窯場",
          "汪洋居與益成記",
        ],
      },
    ],
    dialogue: [
      {
        type: "line",
        char: "hero",
        text: "這一站要去哪裡？",
      },
      {
        type: "line",
        char: "guide",
        text: "這次帶你認識一位曾在鶯歌生活過的作家——陳映真",
      },
      {
        type: "line",
        char: "hero",
        text: "作家？他和鶯歌有什麼關係？",
      },
      {
        type: "line",
        char: "guide",
        text: "他童年住在鶯歌時，常看見陶工、礦工和搬運工辛苦工作的身影",
      },
      {
        type: "line",
        char: "hero",
        text: "原來他從小就看見了勞動者生活辛苦的一面",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯，而這些童年所見，也影響了他後來的創作",
      },
      {
        type: "line",
        char: "guide",
        text: "那你覺得，這段經歷帶給他什麼影響？",
      },
      {
        type: "question",
        qIndex: 0,
        char: "guide",
        text: "陳映真童年在鶯歌生活，常看見陶工、礦工與搬運工辛苦工作的身影。這段經歷對他的創作有何影響？",
        correctReaction: "答對了！這些童年經歷，讓他更能體會勞動者的生活與處境",
      },
      {
        type: "line",
        char: "hero",
        text: "所以小時候看到的人和生活，也慢慢影響了他的作品",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！而且他的小說裡，還留下了不少鶯歌的記憶",
      },
      {
        type: "line",
        char: "hero",
        text: "連鶯歌也被寫進小說裡？",
      },
      {
        type: "line",
        char: "guide",
        text: "是啊！在小說《山路》中，就出現過熟悉的鶯歌景象",
      },
      {
        type: "line",
        char: "hero",
        text: "該不會有我們前面去過的地方吧？",
      },
      {
        type: "line",
        char: "guide",
        text: "還記得一路探索過哪些地方嗎？想想看！",
      },
      {
        type: "question",
        qIndex: 2,
        char: "guide",
        text: "下列哪一項曾出現在《山路》小說中所描寫的鶯歌景象？",
        correctReaction: "沒錯！就是「鶯歌石與臺車道」",
      },
      {
        type: "line",
        char: "hero",
        text: "這不就是我們前面走過的地方嗎！",
      },
      {
        type: "line",
        char: "guide",
        text: "對我們來說是探索的風景，對陳映真來說，卻是童年生活的一部分",
      },
      {
        type: "line",
        char: "hero",
        text: "原來我們走過的地方，也成了他筆下的故事",
      },
      {
        type: "line",
        char: "guide",
        text: "而他對人的關心，後來也不只留在小說裡",
      },
      {
        type: "line",
        char: "hero",
        text: "不只小說？他還做了什麼？",
      },
      {
        type: "line",
        char: "guide",
        text: "後來他創辦了《人間》雜誌，用影像和報導記錄真實的社會",
      },
      {
        type: "line",
        char: "hero",
        text: "所以這次不是小說，而是真實發生的故事？",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！而且他特別關注那些平常不容易被看見的人",
      },
      {
        type: "line",
        char: "hero",
        text: "平常不容易被看見的人？是指誰呢？",
      },
      {
        type: "line",
        char: "guide",
        text: "這個答案，就換你自己找找看吧！",
      },
      {
        type: "question",
        qIndex: 1,
        char: "guide",
        text: "陳映真創辦《人間》雜誌，主要希望透過報導為哪些人發聲？",
        correctReaction: "答對了！《人間》關注社會底層與弱勢族群，讓許多不容易被看見的聲音受到關注",
      },
      {
        type: "knowledge",
        title: "《人間》雜誌",
        text: "1985年創刊，以影像與報導記錄真實社會，關注弱勢、族群與社會議題，也在臺灣社會變遷的年代留下重要紀錄",
      },
      {
        type: "line",
        char: "hero",
        text: "原來從小說到雜誌，他一直都很關心人的生活",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯，這份關懷也和他童年在鶯歌看到的人與生活，有著很深的關係",
      },
      {
        type: "line",
        char: "hero",
        text: "這樣一路聽下來，好像更能理解他為什麼這麼關心人的生活了",
      },
      {
        type: "line",
        char: "guide",
        text: "是啊！童年在鶯歌看到的人、生活和風景，都成為他生命中的重要記憶",
      },
      {
        type: "line",
        char: "hero",
        text: "原來認識一個地方，不只是看建築和風景，也是在認識曾經生活在這裡的人",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯，這也是我們一路探索鶯歌想找到的故事",
      },
      {
        type: "end",
      },
    ],
    characters: {
      guide: {
        name: "楊嚮導",
        portrait: "角色照片素材庫/角色/楊嚮導.png",
        side: "left",
      },
      hero: {
        name: "小明",
        portrait: "角色照片素材庫/角色/小明.png",
        side: "right",
      },
    },
    address: "新北市鶯歌區東鶯里文化路221號",
    location: {
      lat: 24.953384573507492,
      lng: 121.35443331698151,
      radius: 65,
    },
    background: "角色照片素材庫/站點八/陳映真故居.jpg",
  },
  {
    id: 9,
    name: "站點九 鶯歌福興宮",
    questions: [
      {
        qtype: "選擇題",
        question: "仔細觀察福興宮,你會發現有什麼特別之處?",
        options: [
          "廟中廟建築",
          "日治時期仿巴洛克式建築",
          "子母廟建築",
          "石頭厝建築",
        ],
      },
      {
        qtype: "選擇題",
        question:
          "傳說陶神羅文擅長「手作」陶，弟弟羅明擅長「車製」陶請問現代那種製陶手法比較接近「車製」方式呢？",
        options: [
          "陶瓷模型製作",
          "福州手擠陶坯製作",
          "純手捏塑陶土製作",
          "手拉坏製作",
        ],
      },
      {
        qtype: "選擇題",
        question: "鶯歌窯場過去會在福興宮祭拜陶神羅明羅明的誕辰是哪一天？",
        options: [
          "農曆三月十五日",
          "農曆六月六日",
          "農曆九月九日",
          "農曆九月十五日",
        ],
      },
    ],
    dialogue: [
      {
        type: "line",
        char: "hero",
        text: "咦？這次要探索的是一間廟嗎？",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！這裡是福興宮，不過它和一般廟宇有點不一樣。",
      },
      {
        type: "line",
        char: "hero",
        text: "有什麼特別的地方嗎？",
      },
      {
        type: "line",
        char: "guide",
        text: "仔細看看眼前的福興宮，你能發現它特別的地方嗎？",
      },
      {
        type: "question",
        qIndex: 0,
        char: "guide",
        text: "仔細觀察福興宮，你會發現有什麼特別之處？",
        correctReaction: "答對了！福興宮最特別的，就是「廟中廟」的建築格局。",
      },
      {
        type: "line",
        char: "hero",
        text: "難怪看起來像一座廟裡，還留著另一座廟！",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！不過福興宮特別的，可不只有建築。",
      },
      {
        type: "line",
        char: "hero",
        text: "還有什麼？",
      },
      {
        type: "line",
        char: "guide",
        text: "它和以前鶯歌製陶人家的生活，也有很深的關係。",
      },
      {
        type: "line",
        char: "guide",
        text: "以前燒窯不像現在這麼穩定，陶器燒得成不成功，要等開窯才知道。",
      },
      {
        type: "line",
        char: "hero",
        text: "那辛苦做了這麼久，也有可能整窯失敗？",
      },
      {
        type: "line",
        char: "guide",
        text: "是啊！所以製陶人家遇到困難時，常會來福興宮祈求燒窯、生意順利。",
      },
      {
        type: "line",
        char: "hero",
        text: "所以他們來福興宮，都是拜土地公嗎？",
      },
      {
        type: "line",
        char: "guide",
        text: "不只喔！這裡還奉祀著製陶人家崇敬的羅明先師。",
      },
      {
        type: "line",
        char: "hero",
        text: "羅明先師？他和製陶也有關？",
      },
      {
        type: "line",
        char: "guide",
        text: "相傳羅文、羅明兄弟都擅長製陶，只是兩人的方法不太一樣。",
      },
      {
        type: "line",
        char: "hero",
        text: "有什麼不同？",
      },
      {
        type: "line",
        char: "guide",
        text: "傳說羅文擅長「手作」，弟弟羅明則擅長「車製」。",
      },
      {
        type: "line",
        char: "hero",
        text: "「車製」聽起來好像跟轉動陶土有關？",
      },
      {
        type: "line",
        char: "guide",
        text: "很接近！那你猜猜，現代哪種製陶方式最接近「車製」？",
      },
      {
        type: "question",
        qIndex: 1,
        char: "guide",
        text: "傳說陶神羅文擅長「手作」陶，弟弟羅明擅長「車製」陶。請問現代哪種製陶手法比較接近「車製」？",
        correctReaction: "答對了！就是「手拉坯」。",
      },
      {
        type: "line",
        char: "hero",
        text: "原來以前的「車製」，到現在還能看到類似的製陶方式。",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！而羅明先師也因此成為鶯歌製陶人家重要的信仰之一。",
      },
      {
        type: "line",
        char: "hero",
        text: "那以前的窯工會特別祭拜羅明先師嗎？",
      },
      {
        type: "line",
        char: "guide",
        text: "會啊！以前還有羅明先師神明會，每年會在特定的日子舉行慶典。",
      },
      {
        type: "line",
        char: "hero",
        text: "還有專門的慶典？",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！考考你，羅明先師的聖誕慶典是哪一天？",
      },
      {
        type: "question",
        qIndex: 2,
        char: "guide",
        text: "過去鶯歌窯場會祭拜陶神羅明，羅明先師的聖誕慶典是在農曆哪一天？",
        correctReaction: "答對了！就是農曆九月九日。",
      },
      {
        type: "line",
        char: "hero",
        text: "沒想到這一天對製陶人這麼重要！",
      },
      {
        type: "line",
        char: "guide",
        text: "而且當時還有一項很特別的傳統。",
      },
      {
        type: "line",
        char: "hero",
        text: "聽起來很有意思，是什麼呢？",
      },
      {
        type: "line",
        char: "guide",
        text: "他們會擲筊選出下一年的「爐主」，負責慶典與祭祀。",
      },
      {
        type: "knowledge",
        title: "羅明先師神明會",
        text: "過去窯場老闆與師傅會組成羅明先師神明會，每逢農曆九月九日舉行慶典，並擲筊選出下一年度的爐主。爐主還能將羅明先師迎回家中供奉一年。",
      },
      {
        type: "line",
        char: "hero",
        text: "原本以為只是一座廟，沒想到還藏著這麼多製陶人的故事。",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！這也是鶯歌陶瓷文化很重要的一部分。",
      },
      {
        type: "line",
        char: "guide",
        text: "還有更多故事等著我們呢，走吧！",
      },
      {
        type: "end",
      },
    ],
    characters: {
      guide: {
        name: "楊嚮導",
        portrait: "角色照片素材庫/角色/楊嚮導.png",
        side: "left",
      },
      hero: {
        name: "小明",
        portrait: "角色照片素材庫/角色/小明.png",
        side: "right",
      },
    },
    address: "新北市鶯歌區中正二路63號",
    location: {
      lat: 24.9508,
      lng: 121.3508,
      radius: 40,
    },
    background: "角色照片素材庫/站點九/福興宮.jpg",
  },
  {
    id: 10,
    name: "站點十 鶯歌老街-古早窯",
    questions: [
      {
        qtype: "選擇題",
        question: "走進「古早窯」，他是屬於哪一種窯種？",
        options: ["蛇窯", "登窯", "四角窯", "隧道窯"],
      },
      {
        qtype: "選擇題",
        question: "古早窯主要是生產哪些產品？",
        options: ["碗盤與茶具", "磁磚(馬賽克)", "花器與陶甕", "工業用磁器"],
      },
      {
        qtype: "選擇題",
        question: "隧道窯燒製時,工人是如何將成品運送進出窯爐呢？",
        options: [
          "人力搬運",
          "用鐵鈎勾窯車方式進出",
          "用台車一節接一節依序運送",
          "以輸送帶傳動運送",
        ],
      },
      {
        qtype: "選擇題",
        question: "隧道窯引進臺灣後，為提升燒製效率，燃料後來改用什麼？",
        options: ["木柴", "柴油", "重油", "天然氣"],
      },
    ],
    dialogue: [
      {
        type: "line",
        char: "hero",
        text: "這裡就是古早窯嗎？看起來好長喔！",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！不過你知道眼前這座是什麼窯嗎？",
      },
      {
        type: "line",
        char: "hero",
        text: "光看外表還真的看不出來。",
      },
      {
        type: "line",
        char: "guide",
        text: "那就走進去看看吧！裡面的告示牌藏著答案。",
      },
      {
        type: "notice",
        text: "走進古早窯，尋找介紹告示牌",
      },
      {
        type: "question",
        qIndex: 0,
        char: "guide",
        text: "觀察窯內的告示牌，「古早窯」屬於哪一種窯？",
        correctReaction: "找到了！這就是「隧道窯」。",
      },
      {
        type: "line",
        char: "hero",
        text: "難怪這麼長，真的就像一條隧道！",
      },
      {
        type: "line",
        char: "guide",
        text: "以前這座窯可是用來生產陶瓷的。",
      },
      {
        type: "line",
        char: "hero",
        text: "那這裡以前主要燒什麼？",
      },
      {
        type: "line",
        char: "guide",
        text: "答案就在附近，找找看窯裡留下了什麼。",
      },
      {
        type: "notice",
        text: "觀察隧道窯內留下的物品",
      },
      {
        type: "question",
        qIndex: 1,
        char: "guide",
        text: "根據窯內留下的線索，古早窯過去主要生產哪一類產品？",
        correctReaction: "答對了！以前這裡主要生產磁磚，也就是常見的馬賽克。",
      },
      {
        type: "line",
        char: "hero",
        text: "原來我剛才看到的，就是以前在這裡燒製的產品！",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！不過窯這麼長，這麼多產品要怎麼送進去呢？",
      },
      {
        type: "line",
        char: "hero",
        text: "總不會一件一件搬吧？",
      },
      {
        type: "line",
        char: "guide",
        text: "當然不是，來猜猜以前的工人怎麼做。",
      },
      {
        type: "question",
        qIndex: 2,
        char: "guide",
        text: "隧道窯燒製時，工人如何將產品運送進出窯爐？",
        correctReaction: "沒錯！產品會放在窯車上，一節接著一節送進窯裡。",
      },
      {
        type: "line",
        char: "hero",
        text: "原來是讓整台窯車慢慢通過！",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！這樣就能讓產品依序進入窯內燒製。",
      },
      {
        type: "knowledge",
        title: "像生產線一樣的窯",
        text: "隧道窯就像一條長長的生產線，產品隨著窯車依序通過不同的燒製區域，讓燒製能持續進行，也更適合大量生產。",
      },
      {
        type: "line",
        char: "hero",
        text: "原來隧道窯的運作方式這麼有意思。",
      },
      {
        type: "line",
        char: "guide",
        text: "而且不只運送方式改變，後來連燒窯使用的燃料也變了。",
      },
      {
        type: "line",
        char: "hero",
        text: "那後來改用什麼燃料？",
      },
      {
        type: "line",
        char: "guide",
        text: "最後再來看看你能不能答對！",
      },
      {
        type: "question",
        qIndex: 3,
        char: "guide",
        text: "隧道窯引進臺灣後，為提升燒製效率，燃料後來改用什麼？",
        correctReaction: "答對了！後來改用重油，讓隧道窯的燒製更有效率。",
      },
      {
        type: "line",
        char: "hero",
        text: "原來窯爐、運送方式和燃料，都會隨著時代改變。",
      },
      {
        type: "line",
        char: "guide",
        text: "沒錯！這些變化，也留下了鶯歌陶瓷產業發展的痕跡。",
      },
      {
        type: "line",
        char: "hero",
        text: "剛進來時只覺得這座窯很長，現在終於知道它以前怎麼運作了。",
      },
      {
        type: "line",
        char: "guide",
        text: "有些老地方，看起來安安靜靜，其實都藏著以前忙碌的故事。",
      },
      {
        type: "line",
        char: "hero",
        text: "看來鶯歌還有很多地方值得去找找看。",
      },
      {
        type: "line",
        char: "guide",
        text: "當然！走吧，繼續探索其他地方！",
      },
      {
        type: "end",
      },
    ],
    characters: {
      guide: {
        name: "楊嚮導",
        portrait: "角色照片素材庫/角色/楊嚮導.png",
        side: "left",
      },
      hero: {
        name: "小明",
        portrait: "角色照片素材庫/角色/小明.png",
        side: "right",
      },
    },
    address: "新北市鶯歌區重慶街65之1號",
    location: {
      lat: 24.9516,
      lng: 121.3505,
      radius: 35,
    },
    background: "角色照片素材庫/站點十/古早窯.jpg",
  },
];
