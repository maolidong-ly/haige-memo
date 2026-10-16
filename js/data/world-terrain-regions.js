/**
 * 世界主要地形区图 · 坐标为初估，请拖动后「锁死位置」
 */
window.GEO_MAPS = window.GEO_MAPS || {};

window.GEO_MAPS["world-terrain-regions"] = {
  id: "world-terrain-regions",
  pointsRevision: 2,
  mapType: "world-terrain",
  title: "世界主要地形区图",
  subtitle: "点击标注查看地形类型与地理意义",
  mapImage: "assets/world-terrain-regions.jpg",
  mapWidth: 4908,
  mapHeight: 3473,
  points: [
    { id: "andes", name: "安第斯山脉", category: "山脉", x: 4297, y: 2279, note: "南美西岸世界最长纵贯山脉，板块碰撞形成" },
    { id: "guiana_highlands", name: "圭亚那高原", category: "高原", x: 4411, y: 1798, note: "南美北部，古老结晶岩高原，瀑布众多" },
    { id: "amazon_plain", name: "亚马逊平原", category: "平原", x: 4477, y: 2020, note: "亚马孙河流域，世界最大热带雨林区" },
    { id: "brazilian_highlands", name: "巴西高原", category: "高原", x: 4546, y: 2184, note: "南美东部，面积广阔，巴西经济核心区域" },
    { id: "la_plata_plain", name: "拉普拉塔平原", category: "平原", x: 4425, y: 2448, note: "南美东南部，拉普拉塔河系，潘帕斯草原一部分" },
    { id: "patagonia", name: "巴塔哥尼亚高原", category: "高原", x: 4171, y: 2688, note: "南美南部，干旱多风，东岸牧业发达" },

    { id: "rockies", name: "落基山脉", category: "山脉", x: 3571, y: 1230, note: "北美西部科迪勒拉山系主体，资源与水能丰富" },
    { id: "great_plains", name: "中央大平原", category: "平原", x: 3808, y: 1101, note: "美国中部大平原，世界重要商品粮基地" },
    { id: "appalachians", name: "阿巴拉契亚山脉", category: "山脉", x: 4101, y: 1176, note: "北美东部古老低山，煤铁资源分布" },
    { id: "labrador_plateau", name: "拉布拉多高原", category: "高原", x: 1580, y: 980, note: "加拿大东部，古老结晶岩高原，多湖泊" },

    { id: "great_dividing_range", name: "大分水岭", category: "山脉", x: 2443, y: 2348, note: "澳大利亚东部，太平洋与印度洋水系分界" },

    { id: "congo_basin", name: "刚果盆地", category: "盆地", x: 708, y: 1900, note: "非洲中部，赤道热带雨林，刚果河贯穿" },
    { id: "east_africa_plateau", name: "东非高原", category: "高原", x: 951, y: 1757, note: "非洲之角以南，裂谷与火山广布，非洲屋脊" },

    { id: "arabian_plateau", name: "阿拉伯高原", category: "高原", x: 1078, y: 1473, note: "阿拉伯半岛主体，热带沙漠气候，石油丰富" },
    { id: "iranian_plateau", name: "伊朗高原", category: "高原", x: 1263, y: 1292, note: "西亚大面积高原，周围多高山环绕" },
    { id: "turanic_plain", name: "图兰平原", category: "平原", x: 1375, y: 1163, note: "中亚低地，包括咸海、里海以东地区，干旱荒漠为主" },
    { id: "indus_plain", name: "印度河平原", category: "平原", x: 1421, y: 1379, note: "南亚西部，印度河冲积平原，灌溉农业发达" },
    { id: "ganges_plain", name: "恒河平原", category: "平原", x: 1618, y: 1453, note: "南亚北部，人口稠密，恒河—布拉马普特拉河冲积" },
    { id: "deccan_plateau", name: "德干高原", category: "高原", x: 1507, y: 1517, note: "印度半岛主体，古老熔岩高原，西高东低" },
    { id: "western_ghats", name: "西高止山", category: "山脉", x: 1389, y: 1621, note: "印度半岛西岸，阻挡西南季风，雨林与瀑布发育" },
    { id: "eastern_ghats", name: "东高止山", category: "山脉", x: 1558, y: 1633, note: "印度半岛东岸低山，与西高止山夹峙德干高原" },

    { id: "western_europe_plain", name: "西欧平原", category: "平原", x: 798, y: 937, note: "欧洲西部，地势低平，经济发达" },
    { id: "north_german_polish_plain", name: "波德平原", category: "平原", x: 1025, y: 925, note: "中欧北部，波罗的海以南，波德平原（中欧平原一部分）" },
    { id: "east_europe_plain", name: "东欧平原", category: "平原", x: 1312, y: 854, note: "欧洲最大平原，俄罗斯欧洲部分主体" },

    { id: "west_siberian_plain", name: "西西伯利亚平原", category: "平原", x: 1723, y: 844, note: "亚洲北部最大低地，沼泽广布，石油天然气丰富" },
    { id: "central_siberian_plateau", name: "中西伯利亚高原", category: "高原", x: 2069, y: 794, note: "西伯利亚中部，古老高原，河流切割明显" },
    { id: "east_siberian_mountains", name: "东西伯利亚山地", category: "山地", x: 2444, y: 812, note: "西伯利亚东部，山地与盆地相间，气候严寒" },

    { id: "ural_mountains", name: "乌拉尔山脉", category: "山脉", x: 1629, y: 688, note: "亚欧分界线之一，南北走向，矿产丰富" },
    { id: "greater_caucasus", name: "大高加索山脉", category: "山脉", x: 1203, y: 1104, note: "黑海与里海之间，欧洲与西亚分界，主峰厄尔布鲁士" },
    { id: "himalayas", name: "喜马拉雅山脉", category: "山脉", x: 1720, y: 1397, note: "世界最高山脉，亚欧板块与印度洋板块碰撞形成" },
    { id: "scandinavian_mountains", name: "斯堪的纳维亚山脉", category: "山脉", x: 1111, y: 672, note: "北欧斯堪的纳维亚半岛，冰川作用形成峡湾" },
  ],
};
