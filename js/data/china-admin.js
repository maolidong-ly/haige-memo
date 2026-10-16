/**
 * 中国政区图 · 省级行政区（省会/首府位置为初估，请拖动后「锁死位置」）
 */
window.GEO_MAPS = window.GEO_MAPS || {};

window.GEO_MAPS["china-admin"] = {
  id: "china-admin",
  mapType: "admin",
  title: "中国政区图",
  subtitle: "点击标注查看全称、简称与省会 / 首府",
  mapImage: "assets/china-admin-blank.jpg",
  mapWidth: 2764,
  mapHeight: 2255,
  points: [
    { id: "beijing", name: "北京市", abbr: "京", capital: "北京", category: "直辖市", x: 2044, y: 875, note: "首都，政治、文化、国际交往中心" },
    { id: "tianjin", name: "天津市", abbr: "津", capital: "天津", category: "直辖市", x: 2088, y: 939, note: "华北门户，渤海湾畔重要港口城市" },
    { id: "shanghai", name: "上海市", abbr: "沪", capital: "上海", category: "直辖市", x: 2365, y: 1398, note: "长江入海口，国际经济、金融、航运中心" },
    { id: "chongqing", name: "重庆市", abbr: "渝", capital: "重庆", category: "直辖市", x: 1569, y: 1545, note: "长江上游，西南重镇，山地城市" },

    { id: "hebei", name: "河北省", abbr: "冀", capital: "石家庄", category: "省", x: 1964, y: 1000, note: "环绕京津，华北平原主体部分" },
    { id: "shanxi", name: "山西省", abbr: "晋", capital: "太原", category: "省", x: 1857, y: 1036, note: "黄土高原东缘，煤炭资源丰富" },
    { id: "liaoning", name: "辽宁省", abbr: "辽", capital: "沈阳", category: "省", x: 2328, y: 733, note: "东北南部，老工业基地，渤海沿岸" },
    { id: "jilin", name: "吉林省", abbr: "吉", capital: "长春", category: "省", x: 2392, y: 586, note: "东北中部，汽车工业与农业并重" },
    { id: "heilongjiang", name: "黑龙江省", abbr: "黑", capital: "哈尔滨", category: "省", x: 2403, y: 465, note: "中国最北省份之一，北大仓" },
    { id: "jiangsu", name: "江苏省", abbr: "苏", capital: "南京", category: "省", x: 2233, y: 1374, note: "长江下游，经济发达，河网密布" },
    { id: "zhejiang", name: "浙江省", abbr: "浙", capital: "杭州", category: "省", x: 2289, y: 1458, note: "东南沿海，民营经济活跃" },
    { id: "anhui", name: "安徽省", abbr: "皖", capital: "合肥", category: "省", x: 2126, y: 1372, note: "华东内陆，江淮分水岭" },
    { id: "fujian", name: "福建省", abbr: "闽", capital: "福州", category: "省", x: 2273, y: 1715, note: "东南沿海，山地丘陵为主，侨乡" },
    { id: "jiangxi", name: "江西省", abbr: "赣", capital: "南昌", category: "省", x: 2082, y: 1576, note: "长江以南，鄱阳湖平原" },
    { id: "shandong", name: "山东省", abbr: "鲁", capital: "济南", category: "省", x: 2089, y: 1107, note: "黄河下游，半岛与平原兼备" },
    { id: "henan", name: "河南省", abbr: "豫", capital: "郑州", category: "省", x: 1945, y: 1312, note: "中原腹地，人口大省，交通枢纽" },
    { id: "hubei", name: "湖北省", abbr: "鄂", capital: "武汉", category: "省", x: 1995, y: 1476, note: "长江中游，九省通衢" },
    { id: "hunan", name: "湖南省", abbr: "湘", capital: "长沙", category: "省", x: 1922, y: 1609, note: "长江以南，洞庭湖以南" },
    { id: "guangdong", name: "广东省", abbr: "粤", capital: "广州", category: "省", x: 1962, y: 1928, note: "南岭以南，改革开放前沿" },
    { id: "hainan", name: "海南省", abbr: "琼", capital: "海口", category: "省", x: 1797, y: 2137, note: "南海中的岛屿省份，热带季风气候" },
    { id: "sichuan", name: "四川省", abbr: "川 / 蜀", capital: "成都", category: "省", x: 1445, y: 1485, note: "西南盆地，天府之国" },
    { id: "guizhou", name: "贵州省", abbr: "贵 / 黔", capital: "贵阳", category: "省", x: 1586, y: 1718, note: "云贵高原东缘，喀斯特广布" },
    { id: "yunnan", name: "云南省", abbr: "云 / 滇", capital: "昆明", category: "省", x: 1293, y: 1870, note: "西南边陲，垂直气候显著，民族众多" },
    { id: "shaanxi", name: "陕西省", abbr: "陕 / 秦", capital: "西安", category: "省", x: 1697, y: 1275, note: "关中平原，古丝绸之路起点" },
    { id: "gansu", name: "甘肃省", abbr: "甘 / 陇", capital: "兰州", category: "省", x: 1443, y: 1170, note: "西北狭长通道，河西走廊" },
    { id: "qinghai", name: "青海省", abbr: "青", capital: "西宁", category: "省", x: 1337, y: 1119, note: "青藏高原东北部，三江源所在" },
    { id: "taiwan", name: "台湾省", abbr: "台", capital: "台北", category: "省", x: 2415, y: 1782, note: "东南沿海岛屿，台湾海峡东侧" },

    { id: "inner_mongolia", name: "内蒙古自治区", abbr: "内蒙古", capital: "呼和浩特", category: "自治区", x: 1802, y: 856, note: "我国跨经度最广省级行政区，草原广布" },
    { id: "guangxi", name: "广西壮族自治区", abbr: "桂", capital: "南宁", category: "自治区", x: 1675, y: 1967, note: "华南西部，喀斯特与沿海并存" },
    { id: "tibet", name: "西藏自治区", abbr: "藏", capital: "拉萨", category: "自治区", x: 759, y: 1491, note: "青藏高原主体，世界屋脊" },
    { id: "ningxia", name: "宁夏回族自治区", abbr: "宁", capital: "银川", category: "自治区", x: 1553, y: 1016, note: "黄河中上游，塞上江南" },
    { id: "xinjiang", name: "新疆维吾尔自治区", abbr: "新", capital: "乌鲁木齐", category: "自治区", x: 732, y: 613, note: "西北边陲，面积最大的省级行政区" },

    { id: "hong_kong", name: "香港特别行政区", abbr: "港", capital: "香港", category: "特别行政区", x: 2021, y: 1991, note: "珠江口东侧，国际金融中心" },
    { id: "macau", name: "澳门特别行政区", abbr: "澳", capital: "澳门", category: "特别行政区", x: 1968, y: 2002, note: "珠江口西侧，中西文化交汇" },
  ],
};
