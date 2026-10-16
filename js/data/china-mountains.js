/**
 * 中国主要山脉 · 坐标基于「中国山地空白图」校准
 * 海拔数据参考自然资源部公告、地形图及主流教材
 */
window.GEO_MAPS = window.GEO_MAPS || {};

window.GEO_MAPS["china-mountains"] = {
  id: "china-mountains",
  title: "中国山地图",
  subtitle: "点击山脉查看名称与海拔",
  mapImage: "assets/china-mountains-blank.jpg",
  mapWidth: 2400,
  mapHeight: 1696,
  mountains: [
    { id: "himalaya", name: "喜马拉雅山脉", peak: "珠穆朗玛峰", elevation: 8848.86, x: 629, y: 1126, note: "世界最高山脉，中国与尼泊尔、印度等国界山" },
    { id: "kunlun", name: "昆仑山脉", peak: "慕士塔格峰", elevation: 7546, x: 455, y: 799, note: "亚洲中部大山系，「万山之祖」（最高峰公格尔峰 7649 米）" },
    { id: "tianshan", name: "天山山脉", peak: "托木尔峰", elevation: 7439, x: 607, y: 517, note: "横贯新疆中部，南北疆天然分界线" },
    { id: "altai", name: "阿尔泰山脉", peak: "友谊峰", elevation: 4374, x: 754, y: 381, note: "中国、俄罗斯、蒙古交界山脉" },
    { id: "qilian", name: "祁连山脉", peak: "团结峰", elevation: 5827, x: 1018, y: 756, note: "河西走廊南侧，青藏高原与内蒙古高原分界" },
    { id: "hengduan", name: "横断山脉", peak: "贡嘎山", elevation: 7508.9, x: 922, y: 1194, note: "南北走向，山河相间、纵列分布（2023年官方测定高程）" },
    { id: "tangula", name: "唐古拉山脉", peak: "各拉丹冬峰", elevation: 6621, x: 707, y: 954, note: "长江源头，青藏两省界山" },
    { id: "gangdise", name: "冈底斯山脉", peak: "冈仁波齐峰", elevation: 6638, x: 478, y: 993, note: "西藏境内著名圣山（最高峰冷布岗日 7095 米）" },
    { id: "bayankala", name: "巴颜喀拉山脉", peak: "约古宗列峰", elevation: 4974, x: 924, y: 949, note: "黄河源头区，青川甘界山" },
    { id: "qinling", name: "秦岭", peak: "太白山", elevation: 3767, x: 1163, y: 938, note: "中国南北方地理分界线" },
    { id: "daba", name: "大巴山脉", peak: "光雾山", elevation: 2507.2, x: 1164, y: 1014, note: "四川盆地与汉水谷地分界，米仓山段主峰（2023年官方测定）" },
    { id: "dabie", name: "大别山", peak: "白马尖", elevation: 1777, x: 1452, y: 1016, note: "长江与淮河分水岭，鄂豫皖界山" },
    { id: "taihang", name: "太行山脉", peak: "小五台山", elevation: 2882, x: 1408, y: 769, note: "华北平原与黄土高原分界，太行主脉最高峰" },
    { id: "daxing", name: "大兴安岭", peak: "黄岗梁", elevation: 2029, x: 1566, y: 365, note: "东北平原与内蒙古高原分界" },
    { id: "xiaoxing", name: "小兴安岭", peak: "平顶山", elevation: 1429, x: 1721, y: 279, note: "东北平原北部，森林资源丰富" },
    { id: "changbai", name: "长白山", peak: "白头山（天池）", elevation: 2691, x: 1734, y: 528, note: "中朝界山，东北第一高峰" },
    { id: "wuyi", name: "武夷山脉", peak: "黄岗山", elevation: 2161, x: 1548, y: 1200, note: "闽赣界山，东南丘陵代表" },
    { id: "nanling", name: "南岭", peak: "猫儿山", elevation: 2141, x: 1414, y: 1298, note: "长江水系与珠江水系分水岭" },
    { id: "yanshan", name: "阴山山脉", peak: "呼和巴达山", elevation: 2364, x: 1213, y: 648, note: "内蒙古高原与河套平原分界" },
    { id: "helan", name: "贺兰山", peak: "敖团贺兰山", elevation: 3556, x: 1192, y: 772, note: "宁夏平原西侧，阻挡西北寒流" },
    { id: "altun", name: "阿尔金山", peak: "苏拉木塔格峰", elevation: 6295, x: 658, y: 716, note: "塔里木盆地与柴达木盆地分界，新疆与青海界山" },
    { id: "wushan", name: "巫山", peak: "乌云顶", elevation: 2400, x: 1345, y: 1077, note: "四川盆地东缘，长江切穿形成三峡" },
    { id: "xuefeng", name: "雪峰山", peak: "苏宝顶", elevation: 1934, x: 1317, y: 1225, note: "第二级阶梯向第三级阶梯过渡，湘西山地代表" },
    { id: "yanmount", name: "燕山", peak: "雾灵山", elevation: 2118, x: 1529, y: 661, note: "华北平原北部，内蒙古高原南缘" },
    { id: "taiwan_mt", name: "台湾山脉", peak: "玉山", elevation: 3952, x: 1706, y: 1300, note: "台湾岛中部纵贯，我国东部最高山" },
  ],
};
