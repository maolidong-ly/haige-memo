/**
 * 世界重要国家图 · 坐标为初估，请拖动后「锁死位置」
 */
window.GEO_MAPS = window.GEO_MAPS || {};

window.GEO_MAPS["world-countries"] = {
  id: "world-countries",
  pointsRevision: 2,
  mapType: "countries",
  title: "世界重要国家图",
  subtitle: "点击标注查看国家名称与区域",
  mapImage: "assets/world-countries.jpg",
  mapWidth: 3508,
  mapHeight: 2480,
  points: [
    { id: "china", name: "中国", category: "东亚", x: 1348, y: 950, note: "东亚最大国家，世界第三大面积" },
    { id: "japan", name: "日本", category: "东亚", x: 1701, y: 891, note: "岛国，位于太平洋西岸" },
    { id: "korea_south", name: "韩国", category: "东亚", x: 1549, y: 945, note: "朝鲜半岛南部" },
    { id: "korea_north", name: "朝鲜", category: "东亚", x: 1560, y: 883, note: "朝鲜半岛北部" },
    { id: "mongolia", name: "蒙古", category: "东亚", x: 1368, y: 811, note: "内陆国，与我国内蒙古相邻" },

    { id: "thailand", name: "泰国", category: "东南亚", x: 1280, y: 1172, note: "中南半岛中部，东盟成员" },
    { id: "myanmar", name: "缅甸", category: "东南亚", x: 1246, y: 1107, note: "中南半岛西部，与云南接壤" },
    { id: "singapore", name: "新加坡", category: "东南亚", x: 1314, y: 1333, note: "马来半岛南端城市国家" },
    { id: "philippines", name: "菲律宾", category: "东南亚", x: 1498, y: 1200, note: "马来群岛北部，群岛国家" },
    { id: "indonesia", name: "印度尼西亚", category: "东南亚", x: 1482, y: 1392, note: "世界最大群岛国家，跨赤道" },
    { id: "vietnam", name: "越南", category: "东南亚", x: 1376, y: 1195, note: "中南半岛东部，长 S 形国土" },

    { id: "india", name: "印度", category: "南亚", x: 1065, y: 1143, note: "南亚最大国家，北高南低" },
    { id: "bangladesh", name: "孟加拉国", category: "南亚", x: 1197, y: 1065, note: "恒河三角洲，人口密集" },
    { id: "sri_lanka", name: "斯里兰卡", category: "南亚", x: 1081, y: 1289, note: "印度以南岛国，锡兰" },
    { id: "maldives", name: "马尔代夫", category: "南亚", x: 982, y: 1258, note: "印度洋群岛，低海拔岛国" },
    { id: "pakistan", name: "巴基斯坦", category: "南亚", x: 984, y: 1028, note: "南亚西部，印度河平原" },
    { id: "afghanistan", name: "阿富汗", category: "南亚", x: 1001, y: 933, note: "亚洲十字路口，内陆山地" },

    { id: "iran", name: "伊朗", category: "西亚", x: 887, y: 938, note: "西亚高原国家，石油资源丰富" },
    { id: "iraq", name: "伊拉克", category: "西亚", x: 801, y: 919, note: "两河流域，美索不达米亚" },
    { id: "saudi", name: "沙特阿拉伯", category: "西亚", x: 767, y: 1034, note: "阿拉伯半岛主体，石油王国" },
    { id: "israel", name: "以色列", category: "西亚", x: 722, y: 911, note: "地中海东岸" },

    { id: "egypt", name: "埃及", category: "非洲", x: 644, y: 982, note: "地跨非亚，尼罗河与苏伊士运河" },
    { id: "south_africa", name: "南非", category: "非洲", x: 615, y: 1773, note: "非洲南端，矿产资源丰富" },
    { id: "somalia", name: "索马里", category: "非洲", x: 720, y: 1329, note: "非洲之角，亚丁湾西岸" },
    { id: "ethiopia", name: "埃塞俄比亚", category: "非洲", x: 686, y: 1243, note: "东非高原，非洲屋脊" },
    { id: "madagascar", name: "马达加斯加", category: "非洲", x: 775, y: 1609, note: "印度洋岛国，非洲东南" },

    { id: "argentina", name: "阿根廷", category: "南美洲", x: 3046, y: 1879, note: "南美南部，潘帕斯草原" },
    { id: "brazil", name: "巴西", category: "南美洲", x: 3320, y: 1542, note: "南美最大国家，亚马孙平原" },
    { id: "chile", name: "智利", category: "南美洲", x: 2984, y: 1811, note: "南美西海岸狭长国家" },
    { id: "peru", name: "秘鲁", category: "南美洲", x: 3042, y: 1450, note: "安第斯山西麓，印加文明" },
    { id: "venezuela", name: "委内瑞拉", category: "南美洲", x: 3147, y: 1222, note: "南美北部，加勒比海南岸" },
    { id: "panama", name: "巴拿马", category: "中美洲", x: 3024, y: 1216, note: "巴拿马运河，连接太平洋与大西洋" },

    { id: "cuba", name: "古巴", category: "北美洲", x: 3000, y: 1042, note: "加勒比海最大岛国" },
    { id: "usa", name: "美国", category: "北美洲", x: 2739, y: 837, note: "北美洲主体，超级大国" },
    { id: "canada", name: "加拿大", category: "北美洲", x: 2600, y: 621, note: "北美北部，世界第二大面积" },
    { id: "mexico", name: "墨西哥", category: "北美洲", x: 2773, y: 1022, note: "美国以南，中美洲北端" },

    { id: "russia", name: "俄罗斯", category: "欧洲/北亚", x: 1485, y: 575, note: "世界最大国家，跨欧亚" },
    { id: "poland", name: "波兰", category: "欧洲", x: 734, y: 641, note: "中欧平原，波罗的海以南" },
    { id: "ukraine", name: "乌克兰", category: "欧洲", x: 791, y: 701, note: "东欧平原，黑土广布" },
    { id: "uk", name: "英国", category: "欧洲", x: 603, y: 570, note: "西欧岛国，大不列颠" },
    { id: "france", name: "法国", category: "欧洲", x: 559, y: 687, note: "西欧大国，巴黎盆地" },
    { id: "germany", name: "德国", category: "欧洲", x: 661, y: 642, note: "中欧经济强国" },
    { id: "spain", name: "西班牙", category: "欧洲", x: 480, y: 770, note: "伊比利亚半岛大部" },
    { id: "portugal", name: "葡萄牙", category: "欧洲", x: 403, y: 774, note: "伊比利亚半岛西部" },
    { id: "italy", name: "意大利", category: "欧洲", x: 614, y: 772, note: "南欧半岛国家，地中海沿岸" },
    { id: "iceland", name: "冰岛", category: "欧洲", x: 576, y: 427, note: "北大西洋火山岛，地热与渔业发达" },
    { id: "norway", name: "挪威", category: "欧洲", x: 750, y: 491, note: "北欧斯堪的纳维亚，峡湾" },
    { id: "sweden", name: "瑞典", category: "欧洲", x: 843, y: 501, note: "北欧波罗的海东岸" },
    { id: "finland", name: "芬兰", category: "欧洲", x: 916, y: 519, note: "北欧「千湖之国」" },

    { id: "australia", name: "澳大利亚", category: "大洋洲", x: 1584, y: 1641, note: "独占大陆，南半球发达国家" },
    { id: "new_zealand", name: "新西兰", category: "大洋洲", x: 1952, y: 1857, note: "太平洋西南岛国" },
    { id: "papua_new_guinea", name: "巴布亚新几内亚", category: "大洋洲", x: 1723, y: 1427, note: "新几内亚岛东半部" },
  ],
};
