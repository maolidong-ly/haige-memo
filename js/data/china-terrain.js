/**
 * 中国地形图 · 平原、盆地、丘陵、谷地、高原、走廊
 * 坐标基于「中国山地空白图」与参考图校准，可拖动后导出
 */
window.GEO_MAPS = window.GEO_MAPS || {};

window.GEO_MAPS["china-terrain"] = {
  id: "china-terrain",
  mapType: "terrain",
  title: "中国地形图",
  subtitle: "点击标注查看地形类型与说明（平原·盆地·丘陵·谷地·高原·走廊）",
  mapImage: "assets/china-mountains-blank.jpg",
  mapWidth: 2400,
  mapHeight: 1696,
  points: [
    /* 平原 */
    { id: "ne_plain", name: "东北平原", category: "平原", x: 1642, y: 455, note: "中国最大平原，黑土分布区，重要商品粮基地" },
    { id: "nc_plain", name: "华北平原", category: "平原", x: 1496, y: 822, note: "黄淮海平原，我国第二大平原，小麦、棉花主产区" },
    { id: "yangtze_plain", name: "长江中下游平原", category: "平原", x: 1554, y: 1059, note: "鱼米之乡，河网密布，水稻主产区" },
    { id: "hetao_plain", name: "河套平原", category: "平原", x: 1260, y: 695, note: "黄河灌区，「塞外江南」，宁夏内蒙古一带" },
    { id: "ningxia_plain", name: "宁夏平原", category: "平原", x: 1201, y: 769, note: "黄河宁夏段冲积平原，塞上江南，灌溉农业发达" },
    { id: "sanjiang_plain", name: "三江平原", category: "平原", x: 1849, y: 315, note: "黑龙江、松花江、乌苏里江汇流区，东北平原东北部，沼泽湿地广布" },

    /* 高原 */
    { id: "inner_mongolia_plateau", name: "内蒙古高原", category: "高原", x: 1372, y: 539, note: "我国第二大高原，地势坦荡，草原广布，畜牧业为主" },
    { id: "loess_plateau", name: "黄土高原", category: "高原", x: 1334, y: 799, note: "世界最大黄土堆积区，千沟万壑，水土流失严重" },
    { id: "tibetan_plateau", name: "青藏高原", category: "高原", x: 633, y: 986, note: "世界最高高原，平均海拔4000米以上，「世界屋脊」" },
    { id: "yunnan_guizhou_plateau", name: "云贵高原", category: "高原", x: 1123, y: 1284, note: "喀斯特地貌发育，地形崎岖，多峰林溶洞，四季如春" },

    /* 走廊 */
    { id: "hexi_corridor", name: "河西走廊", category: "走廊", x: 981, y: 721, note: "祁连山与北山之间狭长地带，古丝绸之路要道，绿洲农业" },

    /* 盆地 */
    { id: "junggar", name: "准噶尔盆地", category: "盆地", x: 675, y: 429, note: "新疆北部，天山与阿尔泰山之间，呈不规则三角形" },
    { id: "tarim", name: "塔里木盆地", category: "盆地", x: 567, y: 636, note: "中国最大内陆盆地，塔克拉玛干沙漠位于其中" },
    { id: "qaidam", name: "柴达木盆地", category: "盆地", x: 862, y: 799, note: "青藏高原内部，「聚宝盆」，盐湖、石油资源丰富" },
    { id: "sichuan", name: "四川盆地", category: "盆地", x: 1066, y: 1089, note: "紫色盆地，天府之国，亚热带湿润气候" },

    /* 丘陵 */
    { id: "liaodong_hills", name: "辽东丘陵", category: "丘陵", x: 1665, y: 652, note: "辽东半岛，暖温带落叶阔叶林，苹果、水产" },
    { id: "shandong_hills", name: "山东丘陵", category: "丘陵", x: 1593, y: 809, note: "山东半岛，低山丘陵为主，花生、水果产区" },
    { id: "jiangnan_hills", name: "江南丘陵", category: "丘陵", x: 1443, y: 1171, note: "长江以南、南岭以北，红壤广布，茶叶、柑橘" },
    { id: "zhemin_hills", name: "浙闽丘陵", category: "丘陵", x: 1632, y: 1175, note: "浙江、福建沿海，亚热带常绿阔叶林，竹木、茶叶" },
    { id: "liangguang_hills", name: "两广丘陵", category: "丘陵", x: 1362, y: 1385, note: "广东、广西，热带亚热带丘陵，甘蔗、热带作物" },

    /* 谷地 */
    { id: "zangnan_valley", name: "藏南谷地", category: "谷地", x: 571, y: 1080, note: "雅鲁藏布江谷地，西藏粮仓，青稞主产区" },
    { id: "wei_valley", name: "渭河谷地", category: "谷地", x: 1189, y: 924, note: "关中平原，秦岭以北，华夏文明重要发祥地" },
    { id: "han_valley", name: "汉水谷地", category: "谷地", x: 1185, y: 981, note: "汉中盆地，秦岭与大巴山之间，南北过渡地带" },
  ],
};
