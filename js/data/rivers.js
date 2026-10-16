/**
 * 世界主要河流图 · 坐标为初估，请拖动后「锁死位置」
 */
window.GEO_MAPS = window.GEO_MAPS || {};

window.GEO_MAPS["rivers"] = {
  id: "rivers",
  mapType: "rivers",
  title: "世界主要河流图",
  subtitle: "点击标注查看河流名称与地理意义",
  mapImage: "assets/world-rivers.jpg?v=20261016",
  mapWidth: 4908,
  mapHeight: 3473,
  points: [
    { id: "rhine", name: "莱茵河", category: "欧洲", x: 1131, y: 692, note: "西欧重要国际河流，经荷兰注入北海，航运繁忙" },
    { id: "danube", name: "多瑙河", category: "欧洲", x: 1088, y: 1062, note: "欧洲第二长河，流经多国，注入黑海" },
    { id: "thames", name: "泰晤士河", category: "欧洲", x: 940, y: 870, note: "英国南部，流经伦敦，注入北海" },
    { id: "seine", name: "塞纳河", category: "欧洲", x: 858, y: 1036, note: "法国北部，流经巴黎，注入英吉利海峡" },
    { id: "volga", name: "伏尔加河", category: "欧洲", x: 1308, y: 990, note: "欧洲最长河，俄罗斯母亲河，注入里海" },

    { id: "yenisei", name: "叶尼塞河", category: "亚洲", x: 1888, y: 835, note: "西伯利亚大河，自南向北注入北冰洋喀拉海" },
    { id: "lena", name: "勒拿河", category: "亚洲", x: 2234, y: 846, note: "西伯利亚东部，注入北冰洋拉普捷夫海" },
    { id: "ob", name: "鄂毕河", category: "亚洲", x: 1662, y: 830, note: "西伯利亚西部，与额尔齐斯河汇合后北注北冰洋" },
    { id: "yellow_river", name: "黄河", category: "亚洲", x: 2014, y: 1263, note: "中国第二长河，含沙量大，注入渤海" },
    { id: "yangtze", name: "长江", category: "亚洲", x: 2074, y: 1397, note: "中国第一长河，自西向东，注入东海" },
    { id: "pearl_river", name: "珠江", category: "亚洲", x: 1930, y: 1547, note: "中国南方大河，三江汇流，注入南海" },
    { id: "ganges", name: "恒河", category: "亚洲", x: 1619, y: 1511, note: "南亚圣河，印度与孟加拉国人口密集区，注入孟加拉湾" },
    { id: "indus", name: "印度河", category: "亚洲", x: 1419, y: 1380, note: "南亚西部，源于青藏高原，注入阿拉伯海" },

    { id: "nile", name: "尼罗河", category: "非洲", x: 1002, y: 1530, note: "世界最长河，自南向北，注入地中海" },
    { id: "niger", name: "尼日尔河", category: "非洲", x: 687, y: 1582, note: "西非大河，大拐弯，注入几内亚湾" },
    { id: "congo", name: "刚果河", category: "非洲", x: 725, y: 1860, note: "流量大，赤道附近，注入大西洋" },
    { id: "zambezi", name: "赞比西河", category: "非洲", x: 970, y: 2191, note: "非洲南部，有维多利亚瀑布，注入莫桑比克海峡" },

    { id: "murray_darling", name: "墨累河-达令河", category: "大洋洲", x: 2399, y: 2304, note: "澳大利亚最长水系，干旱区重要灌溉水源" },

    { id: "mississippi", name: "密西西比河", category: "北美洲", x: 3654, y: 1239, note: "北美最长河系，纵贯美国中部，注入墨西哥湾" },
    { id: "st_lawrence", name: "圣劳伦斯河", category: "北美洲", x: 3841, y: 1030, note: "连接五大湖与大西洋，美加界河一段" },

    { id: "amazon", name: "亚马逊河", category: "南美洲", x: 4262, y: 1971, note: "世界流量最大、流域最广的河流，注入大西洋" },
    { id: "parana", name: "巴拉那河", category: "南美洲", x: 4066, y: 2353, note: "南美第二长河，与巴拉圭河、乌拉圭河组成拉普拉塔水系" },
  ],
};
