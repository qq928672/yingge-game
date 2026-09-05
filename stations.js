const STATIONS = [
  {
    "id": 1,
    "name": "站點一 鶯歌車站的時光線索",
    "icon": "🚆",
    "questions": [
      {
        "qtype": "選擇題",
        "question": "仔細觀察鶯歌火車站的鐵道，你能數出幾條軌道？",
        "options": [
          "6條",
          "8條",
          "10條",
          "12條"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "抬頭看看車站最上方，兩個相望的動物造型是什麼？",
        "options": [
          "魚",
          "貓",
          "狗",
          "鳥"
        ],
        "fact": "鶯歌車站牆面頂端的「兩隻鳥相望」設計，源自於在地著名的「鶯歌石」與三峽「鳶山」的民間傳說"
      },
      {
        "qtype": "選擇題",
        "question": "你知道當時鶯歌車站主要轉運哪一種礦產嗎？",
        "options": [
          "金礦",
          "鐵礦",
          "煤礦",
          "石灰石"
        ],
        "fact": ""
      },
      {
        "qtype": "選擇題",
        "question": "請問鶯歌車站最早的站名是什麼？",
        "options": [
          "鷹哥石驛",
          "鶯歌石驛",
          "鷹哥驛",
          "鶯歌驛"
        ],
        "fact": "鶯歌車站最初稱為「鶯歌石驛」，得名自鄰近的鶯歌石地標，後來才逐漸簡化成現在的「鶯歌」站名"
      }
    ],
    "dialogue": [
      {
        "type": "line",
        "char": "guide",
        "text": "小明，這裡就是鶯歌車站以前來過嗎？"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "第一次來鶯歌，之前只有經過，還真的沒仔細看過車站"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "那先別急著往前走，跟我過來"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "你先往下看看"
      },
      {
        "type": "question",
        "qIndex": 0,
        "char": "guide",
        "text": "數數看，現在這裡一共有幾條軌道？",
        "correctReaction": "沒錯！但其實以前這附近跟現在很不一樣",
        "wrongHints": [
          "再靠近一點看，別漏數了最外側那一條……",
          "試著用手指一條一條數過去，仔細一點"
        ]
      },
      {
        "type": "line",
        "char": "hero",
        "text": "怎麼說？我想聽看看!"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "我以前就住這附近，當時只要風大一點，火車前後站西北側住家餐桌上菜餚必定蒙上一層煤灰"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "有時一頓飯還沒吃完，湯上已浮上一層厚厚的煤灰呢"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "那時候鐵路不只是載人，也跟附近的礦業有很大的關係"
      },
      {
        "type": "question",
        "qIndex": 2,
        "char": "guide",
        "text": "你知道當時鶯歌車站主要轉運哪一種礦產嗎？",
        "correctReaction": "沒錯，就是煤礦",
        "wrongHints": [
          "想想看，那個年代窯場燒陶，最需要什麼來生火？"
        ]
      },
      {
        "type": "line",
        "char": "guide",
        "text": "以前三峽、大溪盛產煤礦，採出的煤都會送到鶯歌車站，再搭火車運往全台"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "鶯歌的煤礦和陶瓷生意越來越興盛，車站也曾是全台貨運量第二大的大站！"
      },
      {
        "type": "notice",
        "text": "請前往一樓前站廣場"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "剛剛一直看軌道，現在換你看看車站本身"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "看車站？是要觀察些什麼？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "往上抬頭看看，觀察建築物的外觀有沒有特別的地方？"
      },
      {
        "type": "question",
        "qIndex": 1,
        "char": "guide",
        "text": "抬頭看看車站最上方，兩個相望的動物造型是什麼？",
        "correctReaction": "沒錯，就是那兩隻鳥",
        "wrongHints": [
          "再看清楚一點，牠們有翅膀會飛..."
        ]
      },
      {
        "type": "line",
        "char": "guide",
        "text": "既然已經找到這個了，那我們再來猜一個"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "猜猜看，這個地方以前叫什麼名字？"
      },
      {
        "type": "question",
        "qIndex": 3,
        "char": "guide",
        "text": "請問鶯歌車站最早的站名是什麼？",
        "correctReaction": "沒錯，就是「鶯歌石驛」",
        "wrongHints": [
          "再想想，那是一個更古老、更貼近地形的名字……"
        ]
      },
      {
        "type": "photo",
        "char": "guide",
        "text": "（楊嚮導從口袋裡拿出一張老照片，遞給小明看）",
        "photo": "角色照片素材庫/站點一/鶯歌舊車站.jpg",
        "caption": "鶯歌車站舊照"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "鶯歌車站最早於1901年（明治34年）8月25日設站，當時命名為鶯歌石驛（早期也曾稱鶯歌石乘降場或停車場）"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來「鶯歌石驛」是這樣來的"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "所以你現在看到的這座車站，其實也藏著不少以前的故事"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "走吧，這才剛開始"
      },
      {
        "type": "end"
      }
    ],
    "background": "角色照片素材庫/站點一/台鐵鶯歌火車站.jpg",
    "characters": {
      "guide": {
        "name": "楊嚮導",
        "portrait": "角色照片素材庫/角色/楊嚮導.png",
        "side": "left"
      },
      "hero": {
        "name": "小明",
        "portrait": "角色照片素材庫/角色/小明.png",
        "side": "right"
      }
    },
    "address": "新北市鶯歌區文化路68號",
    "location": {
      "lat": 24.95457,
      "lng": 121.35515,
      "radius": 40
    }
  },
  {
    "id": 2,
    "name": "站點二走進市拿陶藝",
    "questions": [
      {
        "qtype": "選擇題",
        "question": "市拿陶藝的創辦人是誰？",
        "options": [
          "許明徹",
          "許自然",
          "許元和",
          "許元國"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "「市拿」這個名字有什麼特別的意涵？",
        "options": [
          "鶯歌的古地名",
          "一種傳統製陶方法",
          "與英文China有關",
          "取自早期原住民語意"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "你知道市拿陶藝早期生產最有名的是哪一類陶瓷？",
        "options": [
          "日用陶瓷",
          "建築陶瓷",
          "仿古藝術陶瓷",
          "工業陶瓷"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "早期鶯歌窯場常以煤炭燒窯，黑煙曾是街區常見的景象，後來窯業逐漸改用較乾淨的能源，這項改變主要是引進了哪種能源？",
        "options": [
          "汽油",
          "天然氣",
          "電力",
          "柴油"
        ]
      }
    ],
    "dialogue": [
      {
        "type": "line",
        "char": "guide",
        "text": "到了 這裡就是市拿陶藝"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "市拿陶藝？名字還滿特別的。"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "這間工坊在鶯歌陶瓷發展上，可是大有來頭"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "先考考你，你知道它是誰創辦的嗎？"
      },
      {
        "type": "question",
        "qIndex": 0,
        "char": "guide",
        "text": "市拿陶藝的創辦人是誰？",
        "correctReaction": "市拿陶藝是由許自然於1972年在新北市鶯歌區創立"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來市拿陶藝有這麼久的歷史了"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "不過你有沒有覺得「市拿」這個名字很特別？"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "我剛剛就想問了，「市拿」到底是什麼意思？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "你猜猜看，它有什麼特別的意涵？"
      },
      {
        "type": "question",
        "qIndex": 1,
        "char": "guide",
        "text": "「市拿」這個名字有什麼特別的意涵？",
        "correctReaction": "「市拿」這個名字和英文China有關，也讓人聯想到瓷器"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來背後還有這樣的故事"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "以前鶯歌的陶窯很多，做出來的陶瓷也各有不同你知道市拿陶藝早期生產最有名的是哪一類陶瓷嗎？"
      },
      {
        "type": "question",
        "qIndex": 2,
        "char": "guide",
        "text": "市拿陶藝早期生產最有名的是哪一類陶瓷？",
        "correctReaction": "答對了市拿陶瓷以仿製元、明、清瓷器精品聞名"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "運用青花、粉彩、鬥彩、釉裡紅等傳統彩繪技法，因此也被稱為專門製作仿古瓷器的「現代官窯」"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來這些作品還曾經被用來贈送外賓"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "市拿陶瓷不只保存了傳統技藝，也培養了許多鶯歌的陶瓷彩繪人才，為鶯歌後來的陶瓷發展打下重要基礎"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "說到以前的鶯歌，我生活在這裡的時候，常常看到窯場冒出黑煙，空氣裡也總是飄著煤灰"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "不過隨著時代改變，鶯歌的窯場也開始改用新的能源燒窯。"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "你知道後來主要引進了哪一種能源嗎？"
      },
      {
        "type": "question",
        "qIndex": 3,
        "char": "guide",
        "text": "早期鶯歌窯場常以煤炭燒窯，黑煙曾是街區常見的景象後來窯業逐漸改用較乾淨的能源，這項改變主要是引進了哪種能源？",
        "correctReaction": "1968年，許自然擔任「臺灣區陶瓷工業同業公會」理事長，任內積極爭取將瓦斯管線鋪設到鶯歌"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來他不只創辦了市拿陶藝，也推動了鶯歌窯業的改變"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "1970年鶯歌開始有瓦斯管線後，窯場便有機會改用天然氣燒製，從煤炭窯逐步提升到梭子窯，也就是瓦斯窯"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "這樣不只能減少黑煙，還能讓陶瓷燒製得更好嗎？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "天然氣改善空氣污染，也讓陶瓷產品更多樣，帶動產業革新與就業機會"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "從火車、煤礦，到陶窯，慢慢串起來了"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "這就是鶯歌有趣的地方"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "那我繼續來去其他地方探索"
      },
      {
        "type": "end"
      }
    ],
    "characters": {
      "guide": {
        "name": "楊嚮導",
        "portrait": "角色照片素材庫/角色/楊嚮導.png",
        "side": "left"
      },
      "hero": {
        "name": "小明",
        "portrait": "角色照片素材庫/角色/小明.png",
        "side": "right"
      }
    },
    "address": "新北市鶯歌區中正一路223巷19號",
    "location": {
      "lat": 24.9584,
      "lng": 121.3547,
      "radius": 50
    }
  },
  {
    "id": 3,
    "name": "站點三鶯歌石",
    "questions": [
      {
        "qtype": "選擇題",
        "question": "傳說中，鶯歌石為什麼會少了一截？",
        "options": [
          "巨石曾被山崩掩埋而成",
          "鄭成功下令開砲，轟斷了巨鳥的頭部",
          "後人開採造成缺口",
          "長年風吹雨淋自然風化"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "找到鶯歌石岩洞旁的石碑，仔細觀察碑文碑文中提到，這塊石頭最初為什麼被稱為「鸚哥石」？",
        "options": [
          "附近曾有許多鸚哥",
          "石頭形狀像鸚哥",
          "傳說鸚哥住在洞裡",
          "因為鄭成功曾在此養鸚哥"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "觀察登山地圖,鶯歌除了「鶯歌石」這顆鳥形巨石外,哪座廟宇因供奉這顆「龜公石」,又被稱為「龜公廟」？",
        "options": [
          "妙善宮",
          "宏德宮",
          "碧龍宮",
          "福德宮"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "現在的孫龍步道是一條登山步道,但在百年前這裡曾經有另一種用途,你知道孫龍步道的前身是什麼嗎？",
        "options": [
          "運送陶土的道路",
          "採礦台車行駛的輕便鐵道",
          "軍事運輸道路",
          "茶葉運輸道路"
        ]
      }
    ],
    "dialogue": [
      {
        "type": "line",
        "char": "hero",
        "text": "我們現在要去哪裡？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "今天要帶你去找一個鶯歌很有名的地方——鶯歌石"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "鶯歌石？就是那顆很大的石頭嗎？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "沒錯不過在找到它之前，先跟我走一段"
      },
      {
        "type": "notice",
        "text": "沿著孫龍步道前進"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "有沒有看到，前面有一輛台車？"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "這裡居然還保留著"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "那麼我就考考你，要仔細看看解說牌"
      },
      {
        "type": "question",
        "qIndex": 3,
        "char": "guide",
        "text": "現在的孫龍步道是一條登山步道,但在百年前這裡曾經有另一種用途,你知道孫龍步道的前身是什麼嗎？",
        "correctReaction": "沒錯，這裡以前是採礦台車行駛的輕便鐵道"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "當時鶯歌山區礦業發展興盛，這條輕便道主要用來運送煤炭與物資"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "隨著礦業沒落，舊有的鐵道與台車道失去了運輸功能，於是政府改建為鋪設完善的磚石路與柏油路，成為坡度和緩的健行與賞景步道"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來我們現在走的步道，以前是礦區的運輸路線"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "對跟著這條路走下去，我們就要接近鶯歌石的登山處"
      },
      {
        "type": "notice",
        "text": "前往鶯歌石登山口"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "所以要從這裡爬上去，就是去鶯歌石的路？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "沒錯，繼續往前走吧"
      },
      {
        "type": "notice",
        "text": "前往鶯歌石"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "哇，這就是鶯歌石！"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "對，這顆石頭可是鶯歌很有代表性的地標"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "不過……你不覺得它好像少了一截嗎？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "眼睛不錯你猜猜看，為什麼會少一截？"
      },
      {
        "type": "question",
        "qIndex": 0,
        "char": "guide",
        "text": "鶯歌石為什麼會少了一截？",
        "correctReaction": "沒錯，是長期受到風吹、雨淋等自然作用，慢慢風化形成現在的樣子"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來不是以前被人打斷的喔"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "這顆石頭也流傳著不少傳說，不過現場其實還有一個小線索可以找"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "什麼線索？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "看看鶯歌石旁邊，找找看有沒有一座小石碑"
      },
      {
        "type": "notice",
        "text": "尋找岩洞旁石碑"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "找到了！這上面好像有寫鶯歌石的由來"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "沒錯，仔細看看碑文"
      },
      {
        "type": "question",
        "qIndex": 1,
        "char": "guide",
        "text": "找到鶯歌石岩洞旁的石碑，仔細觀察碑文碑文中提到，這塊石頭最初為什麼被稱為「鸚哥石」？",
        "correctReaction": "答對了，因為這顆石頭的形狀像鸚哥，所以早期被稱為「鸚哥石」"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "今天好像一直在找線索"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "這才有趣啊走吧，我們先下山"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "終於下山了"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "先別急著走，你再看看這張登山地圖"
      },
      {
        "type": "photo",
        "char": "guide",
        "text": "（楊嚮導拿出一張登山地圖）",
        "photo": "角色照片素材庫/站點三/鶯歌登山地圖.jpg",
        "caption": "鶯歌登山步道地圖"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "這張地圖要找什麼？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "剛剛我們找到了鶯歌石，現在換你找找看地圖上的另一個特別地標"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "另一顆石頭？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "沒錯，是「龜公石」因為供奉這顆石頭，又被叫做「龜公廟」"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "來從地圖上找找看"
      },
      {
        "type": "question",
        "qIndex": 2,
        "char": "guide",
        "text": "觀察登山地圖,鶯歌除了「鶯歌石」這顆鳥形巨石外,哪座廟宇因供奉這顆「龜公石」,又被稱為「龜公廟」？",
        "correctReaction": "沒錯，是碧龍宮"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來是碧龍宮"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "但我有個疑問，為什麼會這樣叫？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "這就跟廟裡供奉的「龜公石」有關。相傳以前有曾姓父子在樹下發現一顆奇石，看起來很像一隻烏龜，上面還有八卦的紋路"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "所以他們就把這顆石頭帶回去供奉？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "一開始是曾父覺得這顆石頭很有靈性，所以對著它膜拜祈禱沒想到原本久病的身體，後來真的痊癒了"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "這樣一來，他們應該更相信這顆石頭了吧？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "為了感謝龜石，曾氏父子後來建廟供奉，也就慢慢有了「龜公廟」這個稱呼"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來一顆石頭，還能變成地方上的信仰"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "對啊你看，今天一路從礦業、輕便鐵道走到鶯歌石，現在又看到龜公石，其實每個地方都有自己的故事"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "走吧，還有更多鶯歌的故事等著你發現"
      },
      {
        "type": "end"
      }
    ],
    "characters": {
      "guide": {
        "name": "楊嚮導",
        "portrait": "角色照片素材庫/角色/楊嚮導.png",
        "side": "left"
      },
      "hero": {
        "name": "小明",
        "portrait": "角色照片素材庫/角色/小明.png",
        "side": "right"
      }
    },
    "address": "孫龍步道內；入口可由中正一路一帶進入",
    "location": {
      "lat": 24.95903,
      "lng": 121.35938,
      "radius": 50
    }
  },
  {
    "id": 4,
    "name": "站點四尋找老煙囪",
    "questions": [
      {
        "qtype": "選擇題",
        "question": "仔細觀察眼前的老煙囪，它最明顯的外觀特色是什麼？",
        "options": [
          "圓形",
          "八角形",
          "四角形",
          "六角形"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "鶯歌四角窯主要使用什麼作為燃料？",
        "options": [
          "木材",
          "天然氣",
          "煤炭",
          "瓦斯"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "鶯歌四角窯改良了傳統窯燒的方式，採用哪一種窯型設計？",
        "options": [
          "直焰式",
          "平焰式",
          "倒焰式",
          "旋焰式"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "煙囪為何逐漸消失？主要原因是什麼",
        "options": [
          "煙囪製造成本太高",
          "陶瓷工廠開始集中於特定區域內，所以被限制",
          "窯爐陸續被改用瓦斯窯取代",
          "排煙造成空氣汙染被禁止使用"
        ]
      }
    ],
    "dialogue": [
      {
        "type": "line",
        "char": "hero",
        "text": "這裡怎麼會有兩座這麼大的煙囪？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "這可是以前鶯歌窯場留下來的痕跡先觀察它的外型"
      },
      {
        "type": "question",
        "qIndex": 0,
        "char": "guide",
        "text": "仔細觀察眼前的老煙囪，它最明顯的外觀特色是什麼？",
        "correctReaction": "四角形，所以也被稱為「四角窯」"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "以前的窯場都長這樣嗎？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "不一定光是燒窯用的燃料，就有各種不同類型"
      },
      {
        "type": "question",
        "qIndex": 1,
        "char": "guide",
        "text": "鶯歌四角窯主要使用什麼作為燃料？",
        "correctReaction": "以前主要燒煤炭窯燒時產生的煙氣，就會經由煙囪排出"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "難怪以前的鶯歌會有這麼多煙囪"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "而且當時的窯爐還改良了燒製方式"
      },
      {
        "type": "question",
        "qIndex": 2,
        "char": "guide",
        "text": "鶯歌四角窯改良了傳統窯燒的方式，採用哪一種窯型設計？",
        "correctReaction": "採用「倒焰式」，讓火焰與熱氣流在窯內循環，提高燒製的均勻度"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "那這些煙囪為什麼後來越來越少？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "因為鶯歌的窯業也開始換新的燒窯方式"
      },
      {
        "type": "question",
        "qIndex": 3,
        "char": "guide",
        "text": "煙囪為何逐漸消失？主要原因是什麼？",
        "correctReaction": "後來窯爐陸續改用瓦斯窯，煤炭窯逐漸減少，煙囪也慢慢失去原本的功能"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "只是換了燃料，差別有這麼大嗎？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "差很多瓦斯窯升溫快，溫度也比較容易精準控制"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "那是不是就不用一直顧著窯？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "沒錯相比煤炭需要耗費大量人力顧窯，瓦斯窯的火候比較均勻，產品不良率也能降低，還能大幅提高產量"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來瓦斯窯不只是比較方便，連陶瓷生產的效率都提高了"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "所以從煤炭窯到瓦斯窯，不只是燃料改變，也是鶯歌陶瓷產業走向現代化的一個轉變"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "難怪以前到處看得到的煙囪，現在只剩下少數幾座"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "這座煙囪留下來的，就是那段窯業發展的痕跡"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "走吧，繼續探索其他地方"
      },
      {
        "type": "end"
      }
    ],
    "characters": {
      "guide": {
        "name": "楊嚮導",
        "portrait": "角色照片素材庫/角色/楊嚮導.png",
        "side": "left"
      },
      "hero": {
        "name": "小明",
        "portrait": "角色照片素材庫/角色/小明.png",
        "side": "right"
      }
    },
    "address": "新北市鶯歌區文化路71之2號",
    "location": {
      "lat": 24.95602,
      "lng": 121.35817,
      "radius": 40
    }
  },
  {
    "id": 5,
    "name": "站點五烘爐窯",
    "questions": [
      {
        "qtype": "選擇題",
        "question": "仔細觀察附近古厝的牆面,會發現磚瓦的種類並不完全相同,為什麼一面牆上會出現不同種類的磚瓦？",
        "options": [
          "因應不同工匠使用材料的習慣",
          "為了消化窯廠的瑕疵品及節省成本",
          "為了讓牆面更加美觀",
          "住戶刻意要求使用不同時期的磚瓦"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "過去烘爐窯主要燒製哪一類陶瓷？",
        "options": [
          "藝術陶瓷",
          "建築用磚瓦",
          "碗盤等生活器皿",
          "陶瓷玩偶"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "這座烘爐窯建於日治時期,見證了鶯歌陶業的發展誰在1929年建造了這座烘爐窯？",
        "options": [
          "賴氏人家",
          "鶯歌政治人物",
          "賴婆",
          "陳斐然家族族人"
        ]
      },
      {
        "qtype": "複選題",
        "question": "窯廠燒壞的器皿被打碎掩埋後，後來重新出現在故事巷這些老瓷片被如何再利用？",
        "options": [
          "製作新陶器",
          "製作牆面裝飾",
          "鑲嵌於步道路面",
          "製作陶瓷藝術品"
        ],
        "multi": true
      }
    ],
    "dialogue": [
      {
        "type": "line",
        "char": "hero",
        "text": "這裡看起來跟剛剛的窯場又不太一樣"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "先看看附近的古厝，你有沒有發現牆面有點特別？"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "磚頭的顏色和樣子，好像不太一樣"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "仔細看，有些磚瓦甚至不是同一種"
      },
      {
        "type": "question",
        "qIndex": 0,
        "char": "guide",
        "text": "仔細觀察附近古厝的牆面，會發現磚瓦的種類並不完全相同。為什麼一面牆上會出現不同種類的磚瓦？",
        "correctReaction": "以前窯廠燒製時，多少會出現瑕疵品這些磚瓦不一定會直接丟掉，有些就拿來蓋房子、砌牆，既能再利用，也能節省材料"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來以前的瑕疵品，反而成了現在古厝的一部分"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "這裡的烘爐窯，也和鶯歌以前的生活很有關係"
      },
      {
        "type": "question",
        "qIndex": 1,
        "char": "guide",
        "text": "過去烘爐窯主要燒製哪一類陶瓷？",
        "correctReaction": "烘爐窯主要燒製碗、盤等生活器皿這些東西和當時居民的日常生活息息相關"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "而且這座窯本身也有一段歷史"
      },
      {
        "type": "question",
        "qIndex": 2,
        "char": "guide",
        "text": "這座烘爐窯建於日治時期，見證了鶯歌陶業的發展。誰在1929年建造了這座烘爐窯？",
        "correctReaction": "1929年，賴氏人家建造了這座烘爐窯，早期生產磚瓦與烘爐，戰後轉為製作陶器，後來更擴及碗盤與磁磚，見證了鶯歌陶瓷產業的時代轉變"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來這座窯已經有這麼久的歷史了"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "不過窯廠留下的不只有這座窯你再看看故事巷裡的地面"
      },
      {
        "type": "notice",
        "text": "引導小明觀察故事巷"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "等等，地上這些好像是陶瓷碎片？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "你猜得沒錯以前窯廠燒壞的器皿，有些會打碎後掩埋後來這些老瓷片又被重新利用，成了故事巷裡的一部分"
      },
      {
        "type": "question",
        "qIndex": 3,
        "char": "guide",
        "text": "窯廠燒壞的器皿被打碎掩埋後，後來重新出現在故事巷。這些老瓷片被如何再利用？（複選）",
        "correctReaction": "沒錯，這些老瓷片被用來製作牆面裝飾，也有些鑲嵌於步道路面"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "被當成廢料的瓷片，現在居然又變成了街道的一部分"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "所以你看到的這些老瓷片，其實也是鶯歌陶業留下來的記憶"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "從古厝的磚瓦，到烘爐窯，再到地上的瓷片，好像到處都找得到以前陶業留下的痕跡"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "一塊不起眼的瓷片，也有一段故事"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "走吧，繼續前往探索"
      },
      {
        "type": "end"
      }
    ],
    "characters": {
      "guide": {
        "name": "楊嚮導",
        "portrait": "角色照片素材庫/角色/楊嚮導.png",
        "side": "left"
      },
      "hero": {
        "name": "小明",
        "portrait": "角色照片素材庫/角色/小明.png",
        "side": "right"
      }
    },
    "address": "新北市鶯歌區文化路213巷40號",
    "location": {
      "lat": 24.953426,
      "lng": 121.355479,
      "radius": 40
    }
  },
  {
    "id": 6,
    "name": "站點六益成記",
    "questions": [
      {
        "qtype": "選擇題",
        "question": "益成記窯場是由誰創辦？",
        "options": [
          "吳鞍",
          "王龜生",
          "陳斐然",
          "陳發"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "益成記被稱為鶯歌的「陶瓷大學」與下列何者無關？",
        "options": [
          "曾經是鶯歌製陶技術的重要傳承地",
          "培養過許多很有名的製陶師傅",
          "曾經研發許多生活用陶瓷品",
          "此處在當時是鶯歌重要的陶瓷交易場所"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "益成記曾引進哪裡的陶藝師傅？",
        "options": [
          "大陸景德鎮",
          "日本",
          "大陸福州",
          "台灣中南部"
        ]
      }
    ],
    "dialogue": [
      {
        "type": "line",
        "char": "hero",
        "text": "這裡以前也是窯廠嗎？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "這裡可是鶯歌以前很知名的窯廠——益成記"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "讓你猜猜，益成記是誰創辦的？"
      },
      {
        "type": "question",
        "qIndex": 0,
        "char": "guide",
        "text": "益成記窯場是由誰創辦？",
        "correctReaction": "1924年，陳斐然設立「益成記陶器製造工場」，是早期鶯歌重要的陶瓷窯廠之一"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來已經有這麼久的歷史了"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "而且後人還給它一個很特別的稱號"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "什麼稱號？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "早期鶯歌的「陶瓷大學」"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "讓我來考考你"
      },
      {
        "type": "question",
        "qIndex": 1,
        "char": "guide",
        "text": "益成記被稱為鶯歌的「陶瓷大學」，與下列何者無關？",
        "correctReaction": "沒錯，這個稱號跟陶瓷交易沒有關係"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "益成記更重要的地方，是技術的傳承與發展許多陶業師傅在這裡學習，也曾經研發不同的生活用陶瓷品"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "那這些技術都是鶯歌自己發展出來的嗎？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "也有從外地請來的師傅"
      },
      {
        "type": "question",
        "qIndex": 2,
        "char": "guide",
        "text": "益成記曾引進哪裡的陶藝師傅？",
        "correctReaction": "益成記曾引進福州的製陶師傅，例如李二妹等人，帶入「手擠坯」（土來走）等製陶技術"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "這些技術讓鶯歌能製作更多樣的陶器，促進了當地陶業的發展"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "益成記不只是生產陶瓷，也把外地的技術帶進鶯歌"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "一座窯廠，也能成為技術交流與傳承的地方"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "走吧，繼續看看鶯歌還留下哪些故事"
      },
      {
        "type": "end"
      }
    ],
    "characters": {
      "guide": {
        "name": "楊嚮導",
        "portrait": "角色照片素材庫/角色/楊嚮導.png",
        "side": "left"
      },
      "hero": {
        "name": "小明",
        "portrait": "角色照片素材庫/角色/小明.png",
        "side": "right"
      }
    },
    "address": "文化路、現順億窯業一帶",
    "location": {
      "lat": 24.9535,
      "lng": 121.3557,
      "radius": 65
    }
  },
  {
    "id": 7,
    "name": "站點七大榕樹和窯工聚落遺址",
    "questions": [
      {
        "qtype": "選擇題",
        "question": "早期鶯歌文化路有「兩陳一余」三大地主，兩陳家土地廣闊早期兩大家族是以什麼作為土地分界？",
        "options": [
          "以道路作為分界",
          "以山脈作為分界",
          "以兩棵大榕樹連成一線作為界線",
          "以溪流作為分界"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "早期鶯歌窯場缺乏工人，為了吸引外地陶工前來工作，窯廠老闆採取了什麼方式？",
        "options": [
          "提供免費餐食與住宿",
          "提供土地讓陶工自行蓋房子",
          "提供高薪酬",
          "傳授陶瓷製作技藝當交換"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "經過幾代人的傳承後，這些百年老屋為什麼還保留著？",
        "options": [
          "老屋屋齡太舊，修繕成本太高",
          "土地與房屋產權複雜，難以整合",
          "聚落人口外移，無暇照顧",
          "老屋保存與都市開發產生衝突"
        ]
      }
    ],
    "dialogue": [
      {
        "type": "line",
        "char": "hero",
        "text": "這裡有兩棵好大的榕樹！"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "你知道嗎？以前這兩棵榕樹可是很重要的「界線」"
      },
      {
        "type": "question",
        "qIndex": 0,
        "char": "guide",
        "text": "早期鶯歌文化路有「兩陳一余」三大地主，兩陳家土地廣闊。早期兩大家族是以什麼作為土地分界？",
        "correctReaction": "沒錯，就是以兩棵大榕樹連成一線作為界線"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來這兩棵榕樹以前還是土地的分界！"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "當時這一帶大多還是農地後來火車站遷到文化路附近，窯場和工廠陸續興建，也帶來另一個問題——工人不夠"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "窯廠這麼多，當然需要很多工人吧？"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "所以窯廠老闆開始想辦法吸引外地陶工來工作"
      },
      {
        "type": "question",
        "qIndex": 1,
        "char": "guide",
        "text": "早期鶯歌窯場缺乏工人，為了吸引外地陶工前來工作，窯廠老闆採取了什麼方式？",
        "correctReaction": "窯廠老闆提供土地，讓外地陶工自己蓋房子，連同家人一起住下來，也解決了工人居住的問題"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "難怪這裡慢慢形成了聚落"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "這些房子經過幾代人的生活與傳承，有些一直保存到現在，但也延伸出一些問題所在"
      },
      {
        "type": "question",
        "qIndex": 2,
        "char": "guide",
        "text": "經過幾代人的傳承後，這些百年老屋為什麼還保留著？",
        "correctReaction": "沒錯，不是單純因為老屋太舊，而是土地和房屋的產權比較複雜"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "原來不是單純因為老屋太舊，而是土地和房屋的產權比較複雜"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "這些老屋和窯場一起留下，也讓我們現在還能看見早期窯工聚落的樣貌"
      },
      {
        "type": "line",
        "char": "hero",
        "text": "這裡不只是老房子，而是以前窯工生活的痕跡"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "從土地分界、窯場，到工人聚落，都能看見鶯歌陶業發展留下的故事"
      },
      {
        "type": "line",
        "char": "guide",
        "text": "走吧，下一站還有更多鶯歌的故事"
      },
      {
        "type": "end"
      }
    ],
    "characters": {
      "guide": {
        "name": "楊嚮導",
        "portrait": "角色照片素材庫/角色/楊嚮導.png",
        "side": "left"
      },
      "hero": {
        "name": "小明",
        "portrait": "角色照片素材庫/角色/小明.png",
        "side": "right"
      }
    }
  },
  {
    "id": 8,
    "name": "站點八陳映真故居",
    "questions": [
      {
        "qtype": "選擇題",
        "question": "陳映真童年在鶯歌生活，身邊有許多陶工、礦工與搬運工這段經歷對他的創作有何影響？",
        "options": [
          "讓他對研究工人議題有興趣",
          "讓他對成為工程議題有興趣",
          "使他更能深刻體會勞動階級的生活",
          "讓他對鶯歌文史相關創作有興趣"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "陳映真創辦《人間》雜誌,主要希望透過報導為什麼發聲？",
        "options": [
          "社會各界知名人士",
          "人世間的悲歡離合",
          "社會底層與弱勢族群",
          "人間藝術工作者"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "下列哪一項曾出現在《山路》小說中所描寫的鶯歌景象？",
        "options": [
          "鶯歌石與臺車道",
          "鶯歌老街與陶瓷博物館",
          "鶯歌車站與窯場",
          "汪洋居與益成記"
        ]
      }
    ],
    "address": "新北市鶯歌區文化路215號附近，東鶯市民活動中心旁",
    "location": {
      "lat": 24.9537,
      "lng": 121.3553,
      "radius": 65
    }
  },
  {
    "id": 9,
    "name": "站點九鶯歌福興宮",
    "questions": [
      {
        "qtype": "選擇題",
        "question": "仔細觀察福興宮,你會發現有什麼特別之處?",
        "options": [
          "廟中廟建築",
          "日治時期仿巴洛克式建築",
          "子母廟建築",
          "石頭厝建築"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "傳說陶神羅文擅長「手作」陶，弟弟羅明擅長「車製」陶請問現代那種製陶手法比較接近「車製」方式呢？",
        "options": [
          "陶瓷模型製作",
          "福州手擠陶坯製作",
          "純手捏塑陶土製作",
          "手拉坏製作"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "鶯歌窯場過去會在福興宮祭拜陶神羅明羅明的誕辰是哪一天？",
        "options": [
          "農曆三月十五日",
          "農曆六月六日",
          "農曆九月九日",
          "農曆九月十五日"
        ]
      }
    ],
    "address": "新北市鶯歌區中正二路63號",
    "location": {
      "lat": 24.9508,
      "lng": 121.3508,
      "radius": 40
    }
  },
  {
    "id": 10,
    "name": "站點十鶯歌老街-古早窯(觀察)",
    "questions": [
      {
        "qtype": "選擇題",
        "question": "走進「古早窯」，他是屬於哪一種窯種？",
        "options": [
          "蛇窯",
          "登窯",
          "四角窯",
          "隧道窯"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "古早窯主要是生產哪些產品？",
        "options": [
          "碗盤與茶具",
          "磁磚(馬賽克)",
          "花器與陶甕",
          "工業用磁器"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "隧道窯燒製時,工人是如何將成品運送進出窯爐呢？",
        "options": [
          "人力搬運",
          "用鐵鈎勾窯車方式進出",
          "用台車一節接一節依序運送",
          "以輸送帶傳動運送"
        ]
      },
      {
        "qtype": "選擇題",
        "question": "隧道窯引進臺灣後，為提升燒製效率，燃料後來改用什麼？",
        "options": [
          "木柴",
          "柴油",
          "重油",
          "天然氣"
        ]
      }
    ],
    "address": "新北市鶯歌區重慶街65之1號",
    "location": {
      "lat": 24.9516,
      "lng": 121.3505,
      "radius": 35
    }
  }
];
